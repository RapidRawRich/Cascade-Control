import { PIDController } from './pid.js';
import { ValveModel } from './valveModel.js';
import { FOPDTProcess } from './processModel.js';

/**
 * Cascade vs Conventional Simulation Engine
 * Synchronously computes real-time dynamic states for:
 * 1. Cascade Scheme: Primary (TIC-101) -> Remote Setpoint -> Secondary (FIC-101) -> Valve -> Steam Flow -> Heat Exchanger Temp
 * 2. Conventional Scheme: Single Primary Controller (TIC-101) -> Valve -> Steam Flow -> Heat Exchanger Temp
 */
export class CascadeSimulationEngine {
  constructor() {
    this.timeMinutes = 0.0;
    this.dtMinutes = 0.005; // 0.3s per simulation step
    this.isRunning = true;
    this.speedMultiplier = 1.0;
    
    // Plant Disturbances
    this.steamPressure = 100.0; // Normal 100%, drops during disturbance
    this.feedFlowDisturbance = 0.0; // Load disturbance on primary variable
    
    // ==========================================
    // CASCADE SYSTEM COMPONENTS
    // ==========================================
    // Primary Controller (TIC-101: Reboiler Temperature)
    this.casPrimaryPID = new PIDController({
      tag: 'TIC-101',
      description: 'Primary Column Temp Controller',
      units: '°C',
      action: 'REVERSE', // Temp high -> drop heat
      sp: 120.0,
      pv: 120.0,
      pvMin: 80.0,
      pvMax: 160.0,
      coMin: 0.0,
      coMax: 100.0,
      Kc: 1.5,
      Ti: 3.5, // 3.5 min
      Td: 0.2,
      mode: 'AUTO'
    });
    
    // Secondary Controller (FIC-101: Steam Flow)
    this.casSecondaryPID = new PIDController({
      tag: 'FIC-101',
      description: 'Secondary Steam Flow Controller',
      units: '%',
      action: 'REVERSE', // Flow low -> open ATO valve (error = SP - PV)
      sp: 50.0,
      rsp: 50.0,
      pv: 50.0,
      pvMin: 0.0,
      pvMax: 120.0,
      coMin: 0.0,
      coMax: 100.0,
      Kc: 2.5,
      Ti: 0.3, // Fast integral or P-only
      Td: 0.0,
      mode: 'CASCADE'
    });
    
    this.casValve = new ValveModel({
      failAction: 'ATO',
      characteristic: 'LINEAR',
      tauActuator: 0.04,
      stictionDeadband: 0.0,
      stictionSlipJump: 0.0
    });
    
    this.casFlowProcess = new FOPDTProcess({
      name: 'Steam Flow Fast Loop',
      Kp: 1.0,
      tau: 0.15, // 9 seconds
      deadTime: 0.02,
      nominalInput: 50.0,
      nominalOutput: 50.0,
      initialPV: 50.0
    });
    
    this.casTempProcess = new FOPDTProcess({
      name: 'Column Temperature Slow Loop',
      Kp: 0.8,
      tau: 4.5, // 4.5 minutes
      deadTime: 0.6, // 36 seconds
      nominalInput: 50.0,
      nominalOutput: 120.0,
      initialPV: 120.0
    });
    
    // ==========================================
    // CONVENTIONAL (NON-CASCADE) SYSTEM
    // ==========================================
    this.convPID = new PIDController({
      tag: 'TIC-101-CONV',
      description: 'Conventional Temp Controller',
      units: '°C',
      action: 'REVERSE',
      sp: 120.0,
      pv: 120.0,
      pvMin: 80.0,
      pvMax: 160.0,
      coMin: 0.0,
      coMax: 100.0,
      Kc: 1.2,
      Ti: 5.0,
      Td: 0.2,
      mode: 'AUTO'
    });
    
    this.convValve = new ValveModel({
      failAction: 'ATO',
      characteristic: 'LINEAR',
      tauActuator: 0.04,
      stictionDeadband: 0.0
    });
    
    this.convFlowProcess = new FOPDTProcess({
      name: 'Conv Flow Loop',
      Kp: 1.0,
      tau: 0.15,
      deadTime: 0.02,
      nominalInput: 50.0,
      nominalOutput: 50.0,
      initialPV: 50.0
    });
    
    this.convTempProcess = new FOPDTProcess({
      name: 'Conv Temp Loop',
      Kp: 0.8,
      tau: 4.5,
      deadTime: 0.6,
      nominalInput: 50.0,
      nominalOutput: 120.0,
      initialPV: 120.0
    });
    
    // Current snapshot history for graphs
    this.history = [];
    this.maxHistory = 1200;
  }

