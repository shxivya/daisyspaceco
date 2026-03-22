// ── ZEN HUB & MINI-GAMES ──

let zenState = {
    activeGame: null,
    active: false,
    width: 0,
    height: 0,
    mouse: { x: -1000, y: -1000 },
    lastFrame: 0
};

let petalGame = {
    petals: [],
    maxPetals: 22,
    ripples: []
};

let breathGame = {
    timer: null,
    phase: 'in', // 'in' or 'out'
    step: 0
};

let lightGame = {
    words: ["rest", "gentle", "okay", "breathe", "peace", "soft", "light", "enough", "patience", "kindness", "still", "bloom"],
    active: false,
    elements: []
};

let starlightGame = {
    stars: [],
    selectedStars: [],
    audioCtx: null,
    active: false
};

// Petal palette — soft gradients defined by two stops
const PETAL_PALETTE = [
    { a: '#f9b4ca', b: '#f2c6cf' }, // rose blush
    { a: '#d6b4f5', b: '#e8d6fb' }, // lilac
    { a: '#9fd8cb', b: '#cfe7d6' }, // seafoam
    { a: '#ffd6a5', b: '#f6e7a5' }, // apricot butter
    { a: '#ffb7c5', b: '#ffd6e0' }, // cherry blossom
    { a: '#c9b4f5', b: '#d6cfea' }, // lavender
    { a: '#f5c8e0', b: '#fde0ef' }, // petal pink
    { a: '#b5d8f0', b: '#d0eafa' }, // sky blue
];

// SVG path shapes — proper organic petals
const PETAL_PATHS = [
    // Elongated teardrop petal
    'M0,-22 C8,-15 12,0 0,22 C-12,0 -8,-15 0,-22Z',
    // Wide rounded cherry-blossom petal
    'M0,-20 C14,-20 20,-8 14,8 C8,20 -8,20 -14,8 C-20,-8 -14,-20 0,-20Z',
    // Asymmetric leaf petal
    'M0,-24 C10,-16 18,0 8,18 C4,24 -6,20 -10,10 C-18,-4 -8,-20 0,-24Z',
    // Slim pointed petal
    'M0,-26 C5,-14 6,2 0,28 C-6,2 -5,-14 0,-26Z',
    // Rounded heart-petal
    'M0,-18 C4,-26 16,-24 16,-12 C16,0 8,12 0,22 C-8,12 -16,0 -16,-12 C-16,-24 -4,-26 0,-18Z',
];

let petalGustTimer = 0;
let petalWindX = 0; // current global horizontal wind

function initZen() {
    showZenMenu();
    handleZenResize();
    window.addEventListener('resize', handleZenResize);

    // Global mouse tracking for Zen Canvas
    const canvas = document.getElementById('zenCanvas');
    if (canvas) {
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            zenState.mouse.x = e.clientX - rect.left;
            zenState.mouse.y = e.clientY - rect.top;
        });
        canvas.addEventListener('mouseleave', () => {
            zenState.mouse.x = -1000;
            zenState.mouse.y = -1000;
        });
        canvas.addEventListener('mousedown', (e) => {
            if (zenState.activeGame === 'petal') {
                const rect = canvas.getBoundingClientRect();
                createRipple(e.clientX - rect.left, e.clientY - rect.top);
            }
        });
    }

    // Mouse tracking for Light Finder
    const lightCanvas = document.getElementById('lightCanvas');
    if (lightCanvas) {
        lightCanvas.addEventListener('mousemove', (e) => {
            const rect = lightCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            lightCanvas.style.setProperty('--orb-x', x + 'px');
            lightCanvas.style.setProperty('--orb-y', y + 'px');
        });
    }
}

function handleZenResize() {
    const canvas = document.getElementById('zenCanvas');
    if (canvas) {
        const rect = canvas.getBoundingClientRect();
        zenState.width = rect.width;
        zenState.height = rect.height;
    }

    // Resize starlight line canvas
    const starlightCanvas = document.getElementById('starlightLineCanvas');
    if (starlightCanvas) {
        const rect = starlightCanvas.parentElement.getBoundingClientRect();
        starlightCanvas.width = rect.width;
        starlightCanvas.height = rect.height;
        if (zenState.activeGame === 'starlight') drawStarlightLines();
    }
}

