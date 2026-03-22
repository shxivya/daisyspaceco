function showPage(id) {
    const current = document.querySelector('.page.active');
    const next = document.getElementById('page-' + id);
    if (!next || current === next) return;

    if (current) {
        current.classList.add('page-exit');
        setTimeout(() => {
            current.classList.remove('active', 'page-exit');
        }, 220);
    }

    setTimeout(() => {
        next.classList.add('active', 'page-enter');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                next.classList.remove('page-enter');
            });
        });

        if (id === 'journal') renderJournal();
        if (id === 'affirmations') initAffirmationsPage();
        if (id === 'wall') initWallPage();
        if (id === 'release') initReleasePage();
        if (id === 'moodboard') updateGridView();
        if (id === 'zen') initZen();
    }, 180);

    // Show/hide top-bar (hidden on home page)
    document.body.classList.toggle('on-home-page', id === 'home');

    // Update nav active state + aria-current
    const pageOrder = ['generator', 'moodboard', 'journal', 'affirmations', 'wall', 'zen'];
    document.querySelectorAll('.nav-btn').forEach((b, i) => {
        const isActive = pageOrder[i] === id;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
}

// ── HOME PAGE ──
function enterApp(page) {
    const homeEl = document.getElementById('page-home');
    if (!homeEl) return;
    homeEl.classList.add('home-exiting');
    setTimeout(() => {
        showPage(page || 'generator');
    }, 500);
}

function initHomePage() {
    // Stats from localStorage
    const doneDates = JSON.parse(localStorage.getItem('kindness_done') || '[]');
    const total = parseInt(localStorage.getItem('kindness_total') || '0', 10);

    // Calculate streak
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const check = new Date(today);
    while (true) {
        if (doneDates.includes(check.toDateString())) {
            streak++;
            check.setDate(check.getDate() - 1);
        } else break;
    }

    const streakEl = document.getElementById('homeStreakNum');
    const totalEl = document.getElementById('homeTotalNum');
    if (streakEl) streakEl.textContent = streak;
    if (totalEl) totalEl.textContent = total;

    // Hide stats if zero
    const statLeft = document.getElementById('homeStatStreak');
    const statRight = document.getElementById('homeStatTotal');
    if (statLeft && streak === 0) statLeft.style.display = 'none';
    if (statRight && total === 0) statRight.style.display = 'none';

    // Spawn particles
    const container = document.getElementById('homeParticles');
    if (!container) return;
    const COLORS = [
        'rgba(181,170,212,0.35)', 'rgba(168,196,162,0.3)',
        'rgba(244,209,181,0.28)', 'rgba(191,201,217,0.32)', 'rgba(207,231,214,0.3)'
    ];
    for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'home-particle';
        const size = Math.random() * 4 + 2;
        p.style.cssText = [
            `left:${Math.random() * 100}%`,
            `width:${size}px`,
            `height:${size}px`,
            `background:${COLORS[Math.floor(Math.random() * COLORS.length)]}`,
            `animation-duration:${Math.random() * 22 + 18}s`,
            `animation-delay:${Math.random() * 18 - 5}s`
        ].join(';');
        container.appendChild(p);
    }

    // Enter / Space key shortcut
    document.addEventListener('keydown', function homeKey(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            const home = document.getElementById('page-home');
            if (home && home.classList.contains('active')) {
                e.preventDefault();
                enterApp();
                document.removeEventListener('keydown', homeKey);
            }
        }
    });
}

// ── TOAST ──
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800);
}
