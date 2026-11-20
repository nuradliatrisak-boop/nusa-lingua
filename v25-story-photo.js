/* NUSA LINGUA V25 — HD photo for a single editorial card only. */
(()=>{
 const holder=document.querySelector('#immersive .story-note-photo');
 if(!holder) return;
 const local='assets/editorial/story-lake-toba-hd.jpg';
 const remote='https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/Lake_Toba%2C_Indonesia_%28Unsplash%29.jpg/1280px-Lake_Toba%2C_Indonesia_%28Unsplash%29.jpg';
 const photo=document.createElement('img');
 photo.className='story-photo-hd'; photo.alt='';photo.decoding='async';
 photo.setAttribute('aria-hidden','true');
 holder.insertBefore(photo,holder.firstChild);
 const activate=(src)=>{photo.onload=()=>photo.classList.add('ready'); photo.onerror=()=>{if(src===local)activate(remote)};photo.src=src};
 // Use the local copy if present; otherwise fall back to the CC0 photo hosted on Wikimedia.
 const start=()=>activate(local);
 if('IntersectionObserver' in window){const io=new IntersectionObserver(entries=>{if(entries.some(x=>x.isIntersecting)){io.disconnect();start()}},{rootMargin:'300px'});io.observe(holder)}
 else start();
})();
