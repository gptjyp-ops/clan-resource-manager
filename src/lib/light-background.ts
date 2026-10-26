// Original lightweight ambient light composition; no pointer/scroll listeners.
export function createLightBackground(el:HTMLElement){
 const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d',{alpha:false});
 if(!ctx)return {destroy(){}};
 canvas.style.cssText='width:100%;height:100%;display:block';el.appendChild(canvas);
 let frame=0,dead=false,last=0,width=window.innerWidth,w=0,h=0;
 function resize(){
  const bounds=el.getBoundingClientRect();w=Math.max(1,Math.round(Math.min(bounds.width,420)));h=Math.max(1,Math.round(w*bounds.height/Math.max(1,bounds.width)));canvas.width=w;canvas.height=h;
 }
 resize();
 const lights=[
  {color:'rgba(37,160,244,.65)',x:.18,y:.24,r:.85,speed:.13},
  {color:'rgba(111,83,220,.5)',x:.82,y:.63,r:.8,speed:.11},
  {color:'rgba(72,224,215,.48)',x:.54,y:.90,r:.65,speed:.09}
 ];
 function draw(now:number){
  if(dead)return;
  frame=requestAnimationFrame(draw);if(now-last<1000/24)return;last=now;
  const t=now/1000;ctx!.fillStyle='#080f20';ctx!.fillRect(0,0,w,h);
  ctx!.globalCompositeOperation='screen';
  for(const light of lights){
   const x=(light.x+Math.sin(t*light.speed)*.2)*w,y=(light.y+Math.cos(t*light.speed*.8)*.12)*h;
   const radius=w*light.r,gradient=ctx!.createRadialGradient(x,y,0,x,y,radius);
   gradient.addColorStop(0,light.color);gradient.addColorStop(.45,light.color.replace(/,[.\d]+\)$/,',.14)'));gradient.addColorStop(1,'rgba(0,0,0,0)');
   ctx!.fillStyle=gradient;ctx!.fillRect(0,0,w,h);
  }
  // Broad translucent ribbons give the light depth without bright text glare.
  for(let i=0;i<3;i++){
   ctx!.save();ctx!.translate(w*(.2+i*.28+Math.sin(t*.08+i)*.08),h*.5);ctx!.rotate(-.35+Math.sin(t*.06+i)*.16);
   const beam=ctx!.createLinearGradient(-w*.15,0,w*.15,0);beam.addColorStop(0,'rgba(90,180,255,0)');beam.addColorStop(.5,'rgba(130,205,255,.055)');beam.addColorStop(1,'rgba(90,180,255,0)');
   ctx!.fillStyle=beam;ctx!.fillRect(-w*.15,-h,w*.3,h*2);ctx!.restore();
  }
  ctx!.globalCompositeOperation='source-over';
 }
 frame=requestAnimationFrame(draw);
 const stableResize=()=>{if(window.innerWidth===width)return;width=window.innerWidth;resize();};
 window.addEventListener('resize',stableResize);
 return {destroy(){dead=true;cancelAnimationFrame(frame);window.removeEventListener('resize',stableResize);canvas.remove();}};
}
