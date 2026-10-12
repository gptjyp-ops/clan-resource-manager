import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';

export function credentials(json){
 let parsed;try{parsed=JSON.parse(json);}catch{throw Error('GAS_OAUTH_JSON 형식을 확인해주세요.');}
 const auth=parsed.tokens?.default||parsed;
 if(!['client_id','client_secret','refresh_token'].every(key=>typeof auth[key]==='string'&&auth[key]))throw Error('구글 로그인을 다시 하고 GAS_OAUTH_JSON을 등록해주세요.');
 return Object.fromEntries(['client_id','client_secret','refresh_token'].map(key=>[key,auth[key]]));
}
const writable=files=>files.map(({name,type,source})=>({name,type,source}));
export async function deployGoogle({env=process.env,fetcher=fetch,read=fs.readFile}={}){
 const scriptId=env.GAS_SCRIPT_ID,deploymentId=env.GAS_DEPLOYMENT_ID;
 if(!scriptId||!deploymentId||!env.GAS_OAUTH_JSON)throw Error('최초 구글 연결이 필요합니다. google/AUTO-DEPLOY.md를 확인해주세요.');
 if(!/^[\w-]{20,200}$/.test(scriptId)||!/^[\w-]{20,200}$/.test(deploymentId))throw Error('스크립트 ID와 배포 ID를 확인해주세요.');
 const auth=credentials(env.GAS_OAUTH_JSON);
 const response=await fetcher('https://oauth2.googleapis.com/token',{method:'POST',body:new URLSearchParams({...auth,grant_type:'refresh_token'}),signal:AbortSignal.timeout(30000)});
 if(!response.ok)throw Error('구글 인증 갱신 실패. 계정 연결을 다시 설정해주세요.');
 const token=(await response.json()).access_token;if(typeof token!=='string'||!token)throw Error('구글 인증 응답을 확인해주세요.');
 async function api(path,method='GET',payload){
  const result=await fetcher('https://script.googleapis.com/v1/projects/'+scriptId+path,{method,headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:payload?JSON.stringify(payload):undefined,signal:AbortSignal.timeout(60000)});
  if(!result.ok)throw Error(`구글 API ${method} 요청 실패 (HTTP ${result.status}). Apps Script API 활성화·계정 권한을 확인해주세요.`);
  return result.json();
 }
 const deployment=await api('/deployments/'+deploymentId);
 if(deployment.deploymentId!==deploymentId||deployment.deploymentConfig?.scriptId!==scriptId||!deployment.entryPoints?.some(entry=>entry.entryPointType==='WEB_APP'))throw Error('기존 웹 앱 배포가 맞는지 확인해주세요.');
 const before=writable((await api('/content')).files||[]);
 if(!before.some(file=>file.name==='appsscript'&&file.type==='JSON'))throw Error('기존 구글 프로젝트 설정을 읽지 못했습니다.');
 const replacements=[{name:'Code',type:'SERVER_JS',source:await read('google/Code.gs','utf8')},{name:'Bridge',type:'HTML',source:await read('google/Bridge.html','utf8')}];
 const files=[...before.filter(file=>!replacements.some(item=>item.name===file.name)),...replacements];
 const latest=writable((await api('/content')).files||[]);
 if(JSON.stringify(latest)!==JSON.stringify(before))throw Error('구글 편집 내용이 변경되었습니다. 잠시 후 다시 실행해주세요.');
 await api('/content','PUT',{files});
 try{
  const description='GitHub '+(env.GITHUB_SHA||'manual').slice(0,12);
  const version=await api('/versions','POST',{description});
  if(!Number.isInteger(version.versionNumber)||version.versionNumber<1)throw Error('새 배포 버전을 확인하지 못했습니다.');
  await api('/deployments/'+deploymentId,'PUT',{deploymentConfig:{scriptId,versionNumber:version.versionNumber,manifestFileName:deployment.deploymentConfig.manifestFileName||'appsscript',description}});
  return {version:version.versionNumber};
 }catch(error){
  // Restore editor content only if nobody changed it after our update.
  try{const current=writable((await api('/content')).files||[]);if(JSON.stringify(current)===JSON.stringify(files))await api('/content','PUT',{files:before});}catch{}
  throw error;
 }
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 try{const result=await deployGoogle();console.log('기존 구글 웹 앱 업데이트 완료. 버전 '+result.version);}
 catch(error){console.error(error.message);process.exitCode=1;}
}
