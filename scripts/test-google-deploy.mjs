import assert from 'node:assert/strict';
import {credentials,deployGoogle} from './deploy-google.mjs';
const auth={client_id:'client',client_secret:'secret',refresh_token:'refresh'};
assert.deepEqual(credentials(JSON.stringify({tokens:{default:auth}})),auth);
assert.throws(()=>credentials('{}'),/로그인/);
const scriptId='s'.repeat(30),deploymentId='d'.repeat(30);
const env={GAS_SCRIPT_ID:scriptId,GAS_DEPLOYMENT_ID:deploymentId,GAS_OAUTH_JSON:JSON.stringify(auth),GITHUB_SHA:'12345678901234567890'};
const original=[{name:'appsscript',type:'JSON',source:'{"timeZone":"Asia/Seoul"}'},{name:'Code',type:'SERVER_JS',source:'old'},{name:'Extra',type:'SERVER_JS',source:'keep',createTime:'metadata'}];
async function scenario({failUpdate=false,concurrent=false}={}){
 let files=structuredClone(original),reads=0;const calls=[];
 const fetcher=async(url,options)=>{
  calls.push({url,method:options.method,payload:options.body&&options.method!=='POST'?JSON.parse(options.body):undefined});
  const ok=data=>({ok:true,status:200,json:async()=>data});
  if(url.endsWith('/token'))return ok({access_token:'token'});
  if(url.endsWith('/deployments/'+deploymentId)){
   if(options.method==='PUT')return failUpdate?{ok:false,status:403}:ok({});
   return ok({deploymentId,deploymentConfig:{scriptId,versionNumber:1,manifestFileName:'appsscript'},entryPoints:[{entryPointType:'WEB_APP'}]});
  }
  if(url.endsWith('/content')){
   if(options.method==='PUT'){files=JSON.parse(options.body).files;return ok({});}
   reads++;return ok({files:concurrent&&reads===2?[...files,{name:'Changed',type:'SERVER_JS',source:'new'}]:files});
  }
  if(url.endsWith('/versions'))return ok({versionNumber:2});
  throw Error('Unexpected request');
 };
 const run=()=>deployGoogle({env,fetcher,read:async path=>path.endsWith('.gs')?'newCode':'newBridge'});
 return {run,calls,get files(){return files;}};
}
let s=await scenario();assert.equal((await s.run()).version,2);
assert.equal(s.files.find(f=>f.name==='Extra').source,'keep');assert.equal(s.files.find(f=>f.name==='appsscript').source,original[0].source);
assert.equal(s.files.find(f=>f.name==='Code').source,'newCode');assert.equal(s.files.find(f=>f.name==='Bridge').type,'HTML');
assert.equal(s.calls.filter(c=>c.url.endsWith('/deployments/'+deploymentId)&&c.method==='PUT').length,1);
assert.equal(s.calls.some(c=>c.method==='DELETE'),false);
s=await scenario({failUpdate:true});await assert.rejects(s.run(),/HTTP 403/);assert.deepEqual(s.files,original.map(({name,type,source})=>({name,type,source})));
s=await scenario({concurrent:true});await assert.rejects(s.run(),/変更|변경/);assert.equal(s.calls.some(c=>c.method==='PUT'),false);
await assert.rejects(deployGoogle({env:{},fetcher:()=>{throw Error('must not call');}}),/최초/);
console.log('Google deployment: existing URL and manifest preserved, unrelated files kept, failure restored, concurrent edits and missing credentials stop writes.');
