(() => {
'use strict';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const W = canvas.width, H = canvas.height;
const coinsEl = document.getElementById('coins');
const timeEl = document.getElementById('time');
const statusEl = document.getElementById('status');
const heartsEl = document.getElementById('hearts');
const stageEl = document.getElementById('stage');
const overlay = document.getElementById('startOverlay');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const muteBtn = document.getElementById('muteBtn');
const controllerStatusEl = document.getElementById('controllerStatus');

const KENNEY = {
  idle: 'https://raw.githubusercontent.com/ETdoFresh/kenney.nl/master/kenney_simplifiedplatformer/PNG/Characters/platformChar_idle.png',
  walk1: 'https://raw.githubusercontent.com/ETdoFresh/kenney.nl/master/kenney_simplifiedplatformer/PNG/Characters/platformChar_walk1.png',
  walk2: 'https://raw.githubusercontent.com/ETdoFresh/kenney.nl/master/kenney_simplifiedplatformer/PNG/Characters/platformChar_walk2.png',
  jump: 'https://raw.githubusercontent.com/ETdoFresh/kenney.nl/master/kenney_simplifiedplatformer/PNG/Characters/platformChar_jump.png',
  happy: 'https://raw.githubusercontent.com/ETdoFresh/kenney.nl/master/kenney_simplifiedplatformer/PNG/Characters/platformChar_happy.png',
  tile1: 'https://raw.githubusercontent.com/ETdoFresh/kenney.nl/master/kenney_simplifiedplatformer/PNG/Tiles/platformPack_tile001.png',
  tile2: 'https://raw.githubusercontent.com/ETdoFresh/kenney.nl/master/kenney_simplifiedplatformer/PNG/Tiles/platformPack_tile002.png',
  item1: 'https://raw.githubusercontent.com/ETdoFresh/kenney.nl/master/kenney_simplifiedplatformer/PNG/Items/platformPack_item001.png'
};
const art = {};
for (const [name, src] of Object.entries(KENNEY)) {
  const img = new Image(); img.crossOrigin = 'anonymous'; img.src = src; art[name] = img;
}

const AUDIO_URLS = {
  bgm: 'https://raw.githubusercontent.com/blancmathis/Super_Bash_Folds/main/public/assets/audio/open/music/battle-loop.ogg',
  jump: 'https://raw.githubusercontent.com/blancmathis/Super_Bash_Folds/main/public/assets/audio/open/sfx/dodge.ogg',
  coin: 'https://raw.githubusercontent.com/blancmathis/Super_Bash_Folds/main/public/assets/audio/open/sfx/item-pickup.ogg',
  stomp: 'https://raw.githubusercontent.com/blancmathis/Super_Bash_Folds/main/public/assets/audio/open/sfx/hit-light.ogg',
  damage: 'https://raw.githubusercontent.com/blancmathis/Super_Bash_Folds/main/public/assets/audio/open/sfx/hit-heavy.ogg',
  clear: 'https://raw.githubusercontent.com/blancmathis/Super_Bash_Folds/main/public/assets/audio/open/sfx/game-set.ogg'
};
const realAudio = {};
for (const [name, src] of Object.entries(AUDIO_URLS)) {
  const a = new Audio(src); a.preload='auto'; a.crossOrigin='anonymous';
  a.volume = name === 'bgm' ? .22 : .55; if(name==='bgm') a.loop=true; realAudio[name]=a;
}
let audioCtx=null, muted=false;
function ensureAudio(){ if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)(); if(audioCtx.state==='suspended') audioCtx.resume(); }
function playReal(name, volume){ if(muted||!realAudio[name]) return false; try{const a=realAudio[name].cloneNode();a.volume=volume??realAudio[name].volume;a.play().catch(()=>{});return true;}catch{return false;} }
function startBgm(){ if(!muted) realAudio.bgm?.play().catch(()=>{}); }
function stopBgm(){ const a=realAudio.bgm;if(a){a.pause();a.currentTime=0;} }
function blip(freq,dur=.08,type='sine',gain=.03,slide=0){ if(muted)return;ensureAudio();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.setValueAtTime(freq,audioCtx.currentTime);if(slide)o.frequency.linearRampToValueAtTime(Math.max(30,freq+slide),audioCtx.currentTime+dur);g.gain.setValueAtTime(gain,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+dur);o.connect(g).connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+dur); }

