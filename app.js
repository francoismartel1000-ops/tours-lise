// ============================================================
//  APP.JS — Tours Lise B. v3
//  + Nom auto · Autocomplete lieu · Autocomplete navire (horaire 2026)
// ============================================================
'use strict';

// ── NAVIRES HORAIRE SAGUENAY 2026 ─────────────────────────
const SHIPS_2026 = [
  'Viking Polaris','Viking Octantis','Pearl Mist','Volendam','Crown Princess',
  'Le Bellot','Azamara Journey','Viking Mars','Amera','Sapphire Princess',
  'Norwegian Jewel','Seven Seas Splendor','Mein Schiff 1','Hanseatic Inspiration',
  'Zuiderdam','Explora III','Silver Shadow','Le Lyrial','Queen Mary 2',
  'Victory II','Seabourn Ovation','Vista','Silver Nova','Nautica',
  'Norwegian Dawn','Marina','Majestic Princess','Regatta','Silver Whisper',
  'Le Champlain','World Voyager','Hanseatic Nature','Viking Saturn',
  'Azamara Quest','Seven Seas Navigator','Pearl Mist','Insignia',
  'Norwegian Sun','Koningsdam','Westerdam','Nieuw Amsterdam',
];

// ── STATE ─────────────────────────────────────────────────
const S = {
  seasons: [],
  activeSeason: null,
  activeTab: 'tours',
};

// Flag : le label a-t-il été modifié manuellement ?
let _labelTouched = false;

// ── STORAGE ───────────────────────────────────────────────
function persist() {
  localStorage.setItem('lise_v2_seasons', JSON.stringify(S.seasons));
  localStorage.setItem('lise_v2_active',  S.activeSeason || '');
}

function hydrate() {
  const raw = localStorage.getItem('lise_v2_seasons');
  if (raw) {
    S.seasons = JSON.parse(raw);
    S.activeSeason = localStorage.getItem('lise_v2_active') || (S.seasons[0] && S.seasons[0].id);
  } else {
    const s2025 = { id: 'season_2025', name: '2025', tours: SEED_2025 };
    S.seasons = [s2025];
    S.activeSeason = 'season_2025';
    persist();
  }
}

// ── HELPERS ───────────────────────────────────────────────
function uid() { return '_' + Math.random().toString(36).slice(2,9); }

function currentSeason() {
  return S.seasons.find(s => s.id === S.activeSeason) || S.seasons[0];
}

function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('fr-CA', { day: 'numeric', month: 'short' });
}

function fmtDateLong(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('fr-CA', { day: 'numeric', month: 'long' });
}

function realHours(meet, arrive) {
  if (!meet || !arrive) return null;
  const [mh, mm] = meet.split(':').map(Number);
  const [ah, am] = arrive.split(':').map(Number);
  const mins = (ah * 60 + am) - (mh * 60 + mm);
  if (mins <= 0) return null;
  return mins / 60;
}

function fmtHrs(h) {
  if (h === null || h === undefined || h === 0) return '—';
  const hrs = Math.floor(h);
  const mins = Math.round((h - hrs) * 60);
  return mins > 0 ? `${hrs}h${String(mins).padStart(2,'0')}` : `${hrs}h`;
}

function lastRate() {
  const season = currentSeason();
  if (!season) return null;
  const allLines = [];
  [...season.tours]
    .sort((a,b) => a.date.localeCompare(b.date))
    .forEach(t => {
      (t.workLines||[]).forEach(wl => {
        if (wl.sent > 0 && wl.consideredHrs > 0)
          allLines.push(wl.sent / wl.consideredHrs);
      });
    });
  return allLines.length ? allLines[allLines.length - 1] : null;
}

function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2400);
}

// ── AUTOCOMPLETE DATA ─────────────────────────────────────
// Collecte toutes les activités uniques de toutes les saisons
function allActivities() {
  const set = new Set();
  S.seasons.forEach(s => s.tours.forEach(t => { if (t.activity) set.add(t.activity); }));
  return [...set].sort();
}

// Collecte tous les navires uniques (historique + horaire 2026)
function allShips() {
  const set = new Set(SHIPS_2026);
  S.seasons.forEach(s => s.tours.forEach(t => { if (t.ship) set.add(t.ship); }));
  // Nettoyer les numéros de groupe ex: "Marina (1)" -> garder tel quel
  return [...set].sort((a,b) => a.localeCompare(b));
}

