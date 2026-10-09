import mermaid from 'mermaid';

/**
 * UML Studio Component
 * Dynamically renders interactive UML diagrams using Mermaid.js:
 * 1. Object-Oriented Class Architecture
 * 2. 60 Hz Simulation Sequence Diagram
 * 3. Cascade Operating Modes State Machine (ILM Objective 2)
 */
export class UmlStudio {
  constructor(containerElement) {
    this.container = containerElement;
    this.currentDiagram = 'class'; // 'class', 'sequence', 'state'

    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose',
      themeVariables: {
        darkMode: true,
        background: '#090d16',
        primaryColor: '#0369a1',
        primaryTextColor: '#f8fafc',
        primaryBorderColor: '#06b6d4',
        lineColor: '#64748b',
        secondaryColor: '#1e293b',
        tertiaryColor: '#0f172a',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '13px'
      }
    });

    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="studio-container">
        <div class="studio-header">
          <h3>Software Architecture & UML Diagram Studio</h3>
          <p class="studio-subtext">
            Explore the structural design, real-time message sequencing, and finite state machine transitions powering this interactive simulation studio.
          </p>
        </div>

        <!-- Diagram Selector Bar -->
        <div class="card" style="padding: 14px 20px; margin-bottom: 20px;">
          <div class="diagram-selector-bar">
            <div class="perm-selector" style="grid-template-columns: repeat(3, 1fr); margin: 0;">
              <button class="perm-btn ${this.currentDiagram === 'class' ? 'active' : ''}" id="btn-uml-class">
                <strong>1. Class Architecture</strong>
                <span>OOP Object Model & Hierarchy</span>
              </button>
              <button class="perm-btn ${this.currentDiagram === 'sequence' ? 'active' : ''}" id="btn-uml-seq">
                <strong>2. Sequence Diagram</strong>
                <span>60 Hz Control Signal Message Flow</span>
              </button>
              <button class="perm-btn ${this.currentDiagram === 'state' ? 'active' : ''}" id="btn-uml-state">
                <strong>3. State Machine</strong>
                <span>4 Cascade Operating Modes (Obj 2)</span>
              </button>
            </div>
          </div>
        </div>

        <!-- UML Render Viewport Card -->
        <div class="card diagram-card" style="position: relative;">
          <div class="viewport-toolbar">
            <span class="vp-title" id="uml-diagram-title">System Class Architecture Diagram</span>
            <div class="vp-controls">
              <span class="badge direct">Rendered with Mermaid.js SVG</span>
            </div>
          </div>

          <div class="uml-svg-container" id="uml-viewport" style="overflow-x: auto; padding: 24px 10px; background: #090d16; border-radius: var(--radius-md); border: 1px solid var(--border-color); min-height: 480px; display: flex; justify-content: center; align-items: center;">
            <div id="uml-mermaid-target"></div>
          </div>

          <div class="diagram-description-box" id="uml-diagram-desc" style="margin-top: 18px; padding: 14px; background: rgba(15, 23, 42, 0.6); border-radius: var(--radius-sm); border-left: 4px solid var(--cyan); font-size: 0.85rem; color: #94a3b8; line-height: 1.5;">
            ${this.getDiagramDescription(this.currentDiagram)}
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
    this.renderActiveDiagram();
  }

  attachEvents() {
    const btnClass = document.getElementById('btn-uml-class');
    const btnSeq = document.getElementById('btn-uml-seq');
    const btnState = document.getElementById('btn-uml-state');

    const updateActiveBtn = (activeBtn, diagramKey) => {
      [btnClass, btnSeq, btnState].forEach(b => b?.classList.remove('active'));
      activeBtn?.classList.add('active');
      this.currentDiagram = diagramKey;
      this.renderActiveDiagram();
    };

    btnClass?.addEventListener('click', () => updateActiveBtn(btnClass, 'class'));
    btnSeq?.addEventListener('click', () => updateActiveBtn(btnSeq, 'sequence'));
    btnState?.addEventListener('click', () => updateActiveBtn(btnState, 'state'));
  }

  getDiagramDescription(diagram) {
    if (diagram === 'class') {
      return `<strong>Class Diagram Overview:</strong> Illustrates the decoupled software architecture. The <code>CascadeSimulationEngine</code> maintains twin differential equation solvers (Cascade vs Conventional) driving physical <code>ValveModel</code> stiction, <code>FOPDTProcess</code> thermal lags, and <code>PIDController</code> instances. Visual presentation layers (<code>HeatExchanger3D</code> WebGL and <code>StripChart</code> Canvas) read unified snapshot state vectors.`;
    } else if (diagram === 'sequence') {
      return `<strong>Sequence Diagram Overview:</strong> Traces the discrete 60 Hz ODE execution cycle. When disturbances occur, the master controller TIC-101 computes a Remote Setpoint (RSP), which the slave FIC-101 immediately matches by repositioning the valve stem before reboiler product temperature can deviate.`;
    } else {
      return `<strong>State Machine Overview:</strong> Represents the finite states of the 4 operational modes defined in ILM 310305e Objective 2 (Figures 12–15). Transitions enforce bumpless transfer by locking setpoints ($SP_i = PV_i$) and output tracking ($CO_1 = PV_2$) during manual modes.`;
    }
  }

  async renderActiveDiagram() {
    const target = document.getElementById('uml-mermaid-target');
    const title = document.getElementById('uml-diagram-title');
    const desc = document.getElementById('uml-diagram-desc');
    if (!target) return;

    let code = '';
    if (this.currentDiagram === 'class') {
      if (title) title.textContent = 'System Class Architecture Diagram';
      code = `
classDiagram
  direction TB
  class MainApp {
    +CascadeSimulationEngine engine
    +StripChart stripChart
    +HeatExchanger3D heatExchanger3D
    +Valve3D valve3D
    +init()
    +simLoop()
  }

  class CascadeSimulationEngine {
    +PIDController casPrimaryPID
    +PIDController casSecondaryPID
    +ValveModel casValve
    +FOPDTProcess casFlowProcess
    +FOPDTProcess casTempProcess
    +PIDController convPID
    +ValveModel convValve
    +step(substeps) Snapshot
    +triggerSteamDrop()
  }

  class PIDController {
    +string tag
    +string mode
    +string action
    +number Kc
    +number Ti
    +number Td
    +step(pv, dt, rsp, ef) number
    +setMode(newMode)
  }

  class ValveModel {
    +string failAction
    +string characteristic
    +number stictionDeadband
    +number stemPosition
    +step(controllerOutput, dt) number
  }

  class FOPDTProcess {
    +number Kp
    +number tau
    +number deadTime
    +Float32Array delayBuffer
    +step(input, dt, loadDisturbance) number
  }

  class StripChart {
    +HTMLCanvasElement canvas
    +Array dataPoints
    +addPoint(point)
    +render()
  }

  class HeatExchanger3D {
    +Scene scene
    +Camera camera
    +WebGLRenderer renderer
    +updateState(snapshot)
  }

  MainApp --> CascadeSimulationEngine
  MainApp --> StripChart
  MainApp --> HeatExchanger3D
  CascadeSimulationEngine *-- PIDController
  CascadeSimulationEngine *-- ValveModel
  CascadeSimulationEngine *-- FOPDTProcess
`;
    } else if (this.currentDiagram === 'sequence') {
      if (title) title.textContent = '60 Hz Simulation Signal Flow (Sequence Diagram)';
      code = `
sequenceDiagram
  autonumber
  actor User as Operator / Disturbance
  participant App as Main Coordinator
  participant Engine as CascadeEngine
  participant TIC as Master TIC-101
  participant FIC as Slave FIC-101
  participant Valve as Valve FV-101
  participant Process as Thermal Reboiler
  participant View as 3D Canvas & Trends

  User->>Engine: Inject Steam Drop (-30%)
  loop 60 Hz Simulation Step
    App->>Engine: step(dt)
    Engine->>TIC: step(PV_temp, dt, EF=PV_flow)
    TIC-->>Engine: Remote Setpoint (RSP)
    Engine->>FIC: step(PV_flow, dt, RSP)
    FIC-->>Engine: Output (CO2)
    Engine->>Valve: step(CO2, dt) [Applies Stiction]
    Valve-->>Engine: Steam Flow Rate
    Engine->>Process: step(Flow, dt)
    Process-->>Engine: New Reboiler Temp (PV1)
    Engine->>View: update(Snapshot)
  end
`;
    } else {
      if (title) title.textContent = 'Operational Mode State Machine (ILM Objective 2)';
      code = `
stateDiagram-v2
  direction LR
  [*] --> Config1_FullCascade: Startup

  Config1_FullCascade: Config 1 - Full Cascade (Fig 12)\\nPrimary AUTO | Secondary CASCADE
  Config2_FullManual: Config 2 - Full Manual (Fig 13)\\nPrimary MANUAL | Secondary MANUAL\\n(Bumpless SP & Output Tracking)
  Config3_LocalAuto: Config 3 - Local Auto (Fig 14)\\nPrimary MANUAL | Secondary AUTO
  Config4_RemoteManual: Config 4 - Remote Manual (Fig 15)\\nPrimary MANUAL | Secondary CASCADE

  Config1_FullCascade --> Config2_FullManual: Switch to Manual
  Config2_FullManual --> Config3_LocalAuto: Secondary to Auto
  Config3_LocalAuto --> Config4_RemoteManual: Secondary to Cascade
  Config4_RemoteManual --> Config1_FullCascade: Primary to Auto
`;
    }

    if (desc) desc.innerHTML = this.getDiagramDescription(this.currentDiagram);

    try {
      target.innerHTML = '<div style="color: #64748b; font-size: 0.9rem; padding: 20px;">Rendering diagram...</div>';
      const renderId = `mermaid-svg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const { svg } = await mermaid.render(renderId, code);
      target.innerHTML = svg;
    } catch (err) {
      console.error('Mermaid render error:', err);
      target.innerHTML = `<pre style="color: #ef4444; padding: 20px;">Mermaid Rendering Error: ${err.message}</pre>`;
    }
  }
}
