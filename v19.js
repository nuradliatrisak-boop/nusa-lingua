/* V19 — Dedicated map sidebar photographs, without changing the homepage cards.
   Prefer locally available curated photography, then upgrade to location-specific
   Wikimedia photographs only when network image fully loads. */
(()=>{
 const gallery={
  siallagan:{local:'assets/editorial/huta-tradisional.webp',file:'Huta_Siallagan%2C_a_traditional_Batak_village_located_around_Lake_Toba.jpg'},
  tomok:{local:'assets/editorial/danau-toba.webp',file:'Old_Tomb_of_King_Sidabutar%2C_Samosir_1.jpg'},
  simanindo:{local:'assets/editorial/arsitektur-batak.webp',file:'Rumah_adat_bolon_di_Museum_Huta_Bolon_Simanindo.jpg'},
  ulos:{local:'assets/editorial/penenun-ulos.webp',file:'Tenun_Ulos.jpg'}
 };
 function boot(){
   if(typeof POIS==='undefined'||typeof renderMapList!=='function')return;
   POIS.forEach(p=>{
     const c=gallery[p.id];if(!c)return;
     p.mapPhoto=c.local;
     const local='assets/map-photos/'+p.id+'.webp';
     const test=new Image();
     test.onload=()=>{p.mapPhoto=local;renderMapList()};
     test.onerror=()=>{
       if(navigator.onLine===false)return;
       const remote='https://commons.wikimedia.org/wiki/Special:FilePath/'+c.file+'?width=1000';
       const hd=new Image();hd.decoding='async';
       hd.onload=()=>{if(hd.naturalWidth>=600){p.mapPhoto=remote;renderMapList()}};
       hd.onerror=()=>{};
       hd.src=remote;
     };
     test.src=local;
   });
   renderMapList();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
