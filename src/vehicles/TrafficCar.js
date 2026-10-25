import * as THREE from 'three';
import { TextureFactory } from '../ui/Textures.js';

export class TrafficCar {
  constructor(scene, type = 'bus') {
    this.scene = scene;
    this.type = type; // 'bus', 'vip', 'hiace', 'cng', 'sedan', 'pedestrian'
    this.group = new THREE.Group();

    this.speed = 0;
    this.targetSpeed = 0;
    this.isWrongWay = false;
    this.crossSpeed = 0;
    this.width = 2.0;
    this.length = 4.5;
    this.height = 1.8;
    this.active = true;

    this.swerved = false;
    this.panicTimer = 0;

    // Siren lights for VIP Prado
    this.sirenBlue = null;
    this.sirenRed = null;

    this.initModel();
    this.scene.add(this.group);
  }

  initModel() {
    if (this.type === 'bus') {
      this.initBusModel();
    } else if (this.type === 'vip') {
      this.initVIPPradoModel();
    } else if (this.type === 'hiace') {
      this.initHiAceModel();
    } else if (this.type === 'cng') {
      this.initCNGModel();
    } else if (this.type === 'pedestrian') {
      this.initPedestrianModel();
    } else {
      this.initSedanModel();
    }
  }

  // 1. Detailed Yellow "মায়ের দোয়া" Dhaka Bus with Blue Roof Tarp
  initBusModel() {
    this.width = 2.7;
    this.length = 9.4;
    this.height = 3.3;

    const sideMat = new THREE.MeshStandardMaterial({
      map: (typeof TextureFactory.createDhakaBusTexture === 'function') 
        ? TextureFactory.createDhakaBusTexture(0) : null,
      color: 0xeab308,
      roughness: 0.5,
      metalness: 0.2
    });
    const frontMat = new THREE.MeshStandardMaterial({
      map: (typeof TextureFactory.createDhakaBusFrontTexture === 'function')
        ? TextureFactory.createDhakaBusFrontTexture() : null,
      color: 0xeab308,
      roughness: 0.5,
      metalness: 0.2
    });
    const rearMat = new THREE.MeshStandardMaterial({
      map: (typeof TextureFactory.createDhakaBusRearTexture === 'function')
        ? TextureFactory.createDhakaBusRearTexture() : null,
      color: 0xeab308,
      roughness: 0.5,
      metalness: 0.2
    });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.7 });
    const bottomMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });

    // Multi-face materials: [+X (right), -X (left), +Y (top), -Y (bottom), +Z (rear), -Z (front)]
    const busMaterials = [sideMat, sideMat, roofMat, bottomMat, rearMat, frontMat];

    const bodyGeo = new THREE.BoxGeometry(this.width, this.height, this.length);
    const busBody = new THREE.Mesh(bodyGeo, busMaterials);
    busBody.position.y = this.height / 2 + 0.35;
    busBody.castShadow = true;
    busBody.receiveShadow = true;
    this.group.add(busBody);

    // Blue Roof Luggage Rack & Tarpaulin (Iconic Dhaka Bus Roof Tarp)
    const tarpGeo = new THREE.BoxGeometry(this.width * 0.88, 0.75, this.length * 0.72);
    const tarpMat = new THREE.MeshStandardMaterial({ color: 0x1565c0, roughness: 0.8 });
    const tarp = new THREE.Mesh(tarpGeo, tarpMat);
    tarp.position.set(0, this.height + 0.65, 0.4);
    tarp.castShadow = true;
    this.group.add(tarp);

    // Heavy Metal Bumpers
    const bumperMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.85 });
    const fBuf = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.4, 0.45), bumperMat);
    fBuf.position.set(0, 0.45, -this.length / 2 - 0.1);
    this.group.add(fBuf);

    const rBuf = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.4, 0.45), bumperMat);
    rBuf.position.set(0, 0.45, this.length / 2 + 0.1);
    this.group.add(rBuf);

    // Wheels
    this.addWheel(-1.25, 0.5, -2.8, 0.52);
    this.addWheel(1.25, 0.5, -2.8, 0.52);
    this.addWheel(-1.25, 0.5, 2.7, 0.52);
    this.addWheel(1.25, 0.5, 2.7, 0.52);
  }

  // 2. VIP Police / Government Prado SUV (ভিআইপি গাড়ি) with Flashing Sirens
  initVIPPradoModel() {
    this.width = 2.05;
    this.length = 4.9;
    this.height = 1.95;

    const vipTex = (typeof TextureFactory.createVIPPradoTexture === 'function')
      ? TextureFactory.createVIPPradoTexture() : null;

    const bodyGeo = new THREE.BoxGeometry(this.width, 1.1, this.length);
    const bodyMat = new THREE.MeshStandardMaterial({
      map: vipTex,
      color: 0x111827,
      metalness: 0.9,
      roughness: 0.15
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.85;
    body.castShadow = true;
    this.group.add(body);

    // Upper VIP Cabin
    const cabGeo = new THREE.BoxGeometry(this.width * 0.9, 0.85, 2.8);
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x050508, roughness: 0.1, metalness: 0.95 });
    const cab = new THREE.Mesh(cabGeo, glassMat);
    cab.position.set(0, 1.6, -0.1);
    cab.castShadow = true;
    this.group.add(cab);

    // Roof Police Siren Bar (Red & Blue Flashing Strobes)
    const sirenBarGeo = new THREE.BoxGeometry(1.2, 0.14, 0.3);
    const sirenBarMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const sirenBar = new THREE.Mesh(sirenBarGeo, sirenBarMat);
    sirenBar.position.set(0, 2.1, -0.1);
    this.group.add(sirenBar);

    this.sirenRed = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.16, 0.28),
      new THREE.MeshBasicMaterial({ color: 0xff0033 })
    );
    this.sirenRed.position.set(-0.35, 2.12, -0.1);
    this.group.add(this.sirenRed);

    this.sirenBlue = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.16, 0.28),
      new THREE.MeshBasicMaterial({ color: 0x0055ff })
    );
    this.sirenBlue.position.set(0.35, 2.12, -0.1);
    this.group.add(this.sirenBlue);

    // Rear Mounted Spare Wheel Cover (Classic Prado/Pajero Hallmark)
    const spareGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.22, 20);
    const spareMat = new THREE.MeshStandardMaterial({ color: 0x090a0f, metalness: 0.9, roughness: 0.2 });
    const spare = new THREE.Mesh(spareGeo, spareMat);
    spare.rotation.x = Math.PI / 2;
    spare.position.set(0, 1.0, this.length / 2 + 0.12);
    spare.castShadow = true;
    this.group.add(spare);

    // Front Chrome Bullbar
    const bullbar = new THREE.Mesh(new THREE.BoxGeometry(this.width * 0.9, 0.5, 0.2), new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9 }));
    bullbar.position.set(0, 0.65, -this.length / 2 - 0.08);
    this.group.add(bullbar);

    this.isVIP = true;

    this.addWheel(-1.0, 0.42, -1.5, 0.42);
    this.addWheel(1.0, 0.42, -1.5, 0.42);
    this.addWheel(-1.0, 0.42, 1.5, 0.42);
    this.addWheel(1.0, 0.42, 1.5, 0.42);
  }

  // 3. White Toyota HiAce Microbus (Matching Screenshot Right Car)
  initHiAceModel() {
    this.width = 1.85;
    this.length = 4.7;
    this.height = 1.95;

    const hiaceTex = (typeof TextureFactory.createHiAceTexture === 'function')
      ? TextureFactory.createHiAceTexture() : null;

    const bodyGeo = new THREE.BoxGeometry(this.width, this.height, this.length);
    const bodyMat = new THREE.MeshStandardMaterial({
      map: hiaceTex,
      color: 0xf8fafc,
      roughness: 0.35,
      metalness: 0.4
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = this.height / 2 + 0.3;
    body.castShadow = true;
    this.group.add(body);

    // Front Windshield
    const windshieldGeo = new THREE.PlaneGeometry(1.7, 0.85);
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x112233, roughness: 0.1 });
    const windshield = new THREE.Mesh(windshieldGeo, glassMat);
    windshield.position.set(0, 1.45, -this.length / 2 - 0.01);
    this.group.add(windshield);

    this.addWheel(-0.92, 0.38, -1.45, 0.38);
    this.addWheel(0.92, 0.38, -1.45, 0.38);
    this.addWheel(-0.92, 0.38, 1.45, 0.38);
    this.addWheel(0.92, 0.38, 1.45, 0.38);
  }

  // 4. Green CNG Auto-Rickshaw
  initCNGModel() {
    this.width = 1.4;
    this.length = 2.8;
    this.height = 1.7;

    const cngTex = (typeof TextureFactory.createCNGTexture === 'function')
      ? TextureFactory.createCNGTexture() : null;
    const bodyGeo = new THREE.BoxGeometry(this.width, this.height, this.length);
    const cngMat = new THREE.MeshStandardMaterial({
      map: cngTex,
      color: 0x15803d,
      roughness: 0.4
    });
    const body = new THREE.Mesh(bodyGeo, cngMat);
    body.position.y = this.height / 2 + 0.25;
    body.castShadow = true;
    this.group.add(body);

    this.addWheel(0, 0.3, -1.1, 0.3);
    this.addWheel(-0.65, 0.3, 0.9, 0.3);
    this.addWheel(0.65, 0.3, 0.9, 0.3);
  }

  initSedanModel() {
    this.width = 1.88;
    this.length = 4.6;
    this.height = 1.45;

    const lowerGeo = new THREE.BoxGeometry(this.width, 0.7, this.length);
    const carMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.85, roughness: 0.2 });
    const lower = new THREE.Mesh(lowerGeo, carMat);
    lower.position.y = 0.6;
    lower.castShadow = true;
    this.group.add(lower);

    const upperGeo = new THREE.BoxGeometry(this.width * 0.82, 0.65, 2.3);
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1, metalness: 0.9 });
    const upper = new THREE.Mesh(upperGeo, glassMat);
    upper.position.set(0, 1.2, -0.2);
    upper.castShadow = true;
    this.group.add(upper);

    this.addWheel(-0.95, 0.35, -1.4, 0.35);
    this.addWheel(0.95, 0.35, -1.4, 0.35);
    this.addWheel(-0.95, 0.35, 1.4, 0.35);
    this.addWheel(0.95, 0.35, 1.4, 0.35);
  }

  initPedestrianModel() {
    this.width = 0.9;
    this.length = 0.9;
    this.height = 1.85;

    const randStyle = Math.random();
    this.isSergeant = randStyle < 0.35; // 35% Traffic Sergeant
    const isLungi = !this.isSergeant && randStyle < 0.70; // 35% Lungi
    const isPanjabi = !this.isSergeant && !isLungi; // 30% Panjabi

    // Torso / Shirt
    let shirtColor = 0x0284c7; // Blue shirt
    if (this.isSergeant) {
      shirtColor = 0x1e3a8a; // Police deep blue
    } else if (isPanjabi) {
      shirtColor = 0xf8fafc; // White panjabi
    } else {
      shirtColor = [0xd97706, 0x059669, 0xdc2626, 0x7c3aed][Math.floor(Math.random() * 4)];
    }

    const torsoGeo = new THREE.BoxGeometry(0.55, 0.75, 0.32);
    const torsoMat = new THREE.MeshStandardMaterial({ color: shirtColor });
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.position.y = 1.15;
    torso.castShadow = true;
    this.group.add(torso);

    // If Sergeant: Neon Yellow/Green reflective vest
    if (this.isSergeant) {
      const vestGeo = new THREE.BoxGeometry(0.57, 0.24, 0.34);
      const vestMat = new THREE.MeshStandardMaterial({ color: 0x84cc16, roughness: 0.3 }); // Fluorescent lime
      const vest = new THREE.Mesh(vestGeo, vestMat);
      vest.position.y = 1.25;
      this.group.add(vest);
    }

    // Head
    const skinMat = new THREE.MeshStandardMaterial({ color: 0x8d5524, roughness: 0.8 });
    const headGeo = new THREE.SphereGeometry(0.19, 12, 12);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 1.68;
    this.group.add(head);

    // Headwear
    if (this.isSergeant) {
      // White DMP Traffic Police Peak Cap
      const capMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.1, 16), capMat);
      cap.position.y = 1.86;
      this.group.add(cap);

      const visor = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.03, 0.16), new THREE.MeshStandardMaterial({ color: 0x111111 }));
      visor.position.set(0, 1.83, -0.16);
      this.group.add(visor);
    } else if (isPanjabi) {
      // White Islamic prayer cap (টুপি)
      const topi = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.19, 0.08, 16), new THREE.MeshStandardMaterial({ color: 0xffffff }));
      topi.position.y = 1.86;
      this.group.add(topi);
    }

    // Lower body: Lungi vs Panjabi Pyjama vs Pants
    if (isLungi) {
      // Traditional Bangladeshi Lungi
      const lungiGeo = new THREE.CylinderGeometry(0.3, 0.34, 0.85, 12);
      const lungiMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.9 });
      const lungi = new THREE.Mesh(lungiGeo, lungiMat);
      lungi.position.y = 0.45;
      lungi.castShadow = true;
      this.group.add(lungi);
    } else {
      const pantsColor = this.isSergeant ? 0x0f172a : (isPanjabi ? 0xf8fafc : 0x334155);
      const legGeo = new THREE.BoxGeometry(0.18, 0.82, 0.22);
      const legMat = new THREE.MeshStandardMaterial({ color: pantsColor });
      const legL = new THREE.Mesh(legGeo, legMat);
      legL.position.set(-0.14, 0.42, 0);
      legL.castShadow = true;
      const legR = new THREE.Mesh(legGeo, legMat);
      legR.position.set(0.14, 0.42, 0);
      legR.castShadow = true;
      this.group.add(legL);
      this.group.add(legR);
    }

    // Classic Dhaka "Hand held up stopping traffic" gesture (হাত তুলে রাস্তা পার হওয়া)
    const armGeo = new THREE.BoxGeometry(0.12, 0.48, 0.12);
    const armMat = new THREE.MeshStandardMaterial({ color: shirtColor });
    const raisedArm = new THREE.Mesh(armGeo, armMat);
    raisedArm.position.set(0.38, 1.35, -0.2);
    raisedArm.rotation.x = -Math.PI / 3;
    raisedArm.rotation.z = -Math.PI / 6;
    this.group.add(raisedArm);

    const palm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.14, 0.04), skinMat);
    palm.position.set(0.48, 1.55, -0.42);
    this.group.add(palm);
  }

  addWheel(x, y, z, r) {
    const geo = new THREE.CylinderGeometry(r, r, 0.22, 16);
    const mat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
    const w = new THREE.Mesh(geo, mat);
    w.rotation.z = Math.PI / 2;
    w.position.set(x, y, z);
    w.castShadow = true;
    this.group.add(w);
  }

  reactToHorn() {
    if (this.swerved) return;
    this.swerved = true;
    this.panicTimer = 1.8;
    const steerDir = this.group.position.x > 0 ? 1 : -1;
    this.group.position.x += steerDir * 2.5;
    this.group.rotation.y += steerDir * 0.2;
  }

  update(delta, playerZ) {
    if (!this.active) return;

    const dir = this.isWrongWay ? 1 : -1;
    this.group.position.z += dir * (this.speed / 3.6) * delta;

    // Crossing pedestrian lateral motion
    if (this.crossSpeed) {
      this.group.position.x += this.crossSpeed * delta;
      if (Math.abs(this.group.position.x) > 12.5) {
        this.crossSpeed *= -1;
        this.group.rotation.y = this.crossSpeed > 0 ? Math.PI / 2 : -Math.PI / 2;
      }
    }

    // Siren strobe flashing for VIP Prado
    if (this.isVIP && this.sirenRed && this.sirenBlue) {
      const strobe = Math.floor(Date.now() / 120) % 2 === 0;
      this.sirenRed.material.color.setHex(strobe ? 0xff0000 : 0x330000);
      this.sirenBlue.material.color.setHex(strobe ? 0x002244 : 0x0088ff);
    }

    if (this.panicTimer > 0) {
      this.panicTimer -= delta;
      this.group.rotation.z = Math.sin(Date.now() * 0.03) * 0.06;
    } else {
      this.group.rotation.z = 0;
    }

    if (Math.abs(this.group.position.z - playerZ) > 170) {
      this.active = false;
      this.group.visible = false;
    }
  }

  getBounds() {
    return {
      x: this.group.position.x,
      z: this.group.position.z,
      width: this.width,
      length: this.length,
      type: this.type,
      isSergeant: this.isSergeant,
      isVIP: this.isVIP
    };
  }
}
