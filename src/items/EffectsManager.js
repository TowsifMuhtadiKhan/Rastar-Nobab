import * as THREE from 'three';

export class EffectsManager {
  constructor(scene) {
    this.scene = scene;
    this.shockwaves = [];
    this.sparks = [];
    this.floatingTexts = [];

    // Container for HTML 2D floating tags
    this.uiContainer = document.getElementById('floating-ui-layer');

    // Ring geometry for shockwave
    this.ringGeo = new THREE.RingGeometry(0.3, 0.6, 24);
    this.ringMat = new THREE.MeshBasicMaterial({
      color: 0xff0044,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });
  }

  // Blasts visible supersonic shockwave rings when horn is pressed
  createHornShockwave(x, y, z) {
    for (let i = 0; i < 3; i++) {
      const mesh = new THREE.Mesh(this.ringGeo.clone(), this.ringMat.clone());
      mesh.position.set(x, y + 1.8, z - i * 1.5);
      mesh.rotation.y = 0;
      this.scene.add(mesh);

      this.shockwaves.push({
        mesh: mesh,
        scale: 0.8,
        opacity: 0.9,
        speed: 40 + i * 10,
        delay: i * 0.05
      });
    }
  }

  // Crash Spark Explosion
  createCrashSparks(x, y, z, count = 15) {
    for (let i = 0; i < count; i++) {
      const geo = new THREE.SphereGeometry(0.08, 6, 6);
      const mat = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.5 ? 0xffaa00 : 0xff3300
      });
      const spark = new THREE.Mesh(geo, mat);
      spark.position.set(x, y + 0.8, z);
      this.scene.add(spark);

      const vx = (Math.random() - 0.5) * 12;
      const vy = Math.random() * 8 + 3;
      const vz = (Math.random() - 0.5) * 12;

      this.sparks.push({
        mesh: spark,
        vx: vx,
        vy: vy,
        vz: vz,
        life: 0.6
      });
    }
  }

  // Floating comic popup banner
  showFloatingText(text, color = '#ffeb3b', size = '26px') {
    if (!this.uiContainer) return;

    const el = document.createElement('div');
    el.className = 'floating-tag';
    el.innerText = text;
    el.style.color = color;
    el.style.fontSize = size;
    el.style.left = `${window.innerWidth / 2 + (Math.random() * 200 - 100)}px`;
    el.style.top = `${window.innerHeight * 0.45 + (Math.random() * 100 - 50)}px`;

    this.uiContainer.appendChild(el);

    setTimeout(() => {
      el.classList.add('fly-up');
    }, 20);

    setTimeout(() => {
      el.remove();
    }, 1200);
  }

  update(delta) {
    // 1. Update Horn Shockwaves
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      if (sw.delay > 0) {
        sw.delay -= delta;
        continue;
      }

      sw.scale += delta * 12;
      sw.mesh.scale.set(sw.scale, sw.scale, sw.scale);
      sw.mesh.position.z -= sw.speed * delta;
      sw.opacity -= delta * 1.6;
      sw.mesh.material.opacity = Math.max(0, sw.opacity);

      if (sw.opacity <= 0) {
        this.scene.remove(sw.mesh);
        this.shockwaves.splice(i, 1);
      }
    }

    // 2. Update Sparks
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i];
      s.mesh.position.x += s.vx * delta;
      s.mesh.position.y += s.vy * delta;
      s.mesh.position.z += s.vz * delta;
      s.vy -= 22 * delta; // Gravity
      s.life -= delta;

      if (s.life <= 0 || s.mesh.position.y < 0) {
        this.scene.remove(s.mesh);
        this.sparks.splice(i, 1);
      }
    }
  }

  reset() {
    for (const sw of this.shockwaves) this.scene.remove(sw.mesh);
    for (const s of this.sparks) this.scene.remove(s.mesh);
    this.shockwaves = [];
    this.sparks = [];
  }
}
