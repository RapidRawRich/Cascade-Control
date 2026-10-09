/**
 * First-Order Plus Dead-Time (FOPDT) and Non-linear Process Dynamics
 * Implements physical thermal processes described in ILM 310305e:
 * 1. Steam Heat Exchanger / Distillation Reboiler (Temp-to-Flow Cascade)
 * 2. Catalyst Regenerator & Furnace (Temp-to-Temp Cascade)
 */

export class FOPDTProcess {
  constructor(options = {}) {
    this.name = options.name || 'Process';
    this.Kp = options.Kp !== undefined ? options.Kp : 1.0; // Process Static Gain
    this.tau = options.tau !== undefined ? options.tau : 5.0; // Time constant (minutes)
    this.deadTime = options.deadTime !== undefined ? options.deadTime : 0.5; // Dead time (minutes)
    this.ambient = options.ambient !== undefined ? options.ambient : 20.0;
    this.pv = options.initialPV !== undefined ? options.initialPV : 100.0;
    this.nominalInput = options.nominalInput !== undefined ? options.nominalInput : 50.0;
    this.nominalOutput = options.nominalOutput !== undefined ? options.nominalOutput : 100.0;
    
    // Circular delay buffer for pure dead time
    this.bufferSize = 2000;
    this.delayBuffer = new Float32Array(this.bufferSize).fill(this.nominalInput);
    this.bufferIndex = 0;
    
    // Non-linear gain exponent (1.0 = linear)
    this.nonLinearity = options.nonLinearity || 1.0;
  }

  /**
   * Step the process forward
   * @param {number} input - Manipulated input (e.g. flow % or furnace heat)
   * @param {number} dtMinutes - Delta time in minutes
   * @param {number} loadDisturbance - External load disturbance (e.g. cold feed surge)
   * @returns {number} pv - Process variable
   */
  step(input, dtMinutes, loadDisturbance = 0.0) {
    // 1. Manage dead-time buffer
    const delaySteps = Math.max(1, Math.min(this.bufferSize - 1, Math.round(this.deadTime / (dtMinutes + 1e-6))));
    
    this.delayBuffer[this.bufferIndex] = input;
    const delayedIndex = (this.bufferIndex - delaySteps + this.bufferSize) % this.bufferSize;
    const delayedInput = this.delayBuffer[delayedIndex];
    this.bufferIndex = (this.bufferIndex + 1) % this.bufferSize;
    
    // 2. Non-linear static transformation if applicable
    let effectiveInput = delayedInput;
    if (this.nonLinearity !== 1.0) {
      const normalized = Math.max(0, delayedInput) / 50.0;
      effectiveInput = 50.0 * Math.pow(normalized, this.nonLinearity);
    }
    
    // 3. Steady state target
    const deltaInput = effectiveInput - this.nominalInput;
    const targetPV = this.nominalOutput + (this.Kp * deltaInput) - loadDisturbance;
    
    // 4. First-order lag differential equation: dPV/dt = (target - PV) / tau
    const alpha = Math.min(1.0, dtMinutes / (this.tau + 1e-5));
    this.pv += alpha * (targetPV - this.pv);
    
    return this.pv;
  }

  reset(initialPV = null) {
    if (initialPV !== null) this.pv = initialPV;
    this.delayBuffer.fill(this.nominalInput);
    this.bufferIndex = 0;
  }
}
