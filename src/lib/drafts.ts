import {emptyInventory,groups,photoKinds,type Inventory,type ChangedFields,type PhotoKind} from './inventory';
import {maximumPhotoBytes,normalizePhoto} from './photo-input';
export type Draft={id:string;clanId:string;nickname:string;inventory:Inventory;changedFields:ChangedFields;files:Partial<Record<PhotoKind,File>>;photos:Partial<Record<PhotoKind,string>>;saveMode:'all'|'partial';updatedAt:number};
export const draftId=(clanId:string,nickname:string)=>JSON.stringify([clanId,nickname.trim().normalize('NFKC')]);
// Explicit allow-list: passwords, invitation codes and sessions never enter IndexedDB.
export function draftRecord(clanId:string,value:Omit<Draft,'id'|'clanId'|'updatedAt'>):Draft{
 const nickname=value.nickname.trim().normalize('NFKC').slice(0,24),inventory=emptyInventory(),changedFields:ChangedFields={},files:Draft['files']={},photos:Draft['photos']={};
 for(const g of groups){for(const key of Object.keys(inventory[g]) as (keyof Inventory[typeof g])[])inventory[g][key]=String(value.inventory[g][key]).slice(0,24);changedFields[g]=(value.changedFields[g]||[]).filter(k=>Object.hasOwn(inventory[g],k));}
 for(const kind of photoKinds){const file=value.files[kind];if(file){const normalized=normalizePhoto(file);if(!normalized||file.size>maximumPhotoBytes)throw Error('임시 보관할 사진 크기와 형식을 확인해주세요.');files[kind]=normalized;}if(typeof value.photos[kind]==='string')photos[kind]=value.photos[kind];}
 return {id:draftId(clanId,nickname),clanId,nickname,inventory,changedFields,files,photos,saveMode:value.saveMode==='partial'?'partial':'all',updatedAt:Date.now()};
}
async function database(){if(typeof indexedDB==='undefined')throw Error('이 브라우저에서는 임시 보관을 사용할 수 없습니다.');return new Promise<IDBDatabase>((resolve,reject)=>{const request=indexedDB.open('clan-resource-drafts',1);request.onupgradeneeded=()=>{request.result.createObjectStore('drafts',{keyPath:'id'});};request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);request.onblocked=()=>reject(Error('임시 보관 연결이 막혔습니다. 다른 재화관리 탭을 닫고 다시 시도해주세요.'));});}
let queue:Promise<unknown>=Promise.resolve();
function serialize<T>(action:()=>Promise<T>):Promise<T>{const next=queue.catch(()=>{}).then(action);queue=next;return next;}
function transaction<T>(mode:IDBTransactionMode,operation:(store:IDBObjectStore)=>IDBRequest<T>):Promise<T>{return serialize(async()=>{const db=await database();try{return await new Promise<T>((resolve,reject)=>{const tx=db.transaction('drafts',mode),request=operation(tx.objectStore('drafts'));tx.oncomplete=()=>resolve(request.result);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('임시 보관에 실패했습니다.'));});}finally{db.close();}});}
export async function putDraft(record:Draft){await transaction('readwrite',s=>s.put(record));}
export async function removeDraft(id:string){await transaction('readwrite',s=>s.delete(id));}
export async function listDrafts(clanId:string):Promise<Draft[]>{const records=await transaction('readonly',s=>s.getAll());return records.filter((d:Draft)=>d.clanId===clanId).sort((a:Draft,b:Draft)=>b.updatedAt-a.updatedAt);}
