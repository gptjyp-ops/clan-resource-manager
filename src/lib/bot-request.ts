export async function withBotTimeout<T>(request:Promise<T>,milliseconds=20000):Promise<T>{
 let timer:ReturnType<typeof setTimeout>|undefined;
 try{return await Promise.race([request,new Promise<never>((_,reject)=>{timer=setTimeout(()=>reject(Error('20초 동안 응답이 없습니다. 잠시 후 다시 시도해주세요. 반복되면 구글 저장 연결 또는 AI 설정 확인이 필요합니다.')),milliseconds);})]);}
 finally{if(timer!==undefined)clearTimeout(timer);}
}
