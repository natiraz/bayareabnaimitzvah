(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- sticky nav + parallax + back-to-top ---- */
  var header = document.querySelector('header.site');
  var top = document.getElementById('top');
  var isHome = document.body.classList.contains('home');
  function onScroll(){
    var y = window.scrollY;
    if(header) header.classList.toggle('scrolled', y > 40);
    if(top) top.classList.toggle('show', y > 700);
    if(!reduce){
      var cb = document.querySelector('.closing-bg');
      if(cb){
        var r = cb.parentElement.getBoundingClientRect();
        if(r.bottom > 0 && r.top < window.innerHeight) cb.style.transform = 'translateY(' + (r.top * -0.12) + 'px)';
      }
    }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
  if(top) top.addEventListener('click', function(){ window.scrollTo({top:0, behavior: reduce?'auto':'smooth'}); });

  /* ---- mobile menu ---- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  if(burger && menu){
    burger.addEventListener('click', function(){
      var open = menu.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
      document.body.classList.toggle('lock', open);
    });
    menu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        if(menu.classList.contains('open')){
          menu.classList.remove('open'); burger.classList.remove('open');
          document.body.classList.remove('lock'); burger.setAttribute('aria-expanded', false);
        }
      });
    });
  }

  /* ---- scroll reveals ---- */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:0.14});
  document.querySelectorAll('.reveal-root, .reveal').forEach(function(el){ io.observe(el); });

  /* gallery items reveal individually with a gentle stagger */
  var gio = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ var el=e.target; setTimeout(function(){el.classList.add('in');}, (el.dataset.delay||0)); gio.unobserve(el); }
    });
  }, {threshold:0.1});
  document.querySelectorAll('.gitem').forEach(function(el,i){ el.dataset.delay=(i%3)*90; gio.observe(el); });

  /* ---- hero load-in ---- */
  window.addEventListener('load', function(){
    document.querySelectorAll('.hero [data-anim]').forEach(function(el,i){
      el.style.opacity=0; el.style.transform='translateY(26px)';
      el.style.transition='opacity 1s var(--ease), transform 1s var(--ease)';
      setTimeout(function(){ el.style.opacity=1; el.style.transform='none'; }, 180 + i*160);
    });
  });

  /* ---- golden motes (hero + page-hero) ---- */
  if(!reduce){
    document.querySelectorAll('canvas.motes').forEach(function(canvas){
      var ctx = canvas.getContext('2d');
      var host = canvas.parentElement, motes=[], W, H, dense = canvas.dataset.dense === '1';
      function size(){ W=canvas.width=host.offsetWidth; H=canvas.height=host.offsetHeight; }
      function make(){ motes=[]; var n=Math.min(dense?46:26, Math.floor(W/(dense?26:40)));
        for(var i=0;i<n;i++) motes.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*2.2+.5,s:Math.random()*.35+.1,d:Math.random()*Math.PI*2,o:Math.random()*.5+.15}); }
      function draw(){ ctx.clearRect(0,0,W,H);
        motes.forEach(function(m){ m.y-=m.s; m.d+=.01; m.x+=Math.sin(m.d)*.22; if(m.y<-6){m.y=H+6;m.x=Math.random()*W;}
          var g=ctx.createRadialGradient(m.x,m.y,0,m.x,m.y,m.r*3); g.addColorStop(0,'rgba(231,193,92,'+m.o+')'); g.addColorStop(1,'rgba(231,193,92,0)');
          ctx.fillStyle=g; ctx.beginPath(); ctx.arc(m.x,m.y,m.r*3,0,Math.PI*2); ctx.fill(); });
        requestAnimationFrame(draw); }
      size(); make(); draw();
      window.addEventListener('resize', function(){ size(); make(); });
    });
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.qa button').forEach(function(btn){
    btn.addEventListener('click', function(){
      var qa = btn.closest('.qa'); var ans = qa.querySelector('.ans');
      var open = qa.classList.toggle('open');
      ans.style.maxHeight = open ? (ans.scrollHeight + 'px') : null;
    });
  });

  /* ---- interactive checklist ---- */
  document.querySelectorAll('.checklist li').forEach(function(li){
    li.addEventListener('click', function(){ li.classList.toggle('done'); });
  });

  /* ---- lightbox for gallery ---- */
  var lb = document.getElementById('lightbox');
  if(lb){
    var lbImg = lb.querySelector('img');
    var items = Array.prototype.slice.call(document.querySelectorAll('.gitem'));
    var idx = 0;
    function show(i){ idx=(i+items.length)%items.length; var src=items[idx].dataset.full || items[idx].querySelector('img').src; lbImg.src=src; }
    items.forEach(function(it,i){ it.addEventListener('click', function(){ show(i); lb.classList.add('open'); document.body.classList.add('lock'); }); });
    function close(){ lb.classList.remove('open'); document.body.classList.remove('lock'); }
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.prev').addEventListener('click', function(e){ e.stopPropagation(); show(idx-1); });
    lb.querySelector('.next').addEventListener('click', function(e){ e.stopPropagation(); show(idx+1); });
    lb.addEventListener('click', function(e){ if(e.target===lb) close(); });
    document.addEventListener('keydown', function(e){ if(!lb.classList.contains('open'))return; if(e.key==='Escape')close(); if(e.key==='ArrowLeft')show(idx-1); if(e.key==='ArrowRight')show(idx+1); });
  }

  /* ---- gentle notice for media that lives on the live site ---- */
  document.querySelectorAll('[data-note]').forEach(function(el){
    el.addEventListener('click', function(e){
      if(el.tagName!=='A'){ e.preventDefault(); }
    });
  });
})();
