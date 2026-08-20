(() => {
'use strict';
const SB=window.SB;if(!SB)return;
// iPhone向け軽量演出。着地・ジャンプ時の粒子生成を最小化し、総数も強く制限する。
const rawBurst=SB.burst;
SB.burst=(x,y,n,color)=>{
  let count=n;
  if(n<=5) count=1;
  else if(n<=8) count=2;
  else count=Math.min(4,n);
  rawBurst(x,y,count,color);
  if(SB.particles.length>36) SB.particles.splice(0,SB.particles.length-36);
};
// パーティクルをさらに短命にして、接地周辺の描画負荷を抑える。
const rawUpdateParticles=SB.updateParticles;
SB.updateParticles=dt=>{
  rawUpdateParticles(dt);
  if(SB.particles.length>36) SB.particles.splice(0,SB.particles.length-36);
};
})();
