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
    this.isCrossTraffic = false;
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
    } else if (this.type === 'rickshaw') {
      this.initRickshawModel();
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

  // 3.5. Authentic Dhaka Colorful Motor Rickshaw (মোটর / ব্যাটারি রিকশা) with Rickshaw Art & Driver
  initRickshawModel() {
    this.width = 1.25;
    this.length = 2.45;
    this.height = 1.85;

    // Colorful Dhaka Rickshaw Hood Colors (Red, Blue, Green, Yellow, Pink)
    const hoodColors = [0xdc2626, 0x2563eb, 0x16a34a, 0xeab308, 0xec4899];
    const hoodColor = hoodColors[Math.floor(Math.random() * hoodColors.length)];

    const hoodMat = new THREE.MeshStandardMaterial({
      color: hoodColor,
      roughness: 0.5,
      metalness: 0.1
    });

    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.4,
      metalness: 0.7
    });

    const seatMat = new THREE.MeshStandardMaterial({
      color: 0x7c2d12,
      roughness: 0.7
    });

    // 1. Lower Chassis & Footboard
    const chassisGeo = new THREE.BoxGeometry(0.9, 0.1, 1.8);
    const chassis = new THREE.Mesh(chassisGeo, steelMat);
    chassis.position.set(0, 0.45, 0);
    chassis.castShadow = true;
    this.group.add(chassis);

    // 2. Passenger Seat & Rear Box
    const seatGeo = new THREE.BoxGeometry(1.05, 0.5, 0.65);
    const seat = new THREE.Mesh(seatGeo, seatMat);
    seat.position.set(0, 0.75, 0.55);
    seat.castShadow = true;
    this.group.add(seat);

    // 3. Iconic Dhaka Rickshaw Folded Hood / Canopy
    const canopyGeo = new THREE.CylinderGeometry(0.62, 0.62, 1.15, 16, 1, false, 0, Math.PI);
    const canopy = new THREE.Mesh(canopyGeo, hoodMat);
    canopy.rotation.z = Math.PI / 2;
    canopy.rotation.y = Math.PI;
    canopy.position.set(0, 1.48, 0.55);
    canopy.castShadow = true;
    this.group.add(canopy);

    // 4. Rear Rickshaw Art Plate (Iconic Bangladeshi Cinema / Peacocks / Taj Mahal Tin Plate Art)
    const artPlateTex = (typeof TextureFactory.createRickshawArtPlate === 'function')
      ? TextureFactory.createRickshawArtPlate() : null;
    const plateGeo = new THREE.BoxGeometry(0.92, 0.45, 0.04);
    const plateMat = new THREE.MeshStandardMaterial({
      map: artPlateTex,
      color: artPlateTex ? 0xffffff : 0xfde047,
      roughness: 0.4
    });
    const artPlate = new THREE.Mesh(plateGeo, plateMat);
    artPlate.position.set(0, 0.52, 0.95);
    this.group.add(artPlate);

    // 5. Wheels (1 Front, 2 Rear)
    const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.08, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.8 });

    // Front Wheel
    const fw = new THREE.Mesh(wheelGeo, wheelMat);
    fw.rotation.z = Math.PI / 2;
    fw.position.set(0, 0.35, -0.95);
    this.group.add(fw);

    // Left Rear Wheel
    const rwl = new THREE.Mesh(wheelGeo, wheelMat);
    rwl.rotation.z = Math.PI / 2;
    rwl.position.set(-0.58, 0.35, 0.55);
    this.group.add(rwl);

    // Right Rear Wheel
    const rwr = new THREE.Mesh(wheelGeo, wheelMat);
    rwr.rotation.z = Math.PI / 2;
    rwr.position.set(0.58, 0.35, 0.55);
    this.group.add(rwr);

    // 6. Rickshawala Driver Character (Lungi & Gamcha)
    const lungiColors = [0x0284c7, 0x16a34a, 0x7c3aed, 0xd97706];
    const lungiColor = lungiColors[Math.floor(Math.random() * lungiColors.length)];
    const shirtColors = [0xffffff, 0x38bdf8, 0x4ade80, 0xfacc15];
    const shirtColor = shirtColors[Math.floor(Math.random() * shirtColors.length)];

    const skinMat = new THREE.MeshStandardMaterial({ color: 0x8d5524, roughness: 0.8 });
    const shirtMat = new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.6 });
    const lungiMat = new THREE.MeshStandardMaterial({ color: lungiColor, roughness: 0.6 });

    // Driver Torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.48, 0.24), shirtMat);
    torso.position.set(0, 1.15, -0.2);
    this.group.add(torso);

    // Driver Head & Gamcha
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), skinMat);
    head.position.set(0, 1.48, -0.2);
    this.group.add(head);

    // Driver Lungi Legs
    const legs = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.5, 12), lungiMat);
    legs.position.set(0, 0.75, -0.2);
    this.group.add(legs);

    // 7. Blinking Hood Fairy Lights
    const lightMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    for (let i = -0.5; i <= 0.5; i += 0.25) {
      const fl = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 6), lightMat);
      fl.position.set(i, 1.78, 0.55);
      this.group.add(fl);
    }

    // 8. Front Chrome Headlight with Warm Beam Glow
    const lampMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9, roughness: 0.1 });
    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.12, 14), lampMat);
    lamp.rotation.x = Math.PI / 2;
    lamp.position.set(0, 0.76, -0.96);
    this.group.add(lamp);

    const lensMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.09, 14), lensMat);
    lens.position.set(0, 0.76, -1.03);
    lens.rotation.y = Math.PI;
    this.group.add(lens);
  }

  // 4. Green CNG Auto-Rickshaw (সিএনজি অটোরিকশা) with Iron Cage Grille & Chrome Headlight
  initCNGModel() {
    this.width = 1.36;
    this.length = 2.75;
    this.height = 1.72;

    const sideTex = (typeof TextureFactory.createCNGSideTexture === 'function')
      ? TextureFactory.createCNGSideTexture() : null;
    const rearTex = (typeof TextureFactory.createCNGRearTexture === 'function')
      ? TextureFactory.createCNGRearTexture() : null;

    const greenMat = new THREE.MeshStandardMaterial({
      color: 0x16a34a,
      roughness: 0.45,
      metalness: 0.15
    });

    const sideMat = new THREE.MeshStandardMaterial({
      map: sideTex,
      color: 0x16a34a,
      roughness: 0.45
    });

    const rearMat = new THREE.MeshStandardMaterial({
      map: rearTex,
      roughness: 0.5
    });

    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.8
    });

    // 1. Lower Green Body & Chassis Base
    const chassisGeo = new THREE.BoxGeometry(this.width, 0.72, this.length * 0.96);
    const chassis = new THREE.Mesh(chassisGeo, greenMat);
    chassis.position.y = 0.62;
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    this.group.add(chassis);

    // 2. Passenger Cabin with Wire Mesh Cage on sides and Rear Hatch
    // [+X, -X, +Y, -Y, +Z, -Z]
    const cabinMaterials = [sideMat, sideMat, roofMat, greenMat, rearMat, greenMat];
    const cabinGeo = new THREE.BoxGeometry(this.width * 0.98, 0.88, 1.6);
    const cabin = new THREE.Mesh(cabinGeo, cabinMaterials);
    cabin.position.set(0, 1.25, 0.45);
    cabin.castShadow = true;
    this.group.add(cabin);

    // 3. Driver Front Cockpit & Slanted Tapered Nose
    const noseGeo = new THREE.BoxGeometry(this.width * 0.88, 0.65, 0.95);
    const nose = new THREE.Mesh(noseGeo, greenMat);
    nose.position.set(0, 0.76, -0.85);
    nose.castShadow = true;
    this.group.add(nose);

    // 4. Slanted Windshield with Glass Reflection
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      roughness: 0.1,
      metalness: 0.2,
      transparent: true,
      opacity: 0.75
    });
    const windshield = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 0.62), glassMat);
    windshield.position.set(0, 1.28, -0.62);
    windshield.rotation.x = -0.32;
    this.group.add(windshield);

    // 5. Curved Vinyl Roof (কালো ছাদ)
    const roof = new THREE.Mesh(new THREE.BoxGeometry(this.width * 1.02, 0.14, this.length * 0.98), roofMat);
    roof.position.set(0, 1.72, 0.05);
    roof.castShadow = true;
    this.group.add(roof);

    // 6. Iconic Front Chrome Circular Headlight (সিঙ্গেল হেডলাইট)
    const lampMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.95, roughness: 0.1 });
    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.12, 16), lampMat);
    lamp.rotation.x = Math.PI / 2;
    lamp.position.set(0, 0.72, -1.35);
    this.group.add(lamp);

    // Headlight Lens Glow
    const lensMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.09, 16), lensMat);
    lens.position.set(0, 0.72, -1.42);
    lens.rotation.y = Math.PI;
    this.group.add(lens);

    // 7. Metal Wire Cage Bars (Real 3D Iron Security Grille)
    const grillMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.85, roughness: 0.3 });
    [-this.width / 2 - 0.01, this.width / 2 + 0.01].forEach(sideX => {
      // 3 Horizontal rails
      for (let y = 1.02; y <= 1.48; y += 0.22) {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.025, 1.4), grillMat);
        rail.position.set(sideX, y, 0.45);
        this.group.add(rail);
      }
      // 4 Vertical bars
      for (let z = -0.15; z <= 1.05; z += 0.38) {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.55, 0.025), grillMat);
        bar.position.set(sideX, 1.25, z);
        this.group.add(bar);
      }
    });

    // 8. Front Black Bumper
    const bumperMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.6 });
    const fBumper = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.16, 0.2), bumperMat);
    fBumper.position.set(0, 0.38, -1.32);
    this.group.add(fBumper);

    // 9. 3 Wheels (1 Front, 2 Rear)
    this.addWheel(0, 0.28, -0.98, 0.28);
    this.addWheel(-0.64, 0.28, 0.75, 0.28);
    this.addWheel(0.64, 0.28, 0.75, 0.28);
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

    if (this.isCrossTraffic) {
      // Moves horizontally across the Chourasta intersection along X axis
      this.group.position.x += this.crossSpeed * delta;
      this.group.rotation.y = this.crossSpeed > 0 ? Math.PI / 2 : -Math.PI / 2;

      if (Math.abs(this.group.position.x) > 36) {
        this.active = false;
        this.group.visible = false;
      }
    } else {
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
      width: this.isCrossTraffic ? this.length : this.width,
      length: this.isCrossTraffic ? this.width : this.length,
      type: this.type,
      isSergeant: this.isSergeant,
      isVIP: this.isVIP,
      isCrossTraffic: this.isCrossTraffic
    };
  }
}