// Injecte les options dans les datalists
function refreshDataLists() {
  const actList = document.getElementById('dl-activities');
  const shipList = document.getElementById('dl-ships');
  if (actList)  actList.innerHTML  = allActivities().map(a => `<option value="${a}">`).join('');
  if (shipList) shipList.innerHTML = allShips().map(s => `<option value="${s}">`).join('');
}

// ── NOM AUTOMATIQUE ───────────────────────────────────────
function buildAutoLabel(date, activity, ship) {
  const parts = [];
  if (date)     parts.push(fmtDateLong(date));
  if (activity) parts.push(activity);
  if (ship)     parts.push(ship);
  if (!parts.length) return '';

  // Détecter les doublons dans la saison courante pour ajouter AM/PM/numéro
  const season = currentSeason();
  if (season && date) {
    const base = parts.join(' — ');
    const sameDay = season.tours.filter(t =>
      t.date === date &&
      t.id !== _editingTourId
    );
    if (sameDay.length > 0) {
      // Chercher s'il y a déjà un tour avec ce label de base
      const existing = sameDay.filter(t => t.label.startsWith(parts[0]));
      if (existing.length >= 1) return base + ` (${existing.length + 1})`;
    }
    return base;
  }
  return parts.join(' — ');
}

function updateAutoLabel() {
  if (_labelTouched) return; // l'utilisateur a modifié manuellement
  const date     = document.getElementById('tf-date').value;
  const activity = document.getElementById('tf-activity').value.trim();
  const ship     = document.getElementById('tf-ship').value.trim();
  const auto     = buildAutoLabel(date, activity, ship);
  if (auto) document.getElementById('tf-label').value = auto;
}

// ── TABS ──────────────────────────────────────────────────
function switchTab(tab) {
  S.activeTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + tab));
  renderActive();
}

function renderActive() {
  const t = S.activeTab;
  if (t === 'tours') renderTours();
  if (t === 'tips')  renderTips();
  if (t === 'work')  renderWork();
}

function renderSeasonBadge() {
  const s = currentSeason();
  document.getElementById('season-badge').textContent = s ? `Saison ${s.name}` : '—';
}

// ── TOURS PANEL ───────────────────────────────────────────
function renderTours() {
  const season = currentSeason();
  const list = document.getElementById('tours-list');
  if (!season || !season.tours.length) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">🚢</div><div class="empty-text">Aucun tour pour cette saison.<br>Appuyez sur ＋ pour commencer.</div></div>`;
    return;
  }
  const sorted = [...season.tours].sort((a,b) => a.date.localeCompare(b.date) || a.label.localeCompare(b.label));
  list.innerHTML = sorted.map(t => buildTourCard(t)).join('');
}

function buildTourCard(t) {
  const photoEl = t.photo
    ? `<div class="tc-photo" onclick="openPhotoViewer('${t.id}')"><img src="${t.photo}" alt=""></div>`
    : `<div class="tc-photo" onclick="triggerPhoto('${t.id}')">📄</div>`;

  const ship = t.ship     ? `<div class="tc-ship">🚢 ${t.ship}</div>` : '';
  const act  = t.activity ? `<div class="tc-act">📍 ${t.activity}</div>` : '';

  const tips = t.tips || {};
  const tipParts = [];
  if (tips.can) tipParts.push(`$${tips.can} CAD`);
  if (tips.us)  tipParts.push(`$${tips.us} USD`);
  if (tips.eur) tipParts.push(`€${tips.eur}`);
  if (tips.aud) tipParts.push(`$${tips.aud} AUD`);

  const wls  = t.workLines || [];
  const totH = wls.reduce((s,w) => s + (w.consideredHrs||0), 0);
  const totS = wls.reduce((s,w) => s + (w.sent||0), 0);

  const meta = [
    t.adults  ? `<span class="badge ac">👥 ${t.adults}</span>` : '',
    t.bus     ? `<span class="badge">🚌 ${t.bus}</span>` : '',
    tipParts.length ? `<span class="badge gd">💰 ${tipParts.join(' · ')}</span>` : '',
    wls.length ? `<span class="badge">⏱ ${fmtHrs(totH)} · $${totS.toFixed(2)}</span>` : '',
  ].filter(Boolean).join('');

  return `
    <div class="tour-card" id="tc-${t.id}">
      <div class="tc-header" onclick="openEditTour('${t.id}')">
        ${photoEl}
        <div class="tc-info">
          <div class="tc-label">${t.label}</div>
          ${ship}${act}
        </div>
        <div style="color:var(--text3);font-size:18px;padding:4px">›</div>
      </div>
      ${meta ? `<div class="tc-meta">${meta}</div>` : ''}
    </div>`;
}

