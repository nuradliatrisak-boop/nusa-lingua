/* New high-resolution tourism photo: Lake Toba, Samosir, by Bisajunisa, CC BY-SA 4.0. */
(function(){
  const banner = document.querySelector('.immersive-promo-photo');
  if (!banner) return;
  const local = '/assets/editorial/immersive-banner-hd.jpg';
  const remote = 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Lake_Toba_and_the_surrounding_hills.jpg';
  const activate = (src) => {
    banner.style.setProperty('--banner-photo', 'url("' + src + '")');
    banner.classList.add('hd-photo-ready');
  };
  const preload = (src, failover) => {
    const img = new Image();
    img.onload = () => {if (img.naturalWidth >= 1200) activate(src); else if(failover) failover();};
    img.onerror = () => {if(failover) failover();};
    img.src = src;
  };
  preload(local, () => preload(remote));
})();
