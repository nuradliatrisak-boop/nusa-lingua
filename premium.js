// Premium UI add-on: optional user-supplied hero video and accessible mobile menu.
(()=>{
  function init(){
    const video=document.getElementById('heroVideo');
    const hero=document.querySelector('.hero');
    if(video&&hero){
      video.addEventListener('loadeddata',()=>{hero.classList.add('has-video');video.play().catch(()=>{hero.classList.remove('has-video')})});
      video.addEventListener('error',()=>hero.classList.remove('has-video'));
    }
    const nav=document.querySelector('.header nav'),btn=document.getElementById('menuBtn'),back=document.getElementById('navBackdrop');
    if(!nav||!btn||!back)return;
    const sync=()=>{const isOpen=nav.classList.contains('open');back.classList.toggle('open',isOpen);back.setAttribute('aria-hidden',String(!isOpen));btn.setAttribute('aria-label',isOpen?'Tutup menu':'Buka menu')};
    btn.addEventListener('click',()=>setTimeout(sync,0));
    back.addEventListener('click',()=>{nav.classList.remove('open');btn.setAttribute('aria-expanded','false');sync()});
    nav.addEventListener('click',e=>{if(e.target.closest('[data-page]'))setTimeout(sync,0)});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('open');btn.setAttribute('aria-expanded','false');sync()}});
    document.addEventListener('click',e=>{if(e.target.closest('[data-page]')&&!e.target.closest('nav'))setTimeout(sync,0)});
    if(matchMedia('(min-width:801px)').matches){nav.classList.remove('open');btn.setAttribute('aria-expanded','false');sync()}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
