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
  initRandevuForm();
  initSearch();
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

/* ── RANDEVU FORMU (Vercel API) ── */
function initRandevuForm() {
  const btn = document.getElementById('randevuGonder');
  if (!btn) return;

  const getVal = (id) => document.getElementById(id)?.value?.trim() || '';
  const getRaw = (id) => document.getElementById(id)?.value || '';

  btn.addEventListener('click', async () => {
    const payload = {
      ad:      getVal('ad'),
      soyad:   getVal('soyad'),
      telefon: getVal('telefon'),
      email:   getVal('eposta'),
      tedavi:  getRaw('tedavi'),
      tarih:   getRaw('tarih'),
      mesaj:   getVal('mesaj'),
    };

    if (!payload.ad || !payload.soyad || !payload.telefon || !payload.email || !payload.tedavi) {
      alert('Lütfen Ad, Soyad, Telefon, E-posta ve Tedavi Konusu alanlarını doldurun.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      alert('Lütfen geçerli bir e-posta adresi girin.');
      return;
    }

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

/* ── ARAMA ── */
function initSearch() {
  const PAGES = [
    { title: 'Ana Sayfa',              url: 'index.html',       cat: 'Sayfa',   desc: 'Op.Dr. Mazhar Eserdağ resmi web sitesi.' },
    { title: 'Hakkımda',               url: 'hakkimda.html',    cat: 'Sayfa',   desc: 'Doktor özgeçmişi, eğitim, sertifikalar ve mesleki deneyim.' },
    { title: 'Tedaviler',              url: 'tedaviler.html',   cat: 'Sayfa',   desc: 'Akupunktur, vajinismus, biorezonans, hipnoz, kupa, kalp damar.' },
    { title: 'Blog',                   url: 'blog.html',        cat: 'Sayfa',   desc: 'Sağlık ve tamamlayıcı tıp üzerine yazılar.' },
    { title: 'İletişim & Randevu',     url: 'iletisim.html',    cat: 'Sayfa',   desc: 'Randevu almak ve iletişim bilgileri.' },
    { title: 'Akupunktur',             url: 'tedaviler.html',   cat: 'Tedavi',  desc: 'Ağrı, stres ve enerji dengesi için akupunktur tedavisi.' },
    { title: 'Vajinismus Tedavisi',    url: 'tedaviler.html',   cat: 'Tedavi',  desc: 'Cinsel işlev bozuklukları ve vajinismus tedavisi. FECSM sertifikalı.' },
    { title: 'Biorezonans',            url: 'tedaviler.html',   cat: 'Tedavi',  desc: 'Bicom Optima ile detoks, alerji, sigara bırakma, kilo yönetimi.' },
    { title: 'Hipnoz Terapisi',        url: 'tedaviler.html',   cat: 'Tedavi',  desc: 'Fobi, kaygı, panik atak, sigara bırakma için hipnoterapi.' },
    { title: 'Kupa Uygulamaları',      url: 'tedaviler.html',   cat: 'Tedavi',  desc: 'Kas gevşetme ve dolaşım desteği için kupa tedavisi.' },
    { title: 'Kalp & Damar Cerrahisi', url: 'tedaviler.html',   cat: 'Tedavi',  desc: 'Koroner arter, hipertansiyon, varis, skleroterapi.' },
    { title: "Akupunktur'un Kalp Sağlığına Etkileri", url: 'blog-yazilari/blog-akupunktur-kalp.html', cat: 'Blog', desc: 'Akupunkturun kardiyovasküler sistem üzerindeki etkileri.' },
    { title: 'Hipnoz ile Stres Yönetimi',             url: 'blog-yazilari/blog-hipnoz-stres.html',    cat: 'Blog', desc: 'Hipnoterapi seanslarının stres ve kaygı üzerindeki etkileri.' },
    { title: 'Biorezonans Nedir, Ne İşe Yarar?',      url: 'blog-yazilari/blog-biorezonans.html',     cat: 'Blog', desc: 'Biorezonans terapisinin çalışma prensipleri.' },
  ];

  const overlay   = document.getElementById('searchOverlay');
  const searchBtn = document.getElementById('searchBtn');
  const closeBtn  = document.getElementById('searchClose');
  const input     = document.getElementById('searchInput');
  const results   = document.getElementById('searchResults');

  if (!overlay || !searchBtn || !input) return;

  const openSearch = () => {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => input.focus(), 100);
  };
  const closeSearch = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    input.value = '';
    results.innerHTML = '';
  };

  searchBtn.addEventListener('click', openSearch);
  closeBtn.addEventListener('click', closeSearch);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeSearch(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearch(); });

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) { results.innerHTML = ''; return; }

    const found = PAGES.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      p.cat.toLowerCase().includes(q)
    ).slice(0, 6);

    if (!found.length) {
      results.innerHTML = '<div class="search-no-result">Sonuç bulunamadı.</div>';
      return;
    }
    results.innerHTML = found.map(r => `
      <a class="search-result-item" href="${r.url}">
        <div class="search-result-cat">${r.cat}</div>
        <div class="search-result-title">${r.title}</div>
        <div class="search-result-desc">${r.desc}</div>
      </a>
    `).join('');
  });
}