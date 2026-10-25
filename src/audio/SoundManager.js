// Procedural Web Audio API sound generator with soft, smooth, ear-friendly tones
// Includes a DynamicsCompressorNode to prevent harsh clipping or ear fatigue.

export class SoundManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.compressor = null;
    this.isMuted = false;
    this.volume = 0.5; // Smooth, ear-comfortable default (50%)

    // Motor oscillators & gains
    this.motorOsc = null;
    this.motorSubOsc = null;
    this.motorGain = null;
    this.isMotorRunning = false;

    // Viral Bengali Satirical Meme Quotes
    this.quotes = [
      'আমি ছোট আমাকে মারবেন না (Ami choto amk marben na)!',
      'আমার কোনো দোষ নাই মামা!',
      'গতি বাড়ে, চার্জও যায় মামা!',
      'রাস্তা কি তোর বাপের?!',
      'চা খাওয়ার টাকাটা দিয়া যান মামা!',
      'আমি ঠিকই চলছিলাম, রাস্তাটাই তো উল্টা ছিল!',
      'ভিডিও কইরেন না ভাই, ফেসবুকে দিয়েন না!',
      'আইছে আমার দেশি টেসলা!',
      'কানের পর্দা ফাটায়ে দিলো রে!',
      'খিচুড়ি খাইতে ইউরোপ যাই!',
      '৫০০ টাকা জরিমানা বাইর কর!',
      'বাঁশের রড দিয়া ব্রিজ বানাইছি!',
      'বালিশ তুলতে ৭০০০ টাকা লাগে!'
    ];

    // Authentic Auto-Rickshaw Pep-Pep Horn
    this.pepPepBuffer = null;
    this.rawPepPepData = null;
    this.pepPepAudio = (typeof window !== 'undefined') ? new Audio('/audio/pep_pep_horn.wav') : null;
    if (this.pepPepAudio) this.pepPepAudio.preload = 'auto';

    this.preloadAutoHorn();
  }

  async preloadAutoHorn() {
    if (typeof window === 'undefined') return;
    try {
      const res = await fetch('/audio/pep_pep_horn.wav');
      if (res.ok) this.rawPepPepData = await res.arrayBuffer();

      if (this.ctx && !this.pepPepBuffer) {
        this.decodeAutoHorn();
      }
    } catch (e) {
      console.warn('Preload pep pep horn failed:', e);
    }
  }

  async decodeAutoHorn() {
    if (!this.ctx || this.isLoadingHorn) return;
    this.isLoadingHorn = true;
    try {
      if (this.rawPepPepData && !this.pepPepBuffer) {
        const copy = this.rawPepPepData.slice(0);
        this.pepPepBuffer = await this.ctx.decodeAudioData(copy);
      }
    } catch (e) {
      console.warn('Decode pep pep horn error:', e);
    } finally {
      this.isLoadingHorn = false;
    }
  }

  async preloadKiRagKorla() {
    // Disabled / Off: "STOP THE ALL TIME RAG KORLA OFF THAT"
    return;
  }

  async decodeKiRagKorla() {
    return;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      // Dynamics Compressor: Prevents sudden harsh volume peaks or ear discomfort
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-24, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(30, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(12, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

      // Master Gain Node for smooth, ear-pleasing volume control
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      this.masterGain.connect(this.compressor);
      this.compressor.connect(this.ctx.destination);

      if (this.rawKiRagKorlaData && !this.kiRagKorlaBuffer) {
        this.decodeKiRagKorla();
      }
      if (this.rawPepPepData && !this.pepPepBuffer) {
        this.decodeAutoHorn();
      }
    } catch (e) {
      console.warn('AudioContext init error:', e);
    }
  }

  ensureContext() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
      // Hardware audio unlock buffer for mobile iOS / Android webkit
      try {
        const dummy = this.ctx.createBuffer(1, 1, 22050);
        const src = this.ctx.createBufferSource();
        src.buffer = dummy;
        src.connect(this.ctx.destination);
        src.start(0);
      } catch (e) {}
    }
    if (!this.pepPepBuffer && !this.isLoadingHorn) {
      if (this.rawPepPepData) {
        this.decodeAutoHorn();
      } else {
        this.preloadAutoHorn();
      }
    }
  }

  setVolume(volPercent) {
    this.volume = Math.max(0, Math.min(1, volPercent / 100));
    if (this.masterGain && this.ctx) {
      const targetGain = this.isMuted ? 0 : this.volume;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
    }
  }

  // Soft, smooth electric purr (No harsh sawtooth waves!)
  startMotorSound() {
    if (!this.ctx || this.isMotorRunning) return;
    try {
      this.motorOsc = this.ctx.createOscillator();
      this.motorSubOsc = this.ctx.createOscillator();
      this.motorGain = this.ctx.createGain();

      // Use gentle sine & warm triangle waves instead of buzzy sawtooth
      this.motorOsc.type = 'sine';
      this.motorSubOsc.type = 'triangle';

      this.motorOsc.frequency.setValueAtTime(65, this.ctx.currentTime);
      this.motorSubOsc.frequency.setValueAtTime(32.5, this.ctx.currentTime);

      // Warm lowpass filter to remove any high-frequency shrillness
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, this.ctx.currentTime);

      // Subtle, background-level volume
      this.motorGain.gain.setValueAtTime(0.012, this.ctx.currentTime);

      this.motorOsc.connect(filter);
      this.motorSubOsc.connect(filter);
      filter.connect(this.motorGain);
      this.motorGain.connect(this.masterGain);

      this.motorOsc.start();
      this.motorSubOsc.start();
      this.isMotorRunning = true;
    } catch (e) {
      console.warn('Audio motor start error:', e);
    }
  }

  stopMotorSound() {
    if (!this.isMotorRunning) return;
    try {
      if (this.motorGain && this.ctx) {
        this.motorGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.08);
      }
      setTimeout(() => {
        try {
          this.motorOsc?.stop();
          this.motorSubOsc?.stop();
          this.motorOsc?.disconnect();
          this.motorSubOsc?.disconnect();
        } catch (e) {}
        this.isMotorRunning = false;
      }, 100);
    } catch (e) {
      this.isMotorRunning = false;
    }
  }

  updateMotor(speedNormalized) {
    if (!this.ctx || !this.motorOsc || !this.isMotorRunning || this.isMuted) return;
    try {
      // Gentle pitch rise: 65Hz to 160Hz (warm electric motor hum)
      const freq = 65 + speedNormalized * 95;
      const subFreq = 32.5 + speedNormalized * 47.5;
      // Soft volume scaling: 0.012 idle up to 0.032 max speed
      const vol = 0.012 + speedNormalized * 0.02;

      this.motorOsc.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.08);
      this.motorSubOsc.frequency.setTargetAtTime(subFreq, this.ctx.currentTime, 0.08);
      this.motorGain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.08);
    } catch (e) {}
  }

  // Authentic Auto-Rickshaw "Pep-Pep!" (প্যাঁক-প্যাঁক / পিপ-পিপ) Double-Honk Horn
  playPepPepHorn() {
    this.ensureContext();
    if (this.isMuted) return;

    // 1. Studio Audio Buffer Source (Direct to destination for maximum clarity)
    if (this.ctx && this.pepPepBuffer) {
      try {
        const src = this.ctx.createBufferSource();
        src.buffer = this.pepPepBuffer;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(1.0, this.ctx.currentTime);
        src.connect(gain);
        gain.connect(this.ctx.destination);
        src.start(0);
      } catch (e) {}
    }

    // 2. Direct HTML5 Audio playback (Guaranteed on iOS Safari & Android mobile phone speakers)
    try {
      const a = new Audio('/audio/pep_pep_horn.wav');
      a.volume = 1.0;
      const p = a.play();
      if (p !== undefined) {
        p.catch(() => {
          const a2 = new Audio('/audio/auto_horn.mp3');
          a2.volume = 1.0;
          a2.play().catch(() => {});
        });
      }
    } catch (e) {}

    // 3. Piercing 12V Electric Dual-Disc Synthetic Horn (loud, crisp, high-frequency for phone speakers)
    if (this.ctx) {
      try {
        const now = this.ctx.currentTime;
        const vol = 1.0;

        // Burst 1: First "PEP!" (0.00s -> 0.09s)
        this.triggerSingleHonkBurst(now, 0.095, 620, 780, vol);

        // Burst 2: Second "PEP!" (0.13s -> 0.23s)
        this.triggerSingleHonkBurst(now + 0.135, 0.105, 640, 800, vol);
      } catch (err) {}
    }
  }

  // Alias for backwards compatibility with any trigger calls
  playHydraulicHorn() {
    this.playPepPepHorn();
  }

  // Helper: Generates a single metallic "PEP!" burst with dual disc harmonics and bite
  triggerSingleHonkBurst(startTime, duration, f1, f2, volume) {
    if (!this.ctx) return;

    // Dual disc frequencies (characteristic Bangladeshi electric auto-rickshaw horn)
    [f1, f2].forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, startTime);

      // Peaking filter to boost piercing metallic horn resonance (~1600 Hz)
      filter.type = 'peaking';
      filter.frequency.setValueAtTime(1600, startTime);
      filter.gain.setValueAtTime(6.0, startTime);
      filter.Q.setValueAtTime(1.2, startTime);

      // Sharp, punchy ADSR envelope for instant "PEP" impact
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.65 * volume, startTime + 0.005);
      gain.gain.setValueAtTime(0.65 * volume, startTime + duration - 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      // Connect directly to destination for guaranteed loud, uncompressed playback!
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.01);
    });

    // High harmonic metallic disc click/bite
    try {
      const biteOsc = this.ctx.createOscillator();
      const biteGain = this.ctx.createGain();
      biteOsc.type = 'square';
      biteOsc.frequency.setValueAtTime(1920, startTime);

      biteGain.gain.setValueAtTime(0.25 * volume, startTime);
      biteGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.045);

      biteOsc.connect(biteGain);
      biteGain.connect(this.ctx.destination);

      biteOsc.start(startTime);
      biteOsc.stop(startTime + 0.05);
    } catch (e) {}
  }

  // Charming, sweet Rickshaw Bell chime ("টুং-টুং")
  playRickshawBell() {
    if (!this.ctx || this.isMuted || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime + 0.06;
      [1480, 1960].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.09);

        gain.gain.setValueAtTime(0.06, now + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.09 + 0.22);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.24);
      });
    } catch (e) {}
  }

  // Soft, satisfying collision bump (warm low-end thud, not piercing static)
  playCrashSound(intensity = 1.0) {
    this.ensureContext();
    if (!this.ctx || this.isMuted || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.22);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Pinkish/brownish noise for a softer, warmer thud
      let last = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (last + (0.02 * white)) / 1.02;
        last = data[i];
        data[i] *= 3.5;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      // Lowpass filter to keep only the low-end thud
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320 * Math.min(intensity, 1.2), now);
      filter.frequency.exponentialRampToValueAtTime(50, now + 0.2);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(Math.min(0.20 * intensity, 0.25), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(now);
    } catch (e) {}
  }

  // Pleasant, gentle coin pickup chime

  // Comic "DHAPASH!" / "DHOM!" Punchy Cartoon Impact Sound
  playDhapashSound() {
    this.ensureContext();
    if (!this.ctx || this.isMuted || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Comic punch body (overdriven triangle with bouncy pitch dive)
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.28);

      oscGain.gain.setValueAtTime(0.28, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(oscGain);
      oscGain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.32);

      // 2. Comic slap noise transient
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.12);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.025));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1200, now);
      noiseFilter.Q.setValueAtTime(1.8, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.24, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      noise.start(now);
    } catch (e) {}
  }

  // Play authentic shouted voice audio clip
  playGaliShoutSound() {
    if (this.isMuted) return;
    const now = Date.now();
    if (this.lastGaliSoundTime && now - this.lastGaliSoundTime < 450) return;
    this.lastGaliSoundTime = now;

    if (this.galiAudios && this.galiAudios.length > 0) {
      const idx = Math.floor(Math.random() * this.galiAudios.length);
      const audio = this.galiAudios[idx];
      try {
        audio.currentTime = 0;
        audio.volume = 0.95;
        audio.play().catch(() => {});
      } catch (e) {}
    }
  }

  // Phonetic Banglish translation for universal voice fallback on Windows/Chrome
  getBanglishTranslation(bnText) {
    if (!bnText) return 'Arey bhai dekhe chalan!';
    if (bnText.includes('বাপের')) return 'Rasta ki tor baper?!';
    if (bnText.includes('ফুটপাতে')) return 'Footpate gari uthaiya manush maren?!';
    if (bnText.includes('সার্জেন্ট')) return 'Sergeant ke dhakka?! License batil koira dimu!';
    if (bnText.includes('দোকান')) return 'Dokan bhainga shob shesh koira dilen!';
    if (bnText.includes('চা-বিস্কুট')) return 'Cha biscuit shob draine porlo!';
    if (bnText.includes('মিটার')) return 'Meter chole na mama! Fixed 300 taka!';
    if (bnText.includes('সিএনজি')) return 'CNG walahr shathe tokkor?! Mirpur 10 chenen?!';
    if (bnText.includes('গ্যাস')) return 'Gas nai cylindere, abar piche guta maren!';
    if (bnText.includes('চৌরাস্তা')) return 'Chourastay laal baati dekhen na miya?!';
    if (bnText.includes('পিলার')) return 'Pillar er shathe juddho badhaicho ni?!';
    if (bnText.includes('গোলচত্বর')) return 'Golchottore gari uthaiya dili kano re?!';
    if (bnText.includes('হাড়গোড়')) return 'Har gor bhainga dilen bhai re bhai!';
    if (bnText.includes('খুঁটি')) return 'Boidyutik khutite guta marla?!';
    if (bnText.includes('চুরমার')) return 'Churmar koira dilen!';
    return 'Arey bhai dekhe chalan! Rasta ki tor baper?!';
  }

  // Voice Speech Synthesis for Dhaka Street Gali
  speakGali(text) {
    if (this.isMuted) return;
    const now = Date.now();
    if (now - (this.lastVoiceTime || 0) < 3200) return; // Strict throttle: no spamming speech!
    this.lastVoiceTime = now;

    // 1. ALWAYS play real audible shouted voice audio clip
    this.playGaliShoutSound();

    // 2. Browser Voice Speech: Cancel any queued speech backlog first so speech NEVER plays continuously!
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const voices = window.speechSynthesis.getVoices();
      const bnVoice = voices.find(v => v.lang && (v.lang.startsWith('bn') || v.lang.includes('Bengali') || v.lang.includes('Bangla')));

      let utt;
      if (bnVoice) {
        const clean = text.replace(/[^ঀ-৿a-zA-Z0-9\s!?,]/g, '');
        utt = new SpeechSynthesisUtterance(clean);
        utt.voice = bnVoice;
        utt.lang = bnVoice.lang;
      } else {
        // Universal fallback: speak phonetic Banglish so Windows/Chrome ALWAYS outputs audible speech!
        const banglish = this.getBanglishTranslation(text);
        utt = new SpeechSynthesisUtterance(banglish);
        utt.lang = 'en-US';
      }

      utt.rate = 1.25;
      utt.pitch = 1.25;
      utt.volume = 1.0;

      window.speechSynthesis.speak(utt);
    } catch (e) {}
  }

  // Authentic High-Energy Rickshawala Driver Voice Speech & Audio
  speakDriverVoice(text) {
    if (this.isMuted) return;
    const now = Date.now();
    if (now - (this.lastDriverVoiceTime || 0) < 3200) return; // Strict throttle: no spamming!
    this.lastDriverVoiceTime = now;

    // 1. Play energetic driver horn/bell tone
    this.playDriverShoutSound();

    // 2. Browser Voice Speech Output: Clear any pending speech backlog
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const voices = window.speechSynthesis.getVoices();
      const bnVoice = voices.find(v => v.lang && (v.lang.startsWith('bn') || v.lang.includes('Bengali') || v.lang.includes('Bangla')));

      let utt;
      if (bnVoice) {
        const clean = text.replace(/[^ঀ-৿a-zA-Z0-9\s!?,]/g, '');
        utt = new SpeechSynthesisUtterance(clean);
        utt.voice = bnVoice;
        utt.lang = bnVoice.lang;
      } else {
        const banglish = this.getDriverBanglishTranslation(text);
        utt = new SpeechSynthesisUtterance(banglish);
        utt.lang = 'en-US';
      }

      utt.rate = 1.28;
      utt.pitch = 1.38; // Energetic, sharp driver tone
      utt.volume = 1.0;
      window.speechSynthesis.speak(utt);
    } catch (e) {}
  }

  getDriverBanglishTranslation(bnText) {
    if (!bnText) return 'Arey mama side ektu charen! Nawab er rickshaw!';
    if (bnText.includes('টার্বো')) return 'Turbo speed active! Side den mama nawab jaaitase!';
    if (bnText.includes('চার্জ')) return 'Battery charge full! Nawab ekhon rocket!';
    if (bnText.includes('ঘুরায়া')) return 'Ghuraya disi nawab! Side den!';
    if (bnText.includes('ব্রেক')) return 'Brake kaje kore na mama! Side den!';
    if (bnText.includes('ফুটপাত')) return 'Footpateo rickshaw cholbo! Deshi Tesla!';
    if (bnText.includes('নবাব')) return 'Rastar nawab aaitase! Side den!';
    if (bnText.includes('ভিআইপি')) return 'Rastar nawab namsi! Side den VIP!';
    return 'Arey mama side ektu charen! Nawab jaaitase!';
  }

  playDriverShoutSound() {
    this.ensureContext();
    if (!this.ctx || this.isMuted || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.23);
    } catch (e) {}
  }

  // Futuristic Roadside Electric Fast-Charge Sound
  playChargingSound() {
    this.ensureContext();
    if (!this.ctx || this.isMuted || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(1450, now + 0.55);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.30, now + 0.18);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.68);
    } catch (e) {}
  }

  playPartPickupSound() {
    this.ensureContext();
    if (!this.ctx || this.isMuted || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [392, 523, 659]; // G4, C5, E5 (sweet major chord)
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.04);

        gain.gain.setValueAtTime(0.08, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.14);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.16);
      });
    } catch (e) {}
  }

  // Soft, melodic Taka chime
  playTakaChingSound(value = 500) {
    this.ensureContext();
    if (!this.ctx || this.isMuted || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const baseFreq = value === 2000 ? 1046 : (value === 1000 ? 880 : 784);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  }

  // Gentle aerodynamic boost whoosh
  playTurboSound() {
    this.ensureContext();
    if (!this.ctx || this.isMuted || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(380, now + 0.35);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {}
  }


  // Dynamic Asphalt Tire Drift Screech Sound
  playTireScreech() {
    this.ensureContext();
    if (!this.ctx || this.isMuted || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(850, now);
      filter.frequency.exponentialRampToValueAtTime(1400, now + 0.15);
      filter.frequency.exponentialRampToValueAtTime(700, now + 0.45);
      filter.Q.value = 4.0;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.linearRampToValueAtTime(680, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.45);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.20, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.46);
    } catch (e) {}
  }

  // Natural Bengali Meme Quote (Visual text display, no robotic TTS voice)
  shoutBengaliQuote(quoteOverride = null) {
    if (this.isMuted) return '';
    return quoteOverride || this.quotes[Math.floor(Math.random() * this.quotes.length)];
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const targetGain = this.isMuted ? 0 : this.volume;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.04);
    }
    return this.isMuted;
  }

  // Authentic Dhaka Traffic Police Whistle (dual-tone trill)
  playPoliceWhistle() {
    this.ensureContext();
    if (!this.ctx || this.isMuted || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const duration = 0.45;

      // Tone 1: 2600 Hz
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(2600, now);

      // Tone 2: 2920 Hz (creating realistic beat frequency / trill)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(2920, now);

      // Trill modulation LFO (16 Hz)
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(16, now);
      lfoGain.gain.setValueAtTime(140, now);
      lfo.connect(osc1.frequency);
      lfo.connect(osc2.frequency);

      // Envelope
      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.18, now + 0.04);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + duration);

      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.linearRampToValueAtTime(0.18, now + 0.04);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc1.connect(gain1);
      gain1.connect(this.masterGain);

      osc2.connect(gain2);
      gain2.connect(this.masterGain);

      lfo.start(now);
      osc1.start(now);
      osc2.start(now);

      lfo.stop(now + duration + 0.05);
      osc1.stop(now + duration + 0.05);
      osc2.stop(now + duration + 0.05);
    } catch (e) {}
  }

  // Ki Rag Korla: Completely OFF / Disabled by user request
  playKiRagKorlaMusic() {
    return;
  }

}
