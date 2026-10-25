import * as THREE from 'three';
import { TextureFactory } from '../ui/Textures.js';

export class LootManager {
  constructor(scene) {
    this.scene = scene;
    this.items = [];

    // Pre-create textures
    this.tex500 = TextureFactory.createTakaNoteTexture(500);
    this.tex1000 = TextureFactory.createTakaNoteTexture(1000);
    this.tex2000 = TextureFactory.createTakaNoteTexture(2000);

    // Car part materials
    this.partMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x005577,
      emissiveIntensity: 0.5
    });

    this.spawnTimer = 0;
  }

  // Spawn collectible on road ahead of player
  update(delta, playerZ) {
    this.spawnTimer += delta;
    if (this.spawnTimer > 1.8 && this.items.length < 25) {
      this.spawnTimer = 0;
      this.spawnRoadLoot(playerZ);
    }

    // Animate items (spin, float)
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      item.mesh.rotation.y += delta * 2.5;
      item.mesh.position.y = item.baseY + Math.sin(Date.now() * 0.005 + item.mesh.position.x) * 0.2;

      // Clean up passed items
      if (item.mesh.position.z > playerZ + 20 || item.mesh.position.z < playerZ - 200) {
        this.scene.remove(item.mesh);
        this.items.splice(i, 1);
      }
    }
  }

  spawnRoadLoot(playerZ) {
    const isMoney = Math.random() > 0.4;
    const laneX = (Math.random() - 0.5) * 18;
    const spawnZ = playerZ - (40 + Math.random() * 80);

    if (isMoney) {
      const rand = Math.random();
      const val = rand < 0.5 ? 500 : (rand < 0.85 ? 1000 : 2000);
      this.spawnTakaNote(laneX, spawnZ, val);
    } else {
      this.spawnCarPart(laneX, spawnZ);
    }
  }

  // Spawn Car Part (Battery / Engine / Turbo horn / Bumper)
  spawnCarPart(x, z) {
    const geo = new THREE.DodecahedronGeometry(0.5, 0);
    const mesh = new THREE.Mesh(geo, this.partMat);
    mesh.position.set(x, 0.8, z);
    mesh.castShadow = true;
    this.scene.add(mesh);

    this.items.push({
      type: 'part',
      mesh: mesh,
      baseY: 0.8,
      radius: 0.8
    });
  }

  // Spawn Bangladeshi Taka Note (৳ 500, ৳ 1000, ৳ 2000)
  spawnTakaNote(x, z, value = 500) {
    const tex = value === 2000 ? this.tex2000 : (value === 1000 ? this.tex1000 : this.tex500);
    const geo = new THREE.PlaneGeometry(0.9, 0.45);
    const mat = new THREE.MeshStandardMaterial({
      map: tex,
      side: THREE.DoubleSide,
      roughness: 0.3
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, 0.7, z);
    mesh.rotation.x = -Math.PI / 6;
    this.scene.add(mesh);

    this.items.push({
      type: 'money',
      value: value,
      mesh: mesh,
      baseY: 0.7,
      radius: 0.9
    });
  }

  // Burst of items when smashing into traffic or eating car parts!
  burstLootAt(x, z, count = 4) {
    for (let i = 0; i < count; i++) {
      const ox = (Math.random() - 0.5) * 4;
      const oz = (Math.random() - 0.5) * 4;
      if (i % 2 === 0) {
        const val = Math.random() > 0.4 ? 1000 : 500;
        this.spawnTakaNote(x + ox, z + oz, val);
      } else {
        this.spawnCarPart(x + ox, z + oz);
      }
    }
  }

  // Check collision with player
  checkPickup(playerBounds) {
    const collected = [];
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      const dx = Math.abs(item.mesh.position.x - playerBounds.x);
      const dz = Math.abs(item.mesh.position.z - playerBounds.z);

      if (dx < 1.3 && dz < 1.5) {
        collected.push(item);
        this.scene.remove(item.mesh);
        this.items.splice(i, 1);
      }
    }
    return collected;
  }

  reset() {
    for (const item of this.items) {
      this.scene.remove(item.mesh);
    }
    this.items = [];
    this.spawnTimer = 0;
  }
}
