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
  f.addEventListener('submit',e=>{
    e.preventDefault();
    const ff=f.querySelector('.form-fields'),s=document.getElementById('form-success');
    if(ff)ff.style.display='none';
    if(s)s.style.display='block';
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
