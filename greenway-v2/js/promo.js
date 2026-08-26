/*
 * Greenway - quote prompt.
 *
 * WHEN IT FIRES, AND WHY IT IS NOT ON A TIMER
 * The previous site opened this two seconds after load, on every page. Google
 * penalises mobile pages that cover their content with an interstitial when a
 * visitor arrives from search, and ranking in Limerick is the whole point of
 * this site - so a load-timer trigger would work against the thing it is meant
 * to help. Instead:
 *
 *   desktop  exit intent - the pointer leaves through the top of the window
 *   mobile   after 55% scroll depth AND 20s, so it follows engagement rather
 *            than interrupting arrival
 *
 * Either way it shows once per session, never on the contact or thank-you
 * pages, and never when the visitor has already reached the footer CTA.
 */
(function () {
  'use strict';

  var KEY = 'gw-promo-seen';
  try { if (sessionStorage.getItem(KEY)) return; } catch (e) { /* private mode */ }

  // The dialog is BUILT HERE rather than shipped in the HTML. Measured: the
  // ~1.1 KB of markup in the page pushed the document past a congestion-window
  // boundary and cost one full round trip - LCP went 2.26s -> 2.41s, dead
  // consistent across runs, with the script itself costing nothing. Since it
  // can only ever be opened by this script, the page does not need it. Search
  // engines never see interstitial markup either, which is a bonus.
  var tel = document.querySelector('.sticky-call a[href^="tel:"]')
         || document.querySelector('a[href^="tel:"]');
  var telHref = tel ? tel.getAttribute('href') : 'tel:+353830301799';
  var telText = tel ? tel.textContent.trim() : 'Call 083 030 1799';

  var promo = document.createElement('div');
  promo.className = 'promo';
  promo.hidden = true;
  promo.setAttribute('data-promo', '');
  promo.setAttribute('role', 'dialog');
  promo.setAttribute('aria-modal', 'true');
  promo.setAttribute('aria-labelledby', 'promo-title');
  promo.innerHTML =
    '<div class="promo__card">' +
      '<button class="promo__close" data-promo-close type="button" aria-label="Close">&times;</button>' +
      '<p class="promo__label">Before you go</p>' +
      '<h2 class="promo__title" id="promo-title">Get it looked at, for nothing.</h2>' +
      '<p class="promo__text">Describe the job and we will come out, assess it and put a ' +
        'written itemised quote in front of you. No charge, and no obligation either way.</p>' +
      '<div class="promo__actions">' +
        '<a class="btn btn--gold" href="' + telHref + '">' + telText + '</a>' +
        '<a class="btn btn--ghost" href="contact.html">Request a quote</a>' +
      '</div>' +
      '<p class="promo__note">Free site visit &middot; Itemised quote &middot; 24/7 emergency call-outs</p>' +
    '</div>';
  document.body.appendChild(promo);

  var card = promo.querySelector('.promo__card');
  var closeBtn = promo.querySelector('[data-promo-close]');
  var lastFocus = null;
  var open = false;

  function focusables() {
    return [].slice.call(card.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
  }

  function show() {
    if (open) return;
    open = true;
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}

    lastFocus = document.activeElement;
    promo.hidden = false;
    // Locking the body would otherwise remove the scrollbar and shift the page
    // sideways, which is a layout shift the visitor can see.
    var sw = window.innerWidth - document.documentElement.clientWidth;
    if (sw > 0) document.body.style.paddingRight = sw + 'px';
    document.body.style.overflow = 'hidden';
    // Force a reflow so the transition has a start state, then open in the
    // same tick. requestAnimationFrame would be tidier but does not fire in a
    // tab that has never been painted, which would leave this in the DOM and
    // holding focus while still at opacity 0 - an invisible focus trap.
    void promo.offsetWidth;
    promo.classList.add('is-open');

    card.setAttribute('tabindex', '-1');
    card.focus();
    teardown();
  }

  function hide() {
    if (!open) return;
    open = false;
    promo.classList.remove('is-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    var done = function () { promo.hidden = true; };
    // Wait for the fade unless motion is suppressed, in which case hide at once.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) done();
    else window.setTimeout(done, 260);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  // ---------------------------------------------------------------- controls
  closeBtn.addEventListener('click', hide);
  promo.addEventListener('click', function (e) { if (e.target === promo) hide(); });
  document.addEventListener('keydown', function (e) {
    if (!open) return;
    if (e.key === 'Escape') { hide(); return; }
    if (e.key !== 'Tab') return;
    // Keep focus inside the dialog while it is open.
    var f = focusables();
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // ---------------------------------------------------------------- triggers
  var onExit = null, scrollIO = null, timer = null, armed = false;

  function teardown() {
    if (onExit) document.removeEventListener('mouseout', onExit);
    if (scrollIO) scrollIO.disconnect();
    if (timer) window.clearTimeout(timer);
  }

  // Never interrupt someone who has already reached the closing CTA - they are
  // looking at the same two buttons this would show them.
  var closer = document.querySelector('.section--deep');
  var reachedEnd = false;
  if (closer && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { reachedEnd = true; teardown(); } });
    }, { threshold: 0 }).observe(closer);
  }

  var coarse = window.matchMedia('(hover: none), (max-width: 760px)').matches;

  if (!coarse) {
    onExit = function (e) {
      if (reachedEnd || e.relatedTarget || e.clientY > 8) return;
      show();
    };
    document.addEventListener('mouseout', onExit);
  } else {
    // Mobile: engagement, not arrival. Both conditions must be met, and either
    // one may be satisfied last - so neither is checked inside the other's
    // callback. An IntersectionObserver only reports a CHANGE in intersection;
    // if the visitor is already past the mark when the timer arms, the observer
    // will never fire again and a check nested inside it would never run.
    var deep = false;

    function maybeShow() {
      if (armed && deep && !reachedEnd) show();
    }

    timer = window.setTimeout(function () { armed = true; maybeShow(); }, 20000);

    var mark = document.createElement('span');
    mark.setAttribute('aria-hidden', 'true');
    mark.style.cssText = 'position:absolute;top:55%;left:0;width:1px;height:1px;';
    document.body.appendChild(mark);

    if ('IntersectionObserver' in window) {
      scrollIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { deep = true; maybeShow(); }
        });
      }, { threshold: 0 });
      scrollIO.observe(mark);
    }
  }
})();
