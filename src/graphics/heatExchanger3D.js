import * as THREE from 'three';

/**
 * 3D Industrial Distillation Column Reboiler & Heat Exchanger Simulation
 * Modeled after ILM 310305e Figures 1, 3, 10, and 22.
 */
export class HeatExchanger3D {
  constructor(containerElement) {
    this.container = containerElement;
    this.width = containerElement.clientWidth || 600;
    this.height = containerElement.clientHeight || 400;

    // Three.js Scene, Camera, Renderer
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0d1322);

    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
    this.camera.position.set(12, 9, 16);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);

    // Orbit interaction state
    this.isDragging = false;
    this.prevMouse = { x: 0, y: 0 };
    this.camTarget = new THREE.Vector3(0, 2, 0);
    this.camera.lookAt(this.camTarget);

    this.initLights();
    this.initEquipment();
    this.initParticles();
    this.setupInteraction();

    // Resize handler
    this.onResize = () => this.resize();
    window.addEventListener('resize', this.onResize);

    this.clock = new THREE.Clock();
    this.animate();
  }

  initLights() {
    const ambient = new THREE.AmbientLight(0x94a3b8, 1.2);
    this.scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(15, 20, 10);
    dirLight.castShadow = true;
    this.scene.add(dirLight);

    const blueRim = new THREE.DirectionalLight(0x38bdf8, 1.5);
    blueRim.position.set(-10, 10, -10);
    this.scene.add(blueRim);
  }

  initEquipment() {
    this.equipmentGroup = new THREE.Group();
    this.scene.add(this.equipmentGroup);

    // 1. Concrete Industrial Pedestal
    const baseGeo = new THREE.BoxGeometry(20, 0.8, 14);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.4;
    this.equipmentGroup.add(baseMesh);

    // 2. Distillation Column Base (Tower)
    const towerGeo = new THREE.CylinderGeometry(2.5, 2.5, 9, 32);
    const towerMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.6,
      roughness: 0.3
    });
    this.tower = new THREE.Mesh(towerGeo, towerMat);
    this.tower.position.set(-5.5, 4.5, 0);
    this.equipmentGroup.add(this.tower);

    // Column sight glass (liquid level)
    const glassGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 16);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
      roughness: 0.1,
      transmission: 0.9
    });
    const sightGlass = new THREE.Mesh(glassGeo, glassMat);
    sightGlass.position.set(-3.0, 3.0, 1.5);
    this.equipmentGroup.add(sightGlass);

    // 3. Shell and Tube Heat Exchanger (Reboiler)
    // Outer Shell (Cylindrical horizontal body)
    const shellGeo = new THREE.CylinderGeometry(1.6, 1.6, 7, 32);
    const shellMat = new THREE.MeshPhysicalMaterial({
      color: 0x475569,
      metalness: 0.5,
      roughness: 0.2,
      transparent: true,
      opacity: 0.75
    });
    this.exchanger = new THREE.Mesh(shellGeo, shellMat);
    this.exchanger.rotation.z = Math.PI / 2;
    this.exchanger.position.set(2.5, 2.5, 0);
    this.equipmentGroup.add(this.exchanger);

    // Exchanger tube bundle inside shell
    this.tubesGroup = new THREE.Group();
    const tubeGeo = new THREE.CylinderGeometry(0.12, 0.12, 6.6, 12);
    this.tubeMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0xd97706,
      emissiveIntensity: 0.3
    });

    for (let r = -0.9; r <= 0.9; r += 0.45) {
      for (let y = -0.9; y <= 0.9; y += 0.45) {
        if (r * r + y * y < 1.0) {
          const tube = new THREE.Mesh(tubeGeo, this.tubeMaterial);
          tube.rotation.z = Math.PI / 2;
          tube.position.set(2.5, 2.5 + y, r);
          this.tubesGroup.add(tube);
        }
      }
    }
    this.equipmentGroup.add(this.tubesGroup);

    // Exchanger Saddle Supports
    const saddleGeo = new THREE.BoxGeometry(0.8, 1.2, 3.4);
    const saddleMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
    const s1 = new THREE.Mesh(saddleGeo, saddleMat);
    s1.position.set(0.5, 0.6, 0);
    const s2 = new THREE.Mesh(saddleGeo, saddleMat);
    s2.position.set(4.5, 0.6, 0);
    this.equipmentGroup.add(s1, s2);

    // 4. Connecting Process Pipes (Bottom liquid to exchanger, vapor return)
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.7, roughness: 0.2 });
    
    // Liquid draw line (Tower bottom to Exchanger inlet)
    const pipe1 = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 3.2, 16), pipeMat);
    pipe1.rotation.z = Math.PI / 2;
    pipe1.position.set(-1.8, 1.2, 0);
    this.equipmentGroup.add(pipe1);

    // Vapor return line (Exchanger top to Tower return)
    const pipe2 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 3.2, 16), pipeMat);
    pipe2.rotation.z = Math.PI / 2;
    pipe2.position.set(-1.8, 4.0, 0);
    this.equipmentGroup.add(pipe2);

    // 5. Steam Supply Line with Pneumatic Control Valve
    // Steam pipe running vertically from ceiling
    const steamPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 4.5, 16), pipeMat);
    steamPipe.position.set(2.5, 6.0, 0);
    this.equipmentGroup.add(steamPipe);

    // Pneumatic Control Valve Body & Actuator
    this.valveGroup = new THREE.Group();
    this.valveGroup.position.set(2.5, 5.5, 0);

    // Valve body (globe flange)
    const valveBodyGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.8, 16);
    const valveBodyMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.6, roughness: 0.3 });
    const valveBody = new THREE.Mesh(valveBodyGeo, valveBodyMat);
    valveBody.rotation.z = Math.PI / 2;
    this.valveGroup.add(valveBody);

    // Actuator Diaphragm Dome
    const domeGeo = new THREE.SphereGeometry(0.8, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshStandardMaterial({ color: 0x0369a1, metalness: 0.5, roughness: 0.3 });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.set(0, 1.4, 0);
    this.valveGroup.add(dome);

    // Actuator Yoke
    const yokeGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.2, 8);
    const yokeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 });
    const y1 = new THREE.Mesh(yokeGeo, yokeMat);
    y1.position.set(-0.3, 0.7, 0);
    const y2 = new THREE.Mesh(yokeGeo, yokeMat);
    y2.position.set(0.3, 0.7, 0);
    this.valveGroup.add(y1, y2);

    // Moving Valve Stem & Indicator Plate
    this.stemMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.1, 8), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9 }));
    this.stemMesh.position.set(0, 0.7, 0);
    this.valveGroup.add(this.stemMesh);

    // Valve Positioner Box (Smart Positioner FY-101 / VP-101)
    const posBoxGeo = new THREE.BoxGeometry(0.5, 0.6, 0.4);
    const posBoxMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.4 });
    const posBox = new THREE.Mesh(posBoxGeo, posBoxMat);
    posBox.position.set(0.55, 0.7, 0);
    this.valveGroup.add(posBox);

    // Positioner feedback arm
    this.feedbackArm = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.04, 0.04), new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
    this.feedbackArm.position.set(0.2, 0.7, 0);
    this.valveGroup.add(this.feedbackArm);

    this.equipmentGroup.add(this.valveGroup);

    // 6. Steam Header Pressure Gauge
    const gaugeGroup = new THREE.Group();
    gaugeGroup.position.set(3.5, 7.2, 0);

    const dialGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 24);
    const dialMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc });
    const dial = new THREE.Mesh(dialGeo, dialMat);
    dial.rotation.x = Math.PI / 2;
    gaugeGroup.add(dial);

    // Needle
    this.needle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.32, 0.02), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    this.needle.position.set(0, 0.08, 0.06);
    gaugeGroup.add(this.needle);

    this.equipmentGroup.add(gaugeGroup);
  }

  initParticles() {
    // Glowing steam particles entering heat exchanger shell
    this.particleCount = 120;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(this.particleCount * 3);
    this.particleVels = [];

    for (let i = 0; i < this.particleCount; i++) {
      pos[i * 3 + 0] = 2.5 + (Math.random() - 0.5) * 1.8;
      pos[i * 3 + 1] = 2.5 + (Math.random() - 0.5) * 1.8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5.0;
      this.particleVels.push({
        z: 0.02 + Math.random() * 0.04,
        rot: Math.random() * Math.PI
      });
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const mat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.22,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    this.steamParticles = new THREE.Points(geo, mat);
    this.equipmentGroup.add(this.steamParticles);
  }

  setupInteraction() {
    const el = this.renderer.domElement;
    el.style.cursor = 'grab';

    el.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.prevMouse = { x: e.clientX, y: e.clientY };
      el.style.cursor = 'grabbing';
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
      el.style.cursor = 'grab';
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.prevMouse.x;
      const dy = e.clientY - this.prevMouse.y;
      this.prevMouse = { x: e.clientX, y: e.clientY };

      // Orbit around center
      const rotSpeed = 0.006;
      const x = this.camera.position.x - this.camTarget.x;
      const z = this.camera.position.z - this.camTarget.z;
      const radius = Math.sqrt(x * x + z * z);
      let angle = Math.atan2(z, x) - dx * rotSpeed;

      this.camera.position.x = this.camTarget.x + radius * Math.cos(angle);
      this.camera.position.z = this.camTarget.z + radius * Math.sin(angle);
      this.camera.position.y = Math.max(2, Math.min(22, this.camera.position.y - dy * 0.04));
      this.camera.lookAt(this.camTarget);
    });

    el.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY * 0.01;
      const dir = this.camera.position.clone().sub(this.camTarget).normalize();
      const dist = this.camera.position.distanceTo(this.camTarget);
      const newDist = Math.max(8, Math.min(32, dist + zoomFactor));
      this.camera.position.copy(this.camTarget).add(dir.multiplyScalar(newDist));
    }, { passive: false });
  }

  /**
   * Update 3D visualization to match live simulation values
   * @param {Object} state - State snapshot from CascadeSimulationEngine
   */
  updateState(state) {
    if (!state) return;

    // 1. Valve stem position & feedback arm
    const stemFrac = (state.casValvePos !== undefined ? state.casValvePos : 50) / 100.0;
    // Lower stem as valve opens (ATO)
    this.stemMesh.position.y = 0.55 + stemFrac * 0.25;
    this.feedbackArm.position.y = 0.55 + stemFrac * 0.25;

    // 2. Steam pressure gauge needle rotation (-45 deg to +45 deg)
    const pressFrac = (state.steamPressure !== undefined ? state.steamPressure : 100) / 100.0;
    this.needle.rotation.z = (1.0 - pressFrac) * 1.5;

    // 3. Tube color gradient based on reboiler temperature PV
    // 80°C = cool cyan (0x06b6d4), 120°C = nominal amber (0xf59e0b), 150°C = hot red (0xef4444)
    const tempPV = state.casPriPV || 120;
    const tempNorm = Math.max(0, Math.min(1, (tempPV - 80) / 70.0));
    const targetColor = new THREE.Color().lerpColors(
      new THREE.Color(0x06b6d4),
      new THREE.Color(0xef4444),
      tempNorm
    );
    this.tubeMaterial.color.copy(targetColor);
    this.tubeMaterial.emissive.copy(targetColor);
    this.tubeMaterial.emissiveIntensity = 0.2 + tempNorm * 0.4;

    // 4. Steam particles speed & opacity based on flow PV
    const flowPV = state.casSecPV || 50;
    const flowSpeed = Math.max(0.01, (flowPV / 100.0) * 0.08);
    this.currentFlowSpeed = flowSpeed;
    this.steamParticles.material.opacity = Math.max(0.2, (flowPV / 100.0) * 0.85);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();

    // Animate steam particles
    if (this.steamParticles) {
      const positions = this.steamParticles.geometry.attributes.position.array;
      const speed = this.currentFlowSpeed || 0.03;
      for (let i = 0; i < this.particleCount; i++) {
        positions[i * 3 + 2] += speed;
        if (positions[i * 3 + 2] > 2.5) {
          positions[i * 3 + 2] = -2.5;
        }
      }
      this.steamParticles.geometry.attributes.position.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    if (!this.container) return;
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  destroy() {
    window.removeEventListener('resize', this.onResize);
    this.renderer.dispose();
  }
}
