/* ============================================================
   MUNSTER PAVE & DRIVE — Shared JavaScript
   ============================================================ */

/* --- Sticky Nav --- */
(function () {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();

/* --- Hamburger Menu --- */
(function () {
  const btn = document.querySelector('.hamburger');
  const nav = document.querySelector('.mobile-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', function () {
    btn.classList.toggle('active');
    nav.classList.toggle('open');
  });
  // Close on link click
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      btn.classList.remove('active');
      nav.classList.remove('open');
    });
  });
})();

/* --- Scroll Reveal (IntersectionObserver) --- */
(function () {
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(function (el) {
    obs.observe(el);
  });
})();

/* --- Review Carousel --- */
(function () {
  var track = document.querySelector('.carousel-track');
  if (!track) return;

  var container  = document.querySelector('.carousel-container');
  var dotsWrap   = document.querySelector('.carousel-dots');
  var prevBtn    = document.querySelector('.carousel-prev');
  var nextBtn    = document.querySelector('.carousel-next');
  var cards      = Array.from(track.children);
  var total      = cards.length;
  var current    = 0;
  var timer      = null;

  function vis() { return window.innerWidth < 768 ? 1 : 3; }

  function pages() { return Math.ceil(total / vis()); }

  function cardW() {
    var v = vis();
    return (container.offsetWidth - 24 * (v - 1)) / v;
  }

  function render() {
    var v   = vis();
    var w   = cardW();
    var gap = 24;
    cards.forEach(function (c) { c.style.minWidth = w + 'px'; c.style.maxWidth = w + 'px'; });
    track.style.transform = 'translateX(-' + (current * v * (w + gap)) + 'px)';
    buildDots();
  }

  function buildDots() {
    if (!dotsWrap) return;
    var p = pages();
    dotsWrap.innerHTML = '';
    for (var i = 0; i < p; i++) {
      (function (idx) {
        var d = document.createElement('button');
        d.className = 'carousel-dot' + (idx === current ? ' active' : '');
        d.setAttribute('aria-label', 'Go to page ' + (idx + 1));
        d.addEventListener('click', function () { current = idx; render(); resetTimer(); });
        dotsWrap.appendChild(d);
      })(i);
    }
  }

  function next() { current = (current + 1) % pages(); render(); }
  function prev() { current = (current - 1 + pages()) % pages(); render(); }

  function startTimer() { timer = setInterval(next, 4000); }
  function resetTimer() { clearInterval(timer); startTimer(); }

  if (prevBtn) prevBtn.addEventListener('click', function () { prev(); resetTimer(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { next(); resetTimer(); });

  var wrapper = document.querySelector('.carousel-wrapper');
  if (wrapper) {
    wrapper.addEventListener('mouseenter', function () { clearInterval(timer); });
    wrapper.addEventListener('mouseleave', startTimer);
  }

  var resizeT;
  window.addEventListener('resize', function () {
    clearTimeout(resizeT);
    resizeT = setTimeout(function () { current = 0; render(); }, 150);
  });

  render();
  startTimer();
})();

/* --- Hero Counter Animation --- */
(function () {
  var counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el) {
    var target   = parseInt(el.getAttribute('data-target'), 10);
    var suffix   = el.getAttribute('data-suffix') || '';
    var duration = 2200;
    var start    = null;

    function step(ts) {
      if (!start) start = ts;
      var pct = Math.min((ts - start) / duration, 1);
      el.textContent = Math.round(easeOutCubic(pct) * target) + suffix;
      if (pct < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var statsEl = document.querySelector('.hero-stats');
  if (!statsEl) return;

  var fired = false;
  var obs = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting && !fired) {
      fired = true;
      counters.forEach(animateCounter);
    }
  }, { threshold: 0.3 });
  obs.observe(statsEl);
})();

/* --- FAQ Accordion --- */
(function () {
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q   = item.querySelector('.faq-q');
    var ans = item.querySelector('.faq-ans');
    if (!q || !ans) return;

    q.addEventListener('click', function () {
      var open = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(function (o) {
        o.classList.remove('open');
        o.querySelector('.faq-ans').style.maxHeight = '0';
      });
      if (!open) {
        item.classList.add('open');
        ans.style.maxHeight = ans.scrollHeight + 'px';
      }
    });
  });
})();

/* --- Contact Form Validation --- */
(function () {
  var form = document.querySelector('#quote-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    var valid = true;
    form.querySelectorAll('[required]').forEach(function (field) {
      field.classList.remove('err');
      if (!field.value.trim()) {
        field.classList.add('err');
        valid = false;
      }
    });
    if (!valid) {
      e.preventDefault();
      var first = form.querySelector('.err');
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  form.querySelectorAll('[required]').forEach(function (field) {
    field.addEventListener('input', function () {
      if (field.value.trim()) field.classList.remove('err');
    });
  });
})();
