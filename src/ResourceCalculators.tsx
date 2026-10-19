import {useId,useState} from 'react';
import {t,getLanguage} from './lib/i18n';
import {quantity} from './lib/inventory';
import ResourceIcon from './ResourceIcon';
type Kind='skill'|'mount'|'eggMerge'|'mountMerge';
export function calculateResource(kind:Kind,amount:number,cost:number,multiplier:number,points:number){
 if(![amount,cost,multiplier,points].every(Number.isFinite)||amount<0||points<0||!Number.isInteger(amount)||!Number.isInteger(points))return null;
 const summon=kind==='skill'||kind==='mount';
 if(summon&&(!Number.isInteger(cost)||cost<=0))return null;
 if(kind==='mount'&&(multiplier<1||multiplier>1.4))return null;
 const draws=summon?Math.floor(amount/cost):amount;
 const units=draws*(kind==='skill'?5:kind==='mount'?multiplier:1);
 const total=units*points;
 if(!Number.isSafeInteger(draws)||total>Number.MAX_SAFE_INTEGER)return null;
 return {draws,units,total:Math.round(total*100)/100};
}
const names:Record<Kind,string>={skill:'스킬 소환 계산기',mount:'탈것 소환 계산기',eggMerge:'알 합성 계산기',mountMerge:'탈것 합성 점수 계산기'};
function Calculator({kind,clanId,available,scope}:{kind:Kind;clanId:string;available:number|null;scope:'mine'|'clan'}){
 const id=useId(),summon=kind==='skill'||kind==='mount',group=kind==='skill'?'skill':kind==='eggMerge'?'egg':'mount';
 const defaults={cost:kind==='skill'?'':'45',multiplier:'1.1',points:kind==='skill'?'225':kind==='mount'?'1080':kind==='mountMerge'?'648':''};
 const slot='clanCalculator:'+clanId+':'+kind;
 const [settings,setSettings]=useState(()=>{try{const s=JSON.parse(localStorage.getItem(slot)||'null');return {...defaults,...Object.fromEntries(Object.entries(s||{}).filter(([k,v])=>k in defaults&&typeof v==='string'))};}catch{return defaults;}});
 const [manual,setManual]=useState<string|null>(null),amountText=manual??(available===null?'':String(available));
 const amount=quantity(amountText),cost=Number(settings.cost),multiplier=Number(settings.multiplier),points=settings.points.trim()===''?NaN:Number(settings.points);
 const result=amount===null?null:calculateResource(kind,amount,cost,multiplier,points);
 const fmt=(n:number)=>n.toLocaleString(getLanguage()==='en'?'en-US':'ko-KR',{maximumFractionDigits:2});
 function update(key:keyof typeof defaults,value:string){const next={...settings,[key]:value};setSettings(next);try{localStorage.setItem(slot,JSON.stringify(next));}catch{}}
 const field=(key:keyof typeof defaults,label:string)=><label><span>{t(label)}</span><input inputMode={key==='multiplier'?'decimal':'numeric'} value={settings[key]} maxLength={16} onChange={e=>update(key,e.target.value)}/></label>;
 return <details className="mount-merge-calculator"><summary className="merge-calculator-heading"><span className="resource-marker"><ResourceIcon group={group}/></span><div><h2 id={id}>{t(names[kind])}</h2><p>{t(scope==='mine'?'내 재화 기준': '클랜 현황에서 계산')}{summon&&' · '+t('예상 소환 점수')}</p></div><span className="merge-calculator-chevron" aria-hidden="true">⌄</span></summary>
 <div className="calculator-step"><span className="calculator-step-number">1</span><h3>{t('계산할 수량과 조건')}</h3></div><div className="calculator-inputs"><label className="calculator-amount"><span>{t(summon?(kind==='skill'?'보유 스킬 티켓':'태엽 보유량'):'합성 수량')}</span><input inputMode="decimal" value={amountText} maxLength={20} placeholder="7000" onChange={e=>setManual(e.target.value)}/></label>{summon&&field('cost',kind==='skill'?'5회 뽑기 소모량':'1회 소환 소모량')}{kind==='mount'&&<div className="calculator-multiplier">{field('multiplier','추가 획득 배율 (1.1~1.4)')}<div className="calculator-presets">{['1.1','1.2','1.3','1.4'].map(v=><button type="button" key={v} aria-pressed={settings.multiplier===v} onClick={()=>update('multiplier',v)}>{v}×</button>)}</div></div>}{field('points',summon?'소환 1개당 점수':'합성 1개당 점수')}</div>
 <p className="helper">{manual===null&&available!==null?t(scope==='mine'?'개인 보유 수량을 자동으로 불러왔습니다.':'현재 클랜 합계 수량을 자동으로 불러왔습니다.'):t('수량을 직접 입력해 계산 중입니다.')}</p>
 {scope==='clan'&&summon&&<p className="helper">{t('클랜 합계에 입력한 소모량·배율을 동일하게 적용한 예상값입니다. 개인별 조건이 다르면 실제 합산 점수와 다릅니다.')}</p>}
 <div className="calculator-step"><span className="calculator-step-number">2</span><h3>{t('계산 결과')}</h3></div>
 <div className="merge-calculator-result" role="status">{result?<><span className="calculator-result-label">{t(summon?'예상 소환 점수':'합성 점수')}</span><strong>{fmt(result.total)}<small>{t('점')}</small></strong><div className="calculator-equation">{summon?`(${fmt(amount!)} ÷ ${fmt(cost)} → ${fmt(result.draws)}) × ${kind==='skill'?'5':fmt(multiplier)} × ${fmt(points)}`:`${fmt(amount!)} × ${fmt(points)}`} = {fmt(result.total)}</div>{summon&&<div className="calculator-breakdown"><span>{t('뽑기 횟수')}<b>{fmt(result.draws)}</b></span><span>{t('남는 재화')}<b>{fmt(amount!-result.draws*cost)}</b></span></div>}</>:<p className="calculator-empty">{t('수량·소모량·점수를 입력해주세요. 소모량은 1 이상이어야 합니다.')}</p>}</div>
 {available!==null&&<button type="button" className="capture-paste" onClick={()=>setManual(null)}>{t('등록된 수량 다시 불러오기')}</button>}
<details className="calculator-notes"><summary>{t('계산 기준 및 설정 안내')}</summary><p className="helper">{summon?t('소환 횟수는 소수점을 버립니다. 추가 획득을 포함한 결과는 예상 점수입니다.'):t('합성 수량과 1개당 점수만 곱합니다.')}</p>

 <p className="helper">{t('점수와 소모량 설정은 이 브라우저에 클랜별로 보관됩니다.')}</p></details>
 </details>;
}
export default function ResourceCalculators({clanId,scope,mountMerge,eggMerge,skill=null,mount=null}:{clanId:string;scope:'mine'|'clan';mountMerge:number|null;eggMerge:number|null;skill?:number|null;mount?:number|null}){
 const amounts={skill,mount,eggMerge,mountMerge};return <>{(['skill','mount','eggMerge','mountMerge'] as Kind[]).map(kind=><Calculator key={clanId+scope+kind} kind={kind} clanId={clanId} scope={scope} available={amounts[kind]}/>)}</>;
}
