import {useId,useState} from 'react';
import {t,getLanguage} from './lib/i18n';
import {mountMergeScore} from './lib/mount-merge-score';
import ResourceIcon from './ResourceIcon';

export default function MountMergeCalculator({clanId,available,scope}:{clanId:string;available:number|null;scope:'mine'|'clan'}){
 const id=useId(),slot='clanMountMergePoints:'+clanId;
 const [manual,setManual]=useState<string|null>(null);
 const [points,setPoints]=useState(()=>{try{const stored=localStorage.getItem(slot);return stored&&/^\d{1,9}$/.test(stored)?stored:'648';}catch{return '648';}});
 const count=manual??(available===null?'':String(available)),result=mountMergeScore(count,points);
 const fmt=(n:bigint)=>n.toLocaleString(getLanguage()==='en'?'en-US':'ko-KR');
 function changePoints(value:string){setPoints(value);if(/^\d{1,9}$/.test(value)){try{localStorage.setItem(slot,value);}catch{}}}
 return <section className="mount-merge-calculator" aria-labelledby={id+'-title'}>
 <div className="merge-calculator-heading"><span className="resource-marker"><ResourceIcon group="mount"/></span><div><h2 id={id+'-title'}>{t('탈것 합성 점수 계산기')}</h2><p>{t(scope==='clan'?'클랜 합성 수량 기준':'내 합성 수량 기준')}</p></div></div>
 <div className="merge-calculator-fields"><label htmlFor={id+'-count'}>{t('합성할 탈것 수량')}<input id={id+'-count'} inputMode="numeric" maxLength={20} placeholder="7000" value={count} onChange={e=>setManual(e.target.value)}/></label><span aria-hidden="true">×</span><label htmlFor={id+'-points'}>{t('합성 1개당 점수')}<input id={id+'-points'} inputMode="numeric" maxLength={9} value={points} onChange={e=>changePoints(e.target.value)}/></label></div>
 <div className="merge-calculator-result" role="status">{result?<><span>{fmt(result.count)} × {fmt(result.points)} =</span><strong>{fmt(result.total)}<small>{t('점')}</small></strong></>:<p>{t('수량과 점수를 0 이상의 정수로 입력해주세요.')}</p>}</div>
 <button type="button" className="capture-paste" onClick={()=>setManual(null)} disabled={available===null}>{t('입력된 합성 수량 다시 불러오기')}</button>
 <p className="helper">{t('합성 수량과 1개당 점수만 곱합니다. 소환 재화·소환 비용·추가 획득 확률은 포함하지 않습니다.')}</p>
 <p className="helper">{t('점수는 클랜 규칙에 맞게 바꾸세요. 이 브라우저에 클랜별로 보관됩니다.')}{manual!==null&&t(' · 수량을 직접 입력해 계산 중입니다.')}</p>
 </section>;
}
