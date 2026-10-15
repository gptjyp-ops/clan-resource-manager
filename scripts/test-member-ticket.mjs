import assert from 'node:assert/strict';
import fs from 'node:fs';
import {build} from 'esbuild';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import {PNG} from 'pngjs';
import crypto from 'node:crypto';

const data=new Map();globalThis.localStorage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};
const bundled=await build({entryPoints:['src/lib/member-ticket.ts'],bundle:true,write:false,platform:'node',format:'esm'});
const {newTicket,parseTicket,ticketText,ticketNumbers,savedTicket,rememberTicket,forgetTicket}=await import('data:text/javascript;base64,'+Buffer.from(bundled.outputFiles[0].text).toString('base64'));
const clan='a'.repeat(24),ticket=newTicket(clan,' Ｍember '),other=newTicket(clan,'Member');
assert.equal(ticket.nickname,'Member');assert.match(ticket.token,/^[a-f0-9]{64}$/);assert.notEqual(ticket.token,other.token);assert.deepEqual(parseTicket(ticketText(ticket)),ticket);
const balls=ticketNumbers(ticket);assert.equal(balls.length,6);assert.equal(new Set(balls).size,6);assert.ok(balls.every(n=>n>=1&&n<=45));
assert.throws(()=>parseTicket('https://untrusted.example/'+ticket.token));assert.throws(()=>parseTicket(ticketText({...ticket,clanId:'wrong'})));assert.throws(()=>parseTicket(ticketText({...ticket,token:'123456'})));
rememberTicket(ticket);assert.deepEqual(savedTicket(clan),ticket);assert.equal(savedTicket('b'.repeat(24)),null);forgetTicket(clan);assert.equal(savedTicket(clan),null);
// The exact QR payload survives PNG encoding and placement in the combined
// front/back image layout used by the download button. No network QR service.
const qr=PNG.sync.read(await QRCode.toBuffer(ticketText(ticket),{width:380,margin:4,errorCorrectionLevel:'M'}));
const card=new PNG({width:1200,height:970});card.data.fill(255);PNG.bitblt(qr,card,0,0,380,380,720,435);
const result=jsQR(new Uint8ClampedArray(card.data),card.width,card.height,{inversionAttempts:'dontInvert'});
assert.ok(result);assert.deepEqual(parseTicket(result.data),ticket);
console.log('Personal ticket entropy, nickname normalization, clan isolation, image QR round-trip and device logout passed.');
