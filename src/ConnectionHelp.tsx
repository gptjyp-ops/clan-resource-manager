import {useState} from 'react';

type ErrorKind='connection'|'credentials'|'invite'|'ticket'|'save'|'version'|'admin'|'other';
type Diagnosis={code:string;kind:ErrorKind;title:string;description:string;steps:string[];retry:boolean};
type Rule={pattern:RegExp;diagnosis:Diagnosis};
const guidance:Rule[]=[
 {pattern:/구글 저장 연결을 열지 못|Google bridge timeout/i,diagnosis:{code:'CRM-CON-001',kind:'connection',title:'구글 연결 시간 초과',description:'구글 저장 화면에서 시작 응답을 받지 못했습니다. 브라우저 차단 또는 웹 앱 배포 문제일 수 있습니다.',steps:['카카오톡 등 앱 내부 브라우저가 아니라 크롬 또는 사파리 일반 탭에서 열어주세요.','와이파이와 모바일 데이터를 바꿔서 다시 시도해주세요.','광고 차단, VPN, 서드 파티 쿠키 차단 설정을 확인해주세요.','계속 실패하면 아래 오류 정보를 복사해서 클랜장에게 보내주세요.'],retry:true}},
 {pattern:/응답이 늦어지고|response timed out/i,diagnosis:{code:'CRM-CON-002',kind:'connection',title:'구글 저장 요청 응답 지연',description:'연결은 시작됐지만 저장 서버의 응답이 늦어지고 있습니다. 저장 버튼을 눌렀다면 중복 등록 전에 현황을 확인해주세요.',steps:['현황을 새로고침해 요청이 이미 저장되었는지 확인해주세요.','다시 연결을 시도하고, 계속 실패하면 오류 정보를 클랜장에게 보내주세요.'],retry:true}},
 {pattern:/구글 저장 연결이 아직 설정되지|웹 앱 배포를 먼저 확인|Google script.*not configured/i,diagnosis:{code:'CRM-CON-003',kind:'connection',title:'구글 저장 연결 설정 오류',description:'구글 웹 앱 주소 또는 배포 설정을 운영자가 확인해야 합니다.',steps:['클랜장에게 이 오류 코드를 알려주세요.','운영자는 Apps Script 배포 URL과 접근 권한을 점검해주세요.'],retry:false}},
 {pattern:/구글 저장 연결에 실패|저장 연결을 확인하지 못|클랜 서비스 연결 실패|Failed to fetch|NetworkError|Load failed|구글 저장 연결이 필요/i,diagnosis:{code:'CRM-CON-004',kind:'connection',title:'구글 서버 통신 실패',description:'브라우저와 저장 서버 사이의 통신이 실패했습니다. 원인은 아직 확정되지 않았습니다.',steps:['크롬 또는 사파리 일반 탭에서 다시 열어주세요.','다른 네트워크에서 다시 시도해주세요.','계속 실패하면 오류 정보를 클랜장에게 보내주세요.'],retry:true}},
 {pattern:/기존 재화 보호를 위해|구글 스크립트.*업데이트|기능을 업데이트 중|업데이트 후 사용할 수 있/i,diagnosis:{code:'CRM-VER-001',kind:'version',title:'서버 버전 업데이트 필요',description:'사이트 기능과 구글 스크립트의 지원 버전이 맞지 않습니다.',steps:['클랜장에게 오류 코드를 전달해주세요.','운영자가 Google Apps Script를 새 버전으로 배포해야 합니다.'],retry:false}},
 {pattern:/확인 시도가 많|10분 뒤 다시 시도/i,diagnosis:{code:'CRM-AUTH-003',kind:'credentials',title:'로그인 시도 일시 제한',description:'잘못된 인증 시도가 누적되어 잠시 로그인이 제한되었습니다.',steps:['안내된 제한 시간이 지난 뒤 다시 시도해주세요.','비밀번호를 반복해서 입력하지 말고 클랜장에게 문의해주세요.'],retry:false}},
 {pattern:/초대 링크가 만료|초대 링크.*올바르지|유효한 감자 클랜 초대|초대 링크로 입장하지 못/i,diagnosis:{code:'CRM-INV-001',kind:'invite',title:'초대 링크 확인 필요',description:'초대 링크가 만료되었거나 클랜에서 갱신했을 수 있습니다.',steps:['클랜장에게 새 초대 링크를 요청해주세요.','새 링크를 크롬이나 사파리에서 직접 열어주세요.'],retry:false}},
 {pattern:/클랜 입장 코드가 맞지|클랜 입장 비밀번호가 맞지|클랜 이름과 입장 비밀번호를 확인|닉네임 또는 비밀번호가 맞지/i,diagnosis:{code:'CRM-AUTH-001',kind:'credentials',title:'클랜 입장 정보 불일치',description:'입장 비밀번호 또는 입력한 클랜 정보를 확인해야 합니다.',steps:['클랜장에게 정확한 입장 정보를 확인해주세요.','비밀번호를 다시 입력하거나 새 초대 링크를 사용해주세요.'],retry:false}},
 {pattern:/이 닉네임의 수정 비밀번호가 맞지|수정 비밀번호.*맞지/i,diagnosis:{code:'CRM-AUTH-002',kind:'credentials',title:'재화 수정 비밀번호 불일치',description:'해당 닉네임의 수정 비밀번호가 일치하지 않습니다.',steps:['내 재화 수정 비밀번호를 확인해주세요.','분실했다면 클랜장에게 비밀번호 재설정을 요청해주세요.'],retry:false}},
 {pattern:/클랜장 로그인이 만료|클랜장 로그인이 필요|클랜장 비밀번호가 맞지/i,diagnosis:{code:'CRM-ADM-001',kind:'admin',title:'클랜장 인증 확인 필요',description:'클랜장 로그인 정보가 일치하지 않거나 세션이 만료되었습니다.',steps:['클랜장 관리 화면에서 다시 로그인해주세요.','계속 실패하면 클랜장 비밀번호 또는 QR 연결을 확인해주세요.'],retry:false}},
 {pattern:/개인 티켓이 유효하지|개인 티켓이 만료|티켓.*입장 정보를 확인|티켓 로그인 실패|QR.*로그인|클랜장으로 연결된 개인 QR/i,diagnosis:{code:'CRM-QR-001',kind:'ticket',title:'QR 티켓 인증 실패',description:'개인 QR 티켓이 유효하지 않거나 해당 클랜과 일치하지 않을 수 있습니다.',steps:['해당 클랜에서 발급한 최신 QR 티켓으로 다시 시도해주세요.','필요하면 비밀번호로 로그인하거나 클랜장에게 복구를 요청해주세요.'],retry:false}},
 {pattern:/사진.*1MB|사진.*크기|유효한 사진이 아닙|사진을 저장 크기로 줄이지 못|사진을 읽지 못/i,diagnosis:{code:'CRM-PHOTO-001',kind:'save',title:'사진 처리 실패',description:'사진 형식이나 용량 때문에 저장 또는 읽기에 실패했습니다.',steps:['사진을 다시 촬영하거나 크기를 줄여주세요.','계속 실패하면 다른 사진으로 시도하고 오류 코드를 알려주세요.'],retry:false}},
 {pattern:/기록이 변경되었습니다|등록 내역이 변경되었습니다|회원 기록이 변경되었습니다/i,diagnosis:{code:'CRM-SAVE-002',kind:'save',title:'저장 데이터 충돌',description:'다른 기기나 사용자가 먼저 정보를 변경했을 수 있습니다.',steps:['화면을 새로고침하여 최신 기록을 확인해주세요.','변경한 수량을 다시 확인한 뒤 저장해주세요.'],retry:false}},
 {pattern:/다른 저장을 처리 중|다른 요청을 처리 중|다른 연결 요청이 진행 중/i,diagnosis:{code:'CRM-SAVE-003',kind:'save',title:'다른 요청 처리 중',description:'동시에 여러 요청을 처리할 수 없어 잠시 지연되고 있습니다.',steps:['중복으로 버튼을 누르지 말고 잠시 후 다시 시도해주세요.','현황을 확인한 뒤 필요한 변경만 다시 저장해주세요.'],retry:true}},
 {pattern:/복구 코드.*맞지|복구 비밀번호.*맞지|이메일 주소를 확인/i,diagnosis:{code:'CRM-REC-001',kind:'credentials',title:'계정 복구 정보 확인 필요',description:'입력한 복구 정보가 일치하지 않습니다.',steps:['발급받은 복구 정보를 다시 확인해주세요.','필요하면 클랜장에게 새 복구 절차를 문의해주세요.'],retry:false}},
];
const unknown:Diagnosis={code:'CRM-GEN-001',kind:'other',title:'확인되지 않은 오류',description:'오류가 발생했지만 현재 분류된 항목과 일치하지 않습니다.',steps:['입력 내용을 확인한 뒤 다시 시도해주세요.','반복되면 아래 오류 정보와 문제가 발생한 작업을 클랜장에게 알려주세요.'],retry:false};

