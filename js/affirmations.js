// ── AFFIRMATIONS ──

let affirmRotateTimer = null;
let affirmRotateActive = false;
let activeTimeFilter = 'all';

function initAffirmationsPage() {
    const todayKey = new Date().toDateString();
    const intentions = JSON.parse(localStorage.getItem('kindness_intentions') || '{}');
    const intentionDisplay = document.getElementById('intentionDisplay');
    const intentionInput = document.getElementById('intentionInput');

    if (intentions[todayKey]) {
        intentionDisplay.textContent = '✦ ' + intentions[todayKey];
        intentionDisplay.style.display = 'block';
        intentionInput.value = intentions[todayKey];
    } else {
        intentionDisplay.style.display = 'none';
        intentionInput.value = '';
    }

    // Time-of-day greeting
    const greetingEl = document.getElementById('affirmTimeGreeting');
    if (greetingEl) {
        const hour = new Date().getHours();
        if (hour < 12) greetingEl.textContent = 'Good morning ☀️ — start your day with intention.';
        else if (hour < 17) greetingEl.textContent = 'Good afternoon 🌿 — take a gentle pause.';
        else greetingEl.textContent = 'Good evening 🌙 — reflect on your day.';
    }

    // Auto-filter by time of day
    const hour = new Date().getHours();
    if (hour < 12) activeTimeFilter = 'morning';
    else if (hour >= 18) activeTimeFilter = 'night';
    else activeTimeFilter = 'all';
    updateTimeFilterUI();

    migrateSavedAffirmations();

    if (!currentAffirmation) newAffirmation();

    renderSavedAffirmations();
    renderIntentionHistory();
    startAutoRotate();
}

function newAffirmation() {
    const card = document.getElementById('affirmCard');
    const quoteEl = document.getElementById('affirmQuote');
    const sourceEl = document.getElementById('affirmSource');

    let pick;
    do { pick = affirmations[Math.floor(Math.random() * affirmations.length)]; }
    while (affirmations.length > 1 && pick === currentAffirmation);
    currentAffirmation = pick;

    quoteEl.style.opacity = '0';
    quoteEl.style.transform = 'translateY(10px)';
    sourceEl.style.opacity = '0';

    setTimeout(() => {
        quoteEl.textContent = '"' + pick.text + '"';
        sourceEl.textContent = '— ' + pick.source;
        quoteEl.style.opacity = '1';
        quoteEl.style.transform = 'translateY(0)';
        sourceEl.style.opacity = '1';
    }, 220);

    const btn = document.getElementById('btnSaveAffirm');
    btn.innerHTML = '♡ Save';
    btn.classList.remove('saved');

    // Reset auto-rotate timer so it counts 15s from this manual pick
    startAutoRotate();
}

function saveAffirmation() {
    if (!currentAffirmation) return;
    const saved = JSON.parse(localStorage.getItem('kindness_affirmations') || '[]');

    // Check if already saved (handle both old string and new object format)
    const exists = saved.some(a => {
        if (typeof a === 'string') return a === currentAffirmation.text;
        return a.text === currentAffirmation.text;
    });

    if (exists) {
        showToast('Already saved ✦');
        return;
    }

    // Auto-assign time tag based on current time
    const hour = new Date().getHours();
    let autoTag = null;
    if (hour < 12) autoTag = 'morning';
    else if (hour >= 18) autoTag = 'night';

    saved.unshift({ text: currentAffirmation.text, timeTag: autoTag });
    localStorage.setItem('kindness_affirmations', JSON.stringify(saved));

    const btn = document.getElementById('btnSaveAffirm');
    btn.innerHTML = '♥ Saved';
    btn.classList.add('saved');

    renderSavedAffirmations();
    showToast('🌿 Affirmation saved');
}

function deleteAffirmation(text) {
    const saved = JSON.parse(localStorage.getItem('kindness_affirmations') || '[]');
    const updated = saved.filter(a => {
        const t = typeof a === 'string' ? a : a.text;
        return t !== text;
    });
    localStorage.setItem('kindness_affirmations', JSON.stringify(updated));
    renderSavedAffirmations();
}

