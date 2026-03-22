// ── KINDNESS WALL ──

// ── SUPABASE SETUP ──
const SUPABASE_URL = 'https://rdukqrdsazfkbbduyuec.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_wfl0pZzt54cYuu7bNZ0TGg_GFcUrv9M'; // ⚠️ replace the ... with the rest of your key!
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Accent colours rotate across cards for personality
const WALL_ACCENTS = [
    { color: '#a8c4a2', tint: 'rgba(168,196,162,0.07)' },
    { color: '#f4d1b5', tint: 'rgba(244,209,181,0.09)' },
    { color: '#d6cfea', tint: 'rgba(214,207,234,0.09)' },
    { color: '#bfc9d9', tint: 'rgba(191,201,217,0.08)' },
    { color: '#f2c6cf', tint: 'rgba(242,198,207,0.09)' },
    { color: '#cfe7d6', tint: 'rgba(207,231,214,0.08)' },
    { color: '#f6e7a5', tint: 'rgba(246,231,165,0.08)' },
    { color: '#e1dce8', tint: 'rgba(225,220,232,0.09)' },
];

const WALL_ROTATIONS = [-0.7, 0.4, -0.3, 0.6, -0.5, 0.3, -0.6, 0.5];

// ── WALL STORAGE HELPERS (Supabase) ──
async function wallDB_getAll() {
    const { data, error } = await supabase
        .from('kind_wall_posts')
        .select('*')
        .order('time', { ascending: false });
    if (error) { console.error('wallDB_getAll error:', error); return []; }
    const obj = {};
    (data || []).forEach(p => obj[p.id] = p);
    return obj;
}

async function wallDB_set(post) {
    const { error } = await supabase
        .from('kind_wall_posts')
        .upsert(post, { onConflict: 'id' });
    if (error) console.error('wallDB_set error:', error);
}

async function wallDB_delete(postId) {
    const { error } = await supabase
        .from('kind_wall_posts')
        .delete()
        .eq('id', postId);
    if (error) console.error('wallDB_delete error:', error);
}

// ── PROMPT SHUFFLE ──
function shufflePrompt() {
    currentPromptIndex = (currentPromptIndex + 1) % wallPrompts.length;
    const el = document.getElementById('wallPromptLabel');
    el.style.opacity = '0';
    setTimeout(() => {
        el.textContent = wallPrompts[currentPromptIndex];
        el.style.opacity = '1';
    }, 180);
}

// ── CHAR COUNT ──
function updateWallCharCount() {
    const input = document.getElementById('wallInput');
    const count = document.getElementById('wallCharCount');
    const remaining = 280 - input.value.length;
    count.textContent = remaining;
    count.style.color = remaining < 30 ? '#c47a8a' : 'var(--muted)';
}

// ── POST ──
async function postToWall() {
    const input = document.getElementById('wallInput');
    const text = input.value.trim();
    if (!text) { showToast('Write something first 🌿'); return; }
    if (text.length > 280) { showToast('Keep it to 280 characters'); return; }

    const btn = document.querySelector('.wall-post-btn');
    btn.disabled = true;
    btn.textContent = '✦ Sharing…';

    const postId = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const post = {
        id: postId,
        text,
        prompt: wallPrompts[currentPromptIndex],
        time: Date.now(),
        reactions: { '🌼': 0, '🤍': 0, '✨': 0 }
    };

    await wallDB_set(post);

    myPostIds.unshift(postId);
    localStorage.setItem('wall_my_posts', JSON.stringify(myPostIds.slice(0, 50)));

    input.value = '';
    updateWallCharCount();

    wallPosts.unshift(post);
    updateTodayCounter();
    renderFeaturedThought();
    renderWallFeed(true);

    showToast('🌿 Your kindness is on the wall');

    setTimeout(() => {
        btn.textContent = '✦ Share anonymously';
        btn.disabled = false;
    }, 2000);

    confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.4 },
        colors: ['#a8c4a2', '#f4d1b5', '#d6cfea', '#ffffff'],
        disableForReducedMotion: true
    });
}

// ── TODAY'S COUNTER ──
async function updateTodayCounter() {
    const allPosts = Object.values(await wallDB_getAll());
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayCount = allPosts.filter(p => p.time >= todayStart.getTime()).length;

    const el = document.getElementById('wallTodayCount');
    if (!el) return;

    if (todayCount === 0) {
        el.textContent = 'Be the first to share something kind today';
    } else if (todayCount === 1) {
        el.textContent = '1 kind thought shared today';
    } else {
        el.textContent = `${todayCount} kind thoughts shared today`;
    }
}

