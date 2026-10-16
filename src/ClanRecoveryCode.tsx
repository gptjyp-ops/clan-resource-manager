import {useEffect,useState} from 'react';
import {clanAction} from './lib/api';
import {t} from './lib/i18n';

export default function ClanRecoveryCode({clanId,adminToken}:{clanId:string;adminToken?:string}){
 const [id,setId]=useState(clanId),[issued,setIssued]=useState(''),[code,setCode]=useState(''),[name,setName]=useState(''),[password,setPassword]=useState(''),[confirm,setConfirm]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
 useEffect(()=>{setId(clanId);setIssued('');setCode('');setPassword('');setConfirm('');setError('');setNotice('');},[clanId,adminToken]);
 async function issue(){if(!adminToken)return;setBusy(true);setError('');setNotice('');try{const r=await clanAction('issueClanResetCode',{clanId:id,adminToken});if(!r.recoveryCode)throw Error('복구 코드를 확인하지 못했습니다.');setIssued(r.recoveryCode);setNotice(t('클랜 전용 복구 코드를 발급했습니다. 안전한 곳에 보관해주세요.'));}catch(e){setError(e instanceof Error?e.message:t('처리 실패'));}finally{setBusy(false);}}
 async function reset(e:React.FormEvent){e.preventDefault();setError('');setNotice('');if(password!==confirm){setError(t('새 비밀번호가 서로 다릅니다.'));return;}setBusy(true);try{await clanAction('clanCodeResetMember',{clanId:id,nickname:name,resetCode:code,newPassword:password});setPassword('');setConfirm('');setCode('');setNotice(t('회원 비밀번호를 재설정했습니다. 기존 재화와 사진은 유지됩니다.'));}catch(e){setError(e instanceof Error?e.message:t('처리 실패'));}finally{setBusy(false);}}
 return <section className="member-password-reset"><h3>{t('클랜장 전용 회원 복구')}</h3><p className="helper">{t('클랜별로 다른 복구 코드입니다. 자기 클랜 회원만 재설정할 수 있으며 클랜장만 보관하세요.')}</p>
 {adminToken&&<><p className="helper">{t('최초 발급 후 코드를 보관하면 다음에는 클랜장 로그인 없이 아래에서 회원을 복구할 수 있습니다. 재발급하면 이전 코드는 무효입니다.')}</p><button type="button" className="capture-paste" disabled={busy} onClick={()=>void issue()}>{t('클랜 전용 복구 코드 발급·재발급')}</button></>}
 {issued&&adminToken&&<div className="recovery-receipt"><label>{t('발급된 클랜 전용 복구 코드')}<input readOnly value={issued} onFocus={e=>e.currentTarget.select()}/></label><button type="button" className="capture-paste" onClick={async()=>{try{await navigator.clipboard.writeText(issued);setNotice(t('복사했습니다.'));}catch{setError(t('코드를 직접 선택해 복사해주세요.'));}}}>{t('복구 코드 복사')}</button><button type="button" className="capture-paste" onClick={()=>setIssued('')}>{t('코드 닫기')}</button></div>}
 <details><summary>{t('클랜 전용 코드로 회원 비밀번호 재설정')}</summary><form onSubmit={reset}>
 <label>{t('클랜 ID')}<input required disabled={busy||!!adminToken} value={id} onChange={e=>setId(e.target.value)} autoCapitalize="none" spellCheck={false}/></label>
 <label>{t('클랜 전용 복구 코드')}<input type="password" required maxLength={100} disabled={busy} value={code} onChange={e=>setCode(e.target.value)} autoComplete="off" autoCapitalize="none" spellCheck={false}/></label>
 <label>{t('게임 닉네임')}<input required maxLength={24} disabled={busy} value={name} onChange={e=>setName(e.target.value)}/></label>
 <label>{t('새 수정 비밀번호')}<input required type="password" minLength={6} maxLength={100} disabled={busy} value={password} onChange={e=>setPassword(e.target.value)} autoComplete="new-password"/></label>
 <label>{t('새 비밀번호 확인')}<input required type="password" minLength={6} maxLength={100} disabled={busy} value={confirm} onChange={e=>setConfirm(e.target.value)} autoComplete="new-password"/></label>
 <button className="capture-paste" disabled={busy}>{busy?t('처리 중…'):t('회원 비밀번호 재설정')}</button>
 </form></details>{error&&<p role="alert">{t(error)}</p>}{notice&&<p role="status">{notice}</p>}</section>;
}
