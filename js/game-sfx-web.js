(() => {
'use strict';
const SB=window.SB;if(!SB)return;
let ctx=null,master=null,noiseBuf=null;
const last=Object.create(null),coinState={t:0,step:0};
const cooldown={jump:45,coin:38,stomp:55,damage:120,clear:300,land:80};
function ensure(){
  if(ctx)return ctx;
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;
  try{ctx=new AC({latencyHint:'interactive'});}catch{ctx=new AC();}
  master=ctx.createGain();master.gain.value=.20;master.connect(ctx.destination);
  noiseBuf=ctx.createBuffer(1,Math.max(1,Math.floor(ctx.sampleRate*.12)),ctx.sampleRate);
  const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  return ctx;
}
function unlock(){const c=ensure();if(c&&c.state==='suspended')c.resume().catch(()=>{});}
['pointerdown','touchstart','keydown'].forEach(ev=>window.addEventListener(ev,unlock,{passive:true,capture:true}));
function tone(freq,dur=.07,type='square',gain=.10,endFreq=null,delay=0){
  const c=ensure();if(!c||SB.muted)return;const t=c.currentTime+delay,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);if(endFreq)o.frequency.exponentialRampToValueAtTime(Math.max(20,endFreq),t+dur);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(gain,t+.006);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g).connect(master);o.start(t);o.stop(t+dur+.01);
}
function noise(dur=.06,gain=.055,highpass=500){
  const c=ensure();if(!c||SB.muted)return;const t=c.currentTime,s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=noiseBuf;f.type='highpass';f.frequency.value=highpass;g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(f).connect(g).connect(master);s.start(t);s.stop(t+dur+.01);
}
function allow(name){const now=performance.now(),cd=cooldown[name]??35;if(now-(last[name]||0)<cd)return false;last[name]=now;return true;}
SB.sfx=(name,vol)=>{
  if(SB.muted||!allow(name))return;unlock();const v=Math.max(.03,Math.min(.18,vol??.10));
  switch(name){
    case'jump': tone(360,.065,'square',v,620);break;
    case'coin':{const now=performance.now();if(now-coinState.t<700)coinState.step=(coinState.step+1)%6;else coinState.step=0;coinState.t=now;const f=[660,740,830,990,1110,1320][coinState.step];tone(f,.055,'triangle',v*.9,f*1.08);tone(f*2,.035,'sine',v*.28,null,.018);break;}
    case'stomp': tone(150,.06,'square',v,82);noise(.045,v*.34,900);break;
    case'damage': tone(180,.13,'sawtooth',v,55);noise(.09,v*.48,250);break;
    case'clear': tone(523,.12,'triangle',v*.9,523);tone(659,.14,'triangle',v*.9,659,.09);tone(784,.18,'triangle',v,784,.19);tone(1047,.28,'triangle',v*.9,1047,.31);break;
    case'land': break;
    default: tone(420,.05,'triangle',v,520);break;
  }
};
const oldMute=SB.ui?.mute?.onclick;
if(SB.ui?.mute){SB.ui.mute.onclick=()=>{if(oldMute)oldMute();if(SB.muted&&ctx)ctx.suspend().catch(()=>{});else unlock();};}
window.addEventListener('pagehide',()=>{if(ctx)ctx.suspend().catch(()=>{});},{passive:true});
})();
