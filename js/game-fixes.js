(() => {
'use strict';
const SB=window.SB;
if(!SB)return;

// Ground-contact hot path: emit no particles or audio on landing.
// The base engine clears onGround before collideY(), so we keep our own
// previous-frame grounded flag and only track the transition once.
SB._groundedLastFrame=false;
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
  p.onGround=landed;
  if(landed)p.coyote=.12;
  SB._groundedLastFrame=landed;
};

const originalResetPlayer=SB.resetPlayer;
SB.resetPlayer=(...args)=>{
  SB._groundedLastFrame=false;
  return originalResetPlayer(...args);
};

// Keep effects intentionally restrained on mobile Safari.
const originalBurst=SB.burst;
SB.burst=(x,y,n,color)=>{
  if(SB.particles.length>=48)return;
  originalBurst(x,y,Math.min(n,6),color);
  if(SB.particles.length>60)SB.particles.splice(0,SB.particles.length-60);
};

const originalUpdate=SB.update;
SB.update=dt=>{
  originalUpdate(dt);
  if(Array.isArray(SB.projectiles)&&SB.projectiles.length>28){
    SB.projectiles.splice(0,SB.projectiles.length-28);
  }
};
})();