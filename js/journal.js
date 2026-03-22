// ── JOURNAL ──

function selectMoodTag(btn) {
    document.querySelectorAll('.mood-tag-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
    });
    if (selectedMoodTagValue === btn.dataset.mood) {
        selectedMoodTagValue = null;
    } else {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        selectedMoodTagValue = btn.dataset.mood;
    }
}

function openJournalModal() {
    const modal = document.getElementById('journalModal');
    const input = document.getElementById('journalInput');
    if (modal.classList.contains('open')) return;
    input.value = '';
    selectedMoodTagValue = null;
    document.querySelectorAll('.mood-tag-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
    });
    modal.classList.add('open');
    void modal.offsetWidth;
    setTimeout(() => input.focus(), 150);
}

function closeJournalModal() {
    document.getElementById('journalModal').classList.remove('open');
}

function saveJournalEntry() {
    const input = document.getElementById('journalInput');
    const text = input.value.trim();
    if (!text && !selectedMoodTagValue) { closeJournalModal(); return; }

    const key = new Date().toISOString();
    const journal = JSON.parse(localStorage.getItem('kindness_journal') || '{}');
    journal[key] = {
        text: text || '',
        act: currentAct ? currentAct.text : null,
        category: currentAct ? currentAct.category : null,
        mood: selectedMoodTagValue || null,
        pinned: false,
        timestamp: key
    };
    localStorage.setItem('kindness_journal', JSON.stringify(journal));
    closeJournalModal();
    renderJournal();
}

function togglePin(dateKey) {
    const journal = JSON.parse(localStorage.getItem('kindness_journal') || '{}');
    if (journal[dateKey]) {
        journal[dateKey].pinned = !journal[dateKey].pinned;
        localStorage.setItem('kindness_journal', JSON.stringify(journal));
        renderJournal();
    }
}

function deleteEntry(dateKey) {
    if (!confirm('Delete this entry?')) return;
    const journal = JSON.parse(localStorage.getItem('kindness_journal') || '{}');
    delete journal[dateKey];
    localStorage.setItem('kindness_journal', JSON.stringify(journal));
    renderJournal();
}

function startEditEntry(dateKey) {
    const journal = JSON.parse(localStorage.getItem('kindness_journal') || '{}');
    const entry = journal[dateKey];
    if (!entry) return;
    const card = document.querySelector(`.journal-entry[data-key="${CSS.escape(dateKey)}"]`);
    if (!card) return;
    const bodyEl = card.querySelector('.journal-entry-body-wrap');
    const safeId = 'edit-' + dateKey.replace(/\s/g, '_');
    bodyEl.innerHTML = `
    <textarea class="journal-inline-edit" id="${safeId}" aria-label="Edit journal entry">${entry.text || ''}</textarea>
    <div class="journal-edit-actions">
      <button class="btn-ghost small" onclick="renderJournal()">Cancel</button>
      <button class="btn-primary small" onclick="commitEdit('${dateKey}')">Save</button>
    </div>
  `;
    document.getElementById(safeId).focus();
}

function commitEdit(dateKey) {
    const journal = JSON.parse(localStorage.getItem('kindness_journal') || '{}');
    const el = document.getElementById('edit-' + dateKey.replace(/\s/g, '_'));
    if (journal[dateKey] && el) {
        journal[dateKey].text = el.value.trim();
        localStorage.setItem('kindness_journal', JSON.stringify(journal));
    }
    renderJournal();
}

