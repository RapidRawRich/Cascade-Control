import { renderFormula } from './mathRenderer.js';

/**
 * Objective 3: Response Speed & Loop Dynamics Studio
 * Explores:
 * - Effective Time Constant Reduction: tau_eff = tau / (1 + Kc * Kp)
 * - Closed Loop Time Constant (CLTC) vs Open Loop
 * - Inner-to-Outer Speed Ratio Requirement (3x rule)
 * - 19 min vs 31 min Catalyst Regenerator case study
 */
export class SpeedStudio {
  constructor(containerElement) {
    this.container = containerElement;
    
    // Default values from ILM page 28-29
    this.tauP = 8.8; // Open loop time constant (minutes)
    this.Kp = 1.7;   // Process static gain
    this.Kc = 2.0;   // Controller proportional gain
    this.tauOuter = 26.4; // Outer loop time constant

    this.render();
  }

  calculateEffectiveTau() {
    const denominator = 1.0 + Math.abs(this.Kc * this.Kp);
    return this.tauP / denominator;
  }

  render() {
    const tauEff = this.calculateEffectiveTau();
    const speedRatio = this.tauOuter / tauEff;

    this.container.innerHTML = `
      <div class="studio-container">
        <div class="studio-header">
          <h3>Objective Three: Response Speed & Time Constant Reduction</h3>
          <p class="studio-subtext">
            Discover mathematically and graphically how closing the inner loop in automatic control dramatically shrinks its effective time constant, accelerating the entire process.
          </p>
        </div>

        <div class="studio-grid">
          <!-- Interactive Parameters Card -->
          <div class="card control-card">
            <h4>1. Adjust Inner Loop Parameters</h4>
            <div class="param-row">
              <label>Secondary Open-Loop Time Constant (τ_p):</label>
              <div class="slider-box">
                <input type="range" id="speed-tau-p" min="1.0" max="20.0" step="0.2" value="${this.tauP}">
                <span class="readout" id="speed-tau-p-val">${this.tauP.toFixed(1)} min</span>
              </div>
            </div>

            <div class="param-row">
              <label>Secondary Process Static Gain (K_p):</label>
              <div class="slider-box">
                <input type="range" id="speed-kp" min="0.5" max="5.0" step="0.1" value="${this.Kp}">
                <span class="readout" id="speed-kp-val">${this.Kp.toFixed(1)}</span>
              </div>
            </div>

            <div class="param-row">
              <label>Secondary Controller Proportional Gain (K_c):</label>
              <div class="slider-box">
                <input type="range" id="speed-kc" min="0.1" max="10.0" step="0.1" value="${this.Kc}">
                <span class="readout" id="speed-kc-val">${this.Kc.toFixed(1)}</span>
              </div>
            </div>

            <div class="param-row">
              <label>Outer (Primary) Loop Time Constant (τ_outer):</label>
              <div class="slider-box">
                <input type="range" id="speed-tau-outer" min="5.0" max="50.0" step="1.0" value="${this.tauOuter}">
                <span class="readout" id="speed-tau-outer-val">${this.tauOuter.toFixed(1)} min</span>
              </div>
            </div>

            <!-- ILM Case Study Presets -->
            <div class="preset-box">
              <span class="preset-label">ILM 310305e Case Studies:</span>
              <div class="preset-buttons">
                <button class="btn-preset" id="preset-furnace">Catalyst Furnace (p. 28)</button>
                <button class="btn-preset" id="preset-reboiler">Steam Reboiler (p. 10)</button>
                <button class="btn-preset" id="preset-fast-inner">Fast Inner Loop (10x)</button>
              </div>
            </div>
          </div>

          <!-- Mathematical Derivation Card -->
          <div class="card math-card">
            <h4>2. Closed-Loop Time Constant Derivation</h4>
            <div id="formula-cltc-box" class="math-display"></div>
            <div id="formula-cltc-calc" class="math-calc-display"></div>

            <div class="kpi-grid">
              <div class="kpi-box highlight">
                <span class="kpi-label">Effective Time Constant (τ_eff)</span>
                <span class="kpi-val" id="kpi-tau-eff">${tauEff.toFixed(2)} min</span>
                <span class="kpi-sub" id="kpi-reduction-pct">${(((this.tauP - tauEff) / this.tauP) * 100).toFixed(0)}% Speedup</span>
              </div>

              <div class="kpi-box ${speedRatio >= 3.0 ? 'success' : 'warning'}">
                <span class="kpi-label">Speed Ratio (τ_outer / τ_eff)</span>
                <span class="kpi-val" id="kpi-speed-ratio">${speedRatio.toFixed(1)} : 1</span>
                <span class="kpi-sub" id="kpi-ratio-status">${speedRatio >= 3.0 ? 'Rule Met (≥ 3:1)' : 'Too Slow (< 3:1)'}</span>
              </div>
            </div>

            <div class="ilm-rule-alert">
              <strong>ILM Rule of Thumb (p. 9-10):</strong> The secondary loop must be at least <strong>3 to 5 times faster</strong> than the outer loop. This ensures the inner loop dampens load disturbances before the primary controlled variable is disturbed.
            </div>
          </div>
        </div>

        <!-- Dynamic Response Curve Comparison Plot -->
        <div class="card plot-card">
          <h4>3. Real-Time Dynamic Response Curve Comparison</h4>
          <canvas id="speed-canvas" height="260"></canvas>
          <div class="plot-legend">
            <span class="leg-item"><span class="dot open-dot"></span> Open-Loop Response ($\tau_p = ${this.tauP.toFixed(1)} min)</span>
            <span class="leg-item"><span class="dot closed-dot"></span> Cascade Inner Loop Response ($\tau_{eff} = ${tauEff.toFixed(2)} min)</span>
            <span class="leg-item"><span class="dot target-dot"></span> Setpoint Step Target</span>
          </div>
        </div>
      </div>
    `;

    this.renderFormulas();
    this.attachEvents();
    this.drawResponseCurves();
  }

