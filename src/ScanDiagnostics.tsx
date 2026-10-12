import {t,tr,useLanguage} from './lib/i18n';
import {useEffect,useRef,useState} from 'react';
import {savedAccessKey,googleEnabled} from './lib/api';
import {saveErrorReport,flushErrorReports} from './lib/error-outbox';
import {reportText,visibleScanReports,type ScanReport,type ScanReports} from './lib/scan-diagnostics';
import {photoTitles,type PhotoKind} from './lib/inventory';
export function ScanDiagnosticsPanel({reports,latest}:{reports:ScanReports;latest?:PhotoKind}){useLanguage();const visible=visibleScanReports(reports,latest);if(!visible.length)return null;return <section aria-label={t("사진 인식 오류")}>
 {visible.some(report=>report.issues.length>0)&&<h3>{t("사진 인식 오류")}</h3>}
 {visible.map(report=><ScanDiagnostics key={report.kind} report={report}/>)}
 </section>;}
export default function ScanDiagnostics({report}:{report:ScanReport}){useLanguage();
 const [copied,setCopied]=useState(false),[manual,setManual]=useState(false);const text=reportText(report);
 const attempted=useRef<ScanReport|undefined>(undefined);
 const [delivery,setDelivery]=useState(''),[sending,setSending]=useState(false);
 const canSend=report.issues.length>0&&googleEnabled&&!!savedAccessKey();
 async function send(){setSending(true);setDelivery(t("오류 전송 중…"));try{await saveErrorReport(report);await flushErrorReports();setDelivery(t("오류를 운영자에게 전송했습니다."));}catch(e){setDelivery(e instanceof Error?t(e.message):t("오류를 이 기기에 보관했습니다. 연결되면 자동으로 다시 전송합니다."));}finally{setSending(false);}}
 useEffect(()=>{if(canSend&&attempted.current!==report){attempted.current=report;void send();}},[report]);
 useEffect(()=>{if(!canSend)return;const retry=()=>void send();const timer=setInterval(retry,60000);window.addEventListener('online',retry);return()=>{clearInterval(timer);window.removeEventListener('online',retry);};},[report]);
 return <section className="scan-diagnostics" aria-label={t(photoTitles[report.kind])} style={{padding:16,border:'1px solid #d9dde5',borderRadius:12,marginTop:12}}><h4>{t(photoTitles[report.kind])}</h4><p><strong>{t("사진 인식 진단 · ")}{report.version}</strong></p>{report.issues.length?<ul role="alert">{report.issues.map((i,n)=><li key={n}>{i.code} · {t(i.message)}</li>)}</ul>:<p>{t("필요한 숫자를 모두 읽었습니다. 사진과 값이 같은지 확인해주세요.")}</p>}{canSend&&<><p role="status">{delivery}</p><p className="helper">{t("오류 사진과 인식 기록을 자동 저장합니다. 전송 실패 시 이 기기에 보관하고 다시 시도합니다.")}</p><button type="button" className="capture-paste" disabled={sending} onClick={()=>void send()}>{t("오류 다시 전송")}</button></>}<button type="button" className="capture-paste" onClick={async()=>{try{await navigator.clipboard.writeText(text);setCopied(true);setManual(false);}catch{setManual(true);}}}>{copied?t("진단 내용 복사 완료"):t("오류 내용 복사")}</button>{manual&&<label>{t("자동 복사가 안 됩니다. 아래 내용을 전체 선택해 복사해주세요.")}<textarea readOnly value={text} rows={8} onFocus={e=>e.currentTarget.select()}/></label>}<details><summary>{t("진단 상세 보기")}</summary><pre style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{text}</pre></details></section>;
}
