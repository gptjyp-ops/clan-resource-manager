import {useEffect,useRef} from 'react';

type Effect={destroy:()=>void};
type VantaWindow=Window&{VANTA?:{BIRDS?:(options:Record<string,unknown>)=>Effect};THREE?:unknown};
let libraries:Promise<void>|undefined;
function loadScript(src:string){return new Promise<void>((resolve,reject)=>{const script=document.createElement('script');script.src=src;script.async=true;script.onload=()=>resolve();script.onerror=()=>{script.remove();reject(new Error('Background unavailable'));};document.head.appendChild(script);});}
function loadBirds(){return libraries??=(async()=>{const w=window as VantaWindow;if(!w.THREE)await loadScript('https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.min.js');if(!w.VANTA?.BIRDS)await loadScript('https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.birds.min.js');})().catch(e=>{libraries=undefined;throw e;});}

// Vanta BIRDS is decorative. Its canvas cannot intercept form input or scrolling.
export default function MatrixBackground(){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const el=ref.current;if(!el)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)'),mobile=window.matchMedia('(max-width: 600px)');
  let disposed=false,effect:Effect|undefined,generation=0;
  function stop(){generation++;try{effect?.destroy();}catch{}effect=undefined;el!.replaceChildren();}
  async function sync(){
   stop();if(disposed||document.hidden||reduced.matches)return;
   const current=generation;
   try{
    await loadBirds();if(disposed||current!==generation||document.hidden||reduced.matches)return;
    effect=(window as VantaWindow).VANTA?.BIRDS?.({el,THREE:(window as VantaWindow).THREE,
     mouseControls:false,touchControls:false,gyroControls:false,minHeight:200,minWidth:200,
     scale:mobile.matches?2:1.5,scaleMobile:2,backgroundColor:0x0e1624,backgroundAlpha:1,
     color1:0xe9b661,color2:0x64b8c7,colorMode:'lerp',birdSize:1.15,wingSpan:22,
     speedLimit:3,separation:35,alignment:30,cohesion:25,quantity:mobile.matches?2:3});
   }catch{stop();} // Solid navy remains usable when WebGL or the CDN is unavailable.
  }
  void sync();document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);mobile.addEventListener('change',sync);
  return()=>{disposed=true;stop();document.removeEventListener('visibilitychange',sync);reduced.removeEventListener('change',sync);mobile.removeEventListener('change',sync);};
 },[]);
 return <div ref={ref} aria-hidden="true" style={{position:'fixed',inset:0,zIndex:-1,pointerEvents:'none',background:'#0e1624',opacity:.8,overflow:'hidden'}}/>;
}
