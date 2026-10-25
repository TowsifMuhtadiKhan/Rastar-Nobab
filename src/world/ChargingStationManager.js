import * as THREE from 'three';
import { toBengaliNumber } from '../ui/Textures.js';

export class ChargingStationManager {
  constructor(scene) {
    this.scene = scene;
    this.stations = [];
    this.stationSpacing = 240; // Roadside illegal charging point every 240m!
    this.padTexture = this.createCircularChargingPadTexture();
    this.signTexture = this.createIllegalChargingSignTexture();

    this.initStations();
  }

  // 1. High-Contrast Yellow "অবৈধ চার্জিং পয়েন্ট" Signboard Texture (Exact match to baperrasta.com screenshot!)
  createIllegalChargingSignTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 192;
    const ctx = canvas.getContext('2d');

    // Bright warning yellow background
    ctx.fillStyle = '#facc15';
    ctx.fillRect(0, 0, 640, 192);

    // Weathered industrial grunge borders
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, 630, 182);

    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 4;
    ctx.strokeRect(16, 16, 608, 160);

    // Red High-Voltage Lightning Flash Symbol
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(68, 30);
    ctx.lineTo(36, 102);
    ctx.lineTo(64, 102);
    ctx.lineTo(44, 162);
    ctx.lineTo(96, 88);
    ctx.lineTo(68, 88);
    ctx.closePath();
    ctx.fill();

    // Main Heading: অবৈধ চার্জিং পয়েন্ট
    ctx.font = '900 58px "Hind Siliguri", "Arial Black", sans-serif';
    ctx.fillStyle = '#dc2626';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('অবৈধ চার্জিং পয়েন্ট', 115, 74);

    // Subtitle: লাইন সরাসরি অবৈধভাবে সংযোগ করা হয়েছে
    ctx.font = 'bold 24px "Hind Siliguri", sans-serif';
    ctx.fillStyle = '#991b1b';
    ctx.fillText('লাইন সরাসরি অবৈধভাবে সংযোগ করা হয়েছে', 118, 134);

    // Metal corner mounting screws
    [
      [24, 24],
      [616, 24],
      [24, 168],
      [616, 168]
    ].forEach(([x, y]) => {
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(x - 1, y - 1, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    return tex;
  }

  // 2. Dashed White Circle with Center Lightning Bolt Road Stencil (Exact match to baperrasta.com screenshot!)
  createCircularChargingPadTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, 512, 512);

    const cx = 256;
    const cy = 256;
    const r = 216;

    // Faint ground energy aura
    const grad = ctx.createRadialGradient(cx, cy, 30, cx, cy, r);
    grad.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
    grad.addColorStop(0.75, 'rgba(250, 204, 21, 0.15)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // Bold Dashed White Circular Perimeter Ring (as seen on asphalt in screenshot!)
    ctx.setLineDash([26, 20]);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 10, 0, Math.PI * 2);
    ctx.stroke();

    // Center Large Stylized Glowing White Lightning Bolt Stencil (⚡)
    ctx.setLineDash([]);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 18;

    ctx.beginPath();
    ctx.moveTo(cx + 10, cy - 130);
    ctx.lineTo(cx - 75, cy + 10);
    ctx.lineTo(cx - 10, cy + 10);
    ctx.lineTo(cx - 55, cy + 135);
    ctx.lineTo(cx + 85, cy - 20);
    ctx.lineTo(cx + 15, cy - 20);
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    return tex;
  }

  initStations() {
    // 4 Roadside Illegal Charging Points recycled along the road
    for (let i = 0; i < 4; i++) {
      const z = -(100 + i * this.stationSpacing);
      const isRight = (i % 2 === 0);
      const x = isRight ? 10.5 : -10.5;
      const station = this.createIllegalChargingMesh(x, z, isRight);
      this.scene.add(station.group);
      this.stations.push(station);
    }
  }

  createIllegalChargingMesh(x, z, isRight) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // -------------------------------------------------------------
    // 1. Asphalt Dashed Circular Charging Spot Stencil
    // -------------------------------------------------------------
    const padGeo = new THREE.PlaneGeometry(5.2, 5.2);
    const padMat = new THREE.MeshStandardMaterial({
      map: this.padTexture,
      transparent: true,
      roughness: 0.8,
      metalness: 0.1,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.35,
      depthWrite: false
    });
    const pad = new THREE.Mesh(padGeo, padMat);
    pad.rotation.x = -Math.PI / 2;
    pad.position.set(0, 0.02, 0);
    group.add(pad);

    // Ground Pulse Light Ring
    const groundLight = new THREE.PointLight(0x00f0ff, 1.8, 8);
    groundLight.position.set(0, 0.6, 0);
    group.add(groundLight);

    // -------------------------------------------------------------
    // 2. Concrete Utility Pole at Footpath Edge (বৈদ্যুতিক খুঁটি)
    // -------------------------------------------------------------
    const poleX = isRight ? 2.8 : -2.8; // Located on the sidewalk curb
    const poleGroup = new THREE.Group();
    poleGroup.position.set(poleX, 0, 0);

    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x8b8e93, roughness: 0.9, metalness: 0.05 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.5, metalness: 0.8 });
    const darkWireMat = new THREE.MeshBasicMaterial({ color: 0x09090b });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85 });

    // Tall Concrete Pole
    const poleGeo = new THREE.CylinderGeometry(0.22, 0.28, 9.2, 16);
    const pole = new THREE.Mesh(poleGeo, concreteMat);
    pole.position.set(0, 4.6, 0);
    pole.castShadow = true;
    poleGroup.add(pole);

    // Steel Reinforcement Bands on Pole
    for (const by of [1.8, 3.8, 6.2, 8.4]) {
      const band = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.08, 16), metalMat);
      band.position.set(0, by, 0);
      poleGroup.add(band);
    }

    // Metal Cross-Arms (T-Bars for High-Voltage Wire Lines)
    const armGeo = new THREE.BoxGeometry(2.4, 0.12, 0.12);
    const arm1 = new THREE.Mesh(armGeo, metalMat);
    arm1.position.set(0, 8.2, 0);
    poleGroup.add(arm1);

    const arm2 = new THREE.Mesh(armGeo, metalMat);
    arm2.position.set(0, 8.7, 0);
    poleGroup.add(arm2);

    // White Ceramic Insulator Bells on Cross-Arms
    const insulMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 });
    for (const ix of [-1.0, -0.5, 0.5, 1.0]) {
      const insul1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.04, 0.20, 12), insulMat);
      insul1.position.set(ix, 8.35, 0);
      poleGroup.add(insul1);

      const insul2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.04, 0.20, 12), insulMat);
      insul2.position.set(ix, 8.85, 0);
      poleGroup.add(insul2);
    }

    // Street Lamp with glowing glass bulb shining down on sidewalk
    const lampArm = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.2), metalMat);
    lampArm.rotation.z = isRight ? -Math.PI / 4 : Math.PI / 4;
    lampArm.position.set(isRight ? -0.45 : 0.45, 7.6, 0);
    poleGroup.add(lampArm);

    const lampBulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1.2 })
    );
    lampBulb.position.set(isRight ? -0.85 : 0.85, 7.2, 0);
    poleGroup.add(lampBulb);

    // -------------------------------------------------------------
    // 3. Tangled Mess of Overhead "CURRENT LINES" (কারেন্টের তারের জটলা)
    // -------------------------------------------------------------
    // Tangled Cable Loop Coils drooping and crossing the street
    for (let c = 0; c < 8; c++) {
      const sagX = (Math.random() - 0.5) * 1.8;
      const sagY = 6.8 + Math.random() * 1.8;
      const sagZ = (Math.random() - 0.5) * 6.0;

      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3((isRight ? -1.0 : 1.0) * (0.8 + c * 0.15), 8.5 - c * 0.15, -4.0),
        new THREE.Vector3(sagX, sagY, sagZ * 0.4),
        new THREE.Vector3((isRight ? -1.0 : 1.0) * (0.6 + c * 0.1), 8.3 - c * 0.1, 4.0)
      ]);

      const cableGeo = new THREE.TubeGeometry(curve, 18, 0.022, 6, false);
      const cableMesh = new THREE.Mesh(cableGeo, darkWireMat);
      poleGroup.add(cableMesh);
    }

    // Heavy tangled wire loop coil hanging directly on the pole (as in Dhaka)
    for (let ring = 0; ring < 4; ring++) {
      const loop = new THREE.Mesh(
        new THREE.TorusGeometry(0.38 + ring * 0.06, 0.024, 8, 20),
        darkWireMat
      );
      loop.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.4;
      loop.position.set(0.12, 6.4 - ring * 0.18, 0.08);
      poleGroup.add(loop);
    }

    // -------------------------------------------------------------
    // 4. Yellow "অবৈধ চার্জিং পয়েন্ট" Signboard (Image Match!)
    // -------------------------------------------------------------
    const signGeo = new THREE.BoxGeometry(2.4, 0.72, 0.06);
    const signMat = new THREE.MeshStandardMaterial({
      map: this.signTexture,
      roughness: 0.35,
      metalness: 0.15,
      emissive: 0xfacc15,
      emissiveIntensity: 0.18
    });
    const signMesh = new THREE.Mesh(signGeo, signMat);
    // Face towards oncoming player traffic
    signMesh.position.set(isRight ? -0.85 : 0.85, 4.2, 0);
    signMesh.rotation.y = isRight ? 0.15 : -0.15;
    signMesh.castShadow = true;
    poleGroup.add(signMesh);

    // Signboard Mounting Clamps
    for (const sy of [-0.22, 0.22]) {
      const clamp = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.04, 0.04), metalMat);
      clamp.position.set(isRight ? -0.4 : 0.4, 4.2 + sy, 0);
      poleGroup.add(clamp);
    }

    // -------------------------------------------------------------
    // 5. Wooden Meter / Hook Switch Junction Box (কাঠের মিটার বোর্ড)
    // -------------------------------------------------------------
    const meterBox = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.68, 0.28), woodMat);
    meterBox.position.set(isRight ? -0.32 : 0.32, 2.4, 0.12);
    meterBox.castShadow = true;
    poleGroup.add(meterBox);

    // White Electric Switches & Knife-Switch Contacts on Board
    for (const swX of [-0.12, 0.12]) {
      for (const swY of [0.14, -0.14]) {
        const sw = new THREE.Mesh(
          new THREE.BoxGeometry(0.08, 0.10, 0.04),
          new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 })
        );
        sw.position.set(swX, swY, 0.15);
        meterBox.add(sw);
      }
    }

    // Lower Metal Cable Junction Box at foot of pole
    const footBox = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.44, 0.34), metalMat);
    footBox.position.set(isRight ? -0.28 : 0.28, 0.6, -0.1);
    poleGroup.add(footBox);

    // -------------------------------------------------------------
    // 6. Blue Plastic Water Bucket beside Pole (Image Match!)
    // -------------------------------------------------------------
    const bucketGeo = new THREE.CylinderGeometry(0.20, 0.16, 0.42, 16);
    const bucketMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 });
    const bucket = new THREE.Mesh(bucketGeo, bucketMat);
    bucket.position.set(isRight ? -0.65 : 0.65, 0.21, -0.85);
    bucket.castShadow = true;
    poleGroup.add(bucket);

    // -------------------------------------------------------------
    // 7. Dynamic Physical Charging Cables connecting to Rickshaw!
    // -------------------------------------------------------------
    const cableCurves = [];
    const wireMeshes = [];
    for (let w = 0; w < 3; w++) {
      const wireCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(poleX + (isRight ? -0.32 : 0.32), 2.4 - w * 0.08, 0.12),
        new THREE.Vector3(poleX * 0.6, 1.2, 0.3 + w * 0.2),
        new THREE.Vector3(0, 0.4, 0.2 + w * 0.15) // Rests on road or attaches to player
      ]);
      const wireGeo = new THREE.TubeGeometry(wireCurve, 16, 0.024, 6, false);
      const wireMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.8 });
      const wireMesh = new THREE.Mesh(wireGeo, wireMat);
      group.add(wireMesh);

      cableCurves.push(wireCurve);
      wireMeshes.push(wireMesh);
    }

    // -------------------------------------------------------------
    // 8. Footpath Pedestrians (Dhaka Lungi & Panjabi characters)
    // -------------------------------------------------------------
    const pedGroup = this.createPedestrians(isRight);
    pedGroup.position.set(poleX + (isRight ? 1.4 : -1.4), 0, 0);
    poleGroup.add(pedGroup);

    group.add(poleGroup);

    return {
      group,
      poleX,
      x,
      isRight,
      padMesh: pad,
      groundLight,
      wireMeshes,
      cableCurves,
      boxPos: new THREE.Vector3(x + poleX + (isRight ? -0.32 : 0.32), 2.4, z + 0.12)
    };
  }

  // Authentic Dhaka pedestrians (Lungi, Panjabi, Kurta) standing or walking on sidewalk
  createPedestrians(isRight) {
    const group = new THREE.Group();

    const skinMat = new THREE.MeshStandardMaterial({ color: 0x8d5524, roughness: 0.8 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
    const whitePanjabiMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.7 });
    const pinkPanjabiMat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.7 });
    const lungiCheckMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.75 });
    const lungiMaroonMat = new THREE.MeshStandardMaterial({ color: 0x881337, roughness: 0.75 });

    // Person 1: Lungi + White Panjabi
    const p1 = new THREE.Group();
    p1.position.set(0, 0, -1.8);

    // Torso (Panjabi)
    const torso1 = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.65, 0.24), whitePanjabiMat);
    torso1.position.y = 1.15;
    p1.add(torso1);

    // Head
    const head1 = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), skinMat);
    head1.position.y = 1.62;
    p1.add(head1);

    const hair1 = new THREE.Mesh(new THREE.SphereGeometry(0.145, 12, 12), hairMat);
    hair1.position.set(0, 1.66, -0.02);
    p1.add(hair1);

    // Lungi (Cylinder)
    const lungi1 = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.82, 12), lungiCheckMat);
    lungi1.position.y = 0.44;
    p1.add(lungi1);

    group.add(p1);

    // Person 2: Pink/Magenta Kurta + Lungi
    const p2 = new THREE.Group();
    p2.position.set(0.3, 0, 1.8);

    const torso2 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.62, 0.22), pinkPanjabiMat);
    torso2.position.y = 1.12;
    p2.add(torso2);

    const head2 = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12), skinMat);
    head2.position.y = 1.58;
    p2.add(head2);

    const lungi2 = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.80, 12), lungiMaroonMat);
    lungi2.position.y = 0.42;
    p2.add(lungi2);

    group.add(p2);

    return group;
  }

  update(delta, playerZ, playerPos = null) {
    const now = Date.now();
    for (const st of this.stations) {
      // Animate ground charging pad pulse
      if (st.padMesh && st.padMesh.material) {
        st.padMesh.material.emissiveIntensity = 0.30 + Math.sin(now * 0.006) * 0.20;
      }
      if (st.groundLight) {
        st.groundLight.intensity = 1.5 + Math.sin(now * 0.008) * 0.7;
      }

      // Bi-directional recycling for U-Turns (always keeps stations ahead and behind!)
      const halfSpan = (this.stations.length * this.stationSpacing) / 2; // 480m
      if (st.group.position.z > playerZ + halfSpan) {
        let minZ = playerZ;
        for (const other of this.stations) {
          if (other.group.position.z < minZ) minZ = other.group.position.z;
        }
        st.group.position.z = minZ - this.stationSpacing;
        st.boxPos.z = st.group.position.z + 0.12;
      } else if (st.group.position.z < playerZ - halfSpan) {
        let maxZ = playerZ;
        for (const other of this.stations) {
          if (other.group.position.z > maxZ) maxZ = other.group.position.z;
        }
        st.group.position.z = maxZ + this.stationSpacing;
        st.boxPos.z = st.group.position.z + 0.12;
      }
    }
  }

  // Check if player's vehicle is positioned over an illegal charging spot
  checkCharging(pPos) {
    for (const st of this.stations) {
      const dx = Math.abs(pPos.x - st.x);
      const dz = Math.abs(pPos.z - st.group.position.z);
      // Within 2.7m radius of the circular stencil on the asphalt
      if (dx < 2.8 && dz < 3.2) {
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
      st.group.position.z = -(100 + i * this.stationSpacing);
      st.boxPos.z = st.group.position.z + 0.12;
    }
  }
}