// ── HUB NAVIGATION ──
function showZenMenu() {
    stopCurrentZen();
    document.getElementById('zenMenu').style.display = 'grid';
    document.getElementById('zenGameView').style.display = 'none';
    document.querySelector('.zen-header').classList.add('hub-view');

    // Restore default Hub title and subtitle
    const title = document.getElementById('zenTitle');
    const subtitle = document.getElementById('zenSubtitle');
    if (title) title.innerHTML = 'The <em>Zen</em> Hub';
    if (subtitle) subtitle.textContent = 'Choose a gentle way to spend a few moments.';
}

function startZenGame(gameId) {
    zenState.activeGame = gameId;
    document.getElementById('zenMenu').style.display = 'none';
    document.getElementById('zenGameView').style.display = 'flex';
    document.querySelector('.zen-header').classList.remove('hub-view');

    // Update title and subtitle based on game
    const title = document.getElementById('zenTitle');
    const subtitle = document.getElementById('zenSubtitle');
    const gameNames = {
        'petal': { name: 'Petal Drift', intro: 'Interact with soft, floating petals.' },
        'breath': { name: 'Breathing Bloom', intro: 'Follow a gentle rhythm of breath.' },
        'light': { name: 'Light Finder', intro: 'Uncover hidden words with a soft glow.' },
        'starlight': { name: 'Starlight Whisper', intro: 'Connect stars and watch them bloom.' }
    };

    if (title && gameNames[gameId]) title.textContent = gameNames[gameId].name;
    if (subtitle && gameNames[gameId]) subtitle.textContent = gameNames[gameId].intro;

    // Hide all sub pages
    document.querySelectorAll('.zen-sub-page').forEach(p => p.style.display = 'none');

    if (gameId === 'petal') {
        document.getElementById('petalDriftGame').style.display = 'block';
        document.getElementById('zenResetBtn').style.display = 'block';
        initPetalGame();
    } else if (gameId === 'breath') {
        document.getElementById('breathingGame').style.display = 'block';
        document.getElementById('zenResetBtn').style.display = 'none';
        initBreathingGame();
    } else if (gameId === 'light') {
        document.getElementById('lightFinderGame').style.display = 'block';
        document.getElementById('zenResetBtn').style.display = 'block';
        initLightFinder();
    } else if (gameId === 'starlight') {
        document.getElementById('starlightGame').style.display = 'block';
        document.getElementById('zenResetBtn').style.display = 'block';
        initStarlightGame();
    }
}

function stopCurrentZen() {
    zenState.active = false;
    petalGame.petals.forEach(p => p.el.remove());
    petalGame.petals = [];
    if (breathGame.timer) {
        clearInterval(breathGame.timer);
        clearTimeout(breathGame.timer);
    }
    lightGame.active = false;
    starlightGame.active = false;
    starlightGame.stars.forEach(s => s.el.remove());
    starlightGame.stars = [];
    starlightGame.selectedStars = [];
    zenState.activeGame = null;
}

function resetCurrentZen() {
    if (zenState.activeGame === 'petal') initPetalGame();
    if (zenState.activeGame === 'light') initLightFinder();
    if (zenState.activeGame === 'starlight') initStarlightGame();
}

// ── PETAL DRIFT 2.0 ──
function initPetalGame() {
    // Clear existing
    petalGame.petals.forEach(p => p.el.remove());
    petalGame.petals = [];
    petalGame.ripples = [];
    petalGustTimer = 0;
    petalWindX = 0;

    handleZenResize();
    petalGame.maxPetals = 32;
    for (let i = 0; i < petalGame.maxPetals; i++) {
        createPetal(true);
    }

    zenState.active = true;
    requestAnimationFrame(updateZenLoop);
}

function makePetalSVG(pathD, colorA, colorB, size, id) {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('viewBox', '-32 -32 64 64');

    const defs = document.createElementNS(ns, 'defs');

    // Radial gradient focused toward the top-left highlight
    const grad = document.createElementNS(ns, 'radialGradient');
    grad.setAttribute('id', 'pg' + id);
    grad.setAttribute('cx', '35%');
    grad.setAttribute('cy', '25%');
    grad.setAttribute('r', '65%');
    grad.setAttribute('fx', '25%');
    grad.setAttribute('fy', '20%');

    const s1 = document.createElementNS(ns, 'stop');
    s1.setAttribute('offset', '0%');
    s1.setAttribute('stop-color', '#ffffff');
    s1.setAttribute('stop-opacity', '0.7');

    const s2 = document.createElementNS(ns, 'stop');
    s2.setAttribute('offset', '40%');
    s2.setAttribute('stop-color', colorA);
    s2.setAttribute('stop-opacity', '0.98');

    const s3 = document.createElementNS(ns, 'stop');
    s3.setAttribute('offset', '100%');
    s3.setAttribute('stop-color', colorB);
    s3.setAttribute('stop-opacity', '0.85');

    grad.appendChild(s1);
    grad.appendChild(s2);
    grad.appendChild(s3);
    defs.appendChild(grad);
    svg.appendChild(defs);

    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', pathD);
    path.setAttribute('fill', 'url(#pg' + id + ')');
    path.setAttribute('stroke', colorB);
    path.setAttribute('stroke-width', '1');
    path.setAttribute('stroke-opacity', '0.45');
    svg.appendChild(path);

    return svg;
}

