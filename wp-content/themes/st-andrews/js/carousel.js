/* Featured Photos carousel — auto-advance + swipe + lightbox (Phase 3 D-18/D-19) */
(function () {
  var root = document.querySelector('[data-carousel]');
  if (!root) return;

  var slides = root.querySelectorAll('[data-carousel-slide]');
  var dots   = root.querySelectorAll('[data-carousel-dot]');
  var prevBtn = root.querySelector('[data-carousel-prev]');
  var nextBtn = root.querySelector('[data-carousel-next]');
  if (slides.length < 2) return;

  // --- State ---
  var idx = 0;
  var timer = null;
  var INTERVAL_MS = 4000;
  var SWIPE_THRESHOLD_PX = 50;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lightboxOpen = false;
  var x0 = null;

  // --- Helpers ---
  function show(n) {
    idx = ((n % slides.length) + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      var active = i === idx;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
    });
    dots.forEach(function (dot, i) {
      var active = i === idx;
      dot.classList.toggle('is-active', active);
      if (active) {
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.removeAttribute('aria-current');
      }
    });
  }

  function next() { show(idx + 1); }
  function prev() { show(idx - 1); }

  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  function start() {
    if (reduced || lightboxOpen) return;
    stop();
    timer = setInterval(next, INTERVAL_MS);
  }

  // --- Nav buttons ---
  if (prevBtn) {
    prevBtn.addEventListener('click', function () { prev(); start(); });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function () { next(); start(); });
  }

  // --- Dots ---
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { show(i); start(); });
  });

  // --- Hover pause (pointer devices) ---
  root.addEventListener('pointerenter', stop);
  root.addEventListener('pointerleave', start);

  // --- Focus pause (keyboard) ---
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', function (e) {
    if (!root.contains(e.relatedTarget)) start();
  });

  // --- Touch swipe ---
  root.addEventListener('touchstart', function (e) {
    x0 = e.changedTouches[0].clientX;
    stop();
  }, { passive: true });

  root.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) >= SWIPE_THRESHOLD_PX) {
      if (dx < 0) { next(); } else { prev(); }
    }
    x0 = null;
  }, { passive: true });

  // --- Click slide → open lightbox ---
  slides.forEach(function (slide, i) {
    slide.addEventListener('click', function () {
      if (typeof openLightbox === 'function') {
        lightboxOpen = true;
        stop();
        openLightbox(i, 'featured-photos');
      }
    });
  });

  // --- Lightbox close → resume (MutationObserver on style.display) ---
  var lb = document.getElementById('lightbox');
  if (lb) {
    var lbObserver = new MutationObserver(function () {
      if (lb.style.display === 'none') {
        lightboxOpen = false;
        start();
      }
    });
    lbObserver.observe(lb, { attributes: true, attributeFilter: ['style'] });
  }

  // --- Initialise ---
  show(0);
  start();
})();
