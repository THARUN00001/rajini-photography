    (function(){
      var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      /* HERO — preserved animation logic from supplied herosection.html */
      if(window.gsap && window.ScrollTrigger && !prefersReduced){
        gsap.registerPlugin(ScrollTrigger);

        var tiles = gsap.utils.toArray('.tile');
        var starts = [{x:-140,y:-70,r:-8},{x:150,y:-60,r:7},{x:-110,y:90,r:6},{x:130,y:80,r:-6}];
        var outScale = [3.6,3.9,3.6,3.9];

        gsap.set(tiles,{autoAlpha:0,scale:.55,force3D:true});
        tiles.forEach(function(t,i){
          gsap.set(t,{x:starts[i].x,y:starts[i].y,rotate:starts[i].r});
          gsap.set(t.querySelector('.photo'),{scale:1.25});
        });
        gsap.ticker.lagSmoothing(0);

        var tc=document.getElementById('tc');
        function pad(n){return ('0'+Math.floor(n)).slice(-2)}

        var tl=gsap.timeline({
          defaults:{overwrite:'auto'},
          scrollTrigger:{
            trigger:'#hero',start:'top top',end:'bottom bottom',
            scrub:1.1,pin:'.hero-pin',anticipatePin:1,
            onUpdate:function(self){
              var t=self.progress*134;
              tc.textContent='00:'+pad(t/60)+':'+pad(t%60)+':'+pad((t%1)*24);
            }
          }
        });

        tl.to('#heroHeading',{autoAlpha:0,y:-30,duration:.6,ease:'power1.inOut'},.1);
        tl.to('#scrollCue',{autoAlpha:0,duration:.3},.05);
        tl.to('#portrait',{scale:1.06,duration:2.4,ease:'sine.inOut'},.2);

        tiles.forEach(function(t,i){
          var inStart=.15+i*.4,outStart=2.6+i*.5;
          tl.to(t,{autoAlpha:1,scale:1,x:0,y:0,rotate:0,duration:1.4,ease:'power3.out'},inStart);
          tl.to(t.querySelector('.photo'),{scale:1,duration:1.8,ease:'power2.out'},inStart);
          tl.to(t,{autoAlpha:0,scale:outScale[i],duration:1.4,ease:'power2.in'},outStart);
        });

        tl.to('#portrait',{scale:9,duration:1.7,ease:'power2.inOut'},5.6);
        tl.to('.portrait .rim',{autoAlpha:0,duration:.6},5.8);
        tl.to('.vf',{autoAlpha:0,duration:.6},6.2);
        tl.to('#stage',{},6.8);
      }


      /* ---------- pinned services scroll sequence ---------- */
      (function(){

  const servicesSection =
    document.getElementById("servicesScroll");

  const servicesPin =
    document.getElementById("servicesPin");

  const slides =
    Array.from(
      document.querySelectorAll(".services-slide")
    );

  const counter =
    document.getElementById("servicesCurrent");

  const progressBar =
    document.getElementById("servicesProgressBar");

  if(
    !servicesSection ||
    !servicesPin ||
    !slides.length
  ){
    return;
  }


  let activeIndex = 0;
  let ticking = false;


  function clamp(value,min,max){

    return Math.max(
      min,
      Math.min(max,value)
    );

  }


  function updateServices(){

    const rect =
      servicesSection.getBoundingClientRect();

    const scrollDistance =
      servicesSection.offsetHeight -
      window.innerHeight;

    if(scrollDistance <= 0){
      return;
    }


    /*
      0 = top of service section
      1 = bottom of service section
    */

    const progress =
      clamp(
        -rect.top / scrollDistance,
        0,
        1
      );


    /*
      Divide the scroll area into
      four cinematic scenes.
    */

    const sceneFloat =
      progress * slides.length;

    let newIndex =
      Math.floor(sceneFloat);

    if(newIndex >= slides.length){
      newIndex = slides.length - 1;
    }


    /*
      Crossfade the images.
    */

    if(newIndex !== activeIndex){

      slides[activeIndex].classList.remove("active");

      slides[newIndex].classList.add("active");

      activeIndex = newIndex;

    }


    /*
      Counter.
    */

    if(counter){

      counter.textContent =
        String(activeIndex + 1)
          .padStart(2,"0");

    }


    /*
      Bottom progress bar.
    */

    if(progressBar){

      progressBar.style.width =
        (progress * 100) + "%";

    }


    /*
      Subtle depth movement.
      The active image slowly zooms while
      the user scrolls through the scene.
    */

    slides.forEach(function(slide,index){

      const img =
        slide.querySelector("img");

      if(!img) return;


      if(index === activeIndex){

        const localProgress =
          sceneFloat - Math.floor(sceneFloat);

        const scale =
          1 + localProgress * .045;

        img.style.transform =
          "scale(" + scale + ")";

      }

      else{

        img.style.transform =
          "scale(1.04)";

      }

    });


    ticking = false;

  }


  function requestUpdate(){

    if(!ticking){

      requestAnimationFrame(
        updateServices
      );

      ticking = true;

    }

  }


  window.addEventListener(
    "scroll",
    requestUpdate,
    {passive:true}
  );

  window.addEventListener(
    "resize",
    requestUpdate,
    {passive:true}
  );


  updateServices();

})();


      /* global scroll depth / reveal effects */
      var progress=document.getElementById('scroll-progress');
      var dots=[].slice.call(document.querySelectorAll('.scene-dot'));
      var sections=[
        document.getElementById('hero'),
        document.getElementById('about'),
        document.getElementById('services'),
        document.getElementById('portfolio'),
        document.getElementById('contact')
      ];

      function updateProgress(){
        var max=document.documentElement.scrollHeight-window.innerHeight;
        var p=max>0?window.scrollY/max:0;
        progress.style.transform='scaleX('+p+')';
      }
      window.addEventListener('scroll',updateProgress,{passive:true});
      updateProgress();

      dots.forEach(function(dot,i){
        dot.addEventListener('click',function(){
          var el=sections[i];
          if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
        });
      });

      var revealObserver=new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },{threshold:.16,rootMargin:'0px 0px -8% 0px'});
      document.querySelectorAll('.reveal').forEach(function(el){revealObserver.observe(el)});

      /* active section nav */
      var activeObserver=new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            var idx=sections.indexOf(entry.target);
            if(idx>-1){
              dots.forEach(function(d){d.classList.remove('active')});
              if(dots[idx]) dots[idx].classList.add('active');
            }
          }
        });
      },{threshold:.42});
      sections.forEach(function(s){if(s) activeObserver.observe(s)});

      /* image depth */
      if(!prefersReduced){
        var depthImages=document.querySelectorAll('.parallax-image');
        function parallax(){
          var vh=window.innerHeight;
          depthImages.forEach(function(img){
            var rect=img.parentElement.getBoundingClientRect();
            var d=(rect.top+rect.height/2-vh/2)/vh;
            img.style.transform='translate3d(0,'+(d*-28)+'px,0)';
          });
        }
        window.addEventListener('scroll',parallax,{passive:true});
        window.addEventListener('resize',parallax,{passive:true});
        parallax();
      }

      /* count-up stats */
      var statsDone=false;
      function runStats(){
        if(statsDone) return;
        var about=document.getElementById('about');
        var r=about.getBoundingClientRect();
        if(r.top<window.innerHeight*.82 && r.bottom>0){
          statsDone=true;
          document.querySelectorAll('[data-count]').forEach(function(el){
            var target=Number(el.getAttribute('data-count'));
            var start=0,dur=1100,t0=null;
            function step(ts){
              if(!t0)t0=ts;
              var t=Math.min(1,(ts-t0)/dur);
              var eased=1-Math.pow(1-t,3);
              el.textContent=Math.round(target*eased);
              if(t<1)requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
          });
        }
      }
      window.addEventListener('scroll',runStats,{passive:true});
      runStats();

      // /* portfolio depth drift */
      // if(!prefersReduced){
      //   var cols=[].slice.call(document.querySelectorAll('.gallery-col'));
      //   function drift(){
      //     var vh=window.innerHeight;
      //     cols.forEach(function(col){
      //       var rect=col.getBoundingClientRect();
      //       var speed=Number(col.getAttribute('data-speed'))||1;
      //       var offset=(rect.top+rect.height/2-vh/2)*(speed-1)*.12;
      //       col.style.transform='translate3d(0,'+offset+'px,0)';
      //     });
      //   }
      //   window.addEventListener('scroll',drift,{passive:true});
      //   window.addEventListener('resize',drift,{passive:true});
      //   drift();
      // }

      /* soft magnetic cursor, inspired by the source template */
      if(matchMedia('(hover:hover) and (pointer:fine)').matches){
        var cur=document.createElement('span'), ring=document.createElement('span');
        cur.style.cssText='position:fixed;width:6px;height:6px;border-radius:50%;background:#bf7a42;pointer-events:none;z-index:1200;transform:translate(-50%,-50%)';
        ring.style.cssText='position:fixed;width:30px;height:30px;border:1px solid rgba(191,122,66,.48);border-radius:50%;pointer-events:none;z-index:1199;transform:translate(-50%,-50%);transition:transform .2s ease,border-color .2s ease';
        document.body.appendChild(cur);document.body.appendChild(ring);
        var mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my,raf=0;
        function tick(){
          rx+=(mx-rx)*.16;ry+=(my-ry)*.16;
          cur.style.left=mx+'px';cur.style.top=my+'px';
          ring.style.left=rx+'px';ring.style.top=ry+'px';
          if(Math.abs(mx-rx)>.1||Math.abs(my-ry)>.1)raf=requestAnimationFrame(tick);else raf=0;
        }
        addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;if(!raf)raf=requestAnimationFrame(tick)},{passive:true});
        document.querySelectorAll('a,button,.work,.service').forEach(function(el){
          el.addEventListener('mouseenter',function(){ring.style.transform='translate(-50%,-50%) scale(1.5)';ring.style.borderColor='#bf7a42'});
          el.addEventListener('mouseleave',function(){ring.style.transform='translate(-50%,-50%) scale(1)';ring.style.borderColor='rgba(191,122,66,.48)'});
        });
        tick();
      }
    })();