const P=(x,y,w,h)=>({x,y,w,h});
const E=(x,y,min,max,speed=90)=>({x,y,w:42,h:46,dir:1,min,max,speed,alive:true});
const C=(x,y)=>({x,y,r:15,taken:false});

const STAGES = [
  {
    name:'Green Run', width:3600,height:720,spawn:{x:100,y:520}, goal:{x:3440,y:380,w:24,h:240},
    platforms:[P(0,620,760,120),P(900,620,720,120),P(1740,620,780,120),P(2660,620,940,120),P(520,510,180,30),P(980,480,190,30),P(1460,420,190,30),P(2040,500,200,30),P(2440,420,200,30),P(2920,480,210,30)],
    coins:[[580,455],[1040,425],[1520,365],[2100,445],[2500,365],[3000,425]].map(([x,y])=>C(x,y)),
    enemies:[E(1160,574,940,1540),E(2180,574,1780,2460)], vertical:false
  },
  {
    name:'Gap Factory', width:4300,height:720,spawn:{x:90,y:520},goal:{x:4140,y:350,w:24,h:270},
    platforms:[P(0,620,580,120),P(760,620,420,120),P(1360,620,470,120),P(2040,620,430,120),P(2700,620,420,120),P(3330,620,970,120),P(520,470,150,30),P(880,410,150,30),P(1540,470,150,30),P(2180,400,140,30),P(2840,455,150,30),P(3200,365,150,30),P(3640,470,160,30)],
    coins:[[560,415],[930,355],[1590,415],[2230,345],[2890,400],[3250,310],[3695,415]].map(([x,y])=>C(x,y)),
    enemies:[E(870,574,780,1140,110),E(1480,574,1380,1790,115),E(2160,574,2060,2430,120),E(3460,574,3360,4040,125)], vertical:false
  },
  {
    name:'Wall Kick Alley', width:4200,height:720,spawn:{x:90,y:520},goal:{x:4030,y:250,w:24,h:370},
    platforms:[P(0,620,680,120),P(820,620,520,120),P(1500,620,440,120),P(2100,620,510,120),P(2800,620,500,120),P(3480,620,720,120),P(640,300,70,320),P(790,220,70,400),P(1280,360,70,260),P(1450,250,70,370),P(1920,310,70,310),P(2070,200,70,420),P(2570,350,70,270),P(2760,230,70,390),P(3260,300,70,320),P(3440,190,70,430),P(1030,430,150,30),P(1690,410,150,30),P(2320,430,150,30),P(3000,410,150,30),P(3700,400,170,30)],
    coins:[[750,180],[1390,215],[2010,165],[2680,195],[3360,155],[3760,345]].map(([x,y])=>C(x,y)),
    enemies:[E(980,574,850,1300,120),E(2210,574,2120,2560,130),E(3620,574,3510,3970,140)], vertical:false
  },
  {
    name:'Precision Heights', width:4800,height:720,spawn:{x:70,y:520},goal:{x:4620,y:210,w:24,h:410},
    platforms:[P(0,620,480,120),P(650,560,170,30),P(970,470,150,30),P(1270,380,130,30),P(1560,500,120,30),P(1830,390,120,30),P(2100,300,120,30),P(2380,440,120,30),P(2670,340,110,30),P(2940,250,110,30),P(3220,410,110,30),P(3500,310,110,30),P(3780,220,110,30),P(4050,350,120,30),P(4340,270,130,30),P(4580,620,220,120),P(900,200,55,420),P(1450,250,55,370),P(2300,170,55,450),P(3150,220,55,400),P(3960,160,55,460)],
    coins:[[735,505],[1040,415],[1330,325],[1890,335],[2160,245],[2725,285],[2995,195],[3555,255],[3835,165],[4400,215]].map(([x,y])=>C(x,y)),
    enemies:[E(675,514,650,780,130),E(1580,454,1560,1640,135),E(2390,394,2380,2460,140),E(4070,304,4050,4130,145)], vertical:false
  },
  {
    name:'Sky Tower', width:1280,height:2700,spawn:{x:120,y:2530},goal:{x:1060,y:120,w:24,h:180},vertical:true,
    platforms:[
      P(0,2620,1280,80),P(80,2440,240,30),P(430,2320,220,30),P(770,2210,200,30),P(1010,2080,190,30),
      P(760,1930,180,30),P(470,1810,170,30),P(180,1690,170,30),P(60,1510,150,30),P(330,1390,160,30),
      P(620,1270,160,30),P(930,1150,160,30),P(1030,980,150,30),P(760,850,150,30),P(480,720,150,30),
      P(180,590,150,30),P(60,430,150,30),P(340,310,170,30),P(690,220,170,30),P(1000,300,180,30),
      P(0,2050,55,570),P(355,2050,55,430),P(690,1740,55,580),P(990,1450,55,630),P(250,1120,55,570),P(560,750,55,620),P(900,360,55,800)
    ],
    coins:[[200,2380],[540,2260],[860,2150],[1080,2020],[840,1870],[550,1750],[260,1630],[130,1450],[410,1330],[700,1210],[1010,1090],[1100,920],[830,790],[550,660],[250,530],[120,370],[420,250],[770,160]].map(([x,y])=>C(x,y)),
    enemies:[E(470,2274,440,620,115),E(780,2164,780,930,125),E(485,1764,480,610,135),E(940,1104,930,1050,140),E(490,674,480,600,145)], vertical:true
  }
];

