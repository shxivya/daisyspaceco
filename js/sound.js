// ── AMBIENT SOUNDSCAPE ENGINE v2 ──
// Completely rewritten for softness and realism.

let soundCtx = null;
let soundActive = null;      // 'piano' | 'lofi' | 'chimes' | null
let pianoAudioEl = null;     // HTMLAudioElement for the piano track
let soundMasterGain = null;
let soundNodes = [];
let soundChimeTimer = null;
let soundPanelOpen = false;

function getSoundCtx() {
    if (!soundCtx) soundCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (soundCtx.state === 'suspended') soundCtx.resume();
    return soundCtx;
}

// ── PANEL TOGGLE ──
function toggleSoundPanel() {
    soundPanelOpen = !soundPanelOpen;
    const panel = document.getElementById('soundPanel');
    const btn = document.getElementById('soundToggleBtn');

    if (soundPanelOpen) {
        // Position panel directly below the sound button (body-level element)
        const rect = btn.getBoundingClientRect();
        panel.style.top = (rect.bottom + 10) + 'px';
        // Align right edge of panel with right edge of button
        const panelWidth = 200;
        let left = rect.right - panelWidth;
        if (left < 8) left = 8; // don't go off-screen left
        panel.style.left = left + 'px';
        panel.style.right = 'auto';
    }

    panel.classList.toggle('open', soundPanelOpen);
    btn.setAttribute('aria-expanded', soundPanelOpen);
    if (soundPanelOpen) {
        setTimeout(() => document.addEventListener('click', closeSoundPanelOutside, { once: true }), 50);
    }
}

function closeSoundPanelOutside(e) {
    const wrap = document.getElementById('soundToggleWrap');
    if (wrap && !wrap.contains(e.target)) {
        closeSoundPanel();
    } else if (soundPanelOpen) {
        setTimeout(() => document.addEventListener('click', closeSoundPanelOutside, { once: true }), 50);
    }
}

function closeSoundPanel() {
    soundPanelOpen = false;
    document.getElementById('soundPanel').classList.remove('open');
    document.getElementById('soundToggleBtn').setAttribute('aria-expanded', 'false');
}

// ── SELECT & START ──
function selectSound(id) {
    if (soundActive === id) { stopSound(); return; }
    stopSound(false);

    const vol = parseInt(document.getElementById('soundVolumeSlider').value, 10) / 100;
    getSoundCtx();

    if (id === 'piano') startPianoSound(vol);
    else if (id === 'chimes') startChimesSound(vol);

    soundActive = id;

    document.querySelectorAll('.sound-option-btn').forEach(b => b.classList.toggle('active', b.dataset.sound === id));
    document.getElementById('soundStopBtn').style.display = 'block';
    document.getElementById('soundToggleBtn').classList.add('sound-on');
    document.getElementById('soundBtnIcon').textContent = '♬';
}

function stopSound(resetUI = true) {
    if (soundMasterGain && soundCtx) {
        try { soundMasterGain.gain.setTargetAtTime(0, soundCtx.currentTime, 0.5); } catch (e) { }
        const g = soundMasterGain;
        setTimeout(() => { try { g.disconnect(); } catch (e) { } }, 1500);
        soundMasterGain = null;
    }
    soundNodes.forEach(n => { try { if (n.stop) n.stop(); n.disconnect(); } catch (e) { } });
    soundNodes = [];
    if (soundChimeTimer) { clearTimeout(soundChimeTimer); soundChimeTimer = null; }
    // Stop the piano element if it's playing
    if (pianoAudioEl) {
        pianoAudioEl.pause();
        pianoAudioEl.currentTime = 0;
        pianoAudioEl = null;
    }
    soundActive = null;

    if (resetUI) {
        document.querySelectorAll('.sound-option-btn').forEach(b => b.classList.remove('active'));
        document.getElementById('soundStopBtn').style.display = 'none';
        document.getElementById('soundToggleBtn').classList.remove('sound-on');
        document.getElementById('soundBtnIcon').textContent = '♪';
    }
}