let _petalIdCounter = 0;
function createPetal(randomY = false) {
    const el = document.createElement('div');
    el.className = 'petal';

    const palette = PETAL_PALETTE[Math.floor(Math.random() * PETAL_PALETTE.length)];
    const pathD = PETAL_PATHS[Math.floor(Math.random() * PETAL_PATHS.length)];
    const size = 55 + Math.random() * 45; // 55-100px — large enough to see the shape clearly
    const pid = _petalIdCounter++;


    const svg = makePetalSVG(pathD, palette.a, palette.b, size, pid);
    el.appendChild(svg);
    document.getElementById('zenCanvas').appendChild(el);

    // Speed — much faster than before
    const speed = 1.8 + Math.random() * 2.8; // 1.8 – 4.6 px/frame

    petalGame.petals.push({
        el,
        x: Math.random() * zenState.width,
        y: randomY ? Math.random() * zenState.height : -size,
        vx: (Math.random() - 0.5) * 1.2,
        vy: speed,
        baseVy: speed,
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 3.5, // faster spin
        swaySpeed: 0.018 + Math.random() * 0.03,
        swayAmp: 1.2 + Math.random() * 2.2,   // 5-10x more sway
        swayOffset: Math.random() * Math.PI * 2,
        size,
        opacity: 0.65 + Math.random() * 0.3,
        opacityPhase: Math.random() * Math.PI * 2,
    });
}

function createRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'zen-ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    document.getElementById('zenCanvas').appendChild(ripple);
    setTimeout(() => ripple.remove(), 2000);
}

function updateZenLoop(timestamp) {
    if (!zenState.active || zenState.activeGame !== 'petal') return;

    // Wind gust system — every 3-6s a gust pushes petals sideways
    petalGustTimer++;
    if (petalGustTimer > (180 + Math.random() * 200)) {
        petalWindX = (Math.random() - 0.5) * 3.5;
        petalGustTimer = 0;
        // Wind fades out gradually
        setTimeout(() => {
            const fade = setInterval(() => {
                petalWindX *= 0.92;
                if (Math.abs(petalWindX) < 0.05) { petalWindX = 0; clearInterval(fade); }
            }, 50);
        }, 600);
    }

    for (let i = petalGame.petals.length - 1; i >= 0; i--) {
        const p = petalGame.petals[i];

        // 1. Organic sway
        p.swayOffset += p.swaySpeed;
        const sway = Math.sin(p.swayOffset) * p.swayAmp;

        // 2. Mouse repulsion — stronger & wider radius
        const dx = p.x - zenState.mouse.x;
        const dy = p.y - zenState.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 180 && dist > 0) {
            const force = (180 - dist) / 180;
            p.vx += (dx / dist) * force * 1.2;
            p.vy += (dy / dist) * force * 0.7;
        }

        // 3. Apply physics
        p.vx = (p.vx + petalWindX * 0.06) * 0.96;
        p.vy = (p.vy * 0.97) + (p.baseVy * 0.03); // drift back to natural speed
        if (p.vy > 5) p.vy = 5;

        p.x += p.vx + sway;
        p.y += p.vy;
        p.rotation += p.vr;

        // 4. Gentle opacity flicker
        p.opacityPhase += 0.005;
        const opacityNow = p.opacity * (0.9 + 0.1 * Math.sin(p.opacityPhase));

        p.el.style.opacity = opacityNow;
        p.el.style.transform = `translate(${p.x - p.size / 2}px, ${p.y - p.size / 2}px) rotate(${p.rotation}deg)`;

        // 5. Respawn
        if (p.y > zenState.height + 80 || p.x < -120 || p.x > zenState.width + 120) {
            p.el.remove();
            petalGame.petals.splice(i, 1);
            createPetal();
        }
    }

    requestAnimationFrame(updateZenLoop);
}

// ── BREATHING BLOOM (4-7-8 Technique) ──
function initBreathingGame() {
    if (breathGame.timer) clearTimeout(breathGame.timer);
    breathGame.phase = 'in';
    runBreathingCycle();
}