export function diagnoseError(message:string):Diagnosis {
 return guidance.find(rule=>rule.pattern.test(message))?.diagnosis||unknown;
}
export function isConnectionError(message:string){return diagnoseError(message).kind==='connection';}
function environment(){
 const ua=navigator.userAgent;
 const os=/Android/i.test(ua)?'Android':/iPhone|iPad|iPod/i.test(ua)?'iOS/iPadOS':/Windows/i.test(ua)?'Windows':/Macintosh|Mac OS X/i.test(ua)?'macOS':'기타';
 const browser=/KAKAOTALK/i.test(ua)?'카카오톡 내부 브라우저':/Instagram/i.test(ua)?'인스타그램 내부 브라우저':/NAVER\(/i.test(ua)?'네이버 내부 브라우저':/Edg\//i.test(ua)?'Edge':/SamsungBrowser/i.test(ua)?'Samsung Internet':/CriOS|Chrome\//i.test(ua)?'Chrome':/FxiOS|Firefox\//i.test(ua)?'Firefox':/Safari\//i.test(ua)?'Safari':'기타';
 return {os,browser};
}
export default function ConnectionHelp({error,onRetry,busy=false,screen='화면 미지정'}:{error:string;onRetry?:()=>void;busy?:boolean;screen?:string}){
 const [copyStatus,setCopyStatus]=useState('');
 const details=diagnoseError(error);
 const {os,browser}=environment();
 const connection=details.kind==='connection';
 const report=[
  '클랜 재화관리 오류 제보',
  '오류 코드: '+details.code,
  '오류 분류: '+details.title,
  '발생 시각: '+new Date().toLocaleString('ko-KR',{timeZone:'Asia/Seoul'})+' (KST)',
  '발생 화면: '+screen,
  '기기: '+os,
  '브라우저: '+browser,
  '앱 버전: '+(import.meta.env.VITE_BUILD_SHA?.slice(0,10)||'확인 불가')
 ].join('\n');
 async function copyText(value:string,success:string){
  try{
   if(!navigator.clipboard?.writeText)throw Error('copy unavailable');
   await navigator.clipboard.writeText(value);setCopyStatus(success);
  }catch{setCopyStatus('복사가 차단되었습니다. 아래 오류 코드와 발생 화면을 캡처해서 클랜장에게 보내주세요.');}
 }
 return <section role="alert" aria-label="오류 해결 및 제보 안내" style={{margin:'18px 0',padding:'16px',border:'1px solid #9478a4',borderRadius:14,background:'rgba(32,19,46,.86)',color:'#f7f1fd',fontSize:15,lineHeight:1.65,overflowWrap:'anywhere'}}>
  <p style={{margin:'0 0 4px',fontSize:13,color:'#d4bdec',fontWeight:700}}>문제 해결 안내 · 고객지원 코드</p>
  <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap',marginBottom:12}}>
   <code style={{fontSize:17,fontWeight:800,letterSpacing:.4,color:'#fff',background:'#4d3361',padding:'5px 10px',borderRadius:8}}>{details.code}</code>
   <strong style={{fontSize:18,color:'#fff'}}>{details.title}</strong>
  </div>
  <p style={{margin:'0 0 12px'}}>{details.description}</p>
  {connection&&/카카오톡|인스타그램|네이버 내부/.test(browser)&&<p style={{margin:'0 0 10px',fontWeight:700,color:'#ffdf8b'}}>현재 앱 내부 브라우저로 보입니다. 일반 크롬이나 사파리에서 다시 열어주세요.</p>}
  <strong style={{display:'block',margin:'0 0 6px'}}>해결 순서</strong>
  <ol style={{margin:'0 0 14px',paddingLeft:23}}>{details.steps.map((step,i)=><li key={i}>{step}</li>)}</ol>
  <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
   {onRetry&&details.retry&&<button type="button" disabled={busy} onClick={onRetry} style={{flex:'1 1 120px',minHeight:44,border:0,borderRadius:9,background:'#356a14',color:'white',fontWeight:700,fontSize:14,cursor:busy?'wait':'pointer'}}>{busy?'확인 중…':'연결 다시 시도'}</button>}
   {connection&&<button type="button" onClick={()=>void copyText(location.href,'접속 주소를 복사했습니다. 크롬 또는 사파리 주소창에 붙여넣으세요.')} style={{flex:'1 1 120px',minHeight:44,border:'1px solid #9985a9',borderRadius:9,background:'#352444',color:'white',fontWeight:700,fontSize:14}}>접속 주소 복사</button>}
   <button type="button" onClick={()=>void copyText(report,'오류 정보를 복사했습니다. 클랜장에게 붙여넣어 주세요.')} style={{flex:'1 1 120px',minHeight:44,border:'1px solid #9985a9',borderRadius:9,background:'#352444',color:'white',fontWeight:700,fontSize:14}}>오류 정보 복사</button>
  </div>
  {copyStatus&&<p role="status" style={{margin:'8px 0 0',fontSize:13}}>{copyStatus}</p>}
  <p style={{fontSize:12,opacity:.85,margin:'12px 0 0'}}>오류 정보에는 비밀번호·초대 코드·QR 티켓 정보가 포함되지 않습니다. 복사 후 클랜장에게 보내주세요.</p>
  <details style={{marginTop:10,fontSize:12}}>
   <summary style={{cursor:'pointer'}}>오류 원문 보기 (비밀번호가 표시되면 공유하지 마세요)</summary>
   <p style={{margin:'6px 0 0',overflowWrap:'anywhere'}}>{error}</p>
  </details>
 </section>;
}
