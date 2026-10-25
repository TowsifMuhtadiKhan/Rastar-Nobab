import * as THREE from 'three';
import { TextureFactory } from '../ui/Textures.js';

export class RickshawTesla {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();

    // Vehicle physics state
    this.speed = 0;
    this.maxSpeed = 60; // km/h
    this.boostMaxSpeed = 100;
    this.acceleration = 34;
    this.braking = 52;
    this.friction = 14;
    this.steerAngle = 0;
    this.maxSteerAngle = 0.68;
    this.steerSpeed = 3.2;
    this.tilt = 0;

    // Upgrades
    this.upgradeLevel = 1;
    this.partsCollected = 0;
    this.partsToNextLevel = 5;

    // Battery & Health
    this.battery = 100;
    this.health = 100;
    this.autoCruiseEnabled = true;
    this.boostTimer = 0;

    // Animated fairy lights array
    this.fairyLights = [];

    // Intersection Turning & Chourasta Navigation
    this.isTurning = false;
    this.turnProgress = 0;
    this.turnDirection = null;
    this.turnChourasta = null;
    this.onTurnStart = null;
    this.onTurnComplete = null;
    this.onRoundaboutBump = null;

    this.initModel();
    this.initHeadlights();

    // Spawn in the right-hand driving lane at zebra crossing
    this.group.position.set(2.8, 0, 0);