function runBreathingCycle() {
    if (zenState.activeGame !== 'breath') return;

    updateBreathingUI();

    let duration = 0;
    if (breathGame.phase === 'in') {
        duration = 4000;
        breathGame.phase = 'hold';
    } else if (breathGame.phase === 'hold') {
        duration = 7000;
        breathGame.phase = 'out';
    } else {
        duration = 8000;
        breathGame.phase = 'in';
    }

    breathGame.timer = setTimeout(runBreathingCycle, duration);
}

function updateBreathingUI() {
    const circle = document.getElementById('breathCircle');
    const label = document.getElementById('breathLabel');
    if (!circle || !label) return;

    if (breathGame.phase === 'in') {
        circle.style.transition = 'transform 4s cubic-bezier(0.4, 0, 0.2, 1), opacity 4s';
        circle.style.transform = 'scale(2.5)';
        circle.style.opacity = '0.8';
        label.textContent = 'Breathe in...';
    } else if (breathGame.phase === 'hold') {
        circle.style.transition = 'none'; // Hold at current scale
        label.textContent = 'Hold...';
    } else {
        circle.style.transition = 'transform 8s cubic-bezier(0.4, 0, 0.2, 1), opacity 8s';
        circle.style.transform = 'scale(1)';
        circle.style.opacity = '0.4';
        label.textContent = 'Breathe out...';
    }
}

// ── LIGHT FINDER 2.0 (Revolving) ──
function initLightFinder() {
    const container = document.getElementById('lightWords');
    const canvas = document.getElementById('lightCanvas');
    if (!container || !canvas) return;

    container.innerHTML = '';
    lightGame.active = true;
    lightGame.elements = [];

    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Pick 10 words
    const shuffled = [...lightGame.words].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);

    selected.forEach((txt, i) => {
        const el = document.createElement('div');
        el.className = 'hidden-word';
        el.textContent = txt;
        container.appendChild(el);

        // Orbital parameters to prevent clutter
        // Staggered radii and speeds
        const radius = 80 + (i * 35) + (Math.random() * 20);
        const angle = Math.random() * Math.PI * 2;
        const speed = (0.002 + Math.random() * 0.003) * (Math.random() > 0.5 ? 1 : -1);

        lightGame.elements.push({
            el: el,
            radius: radius,
            angle: angle,
            speed: speed,
            centerX: centerX,
            centerY: centerY,
            w: 0, h: 0 // Will capture on first loop
        });
    });

    requestAnimationFrame(updateLightLoop);
}

function updateLightLoop() {
    if (!lightGame.active || zenState.activeGame !== 'light') return;

    lightGame.elements.forEach(p => {
        p.angle += p.speed;

        const x = p.centerX + Math.cos(p.angle) * p.radius;
        const y = p.centerY + Math.sin(p.angle) * p.radius;

        p.el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    });

    requestAnimationFrame(updateLightLoop);
}

// ── STARLIGHT WHISPER ──
function initStarlightGame() {
    const field = document.getElementById('starField');
    if (!field) return;

    field.innerHTML = '';
    starlightGame.active = true;
    starlightGame.stars = [];
    starlightGame.selectedStars = [];

    handleZenResize();

    const starCount = 20;
    for (let i = 0; i < starCount; i++) {
        createZenStar(field);
    }

    drawStarlightLines();
}

function createZenStar(field) {
    const el = document.createElement('div');
    el.className = 'zen-star twinkle';

    const size = 3 + Math.random() * 5;
    const x = Math.random() * 95; // %
    const y = Math.random() * 90; // %

    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.left = x + '%';
    el.style.top = y + '%';

    // Twinkle randomness
    el.style.setProperty('--t-duration', (2 + Math.random() * 3) + 's');
    el.style.setProperty('--t-delay', (Math.random() * 2) + 's');

    const starObj = { el, x, y };

    el.addEventListener('click', () => {
        if (!starlightGame.active) return;
        connectStar(starObj);
        playStarSound(y);
    });

    field.appendChild(el);
    starlightGame.stars.push(starObj);
}

