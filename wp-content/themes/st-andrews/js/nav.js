/* Mobile drawer navigation */
(function(){
  var openBtn = document.getElementById('drawer-open');
  var closeBtn = document.getElementById('drawer-close');
  var drawer = document.getElementById('drawer');
  var backdrop = document.getElementById('drawer-backdrop');
  if(!openBtn||!drawer) return;

  function open(){
    drawer.style.transform = 'translateX(0)';
    drawer.style.transition = 'transform 0.45s cubic-bezier(0.22,1,0.36,1)';
    backdrop.style.display = 'block';
    setTimeout(function(){backdrop.style.opacity='1'},10);
    document.body.style.overflow = 'hidden';
  }
  function close(){
    drawer.style.transform = 'translateX(-100%)';
    backdrop.style.opacity = '0';
    setTimeout(function(){backdrop.style.display='none'},300);
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', open);
  if(closeBtn) closeBtn.addEventListener('click', close);
  if(backdrop) backdrop.addEventListener('click', close);
})();
