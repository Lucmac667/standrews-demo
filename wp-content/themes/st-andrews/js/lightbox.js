/* Lightbox — replaces React Lightbox component */
var lightboxImages = [];
var lightboxAlts = [];
var lightboxIndex = 0;

function openLightbox(index, group) {
  var imgs = [];
  var alts = [];
  // 06-07 N2: collect each thumbnail's alt in parallel so the enlarged image is not alt-empty.
  var collect = function(el){
    imgs.push(el.getAttribute('data-lightbox-src'));
    var im = el.tagName === 'IMG' ? el : el.querySelector('img');
    alts.push(im && im.getAttribute('alt') ? im.getAttribute('alt') : 'Enlarged photo');
  };
  if (group === 'gallery-preview') {
    document.querySelectorAll('.hp-gallery [data-lightbox-src]').forEach(collect);
  } else if (group) {
    document.querySelectorAll('[data-lightbox-group="'+group+'"] [data-lightbox-src]').forEach(collect);
  }
  if (!imgs.length) return;
  lightboxImages = imgs;
  lightboxAlts = alts;
  lightboxIndex = index;
  showLightboxImage();
  document.getElementById('lightbox').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').style.display = 'none';
  document.body.style.overflow = '';
}

function nextLightbox() {
  lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
  showLightboxImage();
}

function prevLightbox() {
  lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
  showLightboxImage();
}

function showLightboxImage() {
  document.getElementById('lightbox-img').src = lightboxImages[lightboxIndex];
  document.getElementById('lightbox-img').alt = lightboxAlts[lightboxIndex] || 'Enlarged photo';
  document.getElementById('lightbox-counter').textContent = (lightboxIndex+1) + ' / ' + lightboxImages.length;
}

document.addEventListener('keydown', function(e) {
  var lb = document.getElementById('lightbox');
  if (!lb || lb.style.display === 'none') return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') nextLightbox();
  if (e.key === 'ArrowLeft') prevLightbox();
});
