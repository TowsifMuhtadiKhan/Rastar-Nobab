import * as THREE from 'three';
import { TextureFactory } from '../ui/Textures.js';

export const CHOURASTA_STATIONS = [
  { name: 'মিরপুর ১০ গোলচত্বর / চৌরাস্তা', left: '⬅ মিরপুর ১ / গাবতলী', straight: '⬆ কাজীপাড়া · ফার্মগেট ⬆', right: 'বনানী / মহাখালী ➡' },
  { name: 'কাজীপাড়া মোড় / চৌরাস্তা', left: '⬅ শেওড়াপাড়া বাইপাস', straight: '⬆ আগারগাঁও · সংসদ ভবন ⬆', right: 'ক্যান্টনমেন্ট ➡' },
  { name: 'শেওড়াপাড়া চৌরাস্তা', left: '⬅ পীরেরবাগ', straight: '⬆ আগারগাঁও · বিজয় সরণি ⬆', right: 'কাফরুল ➡' },
  { name: 'আগারগাঁও চৌরাস্তা', left: '⬅ শ্যামলী / পাসপোর্ট অফিস', straight: '⬆ চন্দ্রিমা উদ্যান · বিজয় সরণি ⬆', right: 'আইডিবি ভবন ➡' },
  { name: 'বিজয় সরণি ক্রসিং', left: '⬅ মানিক মিয়া এভিনিউ', straight: '⬆ ফার্মগেট · শাহবাগ ⬆', right: 'তেজগাঁও শিল্পাঞ্চল ➡' },
  { name: 'ফার্মগেট মোড় / চৌরাস্তা', left: '⬅ গ্রিন রোড / ইন্দিরা রোড', straight: '⬆ কারওয়ান বাজার · শাহবাগ ⬆', right: 'মহাখালী / তিতুমীর ➡' },
  { name: 'কারওয়ান বাজার মোড়', left: '⬅ পান্থপথ / বসুন্ধরা সিটি', straight: '⬆ বাংলামোটর · শাহবাগ ⬆', right: 'হাতিরঝিল ➡' },
  { name: 'বাংলামোটর চৌরাস্তা', left: '⬅ সোনারগাঁও মোড়', straight: '⬆ শাহবাগ · ঢাকা বিশ্ববিদ্যালয় ⬆', right: 'মগবাজার ফ্লাইওভার ➡' },
  { name: 'শাহবাগ চৌরাস্তা', left: '⬅ সায়েন্স ল্যাব / ধানমন্ডি', straight: '⬆ টিএসসি · হাইকোর্ট ⬆', right: 'রমনা পার্ক / কাকরাইল ➡' },
  { name: 'ঢাকা বিশ্ববিদ্যালয় মোড়', left: '⬅ নীলক্ষেত / আজিমপুর', straight: '⬆ দোয়েল চত্বর · মতিঝিল ⬆', right: 'প্রেস ক্লাব ➡' },
  { name: 'মতিঝিল শাপলা চত্বর', left: '⬅ দিলকুশা / বায়তুল মোকাররম', straight: '⬆ দৈনিক বাংলা মোড় ⬆', right: 'কমলাপুর স্টেশন ➡' }
];

export class Road {
  constructor(scene) {
    this.scene = scene;
    this.segments = [];
    this.segmentLength = 80;
    this.numSegments = 6; // 6 segments x 80m = 480m total highway
    this.roadWidth = 26;
    this.chourastaCounter = 0;

    this.roadTex = TextureFactory.createDhakaRoadTexture();
    this.roadTex.repeat.set(1, 4);
    this.roadTex.anisotropy = 8;

    this.crossroadTex = TextureFactory.createCrossroadTexture();
    this.crossroadTex.repeat.set(3, 1);
    this.crossroadTex.anisotropy = 8;

    this.curbTex = TextureFactory.createCurbTexture();
    this.curbTex.repeat.set(24, 1);
    this.curbTex.anisotropy = 4;

    this.roundaboutCurbTex = TextureFactory.createRoundaboutCurbTexture();
    this.roundaboutCurbTex.anisotropy = 4;

    this.sidewalkTex = TextureFactory.createSidewalkTexture();
    this.sidewalkTex.repeat.set(2, 22);
    this.sidewalkTex.anisotropy = 4;

    this.initRoad();
  }

  initRoad() {
    for (let i = 0; i < this.numSegments; i++) {
      const isChourasta = (i % 3 === 0);
      const segment = isChourasta ? this.createChourastaSegment(i) : this.createStraightSegment(i);
      segment.position.z = -i * this.segmentLength;
      this.scene.add(segment);
      this.segments.push(segment);
    }
  }