function saveIntention() {
    const input = document.getElementById('intentionInput');
    const text = input.value.trim();
    if (!text) return;

    const todayKey = new Date().toDateString();
    const intentions = JSON.parse(localStorage.getItem('kindness_intentions') || '{}');
    intentions[todayKey] = text;
    localStorage.setItem('kindness_intentions', JSON.stringify(intentions));

    const display = document.getElementById('intentionDisplay');
    display.textContent = '✦ ' + text;
    display.style.display = 'block';
    display.classList.remove('intention-visible');
    void display.offsetWidth;
    display.classList.add('intention-visible');

    renderIntentionHistory();
    showToast('✦ Intention set for today');
}

function renderIntentionHistory() {
    const container = document.getElementById('intentionHistory');
    if (!container) return;

    const intentions = JSON.parse(localStorage.getItem('kindness_intentions') || '{}');
    const todayKey = new Date().toDateString();

    const past = Object.entries(intentions)
        .filter(([date]) => date !== todayKey)
        .sort((a, b) => new Date(b[0]) - new Date(a[0]));

    if (!past.length) { container.innerHTML = ''; return; }

    container.innerHTML = `
    <div class="intention-history-header">
      <p class="eyebrow" style="margin:0;">✦ Past Intentions</p>
    </div>
    <div class="intention-history-list">
      ${past.map(([date, text]) => `
        <div class="intention-history-item">
          <span class="intention-history-date">${new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()}</span>
          <span class="intention-history-text">${text}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function toggleViewAll() {
    showingAllAffirms = !showingAllAffirms;
    renderSavedAffirmations();
}

function renderSavedAffirmations() {
    const list = document.getElementById('savedAffirmList');
    const viewAllBtn = document.getElementById('viewAllBtn');
    if (!list) return;

    const saved = JSON.parse(localStorage.getItem('kindness_affirmations') || '[]');

    // Filter by time tag
    let filtered = saved;
    if (activeTimeFilter !== 'all') {
        filtered = saved.filter(a => {
            if (typeof a === 'string') return true; // legacy
            return a.timeTag === activeTimeFilter || a.timeTag === 'both';
        });
    }

    list.innerHTML = '';

    if (!filtered.length) {
        const msg = activeTimeFilter !== 'all'
            ? `No ${activeTimeFilter === 'morning' ? 'morning ☀️' : 'night 🌙'} affirmations yet. Tag some!`
            : 'Your saved affirmations will appear here…';
        list.innerHTML = `<p class="placeholder-text" style="text-align:left;padding:1rem 0;">${msg}</p>`;
        viewAllBtn.style.display = 'none';
        return;
    }

    const PREVIEW_COUNT = 3;
    const toShow = showingAllAffirms ? filtered : filtered.slice(0, PREVIEW_COUNT);

    toShow.forEach((item, i) => {
        const text = typeof item === 'string' ? item : item.text;
        const timeTag = typeof item === 'string' ? null : item.timeTag;
        const el = document.createElement('div');
        el.className = 'saved-affirm-item';
        el.style.animationDelay = (i * 0.05) + 's';

        const tagLabel = getTimeTagLabel(timeTag);
        const tagClass = timeTag || '';

        el.innerHTML = `
      <span class="affirm-heart" aria-hidden="true">♡</span>
      <span class="saved-affirm-text">${text}</span>
      <button class="affirm-time-tag ${tagClass}" onclick="cycleTimeTag(${JSON.stringify(text)})" title="Click to change: Morning/Night/Both">${tagLabel}</button>
      <button class="affirm-delete-btn" onclick="deleteAffirmation(${JSON.stringify(text)})" aria-label="Remove affirmation" title="Remove">✕</button>
    `;
        list.appendChild(el);
    });

    if (filtered.length > PREVIEW_COUNT) {
        viewAllBtn.style.display = 'inline-flex';
        viewAllBtn.textContent = showingAllAffirms ? 'Show Less' : `View All (${filtered.length})`;
    } else {
        viewAllBtn.style.display = 'none';
    }
}

// ── Always-On Auto-Rotate ──
let affirmRotateIndex = 0;

function startAutoRotate() {
    if (affirmRotateTimer) clearInterval(affirmRotateTimer);
    if (!affirmations || affirmations.length < 2) return;

    affirmRotateIndex = Math.floor(Math.random() * affirmations.length);

    affirmRotateTimer = setInterval(() => {
        affirmRotateIndex = (affirmRotateIndex + 1) % affirmations.length;
        // Skip if it's the same as the currently displayed one
        if (affirmations[affirmRotateIndex] === currentAffirmation) {
            affirmRotateIndex = (affirmRotateIndex + 1) % affirmations.length;
        }
        crossFadeToAffirmation(affirmations[affirmRotateIndex]);
    }, 15000);
}

function crossFadeToAffirmation(pick) {
    const quoteEl = document.getElementById('affirmQuote');
    const sourceEl = document.getElementById('affirmSource');
    if (!quoteEl || !sourceEl) return;

    // Phase 1: Fade out (uses the 0.8s CSS transition)
    quoteEl.style.opacity = '0';
    quoteEl.style.transform = 'translateY(10px)';
    sourceEl.style.opacity = '0';

    // Phase 2: Swap text and fade in after the fade-out completes
    setTimeout(() => {
        currentAffirmation = pick;
        quoteEl.textContent = '"' + pick.text + '"';
        sourceEl.textContent = '— ' + pick.source;

        // Update save button state
        const btn = document.getElementById('btnSaveAffirm');
        const saved = JSON.parse(localStorage.getItem('kindness_affirmations') || '[]');
        const isSaved = saved.some(a => (typeof a === 'string' ? a : a.text) === pick.text);
        if (btn) {
            btn.innerHTML = isSaved ? '♥ Saved' : '♡ Save';
            btn.classList.toggle('saved', isSaved);
        }

        // Fade in
        quoteEl.style.opacity = '1';
        quoteEl.style.transform = 'translateY(0)';
        sourceEl.style.opacity = '1';
    }, 850); // Wait for the 0.8s fade-out to finish
}

// ── Morning/Night Tags ──
function migrateSavedAffirmations() {
    const saved = JSON.parse(localStorage.getItem('kindness_affirmations') || '[]');
    let changed = false;
    const migrated = saved.map(a => {
        if (typeof a === 'string') { changed = true; return { text: a, timeTag: null }; }
        return a;
    });
    if (changed) localStorage.setItem('kindness_affirmations', JSON.stringify(migrated));
}

function getTimeTagLabel(tag) {
    if (tag === 'morning') return '☀️ Morn';
    if (tag === 'night') return '🌙 Night';
    if (tag === 'both') return '☀️🌙';
    return '⭐ Any';
}

function cycleTimeTag(text) {
    const saved = JSON.parse(localStorage.getItem('kindness_affirmations') || '[]');
    const idx = saved.findIndex(a => (typeof a === 'string' ? a : a.text) === text);
    if (idx === -1) return;

    const item = typeof saved[idx] === 'string' ? { text: saved[idx], timeTag: null } : saved[idx];
    const cycle = [null, 'morning', 'night', 'both'];
    const current = cycle.indexOf(item.timeTag);
    item.timeTag = cycle[(current + 1) % cycle.length];
    saved[idx] = item;
    localStorage.setItem('kindness_affirmations', JSON.stringify(saved));
    renderSavedAffirmations();
}

function filterAffirmsByTime(filter) {
    activeTimeFilter = filter;
    updateTimeFilterUI();
    showingAllAffirms = false;
    renderSavedAffirmations();
}

function updateTimeFilterUI() {
    document.querySelectorAll('.time-filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === activeTimeFilter);
    });
}
