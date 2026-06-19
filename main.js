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
      }, 150);
    });
    // Failsafe
    setTimeout(() => loader.classList.add('hidden'), 1500);
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
  const sub = document.querySelector('.hero__sub');
  const actions = document.querySelector('.hero__actions');
  const proof = document.querySelector('.hero__proof');
  const hint = document.querySelector('.hero__scroll-hint');
  if (!lineInners.length) return;

  // Set initial states via GSAP (fallback: elements visible if GSAP fails)
  if (pill) gsap.set(pill, { opacity: 0, y: 10 });
  if (sub) gsap.set(sub, { opacity: 0, y: 14 });
  if (actions) gsap.set(actions, { opacity: 0, y: 14 });
  if (proof) gsap.set(proof, { opacity: 0, y: 14 });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.2 });

  if (pill) tl.to(pill, { opacity: 1, y: 0, duration: 0.6 });
  tl.to(lineInners, { y: '0%', duration: 1.1, stagger: 0.1 }, '-=0.3');
  if (sub) tl.to(sub, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4');
  if (actions) tl.to(actions, { opacity: 1, y: 0, duration: 0.6 }, '-=0.5');
  if (proof) tl.to(proof, { opacity: 1, y: 0, duration: 0.5 }, '-=0.4');
  if (hint) tl.to(hint, { opacity: 1, duration: 0.5 }, '-=0.3');
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

/* --- 6. Services Accordion ------------------------------ */
(function initServicesAccordion() {
  const items = document.querySelectorAll('.sacc-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.sacc-head');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      items.forEach(i => {
        i.classList.remove('open');
        const b = i.querySelector('.sacc-head');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
      // Toggle clicked
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        // Smooth scroll into view on mobile
        if (window.innerWidth < 768) {
          setTimeout(() => item.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
        }
      }
    });
  });
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

