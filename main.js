'use strict';
gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════════════════
   1. PAGE LOADER
══════════════════════════════════════════════════════════════ */
window.addEventListener('load', () => {
  const l = document.querySelector('.page-loader');
  if (l) setTimeout(() => l.classList.add('hidden'), 400);
});

/* ══════════════════════════════════════════════════════════════
   2. NAV — .scrolled at 80px
══════════════════════════════════════════════════════════════ */
(function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 80);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ══════════════════════════════════════════════════════════════
   3. MOBILE MENU
══════════════════════════════════════════════════════════════ */
(function initMobileMenu() {
  const burger = document.querySelector('.nav__burger');
  const drawer = document.querySelector('.nav__drawer');
  if (!burger || !drawer) return;

  function toggleMenu(open) {
    burger.classList.toggle('open', open);
    drawer.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  burger.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    toggleMenu(!isOpen);
  });

  drawer.querySelectorAll('.nav__drawer-link').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) toggleMenu(false);
  });
})();

/* ══════════════════════════════════════════════════════════════
   4. PAGE LOAD GSAP SEQUENCE (hero page only)
══════════════════════════════════════════════════════════════ */
(function initHeroAnimation() {
  if (!document.querySelector('.hero')) return;

  const tl = gsap.timeline({ delay: 0.5 });

  tl.to('.hero__badge', { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' })
    .to('.hero__headline .line-inner', { opacity: 1, y: 0, stagger: 0.15, duration: 0.75, ease: 'power3.out' }, '-=0.2')
    .to('.hero__sub', { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, '-=0.3')
    .to('.hero__actions', { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '-=0.25')
    .to('.hero__trust', { opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.15')
    .to('.hero__scroll', { opacity: 1, duration: 0.4, ease: 'power2.out' });
})();

/* ══════════════════════════════════════════════════════════════
   5. SCROLL ANIMATIONS — .reveal
══════════════════════════════════════════════════════════════ */
(function initReveal() {
  const reveals = gsap.utils.toArray('.reveal');

  // Immediately reveal anything already in viewport on load
  function revealInView() {
    reveals.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.95) el.classList.add('visible');
    });
  }

  // ScrollTrigger for scroll-in reveals
  reveals.forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      onEnter: () => el.classList.add('visible'),
      once: true
    });
  });

  // Fallback: run on load and after a short delay (catches anything GSAP misses)
  window.addEventListener('load', () => {
    revealInView();
    setTimeout(revealInView, 600);
  });
  revealInView();
})();

/* ══════════════════════════════════════════════════════════════
   6. COUNT-UP NUMBERS
══════════════════════════════════════════════════════════════ */
(function initCountUp() {
  const elements = document.querySelectorAll('[data-count]');
  if (!elements.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const isDecimal = target % 1 !== 0;
      const duration = 2000;
      const start = performance.now();

      function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const value = target * easeOut(progress);
        const display = isDecimal ? value.toFixed(1) : Math.floor(value).toString();
        el.textContent = display + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });

  elements.forEach(el => io.observe(el));
})();

/* ══════════════════════════════════════════════════════════════
   7. MAGNETIC BUTTONS
══════════════════════════════════════════════════════════════ */
(function initMagnetic() {
  document.querySelectorAll('.btn--gold').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      gsap.to(btn, { x: dx * 8, y: dy * 8, duration: 0.3, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    });
  });
})();

/* ══════════════════════════════════════════════════════════════
   8. TESTIMONIAL CAROUSEL
══════════════════════════════════════════════════════════════ */
(function initTestimonials() {
  const cards = Array.from(document.querySelectorAll('.testi-card'));
  const dots = Array.from(document.querySelectorAll('.testi-dot'));
  const prevBtn = document.querySelector('.testi-btn--prev');
  const nextBtn = document.querySelector('.testi-btn--next');
  if (!cards.length) return;

  const TOTAL = cards.length;
  let current = 0;
  let autoTimer = null;
  let paused = false;

  function getVisible() {
    return window.innerWidth >= 1024 ? 3 : 1;
  }

  function showSlide(idx) {
    const vis = getVisible();
    current = ((idx % TOTAL) + TOTAL) % TOTAL;
    cards.forEach((card, i) => {
      const offset = (i - current + TOTAL) % TOTAL;
      card.classList.toggle('visible', offset < vis);
    });
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  }

  function next() { showSlide(current + 1); }
  function prev() { showSlide(current - 1); }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => { if (!paused) next(); }, 4000);
  }
  function stopAuto() { if (autoTimer) clearInterval(autoTimer); }

  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); stopAuto(); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); stopAuto(); startAuto(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { showSlide(i); stopAuto(); startAuto(); });
  });

  const wrap = document.querySelector('.testi-carousel-wrap');
  if (wrap) {
    wrap.addEventListener('mouseenter', () => { paused = true; });
    wrap.addEventListener('mouseleave', () => { paused = false; });
  }

  showSlide(0);
  startAuto();
  window.addEventListener('resize', () => showSlide(current));
})();

