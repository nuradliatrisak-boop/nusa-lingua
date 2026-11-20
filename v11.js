/* NUSA LINGUA V11: controls without intrusive native dropdown; retains existing translation and theme. */
(()=>{'use strict';function init(){
 const s=document.getElementById('siteLang'), buttons=[...document.querySelectorAll('[data-ui-lang]')];
 if(s&&buttons.length){const update=()=>{buttons.forEach(b=>{const on=b.dataset.uiLang===s.value;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});};buttons.forEach(b=>b.addEventListener('click',()=>{if(s.value!==b.dataset.uiLang){s.value=b.dataset.uiLang;s.dispatchEvent(new Event('change',{bubbles:true}));}update();}));s.addEventListener('change',update);update();}
 // Avoid wrong hero indication if video unavailable or desktop video intentionally disabled.
 const hero=document.querySelector('.hero');if(hero&&matchMedia('(min-width:851px)').matches)hero.classList.remove('real-video-on');
 // The user-supplied local museum videos remain available and are only loaded in that section.
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();})();
