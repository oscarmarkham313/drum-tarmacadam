'use strict';
window.addEventListener('load',()=>{
  const l=document.getElementById('page-loader');
  if(l) setTimeout(()=>l.classList.add('hidden'),500);
});
(function initNav(){
  const nav=document.querySelector('.nav');
  if(!nav)return;
  const upd=()=>nav.classList.toggle('scrolled',window.scrollY>30);
  window.addEventListener('scroll',upd,{passive:true});upd();
  const p=location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav__link').forEach(l=>{if(l.getAttribute('href')===p)l.classList.add('active');});
})();
(function initBurger(){
  const b=document.querySelector('.nav__burger'),d=document.querySelector('.nav__drawer');
  if(!b||!d)return;
  b.addEventListener('click',()=>{
    const o=b.classList.toggle('open');
    d.classList.toggle('open',o);
    document.body.style.overflow=o?'hidden':'';
  });
  d.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    b.classList.remove('open');d.classList.remove('open');document.body.style.overflow='';
  }));
})();
(function initReveal(){
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}
  }),{threshold:.1,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
})();
(function initCounters(){
  function ease(t){return 1-Math.pow(1-t,4);}
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting)return;
    const el=e.target,target=parseFloat(el.dataset.target),suffix=el.dataset.suffix||'',dur=2000,s=performance.now();
    function run(n){const p=Math.min((n-s)/dur,1),v=target*ease(p);el.textContent=(Number.isInteger(target)?Math.round(v).toLocaleString():v.toFixed(1))+suffix;if(p<1)requestAnimationFrame(run);}
    requestAnimationFrame(run);io.unobserve(el);
  }),{threshold:.3});
  document.querySelectorAll('[data-counter]').forEach(el=>io.observe(el));
})();
(function initFAQ(){
  document.querySelectorAll('.faq-item__q').forEach(q=>q.addEventListener('click',()=>{
    const it=q.closest('.faq-item'),open=it.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(o=>o.classList.remove('open'));
    if(!open)it.classList.add('open');
  }));
})();
(function initTestiToggle(){
  const btn=document.getElementById('testi-toggle'),col=document.getElementById('testi-col');
  if(!btn||!col)return;
  btn.addEventListener('click',()=>{
    const o=col.classList.toggle('open');
    btn.classList.toggle('open',o);
    btn.querySelector('.tbtn-label').textContent=o?'Hide Reviews':'See All 52 Reviews';
  });
})();
(function initForm(){
  const f=document.getElementById('contact-form');
  if(!f)return;
  f.addEventListener('submit',async e=>{
    e.preventDefault();
    const data=new FormData(f);
    const res=await fetch(f.action,{method:'POST',body:data,headers:{'Accept':'application/json'}});
    if(res.ok){
      const ff=f.querySelector('.form-fields'),s=document.getElementById('form-success');
      if(ff)ff.style.display='none';
      if(s)s.style.display='block';
    }
  });
})();
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
  const t=document.getElementById(a.getAttribute('href').slice(1));
  if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'});}
}));
(function initParallax(){
  const hc=document.querySelector('.hero__content');
  if(!hc)return;
  window.addEventListener('scroll',()=>{
    const y=window.scrollY;
    if(y<window.innerHeight){hc.style.transform='translateY('+y*.18+'px)';hc.style.opacity=1-(y/(window.innerHeight*.9));}
  },{passive:true});
})();
(function initHeroAnim(){
  document.querySelectorAll('.hero__anim').forEach((el,i)=>{
    el.style.opacity='0';el.style.transform='translateY(28px)';
    el.style.transition='opacity .8s cubic-bezier(.4,0,.2,1) '+(0.08+i*0.13)+'s,transform .8s cubic-bezier(.4,0,.2,1) '+(0.08+i*0.13)+'s';
    setTimeout(()=>{el.style.opacity='1';el.style.transform='none';},40);
  });
})();