function playStarSound(yPercent) {
    if (typeof yPercent !== 'number' || isNaN(yPercent)) yPercent = 50;

    if (!starlightGame.audioCtx) {
        starlightGame.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    const ctx = starlightGame.audioCtx;
    const masterGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Fundamental (Sine)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';

    // Harmonic (Triangle for a bit of "string" grit)
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.05, ctx.currentTime); // Subtle

    // Frequency mapped to height
    const freq = 180 + (100 - yPercent) * 4.5;
    if (!isFinite(freq)) return; // Safety check

    osc1.frequency.setValueAtTime(freq, ctx.currentTime);
    osc2.frequency.setValueAtTime(freq, ctx.currentTime);

    // Filter decay (creates the "pluck" feel)
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 3, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(freq, ctx.currentTime + 0.8);
    filter.Q.setValueAtTime(2, ctx.currentTime);

    // Envelope
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.02); // Soft attack
    masterGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0); // Long decay

    osc1.connect(filter);
    osc2.connect(gain2);
    gain2.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 2.1);
    osc2.stop(ctx.currentTime + 2.1);
}

function connectStar(star) {
    if (starlightGame.selectedStars.includes(star)) return;

    star.el.classList.add('connected');
    starlightGame.selectedStars.push(star);
    drawStarlightLines();
}

function drawStarlightLines() {
    const canvas = document.getElementById('starlightLineCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (starlightGame.selectedStars.length < 2) return;

    ctx.strokeStyle = 'rgba(214, 207, 234, 0.4)'; // Lavender pale
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    ctx.beginPath();
    starlightGame.selectedStars.forEach((star, i) => {
        const px = (star.x / 100) * canvas.width;
        const py = (star.y / 100) * canvas.height;

        if (i === 0) ctx.moveTo(px, py);
        else {
            const prev = starlightGame.selectedStars[i - 1];
            const ppx = (prev.x / 100) * canvas.width;
            const ppy = (prev.y / 100) * canvas.height;

            // Draw a slightly "curved" line with a bloom effect in the middle
            const midX = (px + ppx) / 2;
            const midY = (py + ppy) / 2;

            ctx.quadraticCurveTo(midX + (Math.random() - 0.5) * 10, midY + (Math.random() - 0.5) * 10, px, py);
        }
    });
    ctx.stroke();

    // Draw "blooms" at nodes
    starlightGame.selectedStars.forEach(star => {
        const px = (star.x / 100) * canvas.width;
        const py = (star.y / 100) * canvas.height;

        ctx.fillStyle = 'rgba(214, 207, 234, 0.2)';
        ctx.beginPath();
        ctx.arc(px, py, 15, 0, Math.PI * 2);
        ctx.fill();
    });
}
// ── GLOBAL ZEN TOOLS (Share & Screenshot) ──
function shareZenProgress() {
    const gameNames = {
        'petal': 'Petal Drift 🌸',
        'breath': 'Breathing Bloom 🧘',
        'light': 'Light Finder 🕯️',
        'starlight': 'Starlight Whisper 🌌'
    };

    const gameName = gameNames[zenState.activeGame] || 'Zen Hub';
    const shareData = {
        title: 'daisyspaceco - ' + gameName,
        text: `I'm finding some peace in the ${gameName} on daisyspaceco. Come join me.`,
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: Copy link
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Link copied to clipboard! Share your peace with others.');
        });
    }
}

function captureZenScreenshot() {
    // For Starlight Whisper, we can capture the actual constellation
    if (zenState.activeGame === 'starlight') {
        const sourceCanvas = document.getElementById('starlightLineCanvas');
        if (!sourceCanvas) return;

        // Create a temporary canvas to composite everything
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = sourceCanvas.width;
        tempCanvas.height = sourceCanvas.height;
        const ctx = tempCanvas.getContext('2d');

        // 1. Draw Sky Gradient
        const grad = ctx.createLinearGradient(0, 0, 0, tempCanvas.height);
        grad.addColorStop(0, '#0d0b21');
        grad.addColorStop(0.5, '#1a163d');
        grad.addColorStop(1, '#2e2a5e');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        // 2. Draw Stars
        starlightGame.stars.forEach(star => {
            const px = (star.x / 100) * tempCanvas.width;
            const py = (star.y / 100) * tempCanvas.height;
            ctx.fillStyle = 'white';
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(255,255,255,0.8)';
            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fill();
        });

        // 3. Draw Lines and Blooms
        ctx.drawImage(sourceCanvas, 0, 0);

        // Download
        const link = document.createElement('a');
        link.download = 'starlight-whisper-daisyspaceco.png';
        link.href = tempCanvas.toDataURL('image/png');
        link.click();
    } else {
        // Fallback message for DOM-based games
        alert("✨ Tip: Use your device's built-in screenshot shortcut (Cmd/Ctrl + Shift + 4 or PrtSc) to capture the full interactive scene!");
    }
}
