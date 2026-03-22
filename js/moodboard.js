// ── MOOD BOARD ──

function initMoodBoard() {
    const bar = document.getElementById('moodColorBar');
    const label = document.getElementById('activeMoodLabel');
    if (!bar) return;

    bar.innerHTML = '';
    coreMoods.forEach((m, i) => {
        const swatch = document.createElement('div');
        swatch.className = 'mood-swatch';
        swatch.style.background = m.color;
        swatch.setAttribute('role', 'button');
        swatch.setAttribute('tabindex', '0');
        swatch.setAttribute('aria-label', `Log mood: ${m.name}`);
        swatch.title = m.name;

        swatch.onmouseenter = () => { label.textContent = m.name; label.style.color = m.color; };
        swatch.onmouseleave = () => { label.textContent = "How are you feeling?"; label.style.color = "var(--muted)"; };
        swatch.onclick = () => logMood(i);
        swatch.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') logMood(i); };

        bar.appendChild(swatch);
    });

    updateGridView();
    buildHeatmapCalendar();
    buildMoodSparkline();
}

// ── MOOD LOGGING ──
function logMood(index) {
    const mood = coreMoods[index];
    const today = new Date().toDateString();

    const randomIndex = Math.floor(Math.random() * mood.quotes.length);
    const selectedQuote = mood.quotes[randomIndex];

    let history = JSON.parse(localStorage.getItem('mood_history') || '{}');
    history[today] = mood.color;
    localStorage.setItem('mood_history', JSON.stringify(history));

    document.getElementById('moodQuote').textContent = selectedQuote.text;
    document.getElementById('moodAuthor').textContent = "— " + selectedQuote.author;

    updateGridView();
    buildHeatmapCalendar();
    buildMoodSparkline();
    showToast(`🌿 Logged as ${mood.name}`);
}

// ── NAVIGATION & GRID LOGIC ──
function changeDate(step) {
    const type = document.getElementById('gridTypeSelector').value;
    if (type === 'monthly') viewDate.setMonth(viewDate.getMonth() + step);
    if (type === 'yearly') viewDate.setFullYear(viewDate.getFullYear() + step);
    updateGridView();
}

function updateGridView() {
    const selector = document.getElementById('gridTypeSelector');
    const container = document.getElementById('moodGridContainer');
    const labels = document.getElementById('dayLabels');
    const nav = document.getElementById('dateNavigation');
    const dateLabel = document.getElementById('currentDateLabel');
    const history = JSON.parse(localStorage.getItem('mood_history') || '{}');

    if (!selector || !container) return;

    const type = selector.value;
    container.innerHTML = '';
    labels.innerHTML = '';

    container.style.display = (type === 'yearly') ? 'flex' : 'grid';
    container.className = `grid-${type}`;
    nav.style.display = (type === 'weekly') ? 'none' : 'flex';
    labels.style.display = (type === 'yearly') ? 'none' : 'grid';

    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    if (type === 'weekly') {
        days.forEach(d => labels.innerHTML += `<span>${d}</span>`);
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - d.getDay() + i);
            createCell(container, d, history);
        }
    }

    else if (type === 'monthly') {
        days.forEach(d => labels.innerHTML += `<span>${d}</span>`);
        dateLabel.textContent = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });

        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let s = 0; s < firstDay; s++) {
            const spacer = document.createElement('div');
            spacer.className = 'grid-cell spacer';
            container.appendChild(spacer);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const d = new Date(year, month, i);
            createCell(container, d, history);
        }
    }

    else if (type === 'yearly') {
        dateLabel.textContent = viewDate.getFullYear();
        const monthNames = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

        monthNames.forEach((name, monthIndex) => {
            const col = document.createElement('div');
            col.className = 'year-month-column';

            const mLabel = document.createElement('span');
            mLabel.className = 'column-label';
            mLabel.textContent = name;
            col.appendChild(mLabel);

            const daysInM = new Date(viewDate.getFullYear(), monthIndex + 1, 0).getDate();
            for (let i = 1; i <= daysInM; i++) {
                const d = new Date(viewDate.getFullYear(), monthIndex, i);
                createCell(col, d, history, true);
            }
            container.appendChild(col);
        });
    }
}

