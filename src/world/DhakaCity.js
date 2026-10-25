import * as THREE from 'three';
import { TextureFactory } from '../ui/Textures.js';

export class DhakaCity {
  constructor(scene) {
    this.scene = scene;
    this.buildings = [];
    this.teaStalls = [];
    this.footpathShops = [];
    this.footpathHumans = [];
    this.footbridges = [];
    this.electricPoles = [];
    this.overheadWires = [];
    this.boundaryWalls = [];
    this.umbrellaVendors = [];
    this.buntingFlags = [];

    // Pre-create textures
    this.canopyRed = TextureFactory.createShopCanopyTexture('#c62828');
    this.canopyBlue = TextureFactory.createShopCanopyTexture('#0284c7');
    this.canopyYellow = TextureFactory.createShopCanopyTexture('#d97706');

    this.shopTex0 = TextureFactory.createShopfrontTexture(0);
    this.shopTex1 = TextureFactory.createShopfrontTexture(1);
    this.shopTex2 = TextureFactory.createShopfrontTexture(2);

    this.brickTex0 = (typeof TextureFactory.createDhakaBrickBuildingTexture === 'function')
      ? TextureFactory.createDhakaBrickBuildingTexture(0)
      : null;
    this.brickTex1 = (typeof TextureFactory.createDhakaBrickBuildingTexture === 'function')
      ? TextureFactory.createDhakaBrickBuildingTexture(1)
      : null;

    this.initCity();
  }

  isChourastaCrossing(z) {
    const mod = ((z % 240) + 240) % 240;
    return mod < 14 || mod > 226;
  }

  initCity() {
    const buildingColors = [
      0x993322, // Dhaka Terracotta Brick Red
      0x883a2b, // Weathered Red Brick
      0xd7ccc8, // Sandstone plaster
      0xb0bec5, // Concrete gray
      0x94a3b8, // Slate
      0xfde68a  // Ochre cream
    ];

    // 1. Multistory Dhaka Buildings with Balconies, AC units & Rooftop Tanks
    for (let i = 0; i < 32; i++) {
      const isLeft = i % 2 === 0;
      const x = isLeft ? -24 - Math.random() * 5 : 24 + Math.random() * 5;
      let z = -i * 18;
      if (this.isChourastaCrossing(z)) z -= 16;
      const width = 13 + Math.random() * 5;
      const height = 20 + Math.random() * 26;
      const depth = 14 + Math.random() * 5;

      const geo = new THREE.BoxGeometry(width, height, depth);
      const color = isLeft ? 0x993322 : buildingColors[Math.floor(Math.random() * buildingColors.length)];
      const mat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.85 });
      const b = new THREE.Mesh(geo, mat);
      b.position.set(x, height / 2, z);
      b.castShadow = false; // Disabled on static buildings for ultra-smooth 60 FPS
      b.receiveShadow = true;
      this.scene.add(b);

      // Building Front Facade with Brick, Lit Windows & Clinic Signs
      const bTex = isLeft ? this.brickTex0 : this.brickTex1;
      const facadeConfig = { roughness: 0.7 };
      if (bTex) facadeConfig.map = bTex;
      const facadeMat = new THREE.MeshStandardMaterial(facadeConfig);
      const facadeGeo = new THREE.PlaneGeometry(width * 0.95, height * 0.95);
      const facade = new THREE.Mesh(facadeGeo, facadeMat);
      facade.position.set(
        isLeft ? x + width / 2 + 0.08 : x - width / 2 - 0.08,
        height / 2,
        z
      );
      facade.rotation.y = isLeft ? Math.PI / 2 : -Math.PI / 2;
      this.scene.add(facade);

