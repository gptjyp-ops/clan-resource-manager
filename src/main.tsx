import ClanThemes from './ClanThemes';
import './elite.css';
import EliteTheme from './EliteTheme';
import MatrixBackground from './MatrixBackground';
import {flushClientErrorReports,reportClientError} from './lib/client-error-report';
import {GlobalErrorMonitor,AppErrorBoundary} from './GlobalErrorMonitor';
import './error-monitor.css';
import React from 'react';import {createRoot} from 'react-dom/client';import App from './App';import './style.css';
import HelpSupport from './HelpSupport';
import LanguageSwitch from './LanguageSwitch';
createRoot(document.getElementById('root')!).render(<React.StrictMode><AppErrorBoundary><GlobalErrorMonitor/><EliteTheme/><ClanThemes/><MatrixBackground/><LanguageSwitch/><App/><HelpSupport/></AppErrorBoundary></React.StrictMode>);


import './clan-bot.css';

/** Retry pending diagnostics automatically; never transmit passwords, URLs or raw exceptions. */
void flushClientErrorReports();
window.addEventListener('online',()=>{void flushClientErrorReports();});
window.setInterval(()=>{void flushClientErrorReports();},60000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)void flushClientErrorReports();});
window.addEventListener('error',event=>{
 if(event.filename&&!(event.filename.startsWith(location.origin)||event.filename.startsWith('/')))return;
 void reportClientError('CRM-GEN-002','앱 실행 중 오류');
});
window.addEventListener('unhandledrejection',()=>{
 void reportClientError('CRM-GEN-002','앱 실행 중 오류');
});
