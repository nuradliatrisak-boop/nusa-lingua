/* NUSA LINGUA V15 — HD photographs: remote progressive enhancement, local fallbacks */
(()=>{
 const cards = [
  {selector:'.feature-grid .pv-map', url:'https://commons.wikimedia.org/wiki/Special:FilePath/Danau_Toba_dari_Samosir.jpg?width=1600'},
  {selector:'.feature-grid .pv-lang', url:'https://commons.wikimedia.org/wiki/Special:FilePath/Jajaran_Rumah_Bolon_di_Huta_Siallagan.jpg?width=1600'},
  {selector:'.feature-grid .pv-guide', url:'https://commons.wikimedia.org/wiki/Special:FilePath/Tari_tradisi_Batak_di_Huta_Bolon%2C_Simanindo%2C_Samosir%2C_Sumatra_Utara.jpg?width=1600'}
 ];
 function enhance(){
   const canLoad = navigator.onLine !== false;
   if(!canLoad) return;
   cards.forEach(({selector,url})=>{
     const card=document.querySelector(selector);
     if(!card)return;
     const image=new Image();
     image.decoding='async';
     image.onload=()=>{if(image.naturalWidth>=900){card.style.setProperty('background-image',`url("${url}")`,'important');}};
     image.onerror=()=>{}; // reliable local photography remains visible
     image.src=url;
   });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhance,{once:true});
 else enhance();
})();