  // --------------------------------------------------------------------------
  // 1. Normal Straight Highway Segment
  // --------------------------------------------------------------------------
  createStraightSegment(segmentIndex) {
    const group = new THREE.Group();
    group.userData = { isChourasta: false, segmentIndex };

    // Sleek Polished Asphalt Road Surface
    const roadGeo = new THREE.PlaneGeometry(this.roadWidth, this.segmentLength);
    const roadMat = new THREE.MeshStandardMaterial({
      map: this.roadTex,
      roughness: 0.38,
      metalness: 0.22
    });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.receiveShadow = true;
    group.add(road);

    // High-Contrast Black & Yellow Diagonal Striped Curbs
    const curbMat = new THREE.MeshStandardMaterial({
      map: this.curbTex,
      roughness: 0.45,
      metalness: 0.15
    });

    // Left Outer Curb
    const curbL = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, this.segmentLength), curbMat);
    curbL.position.set(-this.roadWidth / 2 - 0.25, 0.2, 0);
    curbL.castShadow = true;
    curbL.receiveShadow = true;
    group.add(curbL);

    // Right Outer Curb
    const curbR = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, this.segmentLength), curbMat);
    curbR.position.set(this.roadWidth / 2 + 0.25, 0.2, 0);
    curbR.castShadow = true;
    curbR.receiveShadow = true;
    group.add(curbR);

    // Terracotta Brick Herringbone Footpaths
    const walkGeo = new THREE.BoxGeometry(5.2, 0.35, this.segmentLength);
    const walkMat = new THREE.MeshStandardMaterial({
      map: this.sidewalkTex,
      roughness: 0.85
    });

    const walkL = new THREE.Mesh(walkGeo, walkMat);
    walkL.position.set(-this.roadWidth / 2 - 2.85, 0.18, 0);
    walkL.receiveShadow = true;
    group.add(walkL);

    const walkR = new THREE.Mesh(walkGeo, walkMat);
    walkR.position.set(this.roadWidth / 2 + 2.85, 0.18, 0);
    walkR.receiveShadow = true;
    group.add(walkR);

    // Central Raised Median Divider
    const medianBase = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.5, this.segmentLength), curbMat);
    medianBase.position.set(0, 0.25, 0);
    medianBase.castShadow = true;
    medianBase.receiveShadow = true;
    group.add(medianBase);

    // Soil bed inside median
    const soilMat = new THREE.MeshStandardMaterial({ color: 0x2b1d14, roughness: 0.95 });
    const soil = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.08, this.segmentLength), soilMat);
    soil.position.set(0, 0.52, 0);
    group.add(soil);

    // Low green shrubs & bushes along median
    const bushMat1 = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
    const bushMat2 = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.8 });

    for (let z = -this.segmentLength / 2 + 4; z < this.segmentLength / 2; z += 7) {
      const bGeo = new THREE.DodecahedronGeometry(0.45 + Math.random() * 0.15, 1);
      const bush = new THREE.Mesh(bGeo, z % 14 === 0 ? bushMat1 : bushMat2);
      bush.position.set((Math.random() - 0.5) * 0.35, 0.75, z);
      bush.castShadow = true;
      group.add(bush);
    }

    // Cast iron curb drainage grates
    const grateMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.3 });
    for (let z = -this.segmentLength / 2 + 10; z < this.segmentLength / 2; z += 20) {
      const grateL = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.05, 1.2), grateMat);
      grateL.position.set(-this.roadWidth / 2 + 0.35, 0.02, z);
      const grateR = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.05, 1.2), grateMat);
      grateR.position.set(this.roadWidth / 2 - 0.35, 0.02, z);
      group.add(grateL);
      group.add(grateR);
    }

    return group;
  }

  // --------------------------------------------------------------------------
  // 2. Iconic Dhaka "চৌরাস্তা" (4-Way Intersection & Golchottor Roundabout)
  // --------------------------------------------------------------------------
  createChourastaSegment(segmentIndex) {
    const group = new THREE.Group();
    const chourastaStationIndex = this.chourastaCounter % CHOURASTA_STATIONS.length;
    const stationData = CHOURASTA_STATIONS[chourastaStationIndex];
    this.chourastaCounter++;

    group.userData = {
      isChourasta: true,
      segmentIndex,
      stationData,
      stationIndex: chourastaStationIndex,
      gantrySignMesh: null
    };

    const curbMat = new THREE.MeshStandardMaterial({
      map: this.curbTex,
      roughness: 0.45,
      metalness: 0.15
    });

    const walkMat = new THREE.MeshStandardMaterial({
      map: this.sidewalkTex,
      roughness: 0.85
    });

    // 1. Main Highway Asphalt Surface
    const roadGeo = new THREE.PlaneGeometry(this.roadWidth, this.segmentLength);
    const roadMat = new THREE.MeshStandardMaterial({
      map: this.roadTex,
      roughness: 0.38,
      metalness: 0.22
    });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.receiveShadow = true;
    group.add(road);

    // 2. Perpendicular Crossroad (আড়াআড়ি রাস্তা - 72m wide X 22m length)
    // Running left and right across the highway!
    const crossroadGeo = new THREE.PlaneGeometry(72, 22);
    const crossroadMat = new THREE.MeshStandardMaterial({
      map: this.crossroadTex,
      roughness: 0.38,
      metalness: 0.22
    });
    const crossroad = new THREE.Mesh(crossroadGeo, crossroadMat);
    crossroad.rotation.x = -Math.PI / 2;
    crossroad.position.set(0, 0.006, 0); // slightly above main road to avoid z-fighting
    crossroad.receiveShadow = true;
    group.add(crossroad);

    // 3. Split Outer Curbs & Sidewalks (Opening 22m gap for the cross street)
    // North curbs (z = -40 to -11, length = 29m)
    // South curbs (z = +11 to +40, length = 29m)
    const curbNorthGeo = new THREE.BoxGeometry(0.5, 0.4, 29);
    const curbSouthGeo = new THREE.BoxGeometry(0.5, 0.4, 29);

    const curbNL = new THREE.Mesh(curbNorthGeo, curbMat);
    curbNL.position.set(-this.roadWidth / 2 - 0.25, 0.2, -25.5);
    group.add(curbNL);

    const curbSL = new THREE.Mesh(curbSouthGeo, curbMat);
    curbSL.position.set(-this.roadWidth / 2 - 0.25, 0.2, 25.5);
    group.add(curbSL);

    const curbNR = new THREE.Mesh(curbNorthGeo, curbMat);
    curbNR.position.set(this.roadWidth / 2 + 0.25, 0.2, -25.5);
    group.add(curbNR);

    const curbSR = new THREE.Mesh(curbSouthGeo, curbMat);
    curbSR.position.set(this.roadWidth / 2 + 0.25, 0.2, 25.5);
    group.add(curbSR);

    // Cross street corner curbs (extending east & west from main road)
    const crossCurbGeo = new THREE.BoxGeometry(22, 0.4, 0.5);
    // West side-street curbs
    const crossCurbNW = new THREE.Mesh(crossCurbGeo, curbMat);
    crossCurbNW.position.set(-24.5, 0.2, -11.25);
    group.add(crossCurbNW);

    const crossCurbSW = new THREE.Mesh(crossCurbGeo, curbMat);
    crossCurbSW.position.set(-24.5, 0.2, 11.25);
    group.add(crossCurbSW);

    // East side-street curbs
    const crossCurbNE = new THREE.Mesh(crossCurbGeo, curbMat);
    crossCurbNE.position.set(24.5, 0.2, -11.25);
    group.add(crossCurbNE);

    const crossCurbSE = new THREE.Mesh(crossCurbGeo, curbMat);
    crossCurbSE.position.set(24.5, 0.2, 11.25);
    group.add(crossCurbSE);

    // Footpaths / Sidewalks (North & South portions)
    const walkNorthGeo = new THREE.BoxGeometry(5.2, 0.35, 29);
    const walkSouthGeo = new THREE.BoxGeometry(5.2, 0.35, 29);

    const walkNL = new THREE.Mesh(walkNorthGeo, walkMat);
    walkNL.position.set(-this.roadWidth / 2 - 2.85, 0.18, -25.5);
    group.add(walkNL);

    const walkSL = new THREE.Mesh(walkSouthGeo, walkMat);
    walkSL.position.set(-this.roadWidth / 2 - 2.85, 0.18, 25.5);
    group.add(walkSL);

    const walkNR = new THREE.Mesh(walkNorthGeo, walkMat);
    walkNR.position.set(this.roadWidth / 2 + 2.85, 0.18, -25.5);
    group.add(walkNR);

    const walkSR = new THREE.Mesh(walkSouthGeo, walkMat);
    walkSR.position.set(this.roadWidth / 2 + 2.85, 0.18, 25.5);
    group.add(walkSR);

    // Side-street footpaths flanking the crossroad
    const crossWalkGeo = new THREE.BoxGeometry(22, 0.35, 4.5);
    const crossWalkNW = new THREE.Mesh(crossWalkGeo, walkMat);
    crossWalkNW.position.set(-24.5, 0.18, -13.75);
    group.add(crossWalkNW);

    const crossWalkSW = new THREE.Mesh(crossWalkGeo, walkMat);
    crossWalkSW.position.set(-24.5, 0.18, 13.75);
    group.add(crossWalkSW);

    const crossWalkNE = new THREE.Mesh(crossWalkGeo, walkMat);
    crossWalkNE.position.set(24.5, 0.18, -13.75);
    group.add(crossWalkNE);

    const crossWalkSE = new THREE.Mesh(crossWalkGeo, walkMat);
    crossWalkSE.position.set(24.5, 0.18, 13.75);
    group.add(crossWalkSE);

    // 4. Central Raised Median Divider (Broken open for the 22m crossroad)
    // North median (z = -25.5, length = 29m)
    // South median (z = +25.5, length = 29m)
    const medianBaseN = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.5, 29), curbMat);
    medianBaseN.position.set(0, 0.25, -25.5);
    medianBaseN.castShadow = true;
    group.add(medianBaseN);

    const medianBaseS = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.5, 29), curbMat);
    medianBaseS.position.set(0, 0.25, 25.5);
    medianBaseS.castShadow = true;
    group.add(medianBaseS);

    // Rounded median noses (bullnose curb ends)
    const bullnoseGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.5, 16, 1, false, 0, Math.PI);
    const bullnoseN = new THREE.Mesh(bullnoseGeo, curbMat);
    bullnoseN.rotation.y = -Math.PI / 2;
    bullnoseN.position.set(0, 0.25, -11.0);
    group.add(bullnoseN);

    const bullnoseS = new THREE.Mesh(bullnoseGeo, curbMat);
    bullnoseS.rotation.y = Math.PI / 2;
    bullnoseS.position.set(0, 0.25, 11.0);
    group.add(bullnoseS);

    // Soil beds inside north and south medians
    const soilMat = new THREE.MeshStandardMaterial({ color: 0x2b1d14, roughness: 0.95 });
    const soilN = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.08, 27), soilMat);
    soilN.position.set(0, 0.52, -25.5);
    group.add(soilN);

    const soilS = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.08, 27), soilMat);
    soilS.position.set(0, 0.52, 25.5);
    group.add(soilS);

    // Shrubs on north and south medians
    const bushMat1 = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
    const bushMat2 = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.8 });
    for (let z = -38; z <= -14; z += 6) {
      const bGeo = new THREE.DodecahedronGeometry(0.42 + Math.random() * 0.12, 1);
      const bush = new THREE.Mesh(bGeo, z % 12 === 0 ? bushMat1 : bushMat2);
      bush.position.set((Math.random() - 0.5) * 0.3, 0.75, z);
      group.add(bush);
    }
    for (let z = 14; z <= 38; z += 6) {
      const bGeo = new THREE.DodecahedronGeometry(0.42 + Math.random() * 0.12, 1);
      const bush = new THREE.Mesh(bGeo, z % 12 === 0 ? bushMat1 : bushMat2);
      bush.position.set((Math.random() - 0.5) * 0.3, 0.75, z);
      group.add(bush);
    }

    // 5. Central Roundabout / Traffic Island (গোলচত্বর বা ট্রাফিক পুলিশ আইল্যান্ড)
    // Centered at (0, 0, 0) - radius 2.2m (leaving 10.8m wide clear road on left & right)
    const roundaboutGroup = this.createRoundaboutIsland();
    group.add(roundaboutGroup);

    // 6. 4 Overhead Traffic Signal Posts (৪-মুখী ট্রাফিক সিগন্যাল)
    const signalNW = this.createTrafficSignalPost(false, true);  // Left facing forward
    signalNW.position.set(-13.5, 0, -11.5);
    group.add(signalNW);

    const signalNE = this.createTrafficSignalPost(true, true);   // Right facing forward
    signalNE.position.set(13.5, 0, -11.5);
    group.add(signalNE);

    const signalSW = this.createTrafficSignalPost(false, false); // Left facing backward
    signalSW.position.set(-13.5, 0, 11.5);
    group.add(signalSW);

    const signalSE = this.createTrafficSignalPost(true, false);  // Right facing backward
    signalSE.position.set(13.5, 0, 11.5);
    group.add(signalSE);

    // 7. 4-Way Zebra Pedestrian Crossings (৪-মুখী জেব্রা ক্রসিং)
    const zebraMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // Approach Zebra Crossing (Player entrance: z = +11.2)
    for (let zx = -11.5; zx <= 11.5; zx += 1.6) {
      if (Math.abs(zx) < 1.0) continue;
      const stripe = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 4.2), zebraMat);
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.set(zx, 0.02, 11.2);
      group.add(stripe);
    }

    // Exit Zebra Crossing (North exit: z = -11.2)
    for (let zx = -11.5; zx <= 11.5; zx += 1.6) {
      if (Math.abs(zx) < 1.0) continue;
      const stripe = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 4.2), zebraMat);
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.set(zx, 0.02, -11.2);
      group.add(stripe);
    }

    // West Crossroad Zebra Crossing (x = -13.2)
    for (let zz = -8.5; zz <= 8.5; zz += 1.7) {
      const stripe = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 0.9), zebraMat);
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.set(-13.2, 0.02, zz);
      group.add(stripe);
    }

    // East Crossroad Zebra Crossing (x = +13.2)
    for (let zz = -8.5; zz <= 8.5; zz += 1.7) {
      const stripe = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 0.9), zebraMat);
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.set(13.2, 0.02, zz);
      group.add(stripe);
    }

    // 8. Overhead Highway Directional Gantry Signboard (Spanning highway entrance at z = 15.5)
    const gantry = this.createChourastaGantry(stationData);
    gantry.group.position.set(0, 0, 15.5);
    group.add(gantry.group);
    group.userData.gantrySignMesh = gantry.signMesh;

    // 9. Side-Street Dhaka Atmosphere Props (Tea stalls, fruit cart, billboards)
    const cornerTong = this.createCornerTeaStall();
    cornerTong.position.set(-16.5, 0.2, 13.5);
    group.add(cornerTong);

    const cornerFruit = this.createCornerFruitCart();
    cornerFruit.position.set(16.5, 0.2, 13.5);
    group.add(cornerFruit);

    return group;
  }

  // --------------------------------------------------------------------------
  // Central Roundabout Traffic Island (গোলচত্বর বা ট্রাফিক পুলিশ আইল্যান্ড)
  // --------------------------------------------------------------------------
  createRoundaboutIsland() {
    const group = new THREE.Group();
    group.position.set(0, 0, 0);

    // 1. Raised Circular Zebra Curb Base (Radius 2.2m, height 0.45m)
    const curbGeo = new THREE.CylinderGeometry(2.2, 2.25, 0.45, 32);
    const curbMat = new THREE.MeshStandardMaterial({
      map: this.roundaboutCurbTex,
      roughness: 0.45,
      metalness: 0.15
    });
    const curb = new THREE.Mesh(curbGeo, curbMat);
    curb.position.y = 0.225;
    curb.castShadow = true;
    curb.receiveShadow = true;
    group.add(curb);

    // 2. Lush Green Garden & Lawn Top Disc
    const lawnGeo = new THREE.CylinderGeometry(2.05, 2.05, 0.1, 32);
    const lawnMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.85 });
    const lawn = new THREE.Mesh(lawnGeo, lawnMat);
    lawn.position.y = 0.46;
    lawn.receiveShadow = true;
    group.add(lawn);

    // Terracotta decorative brick ring inside the island
    const brickRingGeo = new THREE.RingGeometry(1.6, 1.95, 32);
    const brickRingMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.8 });
    const brickRing = new THREE.Mesh(brickRingGeo, brickRingMat);
    brickRing.rotation.x = -Math.PI / 2;
    brickRing.position.y = 0.515;
    group.add(brickRing);

    // Circular ring of colorful flower bushes (Marigolds, Hibiscus & green shrubs)
    const bushColors = [0xf59e0b, 0xef4444, 0x16a34a, 0xfacc15, 0xdc2626, 0x15803d];
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 5) {
      const bx = Math.cos(angle) * 1.5;
      const bz = Math.sin(angle) * 1.5;
      const bGeo = new THREE.DodecahedronGeometry(0.32 + Math.random() * 0.08, 1);
      const bMat = new THREE.MeshStandardMaterial({
        color: bushColors[Math.floor(Math.random() * bushColors.length)],
        roughness: 0.8
      });
      const bush = new THREE.Mesh(bGeo, bMat);
      bush.position.set(bx, 0.65, bz);
      bush.castShadow = true;
      group.add(bush);
    }

    // 3. Elevated Circular Concrete Traffic Police Podium (White with blue DMP trim)
    const podiumGeo = new THREE.CylinderGeometry(0.85, 0.95, 0.42, 20);
    const podiumMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.6, metalness: 0.1 });
    const podium = new THREE.Mesh(podiumGeo, podiumMat);
    podium.position.y = 0.72;
    podium.castShadow = true;
    group.add(podium);

    const podiumTrim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.87, 0.87, 0.08, 20),
      new THREE.MeshStandardMaterial({ color: 0x1e3a8a })
    );
    podiumTrim.position.y = 0.90;
    group.add(podiumTrim);

    // 4. Large Dhaka Traffic Police Red & White Octagonal Umbrella
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.8, roughness: 0.3 });
    const umbrellaPole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.4), poleMat);
    umbrellaPole.position.y = 2.4;
    group.add(umbrellaPole);

    const umbrellaCanopy = new THREE.Mesh(
      new THREE.ConeGeometry(2.3, 0.7, 16),
      new THREE.MeshStandardMaterial({ color: 0xdc2626, side: THREE.DoubleSide, roughness: 0.6 })
    );
    umbrellaCanopy.position.y = 3.8;
    umbrellaCanopy.castShadow = true;
    group.add(umbrellaCanopy);

    // White rim accent on police umbrella
    const umbrellaRim = new THREE.Mesh(
      new THREE.TorusGeometry(2.28, 0.03, 8, 32),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    umbrellaRim.rotation.x = Math.PI / 2;
    umbrellaRim.position.y = 3.45;
    group.add(umbrellaRim);

    // 5. 3D Dhaka Traffic Police Sergeant Character standing on the podium
    const sergeantGroup = this.createSergeantFigure();
    sergeantGroup.position.set(0, 0.93, 0);
    group.add(sergeantGroup);

    return group;
  }

  // --------------------------------------------------------------------------
  // Traffic Police Sergeant Model
  // --------------------------------------------------------------------------
  createSergeantFigure() {
    const group = new THREE.Group();

    // Khaki Trousers
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0xc89666, roughness: 0.8 });
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.85, 0.2), pantsMat);
    legL.position.set(-0.14, 0.42, 0);
    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.85, 0.2), pantsMat);
    legR.position.set(0.14, 0.42, 0);
    group.add(legL);
    group.add(legR);

    // DMP Black Boots
    const bootMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.4 });
    const bootL = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.16, 0.28), bootMat);
    bootL.position.set(-0.14, 0.08, 0.04);
    const bootR = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.16, 0.28), bootMat);
    bootR.position.set(0.14, 0.08, 0.04);
    group.add(bootL);
    group.add(bootR);

    // Fluorescent Lime Reflective Traffic Vest & Torso
    const vestMat = new THREE.MeshStandardMaterial({ color: 0x84cc16, roughness: 0.3 });
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.7, 0.34), vestMat);
    torso.position.set(0, 1.18, 0);
    torso.castShadow = true;
    group.add(torso);

    // Silver reflective chevron stripes across vest
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2, metalness: 0.6 });
    const vStripe = new THREE.Mesh(new THREE.BoxGeometry(0.60, 0.1, 0.36), stripeMat);
    vStripe.position.set(0, 1.25, 0);
    group.add(vStripe);

    // Head & Skin
    const skinMat = new THREE.MeshStandardMaterial({ color: 0x8d5524, roughness: 0.8 });
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 12, 12), skinMat);
    head.position.set(0, 1.68, 0);
    group.add(head);

    // DMP Blue Cap with Visor
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 0.1, 16),
      new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.6 })
    );
    cap.position.set(0, 1.82, 0);
    group.add(cap);

    const visor = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.03, 0.14),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 })
    );
    visor.position.set(0, 1.80, 0.18);
    group.add(visor);

    // Chrome Traffic Police Whistle in mouth
    const whistle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9 })
    );
    whistle.rotation.x = Math.PI / 2;
    whistle.position.set(0, 1.63, 0.18);
    group.add(whistle);

    // Outstretched Left Arm directing traffic (হাত তুলে সিগন্যাল দেওয়া)
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.72), vestMat);
    armL.rotation.z = Math.PI / 2.3;
    armL.position.set(-0.50, 1.35, 0);
    group.add(armL);

    // White Traffic Police Glove
    const gloveMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const gloveL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), gloveMat);
    gloveL.position.set(-0.84, 1.50, 0);
    group.add(gloveL);

    // Right arm bent holding clipboard / baton
    const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.5), vestMat);
    armR.rotation.x = -Math.PI / 4;
    armR.position.set(0.36, 1.25, 0.15);
    group.add(armR);

    return group;
  }

  // --------------------------------------------------------------------------
  // 4-Way Corner Traffic Signal Post with Glowing LED Lamps
  // --------------------------------------------------------------------------
  createTrafficSignalPost(isRight = false, isForward = true) {
    const group = new THREE.Group();
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.8, roughness: 0.3 });

    // Vertical Steel Mast (Height: 5.4m)
    const mastGeo = new THREE.CylinderGeometry(0.12, 0.14, 5.4, 16);
    const mast = new THREE.Mesh(mastGeo, poleMat);
    mast.position.y = 2.7;
    mast.castShadow = true;
    group.add(mast);

    // Base flange
    const flange = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.2, 16), poleMat);
    flange.position.y = 0.1;
    group.add(flange);

    // Horizontal Cantilever Arm extending 3.2m across the road
    const armGeo = new THREE.BoxGeometry(3.2, 0.14, 0.14);
    const arm = new THREE.Mesh(armGeo, poleMat);
    const armDir = isRight ? -1 : 1;
    arm.position.set(armDir * 1.6, 5.2, 0);
    arm.castShadow = true;
    group.add(arm);

    // 3-Aspect Traffic Signal Head Box
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.4 });
    const headBox = new THREE.Mesh(new THREE.BoxGeometry(0.44, 1.2, 0.32), boxMat);
    headBox.position.set(armDir * 2.2, 4.6, 0);
    group.add(headBox);

    // Directional orientation: face toward oncoming traffic
    const facingZ = isForward ? 1 : -1;

    // Glowing Red Lens
    const redLens = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16),
      new THREE.MeshStandardMaterial({
        color: 0xff0022,
        emissive: 0xff1133,
        emissiveIntensity: 2.5,
        roughness: 0.1
      })
    );
    redLens.rotation.x = Math.PI / 2;
    redLens.position.set(armDir * 2.2, 4.98, facingZ * 0.14);
    group.add(redLens);

    // Amber / Yellow Lens
    const yelLens = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.11, 0.08, 16),
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 1.2,
        roughness: 0.2
      })
    );
    yelLens.rotation.x = Math.PI / 2;
    yelLens.position.set(armDir * 2.2, 4.60, facingZ * 0.14);
    group.add(yelLens);

    // Emerald Green Lens
    const grnLens = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.11, 0.08, 16),
      new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x059669,
        emissiveIntensity: 1.8,
        roughness: 0.2
      })
    );
    grnLens.rotation.x = Math.PI / 2;
    grnLens.position.set(armDir * 2.2, 4.22, facingZ * 0.14);
    group.add(grnLens);

    // Pedestrian Signal Box (Wait / Walk)
    const pedBox = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.6, 0.24), boxMat);
    pedBox.position.set(0, 2.5, facingZ * 0.2);
    group.add(pedBox);

    const pedRed = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.05, 16),
      new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2.0 })
    );
    pedRed.rotation.x = Math.PI / 2;
    pedRed.position.set(0, 2.62, facingZ * 0.32);
    group.add(pedRed);

    return group;
  }

  // --------------------------------------------------------------------------
  // Overhead Directional Highway Gantry Signboard
  // --------------------------------------------------------------------------
  createChourastaGantry(stationData) {
    const group = new THREE.Group();
    const gantryHeight = 6.2;
    const spanWidth = 27.5;

    const steelMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });

    // Left steel column
    const colL = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, gantryHeight, 16), steelMat);
    colL.position.set(-spanWidth / 2, gantryHeight / 2, 0);
    group.add(colL);

    // Right steel column
    const colR = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, gantryHeight, 16), steelMat);
    colR.position.set(spanWidth / 2, gantryHeight / 2, 0);
    group.add(colR);

    // Overhead truss beam
    const truss = new THREE.Mesh(new THREE.BoxGeometry(spanWidth + 1, 0.5, 0.5), steelMat);
    truss.position.set(0, gantryHeight - 0.25, 0);
    group.add(truss);

    // Giant Green Highway Directional Signboard
    const signTex = TextureFactory.createChourastaGantryTexture(
      stationData.name,
      stationData.left,
      stationData.straight,
      stationData.right
    );

    const signGeo = new THREE.BoxGeometry(16.5, 3.8, 0.25);
    const signMat = new THREE.MeshStandardMaterial({
      map: signTex,
      roughness: 0.4,
      metalness: 0.1
    });

    const signMesh = new THREE.Mesh(signGeo, signMat);
    signMesh.position.set(0, gantryHeight + 1.2, 0);
    signMesh.castShadow = true;
    group.add(signMesh);

    return { group, signMesh };
  }

  // --------------------------------------------------------------------------
  // Side-Street Dhaka Props: Corner Tea Stall (টং দোকান)
  // --------------------------------------------------------------------------
  createCornerTeaStall() {
    const group = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });

    // Wooden bench / counter table
    const table = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.8, 1.1), woodMat);
    table.position.y = 0.4;
    group.add(table);

    // Big aluminum tea kettle (কেটলি)
    const kettle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.28, 0.45, 16),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.2 })
    );
    kettle.position.set(-0.6, 0.95, 0);
    group.add(kettle);

    // Glass biscuit jar (বয়াম)
    const jar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.35, 12),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, transparent: true, opacity: 0.85 })
    );
    jar.position.set(0.4, 0.95, 0);
    group.add(jar);

    // Red striped cloth canopy
    const canopy = new THREE.Mesh(
      new THREE.BoxGeometry(2.8, 0.08, 1.8),
      new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.7 })
    );
    canopy.position.set(0, 2.2, 0);
    group.add(canopy);

    return group;
  }

  // --------------------------------------------------------------------------
  // Side-Street Dhaka Props: Corner Fruit Cart (ফলের ভ্যান)
  // --------------------------------------------------------------------------
  createCornerFruitCart() {
    const group = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.8 });

    // Wooden handcart bed
    const bed = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.18, 1.3), woodMat);
    bed.position.y = 0.7;
    group.add(bed);

    // Handcart wooden wheels
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.6 });
    const wheelL = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.12, 16), wheelMat);
    wheelL.rotation.z = Math.PI / 2;
    wheelL.position.set(-1.0, 0.42, 0);
    group.add(wheelL);

    const wheelR = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.12, 16), wheelMat);
    wheelR.rotation.z = Math.PI / 2;
    wheelR.position.set(1.0, 0.42, 0);
    group.add(wheelR);

    // Pyramids of colorful fruits (Bananas, Mangoes, Apples)
    const fruitColors = [0xfacc15, 0xef4444, 0x16a34a, 0xf97316];
    for (let f = 0; f < 8; f++) {
      const fx = -0.7 + (f % 4) * 0.45;
      const fz = f < 4 ? -0.25 : 0.25;
      const fruit = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.18, 1),
        new THREE.MeshStandardMaterial({ color: fruitColors[f % fruitColors.length], roughness: 0.7 })
      );
      fruit.position.set(fx, 0.95, fz);
      group.add(fruit);
    }

    return group;
  }

  // --------------------------------------------------------------------------
  // Get active Chourastas in the world
  // --------------------------------------------------------------------------
  getActiveChourastas() {
    const chourastas = [];
    for (const segment of this.segments) {
      if (segment.userData && segment.userData.isChourasta) {
        chourastas.push({
          z: segment.position.z,
          stationData: segment.userData.stationData,
          radius: 2.25
        });
      }
    }
    return chourastas;
  }

  // --------------------------------------------------------------------------
  // Update Road segments & recycling
  // --------------------------------------------------------------------------
  update(playerZ) {
    for (const segment of this.segments) {
      if (segment.position.z > playerZ + this.segmentLength) {
        let minZ = 0;
        for (const s of this.segments) {
          if (s.position.z < minZ) minZ = s.position.z;
        }
        segment.position.z = minZ - this.segmentLength;

        // If recycled segment is a Chourasta, update its station sign!
        if (segment.userData && segment.userData.isChourasta) {
          const nextIndex = this.chourastaCounter % CHOURASTA_STATIONS.length;
          const nextStation = CHOURASTA_STATIONS[nextIndex];
          this.chourastaCounter++;

          segment.userData.stationData = nextStation;
          segment.userData.stationIndex = nextIndex;

          if (segment.userData.gantrySignMesh) {
            const newTex = TextureFactory.createChourastaGantryTexture(
              nextStation.name,
              nextStation.left,
              nextStation.straight,
              nextStation.right
            );
            segment.userData.gantrySignMesh.material.map = newTex;
            segment.userData.gantrySignMesh.material.needsUpdate = true;
          }
        }
      }
    }
  }

  reset() {
    this.chourastaCounter = 0;
    for (let i = 0; i < this.segments.length; i++) {
      this.segments[i].position.z = -i * this.segmentLength;
    }
  }
}
