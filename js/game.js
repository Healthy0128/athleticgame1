(() => {
'use strict';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const W = canvas.width, H = canvas.height;
const coinsEl = document.getElementById('coins');
const timeEl = document.getElementById('time');
const statusEl = document.getElementById('status');
const overlay = document.getElementById('startOverlay');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const muteBtn = document.getElementById('muteBtn');

const KENNEY = {
  idle: "https://raw.githubusercontent.com/ETdoFresh/kenney.nl/master/kenney_simplifiedplatformer/PNG/Characters/platformChar_idle.png",
  walk1: "https://raw.githubusercontent.com/ETdoFresh/kenney.nl/master/kenney_simplifiedplatformer/PNG/Characters/platformChar_walk1.png",
  walk2: "https://raw.githubusercontent.com/ETdoFresh/kenney.nl/master/kenney_simplifiedplatformer/PNG/Characters/platformChar_walk2.png",
  jump: "https://raw.githubusercontent.com/ETdoFresh/kenney.nl/master/kenney_simplifiedplatformer/PNG/Characters/platformChar_jump.png",
  happy: "https://raw.githubusercontent.com/ETdoFresh/kenney.nl/master/kenney_simplifiedplatformer/PNG/Characters/platformChar_happy.png",
  tile1: "https://raw.githubusercontent.com/ETdoFresh/kenney.nl/master/kenney_simplifiedplatformer/PNG/Tiles/platformPack_tile001.png",
  tile2: "https://raw.githubusercontent.com/ETdoFresh/kenney.nl/master/kenney_simplifiedplatformer/PNG/Tiles/platformPack_tile002.png",
  tile3: "https://raw.githubusercontent.com/ETdoFresh/kenney.nl/master/kenney_simplifiedplatformer/PNG/Tiles/platformPack_tile003.png",
  item1: "https://raw.githubusercontent.com/ETdoFresh/kenney.nl/master/kenney_simplifiedplatformer/PNG/Items/platformPack_item001.png"
};

const art = {};
for (const [name, src] of Object.entries(KENNEY)) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = src;
  art[name] = img;
}

const AUDIO_URLS = {
  bgm: "https://raw.githubusercontent.com/blancmathis/Super_Bash_Folds/main/public/assets/audio/open/music/battle-loop.ogg",
  jump: "https://raw.githubusercontent.com/blancmathis/Super_Bash_Folds/main/public/assets/audio/open/sfx/dodge.ogg",
  coin: "https://raw.githubusercontent.com/blancmathis/Super_Bash_Folds/main/public/assets/audio/open/sfx/item-pickup.ogg",
  stomp: "https://raw.githubusercontent.com/blancmathis/Super_Bash_Folds/main/public/assets/audio/open/sfx/hit-light.ogg",
  damage: "https://raw.githubusercontent.com/blancmathis/Super_Bash_Folds/main/public/assets/audio/open/sfx/hit-heavy.ogg",
  clear: "https://raw.githubusercontent.com/blancmathis/Super_Bash_Folds/main/public/assets/audio/open/sfx/game-set.ogg",
  land: "https://raw.githubusercontent.com/blancmathis/Super_Bash_Folds/main/public/assets/audio/open/sfx/land.ogg"
};

const realAudio = {};
for (const [name, src] of Object.entries(AUDIO_URLS)) {
  const a = new Audio(src);
  a.preload = "auto";
  a.crossOrigin = "anonymous";
  if (name === "bgm") {
    a.loop = true;
    a.volume = 0.24;
  } else {
    a.volume = 0.55;
  }
  realAudio[name] = a;
}

function playReal(name, volume){
  if(muted) return false;
  const base = realAudio[name];
  if(!base) return false;
  try{
    const a = base.cloneNode();
    a.volume = volume ?? base.volume;
    a.play().catch(()=>{});
    return true;
  }catch(e){
    return false;
  }
}

function startBgm(){
  if(muted) return;
  const bgm = realAudio.bgm;
  if(!bgm) return;
  bgm.volume = 0.24;
  bgm.play().catch(()=>{});
}

function stopBgm(){
  const bgm = realAudio.bgm;
  if(!bgm) return;
  bgm.pause();
  bgm.currentTime = 0;
}

const keys = Object.create(null);
let running = false;
let muted = false;
let startedAt = 0;
let elapsed = 0;
let cameraX = 0;
let last = performance.now();
let won = false;
let audioCtx = null;

const world = {
  width: 5600,
  gravity: 2400,
  platforms: [
    {x:0,y:620,w:900,h:120},{x:1040,y:620,w:520,h:120},{x:1700,y:620,w:640,h:120},
    {x:2500,y:620,w:700,h:120},{x:3360,y:620,w:520,h:120},{x:4050,y:620,w:680,h:120},
    {x:4910,y:620,w:690,h:120},{x:540,y:500,w:220,h:34},{x:900,y:430,w:180,h:34},
    {x:1240,y:350,w:210,h:34},{x:1580,y:450,w:170,h:34},{x:1980,y:390,w:230,h:34},
    {x:2350,y:310,w:160,h:34},{x:2780,y:470,w:230,h:34},{x:3210,y:380,w:190,h:34},
    {x:3600,y:300,w:220,h:34},{x:3970,y:420,w:200,h:34},{x:4380,y:340,w:200,h:34},
    {x:4700,y:250,w:160,h:34}
  ],
  coins: [],
  enemies: [
    {x:1370,y:574,w:42,h:46,dir:1,min:1120,max:1500,alive:true},
    {x:2140,y:574,w:42,h:46,dir:-1,min:1800,max:2290,alive:true},
    {x:2920,y:424,w:42,h:46,dir:1,min:2790,max:2970,alive:true},
    {x:4250,y:574,w:42,h:46,dir:-1,min:4070,max:4680,alive:true}
  ],
  goal: {x:5410,y:380,w:24,h:240}
};

for (const [x,y] of [[620,450],[970,380],[1300,300],[1650,400],[2030,340],[2400,260],[2850,420],[3270,330],[3660,250],[4030,370],[4440,290],[4750,200],[5120,560],[5220,560],[5320,560]]) world.coins.push({x,y,r:15,taken:false});

const player = {x:120,y:520,w:48,h:70,vx:0,vy:0,speed:430,jump:860,dash:690,onGround:false,face:1,coins:0,anim:0};

function reset(){
  player.x=120; player.y=520; player.vx=0; player.vy=0; player.coins=0;
  cameraX=0; won=false; elapsed=0; startedAt=performance.now();
  world.coins.forEach(c=>c.taken=false);
  world.enemies.forEach(e=>e.alive=true);
  statusEl.textContent='GO!';
  syncHud();
}

function start(){
  ensureAudio(); stopBgm(); reset(); running=true; overlay.classList.add('hidden'); startedAt=performance.now();
  startBgm(); playReal('jump',0.18) || blip(620,.05,'square',.025);
}

function ensureAudio(){
  if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)();
  if(audioCtx.state==='suspended') audioCtx.resume();
}

