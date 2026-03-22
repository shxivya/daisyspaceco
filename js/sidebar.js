// ── SIDEBAR ──

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (sidebar.classList.contains('open')) {
        closeSidebar();
    } else {
        sidebar.classList.add('open');
        backdrop.classList.add('open');
        refreshSidebar();
    }
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarBackdrop').classList.remove('open');
}

function refreshSidebar() {
    const streakEl = document.getElementById('sidebarStreak');
    if (streakEl) streakEl.textContent = document.getElementById('streakCount')?.textContent || '0';

    const affirmEl = document.getElementById('sidebarAffirmation');
    if (affirmEl && currentAffirmation) {
        affirmEl.textContent = '"' + currentAffirmation.text + '"';
    }

    const quoteEl = document.getElementById('sidebarQuote');
    if (quoteEl) {
        quoteEl.textContent = '"' + sidebarQuotes[Math.floor(Math.random() * sidebarQuotes.length)] + '"';
    }
}