      // Balconies with iron grills on front facade
      const balconyMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.5 });
      const numBalconies = Math.floor(height / 6);
      const balconies = [facade];
      for (let floor = 1; floor <= numBalconies; floor++) {
        const by = floor * 5.5;
        const balGeo = new THREE.BoxGeometry(0.8, 0.9, 3.6);
        const bal = new THREE.Mesh(balGeo, balconyMat);
        bal.position.set(isLeft ? x + width / 2 + 0.4 : x - width / 2 - 0.4, by, z + (Math.random() - 0.5) * 4);
        bal.castShadow = true;
        this.scene.add(bal);
        balconies.push(bal);

        // Outdoor AC Compressor Box on wall next to balcony
        const acGeo = new THREE.BoxGeometry(0.45, 0.55, 0.75);
        const acMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.4 });
        const ac = new THREE.Mesh(acGeo, acMat);
        ac.position.set(isLeft ? x + width / 2 + 0.22 : x - width / 2 - 0.22, by + 1.2, z + 2.5);
        this.scene.add(ac);
        balconies.push(ac);
      }

      // Rooftop Black Water Tank (গাজী / আরএফএল পানির ট্যাঙ্ক)
      const tankGeo = new THREE.CylinderGeometry(1.3, 1.3, 2.4, 16);
      const tankMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.7 });
      const tank = new THREE.Mesh(tankGeo, tankMat);
      tank.position.set(x + (Math.random() * 3 - 1.5), height + 1.2, z + (Math.random() * 3 - 1.5));
      tank.castShadow = true;
      this.scene.add(tank);

      // Rooftop Dish Antenna
      const dishGeo = new THREE.CylinderGeometry(0.8, 0.2, 0.25, 16);
      const dishMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8 });
      const dish = new THREE.Mesh(dishGeo, dishMat);
      dish.rotation.x = Math.PI / 3;
      dish.position.set(x + 2, height + 0.6, z - 2);
      this.scene.add(dish);

      // Ground Floor Shopfront with Canvas Awning
      const shopTex = (i % 3 === 0) ? this.shopTex0 : (i % 3 === 1 ? this.shopTex1 : this.shopTex2);
      const shopGeo = new THREE.PlaneGeometry(8.5, 3.8);
      const shopMat = new THREE.MeshStandardMaterial({ map: shopTex, roughness: 0.7 });
      const shop = new THREE.Mesh(shopGeo, shopMat);
      shop.position.set(isLeft ? x + width / 2 + 0.05 : x - width / 2 - 0.05, 2.0, z);
      shop.rotation.y = isLeft ? Math.PI / 2 : -Math.PI / 2;
      this.scene.add(shop);

      // Striped Canvas Awning projecting over sidewalk
      const canopyTex = (i % 3 === 0) ? this.canopyRed : (i % 3 === 1 ? this.canopyBlue : this.canopyYellow);
      const canopyGeo = new THREE.PlaneGeometry(8.5, 2.6);
      const canopyMat = new THREE.MeshStandardMaterial({ map: canopyTex, side: THREE.DoubleSide });
      const canopy = new THREE.Mesh(canopyGeo, canopyMat);
      canopy.position.set(isLeft ? x + width / 2 + 1.2 : x - width / 2 - 1.2, 3.7, z);
      canopy.rotation.x = Math.PI / 2 + (isLeft ? 0.35 : -0.35);
      canopy.rotation.y = isLeft ? Math.PI / 2 : -Math.PI / 2;
      canopy.castShadow = true;
      this.scene.add(canopy);

      // Bangladesh Flag on occasional building facade
      let flagGroup = null;
      if (i % 4 === 0) {
        flagGroup = this.createBDFlag();
        flagGroup.position.set(isLeft ? x + width / 2 + 1.5 : x - width / 2 - 1.5, 6.8, z);
        this.scene.add(flagGroup);
      }

      this.buildings.push({
        mesh: b,
        tank: tank,
        dish: dish,
        shop: shop,
        canopy: canopy,
        balconies: balconies,
        flag: flagGroup,
        baseX: x
      });
    }

    // 2. Footpath Human Shops (টং দোকান, ঝালমুড়ি, ফল, কাপড়) - Authentic Dhaka Vendors!
    // Placed along the outer edge of sidewalk (X = +/- 16.0) leaving X = 13.5 to 15.2 open for driving!
    this.footpathShops = [];
    const shopTypes = ['tong', 'jhalmuri', 'fruit', 'clothes'];
    for (let s = 0; s < 16; s++) {
      const isLeft = s % 2 === 0;
      const x = isLeft ? -16.0 : 16.0;
      let z = -s * 25 - 12;
      if (this.isChourastaCrossing(z)) z -= 16;
      const type = shopTypes[s % shopTypes.length];
      const shop = this.createFootpathShop(type, isLeft);
      shop.position.set(x, 0.28, z);
      this.scene.add(shop);
      this.footpathShops.push({ group: shop, baseZ: z, isLeft, type });
    }

    // 3. Human Pedestrians Walking Along the Footpath (Populated, Vibrant Dhaka Sidewalk Crowds!)
    this.footpathHumans = [];
    const numPeds = 64; // 64 diverse pedestrians populated along both sidewalks!
    for (let p = 0; p < numPeds; p++) {
      const isLeft = p % 2 === 0;
      // Staggered across the 4.5m wide sidewalk
      const laneOffset = ((p * 7) % 5) * 0.55; // 0 to 2.2m offset
      const x = isLeft ? (-13.8 - laneOffset) : (13.8 + laneOffset);
      let z = (numPeds / 2 - p) * 9.5; // Spread from -300m to +300m across the world!
      if (this.isChourastaCrossing(z)) z -= 14;

      const ped = this.createFootpathPedestrian(isLeft, p);
      ped.position.set(x, 0.28, z);
      this.scene.add(ped);
      this.footpathHumans.push({ group: ped, baseZ: z, isLeft, origX: x });
    }

    // 4. Concrete Utility Poles with Transformers (spaced neatly at outer edge of footpath)
    for (let p = 0; p < 16; p++) {
      const isLeft = p % 2 === 0;
      const x = isLeft ? -17.5 : 17.5;
      let z = -p * 32;
      if (this.isChourastaCrossing(z)) z -= 16;
      const pole = this.createElectricPole(isLeft);
      pole.position.set(x, 0, z);
      this.scene.add(pole);
      this.electricPoles.push(pole);
    }

    // 5. Tangled Overhead Power Cables
    this.initOverheadWires();

    // 6. Sidewalk Concrete Boundary Walls & Low-poly Trees (Moved back to X = +/- 17.8 for full 4.6m sidewalk!)
    for (let w = 0; w < 24; w++) {
      let wz = -w * 18;
      if (this.isChourastaCrossing(wz)) wz -= 16;
      const wall = this.createBoundaryWallWithTrees(wz);
      this.scene.add(wall);
      this.boundaryWalls.push(wall);
    }

    // 7. Festive Triangular Paper Bunting Flags (Disabled to prevent blocking player's road view)
    // Roadway bunting removed for clear road visibility

    // 8. Foot-Overbridges with Giant Billboards
    for (let f = 0; f < 3; f++) {
      const bridge = this.createFootbridge(f);
      bridge.position.set(0, 0, -f * 140 - 70);
      this.scene.add(bridge);
      this.footbridges.push(bridge);
    }
  }

  // -------------------------------------------------------------
  // Stylized 3D Bangladeshi Human Character Builder
  // -------------------------------------------------------------
  createHumanFigure({
    skinColor = 0x8d5524,
    shirtColor = 0x2563eb,
    pantsColor = 0x1e293b,
    isLungi = false,
    lungiColor = 0x0284c7,
    hasGamcha = false,
    hasCap = false,
    holding = 'none',
    isSitting = false,
    scale = 1.0
  }) {
    const group = new THREE.Group();
    const skinMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.8 });
    const shirtMat = new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.7 });
    const darkHairMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.1 });

    // Torso
    const torsoGeo = new THREE.BoxGeometry(0.36 * scale, 0.46 * scale, 0.22 * scale);
    const torso = new THREE.Mesh(torsoGeo, shirtMat);
    torso.position.y = (isSitting ? 0.70 : 1.05) * scale;
    torso.castShadow = true;
    group.add(torso);

    // Gamcha (scarf draped over shoulder/neck)
    if (hasGamcha) {
      const gamchaGeo = new THREE.BoxGeometry(0.40 * scale, 0.08 * scale, 0.26 * scale);
      const gamcha = new THREE.Mesh(gamchaGeo, new THREE.MeshStandardMaterial({ color: 0xef4444 }));
      gamcha.position.y = (isSitting ? 0.92 : 1.28) * scale;
      group.add(gamcha);
    }

    // Head
    const headGeo = new THREE.SphereGeometry(0.12 * scale, 10, 10);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = (isSitting ? 1.08 : 1.42) * scale;
    group.add(head);

    // Hair or Cap
    if (hasCap) {
      const capGeo = new THREE.CylinderGeometry(0.125 * scale, 0.125 * scale, 0.06 * scale, 10);
      const cap = new THREE.Mesh(capGeo, new THREE.MeshStandardMaterial({ color: 0xffffff }));
      cap.position.y = (isSitting ? 1.16 : 1.50) * scale;
      group.add(cap);
    } else {
      const hairGeo = new THREE.CylinderGeometry(0.125 * scale, 0.125 * scale, 0.06 * scale, 10);
      const hair = new THREE.Mesh(hairGeo, darkHairMat);
      hair.position.y = (isSitting ? 1.16 : 1.50) * scale;
      group.add(hair);
    }

    // Arms
    const armGeo = new THREE.CylinderGeometry(0.045 * scale, 0.045 * scale, 0.38 * scale);
    const armL = new THREE.Mesh(armGeo, shirtMat);
    armL.position.set(-0.21 * scale, (isSitting ? 0.74 : 1.08) * scale, 0);
    group.add(armL);

    const armR = new THREE.Mesh(armGeo, shirtMat);
    armR.position.set(0.21 * scale, (isSitting ? 0.74 : 1.08) * scale, 0);
    group.add(armR);

    // Handheld Props
    if (holding === 'kettle') {
      armR.rotation.x = Math.PI / 2.8;
      armR.position.z = 0.14 * scale;
      const kettle = new THREE.Mesh(new THREE.CylinderGeometry(0.08 * scale, 0.10 * scale, 0.18 * scale, 8), chromeMat);
      kettle.position.set(0.22 * scale, (isSitting ? 0.65 : 0.98) * scale, 0.30 * scale);
      group.add(kettle);
    } else if (holding === 'cup') {
      armR.rotation.x = Math.PI / 2.4;
      armR.position.z = 0.14 * scale;
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.04 * scale, 0.03 * scale, 0.08 * scale, 8), new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
      cup.position.set(0.21 * scale, (isSitting ? 0.76 : 1.12) * scale, 0.26 * scale);
      group.add(cup);
    } else if (holding === 'jhalmuri_tin') {
      armR.rotation.x = Math.PI / 2.6;
      armR.position.z = 0.15 * scale;
      const tin = new THREE.Mesh(new THREE.CylinderGeometry(0.07 * scale, 0.06 * scale, 0.20 * scale, 10), chromeMat);
      tin.position.set(0.21 * scale, 0.92 * scale, 0.28 * scale);
      group.add(tin);
      const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.01 * scale, 0.01 * scale, 0.24 * scale), new THREE.MeshStandardMaterial({ color: 0x78350f }));
      stick.rotation.x = Math.PI / 3;
      stick.position.set(0.21 * scale, 1.02 * scale, 0.30 * scale);
      group.add(stick);
    } else if (holding === 'cone') {
      armR.rotation.x = Math.PI / 2.4;
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.05 * scale, 0.14 * scale, 6), new THREE.MeshStandardMaterial({ color: 0xd4d4d8 }));
      cone.rotation.x = Math.PI;
      cone.position.set(0.21 * scale, (isSitting ? 0.76 : 1.12) * scale, 0.24 * scale);
      group.add(cone);
    } else if (holding === 'waving') {
      armR.rotation.z = -Math.PI / 2.4;
      armR.position.y = 1.25 * scale;
    }

    // Legs / Lower Body
    if (isSitting) {
      const legMat = new THREE.MeshStandardMaterial({ color: isLungi ? lungiColor : pantsColor });
      const thighGeo = new THREE.BoxGeometry(0.34 * scale, 0.14 * scale, 0.36 * scale);
      const thigh = new THREE.Mesh(thighGeo, legMat);
      thigh.position.set(0, 0.46 * scale, 0.14 * scale);
      group.add(thigh);

      const calfGeo = new THREE.BoxGeometry(0.12 * scale, 0.42 * scale, 0.12 * scale);
      const calfL = new THREE.Mesh(calfGeo, legMat);
      calfL.position.set(-0.10 * scale, 0.21 * scale, 0.30 * scale);
      group.add(calfL);
      const calfR = new THREE.Mesh(calfGeo, legMat);
      calfR.position.set(0.10 * scale, 0.21 * scale, 0.30 * scale);
      group.add(calfR);
    } else {
      if (isLungi) {
        const lungiGeo = new THREE.CylinderGeometry(0.18 * scale, 0.22 * scale, 0.80 * scale, 12);
        const lungi = new THREE.Mesh(lungiGeo, new THREE.MeshStandardMaterial({ color: lungiColor, roughness: 0.8 }));
        lungi.position.y = 0.42 * scale;
        lungi.castShadow = true;
        group.add(lungi);
      } else {
        const legGeo = new THREE.CylinderGeometry(0.07 * scale, 0.065 * scale, 0.80 * scale);
        const legMat = new THREE.MeshStandardMaterial({ color: pantsColor, roughness: 0.85 });
        const legL = new THREE.Mesh(legGeo, legMat);
        legL.position.set(-0.10 * scale, 0.42 * scale, 0);
        group.add(legL);
        const legR = new THREE.Mesh(legGeo, legMat);
        legR.position.set(0.10 * scale, 0.42 * scale, 0);
        group.add(legR);
      }
    }

    group.userData.armL = armL;
    group.userData.armR = armR;
    group.userData.isSitting = isSitting;

    return group;
  }

  // -------------------------------------------------------------
  // Footpath Human Shops (Tea Tong, Jhalmuri, Fruit, Clothes)
  // -------------------------------------------------------------
  createFootpathShop(type, isLeft) {
    const group = new THREE.Group();
    const facingRoad = isLeft ? Math.PI / 2 : -Math.PI / 2;

    if (type === 'tong') {
      // 1. টং দোকান ও চা মামা (Dhaka Tea Stall with Vendor & Customer)
      const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
      const tinMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.6, roughness: 0.7 });
      const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.6, roughness: 0.1 });

      // Stall booth
      const booth = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.3, 1.3), tinMat);
      booth.position.set(0, 1.15, 0);
      group.add(booth);

      // Wooden front counter facing the road
      const counter = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.12, 0.5), woodMat);
      counter.position.set(0, 0.95, isLeft ? 0.7 : -0.7);
      group.add(counter);

      // Glass cookie jars on counter (নানখাতাই ও টোস্ট বিস্কুট)
      for (let j = -0.7; j <= -0.2; j += 0.25) {
        const jar = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.22, 10), glassMat);
        jar.position.set(j, 1.10, isLeft ? 0.7 : -0.7);
        group.add(jar);
        // Cookies inside
        const cookie = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.18, 8), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
        cookie.position.set(j, 1.08, isLeft ? 0.7 : -0.7);
        group.add(cookie);
      }

      // Aluminium Tea Kettle on counter
      const kettle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.15, 0.24, 10),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9 })
      );
      kettle.position.set(0.4, 1.10, isLeft ? 0.7 : -0.7);
      group.add(kettle);

      // Hanging Yellow Banana bunch
      for (let b = 0; b < 5; b++) {
        const banana = new THREE.Mesh(
          new THREE.CylinderGeometry(0.03, 0.03, 0.24, 6),
          new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 })
        );
        banana.rotation.z = Math.PI / 3 + b * 0.15;
        banana.position.set(0.6 + (b % 3) * 0.08, 1.9, isLeft ? 0.6 : -0.6);
        group.add(banana);
      }

      // Bengali Signboard: মায়ের দোয়া টি স্টল
      const signCanvas = document.createElement('canvas');
      signCanvas.width = 256; signCanvas.height = 64;
      const sCtx = signCanvas.getContext('2d');
      sCtx.fillStyle = '#dc2626'; sCtx.fillRect(0, 0, 256, 64);
      sCtx.fillStyle = '#fde047'; sCtx.font = 'bold 22px sans-serif';
      sCtx.textAlign = 'center';
      sCtx.fillText('মায়ের দোয়া টি স্টল', 128, 42);
      const signTex = new THREE.CanvasTexture(signCanvas);
      const signBoard = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.45), new THREE.MeshStandardMaterial({ map: signTex, side: THREE.DoubleSide }));
      signBoard.position.set(0, 2.35, isLeft ? 0.66 : -0.66);
      group.add(signBoard);

      // Human Vendor: চা মামা (Behind the counter)
      const teaVendor = this.createHumanFigure({
        shirtColor: 0xffffff,
        isLungi: true,
        lungiColor: 0x0284c7,
        hasGamcha: true,
        holding: 'kettle'
      });
      teaVendor.position.set(0, 0, isLeft ? 0.2 : -0.2);
      teaVendor.rotation.y = facingRoad;
      group.add(teaVendor);

      // Red Plastic Stool & Sitting Customer in front of stall
      const stool = new THREE.Mesh(
        new THREE.BoxGeometry(0.38, 0.42, 0.38),
        new THREE.MeshStandardMaterial({ color: 0xdc2626 })
      );
      stool.position.set(-0.6, 0.21, isLeft ? 1.25 : -1.25);
      group.add(stool);

      const customer = this.createHumanFigure({
        shirtColor: 0x16a34a,
        pantsColor: 0x1e293b,
        holding: 'cup',
        isSitting: true
      });
      customer.position.set(-0.6, 0, isLeft ? 1.25 : -1.25);
      customer.rotation.y = isLeft ? 0 : Math.PI;
      group.add(customer);

    } else if (type === 'jhalmuri') {
      // 2. ঝালমুড়ি ও ফুচকাওয়ালা (Street Cart with Human Hawker & Customer)
      const cartWoodMat = new THREE.MeshStandardMaterial({ color: 0x6d4c41, roughness: 0.8 });
      const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.5, roughness: 0.1 });

      // Cart flatbed & frame
      const cartBed = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.14, 0.9), cartWoodMat);
      cartBed.position.set(0, 0.72, 0);
      group.add(cartBed);

      // Cart Wheels (4 small bicycle wheels)
      for (const wx of [-0.65, 0.65]) {
        for (const wz of [-0.4, 0.4]) {
          const w = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.06, 12), new THREE.MeshStandardMaterial({ color: 0x18181b }));
          w.rotation.z = Math.PI / 2;
          w.position.set(wx, 0.24, wz);
          group.add(w);
        }
      }

      // Glass display case for crispy Fuchka puris
      const glassCase = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.65, 0.7), glassMat);
      glassCase.position.set(0, 1.12, 0);
      group.add(glassCase);

      // Golden Fuchka Puris inside glass
      for (let p = 0; p < 8; p++) {
        const puri = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
        puri.position.set((Math.random() - 0.5) * 0.8, 0.95 + Math.random() * 0.3, (Math.random() - 0.5) * 0.5);
        group.add(puri);
      }

      // Conical Beach Umbrella overhead
      const umbrella = new THREE.Mesh(
        new THREE.ConeGeometry(1.4, 0.55, 10, 1, false, 0, Math.PI * 2),
        new THREE.MeshStandardMaterial({ color: 0x0284c7, side: THREE.DoubleSide })
      );
      umbrella.position.set(0, 2.35, 0);
      group.add(umbrella);

      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.7), new THREE.MeshStandardMaterial({ color: 0x334155 }));
      pole.position.set(0, 1.5, 0);
      group.add(pole);

      // Human Vendor: ঝালমুড়ি মামা (Behind the cart shaking tin)
      const jhalmuriVendor = this.createHumanFigure({
        shirtColor: 0xf59e0b,
        pantsColor: 0x475569,
        hasGamcha: true,
        holding: 'jhalmuri_tin'
      });
      jhalmuriVendor.position.set(0, 0, isLeft ? -0.55 : 0.55);
      jhalmuriVendor.rotation.y = facingRoad;
      group.add(jhalmuriVendor);

      // Human Customer waiting with paper cone
      const buyer = this.createHumanFigure({
        shirtColor: 0x9333ea,
        pantsColor: 0x1e293b,
        holding: 'cone'
      });
      buyer.position.set(0.65, 0, isLeft ? 0.6 : -0.6);
      buyer.rotation.y = isLeft ? -Math.PI / 2 : Math.PI / 2;
      group.add(buyer);

    } else if (type === 'fruit') {
      // 3. ফল বিক্রেতা (Sidewalk Fruit Stall - Watermelons, Papayas, Green Coconuts)
      const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85 });

      // Fruit crate tiered table
      const stand = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.65, 0.9), woodMat);
      stand.position.set(0, 0.32, 0);
      group.add(stand);

      // Watermelons (তরমুজ)
      const melonMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.3 });
      for (let m = -0.6; m <= 0; m += 0.3) {
        const melon = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), melonMat);
        melon.position.set(m, 0.76, isLeft ? 0.2 : -0.2);
        group.add(melon);
      }

      // Green Coconuts (ডাব)
      const dabMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.5 });
      for (let d = 0.2; d <= 0.6; d += 0.22) {
        const dab = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), dabMat);
        dab.position.set(d, 0.75, isLeft ? 0.2 : -0.2);
        group.add(dab);
      }

      // Yellow Papayas
      const papayaMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 });
      for (let p = -0.4; p <= 0.4; p += 0.35) {
        const papaya = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 0.28, 6), papayaMat);
        papaya.rotation.z = Math.PI / 4;
        papaya.position.set(p, 0.74, isLeft ? -0.2 : 0.2);
        group.add(papaya);
      }

      // Human Fruit Seller: ফল মামা
      const fruitVendor = this.createHumanFigure({
        shirtColor: 0x047857,
        isLungi: true,
        lungiColor: 0x16a34a,
        hasGamcha: true,
        holding: 'waving'
      });
      fruitVendor.position.set(-0.7, 0, isLeft ? 0.5 : -0.5);
      fruitVendor.rotation.y = facingRoad;
      group.add(fruitVendor);

      // Customer inspecting fruit
      const shopper = this.createHumanFigure({
        shirtColor: 0x3b82f6,
        pantsColor: 0x334155,
        holding: 'none'
      });
      shopper.position.set(0.6, 0, isLeft ? 0.7 : -0.7);
      shopper.rotation.y = isLeft ? -Math.PI / 3 : Math.PI / 3;
      group.add(shopper);

    } else {
      // 4. ফুটপাতের কাপড়ের দোকান (Sidewalk Clothes Hawker)
      const matColor = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
      // Low wooden pallet / mat
      const pallet = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.12, 0.95), matColor);
      pallet.position.set(0, 0.06, 0);
      group.add(pallet);

      // Folded stacks of colorful T-shirts & Jeans
      const stackColors = [0xef4444, 0x3b82f6, 0xfacc15, 0x10b981, 0x8b5cf6, 0x0284c7];
      for (let s = 0; s < 6; s++) {
        const sx = -0.65 + (s % 3) * 0.65;
        const sz = s < 3 ? -0.2 : 0.2;
        const stack = new THREE.Mesh(
          new THREE.BoxGeometry(0.48, 0.28, 0.35),
          new THREE.MeshStandardMaterial({ color: stackColors[s], roughness: 0.8 })
        );
        stack.position.set(sx, 0.22, sz);
        group.add(stack);
      }

      // Bamboo overhead hanging rack with jeans
      const rackPole1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.8), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
      rackPole1.position.set(-0.85, 0.9, 0);
      group.add(rackPole1);
      const rackPole2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.8), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
      rackPole2.position.set(0.85, 0.9, 0);
      group.add(rackPole2);
      const crossBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.8), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
      crossBeam.rotation.z = Math.PI / 2;
      crossBeam.position.set(0, 1.75, 0);
      group.add(crossBeam);

      // Cardboard Signboard: এক দাম ১৫০ টাকা
      const cCanvas = document.createElement('canvas');
      cCanvas.width = 256; cCanvas.height = 64;
      const cCtx = cCanvas.getContext('2d');
      cCtx.fillStyle = '#fef08a'; cCtx.fillRect(0, 0, 256, 64);
      cCtx.strokeStyle = '#dc2626'; cCtx.lineWidth = 4; cCtx.strokeRect(4, 4, 248, 56);
      cCtx.fillStyle = '#dc2626'; cCtx.font = 'bold 22px sans-serif';
      cCtx.textAlign = 'center';
      cCtx.fillText('এক দাম ১৫০ টাকা', 128, 40);
      const cSignTex = new THREE.CanvasTexture(cCanvas);
      const cSign = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.35), new THREE.MeshStandardMaterial({ map: cSignTex, side: THREE.DoubleSide }));
      cSign.position.set(0, 1.45, isLeft ? 0.45 : -0.45);
      group.add(cSign);

      // Human Hawker: হকার ভাই (Calling out to road)
      const clothVendor = this.createHumanFigure({
        shirtColor: 0xdc2626,
        pantsColor: 0x1e293b,
        hasCap: true,
        holding: 'waving'
      });
      clothVendor.position.set(0.7, 0, isLeft ? 0.5 : -0.5);
      clothVendor.rotation.y = facingRoad;
      group.add(clothVendor);

      // Customer Human inspecting shirts
      const customer = this.createHumanFigure({
        shirtColor: 0x0284c7,
        pantsColor: 0x475569,
        holding: 'none'
      });
      customer.position.set(-0.6, 0, isLeft ? 0.6 : -0.6);
      customer.rotation.y = isLeft ? -Math.PI / 4 : Math.PI / 4;
      group.add(customer);
    }

    return group;
  }

  // Pedestrian Human Walking Along Footpath (Diverse Bangladeshi Street Crowd)
  createFootpathPedestrian(isLeft, idx) {
    const shirts = [0x2563eb, 0xdc2626, 0x16a34a, 0xf59e0b, 0x9333ea, 0x0284c7, 0xffffff, 0x0f172a, 0xec4899, 0x10b981];
    const lungiColors = [0x0284c7, 0x16a34a, 0x881337, 0xd97706, 0x4f46e5];
    const isLungi = idx % 2 === 0;
    const hasCap = idx % 3 === 0;
    const hasGamcha = idx % 4 === 0;
    const isWalkingBack = idx % 2 === 1;

    const ped = this.createHumanFigure({
      shirtColor: shirts[idx % shirts.length],
      pantsColor: idx % 2 === 0 ? 0x1e293b : 0x475569,
      isLungi: isLungi,
      lungiColor: lungiColors[idx % lungiColors.length],
      hasCap: hasCap,
      hasGamcha: hasGamcha,
      holding: idx % 5 === 0 ? 'cup' : (idx % 7 === 0 ? 'cone' : 'none'),
      scale: 0.95 + (idx % 3) * 0.05
    });

    ped.rotation.y = isWalkingBack ? 0 : Math.PI;
    ped.userData.isWalkingBack = isWalkingBack;
    ped.userData.walkSpeed = 0.85 + (idx % 4) * 0.25;
    return ped;
  }

  // Festive Triangular Bunting Flags across roadway
  createBuntingFlags(z) {
    const group = new THREE.Group();
    const wireMat = new THREE.LineBasicMaterial({ color: 0x1e293b });
    const points = [];
    for (let x = -13; x <= 13; x += 0.5) {
      const sag = Math.cos((x / 13) * (Math.PI / 2)) * 1.5;
      points.push(new THREE.Vector3(x, 7.8 - sag, 0));
    }
    const wireGeo = new THREE.BufferGeometry().setFromPoints(points);
    const wire = new THREE.Line(wireGeo, wireMat);
    group.add(wire);

    const colors = [0xdc2626, 0x2563eb, 0xfacc15, 0x16a34a, 0x9333ea, 0xf97316];
    for (let x = -12; x <= 12; x += 1.4) {
      const sag = Math.cos((x / 13) * (Math.PI / 2)) * 1.5;
      const flagGeo = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        -0.35, 0, 0,
        0.35, 0, 0,
        0, -0.42, 0
      ]);
      flagGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      const flagMat = new THREE.MeshBasicMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        side: THREE.DoubleSide
      });
      const flag = new THREE.Mesh(flagGeo, flagMat);
      flag.position.set(x, 7.8 - sag, 0);
      group.add(flag);
    }

    group.position.set(0, 0, z);
    return group;
  }

  // Smooth Concrete Sidewalk Wall & Low-Poly Trees (Placed at X = +/- 17.8 for wide 4.6m sidewalk!)
  createBoundaryWallWithTrees(z) {
    const group = new THREE.Group();
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.8 });
    const capMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8 });

    // Left boundary wall
    const wallL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.4, 18), wallMat);
    wallL.position.set(-17.8, 0.7, 0);
    wallL.castShadow = false;
    wallL.receiveShadow = true;
    group.add(wallL);

    const capL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.1, 18), capMat);
    capL.position.set(-17.8, 1.45, 0);
    group.add(capL);

    // Right boundary wall
    const wallR = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.4, 18), wallMat);
    wallR.position.set(17.8, 0.7, 0);
    wallR.castShadow = false;
    wallR.receiveShadow = true;
    group.add(wallR);

    const capR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.1, 18), capMat);
    capR.position.set(17.8, 1.45, 0);
    group.add(capR);

    // Low-poly green trees behind the boundary walls
    const treeMat1 = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
    const treeMat2 = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.8 });
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });

    for (let tz of [-6, 2, 7]) {
      // Left trees
      const trunkL = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 2.5), trunkMat);
      trunkL.position.set(-19.0, 1.25, tz);
      group.add(trunkL);

      const foliageL = new THREE.Mesh(new THREE.DodecahedronGeometry(1.35, 1), tz % 2 === 0 ? treeMat1 : treeMat2);
      foliageL.position.set(-19.0, 2.9, tz);
      group.add(foliageL);

      // Right trees
      const trunkR = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 2.5), trunkMat);
      trunkR.position.set(19.0, 1.25, tz);
      group.add(trunkR);

      const foliageR = new THREE.Mesh(new THREE.DodecahedronGeometry(1.35, 1), tz % 2 === 0 ? treeMat2 : treeMat1);
      foliageR.position.set(19.0, 2.9, tz);
      group.add(foliageR);
    }

    group.position.set(0, 0, z);
    return group;
  }

  createBDFlag() {
    const group = new THREE.Group();
    const poleGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.8);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.rotation.z = Math.PI / 4;
    group.add(pole);

    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 150;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#006a4e'; ctx.fillRect(0, 0, 256, 150);
    ctx.fillStyle = '#f42a41'; ctx.beginPath();
    ctx.arc(115, 75, 48, 0, Math.PI * 2); ctx.fill();

    const flagTex = new THREE.CanvasTexture(canvas);
    const flagGeo = new THREE.PlaneGeometry(1.6, 0.95);
    const flagMat = new THREE.MeshStandardMaterial({ map: flagTex, side: THREE.DoubleSide });
    const flag = new THREE.Mesh(flagGeo, flagMat);
    flag.position.set(0.9, 1.3, 0);
    group.add(flag);

    return group;
  }

  createElectricPole(isLeft) {
    const group = new THREE.Group();
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7 });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 11, 12), poleMat);
    pole.position.y = 5.5;
    group.add(pole);

    const bar = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.14, 0.14), poleMat);
    bar.position.y = 9.8;
    group.add(bar);

    const transMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
    const transformer = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.2, 0.8), transMat);
    transformer.position.set(0, 7.8, 0);
    group.add(transformer);

    const lampArm = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.1, 0.1), poleMat);
    lampArm.position.set(isLeft ? 0.9 : -0.9, 10.4, 0);
    group.add(lampArm);

    return group;
  }

  initOverheadWires() {
    this.overheadWires = [];
    const wireMat = new THREE.LineBasicMaterial({ color: 0x0f172a, linewidth: 2 });
    for (let i = 0; i < 15; i++) {
      const z0 = -i * 32;
      const z1 = -(i + 1) * 32;
      const points = [];
      const sag = 0.8;
      points.push(new THREE.Vector3(-13.0, 9.8, z0));
      points.push(new THREE.Vector3(-13.0, 9.8 - sag, (z0 + z1) / 2));
      points.push(new THREE.Vector3(-13.0, 9.8, z1));

      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geo, wireMat);
      this.scene.add(line);
      this.overheadWires.push({ line, baseZ: z0 });
    }
  }

  createFootbridge(index) {
    const group = new THREE.Group();
    const bridgeHeight = 6.8;
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });

    const spanGeo = new THREE.BoxGeometry(38, 1.8, 3.2);
    const span = new THREE.Mesh(spanGeo, steelMat);
    span.position.set(0, bridgeHeight, 0);
    span.castShadow = true;
    group.add(span);

    const pillarGeo = new THREE.BoxGeometry(1.2, bridgeHeight, 1.2);
    const pillarL = new THREE.Mesh(pillarGeo, steelMat);
    pillarL.position.set(-18.5, bridgeHeight / 2, 0);
    group.add(pillarL);

    const pillarR = new THREE.Mesh(pillarGeo, steelMat);
    pillarR.position.set(18.5, bridgeHeight / 2, 0);
    group.add(pillarR);

    // Giant Billboard on Bridge
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 256;
    const ctx = canvas.getContext('2d');

    if (index % 2 === 0) {
      ctx.fillStyle = '#dc2626'; ctx.fillRect(0, 0, 1024, 256);
      ctx.fillStyle = '#fde047'; ctx.font = 'bold 52px "Hind Siliguri", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🍗 কাচ্চি ভাই আনলিমিটেড বাসমতি 🍗', 512, 95);
      ctx.fillStyle = '#ffffff'; ctx.font = 'bold 34px sans-serif';
      ctx.fillText('খাসির চর্বিযুক্ত স্পেশাল কাচ্চি ও বোরহানি', 512, 165);
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('দেশি টেসলা চালকদের জন্য স্পেশাল ফ্রি চা!', 512, 215);
    } else {
      ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, 1024, 256);
      ctx.fillStyle = '#38bdf8'; ctx.font = 'bold 48px "Hind Siliguri", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⚠️ ঢাকা ট্রাফিক পুলিশের হুঁশিয়ারি ⚠️', 512, 85);
      ctx.fillStyle = '#facc15'; ctx.font = 'bold 34px sans-serif';
      ctx.fillText('“রাস্তা কি আপনার বাপের? উল্টাপথে চললে জাতীয় জরিমানা!”', 512, 155);
      ctx.fillStyle = '#ffffff'; ctx.font = 'bold 22px sans-serif';
      ctx.fillText('ধরা পড়লে গাড়ি জব্দ ও জাতীয় ক্ষতিপূরণ আদায় করা হইবে!', 512, 210);
    }

    const boardTex = new THREE.CanvasTexture(canvas);
    const boardGeo = new THREE.PlaneGeometry(16, 4.2);
    const boardMat = new THREE.MeshStandardMaterial({ map: boardTex, side: THREE.DoubleSide });
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.position.set(0, bridgeHeight + 2.3, 0);
    group.add(board);

    return group;
  }

  // Reactive Horn Shockwave for Footpath Humans & Vendors
  reactToHorn(playerX, playerZ, radius = 28) {
    for (const shop of this.footpathShops) {
      const dz = Math.abs(shop.group.position.z - playerZ);
      if (dz < radius) {
        // Human vendors jump in surprise
        shop.group.position.y = 0.42;
        setTimeout(() => { if (shop.group) shop.group.position.y = 0.28; }, 250);
      }
    }
    for (const ped of this.footpathHumans) {
      const dz = Math.abs(ped.group.position.z - playerZ);
      if (dz < radius) {
        ped.group.position.y = 0.45;
        setTimeout(() => { if (ped.group) ped.group.position.y = 0.28; }, 220);
      }
    }
  }

  setBuildingZ(b, newZ) {
    b.mesh.position.z = newZ;
    b.tank.position.z = newZ;
    b.dish.position.z = newZ;
    b.shop.position.z = newZ;
    b.canopy.position.z = newZ;
    if (b.flag) b.flag.position.z = newZ;
    for (const bal of b.balconies) bal.position.z = newZ;
  }

  update(delta, playerZ) {
    const halfSpan = 240; // 480m total city span for seamless U-Turns

    // 1. Buildings bi-directional recycling
    for (const b of this.buildings) {
      if (b.mesh.position.z > playerZ + halfSpan) {
        let minZ = playerZ;
        for (const other of this.buildings) {
          if (other.mesh.position.z < minZ) minZ = other.mesh.position.z;
        }
        let newZ = minZ - 18;
        if (this.isChourastaCrossing(newZ)) newZ -= 16;
        this.setBuildingZ(b, newZ);
      } else if (b.mesh.position.z < playerZ - halfSpan) {
        let maxZ = playerZ;
        for (const other of this.buildings) {
          if (other.mesh.position.z > maxZ) maxZ = other.mesh.position.z;
        }
        let newZ = maxZ + 18;
        if (this.isChourastaCrossing(newZ)) newZ += 16;
        this.setBuildingZ(b, newZ);
      }
    }

    // 2. Footpath Human Shops bi-directional recycling
    for (const s of this.footpathShops) {
      if (s.group.position.z > playerZ + halfSpan) {
        let minZ = playerZ;
        for (const other of this.footpathShops) {
          if (other.group.position.z < minZ) minZ = other.group.position.z;
        }
        let nextZ = minZ - 25;
        if (this.isChourastaCrossing(nextZ)) nextZ -= 16;
        s.group.position.z = nextZ;
        s.group.rotation.z = 0;
        s.isHit = false;
      } else if (s.group.position.z < playerZ - halfSpan) {
        let maxZ = playerZ;
        for (const other of this.footpathShops) {
          if (other.group.position.z > maxZ) maxZ = other.group.position.z;
        }
        let nextZ = maxZ + 25;
        if (this.isChourastaCrossing(nextZ)) nextZ += 16;
        s.group.position.z = nextZ;
        s.group.rotation.z = 0;
        s.isHit = false;
      }
    }

    // 3. Footpath Pedestrians bi-directional recycling & animated arm swing strides
    const time = Date.now() * 0.007;
    for (const ped of this.footpathHumans) {
      if (ped.group.position.z > playerZ + halfSpan) {
        let minZ = playerZ;
        for (const other of this.footpathHumans) {
          if (other.group.position.z < minZ) minZ = other.group.position.z;
        }
        let nextZ = minZ - 9.5;
        if (this.isChourastaCrossing(nextZ)) nextZ -= 14;
        ped.group.position.z = nextZ;
        ped.group.rotation.z = 0;
        ped.isHit = false;
      } else if (ped.group.position.z < playerZ - halfSpan) {
        let maxZ = playerZ;
        for (const other of this.footpathHumans) {
          if (other.group.position.z > maxZ) maxZ = other.group.position.z;
        }
        let nextZ = maxZ + 9.5;
        if (this.isChourastaCrossing(nextZ)) nextZ += 14;
        ped.group.position.z = nextZ;
        ped.group.rotation.z = 0;
        ped.isHit = false;
      }

      // Animated walking arm swing & stride
      if (!ped.isHit && ped.group.userData) {
        const uSpeed = ped.group.userData.walkSpeed || 1.0;
        const phase = (ped.baseZ || 0) * 0.25 + time * uSpeed;
        const swing = Math.sin(phase) * 0.45;
        if (ped.group.userData.armL) ped.group.userData.armL.rotation.x = swing;
        if (ped.group.userData.armR) ped.group.userData.armR.rotation.x = -swing;
        ped.group.position.y = 0.28 + Math.abs(Math.sin(phase * 2)) * 0.035;
      }
    }

    // 4. Utility Poles bi-directional recycling
    for (const p of this.electricPoles) {
      if (p.position.z > playerZ + halfSpan) {
        let minZ = playerZ;
        for (const other of this.electricPoles) {
          if (other.position.z < minZ) minZ = other.position.z;
        }
        let nextZ = minZ - 32;
        if (this.isChourastaCrossing(nextZ)) nextZ -= 16;
        p.position.z = nextZ;
      } else if (p.position.z < playerZ - halfSpan) {
        let maxZ = playerZ;
        for (const other of this.electricPoles) {
          if (other.position.z > maxZ) maxZ = other.position.z;
        }
        let nextZ = maxZ + 32;
        if (this.isChourastaCrossing(nextZ)) nextZ += 16;
        p.position.z = nextZ;
      }
    }

    // 5. Overhead Wires bi-directional recycling
    for (const ow of this.overheadWires) {
      if (ow.line.position.z > playerZ + halfSpan) {
        let minZ = playerZ;
        for (const other of this.overheadWires) {
          if (other.line.position.z < minZ) minZ = other.line.position.z;
        }
        ow.line.position.z = minZ - 32;
      } else if (ow.line.position.z < playerZ - halfSpan) {
        let maxZ = playerZ;
        for (const other of this.overheadWires) {
          if (other.line.position.z > maxZ) maxZ = other.line.position.z;
        }
        ow.line.position.z = maxZ + 32;
      }
    }

    // 6. Boundary Walls & Trees bi-directional recycling
    for (const bw of this.boundaryWalls) {
      if (bw.position.z > playerZ + halfSpan) {
        let minZ = playerZ;
        for (const other of this.boundaryWalls) {
          if (other.position.z < minZ) minZ = other.position.z;
        }
        let nextZ = minZ - 18;
        if (this.isChourastaCrossing(nextZ)) nextZ -= 16;
        bw.position.z = nextZ;
      } else if (bw.position.z < playerZ - halfSpan) {
        let maxZ = playerZ;
        for (const other of this.boundaryWalls) {
          if (other.position.z > maxZ) maxZ = other.position.z;
        }
        let nextZ = maxZ + 18;
        if (this.isChourastaCrossing(nextZ)) nextZ -= 16;
        bw.position.z = nextZ;
      }
    }

    // 8. Bunting Flags recycling
    for (const bf of this.buntingFlags) {
      if (bf.position.z > playerZ + 40) {
        let minZ = 0;
        for (const other of this.buntingFlags) {
          if (other.position.z < minZ) minZ = other.position.z;
        }
        bf.position.z = minZ - 70;
      }
    }
  }

  checkCollisions(playerBounds) {
    const hits = [];
    const now = Date.now();

    // 1. Check collisions with Footpath Walking Humans
    for (const ped of this.footpathHumans) {
      if (ped.isHit && now - ped.hitTime < 3000) continue;
      const dx = Math.abs(ped.group.position.x - playerBounds.x);
      const dz = Math.abs(ped.group.position.z - playerBounds.z);

      if (dx < 1.35 && dz < 1.6) {
        ped.isHit = true;
        ped.hitTime = now;
        // Ragdoll knockback animation onto sidewalk
        ped.group.position.x += (ped.isLeft ? -1.6 : 1.6);
        ped.group.rotation.z = (ped.isLeft ? -1 : 1) * Math.PI / 2.2;
        ped.group.rotation.y += 0.8;

        hits.push({
          type: 'human',
          x: ped.group.position.x,
          z: ped.group.position.z,
          item: ped
        });
      }
    }

    // 2. Check collisions with Footpath Shops & Stalls
    for (const shop of this.footpathShops) {
      if (shop.isHit && now - shop.hitTime < 3500) continue;
      const dx = Math.abs(shop.group.position.x - playerBounds.x);
      const dz = Math.abs(shop.group.position.z - playerBounds.z);

      if (dx < 2.0 && dz < 2.2) {
        shop.isHit = true;
        shop.hitTime = now;
        // Tilt and knock shop sideways
        shop.group.rotation.z = (shop.isLeft ? -0.35 : 0.35);
        shop.group.position.x += (shop.isLeft ? -0.6 : 0.6);

        hits.push({
          type: 'shop',
          shopType: shop.type,
          x: shop.group.position.x,
          z: shop.group.position.z,
          item: shop
        });
      }
    }

    // 3. Check collisions with Concrete Electric Poles
    for (const pole of this.electricPoles) {
      const dx = Math.abs(pole.position.x - playerBounds.x);
      const dz = Math.abs(pole.position.z - playerBounds.z);

      if (dx < 1.15 && dz < 1.35) {
        hits.push({
          type: 'pole',
          x: pole.position.x,
          z: pole.position.z,
          item: pole
        });
      }
    }

    return hits;
  }

  reset() {
    for (let i = 0; i < this.buildings.length; i++) {
      const b = this.buildings[i];
      const z = -i * 18;
      b.mesh.position.z = z;
      b.tank.position.z = z;
      b.dish.position.z = z;
      b.shop.position.z = z;
      b.canopy.position.z = z;
      if (b.flag) b.flag.position.z = z;
      for (const bal of b.balconies) bal.position.z = z;
    }
    for (let s = 0; s < this.footpathShops.length; s++) {
      this.footpathShops[s].group.position.z = -s * 25 - 12;
      this.footpathShops[s].group.rotation.z = 0;
      this.footpathShops[s].isHit = false;
    }
    for (let p = 0; p < this.footpathHumans.length; p++) {
      this.footpathHumans[p].group.position.z = -p * 28 - 6;
      this.footpathHumans[p].group.rotation.z = 0;
      this.footpathHumans[p].isHit = false;
    }
    for (let p = 0; p < this.electricPoles.length; p++) {
      this.electricPoles[p].position.z = -p * 32;
    }
    for (let w = 0; w < this.boundaryWalls.length; w++) {
      this.boundaryWalls[w].position.z = -w * 18;
    }
  }
}
