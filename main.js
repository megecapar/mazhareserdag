/* ── NAVBAR MOBILE ── */
const hamburger  = document.getElementById('hamburger');
const mobileNav  = document.getElementById('mobileNav');
const navOverlay = document.getElementById('navOverlay');
if (hamburger) {
  const openNav  = () => { mobileNav.classList.add('open'); navOverlay.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeNav = () => { mobileNav.classList.remove('open'); navOverlay.classList.remove('open'); document.body.style.overflow = ''; };
  hamburger.addEventListener('click', () => mobileNav.classList.contains('open') ? closeNav() : openNav());
  navOverlay.addEventListener('click', closeNav);
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
}

/* ── SCROLL TOP ── */
const scrollTopBtn = document.getElementById('scrollTop');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => scrollTopBtn.classList.toggle('visible', window.scrollY > 400));
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── FADE IN ON SCROLL ── */
const fadeEls = document.querySelectorAll('.fade-in');
if (fadeEls.length) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  fadeEls.forEach(el => obs.observe(el));
}

/* ── ACTIVE NAV LINK ── */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});
