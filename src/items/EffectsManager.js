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

  // Authentic Comic Dhapash Impact & Dhaka Street Gali System
  createDhapashImpact(x, y, z, camera, customWord = null, customGali = null, bonusTaka = null) {
    if (!this.uiContainer) return '';

    // Convert 3D world hit coordinates to 2D screen coordinates
    let sx = window.innerWidth / 2;
    let sy = window.innerHeight * 0.45;

    if (camera) {
      const v = new THREE.Vector3(x, y + 0.6, z);
      v.project(camera);
      // Only project if roughly in front of camera
      if (v.z <= 1.0) {
        sx = (v.x * 0.5 + 0.5) * window.innerWidth;
        sy = (-v.y * 0.5 + 0.5) * window.innerHeight;
      }
    }

    // Keep comfortably within visible screen edges
    sx = Math.max(90, Math.min(window.innerWidth - 90, sx));
    sy = Math.max(100, Math.min(window.innerHeight - 110, sy));

    const words = ['ধপাস!', 'ধড়াম!', 'পটাস!', 'ঠাস!', 'ধপাস!', 'চুরমার!', 'ভ্যাবাচ্যাকা!'];
    const word = customWord || words[Math.floor(Math.random() * words.length)];

    // 1. Spiked Comic Starburst Badge (💥 ধপাস!)
    const burst = document.createElement('div');
    burst.className = 'dhapash-starburst';
    burst.style.left = `${sx}px`;
    burst.style.top = `${sy}px`;
    burst.innerHTML = `
      <svg class="dhapash-star-svg" viewBox="0 0 100 100">
        <polygon class="dhapash-star-shape" points="50,2 62,25 88,12 80,38 100,50 80,62 88,88 62,75 50,98 38,75 12,88 20,62 0,50 20,38 12,12 38,25" />
      </svg>
      <span class="dhapash-star-text">${word}</span>
    `;
    this.uiContainer.appendChild(burst);
    setTimeout(() => burst.remove(), 950);

    // 2. Authentic Dhaka Street Gali & Scolding Speech Bubble
    const galiQuotes = [
      "চোখে ঠুলি লাগাইয়া ড্রাইভ করো নাকি?!",
      "শালা টোকাই ড্রাইভার! সাইড দে!",
      "বাপের রাস্তা পাইছো নি বেটা?!",
      "ড্রাইভিং লাইসেন্স কি মিষ্টির দোকান থেইকা কিনছো?!",
      "আরে কানার দল! ব্রেক কি পায়ে ধরে না?!",
      "চৌদ্দগুষ্টির উদ্ধার কইরা দিমু কিন্তু!",
      "এক থাপ্পড়ে মিরপুর থেইকা যাত্রাবাড়ী পাঠামু!",
      "এইডা কি রাজপথ না তোমার ড্রয়িংরুম?!",
      "রাগ করলা? দেইখা চালাও মিয়া ভাই!",
      "ধপাস কইরা মাইরা দিল রে! পুলিশ ডাক!",
      "হাড়গোড় ভাইঙ্গা একাকার কইরা দিমু!",
      "অ্যাক্সিডেন্ট কইরা আবার ভাব লয়?!",
      "মাইর একটাও মাটিতে পড়ব না কইলাম!",
      "আরে ভাইরে ভাই! জ্যান্ত মানুষটারে মাইরা ফালাইল!",
      "চোখ কি পকেটে থুইয়া আইসো?!",
      "থাপ্পড় দিয়া দাঁত ফালাইয়া দিমু!",
      "হাইওয়ে পাইয়া কি উড়োজাহাজ ভাবছো?!",
      "টোকাইয়ের মতো ধাক্কা মারো ক্যান?!",
      "রাস্তার নবাব নামছে রে! জান লইয়া ভাগ!"
    ];
    const quote = customGali || galiQuotes[Math.floor(Math.random() * galiQuotes.length)];

    const bubble = document.createElement('div');
    bubble.className = 'dhaka-gali-bubble';
    bubble.style.left = `${sx}px`;
    bubble.style.top = `${sy - 58}px`;
    bubble.innerHTML = `<span>${quote}</span>`;
    this.uiContainer.appendChild(bubble);
    setTimeout(() => bubble.remove(), 1700);

    // 3. Floating Taka Points Pop
    if (bonusTaka) {
      const taka = document.createElement('div');
      taka.className = 'floating-taka-bonus';
      taka.style.left = `${sx + 55}px`;
      taka.style.top = `${sy - 20}px`;
      taka.innerText = `+৳ ${bonusTaka}`;
      this.uiContainer.appendChild(taka);
      setTimeout(() => taka.remove(), 1250);
    }

    return quote;
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
