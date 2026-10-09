import { CascadeSimulationEngine } from './physics/cascadeEngine.js';
import { StripChart } from './graphics/stripChart.js';
import { HeatExchanger3D } from './graphics/heatExchanger3D.js';
import { Valve3D } from './graphics/valve3D.js';
import { PIDFaceplate } from './components/pidFaceplate.js';
import { DiagramsView } from './components/diagramsView.js';
import { SpeedStudio } from './components/speedStudio.js';
import { TuningStudio } from './components/tuningStudio.js';
import { ModesStudio } from './components/modesStudio.js';
import { UmlStudio } from './components/umlStudio.js';
import { SelfTestQuiz } from './components/selfTestQuiz.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Simulation Engine
  const engine = new CascadeSimulationEngine();

  // 2. Initialize Strip Chart
  const chartCanvas = document.getElementById('strip-chart-canvas');
  let stripChart = null;
  if (chartCanvas) {
    stripChart = new StripChart(chartCanvas, {
      timeWindowMinutes: 8.0,
      yMin: 0.0,
      yMax: 160.0
    });
  }

  // 3. Initialize 3D Models
  const hxContainer = document.getElementById('heat-exchanger-3d-container');
  let heatExchanger3D = null;
  if (hxContainer) {
    heatExchanger3D = new HeatExchanger3D(hxContainer);
  }

  const valveContainer = document.getElementById('valve-3d-container');
  let valve3D = null;

  // 4. Initialize DCS Faceplates
  const fpTICContainer = document.getElementById('faceplate-tic-container');
  const fpFICContainer = document.getElementById('faceplate-fic-container');
  let fpTIC = null;
  let fpFIC = null;

  if (fpTICContainer) {
    fpTIC = new PIDFaceplate(
      fpTICContainer,
      engine.casPrimaryPID,
      (newMode) => console.log('TIC Mode:', newMode),
      (newSP) => console.log('TIC SP:', newSP),
      (newCO) => console.log('TIC CO:', newCO)
    );
  }

  if (fpFICContainer) {
    fpFIC = new PIDFaceplate(
      fpFICContainer,
      engine.casSecondaryPID,
      (newMode) => console.log('FIC Mode:', newMode),
      (newSP) => console.log('FIC SP:', newSP),
      (newCO) => console.log('FIC CO:', newCO)
    );
  }

  // 5. Initialize Studios
  const diagramsContainer = document.getElementById('tab-diagrams');
  if (diagramsContainer) new DiagramsView(diagramsContainer);

  const speedContainer = document.getElementById('tab-speed');
  if (speedContainer) new SpeedStudio(speedContainer);

  const tuningContainer = document.getElementById('tab-tuning');
  if (tuningContainer) {
    new TuningStudio(tuningContainer, (faultType) => {
      if (faultType === 'INNER_UNSTABLE') {
        engine.casSecondaryPID.Kc = 8.5; // Excess gain causing inner chatter
        engine.casSecondaryPID.Ti = 0.02;
      } else if (faultType === 'OUTER_UNSTABLE') {
        engine.casPrimaryPID.Kc = 4.8; // Excess gain causing rolling instability
        engine.casPrimaryPID.Ti = 0.5;
      } else {
        // Normal
        engine.casSecondaryPID.Kc = 2.5;
        engine.casSecondaryPID.Ti = 0.3;
        engine.casPrimaryPID.Kc = 1.5;
        engine.casPrimaryPID.Ti = 3.5;
      }
    });
  }

  const modesContainer = document.getElementById('tab-modes');
  if (modesContainer) {
    new ModesStudio(modesContainer, (perm) => {
      // Map configuration permutation to simulation engine
      if (perm === 1) {
        engine.casPrimaryPID.setMode('AUTO');
        engine.casSecondaryPID.setMode('CASCADE');
      } else if (perm === 2) {
        engine.casPrimaryPID.setMode('MANUAL');
        engine.casSecondaryPID.setMode('MANUAL');
      } else if (perm === 3) {
        engine.casPrimaryPID.setMode('MANUAL');
        engine.casSecondaryPID.setMode('AUTO');
      } else if (perm === 4) {
        engine.casPrimaryPID.setMode('MANUAL');
        engine.casSecondaryPID.setMode('CASCADE');
      }
      fpTIC?.render();
      fpFIC?.render();
    });
  }

  const umlContainer = document.getElementById('tab-uml');
  if (umlContainer) new UmlStudio(umlContainer);

  const quizContainer = document.getElementById('tab-quiz');
  if (quizContainer) new SelfTestQuiz(quizContainer);

  // 6. Tab Navigation Logic
  const navBtns = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.tab;
      navBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.add('active');

      // Lazy-init 3D valve on first view
      if (targetId === 'tab-valve' && !valve3D && valveContainer) {
        valve3D = new Valve3D(valveContainer);
      }

      // Trigger resize for Three.js and canvases on tab switch
      setTimeout(() => {
        heatExchanger3D?.resize();
        valve3D?.resize();
        stripChart?.resize();
      }, 50);
    });
  });

  // 7. Disturbance Buttons
  document.getElementById('btn-inject-steam-drop')?.addEventListener('click', () => {
    engine.triggerSteamDrop(30);
  });

  document.getElementById('btn-inject-feed-surge')?.addEventListener('click', () => {
    engine.triggerFeedSurge(20);
  });

  document.getElementById('btn-restore-disturbances')?.addEventListener('click', () => {
    engine.restoreSteam();
    engine.clearFeedSurge();
  });

  // Global Pause & Reset
  const btnPause = document.getElementById('btn-global-pause');
  btnPause?.addEventListener('click', () => {
    engine.isRunning = !engine.isRunning;
    btnPause.textContent = engine.isRunning ? 'Pause' : 'Resume';
    btnPause.classList.toggle('warn', !engine.isRunning);
  });

  document.getElementById('btn-global-reset')?.addEventListener('click', () => {
    engine.reset();
    stripChart?.clear();
  });

  // Camera Reset
  document.getElementById('btn-camera-reset')?.addEventListener('click', () => {
    if (heatExchanger3D) {
      heatExchanger3D.camera.position.set(12, 9, 16);
      heatExchanger3D.camera.lookAt(heatExchanger3D.camTarget);
    }
  });

  // Tuning Sliders
  const sliderKc2 = document.getElementById('slider-kc2');
  const valKc2 = document.getElementById('val-kc2');
  sliderKc2?.addEventListener('input', (e) => {
    const v = parseFloat(e.target.value);
    engine.casSecondaryPID.Kc = v;
    if (valKc2) valKc2.textContent = v.toFixed(1);
  });

  const sliderKc1 = document.getElementById('slider-kc1');
  const valKc1 = document.getElementById('val-kc1');
  sliderKc1?.addEventListener('input', (e) => {
    const v = parseFloat(e.target.value);
    engine.casPrimaryPID.Kc = v;
    if (valKc1) valKc1.textContent = v.toFixed(1);
  });

  const sliderSpeed = document.getElementById('slider-sim-speed');
  const valSpeed = document.getElementById('val-sim-speed');
  sliderSpeed?.addEventListener('input', (e) => {
    const v = parseFloat(e.target.value);
    engine.speedMultiplier = v;
    if (valSpeed) valSpeed.textContent = `${v.toFixed(1)}x`;
  });

  // Stiction Sliders
  const sliderDeadband = document.getElementById('slider-stiction-deadband');
  const valDeadband = document.getElementById('val-stiction-deadband');
  const sliderSlip = document.getElementById('slider-stiction-slip');
  const valSlip = document.getElementById('val-stiction-slip');

  const updateStiction = () => {
    const db = parseFloat(sliderDeadband?.value || 0);
    const sl = parseFloat(sliderSlip?.value || 0);
    engine.setStiction(db, sl);
    if (valDeadband) valDeadband.textContent = `${db.toFixed(1)}%`;
    if (valSlip) valSlip.textContent = `${sl.toFixed(1)}%`;
  };

  sliderDeadband?.addEventListener('input', updateStiction);
  sliderSlip?.addEventListener('input', updateStiction);

  // Valve Characteristics Buttons
  const btnCharLin = document.getElementById('btn-char-linear');
  const btnCharEq = document.getElementById('btn-char-eq');
  const btnCharQk = document.getElementById('btn-char-quick');
  const charBtns = [btnCharLin, btnCharEq, btnCharQk];

  const setChar = (charType, activeBtn) => {
    engine.casValve.characteristic = charType;
    engine.convValve.characteristic = charType;
    charBtns.forEach(b => b?.classList.remove('active'));
    activeBtn?.classList.add('active');
  };

  btnCharLin?.addEventListener('click', () => setChar('LINEAR', btnCharLin));
  btnCharEq?.addEventListener('click', () => setChar('EQUAL_PCT', btnCharEq));
  btnCharQk?.addEventListener('click', () => setChar('QUICK_OPEN', btnCharQk));

  // Characterizer f(x) toggle
  const btnFxOff = document.getElementById('btn-char-off');
  const btnFxOn = document.getElementById('btn-char-on');
  btnFxOff?.addEventListener('click', () => {
    engine.casValve.useCharacterizer = false;
    btnFxOff.classList.add('active');
    btnFxOn.classList.remove('active');
  });
  btnFxOn?.addEventListener('click', () => {
    engine.casValve.useCharacterizer = true;
    btnFxOn.classList.add('active');
    btnFxOff.classList.remove('active');
  });

  // Chart Pen Toggles
  const bindPen = (checkId, penId) => {
    const chk = document.getElementById(checkId);
    chk?.addEventListener('change', (e) => {
      stripChart?.setPenVisibility(penId, e.target.checked);
    });
  };

  bindPen('pen-cas-pv', 'casPriPV');
  bindPen('pen-conv-pv', 'convPV');
  bindPen('pen-steam-pv', 'casSecPV');
  bindPen('pen-valve-pos', 'casValvePos');
  bindPen('pen-steam-press', 'steamPressure');

  document.getElementById('btn-chart-clear')?.addEventListener('click', () => {
    stripChart?.clear();
  });

  // Projector Mode Toggle
  const btnProjector = document.getElementById('btn-projector-mode');
  btnProjector?.addEventListener('click', () => {
    const isProj = stripChart?.toggleProjectorMode();
    document.body.classList.toggle('projector-mode', !!isProj);
    btnProjector.classList.toggle('active', !!isProj);
    btnProjector.textContent = isProj ? '📽️ Projector Mode: ON' : '📽️ Projector Mode';
    setTimeout(() => {
      stripChart?.resize();
      heatExchanger3D?.resize();
    }, 50);
  });

  // 8. 60Hz Master Simulation & Animation Loop
  const simTimeDisplay = document.getElementById('header-sim-time');
  const kpiCasDev = document.getElementById('kpi-cas-dev');
  const kpiConvDev = document.getElementById('kpi-conv-dev');
  const kpiSuppressionBadge = document.getElementById('kpi-suppression-badge');

  let lastFrameTime = performance.now();
  function simLoop(now) {
    requestAnimationFrame(simLoop);

    const elapsed = now - lastFrameTime;
    lastFrameTime = now;

    // Advance physics simulation
    const snapshot = engine.step(1);

    // Update 3D scene
    heatExchanger3D?.updateState(snapshot);
    if (valve3D) {
      valve3D.setStemPosition(snapshot.casValvePos);
    }

    // Update Strip Chart
    if (stripChart) {
      stripChart.addPoint(snapshot);
      stripChart.render();
    }

    // Update Faceplates
    fpTIC?.updateDisplay();
    fpFIC?.updateDisplay();

    // Update Live Projector KPI Readouts
    if (kpiCasDev && kpiConvDev) {
      const casDev = Math.abs(snapshot.casPriSP - snapshot.casPriPV);
      const convDev = Math.abs(snapshot.casPriSP - snapshot.convPV);
      kpiCasDev.textContent = `${casDev.toFixed(1)}°C`;
      kpiConvDev.textContent = `${convDev.toFixed(1)}°C`;

      if (kpiSuppressionBadge) {
        if (convDev > 2.0 && casDev < 1.0) {
          const ratio = Math.max(2, Math.round(convDev / Math.max(0.15, casDev)));
          kpiSuppressionBadge.innerHTML = `Cascade Advantage: <strong>${ratio}x Better</strong>`;
          kpiSuppressionBadge.className = 'kpi-chip badge alert';
        } else {
          kpiSuppressionBadge.innerHTML = `Suppression: <strong>Tight (<0.5°C)</strong>`;
          kpiSuppressionBadge.className = 'kpi-chip badge';
        }
      }
    }

    // Update clock
    if (simTimeDisplay) {
      simTimeDisplay.textContent = `${snapshot.time.toFixed(1)}m`;
    }
  }

  requestAnimationFrame(simLoop);
});
