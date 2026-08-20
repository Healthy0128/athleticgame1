(() => {
'use strict';
const SB=window.SB;
function setKey(code,v){if(code==='ArrowLeft'||code==='KeyA')SB.input.left=v;if(code==='ArrowRight'||code==='KeyD')SB.input.right=v;if(['Space','KeyW','ArrowUp'].includes(code))SB.input.jump=v;}
window.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Space','KeyA','KeyD','KeyW','ArrowUp'].includes(e.code)){e.preventDefault();setKey(e.code,true);}if(e.code==='Escape')SB.togglePause();},{passive:false});
window.addEventListener('keyup',e=>setKey(e.code,false));
window.addEventListener('blur',()=>{SB.input.left=SB.input.right=SB.input.jump=false;if(SB.state==='play')SB.togglePause();});
window.addEventListener('gamepadconnected',e=>{SB.pad.index=e.gamepad.index;SB.ui.controller.textContent=`Xbox接続: ${e.gamepad.id}`;SB.ui.controller.classList.add('controller-on');});
window.addEventListener('gamepaddisconnected',e=>{if(SB.pad.index===e.gamepad.index)SB.pad.index=null;SB.pad.left=SB.pad.right=SB.pad.jump=false;SB.ui.controller.textContent='スマホ / キーボード / Xboxコントローラー対応';SB.ui.controller.classList.remove('controller-on');});
SB.pollPad=()=>{const pads=navigator.getGamepads?navigator.getGamepads():[];let gp=SB.pad.index!=null?pads[SB.pad.index]:null;if(!gp){gp=Array.from(pads).find(Boolean)||null;SB.pad.index=gp?gp.index:null;}if(!gp){SB.pad.left=SB.pad.right=SB.pad.jump=SB.pad.start=SB.pad.b=false;return;}const x=gp.axes?.[0]??0;SB.pad.left=x<-.35||!!gp.buttons?.[14]?.pressed;SB.pad.right=x>.35||!!gp.buttons?.[15]?.pressed;SB.pad.jump=!!gp.buttons?.[0]?.pressed;SB.pad.start=!!gp.buttons?.[9]?.pressed;SB.pad.b=!!gp.buttons?.[1]?.pressed;if(SB.pad.start&&!SB.prevPadStart)SB.togglePause();SB.prevPadStart=SB.pad.start;};
for(const b of document.querySelectorAll('.touch-controls button')){const k=b.dataset.key;const apply=v=>{if(k==='left')SB.input.left=v;if(k==='right')SB.input.right=v;if(k==='jump')SB.input.jump=v;b.classList.toggle('pressed',v);};b.addEventListener('pointerdown',e=>{e.preventDefault();apply(true);try{b.setPointerCapture(e.pointerId);}catch{}});for(const ev of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(ev,e=>{e.preventDefault();apply(false);});b.addEventListener('contextmenu',e=>e.preventDefault());}
['gesturestart','gesturechange','gestureend'].forEach(t=>document.addEventListener(t,e=>e.preventDefault(),{passive:false}));
})();