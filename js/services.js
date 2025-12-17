// === CONFIG ===
const CONFIG = {
  paw: {
    steps: { min: 3, max: 4 },
    stepDist: { min: 40, max: 70 },
    interval: { min: 3000, max: 8000 },
    duration: 1800,
    size: 100,
  },
  scrollOffset: 300,
  themes: { light: 'light', dark: 'dark' },
  logos: { light: 'img/light.png', dark: 'img/dark.png' },
};

// === UTILS ===
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => ctx.querySelectorAll(sel);
const rand = (min, max) => Math.random() * (max - min) + min;

// === THEME & LOGO ===
const html = document.documentElement;
const themeToggle = $('#themeToggle');
const logoImg = $('#logoImg');
const logoFallback = $('#logoFallback');

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  const path = CONFIG.logos[theme];
  if (!logoImg) return;
  logoImg.src = path;
  logoImg.onerror = () => {
    logoImg.style.display = 'none';
    if (logoFallback) logoFallback.style.display = 'flex';
  };
  logoImg.onload = () => {
    logoImg.style.display = 'block';
    if (logoFallback) logoFallback.style.display = 'none';
  };
}

if (themeToggle) {
  applyTheme(localStorage.getItem('theme') || CONFIG.themes.light);
  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === CONFIG.themes.light ? CONFIG.themes.dark : CONFIG.themes.light;
    applyTheme(next);
  });
}

// === MOBILE MENU ===
const menuToggle = $('#menuToggle');
const mobileMenu = $('#mobileMenu');
const menuOverlay = $('#menuOverlay');
const closeMenuBtn = $('#closeMenuBtn');

function toggleMenu(forceClose = false) {
  const active = forceClose ? false : mobileMenu.classList.toggle('active');
  [mobileMenu, menuToggle, menuOverlay].forEach(el => el?.classList.toggle('active', active));
  if (menuToggle) menuToggle.setAttribute('aria-expanded', active);
  if (menuOverlay) menuOverlay.setAttribute('aria-hidden', !active);
  document.body.style.overflow = active ? 'hidden' : '';
}

if (menuToggle) menuToggle.addEventListener('click', () => toggleMenu());
if (closeMenuBtn) closeMenuBtn.addEventListener('click', () => toggleMenu(true));
if (menuOverlay) menuOverlay.addEventListener('click', () => toggleMenu(true));

$$('.menu-links a').forEach(link =>
  link.addEventListener('click', () => toggleMenu(true))
);

// === FAQ ===
document.addEventListener('click', e => {
  const question = e.target.closest('.faq-question');
  if (!question) return;
  const item = question.parentElement;
  const wasOpen = item.classList.contains('active');
  $$('.faq-item').forEach(i => i.classList.remove('active'));
  if (!wasOpen) item.classList.add('active');
});

// === SCROLL TO TOP ===
const scrollTopBtn = $('#scrollTop');
if (scrollTopBtn) {
  window.addEventListener('scroll', () =>
    scrollTopBtn.classList.toggle('visible', window.pageYOffset > CONFIG.scrollOffset)
  );
  scrollTopBtn.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );
}

// === PAW PRINTS ===
const PAW_SVG = `
<svg viewBox="0 0 100 100">
  <ellipse cx="50" cy="70" rx="20" ry="15"/>
  <ellipse cx="28" cy="45" rx="10" ry="13" transform="rotate(-15 28 45)"/>
  <ellipse cx="40" cy="35" rx="10" ry="13" transform="rotate(-5 40 35)"/>
  <ellipse cx="60" cy="35" rx="10" ry="13" transform="rotate(5 60 35)"/>
  <ellipse cx="72" cy="45" rx="10" ry="13" transform="rotate(15 72 45)"/>
</svg>`;

function createPawPrint() {
  const steps = Math.round(rand(CONFIG.paw.steps.min, CONFIG.paw.steps.max));
  const angle = rand(0, 360) * Math.PI / 180;
  const stepDist = rand(CONFIG.paw.stepDist.min, CONFIG.paw.stepDist.max);
  const duration = CONFIG.paw.duration;

  let x = rand(5, 95);
  let y = rand(5, 95);
  let side = Math.random() < 0.5 ? 'left' : 'right';

  for (let i = 0; i < steps; i++) {
    setTimeout(() => {
      const paw = document.createElement('div');
      paw.className = `paw-print ${side}`;
      paw.innerHTML = PAW_SVG;
      paw.style.left = `${x}%`;
      paw.style.top = `${y}%`;
      paw.style.animation = `pawFade ${duration}ms ease-out forwards`;
      paw.addEventListener('animationend', () => paw.remove());
      document.body.appendChild(paw);

      x += (Math.cos(angle) * stepDist) / window.innerWidth * 100;
      y += (Math.sin(angle) * stepDist) / window.innerHeight * 100;
      side = side === 'left' ? 'right' : 'left';
    }, i * (duration * 0.4));
  }
}

setTimeout(createPawPrint, 800);
setInterval(createPawPrint, rand(CONFIG.paw.interval.min, CONFIG.paw.interval.max));