const keys=Object.create(null);
const pad={left:false,right:false,jump:false,connected:false,index:null};
let running=false, won=false, gameOver=false, currentStage=0, hearts=3, elapsed=0, stageStartedAt=0, cameraX=0,cameraY=0,last=performance.now();
let world=null;
const player={x:0,y:0,w:48,h:70,vx:0,vy:0,speed:420,dashSpeed:720,jump:860,onGround:false,wallLeft:false,wallRight:false,face:1,coins:0,anim:0,invuln:0,dashUntil:0,_jumpLatch:false};
const tapState={dir:0,lastTime:0,armed:false};
let prevMoveDir=0;

function cloneStage(i){
  const s=STAGES[i];
  return {...s,platforms:s.platforms.map(p=>({...p})),coins:s.coins.map(c=>({...c})),enemies:s.enemies.map(e=>({...e}))};
}
function loadStage(i, preserveHearts=true){
  currentStage=i; world=cloneStage(i); if(!preserveHearts) hearts=3;
  player.x=world.spawn.x;player.y=world.spawn.y;player.vx=0;player.vy=0;player.coins=0;player.invuln=0;player.dashUntil=0;
  cameraX=0;cameraY=world.vertical?Math.max(0,world.height-H):0;won=false;gameOver=false;elapsed=0;stageStartedAt=performance.now();
  statusEl.textContent=world.name; syncHud();
}
function startGame(){ ensureAudio();stopBgm();hearts=3;loadStage(0,true);running=true;overlay.classList.add('hidden');startBgm(); }
function restartStage(){ if(gameOver){startGame();return;} loadStage(currentStage,true);running=true;overlay.classList.add('hidden');startBgm(); }

function pollGamepad(){
  const pads=navigator.getGamepads?navigator.getGamepads():[];let gp=pad.index!==null?pads[pad.index]:null;
  if(!gp){gp=Array.from(pads).find(Boolean)||null;pad.index=gp?gp.index:null;}
  if(!gp){pad.left=pad.right=pad.jump=false;return;}
  const x=gp.axes?.[0]??0;pad.left=x<-.35||!!gp.buttons?.[14]?.pressed;pad.right=x>.35||!!gp.buttons?.[15]?.pressed;pad.jump=!!gp.buttons?.[0]?.pressed;
}
window.addEventListener('gamepadconnected',e=>{pad.connected=true;pad.index=e.gamepad.index;if(controllerStatusEl){controllerStatusEl.textContent=`Xbox接続: ${e.gamepad.id}`;controllerStatusEl.classList.add('controller-on');}});
window.addEventListener('gamepaddisconnected',e=>{if(pad.index===e.gamepad.index){pad.connected=false;pad.index=null;if(controllerStatusEl){controllerStatusEl.textContent='スマホ / キーボード / Xboxコントローラー対応';controllerStatusEl.classList.remove('controller-on');}}});