(function initChat(){
  const toggle=document.getElementById('chat-toggle');
  const win=document.getElementById('chat-window');
  const msgs=document.getElementById('chat-msgs');
  const input=document.getElementById('chat-input');
  const send=document.getElementById('chat-send');
  const chips=document.getElementById('chat-chips');
  const nudge=document.getElementById('chat-nudge');
  if(!toggle||!win)return;

  const KB=[
    {k:['price','cost','how much','pricing','package','packages','rate','rates','charge'],
     r:`Our packages start from <strong>€497/month</strong>:<br>• Starter – €497/mo<br>• Growth – €997/mo (most popular)<br>• Dominator – €1,997/mo<br><br>All rolling monthly, no lock-in. Want a custom quote?`,
     chips:['Book free call','Tell me more','Contact us']},
    {k:['web','website','site','design','build','develop'],
     r:`We build fully custom websites — no templates. Every site is mobile-first, lightning-fast, and SEO-optimised from day one.<br><br>Most websites are delivered within 2–3 weeks. Want to discuss your project?`,
     chips:['Get a quote','See pricing','Book free call']},
    {k:['social','instagram','facebook','tiktok','linkedin','post','content'],
     r:`We offer full social media management — strategy, content creation, daily posting, community engagement, and monthly reporting across all platforms.<br><br>Most clients see <strong>300%+ reach growth</strong> within 90 days.`,
     chips:['See pricing','Book free call','Contact us']},
    {k:['ads','google','meta','ppc','paid','advertising','leads'],
     r:`We run data-driven Google Ads and Meta Ads campaigns with full ROI tracking. Average ROAS for our clients is <strong>4.2x</strong>.<br><br>No wasted budget — every euro is tracked and optimised.`,
     chips:['See pricing','Book free call','Contact us']},
    {k:['seo','rank','google rank','search','organic'],
     r:`Our local SEO service gets Irish businesses ranking on Google for their key search terms — including Google Maps / Business Profile optimisation.<br><br>Results typically show within 60–90 days.`,
     chips:['See pricing','Book free call']},
    {k:['result','how long','when','timeline','fast','quick'],
     r:`Most clients see measurable results within the first <strong>30 days</strong>. Paid ads can generate leads in the first week. SEO and organic social compound over 60–90 days.`,
     chips:['Book free call','See pricing']},
    {k:['contract','lock','cancel','commitment','tie'],
     r:`No long-term contracts. We work on rolling monthly agreements — we're confident in our results, so we don't need to lock you in. Cancel anytime with 30 days notice.`,
     chips:['See pricing','Book free call']},
    {k:['contact','call','speak','talk','reach','phone','whatsapp','email'],
     r:`You can reach us via:<br>📱 WhatsApp: <a href="https://wa.me/353871257533" target="_blank">+353 87 125 7533</a><br>📧 Email: <a href="mailto:dublingrowthdigital@gmail.com">dublingrowthdigital@gmail.com</a><br><br>Or book a free strategy call — we usually reply within minutes!`,
     chips:['Book free call','Contact page']},
    {k:['book','strategy','free','consultation','meeting','appointment'],
     r:`Book your free 30-minute strategy call on WhatsApp — just tap below. No pressure, no obligation, just honest advice. 👇`,
     chips:['WhatsApp now','Contact page']},
    {k:['who','about','team','based','ireland','dublin','location'],
     r:`We're a Dublin-based digital marketing agency working with Irish businesses nationwide. From Cork to Galway, we help businesses get more leads online.`,
     chips:['Our services','Book free call','Contact us']},
    {k:['hello','hi','hey','hiya','howya','good morning','good afternoon'],
     r:`Hey there! 👋 I'm the Dublin Growth Digital assistant. I can answer questions about our services, pricing, and how we can help grow your business online.<br><br>What would you like to know?`,
     chips:['Services & pricing','How fast are results?','Book free call']},
  ];

  const CHIPS_MAP={
    'Book free call':()=>window.open('https://wa.me/353871257533','_blank'),
    'WhatsApp now':()=>window.open('https://wa.me/353871257533','_blank'),
    'Contact us':()=>location.href='contact.html',
    'Contact page':()=>location.href='contact.html',
    'See pricing':()=>location.href='services.html#pricing',
    'Our services':()=>location.href='services.html',
    'Tell me more':()=>location.href='services.html',
  };

  let open=false;

  function showMsg(text,type){
    const d=document.createElement('div');
    d.className='chat-msg chat-msg--'+type;
    d.innerHTML=text;
    msgs.appendChild(d);
    msgs.scrollTop=msgs.scrollHeight;
  }

  function showTyping(){
    const d=document.createElement('div');
    d.className='chat-typing';d.id='chat-typing';
    d.innerHTML='<span></span><span></span><span></span>';
    msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;return d;
  }

  function setChips(list){
    chips.innerHTML='';
    (list||[]).forEach(label=>{
      const b=document.createElement('button');
      b.className='chat-chip';b.textContent=label;
      b.addEventListener('click',()=>{
        if(CHIPS_MAP[label])return CHIPS_MAP[label]();
        processInput(label);
      });
      chips.appendChild(b);
    });
  }

  function processInput(text){
    showMsg(text,'user');setChips([]);
    const t=text.toLowerCase();
    const typing=showTyping();
    setTimeout(()=>{
      typing.remove();
      let matched=null;
      for(const entry of KB){
        if(entry.k.some(kw=>t.includes(kw))){matched=entry;break;}
      }
      if(matched){
        showMsg(matched.r,'bot');
        setChips(matched.chips||[]);
      } else {
        showMsg(`Great question! For the most accurate answer, our team would love to help directly.<br><br>📱 <a href="https://wa.me/353871257533" target="_blank">WhatsApp us</a> for a quick reply, or <a href="contact.html">send a message</a>.`,'bot');
        setChips(['WhatsApp now','Contact us','Book free call']);
      }
    },700+Math.random()*400);
  }

  toggle.addEventListener('click',()=>{
    open=!open;
    toggle.classList.toggle('open',open);
    win.classList.toggle('open',open);
    if(nudge)nudge.style.display='none';
    if(open&&msgs.children.length===0){
      setTimeout(()=>{
        showMsg('Hey! 👋 I\'m the DGD assistant. Ask me anything about our services, pricing, or how we can help grow your business online!','bot');
        setChips(['Services & pricing','How fast are results?','Book free call','Contact us']);
      },300);
    }
  });

  send.addEventListener('click',()=>{const v=input.value.trim();if(v){input.value='';processInput(v);}});
  input.addEventListener('keydown',e=>{if(e.key==='Enter'){const v=input.value.trim();if(v){input.value='';processInput(v);}}});

  setTimeout(()=>{if(nudge&&!open)nudge.style.opacity='1';},3000);
})();

