import assert from 'node:assert/strict';import fs from 'node:fs';import ts from 'typescript';
const js=ts.transpileModule(fs.readFileSync('src/lib/ocr-worker.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {createOcrWorker}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const worker={terminate:async()=>{}};let calls=[];
const factory=async(lang,oem,opts)=>{calls.push(opts);if(calls.length===1){queueMicrotask(()=>opts.errorHandler('language fetch failed'));return new Promise(()=>{});}return worker;};
assert.equal(await createOcrWorker(factory,'eng',{corePath:'/auto',fallbackCorePath:'/baseline'}),worker);assert.equal(calls.length,2);assert.equal(calls[1].cacheMethod,'none');assert.equal(calls[1].corePath,'/baseline');
let tries=0;await assert.rejects(createOcrWorker(async()=>{tries++;throw Error('offline');},'eng',{}),/offline/);assert.equal(tries,2);
const controller=new AbortController();let abortedCalls=0;const running=createOcrWorker(async()=>{abortedCalls++;return new Promise(()=>{});},'eng',{},controller.signal);controller.abort();await assert.rejects(running,e=>e.name==='AbortError');assert.equal(abortedCalls,1);
console.log('OCR worker initialization: errorHandler failures retry without cache, bounded failures and cancellation passed.');
