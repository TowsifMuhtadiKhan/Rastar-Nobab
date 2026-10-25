import * as THREE from 'three';
import { Road } from './world/Road.js';
import { MetroRail } from './world/MetroRail.js';
import { DhakaCity } from './world/DhakaCity.js';
import { DhakaMap } from './world/DhakaMap.js';
import { RickshawTesla } from './vehicles/RickshawTesla.js';
import { TrafficManager } from './vehicles/TrafficManager.js';
import { DhakaProps } from './world/DhakaProps.js';
import { LootManager } from './items/LootManager.js';
import { EffectsManager } from './items/EffectsManager.js';
import { SoundManager } from './audio/SoundManager.js';
import { HUD } from './ui/HUD.js';
import { MemeGenerator } from './ui/MemeGenerator.js';
import { toBengaliNumber } from './ui/Textures.js';

class Game {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.clock = new THREE.Clock();

    this.isRunning = false;
    this.isPaused = false;
    this.nationalDamage = 0;
    this.takaCollected = 0;
    this.decibels = 72;
    this.maxDecibels = 72;
    this.wrongWayMeters = 0;
    this.cameraMode = 0;
    this.cameraViewMode = 'normal';
    const savedZoom = typeof localStorage !== 'undefined' ? localStorage.getItem('dhaka_rickshaw_zoom') : null;
    // Default zoom: 1.8x (zoom factor 0.56)
    this.cameraZoomFactor = (savedZoom && parseFloat(savedZoom) <= 0.65) ? parseFloat(savedZoom) : 0.56;
    this.screenShake = 0;

