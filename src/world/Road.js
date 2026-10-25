import * as THREE from 'three';
import { TextureFactory } from '../ui/Textures.js';

export class Road {
  constructor(scene) {
    this.scene = scene;
    this.segments = [];
    this.segmentLength = 80;
    this.numSegments = 5;
    this.roadWidth = 26;

    this.roadTex = TextureFactory.createDhakaRoadTexture();
    this.roadTex.repeat.set(1, 4);

    this.curbTex = TextureFactory.createCurbTexture();
    this.curbTex.repeat.set(24, 1);

    this.sidewalkTex = TextureFactory.createSidewalkTexture();
    this.sidewalkTex.repeat.set(2, 22);

    this.initRoad();
  }

  initRoad() {
    for (let i = 0; i < this.numSegments; i++) {
      const segment = this.createSegment(i);
      segment.position.z = -i * this.segmentLength;
      this.scene.add(segment);
      this.segments.push(segment);
    }
  }

  createSegment(segmentIndex) {
    const group = new THREE.Group();

    // 1. Sleek Polished Asphalt Road Surface with Specular Bitumen Sheen
    const roadGeo = new THREE.PlaneGeometry(this.roadWidth, this.segmentLength);
    const roadMat = new THREE.MeshStandardMaterial({
      map: this.roadTex,
      roughness: 0.38,  // Sleek, polished tarmac finish
      metalness: 0.22   // Subtle specular highlight from sun & headlights
    });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.receiveShadow = true;
    group.add(road);

    // 2. High-Contrast Black & Yellow Diagonal Striped Curbs
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

    // 3. Terracotta Brick Herringbone Footpaths (Dhaka Pedestrian Sidewalks)
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

    // 4. Central Raised Median Divider (Separating Left and Right Lanes)
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

    // 5. Realistic Zebra Crossing only at Segment 0 (Start Line Crossing)
    if (segmentIndex === 0) {
      const zebraMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      for (let zx = -this.roadWidth / 2 + 1.2; zx < this.roadWidth / 2 - 1.2; zx += 1.6) {
        if (Math.abs(zx) < 1.4) continue; // skip central median
        const stripe = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 4.8), zebraMat);
        stripe.rotation.x = -Math.PI / 2;
        stripe.position.set(zx, 0.02, 0);
        stripe.receiveShadow = true;
        group.add(stripe);
      }
    }

    // 6. Traffic Police Sergeant under Red Umbrella positioned on Central Median
    if (segmentIndex === 0 || segmentIndex === 3) {
      // Traffic Sergeant stands safely on the central median divider (keeping driving lanes clear!)
      const uPole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.035, 2.8),
        new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8 })
      );
      uPole.position.set(0, 1.65, 0);
      group.add(uPole);

      const uTop = new THREE.Mesh(
        new THREE.ConeGeometry(1.65, 0.55, 16),
        new THREE.MeshStandardMaterial({ color: 0xdc2626, side: THREE.DoubleSide })
      );
      uTop.position.set(0, 3.0, 0);
      uTop.castShadow = true;
      group.add(uTop);

      // Traffic Police Sergeant standing under umbrella on Central Median
      const sergeantGroup = new THREE.Group();
      sergeantGroup.position.set(0, 0.50, 0.2);

      // Khaki Trousers
      const pantsMat = new THREE.MeshStandardMaterial({ color: 0xc89666 });
      const legL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.8, 0.2), pantsMat);
      legL.position.set(-0.14, 0.4, 0);
      const legR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.8, 0.2), pantsMat);
      legR.position.set(0.14, 0.4, 0);
      sergeantGroup.add(legL);
      sergeantGroup.add(legR);

      // Fluorescent Lime Traffic Reflective Vest (Screenshot Match!)
      const vestMat = new THREE.MeshStandardMaterial({ color: 0x84cc16, roughness: 0.3 });
      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.65, 0.32), vestMat);
      torso.position.set(0, 1.1, 0);
      torso.castShadow = true;
      sergeantGroup.add(torso);

      // Head & Blue DMP Cap
      const skinMat = new THREE.MeshStandardMaterial({ color: 0x8d5524 });
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), skinMat);
      head.position.set(0, 1.55, 0);
      sergeantGroup.add(head);

      const cap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 0.09, 16),
        new THREE.MeshStandardMaterial({ color: 0x1e3a8a })
      );
      cap.position.set(0, 1.7, 0);
      sergeantGroup.add(cap);

      // Outstretched arm directing traffic (হাত তুলে ইশারা করা - Screenshot Match!)
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.65), vestMat);
      arm.rotation.z = Math.PI / 2.4;
      arm.position.set(-0.45, 1.25, 0);
      sergeantGroup.add(arm);

      group.add(sergeantGroup);

      // Green sandbag / equipment sack beside him on median
      const sack = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.3, 1),
        new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 })
      );
      sack.position.set(0.45, 0.65, -0.5);
      sack.castShadow = true;
      group.add(sack);
    }

    // 7. Authentic Dhaka Traffic Signal Post (Exact Screenshot Match!)
    const signalGroup = new THREE.Group();
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.8, roughness: 0.4 });
    const poleV = new THREE.Mesh(new THREE.BoxGeometry(0.18, 4.4, 0.18), poleMat);
    poleV.position.set(0.95, 2.2, 0);
    poleV.castShadow = true;
    signalGroup.add(poleV);

    const armH = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.16, 0.16), poleMat);
    armH.position.set(1.9, 4.2, 0);
    armH.castShadow = true;
    signalGroup.add(armH);

    const lightBoxMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.5 });
    const lightBox = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1.1, 0.28), lightBoxMat);
    lightBox.position.set(1.4, 3.8, 0);
    lightBox.castShadow = true;
    signalGroup.add(lightBox);

    // Glowing Red Signal Light (Emissive - Screenshot Match!)
    const redLens = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.11, 0.08, 16),
      new THREE.MeshStandardMaterial({ color: 0xff0022, emissive: 0xff1133, emissiveIntensity: 2.2, roughness: 0.2 })
    );
    redLens.rotation.x = Math.PI / 2;
    redLens.position.set(1.4, 4.15, 0.12);
    signalGroup.add(redLens);

    // Yellow Signal Light (Off)
    const yelLens = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.08, 16),
      new THREE.MeshStandardMaterial({ color: 0x443300, roughness: 0.5 })
    );
    yelLens.rotation.x = Math.PI / 2;
    yelLens.position.set(1.4, 3.8, 0.12);
    signalGroup.add(yelLens);

    // Green Signal Light (Off)
    const grnLens = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.08, 16),
      new THREE.MeshStandardMaterial({ color: 0x003311, roughness: 0.5 })
    );
    grnLens.rotation.x = Math.PI / 2;
    grnLens.position.set(1.4, 3.45, 0.12);
    signalGroup.add(grnLens);

    group.add(signalGroup);

    // 7. Cast iron curb drainage grates
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

  update(playerZ) {
    for (const segment of this.segments) {
      if (segment.position.z > playerZ + this.segmentLength) {
        let minZ = 0;
        for (const s of this.segments) {
          if (s.position.z < minZ) minZ = s.position.z;
        }
        segment.position.z = minZ - this.segmentLength;
      }
    }
  }

  reset() {
    for (let i = 0; i < this.segments.length; i++) {
      this.segments[i].position.z = -i * this.segmentLength;
    }
  }
}