// ── FEATURED THOUGHT ──
async function renderFeaturedThought() {
    const wrap = document.getElementById('wallFeaturedWrap');
    if (!wrap) return;

    const all = Object.values(await wallDB_getAll());
    if (!all.length) { wrap.style.display = 'none'; return; }

    const sorted = [...all].sort((a, b) => {
        const sumA = Object.values(a.reactions).reduce((s, v) => s + v, 0);
        const sumB = Object.values(b.reactions).reduce((s, v) => s + v, 0);
        return sumB - sumA || b.time - a.time;
    });

    const featured = sorted[0];
    if (!featured) { wrap.style.display = 'none'; return; }

    wrap.style.display = 'block';
    const textEl = document.getElementById('wallFeaturedText');
    const timeEl = document.getElementById('wallFeaturedTime');
    const reactEl = document.getElementById('wallFeaturedReactions');

    if (textEl) textEl.textContent = featured.text;
    if (timeEl) timeEl.textContent = getTimeAgo(featured.time);

    if (reactEl) {
        reactEl.innerHTML = wallReactions.map(r => {
            const count = featured.reactions[r.emoji] || 0;
            const reacted = myReactions[featured.id] === r.emoji;
            return `<button class="wall-reaction-btn ${reacted ? 'reacted' : ''}"
        onclick="reactToPost('${featured.id}','${r.emoji}',false)"
        aria-label="${r.label}" aria-pressed="${reacted}" title="${r.label}">
        <span class="wr-emoji" aria-hidden="true">${r.emoji}</span>
        ${count > 0 ? `<span class="wr-count">${count}</span>` : ''}
      </button>`;
        }).join('');
    }
}

// ── LOAD POSTS ──
async function loadWallPosts(reset = false) {
    if (reset) { wallPage = 0; wallPosts = []; }

    let all = Object.values(await wallDB_getAll());

    if (wallFilter === 'recent') {
        all.sort((a, b) => b.time - a.time);
    } else {
        all.sort((a, b) => {
            const sumA = Object.values(a.reactions).reduce((s, v) => s + v, 0);
            const sumB = Object.values(b.reactions).reduce((s, v) => s + v, 0);
            return sumB - sumA || b.time - a.time;
        });
    }

    wallPosts = all;
    updateTodayCounter();
    renderFeaturedThought();
    renderWallFeed(true);
}

// ── RENDER FEED ──
function renderWallFeed(reset = false) {
    const feed = document.getElementById('wallFeed');
    const loadMoreBtn = document.getElementById('wallLoadMore');

    if (reset) { feed.innerHTML = ''; wallPage = 0; }

    const start = wallPage * WALL_PAGE_SIZE;
    const slice = wallPosts.slice(start, start + WALL_PAGE_SIZE);

    if (wallPosts.length === 0) {
        feed.innerHTML = `
      <div class="wall-empty">
        <div class="wall-empty-ornament" aria-hidden="true">✦ ◌ ✦</div>
        <p class="wall-empty-text">The wall is quiet right now.</p>
        <p class="wall-empty-sub">Be the first to leave something kind 🌿</p>
      </div>`;
        loadMoreBtn.style.display = 'none';
        return;
    }

    let globalIndex = start;
    slice.forEach((post, i) => {
        const card = buildWallCard(post, i * 60, globalIndex);
        feed.appendChild(card);
        globalIndex++;
    });

    wallPage++;
    const hasMore = wallPage * WALL_PAGE_SIZE < wallPosts.length;
    loadMoreBtn.style.display = hasMore ? 'block' : 'none';
}

// ── BUILD CARD ──
function buildWallCard(post, delay = 0, index = 0) {
    const card = document.createElement('div');
    card.className = 'wall-card';
    card.dataset.id = post.id;
    card.style.animationDelay = delay + 'ms';

    const accent = WALL_ACCENTS[index % WALL_ACCENTS.length];
    const rotation = WALL_ROTATIONS[index % WALL_ROTATIONS.length];
    card.style.setProperty('--wall-card-accent', accent.color);
    card.style.setProperty('--wall-card-tint', accent.tint);
    card.style.transform = `rotate(${rotation}deg)`;

    const isMyPost = myPostIds.includes(post.id);
    const timeAgo = getTimeAgo(post.time);

    const reactionsHtml = wallReactions.map(r => {
        const count = post.reactions[r.emoji] || 0;
        const reacted = myReactions[post.id] === r.emoji;
        return `<button class="wall-reaction-btn ${reacted ? 'reacted' : ''}"
      onclick="reactToPost('${post.id}','${r.emoji}',true)"
      aria-label="${r.label}${reacted ? ' (selected)' : ''}"
      aria-pressed="${reacted}"
      title="${r.label}">
      <span class="wr-emoji" aria-hidden="true">${r.emoji}</span>
      ${count > 0 ? `<span class="wr-count">${count}</span>` : ''}
    </button>`;
    }).join('');

    const totalReactions = Object.values(post.reactions).reduce((s, v) => s + v, 0);

    card.innerHTML = `
    <div class="wall-card-inner">
      ${post.prompt ? `<div class="wall-card-prompt">${post.prompt}</div>` : ''}
      <p class="wall-card-text">${escapeHtml(post.text)}</p>
      <div class="wall-card-footer">
        <span class="wall-card-time">${timeAgo}${isMyPost ? ' · you' : ''}</span>
        <div class="wall-reactions" role="group" aria-label="Reactions">${reactionsHtml}</div>
      </div>
      ${totalReactions > 0 ? `
        <div class="wall-resonance-bar" aria-hidden="true">
          <div class="wall-resonance-fill" style="width:${Math.min(100, totalReactions * 8)}%"></div>
        </div>` : ''}
    </div>
  `;
    return card;
}

