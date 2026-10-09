/**
 * Objective 2: Cascade Controller Actions, Modes, Bumpless Transfer & Reset Windup
 * Features:
 * - Direct vs Reverse action & ATO/ATC valve selection matrix
 * - 4 Cascade Mode combinations (Figures 12 - 15)
 * - Bumpless Transfer demonstration
 * - Reset Windup & External Feedback (EF) visualizer
 */
export class ModesStudio {
  constructor(containerElement, onModePermutationSelect) {
    this.container = containerElement;
    this.onModePermutationSelect = onModePermutationSelect;

    this.selectedPermutation = 1; // 1: Pri Auto/Sec Cas, 2: Pri Man/Sec Man, 3: Pri Man/Sec Auto, 4: Pri Man/Sec Cas
    this.valveFailMode = 'ATO';   // ATO (Fail Closed) or ATC (Fail Open)
    
    // Windup simulation state
    this.windupTime = 0;
    this.windupError = 15.0; // Steady error
    this.integralNormal = 0;
    this.integralEF = 0;

    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="studio-container">
        <div class="studio-header">
          <h3>Objective Two: Controller Actions, Modes, Bumpless Transfer & Reset Windup</h3>
          <p class="studio-subtext">
            Explore fail-safe valve selection, the four operational mode configurations, bumpless transfer tracking rules, and External Feedback (EF) anti-reset windup protection.
          </p>
        </div>

        <div class="studio-grid">
          <!-- 1. The Four Operational Mode Configurations -->
          <div class="card mode-perm-card">
            <h4>1. Cascade Operational Mode Configurations (ILM Fig 12 - 15)</h4>
            <div class="perm-selector">
              <button class="perm-btn ${this.selectedPermutation === 1 ? 'active' : ''}" data-perm="1">
                <strong>Config 1 (Fig 12)</strong>
                <span>Primary: AUTO | Secondary: CASCADE</span>
              </button>
              <button class="perm-btn ${this.selectedPermutation === 2 ? 'active' : ''}" data-perm="2">
                <strong>Config 2 (Fig 13)</strong>
                <span>Primary: MANUAL | Secondary: MANUAL</span>
              </button>
              <button class="perm-btn ${this.selectedPermutation === 3 ? 'active' : ''}" data-perm="3">
                <strong>Config 3 (Fig 14)</strong>
                <span>Primary: MANUAL | Secondary: AUTO</span>
              </button>
              <button class="perm-btn ${this.selectedPermutation === 4 ? 'active' : ''}" data-perm="4">
                <strong>Config 4 (Fig 15)</strong>
                <span>Primary: MANUAL | Secondary: CASCADE</span>
              </button>
            </div>

            <!-- Dynamic explanation of active mode configuration -->
            <div class="perm-detail-box" id="perm-detail-box">
              ${this.getPermutationDetail(this.selectedPermutation)}
            </div>
          </div>

          <!-- 2. Controller Action Matrix (Direct vs Reverse) -->
          <div class="card action-matrix-card">
            <h4>2. Valve Failure Mode & Controller Action</h4>
            <div class="action-select-row">
              <label>Select Control Valve Failure Mode:</label>
              <div class="valve-toggle-group">
                <button class="btn-toggle ${this.valveFailMode === 'ATO' ? 'active' : ''}" id="toggle-ato">
                  Air-to-Open (ATO / Fail-Closed)
                </button>
                <button class="btn-toggle ${this.valveFailMode === 'ATC' ? 'active' : ''}" id="toggle-atc">
                  Air-to-Close (ATC / Fail-Open)
                </button>
              </div>
            </div>

            <div class="action-matrix-table-wrap">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Component</th>
                    <th>Process Action</th>
                    <th>Controller Action Required</th>
                  </tr>
                </thead>
                <tbody id="action-table-body">
                  ${this.getActionTableRows()}
                </tbody>
              </table>
            </div>

            <div class="ilm-rule-alert">
              <strong>Technician Rule:</strong> For heating loops, loss of air should fail the steam valve closed (ATO). To open the valve when temperature drops, the primary controller must be <strong>Reverse Acting</strong> ($SP - PV$).
            </div>
          </div>
        </div>

        <!-- 3. Reset Windup & External Feedback (EF) Studio -->
        <div class="card windup-card">
          <h4>3. Anti-Reset Windup via External Feedback (EF) (ILM p. 24-25)</h4>
          <p class="card-intro">
            When secondary loop is in manual or saturated, a continuous primary error would normally cause integral saturation (Reset Windup). See how connecting External Feedback (EF) from the secondary PV eliminates windup!
          </p>

          <div class="windup-demo-grid">
            <div class="windup-controls">
              <label>Simulated Sustained Error ($SP - PV$):</label>
              <div class="slider-box">
                <input type="range" id="windup-err-slider" min="0" max="30" step="1" value="${this.windupError}">
                <span class="readout" id="windup-err-val">${this.windupError.toFixed(0)}°C</span>
              </div>
              <button class="btn-action danger" id="btn-run-windup">Simulate 10 Min Sustained Error</button>
              <button class="btn-action" id="btn-reset-windup">Reset Integral State</button>
            </div>

            <div class="windup-visuals">
              <div class="windup-bar-group">
                <span class="bar-title">Without Anti-Windup (Saturated Integral)</span>
                <div class="windup-progress-track">
                  <div class="windup-progress-fill saturated" id="bar-no-ef" style="width: 20%;">20%</div>
                </div>
                <span class="windup-status warn" id="status-no-ef">Accumulating Bias...</span>
              </div>

              <div class="windup-bar-group">
                <span class="bar-title">With External Feedback EF (Protected Bias)</span>
                <div class="windup-progress-track">
                  <div class="windup-progress-fill protected" id="bar-with-ef" style="width: 50%;">50%</div>
                </div>
                <span class="windup-status success" id="status-with-ef">Clamped to Secondary PV (EF)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  getPermutationDetail(perm) {
    switch (perm) {
      case 1:
        return `
          <div class="perm-detail">
            <h5>Full Cascade Control (Figure 12)</h5>
            <ul>
              <li><strong>Operator Adjustments:</strong> Primary Setpoint ($SP_1$) only. Cannot adjust secondary setpoint or valve output directly.</li>
              <li><strong>Signal Path:</strong> Primary Output ($CO_1$) $\\to$ Remote Setpoint ($RSP_2$) of Secondary Controller.</li>
              <li><strong>Operation:</strong> Secondary controller FIC-101 operates in automatic, eliminating flow and steam pressure disturbances. Primary maintains product temperature.</li>
            </ul>
          </div>
        `;
      case 2:
        return `
          <div class="perm-detail">
            <h5>Full Manual Mode (Figure 13)</h5>
            <ul>
              <li><strong>Operator Adjustments:</strong> Secondary Output ($CO_2$) directly manipulates valve position.</li>
              <li><strong>Tracking for Bumpless Transfer:</strong> 
                <br>• Secondary SP tracks Secondary PV ($SP_2 = PV_2$).
                <br>• Primary SP tracks Primary PV ($SP_1 = PV_1$).
                <br>• Primary CO tracks Secondary PV ($CO_1 = PV_2$).
              </li>
              <li><strong>Outcome:</strong> No bump or valve jump occurs when transferring to Automatic or Cascade.</li>
            </ul>
          </div>
        `;
      case 3:
        return `
          <div class="perm-detail">
            <h5>Primary Manual, Secondary Automatic (Figure 14)</h5>
            <ul>
              <li><strong>Operator Adjustments:</strong> Secondary Setpoint ($SP_2$) locally. Cannot adjust valve directly.</li>
              <li><strong>Primary Initialized Manual:</strong> Primary controller TIC-101 is forced into initialized manual mode.</li>
              <li><strong>Tracking:</strong> Primary SP tracks Primary PV ($SP_1 = PV_1$), Primary CO tracks Secondary SP ($CO_1 = SP_2$).</li>
            </ul>
          </div>
        `;
      case 4:
        return `
          <div class="perm-detail">
            <h5>Primary Manual, Secondary Cascade (Figure 15)</h5>
            <ul>
              <li><strong>Operator Adjustments:</strong> Primary Output ($CO_1$). This directly sets the Remote Setpoint ($RSP_2$) for FIC-101!</li>
              <li><strong>Secondary Operation:</strong> FIC-101 runs in automatic control to hold flow at $CO_1$.</li>
              <li><strong>Primary Tracking:</strong> Primary SP tracks Primary PV ($SP_1 = PV_1$).</li>
            </ul>
          </div>
        `;
      default:
        return '';
    }
  }

  getActionTableRows() {
    if (this.valveFailMode === 'ATO') {
      return `
        <tr>
          <td>Control Valve (ATO)</td>
          <td>Air $\\uparrow \\implies$ Valve Opens $\\implies$ Steam Flow $\\uparrow$</td>
          <td><span class="badge direct">Direct Process</span></td>
        </tr>
        <tr>
          <td>Flow Controller (FIC-101)</td>
          <td>Flow $PV_2 \\uparrow$ requires Valve closing</td>
          <td><span class="badge reverse">Reverse Acting</span></td>
        </tr>
        <tr>
          <td>Reboiler Heat Process</td>
          <td>Steam Flow $\\uparrow \\implies$ Product Temp $PV_1 \\uparrow$</td>
          <td><span class="badge direct">Direct Process</span></td>
        </tr>
        <tr>
          <td>Temp Controller (TIC-101)</td>
          <td>Temp $PV_1 \\uparrow$ requires Steam setpoint reduction</td>
          <td><span class="badge reverse">Reverse Acting</span></td>
        </tr>
      `;
    } else {
      return `
        <tr>
          <td>Control Valve (ATC)</td>
          <td>Air $\\uparrow \\implies$ Valve Closes $\\implies$ Steam Flow $\\downarrow$</td>
          <td><span class="badge reverse">Reverse Process</span></td>
        </tr>
        <tr>
          <td>Flow Controller (FIC-101)</td>
          <td>Flow $PV_2 \\uparrow$ requires Valve closing (Air $\\uparrow$)</td>
          <td><span class="badge direct">Direct Acting</span></td>
        </tr>
        <tr>
          <td>Reboiler Heat Process</td>
          <td>Steam Flow $\\uparrow \\implies$ Product Temp $PV_1 \\uparrow$</td>
          <td><span class="badge direct">Direct Process</span></td>
        </tr>
        <tr>
          <td>Temp Controller (TIC-101)</td>
          <td>Temp $PV_1 \\uparrow$ requires Steam setpoint reduction</td>
          <td><span class="badge reverse">Reverse Acting</span></td>
        </tr>
      `;
    }
  }

  attachEvents() {
    // Mode Permutation buttons
    const permBtns = this.container.querySelectorAll('.perm-btn');
    permBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const perm = parseInt(btn.dataset.perm, 10);
        this.selectedPermutation = perm;
        permBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const detailBox = document.getElementById('perm-detail-box');
        if (detailBox) detailBox.innerHTML = this.getPermutationDetail(perm);

        if (this.onModePermutationSelect) this.onModePermutationSelect(perm);
      });
    });

    // ATO / ATC toggles
    const btnATO = document.getElementById('toggle-ato');
    const btnATC = document.getElementById('toggle-atc');
    const tableBody = document.getElementById('action-table-body');

    btnATO?.addEventListener('click', () => {
      this.valveFailMode = 'ATO';
      btnATO.classList.add('active');
      btnATC.classList.remove('active');
      if (tableBody) tableBody.innerHTML = this.getActionTableRows();
    });

    btnATC?.addEventListener('click', () => {
      this.valveFailMode = 'ATC';
      btnATC.classList.add('active');
      btnATO.classList.remove('active');
      if (tableBody) tableBody.innerHTML = this.getActionTableRows();
    });

    // Windup slider & buttons
    const errSlider = document.getElementById('windup-err-slider');
    const errVal = document.getElementById('windup-err-val');
    errSlider?.addEventListener('input', (e) => {
      this.windupError = parseFloat(e.target.value);
      if (errVal) errVal.textContent = `${this.windupError.toFixed(0)}°C`;
    });

    document.getElementById('btn-run-windup')?.addEventListener('click', () => {
      this.simulateWindup();
    });

    document.getElementById('btn-reset-windup')?.addEventListener('click', () => {
      this.resetWindup();
    });
  }

  simulateWindup() {
    const barNoEF = document.getElementById('bar-no-ef');
    const statusNoEF = document.getElementById('status-no-ef');
    const barWithEF = document.getElementById('bar-with-ef');
    const statusWithEF = document.getElementById('status-with-ef');

    // Without EF: accumulates to saturated limit (e.g. 103.3% or far beyond)
    if (barNoEF) {
      barNoEF.style.width = '100%';
      barNoEF.textContent = '103.3% (Saturated!)';
    }
    if (statusNoEF) {
      statusNoEF.textContent = 'WARNING: Saturated Reset Windup. Delay in returning to control!';
      statusNoEF.className = 'windup-status danger';
    }

    // With EF: clamped to secondary PV (e.g. 52%)
    if (barWithEF) {
      barWithEF.style.width = '52%';
      barWithEF.textContent = '52.0% (Matched)';
    }
    if (statusWithEF) {
      statusWithEF.textContent = 'SUCCESS: Bias locked to External Feedback (EF). Immediate control recovery.';
      statusWithEF.className = 'windup-status success';
    }
  }

  resetWindup() {
    const barNoEF = document.getElementById('bar-no-ef');
    const statusNoEF = document.getElementById('status-no-ef');
    const barWithEF = document.getElementById('bar-with-ef');
    const statusWithEF = document.getElementById('status-with-ef');

    if (barNoEF) {
      barNoEF.style.width = '20%';
      barNoEF.textContent = '20%';
    }
    if (statusNoEF) {
      statusNoEF.textContent = 'Normal Bias';
      statusNoEF.className = 'windup-status';
    }

    if (barWithEF) {
      barWithEF.style.width = '50%';
      barWithEF.textContent = '50%';
    }
    if (statusWithEF) {
      statusWithEF.textContent = 'Normal Tracking';
      statusWithEF.className = 'windup-status';
    }
  }
}
