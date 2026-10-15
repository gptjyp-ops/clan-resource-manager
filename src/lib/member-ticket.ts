export type MemberTicket={v:1;clanId:string;nickname:string;token:string};
export const ticketPrefix='CLAN-TICKET/1:';
export function parseTicket(text:string):MemberTicket{
 if(!text.startsWith(ticketPrefix)||text.length>1500)throw Error('개인 QR 티켓이 아닙니다. 저장한 티켓 이미지를 선택해주세요.');
 let d:any;try{d=JSON.parse(text.slice(ticketPrefix.length));}catch{throw Error('개인 QR 티켓을 읽지 못했습니다.');}
 if(d.v!==1||typeof d.clanId!=='string'||!/^(legacy|[a-f0-9]{24})$/.test(d.clanId)||typeof d.nickname!=='string'||!d.nickname.trim()||d.nickname.length>24||d.nickname!==d.nickname.normalize('NFKC').trim()||typeof d.token!=='string'||!/^[a-f0-9]{64}$/.test(d.token))throw Error('개인 QR 티켓을 읽지 못했습니다.');
 return {v:1,clanId:d.clanId,nickname:d.nickname,token:d.token};
}
export const ticketText=(t:MemberTicket)=>ticketPrefix+JSON.stringify({v:1,clanId:t.clanId,nickname:t.nickname,token:t.token});
export function newTicket(clanId:string,nickname:string):MemberTicket{const b=crypto.getRandomValues(new Uint8Array(32));return parseTicket(ticketPrefix+JSON.stringify({v:1,clanId,nickname:nickname.trim().normalize('NFKC'),token:Array.from(b,n=>n.toString(16).padStart(2,'0')).join('')}));}
export function ticketNumbers(t:MemberTicket):number[]{const numbers=new Set<number>();for(let i=0;i<t.token.length;i+=2){numbers.add(parseInt(t.token.slice(i,i+2),16)%45+1);if(numbers.size===6)break;}for(let i=1;numbers.size<6;i++)numbers.add(i);return [...numbers].sort((a,b)=>a-b);}
const slot=(clanId:string)=>'clanMemberTicket:'+clanId;
const memory=new Map<string,MemberTicket>();
export function rememberTicket(t:MemberTicket){const valid=parseTicket(ticketText(t));memory.set(t.clanId,valid);try{localStorage.setItem(slot(t.clanId),ticketText(valid));}catch{}}
export function savedTicket(clanId:string):MemberTicket|null{try{const s=localStorage.getItem(slot(clanId));if(s){const t=parseTicket(s);return t.clanId===clanId?t:null;}}catch{}return memory.get(clanId)||null;}
export function forgetTicket(clanId:string){memory.delete(clanId);try{localStorage.removeItem(slot(clanId));}catch{}}
