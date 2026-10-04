import {quantity,type Group,type Inventory} from './inventory';
export type ResourceSort={group:Group;direction:'asc'|'desc'}|null;
export function nextResourceSort(current:ResourceSort,group:Group):ResourceSort{
 return {group,direction:current?.group===group&&current.direction==='desc'?'asc':'desc'};
}
export function sortResources<T extends {details:Inventory;updated_at:string}>(rows:T[],sort:ResourceSort):T[]{
 if(!sort)return rows;
 return [...rows].sort((a,b)=>{
  const left=quantity(a.details[sort.group].amount),right=quantity(b.details[sort.group].amount);
  // Missing/invalid values stay last in both directions; zero is a real amount.
  if(left===null&&right!==null)return 1;
  if(right===null&&left!==null)return -1;
  if(left!==null&&right!==null&&left!==right)return sort.direction==='asc'?left-right:right-left;
  return (Date.parse(b.updated_at)||0)-(Date.parse(a.updated_at)||0);
 });
}
