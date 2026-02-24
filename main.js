/* ═══════════════════════════════════════════
   INCLUDE LOADER
═══════════════════════════════════════════ */
async function loadInclude(selector, file) {
  const el = document.querySelector(selector);
  if (!el) return;
  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const html = await res.text();
    el.innerHTML = html;
  } catch(e) {
    console.warn('Include yüklenemedi:', file, e.message);
  }
}

Promise.all([
  loadInclude('#topbar-placeholder', './includes/topbar.html'),
  loadInclude('#navbar-placeholder', './includes/navbar.html'),
  loadInclude('#footer-placeholder', './includes/footer.html'),
]).then(() => {
  initNavbar();
  initScrollTop();
  initFadeIn();
  setActiveNavLink();
  initRandevuForm(); // ✅ eklendi
});

/* ── NAVBAR MOBILE ── */
function initNavbar() {
  const hamburger  = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobileNav');
  const navOverlay = document.getElementById('navOverlay');
  if (!hamburger) return;

  const openNav  = () => {
    mobileNav.classList.add('open');
    navOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeNav = () => {
    mobileNav.classList.remove('open');
    navOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () =>
    mobileNav.classList.contains('open') ? closeNav() : openNav()
  );
  navOverlay.addEventListener('click', closeNav);
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
}

/* ── SCROLL TO TOP ── */
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;
  window.addEventListener('scroll', () =>
    btn.classList.toggle('visible', window.scrollY > 400)
  );
  btn.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );
}

/* ── FADE IN ON SCROLL ── */
function initFadeIn() {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

/* ── AKTİF MENÜ LİNKİ ── */
function setActiveNavLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ──────────────────────────────────────────
   ✅ RANDEVU FORMU SUBMIT (Vercel API)
   Endpoint: /api/randevu  (POST)
────────────────────────────────────────── */
function initRandevuForm() {
  const btn = document.getElementById('randevuGonder');
  if (!btn) return;

  const getVal = (id) => document.getElementById(id)?.value?.trim() || '';
  const getRaw = (id) => document.getElementById(id)?.value || '';

  btn.addEventListener('click', async () => {
    const payload = {
      ad: getVal('ad'),
      soyad: getVal('soyad'),
      telefon: getVal('telefon'),
      email: getVal('eposta'),
      tedavi: getRaw('tedavi'),
      tarih: getRaw('tarih'),
      mesaj: getVal('mesaj'),
    };

    // Zorunlu alan kontrolü
    if (!payload.ad || !payload.soyad || !payload.telefon || !payload.email || !payload.tedavi) {
      alert('Lütfen Ad, Soyad, Telefon, E-posta ve Tedavi Konusu alanlarını doldurun.');
      return;
    }

    // Basit e-posta kontrolü
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      alert('Lütfen geçerli bir e-posta adresi girin.');
      return;
    }

    // UI durumu
    btn.disabled = true;
    const oldHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';

    try {
      const r = await fetch('/api/randevu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!r.ok) {
        const t = await r.text();
        throw new Error(t || 'Gönderim hatası');
      }

      alert('Talebiniz alındı. En kısa sürede dönüş yapacağız.');

      // Form temizle
      ['ad', 'soyad', 'telefon', 'eposta', 'tarih', 'mesaj'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      const tedavi = document.getElementById('tedavi');
      if (tedavi) tedavi.value = '';

    } catch (e) {
      console.error('Randevu gönderim hatası:', e);
      alert('Gönderim sırasında bir hata oldu. Lütfen tekrar deneyin.');
    } finally {
      btn.disabled = false;
      btn.innerHTML = oldHTML;
    }
  });
}