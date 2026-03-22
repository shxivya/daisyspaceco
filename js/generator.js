// ── GENERATOR ──

function buildFilters() {
    const cats = ['All', 'Community', 'Digital', 'Connection', 'Self', 'Presence', 'Generosity'];
    const wrap = document.getElementById('filterWrap');
    if (!wrap) return;
    wrap.innerHTML = '';

    cats.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn' + (cat === activeCategory ? ' active' : '');
        btn.textContent = (cat === 'Self') ? 'Self-Care' : cat;
        btn.setAttribute('aria-pressed', cat === activeCategory ? 'true' : 'false');

        btn.onclick = () => {
            activeCategory = cat;
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            generate();
        };
        wrap.appendChild(btn);
    });
}

function generate() {
    const pool = activeCategory === 'All'
        ? acts
        : acts.filter(a => a.category === activeCategory || (activeCategory === 'Self' && a.category === 'Self'));

    if (!pool.length) return;

    let newAct;
    do {
        newAct = pool[Math.floor(Math.random() * pool.length)];
    } while (pool.length > 1 && newAct === currentAct);

    currentAct = newAct;

    const cardText = document.getElementById('cardText');
    const cardIcon = document.getElementById('cardIcon');
    const cardTag = document.getElementById('cardTag');
    const card = document.getElementById('card');

    // 3D card-flip animation
    card.classList.remove('flipping', 'shimmer');
    void card.offsetWidth; // Force reflow
    card.classList.add('flipping');

    // Swap content at the midpoint of the flip (when card is edge-on)
    setTimeout(() => {
        if (cardIcon) {
            cardIcon.style.display = 'block';
            cardIcon.textContent = currentAct.icon;
        }
        if (cardTag) {
            cardTag.style.display = 'inline-block';
            cardTag.textContent = (currentAct.category === 'Self') ? 'Self-Care' : currentAct.category;
        }
        cardText.textContent = currentAct.text;
        cardText.style.opacity = 1;
    }, 260); // 40% of 650ms

    // Once flip is done, add shimmer glow
    setTimeout(() => {
        card.classList.remove('flipping');
        card.classList.add('shimmer');
        setTimeout(() => card.classList.remove('shimmer'), 1200);
    }, 650);

    document.getElementById('btnGenerate').innerHTML = '✦ Inspire Me Again';
    document.getElementById('btnDone').classList.add('visible');
    document.getElementById('btnDone').classList.remove('done');
    document.getElementById('btnDone').innerHTML = '✓ I Did This';
    document.getElementById('btnShare').classList.add('visible');
}

function markDone() {
    const btn = document.getElementById('btnDone');
    setTimeout(openJournalModal, 600);
    if (btn.classList.contains('done')) return;

    btn.classList.add('done');
    btn.innerHTML = '✓&nbsp; Done!';

    const confettiPalettes = {
        sage: ['#7a9e7e', '#a8c4a2', '#587a5c', '#d4e4d0'],
        sky: ['#6b9eb8', '#94bdd1', '#4a7d96', '#d6eaf4'],
        rose: ['#c47a8a', '#d89daa', '#9e5566', '#f5dde3'],
        sunshine: ['#c9973a', '#ddb264', '#a07028', '#fbefd4'],
        terracotta: ['#b8694a', '#cf9080', '#8c4a30', '#f5e0d8'],
        lavender: ['#8b7ab8', '#ab9fd0', '#6458a0', '#e8e0f5'],
        strawberry: ['#d44f6e', '#e47a94', '#a8304c', '#fde0e8'],
        matcha: ['#5a8a5a', '#80aa80', '#3a6a3a', '#e0eed8'],
    };
    const themeColors = confettiPalettes[activeColorTheme] || confettiPalettes.sage;

    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: themeColors,
        disableForReducedMotion: true
    });

    totalDone++;
    localStorage.setItem('kindness_total', totalDone);

    const today = new Date().toDateString();
    if (!doneDates.includes(today)) {
        doneDates.push(today);
        localStorage.setItem('kindness_done', JSON.stringify(doneDates));
    }

    buildStreak();
    addChainLink(currentAct);
    showToast('🌿 Wonderful! Keep spreading kindness.');
}

