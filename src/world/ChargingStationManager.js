import * as THREE from 'three';
import { toBengaliNumber } from '../ui/Textures.js';

export class ChargingStationManager {
  constructor(scene) {
    this.scene = scene;
    this.stations = [];
    this.stationSpacing = 280; // Roadside charging station every 280m!
    this.padTexture = this.createChargingPadTexture();
    this.signTexture = this.createChargingSignTexture();

    this.initStations();
  }

  createChargingPadTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Cyberpunk dark asphalt base with glowing neon border
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 512, 512);

    // Glowing Cyan / Emerald energy track
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 16;
    ctx.strokeRect(16, 16, 480, 480);

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 8;
    ctx.strokeRect(32, 32, 448, 448);

    // Giant Electric Bolt Icon & Battery
    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 120px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚡', 256, 180);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 52px "Hind Siliguri", sans-serif';
    ctx.fillText('দেশি টেসলা চার্জিং', 256, 310);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('DESI TESLA SUPERCHARGER', 256, 375);

    // Chevron arrows pointing into bay
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(256, 410);
    ctx.lineTo(290, 450);
    ctx.lineTo(270, 450);
    ctx.lineTo(256, 430);
    ctx.lineTo(242, 450);
    ctx.lineTo(222, 450);
    ctx.closePath();
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    return tex;
  }

  createChargingSignTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 512, 128);

    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 6;
    ctx.strokeRect(4, 4, 504, 120);

    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 44px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚡ দেশি টেসলা সুপারচার্জার ⚡', 256, 50);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('100% FREE FAST ELECTRIC CHARGING', 256, 92);

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }

  initStations() {
    // Pre-create 4 roadside stations recycled ahead
    for (let i = 0; i < 4; i++) {
      const z = -(120 + i * this.stationSpacing);
      const isRight = (i % 2 === 0);
      const x = isRight ? 11.2 : -11.2;
      const station = this.createStationMesh(x, z, isRight);
      this.scene.add(station.group);
      this.stations.push(station);
    }
  }

  createStationMesh(x, z, isRight) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // 1. Ground Charging Pad (Interactive Zone)
    const padGeo = new THREE.PlaneGeometry(4.2, 7.5);
    const padMat = new THREE.MeshStandardMaterial({
      map: this.padTexture,
      roughness: 0.4,
      metalness: 0.2,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.25
    });
    const pad = new THREE.Mesh(padGeo, padMat);
    pad.rotation.x = -Math.PI / 2;
    pad.position.set(0, 0.015, 0);
    pad.receiveShadow = true;
    group.add(pad);

    // 2. High-Tech Supercharger Cabinet (Outer Shoulder)
    const cabinetX = isRight ? 2.5 : -2.5;
    const cabinetGeo = new THREE.BoxGeometry(0.85, 2.4, 1.2);
    const cabinetMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.2
    });
    const cabinet = new THREE.Mesh(cabinetGeo, cabinetMat);
    cabinet.position.set(cabinetX, 1.2, 0);
    cabinet.castShadow = true;
    group.add(cabinet);

    // Cabinet Glowing Battery Status Screen
    const screenGeo = new THREE.BoxGeometry(0.1, 1.4, 0.8);
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 0.8
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(cabinetX + (isRight ? -0.42 : 0.42), 1.3, 0);
    group.add(screen);

    // 3. Overhead Steel Canopy with Solar Panels
    const canopyHeight = 4.2;
    const canopyMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
    const solarMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.9, roughness: 0.1 });

    // Columns
    const colMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });
    const colGeo = new THREE.CylinderGeometry(0.14, 0.16, canopyHeight, 12);
    const col1 = new THREE.Mesh(colGeo, colMat);
    col1.position.set(cabinetX, canopyHeight / 2, -2.8);
    group.add(col1);

    const col2 = new THREE.Mesh(colGeo, colMat);
    col2.position.set(cabinetX, canopyHeight / 2, 2.8);
    group.add(col2);

    // Solar Roof Panel
    const roofGeo = new THREE.BoxGeometry(4.8, 0.25, 8.2);
    const roof = new THREE.Mesh(roofGeo, canopyMat);
    roof.position.set(0, canopyHeight, 0);
    roof.castShadow = true;
    group.add(roof);

    // Solar Cells top
    const solarGeo = new THREE.PlaneGeometry(4.4, 7.8);
    const solar = new THREE.Mesh(solarGeo, solarMat);
    solar.rotation.x = -Math.PI / 2;
    solar.position.set(0, canopyHeight + 0.13, 0);
    group.add(solar);

    // 4. Illuminated Overhead Signboard
    const signGeo = new THREE.BoxGeometry(4.2, 1.1, 0.2);
    const signMat = new THREE.MeshStandardMaterial({
      map: this.signTexture,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.35,
      roughness: 0.4
    });
    const signMesh = new THREE.Mesh(signGeo, signMat);
    signMesh.position.set(0, canopyHeight + 0.75, isRight ? -0.5 : 0.5);
    group.add(signMesh);

    // 5. Floating Glowing 3D Beacon (Visible from afar!)
    const beaconGroup = new THREE.Group();
    beaconGroup.position.set(0, canopyHeight + 2.0, 0);

    const beaconGeo = new THREE.OctahedronGeometry(0.65, 0);
    const beaconMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x00f0ff,
      emissiveIntensity: 1.0,
      roughness: 0.1,
      metalness: 0.5
    });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beaconGroup.add(beacon);

    // Cyan/Green Pointlight illuminating the charging pad
    const pLight = new THREE.PointLight(0x00f0ff, 2.2, 14);
    pLight.position.set(0, canopyHeight - 0.4, 0);
    group.add(pLight);

    group.add(beaconGroup);

    return {
      group,
      beacon: beaconGroup,
      x,
      isRight,
      padMesh: pad
    };
  }

  update(delta, playerZ) {
    const now = Date.now();
    for (const st of this.stations) {
      // Rotate floating beacon
      if (st.beacon) {
        st.beacon.rotation.y += delta * 2.2;
        st.beacon.position.y = 6.0 + Math.sin(now * 0.0035) * 0.25;
      }

      // Animate pad emissive intensity
      if (st.padMesh && st.padMesh.material) {
        st.padMesh.material.emissiveIntensity = 0.25 + Math.sin(now * 0.005) * 0.15;
      }

      // Recycle stations as player drives forward
      if (st.group.position.z > playerZ + 50) {
        let minZ = playerZ;
        for (const other of this.stations) {
          if (other.group.position.z < minZ) minZ = other.group.position.z;
        }
        st.group.position.z = minZ - this.stationSpacing;
      }
    }
  }

  // Check if player's vehicle is positioned over a charging pad
  checkCharging(pPos) {
    for (const st of this.stations) {
      const dx = Math.abs(pPos.x - st.x);
      const dz = Math.abs(pPos.z - st.group.position.z);
      if (dx < 2.5 && dz < 4.2) {
        return { isCharging: true, station: st };
      }
    }
    return { isCharging: false, station: null };
  }

  // Get distance in meters to the closest upcoming charging station
  getNextStationDistance(playerZ) {
    let nearestDist = 99999;
    for (const st of this.stations) {
      const dist = playerZ - st.group.position.z;
      if (dist > 0 && dist < nearestDist) {
        nearestDist = dist;
      }
    }
    return nearestDist < 90000 ? Math.round(nearestDist) : null;
  }

  reset() {
    for (let i = 0; i < this.stations.length; i++) {
      const st = this.stations[i];
      st.group.position.z = -(120 + i * this.stationSpacing);
    }
  }
}
