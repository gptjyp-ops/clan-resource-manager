import {useState} from 'react';
import {clanAction, potatoClanId} from './lib/api';

export function PotatoDirectInvite({clanId,adminToken,disabled}:{clanId:string;adminToken:string;disabled:boolean}){
 const [link,setLink]=useState(''),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 if(clanId!==potatoClanId)return null;
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
 return <details>
  <summary>비밀번호 없는 감자 클랜 초대</summary>
  <p>링크를 가진 사람은 클랜 입장 비밀번호 없이 들어올 수 있습니다. 새 링크를 발급하면 이전 초대 링크는 만료됩니다.</p>
  <button type="button" className="capture-paste" disabled={disabled||busy} onClick={()=>void create()}>새 초대 링크 발급</button>
  {link&&<label className="field-label">감자 클랜 초대 링크<input readOnly value={link} onFocus={e=>e.currentTarget.select()}/></label>}
  {message&&<p role="alert">{message}</p>}
 </details>;
}