// ── KINDNESS CHAIN ──
const CHAIN_FLOWERS = ['🌸', '🌼', '🌷', '🌻', '💐', '🌺', '🪻', '🌹', '🪷', '🏵️'];

function buildKindnessChain() {
    const container = document.getElementById('kindnessChain');
    if (!container) return;
    container.innerHTML = '';

    const chain = JSON.parse(localStorage.getItem('kindness_chain') || '[]');

    if (chain.length === 0) {
        container.innerHTML = '<p class="kindness-chain-empty">Complete an act of kindness to start your chain…</p>';
        return;
    }

    // Show last 15 links
    const visible = chain.slice(-15);
    visible.forEach((link, i) => {
        if (i > 0) {
            const conn = document.createElement('div');
            conn.className = 'chain-connector';
            container.appendChild(conn);
        }
        const el = document.createElement('div');
        el.className = 'chain-link';
        el.textContent = link.flower;
        el.title = link.text || 'An act of kindness';
        el.style.animationDelay = (i * 0.06) + 's';
        container.appendChild(el);
    });
}

function addChainLink(act) {
    const chain = JSON.parse(localStorage.getItem('kindness_chain') || '[]');
    const flower = CHAIN_FLOWERS[Math.floor(Math.random() * CHAIN_FLOWERS.length)];
    chain.push({ flower, text: act ? act.text : '', date: new Date().toISOString() });
    localStorage.setItem('kindness_chain', JSON.stringify(chain));

    // Animate the new link
    const container = document.getElementById('kindnessChain');
    if (!container) return;

    // Clear empty message if present
    const emptyMsg = container.querySelector('.kindness-chain-empty');
    if (emptyMsg) emptyMsg.remove();

    // Add connector if not the first link
    if (container.querySelector('.chain-link')) {
        const conn = document.createElement('div');
        conn.className = 'chain-connector';
        container.appendChild(conn);
    }

    const el = document.createElement('div');
    el.className = 'chain-link fresh';
    el.textContent = flower;
    el.title = act ? act.text : 'An act of kindness';
    container.appendChild(el);

    // Scroll chain into view
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Remove 'fresh' class after animation
    setTimeout(() => el.classList.remove('fresh'), 700);
}

function buildStreak() {
    document.getElementById('totalDone').textContent = totalDone;
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        if (doneDates.includes(d.toDateString())) streak++;
        else if (i > 0) break;
    }
    document.getElementById('streakCount').textContent = streak;
    document.getElementById('sidebarStreak') && (document.getElementById('sidebarStreak').textContent = streak);

    const dotsEl = document.getElementById('weekDots');
    dotsEl.innerHTML = '';
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dot = document.createElement('div');
        dot.className = 'streak-dot' + (doneDates.includes(d.toDateString()) ? ' filled' : '');
        dotsEl.appendChild(dot);
    }
}

// ── SHARE ──
function openShare() {
    const modal = document.getElementById('shareModal');
    if (modal) {
        modal.classList.add('open');
        const shareText = document.getElementById('shareText');
        if (shareText && currentAct) shareText.textContent = currentAct.text;
        const shareTag = document.getElementById('shareTag');
        if (shareTag && currentAct) shareTag.textContent = (currentAct.category === 'Self') ? 'Self-Care' : currentAct.category;
    }
}

function closeShare() {
    document.getElementById('shareModal').classList.remove('open');
}

document.getElementById('shareModal').addEventListener('click', e => {
    if (e.target.id === 'shareModal') closeShare();
});

function copyText() {
    navigator.clipboard.writeText(`✦ Today's Act of Kindness ✦\n\n"${currentAct.text}"\n\n— todayskindness.co`);
    showToast('📋 Copied to clipboard!');
    closeShare();
}

function shareNative() {
    if (navigator.share) navigator.share({ title: "Today's Act of Kindness", text: currentAct.text, url: window.location.href });
    else copyText();
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    showToast('🔗 Link copied!');
    closeShare();
}
