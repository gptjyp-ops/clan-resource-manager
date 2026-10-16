import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
const dir=await mkdtemp(join(tmpdir(),'clan-scan-cancel-'));
try{
 const output=join(dir,'scan.mjs');
 await build({entryPoints:['src/lib/screen-ocr.ts'],outfile:output,bundle:true,format:'esm',platform:'node',define:{'import.meta.env.BASE_URL':JSON.stringify('/')},plugins:[{name:'fake-ocr',setup(b){b.onResolve({filter:/^tesseract\.js$/},()=>({path:'fake-ocr',namespace:'fake'}));b.onLoad({filter:/.*/,namespace:'fake'},()=>({contents:'export const PSM={SINGLE_LINE:7,SINGLE_CHAR:10,SPARSE_TEXT:11};export async function createWorker(){return globalThis.testOcrWorker;}',loader:'js'}));}}]});
 const {scanScreen}=await import(pathToFileURL(output));
 let closed=0,terminated=0,rejectRecognition,recognizing;
 const ready=new Promise(resolve=>{recognizing=resolve;});
 globalThis.createImageBitmap=async()=>({width:400,height:870,close(){closed++;}});
 globalThis.document={createElement(){const c={width:1,height:1};c.getContext=()=>({drawImage(){},putImageData(){},fillRect(){},getImageData(){return {width:c.width,height:c.height,data:new Uint8ClampedArray(c.width*c.height*4).fill(255)};}});return c;}};
 globalThis.testOcrWorker={async setParameters(){},recognize(){recognizing();return new Promise((_,reject)=>{rejectRecognition=reject;});},async terminate(){terminated++;rejectRecognition?.(Error('worker terminated'));}};
 const file={name:'test.png',type:'image/png',size:12};
 const pre=new AbortController();pre.abort();await assert.rejects(scanScreen(file,'skill',()=>{},false,pre.signal),e=>e.name==='AbortError');
 assert.equal(closed,1);
 const controller=new AbortController();const running=scanScreen(file,'skill',()=>{},false,controller.signal);await ready;controller.abort();
 await assert.rejects(running,e=>e.name==='AbortError');assert.equal(closed,2);assert.ok(terminated>0);
 console.log('Cancelled scans close bitmaps, terminate OCR workers and reject without a false OCR error.');
}finally{await rm(dir,{recursive:true,force:true});}
