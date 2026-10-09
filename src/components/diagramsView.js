import { renderFormula } from './mathRenderer.js';

/**
 * Objective 1 & 5: Interactive P&ID, Block Diagrams & Transfer Functions
 * Features:
 * - Interactive ISA standard P&ID (Figure 44)
 * - Complete Block Diagram with disturbance injection points D1 and D2 (Figure 45)
 * - Simplified Outer Loop Block Diagram (Figure 46)
 * - LaTeX Closed-Loop Transfer Functions
 */
export class DiagramsView {
  constructor(containerElement) {
    this.container = containerElement;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="studio-container">
        <div class="studio-header">
          <h3>Objectives One & Five: Cascade Architecture, P&ID & Block Diagrams</h3>
          <p class="studio-subtext">
            Explore authentic ISA 5.1 instrumentation symbology, trace inner vs outer feedback loops, and understand the mathematical block transfer functions of cascade systems.
          </p>
        </div>

        <div class="studio-grid">
          <!-- 1. Authentic ISA P&ID Diagram -->
          <div class="card diagram-card">
            <h4>1. P&ID Schematic of Cascade Scheme (ILM Fig 44)</h4>
            <div class="diagram-wrap">
              <svg viewBox="0 0 700 420" width="100%" xmlns="http://www.w3.org/2000/svg">
                <!-- Background grid lines -->
                <defs>
                  <linearGradient id="pipeSteamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#38bdf8"/>
                    <stop offset="100%" stop-color="#0284c7"/>
                  </linearGradient>
                  <linearGradient id="exchangerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#334155"/>
                    <stop offset="100%" stop-color="#1e293b"/>
                  </linearGradient>
                </defs>

                <!-- Process Piping -->
                <!-- Cold Oil Inlet -->
                <path d="M 60 300 L 220 300" stroke="#64748b" stroke-width="6" fill="none"/>
                <text x="70" y="290" fill="#94a3b8" font-size="12" font-family="'JetBrains Mono', monospace">Cold Oil Feed</text>

                <!-- Heat Exchanger Shell -->
                <rect x="220" y="220" width="220" height="150" rx="12" fill="url(#exchangerGrad)" stroke="#64748b" stroke-width="3"/>
                <!-- Tubes inside exchanger -->
                <line x1="230" y1="260" x2="430" y2="260" stroke="#f59e0b" stroke-width="3"/>
                <line x1="230" y1="285" x2="430" y2="285" stroke="#f59e0b" stroke-width="3"/>
                <line x1="230" y1="310" x2="430" y2="310" stroke="#f59e0b" stroke-width="3"/>
                <line x1="230" y1="335" x2="430" y2="335" stroke="#f59e0b" stroke-width="3"/>
                <text x="250" y="245" fill="#e2e8f0" font-weight="bold" font-size="14" font-family="'Outfit', sans-serif">Heat Exchanger (E-101)</text>

                <!-- Hot Oil Outlet -->
                <path d="M 440 300 L 620 300" stroke="#ef4444" stroke-width="6" fill="none"/>
                <text x="510" y="290" fill="#f87171" font-size="12" font-family="'JetBrains Mono', monospace">Hot Oil Out (PV1)</text>

                <!-- Steam Supply Line -->
                <path d="M 330 40 L 330 220" stroke="url(#pipeSteamGrad)" stroke-width="6" fill="none"/>
                <text x="345" y="60" fill="#38bdf8" font-size="12" font-family="'JetBrains Mono', monospace">Steam Header (P_steam)</text>

                <!-- Control Valve (FV-101 / FCE) -->
                <g transform="translate(330, 140)">
                  <!-- Diaphragm Dome -->
                  <path d="M -22 -28 A 22 22 0 0 1 22 -28 Z" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
                  <!-- Yoke & Stem -->
                  <line x1="0" y1="-28" x2="0" y2="0" stroke="#cbd5e1" stroke-width="3"/>
                  <!-- Valve Body Hourglass -->
                  <polygon points="-16,-12 16,12 16,-12 -16,12" fill="#0f766e" stroke="#14b8a6" stroke-width="2"/>
                  <text x="25" y="-10" fill="#38bdf8" font-size="11" font-family="'JetBrains Mono', monospace">FC (ATO)</text>
                </g>

                <!-- Condensate Drain -->
                <path d="M 330 370 L 330 405" stroke="#64748b" stroke-width="4" fill="none"/>
                <text x="345" y="400" fill="#94a3b8" font-size="11" font-family="'JetBrains Mono', monospace">Condensate</text>

                <!-- ISA INSTRUMENT BUBBLES -->
                <!-- FT-101 (Flow Transmitter) -->
                <g transform="translate(330, 85)">
                  <circle cx="0" cy="0" r="22" fill="#0b1120" stroke="#06b6d4" stroke-width="2"/>
                  <line x1="-22" y1="0" x2="22" y2="0" stroke="#06b6d4" stroke-width="1.5"/>
                  <text x="0" y="-4" fill="#06b6d4" font-size="11" font-weight="bold" text-anchor="middle">FT</text>
                  <text x="0" y="14" fill="#94a3b8" font-size="10" text-anchor="middle">101</text>
                </g>

                <!-- FIC-101 (Secondary Controller) -->
                <g transform="translate(200, 85)">
                  <circle cx="0" cy="0" r="24" fill="#0b1120" stroke="#f59e0b" stroke-width="2"/>
                  <line x1="-24" y1="0" x2="24" y2="0" stroke="#f59e0b" stroke-width="1.5"/>
                  <text x="0" y="-4" fill="#f59e0b" font-size="11" font-weight="bold" text-anchor="middle">FIC</text>
                  <text x="0" y="14" fill="#94a3b8" font-size="10" text-anchor="middle">101</text>
                </g>

                <!-- TT-101 (Temperature Transmitter) -->
                <g transform="translate(530, 300)">
                  <circle cx="0" cy="0" r="22" fill="#0b1120" stroke="#06b6d4" stroke-width="2"/>
                  <line x1="-22" y1="0" x2="22" y2="0" stroke="#06b6d4" stroke-width="1.5"/>
                  <text x="0" y="-4" fill="#06b6d4" font-size="11" font-weight="bold" text-anchor="middle">TT</text>
                  <text x="0" y="14" fill="#94a3b8" font-size="10" text-anchor="middle">101</text>
                </g>

                <!-- TIC-101 (Primary Master Controller) -->
                <g transform="translate(70, 85)">
                  <circle cx="0" cy="0" r="24" fill="#0b1120" stroke="#38bdf8" stroke-width="2"/>
                  <line x1="-24" y1="0" x2="24" y2="0" stroke="#38bdf8" stroke-width="1.5"/>
                  <text x="0" y="-4" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">TIC</text>
                  <text x="0" y="14" fill="#94a3b8" font-size="10" text-anchor="middle">101</text>
                </g>

                <!-- SIGNAL LINES -->
                <!-- FT-101 to FIC-101 (dashed electrical signal) -->
                <path d="M 308 85 L 224 85" stroke="#06b6d4" stroke-dasharray="4,4" stroke-width="2"/>
                <!-- TIC-101 to FIC-101 (Remote Setpoint RSP) -->
                <path d="M 94 85 L 176 85" stroke="#38bdf8" stroke-dasharray="4,4" stroke-width="2"/>
                <polygon points="176,85 168,81 168,89" fill="#38bdf8"/>
                <text x="135" y="75" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">RSP</text>

                <!-- FIC-101 to Valve (Pneumatic signal line with hashes) -->
                <path d="M 200 110 L 200 140 L 314 140" stroke="#10b981" stroke-width="2" stroke-dasharray="8,2" fill="none"/>
                <!-- TT-101 up and over to TIC-101 -->
                <path d="M 530 278 L 530 18 L 70 18 L 70 61" stroke="#ef4444" stroke-dasharray="4,4" stroke-width="2" fill="none"/>
                <polygon points="70,61 66,53 74,53" fill="#ef4444"/>
                <text x="280" y="14" fill="#f87171" font-size="11" text-anchor="middle">Primary PV (Temp Feedback)</text>
              </svg>
            </div>
          </div>

          <!-- 2. Transfer Function Mathematics Card -->
          <div class="card math-card">
            <h4>2. Closed-Loop Disturbance Transfer Function</h4>
            <div id="formula-tf-box" class="math-display"></div>
            <p class="formula-description">
              In conventional control, load disturbance <strong>D₂ (steam header pressure drop)</strong> directly impacts the process. Under cascade control, the inner loop transfer function divides the disturbance by <strong>(1 + G_c2 · G_p2)</strong>, eliminating its impact before it can upset the product temperature!
            </p>

            <div class="kpi-grid">
              <div class="kpi-box highlight">
                <span class="kpi-label">Inner Loop Disturbance Attenuation</span>
                <span class="kpi-val" id="kpi-tf-attenuation"></span>
                <span class="kpi-sub">Reduces disturbance effect before reaching primary process</span>
              </div>
              <div class="kpi-box success">
                <span class="kpi-label">Effective Inner Loop Dynamics</span>
                <span class="kpi-val" id="kpi-tf-inner"></span>
                <span class="kpi-sub">Acts as a fast linear actuator to the primary controller</span>
              </div>
            </div>

            <div class="ilm-rule-alert">
              <strong>Figure 46 Takeaway:</strong> The master controller TIC-101 perceives the entire slave loop as an idealized linear element with near-unity gain ($G_{inner} \approx 1$). Valve non-linearities and stiction are completely isolated within the inner loop!
            </div>
          </div>
        </div>

        <!-- 3. Complete Block Diagram (ILM Fig 45 & Fig 46) -->
        <div class="card diagram-card">
          <h4>3. Complete Cascade Control Block Diagram (ILM Fig 45)</h4>
          <div class="diagram-wrap">
            <svg viewBox="0 0 850 300" width="100%" xmlns="http://www.w3.org/2000/svg">
              <!-- Outer Loop Boundary -->
              <rect x="10" y="10" width="830" height="280" rx="10" fill="none" stroke="#334155" stroke-dasharray="6,6" stroke-width="1.5"/>
              <text x="25" y="30" fill="#94a3b8" font-size="12" font-family="'Outfit', sans-serif">OUTER LOOP (PRIMARY: REBOILER TEMPERATURE)</text>

              <!-- Inner Loop Boundary -->
              <rect x="230" y="45" width="370" height="190" rx="8" fill="rgba(6, 182, 212, 0.04)" stroke="#06b6d4" stroke-dasharray="4,4" stroke-width="1.5"/>
              <text x="245" y="65" fill="#06b6d4" font-size="11" font-family="'Outfit', sans-serif">INNER LOOP (SECONDARY: STEAM FLOW)</text>

              <!-- SP1 Input -->
              <path d="M 25 110 L 60 110" stroke="#f8fafc" stroke-width="2"/>
              <polygon points="60,110 52,106 52,114" fill="#f8fafc"/>
              <text x="25" y="100" fill="#f8fafc" font-size="12" font-family="'JetBrains Mono', monospace">SP1</text>

              <!-- Summing Junction 1 -->
              <circle cx="75" cy="110" r="14" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
              <text x="75" y="114" fill="#38bdf8" font-size="14" text-anchor="middle">+</text>

              <!-- Primary Controller TIC-101 -->
              <path d="M 89 110 L 115 110" stroke="#38bdf8" stroke-width="2"/>
              <rect x="115" y="85" width="80" height="50" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
              <text x="155" y="107" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">TIC-101</text>
              <text x="155" y="123" fill="#94a3b8" font-size="9" text-anchor="middle">G_c1(s)</text>

              <!-- RSP Arrow into Summing Junction 2 -->
              <path d="M 195 110 L 255 110" stroke="#38bdf8" stroke-width="2"/>
              <polygon points="255,110 247,106 247,114" fill="#38bdf8"/>
              <text x="225" y="102" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">RSP</text>

              <!-- Summing Junction 2 -->
              <circle cx="270" cy="110" r="14" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
              <text x="270" y="114" fill="#f59e0b" font-size="14" text-anchor="middle">+</text>

              <!-- Secondary Controller FIC-101 -->
              <path d="M 284 110 L 310 110" stroke="#f59e0b" stroke-width="2"/>
              <rect x="310" y="85" width="80" height="50" rx="4" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
              <text x="350" y="107" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">FIC-101</text>
              <text x="350" y="123" fill="#94a3b8" font-size="9" text-anchor="middle">G_c2(s)</text>

              <!-- Valve & Flow Process (Inner Process) -->
              <path d="M 390 110 L 420 110" stroke="#10b981" stroke-width="2"/>
              <rect x="420" y="85" width="90" height="50" rx="4" fill="#1e293b" stroke="#10b981" stroke-width="2"/>
              <text x="465" y="107" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">Valve & Flow</text>
              <text x="465" y="123" fill="#94a3b8" font-size="9" text-anchor="middle">G_p2(s)</text>

              <!-- Steam Header Disturbance D2 Arrow -->
              <path d="M 465 30 L 465 75" stroke="#ef4444" stroke-width="2"/>
              <polygon points="465,75 461,67 469,67" fill="#ef4444"/>
              <text x="475" y="45" fill="#ef4444" font-size="10" font-weight="bold">Disturbance D2 (Steam Press)</text>

              <!-- Inner Feedback Loop -->
              <path d="M 510 110 L 540 110 L 540 190 L 270 190 L 270 124" stroke="#f59e0b" stroke-width="2" fill="none"/>
              <polygon points="270,124 266,132 274,132" fill="#f59e0b"/>
              <text x="410" y="182" fill="#f59e0b" font-size="10" text-anchor="middle">Secondary PV2 (Steam Flow)</text>

              <!-- Primary Process (Reboiler Heat Transfer) -->
              <path d="M 540 110 L 640 110" stroke="#06b6d4" stroke-width="2"/>
              <polygon points="640,110 632,106 632,114" fill="#06b6d4"/>
              <rect x="640" y="85" width="100" height="50" rx="4" fill="#1e293b" stroke="#06b6d4" stroke-width="2"/>
              <text x="690" y="107" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">Column Temp</text>
              <text x="690" y="123" fill="#94a3b8" font-size="9" text-anchor="middle">G_p1(s)</text>

              <!-- Feed Flow Disturbance D1 Arrow -->
              <path d="M 690 30 L 690 75" stroke="#a855f7" stroke-width="2"/>
              <polygon points="690,75 686,67 694,67" fill="#a855f7"/>
              <text x="700" y="45" fill="#a855f7" font-size="10" font-weight="bold">Disturbance D1 (Feed Flow)</text>

              <!-- Primary PV Output -->
              <path d="M 740 110 L 800 110" stroke="#f8fafc" stroke-width="2"/>
              <polygon points="800,110 792,106 792,114" fill="#f8fafc"/>
              <text x="815" y="114" fill="#f8fafc" font-size="12" font-family="'JetBrains Mono', monospace">PV1</text>

              <!-- Outer Feedback Loop -->
              <path d="M 770 110 L 770 250 L 75 250 L 75 124" stroke="#38bdf8" stroke-width="2" fill="none"/>
              <polygon points="75,124 71,132 79,132" fill="#38bdf8"/>
              <text x="440" y="242" fill="#38bdf8" font-size="11" text-anchor="middle">Primary PV1 Feedback (Temperature TT-101)</text>
            </svg>
          </div>
        </div>
      </div>
    `;

    this.renderFormulas();
  }

  renderFormulas() {
    renderFormula(
      'formula-tf-box',
      `\\frac{Y_1(s)}{D_2(s)} = \\frac{G_{p1}(s) \\cdot G_{p2}(s)}{1 + G_{c2}(s)G_{p2}(s) + G_{c1}(s)G_{c2}(s)G_{p2}(s)G_{p1}(s)}`
    );
    renderFormula(
      'kpi-tf-attenuation',
      `\\frac{1}{1 + G_{c2}G_{p2}}`,
      false
    );
    renderFormula(
      'kpi-tf-inner',
      `G_{inner}(s) \\approx 1.0`,
      false
    );
  }
}