function effectiveMove(){let d=0;if(keys.ArrowLeft||keys.KeyA||pad.left)d--;if(keys.ArrowRight||keys.KeyD||pad.right)d++;return Math.sign(d);}
function processDoubleTapDash(dir){
  const now=performance.now();
  if(dir!==0 && prevMoveDir===0){
    if(tapState.dir===dir && now-tapState.lastTime<270){ player.dashUntil=now+650; player.face=dir; playReal('jump',.2)||blip(300,.05,'square',.02,180); tapState.lastTime=0;tapState.dir=0; }
    else {tapState.dir=dir;tapState.lastTime=now;}
  }
  prevMoveDir=dir;
}
function isDashing(){return performance.now()<player.dashUntil;}

function damage(reason='hit'){
  if(player.invuln>0||gameOver)return;
  hearts--;player.invuln=1.1;playReal('damage',.55)||blip(120,.18,'sawtooth',.04,-40);syncHud();
  if(hearts<=0){
    running=false;gameOver=true;stopBgm();overlay.classList.remove('hidden');overlay.querySelector('h2').textContent='GAME OVER';overlay.querySelector('p').textContent=`STAGE ${currentStage+1} / ${world.name}`;startBtn.textContent='RETRY FROM STAGE 1';return;
  }
  player.x=world.spawn.x;player.y=world.spawn.y;player.vx=0;player.vy=0;cameraX=0;cameraY=world.vertical?Math.max(0,world.height-H):0;
}
function rects(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}

function update(dt){
  if(!running)return;elapsed=(performance.now()-stageStartedAt)/1000;pollGamepad();if(player.invuln>0)player.invuln-=dt;
  const move=effectiveMove();processDoubleTapDash(move);if(move)player.face=move;
  const targetSpeed=(isDashing()?player.dashSpeed:player.speed)*move;
  player.vx+=(targetSpeed-player.vx)*Math.min(1,dt*(isDashing()?18:12));if(!move)player.vx*=Math.pow(.0005,dt);

  player.wallLeft=player.wallRight=false;
  const oldX=player.x;player.x+=player.vx*dt;
  for(const p of world.platforms){
    if(player.y+player.h<=p.y+4||player.y>=p.y+p.h-4)continue;
    if(player.vx>0 && oldX+player.w<=p.x+6 && player.x+player.w>=p.x){player.x=p.x-player.w;player.vx=0;player.wallRight=true;}
    else if(player.vx<0 && oldX>=p.x+p.w-6 && player.x<=p.x+p.w){player.x=p.x+p.w;player.vx=0;player.wallLeft=true;}
  }
  if(player.x<0){player.x=0;player.wallLeft=true;}if(player.x+player.w>world.width){player.x=world.width-player.w;player.wallRight=true;}

  player.vy+=2400*dt;const oldY=player.y;player.y+=player.vy*dt;player.onGround=false;
  for(const p of world.platforms){
    if(player.x+player.w<=p.x+4||player.x>=p.x+p.w-4)continue;
    if(player.vy>=0&&oldY+player.h<=p.y+7&&player.y+player.h>=p.y){player.y=p.y-player.h;player.vy=0;player.onGround=true;}
    else if(player.vy<0&&oldY>=p.y+p.h-7&&player.y<=p.y+p.h){player.y=p.y+p.h;player.vy=20;}
  }

  const jumpHeld=keys.Space||keys.KeyW||keys.ArrowUp||pad.jump;
  if(jumpHeld&&!player._jumpLatch){
    if(player.onGround){player.vy=-player.jump;player._jumpLatch=true;playReal('jump',.45)||blip(430,.09,'square',.03,180);}
    else if(player.wallLeft||player.wallRight){const away=player.wallLeft?1:-1;player.vx=away*560;player.vy=-player.jump*.92;player.face=away;player.dashUntil=0;player._jumpLatch=true;playReal('jump',.48)||blip(520,.1,'square',.035,220);}
  }
  if(!jumpHeld)player._jumpLatch=false;

  if(player.y>world.height+180){damage('fall');return;}

  for(const c of world.coins){if(c.taken)continue;const dx=(player.x+player.w/2)-c.x,dy=(player.y+player.h/2)-c.y;if(dx*dx+dy*dy<42*42){c.taken=true;player.coins++;playReal('coin',.55)||blip(920,.06,'square',.025,420);}}
  for(const e of world.enemies){if(!e.alive)continue;e.x+=e.dir*e.speed*dt;if(e.x<e.min||e.x>e.max)e.dir*=-1;if(rects(player,e)){const stomp=player.vy>160&&player.y+player.h-14<e.y+16;if(stomp){e.alive=false;player.vy=-520;playReal('stomp',.52)||blip(180,.09,'square',.04,220);}else{damage('enemy');return;}}}

  if(rects(player,world.goal)) completeStage();

  const tx=player.x-W*.38;cameraX+=(tx-cameraX)*Math.min(1,dt*5);cameraX=Math.max(0,Math.min(Math.max(0,world.width-W),cameraX));
  if(world.vertical){const ty=player.y-H*.62;cameraY+=(ty-cameraY)*Math.min(1,dt*5);cameraY=Math.max(0,Math.min(world.height-H,cameraY));}
  else cameraY=0;
  player.anim+=Math.abs(player.vx)*dt*.025;syncHud();
}

