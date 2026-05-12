'use strict';

window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) setTimeout(() => loader.classList.add('hidden'), 600);
});

(function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(l => {
    if (l.getAttribute('href') === path) l.classList.add('active');
  });
})();

(function initHamburger() {
  const burger = document.querySelector('.nav__hamburger');
  const drawer = document.querySelector('.nav__drawer');
  if (!burger||!drawer) return;
  burger.addEventListener('click', () => {
    const o = burger.classList.toggle('open');
    drawer.classList.toggle('open', o);
    document.body.style.overflow = o ? 'hidden' : '';
  });
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('open'); drawer.classList.remove('open'); document.body.style.overflow = '';
  }));
})();

(function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, P = [], mouse = {x:-9999, y:-9999};
  const N = window.matchMedia('(max-width:768px)').matches ? 60 : 120;
  const DIST = 140;
  const BLUE = [27, 94, 234];
  const LIGHT = [77, 136, 255];

  function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }

  class Pt {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : -10;
      this.vx = (Math.random() - .5) * .4;
      this.vy = (Math.random() - .5) * .4;
      this.r = Math.random() * 1.8 + .5;
      this.a = Math.random() * .5 + .1;
      this.c = Math.random() > .5 ? LIGHT : BLUE;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      const dx = mouse.x - this.x, dy = mouse.y - this.y, d = Math.sqrt(dx*dx+dy*dy);
      if (d < 100) { this.x -= dx * .02; this.y -= dy * .02; }
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${this.c[0]},${this.c[1]},${this.c[2]},${this.a})`; ctx.fill();
    }
  }

  function init() { P = []; for (let i = 0; i < N; i++) P.push(new Pt()); }

  function mesh() {
    const t = Date.now() * .0003;
    const g = ctx.createRadialGradient(W*(.2+Math.sin(t*.7)*.1), H*.5, 0, W*(.2+Math.sin(t*.7)*.1), H*.5, W*.45);
    g.addColorStop(0, 'rgba(27,94,234,0.06)'); g.addColorStop(1, 'transparent');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }

  function lines() {
    for (let i = 0; i < P.length; i++) for (let j = i+1; j < P.length; j++) {
      const dx = P[i].x - P[j].x, dy = P[i].y - P[j].y, d = Math.sqrt(dx*dx+dy*dy);
      if (d < DIST) {
        ctx.beginPath(); ctx.moveTo(P[i].x, P[i].y); ctx.lineTo(P[j].x, P[j].y);
        ctx.strokeStyle = `rgba(27,94,234,${(1-d/DIST)*.15})`; ctx.lineWidth = .7; ctx.stroke();
      }
    }
  }

  function frame() { ctx.clearRect(0,0,W,H); mesh(); lines(); P.forEach(p=>{p.update();p.draw();}); requestAnimationFrame(frame); }
  canvas.addEventListener('mousemove', e => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX-r.left; mouse.y = e.clientY-r.top; });
  canvas.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
  resize(); init(); frame();
  window.addEventListener('resize', () => { resize(); init(); }, {passive:true});
})();

(function initReveal() {
  const obs = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
  }), {threshold:.12, rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

(function initCounters() {
  function ease(t) { return 1 - Math.pow(1-t, 4); }
  const obs = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, target = parseFloat(el.dataset.target), suffix = el.dataset.suffix || '', dur = 2200, start = performance.now();
    function upd(now) { const p = Math.min((now-start)/dur, 1), v = target*ease(p); el.textContent = (Number.isInteger(target) ? Math.round(v).toLocaleString() : v.toFixed(1)) + suffix; if (p < 1) requestAnimationFrame(upd); }
    requestAnimationFrame(upd); obs.unobserve(el);
  }), {threshold:.3});
  document.querySelectorAll('[data-counter]').forEach(el => obs.observe(el));
})();

(function initFAQ() {
  document.querySelectorAll('.faq-item__q').forEach(q => q.addEventListener('click', () => {
    const item = q.closest('.faq-item'), isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  }));
})();

(function initTestimonialsToggle() {
  const btn = document.getElementById('testi-toggle-btn');
  const collapsible = document.getElementById('testi-collapsible');
  if (!btn || !collapsible) return;
  btn.addEventListener('click', () => {
    const open = collapsible.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.querySelector('.testi-toggle-label').textContent = open ? 'Hide Reviews' : 'See All 52 Reviews';
  });
})();

(function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const fields = form.querySelector('.form-fields'), success = document.getElementById('form-success');
    if (fields) fields.style.display = 'none';
    if (success) success.style.display = 'block';
  });
})();

document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const t = document.getElementById(a.getAttribute('href').slice(1));
  if (t) { e.preventDefault(); t.scrollIntoView({behavior:'smooth', block:'start'}); }
}));

(function initParallax() {
  const hc = document.querySelector('.hero__content');
  if (!hc) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) { hc.style.transform = `translateY(${y*.2}px)`; hc.style.opacity = 1 - (y/(window.innerHeight*.8)); }
  }, {passive:true});
})();

(function heroIn() {
  document.querySelectorAll('.hero__anim').forEach((el, i) => {
    el.style.opacity = '0'; el.style.transform = 'translateY(32px)';
    el.style.transition = `opacity .9s cubic-bezier(.4,0,.2,1) ${.1+i*.15}s, transform .9s cubic-bezier(.4,0,.2,1) ${.1+i*.15}s`;
    setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, 50);
  });
})();
