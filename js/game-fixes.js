(() => {
'use strict';
const SB=window.SB;
if(!SB)return;

// Fix: the base engine resets player.onGround before collideY(), so its
// original "just landed" check fires every grounded frame. That repeatedly
// clones/plays landing audio and spawns particles, which can tank Safari FPS.
SB._groundedLastFrame=false;
const originalCollideY=SB.collideY;
SB.collideY=prevY=>{
  const p=SB.player;
  let landed=false;
  for(const q of SB.solids()){
    if(!SB.rect(p,q))continue;
    if(p.vy>=0&&prevY+p.h<=q.y+10){
      p.y=q.y-p.h;
      p.vy=0;
      landed=true;
      if(q.type==='crumble'&&!q.timer)q.timer=.35;
    }else if(p.vy<0&&prevY>=q.y+q.h-8){
      p.y=q.y+q.h;
      p.vy=0;
    }
  }

  const justLanded=landed&&!SB._groundedLastFrame;
  p.onGround=landed;
  if(landed)p.coyote=.12;

  if(justLanded){
    SB.sfx('land',.16);
    SB.burst(p.x+p.w/2,p.y+p.h,4,'#fff');
  }
  SB._groundedLastFrame=landed;
};

// Reset grounded transition state whenever player position is forcibly reset.
const originalResetPlayer=SB.resetPlayer;
SB.resetPlayer=(...args)=>{
  SB._groundedLastFrame=false;
  return originalResetPlayer(...args);
};

// Defensive caps for mobile Safari: keep transient effects bounded even if a
// future gameplay bug starts spawning too much again.
const originalBurst=SB.burst;
SB.burst=(x,y,n,color)=>{
  if(SB.particles.length>96) return;
  originalBurst(x,y,Math.min(n,10),color);
  if(SB.particles.length>120) SB.particles.splice(0,SB.particles.length-120);
};

// Limit simultaneously alive projectile effects too.
const originalUpdate=SB.update;
SB.update=dt=>{
  originalUpdate(dt);
  if(Array.isArray(SB.projectiles)&&SB.projectiles.length>40){
    SB.projectiles.splice(0,SB.projectiles.length-40);
  }
};
})();