/* ══════════════════════════════════════════════════════════════
   9. ACTIVE NAV LINK
══════════════════════════════════════════════════════════════ */
(function initActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .nav__drawer-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const linkFile = href.split('/').pop() || 'index.html';
    if (linkFile === path || (path === '' && linkFile === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* ══════════════════════════════════════════════════════════════
   10. EXIT INTENT
══════════════════════════════════════════════════════════════ */
(function initExitIntent() {
  const overlay = document.querySelector('.exit-overlay');
  const closeBtn = document.querySelector('.exit-popup__close');
  const dismissBtn = document.querySelector('.exit-popup__dismiss');
  if (!overlay) return;

  if (sessionStorage.getItem('dgd_exit')) return;

  function showExit() {
    if (sessionStorage.getItem('dgd_exit')) return;
    overlay.classList.add('show');
    sessionStorage.setItem('dgd_exit', '1');
    document.removeEventListener('mouseleave', onMouseLeave);
  }

  function closeExit() {
    overlay.classList.remove('show');
  }

  function onMouseLeave(e) {
    if (e.clientY < 20) showExit();
  }

  setTimeout(() => {
    document.addEventListener('mouseleave', onMouseLeave);
  }, 5000);

  if (closeBtn) closeBtn.addEventListener('click', closeExit);
  if (dismissBtn) dismissBtn.addEventListener('click', closeExit);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeExit();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('show')) closeExit();
  });
})();

/* ══════════════════════════════════════════════════════════════
   11. LEAD POPUP — 7s delay, once per session
══════════════════════════════════════════════════════════════ */
(function initLeadPopup() {
  const popup = document.querySelector('.lead-popup');
  const closeBtn = document.querySelector('.lead-popup__close');
  if (!popup) return;
  if (sessionStorage.getItem('dgd_lead')) return;

  setTimeout(() => {
    if (sessionStorage.getItem('dgd_lead')) return;
    popup.classList.add('show');
    sessionStorage.setItem('dgd_lead', '1');
  }, 7000);

  if (closeBtn) {
    closeBtn.addEventListener('click', () => popup.classList.remove('show'));
  }
})();

/* ══════════════════════════════════════════════════════════════
   12. EXIT POPUP FORM SUBMIT
══════════════════════════════════════════════════════════════ */
(function initExitForm() {
  const form = document.getElementById('exit-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending...';

    try {
      const data = new FormData(form);
      data.append('_subject', 'Exit Intent Audit Request — Dublin Growth Digital');
      const res = await fetch('https://formspree.io/f/meendppv', { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (res.ok) {
        const inner = form.closest('.exit-popup__form-inner') || form.parentElement;
        if (inner) inner.classList.add('hidden');
        const success = document.querySelector('.exit-popup__success');
        if (success) success.classList.add('show');
      } else {
        btn.textContent = 'Try Again';
        btn.disabled = false;
      }
    } catch {
      btn.textContent = 'Try Again';
      btn.disabled = false;
    }
  });
})();

/* ══════════════════════════════════════════════════════════════
   13. LEAD POPUP FORM SUBMIT
══════════════════════════════════════════════════════════════ */
(function initLeadForm() {
  const form = document.getElementById('lead-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending...';

    try {
      const data = new FormData(form);
      data.append('_subject', 'Free Audit Request — Dublin Growth Digital');
      const res = await fetch('https://formspree.io/f/meendppv', { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (res.ok) {
        const formEl = document.querySelector('.lead-popup__form');
        if (formEl) formEl.classList.add('hidden');
        const success = document.querySelector('.lead-popup__success');
        if (success) success.classList.add('show');
      } else {
        btn.textContent = 'Try Again';
        btn.disabled = false;
      }
    } catch {
      btn.textContent = 'Try Again';
      btn.disabled = false;
    }
  });
})();

/* ══════════════════════════════════════════════════════════════
   14. CONTACT FORM SUBMIT
══════════════════════════════════════════════════════════════ */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  function setError(input, state) {
    input.classList.toggle('error', state);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    const required = form.querySelectorAll('[required]');
    required.forEach(field => {
      if (!field.value.trim()) {
        setError(field, true);
        valid = false;
        field.addEventListener('input', () => setError(field, false), { once: true });
      } else {
        setError(field, false);
      }
    });

    if (!valid) return;

    const btn = form.querySelector('.form-submit');
    btn.disabled = true;
    btn.textContent = 'Sending...';

    try {
      const data = new FormData(form);
      const res = await fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (res.ok) {
        form.style.display = 'none';
        const success = document.querySelector('.form-success');
        if (success) success.classList.add('show');
      } else {
        btn.textContent = 'Try Again';
        btn.disabled = false;
      }
    } catch {
      btn.textContent = 'Try Again';
      btn.disabled = false;
    }
  });
})();