function renderJournal() {
    const journalList = document.getElementById('journalList');
    const statsEl = document.getElementById('journalStats');
    if (!journalList) return;

    const journal = JSON.parse(localStorage.getItem('kindness_journal') || '{}');
    const searchQuery = (document.getElementById('journalSearch')?.value || '').toLowerCase();
    const filterVal = document.getElementById('journalFilter')?.value || 'all';

    let entries = Object.entries(journal).sort((a, b) => new Date(b[0]) - new Date(a[0]));

    if (filterVal === 'pinned') entries = entries.filter(([, e]) => e.pinned);
    else if (filterVal !== 'all') entries = entries.filter(([, e]) => e.mood === filterVal);

    if (searchQuery) {
        entries = entries.filter(([key, e]) =>
            (e.text || '').toLowerCase().includes(searchQuery) ||
            (e.act || '').toLowerCase().includes(searchQuery) ||
            new Date(key).toDateString().toLowerCase().includes(searchQuery)
        );
    }

    if (statsEl) {
        const total = Object.keys(journal).length;
        const pinned = Object.values(journal).filter(e => e.pinned).length;
        statsEl.innerHTML = total > 0
            ? `<span>${total} entr${total === 1 ? 'y' : 'ies'}</span>${pinned ? `<span>📌 ${pinned} pinned</span>` : ''}`
            : '';
    }

    journalList.innerHTML = '';

    buildOnThisDay(journal);

    if (!entries.length) {
        journalList.innerHTML = `<p class="placeholder-text">${searchQuery || filterVal !== 'all' ? 'No entries match your search.' : 'Your reflections will appear here 🌿'}</p>`;
        return;
    }

    const pinnedEntries = entries.filter(([, e]) => e.pinned);
    if (pinnedEntries.length && filterVal !== 'pinned') {
        const pinnedSection = document.createElement('div');
        pinnedSection.className = 'journal-date-group';
        pinnedSection.innerHTML = `<div class="journal-date-header"><span class="journal-date-label">📌 Pinned</span></div>`;
        pinnedEntries.forEach(([key, entry]) => pinnedSection.appendChild(buildEntryCard(key, entry)));
        journalList.appendChild(pinnedSection);
    }

    const toShow = filterVal === 'pinned' ? entries : entries.filter(([, e]) => !e.pinned);

    const groups = {};
    const groupOrder = [];
    toShow.forEach(([key, entry]) => {
        const groupKey = new Date(key).toDateString();
        if (!groups[groupKey]) {
            groups[groupKey] = {
                label: new Date(key).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
                entries: []
            };
            groupOrder.push(groupKey);
        }
        groups[groupKey].entries.push([key, entry]);
    });

    groupOrder.forEach(groupKey => {
        const group = groups[groupKey];
        const section = document.createElement('div');
        section.className = 'journal-date-group';
        const count = group.entries.length;
        section.innerHTML = `<div class="journal-date-header"><span class="journal-date-label">${group.label.toUpperCase()}</span><span class="journal-date-count">${count} entr${count === 1 ? 'y' : 'ies'}</span></div>`;
        group.entries.forEach(([key, entry]) => section.appendChild(buildEntryCard(key, entry)));
        journalList.appendChild(section);
    });
}