// ── TOUR FORM ─────────────────────────────────────────────
let _editingTourId = null;

function openAddTour() {
  _editingTourId = null;
  _labelTouched = false;
  document.getElementById('tour-modal-title').textContent = 'Nouveau tour';
  document.getElementById('tf-id').value        = '';
  document.getElementById('tf-date').value      = new Date().toISOString().slice(0,10);
  document.getElementById('tf-label').value     = '';
  document.getElementById('tf-ship').value      = '';
  document.getElementById('tf-activity').value  = '';
  document.getElementById('tf-bus').value       = '';
  document.getElementById('tf-adults').value    = '';
  document.getElementById('tf-children').value  = '0';
  document.getElementById('tf-escort').value    = '';
  document.getElementById('tf-can').value       = '';
  document.getElementById('tf-us').value        = '';
  document.getElementById('tf-eur').value       = '';
  document.getElementById('tf-aud').value       = '';
  document.getElementById('tf-delete-btn').style.display = 'none';
  refreshDataLists();
  renderWorkLinesForm([]);
  updateAutoLabel();
  openModal('modal-tour');
}

function openEditTour(id) {
  const season = currentSeason();
  const t = season.tours.find(t => t.id === id);
  if (!t) return;
  _editingTourId = id;
  _labelTouched = true; // En édition, le label existant est conservé tel quel
  document.getElementById('tour-modal-title').textContent = 'Modifier le tour';
  document.getElementById('tf-id').value        = t.id;
  document.getElementById('tf-date').value      = t.date;
  document.getElementById('tf-label').value     = t.label;
  document.getElementById('tf-ship').value      = t.ship     || '';
  document.getElementById('tf-activity').value  = t.activity || '';
  document.getElementById('tf-bus').value       = t.bus      || '';
  document.getElementById('tf-adults').value    = t.adults   || '';
  document.getElementById('tf-children').value  = t.children || '0';
  document.getElementById('tf-escort').value    = t.escort   || '';
  const tips = t.tips || {};
  document.getElementById('tf-can').value = tips.can || '';
  document.getElementById('tf-us').value  = tips.us  || '';
  document.getElementById('tf-eur').value = tips.eur || '';
  document.getElementById('tf-aud').value = tips.aud || '';
  document.getElementById('tf-delete-btn').style.display = '';
  refreshDataLists();
  renderWorkLinesForm(t.workLines || []);
  openModal('modal-tour');
}

// ── WORK LINES FORM ───────────────────────────────────────
let _workLines = [];

function renderWorkLinesForm(lines) {
  _workLines = lines.map(w => ({...w}));
  if (_workLines.length === 0) _workLines.push(newWorkLine());
  refreshWorkLinesUI();
}

function newWorkLine() {
  return { id: uid(), meetTime: '', arriveTime: '', consideredHrs: '', sent: '' };
}