/* ══════════════════════════════════════════════════════════════
   15. VISITOR TRACKING
══════════════════════════════════════════════════════════════ */
(function initVisitorTracking() {
  const ENDPOINT = 'https://formspree.io/f/meendppv';
  const page = window.location.pathname.split('/').pop() || 'index.html';

  async function getIpData() {
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (res.ok) return await res.json();
    } catch (_) {}
    return {};
  }

  async function sendPing(type) {
    const ipData = await getIpData();
    const payload = {
      _subject: `[DGD Tracking] ${type} — ${page}`,
      event: type,
      page: page,
      url: window.location.href,
      referrer: document.referrer || 'direct',
      userAgent: navigator.userAgent.substring(0, 200),
      ip: ipData.ip || 'unknown',
      city: ipData.city || 'unknown',
      country: ipData.country_name || 'unknown',
      timestamp: new Date().toISOString()
    };
    try {
      await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (_) {}
  }

  // 3s page ping — once per session per page
  const pingKey = 'dgd_pinged_' + page;
  if (!sessionStorage.getItem(pingKey)) {
    setTimeout(() => {
      sessionStorage.setItem(pingKey, '1');
      sendPing('Page Visit');
    }, 3000);
  }

  // 45s engaged ping
  const engagedKey = 'dgd_engaged_' + page;
  if (!sessionStorage.getItem(engagedKey)) {
    setTimeout(() => {
      sessionStorage.setItem(engagedKey, '1');
      sendPing('Engaged Visitor (45s)');
    }, 45000);
  }

  // Contact page specific ping
  if (page === 'contact.html') {
    const contactKey = 'dgd_contact_visit';
    if (!sessionStorage.getItem(contactKey)) {
      setTimeout(() => {
        sessionStorage.setItem(contactKey, '1');
        sendPing('Contact Page Visit');
      }, 2000);
    }
  }
})();

/* ══════════════════════════════════════════════════════════════
   16. STAGGER FADE-UP via ScrollTrigger
══════════════════════════════════════════════════════════════ */
(function initStaggerCards() {
  const groups = [
    '.result-card',
    '.service-card',
    '.why-block',
    '.process-step',
    '.pricing-card',
    '.case-card',
    '.testi-mini'
  ];

  groups.forEach(selector => {
    const els = gsap.utils.toArray(selector);
    if (!els.length) return;

    // Group by parent container for stagger effect
    const parents = [...new Set(els.map(el => el.parentElement))];
    parents.forEach(parent => {
      const children = parent.querySelectorAll(selector);
      if (!children.length) return;
      gsap.from(children, {
        scrollTrigger: {
          trigger: parent,
          start: 'top 85%',
          once: true
        },
        y: 40,
        opacity: 0,
        duration: 0.65,
        stagger: 0.1,
        ease: 'power2.out'
      });
    });
  });
})();

/* ══════════════════════════════════════════════════════════════
   17. HERO PARALLAX
══════════════════════════════════════════════════════════════ */
(function initHeroParallax() {
  if (!document.querySelector('.hero__content')) return;
  gsap.to('.hero__content', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    },
    y: 80,
    ease: 'none'
  });
})();

/* ══════════════════════════════════════════════════════════════
   18. FAQ ACCORDION
══════════════════════════════════════════════════════════════ */
(function initFaq() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const trigger = item.querySelector('.faq-question');
    const content = item.querySelector('.faq-answer');
    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        const ans = openItem.querySelector('.faq-answer');
        if (ans) gsap.to(ans, { height: 0, duration: 0.3, ease: 'power2.inOut' });
      });
      if (!isOpen) {
        item.classList.add('open');
        gsap.set(content, { height: 'auto' });
        gsap.from(content, { height: 0, duration: 0.35, ease: 'power2.out' });
      }
    });
  });
})();