function createCell(container, date, history, isSmall = false) {
    const cell = document.createElement('div');
    cell.className = isSmall ? 'grid-cell small' : 'grid-cell';
    const dateKey = date.toDateString();
    cell.style.background = history[dateKey] || 'var(--soft)';
    cell.title = dateKey;
    container.appendChild(cell);
}

// ── MOOD HEATMAP CALENDAR ──
let heatmapDate = new Date();

function changeHeatmapMonth(step) {
    heatmapDate.setMonth(heatmapDate.getMonth() + step);
    buildHeatmapCalendar();
}

function buildHeatmapCalendar() {
    const grid = document.getElementById('heatmapGrid');
    const dayLabels = document.getElementById('heatmapDayLabels');
    const monthLabel = document.getElementById('heatmapMonthLabel');
    const legendEl = document.getElementById('heatmapLegend');
    if (!grid) return;

    const history = JSON.parse(localStorage.getItem('mood_history') || '{}');
    const year = heatmapDate.getFullYear();
    const month = heatmapDate.getMonth();
    const today = new Date();

    monthLabel.textContent = heatmapDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    // Day labels
    dayLabels.innerHTML = '';
    ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(d => {
        const span = document.createElement('span');
        span.textContent = d;
        dayLabels.appendChild(span);
    });

    // Grid
    grid.innerHTML = '';
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let s = 0; s < firstDay; s++) {
        const spacer = document.createElement('div');
        spacer.className = 'heatmap-cell spacer';
        grid.appendChild(spacer);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const d = new Date(year, month, i);
        const dateKey = d.toDateString();
        const cell = document.createElement('div');
        cell.className = 'heatmap-cell';

        const moodColor = history[dateKey];
        if (moodColor) {
            cell.style.background = moodColor;
            cell.style.opacity = '0.85';
            const moodObj = coreMoods.find(m => m.color === moodColor);
            cell.title = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' — ' + (moodObj ? moodObj.name : 'Logged');
        } else {
            cell.style.background = 'var(--soft)';
            cell.title = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }

        if (d.toDateString() === today.toDateString()) {
            cell.classList.add('today');
        }

        const dayNum = document.createElement('span');
        dayNum.className = 'cell-day';
        dayNum.textContent = i;
        cell.appendChild(dayNum);

        grid.appendChild(cell);
    }

    // Legend
    legendEl.innerHTML = '';
    coreMoods.forEach(m => {
        const item = document.createElement('div');
        item.className = 'legend-item';
        const dot = document.createElement('div');
        dot.className = 'legend-dot';
        dot.style.background = m.color;
        const label = document.createElement('span');
        label.textContent = m.name;
        item.appendChild(dot);
        item.appendChild(label);
        legendEl.appendChild(item);
    });
}

// ── MOOD SPARKLINE ──
const MOOD_HAPPINESS = {
    '#A8C4A2': 7, '#F6E7A5': 9, '#EDE8DE': 5, '#F2C6CF': 8,
    '#D6CFEA': 7, '#CFE7D6': 8, '#F4D1B5': 6, '#C2B5A3': 4,
    '#E8CCB5': 3, '#D4B5A0': 2, '#B5C9D6': 2, '#C8BFD6': 3,
};

