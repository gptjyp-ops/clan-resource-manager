// Tesseract may report language/init errors through errorHandler while its
// createWorker promise stays pending. Surface those errors and retry once.
export async function createOcrWorker(createWorker:(...args:any[])=>Promise<any>,language:string,options:Record<string,any>,signal?:AbortSignal){
 async function attempt(config:Record<string,any>){
  signal?.throwIfAborted();let worker:any,finished=false,timer:ReturnType<typeof setTimeout>|undefined,abort:()=>void=()=>{};
  try{return await new Promise<any>((resolve,reject)=>{
   const fail=(error:unknown)=>{if(finished)return;finished=true;reject(error instanceof Error?error:Error(String(error)));};
   abort=()=>fail(signal?.reason||new DOMException('Aborted','AbortError'));signal?.addEventListener('abort',abort,{once:true});
   timer=setTimeout(()=>fail(Error('OCR initialization timed out')),30000);
   Promise.resolve().then(()=>createWorker(language,1,{...config,errorHandler:fail})).then(w=>{worker=w;if(finished){void w.terminate().catch(()=>{});return;}finished=true;resolve(w);},fail);
  });}finally{if(timer)clearTimeout(timer);signal?.removeEventListener('abort',abort);if(signal?.aborted)void worker?.terminate().catch(()=>{});}
 }
 try{return await attempt(options);}catch(error){signal?.throwIfAborted();return await attempt({...options,cacheMethod:'none',corePath:options.fallbackCorePath||options.corePath});}
}
