import * as THREE from 'three';

/**
 * 3D Cutaway Pneumatic Control Valve & Actuator with Valve Positioner
 * Features:
 * - Cutaway diaphragm casing showing flexible diaphragm & range spring
 * - Travel indicator plate (0 - 100% stroke)
 * - Packing box showing friction / stiction
 * - Valve body cutaway with seat ring and contoured plug
 * - Mounted smart valve positioner with feedback arm
 */
export class Valve3D {
  constructor(containerElement) {
    this.container = containerElement;
    this.width = containerElement.clientWidth || 500;
    this.height = containerElement.clientHeight || 400;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0f1d);

    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 3.5, 9.5);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);

    this.camTarget = new THREE.Vector3(0, 2.5, 0);
    this.camera.lookAt(this.camTarget);

    this.isDragging = false;
    this.prevMouse = { x: 0, y: 0 };

    this.initLights();
    this.initModel();
    this.setupInteraction();

    this.onResize = () => this.resize();
    window.addEventListener('resize', this.onResize);

    this.currentStroke = 0.5; // 50%
    this.targetStroke = 0.5;
    this.animate();
  }

  initLights() {
    this.scene.add(new THREE.AmbientLight(0xcfd8dc, 1.4));
    const dir = new THREE.DirectionalLight(0xffffff, 2.2);
    dir.position.set(10, 15, 12);
    dir.castShadow = true;
    this.scene.add(dir);

    const rim = new THREE.DirectionalLight(0x06b6d4, 1.2);
    rim.position.set(-8, 8, -6);
    this.scene.add(rim);
  }

  initModel() {
    this.valveGroup = new THREE.Group();
    this.scene.add(this.valveGroup);

    // 1. Actuator Upper & Lower Diaphragm Casing (Cutaway half-cylinder / dome)
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.6,
      roughness: 0.3,
      side: THREE.DoubleSide
    });
    // Upper case (semi-dome)
    const upperCase = new THREE.Mesh(
      new THREE.SphereGeometry(1.8, 32, 16, 0, Math.PI, 0, Math.PI / 2),
      domeMat
    );
    upperCase.rotation.y = Math.PI / 2;
    upperCase.position.set(0, 5.2, 0);
    this.valveGroup.add(upperCase);

    // Lower case
    const lowerCase = new THREE.Mesh(
      new THREE.SphereGeometry(1.8, 32, 16, 0, Math.PI, Math.PI / 2, Math.PI / 2),
      domeMat
    );
    lowerCase.rotation.y = Math.PI / 2;
    lowerCase.position.set(0, 5.2, 0);
    this.valveGroup.add(lowerCase);

    // Diaphragm Disc (moves with air pressure)
    const discGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.1, 32);
    const discMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });
    this.diaphragmDisc = new THREE.Mesh(discGeo, discMat);
    this.diaphragmDisc.position.set(0, 5.2, 0);
    this.valveGroup.add(this.diaphragmDisc);

    // Heavy Range Spring
    const springGroup = new THREE.Group();
    const coilMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 });
    const coils = 5;
    for (let i = 0; i < coils; i++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.08, 12, 24), coilMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 4.2 + (i * 0.22);
      springGroup.add(ring);
    }
    this.springGroup = springGroup;
    this.valveGroup.add(springGroup);

    // 2. Yoke Legs
    const yokeMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
    const y1 = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 2.2, 12), yokeMat);
    y1.position.set(-0.8, 3.2, 0);
    const y2 = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 2.2, 12), yokeMat);
    y2.position.set(0.8, 3.2, 0);
    this.valveGroup.add(y1, y2);

    // Stem Travel Scale Plate (0 to 100%)
    const scalePlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 1.4, 0.04),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
    );
    scalePlate.position.set(0.85, 3.2, 0.15);
    this.valveGroup.add(scalePlate);

    // Travel Pointer
    this.pointer = new THREE.Mesh(
      new THREE.ConeGeometry(0.08, 0.2, 8),
      new THREE.MeshBasicMaterial({ color: 0xef4444 })
    );
    this.pointer.rotation.z = Math.PI / 2;
    this.pointer.position.set(0.7, 3.2, 0.15);
    this.valveGroup.add(this.pointer);

    // 3. Central Valve Stem
    const stemMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.9, roughness: 0.1 });
    this.stem = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4.0, 16), stemMat);
    this.stem.position.set(0, 3.2, 0);
    this.valveGroup.add(this.stem);

    // 4. Valve Packing Box & Gland
    const glandGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.6, 16);
    const glandMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.7 });
    const gland = new THREE.Mesh(glandGeo, glandMat);
    gland.position.set(0, 2.0, 0);
    this.valveGroup.add(gland);

    // 5. Valve Body Cutaway (Globe Body)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0f766e,
      metalness: 0.5,
      roughness: 0.4,
      side: THREE.DoubleSide
    });
    // Semi-cylindrical cutaway body
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 1.4, 2.0, 32, 1, false, 0, Math.PI * 1.5),
      bodyMat
    );
    body.position.set(0, 1.0, 0);
    this.valveGroup.add(body);

    // Flanged end pipes
    const flangeMat = new THREE.MeshStandardMaterial({ color: 0x115e59, metalness: 0.6 });
    const fIn = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.4, 20), flangeMat);
    fIn.rotation.z = Math.PI / 2;
    fIn.position.set(-1.8, 0.9, 0);
    const fOut = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.4, 20), flangeMat);
    fOut.rotation.z = Math.PI / 2;
    fOut.position.set(1.8, 0.9, 0);
    this.valveGroup.add(fIn, fOut);

    // Valve Seat Ring
    const seatRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.5, 0.08, 12, 24),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9 })
    );
    seatRing.rotation.x = Math.PI / 2;
    seatRing.position.set(0, 0.8, 0);
    this.valveGroup.add(seatRing);

    // Contoured Valve Plug
    const plugGeo = new THREE.ConeGeometry(0.45, 0.6, 24);
    const plugMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.1 });
    this.plug = new THREE.Mesh(plugGeo, plugMat);
    this.plug.position.set(0, 1.2, 0);
    this.valveGroup.add(this.plug);

    // 6. Smart Valve Positioner (FY-101) with Feedback Arm
    const posGeo = new THREE.BoxGeometry(0.8, 1.0, 0.6);
    const posMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.3 });
    const posBox = new THREE.Mesh(posGeo, posMat);
    posBox.position.set(-1.2, 3.2, 0);
    this.valveGroup.add(posBox);

    // Digital Display Window on Positioner
    const lcd = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.25, 0.04),
      new THREE.MeshBasicMaterial({ color: 0x10b981 })
    );
    lcd.position.set(-1.2, 3.4, 0.31);
    this.valveGroup.add(lcd);

    // Positioner Mechanical Feedback Arm
    this.posArm = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.06, 0.06),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.6 })
    );
    this.posArm.position.set(-0.5, 3.2, 0);
    this.valveGroup.add(this.posArm);
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

      const rotSpeed = 0.007;
      const x = this.camera.position.x - this.camTarget.x;
      const z = this.camera.position.z - this.camTarget.z;
      const radius = Math.sqrt(x * x + z * z);
      let angle = Math.atan2(z, x) - dx * rotSpeed;

      this.camera.position.x = this.camTarget.x + radius * Math.cos(angle);
      this.camera.position.z = this.camTarget.z + radius * Math.sin(angle);
      this.camera.position.y = Math.max(1, Math.min(10, this.camera.position.y - dy * 0.02));
      this.camera.lookAt(this.camTarget);
    });

    el.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoom = e.deltaY * 0.008;
      const dir = this.camera.position.clone().sub(this.camTarget).normalize();
      const dist = this.camera.position.distanceTo(this.camTarget);
      const newDist = Math.max(4.5, Math.min(18, dist + zoom));
      this.camera.position.copy(this.camTarget).add(dir.multiplyScalar(newDist));
    }, { passive: false });
  }

  setStemPosition(percent) {
    this.targetStroke = Math.max(0, Math.min(100, percent)) / 100.0;
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Smooth lerp to target stroke
    this.currentStroke += (this.targetStroke - this.currentStroke) * 0.15;
    const stroke = this.currentStroke;

    // Movement: 0% stroke = closed (plug on seat at y=0.85)
    // 100% stroke = fully open (plug up at y=1.45)
    const plugY = 0.85 + stroke * 0.6;
    if (this.plug) this.plug.position.y = plugY;
    if (this.stem) this.stem.position.y = 2.85 + stroke * 0.6;
    if (this.diaphragmDisc) this.diaphragmDisc.position.y = 4.85 + stroke * 0.6;
    if (this.pointer) this.pointer.position.y = 2.6 + stroke * 1.2;
    if (this.posArm) this.posArm.position.y = 2.6 + stroke * 1.2;

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
