/* NUSA LINGUA • non-invasive editorial polish, does not replace main application logic. */
(()=>{'use strict';
function ready(){
 const $=id=>document.getElementById(id);
 // Keep portrait video smooth on phones; show a crisp, local landscape photo on desktop beneath subtle movement.
 const hero=$('heroVideo'), cover=document.querySelector('.hero');
 if(hero){hero.playsInline=true;hero.muted=true;hero.playbackRate=1.08;
   hero.addEventListener('playing',()=>cover?.classList.add('real-video-on'));
   hero.addEventListener('error',()=>cover?.classList.remove('real-video-on'));
 }
 // Update accessible select label, keeping the native keyboard-friendly selector functional.
 const language=$('siteLang');if(language){language.title='Ganti bahasa / Switch language';language.setAttribute('aria-label','Pilih bahasa / Choose language');}
 // Use an unobtrusive, real arrow, avoiding ambiguous decorative diamonds.
 document.querySelectorAll('.feature-card .visual-symbol').forEach(el=>{el.textContent='↗';el.setAttribute('aria-hidden','true')});
 // Avoid modal-scoped scroll confusion, and focus on close button when it opens.
 const dialog=$('modal');if(dialog){const obs=new MutationObserver(()=>{if(dialog.classList.contains('show'))$('closeModal')?.focus({preventScroll:true})});obs.observe(dialog,{attributes:true,attributeFilter:['class']});}
 // Smooth playback does not alter narrated audio; the browser still controls TTS.
 const video=$('immMotionVideo');if(video){video.setAttribute('playsinline',''); video.addEventListener('playing',()=>{if($('immRenderStatus'))$('immRenderStatus').textContent='SEDANG DIPUTAR'});}
 // Fix stale browser media display on switching pages.
 document.addEventListener('click',e=>{const btn=e.target.closest('[data-page]');if(!btn)return;const page=btn.dataset.page;if(page!=='immersive')try{speechSynthesis.cancel()}catch{};}, {passive:true});
 // Add consistent fallback if external map library has not loaded, without blocking other modules.
 const mapButton=document.querySelector('#peta .page-heading [data-page="immersive"]');if(mapButton)mapButton.textContent='▶ Jelajahi kisah & dokumenter';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready);else ready();
})();
