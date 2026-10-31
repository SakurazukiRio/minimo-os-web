(()=>{
/* Minimo hero + sección poses · geometría v12 (±20.5°, ojos ~23 % más grandes, arco de sonrisa, sin boca). */
const NS='http://www.w3.org/2000/svg';
const C=256,R=240,G=1.23;
const EW0=71.5*G, EH0=162*G; // ~88 × 199
const EYE_ANG=20.5*Math.PI/180; // ±20.5°
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

function easeMorph(x){
  x=Math.max(0,Math.min(1,x)); if(x<=0||x>=1) return x;
  const x1=.4,y1=.06,x2=.18,y2=1; let t=x;
  for(let i=0;i<6;i++){
    const u=1-t, fx=3*u*u*t*x1+3*u*t*t*x2+t*t*t-x;
    const dx=3*u*u*x1+6*u*t*(x2-x1)+3*t*t*(1-x2);
    if(Math.abs(dx)<1e-6) break; t=Math.max(0,Math.min(1,t-fx/dx));
  }
  const u=1-t; return 3*u*u*t*y1+3*u*t*t*y2+t*t*t;
}

/* Contorno del ojo en el plano tangente → proyectado sobre la esfera (como Character.qml v12). */
function eyePath(side, op, smile, squint, sleepy, gazeYaw, gazePitch){
  const wMul=1+0.15*squint, hMul=1;
  const hw=0.13*wMul*(1+0.13*squint);
  const hs0=Math.max(0,(0.57)*hMul-2*hw)/2;
  const hh=Math.max(0.35*hw,(hs0+hw)*(1-0.28*squint)*(1+0.09*squint));
  const rr=Math.min(hw,hh), hs=hh-rr, ta=hw-rr;
  const k=easeMorph(Math.max(0,Math.min(1,smile)));
  const wa=0.095*wMul, Ra=0.14, cc=-0.04;
  const N=20, loc=[];
  const pillAt=t=>{
    const q=Math.PI/2*rr, L=2*ta+2*q+2*hs; let d=t*L;
    if(d<ta) return [d,hh]; d-=ta;
    if(d<q){const a=d/rr; return [ta+rr*Math.sin(a),hs+rr*Math.cos(a)]} d-=q;
    if(d<2*hs) return [hw,hs-d]; d-=2*hs;
    if(d<q){const a=d/rr; return [ta+rr*Math.cos(a),-hs-rr*Math.sin(a)]} d-=q;
    return [Math.max(0,ta-d),-hh];
  };
  const archAt=t=>{
    const Ro=Ra+wa, Ri=Math.max(0.005,Ra-wa);
    const L1=Ro*Math.PI/2, L2=Math.PI*wa, L3=Ri*Math.PI/2, d=t*(L1+L2+L3);
    if(d<L1){const th=d/Ro; return [Ro*Math.sin(th),cc+Ro*Math.cos(th)]}
    if(d<L1+L2){const ph=(d-L1)/wa; return [Ra+wa*Math.cos(ph),cc-wa*Math.sin(ph)]}
    const th=Math.PI/2-(d-L1-L2)/Ri; return [Ri*Math.sin(th),cc+Ri*Math.cos(th)];
  };
  const half=[];
  for(let i=0;i<=N;i++){const t=i/N,P=pillAt(t),A=archAt(t); half.push([P[0]+(A[0]-P[0])*k,P[1]+(A[1]-P[1])*k])}
  for(let i=0;i<=N;i++) loc.push(half[i]);
  for(let i=N-1;i>0;i--) loc.push([-half[i][0],half[i][1]]);
  let y0=1e9,y1=-1e9; for(const q of loc){y0=Math.min(y0,q[1]); y1=Math.max(y1,q[1])}
  const Hh=Math.max(1e-6,y1-y0), ya=y0+0.4*Hh;
  let lid=Math.max(Math.max(0,Math.min(1,op)), Math.min(1,0.42*2*hw/Hh));
  const sk=Math.max(0,Math.min(1,sleepy));
  if(sk>0){
    for(const q of loc) q[1]=ya+(q[1]-ya)*lid;
    const wl=0.042*wMul, Rl=0.17, cl=0.10, Ro=Rl+wl, Ri=Rl-wl, A0=0.62;
    const L1=Ro*2*A0, L2=Math.PI*wl, L3=Ri*2*A0, Lt=L1/2+L2+L3/2;
    const arcAt=t=>{
      const d=t*Lt;
      if(d<L1/2){const th=d/Ro; return [Ro*Math.sin(th),cl-Ro*Math.cos(th)]}
      if(d<L1/2+L2){const ex=Rl*Math.sin(A0),ey=cl-Rl*Math.cos(A0),ang=A0-Math.PI/2+(d-L1/2)/wl; return [ex+wl*Math.cos(ang),ey+wl*Math.sin(ang)]}
      const th=Math.max(0,A0-(d-L1/2-L2)/Ri); return [Ri*Math.sin(th),cl-Ri*Math.cos(th)];
    };
    const n=loc.length, e=sk*sk*(3-2*sk);
    for(let i=0;i<n;i++){
      let A; if(i<=N) A=arcAt(1-i/N); else {const B=arcAt((i-N)/N); A=[-B[0],B[1]]}
      loc[i][0]+=(A[0]-loc[i][0])*e; loc[i][1]+=(A[1]-loc[i][1])*e;
    }
    lid=1;
  }
  lid*=1-0.35*Math.sin(Math.PI*k);
  const wx=1+0.1*(1-lid);
  const Gg=1+0.23*(1-Math.max(0,Math.min(1,squint)));
  for(const q of loc){q[1]=(ya+(q[1]-ya)*lid)*Gg; q[0]*=wx*Gg}
  const Mx=side*0.3502, Mz=0.9367, Cx=side*0.9367, Cz=-0.3502;
  const cyw=Math.cos(gazeYaw), syw=Math.sin(gazeYaw), cp=Math.cos(gazePitch), sp=Math.sin(gazePitch);
  const pts=[];
  for(let j=0;j<=loc.length;j++){
    const u=loc[j%loc.length][0], v=loc[j%loc.length][1];
    const l=Math.hypot(u,v), sc=l>1e-9?Math.sin(l)/l:1, co=Math.cos(l);
    let X=co*Mx+sc*u*Cx, Y=sc*v, Z=co*Mz+sc*u*Cz;
    const Y1=Y*cp-Z*sp, Z1=Y*sp+Z*cp;
    let X2=X*cyw+Z1*syw, Y2=Y1, Z2=-X*syw+Z1*cyw;
    if(Z2<0){const h=Math.hypot(X2,Y2)||1; X2/=h; Y2/=h}
    pts.push([C+X2*R, C-Y2*R]);
  }
  let d=`M${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  for(let i=1;i<pts.length;i++) d+=`L${pts[i][0].toFixed(2)} ${pts[i][1].toFixed(2)}`;
  return d+'Z';
}

function makeFace(ids){
  const svg=document.getElementById(ids.svg);
  const body=document.getElementById(ids.body);
  const eyeL=document.getElementById(ids.eyeL);
  const eyeR=document.getElementById(ids.eyeR);
  const wrap=document.getElementById(ids.wrap);
  const hearts=ids.hearts?document.getElementById(ids.hearts):null;
  const zzz=ids.zzz?document.getElementById(ids.zzz):null;
  const st={
    tx:0,ty:0,gx:0,gy:0,
    blink:1,blinkT:0,nextBlink:performance.now()+2200,
    openL:1,openR:1,
    smile:0,smileT:0,squint:0,squintT:0,sleepy:0,sleepyT:0,
    petting:0,pet:0,lean:0,leanT:0,squash:0,squashT:0,
    clicks:[],lastMove:performance.now(),
    force:{pose:null}
  };
  const L=(a,b,t)=>a+(b-a)*t;

  if(wrap){
    addEventListener('pointermove',e=>{
      if(st.force.pose==='sleep') return;
      const r=svg.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
      const dx=e.clientX-cx,dy=e.clientY-cy,d=Math.hypot(dx,dy)||1,k=Math.min(1,d/(r.width*2.2));
      st.tx=dx/d*k; st.ty=dy/d*k; st.lastMove=performance.now();
    });
    document.addEventListener('mouseleave',()=>{st.tx=0;st.ty=0});
  }

  function heart(x){
    if(!hearts) return;
    const s=document.createElementNS(NS,'svg'); s.setAttribute('viewBox','0 0 24 24'); s.classList.add('heart');
    const p=document.createElementNS(NS,'path');
    p.setAttribute('d','M12 21s-7.5-4.6-9.6-9.1C.9 8.6 3 5 6.5 5c2 0 3.6 1.1 4.5 2.6.9-1.5 2.5-2.6 4.5-2.6C19 5 21.1 8.6 19.6 11.9 17.5 16.4 12 21 12 21z');
    p.setAttribute('fill','#0B0B0C'); s.appendChild(p);
    const sz=14+Math.random()*14; s.style.width=s.style.height=sz+'px';
    s.style.left=(x*100+(Math.random()-.5)*30)+'%'; s.style.top=(18+Math.random()*12)+'%';
    s.style.setProperty('--dx',(Math.random()-.5)*60+'px'); s.style.setProperty('--r',(Math.random()-.5)*30+'deg');
    s.style.animationDelay=Math.random()*.15+'s';
    hearts.appendChild(s); setTimeout(()=>s.remove(),1900);
  }

  if(wrap && ids.interactive!==false){
    wrap.addEventListener('pointerdown',e=>{
      if(st.force.pose==='sleep'){ setPose('idle'); return }
      const now=performance.now(), r=wrap.getBoundingClientRect(), fx=(e.clientX-r.left)/r.width;
      st.clicks=st.clicks.filter(t=>now-t<1500); st.clicks.push(now); st.squashT=1;
      if(st.clicks.length>=4){
        st.petting=now+1400; st.leanT=(fx-.5)*2; st.smileT=1;
        const n=2+(Math.random()<.5); for(let i=0;i<n;i++) heart(fx);
      } else if(st.clicks.length===1){
        // guiño
        st.openL=Math.random()<.7?0.08:1; st.openR=st.openL<0.5?1:0.08; st.smileT=.7;
        setTimeout(()=>{st.openL=1;st.openR=1;st.smileT=0},520);
      }
    });
    wrap.addEventListener('pointerenter',()=>{st.squashT=.4});
  }

  function setPose(name){
    st.force.pose=name==='idle'?null:name;
    st.openL=1; st.openR=1; st.smileT=0; st.squintT=0; st.sleepyT=0; st.tx=0; st.ty=0;
    if(name==='happy'){ st.smileT=1 }
    else if(name==='wink'){ st.openL=0.06; st.openR=1; st.smileT=.65; setTimeout(()=>{ if(st.force.pose==='wink'){ st.openL=1; st.smileT=0; st.force.pose=null } },900) }
    else if(name==='sleep'){ st.sleepyT=1; st.tx=0; st.ty=.4 }
    else if(name==='squint'){ st.squintT=1 }
    if(zzz) zzz.classList.toggle('on', name==='sleep');
  }

  function frame(now){
    if(now-st.lastMove>4000 && !st.force.pose){ st.tx*=.98; st.ty*=.98 }
    st.gx=L(st.gx, reduce?0:st.tx, .12); st.gy=L(st.gy, reduce?0:st.ty, .12);
    // blink v12 timings
    if(!st.force.pose && now>st.nextBlink && !st.blinkT && st.sleepyT<.5){ st.blinkT=now }
    if(st.blinkT){
      const t=(now-st.blinkT)/160;
      st.blink=t<.5?1-t*2*0.94:t<1?0.06+(t-.5)*2*0.94:1;
      if(t>=1){ st.blinkT=0; st.nextBlink=now+(Math.random()<.2?200:2800+Math.random()*3200) }
    }
    const isPet=now<st.petting; st.pet=L(st.pet,isPet?1:0,isPet?.12:.06);
    st.lean=L(st.lean,isPet?st.leanT:0,.08); st.squash=L(st.squash,st.squashT,.35); st.squashT*=.82;
    st.smile=L(st.smile, Math.max(st.smileT, st.pet*.85), .14);
    st.squint=L(st.squint, st.squintT, .12);
    st.sleepy=L(st.sleepy, st.sleepyT, .06);
    if(st.smileT>0 && !isPet && st.force.pose!=='happy' && st.force.pose!=='wink') st.smileT*=.96;
    const hop=isPet?Math.abs(Math.sin(now/170))*6*st.pet:0;
    const sway=isPet?Math.sin(now/420)*3*st.pet:0;
    const sx=1+st.squash*.04+st.pet*.03, sy=1-st.squash*.05+st.pet*.02;
    body.setAttribute('transform',`translate(0 ${-hop}) rotate(${st.lean*9+sway} 256 496) translate(256 496) scale(${sx} ${sy}) translate(-256 -496)`);
    const fX=st.gx, fY=st.gy+0.18*st.squint+0.35*st.sleepy;
    const gazeYaw=0.5*fX, gazePitch=0.42*fY;
    const joy=st.smile*(1-st.sleepy);
    const baseOpen=st.blink*(1-st.sleepy)*(1-0.55*st.squint)*(1-0.55*st.pet);
    eyeL.setAttribute('d', eyePath(-1, baseOpen*st.openL, joy, st.squint, st.sleepy, gazeYaw, gazePitch));
    eyeR.setAttribute('d', eyePath( 1, baseOpen*st.openR, joy, st.squint, st.sleepy, gazeYaw, gazePitch));
    if(zzz) zzz.classList.toggle('on', st.sleepy>.55);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  // reposo inicial
  eyeL.setAttribute('d', eyePath(-1,1,0,0,0,0,0));
  eyeR.setAttribute('d', eyePath( 1,1,0,0,0,0,0));
  return {setPose, st};
}

const hero=makeFace({svg:'minimoHero',body:'bodyHero',eyeL:'eyeLHero',eyeR:'eyeRHero',wrap:'charWrap',hearts:'hearts',zzz:'zzz',interactive:true});
const face2=makeFace({svg:'minimo2',body:'body2',eyeL:'eyeL2',eyeR:'eyeR2',wrap:'minimoCard',interactive:false});

const poseCtl=document.querySelector('.pose-ctl');
if(poseCtl){
  poseCtl.addEventListener('click',e=>{
    const b=e.target.closest('button'); if(!b) return;
    poseCtl.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));
    face2.setPose(b.dataset.pose);
  });
}

/* Copiar comando */
const btn=document.getElementById('copy');
btn.addEventListener('click',async()=>{
  const t=document.getElementById('cmd').textContent;
  try{await navigator.clipboard.writeText(t)}catch{
    const a=document.createElement('textarea'); a.value=t; document.body.appendChild(a); a.select(); document.execCommand('copy'); a.remove();
  }
  const st=document.getElementById('copyStatus');
  btn.classList.add('done'); st.textContent='Comando copiado';
  clearTimeout(btn._t); btn._t=setTimeout(()=>{btn.classList.remove('done'); st.textContent=''},1800);
});

/* Reveal + nav */
const rv=document.querySelectorAll('.rv');
if(reduce||!('IntersectionObserver' in window)) rv.forEach(e=>e.classList.add('in'));
else{
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in'); io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});
  rv.forEach(e=>io.observe(e));
}
const nav=document.querySelector('.nav');
const onS=()=>nav.classList.toggle('scrolled', scrollY>8);
addEventListener('scroll',onS,{passive:true}); onS();
})();