function buildEntryCard(key, entry) {
    const safeText = (entry.text && entry.text !== 'undefined') ? entry.text : null;
    const d = new Date(key);
    const isTimestamp = key.includes('T');
    const timeLabel = isTimestamp
        ? d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
        : null;

    const wrapper = document.createElement('div');
    wrapper.className = 'journal-entry' + (entry.pinned ? ' pinned' : '');
    wrapper.dataset.key = key;

    const safeKey = key.replace(/'/g, "\\'");
    const pinLabel = entry.pinned ? 'Unpin entry' : 'Pin entry';

    // Category tag
    const CATEGORY_TAGS = {
        'Community': { icon: '🌿', cls: 'cat-tag-community' },
        'Digital': { icon: '💻', cls: 'cat-tag-digital' },
        'Connection': { icon: '💛', cls: 'cat-tag-connection' },
        'Self': { icon: '🧡', cls: 'cat-tag-self' },
        'Presence': { icon: '✨', cls: 'cat-tag-presence' },
        'Generosity': { icon: '🎁', cls: 'cat-tag-generosity' },
    };
    const catInfo = entry.category ? CATEGORY_TAGS[entry.category] : null;
    const catTagHtml = catInfo
        ? `<span class="journal-category-tag ${catInfo.cls}">${catInfo.icon} ${entry.category === 'Self' ? 'Self-Care' : entry.category}</span>`
        : '';

    // Rich text formatting
    const formattedText = safeText ? formatRichText(safeText) : null;

    wrapper.innerHTML = `
    <div class="journal-entry-header">
      <div class="journal-entry-meta">
        ${timeLabel ? `<span class="journal-entry-time">${timeLabel}</span>` : ''}
        ${entry.mood ? `<span class="journal-mood-tag">${moodTagDisplay[entry.mood] || entry.mood}</span>` : ''}
        ${catTagHtml}
      </div>
      <div class="journal-entry-actions" role="group" aria-label="Entry actions">
        <button class="je-action-btn" aria-label="${pinLabel}" title="${pinLabel}" onclick="togglePin('${safeKey}')">${entry.pinned ? '📌' : '☆'}</button>
        <button class="je-action-btn" aria-label="Edit entry" title="Edit" onclick="startEditEntry('${safeKey}')">✎</button>
        <button class="je-action-btn danger" aria-label="Delete entry" title="Delete" onclick="deleteEntry('${safeKey}')">✕</button>
      </div>
    </div>
    <div class="journal-entry-body-wrap">
      ${formattedText ? `<p class="journal-entry-thought">"${formattedText}"</p>` : ''}
      ${entry.act ? `<p class="journal-entry-act"><span class="act-pill">Act</span>${entry.act}</p>` : ''}
    </div>
  `;
    return wrapper;
}

// ── Rich Text Formatting ──
function formatRichText(text) {
    // Escape HTML first
    let safe = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // **bold** → <strong>
    safe = safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // *italic* → <em>
    safe = safe.replace(/\*(.+?)\*/g, '<em>$1</em>');
    return safe;
}

// ── On This Day Memories ──
function buildOnThisDay(journal) {
    const section = document.getElementById('onThisDaySection');
    if (!section) return;

    const today = new Date();
    const memories = [];

    const periods = [
        { label: '🌿 A week ago, you were kind…', days: 7 },
        { label: '🌸 A month ago, you reflected…', days: 30 },
        { label: '✨ A year ago, you wrote…', days: 365 },
    ];

    const entries = Object.entries(journal);

    periods.forEach(period => {
        const target = new Date(today);
        target.setDate(today.getDate() - period.days);
        const targetDateStr = target.toDateString();

        // Find entries from that day
        const matches = entries.filter(([key]) => {
            return new Date(key).toDateString() === targetDateStr;
        });

        if (matches.length > 0) {
            const [key, entry] = matches[0]; // Take the first match
            memories.push({ label: period.label, entry, key, date: target });
        }
    });

    if (memories.length === 0) {
        section.style.display = 'none';
        return;
    }

    section.style.display = 'block';
    section.innerHTML = '';

    memories.forEach(mem => {
        const card = document.createElement('div');
        card.className = 'on-this-day-card';

        const safeText = (mem.entry.text && mem.entry.text !== 'undefined') ? formatRichText(mem.entry.text) : null;
        const dateStr = mem.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        card.innerHTML = `
            <div class="on-this-day-label">${mem.label}</div>
            ${safeText ? `<p class="on-this-day-text">"${safeText}"</p>` : ''}
            ${mem.entry.act ? `<p class="on-this-day-act">✦ ${mem.entry.act}</p>` : ''}
            <p class="on-this-day-date">${dateStr}</p>
        `;
        section.appendChild(card);
    });
}

function exportJournalPDF() {
    const journal = JSON.parse(localStorage.getItem('kindness_journal') || '{}');
    const entries = Object.entries(journal).sort((a, b) => new Date(b[0]) - new Date(a[0]));
    if (!entries.length) { showToast('No entries to export.'); return; }

    let html = `<html><head><style>
    body{font-family:Georgia,serif;max-width:680px;margin:40px auto;color:#3d3228;line-height:1.7;}
    h1{font-size:2rem;font-weight:400;margin-bottom:0.3rem;}
    .sub{color:#9e9082;font-size:0.82rem;margin-bottom:2.5rem;letter-spacing:0.1em;text-transform:uppercase;}
    .entry{border-top:1px solid #ddd7c6;padding:1.5rem 0;}
    .d{font-size:0.72rem;letter-spacing:0.2em;text-transform:uppercase;color:#9e9082;margin-bottom:0.5rem;}
    .mood{display:inline-block;background:#d4e4d0;color:#587a5c;font-size:0.73rem;padding:2px 10px;border-radius:20px;margin-left:0.5rem;}
    .t{font-size:1.05rem;font-style:italic;margin:0.5rem 0;}
    .a{font-size:0.88rem;color:#6b5c4e;margin-top:0.4rem;}
    .al{font-weight:700;color:#587a5c;margin-right:0.4rem;}
    .foot{margin-top:3rem;font-size:0.73rem;color:#9e9082;text-align:center;letter-spacing:0.12em;text-transform:uppercase;}
  </style></head><body>
  <h1>Kindness Journal</h1>
  <p class="sub">Exported ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>`;

    entries.forEach(([date, e]) => {
        const safeText = (e.text && e.text !== 'undefined') ? e.text : null;
        html += `<div class="entry">
      <div class="d">${date}${e.mood ? `<span class="mood">${e.mood}</span>` : ''}</div>
      ${safeText ? `<p class="t">"${safeText}"</p>` : ''}
      ${e.act ? `<p class="a"><span class="al">Act:</span>${e.act}</p>` : ''}
    </div>`;
    });

    html += `<div class="foot">todayskindness.co · ${entries.length} entr${entries.length === 1 ? 'y' : 'ies'}</div></body></html>`;

    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 400);
}
