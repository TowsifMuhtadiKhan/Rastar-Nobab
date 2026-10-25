import * as THREE from 'three';

// Utility helper to convert numbers to Bengali numerals
export function toBengaliNumber(num) {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (d) => bnDigits[Number(d)]);
}

export class TextureFactory {
  // 1. Sleek Polished Bangladeshi Expressway Asphalt Road Texture (1024x1024)
  // Deep charcoal hot-mix tarmac, crisp thermoplastic markings, cat's eyes, highway arrows
  static createDhakaRoadTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // 1. Deep rich charcoal bitumen asphalt base (Authentic BD expressway tarmac)
    ctx.fillStyle = '#1e2126';
    ctx.fillRect(0, 0, 1024, 1024);

    // Subtle fine aggregate & bituminous stone texture (smooth, polished road grain)
    for (let i = 0; i < 28000; i++) {
      const shade = Math.floor(Math.random() * 32 + 24);
      ctx.fillStyle = `rgb(${shade},${shade + 2},${shade + 4})`;
      ctx.fillRect(Math.random() * 1024, Math.random() * 1024, 1.5, 1.5);
    }

    // Gentle realistic wheel-path wear sheen (subtle dark polishing where car tires track)
    const tireTracks = [120, 260, 400, 624, 764, 904];
    for (const tx of tireTracks) {
      const grad = ctx.createLinearGradient(tx - 35, 0, tx + 35, 0);
      grad.addColorStop(0, 'rgba(20, 22, 26, 0)');
      grad.addColorStop(0.5, 'rgba(16, 18, 22, 0.45)');
      grad.addColorStop(1, 'rgba(20, 22, 26, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(tx - 35, 0, 70, 1024);
    }

    // 2. Central Median Yellow Border Lines (Solid Thermoplastic Yellow)
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 12;
    // Left median edge line
    ctx.beginPath();
    ctx.moveTo(466, 0); ctx.lineTo(466, 1024);
    ctx.stroke();
    // Right median edge line
    ctx.beginPath();
    ctx.moveTo(558, 0); ctx.lineTo(558, 1024);
    ctx.stroke();

    // 3. Crisp White Solid Outer Road Shoulder Edge Lines
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 12;
    // Left outer shoulder line
    ctx.beginPath();
    ctx.moveTo(48, 0); ctx.lineTo(48, 1024);
    ctx.stroke();
    // Right outer shoulder line
    ctx.beginPath();
    ctx.moveTo(976, 0); ctx.lineTo(976, 1024);
    ctx.stroke();

    // 4. Crisp White Dashed Lane Divider Lines (3 Lanes Each Direction)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 9;
    ctx.setLineDash([75, 55]);

    // Westbound (Left road) lanes
    ctx.beginPath();
    ctx.moveTo(188, 0); ctx.lineTo(188, 1024);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(328, 0); ctx.lineTo(328, 1024);
    ctx.stroke();

    // Eastbound (Right road) lanes
    ctx.beginPath();
    ctx.moveTo(696, 0); ctx.lineTo(696, 1024);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(836, 0); ctx.lineTo(836, 1024);
    ctx.stroke();
    ctx.setLineDash([]);

    // 5. Signature Bangladeshi Reflective Road Studs ("Cat's Eyes" / ক্যাটস আই)
    // Embedded along lane lines every 130px with reflective glass lenses
    const laneDivs = [188, 328, 696, 836];
    for (const lx of laneDivs) {
      for (let y = 30; y < 1024; y += 130) {
        // Cast aluminum/rubber housing
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(lx - 5, y - 6, 10, 12);
        // Bright reflective white lens
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(lx - 3, y - 4, 6, 8);
        // Specular glow dot
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(lx - 1, y - 2, 2, 4);
      }
    }

    // Amber Cat's Eyes along the yellow median edges
    for (const mx of [466, 558]) {
      for (let y = 60; y < 1024; y += 130) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(mx - 5, y - 6, 10, 12);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(mx - 3, y - 4, 6, 8);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(mx - 1, y - 2, 2, 4);
      }
    }

