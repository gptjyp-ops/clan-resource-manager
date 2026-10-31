import {useEffect,useState} from 'react';
import {activeClanId} from './lib/api';
import './elite.css';
export const ELITE_CLAN_ID='f768d7c5332948cbb1f7ec5f';
const mark=import.meta.env.BASE_URL+'images/elite-clan-mark.webp';
function selectedElite(){return (new URLSearchParams(location.hash.slice(1)).get('clan')||activeClanId)===ELITE_CLAN_ID;}
function useElite(){const [elite,setElite]=useState(selectedElite);useEffect(()=>{const update=()=>setElite(selectedElite());window.addEventListener('hashchange',update);return()=>window.removeEventListener('hashchange',update);},[]);return elite;}
export default function EliteTheme(){const elite=useElite();useEffect(()=>{if(!elite)return;document.body.dataset.clanTheme='elite';document.body.style.setProperty('--elite-mark', 'url('+mark+')');const previousTitle=document.title;document.title='ELITE · 클랜 재화';const icon=document.createElement('link');icon.rel='icon';icon.href=mark;document.head.appendChild(icon);return()=>{delete document.body.dataset.clanTheme;document.body.style.removeProperty('--elite-mark');document.title=previousTitle;icon.remove();};},[elite]);return null;}
export function EliteBanner({compact=false}:{compact?:boolean}){const elite=useElite();if(!elite)return null;return <section className={'elite-banner'+(compact?' elite-banner-compact':'')} aria-label="ELITE 클랜"><a href={mark} target="_blank" rel="noopener noreferrer" aria-label="ELITE 클랜 마크 크게 보기"><img src={mark} alt="빨간 머리와 파란 안경, 갈색 정장의 클마님이 동료와 함께 파란 트럭을 운전하는 ELITE 클랜 마크" width="1254" height="1254"/></a><div><span className="elite-kicker">FORGE MASTER · ELITE</span><h2>함께 달리는 ELITE</h2><p>우리의 재화를 모아, 다음 모험을 준비해요.</p><span className="elite-banner-tag">클랜 재화 보관소</span></div><span className="elite-leaf" aria-hidden="true">🍁</span></section>;}