function blip(freq,dur=.08,type='sine',gain=.035,slide=0){
  if(muted) return;
  ensureAudio();
  const o=audioCtx.createOscillator(), g=audioCtx.createGain();
  o.type=type; o.frequency.setValueAtTime(freq,audioCtx.currentTime);
  if(slide) o.frequency.linearRampToValueAtTime(Math.max(30,freq+slide),audioCtx.currentTime+dur);
  g.gain.setValueAtTime(gain,audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+dur);
  o.connect(g).connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime+dur);
}

function rects(a,b){return a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y}

function update(dt){
  if(!running) return;
  if(!won) elapsed=(performance.now()-startedAt)/1000;
  let move=0;
  if(keys.ArrowLeft||keys.KeyA) move--;
  if(keys.ArrowRight||keys.KeyD) move++;
  player.face = move || player.face;
  const topSpeed=(keys.ShiftLeft||keys.ShiftRight)?player.dash:player.speed;
  player.vx += (move*topSpeed-player.vx)*Math.min(1,dt*12);
  if(!move) player.vx *= Math.pow(.0005,dt);
  player.vy += world.gravity*dt;
  player.x += player.vx*dt;
  player.x=Math.max(0,Math.min(world.width-player.w,player.x));
  player.y += player.vy*dt;
  player.onGround=false;

  for(const p of world.platforms){
    if(player.vy>=0 && player.x+player.w>p.x && player.x<p.x+p.w && player.y+player.h>=p.y && player.y+player.h-player.vy*dt<=p.y+6){
      player.y=p.y-player.h; player.vy=0; player.onGround=true;
    }
  }

  if((keys.Space||keys.KeyW||keys.ArrowUp) && player.onGround && !player._jumpLatch){
    player.vy=-player.jump; player.onGround=false; player._jumpLatch=true;
    playReal('jump',0.45) || blip(430,.09,'square',.03,180);
  }
  if(!(keys.Space||keys.KeyW||keys.ArrowUp)) player._jumpLatch=false;

  if(player.y>H+240){
    playReal('damage',0.48) || blip(100,.25,'sawtooth',.04,-50);
    player.x=Math.max(90,player.x-500); player.y=300; player.vy=0;
  }

  for(const c of world.coins){
    if(c.taken) continue;
    const dx=(player.x+player.w/2)-c.x, dy=(player.y+player.h/2)-c.y;
    if(dx*dx+dy*dy < 42*42){c.taken=true; player.coins++; playReal('coin',0.55) || blip(920,.06,'square',.025,420);}
  }

  for(const e of world.enemies){
    if(!e.alive) continue;
    e.x += e.dir*90*dt;
    if(e.x<e.min||e.x>e.max) e.dir*=-1;
    if(rects(player,e)){
      const stomp = player.vy>150 && player.y+player.h-15 < e.y+14;
      if(stomp){e.alive=false; player.vy=-520; playReal('stomp',0.52) || blip(180,.09,'square',.04,220);}
      else{playReal('damage',0.55) || blip(120,.18,'sawtooth',.04,-40); player.x=Math.max(20,player.x-180); player.y-=50; player.vx=-player.face*350; player.vy=-380;}
    }
  }

  if(player.x+player.w>world.goal.x && !won){
    won=true; running=false; statusEl.textContent='CLEAR!'; stopBgm();
    playReal('clear',0.62) || blip(660,.12,'square',.04,330);
    overlay.classList.remove('hidden');
    overlay.querySelector('h2').textContent='STAGE CLEAR!';
    overlay.querySelector('p').textContent=`${elapsed.toFixed(1)}秒 / COIN ${player.coins}`;
    startBtn.textContent='PLAY AGAIN';
  }

  cameraX += ((player.x-W*.38)-cameraX)*Math.min(1,dt*5);
  cameraX=Math.max(0,Math.min(world.width-W,cameraX));
  player.anim += Math.abs(player.vx)*dt*.025;
  syncHud();
}

