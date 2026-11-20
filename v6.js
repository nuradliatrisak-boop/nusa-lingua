/* NUSA LINGUA V7: four REAL MOVING DOCUMENTARY clips. Offsite media, licensed and credited.
 * House chapter reuses location footage of Siallagan, not an actual architectural walkthrough.
 * Weaving clip is real general weaving, NOT evidence of specific ulos production.
 */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const S=[
 {name:'Danau Toba',video:'assets/documentary/toba.mp4',poster:'assets/photos/toba.webp',credit:'assets/documentary/toba.mp4',note:'Cuplikan Danau Toba · berkas lokal',seek:0},
 {name:'Perkampungan Batak',video:'assets/documentary/village.mp4',poster:'assets/photos/village.webp',credit:'assets/documentary/village.mp4',note:'Video perkampungan · berkas pengguna',seek:0},
 {name:'Rumah Bolon',video:'assets/documentary/house.mp4',poster:'assets/photos/house.webp',credit:'assets/documentary/house.mp4',note:'Video rumah tradisional · berkas pengguna',seek:0},
 {name:'Tenun Ulos',video:'assets/documentary/ulos.mp4',poster:'assets/photos/ulos.webp',credit:'assets/documentary/ulos.mp4',note:'Video tenun · berkas pengguna',seek:0}
];
// The Commons video's direct filename location can change: if it does, the user can set local files below.
const LOCAL=['toba','village','house','ulos'];let chapter=0;let timer=null;let cancelled=false;
function active(id){return !document.hidden && $(id)?.classList.contains('active')}
function addInfo(){
 const stage=$('immStage');if(!stage)return;
 const poster=document.createElement('div');poster.className='imm-real-poster';poster.id='immPoster';stage.insertBefore(poster,stage.firstChild);
 const badge=document.createElement('div');badge.id='filmIndicator';badge.className='film-indicator';badge.textContent='Menyiapkan cuplikan dokumenter';stage.appendChild(badge);
 const retry=document.createElement('button');retry.id='filmRetry';retry.className='film-retry';retry.type='button';retry.hidden=true;retry.textContent='▶ Putar Video';stage.appendChild(retry);retry.addEventListener('click',()=>load(chapter,true));
 const ext=document.createElement('a');ext.id='filmSource';ext.className='film-source';ext.textContent='Buka video sumber ↗';ext.target='_blank';ext.rel='noopener noreferrer';stage.appendChild(ext);
 const video=$('immMotionVideo'); video.addEventListener('playing',()=>{video.classList.add('video-ready');badge.hidden=true;retry.hidden=true;});
 video.addEventListener('error',()=>failed('Video tidak tersedia dari sumber saat ini.'));
 video.addEventListener('stalled',()=>{if(active('immersive'))badge.textContent='Menyiapkan video lokal…';});
 video.addEventListener('loadedmetadata',()=>{if(S[chapter].seek&&video.duration>S[chapter].seek+2)try{video.currentTime=S[chapter].seek}catch{}});
}
function failed(message){const badge=$('filmIndicator'),retry=$('filmRetry'),video=$('immMotionVideo');if(!badge||!retry)return;clearTimeout(timer);badge.hidden=false;badge.textContent=message;retry.hidden=false;video?.classList.remove('video-ready');setStatus('FOTO DOKUMENTER · VIDEO GAGAL');}
function setStatus(x){if($('immRenderStatus'))$('immRenderStatus').textContent=x;}
function load(i,force=false){
 chapter=i;
 const video=$('immMotionVideo'),stage=$('immStage'),scene=S[i];
 if(!video||!scene||!stage)return;
 clearTimeout(timer);
 video.pause();video.classList.remove('video-ready');video.removeAttribute('src');video.load();
 $('immPoster').style.backgroundImage=`url("${scene.poster}")`;
 $('filmSource').href=scene.credit;
 $('filmIndicator').hidden=false;
 $('filmIndicator').textContent='Menyiapkan dokumenter HD…';
 $('filmRetry').hidden=true;
 video.poster=scene.poster;video.muted=true;video.loop=true;video.playsInline=true;video.preload='metadata';
 const c=stage.querySelector('.imm-stage-bottom > span');if(c)c.textContent=scene.note;
 const credit=$('immCredit');if(credit){credit.href=scene.credit;credit.textContent='Kredit & lisensi ↗'}
 setStatus('VIDEO DOKUMENTER HD');
 if(!active('immersive')&&!force)return;
 const local=scene.video;
 const hd=['toba-hd','village-hd','house-hd','ulos-hd'][i];
 const alternate=`assets/documentary/${hd}.mp4`;
 const requestIndex=i;
 // HD overrides are optional. If absent, always use the included, verified local video.
 fetch(alternate,{method:'HEAD',cache:'no-store'})
  .then(r=>r.ok?alternate:local).catch(()=>local)
  .then(selected=>{
    if(requestIndex!==chapter)return;
    video.src=selected;video.load();
    const play=()=>video.play().catch(()=>{
      $('filmIndicator').hidden=false;
      $('filmIndicator').textContent='Klik Putar Video untuk memulai.';
      $('filmRetry').hidden=false;
    });
    play();
    timer=setTimeout(()=>{
      if(requestIndex===chapter&&!video.classList.contains('video-ready')){
        failed('Video belum dapat diputar. Klik untuk mencoba lagi.');
      }
    },12000);
  });
}
function startHero(){const h=$('heroVideo');if(!h)return;if(!active('beranda')){h.pause();return}if(matchMedia('(min-width: 851px)').matches){h.pause();h.removeAttribute('src');h.load();document.querySelector('.hero')?.classList.remove('real-video-on');return;}if(!h.src){h.src=S[0].video;h.preload='metadata'}h.muted=true;h.play().catch(()=>{});}
function init(){if(!$('immMotionVideo'))return;addInfo();load(0);const h=$('heroVideo');if(h){h.addEventListener('playing',()=>document.querySelector('.hero')?.classList.add('real-video-on'));h.addEventListener('error',()=>document.querySelector('.hero')?.classList.remove('real-video-on'));}
 document.addEventListener('nusa:chapter',e=>{requestAnimationFrame(()=>load(e.detail.index,true))});
 document.addEventListener('click',e=>{if(e.target.closest('[data-page]'))setTimeout(()=>{if(active('immersive'))load(chapter);else $('immMotionVideo')?.pause();startHero()},80)});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){h?.pause();$('immMotionVideo')?.pause()}else if(active('immersive'))load(chapter);else startHero()});
 startHero();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
