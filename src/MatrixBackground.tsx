import {useEffect,useRef} from 'react';

type Effect={destroy:()=>void};
type VantaWindow=Window&{VANTA?:Partial<Record<'BIRDS'|'HALO',(options:Record<string,unknown>)=>Effect>>;THREE?:unknown};
type EffectName='BIRDS'|'HALO';
let three:Promise<void>|undefined;
const libraries:Partial<Record<EffectName,Promise<void>>>={};
function loadScript(src:string){return new Promise<void>((resolve,reject)=>{const script=document.createElement('script');script.src=src;script.async=true;script.onload=()=>resolve();script.onerror=()=>{script.remove();reject(new Error('Background unavailable'));};document.head.appendChild(script);});}
function loadEffect(name:EffectName){return libraries[name]??=(async()=>{
 const w=window as VantaWindow;
 if(!w.THREE)await (three??=loadScript('https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.min.js').catch(e=>{three=undefined;throw e;}));
 if(!w.VANTA?.[name])await loadScript('https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.'+name.toLowerCase()+'.min.js');
})().catch(e=>{delete libraries[name];throw e;});}

// Vanta HALO on phones and BIRDS on desktop are decorative. Its canvas cannot intercept form input or scrolling.
export default function MatrixBackground(){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const el=ref.current;if(!el)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)'),mobile=window.matchMedia('(max-width: 800px), (pointer: coarse) and (max-width: 1024px)');
  let disposed=false,effect:Effect|undefined,generation=0;
  function stop(){generation++;try{effect?.destroy();}catch{}effect=undefined;el!.replaceChildren();}
  async function sync(){
   stop();if(disposed||document.hidden||reduced.matches)return;
   const current=generation,name:EffectName=mobile.matches?'HALO':'BIRDS';
   try{
    await loadEffect(name);if(disposed||current!==generation||document.hidden||reduced.matches)return;
    const common={el,THREE:(window as VantaWindow).THREE,backgroundColor:0x080f20,backgroundAlpha:1,minHeight:200,minWidth:200,gyroControls:false};
    effect=name==='HALO'?(window as VantaWindow).VANTA?.HALO?.({...common,mouseControls:false,touchControls:true,scale:2,scaleMobile:2,baseColor:0x396fff,color2:0x39d9ff,amplitudeFactor:1,size:1.1,xOffset:0,yOffset:0}):(window as VantaWindow).VANTA?.BIRDS?.({...common,
     mouseControls:true,touchControls:false,gyroControls:false,minHeight:200,minWidth:200,
     scale:mobile.matches?2:1.5,scaleMobile:2,backgroundColor:0x080f20,backgroundAlpha:1,
     color1:0x39d9ff,color2:0x9c78ff,colorMode:'lerp',birdSize:1.15,wingSpan:22,
     speedLimit:3,separation:35,alignment:30,cohesion:25,quantity:mobile.matches?2:3});
   }catch{stop();} // Solid navy remains usable when WebGL or the CDN is unavailable.
  }
  void sync();document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);mobile.addEventListener('change',sync);
  return()=>{disposed=true;stop();document.removeEventListener('visibilitychange',sync);reduced.removeEventListener('change',sync);mobile.removeEventListener('change',sync);};
 },[]);
 return <div ref={ref} aria-hidden="true" style={{position:'fixed',inset:0,zIndex:-1,pointerEvents:'none',background:'#080f20',opacity:1,overflow:'hidden'}}/>;
}
