import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const url=source=>'data:text/javascript;base64,'+Buffer.from(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64');
const ocrUrl=url(fs.readFileSync('src/lib/ocr.ts','utf8'));
const inventoryUrl=url(fs.readFileSync('src/lib/inventory.ts','utf8').replace("'./ocr'",JSON.stringify(ocrUrl)));
const {emptyInventory,groups}=await import(inventoryUrl);
const weeklyUrl=url(fs.readFileSync('src/lib/weekly-registration.ts','utf8'));
const {sortResources,nextResourceSort}=await import(url(fs.readFileSync('src/lib/roster-sort.ts','utf8').replace("'./inventory'",JSON.stringify(inventoryUrl)).replace("'./weekly-registration'",JSON.stringify(weeklyUrl))));
const rows=['','0','915','5.81k','16k','bad'].map((amount,i)=>{const details=emptyInventory();for(const group of groups)details[group].amount=amount;return {id:i,details,updated_at:`2026-10-04T00:00:0${i}Z`};});
const before=JSON.stringify(rows);
for(const group of groups){
 assert.deepEqual(sortResources(rows,{group,direction:'desc'}).map(r=>r.id),[4,3,2,1,5,0]);
 assert.deepEqual(sortResources(rows,{group,direction:'asc'}).map(r=>r.id),[1,2,3,4,5,0]);
 assert.deepEqual(nextResourceSort(null,group),{group,direction:'desc'});
 assert.deepEqual(nextResourceSort({group,direction:'desc'},group),{group,direction:'asc'});
 assert.deepEqual(nextResourceSort({group,direction:'asc'},group),{group,direction:'desc'});
}
assert.deepEqual(nextResourceSort({group:'skill',direction:'asc'},'egg'),{group:'egg',direction:'desc'});
assert.equal(sortResources(rows,null),rows);
assert.equal(JSON.stringify(rows),before);
const ties=rows.slice(2,4).map(r=>({...r,details:{...r.details,skill:{...r.details.skill,amount:'1k'}}}));
assert.deepEqual(sortResources(ties,{group:'skill',direction:'asc'}).map(r=>r.id),[3,2]);
console.log('All four resource sorts handle units, zero, missing values, ties, toggles and preserve input.');

// Merge ordering includes selected + extra, retains zero and keeps missing last.
for(const group of ['egg','mount']){
 const mergeRows=[['10','5'],['0','0'],['','0'],['','8'],['20','0']].map(([selected,extra],id)=>{const details=emptyInventory();details[group].selected=selected;details[group].extra=extra;details[group].amount=String(100-id);return {id,details,updated_at:'2026-10-06T00:00:00Z'};});
 const key=group+'Merge',snapshot=JSON.stringify(mergeRows);
 assert.deepEqual(sortResources(mergeRows,{group:key,direction:'desc'}).map(r=>r.id),[4,0,3,1,2]);
 assert.deepEqual(sortResources(mergeRows,{group:key,direction:'asc'}).map(r=>r.id),[1,3,0,4,2]);
 assert.deepEqual(nextResourceSort(null,key),{group:key,direction:'desc'});
 assert.deepEqual(nextResourceSort({group:key,direction:'desc'},key),{group:key,direction:'asc'});
 assert.deepEqual(nextResourceSort({group:key,direction:'asc'},key),{group:key,direction:'desc'});
 assert.equal(JSON.stringify(mergeRows),snapshot);
}
console.log('Egg and mount merge sorts include extra counts and preserve missing/zero values.');

// Status sorts use the same weekly cutoff as nickname colors, retain explicit zero,
// include extra merge counts, and update correctly when Sunday rolls over.
const now=Date.parse('2026-10-23T12:00:00Z');
const statusRows=[
 {id:'old',date:'2026-10-17T23:59:59Z',merges:['9','9']},
 {id:'both',date:'2026-10-23T03:00:00Z',merges:['','']},
 {id:'one',date:'2026-10-23T02:00:00Z',merges:['0','']},
 {id:'done',date:'2026-10-23T01:00:00Z',merges:['0','0']},
 {id:'extra',date:'2026-10-23T00:00:00Z',merges:['','0'],extra:'3'},
 {id:'empty',date:'2026-10-23T04:00:00Z',merges:['',''],empty:true}
].map(r=>{const details=emptyInventory();details.skill.amount=r.empty?'':'0';details.egg.selected=r.merges[0];details.mount.selected=r.merges[1];details.egg.extra=r.extra||'0';return {id:r.id,updated_at:r.date,details};});
const snapshot=JSON.stringify(statusRows);
assert.deepEqual(sortResources(statusRows,{group:'registration',direction:'desc'},now).map(r=>r.id),['empty','old','both','one','done','extra']);
assert.deepEqual(sortResources(statusRows,{group:'registration',direction:'asc'},now).map(r=>r.id),['both','one','done','extra','empty','old']);
assert.deepEqual(sortResources(statusRows,{group:'mergeRegistration',direction:'desc'},now).map(r=>r.id),['empty','both','old','one','done','extra']);
assert.deepEqual(sortResources(statusRows,{group:'mergeRegistration',direction:'asc'},now).map(r=>r.id),['done','extra','one','empty','both','old']);
assert.deepEqual(sortResources(statusRows,{group:'mergeRegistration',direction:'asc'},Date.parse('2026-10-25T00:00:00Z')).map(r=>r.id),['empty','both','one','done','extra','old']);
assert.equal(JSON.stringify(statusRows),snapshot);
for(const group of ['registration','mergeRegistration']){
 assert.deepEqual(nextResourceSort(null,group),{group,direction:'desc'});
 assert.deepEqual(nextResourceSort({group,direction:'desc'},group),{group,direction:'asc'});
}
console.log('Weekly registration and missing-merge sorting pass cutoff, zero, extra, ties and rollover checks.');
