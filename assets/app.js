(() => {
  "use strict";
  const $ = (s,root=document) => root.querySelector(s);
  const gallery = $("#gallery"), modal=$("#exhibit-modal"), exp=$("#experiment");
  const labels = { machine:"装置 / DEVICE", simulation:"現象 / PHENOMENON", document:"記録 / DOCUMENT" };
  const modes = {oracle:"oracle",orbit:"orbit",clock:"clock",queue:"queue",bureau:"bureau",weather:"weather",machine:"machine",species:"species"};
  const basePath=location.pathname;
  let catalog=[], filter="all", query="", cleanup=[], current=null;
  const htmlSafe = s => String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  function rng(seed){let a=seed>>>0;return ()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};}
  function pick(list,r){return list[Math.floor(r()*list.length)];}
  function randInt(r,a,b){return a+Math.floor(r()*(b-a+1));}
  function addCleanup(fn){cleanup.push(fn);}
  function resetExperiment(){cleanup.forEach(fn=>{try{fn();}catch(_){}});cleanup=[];exp.replaceChildren();}
  function draw(){
    const shown=catalog.filter(x=>(filter==="all"||x.category===filter) && (x.title+x.description+x.id).toLowerCase().includes(query.toLowerCase()));
    gallery.replaceChildren();
    if(!shown.length){gallery.innerHTML='<div class="empty">NO MATCHES FOUND / お探しの無意味は存在しません。</div>';return;}
    shown.forEach((it,i)=>{
      const card=document.createElement("article");card.className="item";
      const artBg=it.colors&&it.colors[0]||"#233d2c";const fg=it.colors&&it.colors[1]||"#c2f161";
      card.innerHTML='<div class="item-art" style="--art-bg:'+htmlSafe(artBg)+'"><span class="art-index">NO. '+String(it.number).padStart(3,"0")+'</span><span class="glyph" style="color:'+htmlSafe(fg)+';--tilt:'+((it.seed%39)-19)+'deg">'+htmlSafe(it.glyph||"∅")+'</span><span class="art-decor">FIG. '+String(it.number).padStart(4,"0")+' / '+htmlSafe(it.mode.toUpperCase())+'</span></div>'+
        '<div class="item-bottom"><div class="item-meta"><span>'+htmlSafe(labels[it.category]||it.category)+'</span><span>'+htmlSafe(it.date||"UNKNOWN")+'</span></div><h3>'+htmlSafe(it.title)+'</h3><p>'+htmlSafe(it.description)+'</p><div class="item-foot"><span>OPEN THE EXPERIMENT</span><b>↗</b></div></div>';
      const btn=document.createElement("button");btn.className="item-open";btn.type="button";btn.setAttribute("aria-label",it.title+" を開く");btn.addEventListener("click",()=>openExhibit(it.id));card.appendChild(btn);gallery.appendChild(card);
    });
  }
  const mk=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
  function wrap(top,big,desc){const w=mk("div","exp-wrap");w.append(mk("p","exp-super",top));if(big)w.append(mk("div","exp-big",big));if(desc)w.append(mk("p","exp-desc",desc));exp.append(w);return w;}
  function button(parent,text,fn){const b=mk("button","exp-button",text);b.addEventListener("click",fn);parent.append(b);return b;}
  function oracle(it,r){
    const w=wrap("PREDICTION MACHINE / v0."+it.number,it.glyph,"この機械は何も予言しません。");
    const output=mk("div","exp-output","未来を読み込んでいます...");w.append(output);
    let count=0;
    const a=["明日の午後、","この部屋の片隅で、","存在しない火曜日に、","あなたが見ていない間に、","宇宙の事務室では、","約47秒後に、"];
    const b=["見知らぬ椅子が","逆向きの時計が","透明な職員が","ひと粒の疑問が","未提出の月が","小さな国境が"];
    const c=["ひっそりと退職します。","自分の影に謝罪します。","あなたの代わりに瞬きします。","新しい水曜日を発明します。","何事もなかったことになります。","ただ、そこにいます。"];
    button(w,"もう一度、無責任に予言する ↗",()=>{count++;output.textContent=pick(a,r)+pick(b,r)+pick(c,r);output.style.transform="rotate("+((r()-.5)*2).toFixed(2)+"deg)";});
    output.textContent=pick(a,r)+pick(b,r)+pick(c,r);
    w.append(mk("p","exp-desc","予言回数は測定中 / 正答率 0.00%"));
  }
  function orbit(it,r){
    const c=mk("canvas","exp-canvas");exp.append(c);const ctx=c.getContext("2d");if(!ctx)return;
    const parts=Array.from({length:92},(_,i)=>({x:r(),y:r(),vx:(r()-.5)*.001,vy:(r()-.5)*.001,size:r()*5+1,hue:r()*180+60,pulse:r()*6.28}));
    let width=1,height=1,t=0,raf=0,pointer={x:-1000,y:-1000};
    function size(){width=c.clientWidth||800;height=c.clientHeight||500;const ratio=Math.min(devicePixelRatio||1,2);c.width=width*ratio;c.height=height*ratio;ctx.setTransform(ratio,0,0,ratio,0,0);}size();window.addEventListener("resize",size);addCleanup(()=>window.removeEventListener("resize",size));
    const move=e=>{const q=c.getBoundingClientRect();pointer.x=e.clientX-q.left;pointer.y=e.clientY-q.top;};c.addEventListener("pointermove",move);
    const click=()=>{parts.forEach(p=>{p.vx+=(r()-.5)*.02;p.vy+=(r()-.5)*.02;});};c.addEventListener("click",click);
    function frame(){t++;ctx.fillStyle="#0c1718";ctx.fillRect(0,0,width,height);ctx.strokeStyle="#3a625a";ctx.lineWidth=.6;ctx.beginPath();ctx.arc(width/2,height/2,Math.min(width,height)*.29,0,Math.PI*2);ctx.stroke();
      parts.forEach((p,i)=>{let x=p.x*width,y=p.y*height;let dx=pointer.x-x,dy=pointer.y-y,d2=dx*dx+dy*dy;
        if(d2<16000&&d2>1){p.vx+=dx/Math.sqrt(d2)*-.000016;p.vy+=dy/Math.sqrt(d2)*-.000016;}
        const cx=width/2-x,cy=height/2-y;p.vx+=cx/Math.max(width,1)*.000004;p.vy+=cy/Math.max(height,1)*.000004;
        p.vx*=.991;p.vy*=.991;p.x+=p.vx+.0003*Math.cos(t/180+i);p.y+=p.vy+.0003*Math.sin(t/190+i);
        if(p.x<0||p.x>1)p.vx*=-1;if(p.y<0||p.y>1)p.vy*=-1;p.x=Math.max(0,Math.min(1,p.x));p.y=Math.max(0,Math.min(1,p.y));
        ctx.fillStyle="hsla("+p.hue+",80%,75%,"+(0.45+Math.sin(t*.03+p.pulse)*.25)+")";ctx.beginPath();ctx.arc(p.x*width,p.y*height,p.size,0,Math.PI*2);ctx.fill();
      });
      ctx.fillStyle="#91b09e";ctx.font="11px monospace";ctx.fillText("MOTION WITHOUT PURPOSE / CLICK TO DISTURB",18,height-20);raf=requestAnimationFrame(frame);
    }frame();addCleanup(()=>{cancelAnimationFrame(raf);c.removeEventListener("pointermove",move);c.removeEventListener("click",click);});
  }
  function clock(it,r){
    const w=wrap("UNRELIABLE CHRONOMETER",null,"正確な時刻はここには存在しません。");
    const d=mk("div","exp-display");w.append(d);const sub=mk("div","exp-output");w.append(sub);
    let offset=randInt(r,-9999,9999),tick=0,stopped=false;
    function update(){if(stopped)return;const now=new Date(Date.now()+offset*60000);d.textContent=now.toLocaleTimeString("ja-JP",{hour12:false,timeZone:"Asia/Tokyo"});
      sub.textContent="ただいまの誤差: "+(offset>0?"+":"")+offset+" 分 / 信頼度: "+randInt(r,0,3)+"%";tick++;}
    update();const timer=setInterval(update,1000);addCleanup(()=>clearInterval(timer));
    button(w,"時間を壊す ↗",()=>{offset+=randInt(r,-502,502);update();});
    button(w,"時計を停止する",()=>{stopped=!stopped;update();});
  }
  function queue(it,r){
    const w=wrap("INFINITE PROCESS / NO ESTIMATED ARRIVAL","…","完了する見込みのない進捗状況です。");
    const bar=mk("div","exp-meter");const fill=mk("div");bar.append(fill);w.append(bar);const desc=mk("div","exp-desc");w.append(desc);
    const names=["担当者を探索中","書類を転送中","存在意義を計算中","バックアップのバックアップを確認中","終了条件を検討中","完了通知を準備中","すべてを最初からやり直しています"];
    let value=randInt(r,2,17),n=0;function update(){n++;value+=r()*8-3;if(value>94)value=randInt(r,42,78);value=Math.max(1,value);fill.style.width=value.toFixed(1)+"%";desc.textContent=pick(names,r)+" / "+value.toFixed(2)+"%";}
    update();const timer=setInterval(update,1700);addCleanup(()=>clearInterval(timer));button(w,"最初からやり直す",()=>{value=0;update();});
  }
  function bureau(it,r){
    const w=wrap("ADMINISTRATIVE OFFICE / FORM 0-"+it.number,null,"以下の項目はすべて必須ではありません。");
    const form=mk("form","exp-form");
    const fields=[["申請する無意味の名称","text","例：消えた左手の手袋"],["緊急度","select",["極めて不要","やや不要","見なかったことにする"]],["審査希望日","text","存在しない曜日"]];
    fields.forEach(([label,type,arg])=>{const x=mk("label",null,label),input=mk(type==="select"?"select":"input");if(type==="select"){arg.forEach(y=>{const o=mk("option",null,y);input.append(o);});}else {input.type=type;input.placeholder=arg;}x.append(input);form.append(x);});
    const output=mk("div","exp-output");output.hidden=true;form.append(output);const submit=button(form,"正式に無視される申請を提出 ↗",()=>{});submit.type="submit";
    form.addEventListener("submit",e=>{e.preventDefault();const codes=["不受理","保留","未発見","受領したことを否認","記録のみ"];output.hidden=false;output.innerHTML='<div class="exp-stamp">'+htmlSafe(pick(codes,r))+'</div><br>受付番号：'+randInt(r,100000,999999)+'<br>理由：本件は重要すぎるため、扱いません。';});
    w.append(form);
  }
  function weather(it,r){
    const w=wrap("WEATHER DATA FROM NOWHERE",null,"観測地点：地図に掲載されていない場所");const temp=mk("div","exp-display");w.append(temp);
    const conditions=["書類の小雨","弱い自尊心","概念的な霧","深い無風","ときどき昨日","局所的な拍手","逆さまの積乱雲","心配性の快晴"];
    const result=mk("div","exp-output");w.append(result);let t=randInt(r,-34,48);
    function refresh(){t+=randInt(r,-11,12);temp.textContent=(t>0?"+":"")+t+"°?";result.textContent=pick(conditions,r)+" / 体感は個人差があります。";}
    refresh();button(w,"観測地点を移動する ↗",refresh);
    const clouds=mk("div",null,"☁ 　☁　　　☁");clouds.style.cssText="font-size:70px;color:#8eaf94;letter-spacing:8px;animation:float 6s infinite";w.insertBefore(clouds,temp);
  }
  function machine(it,r){
    const w=wrap("AUTOMATIC OUTPUT DEVICE",it.glyph,"押すたびに紙が無駄になります（比喩）。");
    const result=mk("div","exp-output","出力待機中 / READY");w.append(result);let n=0;
    const objects=["あなたの昨日","未完成の約束","エラーの気持ち","二番目の影","存在しない取扱説明書","誰にも届かない拍手","風の領収書","余った午後"];
    const actions=["について謝罪いたします。","の存在を承認いたしました。","を再起動しました。","を至急保管してください。","が正常に終了できませんでした。","の在庫はありません。"];
    button(w,"何かを出力する ↗",()=>{n++;result.textContent="NO. "+String(n).padStart(4,"0")+"\n─────────────\n"+pick(objects,r)+pick(actions,r)+"\n─────────────\n発行元：無意味博物館";result.style.whiteSpace="pre-line";});
  }
  function species(it,r){
    const c=mk("canvas","exp-canvas");exp.append(c);const ctx=c.getContext("2d");if(!ctx)return;
    const bodies=Array.from({length:24},(_,i)=>({x:r(),y:r(),vx:(r()-.5)*.002,vy:(r()-.5)*.002,sz:9+r()*21,angle:r()*6.28,legs:3+randInt(r,0,7),c:randInt(r,75,160)}));
    let width=1,height=1,raf=0,t=0;
    function size(){width=c.clientWidth||800;height=c.clientHeight||500;const ratio=Math.min(devicePixelRatio||1,2);c.width=width*ratio;c.height=height*ratio;ctx.setTransform(ratio,0,0,ratio,0,0);}size();window.addEventListener("resize",size);addCleanup(()=>window.removeEventListener("resize",size));
    const spawn=e=>{const q=c.getBoundingClientRect();const p=bodies[randInt(r,0,bodies.length-1)];p.x=(e.clientX-q.left)/width;p.y=(e.clientY-q.top)/height;p.sz=12+r()*29;};c.addEventListener("click",spawn);
    function frame(){t+=.015;ctx.fillStyle="#10201b";ctx.fillRect(0,0,width,height);
      bodies.forEach((p,i)=>{p.x+=p.vx+Math.sin(t+i)*.00016;p.y+=p.vy+Math.cos(t+i)*.00016;if(p.x<0||p.x>1)p.vx*=-1;if(p.y<0||p.y>1)p.vy*=-1;p.x=Math.max(0,Math.min(1,p.x));p.y=Math.max(0,Math.min(1,p.y));
        let x=p.x*width,y=p.y*height;ctx.save();ctx.translate(x,y);ctx.rotate(p.angle+Math.sin(t+i)*.3);ctx.fillStyle="hsl("+p.c+" 55% 65%)";ctx.strokeStyle="#d7eeb6";ctx.lineWidth=1.4;ctx.beginPath();
        for(let j=0;j<p.legs;j++){const a=Math.PI*2*j/p.legs;ctx.moveTo(Math.cos(a)*p.sz*.7,Math.sin(a)*p.sz*.7);ctx.lineTo(Math.cos(a)*(p.sz+9),Math.sin(a)*(p.sz+9));}ctx.stroke();ctx.beginPath();ctx.ellipse(0,0,p.sz*.65,p.sz*.48,0,0,Math.PI*2);ctx.fill();ctx.fillStyle="#09211a";ctx.beginPath();ctx.arc(-p.sz*.16,-p.sz*.05,2.8,0,7);ctx.arc(p.sz*.16,-p.sz*.05,2.8,0,7);ctx.fill();ctx.restore();});
      ctx.fillStyle="#89a990";ctx.font="11px monospace";ctx.fillText("LIFE FORMS: "+bodies.length+" / CLICK TO DISPLACE",18,height-20);raf=requestAnimationFrame(frame);
    }frame();addCleanup(()=>{cancelAnimationFrame(raf);c.removeEventListener("click",spawn);});
  }
  function openExhibit(id){
    const it=catalog.find(x=>x.id===id);if(!it)return;resetExperiment();current=it;
    $("#modal-code").textContent="MUSEUM / EXHIBIT "+String(it.number).padStart(3,"0");
    $("#modal-type").textContent=labels[it.category]||it.category;$("#modal-title").textContent=it.title;$("#modal-description").textContent=it.description;
    $("#modal-instruction").textContent=it.instruction||"PLEASE INTERACT. NOTHING IS EXPECTED.";
    modal.classList.add("is-open");modal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";history.replaceState(null,"",basePath+"?exhibit="+encodeURIComponent(it.id));
    const r=rng(it.seed);( {oracle,orbit,clock,queue,bureau,weather,machine,species}[it.mode]||oracle)(it,r);
    $("#close").focus();
  }
  function closeExhibit(){resetExperiment();current=null;modal.classList.remove("is-open");modal.setAttribute("aria-hidden","true");document.body.style.overflow="";history.replaceState(null,"",basePath);}
  const randomExhibit=()=>{if(catalog.length)openExhibit(catalog[Math.floor(Math.random()*catalog.length)].id);};
  $("#close").addEventListener("click",closeExhibit);$("#another").addEventListener("click",randomExhibit);$("#surprise").addEventListener("click",randomExhibit);
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&current)closeExhibit();});
  $("#filters").addEventListener("click",e=>{const b=e.target.closest("[data-filter]");if(!b)return;filter=b.dataset.filter;document.querySelectorAll(".chip").forEach(c=>c.classList.toggle("is-active",c===b));draw();});
  $("#search").addEventListener("input",e=>{query=e.target.value;draw();});
  const date=new Date();$("#date-jst").textContent=new Intl.DateTimeFormat("ja-JP",{timeZone:"Asia/Tokyo",month:"2-digit",day:"2-digit"}).format(date);
  $("#footer-year").textContent=new Intl.DateTimeFormat("en-US",{timeZone:"Asia/Tokyo",year:"numeric"}).format(date);
  $("#mood").textContent=["概ね良好","予測不能","ごく普通","何かがおかしい"][Math.floor(date.getHours()/6)];
  fetch("data/catalogue.json",{cache:"no-cache"}).then(resp=>{if(!resp.ok)throw Error("HTTP "+resp.status);return resp.json();}).then(data=>{
    catalog=(data.exhibits||[]).slice().sort((a,b)=>b.number-a.number);
    $("#total").textContent=String(catalog.length).padStart(3,"0");
    $("#lastupdate").textContent=data.updated||"UNKNOWN";draw();
    const id=new URLSearchParams(location.search).get("exhibit");if(id)openExhibit(id);
  }).catch(err=>{gallery.innerHTML='<div class="empty">展示目録を読み込めませんでした。再読み込みしてください。<br>'+htmlSafe(err.message)+'</div>';});
})();
