/**
 * Industrial PID Controller implementation modeled after ILM 310305e specifications
 * Supports Direct/Reverse action, Modes (Manual, Auto, Cascade),
 * Bumpless Transfer, External Feedback (EF) Anti-Reset Windup, and Derivative on PV.
 */

export class PIDController {
  constructor(options = {}) {
    this.tag = options.tag || 'FIC-101';
    this.description = options.description || 'Controller';
    this.units = options.units || '%';
    
    // Tuning parameters
    this.Kc = options.Kc !== undefined ? options.Kc : 1.0; // Proportional Gain
    this.Ti = options.Ti !== undefined ? options.Ti : 1.0; // Integral Time (minutes)
    this.Td = options.Td !== undefined ? options.Td : 0.0; // Derivative Time (minutes)
    
    // Action: 'REVERSE' (most heating loops, PV up -> CO down) or 'DIRECT' (cooling loops, PV up -> CO up)
    this.action = options.action || 'REVERSE';
    
    // Limits (ILM pg 24: limits typically -3.3% to 103.3%)
    this.coMin = options.coMin !== undefined ? options.coMin : 0.0;
    this.coMax = options.coMax !== undefined ? options.coMax : 100.0;
    this.pvMin = options.pvMin !== undefined ? options.pvMin : 0.0;
    this.pvMax = options.pvMax !== undefined ? options.pvMax : 200.0;
    
    // Mode: 'MANUAL', 'AUTO', 'CASCADE'
    this.mode = options.mode || 'AUTO';
    
    // Internal States
    this.sp = options.sp !== undefined ? options.sp : 50.0;     // Local setpoint
    this.rsp = options.rsp !== undefined ? options.rsp : 50.0;  // Remote setpoint (from master)
    this.pv = options.pv !== undefined ? options.pv : 50.0;     // Process variable
    this.co = options.co !== undefined ? options.co : 50.0;     // Controller output (%)
    this.manualCO = options.manualCO !== undefined ? options.manualCO : 50.0;
    
    this.integral = 0.0;        // Accumulated integral term
    this.bias = 50.0;           // Nominal bias
    this.lastPV = this.pv;
    this.lastError = 0.0;
    this.externalFeedback = 50.0; // EF signal for anti-reset windup
    this.useExternalFeedback = options.useExternalFeedback !== false;
    this.spTracking = true;     // SP tracks PV in manual
    
    // Anti-windup clamping flag
    this.saturated = false;
  }

  setMode(newMode) {
    if (this.mode === newMode) return;
    
    const prevMode = this.mode;
    this.mode = newMode;
    
    // Bumpless transfer logic (ILM Objective Two)
    if (newMode === 'AUTO') {
      if (prevMode === 'MANUAL') {
        // Track SP to PV or initialize integral to current manual output
        if (this.spTracking) {
          this.sp = this.pv;
        }
        // Initialize integral so CO starts exactly at current CO
        this.integral = 0;
        this.bias = this.co;
      }
    } else if (newMode === 'CASCADE') {
      if (prevMode === 'MANUAL' || prevMode === 'AUTO') {
        // Transfer to cascade: RSP should match current SP or PV
        this.integral = 0;
        this.bias = this.co;
      }
    } else if (newMode === 'MANUAL') {
      this.manualCO = this.co;
    }
  }

  getActiveSetpoint() {
    return this.mode === 'CASCADE' ? this.rsp : this.sp;
  }

  /**
   * Execute one simulation time-step
   * @param {number} pv - Process variable in engineering units
   * @param {number} dtMinutes - Delta time in minutes (e.g. 0.01 min = 0.6s)
   * @param {number} rsp - Remote setpoint input (from primary controller)
   * @param {number} ef - External feedback signal for anti-windup (e.g. secondary PV or valve pos)
   * @returns {number} Controller output (CO) in % (0 - 100)
   */
  step(pv, dtMinutes, rsp = null, ef = null) {
    this.pv = pv;
    if (rsp !== null) {
      this.rsp = rsp;
    }
    if (ef !== null) {
      this.externalFeedback = ef;
    }
    
    const activeSP = this.getActiveSetpoint();
    
    if (this.mode === 'MANUAL') {
      if (this.spTracking) {
        this.sp = pv;
      }
      this.co = Math.max(this.coMin, Math.min(this.coMax, this.manualCO));
      this.lastPV = pv;
      return this.co;
    }
    
    // Calculate Error
    // Direct Acting: error = PV - SP (PV > SP -> increase CO)
    // Reverse Acting: error = SP - PV (SP > PV -> increase CO, e.g. heating)
    let error = (this.action === 'DIRECT') ? (pv - activeSP) : (activeSP - pv);
    
    // Normalize error to % span of PV
    const pvSpan = (this.pvMax - this.pvMin) || 100;
    const errorPct = (error / pvSpan) * 100;
    
    // Proportional term
    const pTerm = this.Kc * errorPct;
    
    // Integral term with Anti-Reset Windup (ILM p. 24-25)
    let iRate = 0;
    if (this.Ti > 0.001) {
      iRate = (this.Kc / this.Ti) * errorPct; // % per minute
    }
    
    // Anti-reset windup via External Feedback or Output Clamping
    let allowIntegration = true;
    if (this.useExternalFeedback && this.mode === 'CASCADE') {
      // In cascade mode with EF: integral tracks external feedback to prevent windup
      // Bias relaxes toward EF - pTerm
      const targetBias = this.externalFeedback - pTerm;
      const biasError = targetBias - this.bias;
      this.bias += biasError * Math.min(1.0, dtMinutes / (this.Ti || 1.0));
      this.integral = 0;
    } else {
      // Standard Anti-windup Clamping:
      // Stop integrating if saturated in direction that would drive deeper into saturation
      if (this.saturated) {
        if ((this.co >= this.coMax && iRate > 0) || (this.co <= this.coMin && iRate < 0)) {
          allowIntegration = false;
        }
      }
      if (allowIntegration) {
        this.integral += iRate * dtMinutes;
      }
    }
    
    // Derivative on PV (to avoid derivative kick on setpoint change, ILM p. 30)
    let dTerm = 0;
    if (this.Td > 0.0001 && dtMinutes > 0) {
      const dPV = (pv - this.lastPV) / pvSpan * 100;
      // Derivative sign depends on action
      const sign = (this.action === 'DIRECT') ? 1 : -1;
      dTerm = -sign * this.Kc * this.Td * (dPV / dtMinutes);
    }
    this.lastPV = pv;
    
    // Total Controller Output
    let rawCO = this.bias + pTerm + this.integral + dTerm;
    
    // Clamp to output limits
    if (rawCO > this.coMax) {
      this.co = this.coMax;
      this.saturated = true;
    } else if (rawCO < this.coMin) {
      this.co = this.coMin;
      this.saturated = true;
    } else {
      this.co = rawCO;
      this.saturated = false;
    }
    
    return this.co;
  }

  reset() {
    this.integral = 0;
    this.co = this.bias;
    this.saturated = false;
    this.lastPV = this.pv;
  }
}
