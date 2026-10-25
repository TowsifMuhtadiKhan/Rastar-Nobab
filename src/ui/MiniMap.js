import { toBengaliNumber } from './Textures.js';

export class MiniMap {
  constructor(onTurnCallback = null) {
    this.container = document.getElementById('hud-minimap-container');
    this.canvas = document.getElementById('minimap-canvas');
    this.onTurnCallback = onTurnCallback;
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.width = 272;  // High-DPI internal resolution
    this.height = 272;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.turnPromptEl = document.getElementById('minimap-turn-prompt');
    this.locationNameEl = document.getElementById('minimap-loc-name');

    // Radar scan sweep angle
    this.scanAngle = 0;
    this.currentNearChourasta = null;

    if (this.turnPromptEl) {
      this.turnPromptEl.addEventListener('click', (e) => {
        const btn = e.target.closest('.turn-choice');
        if (!btn) return;
        const turn = btn.getAttribute('data-turn');
        if (turn && this.currentNearChourasta && this.onTurnCallback) {
          this.onTurnCallback(turn, this.currentNearChourasta.stationData);
        }
      });
    }
  }

  update(playerPos, playerSteer, playerSpeed, activeChourastas, vehicles, vipCar, currentStation) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    // 1. Radar Glass Background
    const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, cx);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(0.75, '#090d16');
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, cx - 2, 0, Math.PI * 2);
    ctx.fill();

    // Concentric Range Rings
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.lineWidth = 1.5;
    for (const r of [35, 70, 105]) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Crosshairs
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cx, 10); ctx.lineTo(cx, h - 10);
    ctx.moveTo(10, cy); ctx.lineTo(w - 10, cy);
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Rotating Radar Beam Sweep
    this.scanAngle += 0.04;
    const scanGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, cx - 5);
    scanGrad.addColorStop(0, 'rgba(16, 185, 129, 0)');
    scanGrad.addColorStop(1, 'rgba(16, 185, 129, 0.12)');
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, cx - 4, this.scanAngle, this.scanAngle + 0.45);
    ctx.closePath();
    ctx.fillStyle = scanGrad;
    ctx.fill();
    ctx.restore();

    // Map scale: 1 meter = 1.6 pixels on map
    const scale = 1.55;

    // 3. Main Highway (North-South Avenue)
    const roadHalfWidth = 13 * scale; // 26m road
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(cx - roadHalfWidth, 0, roadHalfWidth * 2, h);

    // Footpaths / Sidewalks
    ctx.fillStyle = '#475569';
    ctx.fillRect(cx - roadHalfWidth - 6, 0, 6, h);
    ctx.fillRect(cx + roadHalfWidth, 0, 6, h);

    // White outer road shoulder edge lines
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - roadHalfWidth, 0); ctx.lineTo(cx - roadHalfWidth, h);
    ctx.moveTo(cx + roadHalfWidth, 0); ctx.lineTo(cx + roadHalfWidth, h);
    ctx.stroke();

    // Yellow center lane divider
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(cx, 0); ctx.lineTo(cx, h);
    ctx.stroke();
    ctx.setLineDash([]);

    // Metro Rail line (iconic glowing green MRT-6 viaduct down the center)
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(cx, 0); ctx.lineTo(cx, h);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 4. Intersecting Chourastas (৪-রাস্তার মোড় ও আড়াআড়ি রাস্তা)
    let nearChourasta = null;

    if (activeChourastas && activeChourastas.length > 0) {
      for (const ch of activeChourastas) {
        // Calculate relative Y on map based on playerZ
        // In 3D: player moves to negative Z. Forward is -Z.
        // On map: top is forward (-Z in world, -Y on map relative to player).
        const relZ = ch.z - playerPos.z; // negative means ahead, positive means behind
        const mapY = cy + relZ * scale;

        // If visible within mini-map view range
        if (mapY >= -30 && mapY <= h + 30) {
          // Crossroad surface (72m wide X 22m deep)
          const crossHalfW = 36 * scale;
          const crossHalfH = 11 * scale;

          ctx.fillStyle = '#1e293b';
          ctx.fillRect(cx - crossHalfW, mapY - crossHalfH, crossHalfW * 2, crossHalfH * 2);

          // Crossroad yellow center dashed line
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          ctx.setLineDash([8, 6]);
          ctx.beginPath();
          ctx.moveTo(cx - crossHalfW, mapY); ctx.lineTo(cx - 10, mapY);
          ctx.moveTo(cx + 10, mapY); ctx.lineTo(cx + crossHalfW, mapY);
          ctx.stroke();
          ctx.setLineDash([]);

          // Central Roundabout Island (গোলচত্বর)
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(cx, mapY, 2.3 * scale, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#15803d'; // Green garden inside island
          ctx.beginPath();
          ctx.arc(cx, mapY, 1.8 * scale, 0, Math.PI * 2);
          ctx.fill();

          // Zebra Crossings
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(cx - roadHalfWidth + 2, mapY - crossHalfH - 4, roadHalfWidth * 2 - 4, 3);
          ctx.fillRect(cx - roadHalfWidth + 2, mapY + crossHalfH + 1, roadHalfWidth * 2 - 4, 3);

          // Branch road destination tags on map sides
          ctx.font = 'bold 11px "Hind Siliguri", sans-serif';
          ctx.fillStyle = '#38bdf8'; // Cyan destination
          ctx.textAlign = 'right';
          ctx.fillText('⬅ ' + (ch.stationData?.left?.replace('⬅ ', '') || 'বাম রাস্তা'), cx - crossHalfW + 4, mapY - 4);

          ctx.textAlign = 'left';
          ctx.fillText((ch.stationData?.right?.replace(' ➡', '') || 'ডান রাস্তা') + ' ➡', cx + crossHalfW - 4, mapY - 4);

          // Station Name above roundabout
          ctx.font = 'bold 12px "Hind Siliguri", sans-serif';
          ctx.fillStyle = '#facc15';
          ctx.textAlign = 'center';
          ctx.fillText(ch.stationData?.name || 'চৌরাস্তা', cx, mapY - crossHalfH - 8);

          // Check if player is approaching or inside this Chourasta
          const distAhead = playerPos.z - ch.z;
          if (distAhead > -15 && distAhead < 85) {
            nearChourasta = ch;
          }
        }
      }
    }

    // 5. Dynamic Traffic Blips on Mini-Map
    if (vehicles && vehicles.length > 0) {
      for (const v of vehicles) {
        if (!v.active) continue;
        const relX = (v.group.position.x - playerPos.x) * scale;
        const relZ = (v.group.position.z - playerPos.z) * scale;
        const vx = cx + relX;
        const vy = cy + relZ;

        // Skip blips outside radar circle
        const distFromCenter = Math.sqrt(relX * relX + relZ * relZ);
        if (distFromCenter > cx - 8) continue;

        if (v.isVIP) {
          // Pulsing Red/Gold VIP Convoy Target
          ctx.fillStyle = '#ef4444';
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(vx, vy, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else if (v.isCrossTraffic) {
          // Orange Crossing Vehicle Blip
          ctx.fillStyle = '#f97316';
          ctx.fillRect(vx - 3, vy - 2, 6, 4);
        } else if (v.type === 'cng') {
          // Bright Green CNG Blip
          ctx.fillStyle = '#22c55e';
          ctx.beginPath();
          ctx.arc(vx, vy, 3.2, 0, Math.PI * 2);
          ctx.fill();
        } else if (v.type === 'bus') {
          // Yellow Dhaka Bus Blip (elongated rectangle)
          ctx.fillStyle = '#eab308';
          ctx.fillRect(vx - 2.5, vy - 5, 5, 10);
        } else if (v.type === 'pedestrian') {
          // Cyan Pedestrian Dot
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(vx, vy, 2.2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Gray/White Passenger Car
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(vx - 2.5, vy - 3.5, 5, 7);
        }
      }
    }

    // 6. Player Vehicle Blip (Centered in Map)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(playerSteer * 0.8); // Rotate with vehicle steering angle

    // Headlight Beam Cone
    const lightGrad = ctx.createRadialGradient(0, 0, 4, 0, -32, 28);
    lightGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
    lightGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = lightGrad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-14, -36);
    ctx.lineTo(14, -36);
    ctx.closePath();
    ctx.fill();

    // Easybike Body Polygon (Iconic rickshaw arrowhead)
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(0, -9);     // Front single wheel tip
    ctx.lineTo(5.5, 6.5);   // Right rear
    ctx.lineTo(0, 3.5);     // Rear center indent
    ctx.lineTo(-5.5, 6.5);  // Left rear
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // Glowing core dot
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // 7. Outer Metallic Radar Bezel & Compass 'N' Indicator
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(cx, cy, cx - 2, 0, Math.PI * 2);
    ctx.stroke();

    // North Marker
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('N', cx, 16);

    // 8. Update HTML UI Turn Prompt and Station Banner
    this.currentNearChourasta = nearChourasta;
    if (this.turnPromptEl) {
      if (nearChourasta && nearChourasta.stationData) {
        const sd = nearChourasta.stationData;
        const chKey = `${nearChourasta.z}_${sd.name}`;
        if (this.turnPromptEl.dataset.key !== chKey) {
          this.turnPromptEl.dataset.key = chKey;
          this.turnPromptEl.style.display = 'flex';
          this.turnPromptEl.innerHTML = `
            <button class="turn-choice turn-left" data-turn="left" title="বাঁয়ে মোড় নিন: ${sd.left}">⬅ ${sd.left.replace('⬅ ', '')}</button>
            <div class="turn-choice turn-straight" data-turn="straight">⬆ ${sd.straight.replace(/⬆/g, '').trim()}</div>
            <button class="turn-choice turn-right" data-turn="right" title="ডানে মোড় নিন: ${sd.right}">${sd.right.replace(' ➡', '')} ➡</button>
          `;
        }
      } else {
        if (this.turnPromptEl.style.display !== 'none') {
          this.turnPromptEl.style.display = 'none';
          this.turnPromptEl.dataset.key = '';
        }
      }
    }

    if (this.locationNameEl && currentStation) {
      this.locationNameEl.innerText = currentStation.name || 'ঢাকা এক্সপ্রেসওয়ে';
    }
  }
}