  renderFormulas() {
    renderFormula(
      'formula-cltc-box',
      `\\tau_{eff} = \\text{CLTC} = \\frac{\\tau_p}{1 + |K_c K_p|}`
    );
    this.updateCalculatedFormula();
  }

  updateCalculatedFormula() {
    const tauEff = this.calculateEffectiveTau();
    const product = (this.Kc * this.Kp).toFixed(2);
    const denom = (1.0 + Math.abs(this.Kc * this.Kp)).toFixed(2);

    renderFormula(
      'formula-cltc-calc',
      `\\tau_{eff} = \\frac{${this.tauP.toFixed(1)}\\text{ min}}{1 + (${this.Kc.toFixed(1)} \\times ${this.Kp.toFixed(1)})} = \\frac{${this.tauP.toFixed(1)}}{${denom}} = \\mathbf{${tauEff.toFixed(2)}\\text{ min}}`
    );
  }

  attachEvents() {
    const bindSlider = (id, prop, cb) => {
      const el = document.getElementById(id);
      const valEl = document.getElementById(`${id}-val`);
      if (!el) return;
      el.addEventListener('input', (e) => {
        const v = parseFloat(e.target.value);
        this[prop] = v;
        if (valEl) valEl.textContent = prop.includes('tau') ? `${v.toFixed(1)} min` : v.toFixed(1);
        this.updateView();
        if (cb) cb();
      });
    };

    bindSlider('speed-tau-p', 'tauP');
    bindSlider('speed-kp', 'Kp');
    bindSlider('speed-kc', 'Kc');
    bindSlider('speed-tau-outer', 'tauOuter');

    // Presets
    document.getElementById('preset-furnace')?.addEventListener('click', () => {
      this.tauP = 8.8;
      this.Kp = 1.7;
      this.Kc = 2.0;
      this.tauOuter = 26.4;
      this.syncInputs();
    });

    document.getElementById('preset-reboiler')?.addEventListener('click', () => {
      this.tauP = 0.5;
      this.Kp = 1.0;
      this.Kc = 2.5;
      this.tauOuter = 4.5;
      this.syncInputs();
    });

    document.getElementById('preset-fast-inner')?.addEventListener('click', () => {
      this.tauP = 1.2;
      this.Kp = 1.0;
      this.Kc = 4.0;
      this.tauOuter = 15.0;
      this.syncInputs();
    });
  }

  syncInputs() {
    const setVal = (id, val, unit = '') => {
      const el = document.getElementById(id);
      const valEl = document.getElementById(`${id}-val`);
      if (el) el.value = val;
      if (valEl) valEl.textContent = `${val.toFixed(1)}${unit}`;
    };
    setVal('speed-tau-p', this.tauP, ' min');
    setVal('speed-kp', this.Kp);
    setVal('speed-kc', this.Kc);
    setVal('speed-tau-outer', this.tauOuter, ' min');
    this.updateView();
  }

