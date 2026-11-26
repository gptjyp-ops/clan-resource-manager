import {useState} from 'react';
import {clanAction} from './lib/api';

export function ClanDirectInvite({clanId,adminToken,disabled}:{clanId:string;adminToken:string;disabled:boolean}){
 const [link,setLink]=useState(''),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 async function create(){
  setBusy(true);
  setMessage('');
  try{
   const reply=await clanAction('issueDirectInvite',{clanId,adminToken});
   if(!reply.inviteCode)throw Error('초대 코드를 발급하지 못했습니다.');
   setLink(location.origin+import.meta.env.BASE_URL+'#'+new URLSearchParams({clan:clanId,invite:reply.inviteCode}));
  }catch(e){setMessage(e instanceof Error?e.message:'초대 링크 발급 실패');}
  finally{setBusy(false);}
 }
 return <section className="member-password-reset" aria-labelledby="clan-direct-invite-title">
  <h3 id="clan-direct-invite-title">비밀번호 없는 클랜 초대</h3>
  <p className="helper">클랜장 비밀번호로 로그인한 뒤 바로 발급할 수 있습니다. 개인 QR 연결은 선택입니다.</p>
  <p>링크를 가진 사람은 클랜 입장 비밀번호 없이 들어올 수 있습니다. 새 링크를 발급하면 이전 초대 링크는 만료됩니다.</p>
  <button type="button" className="capture-paste" disabled={disabled||busy} onClick={()=>void create()}>새 초대 링크 발급</button>
  {link&&<label className="field-label">클랜 초대 링크<input readOnly value={link} onFocus={e=>e.currentTarget.select()}/></label>}
  {link&&<button type="button" className="capture-paste" onClick={async()=>{
   try{await navigator.clipboard.writeText(link);setMessage('초대 링크를 복사했습니다.');}
   catch{setMessage('위 입력칸의 링크를 선택해 복사해주세요.');}
  }}>비밀번호 없는 초대 링크 복사</button>}
  {message&&<p role="alert">{message}</p>}
 </section>;
}
