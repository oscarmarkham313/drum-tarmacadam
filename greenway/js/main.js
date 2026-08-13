// ===== NAVBAR SCROLL =====
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ===== HAMBURGER MENU =====
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });
}

// ===== ACTIVE NAV LINK =====
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 1800;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const value = Math.floor(progress * target);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// The HTML carries the real values as static text, so the stats are always
// correct even if this animation never runs. Low threshold so it fires
// reliably on small viewports.
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numbers = entry.target.querySelectorAll('.number[data-count]');
      numbers.forEach(num => {
        const target = parseInt(num.dataset.count);
        const suffix = num.dataset.suffix || '';
        animateCounter(num, target, suffix);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

const statsBar = document.querySelector('.stats-inner');
if (statsBar) statsObserver.observe(statsBar);

// ===== CONTACT FORM =====
// Native HTML5 validation runs first (required fields). Valid submissions are
// delivered by FormSubmit (emails the site inbox), then redirect to the
// thank-you page so ad platforms can track the conversion URL. On delivery
// failure the error box appears — the visitor is never sent to the thank-you
// page for a message that didn't send.
const FORM_ENDPOINT = 'https://formsubmit.co/ajax/greenwaybusinessparkardagh@gmail.com';
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const errBox = document.getElementById('formError');
    if (errBox) errBox.style.display = 'none';
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;
    const data = Object.fromEntries(new FormData(contactForm).entries());
    data._subject = 'New quote request — greenwaypropertyservices.ie';
    data._template = 'table';
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      // FormSubmit returns 200 with success:"false" (e.g. before activation),
      // so the body must be checked — res.ok alone is not delivery.
      if (!res.ok || String(result.success) !== 'true') throw new Error(result.message || ('HTTP ' + res.status));
      window.location.href = 'thank-you.html';
    } catch (err) {
      btn.textContent = originalText;
      btn.disabled = false;
      if (errBox) errBox.style.display = 'block';
    }
  });
}

// ===== PROJECT FILTER (projects page) =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-full-card[data-category]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.display = show ? '' : 'none';
      card.style.animation = show ? 'fadeIn 0.4s ease' : '';
    });
  });
});

// ===== CTA POPUP =====
(function() {
  const popup = document.getElementById('ctaPopup');
  const closeBtn = document.getElementById('popupClose');
  if (!popup) return;

  function openPopup() {
    popup.classList.add('popup-visible');
    document.body.style.overflow = 'hidden';
  }
  function closePopup() {
    popup.classList.remove('popup-visible');
    document.body.style.overflow = '';
    sessionStorage.setItem('popupShown', '1');
  }

  if (!sessionStorage.getItem('popupShown')) {
    setTimeout(openPopup, 2000);
  }

  closeBtn.addEventListener('click', closePopup);
  popup.addEventListener('click', function(e) {
    if (e.target === popup) closePopup();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closePopup();
  });
})();

// ===== SERVICES ACCORDION (mobile) =====
function initServicesAccordion() {
  const cards = document.querySelectorAll('.service-card');
  cards.forEach(card => {
    const h3 = card.querySelector('h3');
    if (!h3) return;
    h3.removeEventListener('click', h3._accHandler);
    h3._accHandler = () => {
      if (window.innerWidth > 768) return;
      const isOpen = card.classList.contains('acc-open');
      cards.forEach(c => c.classList.remove('acc-open'));
      if (!isOpen) card.classList.add('acc-open');
    };
    h3.addEventListener('click', h3._accHandler);
  });
}
initServicesAccordion();
window.addEventListener('resize', initServicesAccordion);

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});
