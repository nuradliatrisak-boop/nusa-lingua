/* Optional progressive HD enhancement. The local photograph is always available first. */
(()=>{const source='https://commons.wikimedia.org/wiki/Special:FilePath/Huta_Siallagan_Batak_Village.jpg?width=1920';
function init(){const el=document.querySelector('.history-teaser-visual.premium-history-photo');if(!el||navigator.onLine===false)return;
const i=new Image();i.decoding='async';i.onload=()=>{if(i.naturalWidth>=1400)el.style.setProperty('background-image',`url("${source}")`,'important')};i.onerror=()=>{};i.src=source;}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();})();
