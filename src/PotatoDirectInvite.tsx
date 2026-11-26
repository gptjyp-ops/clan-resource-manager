import {useRef,useState} from 'react';
import {clanAction,directInviteLink} from './lib/api';

export function ClanDirectInvite({clanId,adminToken,disabled}:{clanId:string;adminToken:string;disabled:boolean}){
 const [link,setLink]=useState(''),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[failed,setFailed]=useState(false);
 const linkField=useRef<HTMLTextAreaElement>(null);
 async function create(){
  setBusy(true);
  setMessage('');
  setFailed(false);
  try{
   const reply=await clanAction('issueDirectInvite',{clanId,adminToken,compactInvite:true});
   if(!reply.inviteCode)throw Error('초대 코드를 발급하지 못했습니다.');
   setLink(directInviteLink(clanId,reply.inviteCode));
  }catch(e){setFailed(true);setMessage(e instanceof Error?e.message:'초대 링크 발급 실패');}
  finally{setBusy(false);}
 }
 async function copyInvite(){
  setFailed(false);
  const field=linkField.current;
  try{
   await navigator.clipboard.writeText(link);
   setMessage('초대 링크 전체를 복사했습니다.');
   return;
  }catch{
   field?.focus();
   field?.setSelectionRange(0,link.length);
   try{
    if(field&&document.execCommand('copy')){
     setMessage('초대 링크 전체를 복사했습니다.');
     return;
    }
   }catch{
    // Leave the full address selected for the device's copy menu.
   }
   setMessage('선택된 초대 링크를 길게 누른 뒤 복사를 눌러주세요.');
  }
 }
 return <section className="member-password-reset" aria-labelledby="clan-direct-invite-title">
  <h3 id="clan-direct-invite-title">비밀번호 없는 클랜 초대</h3>
  <p className="helper">클랜장 비밀번호로 로그인한 뒤 바로 발급할 수 있습니다. 개인 QR 연결은 선택입니다.</p>
  <p>링크를 가진 사람은 클랜 입장 비밀번호 없이 들어올 수 있습니다. 새 링크를 발급하면 이전 초대 링크는 만료됩니다.</p>
  <button type="button" className="capture-paste" disabled={disabled||busy} onClick={()=>void create()}>새 초대 링크 발급</button>
  {link&&<label className="field-label">클랜 초대 링크<textarea ref={linkField} readOnly rows={3} style={{width:'100%',overflowWrap:'anywhere'}} value={link} onFocus={e=>e.currentTarget.select()}/></label>}
  {link&&<button type="button" className="capture-paste" disabled={busy||disabled} onClick={()=>void copyInvite()}>비밀번호 없는 초대 링크 복사</button>}
  {message&&<p key={failed?'error':'status'} role={failed?'alert':'status'}>{message}</p>}
 </section>;
}
