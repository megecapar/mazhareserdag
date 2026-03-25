/* ═══════════════════════════════════════
   MAZHAR ESERDAĞ — main.js
═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initSlider();
  initNav();
  initAccordion();
  initScrollTop();
  initFadeIn();
  initSearch();
  setActiveNav();
});

/* ── SLIDER ── */
function initSlider() {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.slider-dot');
  if (!slides.length) return;
  let current = 0, timer;

  function goTo(n) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
    resetTimer();
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 6000);
  }

  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
  document.getElementById('sliderPrev')?.addEventListener('click', () => goTo(current - 1));
  document.getElementById('sliderNext')?.addEventListener('click', () => goTo(current + 1));

  // Touch/swipe
  let tx = 0;
  document.querySelector('.slider-area')?.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  document.querySelector('.slider-area')?.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 40) dx < 0 ? goTo(current + 1) : goTo(current - 1);
  }, { passive: true });

  resetTimer();
}

/* ── NAVIGATION ── */
function initNav() {
  const toggle = document.getElementById('navToggle');
  const menus = document.querySelector('.nav-menus');
  if (toggle && menus) {
    toggle.addEventListener('click', () => menus.classList.toggle('open'));
  }
}

/* ── ACCORDION ── */
function initAccordion() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
  // Open first by default
  document.querySelector('.accordion-item')?.classList.add('open');
}

/* ── SCROLL TOP ── */
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 400));
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── FADE IN ── */
function initFadeIn() {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

/* ── SEARCH ── */
function initSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && input.value.trim()) {
      // Basic search redirect placeholder
      alert('Arama: ' + input.value);
    }
  });
}

/* ── ACTIVE NAV ── */
function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menus a').forEach(a => {
    if (a.getAttribute('href') === page) a.closest('li')?.classList.add('active');
  });
}

/* ── FORM SUBMIT ── */
window.submitForm = function(e) {
  e.preventDefault();
  const btn = document.getElementById('formSubmit');
  const orig = btn.textContent;
  btn.textContent = '✓ Gönderildi!';
  btn.style.background = '#27bc80';
  setTimeout(() => {
    btn.textContent = orig;
    btn.style.background = '';
    e.target.reset();
  }, 3000);
};