    this.scene.add(this.group);
  }

  initModel() {
    // -------------------------------------------------------------
    // Materials matching authentic Bangladeshi Easybike / Auto-Rickshaw
    // -------------------------------------------------------------
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.95, roughness: 0.12 });
    const darkFrameMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.75, roughness: 0.35 });
    const greenBodyMat = new THREE.MeshStandardMaterial({ color: 0x047857, metalness: 0.45, roughness: 0.32 }); // Deep Bangladeshi transport green
    const royalBlueMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.3, roughness: 0.45 });  // Easybike canopy blue
    const neonLimeMat = new THREE.MeshStandardMaterial({ color: 0xa3e635, roughness: 0.35 });                    // Fluorescent canopy piping trim
    const redSpringMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.4, roughness: 0.3 });   // Red front shock absorber coils
    const rubberMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.92 });
    const clearGlassMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.4, roughness: 0.1, transmission: 0.8 });

    // Textures
    const cushionTex = TextureFactory.createEasybikeCushionTexture();
    const cushionMat = new THREE.MeshStandardMaterial({ map: cushionTex, roughness: 0.55 });

    const ventTex = TextureFactory.createEasybikeBatteryVentTexture();
    const batteryBoxMat = new THREE.MeshStandardMaterial({ map: ventTex, roughness: 0.4, metalness: 0.3 });

    const tapestryTex = TextureFactory.createEasybikeRearTapestry();
    const rearTapestryMat = new THREE.MeshStandardMaterial({ map: tapestryTex, roughness: 0.45, side: THREE.DoubleSide });

    const mudflapTex = TextureFactory.createEasybikeMudflapTexture();
    const mudflapMat = new THREE.MeshStandardMaterial({ map: mudflapTex, roughness: 0.85, side: THREE.DoubleSide });

    // -------------------------------------------------------------
    // 1. Lower Chassis & Battery Enclosures (Green Sheet Metal)
    // -------------------------------------------------------------
    this.chassisGroup = new THREE.Group();

    // Heavy main chassis floor plate
    const floorGeo = new THREE.BoxGeometry(0.96, 0.06, 2.1);
    const floorMesh = new THREE.Mesh(floorGeo, darkFrameMat);
    floorMesh.position.set(0, 0.32, -0.05);
    floorMesh.castShadow = true;
    floorMesh.receiveShadow = true;
    this.chassisGroup.add(floorMesh);

    // Driver footboard (পাদান) in front
    const driverFloorGeo = new THREE.BoxGeometry(0.78, 0.04, 0.65);
    const driverFloor = new THREE.Mesh(driverFloorGeo, darkFrameMat);
    driverFloor.position.set(0, 0.34, -0.68);
    this.chassisGroup.add(driverFloor);

    // Foot brake pedal on driver floorboard (right side)
    const pedalGeo = new THREE.BoxGeometry(0.08, 0.08, 0.10);
    const pedal = new THREE.Mesh(pedalGeo, chromeMat);
    pedal.position.set(0.24, 0.40, -0.62);
    this.chassisGroup.add(pedal);

    // Driver Battery Compartment Box (under driver seat)
    const driverBoxGeo = new THREE.BoxGeometry(0.76, 0.36, 0.46);
    const driverBox = new THREE.Mesh(driverBoxGeo, batteryBoxMat);
    driverBox.position.set(0, 0.50, -0.22);
    driverBox.castShadow = true;
    this.chassisGroup.add(driverBox);

    // Passenger Main Battery / Storage Compartment Box (under rear seat)
    const passBoxGeo = new THREE.BoxGeometry(1.02, 0.40, 0.68);
    const passBox = new THREE.Mesh(passBoxGeo, batteryBoxMat);
    passBox.position.set(0, 0.52, 0.54);
    passBox.castShadow = true;
    this.chassisGroup.add(passBox);

    // Green side skirt body panels (covering wheel wells)
    for (const sx of [-0.54, 0.54]) {
      const skirtGeo = new THREE.BoxGeometry(0.04, 0.32, 0.76);
      const skirt = new THREE.Mesh(skirtGeo, greenBodyMat);
      skirt.position.set(sx, 0.54, 0.54);
      this.chassisGroup.add(skirt);
    }

    // -------------------------------------------------------------
    // 2. Comfortable Blue/White Cushioned Seats (Image 2 Match)
    // -------------------------------------------------------------
    // Driver Seat Cushion (বসার সিট)
    const driverSeatGeo = new THREE.BoxGeometry(0.74, 0.14, 0.40);
    const driverSeat = new THREE.Mesh(driverSeatGeo, cushionMat);
    driverSeat.position.set(0, 0.74, -0.22);
    driverSeat.castShadow = true;
    this.chassisGroup.add(driverSeat);

    // Driver Backrest Cushion
    const driverBackrestGeo = new THREE.BoxGeometry(0.74, 0.30, 0.08);
    const driverBackrest = new THREE.Mesh(driverBackrestGeo, cushionMat);
    driverBackrest.position.set(0, 0.94, -0.01);
    this.chassisGroup.add(driverBackrest);

    // Passenger Bench Cushion (rear)
    const passSeatGeo = new THREE.BoxGeometry(1.02, 0.16, 0.52);
    const passSeat = new THREE.Mesh(passSeatGeo, cushionMat);
    passSeat.position.set(0, 0.78, 0.54);
    passSeat.castShadow = true;
    this.chassisGroup.add(passSeat);

    // Passenger Backrest Cushion
    const passBackrestGeo = new THREE.BoxGeometry(1.02, 0.52, 0.10);
    const passBackrest = new THREE.Mesh(passBackrestGeo, cushionMat);
    passBackrest.position.set(0, 1.10, 0.84);
    this.chassisGroup.add(passBackrest);

    // -------------------------------------------------------------
    // 3. Stainless Steel Tubular Crash Guard Rails (Image 2 Match)
    // -------------------------------------------------------------
    // Passenger chrome armrests & side crash bar railing
    for (const rx of [-0.56, 0.56]) {
      // Upper armrest grab bar
      const armbar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.58), chromeMat);
      armbar.rotation.x = Math.PI / 2;
      armbar.position.set(rx, 0.98, 0.54);
      this.chassisGroup.add(armbar);

      // Vertical armrest support posts
      const postF = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.32), chromeMat);
      postF.position.set(rx, 0.84, 0.28);
      this.chassisGroup.add(postF);
      const postB = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.32), chromeMat);
      postB.position.set(rx, 0.84, 0.80);
      this.chassisGroup.add(postB);

      // Lower double crash rail around rear wheel (Image 2 Stainless Guard Rail)
      const guardRailUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.85), chromeMat);
      guardRailUpper.rotation.x = Math.PI / 2;
      guardRailUpper.position.set(rx * 1.04, 0.48, 0.54);
      this.chassisGroup.add(guardRailUpper);

      const guardRailLower = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.85), chromeMat);
      guardRailLower.rotation.x = Math.PI / 2;
      guardRailLower.position.set(rx * 1.04, 0.36, 0.54);
      this.chassisGroup.add(guardRailLower);

      // Vertical connecting struts on the guard rail
      for (const gz of [0.18, 0.54, 0.90]) {
        const gStrut = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.22), chromeMat);
        gStrut.position.set(rx * 1.04, 0.42, gz);
        this.chassisGroup.add(gStrut);
      }
    }

    // -------------------------------------------------------------
    // 4. Rear Blue Tubular Bumper & "SANDI STOP" Mudflaps (Image 1 Match)
    // -------------------------------------------------------------
    // Rear tubular bumper guard (Blue with silver wrapped center)
    const rearBumperGeo = new THREE.CylinderGeometry(0.028, 0.028, 1.18);
    const rearBumper = new THREE.Mesh(rearBumperGeo, royalBlueMat);
    rearBumper.rotation.z = Math.PI / 2;
    rearBumper.position.set(0, 0.38, 0.98);
    this.chassisGroup.add(rearBumper);

    // Silver protective center padding wrap
    const padGeo = new THREE.CylinderGeometry(0.038, 0.038, 0.58);
    const padMesh = new THREE.Mesh(padGeo, new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.6 }));
    padMesh.rotation.z = Math.PI / 2;
    padMesh.position.set(0, 0.38, 0.98);
    this.chassisGroup.add(padMesh);

    // Rear Taillights (Red & Amber)
    for (const tx of [-0.44, 0.44]) {
      const redLight = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.03), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
      redLight.position.set(tx, 0.48, 0.96);
      this.chassisGroup.add(redLight);
      const amberLight = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.06, 0.03), new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
      amberLight.position.set(tx + (tx > 0 ? 0.07 : -0.07), 0.48, 0.96);
      this.chassisGroup.add(amberLight);
    }

    // Rear Iconic Slogan Plate: "Ami choto amk marben na"
    const sloganTex = (typeof TextureFactory.createEasybikeBumperPlateTexture === 'function')
      ? TextureFactory.createEasybikeBumperPlateTexture() : null;
    if (sloganTex) {
      const sloganGeo = new THREE.PlaneGeometry(0.74, 0.18);
      const sloganMat = new THREE.MeshStandardMaterial({
        map: sloganTex,
        roughness: 0.35,
        side: THREE.DoubleSide
      });
      const sloganMesh = new THREE.Mesh(sloganGeo, sloganMat);
      sloganMesh.position.set(0, 0.52, 0.985);
      this.chassisGroup.add(sloganMesh);
    }

    // Heavy "SANDI STOP" Mudflaps behind rear wheels
    for (const mx of [-0.38, 0.38]) {
      const flap = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.30), mudflapMat);
      flap.position.set(mx, 0.22, 0.88);
      this.chassisGroup.add(flap);
    }

    this.group.add(this.chassisGroup);

    // -------------------------------------------------------------
    // 5. Authentic Full Canopy Roof (Royal Blue with Neon Lime Trim)
    // -------------------------------------------------------------
    this.canopyGroup = new THREE.Group();

    // Main roof slab (covering driver and passengers)
    const roofSlabGeo = new THREE.BoxGeometry(1.12, 0.06, 2.14);
    this.roofSlab = new THREE.Mesh(roofSlabGeo, royalBlueMat);
    this.roofSlab.position.set(0, 1.84, -0.02);
    this.roofSlab.castShadow = true;
    this.canopyGroup.add(this.roofSlab);

    // Front overhang eave (curving slightly down)
    const eaveGeo = new THREE.BoxGeometry(1.12, 0.05, 0.24);
    const eave = new THREE.Mesh(eaveGeo, royalBlueMat);
    eave.rotation.x = 0.22;
    eave.position.set(0, 1.81, -1.14);
    this.canopyGroup.add(eave);

    // Vibrant Neon Lime / Yellow Edge Piping (Image 2 Match!)
    // Running all along the roof perimeter
    const pipingMat = neonLimeMat;
    // Left & Right rim piping
    for (const px of [-0.565, 0.565]) {
      const pipeL = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 2.14), pipingMat);
      pipeL.rotation.x = Math.PI / 2;
      pipeL.position.set(px, 1.85, -0.02);
      this.canopyGroup.add(pipeL);
    }
    // Front rim piping
    const pipeF = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.14), pipingMat);
    pipeF.rotation.z = Math.PI / 2;
    pipeF.position.set(0, 1.80, -1.25);
    this.canopyGroup.add(pipeF);

    // Rear rim piping
    const pipeB = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.14), pipingMat);
    pipeB.rotation.z = Math.PI / 2;
    pipeB.position.set(0, 1.85, 1.05);
    this.canopyGroup.add(pipeB);

    // 4 Vertical Steel Support Pillars connecting Chassis to Canopy Roof
    const pillarCoords = [
      [-0.52, 0.32, -0.85, 1.82], // Front Left
      [0.52, 0.32, -0.85, 1.82],  // Front Right
      [-0.53, 0.54, 0.95, 1.82],  // Rear Left
      [0.53, 0.54, 0.95, 1.82]   // Rear Right
    ];
    for (const [px, y1, pz, y2] of pillarCoords) {
      const pLen = y2 - y1;
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, pLen), darkFrameMat);
      pillar.position.set(px, (y1 + y2) / 2, pz);
      this.canopyGroup.add(pillar);
    }

    // Rear side curtains with triangular transparent windows (Image 2 match)
    for (const cx of [-0.54, 0.54]) {
      const curtainGeo = new THREE.BoxGeometry(0.02, 0.62, 0.85);
      const curtain = new THREE.Mesh(curtainGeo, royalBlueMat);
      curtain.position.set(cx, 1.48, 0.55);
      this.canopyGroup.add(curtain);

      // Triangular plastic window inset
      const triWin = new THREE.Mesh(new THREE.BufferGeometry(), clearGlassMat);
      const vertices = new Float32Array([
        cx * 1.01, 1.62, 0.55,
        cx * 1.01, 1.35, 0.40,
        cx * 1.01, 1.35, 0.70
      ]);
      triWin.geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      triWin.geometry.computeVertexNormals();
      this.canopyGroup.add(triWin);
    }

    // -------------------------------------------------------------
    // 6. Iconic Rear Psychedelic Tapestry & Gold Fringe (Image 1 Match)
    // -------------------------------------------------------------
    const tapestryGeo = new THREE.PlaneGeometry(1.06, 0.82);
    this.rearTapestry = new THREE.Mesh(tapestryGeo, rearTapestryMat);
    this.rearTapestry.position.set(0, 1.44, 0.96);
    this.canopyGroup.add(this.rearTapestry);

    // 3D Red Pom-Pom Flowers (লাল ফুল) along the top arched curve of the rear canopy (Image 1)
    for (let a = 0.2; a <= Math.PI - 0.2; a += 0.35) {
      const rx = Math.cos(a) * 0.48;
      const ry = 1.84 + Math.sin(a) * 0.08;
      const flower = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.045),
        new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.6 })
      );
      flower.position.set(rx, ry, 0.97);
      this.canopyGroup.add(flower);
    }

    this.group.add(this.canopyGroup);

    // -------------------------------------------------------------
    // 7. Front Fork, Red Coil Shocks & Chrome Windshield Cage (Image 2)
    // -------------------------------------------------------------
    this.forkGroup = new THREE.Group();
    this.forkGroup.position.set(0, 0.32, -1.02);

    // Heavy front steering stem
    const stemGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.88);
    const stem = new THREE.Mesh(stemGeo, darkFrameMat);
    stem.position.y = 0.42;
    this.forkGroup.add(stem);

    // Chrome front mudguard / fender
    const fenderGeo = new THREE.CylinderGeometry(0.33, 0.33, 0.16, 16, 1, false, Math.PI * 0.1, Math.PI * 0.8);
    const fender = new THREE.Mesh(fenderGeo, chromeMat);
    fender.rotation.z = Math.PI / 2;
    fender.position.set(0, 0.08, 0.04);
    this.forkGroup.add(fender);

    // Dual front fork tubes with Signature Red Coil Spring Shock Absorbers! (Image 2)
    for (const fx of [-0.14, 0.14]) {
      // Chrome inner shock tube
      const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.52), chromeMat);
      tube.position.set(fx, 0.26, 0);
      this.forkGroup.add(tube);

      // Red external spring coils (spiral rings)
      for (let s = 0; s < 7; s++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.036, 0.012, 8, 16), redSpringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(fx, 0.14 + s * 0.04, 0);
        this.forkGroup.add(ring);
      }
    }

    // Motorcycle Handlebars
    const barGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.82);
    const bar = new THREE.Mesh(barGeo, chromeMat);
    bar.rotation.z = Math.PI / 2;
    bar.position.set(0, 0.78, 0.12);
    this.forkGroup.add(bar);

    // Black Rubber Hand Grips
    for (const gx of [-0.38, 0.38]) {
      const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.14), rubberMat);
      grip.rotation.z = Math.PI / 2;
      grip.position.set(gx, 0.78, 0.12);
      this.forkGroup.add(grip);

      // Brake levers
      const lever = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.012, 0.12), chromeMat);
      lever.position.set(gx, 0.76, 0.18);
      this.forkGroup.add(lever);

      // Rear-view Mirrors (Image 2)
      const mirrorStem = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.18), chromeMat);
      mirrorStem.position.set(gx, 0.88, 0.14);
      this.forkGroup.add(mirrorStem);
      const mirrorHead = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.06, 0.02), darkFrameMat);
      mirrorHead.position.set(gx, 0.98, 0.14);
      this.forkGroup.add(mirrorHead);
    }

    // Digital Instrument / Speedometer Pod in center of handlebars
    const dashPod = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.10, 0.14),
      new THREE.MeshStandardMaterial({ color: 0x0284c7 })
    );
    dashPod.position.set(0, 0.80, 0.12);
    this.forkGroup.add(dashPod);

    // -------------------------------------------------------------
    // Signature Front Arched Tubular Windshield Cage & Spear Finial (Image 2)
    // -------------------------------------------------------------
    this.windshieldGroup = new THREE.Group();

    // Curved chrome arch tubes sweeping up from headlight bracket to canopy roof
    for (const wx of [-0.28, 0.28]) {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(wx, 0.58, -0.16),
        new THREE.Vector3(wx, 0.95, -0.06),
        new THREE.Vector3(wx, 1.35, 0.22),
        new THREE.Vector3(wx * 0.9, 1.52, 0.42)
      ]);
      const archGeo = new THREE.TubeGeometry(curve, 20, 0.02, 8, false);
      const archMesh = new THREE.Mesh(archGeo, chromeMat);
      this.windshieldGroup.add(archMesh);
    }

    // Transverse chrome brace bars across the windshield arch
    for (const bz of [0.02, 0.22]) {
      const brace = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.56), chromeMat);
      brace.rotation.z = Math.PI / 2;
      brace.position.set(0, 0.98 + bz * 1.5, bz);
      this.windshieldGroup.add(brace);
    }

    // Signature Decorative Chrome Spear / Trident Finial Antenna Pole on Left Side! (Image 2)
    const spearPole = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.95), chromeMat);
    spearPole.position.set(-0.32, 1.25, 0.06);
    this.windshieldGroup.add(spearPole);

    // Spearhead / Trident finial tip on top of pole
    const spearHead = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.14, 4), chromeMat);
    spearHead.position.set(-0.32, 1.78, 0.06);
    this.windshieldGroup.add(spearHead);

    this.forkGroup.add(this.windshieldGroup);

    // -------------------------------------------------------------
    // Front Crystal Headlight Assembly (Round with Red Accent Bezel - Image 2)
    // -------------------------------------------------------------
    this.headlightHousing = new THREE.Group();
    this.headlightHousing.position.set(0, 0.58, -0.16);

    // Round chrome headlight bucket
    const lampBucket = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.08, 0.10, 24), chromeMat);
    lampBucket.rotation.x = Math.PI / 2;
    this.headlightHousing.add(lampBucket);

    // Red decorative accent trim ring (Image 2)
    const redRing = new THREE.Mesh(new THREE.TorusGeometry(0.125, 0.015, 12, 24), redSpringMat);
    this.headlightHousing.add(redRing);

    // Front glass lens
    const glassLens = new THREE.Mesh(
      new THREE.CircleGeometry(0.115, 24),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 })
    );
    glassLens.position.z = -0.055;
    this.headlightHousing.add(glassLens);

    // Blue lower accent bracket
    const blueBracket = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.08, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x1d4ed8 })
    );
    blueBracket.position.set(0, -0.10, 0);
    this.headlightHousing.add(blueBracket);

    this.forkGroup.add(this.headlightHousing);

    // -------------------------------------------------------------
    // Single Front Heavy-Duty Wheel (Solid Black Rim, Pink/Orange Hub)
    // -------------------------------------------------------------
    this.frontWheel = this.createEasybikeWheel(0.30, 0.12, true);
    this.frontWheel.position.set(0, 0, 0);
    this.forkGroup.add(this.frontWheel);

    this.group.add(this.forkGroup);

    // -------------------------------------------------------------
    // 8. Sturdy Rear Heavy-Duty Wheels (Left & Right)
    // -------------------------------------------------------------
    this.leftRearWheel = this.createEasybikeWheel(0.30, 0.13, false);
    this.leftRearWheel.position.set(-0.52, 0.32, 0.54);
    this.group.add(this.leftRearWheel);

    this.rightRearWheel = this.createEasybikeWheel(0.30, 0.13, false);
    this.rightRearWheel.position.set(0.52, 0.32, 0.54);
    this.group.add(this.rightRearWheel);

    // Rear differential axle linking the two wheels
    const rearAxleGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.04);
    const rearAxle = new THREE.Mesh(rearAxleGeo, darkFrameMat);
    rearAxle.rotation.z = Math.PI / 2;
    rearAxle.position.set(0, 0.32, 0.54);
    this.group.add(rearAxle);

    // Electric motor gearbox at center of rear axle
    const motorBoxGeo = new THREE.BoxGeometry(0.24, 0.20, 0.24);
    const motorBox = new THREE.Mesh(motorBoxGeo, new THREE.MeshStandardMaterial({ color: 0x10b981 }));
    motorBox.position.set(0, 0.32, 0.54);
    this.group.add(motorBox);

    // -------------------------------------------------------------
    // 9. Authentic Dual Snail Horn (YouTube 12V 115dB Snail Horn)
    // -------------------------------------------------------------
    this.hornGroup = new THREE.Group();
    this.hornGroup.position.set(0, 0.62, -0.88);

    for (const hx of [-0.08, 0.08]) {
      // Snail shell spiral housing
      const snailBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.055, 0.04, 16),
        new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.6 })
      );
      snailBody.rotation.x = Math.PI / 2;
      snailBody.position.x = hx;
      this.hornGroup.add(snailBody);

      // Flared horn mouth opening forward
      const snailMouth = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.02, 0.06, 12),
        chromeMat
      );
      snailMouth.rotation.x = Math.PI / 2;
      snailMouth.position.set(hx + (hx > 0 ? 0.03 : -0.03), -0.04, -0.04);
      this.hornGroup.add(snailMouth);
    }
    this.group.add(this.hornGroup);

    // -------------------------------------------------------------
    // 10. Fast & Furious Nitro Exhaust Flames & Fire System
    // -------------------------------------------------------------
    this.initFuriousFire();

    // -------------------------------------------------------------
    // 11. Driver Character & Fairy Lights
    // -------------------------------------------------------------
    this.initDriver();
    this.initFairyLights();
  }

  // Authentic Heavy-Duty Bangladeshi Easybike Wheel
  // Thick treaded rubber tire, black steel/alloy rim, pink/orange center hub cap
  createEasybikeWheel(radius, width, isFront = false) {
    const wheelGroup = new THREE.Group();

    // Tire with deep tread
    const tireGeo = new THREE.CylinderGeometry(radius, radius, width, 24);
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.95 });
    const tire = new THREE.Mesh(tireGeo, tireMat);
    tire.rotation.z = Math.PI / 2;
    tire.castShadow = true;
    wheelGroup.add(tire);

    // Solid Black Steel Rim with Cutouts (Image 2 Match)
    const rimGeo = new THREE.CylinderGeometry(radius * 0.72, radius * 0.72, width + 0.005, 20);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.85, roughness: 0.25 });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.z = Math.PI / 2;
    wheelGroup.add(rim);

    // Outer Chrome Rim Lip
    const lipGeo = new THREE.TorusGeometry(radius * 0.72, 0.012, 8, 24);
    const lip = new THREE.Mesh(lipGeo, new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95 }));
    lip.rotation.y = Math.PI / 2;
    lip.position.x = isFront ? 0.06 : 0.065;
    wheelGroup.add(lip);

    // Center Hub Cap (Pink on Front, Orange on Rear - Image 1 & 2 Match)
    const capColor = isFront ? 0xec4899 : 0xf97316;
    const capGeo = new THREE.CylinderGeometry(radius * 0.22, radius * 0.22, width + 0.02, 12);
    const capMat = new THREE.MeshStandardMaterial({ color: capColor, metalness: 0.7, roughness: 0.3 });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.rotation.z = Math.PI / 2;
    wheelGroup.add(cap);

    return wheelGroup;
  }

  // Driver Figure in White Panjabi & Red Collar seated on the driver bench
  // Fast & Furious Dual Nitro Exhaust Flames & Roaring Fire System
  initFuriousFire() {
    this.fireGroup = new THREE.Group();

    // 1. Dual Chrome Heavy-Duty Exhaust Pipes at rear undercarriage
    const pipeMat = new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      metalness: 0.95,
      roughness: 0.15
    });
    const tipMat = new THREE.MeshStandardMaterial({
      color: 0x4f46e5, // Anodized burnt titanium blue tip
      metalness: 0.9,
      roughness: 0.2
    });

    const pipePositions = [-0.42, 0.42];
    this.flameJets = [];

    pipePositions.forEach((px) => {
      // Exhaust Pipe Cylinder
      const pipeGeo = new THREE.CylinderGeometry(0.09, 0.11, 0.45, 16);
      const pipe = new THREE.Mesh(pipeGeo, pipeMat);
      pipe.rotation.x = Math.PI / 2;
      pipe.position.set(px, 0.26, 1.25);
      this.fireGroup.add(pipe);

      // Burnt Titanium Tip
      const tipGeo = new THREE.CylinderGeometry(0.10, 0.115, 0.12, 16);
      const tip = new THREE.Mesh(tipGeo, tipMat);
      tip.rotation.x = Math.PI / 2;
      tip.position.set(px, 0.26, 1.48);
      this.fireGroup.add(tip);

      // Flame Jet Container (Points directly backward along +Z)
      const jetGroup = new THREE.Group();
      jetGroup.position.set(px, 0.26, 1.55);

      // Outer Roaring Fiery Orange/Red Flame
      const outerGeo = new THREE.ConeGeometry(0.22, 1.4, 16);
      outerGeo.translate(0, 0.7, 0); // Origin at base of cone
      const outerMat = new THREE.MeshBasicMaterial({
        color: 0xff3700,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const outerFlame = new THREE.Mesh(outerGeo, outerMat);
      outerFlame.rotation.x = Math.PI / 2;
      jetGroup.add(outerFlame);

      // Inner Fast & Furious Electric Cyan/Blue Nitrous Core
      const innerGeo = new THREE.ConeGeometry(0.12, 0.85, 16);
      innerGeo.translate(0, 0.42, 0);
      const innerMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const innerFlame = new THREE.Mesh(innerGeo, innerMat);
      innerFlame.rotation.x = Math.PI / 2;
      jetGroup.add(innerFlame);

      // White-Hot High-Temperature Core Tip
      const coreGeo = new THREE.ConeGeometry(0.06, 0.45, 12);
      coreGeo.translate(0, 0.22, 0);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const coreFlame = new THREE.Mesh(coreGeo, coreMat);
      coreFlame.rotation.x = Math.PI / 2;
      jetGroup.add(coreFlame);

      this.fireGroup.add(jetGroup);
      this.flameJets.push({
        jetGroup,
        outerFlame,
        innerFlame,
        coreFlame,
        baseX: px
      });
    });

    // 2. Dynamic Fire Illumination (Flickering PointLight on Asphalt)
    this.fireLight = new THREE.PointLight(0xff4400, 2.5, 7.5);
    this.fireLight.position.set(0, 0.35, 1.8);
    this.fireGroup.add(this.fireLight);

    // 3. Trailing Fire Ember / Spark Particles
    this.fireSparks = [];
    const sparkGeo = new THREE.SphereGeometry(0.045, 6, 6);
    const sparkMat = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    for (let i = 0; i < 20; i++) {
      const spark = new THREE.Mesh(sparkGeo, sparkMat.clone());
      spark.visible = false;
      this.fireGroup.add(spark);
      this.fireSparks.push({
        mesh: spark,
        vx: 0,
        vy: 0,
        vz: 0,
        life: 0,
        maxLife: 0.35
      });
    }

    this.group.add(this.fireGroup);
  }

  initDriver() {
    this.driverGroup = new THREE.Group();
    // Positioned seated naturally on driver seat bench
    this.driverGroup.position.set(0, 0.74, -0.22);

    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x4a3525, roughness: 0.9 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0x8d5524, roughness: 0.8 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });

    // Torso (White Panjabi)
    const torsoGeo = new THREE.BoxGeometry(0.40, 0.50, 0.26);
    const torso = new THREE.Mesh(torsoGeo, whiteMat);
    torso.position.set(0, 0.34, 0);
    torso.castShadow = true;
    this.driverGroup.add(torso);

    // Red Collar / Shoulder Trim
    const redCollarGeo = new THREE.BoxGeometry(0.42, 0.08, 0.28);
    const redCollar = new THREE.Mesh(redCollarGeo, redMat);
    redCollar.position.set(0, 0.56, 0);
    this.driverGroup.add(redCollar);

    // Driver Head
    const headGeo = new THREE.SphereGeometry(0.13, 12, 12);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.set(0, 0.72, 0);
    this.driverGroup.add(head);

    // Cap / Hair
    const capGeo = new THREE.CylinderGeometry(0.135, 0.135, 0.07, 12);
    const cap = new THREE.Mesh(capGeo, blackMat);
    cap.position.set(0, 0.80, 0);
    this.driverGroup.add(cap);

    // Arms reaching forward to motorcycle handlebars
    for (const ax of [-0.21, 0.21]) {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.46), whiteMat);
      arm.rotation.x = Math.PI / 3.2;
      arm.position.set(ax, 0.38, -0.22);
      this.driverGroup.add(arm);
    }

    // Seated Thighs (horizontal forward from seat)
    for (const lx of [-0.14, 0.14]) {
      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.38), pantsMat);
      thigh.rotation.x = Math.PI / 2.2;
      thigh.position.set(lx, 0.10, -0.16);
      this.driverGroup.add(thigh);

      // Lower Legs down to floorboard
      const calf = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.36), pantsMat);
      calf.position.set(lx, -0.16, -0.34);
      this.driverGroup.add(calf);
    }

    this.group.add(this.driverGroup);
  }

  // Blinking Fairy Lights around the roof canopy rim (ঝালর বাতি)
  initFairyLights() {
    this.fairyLights = [];
    const colors = [0xff0055, 0x00ffcc, 0xffea00, 0x00ff44, 0xff00ff, 0xff9900];

    // Left canopy roof edge
    for (let i = 0; i < 9; i++) {
      const z = -1.0 + i * 0.25;
      const lightMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 8, 8),
        new THREE.MeshBasicMaterial({ color: colors[i % colors.length] })
      );
      lightMesh.position.set(-0.58, 1.86, z);
      this.group.add(lightMesh);
      this.fairyLights.push({ mesh: lightMesh, colorIdx: i % colors.length });
    }
    // Right canopy roof edge
    for (let i = 0; i < 9; i++) {
      const z = -1.0 + i * 0.25;
      const lightMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 8, 8),
        new THREE.MeshBasicMaterial({ color: colors[(i + 3) % colors.length] })
      );
      lightMesh.position.set(0.58, 1.86, z);
      this.group.add(lightMesh);
      this.fairyLights.push({ mesh: lightMesh, colorIdx: (i + 3) % colors.length });
    }
  }

  initHeadlights() {
    this.headlight = new THREE.SpotLight(0xfffae0, 3.2, 55, Math.PI / 4.2, 0.35, 1.2);
    this.headlight.position.set(0, 0.90, -1.25);
    this.headlightTarget = new THREE.Object3D();
    this.headlightTarget.position.set(0, 0, -22);
    this.group.add(this.headlightTarget);
    this.headlight.target = this.headlightTarget;
    this.group.add(this.headlight);
  }

  addCarPart() {
    this.partsCollected++;
    this.battery = Math.min(100, this.battery + 18);
    this.health = Math.min(100, this.health + 25);

    if (this.partsCollected >= this.partsToNextLevel && this.upgradeLevel < 4) {
      this.upgradeLevel++;
      this.partsToNextLevel += 6;
      this.applyVisualUpgrade();
      return true;
    }
    return false;
  }

  applyVisualUpgrade() {
    if (this.upgradeLevel === 2) {
      this.maxSpeed = 75;
      if (this.roofSlab) this.roofSlab.scale.set(1.05, 1.05, 1.05);
    } else if (this.upgradeLevel === 3) {
      this.maxSpeed = 90;
      const extraHorn = this.hornGroup.clone();
      extraHorn.position.y += 0.22;
      this.group.add(extraHorn);
    } else if (this.upgradeLevel >= 4) {
      this.maxSpeed = 110;
    }
  }

  startTurn(direction, chourasta) {
    if (this.isTurning) return;
    this.isTurning = true;
    this.turnProgress = 0;
    this.turnDirection = direction;
    this.turnChourasta = chourasta;
    this.speed = Math.max(28, Math.abs(this.speed));
    if (this.onTurnStart) {
      this.onTurnStart(direction, chourasta?.stationData);
    }
  }

  activateTurboBoost(duration = 2.8) {
    this.boostTimer = duration;
    // Instant rocket impulse! Immediate surge into high speed
    this.speed = Math.max(this.speed + 22, 65);
    if (this.speed > this.boostMaxSpeed) this.speed = this.boostMaxSpeed;
  }

  update(delta, input, activeChourastas = []) {
    // Update active turbo boost timer
    if (this.boostTimer > 0) {
      this.boostTimer -= delta;
    }
    const isBoosting = !!input.boost || (this.boostTimer > 0);

    const cruiseTarget = this.autoCruiseEnabled ? 32 : 0;
    if (isBoosting) {
      // TURBO NITRO OVERDRIVE: Rocket boost propulsion up to boostMaxSpeed!
      this.speed += this.acceleration * 3.2 * delta;
      if (this.speed > this.boostMaxSpeed) this.speed = this.boostMaxSpeed;
      this.battery = Math.max(0, this.battery - 0.06);
    } else if (input.forward) {
      this.speed += this.acceleration * delta;
      if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
      this.battery = Math.max(0, this.battery - 0.02);
    } else if (input.backward) {
      this.speed -= this.braking * delta;
      if (this.speed < -16) this.speed = -16;
    } else {
      if (this.autoCruiseEnabled) {
        if (this.speed < cruiseTarget) {
          this.speed = Math.min(cruiseTarget, this.speed + this.acceleration * 0.9 * delta);
        } else if (this.speed > this.maxSpeed) {
          // Smooth aerodynamic deceleration from turbo
          this.speed = Math.max(this.maxSpeed, this.speed - this.friction * 1.4 * delta);
        }
      } else {
        if (this.speed > 0) {
          this.speed = Math.max(0, this.speed - this.friction * delta);
        } else if (this.speed < 0) {
          this.speed = Math.min(0, this.speed + this.friction * delta);
        }
      }
      this.battery = Math.max(0, this.battery - 0.015);
    }

    // Steering: Left turns to negative X, Right turns to positive X
    let targetSteer = 0;
    if (input.left) targetSteer -= this.maxSteerAngle;
    if (input.right) targetSteer += this.maxSteerAngle;

    this.steerAngle += (targetSteer - this.steerAngle) * this.steerSpeed * delta * 6;
    this.forkGroup.rotation.y = -this.steerAngle * 0.95;

    // Lean into turns smoothly (Subtle, realistic, upright stance)
    const targetTilt = -this.steerAngle * (this.speed / this.maxSpeed) * 0.10;
    this.tilt += (targetTilt - this.tilt) * 6 * delta;
    this.group.rotation.z = this.tilt;

    // Pitch tilt when accelerating
    const targetPitch = input.forward ? -Math.min(0.08, (this.speed / 60) * 0.07) : 0;
    this.group.rotation.x += (targetPitch - this.group.rotation.x) * 6 * delta;

    // Bumpy road & footpath elevation
    const absX = Math.abs(this.group.position.x);
    let surfaceHeight = 0;
    if (absX >= 13.0) {
      surfaceHeight = 0.28; // Elevated up on the terracotta sidewalk!
    } else if (absX > 12.4) {
      // Smooth curb climbing ramp
      const t = (absX - 12.4) / 0.6;
      surfaceHeight = 0.28 * t;
    }
    const bump = Math.sin(Date.now() * 0.012) * (this.speed / 40) * 0.03;
    this.group.position.y = surfaceHeight + bump;

    // Spin wheels
    const spin = (this.speed / 3.6) * delta * 4;
    this.frontWheel.rotation.x += spin;
    this.leftRearWheel.rotation.x += spin;
    this.rightRearWheel.rotation.x += spin;

    // Move along road
    const moveZ = (this.speed / 3.6) * delta;
    this.group.position.z -= moveZ;

    if (Math.abs(this.speed) > 0.5) {
      const latSpeed = Math.max(9.0, Math.abs(this.speed) / 3.6);
      this.group.position.x += this.steerAngle * latSpeed * delta * 1.9;
    }

    // Check if player is near any active Chourasta intersection
    let isAtChourasta = false;
    let currentChourasta = null;
    if (activeChourastas && activeChourastas.length > 0) {
      for (const ch of activeChourastas) {
        if (Math.abs(this.group.position.z - ch.z) < 28.0) {
          isAtChourasta = true;
          currentChourasta = ch;
          break;
        }
      }
    }

    // Dynamic horizontal boundary:
    // At Chourasta 4-way intersections, cross-street opens wide to ±38m!
    // On straight highway: opens to ±18.2m covering full asphalt road & sidewalk!
    const maxBoundX = isAtChourasta ? 38.0 : 18.2;

    if (this.group.position.x < -maxBoundX) {
      this.group.position.x = -maxBoundX;
      this.steerAngle = Math.max(0, this.steerAngle);
      this.speed *= 0.94;
    } else if (this.group.position.x > maxBoundX) {
      this.group.position.x = maxBoundX;
      this.steerAngle = Math.min(0, this.steerAngle);
      this.speed *= 0.94;
    }

    // Roundabout island collision at (0, 0, ch.z) with DMP police podium
    if (isAtChourasta && currentChourasta) {
      const dx = this.group.position.x;
      const dz = this.group.position.z - currentChourasta.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < 2.35 && dist > 0.05) {
        const pushAngle = Math.atan2(dz, dx);
        this.group.position.x = Math.cos(pushAngle) * 2.4;
        this.group.position.z = currentChourasta.z + Math.sin(pushAngle) * 2.4;
        this.speed *= 0.85;
        if (this.onRoundaboutBump) this.onRoundaboutBump();
      }
    }

    // Auto-commit turn when user steers into the side avenue
    if (isAtChourasta && !this.isTurning && currentChourasta) {
      if ((this.group.position.x < -7.5 && input.left) || this.group.position.x < -14.0) {
        this.startTurn('left', currentChourasta);
      } else if ((this.group.position.x > 7.5 && input.right) || this.group.position.x > 14.0) {
        this.startTurn('right', currentChourasta);
      }
    }

    // Dynamic 90-degree intersection turn animation
    if (this.isTurning) {
      this.turnProgress += delta * 1.6;
      const p = Math.min(1.0, this.turnProgress);
      const sign = (this.turnDirection === 'left') ? -1 : 1;

      // Smooth arc into the crossroad
      this.group.position.x += sign * 18.0 * delta * (1.0 - p * 0.4);

      // Dynamic drift yaw rotation
      this.group.rotation.y = sign * (Math.PI / 2) * Math.sin(p * Math.PI * 0.5);
      this.group.rotation.z = -sign * Math.sin(p * Math.PI) * 0.16;

      if (this.turnProgress >= 1.0) {
        this.isTurning = false;
        this.group.rotation.y = 0;
        this.group.rotation.z = 0;
        this.group.position.x = sign * 4.2;
        if (this.onTurnComplete) {
          this.onTurnComplete(this.turnDirection, this.turnChourasta?.stationData);
        }
      }
    } else {
      // Normal yaw returns smoothly to 0
      this.group.rotation.y *= 0.88;
    }

    // Animate fairy lights blinking!
    if (Math.floor(Date.now() / 150) % 2 === 0) {
      for (let fl of this.fairyLights) {
        fl.mesh.visible = true;
      }
    } else {
      for (let i = 0; i < this.fairyLights.length; i++) {
        this.fairyLights[i].mesh.visible = i % 2 === 0;
      }
    }

    // Animate Fast & Furious Nitro Exhaust Flames & Fire System
    const isDriving = input.forward && this.speed > 3;
    const isHighSpeed = Math.abs(this.speed) > 30;

    if (this.flameJets && this.flameJets.length > 0) {
      const time = Date.now() * 0.04;
      let targetScaleZ = 0;
      let targetScaleXY = 0;
      let lightIntensity = 0;

      if (isBoosting) {
        // MAXIMUM FAST & FURIOUS NITRO OVERDRIVE!
        targetScaleZ = 2.4 + Math.sin(time) * 0.5 + Math.random() * 0.4;
        targetScaleXY = 1.35 + Math.sin(time * 1.5) * 0.2;
        lightIntensity = 5.5 + Math.random() * 2.0;
        this.fireLight.color.setHex(0x00f0ff); // Blazing cyan-blue nitro glow
      } else if (isDriving || isHighSpeed) {
        // Furious street racing exhaust flames
        const speedFactor = Math.min(1.0, Math.abs(this.speed) / this.maxSpeed);
        targetScaleZ = 0.9 + speedFactor * 0.8 + Math.sin(time) * 0.3;
        targetScaleXY = 0.9 + speedFactor * 0.3;
        lightIntensity = 2.2 + Math.random() * 1.4;
        this.fireLight.color.setHex(0xff5500); // Raging orange fire glow
      } else if (this.speed > 0.5) {
        // Idle gentle pilot flame lick
        targetScaleZ = 0.35 + Math.sin(time * 0.8) * 0.15;
        targetScaleXY = 0.6;
        lightIntensity = 0.8 + Math.random() * 0.4;
        this.fireLight.color.setHex(0xff7700);
      } else {
        targetScaleZ = 0;
        targetScaleXY = 0;
        lightIntensity = 0;
      }

      this.fireLight.intensity = lightIntensity;

      for (let f = 0; f < this.flameJets.length; f++) {
        const jet = this.flameJets[f];
        if (targetScaleZ <= 0.05) {
          jet.jetGroup.visible = false;
        } else {
          jet.jetGroup.visible = true;
          // Random flame jitter for realistic turbulence
          const jitterX = (Math.random() - 0.5) * 0.04;
          const jitterY = (Math.random() - 0.5) * 0.04;
          jet.jetGroup.position.x = jet.baseX + jitterX;
          jet.jetGroup.position.y = 0.26 + jitterY;

          // Scale flame
          jet.jetGroup.scale.set(targetScaleXY, targetScaleXY, targetScaleZ);

          // In boost mode, intensify blue core and glow
          if (isBoosting) {
            jet.innerFlame.material.color.setHex(0x00ffff);
            jet.innerFlame.scale.set(1.4, 1.4, 1.3);
            jet.outerFlame.material.color.setHex(0x3b82f6);
          } else {
            jet.innerFlame.material.color.setHex(0x00f0ff);
            jet.innerFlame.scale.set(1.0, 1.0, 1.0);
            jet.outerFlame.material.color.setHex(0xff3700);
          }
        }
      }

      // Spawn and animate fire sparks / embers shooting backwards
      if (isBoosting || isDriving) {
        for (const spark of this.fireSparks) {
          if (!spark.mesh.visible && Math.random() > 0.45) {
            const side = Math.random() > 0.5 ? -0.42 : 0.42;
            spark.mesh.position.set(
              side + (Math.random() - 0.5) * 0.1,
              0.26 + (Math.random() - 0.5) * 0.1,
              1.55
            );
            spark.vx = (Math.random() - 0.5) * (isBoosting ? 3.0 : 1.5);
            spark.vy = Math.random() * (isBoosting ? 2.5 : 1.2) - 0.3;
            spark.vz = (isBoosting ? 8.0 : 4.5) + Math.random() * 3.0; // shoot backwards
            spark.life = 0;
            spark.maxLife = 0.25 + Math.random() * 0.18;
            spark.mesh.material.color.setHex(isBoosting ? (Math.random() > 0.4 ? 0x00f0ff : 0xffaa00) : 0xff7700);
            spark.mesh.material.opacity = 1.0;
            spark.mesh.visible = true;
          }
        }
      }

      // Update active sparks
      for (const spark of this.fireSparks) {
        if (spark.mesh.visible) {
          spark.life += delta;
          if (spark.life >= spark.maxLife) {
            spark.mesh.visible = false;
          } else {
            spark.mesh.position.x += spark.vx * delta;
            spark.mesh.position.y += spark.vy * delta;
            spark.mesh.position.z += spark.vz * delta;
            const progress = spark.life / spark.maxLife;
            spark.mesh.material.opacity = 1.0 - progress;
            const s = Math.max(0.1, 1.0 - progress * 0.8);
            spark.mesh.scale.set(s, s, s);
          }
        }
      }
    }
  }

  getBounds() {
    return {
      x: this.group.position.x,
      z: this.group.position.z,
      width: 1.6,
      length: 2.8
    };
  }
}
