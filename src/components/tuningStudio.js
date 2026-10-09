import { renderFormula } from './mathRenderer.js';

/**
 * Objective 4: Cascade Control System Tuning & Diagnostic Lab
 * Features:
 * - Inside-Out Tuning Workflow guide
 * - Interactive Ziegler-Nichols & IMC tuning calculators
 * - Quarter Amplitude Decay (DR = 0.25) visualizer
 * - Real-Time Instability Diagnostic Challenge (Fig 29 vs Fig 30)
 */
export class TuningStudio {
  constructor(containerElement, onInjectFault) {
    this.container = containerElement;
    this.onInjectFault = onInjectFault;

    // IMC Calculator inputs (ILM page 43)
    this.imcTauP = 2.7; // min
    this.imcTauD = 2.3; // dead time min
    this.imcKp = 1.0;   // static gain

    // Diagnostic Challenge state
    this.currentCase = 'NORMAL';
    this.score = 0;
    this.attempts = 0;

    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="studio-container">
        <div class="studio-header">
          <h3>Objective Four: Tuning Methods, Non-Linearity & Fault Diagnostics</h3>
          <p class="studio-subtext">
            Master the inside-out tuning sequence, calculate controller settings via Ziegler-Nichols & IMC, and diagnose loop instability from industrial chart recordings.
          </p>
        </div>

        <!-- 1. The Inside-Out Tuning Sequence -->
        <div class="card workflow-card">
          <h4>1. Industrial Inside-Out Tuning Workflow (ILM p. 31, 57)</h4>
          <div class="steps-container">
            <div class="step-card">
              <div class="step-num">Step 1</div>
              <div class="step-title">Isolate Outer Loop</div>
              <div class="step-desc">Place primary controller (TIC-101) in <strong>Manual</strong> mode.</div>
            </div>
            <div class="step-card">
              <div class="step-num">Step 2</div>
              <div class="step-title">Tune Inner Controller</div>
              <div class="step-desc">Adjust secondary (FIC-101) to achieve <strong>Quarter Amplitude Decay (DR = 0.25)</strong> for setpoint changes. P-only is preferred.</div>
            </div>
            <div class="step-card">
              <div class="step-num">Step 3</div>
              <div class="step-title">Engage Cascade Mode</div>
              <div class="step-desc">Switch secondary controller to <strong>Cascade (Remote Setpoint RSP)</strong>.</div>
            </div>
            <div class="step-card">
              <div class="step-num">Step 4</div>
              <div class="step-title">Tune Outer Controller</div>
              <div class="step-desc">Tune primary controller with inner loop in automatic. Set T_i ≈ 3 × τ_eff or apply IMC/Z-N.</div>
            </div>
          </div>
        </div>

        <div class="studio-grid">
          <!-- 2. IMC & Ziegler-Nichols Calculator -->
          <div class="card math-card">
            <h4>2. IMC Tuning Parameter Calculator (ILM p. 43)</h4>
            <div id="formula-imc-box" class="math-display"></div>

            <div class="calc-inputs">
              <div class="param-row">
                <label>Primary Time Constant (τ_p):</label>
                <div class="slider-box">
                  <input type="range" id="imc-tau-p" min="0.5" max="10.0" step="0.1" value="${this.imcTauP}">
                  <span class="readout" id="imc-tau-p-val">${this.imcTauP.toFixed(1)} min</span>
                </div>
              </div>

              <div class="param-row">
                <label>Process Dead Time (τ_d):</label>
                <div class="slider-box">
                  <input type="range" id="imc-tau-d" min="0.2" max="6.0" step="0.1" value="${this.imcTauD}">
                  <span class="readout" id="imc-tau-d-val">${this.imcTauD.toFixed(1)} min</span>
                </div>
              </div>

              <div class="param-row">
                <label>Process Static Gain (K_p):</label>
                <div class="slider-box">
                  <input type="range" id="imc-kp" min="0.2" max="3.0" step="0.1" value="${this.imcKp}">
                  <span class="readout" id="imc-kp-val">${this.imcKp.toFixed(1)}</span>
                </div>
              </div>
            </div>

            <div id="formula-imc-result" class="math-calc-display"></div>

            <div class="kpi-grid">
              <div class="kpi-box highlight">
                <span class="kpi-label">Recommended Gain (K_c)</span>
                <span class="kpi-val" id="kpi-imc-kc">0.70</span>
              </div>
              <div class="kpi-box success">
                <span class="kpi-label">Integral Time (T_i)</span>
                <span class="kpi-val" id="kpi-imc-ti">2.70 min</span>
              </div>
            </div>
          </div>

          <!-- 3. Quarter Amplitude Decay Visualizer -->
          <div class="card plot-card">
            <h4>3. Quarter Amplitude Decay (DR = A2 / A1 = 0.25)</h4>
            <div id="formula-decay-box" class="math-display"></div>
            <canvas id="decay-canvas" height="180"></canvas>
            <div class="ilm-rule-alert">
              <strong>Tuning Objective (p. 31):</strong> Secondary controller should be tuned for 1/4 decay ratio. Fast response dampens disturbances with minimal overshoot.
            </div>
          </div>
        </div>

        <!-- 4. Interactive Fault Diagnostic Challenge -->
        <div class="card diagnostic-card">
          <div class="diag-header">
            <h4>4. Industrial Instability Diagnostic Simulator (ILM Fig 29 vs 30)</h4>
            <div class="score-badge">Score: <span id="diag-score">0</span> / <span id="diag-attempts">0</span></div>
          </div>
          <p class="diag-intro">
            Simulate an upset, observe the chart behavior, and diagnose which loop is improperly tuned!
          </p>

          <div class="diag-buttons">
            <button class="btn-action" id="btn-test-normal">Run Normal Loop</button>
            <button class="btn-action warn" id="btn-test-inner-unstable">Simulate Problem A (Fig 29)</button>
            <button class="btn-action danger" id="btn-test-outer-unstable">Simulate Problem B (Fig 30)</button>
          </div>

          <div class="diag-question-box" id="diag-box" style="display: none;">
            <div class="diag-prompt">
              <strong>Diagnostic Inspection:</strong> Examine the live strip chart recording above. What is the root cause?
            </div>
            <div class="diag-options">
              <button class="btn-diag-option" data-ans="INNER">Inner (Secondary) Loop Unstable</button>
              <button class="btn-diag-option" data-ans="OUTER">Outer (Primary) Loop Unstable</button>
              <button class="btn-diag-option" data-ans="NORMAL">Both Loops Operating Stably</button>
            </div>
            <div class="diag-feedback" id="diag-feedback"></div>
          </div>
        </div>
      </div>
    `;

    this.renderFormulas();
    this.attachEvents();
    this.drawDecayCurve();
    this.updateIMCResults();
  }

  renderFormulas() {
    renderFormula(
      'formula-imc-box',
      `K_c = \\frac{0.6 \\cdot \\tau_p}{K_p \\cdot \\tau_d}, \\quad T_i = \\tau_p`
    );
    renderFormula(
      'formula-decay-box',
      `\\text{Decay Ratio (DR)} = \\frac{A_2}{A_1} = 0.25 = \\frac{1}{4}`
    );
  }

  updateIMCResults() {
    const denom = this.imcKp * this.imcTauD;
    const kc = denom > 0 ? (0.6 * this.imcTauP) / denom : 0.0;
    const ti = this.imcTauP;

    renderFormula(
      'formula-imc-result',
      `K_c = \\frac{0.6(${this.imcTauP.toFixed(1)})}{${this.imcKp.toFixed(1)}(${this.imcTauD.toFixed(1)})} = \\mathbf{${kc.toFixed(2)}}, \\quad T_i = \\mathbf{${ti.toFixed(2)}\\text{ min}}`
    );

    const kpiKc = document.getElementById('kpi-imc-kc');
    const kpiTi = document.getElementById('kpi-imc-ti');
    if (kpiKc) kpiKc.textContent = kc.toFixed(2);
    if (kpiTi) kpiTi.textContent = `${ti.toFixed(2)} min`;
  }

  attachEvents() {
    const bind = (id, prop, cb) => {
      const el = document.getElementById(id);
      const valEl = document.getElementById(`${id}-val`);
      if (!el) return;
      el.addEventListener('input', (e) => {
        const v = parseFloat(e.target.value);
        this[prop] = v;
        if (valEl) valEl.textContent = prop.includes('Tau') ? `${v.toFixed(1)} min` : v.toFixed(1);
        this.updateIMCResults();
      });
    };

    bind('imc-tau-p', 'imcTauP');
    bind('imc-tau-d', 'imcTauD');
    bind('imc-kp', 'imcKp');

    // Diagnostic challenge buttons
    const diagBox = document.getElementById('diag-box');
    const feedback = document.getElementById('diag-feedback');

    document.getElementById('btn-test-normal')?.addEventListener('click', () => {
      this.currentCase = 'NORMAL';
      if (this.onInjectFault) this.onInjectFault('NORMAL');
      if (diagBox) diagBox.style.display = 'block';
      if (feedback) feedback.innerHTML = '';
    });

    document.getElementById('btn-test-inner-unstable')?.addEventListener('click', () => {
      this.currentCase = 'INNER';
      if (this.onInjectFault) this.onInjectFault('INNER_UNSTABLE');
      if (diagBox) diagBox.style.display = 'block';
      if (feedback) feedback.innerHTML = '';
    });

    document.getElementById('btn-test-outer-unstable')?.addEventListener('click', () => {
      this.currentCase = 'OUTER';
      if (this.onInjectFault) this.onInjectFault('OUTER_UNSTABLE');
      if (diagBox) diagBox.style.display = 'block';
      if (feedback) feedback.innerHTML = '';
    });

    // Option evaluation
    const opts = this.container.querySelectorAll('.btn-diag-option');
    opts.forEach(opt => {
      opt.addEventListener('click', () => {
        const selected = opt.dataset.ans;
        this.attempts++;
        if (selected === this.currentCase) {
          this.score++;
          feedback.innerHTML = `
            <div class="feedback-correct">
              ✓ Correct! <strong>${this.getDiagnosticExplanation(this.currentCase)}</strong>
            </div>
          `;
        } else {
          feedback.innerHTML = `
            <div class="feedback-wrong">
              ✗ Incorrect. <strong>${this.getDiagnosticExplanation(this.currentCase)}</strong>
            </div>
          `;
        }
        document.getElementById('diag-score').textContent = this.score;
        document.getElementById('diag-attempts').textContent = this.attempts;
      });
    });
  }

  getDiagnosticExplanation(caseType) {
    if (caseType === 'INNER') {
      return "Figure 29 Diagnosis: The secondary loop (FIC-101) is cycling rapidly with high frequency on the valve stem, but the primary temperature (TIC-101) remains steady because the slow primary process filters out the high frequency. This causes severe valve wear and must be fixed by lowering inner loop gain!";
    } else if (caseType === 'OUTER') {
      return "Figure 30 Diagnosis: The primary loop (TIC-101) has an increasing oscillatory response that causes the entire system to become unstable. The secondary controller merely amplifies the outer loop's rolling wave. Detune the primary controller!";
    }
    return "Normal Operation: Both loops are well damped with quarter amplitude decay and steady-state stability.";
  }

  drawDecayCurve() {
    const canvas = document.getElementById('decay-canvas');
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
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    const padL = 40;
    const padR = 20;
    const padT = 20;
    const padB = 30;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(padL, padT, plotW, plotH);

    // Center baseline
    const yCenter = padT + plotH * 0.55;
    ctx.strokeStyle = '#475569';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(padL, yCenter);
    ctx.lineTo(padL + plotW, yCenter);
    ctx.stroke();
    ctx.setLineDash([]);

    // Damped oscillation wave: y(t) = exp(-zeta * omega * t) * cos(omega * t)
    // Quarter decay means after 1 period (2*pi): exp(-zeta * omega * T) = 0.5 (amplitude drops to 0.25 for peak 2)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    const maxT = 4.0 * Math.PI;
    const decayRate = Math.log(4) / (2.0 * Math.PI); // Decay factor = 0.25 per period

    for (let px = 0; px <= plotW; px++) {
      const t = (px / plotW) * maxT;
      const amp = Math.exp(-decayRate * t);
      const y = amp * Math.cos(t);
      const yPos = yCenter - y * (plotH * 0.42);
      if (px === 0) ctx.moveTo(padL + px, yPos);
      else ctx.lineTo(padL + px, yPos);
    }
    ctx.stroke();

    // Peak markers A1 and A2
    // First peak at t = 0
    const a1Y = yCenter - (plotH * 0.42);
    // Second peak at t = 2*pi
    const a2X = padL + (2.0 * Math.PI / maxT) * plotW;
    const a2Y = yCenter - 0.25 * (plotH * 0.42);

    ctx.fillStyle = '#f59e0b';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillText('Peak A1 (100%)', padL + 10, a1Y - 4);
    ctx.fillText('Peak A2 (25%)', a2X - 30, a2Y - 6);

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(padL, a1Y, 4, 0, Math.PI * 2);
    ctx.arc(a2X, a2Y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}