function setSoundVolume(val) {
    const v = val / 100;
    if (soundMasterGain && soundCtx) {
        try { soundMasterGain.gain.setTargetAtTime(v, soundCtx.currentTime, 0.15); } catch (e) { }
    }
    // If piano is playing via fallback (direct audio element), update its volume too
    if (pianoAudioEl) {
        pianoAudioEl.volume = v;
    }
}

// ─────────────────────────────────────────────
// 🎹 PIANO — plays the MP3 directly as HTML5 audio
// (bypasses Web Audio API to avoid file:// muting)
// ─────────────────────────────────────────────
function startPianoSound(vol) {
    // Do NOT route piano through Web Audio — createMediaElementSource
    // silently mutes audio in browsers when opened via file:// protocol.
    // Instead, use a plain HTMLAudioElement with direct volume control.
    const audio = new Audio('mc_music-relaxing-piano-music-123845.mp3');
    audio.loop = true;
    audio.volume = Math.max(0, Math.min(1, vol));

    audio.play().catch(err => {
        console.error('Piano playback failed:', err);
    });

    pianoAudioEl = audio;
    soundNodes = [];
    // soundMasterGain is not used for piano — volume is controlled via pianoAudioEl.volume directly
    soundMasterGain = null;
}

// ─────────────────────────────────────────────────────────────────
// 🎵  LO-FI HUM  — warm vinyl room tone, like a cozy rainy café
// ─────────────────────────────────────────────────────────────────
function startLofiSound(vol) {
    const ctx = getSoundCtx();
    const master = ctx.createGain();
    master.gain.value = vol;
    master.connect(ctx.destination);
    soundMasterGain = master;

    const nodes = [];

    // --- Brown noise base (low rumble warmth) ---
    const bufLen = ctx.sampleRate * 4;
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < bufLen; i++) {
        const w = Math.random() * 2 - 1;
        last = (last + 0.02 * w) / 1.02;
        d[i] = last * 4;
    }
    const brownSrc = ctx.createBufferSource();
    brownSrc.buffer = buf;
    brownSrc.loop = true;

    const brownLP = ctx.createBiquadFilter();
    brownLP.type = 'lowpass';
    brownLP.frequency.value = 200; // very warm, low-end only
    const brownG = ctx.createGain();
    brownG.gain.value = 0.18;

    brownSrc.connect(brownLP); brownLP.connect(brownG); brownG.connect(master);
    brownSrc.start();
    nodes.push(brownSrc, brownLP, brownG);

    // --- Vinyl surface hiss (very faint, adds life) ---
    const hissBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const hissD = hissBuf.getChannelData(0);
    for (let i = 0; i < hissBuf.length; i++) hissD[i] = Math.random() * 2 - 1;
    const hissSrc = ctx.createBufferSource();
    hissSrc.buffer = hissBuf;
    hissSrc.loop = true;

    const hissHP = ctx.createBiquadFilter();
    hissHP.type = 'highpass';
    hissHP.frequency.value = 4000; // only the top-end hiss
    const hissG = ctx.createGain();
    hissG.gain.value = 0.04; // barely audible

    hissSrc.connect(hissHP); hissHP.connect(hissG); hissG.connect(master);
    hissSrc.start();
    nodes.push(hissSrc, hissHP, hissG);

    // --- Warm tonal hum — stacked detuned sines (like an amp hum) ---
    // These are in the 60-240Hz range — felt more than heard, warm & cozy
    [[60, 0.09], [80, 0.06], [120, 0.045], [160, 0.025], [240, 0.012]].forEach(([freq, amp]) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        // Slight detune for warmth (avoids clinical purity)
        osc.frequency.value = freq + (Math.random() * 0.8 - 0.4);
        const g = ctx.createGain();
        g.gain.value = amp;
        osc.connect(g); g.connect(master);
        osc.start();
        nodes.push(osc, g);
    });

    // --- Very slow wow-and-flutter LFO (vinyl character) ---
    const flutter = ctx.createOscillator();
    flutter.type = 'sine';
    flutter.frequency.value = 0.15; // slow pitch wobble
    const flutterGain = ctx.createGain();
    flutterGain.gain.value = 0.005;
    flutter.connect(flutterGain);
    flutterGain.connect(master.gain);
    flutter.start();
    nodes.push(flutter, flutterGain);

    soundNodes = nodes;
}

