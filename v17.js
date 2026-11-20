/* V17 — exact-destination Wikimedia photographs with local fallbacks.
   HD images are not bundled; originals require download/attribution and user network. */
(()=>{
const refs=[
 {id:'siallagan',file:'Rumah_Bolon.jpg',fallback:'assets/editorial/huta-tradisional.webp'},
 {id:'tomok',file:'Old_Tomb_of_King_Sidabutar%2C_Samosir_1.jpg',fallback:'assets/editorial/danau-toba.webp'},
 {id:'simanindo',file:'Rumah_Bolon_Batak_Toba_di_Museum_Huta_Bolon_Simanindo.jpg',fallback:'assets/editorial/arsitektur-batak.webp'}
];
function init(){
 if(typeof POIS==='undefined')return;
 refs.forEach((entry)=>{
  const p=POIS.find(p=>p.id===entry.id);if(!p)return;
  // locally downloadable replacements take priority over remote photos
  const local='assets/destinations/'+entry.id+'.jpg';
  const remote='https://commons.wikimedia.org/wiki/Special:FilePath/'+entry.file+'?width=1400';
  const photo=new Image();photo.decoding='async';
  photo.onload=()=>{if(photo.naturalWidth<850)return;p.photo=photo.src; if(typeof renderHome==='function')renderHome();if(typeof renderMapList==='function')renderMapList()};
  photo.onerror=()=>{if(photo.src===new URL(local,location.href).href && navigator.onLine!==false){photo.src=remote}};
  photo.src=local;
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
