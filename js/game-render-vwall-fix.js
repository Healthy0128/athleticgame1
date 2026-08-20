(() => {
'use strict';
const SB=window.SB;if(!SB)return;
const {ctx}=SB;

// Re-render tall solid walls completely. The base renderer only tiles along X,
// so platforms taller than one 64px tile look transparent below their top edge.
const rawDraw=SB.draw;
SB.draw=()=>{
  rawDraw();
  if(!SB.world)return;
  const img=SB.art.tile1;
  const left=SB.cameraX-80,right=SB.cameraX+SB.W+80,top=SB.cameraY-80,bottom=SB.cameraY+SB.H+80;
  ctx.save();
  ctx.translate(-SB.cameraX,-SB.cameraY);
  for(const p of SB.world.platforms){
    if(!p.active||p.h<=64)continue;
    if(p.x+p.w<left||p.x>right||p.y+p.h<top||p.y>bottom)continue;
    // Redraw only the portion below the first tile row, which the base renderer misses.
    if(img?.complete&&img.naturalWidth){
      for(let y=p.y+64;y<p.y+p.h;y+=64){
        const dh=Math.min(64,p.y+p.h-y);
        for(let x=p.x;x<p.x+p.w;x+=64){
          const dw=Math.min(64,p.x+p.w-x);
          ctx.drawImage(img,0,0,img.naturalWidth,img.naturalHeight,x,y,dw,dh);
        }
      }
    }else{
      ctx.fillStyle='#8d6e63';
      ctx.fillRect(p.x,p.y+64,p.w,Math.max(0,p.h-64));
    }
    // Wall-kick readability: subtle vertical grip marks on narrow/tall surfaces.
    if(p.h>=160&&p.w<=90){
      ctx.save();
      ctx.globalAlpha=.55;
      ctx.strokeStyle='#dff8ff';
      ctx.lineWidth=3;
      for(let y=p.y+24;y<p.y+p.h-12;y+=42){
        ctx.beginPath();
        ctx.moveTo(p.x+8,y);
        ctx.lineTo(p.x+Math.min(p.w-8,26),y-8);
        ctx.stroke();
      }
      ctx.restore();
    }
  }
  ctx.restore();
};
})();