function syncHud(){coinsEl.textContent=`COIN ${player.coins}`; timeEl.textContent=`TIME ${elapsed.toFixed(1)}`;}
function hill(x,y,r,far=false){ctx.fillStyle=far?'#82cfa9':'#5ebb83'; ctx.beginPath(); ctx.arc(x,y,r,Math.PI,0); ctx.fill();}

function draw(){
  const g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#75d6f2'); g.addColorStop(.68,'#dff8ff'); g.addColorStop(1,'#f8fbdf');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#fff';
  for(let i=0;i<12;i++){const x=((i*410-cameraX*.18)%1800+1800)%1800-250, y=80+(i%4)*80; cloud(x,y,1+(i%3)*.25);}
  for(let i=0;i<9;i++) hill(i*300-(cameraX*.23%300),590,180,true);
  for(let i=0;i<10;i++) hill(i*260-(cameraX*.36%260),625,150,false);
  ctx.save(); ctx.translate(-cameraX,0);
  for(const p of world.platforms) drawPlatform(p);
  for(const c of world.coins) if(!c.taken) drawCoin(c);
  for(const e of world.enemies) if(e.alive) drawEnemy(e);
  drawGoal(world.goal); drawPlayer(player); ctx.restore();
}

function cloud(x,y,s){ctx.save(); ctx.translate(x,y); ctx.scale(s,s); ctx.fillStyle='#ffffffdd'; ctx.beginPath(); ctx.arc(0,12,28,0,Math.PI*2); ctx.arc(35,0,38,0,Math.PI*2); ctx.arc(78,15,26,0,Math.PI*2); ctx.fillRect(0,10,78,30); ctx.fill(); ctx.restore();}

function drawPlatform(p){
  const tile = art.tile1;
  if(tile && tile.complete && tile.naturalWidth){
    const size = 96;
    for(let x=p.x; x<p.x+p.w; x+=size){
      const dw = Math.min(size, p.x+p.w-x);
      ctx.drawImage(tile,0,0,tile.naturalWidth,tile.naturalHeight,x,p.y,dw,Math.min(size,p.h));
      if(p.h>size){for(let y=p.y+size; y<p.y+p.h; y+=size){const dh=Math.min(size,p.y+p.h-y); const fill=art.tile2.complete?art.tile2:tile; ctx.drawImage(fill,0,0,fill.naturalWidth,fill.naturalHeight,x,y,dw,dh);}}
    }
    return;
  }
  ctx.fillStyle='#9a6034'; ctx.fillRect(p.x,p.y,p.w,p.h); ctx.fillStyle='#6bc34a'; ctx.fillRect(p.x,p.y,p.w,16);
}

