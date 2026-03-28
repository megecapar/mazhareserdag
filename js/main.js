'use strict';
document.addEventListener('DOMContentLoaded', () => {
  initSlider();
  initNav();
  initAccordion();
  initScrollTop();
  initFadeIn();
  setActiveNav();
  initSearch();
});

/* ── SLIDER ── */
function initSlider() {
  const slides = Array.from(document.querySelectorAll('.owl-slide'));
  const dots   = Array.from(document.querySelectorAll('.slider-dot'));
  if (!slides.length) return;
  let cur = 0, timer;
  const show = n => {
    slides[cur].classList.remove('active');
    dots[cur]?.classList.remove('active');
    cur = ((n % slides.length) + slides.length) % slides.length;
    slides[cur].classList.add('active');
    dots[cur]?.classList.add('active');
    reset();
  };
  const reset = () => { clearInterval(timer); timer = setInterval(() => show(cur + 1), 6000); };
  dots.forEach((d, i) => d.addEventListener('click', () => show(i)));
  document.getElementById('sliderPrev')?.addEventListener('click', () => show(cur - 1));
  document.getElementById('sliderNext')?.addEventListener('click', () => show(cur + 1));
  let tx = 0;
  const el = document.querySelector('.slider-area');
  el?.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  el?.addEventListener('touchend',   e => { const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 40) show(dx < 0 ? cur + 1 : cur - 1); }, { passive: true });
  reset();
}

/* ── NAV MOBILE ── */
function initNav() {
  const btn   = document.getElementById('navHamburger');
  const menus = document.querySelector('.navigation .menus');
  if (btn && menus) btn.addEventListener('click', () => menus.classList.toggle('open'));
  document.querySelectorAll('.navigation .menus a').forEach(a => {
    a.addEventListener('click', () => menus?.classList.remove('open'));
  });
}

/* ── ACCORDION ── */
function initAccordion() {
  document.querySelectorAll('.accordion-header').forEach(h => {
    h.addEventListener('click', () => {
      const item   = h.closest('.accordion-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
  document.querySelector('.accordion-item')?.classList.add('open');
}

/* ── SCROLL TOP ── */
function initScrollTop() {
  const btn = document.getElementById('scrollTopBtn');
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
  }, { threshold: 0.08 });
  els.forEach(el => obs.observe(el));
}

/* ── ACTIVE NAV ── */
function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navigation .menus a').forEach(a => {
    if (a.getAttribute('href') === page) a.closest('li')?.classList.add('active');
  });
}

/* ── SEARCH ── */
function initSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && input.value.trim()) {
      window.location.href = 'iletisim.html?q=' + encodeURIComponent(input.value.trim());
    }
  });
}

/* ── FORM SUBMIT ── */
window.handleFormSubmit = function(e) {
  e.preventDefault();
  const btn  = e.target.querySelector('.btn-submit, .cform-submit');
  if (!btn) return;
  const orig = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-check"></i> Gönderildi!';
  btn.style.background = '#27bc80';
  setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; e.target.reset(); }, 3000);
};
