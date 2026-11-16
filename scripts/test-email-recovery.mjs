import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
const props=new Map(),sheets=new Map(),folders=new Map(),files=new Map();
function makeSheet(name){const rows=[];const sheet={rows,getLastRow:()=>rows.length,setName(n){sheets.delete(name);name=n;sheets.set(n,sheet);},setFrozenRows(){},hideSheet(){sheet.hidden=true;},deleteRow(row){rows.splice(row-1,1);},appendRow:r=>rows.push([...r]),getRange(row,col,count,width){return {getValues:()=>rows.slice(row-1,row-1+count).map(r=>r.slice(col-1,col-1+width)),setValues(values){values.forEach((r,i)=>r.forEach((v,j)=>rows[row-1+i][col-1+j]=v));}};}};sheets.set(name,sheet);return sheet;}
const book={getId:()=> 'book',getSheets:()=>[...sheets.values()],getSheetByName:n=>sheets.get(n)||null,insertSheet:n=>makeSheet(n)};makeSheet('Sheet1');
function makeFolder(){const id=crypto.randomUUID();const folder={getId:()=>id,createFile(blob){const fileId=crypto.randomUUID();const f={getId:()=>fileId,setTrashed(){f.trashed=true;},getBlob:()=>({getBytes:()=>blob.bytes,getContentType:()=>blob.type}),getParents:()=>{let used=false;return {hasNext:()=>!used,next:()=>{used=true;return folder;}};}};files.set(fileId,f);return f;}};folders.set(id,folder);return folder;}
const context={console:{log(){},error(){}},PropertiesService:{getScriptProperties:()=>({getProperty:k=>props.get(k)||null,setProperty:(k,v)=>props.set(k,v),deleteProperty:k=>props.delete(k)})},Utilities:{getUuid:()=>crypto.randomUUID(),computeHmacSha256Signature:(value,key)=>[...crypto.createHmac('sha256',key).update(value).digest()],base64Decode:s=>[...Buffer.from(s,'base64')],base64Encode:b=>Buffer.from(b).toString('base64'),newBlob:(bytes,type)=>({bytes,type})},LockService:{getScriptLock:()=>({waitLock(){},tryLock:()=>true,releaseLock(){}})},SpreadsheetApp:{create:()=>book,openById:()=>book,flush(){}},DriveApp:{createFolder:()=>makeFolder(),getFolderById:id=>folders.get(id),getFileById:id=>files.get(id)}};
const sent=[];let failMail=false;context.MailApp={getRemainingDailyQuota:()=>100,sendEmail(message){if(failMail)throw Error('mail unavailable');sent.push(message);}};context.ScriptApp={getService:()=>({getUrl:()=> 'https://script.google.com/macros/s/test/exec'})};
vm.createContext(context);vm.runInContext(fs.readFileSync('google/Code.gs','utf8'),context);context.setup_();
const call=(method,payload)=>JSON.parse(JSON.stringify(context.clanRpc(method,payload)));
const clan=call('list',{operation:'createClan',name:'Private',server:'27',password:'administrator-123'});
const other=call('list',{operation:'createClan',name:'Other',server:'28',password:'administrator-456'});
const access={clanId:clan.clan.id,accessKey:clan.clan.inviteKey};
const inventory=Object.fromEntries(['skill','egg','mount','potion'].map(g=>[g,{amount:'10',level:'32',progress:'0',target:'110',selected:'',extra:'0'}]));
const save=(nickname='member',extra={})=>call('save',{...access,nickname,password:'member-password',inventory,photos:[],...extra});
const action=(operation,p={})=>call('list',{...access,operation,nickname:'member',...p});
const sheet=()=>sheets.get('clan_'+clan.clan.id);
const row=()=>sheet().rows.find(r=>r[0]==='"member"');
const state=()=>JSON.parse(row()[8]||'{}');
const allow=()=>{const value=state();delete value.lastSent;row()[8]=JSON.stringify(value);for(const key of props.keys())if(key.startsWith('EMAIL_'))props.delete(key);};
const grant=message=>{const url=new URL(message.body.split('\n').find(l=>l.startsWith('https:')));return [url.searchParams.get('clan'),url.searchParams.get('nickname'),url.searchParams.get('token'),url.searchParams.get('emailRecovery')];};
const complete=(g,password='',confirmation=password)=>context.completeEmailRecovery(...g,password,confirmation);
assert.equal(action('capabilities').emailRecovery,true);
assert.equal(save('bad',{recoveryEmail:'x@example.com\nBcc: bad@example.com'}).ok,false);
assert.equal(save('member',{recoveryEmail:'User@Example.com'}).ok,true);
assert.equal(sent.length,1);assert.equal(sent.length,1);assert.equal(sent[0].to,'user@example.com');
const verify=grant(sent[0]);assert.equal(state().email,undefined);assert.ok(!JSON.stringify(state()).includes(verify[2]));
const original=JSON.stringify(row().slice(0,8));
assert.equal(action('registerRecoveryEmail',{email:'attacker@example.com',password:'wrong-password'}).ok,false);
const expired=state();expired.pending.expires=Date.now()-1;row()[8]=JSON.stringify(expired);assert.throws(()=>complete(verify));expired.pending.expires=Date.now()+900000;row()[8]=JSON.stringify(expired);
assert.equal(action('registerRecoveryEmail',{email:'user@example.com',password:'member-password'}).ok,false); // cooldown