(function initLeadPopup(){
  const popup=document.getElementById('lead-popup');
  const closeBtn=document.getElementById('lead-close');
  const form=document.getElementById('lead-form');
  const success=document.getElementById('lead-success');
  if(!popup)return;
  if(sessionStorage.getItem('dgd_lead'))return;
  setTimeout(()=>popup.classList.add('show'),7000);
  closeBtn.addEventListener('click',()=>{
    popup.classList.remove('show');
    sessionStorage.setItem('dgd_lead','1');
  });
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const data=new FormData(form);
    const res=await fetch(form.action,{method:'POST',body:data,headers:{'Accept':'application/json'}});
    if(res.ok){
      form.style.display='none';
      success.style.display='block';
      sessionStorage.setItem('dgd_lead','1');
      setTimeout(()=>popup.classList.remove('show'),3000);
    }
  });
})();

(function initVisitorTracking(){
  const ENDPOINT='https://formspree.io/f/meendppv';
  let pinged=false;

  function sendPing(type){
    if(pinged)return;
    pinged=true;
    fetch('https://ipapi.co/json/')
      .then(r=>r.json())
      .then(geo=>{
        const payload={
          _subject:'[DGD] Visitor: '+type,
          type,
          page: location.href,
          referrer: document.referrer||'Direct',
          device: /Mobi|Android/i.test(navigator.userAgent)?'Mobile':'Desktop',
          browser: navigator.userAgent.split(') ')[0].split('(')[1]||'Unknown',
          city: geo.city||'',
          country: geo.country_name||'',
          isp: geo.org||'',
          time: new Date().toLocaleString('en-IE',{timeZone:'Europe/Dublin'})
        };
        fetch(ENDPOINT,{method:'POST',body:JSON.stringify(payload),headers:{'Content-Type':'application/json','Accept':'application/json'}});
      }).catch(()=>{});
  }

  // Fire after 45s on any page (engaged visitor)
  setTimeout(()=>sendPing('45s on '+location.pathname.split('/').pop()||'home'),45000);

  // Fire immediately on contact page
  if(location.pathname.includes('contact')){
    setTimeout(()=>sendPing('Visited contact page'),2000);
  }
})();
