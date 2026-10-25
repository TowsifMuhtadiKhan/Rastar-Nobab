import * as THREE from 'three';
import { TextureFactory } from '../ui/Textures.js';

export class MetroRail {
  constructor(scene) {
    this.scene = scene;
    this.pillars = [];
    this.tracks = [];
    this.pillarSpacing = 40;
    this.pillarTex = TextureFactory.createMetroPillarTexture();

    this.train = null;
    this.trainActive = false;
    this.trainSpeed = 60; // km/h

    this.initMetroSystem();
  }

  initMetroSystem() {
    // Metro viaduct height = 11.5 meters above road (ample clearance above highway signs)
    const viaductHeight = 11.5;
    this.viaductHeight = viaductHeight;

    // Concrete pillar material
    this.pillarMat = new THREE.MeshStandardMaterial({
      map: this.pillarTex,
      roughness: 0.8
    });

    // Elevated concrete beam (Viaduct box girder)
    const beamGeo = new THREE.BoxGeometry(7, 1.8, 300);
    const beamMat = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      roughness: 0.6
    });
    this.trackBeam = new THREE.Mesh(beamGeo, beamMat);
    this.trackBeam.position.set(0, viaductHeight + 0.9, -100);
    this.scene.add(this.trackBeam);

    // Green sound barrier walls on sides of viaduct
    const wallGeo = new THREE.BoxGeometry(0.3, 1.4, 300);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x007a3d });
    this.wallL = new THREE.Mesh(wallGeo, wallMat);
    this.wallL.position.set(-3.5, viaductHeight + 2.3, -100);
    this.wallR = new THREE.Mesh(wallGeo, wallMat);
    this.wallR.position.set(3.5, viaductHeight + 2.3, -100);
    this.scene.add(this.wallL);
    this.scene.add(this.wallR);

    // Initial pillars
    for (let i = 0; i < 8; i++) {
      const pillar = this.createPillar();
      const safeZ = this.getSafePillarZ(-i * this.pillarSpacing);
      pillar.position.set(0, viaductHeight / 2, safeZ);
      this.scene.add(pillar);
      this.pillars.push(pillar);
    }

    // Metro Train
    this.initTrain();
  }

  getSafePillarZ(baseZ) {
    const mod = ((baseZ % 240) + 240) % 240;
    if (mod < 14) return baseZ - 18;
    if (mod > 226) return baseZ + 18;
    return baseZ;
  }

  createPillar() {
    const group = new THREE.Group();
    // Cylindrical concrete column (compact diameter ~1.6m neatly fitting inside the central median)
    const colGeo = new THREE.CylinderGeometry(0.78, 0.82, this.viaductHeight, 24);
    const col = new THREE.Mesh(colGeo, this.pillarMat);
    col.castShadow = true;
    col.receiveShadow = true;
    group.add(col);

    // Hammerhead pier cap on top supporting the track
    const capGeo = new THREE.BoxGeometry(6.2, 1.2, 2.5);
    const capMat = new THREE.MeshStandardMaterial({ color: 0xbbbbbb, roughness: 0.7 });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = this.viaductHeight / 2 + 0.6;
    cap.castShadow = true;
    group.add(cap);

    return group;
  }

  initTrain() {
    this.trainGroup = new THREE.Group();
    // 3 Cars MRT-6 Train
    const carMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.7,
      roughness: 0.2
    });
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0x006a4e }); // BD Green
    const redMat = new THREE.MeshStandardMaterial({ color: 0xf42a41 }); // BD Red

    for (let c = 0; c < 3; c++) {
      const car = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.8, 14), carMat);
      car.position.set(0, this.viaductHeight + 3.2, c * 15);

      // Green & Red side stripe
      const s = new THREE.Mesh(new THREE.BoxGeometry(3.25, 0.4, 14), stripeMat);
      s.position.set(0, this.viaductHeight + 2.8, c * 15);
      const r = new THREE.Mesh(new THREE.BoxGeometry(3.25, 0.15, 14), redMat);
      r.position.set(0, this.viaductHeight + 3.1, c * 15);

      this.trainGroup.add(car);
      this.trainGroup.add(s);
      this.trainGroup.add(r);
    }

    this.trainGroup.position.set(0, 0, -250);
    this.scene.add(this.trainGroup);
  }

  update(delta, playerZ) {
    // Reposition track beam and noise walls to follow player
    this.trackBeam.position.z = playerZ - 50;
    if (this.wallL) this.wallL.position.z = playerZ - 50;
    if (this.wallR) this.wallR.position.z = playerZ - 50;

    // Reposition pillars endlessly in both directions for U-Turns
    const halfSpan = (this.pillars.length * this.pillarSpacing) / 2; // 160m
    for (const p of this.pillars) {
      if (p.position.z > playerZ + halfSpan) {
        let minZ = playerZ;
        for (const other of this.pillars) {
          if (other.position.z < minZ) minZ = other.position.z;
        }
        p.position.z = this.getSafePillarZ(minZ - this.pillarSpacing);
      } else if (p.position.z < playerZ - halfSpan) {
        let maxZ = playerZ;
        for (const other of this.pillars) {
          if (other.position.z > maxZ) maxZ = other.position.z;
        }
        p.position.z = this.getSafePillarZ(maxZ + this.pillarSpacing);
      }
    }

    // Move Metro train across the viaduct overhead
    this.trainGroup.position.z += (this.trainSpeed / 3.6) * delta;
    if (this.trainGroup.position.z > playerZ + 120) {
      this.trainGroup.position.z = playerZ - 280;
    }
  }

  reset() {
    for (let i = 0; i < this.pillars.length; i++) {
      const safeZ = this.getSafePillarZ(-i * this.pillarSpacing);
      this.pillars[i].position.set(0, this.viaductHeight / 2, safeZ);
    }
    this.trainGroup.position.set(0, 0, -250);
  }
}
