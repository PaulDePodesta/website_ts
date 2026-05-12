// ── Random quote on load ─────────────────────────────────────────
const QUOTES = [
  { text: '„Adapt or die."', author: '— Billy Beane' },
  { text: '„Plans are useless, but planning is indispensable."', author: '— Dwight D. Eisenhower' },
  { text: '„It\'s not who I am underneath, but what I do that defines me."', author: '— Bruce Wayne' },
];

// ── Impressum Modal ──────────────────────────────────────────────
function initImpressum() {
  const btn     = document.getElementById('impressum-btn');
  const overlay = document.getElementById('impressum-overlay');
  const close   = document.getElementById('impressum-close');
  if (!btn || !overlay || !close) return;

  const open  = () => { overlay.hidden = false; close.focus(); };
  const shut  = () => { overlay.hidden = true;  btn.focus(); };

  btn.addEventListener('click', open);
  close.addEventListener('click', shut);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) shut(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !overlay.hidden) shut(); });
}

function init() {
  const quoteEl = document.getElementById('hero-quote');
  if (quoteEl) {
    const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    quoteEl.innerHTML = `${q.text}<cite>${q.author}</cite>`;
    requestAnimationFrame(() => quoteEl.classList.add('visible'));
  }
  initSyslog();
  initImpressum();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ── Toast ────────────────────────────────────────────────────────
function showToast(html, opts = {}) {
  const toast = document.getElementById('konami-toast');
  if (!toast) return;
  clearTimeout(toast._t);
  toast.innerHTML = html;
  toast.style.borderColor = opts.borderColor || '';
  toast.classList.add('visible');
  toast._t = setTimeout(() => {
    toast.classList.remove('visible');
    toast.style.borderColor = '';
  }, opts.duration || 3000);
}

// ── Keyboard sequence detector ───────────────────────────────────
const KONAMI_SEQ  = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
const HSV_SEQ     = ['h','s','v'];
const MONEY_SEQ   = ['m','o','n','e','y','b','a','l','l'];

let konamiIdx = 0;
let hsvIdx    = 0;
let moneyIdx  = 0;

document.addEventListener('keydown', (e) => {
  const key = e.key;
  const keyLower = key.toLowerCase();

  // Konami
  if (key === KONAMI_SEQ[konamiIdx]) {
    konamiIdx++;
    if (konamiIdx === KONAMI_SEQ.length) { konamiIdx = 0; triggerKonami(); }
  } else {
    konamiIdx = key === KONAMI_SEQ[0] ? 1 : 0;
  }

  // HSV
  if (keyLower === HSV_SEQ[hsvIdx]) {
    hsvIdx++;
    if (hsvIdx === HSV_SEQ.length) { hsvIdx = 0; triggerHSV(); }
  } else {
    hsvIdx = keyLower === HSV_SEQ[0] ? 1 : 0;
  }

  // Moneyball
  if (keyLower === MONEY_SEQ[moneyIdx]) {
    moneyIdx++;
    if (moneyIdx === MONEY_SEQ.length) { moneyIdx = 0; triggerMoneyball(); }
  } else {
    moneyIdx = keyLower === MONEY_SEQ[0] ? 1 : 0;
  }
});

// ── Konami ───────────────────────────────────────────────────────
function triggerKonami() {
  const wave = document.querySelector('.footer-wave');
  if (wave) {
    wave.style.opacity = '0.2';
    wave.style.transition = 'opacity 600ms ease';
    setTimeout(() => { wave.style.opacity = '0.06'; }, 2400);
  }
  showToast('System läuft. Hanseatisch stabil.', { duration: 3200 });
}

// ── HSV ──────────────────────────────────────────────────────────
function triggerHSV() {
  showToast(
    '<span style="color:#0057a8">■</span>' +
    '<span style="color:rgba(255,255,255,0.55)"> ■ </span>' +
    '<span style="color:#1a1a1a">■</span>' +
    '&ensp;53°N bestätigt: Nur der HSV.',
    { borderColor: 'rgba(0,87,168,0.35)', duration: 3500 }
  );
}

// ── Moneyball ────────────────────────────────────────────────────
function triggerMoneyball() {
  const msgs = [
    'Adapt or die.',
    'Bauchgefühl ist erlaubt. Aber bitte mit Daten daneben.',
  ];
  showToast(msgs[Math.floor(Math.random() * msgs.length)], { duration: 3200 });
}

// ── Tech tags ────────────────────────────────────────────────────
const TECH_TAGS = ['SQL', 'Power BI', 'Python', 'Automation', 'APIs', 'Datenmodelle', 'Excel'];

function triggerTechTags(anchor) {
  document.querySelectorAll('.tech-tags-cloud').forEach(el => el.remove());
  const rect = anchor.getBoundingClientRect();
  const cloud = document.createElement('div');
  cloud.className = 'tech-tags-cloud';
  cloud.style.top  = `${rect.top + window.scrollY - 8}px`;
  cloud.style.left = `${rect.left}px`;
  cloud.style.position = 'absolute';
  TECH_TAGS.forEach(tag => {
    const s = document.createElement('span');
    s.textContent = tag;
    cloud.appendChild(s);
  });
  document.body.appendChild(cloud);
  setTimeout(() => cloud.remove(), 2800);
}

// ── Click delegation ─────────────────────────────────────────────
let monogramClicks = [];

document.addEventListener('click', (e) => {
  // Monogram triple-click → grid overlay
  if (e.target.closest('.monogram')) {
    const now = Date.now();
    monogramClicks.push(now);
    monogramClicks = monogramClicks.filter(t => now - t < 2000);
    if (monogramClicks.length >= 3) { monogramClicks = []; document.body.classList.toggle('grid-mode'); }
    return;
  }

  // 53°N stat
  const stat = e.target.closest('.stat');
  if (stat && stat.querySelector('.stat-value')?.textContent.trim() === '53°N') {
    showToast('53.5511° N, 9.9937° E. Hanseatisch verortet.', { duration: 3000 });
    return;
  }

  // Identity cards
  const card = e.target.closest('.identity-card');
  if (card) {
    const title = card.querySelector('.identity-card-title')?.textContent.trim();
    if (title === 'Technik')        { triggerTechTags(card); return; }
    if (title === 'Geradlinigkeit') { showToast('Keine Schleifen.', { duration: 2500 }); return; }
    if (title === 'Sport Analytics'){ triggerMoneyball(); return; }
  }

  // Bauchgefühl
  if (e.target.closest('[data-easter="bauchgefuehl"]')) {
    showToast('Bauchgefühl ist ein Datenpunkt. Kein Modell.', { duration: 3000 });
    return;
  }
});

// ── Footer syslog ────────────────────────────────────────────────
const SYSLOG = [
  'status: klar',
  'mode: hanseatic',
  'noise: reduced',
  'complexity: structured',
  'gut feeling: challenged',
];

function initSyslog() {
  const el = document.getElementById('footer-syslog');
  if (!el) return;
  let i = 0;
  el.textContent = SYSLOG[i];
  setInterval(() => {
    el.style.opacity = '0';
    setTimeout(() => {
      i = (i + 1) % SYSLOG.length;
      el.textContent = SYSLOG[i];
      el.style.opacity = '';
    }, 400);
  }, 3500);
}