function refreshWorkLinesUI() {
  const container = document.getElementById('wl-container');
  const rate = lastRate();
  container.innerHTML = _workLines.map((wl) => {
    const real = realHours(wl.meetTime, wl.arriveTime);
    const realStr = real !== null
      ? `<div class="wl-real">Temps réel : <span>${fmtHrs(real)}</span></div>`
      : '';
    let suggestStr = '';
    const hrs = parseFloat(wl.consideredHrs);
    if (rate && hrs > 0 && !parseFloat(wl.sent)) {
      const sugg = (hrs * rate).toFixed(2);
      suggestStr = `<div class="wl-suggest">Suggestion : <span>$${sugg}</span> · ${hrs}h × ${rate.toFixed(2)}$/h</div>`;
    }
    return `
      <div class="wl-item" id="wli-${wl.id}">
        ${_workLines.length > 1 ? `<button class="wl-del" onclick="removeWorkLine('${wl.id}')">✕</button>` : ''}
        <div class="wl-row">
          <div class="fg" style="margin-bottom:0">
            <label class="fl">Heure début</label>
            <input type="time" class="fi" value="${wl.meetTime||''}"
              oninput="updateWL('${wl.id}','meetTime',this.value)">
          </div>
          <div class="fg" style="margin-bottom:0">
            <label class="fl">Heure fin</label>
            <input type="time" class="fi" value="${wl.arriveTime||''}"
              oninput="updateWL('${wl.id}','arriveTime',this.value)">
          </div>
        </div>
        ${realStr}
        <div class="wl-row" style="margin-top:7px">
          <div class="fg" style="margin-bottom:0">
            <label class="fl">Heures considérées</label>
            <input type="number" class="fi" placeholder="0.0" step="0.25" inputmode="decimal"
              value="${wl.consideredHrs||''}"
              oninput="updateWL('${wl.id}','consideredHrs',this.value)">
          </div>
          <div class="fg" style="margin-bottom:0">
            <label class="fl">$ Envoyé</label>
            <input type="number" class="fi" placeholder="0.00" step="0.01" inputmode="decimal"
              value="${wl.sent||''}"
              oninput="updateWL('${wl.id}','sent',this.value)">
          </div>
        </div>
        ${suggestStr}
      </div>`;
  }).join('');
}

function updateWL(id, field, val) {
  const wl = _workLines.find(w => w.id === id);
  if (!wl) return;
  wl[field] = val;
  const real = realHours(wl.meetTime, wl.arriveTime);
  const rate = lastRate();
  const item = document.getElementById(`wli-${id}`);
  if (!item) return;

  let realEl = item.querySelector('.wl-real');
  if (real !== null) {
    if (!realEl) {
      realEl = document.createElement('div');
      realEl.className = 'wl-real';
      item.querySelector('.wl-row').after(realEl);
    }
    realEl.innerHTML = `Temps réel : <span>${fmtHrs(real)}</span>`;
  } else if (realEl) { realEl.remove(); }

  let suggEl = item.querySelector('.wl-suggest');
  const hrs = parseFloat(wl.consideredHrs);
  if (rate && hrs > 0 && !parseFloat(wl.sent)) {
    const sugg = (hrs * rate).toFixed(2);
    if (!suggEl) { suggEl = document.createElement('div'); suggEl.className = 'wl-suggest'; item.appendChild(suggEl); }
    suggEl.innerHTML = `Suggestion : <span>$${sugg}</span> · ${hrs}h × ${rate.toFixed(2)}$/h`;
  } else if (suggEl) { suggEl.remove(); }
}

function addWorkLine() {
  _workLines.push(newWorkLine());
  refreshWorkLinesUI();
}

function removeWorkLine(id) {
  _workLines = _workLines.filter(w => w.id !== id);
  refreshWorkLinesUI();
}

// ── CONFIRMATION CUSTOM (iOS-safe, pas de window.confirm) ─
let _confirmCallback = null;

function showConfirm(message, onYes) {
  document.getElementById('confirm-msg').textContent = message;
  _confirmCallback = onYes;
  openModal('modal-confirm');
}

function confirmYes() {
  closeModal('modal-confirm');
  if (_confirmCallback) { _confirmCallback(); _confirmCallback = null; }
}

function confirmNo() {
  closeModal('modal-confirm');
  _confirmCallback = null;
}

// ── SAVE TOUR ─────────────────────────────────────────────
function saveTour() {
  const season = currentSeason();
  if (!season) return;

  const label = document.getElementById('tf-label').value.trim();
  if (!label) { showToast('Entrez un nom de tour'); return; }

  // Capturer toutes les valeurs AVANT de fermer le modal
  const tourData = {
    id:       _editingTourId || uid(),
    date:     document.getElementById('tf-date').value,
    label,
    ship:     document.getElementById('tf-ship').value.trim(),
    activity: document.getElementById('tf-activity').value.trim(),
    bus:      document.getElementById('tf-bus').value.trim(),
    adults:   parseInt(document.getElementById('tf-adults').value)   || 0,
    children: parseInt(document.getElementById('tf-children').value) || 0,
    escort:   parseInt(document.getElementById('tf-escort').value)   || 0,
    photo:    null,
    tips: {
      can: parseFloat(document.getElementById('tf-can').value) || 0,
      us:  parseFloat(document.getElementById('tf-us').value)  || 0,
      eur: parseFloat(document.getElementById('tf-eur').value) || 0,
      aud: parseFloat(document.getElementById('tf-aud').value) || 0,
    },
    workLines: _workLines.map(wl => ({
      id:            wl.id || uid(),
      meetTime:      wl.meetTime    || '',
      arriveTime:    wl.arriveTime  || '',
      consideredHrs: parseFloat(wl.consideredHrs) || 0,
      sent:          parseFloat(wl.sent)           || 0,
    }))
  };

  const editingId = _editingTourId; // capturer avant reset

  if (editingId) {
    const existing = season.tours.find(t => t.id === editingId);
    if (existing) tourData.photo = existing.photo;
    const idx = season.tours.findIndex(t => t.id === editingId);
    if (idx >= 0) season.tours[idx] = tourData;
    else season.tours.push(tourData);
  } else {
    season.tours.push(tourData);
  }

  persist();
  closeModal('modal-tour');
  renderActive();
  showToast('Tour sauvegardé ✓');
}