  /**
   * Reset simulation state
   */
  reset() {
    this.timeMinutes = 0.0;
    this.steamPressure = 100.0;
    this.feedFlowDisturbance = 0.0;
    this.history = [];
    
    this.casPrimaryPID.reset();
    this.casSecondaryPID.reset();
    this.casFlowProcess.reset(50.0);
    this.casTempProcess.reset(120.0);
    
    this.convPID.reset();
    this.convFlowProcess.reset(50.0);
    this.convTempProcess.reset(120.0);
  }

  /**
   * Update one simulation frame
   */
  step(substeps = 1) {
    if (!this.isRunning) return this.getSnapshot();

    const dt = this.dtMinutes * this.speedMultiplier;

    for (let i = 0; i < substeps; i++) {
      this.timeMinutes += dt;
      
      // Update valve supply pressure disturbances
      this.casValve.setSupplyPressure(this.steamPressure);
      this.convValve.setSupplyPressure(this.steamPressure);

      // ----------------------------------------
      // 1. CASCADE SYSTEM SIMULATION
      // ----------------------------------------
      // Primary TIC-101 step: takes reboiler temp PV, outputs Remote Setpoint (RSP)
      // External feedback EF from secondary PV for anti-windup (ILM p. 25)
      const casPrimaryCO = this.casPrimaryPID.step(
        this.casTempProcess.pv,
        dt,
        null,
        this.casFlowProcess.pv
      );

      // Secondary FIC-101 step: setpoint is casPrimaryCO (or local SP if in AUTO)
      const casSecondaryCO = this.casSecondaryPID.step(
        this.casFlowProcess.pv,
        dt,
        casPrimaryCO,
        this.casValve.stemPosition
      );

      // Valve receives Secondary CO
      const casFlowSignal = this.casValve.step(casSecondaryCO, dt);
      
      // Steam flow process
      const casSteamFlow = this.casFlowProcess.step(casFlowSignal, dt);
      
      // Reboiler temperature process
      const casTemp = this.casTempProcess.step(casSteamFlow, dt, this.feedFlowDisturbance);

      // ----------------------------------------
      // 2. CONVENTIONAL SYSTEM SIMULATION
      // ----------------------------------------
      // Single TIC-101 output directly drives valve
      const convCO = this.convPID.step(this.convTempProcess.pv, dt);
      const convFlowSignal = this.convValve.step(convCO, dt);
      const convSteamFlow = this.convFlowProcess.step(convFlowSignal, dt);
      const convTemp = this.convTempProcess.step(convSteamFlow, dt, this.feedFlowDisturbance);
    }

    const snapshot = this.getSnapshot();
    this.history.push(snapshot);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    return snapshot;
  }

  getSnapshot() {
    return {
      time: this.timeMinutes,
      steamPressure: this.steamPressure,
      feedDisturbance: this.feedFlowDisturbance,
      
      // Cascade
      casPriSP: this.casPrimaryPID.getActiveSetpoint(),
      casPriPV: this.casTempProcess.pv,
      casPriCO: this.casPrimaryPID.co, // RSP for secondary
      casPriMode: this.casPrimaryPID.mode,
      
      casSecSP: this.casSecondaryPID.getActiveSetpoint(),
      casSecPV: this.casFlowProcess.pv,
      casSecCO: this.casSecondaryPID.co,
      casSecMode: this.casSecondaryPID.mode,
      casValvePos: this.casValve.stemPosition,
      casFlow: this.casFlowProcess.pv,
      
      // Conventional
      convSP: this.convPID.getActiveSetpoint(),
      convPV: this.convTempProcess.pv,
      convCO: this.convPID.co,
      convValvePos: this.convValve.stemPosition,
      convFlow: this.convFlowProcess.pv
    };
  }

  // Preset fault / disturbance triggers
  triggerSteamDrop(magnitude = 30) {
    this.steamPressure = Math.max(10, 100.0 - magnitude);
  }

  restoreSteam() {
    this.steamPressure = 100.0;
  }

  triggerFeedSurge(magnitude = 15) {
    this.feedFlowDisturbance = magnitude;
  }

  clearFeedSurge() {
    this.feedFlowDisturbance = 0.0;
  }

  setStiction(deadband, slipJump = 0) {
    this.casValve.stictionDeadband = deadband;
    this.casValve.stictionSlipJump = slipJump;
    this.convValve.stictionDeadband = deadband;
    this.convValve.stictionSlipJump = slipJump;
  }
}