// ─────────────────────────────────────────────────────────────────────────
// 🔔  WIND CHIMES  — low, mellow, pentatonic glass-bowl chimes with reverb
// ─────────────────────────────────────────────────────────────────────────

// Much lower, mellow frequencies — D pentatonic in the 2nd-3rd octave (calm register)
const CHIME_FREQS = [146.83, 164.81, 185.00, 220.00, 246.94, 293.66, 329.63];
//                    D3      E3      F#3     A3       B3      D4      E4

function makeSoftReverb(ctx, master) {
    // Simple reverb via stereo delay feedback
    const delay1 = ctx.createDelay(3);
    delay1.delayTime.value = 0.28;
    const delay2 = ctx.createDelay(3);
    delay2.delayTime.value = 0.21;

    const fbGain = ctx.createGain();
    fbGain.gain.value = 0.32; // gentle feedback

    const wetGain = ctx.createGain();
    wetGain.gain.value = 0.22; // reverb blend

    delay1.connect(delay2);
    delay2.connect(fbGain);
    fbGain.connect(delay1); // feedback loop
    delay2.connect(wetGain);
    wetGain.connect(master);

    return delay1; // connect source here
}

function pingChime(master, ctx) {
    const freq = CHIME_FREQS[Math.floor(Math.random() * CHIME_FREQS.length)];
    const now = ctx.currentTime;

    // Very soft peak amplitude — chimes are delicate, not loud
    const peakGain = 0.06 + Math.random() * 0.04; // 0.06 – 0.10 only

    // Reverb send
    const reverbIn = makeSoftReverb(ctx, master);

    // Primary tone — pure sine (glass bowl quality)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = freq;

    const env1 = ctx.createGain();
    env1.gain.setValueAtTime(0, now);
    env1.gain.linearRampToValueAtTime(peakGain, now + 0.012); // gentle attack
    env1.gain.setTargetAtTime(0, now + 0.1, 1.8); // looooong tail

    // Second overtone — very soft, adds air (2nd harmonic)
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = freq * 2.003; // nearly perfect octave (glass resonance)

    const env2 = ctx.createGain();
    env2.gain.setValueAtTime(0, now);
    env2.gain.linearRampToValueAtTime(peakGain * 0.25, now + 0.012);
    env2.gain.setTargetAtTime(0, now + 0.05, 0.9); // decays faster than fundamental

    // Route to both direct output AND reverb
    osc1.connect(env1); env1.connect(master); env1.connect(reverbIn);
    osc2.connect(env2); env2.connect(master); env2.connect(reverbIn);

    osc1.start(now); osc1.stop(now + 7);
    osc2.start(now); osc2.stop(now + 4);
}

function startChimesSound(vol) {
    const ctx = getSoundCtx();
    const master = ctx.createGain();
    master.gain.value = vol;
    master.connect(ctx.destination);
    soundMasterGain = master;
    soundNodes = [];

    // Occasional soft breeze noise between chimes (barely audible)
    const breezeBuf = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
    const breezeD = breezeBuf.getChannelData(0);
    for (let i = 0; i < breezeBuf.length; i++) breezeD[i] = Math.random() * 2 - 1;
    const breezeSrc = ctx.createBufferSource();
    breezeSrc.buffer = breezeBuf;
    breezeSrc.loop = true;

    const breezeLP = ctx.createBiquadFilter();
    breezeLP.type = 'lowpass';
    breezeLP.frequency.value = 300;
    const breezeG = ctx.createGain();
    breezeG.gain.value = 0.025; // very subtle background air

    breezeSrc.connect(breezeLP); breezeLP.connect(breezeG); breezeG.connect(master);
    breezeSrc.start();
    soundNodes.push(breezeSrc, breezeLP, breezeG);

    function scheduleNext() {
        if (soundActive !== 'chimes') return;
        pingChime(master, ctx);
        // Random interval: 2.5s – 6s (unhurried, natural)
        soundChimeTimer = setTimeout(scheduleNext, 2500 + Math.random() * 3500);
    }

    // First chime after a short pause
    soundChimeTimer = setTimeout(scheduleNext, 800 + Math.random() * 1200);
}