    this.input = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      horn: false,
      boost: false
    };

    try {
      this.initThree();
      this.initWorld();
      this.initAudioAndEffects();
      this.initInput();
      this.initUI();
    } catch (e) {
      console.error('Initialization warning:', e);
    }

    window.addEventListener('resize', () => this.onResize());
    this.animate();
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xdce8ed);
    this.scene.fog = new THREE.FogExp2(0xdce8ed, 0.007);

    this.camera = new THREE.PerspectiveCamera(
      68, // Optimal panoramic arcade FOV: expansive view without edge fisheye distortion
      window.innerWidth / window.innerHeight,
      0.1,
      600
    );
    this.camera.position.set(0, 5.0, 10.0);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true // Required for capturing crash screenshot for newspaper!
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25)); // Smooth 60 FPS
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap; // Ultra-fast shadow mapping
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.container.appendChild(this.renderer.domElement);

    const sunLight = new THREE.DirectionalLight(0xfff8e7, 2.4);
    sunLight.position.set(30, 55, -20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 140;
    sunLight.shadow.camera.left = -22;
    sunLight.shadow.camera.right = 22;
    sunLight.shadow.camera.top = 22;
    sunLight.shadow.camera.bottom = -22;
    sunLight.shadow.bias = -0.0003;
    this.scene.add(sunLight);
    this.sunLight = sunLight;

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x475569, 1.25);
    this.scene.add(hemiLight);
  }

  initWorld() {
    this.road = new Road(this.scene);
    this.metro = new MetroRail(this.scene);
    this.city = new DhakaCity(this.scene);
    this.map = new DhakaMap(this.scene);
    this.props = new DhakaProps(this.scene);
    this.player = new RickshawTesla(this.scene);
    this.traffic = new TrafficManager(this.scene);
    this.loot = new LootManager(this.scene);
  }

  initAudioAndEffects() {
    this.sound = new SoundManager();
    this.effects = new EffectsManager(this.scene);
  }

  initUI() {
    this.hud = new HUD(this);

    // Populate Highest Record on Start Screen
    const savedRec = parseInt(localStorage.getItem('dhaka_easybike_rush_high_score') || localStorage.getItem('baper_rasta_high_record') || '25400', 10);
    const startRecEl = document.getElementById('start-record-val');
    if (startRecEl) {
      startRecEl.innerText = `৳ ${toBengaliNumber(savedRec.toLocaleString('en-US'))}`;
    }

    // Toggle "কীভাবে খেলবেন" card
    const htpToggle = document.getElementById('htp-toggle-btn');
    const htpBody = document.getElementById('htp-body-content');
    const htpArrow = document.getElementById('htp-arrow-icon');
    if (htpToggle && htpBody) {
      htpToggle.addEventListener('click', () => {
        const isHidden = htpBody.style.display === 'none';
        htpBody.style.display = isHidden ? 'block' : 'none';
        if (htpArrow) htpArrow.innerText = isHidden ? '∧' : '∨';
      });
    }

    const startBtn = document.getElementById('btn-start-game');
    if (startBtn) {
      const startGameAction = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        this.sound.ensureContext();
        this.sound.startMotorSound();
        const modal = document.getElementById('start-modal');
        if (modal) {
          modal.style.opacity = '0';
          modal.style.pointerEvents = 'none';
          setTimeout(() => { modal.style.display = 'none'; }, 400);
        }
        const uiRoot = document.getElementById('ui-root');
        if (uiRoot) uiRoot.classList.add('active');
        this.isRunning = true;
        this.sound.shoutBengaliQuote('রাস্তার নবাব নামল রে! সাইড দেন!');
        this.effects.showFloatingText('⚡ রাস্তার নবাব চালু!', '#38bdf8', '32px');
      };

      startBtn.addEventListener('click', startGameAction);
      startBtn.addEventListener('pointerdown', startGameAction);
    }

    const restartBtn = document.getElementById('btn-restart');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.restartGame();
      });
    }

    const muteBtn = document.getElementById('btn-mute');
    const startMuteBtn = document.getElementById('start-mute-btn');
    const syncMuteUI = (muted) => {
      const icon = muted ? '🔇' : '🔊';
      if (muteBtn) muteBtn.innerText = icon;
      if (startMuteBtn) startMuteBtn.innerText = icon;
      const optSoundBtn = document.getElementById('opt-btn-sound');
      if (optSoundBtn) {
        optSoundBtn.innerText = muted ? 'বন্ধ' : 'চালু';
        optSoundBtn.classList.toggle('off', muted);
      }
    };

    if (muteBtn) {
      muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const muted = this.sound.toggleMute();
        syncMuteUI(muted);
      });
    }

    if (startMuteBtn) {
      startMuteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const muted = this.sound.toggleMute();
        syncMuteUI(muted);
      });
    }

    // Modal: নবাবী দরবার (Leaderboard)
    const darbarModal = document.getElementById('darbar-modal');
    const openDarbarBtn = document.getElementById('btn-open-darbar');
    const closeDarbarBtn = document.getElementById('btn-close-darbar');
    const closeDarbarBtn2 = document.getElementById('btn-close-darbar-2');
    const playDarbarBtn = document.getElementById('btn-darbar-play');

    if (openDarbarBtn && darbarModal) {
      openDarbarBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        darbarModal.style.display = 'flex';
      });
    }

    const closeDarbarAction = () => {
      if (darbarModal) darbarModal.style.display = 'none';
    };
    if (closeDarbarBtn) closeDarbarBtn.addEventListener('click', closeDarbarAction);
    if (closeDarbarBtn2) closeDarbarBtn2.addEventListener('click', closeDarbarAction);
    if (playDarbarBtn) {
      playDarbarBtn.addEventListener('click', () => {
        closeDarbarAction();
        startBtn?.click();
      });
    }

    // Modal: খেলার নিয়মাবলী (How to Play)
    const rulesModal = document.getElementById('rules-modal');
    const openRulesBtn = document.getElementById('btn-open-rules');
    const closeRulesBtn = document.getElementById('btn-close-rules');
    const closeRulesBtn2 = document.getElementById('btn-close-rules-2');

    if (openRulesBtn && rulesModal) {
      openRulesBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        rulesModal.style.display = 'flex';
      });
    }

    const closeRulesAction = () => {
      if (rulesModal) rulesModal.style.display = 'none';
    };
    if (closeRulesBtn) closeRulesBtn.addEventListener('click', closeRulesAction);
    if (closeRulesBtn2) {
      closeRulesBtn2.addEventListener('click', () => {
        closeRulesAction();
        startBtn?.click();
      });
    }

    // Modal: নবাবী অপশন ও সেটিংস (Options / Settings)
    const optionsModal = document.getElementById('options-modal');
    const openOptionsBtn = document.getElementById('btn-open-options');
    const closeOptionsBtn = document.getElementById('btn-close-options');
    const saveOptionsBtn = document.getElementById('btn-save-options');
    const optSoundBtn = document.getElementById('opt-btn-sound');

    if (openOptionsBtn && optionsModal) {
      openOptionsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        optionsModal.style.display = 'flex';
      });
    }

    const closeOptionsAction = () => {
      if (optionsModal) optionsModal.style.display = 'none';
    };
    if (closeOptionsBtn) closeOptionsBtn.addEventListener('click', closeOptionsAction);
    if (saveOptionsBtn) saveOptionsBtn.addEventListener('click', closeOptionsAction);

    if (optSoundBtn) {
      optSoundBtn.addEventListener('click', () => {
        const muted = this.sound.toggleMute();
        syncMuteUI(muted);
      });
    }

    // Volume Slider in Options (Reduces sound and keeps it smooth & pleasant)
    const volSlider = document.getElementById('opt-volume-slider');
    const volText = document.getElementById('opt-volume-text');
    if (volSlider) {
      volSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (volText) volText.innerText = `${toBengaliNumber(val)}%`;
        this.sound.setVolume(val);
      });
    }

    // Camera view choice buttons in Options
    const camButtons = document.querySelectorAll('#opt-cam-group .opt-choice-btn');
    camButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        camButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.cameraViewMode = btn.dataset.cam || 'normal';
      });
    });

    // Drive control choice buttons in Options
    const ctrlButtons = document.querySelectorAll('#opt-ctrl-group .opt-choice-btn');
    ctrlButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        ctrlButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (this.player) {
          this.player.autoCruiseEnabled = (btn.dataset.ctrl === 'auto');
        }
      });
    });

    // Graphics choice buttons in Options
    const gfxButtons = document.querySelectorAll('#opt-gfx-group .opt-choice-btn');
    gfxButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        gfxButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (btn.dataset.gfx === 'high') {
          this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        } else {
          this.renderer.setPixelRatio(1);
        }
      });
    });

    // Modal: নবাবী শেয়ার (Share)
    const shareModal = document.getElementById('share-modal');
    const openShareBtn = document.getElementById('btn-open-share');
    const closeShareBtn = document.getElementById('btn-close-share');
    const closeShareBtn2 = document.getElementById('btn-close-share-2');

    if (openShareBtn && shareModal) {
      openShareBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        shareModal.style.display = 'flex';
      });
    }

    const closeShareAction = () => {
      if (shareModal) shareModal.style.display = 'none';
    };
    if (closeShareBtn) closeShareBtn.addEventListener('click', closeShareAction);
    if (closeShareBtn2) closeShareBtn2.addEventListener('click', closeShareAction);

    const shareFb = document.getElementById('share-btn-fb');
    if (shareFb) {
      shareFb.addEventListener('click', () => {
        const text = encodeURIComponent('ঢাকার রাজপথের আসল রাজা! খেলে দেখুন "রাস্তার নবাব": ' + window.location.href);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${text}`, '_blank');
      });
    }

    const shareWa = document.getElementById('share-btn-wa');
    if (shareWa) {
      shareWa.addEventListener('click', () => {
        const text = encodeURIComponent('ঢাকার রাজপথের আসল রাজা! খেলে দেখুন "রাস্তার নবাব": ' + window.location.href);
        window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
      });
    }

    const shareCopy = document.getElementById('share-btn-copy');
    const shareToast = document.getElementById('share-copy-toast');
    if (shareCopy) {
      shareCopy.addEventListener('click', () => {
        navigator.clipboard?.writeText(window.location.href).then(() => {
          if (shareToast) {
            shareToast.style.display = 'block';
            setTimeout(() => { shareToast.style.display = 'none'; }, 2500);
          }
        }).catch(() => {
          if (shareToast) {
            shareToast.innerText = 'লিংক: ' + window.location.href;
            shareToast.style.display = 'block';
          }
        });
      });
    }

    // Connect Game Over newspaper link to darbar modal
    const npWantedLink = document.querySelector('.np-red-link');
    if (npWantedLink) {
      npWantedLink.style.cursor = 'pointer';
      npWantedLink.addEventListener('click', () => {
        if (darbarModal) darbarModal.style.display = 'flex';
      });
    }

    // Pause button and modal controls
    const pauseBtn = document.getElementById('btn-pause');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.togglePause(true);
      });
    }

    const closePauseBtn = document.getElementById('btn-close-pause');
    const resumePauseBtn = document.getElementById('btn-pause-resume');
    const restartPauseBtn = document.getElementById('btn-pause-restart');
    const optionsPauseBtn = document.getElementById('btn-pause-options');
    const homePauseBtn = document.getElementById('btn-pause-home');

    if (closePauseBtn) closePauseBtn.addEventListener('click', () => this.togglePause(false));
    if (resumePauseBtn) resumePauseBtn.addEventListener('click', () => this.togglePause(false));
    if (restartPauseBtn) {
      restartPauseBtn.addEventListener('click', () => {
        this.togglePause(false);
        this.restartGame();
      });
    }
    if (optionsPauseBtn) {
      optionsPauseBtn.addEventListener('click', () => {
        const optModal = document.getElementById('options-modal');
        if (optModal) optModal.style.display = 'flex';
      });
    }
    if (homePauseBtn) {
      homePauseBtn.addEventListener('click', () => {
        this.quitToMenu();
      });
    }

    // Share photo button (downloads newspaper snapshot)
    const sharePhotoBtn = document.getElementById('btn-share-photo');
    if (sharePhotoBtn) {
      sharePhotoBtn.addEventListener('click', () => {
        this.downloadNewspaper();
      });
    }

    // Share video button
    const shareVideoBtn = document.getElementById('btn-share-video');
    if (shareVideoBtn) {
      shareVideoBtn.addEventListener('click', () => {
        this.effects.showFloatingText('ভিডিও ক্লিপ প্রস্তুত হচ্ছে...', '#00ffd5', '24px');
      });
    }
  }

  initInput() {
    window.addEventListener('keydown', (e) => {
      this.sound.ensureContext();
      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          this.input.forward = true;
          break;
        case 'ArrowDown':
        case 'KeyS':
          this.input.backward = true;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          this.input.left = true;
          break;
        case 'ArrowRight':
        case 'KeyD':
          this.input.right = true;
          break;
        case 'Space':
        case 'KeyH':
          if (!this.input.horn) {
            this.triggerHorn(true);
          }
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
        case 'KeyE':
          this.input.boost = true;
          break;
        case 'KeyP':
        case 'Escape':
          this.togglePause();
          break;
        case 'KeyK':
          // Test key to instantly view the Game Over newspaper
          this.triggerGameOver();
          break;
      }
    });

    window.addEventListener('keyup', (e) => {
      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          this.input.forward = false;
          break;
        case 'ArrowDown':
        case 'KeyS':
          this.input.backward = false;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          this.input.left = false;
          break;
        case 'ArrowRight':
        case 'KeyD':
          this.input.right = false;
          break;
        case 'Space':
        case 'KeyH':
          this.triggerHorn(false);
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
        case 'KeyE':
          this.input.boost = false;
          break;
      }
    });

    this.hookTouchBtn('btn-left', (active) => { this.input.left = active; });
    this.hookTouchBtn('btn-right', (active) => { this.input.right = active; });
    this.hookTouchBtn('btn-brake', (active) => { this.input.backward = active; });
    this.hookTouchBtn('btn-boost', (active) => { this.input.boost = active; });
    this.hookTouchBtn('btn-horn', (active) => { this.triggerHorn(active); });

    // On-Screen Zoom Controls & Pinch-To-Zoom System
    const btnZoomIn = document.getElementById('btn-zoom-in');
    const btnZoomOut = document.getElementById('btn-zoom-out');
    const zoomText = document.getElementById('zoom-level-text');

    const updateZoomDisplay = () => {
      const zVal = (this.cameraZoomFactor || 0.56);
      const displayZoom = (1 / zVal);
      if (zoomText) zoomText.innerText = `${toBengaliNumber(displayZoom.toFixed(1))}×`;
      try { localStorage.setItem('dhaka_rickshaw_zoom', zVal.toFixed(2)); } catch (e) {}
    };
    updateZoomDisplay();

    if (btnZoomOut) {
      btnZoomOut.addEventListener('click', (e) => {
        e.stopPropagation();
        this.cameraZoomFactor = Math.min(1.8, (this.cameraZoomFactor || 0.56) + 0.12);
        updateZoomDisplay();
      });
    }

    if (btnZoomIn) {
      btnZoomIn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.cameraZoomFactor = Math.max(0.35, (this.cameraZoomFactor || 0.56) - 0.12);
        updateZoomDisplay();
      });
    }

    // Smooth Mouse Wheel Zoom
    window.addEventListener('wheel', (e) => {
      this.cameraZoomFactor = Math.max(0.35, Math.min(1.8, (this.cameraZoomFactor || 0.56) + e.deltaY * 0.0006));
      updateZoomDisplay();
    }, { passive: true });

    // Touch Pinch-to-Zoom Gesture for mobile screens
    let initialPinchDist = null;
    let initialPinchZoom = 0.56;
    window.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        initialPinchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        initialPinchZoom = this.cameraZoomFactor || 0.56;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && initialPinchDist) {
        const currentDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = initialPinchDist / Math.max(1, currentDist);
        this.cameraZoomFactor = Math.max(0.7, Math.min(2.5, initialPinchZoom * factor));
        updateZoomDisplay();
      }
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      if (e.touches.length < 2) initialPinchDist = null;
    }, { passive: true });
  }

  hookTouchBtn(id, callback) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.sound.ensureContext();
      callback(true);
    });
    el.addEventListener('pointerup', (e) => {
      e.preventDefault();
      callback(false);
    });
    el.addEventListener('pointerleave', () => {
      callback(false);
    });
  }

  triggerHorn(active) {
    this.input.horn = active;
    if (active && this.isRunning) {
      this.sound.playPepPepHorn();
      this.screenShake = 0.38;

      const pos = this.player.group.position;
      this.effects.createHornShockwave(pos.x, pos.y, pos.z);

      this.decibels = Math.min(185, this.decibels + 40);
      if (this.decibels > this.maxDecibels) this.maxDecibels = this.decibels;

      const affected = this.traffic.triggerHornShockwave(pos.x, pos.z, 32);
      if (affected.length > 0) {
        this.effects.showFloatingText('📢 প্যাঁক প্যাঁক!', '#facc15', '24px');
      }

      if (this.city && typeof this.city.reactToHorn === 'function') {
        this.city.reactToHorn(pos.x, pos.z, 30);
      }

      if (Math.random() > 0.6) {
        const quote = this.sound.shoutBengaliQuote();
        this.hud.showSpeech(quote);
      }
    }
  }

  updateCamera(delta) {
    const pPos = this.player.group.position;

    this.sunLight.position.set(pPos.x + 35, 65, pPos.z - 20);
    this.sunLight.target.position.set(pPos.x, 0, pPos.z);
    this.sunLight.target.updateMatrixWorld();

    // Cinematic 360 Showcase Camera when on Start Screen: Beautiful, completely unobstructed view of Easybike
    if (!this.isRunning && document.getElementById('start-modal')?.style.display !== 'none') {
      const t = Date.now() * 0.00045;
      const radius = 3.5;
      const idleCamPos = new THREE.Vector3(
        2.8 + Math.sin(t) * radius,
        1.35 + Math.sin(t * 0.5) * 0.15,
        Math.cos(t) * radius
      );
      const idleLookAt = new THREE.Vector3(2.8, 0.95, 0);
      this.camera.position.lerp(idleCamPos, 0.08);
      this.camera.lookAt(idleLookAt);
      return;
    }

    // Camera view perspective based on user settings (Default is 1.8x zoomed in)
    const zoom = this.cameraZoomFactor || 0.56;
    let dist, height, lookAhead;

    if (this.cameraViewMode === 'wide') {
      dist = (10.0 + (this.player.speed / 50) * 1.5) * zoom;
      height = (5.5 + (this.player.speed / 60) * 1.0) * zoom;
      lookAhead = -26;
    } else if (this.cameraViewMode === 'top') {
      dist = 3.0 * zoom;
      height = 12.0 * zoom;
      lookAhead = -8;
    } else {
      // Normal dynamic chase: elevated commanding perspective so driver always has a crystal-clear, unobstructed view of the road
      const isPortrait = window.innerWidth < 640 || window.innerHeight > window.innerWidth;
      const baseDist = isPortrait ? 6.8 : 5.8;
      const baseHeight = isPortrait ? 4.2 : 3.6;
      const baseLook = isPortrait ? -22 : -20;

      dist = (baseDist + (this.player.speed / 50) * 1.0) * zoom;
      // Keep camera elevated so driver clearly looks over the rickshaw's roof down the road
      height = (baseHeight + (this.player.speed / 60) * 0.7) * Math.max(0.72, Math.min(1.0, zoom + 0.20));
      lookAhead = baseLook;
    }

    // Perfectly straight centered chase camera (Zero sideways tilt or angular offset!)
    const targetCamPos = new THREE.Vector3(
      pPos.x,
      pPos.y + height,
      pPos.z + dist
    );
    const targetLookAt = new THREE.Vector3(pPos.x, pPos.y + 0.95, pPos.z + lookAhead);

    if (this.screenShake > 0) {
      targetCamPos.x += (Math.random() - 0.5) * this.screenShake;
      targetCamPos.y += (Math.random() - 0.5) * this.screenShake;
      this.screenShake = Math.max(0, this.screenShake - delta * 1.8);
    }

    this.camera.position.lerp(targetCamPos, 0.10);
    this.camera.lookAt(targetLookAt);
  }

  checkGameCollisions(delta) {
    const pBounds = this.player.getBounds();
    const pPos = this.player.group.position;

    // 0. Central Roundabout Island Collision (গোলচত্বর বা ট্রাফিক পুলিশ আইল্যান্ড)
    const activeChourastas = (typeof this.road.getActiveChourastas === 'function') 
      ? this.road.getActiveChourastas() : [];
    for (const ch of activeChourastas) {
      const dx = pPos.x;
      const dz = pPos.z - ch.z;
      const distToCenter = Math.sqrt(dx * dx + dz * dz);
      if (distToCenter < ch.radius + 0.65) {
        this.sound.playCrashSound(1.4);
        this.sound.playDhapashSound();
        this.sound.playPoliceWhistle();
        this.sound.playKiRagKorlaMusic();
        this.screenShake = 0.65;
        this.effects.createCrashSparks(pPos.x, 0.9, pPos.z, 28);

        const islandGalis = [
          'এই ব্যাটা! গোলচত্বরে গাড়ি উঠাইয়া দিলি ক্যান রে?!',
          'ট্রাফিক আইল্যান্ড কি তোর নানার ড্রয়িংরুম?! সাইড দিয়া যা!',
          'রাস্তার নবাব হইছস তো কি হইছে?! গোলচত্বর কি তোর বাপের?!',
          'চৌরাস্তায় লাল বাতি দেখো নাই?! সোজা আইল্যান্ডে ধাক্কা মারলা?!'
        ];
        const islandGali = islandGalis[Math.floor(Math.random() * islandGalis.length)];

        const gali = this.effects.createDhapashImpact(
          0, 1.2, ch.z, this.camera, 'ধড়াম!', islandGali, 15000
        );
        this.sound.speakGali(gali);
        this.hud.showSpeech(gali);
        this.nationalDamage += 15000;

        this.player.speed = -14;
        const pushAngle = Math.atan2(dz, dx);
        pPos.x = Math.cos(pushAngle) * (ch.radius + 0.9);
        pPos.z = ch.z + Math.sin(pushAngle) * (ch.radius + 0.9);
        return;
      }

      // Approach warning when 35m-65m away from Chourasta
      const distAhead = pPos.z - ch.z;
      if (distAhead > 35 && distAhead < 65 && Math.abs((this.lastChourastaZ || 9999) - ch.z) > 100) {
        this.lastChourastaZ = ch.z;
        this.sound.playPoliceWhistle();
        this.effects.showFloatingText(`🚨 চৌরাস্তা: ${ch.stationData.name}!`, '#facc15', '28px');
      }
    }

    // Solid Concrete Metro Pillar Collision (Pillars at X=0, spaced every 40m)
    if (Math.abs(pPos.x) < 1.05) {
      const nearestPillarZ = Math.round(pPos.z / 40) * 40;
      const distToPillar = Math.abs(pPos.z - nearestPillarZ);
      if (distToPillar < 1.25) {
        // Hard collision into solid concrete Metro pillar!
        this.sound.playCrashSound(1.6);
        this.sound.playDhapashSound();
        this.screenShake = 0.85;
        this.effects.createCrashSparks(pPos.x, 1.2, pPos.z, 35);
        const gali = this.effects.createDhapashImpact(
          pPos.x, 1.4, nearestPillarZ, this.camera, 'ধড়াম!', 'পিলারের সাথে যুদ্ধ বাঁধাইছো নি?! ব্রেক ধরো!', null
        );
        this.sound.speakGali(gali);
        this.hud.showSpeech(gali);
        this.nationalDamage += 10000;
        this.player.speed = -14; // Rebound backwards!
        pPos.z = nearestPillarZ + 1.8;
        return;
      }
    }

    // Central Raised Median Curb Physical Bump
    if (Math.abs(pPos.x) < 0.95) {
      // Driving on top of central median
      this.player.group.position.y = 0.35 + Math.sin(Date.now() * 0.04) * 0.06;
      if (Math.random() > 0.8) {
        this.effects.createCrashSparks(pPos.x, 0.2, pPos.z, 2);
      }
    }

    // Footpath Sidewalk Driving Feedback (Dhaka shortcut style!)
    const absX = Math.abs(pPos.x);
    if (absX >= 13.0 && absX <= 17.2) {
      if (!this.lastFootpathWarning || Date.now() - this.lastFootpathWarning > 7000) {
        this.lastFootpathWarning = Date.now();
        const fpQuotes = [
          '🚨 মামা ফুটপাতে গাড়ি উঠাইয়া দিলেন?!',
          '⚡ নো ফুটপাত নো ক্রাইম! জ্যাম কাটার দেশি টেকনিক!',
          '🚶‍♂️ পথচারী ভাই সাইড দেন!',
          '🛺 ফুটপাত দিয়া শর্টকাট! দেশি টেসলা!',
          '🔥 ট্রাফিক জ্যাম নাই, ফুটপাতই হাইওয়ে!'
        ];
        const quote = fpQuotes[Math.floor(Math.random() * fpQuotes.length)];
        this.effects.showFloatingText(quote, '#facc15', '24px');
        this.sound.playRickshawBell();
      }
    }

    // 1. Physical Collision with Traffic Vehicles (Buses, VIPs, Cars, CNGs, Pedestrians)
    const hits = this.traffic.checkCollisions(pBounds);
    for (const car of hits) {
      if (car.isVIP) {
        this.sound.playCrashSound(1.5);
        this.sound.playDhapashSound();
        this.sound.playKiRagKorlaMusic();
        this.screenShake = 0.75;
        this.effects.createCrashSparks(pBounds.x, 1.2, pBounds.z, 30);
        this.nationalDamage += 50000;
        this.takaCollected += 5000;

        this.sound.playTurboSound();
        const gali = this.effects.createDhapashImpact(
          car.group.position.x, 1.4, car.group.position.z, this.camera, 'চুরমার!', 'ভিআইপি প্রটোকল শেষ! রাস্তা কার বাপের?!', 5000
        );
        this.sound.speakGali(gali);
        this.hud.showSpeech(gali);

        this.player.speed = -8; // Bounce back
        pPos.z += 1.2;

        this.loot.burstLootAt(car.group.position.x, car.group.position.z, 6);
        this.traffic.removeVehicle(car);
      } else if (car.type === 'pedestrian') {
        const val = car.isSergeant ? 1000 : 500;
        this.takaCollected += val;
        this.nationalDamage += 2500;
        this.sound.playTakaChingSound(val);
        this.sound.playDhapashSound();
        this.sound.playKiRagKorlaMusic(); // 🎵 Background viral music: "Ki rag korla?!"

        const pedGalis = [
          'কী রাগ করলা?! রাগ করলা নাকি সোনা?!',
          'আরে ভাই দেইখা হাঁটেন! কী রাগ করলা?!',
          'রাস্তা কি তোমাগো বাপের?! কী রাগ করলা?!',
          'ফুটপাতে ধাক্কা দিলেন কেন ভাই?! কী রাগ করলা?!'
        ];
        const customGali = car.isSergeant 
          ? 'সার্জেন্টকে ধাক্কা?! লাইসেন্স বাতিল কইরা দিমু! কী রাগ করলা?!' 
          : pedGalis[Math.floor(Math.random() * pedGalis.length)];
        const starWord = Math.random() > 0.4 ? '🎵 কী রাগ করলা?! 🎵' : 'পটাস!';
        const gali = this.effects.createDhapashImpact(
          car.group.position.x, 0.9, car.group.position.z, this.camera, starWord, customGali, val
        );
        this.sound.speakGali(gali);
        this.hud.showSpeech(gali);

        this.effects.createCrashSparks(car.group.position.x, 0.5, car.group.position.z, 8);
        this.loot.burstLootAt(car.group.position.x, car.group.position.z, 3);
        this.traffic.removeVehicle(car);
      } else {
        // Collision with Bus, HiAce, Sedan or CNG
        this.sound.playCrashSound(1.2);
        this.sound.playDhapashSound();
        this.sound.playKiRagKorlaMusic(); // 🎵 Background viral music: "Ki rag korla?!"
        this.screenShake = 0.55;
        this.effects.createCrashSparks(pBounds.x, 0.8, pBounds.z, 20);

        let customGali = null;
        let starWord = 'ধপাস!';
        if (car.isCrossTraffic) {
          const crossGalis = [
            'চৌরাস্তায় লাল বাতি দেখেন না মিয়া?! সিগন্যাল ভাইঙ্গা মারলেন?!',
            'আরে ভাই! আড়াআড়ি সিএনজির লগে টক্কর দেন ক্যান?!',
            'চৌরাস্তার মোড়েও রেষারেষি?! এই ব্যাটারে কে ড্রাইভিং লাইসেন্স দিল?!',
            'সিগন্যালে গাড়ি থামান নাই ক্যান?! ট্রাফিক সার্জেন্ট মামলা দিতাছে দাঁড়ান!',
            'সোজা চৌরাস্তার আইল্যান্ড পার হইয়া আমারে মারলা?!'
          ];
          customGali = crossGalis[Math.floor(Math.random() * crossGalis.length)];
          starWord = Math.random() > 0.5 ? 'ধড়াম!' : 'ধপাস!';
        } else if (car.type === 'cng') {
          const cngGalis = [
            'মিটার চলে না মামা! ফিক্সড ৩০০ টাকা!',
            'সিএনজি কি খেলনা গাড়ি পাইছেন?! খাঁচা ভাইঙ্গা দিলেন!',
            'গ্যাস নাই সিলিন্ডারে, আবার পিছে গুঁতা মারেন!',
            'আরে ভাই দেইখা চালান! গ্যাস সিলিন্ডার ব্লাস্ট হইব তো!',
            'সিএনজিওয়ালার সাথে টক্কর?! মিরপুর ১০ চেনেন?!',
            'রাগ করলা? সিএনজির সামনে এমন ভাব লন ক্যান?!',
            'কী রাগ করলা?! রাগ করলা নাকি সোনা?!',
            'কী রাগ করলা?! সিএনজিরে বাড়ি মারলা কেন?!'
          ];
          customGali = cngGalis[Math.floor(Math.random() * cngGalis.length)];
          starWord = Math.random() > 0.4 ? '🎵 কী রাগ করলা?! 🎵' : 'ধপাস!';
        }

        // Comic DHAPASH Impact & Dhaka Street Gali!
        const gali = this.effects.createDhapashImpact(
          car.group.position.x, 1.2, car.group.position.z, this.camera, starWord, customGali, 250
        );
        this.sound.speakGali(gali);
        this.hud.showSpeech(gali);

        const leveledUp = this.player.addCarPart();
        this.sound.playPartPickupSound();
        this.nationalDamage += 15000;

        if (leveledUp) {
          this.effects.showFloatingText(`★ টেসলা লেভেল ${this.player.upgradeLevel} আপগ্রেড! ★`, '#00f0ff', '30px');
          this.sound.playTurboSound();
        }

        // PHYSICAL SEPARATION: Do NOT let player phase or glide through the car!
        if (car.isCrossTraffic) {
          this.player.speed = -12;
          pPos.z += 1.8;
          car.crossSpeed *= -0.5;
        } else if (car.isWrongWay) {
          this.player.speed = -16; // Violently knocked backwards by oncoming bus/car!
          pPos.z += 2.0;
          car.group.position.x += (car.group.position.x > pBounds.x ? 3.5 : -3.5);
          car.group.rotation.y += 0.5;
        } else {
          // Rear-ended vehicle in front: rebound player backwards
          this.player.speed = -8;
          pPos.z = car.group.position.z + (car.length + pBounds.length) * 0.5 + 0.3;
          car.speed += 20; // Nudge vehicle forward
          car.reactToHorn();
        }

        this.loot.burstLootAt(car.group.position.x, car.group.position.z, 4);
      }
    }

    // 2. Collision with Roadside Street Props (Fuchka cart, Fruit van, Barricades, Dustbins, Tar drums)
    const propHits = this.props.checkCollisions(pBounds);
    for (const prop of propHits) {
      this.sound.playCrashSound(1.1);
      this.sound.playDhapashSound();
      this.screenShake = 0.45;
      this.nationalDamage += prop.damage;
      this.takaCollected += prop.taka;
      this.effects.createCrashSparks(prop.group.position.x, 0.8, prop.group.position.z, 16);

      const gali = this.effects.createDhapashImpact(
        prop.group.position.x, 0.8, prop.group.position.z, this.camera, 'ঠাস!', `${prop.name} চুরমার! দোকানদার বেহুঁশ!`, prop.damage
      );
      this.sound.speakGali(gali);
      this.hud.showSpeech(gali);

      this.loot.burstLootAt(prop.group.position.x, prop.group.position.z, 2);
    }

    // 3. Collect Banknotes & Parts Dropped from Crashes
    const collected = this.loot.checkPickup(pBounds);
    for (const item of collected) {
      if (item.type === 'money') {
        this.takaCollected += item.value;
        this.sound.playTakaChingSound(item.value);
        this.effects.showFloatingText(`+৳ ${item.value}`, '#ffd700', '26px');
      } else if (item.type === 'part') {
        const leveledUp = this.player.addCarPart();
        this.sound.playPartPickupSound();
        if (leveledUp) {
          this.effects.showFloatingText(`★ টেসলা লেভেল ${this.player.upgradeLevel} আপগ্রেড! ★`, '#00f0ff', '30px');
        } else {
          this.effects.showFloatingText('+১ গাড়ির পার্টস!', '#00ffd5', '22px');
        }
      }
    }

    // 4. Wrong-way Driving Detection (X < -1.0)
    // NOTE: Taka/Damage is ONLY awarded on physical hits, no passive ticking!
    const isWrongWay = this.player.group.position.x < -1.0 && this.player.speed > 5;
    if (isWrongWay) {
      this.wrongWayMeters += Math.round((this.player.speed / 3.6) * delta);
    }

    // Decibel Decay
    if (!this.input.horn) {
      const ambient = 72 + (this.player.speed / 50) * 15;
      this.decibels += (ambient - this.decibels) * delta * 2.5;
    }

    // Battery Drain & Game Over
    if (this.player.battery <= 0) {
      this.triggerGameOver();
    }
  }

  // Trigger "ঢাকা এক্সপ্রেস" Newspaper Game Over Screen
  triggerGameOver() {
    this.isRunning = false;
    this.sound.stopMotorSound();

    const uiRoot = document.getElementById('ui-root');
    if (uiRoot) uiRoot.classList.remove('active');

    // 1. Capture snapshot of current WebGL scene into newspaper photo canvas
    this.captureCrashSnapshot();

    // 2. High Score Logic
    const savedRecord = parseInt(localStorage.getItem('dhaka_easybike_rush_high_score') || localStorage.getItem('baper_rasta_high_record') || '25400', 10);
    const currentDamage = Math.max(0, this.nationalDamage);
    const newRecord = Math.max(savedRecord, currentDamage);
    localStorage.setItem('dhaka_easybike_rush_high_score', newRecord.toString());
    const hsEl = document.getElementById('np-highscore-val');
    if (hsEl) {
      hsEl.innerText = `৳ ${toBengaliNumber(newRecord.toLocaleString('en-US'))}`;
    }

    // 3. Generate hilarious Bengali meme story and statistics
    const mapData = this.map ? this.map.update(this.player.group.position.z) : null;
    const locationName = mapData && mapData.currentStation ? mapData.currentStation.name : 'আগারগাঁও';

    const memes = MemeGenerator.getMemes({
      nationalDamage: this.nationalDamage,
      wrongWayMeters: this.wrongWayMeters,
      maxDecibels: this.maxDecibels,
      locationName: locationName
    });

    // 4. Inject into Newspaper DOM matching the screenshot
    const hlEl = document.getElementById('np-headline-text');
    if (hlEl) hlEl.innerText = memes.headline;

    const dmgValEl = document.getElementById('np-badge-val');
    if (dmgValEl) dmgValEl.innerText = memes.damageText;

    const capEl = document.getElementById('np-photo-caption-text');
    if (capEl) capEl.innerText = memes.caption;

    const pillEl = document.getElementById('np-coupon-pill');
    if (pillEl) pillEl.innerText = memes.couponPill;

    const titleEl = document.getElementById('np-coupon-title');
    if (titleEl) titleEl.innerText = memes.couponTitle;

    const qTextEl = document.getElementById('np-quote-text');
    if (qTextEl) qTextEl.innerText = memes.quoteText;

    const qAuthEl = document.getElementById('np-quote-author');
    if (qAuthEl) qAuthEl.innerText = memes.quoteAuthor;

    const artEl = document.getElementById('np-article-text');
    if (artEl) artEl.innerHTML = memes.article;

    const modal = document.getElementById('gameover-modal');
    if (modal) modal.style.display = 'flex';
    this.sound.shoutBengaliQuote('ধরা খাইছি রে ভাই! পাবলিক ধোলাই দিতাছে!');
  }

  captureCrashSnapshot() {
    const photoCanvas = document.getElementById('np-photo-canvas');
    if (!photoCanvas) return;
    const ctx = photoCanvas.getContext('2d');

    // Render one crisp frame from the main renderer
    this.renderer.render(this.scene, this.camera);
    const mainCanvas = this.renderer.domElement;

    // Draw downscaled into newspaper photo
    ctx.drawImage(
      mainCanvas,
      0, 0, mainCanvas.width, mainCanvas.height,
      0, 0, photoCanvas.width, photoCanvas.height
    );
  }

  downloadNewspaper() {
    const photoCanvas = document.getElementById('np-photo-canvas');
    if (!photoCanvas) return;
    const a = document.createElement('a');
    a.href = photoCanvas.toDataURL('image/jpeg', 0.9);
    a.download = `Dainik-Janjot-Meme-${Date.now()}.jpg`;
    a.click();
    this.effects.showFloatingText('পত্রিকার ছবি সেভ হয়েছে!', '#10b981', '24px');
  }

  restartGame() {
    this.nationalDamage = 0;
    this.takaCollected = 0;
    this.decibels = 72;
    this.maxDecibels = 72;
    this.wrongWayMeters = 0;
    this.player.battery = 100;
    this.player.health = 100;
    this.player.speed = 0;
    this.player.upgradeLevel = 1;
    this.player.partsCollected = 0;
    this.player.group.position.set(2.8, 0, 0);

    this.road.reset();
    this.metro.reset();
    this.city.reset();
    this.map.reset();
    this.props.reset();
    this.traffic.reset();
    this.loot.reset();
    this.effects.reset();

    document.getElementById('gameover-modal').style.display = 'none';
    const uiRoot = document.getElementById('ui-root');
    if (uiRoot) uiRoot.classList.add('active');
    this.isRunning = true;
    this.sound.ensureContext();
    this.sound.startMotorSound();
    this.sound.shoutBengaliQuote('আবার নামল রাস্তার নবাব!');
  }

  togglePause(forceState) {
    if (!this.isRunning) return;
    this.isPaused = (typeof forceState === 'boolean') ? forceState : !this.isPaused;

    const pauseBtn = document.getElementById('btn-pause');
    if (pauseBtn) {
      pauseBtn.innerText = this.isPaused ? '▶' : '⏸';
      pauseBtn.title = this.isPaused ? 'খেলা চালু করুন (RESUME)' : 'খেলা বিরতি (PAUSE)';
    }

    const pauseModal = document.getElementById('pause-modal');
    if (this.isPaused) {
      this.sound.stopMotorSound();
      if (pauseModal) {
        const damageEl = document.getElementById('pause-stat-damage');
        const battEl = document.getElementById('pause-stat-battery');
        const vipEl = document.getElementById('pause-stat-vip');
        const stnEl = document.getElementById('pause-stat-station');
        if (damageEl) damageEl.innerText = `৳ ${toBengaliNumber(this.nationalDamage.toLocaleString('en-US'))}`;
        if (battEl) battEl.innerText = `${toBengaliNumber(Math.round(this.player.battery))}%`;
        const pZ = this.player.group.position.z;
        const vipDist = Math.max(0, Math.round(Math.abs(pZ - this.traffic.vipZ)));
        if (vipEl) vipEl.innerText = `${toBengaliNumber(vipDist)} মি`;
        const mapData = this.map ? this.map.update(pZ) : null;
        if (stnEl && mapData?.currentStation) stnEl.innerText = mapData.currentStation.name;

        pauseModal.style.display = 'flex';
      }
    } else {
      if (pauseModal) pauseModal.style.display = 'none';
      this.sound.ensureContext();
      this.sound.startMotorSound();
      this.clock.getDelta(); // reset delta to prevent time jump
    }
  }

  quitToMenu() {
    this.isPaused = false;
    this.isRunning = false;
    this.sound.stopMotorSound();

    const pauseBtn = document.getElementById('btn-pause');
    if (pauseBtn) {
      pauseBtn.innerText = this.isPaused ? '▶' : '⏸';
      pauseBtn.title = this.isPaused ? 'খেলা চালু করুন (RESUME)' : 'খেলা বিরতি (PAUSE)';
    }

    const pauseModal = document.getElementById('pause-modal');
    if (pauseModal) pauseModal.style.display = 'none';

    const uiRoot = document.getElementById('ui-root');
    if (uiRoot) uiRoot.classList.remove('active');

    const startModal = document.getElementById('start-modal');
    if (startModal) {
      startModal.style.display = 'flex';
      startModal.style.opacity = '1';
      startModal.style.pointerEvents = 'auto';
    }

    // Reset player position for idle camera
    this.player.group.position.set(2.8, 0, 0);
    this.player.speed = 0;
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const delta = Math.min(this.clock.getDelta(), 0.08);

    if (this.isRunning && !this.isPaused) {
      this.player.update(delta, this.input);

      const spdNorm = Math.abs(this.player.speed) / this.player.boostMaxSpeed;
      this.sound.updateMotor(spdNorm);

      const pZ = this.player.group.position.z;
      this.road.update(pZ);
      this.metro.update(delta, pZ);
      this.city.update(delta, pZ);
      const mapData = this.map.update(pZ);
      this.props.update(delta, pZ);

      this.traffic.update(delta, pZ, this.player.speed, this.road.getActiveChourastas());
      this.loot.update(delta, pZ);
      this.effects.update(delta);

      this.checkGameCollisions(delta);

      this.hud.update(
        {
          speed: this.player.speed,
          nationalDamage: this.nationalDamage,
          takaCollected: this.takaCollected,
          battery: this.player.battery,
          decibels: this.decibels,
          upgradeLevel: this.player.upgradeLevel,
          isWrongWay: this.player.group.position.x < -1.0
        },
        this.traffic,
        this.player.group.position,
        mapData
      );
    } else {
      // Dynamic living 3D Dhaka street during Start Screen / idle showcase!
      const pZ = this.player.group.position.z;
      this.traffic.update(delta, pZ, 0, this.road.getActiveChourastas());
      this.metro.update(delta, pZ);
      this.city.update(delta, pZ);
    }

    this.updateCamera(delta);
    this.renderer.render(this.scene, this.camera);
  }
}

function initGame() {
  try {
    if (!window.__gameInstance) {
      window.__gameInstance = new Game();
    }
  } catch (err) {
    console.error('Fatal Game initialization error:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}
