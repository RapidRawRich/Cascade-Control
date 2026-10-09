import * as THREE from 'three';

/**
 * 3D Industrial Catalyst Regeneration Furnace & Air Preheater
 * Modeled after ILM 310305e Figures 8, 18, 20, 31 (Temp-to-Temp Cascade)
 */
export class Furnace3D {
  constructor(containerElement) {
    this.container = containerElement;
    this.width = containerElement.clientWidth || 550;
    this.height = containerElement.clientHeight || 400;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0e1320);

    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
    this.camera.position.set(10, 8, 14);

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
    this.initFurnaceAndRegenerator();
    this.initFlames();
    this.setupInteraction();

    this.onResize = () => this.resize();
    window.addEventListener('resize', this.onResize);

    this.clock = new THREE.Clock();
    this.flameIntensity = 0.5;
    this.animate();
  }

  initLights() {
    this.scene.add(new THREE.AmbientLight(0x64748b, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 2.0);
    dir.position.set(12, 16, 10);
    this.scene.add(dir);

    // Dynamic fire point light
    this.fireLight = new THREE.PointLight(0xf97316, 3.0, 15);
    this.fireLight.position.set(-3.5, 2.0, 0);
    this.scene.add(this.fireLight);
  }

  initFurnaceAndRegenerator() {
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // Foundation pad
    const pad = new THREE.Mesh(
      new THREE.BoxGeometry(16, 0.6, 10),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 })
    );
    pad.position.y = -0.3;
    this.group.add(pad);

    // 1. Direct-Fired Air Furnace (TIC-201 secondary loop)
    const furnaceMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.4,
      roughness: 0.5
    });
    // Vertical cylindrical furnace
    const furnace = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 6.0, 32), furnaceMat);
    furnace.position.set(-4.0, 3.0, 0);
    this.group.add(furnace);

    // Furnace viewing window / cutaway showing fire
    const winMat = new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.85 });
    const win = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.6, 0.2), winMat);
    win.position.set(-4.0, 2.2, 2.0);
    this.group.add(win);

    // Burner fuel supply line (FY-101 valve)
    const fuelPipe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 2.5, 12),
      new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.7 })
    );
    fuelPipe.rotation.z = Math.PI / 2;
    fuelPipe.position.set(-6.0, 1.0, 0);
    this.group.add(fuelPipe);

    // Thermocouple TT-201 on furnace outlet duct
    const tc201 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.8, 8),
      new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x0891b2, emissiveIntensity: 0.6 })
    );
    tc201.position.set(-2.0, 5.8, 0);
    this.group.add(tc201);

    // 2. Hot Gases Transfer Duct from Furnace to Regenerator
    const ductMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.6 });
    const duct = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 4.0, 16), ductMat);
    duct.rotation.z = Math.PI / 2;
    duct.position.set(-0.5, 5.0, 0);
    this.group.add(duct);

    // 3. Catalyst Regenerator Vessel (TIC-101 primary loop)
    const regenMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.6,
      roughness: 0.3
    });
    const regen = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 8.0, 32), regenMat);
    regen.position.set(3.5, 4.0, 0);
    this.group.add(regen);

    // Regenerator top cone & cyclone separator
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(2.4, 1.8, 32),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7 })
    );
    cone.position.set(3.5, 8.9, 0);
    this.group.add(cone);

    // Primary Thermocouple TT-101 in catalyst bed
    const tc101 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 1.0, 8),
      new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xe11d48, emissiveIntensity: 0.6 })
    );
    tc101.position.set(3.5, 4.0, 2.5);
    this.group.add(tc101);
  }

  initFlames() {
    this.flameCount = 80;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(this.flameCount * 3);
    this.flameVels = [];

    for (let i = 0; i < this.flameCount; i++) {
      pos[i * 3 + 0] = -4.0 + (Math.random() - 0.5) * 1.0;
      pos[i * 3 + 1] = 1.2 + Math.random() * 1.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.0;
      this.flameVels.push({
        y: 0.03 + Math.random() * 0.05,
        life: Math.random()
      });
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xfbbf24,
      size: 0.35,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    this.flameParticles = new THREE.Points(geo, mat);
    this.group.add(this.flameParticles);
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
      this.camera.position.y = Math.max(1, Math.min(18, this.camera.position.y - dy * 0.03));
      this.camera.lookAt(this.camTarget);
    });

    el.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoom = e.deltaY * 0.01;
      const dir = this.camera.position.clone().sub(this.camTarget).normalize();
      const dist = this.camera.position.distanceTo(this.camTarget);
      const newDist = Math.max(8, Math.min(26, dist + zoom));
      this.camera.position.copy(this.camTarget).add(dir.multiplyScalar(newDist));
    }, { passive: false });
  }

  setFuelOutput(percent) {
    this.flameIntensity = Math.max(0.1, Math.min(1.0, percent / 100.0));
    if (this.fireLight) {
      this.fireLight.intensity = 1.0 + this.flameIntensity * 4.0;
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();

    // Animate flame flicker
    if (this.flameParticles) {
      const positions = this.flameParticles.geometry.attributes.position.array;
      for (let i = 0; i < this.flameCount; i++) {
        positions[i * 3 + 1] += this.flameVels[i].y * (0.8 + this.flameIntensity * 0.5);
        if (positions[i * 3 + 1] > 2.8 + this.flameIntensity * 1.2) {
          positions[i * 3 + 1] = 1.2;
          positions[i * 3 + 0] = -4.0 + (Math.random() - 0.5) * 1.0;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 1.0;
        }
      }
      this.flameParticles.geometry.attributes.position.needsUpdate = true;
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
