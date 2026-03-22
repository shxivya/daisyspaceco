// ── THEME TOGGLE (DARK / LIGHT) ──

const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

// Load saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
    updateThemeToggleLabel(savedTheme);
}

function updateThemeToggleLabel(mode) {
    const icon = themeToggle.querySelector('.icon-pill-icon');
    const label = themeToggle.querySelector('.icon-pill-label');
    if (icon) icon.textContent = mode === 'dark' ? '☀' : '☾';
    if (label) label.textContent = mode === 'dark' ? 'Light' : 'Dark';
    themeToggle.setAttribute('aria-label', mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    themeToggle.style.setProperty('--pill-expanded-width', mode === 'dark' ? '82px' : '90px');
}

themeToggle.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeToggleLabel(newTheme);
    applyColorTheme(activeColorTheme, newTheme);
});

// ── COLOUR PALETTE THEMES ──

let activeColorTheme = localStorage.getItem('color_theme') || 'sage';

function applyColorTheme(themeId, mode) {
    const theme = colorThemes.find(t => t.id === themeId);
    if (!theme) return;

    const isDark = (mode || root.getAttribute('data-theme')) === 'dark';
    const vars = isDark ? theme.dark : theme.light;

    Object.entries(vars).forEach(([prop, val]) => {
        if (prop.startsWith('--blob')) return;
        root.style.setProperty(prop, val);
    });

    const blob1 = document.querySelector('.blob1');
    const blob2 = document.querySelector('.blob2');
    const blob3 = document.querySelector('.blob3');
    if (blob1) blob1.style.background = `radial-gradient(circle,${vars['--blob1-color']} 0%,transparent 68%)`;
    if (blob2) blob2.style.background = `radial-gradient(circle,${vars['--blob2-color']} 0%,transparent 68%)`;
    if (blob3) blob3.style.background = `radial-gradient(circle,${vars['--blob3-color']} 0%,transparent 68%)`;

    activeColorTheme = themeId;
    localStorage.setItem('color_theme', themeId);

    document.querySelectorAll('.theme-swatch-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.themeId === themeId);
        btn.setAttribute('aria-pressed', btn.dataset.themeId === themeId ? 'true' : 'false');
    });
}

function buildThemePicker() {
    const container = document.getElementById('themeSwatches');
    if (!container) return;

    colorThemes.forEach(theme => {
        const btn = document.createElement('button');
        btn.className = 'theme-swatch-btn' + (theme.id === activeColorTheme ? ' active' : '');
        btn.dataset.themeId = theme.id;
        btn.title = theme.name;
        btn.setAttribute('aria-pressed', theme.id === activeColorTheme ? 'true' : 'false');
        btn.setAttribute('aria-label', `Set colour theme: ${theme.name}`);
        btn.innerHTML = `
      <span class="theme-swatch-dot" style="background:${theme.swatch}" aria-hidden="true"></span>
      <span class="theme-swatch-dot secondary" style="background:${theme.swatchAlt}" aria-hidden="true"></span>
      <span class="theme-swatch-name">${theme.name}</span>
    `;
        btn.onclick = () => {
            applyColorTheme(theme.id);
            btn.classList.add('picked');
            setTimeout(() => btn.classList.remove('picked'), 400);
        };
        container.appendChild(btn);
    });
}

function toggleThemePicker() {
    const panel = document.getElementById('themePickerPanel');
    const backdrop = document.getElementById('themePickerBackdrop');
    const isOpen = panel.classList.contains('open');
    if (isOpen) {
        closeThemePicker();
    } else {
        panel.classList.add('open');
        backdrop.classList.add('open');
    }
}

function closeThemePicker() {
    document.getElementById('themePickerPanel').classList.remove('open');
    document.getElementById('themePickerBackdrop').classList.remove('open');
}