function completeStage(){
  if(won)return;won=true;running=false;stopBgm();playReal('clear',.62)||blip(660,.12,'square',.04,330);overlay.classList.remove('hidden');
  if(currentStage<STAGES.length-1){overlay.querySelector('h2').textContent=`STAGE ${currentStage+1} CLEAR!`;overlay.querySelector('p').textContent=`${elapsed.toFixed(1)}秒 / COIN ${player.coins} / ♥ ${hearts}`;startBtn.textContent='NEXT STAGE';startBtn.dataset.action='next';}
  else{overlay.querySelector('h2').textContent='ALL STAGES CLEAR!';overlay.querySelector('p').textContent=`Sky Tower 制覇！ ${elapsed.toFixed(1)}秒 / ♥ ${hearts}`;startBtn.textContent='PLAY AGAIN';startBtn.dataset.action='restart';}
}

function syncHud(){coinsEl.textContent=`COIN ${player.coins}`;timeEl.textContent=`TIME ${elapsed.toFixed(1)}`;heartsEl.textContent='♥'.repeat(hearts)+'♡'.repeat(3-hearts);stageEl.textContent=`STAGE ${currentStage+1}/5`;}
function hill(x,y,r,far=false){ctx.fillStyle=far?'#82cfa9':'#5ebb83';ctx.beginPath();ctx.arc(x,y,r,Math.PI,0);ctx.fill();}
function draw(){
  const palette=currentStage===4?['#345995','#9ad8ff','#f4f1de']:['#75d6f2','#dff8ff','#f8fbdf'];const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,palette[0]);g.addColorStop(.68,palette[1]);g.addColorStop(1,palette[2]);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#ffffffcc';for(let i=0;i<10;i++){const x=((i*410-cameraX*.15)%1700+1700)%1700-200,y=90+(i%4)*90;cloud(x,y,1+(i%3)*.2);}
  if(!world?.vertical){for(let i=0;i<9;i++)hill(i*300-(cameraX*.2%300),590,180,true);for(let i=0;i<10;i++)hill(i*260-(cameraX*.33%260),625,150,false);}
  if(!world)return;
  ctx.save();ctx.translate(-cameraX,-cameraY);for(const p of world.platforms)drawPlatform(p);for(const c of world.coins)if(!c.taken)drawCoin(c);for(const e of world.enemies)if(e.alive)drawEnemy(e);drawGoal(world.goal);drawPlayer(player);ctx.restore();
  if(world.vertical){ctx.fillStyle='#ffffffd9';ctx.font='800 22px system-ui';ctx.fillText('↑ SKY TOWER ↑',24,42);}
}
function cloud(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='#ffffffdd';ctx.beginPath();ctx.arc(0,12,28,0,Math.PI*2);ctx.arc(35,0,38,0,Math.PI*2);ctx.arc(78,15,26,0,Math.PI*2);ctx.fillRect(0,10,78,30);ctx.fill();ctx.restore();}
function drawPlatform(p){const tile=art.tile1;if(tile?.complete&&tile.naturalWidth){const size=96;for(let x=p.x;x<p.x+p.w;x+=size){for(let y=p.y;y<p.y+p.h;y+=size){const dw=Math.min(size,p.x+p.w-x),dh=Math.min(size,p.y+p.h-y);const fill=(y>p.y&&art.tile2?.complete)?art.tile2:tile;ctx.drawImage(fill,0,0,fill.naturalWidth,fill.naturalHeight,x,y,dw,dh);}}return;}ctx.fillStyle='#9a6034';ctx.fillRect(p.x,p.y,p.w,p.h);ctx.fillStyle='#6bc34a';ctx.fillRect(p.x,p.y,p.w,14);}
function drawCoin(c){const img=art.item1;if(img?.complete&&img.naturalWidth){const pulse=1+Math.sin(performance.now()/160)*.08;ctx.save();ctx.translate(c.x,c.y);ctx.scale(pulse,pulse);ctx.drawImage(img,-26,-26,52,52);ctx.restore();return;}ctx.fillStyle='#ffd23f';ctx.beginPath();ctx.arc(c.x,c.y,c.r,0,Math.PI*2);ctx.fill();}
function drawEnemy(e){ctx.save();ctx.translate(e.x,e.y);ctx.fillStyle='#7f5af0';ctx.beginPath();ctx.roundRect(0,7,e.w,e.h-7,12);ctx.fill();ctx.fillStyle='#fff';ctx.fillRect(8,16,9,11);ctx.fillRect(26,16,9,11);ctx.fillStyle='#17223b';ctx.fillRect(12,20,4,5);ctx.fillRect(29,20,4,5);ctx.restore();}
function drawGoal(g){ctx.fillStyle='#eff6ff';ctx.fillRect(g.x,g.y,g.w,g.h);ctx.fillStyle='#ff4d6d';ctx.beginPath();ctx.moveTo(g.x+g.w,g.y+12);ctx.lineTo(g.x+g.w+110,g.y+48);ctx.lineTo(g.x+g.w,g.y+84);ctx.closePath();ctx.fill();}
function drawPlayer(p){if(p.invuln>0&&Math.floor(performance.now()/80)%2===0)return;let img=art.idle;if(won&&art.happy?.complete)img=art.happy;else if(!p.onGround&&art.jump?.complete)img=art.jump;else if(Math.abs(p.vx)>45)img=Math.floor(p.anim*2)%2===0?art.walk1:art.walk2;if(img?.complete&&img.naturalWidth){ctx.save();ctx.translate(p.x+p.w/2,p.y+p.h/2);ctx.scale(p.face,1);const th=92,tw=th*(img.naturalWidth/img.naturalHeight);ctx.drawImage(img,-tw/2,-th/2,tw,th);ctx.restore();return;}ctx.fillStyle='#ff8fab';ctx.fillRect(p.x,p.y,p.w,p.h);}
function loop(now){const dt=Math.min(.033,(now-last)/1000);last=now;update(dt);draw();requestAnimationFrame(loop);}

