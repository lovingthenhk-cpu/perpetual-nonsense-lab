(() => {
 "use strict";
 const $=s=>document.querySelector(s);
 const STORE="museum-of-nothing-infinite-v1", STEP=9000, LIMIT=120;
 const A=["未観測の","透明な","右に傾いた","静かすぎる","昨日の","自由落下する","見送り専用の","機嫌の悪い","増殖する","切り離された","書きかけの","半永久的な","余っていた","誰にも見えない","形式上の","突然の","深海に似た","おおむね正しい"];
 const B=["正十二面体","証拠品","惑星","封筒","回転扉","遠心分離機","案内標識","余白","容器","観測記録","抽象彫刻","標本","立入禁止区域","記憶媒体","置き手紙","廊下","幾何学","返却物"];
 const labels=["CURVED PARADOX","UNAUTHORIZED ORBIT","PAPER ARCHITECTURE","FAILED DIMENSION","DUPLICATE GEOMETRY","UNSTABLE OBJECT"];
 let items=[], serial=0, paused=false, elapsed=0, prev=performance.now(),active=null;
 try{const d=JSON.parse(localStorage.getItem(STORE)||"{}");items=Array.isArray(d.items)?d.items.slice(-LIMIT):[];serial=Number(d.serial)||0;}catch(_){}
 const rand=seed=>{let a=seed>>>0;return ()=>{a+=0x6d2b79f5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};};
 const int=(r,a,b)=>a+Math.floor(r()*(b-a+1));const choose=(r,a)=>a[Math.floor(r()*a.length)];
 function save(){try{localStorage.setItem(STORE,JSON.stringify({items,serial}));}catch(_){}}
 function paint(canvas,it){
   const w=canvas.width,h=canvas.height,ctx=canvas.getContext("2d"),r=rand(it.seed),cx=w/2,cy=h/2,m=Math.min(w,h);
   const hue=(it.seed%360),scheme=(k,l=65,a=1)=>"hsla("+((hue+k+720)%360)+",75%,"+l+"%,"+a+")";
   ctx.fillStyle="#101c19";ctx.fillRect(0,0,w,h);
   const gradient=ctx.createRadialGradient(cx,cy,0,cx,cy,w*.78);gradient.addColorStop(0,scheme(-25,20,.7));gradient.addColorStop(1,"#0e1514");ctx.fillStyle=gradient;ctx.fillRect(0,0,w,h);
   ctx.strokeStyle="#e1ffe010";ctx.lineWidth=.8;
   for(let x=0;x<w;x+=w/22){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
   for(let y=0;y<h;y+=h/15){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
   ctx.save();ctx.translate(cx,cy);
   const kind=it.seed%6;
   if(kind===0){ // uncooperative orbital rings
     for(let i=0;i<30;i++){let rad=m*(.07+i*.015);ctx.save();ctx.rotate(r()*Math.PI);ctx.scale(1,.25+r()*.7);ctx.beginPath();ctx.ellipse(0,0,rad,rad*.7,0,0,Math.PI*2);ctx.strokeStyle=scheme(i*8,40+i%4*12,.23+r()*.55);ctx.lineWidth=.7+r()*2.3;ctx.stroke();ctx.restore();}
     ctx.beginPath();ctx.arc(0,0,m*.13,0,Math.PI*2);ctx.fillStyle=scheme(0,72);ctx.shadowColor=scheme(0,62);ctx.shadowBlur=40;ctx.fill();
   }else if(kind===1){ // layered angular ruins
     for(let i=0;i<37;i++){let sz=m*(.1+r()*.72),x=(r()-.5)*m*.55,y=(r()-.5)*m*.57;
       ctx.save();ctx.translate(x,y);ctx.rotate(r()*Math.PI*2);ctx.strokeStyle=scheme(i*13,42+r()*35,.75);ctx.lineWidth=1+r()*3;
       ctx.strokeRect(-sz*.5,-sz*.5,sz,sz*(.12+r()*.75));ctx.restore();}
   }else if(kind===2){ // ribbons
     for(let i=0;i<19;i++){ctx.beginPath();const shift=(i-9)*m*.043;
       for(let j=0;j<150;j++){const x=(j/149-.5)*w*.9,y=shift+Math.sin(j*.05+i*.3)*m*(.055+.04*r());if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
       ctx.strokeStyle=scheme(i*7,35+i%5*10,.9);ctx.lineWidth=1+i%4;ctx.stroke();}
   }else if(kind===3){ // insect diagram
     let arms=int(r,7,18);
     for(let i=0;i<arms;i++){const a=i*Math.PI*2/arms;
       ctx.save();ctx.rotate(a);let spread=m*(.24+r()*.21);ctx.strokeStyle=scheme(i*10,65,.8);ctx.lineWidth=1.5;
       ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(spread*.1,-spread*.6,spread*.5,spread*.6,spread,0);ctx.stroke();
       ctx.beginPath();ctx.arc(spread,0,3+r()*13,0,Math.PI*2);ctx.fillStyle=scheme(0,35+r()*45,.9);ctx.fill();ctx.restore();}
     ctx.beginPath();ctx.arc(0,0,m*.12,0,Math.PI*2);ctx.fillStyle=scheme(60,70);ctx.fill();
   }else if(kind===4){ // rationally impossible skyline
     for(let i=0;i<45;i++){const x=(i/44-.5)*w*.94,width=6+r()*22,height=m*(.04+r()*.7);
       ctx.fillStyle=scheme(i*9,18+r()*43,.8);ctx.fillRect(x,m*.38-height,width,height);
       ctx.strokeStyle=scheme(0,64,.5);ctx.strokeRect(x,m*.38-height,width,height);}
     for(let i=0;i<12;i++){ctx.beginPath();ctx.moveTo(-w*.47,m*.38-i*12);ctx.lineTo(w*.47,m*.38-i*12);ctx.strokeStyle=scheme(i*6,70,.32);ctx.stroke();}
   }else{ // contour chart of nowhere
     for(let i=0;i<55;i++){ctx.beginPath();const a=i*.19;const radius=4+i*5.8;
       for(let j=0;j<260;j++){let t=j/259*Math.PI*2,p=radius*(1+.16*Math.sin(t*5+a)+.07*Math.cos(t*11-a));
         let x=Math.cos(t)*p,y=Math.sin(t)*p*.72;if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
       ctx.closePath();ctx.strokeStyle=scheme(i*4,60,.19+i*.009);ctx.lineWidth=.9;ctx.stroke();}
   }
   ctx.restore();
   ctx.font=(w*.017)+"px monospace";ctx.fillStyle="#d2e3bf";ctx.textBaseline="top";ctx.fillText("FIG. "+String(it.id).padStart(6,"0"),w*.035,h*.055);
   ctx.fillText(labels[kind],w*.035,h*.91);ctx.textAlign="right";ctx.fillText("NO FUNCTION",w*.965,h*.055);ctx.textAlign="left";
   ctx.strokeStyle="#b5e38e";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(w*.035,h*.14);ctx.lineTo(w*.125,h*.14);ctx.moveTo(w*.035,h*.14);ctx.lineTo(w*.035,h*.19);ctx.moveTo(w*.965,h*.88);ctx.lineTo(w*.87,h*.88);ctx.moveTo(w*.965,h*.88);ctx.lineTo(w*.965,h*.82);ctx.stroke();
 }
 function card(it,prepend=false){const b=document.createElement("button");b.className="infinite-card";b.type="button";b.setAttribute("aria-label",it.title+" を拡大");
   const c=document.createElement("canvas");c.width=550;c.height=410;paint(c,it);b.append(c);
   const info=document.createElement("div");info.className="infinite-info";
   const top=document.createElement("div");top.className="ii-top";
   const no=document.createElement("span");no.textContent="ARTIFACT "+String(it.id).padStart(5,"0");
   const category=document.createElement("span");category.textContent=labels[it.seed%6];
   top.append(no,category);
   const title=document.createElement("h2");title.textContent=it.title;
   const desc=document.createElement("p");desc.textContent="生成 "+it.when+" / CLICK TO INSPECT";
   info.append(top,title,desc);b.append(info);b.addEventListener("click",()=>inspect(it));
   const grid=$("#infinite-grid");if(prepend)grid.prepend(b);else grid.append(b);
 }
 function add(){serial+=1;const seed=(Date.now()^Math.imul(serial,2654435761))>>>0,r=rand(seed);
   const it={id:serial,seed,title:choose(r,A)+choose(r,B),when:new Date().toLocaleTimeString("ja-JP")};
   items.unshift(it);items=items.slice(0,LIMIT);save();card(it,true);$("#live-count").textContent=String(serial).padStart(4,"0");
   const grid=$("#infinite-grid");while(grid.children.length>LIMIT)grid.lastElementChild.remove();
   if(active===null&&serial===1)$("#live-state").textContent="GENERATING / FIRST OBJECT ACQUIRED";
 }
 function inspect(it){active=it;$("#detail").classList.add("open");$("#detail-title").textContent=it.title;$("#detail-seed").textContent=String(it.id).padStart(5,"0");paint($("#detailcanvas"),it);$("#detail-close").focus();}
 function close(){active=null;$("#detail").classList.remove("open");}
 $("#detail-close").addEventListener("click",close);document.addEventListener("keydown",e=>{if(e.key==="Escape")close();});
 $("#make").addEventListener("click",()=>{add();elapsed=0;});
 $("#pause").addEventListener("click",()=>{paused=!paused;$("#pause").textContent=paused?"生成を再開":"一時停止";$("#live-state").textContent=paused?"PAUSED":"GENERATING";});
 $("#clear").addEventListener("click",()=>{if(!confirm("このブラウザに保存された展示履歴を消しますか？"))return;items=[];serial=0;save();$("#infinite-grid").replaceChildren();$("#live-count").textContent="0000";elapsed=0;add();});
 items.forEach(it=>card(it));$("#live-count").textContent=String(serial).padStart(4,"0");if(!items.length)add();
 function loop(now){const dt=Math.min(250,now-prev);prev=now;if(!paused){elapsed+=dt;if(elapsed>=STEP){elapsed%=STEP;add();}}$("#pulse").style.width=(elapsed/STEP*100).toFixed(2)+"%";requestAnimationFrame(loop);}
 requestAnimationFrame(loop);
})();
