import {useEffect,useState,type FormEvent} from 'react';
import {clanAction} from './lib/api';
import {quantity} from './lib/inventory';

export const eliteManualClanId='f768d7c5332948cbb1f7ec5f';
const fields=[['skill','스킬'],['egg','알 개수'],['eggMerge','알 합성'],['mount','탈것 개수'],['mountMerge','탈것 합성수'],['potion','녹색 물약']] as const;
const summonGroups=['skill','egg','mount'] as const;
type SummonGroup=typeof summonGroups[number];
type AscensionField=`${SummonGroup}${'Level'|'Waiting'}`;
const summonNames={skill:'스킬',egg:'알',mount:'탈것'};
function displayAmount(key:string,value:string|undefined){
 if(value===undefined)return '미입력';
 if(key.endsWith('Merge'))return value;
 const count=quantity(value);
 return count===null?value:`${count/1000}K`;
}
const isWaiting=(row:Registration)=>summonGroups.some(group=>row.amounts[`${group}Waiting`]==='yes');
type Registration={nickname:string;amounts:Partial<Record<typeof fields[number][0]|AscensionField,string>>;submittedAt:string};

export default function EliteManualRegistration(){
 const [search,setSearch]=useState('');
 const [rows,setRows]=useState<Registration[]>([]);
 const [nickname,setNickname]=useState('');
 const [password,setPassword]=useState('');
 const [adminToken,setAdminToken]=useState('');
 const [available,setAvailable]=useState(false);
 const [busy,setBusy]=useState(true);
 const [error,setError]=useState('');
 const [notice,setNotice]=useState('');
 const [pending,setPending]=useState<Registration|null>(null);

 const query=search.trim().normalize('NFKC').toLowerCase();
 const visibleRows=rows.filter(row=>row.nickname.normalize('NFKC').toLowerCase().includes(query)).sort((a,b)=>Number(isWaiting(b))-Number(isWaiting(a)));

 async function refresh(){
  const result=await clanAction('manualList');
  if(!result.manualAscension||!result.manualMergeCounts||!result.manualRecords)throw Error('수기 등록을 업데이트 중입니다. 잠시 후 새로고침해주세요.');
  setRows(result.manualRecords);
  setAvailable(true);
 }
 async function run(action:()=>Promise<void>){
  setBusy(true);setError('');setNotice('');
  try{await action();}catch(e){setError(e instanceof Error?e.message:'요청에 실패했습니다.');}
  finally{setBusy(false);}
 }
 useEffect(()=>{void run(refresh);},[]);
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  const form=event.currentTarget,data=new FormData(form);
  await run(async()=>{
   await clanAction('manualSubmit',{nickname,amounts:{
    ...Object.fromEntries(fields.map(([key])=>[key,key.endsWith('Merge')?data.get(key):String(data.get(key)).trim().replace(/k$/i,'')+'k'])),
    ...Object.fromEntries(summonGroups.flatMap(key=>[
     [key+'Level',data.get(key+'Level')],
     [key+'Waiting',data.has(key+'Waiting')?'yes':'no']
    ]))
   }});
   form.reset();setNickname('');setNotice('이번 주 재화를 등록했습니다.');
   await refresh();
  });
 }
 async function login(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  await run(async()=>{
   const result=await clanAction('adminLogin',{password}) as {adminToken?:string};
   if(!result.adminToken)throw Error('클랜장 로그인에 실패했습니다.');
   setPassword('');setAdminToken(result.adminToken);
  });
 }
 async function cancel(row:Registration){
  await run(async()=>{
   await clanAction('manualCancel',{adminToken,nickname:row.nickname,submittedAt:row.submittedAt});
   setPending(null);setNotice(row.nickname+'님의 이번 주 등록을 취소했습니다.');
   await refresh();
  });
 }
 return <main><div className="workspace">
  <section className="panel registration">
   <h1>ELITE KOR 재화 등록</h1>
   <p>닉네임당 주 1회 등록 · 매주 월요일 오전 9시 초기화</p>
   <form onSubmit={submit}>
    <label>게임 닉네임 <input required maxLength={24} value={nickname} onChange={e=>setNickname(e.target.value)}/></label>
    {[[fields[0]],fields.slice(1,3),fields.slice(3,5),[fields[5]]].map(row=>
     <div key={row[0][0]}>
     <div style={{display:'grid',gridTemplateColumns:row.length===2?'repeat(2,minmax(0,1fr))':'minmax(0,1fr)',gap:12}}>
      {row.map(([key,label])=><label key={key} className="number-field" style={{minWidth:0}}>
       <span>{label}{!key.endsWith('Merge')&&' (K)'}</span>
       <input name={key} required maxLength={24} inputMode={key.endsWith("Merge")?"numeric":"decimal"} pattern={key.endsWith("Merge")?"[0-9]+":"[0-9]+([.][0-9]{1,3})?[kK]?"} placeholder={key.endsWith("Merge")?"없으면 0":"예: 12.5"} style={{width:'100%',minWidth:0}}/>
      </label>)}
     </div>
     {summonGroups.map(group=>group===row[0][0]&&<div key={group} style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:12,alignItems:'end'}}>
      <label className="number-field" style={{minWidth:0}}>
       <span>{summonNames[group]} 소환 레벨</span>
       <input name={group+'Level'} type="number" min={1} max={100} step={1} inputMode="numeric" placeholder="선택 입력" style={{width:'100%',minWidth:0}}/>
      </label>
      <label><input type="checkbox" name={group+'Waiting'} style={{width:'auto'}} aria-label={summonNames[group]+' 승천대기'}/> 승천대기</label>
     </div>)}
     </div>
    )}
    <button className="submit" disabled={busy||!available}>이번 주 재화 등록</button>
   </form>
   {error&&<p role="alert">{error}</p>}{notice&&<p role="status">{notice}</p>}
  </section>
  <section className="panel elite-weekly-results">
   <style>{`
    .elite-weekly-results { padding: 16px; }
    .elite-resource-list { display: none; }
    @media (max-width: 720px) {
     .elite-weekly-table { display: none; }
     .elite-resource-list { display: grid; grid-auto-flow: column; grid-auto-columns: 100%; overflow-x: auto; scroll-snap-type: x mandatory; margin: 12px 0; }
     .elite-resource-page { min-width: 0; scroll-snap-align: start; scroll-snap-stop: always; }
     .elite-resource-page h3 { margin: 0 0 8px; }
     .elite-resource-page h3 small { font-size: .75em; }
     .elite-resource-page table { width: 100%; table-layout: fixed; }
     .elite-resource-page th, .elite-resource-page td { padding: 6px 4px; overflow-wrap: anywhere; vertical-align: top; }
     .elite-resource-page th:first-child { width: 39%; }
     .elite-resource-page td small, .elite-resource-page th button { display: block; }
     .elite-resource-page td strong { font-variant-numeric: tabular-nums; }
    }
   `}</style>
   <h2>이번 주 등록 현황</h2>
   {rows.length>0&&<label className="number-field"><span>닉네임 검색</span><input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="닉네임 일부 입력"/></label>}
   <button type="button" disabled={busy} onClick={()=>void run(refresh)}>새로고침</button>
   {rows.length===0?<p>표시할 등록 내역이 없습니다.</p>:visibleRows.length===0?<p role="status">일치하는 닉네임이 없습니다.</p>:<>
   <div className="elite-resource-list" tabIndex={0} role="region" aria-label="재화별 현황 · 좌우로 이동">
    {[[fields[0]],fields.slice(1,3),fields.slice(3,5),[fields[5]]].map((line,index)=>
     <section className="elite-resource-page" key={line[0][0]} aria-label={['스킬','알','탈것','녹색 물약'][index]}>
      <h3>{['스킬','알','탈것','녹색 물약'][index]} <small>{index+1} / 4</small></h3>
      <table>
       <thead><tr><th>닉네임</th>{line.map(([key,label])=><th key={key}>{label}</th>)}</tr></thead>
       <tbody>{visibleRows.map(row=><tr key={row.nickname}>
        <th scope="row">{row.nickname}
         {adminToken&&<button type="button" disabled={busy} onClick={()=>setPending(row)}>등록 취소</button>}
        </th>
        {line.map(([key])=><td key={key}>
         <strong>{displayAmount(key,row.amounts[key])}</strong>
         {summonGroups.map(group=>group===key&&<div key={group}>
          {row.amounts[`${group}Level`]&&<small>Lv. {row.amounts[`${group}Level`]}</small>}
          {row.amounts[`${group}Waiting`]==='yes'&&<small>승천대기</small>}
         </div>)}
        </td>)}
       </tr>)}</tbody>
      </table>
     </section>
    )}
   </div>
   <div className="elite-weekly-table" tabIndex={0} role="region" aria-label="클랜 재화 현황 표" style={{overflowX:'auto'}}><table>
    <thead><tr><th>닉네임</th>{fields.map(([key,label])=><th key={key}>{label}{!key.endsWith('Merge')&&' (K)'}</th>)}{adminToken&&<th>관리</th>}</tr></thead>
    <tbody>{visibleRows.map(row=><tr key={row.nickname}><th scope="row">{row.nickname}{isWaiting(row)&&<div><small>승천대기</small></div>}</th>
     {fields.map(([key])=><td key={key}>{displayAmount(key,row.amounts[key])}
      {summonGroups.map(group=>group===key&&<div key={group}>
       {row.amounts[`${group}Level`]&&<span>Lv. {row.amounts[`${group}Level`]} </span>}
       {row.amounts[`${group}Waiting`]==='yes'&&<strong>승천대기</strong>}
      </div>)}
     </td>)}
     {adminToken&&<td><button type="button" disabled={busy} onClick={()=>setPending(row)}>등록 취소</button></td>}
    </tr>)}</tbody>
   </table></div></>}
   {pending&&<div role="group" aria-label="등록 취소 확인"><p>{pending.nickname}님의 이번 주 등록을 취소할까요?</p>
    <button type="button" disabled={busy} onClick={()=>void cancel(pending)}>등록 취소 확인</button>
    <button type="button" disabled={busy} onClick={()=>setPending(null)}>닫기</button>
   </div>}
   <details><summary>클랜장 관리</summary>
    {adminToken?<button type="button" disabled={busy} onClick={()=>{setAdminToken('');setPending(null);}}>클랜장 관리 닫기</button>:
    <form onSubmit={login}><label>클랜장 비밀번호 <input type="password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>
    <button disabled={busy}>클랜장 로그인</button></form>}
   </details>
  </section>
 </div></main>;
}
