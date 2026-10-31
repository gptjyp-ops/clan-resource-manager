import {useEffect,useRef,useState} from 'react';
import {getRecords,clanAction,activeClanName} from './lib/api';
import {registrationDisplay} from './lib/weekly-registration';
import './clan-bot.css';

type Message={role:'user'|'bot';text:string};
export default function ClanBot(){
 const [open,setOpen]=useState(false),[input,setInput]=useState(''),[busy,setBusy]=useState(false),[consent,setConsent]=useState(false);
 const [messages,setMessages]=useState<Message[]>([{role:'bot',text:'클랜 도우미입니다. 등록 현황과 등록 안내문은 바로 확인할 수 있어요. 자유 질문은 AI 연결과 전송 동의가 필요합니다.'}]);
 const end=useRef<HTMLDivElement>(null),field=useRef<HTMLInputElement>(null);
 useEffect(()=>{if(open)field.current?.focus();},[open]);
 useEffect(()=>{end.current?.scrollIntoView({block:'nearest'});},[messages]);
 async function send(value=input){
  const question=value.trim();if(!question||busy)return;setInput('');setBusy(true);setMessages(m=>[...m,{role:'user',text:question}]);
  try{
   let answer:string;
   if(['등록 현황','등록 안내문'].includes(question)){
    const rows=await getRecords(),now=Date.now();
    const counts={none:[] as string[],partial:[] as string[],complete:[] as string[]};
    for(const row of rows)counts[registrationDisplay(row,now).status].push(row.nickname);
    const summary=`${activeClanName}\n저장된 회원 ${rows.length}명 기준 · 한국시간 일요일 09시 초기화\n전체 입력 완료 ${counts.complete.length}명\n일부 미입력 ${counts.partial.length}명\n이번 주 미등록 ${counts.none.length}명\n\n미등록: ${counts.none.join(', ')||'없음'}\n일부 미입력: ${counts.partial.join(', ')||'없음'}\n\n한 번도 등록하지 않은 회원은 명단에 없으므로 포함되지 않습니다.`;
    answer=question==='등록 현황'?summary:`[재화 등록 안내]\n이번 주 재화 등록을 부탁드립니다. 스킬·알·탈것·물약과 알·탈것 합성 수량을 확인해주세요. 0개도 0으로 입력해주세요.\n\n${summary}\n\n※ 안내문 초안입니다. 복사 전 명단과 마감 시간을 확인해주세요.`;
   }else if(question==='사용법')answer='1. 클랜에 입장합니다.\n2. 내 재화에서 닉네임을 입력하고 사진을 올립니다.\n3. 인식한 숫자를 확인·수정하고 저장합니다.\n4. 클랜 현황에서 등록 여부를 확인합니다.\n\n등록 현황과 등록 안내문 버튼은 AI에 데이터를 전송하지 않습니다. 도우미는 재화를 수정하거나 공지를 발송하지 않습니다.';
   else{
    if(!consent)throw Error('AI 질문을 사용하려면 아래 전송 동의에 체크해주세요. 질문 내용만 AI 제공사에 전송하며, 클랜 기록·사진·비밀번호는 자동으로 보내지 않습니다.');
    const result=await clanAction('assistant',{question}) as {ok:boolean;answer?:string};
    if(!result.answer)throw Error('AI 답변을 받지 못했습니다.');answer='[AI 답변 · 확인 후 사용]\n'+result.answer;
   }
   setMessages(m=>[...m,{role:'bot',text:answer}].slice(-30));
  }catch(e){setMessages(m=>[...m,{role:'bot',text:e instanceof Error?e.message:'요청하지 못했습니다. 다시 시도해주세요.'}].slice(-30));}
  finally{setBusy(false);}
 }
 return <div className="clan-bot">
  <button type="button" className="bot-launch" aria-expanded={open} aria-controls="clan-bot-panel" onClick={()=>setOpen(!open)}>{open?'도우미 닫기':'클랜 도우미'}</button>
  {open&&<section id="clan-bot-panel" className="bot-panel" aria-label="클랜 도우미">
   <header><strong>클랜 도우미 · 시험 운영</strong><button type="button" aria-label="도우미 닫기" onClick={()=>setOpen(false)}>×</button></header>
   <div className="bot-log" role="log" aria-live="polite">{messages.map((m,i)=><div className={'bot-message '+m.role} key={i}><small>{m.role==='user'?'나':'도우미'}</small><p>{m.text}</p>{m.role==='bot'&&i>0&&<button type="button" onClick={async()=>{try{await navigator.clipboard.writeText(m.text);}catch{setMessages(x=>[...x,{role:'bot',text:'복사하지 못했습니다. 답변을 길게 눌러 복사해주세요.'}]);}}}>복사</button>}</div>)}{busy&&<p role="status">확인 중…</p>}<div ref={end}/></div>
   <div className="bot-actions">{['등록 현황','등록 안내문','사용법'].map(q=><button type="button" disabled={busy} key={q} onClick={()=>void send(q)}>{q}</button>)}</div>
   <label className="bot-consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/>자유 질문을 Google AI에 전송하는 데 동의합니다. 비밀번호·개인정보는 입력하지 마세요.</label>
   <form onSubmit={e=>{e.preventDefault();void send();}}><input ref={field} aria-label="도우미에게 질문" placeholder="사용법이나 공지 문구를 물어보세요" maxLength={1200} value={input} onChange={e=>setInput(e.target.value)}/><button type="submit" disabled={busy||!input.trim()}>보내기</button></form>
   <small className="bot-note">AI 자유 질문은 서버 API 키 설정 후 사용 가능합니다. 대화는 새로고침하면 사라집니다.</small>
  </section>}
 </div>;
}