function deleteTour() {
  if (!_editingTourId) return;
  showConfirm('Supprimer ce tour ? Cette action est irréversible.', _doDeleteTour);
}

function _doDeleteTour() {
  const season = currentSeason();
  season.tours = season.tours.filter(t => t.id !== _editingTourId);
  persist();
  closeModal('modal-tour');
  renderActive();
  showToast('Tour supprimé');
}

// ── TIPS PANEL ────────────────────────────────────────────
function renderTips() {
  const panel  = document.getElementById('panel-tips');
  const season = currentSeason();
  const tours  = season ? [...season.tours].sort((a,b)=>a.date.localeCompare(b.date)) : [];

  let totCAN=0, totUS=0, totEUR=0, totAUD=0;
  tours.forEach(t => {
    const tp = t.tips||{};
    totCAN += tp.can||0; totUS += tp.us||0; totEUR += tp.eur||0; totAUD += tp.aud||0;
  });

  const rows = tours.map(t => {
    const tp = t.tips||{};
    return `<div class="tbl-row g-tips" onclick="openEditTour('${t.id}')">
      <span>${fmtDate(t.date)}</span>
      <span class="${tp.can?'pos':'zero'}">${tp.can?'$'+tp.can:'—'}</span>
      <span class="${tp.us ?'pos':'zero'}">${tp.us ?'$'+tp.us :'—'}</span>
      <span class="${tp.eur?'pos':'zero'}">${tp.eur?'€'+tp.eur:'—'}</span>
      <span class="${tp.aud?'pos':'zero'}">${tp.aud?'$'+tp.aud:'—'}</span>
    </div>`;
  }).join('');

  panel.innerHTML = `
    <div class="sec-title">Pourboires</div>
    <div class="sec-sub">Saison ${season?.name||''} · ${tours.length} tours</div>
    <div class="read-only-note">👁 Lecture seule — modifiez via l'onglet Tours</div>
    <div class="sum-grid">
      <div class="sum-card"><div class="sum-lbl">Total CAD</div><div class="sum-val">$${totCAN}</div><div class="sum-note">canadiens</div></div>
      <div class="sum-card"><div class="sum-lbl">Total USD</div><div class="sum-val">$${totUS}</div><div class="sum-note">américains</div></div>
      <div class="sum-card gold"><div class="sum-lbl">Total EUR</div><div class="sum-val">€${totEUR}</div><div class="sum-note">euros</div></div>
      <div class="sum-card gold"><div class="sum-lbl">Total AUD</div><div class="sum-val">$${totAUD}</div><div class="sum-note">australiens</div></div>
    </div>
    <div class="tbl-wrap">
      <div class="tbl-head g-tips"><span>Date</span><span>CAD</span><span>USD</span><span>EUR</span><span>AUD</span></div>
      ${rows}
      <div class="tbl-foot g-tips">
        <span>TOTAL</span>
        <span>$${totCAN}</span><span>$${totUS}</span>
        <span>${totEUR?'€'+totEUR:'—'}</span>
        <span>${totAUD?'$'+totAUD:'—'}</span>
      </div>
    </div>`;
}

