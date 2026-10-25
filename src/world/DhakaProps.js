import * as THREE from 'three';

export class DhakaProps {
  constructor(scene) {
    this.scene = scene;
    this.props = [];
    this.spawnTimer = 0;
  }

  // 1. Authentic Dhaka Fuchka-Chotpoti Cart (ফুচকা-চটপটির গাড়ি)
  createFuchkaCart(x, z) {
    const group = new THREE.Group();

    // Wooden Cart Flatbed
    const cartMat = new THREE.MeshStandardMaterial({ color: 0x6d4c41, roughness: 0.8 });
    const bed = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.15, 2.4), cartMat);
    bed.position.y = 0.85;
    bed.castShadow = true;
    group.add(bed);

    // Cart Wheels (4 small bicycle wheels)
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
    for (const wx of [-0.85, 0.85]) {
      for (const wz of [-0.8, 0.8]) {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.08, 12), wheelMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(wx, 0.3, wz);
        group.add(wheel);
      }
    }

    // Glass display case for crispy Fuchka puris
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.5,
      roughness: 0.1,
      metalness: 0.8
    });
    const caseMesh = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.9, 1.2), glassMat);
    caseMesh.position.set(0, 1.38, -0.4);
    group.add(caseMesh);

    // Golden Fuchka Puris inside the glass
    const puriMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });
    for (let p = 0; p < 12; p++) {
      const puri = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), puriMat);
      puri.position.set((Math.random() - 0.5) * 1.0, 1.25 + Math.random() * 0.4, -0.4 + (Math.random() - 0.5) * 0.8);
      group.add(puri);
    }

    // Traditional red fabric canopy
    const canopyMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, side: THREE.DoubleSide });
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 2.6), canopyMat);
    canopy.position.set(0, 2.3, 0);
    canopy.castShadow = true;
    group.add(canopy);

    // Canopy support poles
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 });
    for (const px of [-0.8, 0.8]) {
      for (const pz of [-1.1, 1.1]) {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.4), poleMat);
        pole.position.set(px, 1.6, pz);
        group.add(pole);
      }
    }

    group.position.set(x, 0, z);
    this.scene.add(group);

    return {
      type: 'fuchka',
      group: group,
      width: 1.8,
      length: 2.6,
      damage: 3500,
      taka: 500,
      name: 'ফুচকার গাড়ি চূর্ণবিচূর্ণ!'
    };
  }

  // 2. Fruit Pushcart (ফলের ভ্যানগাড়ি - Watermelons, Bananas, Papayas)
  createFruitVan(x, z) {
    const group = new THREE.Group();

    // Wooden Flatbed Pushcart
    const bedMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    const bed = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.18, 2.8), bedMat);
    bed.position.y = 0.8;
    bed.castShadow = true;
    group.add(bed);

    // Wheels
    const wMat = new THREE.MeshStandardMaterial({ color: 0x111827 });
    for (const wx of [-0.95, 0.95]) {
      for (const wz of [-0.9, 0.9]) {
        const w = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.09, 12), wMat);
        w.rotation.z = Math.PI / 2;
        w.position.set(wx, 0.32, wz);
        group.add(w);
      }
    }

    // Mounds of green watermelons & yellow papayas
    const melonMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.4 });
    const papayaMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 });

    for (let m = 0; m < 8; m++) {
      const melon = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 10), melonMat);
      melon.position.set((Math.random() - 0.5) * 1.3, 1.05, (Math.random() - 0.5) * 1.6);
      melon.castShadow = true;
      group.add(melon);
    }

    for (let p = 0; p < 6; p++) {
      const papaya = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.16, 0.45, 8), papayaMat);
      papaya.rotation.z = Math.PI / 4;
      papaya.position.set((Math.random() - 0.5) * 1.3, 1.05, (Math.random() - 0.5) * 1.6);
      group.add(papaya);
    }

    group.position.set(x, 0, z);
    this.scene.add(group);

    return {
      type: 'fruit',
      group: group,
      width: 1.9,
      length: 2.9,
      damage: 3000,
      taka: 500,
      name: 'ফলের ভ্যানগাড়ি দুমড়েমুচড়ে তরমুজ উড়ল!'
    };
  }

  // 3. Yellow/Black Road Construction Barricade ("কাজ চলিতেছে - সিটি কর্পোরেশন")
  createBarricade(x, z) {
    const group = new THREE.Group();

    // Wooden A-frame barrier legs
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x1f2937 });
    const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2), woodMat);
    legL.position.set(-1.0, 0.6, 0);
    const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2), woodMat);
    legR.position.set(1.0, 0.6, 0);
    group.add(legL);
    group.add(legR);

    // Hazard striped wooden crossboard
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(0, 0, 512, 128);

    ctx.fillStyle = '#111827';
    for (let i = -128; i < 512 + 128; i += 80) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 40, 0);
      ctx.lineTo(i, 128);
      ctx.lineTo(i - 40, 128);
      ctx.closePath();
      ctx.fill();
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('কাজ চলিতেছে · DNCC', 256, 72);

    const boardTex = new THREE.CanvasTexture(canvas);
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.45, 0.08),
      new THREE.MeshStandardMaterial({ map: boardTex })
    );
    board.position.set(0, 0.8, 0);
    board.castShadow = true;
    group.add(board);

    group.position.set(x, 0, z);
    this.scene.add(group);

    return {
      type: 'barricade',
      group: group,
      width: 2.4,
      length: 0.8,
      damage: 2500,
      taka: 200,
      name: 'সিটি কর্পোরেশনের ব্যারিকেড ভেঙে তছনছ!'
    };
  }

  // 4. Dhaka Blue/Green Waste Dustbin (ডিএনসিসি ডাস্টবিন)
  createDustbin(x, z) {
    const group = new THREE.Group();

    const binMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.4, roughness: 0.7 });
    const bin = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 1.1), binMat);
    bin.position.y = 0.7;
    bin.castShadow = true;
    group.add(bin);

    // Wheels & handle
    const wMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const wL = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.08, 10), wMat);
    wL.rotation.z = Math.PI / 2;
    wL.position.set(-0.6, 0.14, 0.3);
    const wR = wL.clone();
    wR.position.x = 0.6;
    group.add(wL);
    group.add(wR);

    group.position.set(x, 0, z);
    this.scene.add(group);

    return {
      type: 'dustbin',
      group: group,
      width: 1.2,
      length: 1.1,
      damage: 2000,
      taka: 200,
      name: 'রাস্তার ডাস্টবিনে সজোরে ধাক্কা!'
    };
  }

  // 5. Asphalt Tar Drum (কালো পিচের ড্রাম)
  createTarDrum(x, z) {
    const group = new THREE.Group();

    const drumMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.7, roughness: 0.4 });
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 1.1, 16), drumMat);
    drum.position.y = 0.55;
    drum.castShadow = true;
    group.add(drum);

    group.position.set(x, 0, z);
    this.scene.add(group);

    return {
      type: 'tardrum',
      group: group,
      width: 1.0,
      length: 1.0,
      damage: 2000,
      taka: 100,
      name: 'রাস্তার পিচের ড্রাম গুঁড়িয়ে দিলেন!'
    };
  }

  update(delta, playerZ) {
    this.spawnTimer += delta;
    if (this.spawnTimer > 1.6 && this.props.length < 16) {
      this.spawnTimer = 0;
      this.spawnRandomProp(playerZ);
    }

    // Clean up passed props
    for (let i = this.props.length - 1; i >= 0; i--) {
      const p = this.props[i];
      if (p.group.position.z > playerZ + 25 || p.group.position.z < playerZ - 220) {
        this.scene.remove(p.group);
        this.props.splice(i, 1);
      }
    }
  }

  spawnRandomProp(playerZ) {
    const spawnZ = playerZ - (60 + Math.random() * 80);
    const rand = Math.random();

    // Place on shoulders and sidewalk edges to avoid blocking the driving lane completely
    const spawnX = [
      -10.5, // Far left sidewalk edge
      -7.5,  // Left outer lane shoulder
      -1.4,  // Next to central median (wrong way side)
      1.4,   // Next to central median (right way side)
      7.8,   // Right driving lane shoulder
      10.5   // Right sidewalk edge
    ][Math.floor(Math.random() * 6)];

    let prop = null;
    if (rand < 0.28) {
      prop = this.createFuchkaCart(spawnX, spawnZ);
    } else if (rand < 0.52) {
      prop = this.createFruitVan(spawnX, spawnZ);
    } else if (rand < 0.74) {
      prop = this.createBarricade(spawnX, spawnZ);
    } else if (rand < 0.88) {
      prop = this.createDustbin(spawnX, spawnZ);
    } else {
      prop = this.createTarDrum(spawnX, spawnZ);
    }

    if (prop) this.props.push(prop);
  }

  checkCollisions(playerBounds) {
    const hits = [];
    for (let i = this.props.length - 1; i >= 0; i--) {
      const p = this.props[i];
      const dx = Math.abs(p.group.position.x - playerBounds.x);
      const dz = Math.abs(p.group.position.z - playerBounds.z);

      if (dx < (p.width + playerBounds.width) * 0.45 && dz < (p.length + playerBounds.length) * 0.45) {
        hits.push(p);
        this.scene.remove(p.group);
        this.props.splice(i, 1);
      }
    }
    return hits;
  }

  reset() {
    for (const p of this.props) {
      this.scene.remove(p.group);
    }
    this.props = [];
    this.spawnTimer = 0;
  }
}
