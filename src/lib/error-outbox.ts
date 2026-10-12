import {activeClanId,googleEnabled,savedAccessKey,sendScanReport} from './api';
import type {ScanReport} from './scan-diagnostics';
type Pending={id:string;clan:string;report:ScanReport};
function database():Promise<IDBDatabase>{return new Promise((resolve,reject)=>{const open=indexedDB.open('clan-ocr-errors',1);open.onupgradeneeded=()=>open.result.createObjectStore('reports',{keyPath:'id'});open.onsuccess=()=>resolve(open.result);open.onerror=()=>reject(Error('오류를 이 기기에 저장하지 못했습니다.'));});}
async function transaction<T>(mode:IDBTransactionMode,action:(store:IDBObjectStore)=>IDBRequest<T>):Promise<T>{const db=await database();try{return await new Promise<T>((resolve,reject)=>{const tx=db.transaction('reports',mode),request=action(tx.objectStore('reports'));tx.oncomplete=()=>resolve(request.result);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});}finally{db.close();}}
export async function saveErrorReport(report:ScanReport){if(!report.issues.length)return;report.id||=crypto.randomUUID();await transaction('readwrite',s=>s.put({id:report.id!,clan:activeClanId,report} satisfies Pending));}
let running:Promise<void>|undefined;
export function flushErrorReports():Promise<void>{if(running)return running;running=(async()=>{if(!googleEnabled||!savedAccessKey())return;const reports=await transaction<Pending[]>('readonly',s=>s.getAll());for(const entry of reports){if(entry.clan!==activeClanId)continue;await sendScanReport(entry.report);await transaction('readwrite',s=>s.delete(entry.id));}})().finally(()=>{running=undefined;});return running;}
