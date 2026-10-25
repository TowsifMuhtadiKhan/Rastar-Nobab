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

  update(delta, playerZ, playerSpeed, activeChourastas = [], playerDirZ = -1) {
    this.spawnTimer += delta;
    if (this.spawnTimer >= this.spawnInterval && this.vehicles.length < this.maxVehicles) {
      this.spawnTimer = 0;
      this.spawnRandomVehicle(playerZ, playerDirZ);
    }

    // Spawn authentic dynamic cross-traffic at upcoming Chourasta
    if (activeChourastas && activeChourastas.length > 0) {
      this.crossTrafficTimer += delta;
      if (this.crossTrafficTimer >= 2.0) {
        this.crossTrafficTimer = 0;
        for (const ch of activeChourastas) {
          const distAhead = (playerDirZ < 0) ? (playerZ - ch.z) : (ch.z - playerZ);
          if (distAhead > 15 && distAhead < 120) {
            this.spawnCrossTrafficAtChourasta(ch.z);
            break;
          }
        }
      }
    }

    // Ensure there is always a VIP car target ahead
    const needVip = (playerDirZ < 0)
      ? (!this.vipCar || !this.vipCar.active || this.vipCar.group.position.z > playerZ)
      : (!this.vipCar || !this.vipCar.active || this.vipCar.group.position.z < playerZ);
    if (needVip) {
      this.spawnVIPCar(playerZ, playerDirZ);
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

  spawnVIPCar(playerZ, playerDirZ = -1) {
    const lane = [2.5, 5.5, -2.5][Math.floor(Math.random() * 3)];
    const v = new TrafficCar(this.scene, 'vip');
    const spawnZ = playerZ + playerDirZ * (95 + Math.random() * 30);
    v.group.position.set(lane, 0, spawnZ);
    v.speed = 35;
    v.isWrongWay = (playerDirZ < 0) ? (lane < 0) : (lane > 0);
    v.group.rotation.y = v.isWrongWay ? Math.PI : 0;

    this.vehicles.push(v);
    this.vipCar = v;
  }

  spawnRandomVehicle(playerZ, playerDirZ = -1) {
    // 65% chance to spawn on player's side of highway (X > 0), 35% on opposite side (X < 0)
    const onPlayerSide = Math.random() < 0.65;
    const lanePool = onPlayerSide ? [3.2, 5.8, 8.8, 10.6] : [-3.2, -5.8, -8.8, -10.6];
    const laneX = lanePool[Math.floor(Math.random() * lanePool.length)];

    // Prominent Auto-Rickshaws & CNGs (60% of all traffic!)
    const rand = Math.random();
    let type = 'rickshaw';
    if (rand < 0.35) type = 'rickshaw';    // 35% Dhaka Battery Auto-Rickshaw / Easybike
    else if (rand < 0.60) type = 'cng';    // 25% Green CNG Auto-Rickshaw
    else if (rand < 0.76) type = 'bus';    // 16% Dhaka Local Bus
    else if (rand < 0.86) type = 'hiace';  // 10% Microbus
    else if (rand < 0.93) type = 'sedan';  // 7% Private Sedan
    else type = 'pedestrian';              // 7% Crossing Public

    const vehicle = new TrafficCar(this.scene, type);
    const spawnZ = playerZ + playerDirZ * (55 + Math.random() * 65);

    if (type === 'pedestrian') {
      const fromRight = Math.random() > 0.5;
      const startX = fromRight ? 11.2 : -11.2;
      vehicle.group.position.set(startX, 0, spawnZ);
      vehicle.crossSpeed = fromRight ? -1.8 : 1.8;
      vehicle.group.rotation.y = (playerDirZ < 0) ? (fromRight ? -Math.PI / 2 : Math.PI / 2) : (fromRight ? Math.PI / 2 : -Math.PI / 2);
      vehicle.speed = 1.5;
      vehicle.isWrongWay = false;
    } else if (onPlayerSide) {
      // ON THE PLAYER'S SIDE OF THE HIGHWAY:
      const isAuto = (type === 'rickshaw' || type === 'cng');
      const shouldDriveWrongWay = isAuto && (Math.random() < 0.38);

      vehicle.group.position.set(laneX, 0, spawnZ);
      if (shouldDriveWrongWay) {
        // Driving oncoming towards player
        vehicle.group.rotation.y = (playerDirZ < 0) ? Math.PI : 0;
        vehicle.speed = 22 + Math.random() * 12;
        vehicle.isWrongWay = (playerDirZ < 0);
      } else {
        // Cruising forward in traffic flow
        vehicle.group.rotation.y = (playerDirZ < 0) ? 0 : Math.PI;
        vehicle.speed = isAuto ? (20 + Math.random() * 12) : (24 + Math.random() * 22);
        vehicle.isWrongWay = (playerDirZ > 0);
      }
    } else {
      // OPPOSITE ROADWAY: Normal oncoming traffic flow
      vehicle.group.position.set(laneX, 0, spawnZ);
      vehicle.group.rotation.y = (playerDirZ < 0) ? Math.PI : 0;
      vehicle.speed = 26 + Math.random() * 26;
      vehicle.isWrongWay = (playerDirZ < 0);
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
    const now = Date.now();
    for (let i = 0; i < this.vehicles.length; i++) {
      const v = this.vehicles[i];
      if (!v.active) continue;
      if (v.hitTime && now - v.hitTime < 1800) continue;

      const vb = v.getBounds();
      const dx = Math.abs(vb.x - playerBounds.x);
      const dz = Math.abs(vb.z - playerBounds.z);

      if (dx < (vb.width + playerBounds.width) * 0.45 && dz < (vb.length + playerBounds.length) * 0.45) {
        v.hitTime = now;
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
    // Immediate Dhaka Traffic with Auto-Rickshaws on both WRONG SIDE and RIGHT SIDE!
    const trafficBlueprint = [
      // Right-side auto rickshaw cruising ahead
      { type: 'rickshaw', lane: 5.8, zOffset: -32, wrongWay: false, speed: 25 },
      // WRONG-SIDE oncoming auto rickshaw on the right outer lane!
      { type: 'rickshaw', lane: 8.8, zOffset: -60, wrongWay: true, speed: 28 },
      // Green CNG auto rickshaw cruising on the inner lane
      { type: 'cng', lane: 3.2, zOffset: -48, wrongWay: false, speed: 28 },
      // WRONG-SIDE oncoming Green CNG auto rickshaw near shoulder!
      { type: 'cng', lane: 10.6, zOffset: -95, wrongWay: true, speed: 26 },
      // Local Dhaka Bus ahead
      { type: 'bus', lane: 5.8, zOffset: -85, wrongWay: false, speed: 32 },
      // Normal oncoming traffic on opposite roadway
      { type: 'rickshaw', lane: -5.8, zOffset: -40, wrongWay: true, speed: 26 },
      { type: 'bus', lane: -8.8, zOffset: -75, wrongWay: true, speed: 38 },
      { type: 'cng', lane: -3.2, zOffset: -110, wrongWay: true, speed: 30 }
    ];

    trafficBlueprint.forEach((t) => {
      const v = new TrafficCar(this.scene, t.type);
      const z = playerZ + t.zOffset;
      v.group.position.set(t.lane, 0, z);
      v.isWrongWay = t.wrongWay;
      v.group.rotation.y = t.wrongWay ? Math.PI : 0;
      v.speed = t.speed;
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