addEventListener('keydown',e=>{keys[e.code]=true;if(['ArrowLeft','ArrowRight','ArrowUp','Space'].includes(e.code))e.preventDefault();});
addEventListener('keyup',e=>{keys[e.code]=false;});
document.querySelectorAll('[data-key]').forEach(btn=>{const code=btn.dataset.key;const on=e=>{e.preventDefault();keys[code]=true;btn.classList.add('pressed');try{btn.setPointerCapture(e.pointerId);}catch{}ensureAudio();};const off=e=>{e.preventDefault();keys[code]=false;btn.classList.remove('pressed');try{btn.releasePointerCapture(e.pointerId);}catch{}};btn.addEventListener('pointerdown',on);btn.addEventListener('pointerup',off);btn.addEventListener('pointercancel',off);btn.addEventListener('lostpointercapture',off);btn.addEventListener('contextmenu',e=>e.preventDefault());});

startBtn.addEventListener('click',()=>{ensureAudio();const action=startBtn.dataset.action;if(action==='next'){loadStage(currentStage+1,true);running=true;overlay.classList.add('hidden');startBtn.dataset.action='';startBgm();return;}overlay.querySelector('h2').textContent='Skybound Sprint';overlay.querySelector('p').textContent='5ステージを攻略しよう。方向キー2連打でダッシュ、壁際でジャンプすると壁キック。';startBtn.textContent='START';startBtn.dataset.action='';startGame();});
restartBtn.addEventListener('click',restartStage);
muteBtn.addEventListener('click',()=>{muted=!muted;muteBtn.textContent=muted?'SOUND OFF':'SOUND ON';if(muted)realAudio.bgm.pause();else if(running)startBgm();});

loadStage(0,false);requestAnimationFrame(loop);
})();

document.addEventListener('gesturestart',e=>e.preventDefault(),{passive:false});
document.addEventListener('gesturechange',e=>e.preventDefault(),{passive:false});
document.addEventListener('gestureend',e=>e.preventDefault(),{passive:false});
