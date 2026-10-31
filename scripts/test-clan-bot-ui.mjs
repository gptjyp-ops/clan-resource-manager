import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import ts from 'typescript';
const exports={};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/bot-request.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports,setTimeout,clearTimeout,Promise,Error});
const {withBotTimeout}=exports;
assert.equal(await withBotTimeout(Promise.resolve('ok'),10),'ok');
await assert.rejects(withBotTimeout(Promise.reject(Error('AI 연결 전')),10),/AI 연결 전/);
await assert.rejects(withBotTimeout(new Promise(()=>{}),5),/응답이 없습니다/);
const state=[];let cursor=0,calls=0;
const react={useState(initial){const i=cursor++;if(!(i in state))state[i]=initial;return [state[i],value=>{state[i]=typeof value==='function'?value(state[i]):value;}];},useRef(initial){const i=cursor++;return state[i]??(state[i]={current:initial});},useEffect(){}};
const jsx=(type,props)=>({type,props}),api={getRecords:async()=>[],activeClanName:'test',clanAction:async()=>{calls++;throw Error('AI 자유 질문은 아직 연결 전입니다.');}};
const component={};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/ClanBot.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{exports:component,require:name=>name==='react'?react:name==='react/jsx-runtime'?{jsx,jsxs:jsx}:name==='./lib/api'?api:name==='./lib/i18n'?{useLanguage:()=> 'ko'}:name==='./lib/weekly-registration'?{registrationDisplay:()=>({status:'none'})}:name==='./lib/bot-request'?{withBotTimeout:p=>withBotTimeout(p,5)}:(()=>{throw Error(name);})(),navigator:{},setTimeout,clearTimeout,console});
const render=()=>{cursor=0;return component.default();};
function nodes(node){if(!node||typeof node!=='object')return [];return [node,...[node.props?.children].flat(Infinity).flatMap(nodes)];}
const flush=()=>new Promise(r=>setTimeout(r,15));
let tree=render();nodes(tree).find(n=>n.props?.className==='bot-launch').props.onClick();tree=render();
function question(text){tree=render();nodes(tree).find(n=>n.props?.['aria-label']==='도우미에게 질문').props.onChange({target:{value:text}});tree=render();nodes(tree).find(n=>n.type==='form').props.onSubmit({preventDefault(){}});}
question('안녕');await flush();tree=render();assert.equal(calls,0);assert.match(nodes(tree).find(n=>n.props?.role==='alert').props.children,/동의/);
nodes(tree).find(n=>n.props?.type==='checkbox').props.onChange({target:{checked:true}});
question('안녕');await flush();tree=render();assert.equal(calls,1);assert.match(nodes(tree).find(n=>n.props?.role==='alert').props.children,/연결 전/);
api.clanAction=()=>new Promise(()=>{});question('응답 테스트');await flush();tree=render();assert.match(nodes(tree).find(n=>n.props?.role==='alert').props.children,/응답이 없습니다/);
assert.equal(nodes(tree).find(n=>n.props?.['aria-label']==='도우미에게 질문').props.disabled,false);
api.clanAction=async()=>({ok:true,answer:'테스트 답변'});question('다시');await flush();tree=render();assert.match(nodes(tree).find(n=>n.props?.className==='bot-feedback').props.children,/답변이 도착/);
console.log('Assistant UI: consent feedback, missing configuration, timeout, retry and successful response passed.');
