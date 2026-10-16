// Only confirmed merge counts earn these points. Summon costs and random
// duplicate drops are intentionally not part of this calculation.
export function mountMergeScore(countText:string,pointsText:string){
 const count=countText.replace(/[\s,]/g,''),points=pointsText.replace(/[\s,]/g,'');
 if(!/^\d{1,15}$/.test(count)||!/^\d{1,9}$/.test(points))return null;
 const amount=BigInt(count),perMerge=BigInt(points);
 return {count:amount,points:perMerge,total:amount*perMerge};
}