function drawCoin(c){
  const img=art.item1;
  if(img&&img.complete&&img.naturalWidth){const pulse=1+Math.sin(performance.now()/160)*0.08; ctx.save(); ctx.translate(c.x,c.y); ctx.scale(pulse,pulse); ctx.drawImage(img,-26,-26,52,52); ctx.restore(); return;}
  ctx.save(); ctx.translate(c.x,c.y); ctx.fillStyle='#ffd23f'; ctx.beginPath(); ctx.arc(0,0,c.r,0,Math.PI*2); ctx.fill(); ctx.strokeStyle='#d79a00'; ctx.lineWidth=4; ctx.stroke(); ctx.restore();
}

function drawEnemy(e){ctx.save(); ctx.translate(e.x,e.y); ctx.fillStyle='#7f5af0'; roundRect(0,7,e.w,e.h-7,12); ctx.fill(); ctx.fillStyle='#fff'; ctx.fillRect(8,16,9,11); ctx.fillRect(26,16,9,11); ctx.fillStyle='#17223b'; ctx.fillRect(12,20,4,5); ctx.fillRect(29,20,4,5); ctx.fillStyle='#5b3abf'; ctx.fillRect(5,e.h-3,12,6); ctx.fillRect(25,e.h-3,12,6); ctx.restore();}
function drawGoal(g){ctx.fillStyle='#eff6ff'; ctx.fillRect(g.x,g.y,g.w,g.h); ctx.fillStyle='#ff4d6d'; ctx.beginPath(); ctx.moveTo(g.x+g.w,g.y+12); ctx.lineTo(g.x+g.w+120,g.y+48); ctx.lineTo(g.x+g.w,g.y+84); ctx.closePath(); ctx.fill(); ctx.fillStyle='#60452d'; ctx.fillRect(g.x-12,g.y+g.h-8,48,18);}

function drawPlayer(p){
  let img=art.idle;
  if(won&&art.happy.complete) img=art.happy; else if(!p.onGround&&art.jump.complete) img=art.jump; else if(Math.abs(p.vx)>45) img=(Math.floor(p.anim*2)%2===0?art.walk1:art.walk2);
  if(img&&img.complete&&img.naturalWidth){ctx.save(); ctx.translate(p.x+p.w/2,p.y+p.h/2); ctx.scale(p.face,1); const targetH=92; const targetW=targetH*(img.naturalWidth/img.naturalHeight); ctx.drawImage(img,-targetW/2,-targetH/2,targetW,targetH); ctx.restore(); return;}
  ctx.save(); ctx.translate(p.x+p.w/2,p.y+p.h/2); ctx.scale(p.face,1); ctx.fillStyle='#ff8fab'; roundRect(-22,-20,44,46,12); ctx.fill(); ctx.fillStyle='#ffe0bd'; ctx.beginPath(); ctx.arc(0,-25,19,0,Math.PI*2); ctx.fill(); ctx.restore();
}

function roundRect(x,y,w,h,r){ctx.beginPath(); ctx.roundRect(x,y,w,h,r);}
function loop(now){let dt=Math.min(.033,(now-last)/1000); last=now; update(dt); draw(); requestAnimationFrame(loop);}

addEventListener('keydown',e=>{keys[e.code]=true; if(['ArrowLeft','ArrowRight','ArrowUp','Space'].includes(e.code)) e.preventDefault();});
addEventListener('keyup',e=>{keys[e.code]=false});
document.querySelectorAll('[data-key]').forEach(btn=>{const code=btn.dataset.key; const on=e=>{e.preventDefault(); keys[code]=true; ensureAudio();}; const off=e=>{e.preventDefault(); keys[code]=false;}; btn.addEventListener('pointerdown',on); btn.addEventListener('pointerup',off); btn.addEventListener('pointercancel',off); btn.addEventListener('pointerleave',off);});

startBtn.addEventListener('click',()=>{overlay.querySelector('h2').textContent='Skybound Sprint'; overlay.querySelector('p').textContent='ゴール旗まで駆け抜けよう。'; startBtn.textContent='START'; start();});
restartBtn.addEventListener('click',start);
muteBtn.addEventListener('click',()=>{muted=!muted; muteBtn.textContent=muted?'SOUND OFF':'SOUND ON'; if(muted) realAudio.bgm.pause(); else if(running) startBgm();});
requestAnimationFrame(loop);
})();
