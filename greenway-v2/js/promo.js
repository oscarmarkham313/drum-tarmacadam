/*
 * Greenway - quote prompt.
 *
 * TRIGGER: 4 seconds after the page loads, once per session.
 *
 * This is a deliberate client decision, made with the trade-off on the table.
 * Google's intrusive-interstitial guideline covers interstitials that cover
 * content shortly after a visitor arrives from search on mobile, and four
 * seconds still counts as arrival - so this carries some mobile ranking risk.
 * There is no technical way around that: suppressing it for Googlebot would be
 * cloaking, which is worse than the thing it would be hiding. If organic
 * mobile impressions dip, this is the first thing to change back.
 *
 * Exit intent is kept on desktop as well, purely as a safety net for anyone
 * who leaves before the four seconds elapse.
 *
 * It never appears on contact or thank-you - the visitor is already
 * converting there - and it shows at most once per session.
 */
(function () {
  'use strict';

  var KEY = 'gw-promo-seen';
  try { if (sessionStorage.getItem(KEY)) return; } catch (e) { /* private mode */ }

  // The dialog is built lazily, inside show(), for two reasons.
  //
  // It is not shipped in the HTML because the ~1.1 KB of markup pushed the
  // document past a congestion-window boundary and cost one full round trip -
  // measured, LCP 2.26s -> 2.41s, consistent across five runs.
  //
  // It is not built at script init either, because innerHTML plus an append
  // forces a style and layout pass inside the load window, where it counts
  // against Total Blocking Time. Nothing needs to exist until the prompt
  // actually opens, so nothing is created until then - which also means
  // visitors who leave first, or who have already seen it this session, pay
  // nothing at all.
  var promo = null, card = null, lastFocus = null;
  // NOT named `open`: that resolves to window.open, a truthy built-in, so
  // `if (open) return;` would silently return every time with no error.
  var isOpen = false;

  function build() {
    var tel = document.querySelector('.sticky-call a[href^="tel:"]')
           || document.querySelector('a[href^="tel:"]');
    var telHref = tel ? tel.getAttribute('href') : 'tel:+353830301799';
    var telText = tel ? tel.textContent.trim() : 'Call 083 030 1799';

    promo = document.createElement('div');
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

    card = promo.querySelector('.promo__card');
    promo.querySelector('[data-promo-close]').addEventListener('click', hide);
    promo.addEventListener('click', function (e) { if (e.target === promo) hide(); });
  }

  function focusables() {
    return [].slice.call(card.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
  }

  function show() {
    if (isOpen) return;
    isOpen = true;
    if (!promo) build();
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
    if (!isOpen) return;
    isOpen = false;
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
  document.addEventListener('keydown', function (e) {
    if (!isOpen) return;
    if (e.key === 'Escape') { hide(); return; }
    if (e.key !== 'Tab') return;
    // Keep focus inside the dialog while it is isOpen.
    var f = focusables();
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // ---------------------------------------------------------------- triggers
  var onExit = null, timer = null;

  function teardown() {
    if (onExit) document.removeEventListener('mouseout', onExit);
    if (timer) window.clearTimeout(timer);
  }

  // The trigger: four seconds on the page. Nothing suppresses it.
  //
  // An earlier version cancelled the timer once the visitor reached the
  // closing CTA, on the theory that they were already looking at the same two
  // buttons. That made the prompt unpredictable - anyone who scrolled quickly
  // never saw it - and it is not what was asked for. Four seconds means four
  // seconds.
  timer = window.setTimeout(show, 4000);

  // Desktop also gets exit intent, purely to catch anyone who is already
  // leaving before the four seconds are up.
  if (!window.matchMedia('(hover: none), (max-width: 760px)').matches) {
    onExit = function (e) {
      if (e.relatedTarget || e.clientY > 8) return;
      show();
    };
    document.addEventListener('mouseout', onExit);
  }

})();
