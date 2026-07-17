/* Scroll-reveal — replaces framer-motion Reveal component */
(function(){
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        e.target.classList.add('is-visible');
        observer.unobserve(e.target);
      }
    });
  },{rootMargin:'-60px',threshold:0.08});
  els.forEach(function(el){observer.observe(el)});

  /* Scroll progress bar */
  var bar = document.getElementById('scroll-progress');
  if(bar){
    window.addEventListener('scroll',function(){
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX('+(h>0?window.scrollY/h:0)+')';
    },{passive:true});
  }

  /* Sidebar/topbar scroll state — light/transparent over a hero, dark/frosted over body
     content. Runs on the homepage hero AND interior page-hero pages (#1). */
  var sidebar = document.getElementById('sidebar');
  var topbar = document.getElementById('topbar');
  var isFront = document.body.classList.contains('home-hero-active');
  var pageHero = document.querySelector('.pagehero');
  if(sidebar && (isFront || pageHero)){
    var heroThreshold = function(){
      // Interior pages flip once the page-hero has nearly scrolled away; the homepage
      // keeps its original 0.85 * viewport trigger.
      return pageHero ? Math.max(0, pageHero.offsetHeight - 90) : window.innerHeight * 0.85;
    };
    var applyScrollState = function(){
      var scrolled = window.scrollY > heroThreshold();
      sidebar.setAttribute('data-scrolled', scrolled);
      sidebar.setAttribute('data-tone', scrolled ? 'dark' : 'light');
      sidebar.style.zIndex = scrolled ? 40 : 50;
      if(topbar){
        var mobileScrolled = window.scrollY > 100;
        topbar.setAttribute('data-scrolled', mobileScrolled);
        topbar.setAttribute('data-tone', mobileScrolled ? 'dark' : 'light');
      }
    };
    applyScrollState();
    window.addEventListener('scroll', applyScrollState, {passive:true});
  } else if(sidebar){
    // No hero on this page — keep the sidebar dark/readable over the light body.
    sidebar.setAttribute('data-scrolled', 'true');
    sidebar.setAttribute('data-tone', 'dark');
  }
})();
