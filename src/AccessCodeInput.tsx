import {useState} from 'react';
import {Eye,EyeOff} from 'lucide-react';
import {t} from './lib/i18n';
export default function AccessCodeInput({value,onChange,disabled}:{value:string;onChange:(value:string)=>void;disabled:boolean}){
 const [visible,setVisible]=useState(false);
 return <div className="access-code-input"><input id="clan-key" type={visible?'text':'password'} autoComplete="off" autoCapitalize="none" spellCheck={false} required value={value} onChange={e=>onChange(e.target.value)} disabled={disabled}/><button type="button" className="access-code-toggle" disabled={disabled} onClick={()=>setVisible(v=>!v)} aria-label={t(visible?'입장 코드 숨기기':'입장 코드 보기')} title={t(visible?'입장 코드 숨기기':'입장 코드 보기')} aria-pressed={visible} aria-controls="clan-key">{visible?<EyeOff size={20} aria-hidden="true"/>:<Eye size={20} aria-hidden="true"/>}</button></div>;
}
