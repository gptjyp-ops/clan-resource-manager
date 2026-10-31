import {t,useLanguage,guidePath} from './lib/i18n';
import {useState} from 'react';
import {BookOpen,Heart} from 'lucide-react';
import {Sheet,SheetContent,SheetHeader,SheetTitle,SheetDescription} from './components/ui/sheet';

const donationAccount='1002-8315-0879';
export default function HelpSupport(){useLanguage();
 const [open,setOpen]=useState(false),[copyStatus,setCopyStatus]=useState('');
 async function copyAccount(){try{await navigator.clipboard.writeText(donationAccount);setCopyStatus(t('계좌번호를 복사했습니다.'));}catch{setCopyStatus(t('복사하지 못했습니다. 계좌번호를 길게 누르거나 선택해 복사해주세요.'));}}
 return <><nav className="help-support" aria-label={t("사용 안내와 후원")}><a href={import.meta.env.BASE_URL+guidePath()} target="_blank" rel="noreferrer"><BookOpen size={17}/>{t("사용법 · 연습 책자")}</a><button type="button" onClick={()=>setOpen(true)}><Heart size={17}/>{t("운영 후원")}</button></nav><Sheet open={open} onOpenChange={setOpen}><SheetContent className="support-sheet overflow-y-auto"><SheetHeader><SheetTitle>{t("클랜 재화관리 운영 후원")}</SheetTitle><SheetDescription>{t("함께 사용하는 서비스를 응원해주세요.")}</SheetDescription></SheetHeader><div className="support-body"><p>{t("클랜원들이 사진을 올리고 재화를 모아 볼 수 있도록 서비스를 관리하고 있습니다.")}</p><h3>{t("후원은 어디에 사용하나요?")}</h3><ul><li>{t("사진 저장 공간과 서비스 운영")}</li><li>{t("사진 인식 오류 수정과 기능 개선")}</li><li>{t("사용 안내와 연습 자료 제작")}</li></ul><p>{t("후원은 자율입니다. 후원 여부에 따른 이용 기능의 차이는 없습니다.")}</p><section className="support-pending" aria-label={t("후원 계좌")}><strong>{t("후원 계좌")}</strong><p style={{marginTop:12}}>{t("토스뱅크")}</p><p style={{fontSize:22,fontWeight:700,letterSpacing:'.04em',userSelect:'text',overflowWrap:'anywhere'}}>{donationAccount}</p><button type="button" className="capture-paste" onClick={()=>void copyAccount()}>{t("계좌번호 복사")}</button><p role="status" aria-live="polite">{copyStatus}</p></section><a href={import.meta.env.BASE_URL+guidePath()} target="_blank" rel="noreferrer">{t("처음이라면 연습 책자부터 보기")}</a></div></SheetContent></Sheet></>;
}
