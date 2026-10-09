/**
 * Control Valve & Actuator Model
 * Includes:
 * - Pneumatic Actuator dynamics
 * - Fail Action: Air-to-Open (ATO, Fail Closed) vs Air-to-Close (ATC, Fail Open)
 * - Packing Stiction (Stick-Slip hysteresis model per Chau et al. / ISA standards)
 * - Installed Flow Characteristics (Linear, Equal Percentage, Quick Opening)
 * - Multipoint Characterizer f(x)
 * - Steam / Supply Header Pressure load disturbance
 */

export class ValveModel {
  constructor(options = {}) {
    this.failAction = options.failAction || 'ATO'; // 'ATO' (Air-to-Open, Fail Closed) or 'ATC' (Air-to-Close, Fail Open)
    this.characteristic = options.characteristic || 'LINEAR'; // 'LINEAR', 'EQUAL_PCT', 'QUICK_OPEN'
    
    // Stiction parameters
    this.stictionDeadband = options.stictionDeadband || 0.0; // % deadband (0 = no stiction, 5 = moderate, 15 = severe)
    this.stictionSlipJump = options.stictionSlipJump || 0.0; // % slip jump
    
    // Actuator dynamics
    this.tauActuator = options.tauActuator || 0.05; // minutes (~3 seconds)
    this.stemPosition = 50.0; // Actual stem position % (0 - 100)
    this.apparentSignal = 50.0;
    
    // Supply pressure (normal = 100%)
    this.supplyPressure = 100.0; // %
    
    // Flow output
    this.actualFlow = 50.0; // % of max flow
    
    // Characterizer enabled
    this.useCharacterizer = false;
  }

  /**
   * Characterize signal if f(x) is enabled
   */
  characterize(inputSignal) {
    if (!this.useCharacterizer) return inputSignal;
    // Inverse equal-percentage to linearize installed loop
    const s = Math.max(0, Math.min(100, inputSignal)) / 100;
    const R = 50;
    // Linearization formula
    const linearized = (Math.log(1 + (R - 1) * s) / Math.log(R)) * 100;
    return linearized;
  }

  /**
   * Step the valve actuator and calculate stem position & flow
   * @param {number} controllerOutput - Signal from controller (0 - 100%)
   * @param {number} dtMinutes - Delta time in minutes
   * @returns {number} actualFlow - Flow through valve in %
   */
  step(controllerOutput, dtMinutes) {
    // 1. Process characterizer if enabled
    const conditionedSignal = this.characterize(controllerOutput);
    
    // 2. Map signal based on fail mode
    // ATO: 0% signal = 0% stroke (Fail Closed)
    // ATC: 0% signal = 100% stroke (Fail Open)
    let targetStroke = (this.failAction === 'ATO') ? conditionedSignal : (100.0 - conditionedSignal);
    targetStroke = Math.max(0, Math.min(100, targetStroke));
    
    // 3. Apply Stiction (Stick-Slip model)
    if (this.stictionDeadband > 0.01) {
      const diff = targetStroke - this.stemPosition;
      if (Math.abs(diff) > this.stictionDeadband) {
        // Overcame static friction: slips forward by difference plus slip jump
        const dir = Math.sign(diff);
        const slip = Math.min(Math.abs(diff), this.stictionDeadband + this.stictionSlipJump);
        this.stemPosition += dir * slip;
      }
      // Otherwise stem remains stuck
    } else {
      // Smooth first-order actuator lag without stiction
      const alpha = Math.min(1.0, dtMinutes / (this.tauActuator + 1e-5));
      this.stemPosition += alpha * (targetStroke - this.stemPosition);
    }
    
    this.stemPosition = Math.max(0, Math.min(100, this.stemPosition));
    
    // 4. Calculate Flow based on Installed Inherent Characteristic
    const x = this.stemPosition / 100.0;
    let inherentCv = x; // Linear default
    
    if (this.characteristic === 'EQUAL_PCT') {
      const R = 50.0; // Rangeability
      inherentCv = (Math.pow(R, x - 1) - (1 / R)) / (1 - (1 / R));
    } else if (this.characteristic === 'QUICK_OPEN') {
      inherentCv = Math.sqrt(Math.max(0, x));
    }
    
    // 5. Apply Steam / Line Pressure disturbance
    // Flow Q = Cv * sqrt(deltaP)
    const pressureFactor = Math.sqrt(Math.max(0, this.supplyPressure / 100.0));
    this.actualFlow = Math.max(0, Math.min(150, inherentCv * 100.0 * pressureFactor));
    
    return this.actualFlow;
  }

  setSupplyPressure(pct) {
    this.supplyPressure = Math.max(10, Math.min(150, pct));
  }
}
