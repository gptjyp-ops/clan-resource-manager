import {useEffect,useState,useRef} from 'react';
import {t,useLanguage} from './lib/i18n';
import {parseTicket,ticketText,ticketNumbers,type MemberTicket} from './lib/member-ticket';

export function TicketImport({onImport,disabled=false}:{onImport:(ticket:MemberTicket)=>Promise<void>;disabled?:boolean}){
 const [busy,setBusy]=useState(false),[error,setError]=useState('');
 async function read(file:File){setBusy(true);setError('');try{
  if(file.size>10*1024*1024)throw Error('티켓 이미지는 10MB 이하로 선택해주세요.');
  const {default:jsQR}=await import('jsqr');const bitmap=await createImageBitmap(file);let decoded='';try{
   for(const max of [1800,2600]){const scale=Math.min(1,max/Math.max(bitmap.width,bitmap.height)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));const ctx=canvas.getContext('2d')!;ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);const data=ctx.getImageData(0,0,canvas.width,canvas.height),qr=jsQR(data.data,data.width,data.height,{inversionAttempts:'dontInvert'});if(qr){decoded=qr.data;break;}}
  }finally{bitmap.close();}
  if(!decoded)throw Error('QR을 찾지 못했습니다. 저장한 티켓 이미지 전체를 선택해주세요.');await onImport(parseTicket(decoded));
 }catch(e){setError(e instanceof Error?e.message:'개인 QR 티켓을 읽지 못했습니다.');}finally{setBusy(false);}}
 return <div className="ticket-import"><label className="ticket-import-button">{busy?t('티켓 확인 중…'):t('개인 QR 티켓으로 들어오기')}<input type="file" accept="image/png,image/jpeg,image/webp" disabled={disabled||busy} onChange={e=>{const f=e.target.files?.[0];if(f)void read(f);e.target.value='';}}/></label>{error&&<p role="alert">{t(error)}</p>}</div>;
}
export default function MemberTicketCard({ticket,clanName,onForget,onRotate,disabled=false,newlyIssued=false}:{newlyIssued?:boolean;ticket:MemberTicket;clanName:string;onForget:()=>void;onRotate:()=>Promise<void>;disabled?:boolean}){
 useLanguage();const [back,setBack]=useState(false),[qr,setQr]=useState(''),[error,setError]=useState(''),[rotating,setRotating]=useState(false),[confirm,setConfirm]=useState(false);
 const panel=useRef<HTMLElement>(null),[acknowledged,setAcknowledged]=useState(false),[downloadStarted,setDownloadStarted]=useState(false);
 useEffect(()=>{setAcknowledged(false);setDownloadStarted(false);if(!newlyIssued)return;const frame=requestAnimationFrame(()=>panel.current?.scrollIntoView({behavior:'smooth',block:'start'}));return()=>cancelAnimationFrame(frame);},[ticket.token,newlyIssued]);
 const balls=ticketNumbers(ticket);
 useEffect(()=>{let live=true;setQr('');import('qrcode').then(({default:QRCode})=>QRCode.toDataURL(ticketText(ticket),{width:380,margin:4,errorCorrectionLevel:'M'})).then(s=>{if(live)setQr(s);}).catch(()=>{if(live)setError(t('티켓 이미지를 만들지 못했습니다. 다시 시도해주세요.'));});return()=>{live=false;};},[ticket]);
 async function download(){setError('');try{
  const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=970;const c=canvas.getContext('2d')!;
  c.fillStyle='#0c1625';c.fillRect(0,0,1200,970);c.fillStyle='#1b2c40';c.fillRect(40,40,1120,300);c.fillRect(40,370,1120,560);
  c.fillStyle='#8ae0be';c.font='bold 26px sans-serif';c.fillText('CLAN VAULT  /  PERSONAL TICKET',80,95);
  c.fillStyle='#f4f7fb';c.font='bold 35px sans-serif';c.fillText(ticket.nickname,80,155,1040);c.fillStyle='#a9bbd2';c.font='24px sans-serif';c.fillText(clanName,80,200,1040);
  balls.forEach((n,i)=>{const x=110+i*115;c.fillStyle=['#f5c76a','#84c8ed','#f39a96','#9accc7','#b4a6ea','#cbd48c'][i];c.beginPath();c.arc(x,270,35,0,Math.PI*2);c.fill();c.fillStyle='#172234';c.font='bold 30px sans-serif';c.textAlign='center';c.fillText(String(n),x,280);});c.textAlign='left';
  c.fillStyle='#f4f7fb';c.font='bold 30px sans-serif';c.fillText(t('내 재화를 여는 개인 티켓'),80,440,610);c.fillStyle='#b8c9dd';c.font='23px sans-serif';
  c.fillText(t('이 이미지를 사이트에 올려 로그인하세요.'),80,500,590);c.fillText(t('다른 사람에게 공유하지 마세요.'),80,550,590);c.fillText(t('앞면 숫자는 장식용입니다.'),80,600,590);
  const img=new Image();img.src=qr;await img.decode();c.drawImage(img,720,435,380,380);c.fillStyle='#8ae0be';c.font='22px sans-serif';c.fillText('PERSONAL QR  ·  KEEP PRIVATE',720,855);
  const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error()),'image/png'));const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='clan-personal-ticket.png';a.click();setDownloadStarted(true);setTimeout(()=>URL.revokeObjectURL(url),30000);
 }catch{setError(t('티켓 이미지를 만들지 못했습니다. 다시 시도해주세요.'));}}
 return <section ref={panel} className="member-ticket-panel" style={{scrollMarginTop:24}} aria-label={t('내 개인 티켓')}><div className="ticket-panel-heading"><div><span className="eyebrow">PERSONAL TICKET</span><h2>{t('내 개인 티켓')}</h2></div><span className="ticket-connected">{t('이 기기에 보관 중')}</span></div>
 {newlyIssued&&!acknowledged&&<div className="recovery-receipt" role="status"><h3>{t('개인 티켓이 발급되었습니다. 티켓 이미지를 저장해주세요.')}</h3><p>{t('다음 로그인에 필요합니다. 아래 버튼으로 이미지를 저장하고 사진 앱이나 다운로드 폴더에서 확인해주세요.')}</p><button type="button" className="capture-paste" disabled={!qr} onClick={()=>void download()}>{t('티켓 이미지 저장')}</button>{downloadStarted&&<p>{t('저장이 시작되었습니다. 휴대폰에서는 열린 이미지를 길게 눌러 저장해야 할 수 있습니다.')}</p>}<button type="button" className="capture-paste" onClick={()=>setAcknowledged(true)}>{t('이미지를 보관했어요')}</button></div>}
 <button type="button" className={'lottery-ticket'+(back?' ticket-back':'')} onClick={()=>setBack(!back)} aria-label={back?t('티켓 앞면 보기'):t('티켓 뒷면 QR 보기')}>
 {back?<><span className="ticket-mini-title">PERSONAL QR</span>{qr?<img src={qr} alt={t('개인 접속 QR코드')} width={240} height={240}/>:<span>{t('티켓 준비 중…')}</span>}<strong>{ticket.nickname}</strong></>:<><span className="ticket-mini-title">CLAN VAULT · MEMBER PASS</span><strong className="ticket-owner">{ticket.nickname}</strong><span className="ticket-clan">{clanName}</span><span className="ticket-balls">{balls.map(n=><span key={n}>{n.toString().padStart(2,'0')}</span>)}</span><span className="ticket-flip-hint">{t('눌러서 뒷면 QR 보기')}</span></>}
 </button><p className="helper">{t('앞면 숫자는 장식용입니다. QR 이미지를 가진 사람은 내 재화를 수정할 수 있으니 공유하지 마세요.')}</p>
 <div className="ticket-actions"><button type="button" disabled={!qr} onClick={()=>void download()}>{t('티켓 이미지 저장')}</button><button type="button" disabled={disabled||rotating} onClick={onForget}>{t('이 기기에서 로그아웃')}</button><button type="button" disabled={disabled||rotating} onClick={()=>setConfirm(!confirm)}>{t('티켓 재발급')}</button></div>
 {confirm&&<div className="ticket-rotate-confirm"><p>{t('재발급하면 이전 QR 이미지는 사용할 수 없습니다. 새 이미지를 다시 저장해주세요.')}</p><button type="button" disabled={disabled||rotating} onClick={async()=>{setRotating(true);setError('');try{await onRotate();setConfirm(false);}catch(e){setError(e instanceof Error?e.message:t('티켓 재발급 실패'));}finally{setRotating(false);}}}>{rotating?t('처리 중…'):t('새 티켓 발급하기')}</button></div>}
 {error&&<p role="alert">{t(error)}</p>}</section>;
}