assert.equal(action('requestEmailReset',{email:'user@example.com'}).ok,true);assert.equal(sent.length,1);assert.equal(sent.length,1);
assert.equal(action('registerRecoveryEmail',{email:'attacker@example.com',password:'incorrect-password'}).ok,false);
assert.throws(()=>complete([other.clan.id,...verify.slice(1)]));
assert.throws(()=>complete([verify[0],verify[1],'0'.repeat(64),verify[3]]));
assert.equal(complete(verify).ok,true);assert.equal(state().email,'user@example.com');assert.throws(()=>complete(verify));
assert.equal(JSON.stringify(row().slice(0,6)),JSON.stringify(JSON.parse(original).slice(0,6)));
assert.equal(JSON.stringify(call('list',access)).includes('user@example.com'),false);
allow();assert.equal(action('requestEmailReset',{email:'wrong@example.com'}).ok,true);assert.equal(sent.length,1);assert.equal(sent.length,1);
assert.equal(action('requestEmailReset',{nickname:'missing',email:'user@example.com'}).ok,true);assert.equal(sent.length,1);assert.equal(sent.length,1);
assert.equal(action('requestEmailReset',{email:'user@example.com'}).ok,true);assert.equal(sent.length,2);
const reset=grant(sent[1]);assert.equal(action('requestEmailReset',{email:'user@example.com'}).ok,true);assert.equal(sent.length,2);
assert.throws(()=>complete(reset,'short'));assert.throws(()=>complete(reset,'new-password','mismatch'));
let v=state();v.reset.expires=Date.now()-1;row()[8]=JSON.stringify(v);assert.throws(()=>complete(reset,'new-password'));
allow();action('requestEmailReset',{email:'user@example.com'});const valid=grant(sent.at(-1));
const resources=JSON.stringify(row().slice(3,6));assert.equal(complete(valid,'new-password').ok,true);assert.throws(()=>complete(valid,'new-password'));
assert.equal(JSON.stringify(row().slice(3,6)),resources);
assert.equal(action('memberLogin',{password:'member-password'}).ok,false);
assert.equal(action('memberLogin',{password:'new-password'}).ok,true);
assert.equal(action('recoverMemberPassword',{recoveryCode:'invalid',newPassword:'not-allowed'}).ok,false);
// A new address never replaces the verified address until mailbox verification.
allow();assert.equal(action('registerRecoveryEmail',{email:'next@example.com',password:'new-password'}).ok,true);
const next=grant(sent.at(-1));assert.equal(state().email,'user@example.com');
allow();action('requestEmailReset',{email:'user@example.com'});const staleReset=grant(sent.at(-1));
complete(next);assert.equal(state().email,'next@example.com');assert.throws(()=>complete(staleReset,'newer-password'));
// QR/password rotation invalidates all outstanding email grants.
allow();action('requestEmailReset',{email:'next@example.com'});const beforeRotation=grant(sent.at(-1));
const ticket=action('issueMemberTicket',{password:'new-password',preservePassword:true});assert.equal(ticket.ok,true);
assert.throws(()=>complete(beforeRotation,'newest-password'));
allow();assert.equal(action('registerRecoveryEmail',{email:'qr@example.com',password:ticket.token}).ok,true);complete(grant(sent.at(-1)));
allow();action('requestEmailReset',{email:'qr@example.com'});complete(grant(sent.at(-1)),'reset-from-qr');
assert.equal(action('ticketEnter',{token:ticket.token}).ok,false);
assert.equal(action('memberLogin',{password:'new-password'}).ok,false); // Password backup is revoked too.
assert.equal(action('memberLogin',{password:'reset-from-qr'}).ok,true);
// Mail failure rolls back tokens/address; save succeeds with explicit warning.
allow();const before=JSON.stringify(state());failMail=true;
assert.equal(action('registerRecoveryEmail',{email:'fail@example.com',password:'reset-from-qr'}).ok,false);assert.equal(JSON.stringify(state()),before);
const saved=save('fresh',{recoveryEmail:'fail@example.com'});assert.equal(saved.ok,true);assert.ok(saved.emailWarning);assert.equal(saved.emailSent,false);failMail=false;
// Deletion and reuse of a nickname cannot inherit the old email identity or link.
allow();action('requestEmailReset',{email:'qr@example.com'});const deleted=grant(sent.at(-1));
sheet().rows.splice(sheet().rows.indexOf(row()),1);assert.throws(()=>complete(deleted,'cannot-reset'));
assert.equal(save().ok,true);assert.equal(state().email,undefined);assert.throws(()=>complete(deleted,'cannot-reset'));
// Direct page visits are display-only, with no raw HTML/script injection.
context.HtmlService={createHtmlOutput:html=>({html,setTitle(){return this;}})};
const snapshot=JSON.stringify(sheet().rows);
const page=context.emailRecoveryPage_({clan:'</script><script>bad</script>',nickname:'<img onerror=bad>',token:'123',emailRecovery:'reset'});
assert.equal(page.html.includes('</script><script>bad'),false);assert.equal(page.html.includes('<img onerror'),false);assert.equal(JSON.stringify(sheet().rows),snapshot);
console.log('Email recovery: verified-only, private, throttled, expiring/single-use, clan/member/credential bound; reset revokes QR/password backup; failure rollback and resources preserved.');
