import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const url=source=>'data:text/javascript;base64,'+Buffer.from(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64');
const ocrUrl=url(fs.readFileSync('src/lib/ocr.ts','utf8'));
const inventoryUrl=url(fs.readFileSync('src/lib/inventory.ts','utf8').replace("'./ocr'",JSON.stringify(ocrUrl)));
const {emptyInventory,groups}=await import(inventoryUrl);
const {sortResources,nextResourceSort}=await import(url(fs.readFileSync('src/lib/roster-sort.ts','utf8').replace("'./inventory'",JSON.stringify(inventoryUrl))));
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
