(() => {
'use strict';
const SB=window.SB,D=window.SB_DATA;if(!SB||!D)return;
const p=SB.player;
SB.input.action=false;
const actionCodes=new Set(['ArrowDown','KeyS']);
window.addEventListener('keydown',e=>{if(actionCodes.has(e.code)){e.preventDefault();SB.input.action=true;}},{passive:false});
window.addEventListener('keyup',e=>{if(actionCodes.has(e.code))SB.input.action=false;});
window.addEventListener('blur',()=>{SB.input.action=false;});
const actionBtn=document.querySelector('[data-key="action"]');
if(actionBtn){const set=v=>{SB.input.action=v;actionBtn.classList.toggle('pressed',v);};actionBtn.addEventListener('pointerdown',e=>{e.preventDefault();set(true);try{actionBtn.setPointerCapture(e.pointerId);}catch{}},{passive:false});for(const ev of ['pointerup','pointercancel','lostpointercapture'])actionBtn.addEventListener(ev,e=>{e.preventDefault();set(false);},{passive:false});actionBtn.addEventListener('contextmenu',e=>e.preventDefault());}
const P=(x,y,w,h,type='solid',opt={})=>({x,y,w,h,type,...opt,baseX:x,baseY:y,active:true,timer:0});
function add(stageIndex,...items){const s=D.stages[stageIndex];if(!s||s._actionsAdded)return;s.platforms.push(...items);s._actionsAdded=true;}
add(5,P(1080,470,250,90,'ceiling'),P(1760,604,130,16,'boost',{dir:1}),P(4560,350,34,270,'dashGate'));
add(6,P(1540,500,150,24,'breakable'),P(2550,600,110,20,'spring'),P(3980,604,120,16,'boost',{dir:1}));
add(7,P(1600,600,105,20,'spring'),P(3470,604,120,16,'boost',{dir:1}),P(4380,190,32,430,'dashGate'));
add(8,P(1840,500,150,24,'breakable'),P(3020,600,110,20,'spring'),P(3860,604,120,16,'boost',{dir:1}));
add(9,P(250,470,220,90,'ceiling'),P(2460,600,110,20,'spring'),P(3420,604,120,16,'boost',{dir:1}),P(4450,300,34,320,'dashGate'));
add(10,P(300,470,230,90,'ceiling'),P(1460,500,150,24,'breakable'),P(2860,600,110,20,'spring'),P(4200,604,130,16,'boost',{dir:1}),P(5070,350,34,270,'dashGate'));
add(11,P(280,1170,240,90,'ceiling'),P(1550,980,150,24,'breakable'),P(2460,900,110,20,'spring'),P(3850,550,120,16,'boost',{dir:1}),P(5260,210,34,1110,'dashGate'));
SB.action={slide:false,slideTimer:0,slideDir:1,stomping:false,chain:0,chainTimer:0,lastText:'',prev:false,prevJump:false};
function reward(label,power=1){const a=SB.action;a.chain=Math.min(6,a.chain+1);a.chainTimer=2.2;a.lastText=label;const dir=Math.sign(p.vx)||p.face||1;p.vx=dir*Math.min(820,Math.abs(p.vx)+22*a.chain*power);SB.shake=Math.max(SB.shake,2+Math.min(4,a.chain*.5));}
function startSlide(){const a=SB.action;if(a.slide||!p.onGround)return;a.slide=true;a.slideTimer=.48;a.slideDir=Math.sign(p.vx)||p.face||1;p.face=a.slideDir;const oldH=p.h;p.h=40;p.y+=oldH-p.h;p.vx=a.slideDir*Math.max(540,Math.abs(p.vx));SB.sfx?.('jump',.055);reward('SLIDE',.35);}
function canStand(){const test={x:p.x+3,y:p.y-28,w:p.w-6,h:68};for(const q of SB.solids())if(SB.rect(test,q))return false;return true;}
function endSlide(){const a=SB.action;if(!a.slide)return;if(!canStand()){a.slideTimer=.08;return;}p.y-=28;p.h=68;a.slide=false;a.slideTimer=0;}
function startStomp(){const a=SB.action;if(a.stomping||p.onGround)return;if(a.slide)endSlide();a.stomping=true;p.vy=Math.max(1060,p.vy);p.vx*=.72;reward('STOMP',.25);}
function platformUnder(){const foot=p.y+p.h;for(const q of SB.world.platforms){if(!q.active)continue;if(p.x+p.w>q.x+5&&p.x<q.x+q.w-5&&Math.abs(foot-q.y)<8)return q;}return null;}
function stompLanding(){const q=platformUnder();SB.sfx?.('stomp',.075);SB.shake=Math.max(SB.shake,5);if(q?.type==='breakable'){q.active=false;p.onGround=false;p.vy=300;SB.burst?.(p.x+p.w/2,q.y,6,'#ffe8cc');reward('BREAK!',.8);return;}if(q?.type==='spring'){p.onGround=false;p.vy=-1260;SB.sfx?.('jump',.07);reward('SUPER BOUNCE',1.1);return;}let hit=0;for(const e of SB.world.enemies){if(!e.alive)continue;const dx=(e.x+e.w/2)-(p.x+p.w/2),dy=(e.y+e.h/2)-(p.y+p.h);if(Math.hypot(dx,dy)<115){e.alive=false;hit++;}}if(hit){p.vy=-560;p.onGround=false;reward('SHOCKWAVE',.7);}}
const rawCollideY=SB.collideY;
SB.collideY=prevY=>{const wasStomp=SB.action.stomping;rawCollideY(prevY);if(p.onGround){const q=platformUnder();if(q?.type==='spring'&&!wasStomp){p.onGround=false;p.vy=-820;SB.sfx?.('jump',.06);reward('BOUNCE',.5);}if(wasStomp)stompLanding();SB.action.stomping=false;}};
function preGimmicks(){for(const q of SB.world.platforms){if(!q.active||q.type!=='dashGate')continue;const dx=Math.abs((p.x+p.w/2)-(q.x+q.w/2));if(dx<105&&(SB.dashing?.()||Math.abs(p.vx)>610)){q.active=false;SB.sfx?.('stomp',.07);SB.burst?.(q.x+q.w/2,p.y+p.h/2,6,'#dff8ff');reward('DASH BREAK',1);}}}
function postGimmicks(){for(const q of SB.world.platforms){if(!q.active||q.type!=='boost')continue;const foot=p.y+p.h,over=p.x+p.w>q.x&&p.x<q.x+q.w;if(over&&Math.abs(foot-q.y)<12&&p.vy>=0){const now=performance.now();if(now-(q.usedAt||0)>360){q.usedAt=now;const dir=q.dir||p.face||1;p.face=dir;p.vx=dir*Math.max(760,Math.abs(p.vx));p.dashUntil=now+420;SB.sfx?.('coin',.055);reward('BOOST',.9);}}}}
const rawReset=SB.resetPlayer;
SB.resetPlayer=(...args)=>{if(SB.action.slide){p.h=68;SB.action.slide=false;}Object.assign(SB.action,{slide:false,slideTimer:0,stomping:false,chain:0,chainTimer:0,prev:false,prevJump:false});return rawReset(...args);};
const rawUpdate=SB.update;
SB.update=dt=>{if(SB.state!=='play'||!SB.world){rawUpdate(dt);return;}dt=Math.min(dt,.033);const a=SB.action,act=!!(SB.input.action||SB.pad.b),jp=!!(SB.input.jump||SB.pad.jump),wasGround=p.onGround,wasDash=SB.dashing?.();if(act&&!a.prev){if(p.onGround)startSlide();else startStomp();}a.prev=act;if(a.slide){a.slideTimer-=dt;if(a.slideTimer<=0)endSlide();}preGimmicks();rawUpdate(dt);if(jp&&!a.prevJump&&wasGround&&wasDash&&p.vy<0){p.vx=(p.face||1)*Math.max(780,Math.abs(p.vx));p.vy=Math.min(p.vy,-910);reward('DASH JUMP',.8);}a.prevJump=jp;if(a.slide){if(p.wallDir)endSlide();else p.vx=a.slideDir*Math.max(500,Math.abs(p.vx));}postGimmicks();if(a.chainTimer>0){a.chainTimer-=dt;if(a.chainTimer<=0)a.chain=0;}};
const rawDraw=SB.draw;let lastActionDraw=0;
SB.draw=()=>{const now=performance.now();if(now-lastActionDraw<14.5)return;lastActionDraw=now;rawDraw();if(!SB.world)return;const c=SB.ctx,a=SB.action;c.save();c.translate(-SB.cameraX,-SB.cameraY);for(const q of SB.world.platforms){if(!q.active)continue;if(q.type==='breakable'){c.strokeStyle='#ff922b';c.lineWidth=4;c.strokeRect(q.x+3,q.y+3,q.w-6,q.h-6);for(let x=q.x+18;x<q.x+q.w;x+=34){c.beginPath();c.moveTo(x,q.y+4);c.lineTo(x-8,q.y+q.h-4);c.lineTo(x+10,q.y+q.h-4);c.stroke();}}else if(q.type==='spring'){c.fillStyle='#51cf66';c.fillRect(q.x,q.y,q.w,q.h);c.fillStyle='#d3f9d8';for(let x=q.x+8;x<q.x+q.w;x+=20)c.fillRect(x,q.y+3,10,5);}else if(q.type==='boost'){c.fillStyle='#22b8cf';c.fillRect(q.x,q.y,q.w,q.h);c.fillStyle='#e3fafc';for(let x=q.x+12;x<q.x+q.w-12;x+=28){c.beginPath();c.moveTo(x,q.y+3);c.lineTo(x+16,q.y+q.h/2);c.lineTo(x,q.y+q.h-3);c.fill();}}else if(q.type==='dashGate'){c.fillStyle='rgba(116,192,252,.28)';c.fillRect(q.x,q.y,q.w,q.h);c.strokeStyle='#74c0fc';c.lineWidth=4;c.strokeRect(q.x,q.y,q.w,q.h);}}if(a.slide){c.strokeStyle='rgba(255,255,255,.65)';c.lineWidth=5;c.beginPath();c.moveTo(p.x-42,p.y+p.h-6);c.lineTo(p.x-8,p.y+p.h-6);c.stroke();}if(a.stomping){c.strokeStyle='rgba(255,220,120,.65)';c.lineWidth=5;c.beginPath();c.moveTo(p.x+p.w/2,p.y-30);c.lineTo(p.x+p.w/2,p.y-5);c.stroke();}c.restore();};
})();
