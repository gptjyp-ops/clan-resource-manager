// Sunday 09:00 Asia/Seoul is Sunday 00:00 UTC (Korea has no DST).
export function registrationWeekStart(now=Date.now()):number{
 const d=new Date(now);return Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()-d.getUTCDay());
}
type Registration={updated_at:string;details:Record<string,{amount?:string;selected?:string;extra?:string}>};
export function registeredThisWeek(record:Registration,now=Date.now()):boolean{
 const saved=Date.parse(record.updated_at);
 const hasResources=Object.values(record.details).some(i=>(i.amount??'').trim()!==''||(i.selected??'').trim()!==''||Number(i.extra||0)>0);
 return hasResources&&Number.isFinite(saved)&&saved>=registrationWeekStart(now)&&saved<=now;
}

export function registrationDisplay(record:Registration,now=Date.now()){
 if(!registeredThisWeek(record,now))return {color:'#ff7b85',label:'이번 주 미등록',status:'none'} as const;
 const missingMerge=['egg','mount'].some(g=>!(record.details[g]?.selected??'').trim()&&Number(record.details[g]?.extra||0)<=0);
 if(missingMerge)return {color:'#f6d65b',label:'합성 미입력',status:'partial'} as const;
 const missingAmount=['skill','egg','mount','potion'].some(g=>!(record.details[g]?.amount??'').trim());
 if(missingAmount)return {color:'#f6d65b',label:'재화 일부 미입력',status:'partial'} as const;
 return {color:'#55dfc5',label:'전체 입력 완료',status:'complete'} as const;
}
