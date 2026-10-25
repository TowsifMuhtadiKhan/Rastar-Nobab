import { toBengaliNumber } from './Textures.js';

export class HUD {
  constructor(game) {
    this.game = game;
    this.elements = {};
    this.initElements();
  }

  initElements() {
    this.elements.damage = document.getElementById('hud-damage');
    this.elements.speed = document.getElementById('hud-speed');
    this.elements.gear = document.getElementById('hud-gear');
    this.elements.speedoNeedle = document.getElementById('speedo-needle');
    this.elements.speedoArc = document.getElementById('speedo-progress-arc');
    this.elements.pauseBtn = document.getElementById('btn-pause');
    this.elements.batteryFill = document.getElementById('hud-battery-fill');
    this.elements.batteryText = document.getElementById('hud-battery-text');
    this.elements.decibel = document.getElementById('hud-db-value');
    this.elements.wrongWayBadge = document.getElementById('wrong-way-badge');
    this.elements.speechBubble = document.getElementById('speech-bubble');
    this.elements.speechText = document.getElementById('speech-text');

    // Real Dhaka Highway Route Map Elements
    this.elements.routeCurrent = document.getElementById('route-current-station');
    this.elements.routeNext = document.getElementById('route-next-station');
    this.elements.routeProgress = document.getElementById('route-progress-fill');

    // Radar canvas
    this.radarCanvas = document.getElementById('radar-canvas');
    if (this.radarCanvas) {
      this.radarCtx = this.radarCanvas.getContext('2d');
    }

  }

  update(stats, trafficManager, playerPos, mapData) {
    // Throttle DOM reflows to 22 updates/sec (~45ms) to keep 60 FPS WebGL rendering butter-smooth
    const now = performance.now();
    if (this.lastDomTime && (now - this.lastDomTime < 45)) {
      return;
    }
    this.lastDomTime = now;

    // 1. National Damage in Bengali numerals (৳ ৮৫,৬৫০)
    if (this.elements.damage) {
      const formatted = stats.nationalDamage.toLocaleString('en-US');
      this.elements.damage.innerText = `৳ ${toBengaliNumber(formatted)}`;
    }

    // 2. Speed in Bengali numerals & Circular Dial Needle & Arc Sweep
    if (this.elements.speed) {
      const spd = Math.max(0, Math.round(stats.speed));
      this.elements.speed.innerText = toBengaliNumber(spd);

      // Rotate Speedometer Needle (-125deg to +125deg across 0 to 100+ km/h)
      if (this.elements.speedoNeedle) {
        const clampedSpd = Math.min(100, spd);
        const angle = -125 + (clampedSpd / 100) * 250;
        this.elements.speedoNeedle.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
      }

      // Sweep Speedometer Dial Arc
      if (this.elements.speedoArc) {
        // Circumference for r=38 is 2 * PI * 38 = 238.76px. Dial spans ~240deg (~160px)
        const clampedSpd = Math.min(100, spd);
        const arcFill = (clampedSpd / 100) * 160;
        this.elements.speedoArc.style.strokeDasharray = `${arcFill} 300`;

        // Intense neon glow at high speeds
        if (spd >= 65) {
          this.elements.speedoArc.style.stroke = '#38bdf8';
        } else if (spd >= 40) {
          this.elements.speedoArc.style.stroke = '#facc15';
        } else {
          this.elements.speedoArc.style.stroke = '#34d399';
        }
      }

      if (this.elements.gear) {
        if (spd >= 65) {
          this.elements.gear.innerText = '⚡ টার্বো';
          this.elements.gear.style.color = '#38bdf8';
        } else if (spd >= 40) {
          this.elements.gear.innerText = 'গিয়ার ৩';
          this.elements.gear.style.color = '#fde047';
        } else if (spd >= 20) {
          this.elements.gear.innerText = 'গিয়ার ২';
          this.elements.gear.style.color = '#86efac';
        } else {
          this.elements.gear.innerText = 'গিয়ার ১';
          this.elements.gear.style.color = '#cbd5e1';
        }
      }
    }

    // 3. Battery Charge Bar & Text
    if (this.elements.batteryFill && this.elements.batteryText) {
      const batPct = Math.max(0, Math.min(100, Math.round(stats.battery)));
      this.elements.batteryFill.style.width = `${batPct}%`;
      this.elements.batteryText.innerText = `${toBengaliNumber(batPct)}%`;

      if (batPct < 25) {
        this.elements.batteryFill.style.background = '#ef4444';
      } else if (batPct < 55) {
        this.elements.batteryFill.style.background = '#f59e0b';
      } else {
        this.elements.batteryFill.style.background = '#10b981';
      }
    }


    // 5. Real Dhaka Highway Map Stations Tracker
    if (mapData) {
      if (this.elements.routeCurrent && mapData.currentStation) {
        this.elements.routeCurrent.innerText = mapData.currentStation.name;
      }
      if (this.elements.routeNext && mapData.nextStation) {
        this.elements.routeNext.innerText = `পরবর্তী: ${mapData.nextStation.name} (${toBengaliNumber(mapData.distToNext)} মি)`;
      }
      if (this.elements.routeProgress) {
        const pct = Math.min(100, (mapData.totalDistance / 4200) * 100);
        this.elements.routeProgress.style.width = `${pct}%`;
      }
      if (mapData.reachedNewStation) {
        this.showSpeech(`📍 এলাকা অতিক্রম: ${mapData.reachedNewStation.name}! ${mapData.reachedNewStation.tag}`, 'rickshaw', '🛺 নবাব রিকশাওয়ালা');
      }
    }

    // 6. Sound Pollution Decibels
    if (this.elements.decibel) {
      const db = Math.round(stats.decibels);
      this.elements.decibel.innerText = `${toBengaliNumber(db)} dB`;
    }

    // 7. Wrong Way Status
    if (this.elements.wrongWayBadge) {
      this.elements.wrongWayBadge.style.display = stats.isWrongWay ? 'block' : 'none';
    }

    // 8. Render Circular Radar Minimap
    this.renderRadar(trafficManager, playerPos);
  }

