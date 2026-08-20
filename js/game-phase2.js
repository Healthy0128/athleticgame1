(() => {
'use strict';
const SB=window.SB,D=window.SB_DATA;
if(!SB||!D)return;

const makeEnemy=(x,y,type,opt={})=>({x,y,w:44,h:44,type,dir:opt.dir||1,min:opt.min??x-120,max:opt.max??x+120,speed:opt.speed||95,alive:true,phase:0,baseY:y,fireEvery:opt.fireEvery||1.8,fireTimer:Math.random()*(opt.fireEvery||1.8),range:opt.range||520});

// Stage identity: enemies are traversal mechanics, not only damage sources.
D.stages[1].enemies.push(makeEnemy(1660,535,'charger',{min:1420,max:1880,speed:110,range:520}));
D.stages[2].enemies.push(makeEnemy(1760,300,'flyer',{min:1620,max:1880,speed:90}));
D.stages[3].enemies.push(makeEnemy(3360,365,'turret',{fireEvery:1.45,range:700}),makeEnemy(4250,225,'flyer',{min:4140,max:4440,speed:115}),makeEnemy(1120,425,'charger',{min:980,max:1380,speed:135,range:600}));
D.stages[4].enemies.push(makeEnemy(815,800,'turret',{fireEvery:1.55,range:680}),makeEnemy(350,545,'flyer',{min:180,max:520,speed:120}));

SB.projectiles=[];SB.chaseActive=false;SB.chaseLine=Infinity;SB.chasePulse=0;

const oldStart=SB.startStage;
SB.startStage=(i,opt)=>{oldStart(i,opt);SB.projectiles=[];SB.chaseActive=false;SB.chaseLine=Infinity;SB.chasePulse=0;};

const oldRespawn=SB.respawn;
SB.respawn=()=>{oldRespawn();if(SB.currentStage===4&&SB.chaseActive)SB.chaseLine=Math.min(SB.world.height-120,SB.player.y+650);};

const oldEnemies=SB.updateEnemies;
SB.updateEnemies=dt=>{
  for(const e of SB.world.enemies){
    if(!e.alive)continue;
    e.phase=(e.phase||0)+dt*2.6;
    if(e.type==='walker'||e.type==='bounce'){
      e.x+=e.dir*e.speed*dt;if(e.x<e.min||e.x>e.max){e.dir*=-1;e.x=Math.max(e.min,Math.min(e.max,e.x));}
      if(e.type==='bounce')e.y+=(Math.sin(e.phase)*0.8);
    } else if(e.type==='charger'){
      const p=SB.player,near=Math.abs((p.x+p.w/2)-(e.x+e.w/2))<(e.range||520)&&Math.abs(p.y-e.y)<170;
      const v=near?Math.max(260,e.speed*2.25):e.speed;
      if(near)e.dir=p.x<e.x?-1:1;
      e.x+=e.dir*v*dt;
      if(e.x<e.min||e.x>e.max){e.dir*=-1;e.x=Math.max(e.min,Math.min(e.max,e.x));}
    } else if(e.type==='flyer'){
      if(e.baseY==null)e.baseY=e.y;
      e.x+=e.dir*e.speed*dt;if(e.x<e.min||e.x>e.max){e.dir*=-1;e.x=Math.max(e.min,Math.min(e.max,e.x));}
      e.y=e.baseY+Math.sin(e.phase*1.35)*42;
    } else if(e.type==='turret'){
      e.fireTimer=(e.fireTimer??e.fireEvery)-dt;
      const p=SB.player,dx=(p.x+p.w/2)-(e.x+e.w/2),dy=(p.y+p.h/2)-(e.y+e.h/2),dist=Math.hypot(dx,dy);
      if(e.fireTimer<=0&&dist<(e.range||650)){
        e.fireTimer=e.fireEvery||1.7;const sp=270+SB.currentStage*20;
        SB.projectiles.push({x:e.x+e.w/2-6,y:e.y+e.h/2-6,w:12,h:12,vx:dx/dist*sp,vy:dy/dist*sp,life:4});
        SB.sfx('jump',.12);
      }
    }
  }
};

const oldHurt=SB.hurt;
SB.hurt=(...a)=>{const before=SB.hearts;oldHurt(...a);if(SB.currentStage===4&&SB.chaseActive&&SB.hearts<before&&SB.state!=='gameover')SB.chaseLine=Math.min(SB.world.height-100,SB.player.y+650);};

function projectileStep(dt){
  for(const b of SB.projectiles){
    b.life-=dt;b.x+=b.vx*dt;b.y+=b.vy*dt;
    if(b.life<=0)continue;
    if(SB.rect(SB.player,b)){b.life=0;SB.hurt();continue;}
    for(const q of SB.solids()){if(SB.rect(b,q)){b.life=0;break;}}
  }
  SB.projectiles=SB.projectiles.filter(b=>b.life>0&&b.x>-100&&b.x<SB.world.width+100&&b.y>-100&&b.y<SB.world.height+100);
}
function chaseStep(dt){
  if(SB.currentStage!==4||SB.state!=='play')return;
  const p=SB.player;
  if(!SB.chaseActive&&p.y<1050){SB.chaseActive=true;SB.chaseLine=Math.min(SB.world.height-60,p.y+760);SB.shake=8;SB.ui.status.textContent='STORM RISING!';SB.burst(p.x,p.y+300,18,'#d0ebff');}
  if(!SB.chaseActive)return;
  const speed=p.y<650?82:58;SB.chaseLine-=speed*dt;SB.chasePulse+=dt;
  if(p.y+p.h>SB.chaseLine)SB.hurt();
}
const oldUpdate=SB.update;
SB.update=dt=>{oldUpdate(dt);if(SB.state!=='play')return;projectileStep(Math.min(dt,.033));chaseStep(Math.min(dt,.033));};

const oldDraw=SB.draw;
SB.draw=()=>{
  oldDraw();if(!SB.world)return;const {ctx}=SB;
  ctx.save();ctx.translate(-SB.cameraX,-SB.cameraY);
  for(const e of SB.world.enemies){if(!e.alive)continue;
    if(e.type==='charger'){ctx.fillStyle='#ff922b';ctx.fillRect(e.x-5,e.y+8,8,26);ctx.fillRect(e.x+e.w-3,e.y+8,8,26);}
    if(e.type==='flyer'){ctx.strokeStyle='#e7f5ff';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(e.x-14,e.y+18);ctx.lineTo(e.x+5,e.y+8);ctx.moveTo(e.x+e.w+14,e.y+18);ctx.lineTo(e.x+e.w-5,e.y+8);ctx.stroke();}
    if(e.type==='turret'){ctx.fillStyle='#343a40';ctx.fillRect(e.x+12,e.y-10,20,22);ctx.fillRect(e.x+18,e.y-22,8,18);}
  }
  for(const b of SB.projectiles){ctx.fillStyle='#ff6b6b';ctx.beginPath();ctx.arc(b.x+6,b.y+6,7,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff3bf';ctx.beginPath();ctx.arc(b.x+6,b.y+6,3,0,Math.PI*2);ctx.fill();}
  if(SB.currentStage===4&&SB.chaseActive){
    const y=SB.chaseLine,g=ctx.createLinearGradient(0,y-90,0,y+180);g.addColorStop(0,'rgba(120,200,255,0)');g.addColorStop(.35,'rgba(80,160,220,.55)');g.addColorStop(1,'rgba(25,70,120,.92)');ctx.fillStyle=g;ctx.fillRect(0,y-90,SB.world.width,Math.max(180,SB.world.height-y+90));
    ctx.strokeStyle='rgba(255,255,255,.75)';ctx.lineWidth=5;ctx.beginPath();for(let x=0;x<SB.world.width;x+=40){const yy=y+Math.sin(x*.03+SB.chasePulse*7)*10;ctx.lineTo(x,yy);}ctx.stroke();
  }
  ctx.restore();
};
})();