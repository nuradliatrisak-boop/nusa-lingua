/* V12: no homepage video; load optional HD aerial photo only when network permits. */
(()=>{
 function init(){
   const hero=document.querySelector('.hero');
   const video=document.getElementById('heroVideo');
   if(video){video.pause();video.removeAttribute('src');video.load();}
   if(!hero)return;
   hero.classList.remove('real-video-on','has-video');
   const image=new Image();
   const url='https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cc/Danau_Toba_dari_Samosir.jpg/1920px-Danau_Toba_dari_Samosir.jpg';
   image.onload=()=>{if(image.naturalWidth>=1500)hero.classList.add('hero-hd-ready')};
   image.onerror=()=>{}; // local landscape is already visible instantly.
   image.src=url;
 }
 if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);else init();
})();
