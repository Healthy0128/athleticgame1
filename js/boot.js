(() => {
'use strict';
const SB=window.SB;
SB.ui.restart.onclick=()=>SB.world?SB.startStage(SB.currentStage):SB.showTitle();
SB.ui.mute.onclick=()=>{SB.muted=!SB.muted;SB.ui.mute.textContent=SB.muted?'SOUND OFF':'SOUND ON';SB.bgm(SB.state==='play');};
const play=document.getElementById('playBtn'),select=document.getElementById('stageSelectBtn'),ghost=document.getElementById('ghostBtn');
if(play)play.onclick=()=>SB.startStage(0);if(select)select.onclick=SB.showStageSelect;if(ghost)ghost.onclick=()=>{SB.save.ghostOn=!SB.save.ghostOn;SB.persist();ghost.textContent='GHOST: '+(SB.save.ghostOn?'ON':'OFF');};
function loop(now){const dt=(now-SB.last)/1000;SB.last=now;SB.pollPad?.();SB.update(dt);SB.draw?.();requestAnimationFrame(loop);}SB.showTitle();requestAnimationFrame(loop);
})();