// ── WORK PANEL ────────────────────────────────────────────
function renderWork() {
  const panel  = document.getElementById('panel-work');
  const season = currentSeason();
  const tours  = season ? [...season.tours].sort((a,b)=>a.date.localeCompare(b.date)) : [];

  let totConsidered=0, totReal=0, totSent=0;
  const rows = [];

  tours.forEach(t => {
    (t.workLines||[]).forEach(wl => {
      const real = realHours(wl.meetTime, wl.arriveTime);
      totConsidered += wl.consideredHrs||0;
      if (real) totReal += real;
      totSent += wl.sent||0;
      rows.push(`<div class="tbl-row g-work" onclick="openEditTour('${t.id}')">
        <span>${fmtDate(t.date)}</span>
        <span>${wl.meetTime||'—'}</span>
        <span>${wl.arriveTime||'—'}</span>
        <span style="color:var(--text3);font-size:11px">${real!==null?fmtHrs(real):''}</span>
        <span class="hi">${fmtHrs(wl.consideredHrs)}</span>
        <span class="gr">$${(wl.sent||0).toFixed(2)}</span>
      </div>`);
    });
  });

  panel.innerHTML = `
    <div class="sec-title">Travail autonome</div>
    <div class="sec-sub">Saison ${season?.name||''} · ${rows.length} entrées</div>
    <div class="read-only-note">👁 Lecture seule — modifiez via l'onglet Tours</div>
    <div class="total-bar">
      <div><div class="tb-lbl">Heures considérées</div><div class="tb-val">${fmtHrs(totConsidered)}</div></div>
      <div><div class="tb-lbl">Heures réelles</div><div class="tb-val">${fmtHrs(totReal)}</div></div>
      <div><div class="tb-lbl">Total envoyé</div><div class="tb-val">$${totSent.toFixed(2)}</div></div>
      <div><div class="tb-lbl">Taux moyen</div><div class="tb-val">${totConsidered>0?'$'+(totSent/totConsidered).toFixed(2)+'/h':'—'}</div></div>
    </div>
    <div class="tbl-wrap">
      <div class="tbl-head g-work"><span>Date</span><span>Début</span><span>Fin</span><span>Réel</span><span>Consid.</span><span>$ Envoyé</span></div>
      ${rows.join('')}
      <div class="tbl-foot g-work">
        <span>TOTAL</span><span></span><span></span>
        <span>${fmtHrs(totReal)}</span>
        <span>${fmtHrs(totConsidered)}</span>
        <span>$${totSent.toFixed(2)}</span>
      </div>
    </div>`;
}

// ── SEASONS ───────────────────────────────────────────────
function openSeasonModal() {
  renderSeasonList();
  openModal('modal-season');
}

function renderSeasonList() {
  const list = document.getElementById('season-list');
  list.innerHTML = S.seasons.map(s => `
    <li class="season-item">
      <div class="season-check ${s.id===S.activeSeason?'active':''}" onclick="selectSeason('${s.id}')">
        ${s.id===S.activeSeason?'✓':''}
      </div>
      <span class="season-name" onclick="selectSeason('${s.id}')" style="flex:1;cursor:pointer">Saison ${s.name}</span>
      <span class="season-count">${s.tours.length} tours</span>
      ${S.seasons.length > 1
        ? `<button class="season-del-btn" onclick="deleteSeason('${s.id}')" title="Supprimer cette saison">🗑</button>`
        : `<span style="width:32px"></span>`}
    </li>`).join('');
}

function selectSeason(id) {
  S.activeSeason = id;
  persist();
  renderSeasonBadge();
  renderSeasonList();
  // Petit délai pour laisser l'UI se mettre à jour avant de fermer
  setTimeout(() => {
    closeModal('modal-season');
    renderActive();
  }, 80);
}

function deleteSeason(id) {
  const s = S.seasons.find(s => s.id === id);
  if (!s) return;
  showConfirm(
    `Supprimer la saison ${s.name} (${s.tours.length} tours) ?\n\nCette action est irréversible. Exportez d'abord si nécessaire.`,
    () => {
      S.seasons = S.seasons.filter(sx => sx.id !== id);
      if (S.activeSeason === id) S.activeSeason = S.seasons[0]?.id || null;
      persist();
      renderSeasonBadge();
      renderSeasonList();
      renderActive();
      showToast(`Saison ${s.name} supprimée`);
    }
  );
}

function addNewSeason() {
  const inp = document.getElementById('new-season-input');
  const name = inp.value.trim();
  if (!name) { showToast('Entrez un nom de saison'); return; }
  if (S.seasons.find(s => s.name === name)) { showToast('Cette saison existe déjà'); return; }
  const ns = { id: 'season_' + uid(), name, tours: [] };
  S.seasons.push(ns);
  S.activeSeason = ns.id;
  inp.value = '';
  persist();
  closeModal('modal-season');
  renderSeasonBadge();
  renderActive();
  showToast(`Saison ${name} créée ✓`);
}

