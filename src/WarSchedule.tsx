import {CalendarDays,ChevronDown,Download} from 'lucide-react';
import PhotoPreview from './PhotoPreview';
import {getLanguage,t,useLanguage} from './lib/i18n';

const days=[
 {day:1,points:1,tasks:['장비 제작','스킬','던전']},
 {day:2,points:2,tasks:['대장간','탈것','기술 트리']},
 {day:3,points:2,tasks:['장비 제작','스킬','펫']},
 {day:4,points:2,tasks:['대장간','탈것','던전']},
 {day:5,points:2,tasks:['장비 제작','펫','기술 트리']},
 {day:6,points:4,tasks:['라이벌전','전면전']},
];
export default function WarSchedule(){
 useLanguage();
 const src=import.meta.env.BASE_URL+'images/clan-war-schedule.png';
 return <details className="war-schedule">
  <summary><CalendarDays size={21} aria-hidden="true"/><span><strong>{t('클랜전 일차별 일정')}</strong><small>{t('1~6일차 항목과 승점 확인')}</small></span><ChevronDown className="schedule-chevron" size={20} aria-hidden="true"/></summary>
  <div className="war-schedule-body">
   <PhotoPreview src={src} alt={t('클랜전 일차별 일정')}/>
   <ol className={getLanguage()==='en'?'schedule-text':'sr-only'} aria-label={t('일차별 항목과 승점')}>{days.map(({day,points,tasks})=><li key={day}><strong>DAY {day} · {t('승점')} {points}</strong><span>{tasks.map(task=>t(task)).join(' · ')}</span></li>)}</ol>
   <a className="schedule-download" href={src} download="POTATO-clan-war-schedule.png"><Download size={16} aria-hidden="true"/>{t('안내 이미지 다운로드')}</a>
  </div>
 </details>;
}
