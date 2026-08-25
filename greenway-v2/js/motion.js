/*
 * Greenway — motion system
 * No dependencies. Reveal-on-enter + video orchestration.
 *
 * Rules enforced here:
 *   - IntersectionObserver only. No scroll listeners anywhere.
 *   - Video is decorative: it never blocks content and never becomes LCP.
 *   - prefers-reduced-motion  -> poster frames only, no reveal animation.
 *   - saveData / 2g / 3g      -> poster frames only, video never requested.
 *   - Hero video is requested only after load + idle, so it cannot compete
 *     with the LCP poster image for bandwidth.
 */
(function () {
  'use strict';

  var docEl = document.documentElement;

  // ---------------------------------------------------------------- capability
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  var saveData = !!(conn && conn.saveData);
  var effective = (conn && conn.effectiveType) || '';
  var slowNet = /(^|-)2g$/.test(effective) || effective === '3g';

  var reduceMotion = mqReduce.matches;
  var allowVideo = !reduceMotion && !saveData && !slowNet;

  docEl.classList.remove('no-js');
  docEl.classList.add(allowVideo ? 'video-on' : 'video-off');
  if (reduceMotion) docEl.classList.add('reduce-motion');

  function whenIdle(fn) {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(fn, { timeout: 2500 });
    } else {
      window.setTimeout(fn, 1000);
    }
  }

  // ------------------------------------------------------------------- reveal
  function initReveal() {
    var items = [].slice.call(document.querySelectorAll('[data-reveal]'));
    if (!items.length) return;

    // No IO support, or motion suppressed: show everything, animate nothing.
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-revealed'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        // stagger children of a group very slightly, capped so nothing crawls
        var delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
        if (delay) el.style.transitionDelay = Math.min(delay, 240) + 'ms';
        el.classList.add('is-revealed');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    items.forEach(function (el) { io.observe(el); });

    // Safety net. IntersectionObserver does not fire while a tab has never
    // been painted (background tab, hidden iframe, some in-app browsers), and
    // content stuck at opacity 0 is worse than content that simply appears.
    // Anything still unrevealed after the page has settled is shown outright.
    var release = function () {
      items.forEach(function (el) {
        if (!el.classList.contains('is-revealed')) {
          el.style.transition = 'none';
          el.classList.add('is-revealed');
          io.unobserve(el);
        }
      });
    };
    window.setTimeout(function () {
      // Only force it if nothing at all has revealed - if the observer is
      // working, leave the rest to scroll in normally.
      var any = items.some(function (el) { return el.classList.contains('is-revealed'); });
      if (!any) release();
    }, 3000);
  }

  // -------------------------------------------------------------- video utils
  function attachSources(video) {
    if (video.dataset.sourcesAttached) return false;
    var sources = [].slice.call(video.querySelectorAll('source[data-src]'));
    if (!sources.length) return false;
    sources.forEach(function (s) {
      s.src = s.getAttribute('data-src');
      s.removeAttribute('data-src');
    });
    video.dataset.sourcesAttached = '1';
    video.load();
    return true;
  }

  function safePlay(video) {
    var p = video.play();
    if (p && typeof p.catch === 'function') {
      // Autoplay refused (battery saver, iOS low power). Poster stays. Not an error.
      p.catch(function () { video.classList.remove('is-ready'); });
    }
  }

  function markReady(video) {
    video.classList.add('is-ready');
  }

  // ---------------------------------------------------------------- hero video
  function initHero() {
    var video = document.querySelector('[data-hero-video]');
    if (!video || !allowVideo) return;

    var start = function () {
      whenIdle(function () {
        if (!attachSources(video)) return;
        // Only reveal the video once it can genuinely play through, so the
        // poster is never replaced by a stalled or half-buffered frame.
        video.addEventListener('canplaythrough', function () {
          markReady(video);
          safePlay(video);
        }, { once: true });
        // If it errors (missing file, unsupported codec) the poster simply stays.
        video.addEventListener('error', function () {
          video.classList.remove('is-ready');
        }, { once: true });
      });
    };

    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
  }

  // --------------------------------------------------- section transition video
  function initTransitions() {
    var vids = [].slice.call(document.querySelectorAll('[data-transition-video]'));
    if (!vids.length || !allowVideo || !('IntersectionObserver' in window)) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var v = entry.target;
        if (entry.isIntersecting) {
          if (attachSources(v)) {
            v.addEventListener('canplaythrough', function () {
              markReady(v);
              safePlay(v);
            }, { once: true });
            v.addEventListener('error', function () {
              v.classList.remove('is-ready');
            }, { once: true });
          } else if (v.readyState >= 3) {
            safePlay(v);
          }
        } else if (!v.paused) {
          v.pause();
        }
      });
    }, { threshold: 0.25 });

    vids.forEach(function (v) { io.observe(v); });
  }

  // ------------------------------------------------------- mobile sticky call
  // Appears only after the hero has scrolled away. Still IO, still no listeners.
  function initStickyCall() {
    var bar = document.querySelector('[data-sticky-call]');
    var hero = document.querySelector('[data-hero]');
    if (!bar || !hero || !('IntersectionObserver' in window)) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        bar.classList.toggle('is-shown', !e.isIntersecting);
      });
    }, { threshold: 0 });
    io.observe(hero);
  }

  // ------------------------------------------------------------- nav on scroll
  function initNav() {
    var nav = document.querySelector('[data-nav]');
    var sentinel = document.querySelector('[data-nav-sentinel]');
    if (!nav || !sentinel || !('IntersectionObserver' in window)) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        nav.classList.toggle('is-solid', !e.isIntersecting);
      });
    }, { threshold: 0 });
    io.observe(sentinel);
  }

  // -------------------------------------------------------------------- mobile
  function initMenu() {
    var btn = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-menu]');
    if (!btn || !panel) return;

    function setOpen(open) {
      btn.setAttribute('aria-expanded', String(open));
      panel.classList.toggle('is-open', open);
      panel.hidden = !open;
      document.body.style.overflow = open ? 'hidden' : '';
    }
    btn.addEventListener('click', function () {
      setOpen(btn.getAttribute('aria-expanded') !== 'true');
    });
    panel.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        btn.focus();
      }
    });
  }

  // ------------------------------------------------------- hero load-in guard
  // The hero entrance is pure CSS and needs no JS to run. This exists only as
  // a rescue: a hero stuck at opacity 0 is a blank first screen, which is far
  // worse than a hero that simply appears. By 3s every animation has long
  // finished, so in the normal case this changes nothing at all.
  function initHeroGuard() {
    if (!document.querySelector('.hero')) return;
    window.setTimeout(function () {
      docEl.classList.add('hero-settled');
    }, 3000);
  }

  // ----------------------------------------------------------------------- go
  function boot() {
    initHeroGuard();
    initReveal();
    initHero();
    initTransitions();
    initStickyCall();
    initNav();
    initMenu();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
