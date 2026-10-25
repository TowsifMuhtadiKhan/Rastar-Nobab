import * as THREE from 'three';
import { TrafficCar } from './TrafficCar.js';

export class TrafficManager {
  constructor(scene) {
    this.scene = scene;
    this.vehicles = [];
    this.maxVehicles = 26;
    this.spawnTimer = 0;
    this.spawnInterval = 1.1;
    this.crossTrafficTimer = 0;

    // Dhaka Highway Lanes:
    // Left: Wrong-way traffic oncoming (X: -8.5, -5.5, -2.5)
    // Right: Normal traffic direction (X: 2.5, 5.5, 8.5)
    this.lanes = [-8.5, -5.5, -2.5, 2.5, 5.5, 8.5];

    // Reference to current target VIP Car ahead
    this.vipCar = null;

    // Pre-populate highway with iconic Green CNGs, buses & cars
    this.initHighwayTraffic(0);
  }

  update(delta, playerZ, playerSpeed, activeChourastas = []) {
    this.spawnTimer += delta;
    if (this.spawnTimer >= this.spawnInterval && this.vehicles.length < this.maxVehicles) {
      this.spawnTimer = 0;
      this.spawnRandomVehicle(playerZ);
    }

    // Spawn authentic dynamic cross-traffic at upcoming Chourasta
    if (activeChourastas && activeChourastas.length > 0) {
      this.crossTrafficTimer += delta;
      if (this.crossTrafficTimer >= 2.0) {
        this.crossTrafficTimer = 0;
        for (const ch of activeChourastas) {
          const distAhead = playerZ - ch.z;
          if (distAhead > 15 && distAhead < 120) {
            this.spawnCrossTrafficAtChourasta(ch.z);
            break;
          }
        }
      }
    }

    // Ensure there is always a VIP car target ahead
    if (!this.vipCar || !this.vipCar.active || this.vipCar.group.position.z > playerZ) {
      this.spawnVIPCar(playerZ);
    }

    // Update all active vehicles
    for (let i = this.vehicles.length - 1; i >= 0; i--) {
      const v = this.vehicles[i];
      v.update(delta, playerZ);

      if (!v.active) {
        if (v === this.vipCar) this.vipCar = null;
        this.scene.remove(v.group);
        this.vehicles.splice(i, 1);
      }
    }
  }

  spawnVIPCar(playerZ) {
    const lane = [2.5, 5.5, -2.5][Math.floor(Math.random() * 3)];
    const v = new TrafficCar(this.scene, 'vip');
    const spawnZ = playerZ - (95 + Math.random() * 30);
    v.group.position.set(lane, 0, spawnZ);
    v.speed = 35;
    v.isWrongWay = lane < 0;
    if (v.isWrongWay) v.group.rotation.y = Math.PI;

    this.vehicles.push(v);
    this.vipCar = v;
  }

  spawnRandomVehicle(playerZ) {
    const laneIndex = Math.floor(Math.random() * this.lanes.length);
    const laneX = this.lanes[laneIndex];
    const isWrongSideLane = laneX < 0;

    const rand = Math.random();
    let type = 'rickshaw';
    if (rand < 0.24) type = 'rickshaw';    // 24% Dhaka Motor Rickshaws!
    else if (rand < 0.44) type = 'cng';    // 20% Green CNGs
    else if (rand < 0.62) type = 'bus';    // 18% Dhaka Local Buses
    else if (rand < 0.73) type = 'hiace';  // 11% Microbuses
    else if (rand < 0.82) type = 'sedan';  // 9% Private Sedans
    else type = 'pedestrian';              // 18% Crossing Pedestrians!

    const vehicle = new TrafficCar(this.scene, type);
    const spawnZ = playerZ - (65 + Math.random() * 60);

    if (type === 'pedestrian') {
      const isCrossing = Math.random() > 0.4;
      if (isCrossing) {
        const fromRight = Math.random() > 0.5;
        const startX = fromRight ? 11.5 : -11.5;
        vehicle.group.position.set(startX, 0, spawnZ);
        vehicle.crossSpeed = fromRight ? -1.8 : 1.8;
        vehicle.group.rotation.y = fromRight ? -Math.PI / 2 : Math.PI / 2;
        vehicle.speed = 1.5;
      } else {
        // Walking or standing near median or shoulder
        const standX = [ -10.5, -1.8, 1.8, 10.5 ][Math.floor(Math.random() * 4)];
        vehicle.group.position.set(standX, 0, spawnZ);
        vehicle.speed = Math.random() * 3 + 1;
        vehicle.crossSpeed = 0;
      }
      vehicle.isWrongWay = false;
    } else if (isWrongSideLane) {
      vehicle.group.position.set(laneX, 0, spawnZ);
      vehicle.group.rotation.y = Math.PI;
      vehicle.speed = 25 + Math.random() * 30;
      vehicle.isWrongWay = true;
    } else {
      vehicle.group.position.set(laneX, 0, spawnZ);
      vehicle.group.rotation.y = 0;
      vehicle.speed = 20 + Math.random() * 25;
      vehicle.isWrongWay = false;
    }

    this.vehicles.push(vehicle);
  }

