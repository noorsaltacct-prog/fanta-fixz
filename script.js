(function(){
  var PHONE='725-233-4259', SMS='+17252334259';
  var SV=[
    {k:'brakes',n:'Brakes',t:'Squealing, grinding or a soft pedal? We do your brake work at your car.'},
    {k:'oil',n:'Oil changes',t:'Oil and filter changed where you park. No drop-off and no waiting room.'},
    {k:'diag',n:'Engine diagnostics',t:'Check engine light on or the car running rough? We read it and track down what is wrong.'},
    {k:'susp',n:'Suspension work',t:'Bouncy ride, pulling, or the car sitting low? We handle suspension repairs on site.'},
    {k:'noise',n:'Suspension noise diagnosis',t:'Clunks over bumps, creaks in turns, rattles at low speed. We find where the noise comes from.'},
    {k:'tire',n:'Flat tire repair',t:'Flat or losing air? We repair the tire where the car is.'},
    {k:'jump',n:'Jump starts',t:'Dead battery? We come to you and get the car started.'},
    {k:'other',n:'Everything else',t:'If your car needs it and it is not on this list, text us and ask. Everything a car needs is the job.'}
  ];
  var byK={};SV.forEach(function(s){byK[s.k]=s});
  var $=function(s,r){return (r||document).querySelector(s)};
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  function go(id){var el=document.getElementById(id);if(el)el.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'})}

  /* service explorer */
  var jobs=$('#jobs'),car=$('#car'),active=null;
  SV.forEach(function(s){
    var d=document.createElement('div');d.className='job';d.dataset.k=s.k;
    d.innerHTML='<button type="button" aria-expanded="false" aria-controls="m-'+s.k+'">'+s.n+'</button>'+
      '<div class="job-more" id="m-'+s.k+'" hidden><p></p><button type="button" class="btn btn-hot btn-sm"><span>Quote this job</span></button></div>';
    $('p',d).textContent=s.t;
    $('button',d).addEventListener('click',function(){pick(s.k,true)});
    $('.job-more .btn',d).addEventListener('click',function(){state.svc=s.k;state.step=1;render();go('quote')});
    jobs.appendChild(d);
  });
  function pick(k,toggle){
    if(toggle&&active===k)k=null;
    active=k;
    car.dataset.active=k||'';
    Array.prototype.forEach.call(jobs.children,function(d){
      var on=d.dataset.k===k;d.classList.toggle('on',on);
      $('button',d).setAttribute('aria-expanded',on?'true':'false');
      $('.job-more',d).hidden=!on;
    });
    Array.prototype.forEach.call(car.querySelectorAll('.ret'),function(r){r.classList.toggle('on',r.dataset.k===k)});
  }
  Array.prototype.forEach.call(car.querySelectorAll('.ret'),function(r){
    r.addEventListener('click',function(){pick(r.dataset.k,false)});
    r.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(r.dataset.k,false)}});
  });
  pick('brakes',false);

  /* quote flow */
  var state={step:0,svc:null,car:'',where:'',when:null,err:''};
  var WHEN=['Today','Tomorrow','This week','Not sure yet'];
  var flow=$('#flow');
  function msgText(){
    var s=byK[state.svc];
    return 'Hi Fanta Fixz, I need a quote.\nJob: '+(s?s.n:'')+'\nCar: '+state.car+'\nLocation: '+state.where+'\nWhen: '+state.when;
  }
  function el(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e}
  function btn(label,cls,fn){var b=el('button','btn '+cls);b.type='button';b.appendChild(el('span','',label));b.addEventListener('click',fn);return b}
  function copyFrom(node,text,fb,ok){
    function fail(){try{node.focus();node.select&&node.select()}catch(e){}fb.textContent='Select the text and copy it.'}
    try{
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(function(){fb.textContent=ok},fail)}else fail();
    }catch(e){fail()}
  }
  function render(){
    flow.textContent='';
    var s=state.step;
    if(s<4){
      var p=el('div','prog');
      for(var i=0;i<4;i++){p.appendChild(el('i',i<s?'d':(i===s?'c':'')))}
      p.appendChild(el('span','','Question '+(s+1)+' of 4'));
      flow.appendChild(p);
    }
    if(s===0){
      flow.appendChild(el('h3 disp'.split(' ')[0],'disp','What does the car need?'));
      var o=el('div','opts');
      SV.forEach(function(v){
        var b=el('button','opt',v.n);b.type='button';b.setAttribute('aria-pressed',state.svc===v.k?'true':'false');
        b.addEventListener('click',function(){state.svc=v.k;state.step=1;render()});
        o.appendChild(b);
      });
      flow.appendChild(o);
    }else if(s===1||s===2){
      var isCar=s===1;
      var f=el('div','fld');
      var h=el('h3','disp',isCar?'What car is it?':'Where is it parked?');
      h.id='qh';
      var inp=el('input');inp.id='qi';inp.type='text';inp.autocomplete='off';
      inp.setAttribute('aria-labelledby','qh');
      inp.placeholder=isCar?'2016 Honda Accord':'City or zip code';
      inp.value=isCar?state.car:state.where;
      if(!isCar){inp.autocomplete='postal-code'}
      var er=el('div','err');er.id='qe';
      function next(){
        var v=inp.value.trim();
        if(!v){er.textContent=isCar?'Add the year, make and model so we can quote it.':'Add a city or zip code so we know where to go.';inp.focus();return}
        if(isCar)state.car=v;else state.where=v;
        state.step=s+1;render();
      }
      inp.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();next()}});
      f.appendChild(h);f.appendChild(inp);f.appendChild(er);
      flow.appendChild(f);
      var nav=el('div','f-nav');
      nav.appendChild(btn('Next','btn-hot',next));
      var back=el('button','linkbtn','Back');back.type='button';back.addEventListener('click',function(){state.step=s-1;render()});
      nav.appendChild(back);
      flow.appendChild(nav);
      setTimeout(function(){try{inp.focus({preventScroll:true})}catch(e){}},30);
    }else if(s===3){
      flow.appendChild(el('h3','disp','When do you need us?'));
      var o2=el('div','opts');
      WHEN.forEach(function(w){
        var b=el('button','opt',w);b.type='button';b.setAttribute('aria-pressed',state.when===w?'true':'false');
        b.addEventListener('click',function(){state.when=w;state.step=4;render()});
        o2.appendChild(b);
      });
      flow.appendChild(o2);
      var nav2=el('div','f-nav');
      var b2=el('button','linkbtn','Back');b2.type='button';b2.addEventListener('click',function(){state.step=2;render()});
      nav2.appendChild(b2);flow.appendChild(nav2);
    }else{
      var pg=el('div','prog');for(var j=0;j<4;j++)pg.appendChild(el('i','d'));pg.appendChild(el('span','','All set'));flow.appendChild(pg);
      flow.appendChild(el('h3','disp','Your text is ready.'));
      var note=el('p','done-note');note.innerHTML='Send it to <b>'+PHONE+'</b>. Text only, no calls.';
      flow.appendChild(note);
      var ta=el('textarea','msg');ta.readOnly=true;ta.value=msgText();ta.id='msgbox';ta.setAttribute('aria-label','Your quote text');
      flow.appendChild(ta);
      var fb=el('div','fb');fb.setAttribute('role','status');
      var nav3=el('div','f-nav');
      var a=el('a','btn btn-hot');a.href='sms:'+SMS+'?&body='+encodeURIComponent(msgText());a.appendChild(el('span','','Open in Messages'));
      nav3.appendChild(a);
      nav3.appendChild(btn('Copy message','btn-line',function(){copyFrom(ta,ta.value,fb,'Copied. Paste it into a text to '+PHONE+'.')}));
      var again=el('button','linkbtn','Start over');again.type='button';again.addEventListener('click',function(){state={step:0,svc:null,car:'',where:'',when:null};render()});
      nav3.appendChild(again);
      flow.appendChild(nav3);flow.appendChild(fb);
    }
  }
  render();

  /* copy number */
  $('#copyNum').addEventListener('click',function(){
    var fb=$('#numFb');
    try{
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(PHONE).then(function(){fb.textContent='Copied '+PHONE},function(){fb.textContent='Select the number and copy it.'})}
      else fb.textContent='Select the number and copy it.';
    }catch(e){fb.textContent='Select the number and copy it.'}
  });

  /* year */
  try{$('#yr').textContent=new Date().getFullYear()}catch(e){}

  /* hide mobile dock while quote / text-us sections are on screen */
  try{
    var dock=$('#dock'),vis={};
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){vis[e.target.id]=e.isIntersecting});
      dock.classList.toggle('off',!!(vis.quote||vis.text));
    },{threshold:.2});
    io.observe($('#quote'));io.observe($('#text'));
  }catch(e){}
})();
