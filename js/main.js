document.addEventListener('DOMContentLoaded',()=>{
  initSlider();
  initNav();
  initAccordion();
  initScrollTop();
  initFadeIn();
  setActiveNav();
});

function initSlider(){
  const slides=document.querySelectorAll('.owl-slide');
  const dots=document.querySelectorAll('.slider-dot');
  if(!slides.length)return;
  let cur=0,timer;
  function goTo(n){
    slides[cur].classList.remove('active');
    dots[cur]?.classList.remove('active');
    cur=(n+slides.length)%slides.length;
    slides[cur].classList.add('active');
    dots[cur]?.classList.add('active');
    reset();
  }
  function reset(){clearInterval(timer);timer=setInterval(()=>goTo(cur+1),6000)}
  dots.forEach((d,i)=>d.addEventListener('click',()=>goTo(i)));
  document.getElementById('sliderPrev')?.addEventListener('click',()=>goTo(cur-1));
  document.getElementById('sliderNext')?.addEventListener('click',()=>goTo(cur+1));
  let tx=0;
  const el=document.querySelector('.slider-area');
  el?.addEventListener('touchstart',e=>{tx=e.touches[0].clientX},{passive:true});
  el?.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>40)dx<0?goTo(cur+1):goTo(cur-1)},{passive:true});
  reset();
}

function initNav(){
  const t=document.getElementById('navToggle');
  const m=document.querySelector('.navigation .menus');
  if(t&&m)t.addEventListener('click',()=>m.classList.toggle('open'));
}

function initAccordion(){
  document.querySelectorAll('.accordion-header').forEach(h=>{
    h.addEventListener('click',()=>{
      const item=h.closest('.accordion-item');
      const open=item.classList.contains('open');
      document.querySelectorAll('.accordion-item.open').forEach(i=>i.classList.remove('open'));
      if(!open)item.classList.add('open');
    });
  });
  document.querySelector('.accordion-item')?.classList.add('open');
}

function initScrollTop(){
  const btn=document.getElementById('scrollTop');
  if(!btn)return;
  window.addEventListener('scroll',()=>btn.classList.toggle('show',window.scrollY>400));
  btn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
}

function initFadeIn(){
  const els=document.querySelectorAll('.fade-in');
  if(!els.length)return;
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}});
  },{threshold:0.1});
  els.forEach(el=>obs.observe(el));
}

function setActiveNav(){
  const page=location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.navigation .menus a').forEach(a=>{
    if(a.getAttribute('href')===page)a.closest('li')?.classList.add('active');
  });
}

window.submitForm=function(e){
  e.preventDefault();
  const btn=document.getElementById('formSubmit');
  if(!btn)return;
  const orig=btn.innerHTML;
  btn.innerHTML='&#10003; Gönderildi!';
  btn.style.background='#27bc80';
  setTimeout(()=>{btn.innerHTML=orig;btn.style.background='';e.target.reset()},3000);
};