  renderRadar(trafficManager, playerPos) {
    if (!this.radarCtx || !this.radarCanvas) return;
    const ctx = this.radarCtx;
    const w = this.radarCanvas.width;
    const h = this.radarCanvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    // Radar background circles
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, 26, 0, Math.PI * 2);
    ctx.stroke();

    // Player position (Center Green Blip)
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Vehicles blips
    const radarRange = 90; // meters
    const scale = 25 / radarRange;

    for (const v of trafficManager.vehicles) {
      if (!v.active) continue;
      const dx = (v.group.position.x - playerPos.x) * 1.5;
      const dz = v.group.position.z - playerPos.z;

      if (Math.abs(dz) < radarRange) {
        const bx = cx + dx * scale;
        const by = cy + dz * scale;

        if (v.isVIP) {
          // Flashing Red VIP Blip
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(bx, by, 4.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (v.type === 'bus') {
          // Yellow Bus Blip
          ctx.fillStyle = '#fbbf24';
          ctx.fillRect(bx - 2, by - 3, 4, 6);
        } else {
          // Normal Traffic Blip
          ctx.fillStyle = '#94a3b8';
          ctx.beginPath();
          ctx.arc(bx, by, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  showSpeech(text, speaker = 'other', role = null) {
    if (!text) return;

    const isRickshaw = (speaker === 'rickshaw' || speaker === 'player' || speaker === 'left');

    if (isRickshaw) {
      // LEFT SIDE: Rickshawala / Nawab
      const dockL = document.getElementById('speech-dock-left');
      const textL = document.getElementById('speech-text-left');
      const nameL = document.getElementById('speech-name-left');
      if (dockL && textL) {
        textL.innerText = text;
        if (nameL && role) nameL.innerText = role;
        dockL.style.display = 'flex';
        // Force reflow for smooth CSS transition
        void dockL.offsetWidth;
        dockL.classList.add('visible');

        if (this.speechTimeoutLeft) clearTimeout(this.speechTimeoutLeft);
        this.speechTimeoutLeft = setTimeout(() => {
          dockL.classList.remove('visible');
          setTimeout(() => {
            if (!dockL.classList.contains('visible')) dockL.style.display = 'none';
          }, 250);
        }, 2600);
      }
    } else {
      // RIGHT SIDE: Other Person (Pedestrian, Police, Bus, CNG, Shopkeeper)
      const dockR = document.getElementById('speech-dock-right');
      const textR = document.getElementById('speech-text-right');
      const nameR = document.getElementById('speech-name-right');
      const iconR = document.getElementById('badge-icon-right');
      if (dockR && textR) {
        textR.innerText = text;
        if (role) {
          if (nameR) nameR.innerText = role;
        } else {
          // Auto detect role from text or fallback
          if (text.includes('সার্জেন্ট') || text.includes('লাইসেন্স') || text.includes('মামলা')) {
            if (iconR) iconR.innerText = '👮‍♂️';
            if (nameR) nameR.innerText = 'ট্রাফিক সার্জেন্ট';
          } else if (text.includes('বাস') || text.includes('মুড়ির টিন')) {
            if (iconR) iconR.innerText = '🚌';
            if (nameR) nameR.innerText = 'বাস ড্রাইভার';
          } else if (text.includes('সিএনজি') || text.includes('মিটার')) {
            if (iconR) iconR.innerText = '🛺';
            if (nameR) nameR.innerText = 'সিএনজি চালক';
          } else if (text.includes('দোকান') || text.includes('চা-বিস্কুট')) {
            if (iconR) iconR.innerText = '🏪';
            if (nameR) nameR.innerText = 'টং দোকানদার';
          } else if (text.includes('খুঁটি') || text.includes('শর্ট সার্কিট')) {
            if (iconR) iconR.innerText = '⚡';
            if (nameR) nameR.innerText = 'বিদ্যুৎ খুঁটি';
          } else {
            if (iconR) iconR.innerText = '😡';
            if (nameR) nameR.innerText = 'পথচারী (পাবলিক)';
          }
        }
        dockR.style.display = 'flex';
        void dockR.offsetWidth;
        dockR.classList.add('visible');

        if (this.speechTimeoutRight) clearTimeout(this.speechTimeoutRight);
        this.speechTimeoutRight = setTimeout(() => {
          dockR.classList.remove('visible');
          setTimeout(() => {
            if (!dockR.classList.contains('visible')) dockR.style.display = 'none';
          }, 250);
        }, 2600);
      }
    }

    // Single center bubble fallback
    if (this.elements.speechBubble && this.elements.speechText) {
      this.elements.speechText.innerText = text;
    }
  }
}
