import {useEffect,useRef} from 'react';

// Decorative only: no pointer events, focus targets or document layout changes.
export default function MatrixBackground(){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current,ctx=canvas?.getContext('2d');if(!canvas||!ctx)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const glyphs='0123456789アイウエオカキクケコサシスセソ';
  let width=0,height=0,step=20,drops:number[]=[],ticks=0,timer:ReturnType<typeof setInterval>|undefined;
  function draw(){
   if(document.hidden)return;
   ctx!.fillStyle='rgba(6,14,13,0.13)';ctx!.fillRect(0,0,width,height);
   ctx!.font='14px monospace';ctx!.textAlign='center';
   for(let i=0;i<drops.length;i++){
    if((ticks+i)%2===0)continue;
    const y=drops[i]*18;
    ctx!.fillStyle=i%7===0?'#b2f5c8':'#35b96c';
    ctx!.fillText(glyphs[Math.floor(Math.random()*glyphs.length)],i*step+step/2,y);
    if(y>height+150&&Math.random()>.975)drops[i]=-Math.random()*25;else drops[i]++;
   }
   ticks++;
  }
  function reset(){
   if(timer)clearInterval(timer);timer=undefined;
   width=window.innerWidth;height=window.innerHeight;
   const ratio=Math.min(window.devicePixelRatio||1,1.5);
   canvas!.width=Math.round(width*ratio);canvas!.height=Math.round(height*ratio);ctx!.setTransform(ratio,0,0,ratio,0,0);
   const columns=Math.max(1,Math.min(90,Math.floor(width/22)));step=width/columns;
   drops=Array.from({length:columns},()=>Math.floor(Math.random()*height/18)-12);
   ctx!.clearRect(0,0,width,height);
   for(let n=0;n<12;n++)draw();
   if(!reduced.matches)timer=setInterval(draw,85);
  }
  reset();window.addEventListener('resize',reset);reduced.addEventListener('change',reset);
  return()=>{if(timer)clearInterval(timer);window.removeEventListener('resize',reset);reduced.removeEventListener('change',reset);};
 },[]);
 return <canvas ref={ref} className="matrix-background" aria-hidden="true"/>;
}
