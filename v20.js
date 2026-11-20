/* V20: Context-verified location-specific photography and luminous glass detail design.
   Wikimedia media is requested only when modal opened, with local photo fallback. */
(()=>{
const names={
 siallagan:[
 ['Gerbang dan rumah tradisional','Suasana di Huta Siallagan.jpg'],
 ['Batu kursi persidangan','Batu Kursi Persidangan Siallagan Tampak Penuh.jpg'],
 ['Rumah Bolon tampak depan','Rumah Bolon di Huta Siallagan tampak dari depan.jpg'],
 ['Detail ukiran gorga','Ukiran secara keseluruhan dan gorga pada rumah Rumah Bolon di Huta Siallagan.jpg']
 ],
 tomok:[
 ['Makam Raja Sidabutar','Old Tomb of King Sidabutar, Samosir 1.jpg'],
 ['Area kompleks makam','Area dalam Makam Raja Sidabutar 1.jpg'],
 ['Detail peninggalan batu','Old Tomb of King Sidabutar, Samosir 14.jpg'],
 ['Warisan sejarah Tomok','Makam Raja Sidabutar.jpg']
 ],
 simanindo:[
 ['Rumah Bolon di museum','Rumah Bolon Batak Toba di Museum Huta Bolon Simanindo.jpg'],
 ['Bagian dalam museum','Bagian dalam museum Huta Bolon Simanindo.jpg'],
 ['Koleksi patung budaya','Koleksi Patung Museum Huta Bolon Simanindo 1.jpg'],
 ['Panorama tepi danau','Pemandangan danau di belakang Museum Huta Bolon Simanindo 2.jpg']
 ],
 ulos:[
 ['Penenun ulos Huta Raja','Tenun Ulos.jpg'],
 ['Proses pembuatan ulos','Kampung Ulos Huta Raja, North Sumatera, Indonesia.jpg'],
 ['Tenun Batak di Samosir','Tenun Ulos Batak Pulau Samosir.jpg'],
 ['Kegiatan budaya di Hutaraja','Kegiatan Manortor di Hari Anak Nasional di Hutaraja Lumban Suhi-Suhi Toruan.jpg']
 ]
};
const portrait={siallagan:'assets/editorial/huta-tradisional.webp',tomok:'assets/editorial/danau-toba.webp',simanindo:'assets/editorial/arsitektur-batak.webp',ulos:'assets/editorial/penenun-ulos.webp'};
function makeURL(file){return 'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(file)+'?width=1200'}
function sourceURL(file){return 'https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(file).replace(/%2C/g,',')}
let images=[],active=0;
function display(n){
 const viewport=document.getElementById('nusaGalleryDisplay');if(!viewport||!images.length)return;
 active=(n+images.length)%images.length;const item=images[active];
 const pic=viewport.querySelector('img');pic.alt=item.label;pic.src=item.url;
 pic.onerror=()=>{pic.onerror=null;pic.src=item.fallback;viewport.classList.add('nusa-photo-fallback')};
 pic.onload=()=>{if(pic.currentSrc===new URL(item.url,document.baseURI).href)viewport.classList.remove('nusa-photo-fallback')};
 viewport.querySelector('.nusa-photo-caption').textContent=item.label;
 const link=viewport.querySelector('.nusa-photo-source');link.href=item.source;link.hidden=!item.source;
 document.querySelectorAll('.nusa-gallery-thumb').forEach((btn,i)=>{btn.classList.toggle('is-current',i===active);btn.setAttribute('aria-pressed',String(i===active))});
 viewport.querySelector('.nusa-photo-index').textContent=String(active+1).padStart(2,'0')+' / '+String(images.length).padStart(2,'0');
}
function decorate(id){
 const p=(typeof POIS!=='undefined'?POIS:[]).find(x=>x.id===id);if(!p||!names[id])return;
 const info=document.querySelector('#modalContent .modal-info');if(!info)return;
 info.classList.add('nusa-detail-premium');
 const cover=document.querySelector('#modalContent .modal-cover');
 if(cover){cover.style.backgroundImage=`url("${p.mapPhoto||p.photo}")`;cover.classList.add('nusa-detail-cover');}
 const first=portrait[id];images=[{label:'Foto pengantar • '+p.name,url:p.mapPhoto||p.photo||first,source:'',fallback:first},...names[id].map(([label,file])=>({label,url:makeURL(file),source:sourceURL(file),fallback:first}))];
 const note=info.querySelector('.detail-note');if(note)note.classList.add('nusa-ethics-glass');
 const actions=info.querySelector('.detail-actions');if(actions)actions.classList.add('nusa-actions-glass');
 const chips=info.querySelector('.detail-chips');if(chips)chips.classList.add('nusa-chips-glass');
 const gallery=document.createElement('section');gallery.className='nusa-photo-gallery';gallery.setAttribute('aria-label','Galeri foto '+p.name);
 gallery.innerHTML=`<div class="nusa-gallery-heading"><div><span class="nusa-gallery-kicker">GALERI DESTINASI</span><h3>Jelajahi lewat foto.</h3><p>Dokumentasi visual yang berkaitan dengan ${p.name}. Pilih foto untuk melihatnya lebih besar.</p></div><span class="nusa-gallery-count">05 FOTO</span></div><div class="nusa-gallery-display" id="nusaGalleryDisplay"><img alt="" decoding="async"><div class="nusa-photo-shade"></div><span class="nusa-photo-index">01 / 05</span><div class="nusa-photo-meta"><strong class="nusa-photo-caption"></strong><a class="nusa-photo-source" href="#" target="_blank" rel="noopener noreferrer">Lihat foto &amp; lisensi ↗</a></div><div class="nusa-gallery-arrows"><button type="button" data-nusa-prev aria-label="Foto sebelumnya">‹</button><button type="button" data-nusa-next aria-label="Foto berikutnya">›</button></div></div><div class="nusa-gallery-thumbs" role="group" aria-label="Pilih foto"></div><p class="nusa-photo-disclaimer">Foto pengantar berasal dari koleksi aplikasi. Foto tambahan bersumber dari Wikimedia Commons dan ditampilkan bila internet tersedia; lisensi dan atribusi dapat diperiksa pada tautan masing-masing foto. Galeri bukan bukti kemitraan atau validasi lapangan.</p>`;
 const thumbs=gallery.querySelector('.nusa-gallery-thumbs');
 images.forEach((it,i)=>{const b=document.createElement('button');b.type='button';b.className='nusa-gallery-thumb';b.setAttribute('aria-label','Lihat foto '+(i+1)+': '+it.label);b.innerHTML='<img alt="" loading="lazy" decoding="async"><span>'+String(i+1).padStart(2,'0')+'</span>';const photo=b.querySelector('img');photo.src=it.url;photo.onerror=()=>{photo.onerror=null;photo.src=it.fallback};b.addEventListener('click',()=>display(i));thumbs.appendChild(b)});
 gallery.querySelector('[data-nusa-prev]').addEventListener('click',()=>display(active-1));gallery.querySelector('[data-nusa-next]').addEventListener('click',()=>display(active+1));
 const pstory=info.querySelector(':scope > p');if(pstory)pstory.after(gallery);else info.append(gallery);
 display(0);
}
function init(){if(typeof window.showDetail!=='function')return;const old=window.showDetail;window.showDetail=function(id){const result=old(id);decorate(id);return result};}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();