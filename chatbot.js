/* ============================================================
   DGD ASSISTANT — chatbot.js
   ============================================================ */
(function () {
  'use strict';

  var CALENDAR  = 'https://calendar.app.google/iwLnEDJTo2RprYDJ6';
  var WHATSAPP  = 'https://wa.me/353871257533?text=Hi%2C%20I%27d%20like%20to%20find%20out%20more%20about%20Dublin%20Growth%20Digital';

  /* ── Conversation tree ─────────────────────────────────── */
  var FLOW = {
    welcome: {
      text: "👋 Hi! I'm Katie from DGD. What can I help you with today?",
      chips: ['📱 Social Media', '🖥️ Web Design', '📣 Google & Meta Ads', '💰 Pricing', '📊 Our Results', '📞 Book a Call']
    },
    social: {
      text: "We manage your Instagram, Facebook, TikTok & LinkedIn — daily content, reels, stories, and growth strategy. Our clients see 400%+ follower growth and consistent leads within 90 days. 📱",
      chips: ["What's included?", 'See client results', '💰 Pricing', '📞 Book a call']
    },
    social_included: {
      text: "Our social media package includes:\n✅ 3–5 posts per week\n✅ Reels & story creation\n✅ Caption copywriting\n✅ Hashtag & growth strategy\n✅ Monthly performance reports\n✅ Full account management\n\nYou run your business — we handle everything else.",
      chips: ['💰 Pricing', '📞 Book a call', '← Main menu']
    },
    webdesign: {
      text: "We build fast, beautiful websites that turn visitors into customers. Mobile-first, SEO-ready, and live in as little as 1 day. 🖥️",
      chips: ["What's included?", '👀 See examples', '💰 Pricing', '📞 Book a call']
    },
    webdesign_included: {
      text: "Every website we build includes:\n✅ Custom mobile-first design\n✅ On-page SEO from day one\n✅ Contact forms & booking integration\n✅ Google Analytics setup\n✅ Lightning-fast performance\n✅ 30-day post-launch support",
      chips: ['💰 Pricing', '📞 Book a call', '← Main menu']
    },
    ads: {
      text: "We run Google Ads, Meta Ads (Facebook & Instagram) and full SEO campaigns. Clients average 6x return on ad spend within 60 days. One client dropped their cost-per-lead from €84 to €11. 💰",
      chips: ['How does it work?', '💰 Pricing', '📊 See results', '📞 Book a call']
    },
    ads_how: {
      text: "Our proven process:\n1️⃣ Free strategy call — we learn your goals\n2️⃣ Campaigns built with proven targeting\n3️⃣ Live within 48 hours\n4️⃣ Weekly reports + ongoing optimisation\n\nNo long contracts. Real results in 30 days.",
      chips: ['💰 Pricing', '📞 Book a call', '← Main menu']
    },
    pricing: {
      text: "Pricing is tailored to your business — no cookie-cutter packages here. The fastest way to get an accurate quote is a free 15-minute call with zero obligation. Want to jump on one now? 📞",
      chips: ['📞 Book a call', '💬 WhatsApp us', '← Main menu']
    },
    results: {
      text: "A few highlights from our clients:\n\n📈 +420% increase in restaurant bookings\n💰 18x return on ad spend\n🔍 #1 Google rankings across key searches\n📱 400 → 11,200 followers in 4 months\n\nWant to see the full picture?",
      chips: ['📊 See all results', '📞 Book a call', '← Main menu']
    },
    fallback: {
      text: "Great question! The best way to get a proper answer is a quick 15-minute chat with our team — free, no sales pressure, just a clear plan for your business. 🚀",
      chips: ['📞 Book a call', '💬 WhatsApp us', '← Main menu']
    }
  };

  /* ── Keyword routing for free-text input ───────────────── */
  function route(text) {
    var t = text.toLowerCase();
    if (/price|cost|how much|package|plan|fee|charge/.test(t)) return 'pricing';
    if (/social|instagram|facebook|tiktok|linkedin|post|content|follower|reel/.test(t)) return 'social';
    if (/web|website|design|build|page|landing|site/.test(t)) return 'webdesign';
    if (/google|meta|ads|seo|search|rank|ppc|advertising/.test(t)) return 'ads';
    if (/result|case study|proof|review|testimonial|client/.test(t)) return 'results';
    if (/book|call|meeting|schedule|calendar|appointment/.test(t)) return '__book';
    if (/whatsapp|whats app|message|chat|text/.test(t)) return '__whatsapp';
    return 'fallback';
  }

  /* ── State ──────────────────────────────────────────────── */
  var isOpen     = false;
  var hasOpened  = false;
  var topic      = null; // tracks last service topic for context-sensitive chips

  /* ── DOM helpers ────────────────────────────────────────── */
  function ge(id) { return document.getElementById(id); }

  /* ── Build HTML ─────────────────────────────────────────── */
  function buildWidget() {
    var el = document.createElement('div');
    el.className = 'dgd-chat';
    el.id = 'dgd-chat';
    el.innerHTML =
      '<div class="dgd-chat__panel" id="dgd-chat-panel" aria-hidden="true">' +
        '<div class="dgd-chat__head">' +
          '<div class="dgd-chat__head-l">' +
            '<div class="dgd-chat__ava">👩</div>' +
            '<div>' +
              '<div class="dgd-chat__aname">Katie — DGD Assistant</div>' +
              '<div class="dgd-chat__online"><span class="dgd-chat__dot"></span>Online now</div>' +
            '</div>' +
          '</div>' +
          '<button class="dgd-chat__x" id="dgd-chat-x" aria-label="Close">' +
            '<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>' +
          '</button>' +
        '</div>' +
        '<div class="dgd-chat__msgs" id="dgd-chat-msgs"></div>' +
        '<div class="dgd-chat__foot">' +
          '<div class="dgd-chat__irow">' +
            '<input class="dgd-chat__inp" id="dgd-chat-inp" type="text" placeholder="Type a question…" autocomplete="off" maxlength="200"/>' +
            '<button class="dgd-chat__send" id="dgd-chat-send" aria-label="Send">' +
              '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<button class="dgd-chat__btn" id="dgd-chat-btn" aria-label="Chat with us">' +
        '<span class="dgd-ic-chat" aria-hidden="true">👩</span>' +
        '<svg class="dgd-ic-x" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>' +
        '<span class="dgd-chat__badge" id="dgd-chat-badge">1</span>' +
      '</button>';
    document.body.appendChild(el);
  }

  /* ── Message rendering ──────────────────────────────────── */
  function addMsg(text, isUser) {
    var msgs = ge('dgd-chat-msgs');
    var wrap = document.createElement('div');
    wrap.className = 'dgd-chat__mwrap' + (isUser ? ' dgd-chat__mwrap--u' : '');
    var lines = text.split('\n').map(function(l) {
      return '<div class="dgd-l">' + l + '</div>';
    }).join('');
    wrap.innerHTML = '<div class="dgd-chat__m' + (isUser ? ' dgd-chat__m--u' : ' dgd-chat__m--b') + '">' + lines + '</div>';
    msgs.appendChild(wrap);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping() {
    var msgs = ge('dgd-chat-msgs');
    var t = document.createElement('div');
    t.className = 'dgd-chat__mwrap';
    t.id = 'dgd-typing';
    t.innerHTML = '<div class="dgd-chat__m dgd-chat__m--b dgd-chat__typing"><span></span><span></span><span></span></div>';
    msgs.appendChild(t);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function hideTyping() {
    var t = ge('dgd-typing');
    if (t) t.remove();
  }

  function addChips(chips) {
    var msgs = ge('dgd-chat-msgs');
    var row = document.createElement('div');
    row.className = 'dgd-chat__chips';
    row.id = 'dgd-chips';
    chips.forEach(function(c) {
      var btn = document.createElement('button');
      btn.className = 'dgd-chat__chip';
      btn.textContent = c;
      btn.addEventListener('click', function() { onChip(c); });
      row.appendChild(btn);
    });
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function clearChips() {
    var c = ge('dgd-chips');
    if (c) c.remove();
  }

  /* ── Bot reply ──────────────────────────────────────────── */
  function botReply(key, delay) {
    delay = delay || 750;
    clearChips();
    showTyping();

    setTimeout(function() {
      hideTyping();

      if (key === '__book') {
        addMsg('Taking you to our contact page! 📞', false);
        setTimeout(function() { window.location.href = 'contact.html'; }, 400);
        return;
      }
      if (key === '__whatsapp') {
        addMsg('Opening WhatsApp for you! 💬', false);
        setTimeout(function() { window.open(WHATSAPP, '_blank', 'noopener'); }, 400);
        return;
      }
      if (key === '__results') {
        addMsg('Taking you to our results page now! 📊', false);
        setTimeout(function() { window.location.href = 'results.html'; }, 700);
        return;
      }
      if (key === '__webdesign_ex') {
        addMsg('Taking you to our web design page! 🖥️', false);
        setTimeout(function() { window.location.href = 'web-design.html'; }, 700);
        return;
      }

      var flow = FLOW[key] || FLOW.fallback;
      addMsg(flow.text, false);
      setTimeout(function() { addChips(flow.chips); }, 150);
    }, delay);
  }

  /* ── Chip click handler ─────────────────────────────────── */
  function onChip(chip) {
    addMsg(chip, true);
    clearChips();
    var c = chip.toLowerCase().replace(/[📱🖥️📣💰📊📞💬←👀✅📈]/g, '').trim();

    if (c.includes('social media') || c.includes('social')) {
      topic = 'social'; botReply('social');
    } else if (c.includes('web design') || c.includes('web')) {
      topic = 'webdesign'; botReply('webdesign');
    } else if (c.includes('google') || c.includes('ads')) {
      topic = 'ads'; botReply('ads');
    } else if (c.includes('how does it work')) {
      botReply('ads_how');
    } else if (c.includes("what's included")) {
      botReply(topic === 'webdesign' ? 'webdesign_included' : 'social_included');
    } else if (c.includes('pricing') || c.includes('price')) {
      botReply('pricing');
    } else if (c.includes('see all results') || c.includes('our results')) {
      botReply('__results');
    } else if (c.includes('client results') || c.includes('see results') || c.includes('results')) {
      botReply('results');
    } else if (c.includes('see examples')) {
      botReply('__webdesign_ex');
    } else if (c.includes('book a call') || c.includes('book')) {
      botReply('__book');
    } else if (c.includes('whatsapp') || c.includes('whats app')) {
      botReply('__whatsapp');
    } else if (c.includes('main menu') || c.includes('menu')) {
      botReply('welcome');
    } else {
      botReply('fallback');
    }
  }

  /* ── Text input handler ─────────────────────────────────── */
  function onSend() {
    var inp = ge('dgd-chat-inp');
    var text = (inp.value || '').trim();
    if (!text) return;
    addMsg(text, true);
    inp.value = '';
    clearChips();
    botReply(route(text));
  }

  /* ── Open / Close ───────────────────────────────────────── */
  function openChat() {
    isOpen    = true;
    hasOpened = true;
    var panel = ge('dgd-chat-panel');
    var badge = ge('dgd-chat-badge');
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    ge('dgd-chat-btn').classList.add('open');
    if (badge) badge.style.display = 'none';
    ge('dgd-chat-btn').classList.remove('dgd-pulse');
    if (!ge('dgd-chat-msgs').children.length) {
      botReply('welcome', 500);
    }
    setTimeout(function() {
      var inp = ge('dgd-chat-inp');
      if (inp) inp.focus();
    }, 350);
  }

  function closeChat() {
    isOpen = false;
    var panel = ge('dgd-chat-panel');
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    ge('dgd-chat-btn').classList.remove('open');
  }

  /* ── Init ───────────────────────────────────────────────── */
  function init() {
    buildWidget();

    ge('dgd-chat-btn').addEventListener('click', function() {
      if (isOpen) closeChat(); else openChat();
    });
    ge('dgd-chat-x').addEventListener('click', closeChat);
    ge('dgd-chat-send').addEventListener('click', onSend);
    ge('dgd-chat-inp').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') onSend();
    });

    // Show notification badge after 3s
    setTimeout(function() {
      if (hasOpened) return;
      var badge = ge('dgd-chat-badge');
      if (badge) badge.style.display = 'flex';
      ge('dgd-chat-btn').classList.add('dgd-pulse');
    }, 3000);

    // Auto-open once per session, 8s after first visit
    if (!sessionStorage.getItem('dgd_chat_seen')) {
      setTimeout(function() {
        if (!hasOpened) {
          openChat();
          sessionStorage.setItem('dgd_chat_seen', '1');
        }
      }, 8000);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