function buildMoodSparkline() {
    const svg = document.getElementById('moodSparkline');
    const container = document.getElementById('sparklineContainer');
    if (!svg || !container) return;

    const history = JSON.parse(localStorage.getItem('mood_history') || '{}');
    const today = new Date();
    const points = [];

    for (let i = 13; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const color = history[d.toDateString()];
        points.push({
            color: color || null,
            value: color ? (MOOD_HAPPINESS[color] || 5) : null,
            label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        });
    }

    const hasData = points.some(p => p.value !== null);
    svg.innerHTML = '';

    if (!hasData) {
        // Remove SVG and show message
        container.innerHTML = '<p class="sparkline-no-data">Log a mood to see your trend line appear here…</p>';
        return;
    }

    // Make sure SVG is present (in case we replaced it with message before)
    if (!document.getElementById('moodSparkline')) {
        container.innerHTML = '<svg id="moodSparkline" viewBox="0 0 420 100" preserveAspectRatio="none"></svg>';
    }

    const w = 420, h = 100, pad = 15, maxVal = 10;
    const ns = 'http://www.w3.org/2000/svg';

    // Build path points
    const pts = [];
    let lastVal = 5;
    points.forEach((p, i) => {
        const x = pad + (i / 13) * (w - pad * 2);
        const val = p.value !== null ? p.value : lastVal;
        if (p.value !== null) lastVal = p.value;
        const y = h - pad - ((val / maxVal) * (h - pad * 2));
        pts.push({ x, y, color: p.color, val: p.value, label: p.label });
    });

    // Gradient
    const defs = document.createElementNS(ns, 'defs');
    const grad = document.createElementNS(ns, 'linearGradient');
    grad.setAttribute('id', 'sparkGrad');
    grad.setAttribute('x1', '0'); grad.setAttribute('y1', '0');
    grad.setAttribute('x2', '0'); grad.setAttribute('y2', '1');
    const s1 = document.createElementNS(ns, 'stop');
    s1.setAttribute('offset', '0%'); s1.setAttribute('stop-color', 'var(--sage)'); s1.setAttribute('stop-opacity', '0.3');
    const s2 = document.createElementNS(ns, 'stop');
    s2.setAttribute('offset', '100%'); s2.setAttribute('stop-color', 'var(--sage)'); s2.setAttribute('stop-opacity', '0.02');
    grad.appendChild(s1); grad.appendChild(s2);
    defs.appendChild(grad); svg.appendChild(defs);

    // Smooth curve (catmull-rom → bezier)
    let linePath = 'M' + pts[0].x + ',' + pts[0].y;
    for (let i = 1; i < pts.length; i++) {
        const p0 = pts[Math.max(i - 2, 0)];
        const p1 = pts[i - 1];
        const p2 = pts[i];
        const p3 = pts[Math.min(i + 1, pts.length - 1)];
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        linePath += ' C' + cp1x + ',' + cp1y + ' ' + cp2x + ',' + cp2y + ' ' + p2.x + ',' + p2.y;
    }

    // Area fill
    const areaD = linePath + ' L' + pts[pts.length - 1].x + ',' + h + ' L' + pts[0].x + ',' + h + ' Z';
    const area = document.createElementNS(ns, 'path');
    area.setAttribute('d', areaD); area.setAttribute('fill', 'url(#sparkGrad)');
    svg.appendChild(area);

    // Stroke
    const line = document.createElementNS(ns, 'path');
    line.setAttribute('d', linePath); line.setAttribute('fill', 'none');
    line.setAttribute('stroke', 'var(--sage)'); line.setAttribute('stroke-width', '2.5');
    line.setAttribute('stroke-linecap', 'round'); line.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(line);

    // Dots
    pts.forEach(p => {
        if (p.val === null) return;
        const c = document.createElementNS(ns, 'circle');
        c.setAttribute('cx', p.x); c.setAttribute('cy', p.y); c.setAttribute('r', '4');
        c.setAttribute('fill', p.color || 'var(--sage)');
        c.setAttribute('stroke', 'white'); c.setAttribute('stroke-width', '2');
        const t = document.createElementNS(ns, 'title');
        const mObj = coreMoods.find(m => m.color === p.color);
        t.textContent = p.label + ': ' + (mObj ? mObj.name : 'Unknown');
        c.appendChild(t);
        svg.appendChild(c);
    });

    // Date labels
    [0, 6, 13].forEach(i => {
        const p = pts[i];
        const txt = document.createElementNS(ns, 'text');
        txt.setAttribute('x', p.x); txt.setAttribute('y', h - 1);
        txt.setAttribute('text-anchor', 'middle');
        txt.setAttribute('font-family', 'Lato, sans-serif');
        txt.setAttribute('font-size', '8'); txt.setAttribute('fill', 'var(--muted)');
        txt.textContent = p.label;
        svg.appendChild(txt);
    });
}