  updateView() {
    const tauEff = this.calculateEffectiveTau();
    const speedRatio = this.tauOuter / tauEff;

    const kpiTau = document.getElementById('kpi-tau-eff');
    if (kpiTau) kpiTau.textContent = `${tauEff.toFixed(2)} min`;

    const kpiRed = document.getElementById('kpi-reduction-pct');
    if (kpiRed) kpiRed.textContent = `${(((this.tauP - tauEff) / this.tauP) * 100).toFixed(0)}% Speedup`;

    const kpiRatio = document.getElementById('kpi-speed-ratio');
    if (kpiRatio) kpiRatio.textContent = `${speedRatio.toFixed(1)} : 1`;

    const kpiStatus = document.getElementById('kpi-ratio-status');
    if (kpiStatus) {
      kpiStatus.textContent = speedRatio >= 3.0 ? 'Rule Met (≥ 3:1)' : 'Too Slow (< 3:1)';
      const kpiBox = kpiRatio.closest('.kpi-box');
      if (kpiBox) {
        kpiBox.className = `kpi-box ${speedRatio >= 3.0 ? 'success' : 'warning'}`;
      }
    }

    this.updateCalculatedFormula();
    this.drawResponseCurves();
  }

  drawResponseCurves() {
    const canvas = document.getElementById('speed-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.resetTransform();
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padL = 50;
    const padR = 20;
    const padT = 20;
    const padB = 30;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(padL, padT, plotW, plotH);

    // Grid & labels
    ctx.strokeStyle = '#334155';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';

    // Y-axis (0% to 100% step response)
    for (let i = 0; i <= 4; i++) {
      const frac = i / 4;
      const yPos = padT + plotH - frac * plotH;
      ctx.beginPath();
      ctx.moveTo(padL, yPos);
      ctx.lineTo(padL + plotW, yPos);
      ctx.stroke();
      ctx.fillText(`${(frac * 100).toFixed(0)}%`, padL - 6, yPos + 3);
    }

    // X-axis (0 to 30 min)
    const maxT = Math.max(10, this.tauP * 3.5);
    ctx.textAlign = 'center';
    for (let i = 0; i <= 6; i++) {
      const frac = i / 6;
      const xPos = padL + frac * plotW;
      const tVal = frac * maxT;
      ctx.beginPath();
      ctx.moveTo(xPos, padT);
      ctx.lineTo(xPos, padT + plotH);
      ctx.stroke();
      ctx.fillText(`${tVal.toFixed(1)}m`, xPos, padT + plotH + 14);
    }

    // Target step line (at 100%)
    ctx.strokeStyle = '#64748b';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL + plotW, padT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Curve 1: Open Loop Response: y(t) = 1 - exp(-t / tauP)
    ctx.strokeStyle = '#f43f5e'; // Rose
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let px = 0; px <= plotW; px++) {
      const t = (px / plotW) * maxT;
      const y = 1.0 - Math.exp(-t / this.tauP);
      const yPos = padT + plotH - y * plotH;
      if (px === 0) ctx.moveTo(padL + px, yPos);
      else ctx.lineTo(padL + px, yPos);
    }
    ctx.stroke();

    // Curve 2: Closed Loop Response: y(t) = 1 - exp(-t / tauEff)
    const tauEff = this.calculateEffectiveTau();
    ctx.strokeStyle = '#06b6d4'; // Cyan
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let px = 0; px <= plotW; px++) {
      const t = (px / plotW) * maxT;
      const y = 1.0 - Math.exp(-t / tauEff);
      const yPos = padT + plotH - y * plotH;
      if (px === 0) ctx.moveTo(padL + px, yPos);
      else ctx.lineTo(padL + px, yPos);
    }
    ctx.stroke();

    // 63.2% benchmark line (definition of time constant)
    const y63 = padT + plotH - 0.632 * plotH;
    ctx.strokeStyle = '#eab308';
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    ctx.moveTo(padL, y63);
    ctx.lineTo(padL + plotW, y63);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#eab308';
    ctx.fillText('63.2% (1τ)', padL + 35, y63 - 4);
  }
}
