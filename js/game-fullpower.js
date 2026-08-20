(() => {
'use strict';
const SB=window.SB,D=window.SB_DATA;if(!SB||!D)return;
const P=(x,y,w,h,type='solid',opt={})=>({x,y,w,h,type,...opt,baseX:x,baseY:y,active:true,timer:0});
const E=(x,y,type='walker',opt={})=>({x,y,w:44,h:44,type,dir:opt.dir||1,min:opt.min??x-120,max:opt.max??x+120,speed:opt.speed||95,alive:true,phase:0,baseY:y,fireEvery:opt.fireEvery||1.8,fireTimer:Math.random()*(opt.fireEvery||1.8),range:opt.range||520});
const C=(x,y)=>({x,y,r:13,taken:false}),S=(x,y)=>({x,y,r:21,taken:false}),CP=(x,y)=>({x,y,active:false}),H=(x,y,w,h)=>({x,y,w,h});
const mk=(name,rank,width,height,spawn,goal,platforms,coins,stars,enemies,checkpoints,hazards=[],extra={})=>({name,rank,width,height,spawn,goal,platforms,coins:coins.map(v=>C(...v)),stars:stars.map(v=>S(...v)),enemies,checkpoints:checkpoints.map(v=>CP(...v)),hazards,...extra});
if(D.stages.length<12){
D.stages.push(
mk('Storm Railway',[54,72,94],5200,720,[80,520],[5040,360,24,260],[P(0,620,820,120),P(900,620,700,120),P(1680,620,760,120),P(2520,620,680,120),P(3300,620,740,120),P(4140,620,1060,120),P(520,500,180,28,'moving',{axis:'x',range:120,speed:2.4}),P(1150,430,190,28),P(2050,480,170,28,'moving',{axis:'y',range:110,speed:2}),P(2860,400,180,28,'crumble'),P(3710,455,190,28),P(4460,380,190,28,'moving',{axis:'x',range:140,speed:2.5})],[[570,445],[1220,375],[2110,425],[2920,345],[3770,400],[4530,325]],[[760,550],[3040,330],[4770,310]],[E(1280,576,'charger',{min:1050,max:1500,speed:145}),E(2210,435,'flyer',{min:2040,max:2360,speed:125}),E(3820,576,'charger',{min:3440,max:3990,speed:160})],[[2620,555]],[],{theme:'rail',autoScroll:true}),
mk('Crystal Cavern',[62,82,108],4600,720,[70,520],[4440,330,24,290],[P(0,620,650,120),P(790,620,500,120),P(1440,620,520,120),P(2140,620,500,120),P(2820,620,500,120),P(3480,620,1120,120),P(580,470,160,28),P(930,380,150,28),P(1320,470,150,28),P(1710,350,150,28),P(2050,450,150,28),P(2470,340,150,28),P(2920,450,150,28),P(3300,330,150,28),P(3820,420,150,28),P(4170,300,170,28)],[[620,415],[980,325],[1760,295],[2520,285],[3350,275],[4230,245]],[[1160,525],[2710,515],[4020,250]],[E(1020,576,'walker',{min:820,max:1260,speed:125}),E(1800,305,'flyer',{min:1640,max:1930,speed:110}),E(3000,576,'charger',{min:2860,max:3260,speed:140})],[[2240,555]],[],{theme:'dark'}),
mk('Windy Peaks',[68,88,116],4900,720,[70,520],[4720,250,24,370],[P(0,620,540,120),P(720,540,190,28),P(1050,450,180,28),P(1380,360,170,28),P(1690,500,160,28),P(1990,390,160,28),P(2300,290,160,28),P(2630,470,160,28),P(2940,350,150,28),P(3260,250,150,28),P(3560,430,160,28),P(3890,320,160,28),P(4220,220,160,28),P(4520,620,380,120),P(940,190,52,430),P(1880,230,52,390),P(2790,180,52,440),P(3740,160,52,460)],[[780,485],[1110,395],[1440,305],[2050,335],[2360,235],[3000,295],[3950,265],[4280,165]],[[1500,300],[3330,190],[4590,540]],[E(820,495,'flyer',{min:740,max:900,speed:125}),E(2100,345,'flyer',{min:1980,max:2200,speed:140}),E(3980,275,'charger',{min:3890,max:4190,speed:150})],[[2460,555]],[],{theme:'wind'}),
mk('Flooded Temple',[72,94,122],4700,720,[70,520],[4520,280,24,340],[P(0,620,620,120),P(780,620,480,120),P(1420,620,500,120),P(2090,620,500,120),P(2760,620,500,120),P(3440,620,1260,120),P(520,470,150,28),P(900,390,160,28),P(1300,490,150,28),P(1680,370,160,28),P(2050,460,150,28),P(2470,340,150,28),P(2860,450,150,28),P(3270,350,150,28),P(3710,450,160,28),P(4100,330,170,28)],[[570,415],[960,335],[1740,315],[2530,285],[3330,295],[4170,275]],[[1180,540],[2700,525],[4300,270]],[E(1040,576,'walker',{min:820,max:1220,speed:120}),E(2320,300,'flyer',{min:2180,max:2500,speed:115}),E(3650,576,'charger',{min:3470,max:3980,speed:145})],[[2260,555]],[],{theme:'water'}),
mk('Gravity Lab',[76,98,128],5000,720,[60,520],[4820,240,24,380],[P(0,620,520,120),P(670,540,170,28),P(970,430,160,28),P(1260,300,160,28),P(1570,470,160,28),P(1880,340,160,28),P(2200,220,160,28),P(2540,480,160,28),P(2870,350,160,28),P(3190,230,160,28),P(3520,470,160,28),P(3860,330,160,28),P(4200,210,160,28),P(4550,620,450,120),P(870,170,52,450),P(1770,210,52,410),P(2740,160,52,460),P(3720,150,52,470)],[[730,485],[1030,375],[1320,245],[1940,285],[2260,165],[2930,295],[3920,275],[4260,155]],[[1480,410],[3390,170],[4650,540]],[E(1020,385,'flyer',{min:930,max:1160,speed:130}),E(2580,435,'bounce',{min:2550,max:2670,speed:125}),E(4000,285,'turret',{fireEvery:1.7,range:720})],[[2450,555]],[],{theme:'gravity'}),
mk('Sunset Escape',[72,92,118],5600,720,[70,520],[5420,320,24,300],[P(0,620,700,120),P(840,620,560,120),P(1540,620,600,120),P(2280,620,540,120),P(2960,620,620,120),P(3720,620,560,120),P(4420,620,1180,120),P(560,500,170,28,'crumble'),P(1080,420,170,28),P(1750,470,170,28,'moving',{axis:'y',range:100,speed:2}),P(2460,390,170,28,'crumble'),P(3220,460,170,28),P(3980,360,170,28,'moving',{axis:'x',range:140,speed:2.4}),P(4680,420,180,28)],[[610,445],[1140,365],[1810,415],[2520,335],[3280,405],[4040,305],[4750,365]],[[1380,545],[3520,545],[5100,360]],[E(1160,576,'charger',{min:900,max:1360,speed:160}),E(2500,345,'flyer',{min:2380,max:2660,speed:145}),E(3920,576,'charger',{min:3760,max:4200,speed:175}),E(4800,375,'turret',{fireEvery:1.4,range:760})],[[2820,555]],[],{theme:'escape',escape:true}),
mk('Final Ascent',[92,118,150],5800,1400,[70,1220],[5580,130,24,1110],[P(0,1320,720,80),P(850,1240,190,28),P(1160,1120,180,28,'moving',{axis:'y',range:100,speed:1.7}),P(1480,1010,170,28,'crumble'),P(1790,900,170,28),P(2100,780,170,28,'moving',{axis:'x',range:130,speed:2}),P(2430,920,170,28),P(2760,800,160,28,'crumble'),P(3090,680,160,28),P(3410,560,160,28,'moving',{axis:'y',range:100,speed:2.1}),P(3740,690,160,28),P(4070,570,160,28,'crumble'),P(4390,450,170,28),P(4720,330,170,28,'moving',{axis:'x',range:150,speed:2.4}),P(5050,240,180,28),P(5380,1320,420,80),P(760,760,55,560),P(1370,670,55,650),P(2290,520,55,800),P(3250,390,55,930),P(4210,260,55,1060),P(5180,160,55,1160)],[[920,1185],[1220,1065],[1840,845],[2160,725],[3150,625],[3470,505],[4450,395],[5110,185]],[[1600,930],[3920,520],[5480,180]],[E(1220,1075,'flyer',{min:1100,max:1320,speed:150}),E(2500,875,'charger',{min:2400,max:2670,speed:170}),E(3650,515,'turret',{fireEvery:1.3,range:760}),E(4770,285,'flyer',{min:4660,max:4920,speed:160})],[[2850,735],[4550,385]],[],{theme:'final',vertical:true,escape:true})
);
}
const TOTAL=D.stages.length;
if(SB.save.best?.[4]&&SB.save.unlocked<6)SB.save.unlocked=6;

// -------- Performance pass --------
let hudAt=0,hudCache='';const rawSync=SB.syncHud;
SB.syncHud=()=>{const now=performance.now();if(now-hudAt<90)return;hudAt=now;const sig=[SB.hearts,SB.currentStage,SB.player.stars,SB.player.coins,Math.floor(SB.elapsed*10),SB.world?.name].join('|');if(sig===hudCache)return;hudCache=sig;SB.ui.hearts.textContent='♥'.repeat(Math.max(0,SB.hearts))+'♡'.repeat(Math.max(0,3-SB.hearts));SB.ui.stage.textContent=`STAGE ${SB.currentStage+1}/${TOTAL}`;SB.ui.stars.textContent=`★ ${SB.player.stars}/3`;SB.ui.coins.textContent=`COIN ${SB.player.coins}`;SB.ui.time.textContent=`TIME ${SB.elapsed.toFixed(1)}`;SB.ui.status.textContent=SB.world?SB.world.name:'READY';};
SB.updateParticles=dt=>{let w=0;for(let i=0;i<SB.particles.length;i++){const p=SB.particles[i];p.life-=dt;if(p.life<=0)continue;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=650*dt;SB.particles[w++]=p;}SB.particles.length=w;};
const rawPlatforms=SB.updatePlatforms;SB._solidsCache=[];SB.updatePlatforms=(dt,t)=>{rawPlatforms(dt,t);SB._solidsCache.length=0;for(const p of SB.world.platforms)if(p.active)SB._solidsCache.push(p);};SB.solids=()=>SB._solidsCache;
let lastDraw=0;const rawDraw=SB.draw;SB.draw=()=>{const n=performance.now();if(n-lastDraw<14.5)return;lastDraw=n;rawDraw();};

// -------- Pooled audio + MaouDamashii BGM --------
const MAOU={
 field:'https://maou.audio/sound/bgm/maou_loop_bgm_8bit02.ogg',
 event:'https://maou.audio/sound/bgm/maou_loop_bgm_8bit03.ogg',
 battle:'https://maou.audio/sound/bgm/maou_loop_bgm_8bit07.ogg',
 storm:'https://maou.audio/sound/bgm/maou_loop_bgm_8bit21.ogg',
 ui:'https://maou.audio/sound/se/maou_se_system26.ogg',
 hit:'https://maou.audio/sound/se/maou_se_battle05.ogg'
};
const music={};for(const [k,url] of Object.entries(MAOU).filter(([k])=>['field','event','battle','storm'].includes(k))){const a=new Audio(url);a.preload='metadata';a.loop=true;a.volume=.18;music[k]=a;}
const chooseTrack=()=>{const t=SB.world?.theme;if(t==='rail'||t==='escape'||t==='final')return 'battle';if(t==='wind'||t==='water'||t==='dark')return 'event';if(SB.currentStage===4||t==='storm')return 'storm';return 'field';};
let currentTrack=null;SB.bgm=on=>{for(const a of Object.values(music))if(!on||a!==currentTrack)a.pause();if(!on||SB.muted||!SB.world)return;const next=music[chooseTrack()];if(currentTrack!==next){if(currentTrack)currentTrack.pause();currentTrack=next;}next.play().catch(()=>{});};
const pools={};function poolFor(name){if(pools[name])return pools[name];let url=SB.D.audio[name];if(name==='coin'||name==='clear')url=MAOU.ui;if(name==='stomp'||name==='damage')url=MAOU.hit;const arr=[];for(let i=0;i<4;i++){const a=new Audio(url);a.preload='auto';a.volume=.45;arr.push(a);}return pools[name]={arr,i:0};}
SB.sfx=(name,vol)=>{if(SB.muted)return;const p=poolFor(name);const a=p.arr[p.i++%p.arr.length];try{a.pause();a.currentTime=0;a.volume=vol??(name==='coin'?.38:.48);a.play().catch(()=>{});}catch{}};

// -------- Dynamic menus / progression --------
SB.showTitle=()=>{SB.state='title';SB.bgm(false);SB.ui.overlay.classList.remove('hidden');SB.ui.title.textContent='Skybound Sprint';SB.ui.text.textContent=`12ステージ。走る、登る、風に乗る、逃げる。全部を使いこなせ。`;SB.ui.result.classList.add('hidden');SB.ui.select.classList.add('hidden');SB.ui.menu.innerHTML='<button id="playNow">PLAY</button><button id="selectNow" class="secondary">STAGE SELECT</button><button id="ghostNow" class="secondary">GHOST: '+(SB.save.ghostOn?'ON':'OFF')+'</button>';document.getElementById('playNow').onclick=()=>SB.startStage(0);document.getElementById('selectNow').onclick=SB.showStageSelect;document.getElementById('ghostNow').onclick=()=>{SB.save.ghostOn=!SB.save.ghostOn;SB.persist();SB.showTitle();};};
SB.showStageSelect=()=>{SB.ui.select.innerHTML='';for(let i=0;i<TOTAL;i++){const b=document.createElement('button');b.className='stage-card'+(i>=SB.save.unlocked?' locked':'');const best=SB.save.best[i]?SB.save.best[i].toFixed(2)+'s':'--';b.innerHTML=`<b>${i+1}. ${D.stages[i].name}</b><small>BEST ${best} / ★ ${SB.save.stars[i]||0}/3</small>`;b.disabled=i>=SB.save.unlocked;b.onclick=()=>SB.startStage(i);SB.ui.select.appendChild(b);}SB.ui.select.classList.remove('hidden');};
SB.finishStage=()=>{if(SB.state!=='play')return;SB.state='result';SB.bgm(false);SB.sfx('clear');const t=SB.elapsed,rank=SB.rankFor(t,SB.world),k=String(SB.currentStage),old=SB.save.best[k],isBest=!old||t<old;SB.save.best[k]=isBest?t:old;if(isBest)SB.save.ghosts[k]=SB.ghostFrames.slice();SB.save.stars[k]=Math.max(SB.save.stars[k]||0,SB.player.stars);SB.save.unlocked=Math.max(SB.save.unlocked,Math.min(TOTAL,SB.currentStage+2));SB.persist();SB.ui.overlay.classList.remove('hidden');SB.ui.title.textContent='STAGE CLEAR!';SB.ui.text.textContent=SB.world.name;SB.ui.result.classList.remove('hidden');SB.ui.result.innerHTML=`<div class="rank">${rank}</div><div>TIME<br><b>${t.toFixed(2)}s</b>${isBest?'<br>NEW RECORD!':''}</div><div>STAR<br><b>${SB.player.stars}/3</b></div><div>NO DAMAGE<br><b>${SB.runDamage?'NO':'YES'}</b></div>`;SB.ui.menu.innerHTML=`<button id="nextNow">${SB.currentStage<TOTAL-1?'NEXT STAGE':'TITLE'}</button><button id="retryNow" class="secondary">RETRY</button>`;document.getElementById('nextNow').onclick=()=>SB.currentStage<TOTAL-1?SB.startStage(SB.currentStage+1):SB.showTitle();document.getElementById('retryNow').onclick=()=>SB.startStage(SB.currentStage);};

// -------- Stage-specific mechanics --------
SB.fp={waterY:Infinity,escapeX:-999,railX:0,lowGravity:false};
const rawStart=SB.startStage;SB.startStage=(i,opt)=>{rawStart(i,opt);SB.fp.waterY=Infinity;SB.fp.escapeX=-999;SB.fp.railX=0;SB.fp.lowGravity=false;SB._solidsCache=SB.world.platforms.filter(p=>p.active);SB.bgm(true);SB.syncHud();};
const rawUpdate=SB.update;SB.update=dt=>{rawUpdate(dt);if(SB.state!=='play'||!SB.world)return;dt=Math.min(dt,.033);const p=SB.player,t=SB.elapsed,theme=SB.world.theme;
 if(theme==='rail'){SB.fp.railX=Math.min(SB.world.width-SB.W,Math.max(0,t*72));if(p.x<SB.fp.railX+18)SB.hurt();}
 if(theme==='wind'){const zone=Math.floor(p.x/700)%4;if(zone===1)p.vx+=520*dt;else if(zone===2)p.vx-=520*dt;else if(zone===3)p.vy-=520*dt;}
 if(theme==='water'){SB.fp.waterY=510+Math.sin(t*.9)*120;if(p.y+p.h>SB.fp.waterY){p.vx*=.965;p.vy*=.975;}}
 if(theme==='gravity'){const phase=Math.floor(p.x/820)%3;if(phase===1)p.vy-=1150*dt;else if(phase===2)p.vy+=650*dt;}
 if(theme==='escape'||theme==='final'){const base=theme==='final'?62:105;SB.fp.escapeX=Math.max(-120,t*base-180);if(p.x<SB.fp.escapeX+20)SB.hurt();}
};
const baseCamera=SB.updateCamera;SB.updateCamera=dt=>{baseCamera(dt);if(SB.world?.theme==='rail')SB.cameraX=Math.max(SB.cameraX,SB.fp.railX);};
const drawBase=SB.draw;SB.draw=()=>{const n=performance.now();if(n-lastDraw<14.5)return;lastDraw=n;rawDraw();if(!SB.world)return;const c=SB.ctx,theme=SB.world.theme;c.save();
 if(theme==='dark'){c.fillStyle='rgba(2,8,20,.82)';c.fillRect(0,0,SB.W,SB.H);c.globalCompositeOperation='destination-out';const x=SB.player.x-SB.cameraX+SB.player.w/2,y=SB.player.y-SB.cameraY+SB.player.h/2,g=c.createRadialGradient(x,y,70,x,y,230);g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.beginPath();c.arc(x,y,230,0,Math.PI*2);c.fill();c.globalCompositeOperation='source-over';}
 if(theme==='wind'){c.strokeStyle='rgba(255,255,255,.45)';c.lineWidth=2;for(let i=0;i<16;i++){const y=(i*47+tmod()*23)%SB.H,x=((i*113+performance.now()*.18)%SB.W);c.beginPath();c.moveTo(x,y);c.lineTo(x+48,y-4);c.stroke();}}
 if(theme==='water'){const y=SB.fp.waterY-SB.cameraY;if(y<SB.H){c.fillStyle='rgba(60,150,220,.38)';c.fillRect(0,y,SB.W,SB.H-y);c.strokeStyle='rgba(220,245,255,.8)';c.lineWidth=4;c.beginPath();for(let x=0;x<SB.W;x+=20)c.lineTo(x,y+Math.sin(x*.04+SB.elapsed*4)*5);c.stroke();}}
 if(theme==='escape'||theme==='final'){const x=SB.fp.escapeX-SB.cameraX;if(x>-80){const g=c.createLinearGradient(x-100,0,x+80,0);g.addColorStop(0,'rgba(255,80,20,.95)');g.addColorStop(1,'rgba(255,160,20,.12)');c.fillStyle=g;c.fillRect(0,0,Math.max(0,x+80),SB.H);}}
 c.restore();};
function tmod(){return performance.now()*.001;}

// Credits preserved in runtime metadata for a future credits screen.
SB.credits=[
 'BGM / selected SFX: 魔王魂 (森田交一) https://maou.audio',
 'Graphics: Kenney / CC0',
 'Additional legacy SFX: Kenney / CC0'
];
SB.persist();
})();