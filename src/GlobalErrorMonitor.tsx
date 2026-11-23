import React,{useEffect} from 'react';
import {diagnoseError} from './ConnectionHelp';
import {reportClientError} from './lib/client-error-report';

function currentScreen():string {
 const route=new URLSearchParams(location.hash.slice(1));
 if(route.has('manage')||location.hash==='#clans')return '클랜장 관리';
 if(route.has('join'))return '초대 링크 입장';
 if(route.has('clan'))return '클랜 재화 관리';
 if(location.hash==='#ocr-check')return '사진 인식 확인';
 return '클랜 공통 입장';
}

/**
 * Shows a stable error code on legacy alert surfaces that have not yet
 * been converted to ConnectionHelp. Never reads or transmits credentials
 * or messages to the report service; only the fixed code and screen.
 */
export function GlobalErrorMonitor(){
 useEffect(()=>{
  const root=document.getElementById('root');
  if(!root)return;
  const selector='[role="alert"], .message.error, .error-message, .form-error';
  const scan=()=>{
   root.querySelectorAll<HTMLElement>(selector).forEach(element=>{
    if(element.closest('[aria-label="오류 해결 및 제보 안내"]'))return;
    if(element.closest('.scan-diagnostics'))return; // Already renders OCR-/IMG- codes.
    const message=(element.textContent||'').trim();
    if(!message)return;
    const codeMatch=message.match(/\bCRM-[A-Z]+-\d{3}\b/);
    const code=codeMatch?codeMatch[0]:diagnoseError(message).code;
    if(element.dataset.crmErrorCode===code)return;
    element.dataset.crmErrorCode=code;
    element.classList.add('crm-coded-error');
    void reportClientError(code,currentScreen()).catch(()=>{});
   });
  };
  let scheduled=false;
  const schedule=()=>{
   if(scheduled)return;
   scheduled=true;
   queueMicrotask(()=>{scheduled=false;scan();});
  };
  scan();
  const observer=new MutationObserver(schedule);
  observer.observe(root,{childList:true,subtree:true,characterData:true});
  return()=>observer.disconnect();
 },[]);
 return null;
}

type BoundaryState={failed:boolean};
export class AppErrorBoundary extends React.Component<React.PropsWithChildren,BoundaryState>{
 state:BoundaryState={failed:false};
 static getDerivedStateFromError():BoundaryState{return {failed:true};}
 componentDidCatch(){void reportClientError('CRM-GEN-002','앱 실행 중단').catch(()=>{});}
 render(){
  if(this.state.failed)return <main style={{maxWidth:520,margin:'60px auto',padding:24,fontFamily:'system-ui',lineHeight:1.7}}>
   <section role="alert" style={{padding:22,border:'1px solid #b88c8c',borderRadius:14}}>
    <p style={{margin:0,fontSize:14}}>클랜 재화관리 · 오류 자동 보고</p>
    <h1 style={{fontSize:22}}>화면 실행 중 문제가 발생했습니다.</h1>
    <p><strong>오류 코드: CRM-GEN-002</strong></p>
    <p>운영자에게 자동으로 오류 보고를 시도합니다. 입력한 비밀번호나 사진은 보고하지 않습니다.</p>
    <button type="button" onClick={()=>location.reload()} style={{padding:'12px 18px',borderRadius:10}}>화면 다시 열기</button>
   </section>
  </main>;
  return this.props.children;
 }
}