// ── EXPORT / IMPORT ───────────────────────────────────────
function exportData() {
  const payload = {
    version: 2,
    exportDate: new Date().toISOString(),
    appName: 'Tours Lise B.',
    seasons: S.seasons,
    activeSeason: S.activeSeason,
  };
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  const date = new Date().toISOString().slice(0,10);
  a.href     = url;
  a.download = `tours-lise-backup-${date}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Sauvegarde téléchargée ✓');
}

function triggerImport() {
  document.getElementById('importInput').click();
}

function importData(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const payload = JSON.parse(ev.target.result);
      if (!payload.seasons || !Array.isArray(payload.seasons)) {
        showToast('❌ Fichier invalide'); return;
      }
      const dateStr = payload.exportDate
        ? new Date(payload.exportDate).toLocaleDateString('fr-CA')
        : 'inconnue';
      showConfirm(
        `Importer ${payload.seasons.length} saison(s) ?\nSauvegarde du : ${dateStr}\n\nVos données actuelles seront remplacées.`,
        () => {
          S.seasons      = payload.seasons;
          S.activeSeason = payload.activeSeason || payload.seasons[0]?.id;
          persist();
          renderSeasonBadge();
          closeModal('modal-season');
          renderActive();
          showToast(`Import réussi — ${payload.seasons.length} saison(s) ✓`);
        }
      );
    } catch(e) {
      showToast('❌ Erreur de lecture du fichier');
    }
  };
  reader.readAsText(file);
  document.getElementById('importInput').value = '';
}

// ── PHOTO ─────────────────────────────────────────────────
let _photoTargetId = null;

function triggerPhoto(tourId) {
  _photoTargetId = tourId;
  document.getElementById('photoInput').click();
}

function openPhotoViewer(tourId) {
  const season = currentSeason();
  const tour = season.tours.find(t => t.id === tourId);
  if (!tour || !tour.photo) return;
  document.getElementById('photo-full-img').src = tour.photo;
  document.getElementById('photo-viewer-title').textContent = tour.label;
  document.getElementById('btn-replace-photo').onclick = () => { closeModal('modal-photo'); triggerPhoto(tourId); };
  document.getElementById('btn-delete-photo').onclick = () => {
    tour.photo = null; persist(); renderTours(); closeModal('modal-photo'); showToast('Photo supprimée');
  };
  openModal('modal-photo');
}

// ── MODALS ────────────────────────────────────────────────
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// ── BOOT ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  hydrate();
  renderSeasonBadge();

  // ── Listeners pour nom automatique ──
  const autoFields = ['tf-date','tf-activity','tf-ship'];
  autoFields.forEach(fid => {
    document.getElementById(fid).addEventListener('input', updateAutoLabel);
    document.getElementById(fid).addEventListener('change', updateAutoLabel);
  });

  // Détecter modification manuelle du label
  document.getElementById('tf-label').addEventListener('input', () => {
    _labelTouched = true;
  });

  // Bouton "régénérer le nom" (petite icône ↻ à côté du label)
  const regenBtn = document.getElementById('btn-regen-label');
  if (regenBtn) {
    regenBtn.addEventListener('click', () => {
      _labelTouched = false;
      updateAutoLabel();
      showToast('Nom régénéré');
    });
  }

  // Import input
  document.getElementById('importInput').addEventListener('change', function(e) {
    importData(e.target.files[0]);
  });

  // Photo input
  document.getElementById('photoInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file || !_photoTargetId) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const season = currentSeason();
      const tour = season.tours.find(t => t.id === _photoTargetId);
      if (tour) { tour.photo = ev.target.result; persist(); renderTours(); showToast('Photo ajoutée ✓'); }
    };
    reader.readAsDataURL(file);
    this.value = '';
  });

  // Overlay close
  document.querySelectorAll('.modal-overlay').forEach(o => {
    o.addEventListener('click', e => { if (e.target === o) o.classList.remove('open'); });
  });

  // Tabs
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.addEventListener('click', () => switchTab(b.dataset.tab));
  });

  switchTab('tours');

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
});
