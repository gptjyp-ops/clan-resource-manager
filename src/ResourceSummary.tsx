import {GitMerge} from 'lucide-react';
import ResourceIcon from './ResourceIcon';
import {groups,quantity,approximate,totalMerge,type Inventory} from './lib/inventory';
import {t,getLanguage} from './lib/i18n';

type Props={inventory?:Inventory;totals?:number[];counts?:number[];estimated?:boolean[];mergeTotals?:number[];mergeCounts?:number[]};
export default function ResourceSummary({inventory,totals,counts,estimated,mergeTotals,mergeCounts}:Props){
 const labels=['스킬','알','탈것','녹색 물약'];
 const number=(n:number|null)=>n===null?t('미입력'):n.toLocaleString(getLanguage()==='en'?'en-US':'ko-KR');
 const cards=[...groups.map((group,index)=>{
  const item=inventory?.[group];
  return {key:group,group,label:labels[index],amount:item?quantity(item.amount):totals?.[index]??null,approx:item?approximate(item.amount):estimated?.[index],original:item?.amount,merge:false,meta:counts?`${counts[index]}${t('명 입력')}`:group==='potion'?t('수량만 저장'):`${t('소환 레벨')} ${item?.level||t('미입력')} · ${t('단계')} ${item?.level==='100'?t('최대'):item?.progress||t('미입력')}`};
 }),...(['egg','mount'] as const).map((group,index)=>({key:group+'Merge',group,label:group==='egg'?'알 합성':'탈것 합성',amount:inventory?totalMerge(inventory[group]):mergeTotals?.[index]??null,approx:false,original:undefined,merge:true,meta:mergeCounts?`${mergeCounts[index]}${t('명 입력')}`:t('사진 선택 수량')+' + '+t('추가 수량 (+α)')}))];
 return <section className="resource-overview" aria-label={t('보유 재화')}><h2>{t('보유 재화')}</h2><div className="summary">{cards.map(card=><article key={card.key}><span className="resource-marker"><ResourceIcon group={card.group}/>{card.merge&&<span className="merge-icon-badge" aria-hidden="true"><GitMerge size={16}/></span>}</span><div className="summary-content"><p>{t(card.label)}</p><strong><span className="summary-number">{number(card.amount)}</span>{card.amount!==null&&<small>{t('개')}</small>}</strong><span className="summary-estimate">{card.approx?t('약 ')+(card.original||number(card.amount)):''}</span></div><span className="meta">{card.meta}</span></article>)}</div></section>;
}
