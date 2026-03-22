// ── SHARED STATE ──
// All mutable variables that are read/written across multiple modules.

let currentAct = null;
let activeCategory = 'All';
let doneDates = JSON.parse(localStorage.getItem('kindness_done') || '[]');
let totalDone = parseInt(localStorage.getItem('kindness_total') || '0');

let currentAffirmation = null;
let showingAllAffirms = false;

let selectedMoodTagValue = null;

// Wall state
let currentPromptIndex = 0;
let wallFilter = 'recent';
let wallPage = 0;
const WALL_PAGE_SIZE = 10;
let wallPosts = [];
let myReactions = JSON.parse(localStorage.getItem('wall_my_reactions') || '{}');
let myPostIds = JSON.parse(localStorage.getItem('wall_my_posts') || '[]');

// Mood board view state
let viewDate = new Date();

// ── BOOTSTRAP ──
window.addEventListener('DOMContentLoaded', () => {
    buildFilters();
    buildStreak();
    buildKindnessChain();
    buildThemePicker();
    applyColorTheme(activeColorTheme);

    if (document.getElementById('moodColorBar')) {
        initMoodBoard();
    }

    const moodDateEl = document.getElementById('moodDate');
    if (moodDateEl) {
        moodDateEl.textContent = new Date().toLocaleDateString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric'
        });
    }

    renderJournal();

    // Route from landing.html (?page=xxx) — skip home page if navigating directly to a section
    const urlPage = new URLSearchParams(window.location.search).get('page');
    if (urlPage) {
        // Immediately jump to the target page, bypassing home
        const homeEl = document.getElementById('page-home');
        if (homeEl) homeEl.classList.remove('active');
        showPage(urlPage);
    } else {
        // Show home page
        document.body.classList.add('on-home-page');
        initHomePage();
    }
});
