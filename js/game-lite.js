(() => {
'use strict';
const SB=window.SB;if(!SB)return;
// iPhone向け軽量演出。着地・ジャンプ時はほぼ粒子を出さず、総数も強く制限。
const rawBurst=SB.burst;
SB.burst=(x,y,n,color)=>{
  const count=n<=5?0:n<=8?1:Math.min(3,n);
  if(count>0) rawBurst(x,y,count,color);
  if(SB.particles.length>24) SB.particles.splice(0,SB.particles.length-24);
};
const rawUpdateParticles=SB.updateParticles;
SB.updateParticles=dt=>{rawUpdateParticles(dt);if(SB.particles.length>24)SB.particles.splice(0,SB.particles.length-24);};

// BGMは同一オリジンのローカル音源を最優先。取得に失敗した場合だけCC0 GitHub音源へフォールバック。
const fallback={field:'https://raw.githubusercontent.com/blancmathis/Super_Bash_Folds/main/public/assets/audio/open/music/menu-loop.ogg',event:'https://raw.githubusercontent.com/blancmathis/Super_Bash_Folds/main/public/assets/audio/open/music/menu-loop.ogg',battle:'https://raw.githubusercontent.com/blancmathis/Super_Bash_Folds/main/public/assets/audio/open/music/battle-loop.ogg',storm:'https://raw.githubusercontent.com/blancmathis/Super_Bash_Folds/main/public/assets/audio/open/music/battle-loop.ogg'};
const local={field:'assets/audio/field.ogg',event:'assets/audio/event.ogg',battle:'assets/audio/battle.ogg',storm:'assets/audio/storm.ogg'};
const tracks={};
for(const k of Object.keys(local)){
  const a=new Audio(local[k]);a.preload='auto';a.loop=true;a.volume=.22;
  a.addEventListener('error',()=>{if(a.dataset.fallback)return;a.dataset.fallback='1';a.src=fallback[k];a.load();});
  tracks[k]=a;
}
let current=null;
const choose=()=>{const t=SB.world?.theme;if(t==='rail'||t==='escape'||t==='final')return'battle';if(t==='wind'||t==='water'||t==='dark')return'event';if(SB.currentStage===4||t==='storm')return'storm';return'field';};
SB.bgm=on=>{for(const a of Object.values(tracks))if(!on||a!==current)a.pause();if(!on||SB.muted||!SB.world)return;const next=tracks[choose()];if(current!==next){if(current)current.pause();current=next;}next.play().catch(()=>{});};
})();