  spawnCrossTrafficAtChourasta(chourastaZ) {
    if (this.vehicles.length >= this.maxVehicles + 4) return;
    const movingRight = Math.random() > 0.5;
    const startX = movingRight ? -32 : 32;
    const laneZ = chourastaZ + (movingRight ? -4.5 : 4.5);

    const rand = Math.random();
    let type = 'cng';
    if (rand < 0.35) type = 'rickshaw';   // 35% Motor Rickshaws crossing!
    else if (rand < 0.68) type = 'cng';   // 33% Green CNG Auto-Rickshaws crossing
    else if (rand < 0.86) type = 'bus';   // 18% Dhaka Buses crossing
    else type = 'sedan';                  // 14% Private Sedans

    const vehicle = new TrafficCar(this.scene, type);
    vehicle.isCrossTraffic = true;
    vehicle.crossSpeed = (movingRight ? 1 : -1) * (14 + Math.random() * 8);
    vehicle.group.position.set(startX, 0, laneZ);
    vehicle.group.rotation.y = movingRight ? Math.PI / 2 : -Math.PI / 2;
    vehicle.speed = Math.abs(vehicle.crossSpeed);

    this.vehicles.push(vehicle);
  }

  getVIPDistance(playerZ) {
    if (!this.vipCar || !this.vipCar.active) return null;
    const dist = Math.round(playerZ - this.vipCar.group.position.z);
    return Math.max(0, dist);
  }

  triggerHornShockwave(playerX, playerZ, radius = 28) {
    const affected = [];
    for (const v of this.vehicles) {
      const dx = v.group.position.x - playerX;
      const dz = v.group.position.z - playerZ;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dz < 0 && dist < radius) {
        v.reactToHorn();
        affected.push(v);
      }
    }
    return affected;
  }

  checkCollisions(playerBounds) {
    const hits = [];
    for (let i = 0; i < this.vehicles.length; i++) {
      const v = this.vehicles[i];
      if (!v.active) continue;

      const vb = v.getBounds();
      const dx = Math.abs(vb.x - playerBounds.x);
      const dz = Math.abs(vb.z - playerBounds.z);

      if (dx < (vb.width + playerBounds.width) * 0.45 && dz < (vb.length + playerBounds.length) * 0.45) {
        hits.push(v);
      }
    }
    return hits;
  }

  removeVehicle(vehicle) {
    if (vehicle === this.vipCar) this.vipCar = null;
    vehicle.active = false;
    this.scene.remove(vehicle.group);
    const idx = this.vehicles.indexOf(vehicle);
    if (idx !== -1) {
      this.vehicles.splice(idx, 1);
    }
  }

  initHighwayTraffic(playerZ) {
    // Pre-populate with iconic Motor Rickshaws, CNG Auto-Rickshaws, and buses
    const initialTypes = ['rickshaw', 'cng', 'bus', 'rickshaw', 'cng', 'hiace', 'sedan', 'rickshaw'];
    initialTypes.forEach((t, i) => {
      const v = new TrafficCar(this.scene, t);
      const lane = this.lanes[i % this.lanes.length];
      const z = playerZ - (30 + i * 25);
      v.group.position.set(lane, 0, z);
      v.isWrongWay = lane < 0;
      if (v.isWrongWay) {
        v.group.rotation.y = Math.PI;
        v.speed = 28 + Math.random() * 10;
      } else {
        v.group.rotation.y = 0;
        v.speed = 22 + Math.random() * 12;
      }
      this.vehicles.push(v);
    });
  }

  reset() {
    for (const v of this.vehicles) {
      this.scene.remove(v.group);
    }
    this.vehicles = [];
    this.vipCar = null;
    this.spawnTimer = 0;
    this.initHighwayTraffic(0);
  }
}
