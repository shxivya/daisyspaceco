// ── THE RELEASE ──

// ── Enhancement 5: Rotating writing prompts ──
const RELEASE_PROMPTS = [
    "What's been weighing on you?",
    "What do you wish you could say out loud?",
    "What are you ready to let go of?",
    "What would you say if no one could hear?",
    "What does your heart need to put down?",
    "What's been sitting heavy lately?",
    "What truth have you been avoiding?",
    "What would feel lighter if you wrote it here?",
];

let promptInterval = null;
let promptIndex = 0;

function startPromptRotation() {
    const el = document.getElementById('diaryPrompt');
    const writing = document.getElementById('diaryWriting');
    if (!el) return;

    promptIndex = Math.floor(Math.random() * RELEASE_PROMPTS.length);
    el.textContent = RELEASE_PROMPTS[promptIndex];
    void el.offsetWidth;
    el.classList.add('prompt-visible');

    promptInterval = setInterval(() => {
        if (writing && writing.innerText.trim().length > 0) {
            stopPromptRotation();
            return;
        }
        el.classList.remove('prompt-visible');
        setTimeout(() => {
            promptIndex = (promptIndex + 1) % RELEASE_PROMPTS.length;
            el.textContent = RELEASE_PROMPTS[promptIndex];
            el.classList.add('prompt-visible');
        }, 500);
    }, 4000);

    if (writing) {
        writing.addEventListener('input', stopPromptRotation, { once: true });
    }
}

function stopPromptRotation() {
    if (promptInterval) { clearInterval(promptInterval); promptInterval = null; }
    const el = document.getElementById('diaryPrompt');
    if (el) el.classList.remove('prompt-visible');
}

// ── Enhancement 4: Particle burst ──
function spawnReleaseParticles() {
    const container = document.getElementById('releaseParticles');
    if (!container) return;
    container.innerHTML = '';

    const count = 24;
    for (let i = 0; i < count; i++) {
        const p = document.createElement('span');
        p.className = 'rp';
        const size = 4 + Math.random() * 7;
        const x = 20 + Math.random() * 60;
        const drift = (Math.random() - 0.5) * 240;
        const rise = -(100 + Math.random() * 180);
        const delay = Math.random() * 800;
        const dur = 1400 + Math.random() * 700;
        const opacity = 0.3 + Math.random() * 0.45;
        p.style.cssText = `
            width:${size}px; height:${size}px;
            left:${x}%;
            --drift:${drift}px; --rise:${rise}px;
            animation-delay:${delay}ms;
            animation-duration:${dur}ms;
            opacity:${opacity};
        `;
        container.appendChild(p);
        setTimeout(() => { try { container.removeChild(p); } catch (e) { } }, delay + dur + 100);
    }
}

// ── Enhancement 2 + new animation: word-by-word soft fade ──
function triggerRelease() {
    const writing = document.getElementById('diaryWriting');
    const rawText = writing.innerText.trim();

    if (!rawText) {
        writing.classList.add('diary-nudge');
        setTimeout(() => writing.classList.remove('diary-nudge'), 600);
        return;
    }

    stopPromptRotation();

    const btn = document.getElementById('releaseBtn');
    btn.disabled = true;

    // Split preserving whitespace: wrap each "token" (word or whitespace run)
    // so we fade word by word from the first word onward.
    const tokens = rawText.split(/(\s+)/);
    writing.innerHTML = tokens.map(token => {
        if (!token.trim()) {
            // Pure whitespace — keep as-is, no wrapper
            return token.replace(/\n/g, '<br>');
        }
        return `<span class="release-word">${token}</span>`;
    }).join('');

    const words = Array.from(writing.querySelectorAll('.release-word'));
    const fadePerWord = 130;    // ms gap between each word starting its fade
    const fadeDuration = 900;    // ms — matches CSS transition

    words.forEach((w, i) => {
        setTimeout(() => w.classList.add('ev'), i * fadePerWord);
    });

    // After last word fades out, dissolve the diary content and show response
    const totalFade = words.length * fadePerWord + fadeDuration + 400;
    setTimeout(() => {
        const diaryContent = document.getElementById('diaryContent');
        const response = document.getElementById('releaseResponse');
        const btnRow = document.getElementById('releaseBtnRow');

        if (diaryContent) {
            diaryContent.style.transition = 'opacity 0.7s ease';
            diaryContent.style.opacity = '0';
        }
        setTimeout(() => {
            if (response) response.classList.add('visible');
            if (btnRow) { btnRow.style.opacity = '0'; btnRow.style.pointerEvents = 'none'; }
            if (writing) { writing.innerHTML = ''; writing.contentEditable = 'false'; }
        }, 700);
    }, totalFade);
}

function initReleasePage() {
    const dateEl = document.getElementById('diaryDate');
    if (dateEl) {
        dateEl.textContent = new Date().toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    }
    const writing = document.getElementById('diaryWriting');
    const response = document.getElementById('releaseResponse');
    const btnRow = document.getElementById('releaseBtnRow');
    const diaryContent = document.getElementById('diaryContent');
    const btn = document.getElementById('releaseBtn');

    if (writing) { writing.innerHTML = ''; writing.contentEditable = 'true'; }
    if (response) response.classList.remove('visible');
    if (btnRow) { btnRow.style.opacity = '1'; btnRow.style.pointerEvents = 'auto'; }
    if (diaryContent) { diaryContent.style.opacity = '1'; diaryContent.style.transition = ''; }
    if (btn) btn.disabled = false;

    stopPromptRotation();
    setTimeout(startPromptRotation, 400);
}
