import ResourceIcon from './ResourceIcon';
import {groups,quantity,approximate,type Inventory} from './lib/inventory';
import {t,getLanguage} from './lib/i18n';

type Props={inventory?:Inventory;totals?:number[];counts?:number[];estimated?:boolean[]};
export default function ResourceSummary({inventory,totals,counts,estimated}:Props){
 const labels=['스킬','알','탈것','녹색 물약'];
 const number=(n:number|null)=>n===null?t('미입력'):n.toLocaleString(getLanguage()==='en'?'en-US':'ko-KR');
 return <section className="resource-overview" aria-label={t('보유 재화')}><h2>{t('보유 재화')}</h2><div className="summary">{groups.map((group,index)=>{
  const item=inventory?.[group],amount=item?quantity(item.amount):totals?.[index]??null;
  const approx=item?approximate(item.amount):estimated?.[index];
  return <article key={group}><span className="resource-marker"><ResourceIcon group={group}/></span><div className="summary-content"><p>{t(labels[index])}</p><strong><span className="summary-number">{number(amount)}</span>{amount!==null&&<small>{t('개')}</small>}</strong><span className="summary-estimate">{approx?t('약 ')+(item?.amount||number(amount)):''}</span></div><span className="meta">{counts?`${counts[index]}${t('명 입력')}`:group==='potion'?t('수량만 저장'):`${t('소환 레벨')} ${item?.level||t('미입력')} · ${t('단계')} ${item?.level==='100'?t('최대'):item?.progress||t('미입력')}`}</span></article>;
 })}</div></section>;
}
