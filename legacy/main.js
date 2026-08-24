'use strict';

/* ============================================================
   DUBLIN GROWTH DIGITAL — main.js v3.0
   Legora-inspired editorial animations
   ============================================================ */

/* --- 1. Page Loader --------------------------------------- */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  const word = loader.querySelector('.loader__word');

  requestAnimationFrame(() => {
    if (word) { word.classList.add('show'); }
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
      }, 500);
    });
    // Failsafe
    setTimeout(() => loader.classList.add('hidden'), 3000);
  });
})();

/* --- 2. Navigation --------------------------------------- */
(function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  // Scroll state
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active link
  const links = nav.querySelectorAll('.nav__links a');
  const page = location.pathname.split('/').pop() || 'index.html';
  links.forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === page || (page === '' && href === 'index.html') ||
        (href === 'index.html' && (page === '' || page === '/'))) {
      a.classList.add('active');
    }
  });

  // Mobile hamburger
  const hamburger = nav.querySelector('.nav__hamburger');
  const drawer = document.querySelector('.nav__drawer');
  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      drawer.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    // Close on link click
    drawer.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        drawer.classList.remove('open');
        document.body.style.overflow = '';
      })
    );
  }
})();

/* --- 3. Hero Animation ----------------------------------- */
(function initHero() {
  const lineInners = document.querySelectorAll('.hero__title .line-inner');
  const pill = document.querySelector('.hero__pill');
  const bottom = document.querySelector('.hero__bottom');
  const hint = document.querySelector('.hero__scroll-hint');
  if (!lineInners.length) return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.3 });

  tl.to(lineInners, {
    y: '0%',
    duration: 1.1,
    stagger: 0.1,
  });

  if (pill) {
    tl.to(pill, { opacity: 1, y: 0, duration: 0.6 }, '-=0.5');
  }

  if (bottom) {
    tl.to(bottom, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4');
  }

  if (hint) {
    tl.to(hint, { opacity: 1, duration: 0.5 }, '-=0.3');
  }
})();

/* --- 4. Scroll Reveal ------------------------------------ */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const check = () => {
    els.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.93) el.classList.add('in');
    });
  };

  window.addEventListener('scroll', check, { passive: true });
  window.addEventListener('load', () => { check(); setTimeout(check, 400); });
  check();
})();

/* --- 5. Count-Up Stats ----------------------------------- */
(function initCountUp() {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  const animate = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const decimals = Number.isInteger(target) ? 0 : 1;
    const duration = 1800;
    const start = performance.now();

    const tick = (now) => {
      const pct = Math.min((now - start) / duration, 1);
      const val = target * easeOut(pct);
      el.innerHTML = val.toFixed(decimals) + `<span class="suffix">${suffix}</span>`;
      if (pct < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { animate(e.target); obs.unobserve(e.target); }
    });
  }, { threshold: 0.3 });

  nums.forEach(n => obs.observe(n));
})();

/* --- 6. Services Sticky Scroll -------------------------- */
(function initStickyServices() {
  const panels = document.querySelectorAll('.svc-panel');
  const tabs = document.querySelectorAll('.svc-tab');
  const details = document.querySelectorAll('.svc-detail');
  if (!panels.length) return;

  const setActive = (idx) => {
    panels.forEach((p, i) => p.classList.toggle('active', i === idx));
    tabs.forEach((t, i) => t.classList.toggle('active', i === idx));
    details.forEach((d, i) => d.classList.toggle('active', i === idx));
  };

  setActive(0);

  // Tab clicks (desktop)
  tabs.forEach((tab, i) => tab.addEventListener('click', () => setActive(i)));

  // IntersectionObserver for scroll-driven update
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const idx = Array.from(panels).indexOf(e.target);
        if (idx !== -1) setActive(idx);
      }
    });
  }, { threshold: 0.4, rootMargin: '-10% 0px -40% 0px' });

  panels.forEach(p => obs.observe(p));
})();

/* --- 7. Testimonials Drag Scroll ------------------------ */
(function initTestimonials() {
  const track = document.querySelector('.testimonials__track');
  const prevBtn = document.querySelector('.t-btn--prev');
  const nextBtn = document.querySelector('.t-btn--next');
  if (!track) return;

  // Drag
  let isDragging = false, startX = 0, scrollLeft = 0;

  track.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
    track.classList.add('grabbing');
  });
  track.addEventListener('mouseleave', () => { isDragging = false; track.classList.remove('grabbing'); });
  track.addEventListener('mouseup', () => { isDragging = false; track.classList.remove('grabbing'); });
  track.addEventListener('mousemove', e => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    track.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });

  // Buttons
  const cardW = () => (track.querySelector('.tcard')?.offsetWidth || 320) + 16;
  if (prevBtn) prevBtn.addEventListener('click', () => track.scrollBy({ left: -cardW(), behavior: 'smooth' }));
  if (nextBtn) nextBtn.addEventListener('click', () => track.scrollBy({ left: cardW(), behavior: 'smooth' }));
})();

/* --- 8. Exit Intent Popup -------------------------------- */
(function initExitPopup() {
  const popup = document.getElementById('exit-popup');
  if (!popup) return;
  let shown = false;

  const show = () => {
    if (shown) return;
    shown = true;
    popup.classList.add('show');
  };

  const hide = () => popup.classList.remove('show');

  // Exit intent on desktop
  document.addEventListener('mouseleave', e => {
    if (e.clientY <= 0) show();
  });

  // Fallback: 60s timer
  setTimeout(show, 60000);

  // Close
  popup.querySelector('.exit-popup__close')?.addEventListener('click', hide);
  popup.querySelector('.exit-popup__bg')?.addEventListener('click', hide);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') hide(); });
})();

/* --- 9. Visitor Tracking --------------------------------- */
(function initTracking() {
  const ENDPOINT = 'https://formspree.io/f/meendppv';
  let sentInitial = false, sentEngaged = false;
  const page = (location.pathname.split('/').pop() || 'home').replace('.html', '') || 'home';

  function send(type, isEngaged) {
    if (isEngaged && sentEngaged) return;
    if (!isEngaged && sentInitial) return;
    if (isEngaged) sentEngaged = true; else sentInitial = true;

    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(geo => {
        const body = {
          _subject: '[DGD] ' + type,
          '📄 Page': page,
          '🔗 URL': location.href,
          '↩ Referrer': document.referrer || 'Direct',
          '📱 Device': /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
          '🌍 Location': (geo.city || '?') + ', ' + (geo.region || '') + ' ' + (geo.country_name || ''),
          '🏢 Network': geo.org || 'Unknown',
          '🕐 Time': new Date().toLocaleString('en-IE', { timeZone: 'Europe/Dublin' }),
        };
        fetch(ENDPOINT, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        });
      })
      .catch(() => {});
  }

  setTimeout(() => send('New visitor — ' + page, false), 3000);
  setTimeout(() => send('🔥 45s engaged — ' + page, true), 45000);
  if (page === 'contact') {
    setTimeout(() => send('👀 Contact page — no submit yet', true), 5000);
  }
})();
