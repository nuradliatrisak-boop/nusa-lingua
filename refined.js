/* NUSA LINGUA V8: local media, display preferences, bilingual key journeys. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const EN={
 'Beranda':'Home','Peta Budaya':'Cultural Map','Lingua AI':'Lingua AI','Nusa Guide':'Nusa Guide','Tersimpan':'Saved','Rancang Perjalanan':'Plan Your Trip',
 'DARI JANTUNG SUMATERA UTARA':'FROM THE HEART OF NORTH SUMATRA','JELAJAH BUDAYA BATAK TOBA':'BATAK TOBA CULTURAL JOURNEY',
 'Mulai jelajah Samosir':'Explore Samosir','▶ Lihat cerita budaya':'▶ Cultural Stories',
 'Jelajahi Samosir.':'Explore Samosir.','Temukan makna di setiap cerita.':'Discover the stories behind every place.',
 'Dari peta budaya hingga cerita yang dituturkan, NUSA LINGUA membantumu memahami tempat, bahasa, dan warisan Batak Toba dalam satu perjalanan.':'From cultural maps to narrated stories, NUSA LINGUA helps you discover Batak Toba places, language, and heritage in one journey.',
 'Cerita Budaya':'Cultural Stories','PILIH PENGALAMANMU':'CHOOSE YOUR EXPERIENCE','Lihat semua lokasi':'View all locations',
 'FALSAFAH PENGALAMAN':'OUR PHILOSOPHY','PERSONALISASI PERJALANAN':'PERSONALIZE YOUR TRIP','REKOMENDASI PERSONAL':'PERSONAL RECOMMENDATIONS',
 'Buat itinerary saya':'Create my itinerary','1 Hari':'1 Day','2 Hari':'2 Days','3 Hari':'3 Days','Sejarah':'History','Tenun Ulos':'Ulos Weaving','Arsitektur':'Architecture','Seni & Tradisi':'Arts & Traditions',
 'BERAPA LAMA DI SAMOSIR?':'HOW LONG IN SAMOSIR?','GAYA PERJALANAN':'TRAVEL PACE','Bahasa aplikasi':'Site language',
 'Cerita perjalananmu dimulai di sini.':'Your journey starts here.','Pilih durasi dan minat, lalu buat rute budaya yang sesuai.':'Choose your duration and interests to generate a cultural route.'
};
const original=new WeakMap();
function translate(lang){
 document.documentElement.lang=lang;
 const root=document.querySelector('body');
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){return node.parentElement?.closest('script,style,textarea,select,option')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT;}});
 const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 for(const node of nodes){
  if(!original.has(node))original.set(node,node.textContent);
  const source=original.get(node);
  if(lang==='id'){node.textContent=source;continue;}
  let val=source;
  for(const [a,b] of Object.entries(EN).sort((x,y)=>y[0].length-x[0].length))val=val.replaceAll(a,b);
  node.textContent=val;
 }
 $('siteLang').value=lang;
 localStorage.setItem('nusaLanguage',lang);
}
function init(){
 const toggle=$('themeSwitch'),lang=$('siteLang');
 const stored=localStorage.getItem('nusaTheme')||'day';
 function theme(next){document.body.classList.toggle('night',next==='night');localStorage.setItem('nusaTheme',next);toggle.textContent=next==='night'?'☀':'☾';toggle.setAttribute('aria-label',next==='night'?'Aktifkan mode siang':'Aktifkan mode malam');}
 if(toggle){theme(stored);toggle.addEventListener('click',()=>theme(document.body.classList.contains('night')?'day':'night'));}
 if(lang){translate(localStorage.getItem('nusaLanguage')||'id');lang.addEventListener('change',e=>translate(e.target.value));}
 // Museum is contextual learning within NUSA TWIN, not an additional proposal feature.
 const museumButton=document.querySelector('.header nav [data-page="immersive"]');if(museumButton)museumButton.remove();
 const poiHeading=document.querySelector('#peta .page-heading');
 if(poiHeading){const t=document.createElement('button');t.className='btn primary';t.textContent='▶ Jelajah cerita budaya & video';t.style.marginTop='16px';t.setAttribute('data-page','immersive');poiHeading.appendChild(t);}
 const museumTop=document.querySelector('#immersive .imm-hero');if(museumTop){const parent=museumTop.querySelector('h1');if(parent)parent.innerHTML='Cerita budaya dari NUSA TWIN.<br><em>Jelajahi melalui dokumenter.</em>';}
 // Navigate to museum from map, while keeping three-product information architecture.
 document.addEventListener('click',e=>{if(e.target.closest('[data-page="immersive"]')){const vid=$('heroVideo');if(vid)vid.pause();}},true);
 const cover=$('heroVideo');if(cover){cover.addEventListener('waiting',()=>document.querySelector('.hero')?.classList.remove('real-video-on'));}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();