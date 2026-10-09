/**
 * Industrial DCS Controller Faceplate
 * Emulates modern distributed control system (Emerson DeltaV / Honeywell Experion / Yokogawa CS3000)
 * Provides authentic instrument technician interface for TIC-101 and FIC-101
 */

export class PIDFaceplate {
  constructor(containerElement, pidController, onModeChange, onSPChange, onCOChange) {
    this.container = containerElement;
    this.pid = pidController;
    this.onModeChange = onModeChange;
    this.onSPChange = onSPChange;
    this.onCOChange = onCOChange;

    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="faceplate-card" id="fp-${this.pid.tag}">
        <div class="fp-header">
          <div class="fp-tag">${this.pid.tag}</div>
          <div class="fp-desc">${this.pid.description}</div>
          <div class="fp-action-badge ${this.pid.action.toLowerCase()}">${this.pid.action}</div>
        </div>

        <div class="fp-meters">
          <!-- PV Meter -->
          <div class="fp-meter-col">
            <div class="meter-bar-track">
              <div class="meter-bar-fill pv-fill" id="fill-pv-${this.pid.tag}"></div>
              <div class="meter-sp-marker" id="marker-sp-${this.pid.tag}"></div>
            </div>
            <div class="meter-label">PV</div>
            <div class="meter-val" id="val-pv-${this.pid.tag}">0.0</div>
            <div class="meter-unit">${this.pid.units}</div>
          </div>

          <!-- SP Readout & Controls -->
          <div class="fp-center-controls">
            <div class="sp-box">
              <span class="sp-label">SETPOINT</span>
              <div class="sp-readout" id="val-sp-${this.pid.tag}">0.0</div>
              <div class="sp-buttons">
                <button class="sp-btn" data-delta="-5">-5</button>
                <button class="sp-btn" data-delta="-1">-1</button>
                <button class="sp-btn" data-delta="1">+1</button>
                <button class="sp-btn" data-delta="5">+5</button>
              </div>
            </div>

            <!-- Mode Selector -->
            <div class="mode-selector">
              <button class="mode-btn ${this.pid.mode === 'MANUAL' ? 'active' : ''}" data-mode="MANUAL">MAN</button>
              <button class="mode-btn ${this.pid.mode === 'AUTO' ? 'active' : ''}" data-mode="AUTO">AUTO</button>
              <button class="mode-btn ${this.pid.mode === 'CASCADE' ? 'active' : ''}" data-mode="CASCADE">CAS</button>
            </div>

            <!-- RSP Link indicator -->
            <div class="rsp-indicator ${this.pid.mode === 'CASCADE' ? 'active' : ''}" id="rsp-ind-${this.pid.tag}">
              <span class="led-dot"></span> RSP ACTIVE
            </div>
          </div>

          <!-- CO Meter -->
          <div class="fp-meter-col">
            <div class="meter-bar-track">
              <div class="meter-bar-fill co-fill" id="fill-co-${this.pid.tag}"></div>
            </div>
            <div class="meter-label">OUT</div>
            <div class="meter-val" id="val-co-${this.pid.tag}">0.0</div>
            <div class="meter-unit">%</div>
          </div>
        </div>

        <!-- Manual Output Slider (Active in MAN mode) -->
        <div class="manual-co-tray ${this.pid.mode === 'MANUAL' ? 'visible' : ''}" id="man-tray-${this.pid.tag}">
          <label class="man-label">Manual Output (%):</label>
          <input type="range" class="man-slider" id="man-slider-${this.pid.tag}" min="0" max="100" step="0.5" value="${this.pid.co}">
          <span class="man-val-readout" id="man-readout-${this.pid.tag}">${this.pid.co.toFixed(1)}%</span>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    // Mode buttons
    const modeBtns = this.container.querySelectorAll('.mode-btn');
    modeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetMode = btn.dataset.mode;
        this.pid.setMode(targetMode);
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const rspInd = this.container.querySelector(`#rsp-ind-${this.pid.tag}`);
        if (rspInd) {
          if (targetMode === 'CASCADE') rspInd.classList.add('active');
          else rspInd.classList.remove('active');
        }

        const manTray = this.container.querySelector(`#man-tray-${this.pid.tag}`);
        if (manTray) {
          if (targetMode === 'MANUAL') manTray.classList.add('visible');
          else manTray.classList.remove('visible');
        }

        if (this.onModeChange) this.onModeChange(targetMode);
      });
    });

    // SP adjust buttons
    const spBtns = this.container.querySelectorAll('.sp-btn');
    spBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.pid.mode === 'CASCADE') return; // Cannot adjust local SP in CAS
        const delta = parseFloat(btn.dataset.delta);
        this.pid.sp = Math.max(this.pid.pvMin, Math.min(this.pid.pvMax, this.pid.sp + delta));
        if (this.onSPChange) this.onSPChange(this.pid.sp);
        this.updateDisplay();
      });
    });

    // Manual slider
    const slider = this.container.querySelector(`#man-slider-${this.pid.tag}`);
    const readout = this.container.querySelector(`#man-readout-${this.pid.tag}`);
    if (slider) {
      slider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.pid.manualCO = val;
        this.pid.co = val;
        if (readout) readout.textContent = `${val.toFixed(1)}%`;
        if (this.onCOChange) this.onCOChange(val);
      });
    }
  }

  updateDisplay() {
    const pv = this.pid.pv;
    const sp = this.pid.getActiveSetpoint();
    const co = this.pid.co;

    const span = (this.pid.pvMax - this.pid.pvMin) || 100;
    const pvFrac = Math.max(0, Math.min(100, ((pv - this.pid.pvMin) / span) * 100));
    const spFrac = Math.max(0, Math.min(100, ((sp - this.pid.pvMin) / span) * 100));
    const coFrac = Math.max(0, Math.min(100, co));

    const fillPV = this.container.querySelector(`#fill-pv-${this.pid.tag}`);
    const markSP = this.container.querySelector(`#marker-sp-${this.pid.tag}`);
    const valPV = this.container.querySelector(`#val-pv-${this.pid.tag}`);
    const valSP = this.container.querySelector(`#val-sp-${this.pid.tag}`);
    const fillCO = this.container.querySelector(`#fill-co-${this.pid.tag}`);
    const valCO = this.container.querySelector(`#val-co-${this.pid.tag}`);

    if (fillPV) fillPV.style.height = `${pvFrac}%`;
    if (markSP) markSP.style.bottom = `${spFrac}%`;
    if (valPV) valPV.textContent = pv.toFixed(1);
    if (valSP) valSP.textContent = sp.toFixed(1);
    if (fillCO) fillCO.style.height = `${coFrac}%`;
    if (valCO) valCO.textContent = co.toFixed(1);
  }
}