    // 6. Polished Thermoplastic Directional Lane Arrows
    // Straight Arrow in center lanes (Y = 480)
    for (const ax of [258, 766]) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      // Arrow stem
      ctx.fillRect(ax - 5, 460, 10, 70);
      // Arrow head
      ctx.beginPath();
      ctx.moveTo(ax - 22, 460);
      ctx.lineTo(ax, 415);
      ctx.lineTo(ax + 22, 460);
      ctx.lineTo(ax + 8, 460);
      ctx.lineTo(ax + 8, 480);
      ctx.lineTo(ax - 8, 480);
      ctx.lineTo(ax - 8, 460);
      ctx.closePath();
      ctx.fill();
    }

    // 7. Clean Highway Speed Limit Stencils (৮০ / ৬০ কিমি)
    ctx.save();
    ctx.translate(328, 780);
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = '900 36px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('৮০ কিমি', 0, 0);
    ctx.restore();

    ctx.save();
    ctx.translate(696, 780);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = '900 36px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('৮০ কিমি', 0, 0);
    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  // 2. High-Contrast Black & Yellow Diagonal Striped Curbs (Matching Screenshot Median)
  static createCurbTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Rich yellow base
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(0, 0, 512, 128);

    // Bold diagonal black stripes
    ctx.fillStyle = '#171717';
    const stripeW = 64;
    for (let x = -128; x < 512 + 128; x += stripeW * 2) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + stripeW, 0);
      ctx.lineTo(x + stripeW - 40, 128);
      ctx.lineTo(x - 40, 128);
      ctx.closePath();
      ctx.fill();
    }

    // Weathering grime & concrete chips
    for (let i = 0; i < 3000; i++) {
      const v = Math.floor(Math.random() * 40);
      ctx.fillStyle = `rgba(${v},${v},${v},0.25)`;
      ctx.fillRect(Math.random() * 512, Math.random() * 128, 2, 2);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  // 3. Sidewalk Red Herringbone Brick Pavement Texture
  static createSidewalkTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base terracotta brick mortar
    ctx.fillStyle = '#8b5a45';
    ctx.fillRect(0, 0, 512, 512);

    const bw = 64;
    const bh = 32;

    for (let y = 0; y < 512; y += bh) {
      const offset = (y / bh) % 2 === 0 ? 0 : bw / 2;
      for (let x = -bw; x < 512 + bw; x += bw) {
        // Individual brick color variation
        const shade = Math.floor(Math.random() * 30 - 15);
        ctx.fillStyle = `rgb(${160 + shade}, ${85 + shade}, ${60 + shade})`;
        ctx.fillRect(x + offset + 2, y + 2, bw - 4, bh - 4);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  // 4. Ultra-Authentic "মায়ের দোয়া" Dhaka Bus Texture (Cached)
  static createDhakaBusTexture(variant = 0) {
    if (!this._cachedBusTex) this._cachedBusTex = {};
    if (this._cachedBusTex[variant]) return this._cachedBusTex[variant];

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const isMayerDoa = variant === 0;
    const baseColor = isMayerDoa ? '#eab308' : '#0284c7';
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 1024, 512);

    // Upper roof band
    ctx.fillStyle = isMayerDoa ? '#dc2626' : '#ea580c';
    ctx.fillRect(0, 0, 1024, 90);

    // Lower rocker panel and mudguards
    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 435, 1024, 77);

    // Decorative zigzag folk art pattern along the lower sides
    const zigY = 410;
    for (let x = 0; x < 1024; x += 32) {
      ctx.fillStyle = x % 64 === 0 ? '#ffffff' : (isMayerDoa ? '#16a34a' : '#facc15');
      ctx.beginPath();
      ctx.moveTo(x, zigY);
      ctx.lineTo(x + 16, zigY + 24);
      ctx.lineTo(x + 32, zigY);
      ctx.closePath();
      ctx.fill();
    }

    // Windows with silver frames & safety bars
    const winY = 115;
    const winW = 88;
    const winH = 115;
    for (let i = 0; i < 8; i++) {
      const winX = 135 + i * 105;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(winX, winY, winW, winH);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 5;
      ctx.strokeRect(winX, winY, winW, winH);

      // Window safety bars
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(winX, winY + 40);
      ctx.lineTo(winX + winW, winY + 40);
      ctx.moveTo(winX, winY + 80);
      ctx.lineTo(winX + winW, winY + 80);
      ctx.stroke();

      // Passengers inside
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(winX + 44, winY + 68, 22, 0, Math.PI * 2);
      ctx.fill();
    }

    // Hand-painted Ornate Bengali Bus Typography
    ctx.textAlign = 'center';
    ctx.font = 'bold 58px "Arial Black", "Hind Siliguri", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 9;
    const busTitle = isMayerDoa ? 'মায়ের দোয়া' : 'শিকড় পরিবহন';
    ctx.strokeText(busTitle, 512, 310);
    ctx.fillText(busTitle, 512, 310);

    ctx.font = 'bold 22px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('★ আল্লাহর রহমতে চলিতেছে ★', 512, 58);

    // Route banner strip
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(100, 345, 824, 46);
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 3;
    ctx.strokeRect(100, 345, 824, 46);

    ctx.fillStyle = '#b91c1c';
    ctx.font = 'bold 24px sans-serif';
    const routeText = isMayerDoa
      ? 'মিরপুর ১০ ⇄ ফার্মগেট ⇄ শাহবাগ ⇄ মতিঝিল ⇄ সায়েদাবাদ'
      : 'আব্দুল্লাহপুর ⇄ বিমানবন্দর ⇄ মহাখালী ⇄ গুলিস্তান';
    ctx.fillText(routeText, 512, 377);

    ctx.font = 'bold 18px sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText('দূরত্ব বজায় রাখুন · ১০০ হাত দূরে থাকুন · ঢাকা মেট্রো-ব ১১-৯৮৭৬', 512, 428);

    const tex = new THREE.CanvasTexture(canvas);
    this._cachedBusTex[variant] = tex;
    return tex;
  }

  // 4b. Authentic Dhaka Bus Front Texture (Windshield, destination board, grill & headlights - Cached)
  static createDhakaBusFrontTexture() {
    if (this._cachedBusFrontTex) return this._cachedBusFrontTex;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base body: Golden Dhaka Bus Yellow
    ctx.fillStyle = '#eab308';
    ctx.fillRect(0, 0, 512, 512);

    // Top roof visor & red header band
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(0, 0, 512, 75);

    // Header slogan
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px "Hind Siliguri", sans-serif';
    ctx.fillText('★ আল্লাহ সর্বশক্তিমান ★', 256, 42);

    // Destination Route Board (Above Windshield)
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(60, 82, 392, 44);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.strokeRect(60, 82, 392, 44);

    ctx.fillStyle = '#b91c1c';
    ctx.font = 'bold 22px "Hind Siliguri", sans-serif';
    ctx.fillText('মিরপুর ১০ ⇄ শাহবাগ ⇄ মতিঝিল', 256, 112);

    // Large Front Windshield
    const wsX = 40;
    const wsY = 136;
    const wsW = 432;
    const wsH = 175;

    const winGrad = ctx.createLinearGradient(0, wsY, 0, wsY + wsH);
    winGrad.addColorStop(0, '#1e293b');
    winGrad.addColorStop(0.7, '#0f172a');
    winGrad.addColorStop(1, '#020617');
    ctx.fillStyle = winGrad;
    ctx.fillRect(wsX, wsY, wsW, wsH);

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 6;
    ctx.strokeRect(wsX, wsY, wsW, wsH);

    // Center divider & Windshield Wipers
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(256, wsY);
    ctx.lineTo(256, wsY + wsH);
    // Wipers
    ctx.moveTo(150, wsY + wsH - 10);
    ctx.lineTo(195, wsY + 35);
    ctx.moveTo(350, wsY + wsH - 10);
    ctx.lineTo(395, wsY + 35);
    ctx.stroke();

    // Driver silhouette
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.arc(135, wsY + 115, 26, 0, Math.PI * 2);
    ctx.fill();

    // Decorative Yellow/Green Folk Trim under windshield
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(0, 320, 512, 14);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 334, 512, 6);

    // Massive Heavy-Duty Radiator Grill
    const grX = 110;
    const grY = 355;
    const grW = 292;
    const grH = 75;
    ctx.fillStyle = '#09090b';
    ctx.fillRect(grX, grY, grW, grH);
    ctx.strokeStyle = '#52525b';
    ctx.lineWidth = 4;
    ctx.strokeRect(grX, grY, grW, grH);

    // Vertical chrome slats
    ctx.strokeStyle = '#a1a1aa';
    ctx.lineWidth = 3;
    for (let x = grX + 16; x < grX + grW; x += 18) {
      ctx.beginPath();
      ctx.moveTo(x, grY + 5);
      ctx.lineTo(x, grY + grH - 5);
      ctx.stroke();
    }

    // Dual Round Headlights & Turn Signals
    [
      { x: 62, y: 390 },
      { x: 450, y: 390 }
    ].forEach((light) => {
      // Chrome surround
      ctx.fillStyle = '#71717a';
      ctx.beginPath();
      ctx.arc(light.x, light.y, 30, 0, Math.PI * 2);
      ctx.fill();

      // Bright Headlamp Glass
      const hlGrad = ctx.createRadialGradient(light.x, light.y, 4, light.x, light.y, 25);
      hlGrad.addColorStop(0, '#ffffff');
      hlGrad.addColorStop(0.6, '#fef08a');
      hlGrad.addColorStop(1, '#eab308');
      ctx.fillStyle = hlGrad;
      ctx.beginPath();
      ctx.arc(light.x, light.y, 24, 0, Math.PI * 2);
      ctx.fill();

      // Amber turn signal indicator
      const indX = light.x < 256 ? light.x - 28 : light.x + 28;
      ctx.fillStyle = '#f97316';
      ctx.fillRect(indX - 8, light.y - 18, 16, 36);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.strokeRect(indX - 8, light.y - 18, 16, 36);
    });

    // Bangladesh Green Number Plate in Center
    ctx.fillStyle = '#065f46';
    ctx.fillRect(176, 442, 160, 42);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(176, 442, 160, 42);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('ঢাকা মেট্রো-ব', 256, 459);
    ctx.font = 'bold 17px sans-serif';
    ctx.fillText('১১-৪৫২০', 256, 478);

    // Heavy Metal Lower Bumper
    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 490, 512, 22);

    const tex = new THREE.CanvasTexture(canvas);
    this._cachedBusFrontTex = tex;
    return tex;
  }

  // 4c. Authentic Dhaka Bus Rear Texture ("দূরত্ব বজায় রাখুন", tail lights, hazard warning - Cached)
  static createDhakaBusRearTexture() {
    if (this._cachedBusRearTex) return this._cachedBusRearTex;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base body: Golden Dhaka Bus Yellow
    ctx.fillStyle = '#eab308';
    ctx.fillRect(0, 0, 512, 512);

    // Top roof red header band
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(0, 0, 512, 60);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px "Hind Siliguri", sans-serif';
    ctx.fillText('★ মায়ের দোয়া ★', 256, 38);

    // Small Rear Window with metal safety bars
    const rwX = 70;
    const rwY = 75;
    const rwW = 372;
    const rwH = 110;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(rwX, rwY, rwW, rwH);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 5;
    ctx.strokeRect(rwX, rwY, rwW, rwH);

    // Safety bars
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2.5;
    for (let x = rwX + 30; x < rwX + rwW; x += 35) {
      ctx.beginPath();
      ctx.moveTo(x, rwY);
      ctx.lineTo(x, rwY + rwH);
      ctx.stroke();
    }

    // Iconic Bengali Rear Slogan: "দূরত্ব বজায় রাখুন"
    ctx.font = 'bold 36px "Hind Siliguri", "Arial Black", sans-serif';
    ctx.fillStyle = '#dc2626';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    ctx.strokeText('দূরত্ব বজায় রাখুন', 256, 235);
    ctx.fillText('দূরত্ব বজায় রাখুন', 256, 235);

    // Second Slogan: "১০০ হাত দূরে থাকুন"
    ctx.font = 'bold 24px "Hind Siliguri", sans-serif';
    ctx.fillStyle = '#000000';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.strokeText('★ ১০০ হাত দূরে থাকুন ★ হর্ন দিন ★', 256, 280);
    ctx.fillText('★ ১০০ হাত দূরে থাকুন ★ হর্ন দিন ★', 256, 280);

    // Red and Yellow Diagonal Safety Hazard Striping
    const hazY = 320;
    const hazH = 34;
    ctx.fillStyle = '#facc15';
    ctx.fillRect(0, hazY, 512, hazH);
    ctx.fillStyle = '#dc2626';
    for (let x = -40; x < 550; x += 36) {
      ctx.beginPath();
      ctx.moveTo(x, hazY);
      ctx.lineTo(x + 18, hazY);
      ctx.lineTo(x - 4, hazY + hazH);
      ctx.lineTo(x - 22, hazY + hazH);
      ctx.closePath();
      ctx.fill();
    }

    // Rear Brake / Tail Lights (Left & Right vertical stacks)
    [
      { x: 45, y: 385 },
      { x: 435, y: 385 }
    ].forEach((light) => {
      // Housing
      ctx.fillStyle = '#18181b';
      ctx.fillRect(light.x, light.y - 20, 32, 70);
      ctx.strokeStyle = '#52525b';
      ctx.lineWidth = 2;
      ctx.strokeRect(light.x, light.y - 20, 32, 70);

      // Red Brake Light
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(light.x + 4, light.y - 16, 24, 20);

      // Amber Indicator
      ctx.fillStyle = '#f97316';
      ctx.fillRect(light.x + 4, light.y + 7, 24, 18);

      // White Reverse Light
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(light.x + 4, light.y + 28, 24, 16);
    });

    // Bangladesh Green Number Plate
    ctx.fillStyle = '#065f46';
    ctx.fillRect(176, 380, 160, 46);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(176, 380, 160, 46);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('ঢাকা মেট্রো-ব', 256, 400);
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('১১-৪৫২০', 256, 420);

    // Mudflaps with Bengali typography
    ctx.fillStyle = '#09090b';
    ctx.fillRect(30, 445, 120, 67);
    ctx.fillRect(362, 445, 120, 67);

    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('টাটা', 90, 485);
    ctx.fillText('টাটা', 422, 485);

    const tex = new THREE.CanvasTexture(canvas);
    this._cachedBusRearTex = tex;
    return tex;
  }

  // 11b. Multistory Dhaka Building Facade Texture
  static createDhakaBrickBuildingTexture(variant = 0) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base wall color: Terracotta brick or Sandstone plaster
    const baseColor = variant === 0 ? '#8b2e1e' : '#733126';
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 512, 512);

    // Weathered brick mortar lines
    ctx.strokeStyle = variant === 0 ? '#632014' : '#572218';
    ctx.lineWidth = 2;
    for (let y = 0; y < 512; y += 16) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();

      const offset = (y / 16) % 2 === 0 ? 0 : 16;
      for (let x = offset; x < 512; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + 16);
        ctx.stroke();
      }
    }

    // Windows with glass reflection and frames
    const cols = 4;
    const rows = 6;
    const padX = 36;
    const padY = 32;
    const winW = 60;
    const winH = 48;
    const gapX = (512 - padX * 2 - cols * winW) / (cols - 1);
    const gapY = (512 - padY * 2 - rows * winH) / (rows - 1);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const wx = padX + c * (winW + gapX);
        const wy = padY + r * (winH + gapY);

        // Concrete lintel header
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(wx - 4, wy - 6, winW + 8, 5);

        // Window frame
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(wx, wy, winW, winH);

        // Glass pane
        ctx.fillStyle = (r + c) % 3 === 0 ? '#0284c7' : '#0f172a';
        ctx.fillRect(wx + 3, wy + 3, winW - 6, winH - 6);

        // White reflection streak
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.beginPath();
        ctx.moveTo(wx + 4, wy + winH - 4);
        ctx.lineTo(wx + 20, wy + winH - 4);
        ctx.lineTo(wx + winW - 4, wy + 4);
        ctx.lineTo(wx + winW - 20, wy + 4);
        ctx.closePath();
        ctx.fill();

        // Window sill
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(wx - 4, wy + winH, winW + 8, 4);

        // Occasional AC outdoor unit bracket under window
        if ((r * 2 + c) % 4 === 1) {
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(wx + 8, wy + winH + 5, 34, 20);
          ctx.fillStyle = '#94a3b8';
          ctx.fillRect(wx + 30, wy + winH + 8, 9, 14); // fan vent
        }
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  // 5. Metro Rail Pillar with Authentic Dhaka Posters (Matching Screenshot)
  static createMetroPillarTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Concrete pillar gray
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(0, 0, 512, 1024);

    for (let i = 0; i < 12000; i++) {
      const v = Math.random() * 50 - 25;
      const g = Math.floor(158 + v);
      ctx.fillStyle = `rgb(${g},${g},${g})`;
      ctx.fillRect(Math.random() * 512, Math.random() * 1024, 3, 5);
    }

    // Metro Rail Roundel Logo
    ctx.fillStyle = '#006a4e';
    ctx.beginPath();
    ctx.arc(256, 120, 55, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f42a41';
    ctx.beginPath();
    ctx.arc(256, 120, 32, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MRT-6', 256, 205);
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('PILLAR #142', 256, 235);

    // Exact Posters from Dhaka Streets:
    // 1. জ্বীনের বাদশা
    ctx.fillStyle = '#14532d';
    ctx.fillRect(40, 310, 210, 190);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 310, 210, 190);
    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('জ্বীনের বাদশা', 145, 345);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('প্রেম, বিয়ে, ব্যবসা,', 145, 380);
    ctx.fillText('সকল সমস্যার সমাধান', 145, 405);
    ctx.fillStyle = '#fef08a';
    ctx.fillText('১০০% গ্যারান্টি', 145, 440);
    ctx.fillStyle = '#fff';
    ctx.font = '13px sans-serif';
    ctx.fillText('০১৭১১-XXXXXX', 145, 475);

    // 2. অর্শ, গেজ... বিনা অপারেশনে চিকিৎসা
    ctx.fillStyle = '#fef2f2';
    ctx.fillRect(270, 310, 205, 175);
    ctx.strokeStyle = '#dc2626';
    ctx.strokeRect(270, 310, 205, 175);
    ctx.fillStyle = '#b91c1c';
    ctx.font = 'bold 21px sans-serif';
    ctx.fillText('অর্শ, গেজ', 372, 345);
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('বিনা অপারেশনে', 372, 380);
    ctx.fillText('চিকিৎসা', 372, 405);
    ctx.fillStyle = '#dc2626';
    ctx.font = '13px sans-serif';
    ctx.fillText('ভেষজ ঔষধ সেবন করুন', 372, 440);

    // 3. বিদেশ যেতে চান?
    ctx.fillStyle = '#f0f9ff';
    ctx.fillRect(270, 510, 205, 170);
    ctx.strokeStyle = '#0284c7';
    ctx.strokeRect(270, 510, 205, 170);
    ctx.fillStyle = '#0369a1';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('বিদেশ যেতে চান?', 372, 545);
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('ইউরোপ, কানাডা, রোমানিয়া', 372, 580);
    ctx.fillText('দ্রুত ভিসা প্রসেসিং', 372, 605);
    ctx.fillStyle = '#dc2626';
    ctx.fillText('ভিসার পর টাকা দিন', 372, 640);

    // 4. স্পোকেন ইংলিশ
    ctx.fillStyle = '#fefce8';
    ctx.fillRect(40, 520, 210, 160);
    ctx.strokeStyle = '#eab308';
    ctx.strokeRect(40, 520, 210, 160);
    ctx.fillStyle = '#c2410c';
    ctx.font = 'bold 21px sans-serif';
    ctx.fillText('স্পোকেন ইংলিশ', 145, 555);
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('৩০ দিনে গ্যারান্টি!', 145, 590);
    ctx.fillText('সাইফুরস মেথড', 145, 615);

    // 5. রাস্তা কি আপনার বাপের?!
    ctx.fillStyle = '#18181b';
    ctx.fillRect(50, 710, 412, 110);
    ctx.fillStyle = '#22d3ee';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('রাস্তা কি আপনার বাপের?!', 256, 750);
    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 17px sans-serif';
    ctx.fillText('উল্টাপথে গাড়ি চালানো দণ্ডনীয় অপরাধ', 256, 785);

    return new THREE.CanvasTexture(canvas);
  }



  // 6. Decorated Back Tin Art Plate for Rickshaw (Matching Screenshot)
  static createRickshawArtPlate() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 384;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 512, 384);
    grad.addColorStop(0, '#f59e0b');
    grad.addColorStop(0.5, '#ec4899');
    grad.addColorStop(1, '#06b6d4');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 384);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 10;
    ctx.strokeRect(10, 10, 492, 364);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.strokeRect(18, 18, 476, 348);

    for (let i = 0; i < 512; i += 24) {
      ctx.fillStyle = (i / 24) % 2 === 0 ? '#06b6d4' : '#facc15';
      ctx.beginPath();
      ctx.arc(i + 12, 14, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(i + 12, 370, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(256, 175, 75, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0f766e';
    ctx.beginPath();
    ctx.ellipse(256, 185, 45, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    for (let a = -Math.PI * 0.85; a <= -Math.PI * 0.15; a += 0.2) {
      const fx = 256 + Math.cos(a) * 75;
      const fy = 180 + Math.sin(a) * 60;
      ctx.strokeStyle = '#db2777';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(256, 180);
      ctx.lineTo(fx, fy);
      ctx.stroke();

      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(fx, fy, 7, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 7;
    ctx.font = 'bold 44px "Arial Black", "Hind Siliguri", sans-serif';
    ctx.strokeText('বাপের রাস্তা', 256, 85);
    ctx.fillText('বাপের রাস্তা', 256, 85);

    ctx.font = 'bold 22px "Arial Black", sans-serif';
    ctx.fillStyle = '#fde047';
    ctx.strokeText('★ দেশি টেসলা সাইবার-রিকশা ★', 256, 285);
    ctx.fillText('★ দেশি টেসলা সাইবার-রিকশা ★', 256, 285);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(90, 310, 332, 46);
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 3;
    ctx.strokeRect(90, 310, 332, 46);
    ctx.fillStyle = '#047857';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('ঢাকা মেট্রো-থ ১১-৮৮২২', 256, 343);

    return new THREE.CanvasTexture(canvas);
  }



  // 7. Black VIP Police / Prado Livery (Cached)
  static createVIPPradoTexture() {
    if (this._cachedVIPPradoTex) return this._cachedVIPPradoTex;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#090a0f';
    ctx.fillRect(0, 0, 512, 256);

    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(0, 160, 512, 10);

    ctx.fillStyle = '#020617';
    ctx.fillRect(40, 30, 432, 110);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 30, 432, 110);

    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(256, 185, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('VIP', 256, 191);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('গণপ্রজাতন্ত্রী বাংলাদেশ সরকার', 256, 230);

    const tex = new THREE.CanvasTexture(canvas);
    this._cachedVIPPradoTex = tex;
    return tex;
  }

  // 8. White Toyota HiAce Microbus Livery (Cached)
  static createHiAceTexture() {
    if (this._cachedHiAceTex) return this._cachedHiAceTex;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, 512, 256);

    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, 160, 512, 16);

    ctx.fillStyle = '#64748b';
    ctx.fillRect(0, 178, 512, 8);

    const winW = 85;
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(40 + i * 110, 45, winW, 95);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.strokeRect(40 + i * 110, 45, winW, 95);
    }

    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(485, 120, 25, 45);

    const tex = new THREE.CanvasTexture(canvas);
    this._cachedHiAceTex = tex;
    return tex;
  }



  // 9. Green CNG Auto-Rickshaw Wire Mesh Livery (Cached)
  static createCNGTexture() {
    return this.createCNGSideTexture();
  }

  static createCNGSideTexture() {
    if (this._cachedCNGSideTex) return this._cachedCNGSideTex;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 320;
    const ctx = canvas.getContext('2d');

    // Rich Dhaka Green Paint
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(0, 0, 512, 320);

    // Yellow Accent Stripe
    ctx.fillStyle = '#facc15';
    ctx.fillRect(0, 160, 512, 32);

    // Dark Door Frame & Passenger Cage Cutout
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(140, 20, 280, 130);

    // Passenger Silhouette inside Cage
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.arc(230, 80, 24, 0, Math.PI * 2);
    ctx.arc(330, 80, 24, 0, Math.PI * 2);
    ctx.fill();

    // Iconic Iron Wire Mesh Grill on Passenger Window
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2.5;
    for (let x = 140; x <= 420; x += 18) {
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, 150);
      ctx.stroke();
    }
    for (let y = 20; y <= 150; y += 22) {
      ctx.beginPath();
      ctx.moveTo(140, y);
      ctx.lineTo(420, y);
      ctx.stroke();
    }

    // Driver Front Window opening
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(20, 30, 95, 115);

    // License Registration Plate
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(160, 220, 220, 50);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 3;
    ctx.strokeRect(160, 220, 220, 50);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px "Hind Siliguri", sans-serif';
    ctx.fillText('ঢাকা মেট্রো-থ ১২-৩৪৫৬', 270, 255);

    // Fare Meter Graphic
    ctx.fillStyle = '#18181b';
    ctx.fillRect(30, 180, 75, 45);
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('৳ ৮০.০০', 67, 208);

    const tex = new THREE.CanvasTexture(canvas);
    this._cachedCNGSideTex = tex;
    return tex;
  }

  static createCNGRearTexture() {
    if (this._cachedCNGRearTex) return this._cachedCNGRearTex;

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Green rear engine hatch
    ctx.fillStyle = '#15803d';
    ctx.fillRect(0, 0, 256, 256);

    // Engine Ventilation Louvers (কালো গ্রিল ভেন্ট)
    ctx.fillStyle = '#0f172a';
    for (let y = 40; y < 140; y += 14) {
      ctx.fillRect(35, y, 186, 7);
    }

    // Slogan Plate: "মিটার চলে না মামা!"
    ctx.fillStyle = '#facc15';
    ctx.fillRect(30, 155, 196, 42);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(30, 155, 196, 42);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 18px "Hind Siliguri", sans-serif';
    ctx.fillText('মিটার চলে না মামা!', 128, 183);

    // Number Plate
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(45, 206, 166, 32);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px "Hind Siliguri", sans-serif';
    ctx.fillText('ঢাকা মেট্রো-থ ১১-৯৮৭৬', 128, 228);

    // Red Tail lights
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(15, 190, 22, 45);
    ctx.fillRect(219, 190, 22, 45);

    const tex = new THREE.CanvasTexture(canvas);
    this._cachedCNGRearTex = tex;
    return tex;
  }

  // 10. Striped Canvas Awning (Canopy)
  static createShopCanopyTexture(color = '#c62828') {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const stripeW = 32;
    for (let x = 0; x < 256; x += stripeW) {
      ctx.fillStyle = (x / stripeW) % 2 === 0 ? color : '#ffffff';
      ctx.fillRect(x, 0, stripeW, 256);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  // 11. Ground Level Shop Signs
  static createShopfrontTexture(type = 0) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#64748b';
    ctx.fillRect(0, 110, 512, 146);
    for (let y = 110; y < 256; y += 12) {
      ctx.fillStyle = y % 24 === 0 ? '#475569' : '#94a3b8';
      ctx.fillRect(0, y, 512, 8);
    }

    if (type === 0) {
      ctx.fillStyle = '#047857';
      ctx.fillRect(0, 0, 512, 110);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px "Hind Siliguri", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('জ্ঞানবিতান বুক ডিপো', 256, 50);
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('স্কুল, কলেজ ও বিশ্ববিদ্যালয় পাঠ্যবই', 256, 85);
    } else if (type === 1) {
      ctx.fillStyle = '#1d4ed8';
      ctx.fillRect(0, 0, 512, 110);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px "Hind Siliguri", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('জনসেবা ফার্মেসী', 256, 50);
      ctx.fillStyle = '#4ade80';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('২৪ ঘণ্টা খোলা · দেশি-বিদেশি ঔষধ', 256, 85);
    } else {
      ctx.fillStyle = '#c2410c';
      ctx.fillRect(0, 0, 512, 110);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px "Hind Siliguri", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('মায়ের দোয়া টি স্টল', 256, 50);
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('ফ্লেক্সিলোড · বিকাশ · স্পেশাল দুধ চা', 256, 85);
    }

    const tex = new THREE.CanvasTexture(canvas);
    this._cachedCNGTex = tex;
    return tex;
  }



  // 12. Realistic Bangladeshi Taka Notes
  static createTakaNoteTexture(value = 500) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    let baseColor = '#15803d';
    let label = '৫০০';
    let numLabel = '500';

    if (value === 1000) {
      baseColor = '#86198f';
      label = '১০০০';
      numLabel = '1000';
    } else if (value === 2000) {
      baseColor = '#b45309';
      label = '২০০০';
      numLabel = '2000';
    }

    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 512, 256);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.strokeRect(12, 12, 488, 232);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.arc(100, 128, 65, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('বাংলাদেশ ব্যাংক', 290, 50);

    ctx.font = 'bold 64px "Arial Black", sans-serif';
    ctx.fillStyle = '#fef08a';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.strokeText(`৳ ${label}`, 310, 150);
    ctx.fillText(`৳ ${label}`, 310, 150);

    ctx.textAlign = 'left';
    ctx.font = 'bold 36px "Arial Black", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(numLabel, 30, 60);

    const tex = new THREE.CanvasTexture(canvas);
    this._cachedCNGTex = tex;
    return tex;
  }



  // 6c. Authentic Bangladeshi Easybike Rear Tapestry (Matching User Photo 1)
  // Psychedelic camo + Gold tassel diamond frame + Red pom-pom flowers + Faux leather
  static createEasybikeRearTapestry() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // 1. Lower half: Orange-brown faux leather panel
    ctx.fillStyle = '#b45309';
    ctx.fillRect(0, 260, 512, 252);
    // Leather texture grain
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    for (let i = 0; i < 4000; i++) {
      ctx.fillRect(Math.random() * 512, 260 + Math.random() * 252, 2, 2);
    }
    // Leather quilted horizontal seams
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 310); ctx.lineTo(512, 310);
    ctx.stroke();

    // Chrome rivets along the seam
    for (let x = 20; x < 512; x += 36) {
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.arc(x, 264, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.arc(x + 1, 265, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Iconic Vehicle Slogan Signboard: "Ami choto amk marben na"
    const plateX = 28;
    const plateY = 328;
    const plateW = 456;
    const plateH = 148;

    // Dark high-contrast board background with double border
    ctx.fillStyle = '#09090b';
    ctx.fillRect(plateX, plateY, plateW, plateH);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 6;
    ctx.strokeRect(plateX, plateY, plateW, plateH);

    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 3;
    ctx.strokeRect(plateX + 6, plateY + 6, plateW - 12, plateH - 12);

    // Decorative corner bolts
    [
      [plateX + 12, plateY + 12],
      [plateX + plateW - 12, plateY + 12],
      [plateX + 12, plateY + plateH - 12],
      [plateX + plateW - 12, plateY + plateH - 12]
    ].forEach(([bx, by]) => {
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.arc(bx, by, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Top banner: বাপের রাস্তা (BAPER RASTA)
    ctx.fillStyle = '#171717';
    ctx.fillRect(plateX + 10, plateY + 10, plateW - 20, 38);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.strokeRect(plateX + 10, plateY + 10, plateW - 20, 38);

    ctx.textAlign = 'center';
    ctx.font = '900 28px "Hind Siliguri", "Arial Black", sans-serif';
    ctx.fillStyle = '#fef08a';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.strokeText('❤ বাপের রাস্তা ❤', 256, plateY + 38);
    ctx.fillText('❤ বাপের রাস্তা ❤', 256, plateY + 38);

    // Bottom yellow banner: "সুপারহিট! চলিতেছে প্রমোদে নয়না আপনার টাকা"
    ctx.fillStyle = '#facc15';
    ctx.fillRect(plateX + 10, plateY + 62, plateW - 20, 74);
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2;
    ctx.strokeRect(plateX + 10, plateY + 62, plateW - 20, 74);

    ctx.font = '900 24px "Hind Siliguri", "Arial Black", sans-serif';
    ctx.fillStyle = '#dc2626';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.strokeText('✿ সুপারহিট! ✿', 256, plateY + 92);
    ctx.fillText('✿ সুপারহিট! ✿', 256, plateY + 92);

    ctx.font = 'bold 14px "Hind Siliguri", sans-serif';
    ctx.fillStyle = '#000000';
    ctx.fillText('চলিতেছে প্রমোদে নয়না আপনার টাকা', 256, plateY + 120);

    // 2. Upper arched canopy: Psychedelic Camo Fabric (Image 1 match)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(20, 260);
    ctx.lineTo(20, 160);
    ctx.bezierCurveTo(30, 10, 482, 10, 492, 160);
    ctx.lineTo(492, 260);
    ctx.closePath();
    ctx.clip();

    // Base bright magenta-pink
    ctx.fillStyle = '#ec4899';
    ctx.fillRect(0, 0, 512, 260);

    // Neon Green, Yellow, Blue, Black camo patches
    const camoColors = ['#22c55e', '#facc15', '#0284c7', '#18181b', '#a855f7'];
    const blobs = [
      { x: 80, y: 80, rx: 55, ry: 40, rot: 0.4, c: 0 },
      { x: 180, y: 50, rx: 70, ry: 35, rot: -0.3, c: 1 },
      { x: 340, y: 70, rx: 80, ry: 45, rot: 0.6, c: 2 },
      { x: 440, y: 110, rx: 60, ry: 35, rot: -0.5, c: 3 },
      { x: 120, y: 160, rx: 75, ry: 45, rot: 0.2, c: 1 },
      { x: 260, y: 130, rx: 90, ry: 50, rot: -0.1, c: 0 },
      { x: 400, y: 180, rx: 70, ry: 40, rot: 0.5, c: 3 },
      { x: 200, y: 220, rx: 85, ry: 45, rot: 0.3, c: 2 },
      { x: 330, y: 230, rx: 80, ry: 40, rot: -0.4, c: 1 },
      { x: 60, y: 230, rx: 50, ry: 30, rot: 0.1, c: 3 },
      { x: 460, y: 220, rx: 55, ry: 35, rot: 0.7, c: 0 }
    ];

    for (const b of blobs) {
      ctx.fillStyle = camoColors[b.c];
      ctx.beginPath();
      ctx.ellipse(b.x, b.y, b.rx, b.ry, b.rot, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Iconic Center Diamond Window with Golden Yellow Fringe (ঝালর)
    const cx = 256;
    const cy = 150;
    const dw = 110;
    const dh = 110;

    // Diamond yellow fringe
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(cx, cy - dh);
    ctx.lineTo(cx + dw, cy);
    ctx.lineTo(cx, cy + dh);
    ctx.lineTo(cx - dw, cy);
    ctx.closePath();
    ctx.stroke();

    // Fringe texture lines
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 1.5;
    for (let t = -dw; t <= dw; t += 6) {
      const topY = cy - dh * (1 - Math.abs(t / dw));
      ctx.beginPath();
      ctx.moveTo(cx + t, topY - 10);
      ctx.lineTo(cx + t, topY + 5);
      ctx.stroke();

      const botY = cy + dh * (1 - Math.abs(t / dw));
      ctx.beginPath();
      ctx.moveTo(cx + t, botY - 5);
      ctx.lineTo(cx + t, botY + 10);
      ctx.stroke();
    }

    // Inner diamond frame
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.moveTo(cx, cy - dh + 14);
    ctx.lineTo(cx + dw - 14, cy);
    ctx.lineTo(cx, cy + dh - 14);
    ctx.lineTo(cx - dw + 14, cy);
    ctx.closePath();
    ctx.fill();

    // Center scenic reflection in the diamond window
    ctx.fillStyle = '#bae6fd';
    ctx.beginPath();
    ctx.moveTo(cx, cy - dh + 24);
    ctx.lineTo(cx + dw - 24, cy);
    ctx.lineTo(cx, cy + dh - 24);
    ctx.lineTo(cx - dw + 24, cy);
    ctx.closePath();
    ctx.fill();

    // Dhaka scenic silhouette inside diamond window (palm trees & sunset)
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(cx, cy - 10, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#047857';
    ctx.beginPath();
    ctx.moveTo(cx - 30, cy + 30);
    ctx.lineTo(cx, cy + 5);
    ctx.lineTo(cx + 30, cy + 30);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // 4. Arched Top Golden Yellow Fringe Border
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.moveTo(20, 160);
    ctx.bezierCurveTo(30, 10, 482, 10, 492, 160);
    ctx.stroke();

    // Golden fringe tassel strands along the arch
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2;
    for (let a = 0; a <= Math.PI; a += 0.04) {
      const fx = 256 - Math.cos(a) * 225;
      const fy = 145 - Math.sin(a) * 125;
      ctx.beginPath();
      ctx.moveTo(fx, fy - 6);
      ctx.lineTo(fx, fy + 14);
      ctx.stroke();
    }

    // 5. Red Pom-Pom Flowers (লাল ফুল) along the top arch rim (Image 1 match)
    for (let a = 0.15; a <= Math.PI - 0.15; a += 0.35) {
      const px = 256 - Math.cos(a) * 230;
      const py = 140 - Math.sin(a) * 130;
      // Flower petals
      ctx.fillStyle = '#dc2626';
      for (let p = 0; p < 5; p++) {
        const ang = (p / 5) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(px + Math.cos(ang) * 9, py + Math.sin(ang) * 9, 7, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    this._cachedCNGTex = tex;
    return tex;
  }



  // 6d. Bangladeshi Auto-Rickshaw Cushioned Seat Livery (Image 2 Match)
  // Royal blue with dynamic white & cyan diagonal racing stripes/wedges
  static createEasybikeCushionTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Royal Blue Base
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(0, 0, 512, 512);

    // Diagonal geometric panels
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, 180);
    ctx.lineTo(240, 0);
    ctx.lineTo(340, 0);
    ctx.lineTo(0, 260);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(0, 280);
    ctx.lineTo(370, 0);
    ctx.lineTo(440, 0);
    ctx.lineTo(0, 330);
    ctx.closePath();
    ctx.fill();

    // Symmetric repeat on right
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(512, 180);
    ctx.lineTo(272, 0);
    ctx.lineTo(172, 0);
    ctx.lineTo(512, 260);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(512, 280);
    ctx.lineTo(142, 0);
    ctx.lineTo(72, 0);
    ctx.lineTo(512, 330);
    ctx.closePath();
    ctx.fill();

    // Subtle vinyl leather grain
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    for (let i = 0; i < 3000; i++) {
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }

    // Perimeter seam piping
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, 502, 502);

    const tex = new THREE.CanvasTexture(canvas);
    this._cachedCNGTex = tex;
    return tex;
  }



  // 6e. Battery Compartment Ventilation Louvers Texture (Image 2 Match)
  static createEasybikeBatteryVentTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Deep Bangladeshi Transport Green
    ctx.fillStyle = '#047857';
    ctx.fillRect(0, 0, 512, 256);

    // Subtle metallic brush lines
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    for (let y = 0; y < 256; y += 4) {
      ctx.fillRect(0, y, 512, 1);
    }

    // Rows of Stamped Ventilation Slots (horizontal louvers)
    for (let row = 0; row < 3; row++) {
      const y = 45 + row * 60;
      for (let col = 0; col < 6; col++) {
        const x = 50 + col * 72;
        // Shadow cut
        ctx.fillStyle = '#022c22';
        ctx.fillRect(x, y, 48, 14);
        // Highlight ridge
        ctx.fillStyle = '#34d399';
        ctx.fillRect(x, y + 11, 48, 3);
      }
    }

    // Rivet studs
    for (let x = 20; x < 512; x += 60) {
      ctx.fillStyle = '#a7f3d0';
      ctx.beginPath();
      ctx.arc(x, 18, 4, 0, Math.PI * 2);
      ctx.arc(x, 238, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    this._cachedCNGTex = tex;
    return tex;
  }



  // 6f. Rear Mudflap Texture (SANDI STOP - Image 1 Match)
  static createEasybikeMudflapTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 320;
    const ctx = canvas.getContext('2d');

    // Heavy black rubber
    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, 256, 320);

    // Rubber border ribbing
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, 246, 310);

    // Gold SANDI winged logo & STOP text
    ctx.fillStyle = '#f59e0b';
    ctx.textAlign = 'center';

    // Wings
    ctx.beginPath();
    ctx.moveTo(128, 90);
    ctx.bezierCurveTo(90, 70, 50, 95, 40, 110);
    ctx.bezierCurveTo(60, 105, 100, 98, 128, 105);
    ctx.bezierCurveTo(156, 98, 196, 105, 216, 110);
    ctx.bezierCurveTo(206, 95, 166, 70, 128, 90);
    ctx.fill();

    // SANDI
    ctx.font = '900 32px sans-serif';
    ctx.fillText('SANDI', 128, 145);

    // STOP
    ctx.fillStyle = '#d97706';
    ctx.font = '900 24px sans-serif';
    ctx.fillText('STOP', 128, 185);

    // Ridges at bottom of flap
    ctx.fillStyle = '#27272a';
    for (let y = 230; y < 310; y += 16) {
      ctx.fillRect(20, y, 216, 6);
    }

    const tex = new THREE.CanvasTexture(canvas);
    this._cachedCNGTex = tex;
    return tex;
  }

  // 6g. Easybike Rear Bumper Slogan Plate ("রাস্তার নবাব / Ami choto amk marben na" - Cached)
  static createEasybikeBumperPlateTexture() {
    if (this._cachedBumperPlateTex) return this._cachedBumperPlateTex;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // High-visibility yellow background with black hazard border
    ctx.fillStyle = '#facc15';
    ctx.fillRect(0, 0, 512, 128);

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 6;
    ctx.strokeRect(4, 4, 504, 120);

    // Hazard chevrons on ends
    ctx.fillStyle = '#000000';
    for (let x = 6; x < 60; x += 18) {
      ctx.beginPath();
      ctx.moveTo(x, 6);
      ctx.lineTo(x + 10, 6);
      ctx.lineTo(x + 2, 122);
      ctx.lineTo(x - 8, 122);
      ctx.closePath();
      ctx.fill();
    }
    for (let x = 450; x < 500; x += 18) {
      ctx.beginPath();
      ctx.moveTo(x, 6);
      ctx.lineTo(x + 10, 6);
      ctx.lineTo(x + 2, 122);
      ctx.lineTo(x - 8, 122);
      ctx.closePath();
      ctx.fill();
    }

    ctx.textAlign = 'center';
    // Bengali top: রাস্তার নবাব (RASTAR NOBAB)
    ctx.font = 'bold 24px "Hind Siliguri", sans-serif';
    ctx.fillStyle = '#b91c1c';
    ctx.fillText('★ রাস্তার নবাব · RASTAR NOBAB ★', 256, 44);

    // English / Banglish bottom: Ami choto amk marben na
    ctx.font = '900 30px "Arial Black", sans-serif';
    ctx.fillStyle = '#000000';
    ctx.fillText('Ami choto amk marben na', 256, 96);

    const tex = new THREE.CanvasTexture(canvas);
    this._cachedBumperPlateTex = tex;
    return tex;
  }


  // 36. Perpendicular Crossroad Asphalt Texture (1024x512) for Chourasta 4-way intersection
  static createCrossroadTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Dark charcoal hot-mix bitumen base
    ctx.fillStyle = '#1e2126';
    ctx.fillRect(0, 0, 1024, 512);

    // Fine aggregate asphalt speckles
    for (let i = 0; i < 14000; i++) {
      const shade = Math.floor(Math.random() * 32 + 24);
      ctx.fillStyle = `rgb(${shade},${shade + 2},${shade + 4})`;
      ctx.fillRect(Math.random() * 1024, Math.random() * 512, 1.5, 1.5);
    }

    // Horizontal tire wear marks
    const tireYs = [90, 160, 350, 420];
    for (const ty of tireYs) {
      const grad = ctx.createLinearGradient(0, ty - 25, 0, ty + 25);
      grad.addColorStop(0, 'rgba(20, 22, 26, 0)');
      grad.addColorStop(0.5, 'rgba(16, 18, 22, 0.45)');
      grad.addColorStop(1, 'rgba(20, 22, 26, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, ty - 25, 1024, 50);
    }

    // Outer white edge lines
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(0, 24); ctx.lineTo(1024, 24);
    ctx.moveTo(0, 488); ctx.lineTo(1024, 488);
    ctx.stroke();

    // Central yellow dashed line along the crossroad
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 8;
    ctx.setLineDash([60, 45]);
    ctx.beginPath();
    ctx.moveTo(0, 256); ctx.lineTo(1024, 256);
    ctx.stroke();
    ctx.setLineDash([]);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  // 37. High-Contrast Roundabout Curb Ring Texture (512x64)
  static createRoundaboutCurbTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, 512, 64);

    const stripeWidth = 32;
    for (let x = 0; x < 512 + stripeWidth; x += stripeWidth * 2) {
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + stripeWidth, 0);
      ctx.lineTo(x + stripeWidth - 14, 64);
      ctx.lineTo(x - 14, 64);
      ctx.closePath();
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  // 38. Authentic Dhaka Chourasta Highway Gantry Signboard (1024x256)
  static createChourastaGantryTexture(title = 'মিরপুর ১০ গোলচত্বর / চৌরাস্তা', leftDest = '⬅ মিরপুর ১ / গাবতলী', centerDest = '⬆ কাজীপাড়া · ফার্মগেট ⬆', rightDest = 'বনানী / মহাখালী ➡') {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // BD Highway Sign Green
    ctx.fillStyle = '#006a4e';
    ctx.fillRect(0, 0, 1024, 256);

    // Double crisp white border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.strokeRect(10, 10, 1004, 236);
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, 984, 216);

    // Top Title Bar (Header)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(20, 20, 984, 72);

    ctx.fillStyle = '#facc15'; // Golden yellow title
    ctx.font = 'bold 36px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`★ ${title} ★`, 512, 68);

    // Divider line
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(20, 94); ctx.lineTo(1004, 94);
    ctx.stroke();

    // 3 Destination panels
    ctx.beginPath();
    ctx.moveTo(348, 94); ctx.lineTo(348, 236);
    ctx.moveTo(676, 94); ctx.lineTo(676, 236);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px "Hind Siliguri", sans-serif';

    // Left lane destination
    ctx.fillText(leftDest, 184, 175);

    // Center straight destination
    ctx.fillStyle = '#6ee7b7'; // Bright mint green
    ctx.fillText(centerDest, 512, 175);

    // Right lane destination
    ctx.fillStyle = '#ffffff';
    ctx.fillText(rightDest, 840, 175);

    // Subtitle cues in small font
    ctx.font = '16px "Hind Siliguri", sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('বাম লেন', 184, 215);
    ctx.fillText('সোজা এক্সপ্রেসওয়ে', 512, 215);
    ctx.fillText('ডান লেন', 840, 215);

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }

}
