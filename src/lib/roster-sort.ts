import {quantity,totalMerge,type Inventory} from './inventory';
export const sortGroups=['skill','egg','eggMerge','mount','mountMerge','potion'] as const;
export type SortGroup=typeof sortGroups[number];
export const sortLabels:Record<SortGroup,string>={skill:'스킬',egg:'알',eggMerge:'알 합성',mount:'탈것',mountMerge:'탈것 합성',potion:'녹색 물약'};
export type ResourceSort={group:SortGroup;direction:'asc'|'desc'}|null;
const sortValue=(details:Inventory,group:SortGroup)=>group==='eggMerge'?totalMerge(details.egg):group==='mountMerge'?totalMerge(details.mount):quantity(details[group].amount);
export function nextResourceSort(current:ResourceSort,group:SortGroup):ResourceSort{
 return {group,direction:current?.group===group&&current.direction==='desc'?'asc':'desc'};
}
export function sortResources<T extends {details:Inventory;updated_at:string}>(rows:T[],sort:ResourceSort):T[]{
 if(!sort)return rows;
 return [...rows].sort((a,b)=>{
  const left=sortValue(a.details,sort.group),right=sortValue(b.details,sort.group);
  // Missing/invalid values stay last in both directions; zero is a real amount.
  if(left===null&&right!==null)return 1;
  if(right===null&&left!==null)return -1;
  if(left!==null&&right!==null&&left!==right)return sort.direction==='asc'?left-right:right-left;
  return (Date.parse(b.updated_at)||0)-(Date.parse(a.updated_at)||0);
 });
}
