import {googleScriptUrl} from './google-config';

type ClientReport={kind:'client-error';id:string;code:string;screen:string;occurredAt:string;os:string;browser:string;version:string};
type Pending={report:ClientReport;attempts:number;nextAttempt:number};
export type ErrorReportStatus='queued'|'attempted';
const slot='crm-client-errors-v1',cooldownMs=10*60*1000,maximum=20;
let running:Promise<void>|undefined;
let memoryQueue:Pending[]=[];
let storageAvailable=true;
function read():Pending[]{
 if(!storageAvailable)return memoryQueue;
 try{
  const parsed=JSON.parse(localStorage.getItem(slot)||'[]');
  if(Array.isArray(parsed)){memoryQueue=parsed.filter(x=>x&&x.report&&typeof x.report.id==='string').slice(-maximum);return memoryQueue;}
 }catch{storageAvailable=false;}
 return memoryQueue;
}
function save(items:Pending[]){
 memoryQueue=items.slice(-maximum);
 if(!storageAvailable)return;
 try{localStorage.setItem(slot,JSON.stringify(memoryQueue));}
 catch{storageAvailable=false;} // Private browsing: continue network attempts using in-memory queue.
}
function device(){
 const ua=navigator.userAgent;
 const os=/Android/i.test(ua)?'Android':/iPhone|iPad|iPod/i.test(ua)?'iOS':/Windows/i.test(ua)?'Windows':/Macintosh|Mac OS X/i.test(ua)?'macOS':'Other';
 const browser=/KAKAOTALK/i.test(ua)?'KakaoTalk':/Instagram/i.test(ua)?'Instagram':/NAVER\(/i.test(ua)?'Naver':/Edg\//i.test(ua)?'Edge':/SamsungBrowser/i.test(ua)?'Samsung Internet':/CriOS|Chrome\//i.test(ua)?'Chrome':/FxiOS|Firefox\//i.test(ua)?'Firefox':/Safari\//i.test(ua)?'Safari':'Other';
 return {os,browser};
}
function reportEndpoint(){
 const url=(import.meta.env.VITE_ERROR_REPORT_URL||googleScriptUrl).trim();
 return /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url)?url:'';
}
function buildReport(code:string,screen:string):ClientReport{
 const {os,browser}=device();
 return {kind:'client-error',id:crypto.randomUUID(),code,screen:screen.slice(0,45),occurredAt:new Date().toISOString(),os,browser,version:(import.meta.env.VITE_BUILD_SHA||'unknown').slice(0,40)};
}
export async function reportClientError(code:string,screen:string):Promise<ErrorReportStatus>{
 if(!/^CRM-[A-Z]+-\d{3}$/.test(code))return 'queued';
 const now=Date.now(),queue=read(),previous=queue.find(x=>x.report.code===code&&x.report.screen===screen&&now-Date.parse(x.report.occurredAt)<cooldownMs);
 if(!previous){const record={report:buildReport(code,screen),attempts:0,nextAttempt:0};queue.push(record);save(queue);}
 await flushClientErrorReports();
 const entry=read().find(x=>x.report.code===code&&x.report.screen===screen&&now-Date.parse(x.report.occurredAt)<cooldownMs);
 return entry&&entry.attempts>0?'attempted':'queued';
}
export function flushClientErrorReports():Promise<void>{
 if(running)return running;
 running=(async()=>{
  const url=reportEndpoint();if(!url||!navigator.onLine)return;
  const queue=read();
  for(const item of queue){
   if(item.attempts>=5||Date.now()<item.nextAttempt)continue;
   try{
    // Uses a public, narrow report-only doPost route, not the iframe login bridge.
    // An opaque no-cors response proves only that the browser completed its request,
    // NOT that the server accepted the report. Keep the same ID for later retries.
    await fetch(url,{method:'POST',mode:'no-cors',credentials:'omit',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify(item.report),keepalive:true});
    item.attempts++;
    item.nextAttempt=Date.now()+Math.min(60*60*1000,10*60*1000*Math.pow(2,item.attempts-1));
   }catch{
    item.nextAttempt=Date.now()+60*1000;
   }
   save(queue);
  }
  // Clear old or exhausted attempts, never keep sensitive content.
  save(queue.filter(x=>Date.now()-Date.parse(x.report.occurredAt)<48*60*60*1000&&x.attempts<5));
 })().finally(()=>{running=undefined});
 return running;
}