// ── REACT ──
async function reactToPost(postId, emoji, withFloat = false) {
    if (withFloat) {
        const btn = document.querySelector(`.wall-card[data-id="${postId}"] .wall-reaction-btn[title="${wallReactions.find(r => r.emoji === emoji)?.label}"]`);
        if (btn) spawnFloatingEmoji(emoji, btn);
    }

    const previousReaction = myReactions[postId];
    if (previousReaction === emoji) return;

    const { data, error } = await supabase
        .from('kind_wall_posts')
        .select('*')
        .eq('id', postId)
        .single();
    if (error || !data) return;

    const post = data;

    if (previousReaction) {
        post.reactions[previousReaction] = Math.max(0, (post.reactions[previousReaction] || 0) - 1);
    }
    post.reactions[emoji] = (post.reactions[emoji] || 0) + 1;

    await wallDB_set(post);

    myReactions[postId] = emoji;
    localStorage.setItem('wall_my_reactions', JSON.stringify(myReactions));

    const idx = wallPosts.findIndex(p => p.id === postId);
    if (idx !== -1) wallPosts[idx] = post;

    const globalIndex = Array.from(document.querySelectorAll('.wall-card')).findIndex(c => c.dataset.id === postId);
    const oldCard = document.querySelector(`.wall-card[data-id="${postId}"]`);
    if (oldCard) {
        const newCard = buildWallCard(post, 0, globalIndex >= 0 ? globalIndex : idx);
        newCard.classList.add('wall-card-pulse');
        oldCard.replaceWith(newCard);
    }

    renderFeaturedThought();
    showToast(emoji + ' ' + wallReactions.find(r => r.emoji === emoji).label);
}

// ── SPARKLE + EMOJI PARTICLE BURST ──
function spawnFloatingEmoji(emoji, anchorEl) {
    const rect = anchorEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const SPARKLE_COLORS = ['#a8c4a2', '#f4d1b5', '#d6cfea', '#f2c6cf', '#f6e7a5', '#cfe7d6'];

    for (let i = 0; i < 3; i++) {
        const el = document.createElement('div');
        el.className = 'reaction-particle';
        el.textContent = emoji;
        const angle = (Math.PI * 2 * i / 3) + (Math.random() * 0.8 - 0.4);
        const dist = 25 + Math.random() * 20;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist - 15;
        const rot = (Math.random() * 60 - 30);
        el.style.left = cx + 'px';
        el.style.top = cy + 'px';
        el.style.setProperty('--dx', dx + 'px');
        el.style.setProperty('--dy', dy + 'px');
        el.style.setProperty('--rot', rot + 'deg');
        el.style.fontSize = (0.7 + Math.random() * 0.5) + 'rem';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 950);
    }

    for (let i = 0; i < 8; i++) {
        const dot = document.createElement('div');
        dot.className = 'reaction-sparkle';
        const angle = (Math.PI * 2 * i / 8) + (Math.random() * 0.5 - 0.25);
        const dist = 15 + Math.random() * 25;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist - 10;
        dot.style.left = cx + 'px';
        dot.style.top = cy + 'px';
        dot.style.setProperty('--dx', dx + 'px');
        dot.style.setProperty('--dy', dy + 'px');
        dot.style.background = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
        dot.style.width = (3 + Math.random() * 5) + 'px';
        dot.style.height = dot.style.width;
        dot.style.animationDelay = (Math.random() * 0.08) + 's';
        document.body.appendChild(dot);
        setTimeout(() => dot.remove(), 800);
    }
}

// ── LOAD MORE ──
function loadMoreWall() {
    renderWallFeed(false);
}

// ── FILTER ──
function setWallFilter(filter, btn) {
    wallFilter = filter;
    document.querySelectorAll('.wall-tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    loadWallPosts(true);
}

// ── INIT ──
function initWallPage() {
    currentPromptIndex = Math.floor(Math.random() * wallPrompts.length);
    document.getElementById('wallPromptLabel').textContent = wallPrompts[currentPromptIndex];
    updateWallCharCount();
    loadWallPosts(true);
}

// ── HELPERS ──
function getTimeAgo(timestamp) {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
