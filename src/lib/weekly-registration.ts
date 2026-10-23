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
