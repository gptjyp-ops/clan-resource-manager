import {useState} from 'react';

export function isConnectionError(message:string){
 return /구글 저장 연결을 열지 못|구글 저장 연결에 실패|저장 연결을 확인하지 못|응답이 늦어지고|Failed to fetch|NetworkError|Load failed/i.test(message);
}

export default function ConnectionHelp({error,onRetry,busy=false}:{error:string;onRetry?:()=>void;busy?:boolean}){
 const [copyStatus,setCopyStatus]=useState('');
 if(!isConnectionError(error))return <p role="alert" style={{color:'#ffe0e0',overflowWrap:'anywhere'}}>{error}</p>;
 const inAppBrowser=/KAKAOTALK|Instagram|FBAN|FBAV|NAVER\(|LINE\//i.test(navigator.userAgent);
 async function copyAddress(){
  try{
   if(!navigator.clipboard?.writeText)throw Error('clipboard unavailable');
   await navigator.clipboard.writeText(location.href);
   setCopyStatus('주소를 복사했어요. 크롬 또는 사파리 주소창에 붙여넣어 주세요.');
  }catch{
   setCopyStatus('자동 복사가 안 되면 화면 위 주소창이나 공유 메뉴에서 링크를 복사해 주세요.');
  }
 }
 return <section role="alert" aria-label="구글 연결 문제 해결 안내" style={{margin:'18px 0',padding:'18px',border:'1px solid #9879ad',borderRadius:16,background:'rgba(32,19,46,.86)',color:'#f7f1fd',fontSize:15,lineHeight:1.6,overflowWrap:'anywhere'}}>
  <h2 style={{margin:'0 0 8px',fontSize:20,lineHeight:1.35,color:'#fff'}}>구글 저장 연결이 안 되고 있어요</h2>
  <p style={{margin:'0 0 12px'}}>클랜 비밀번호 오류로 확인된 것은 아니에요. 휴대폰 브라우저에서 구글 연결이 차단되었거나, 구글 저장 서버가 응답하지 않는 상황일 수 있어요.</p>
  {inAppBrowser&&<p style={{margin:'0 0 12px',fontWeight:700,color:'#ffdf8b'}}>현재 앱 안에서 열린 브라우저로 보입니다. 일반 크롬이나 사파리로 열어주세요.</p>}
  <strong style={{display:'block',margin:'0 0 7px',fontSize:16}}>아래 순서대로 해보세요</strong>
  <ol style={{margin:'0 0 14px',paddingLeft:23}}>
   <li>아래 ‘접속 주소 복사’를 누르세요.</li>
   <li>카카오톡이나 인스타그램 화면을 나와 <strong>크롬(안드로이드) 또는 사파리(아이폰)</strong> 일반 탭에 주소를 붙여넣으세요.</li>
   <li>같은 오류가 나오면 와이파이와 모바일 데이터를 바꿔서 다시 시도하세요.</li>
   <li>그래도 안 되면 광고 차단·VPN·서드 파티 쿠키 차단 설정을 확인하고, 클랜장에게 이 오류 화면을 보내주세요.</li>
  </ol>
  <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:8}}>
   {onRetry&&<button type="button" disabled={busy} onClick={onRetry} style={{flex:'1 1 130px',minHeight:44,padding:'10px 12px',border:0,borderRadius:10,background:'#356a14',color:'white',fontSize:15,fontWeight:700,cursor:busy?'wait':'pointer'}}>{busy?'연결 확인 중…':'다시 연결하기'}</button>}
   <button type="button" onClick={()=>void copyAddress()} style={{flex:'1 1 130px',minHeight:44,padding:'10px 12px',border:'1px solid #9a86ac',borderRadius:10,background:'#352444',color:'#fff',fontSize:15,fontWeight:700,cursor:'pointer'}}>접속 주소 복사</button>
  </div>
  {copyStatus&&<p role="status" style={{margin:'6px 0',fontSize:14}}>{copyStatus}</p>}
  <details style={{marginTop:10,fontSize:13,opacity:.9}}>
   <summary style={{cursor:'pointer'}}>자세한 오류 내용 보기</summary>
   <p style={{margin:'7px 0 0'}}>{error}</p>
   <p style={{margin:'5px 0 0'}}>오류 코드: {/열지 못|응답이 늦어지고/.test(error)?'GOOGLE-BRIDGE-TIMEOUT':'GOOGLE-CONNECTION-ERROR'}</p>
  </details>
 </section>;
}
