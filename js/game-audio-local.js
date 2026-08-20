(() => {
'use strict';
const SB=window.SB;if(!SB)return;
let ctx=null,gain=null,source=null,currentKey=null;const buffers=new Map();
const TRACKS={field:{lead:[60,64,67,72,67,64,62,67,60,64,67,74,72,67,64,62],bass:[36,36,43,43,41,41,43,43]},event:{lead:[62,65,69,74,69,65,67,72,62,65,69,76,74,69,67,65],bass:[38,38,45,45,43,43,45,45]},battle:{lead:[64,67,71,76,71,74,67,71,64,67,72,79,76,72,71,67],bass:[40,40,47,47,45,45,47,47]},storm:{lead:[57,60,64,69,64,60,62,67,57,60,65,72,69,65,62,60],bass:[33,33,40,40,38,38,40,40]}};
const midi=n=>440*Math.pow(2,(n-69)/12);
function choose(){const t=SB.world?.theme;if(t==='rail'||t==='escape'||t==='final')return'battle';if(t==='wind'||t==='water'||t==='dark')return'event';if(SB.currentStage===4||t==='storm')return'storm';return'field';}
function ensure(){if(ctx)return ctx;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;ctx=new AC();gain=ctx.createGain();gain.gain.value=.16;gain.connect(ctx.destination);return ctx;}
function build(key){if(buffers.has(key))return buffers.get(key);const c=ensure();if(!c)return null;const sr=c.sampleRate,dur=4,len=Math.floor(sr*dur),buf=c.createBuffer(1,len,sr),out=buf.getChannelData(0),tr=TRACKS[key]||TRACKS.field;for(let i=0;i<len;i++){const t=i/sr,step=Math.floor(t/.25)%16,beat=Math.floor(t/.5)%8,f=midi(tr.lead[step]),fb=midi(tr.bass[beat]),sq=Math.sin(Math.PI*2*f*t)>=0?1:-1,tri=(2/Math.PI)*Math.asin(Math.sin(Math.PI*2*fb*t)),phase=(t%.25)/.25,env=.62+.38*Math.exp(-5*phase);out[i]=Math.max(-.75,Math.min(.75,.14*sq*env+.09*tri));}buffers.set(key,buf);return buf;}
function stop(){if(source){try{source.stop();}catch{}try{source.disconnect();}catch{}source=null;}currentKey=null;}
SB.bgm=on=>{if(!on||SB.muted){stop();return;}const c=ensure();if(!c)return;if(c.state==='suspended')c.resume().catch(()=>{});const key=choose();if(source&&currentKey===key)return;stop();const buf=build(key);if(!buf)return;source=c.createBufferSource();source.buffer=buf;source.loop=true;source.connect(gain);currentKey=key;try{source.start();}catch{}};
window.addEventListener('pagehide',stop,{passive:true});document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else if(SB.state==='play'&&!SB.muted)SB.bgm(true);},{passive:true});
})();