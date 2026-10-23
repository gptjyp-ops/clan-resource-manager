import {quantity,totalMerge,type Inventory} from './inventory';
import {registeredThisWeek} from './weekly-registration';
export const sortGroups=['skill','egg','eggMerge','mount','mountMerge','potion','registration','mergeRegistration'] as const;
export type SortGroup=typeof sortGroups[number];
export const sortLabels:Record<SortGroup,string>={skill:'스킬',egg:'알',eggMerge:'알 합성',mount:'탈것',mountMerge:'탈것 합성',potion:'녹색 물약',registration:'미등록',mergeRegistration:'합성 미등록'};
export type ResourceSort={group:SortGroup;direction:'asc'|'desc'}|null;
type SortRow={details:Inventory;updated_at:string};
const missingMerges=(row:SortRow,now:number)=>!registeredThisWeek(row,now)?2:['egg','mount'].filter(g=>{const item=row.details[g as 'egg'|'mount'];return !item.selected.trim()&&Number(item.extra||0)<=0;}).length;
const sortValue=(row:SortRow,group:SortGroup,now:number):number|null=>{
 if(group==='registration')return registeredThisWeek(row,now)?0:1;
 if(group==='mergeRegistration')return missingMerges(row,now);
 const details=row.details;return group==='eggMerge'?totalMerge(details.egg):group==='mountMerge'?totalMerge(details.mount):quantity(details[group].amount);
};
export function nextResourceSort(current:ResourceSort,group:SortGroup):ResourceSort{
 return {group,direction:current?.group===group&&current.direction==='desc'?'asc':'desc'};
}
export function sortResources<T extends {details:Inventory;updated_at:string}>(rows:T[],sort:ResourceSort,now=Date.now()):T[]{
 if(!sort)return rows;
 return [...rows].sort((a,b)=>{
  const left=sortValue(a,sort.group,now),right=sortValue(b,sort.group,now);
  // Missing/invalid values stay last in both directions; zero is a real amount.
  if(left===null&&right!==null)return 1;
  if(right===null&&left!==null)return -1;
  if(left!==null&&right!==null&&left!==right)return sort.direction==='asc'?left-right:right-left;
  return (Date.parse(b.updated_at)||0)-(Date.parse(a.updated_at)||0);
 });
}
