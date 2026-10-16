// Pure study-queue helpers. No storage or DOM dependencies.
export function localDay(timestamp){const d=new Date(timestamp);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
export function dailyNewCount(logs,now=Date.now()){const day=localDay(now);return new Set(logs.filter(l=>l.wasNew&&Number.isFinite(l.at)&&localDay(l.at)===day).map(l=>l.cardId)).size}
export function makeQueue(cards,logs,settings={},now=Date.now()){
 const limit=Math.max(0,Math.min(200,Math.floor(Number(settings.dailyNew??20)||0)));
 const allowance=Math.max(0,limit-dailyNewCount(logs,now));
 const due=cards.filter(c=>!c.suspended&&(c.due??0)<=now);
 const reviews=due.filter(c=>(c.reps||0)>0).sort((a,b)=>(a.due??0)-(b.due??0));
 const fresh=reviews.length>100?[]:due.filter(c=>!(c.reps||0)).slice(0,allowance);
 return [...reviews,...fresh].map(c=>c.id);
}
export function splitQueue(ids,cards,now=Date.now()){
 const byId=new Map(cards.map(c=>[c.id,c]));
 const ready=[],waiting=[];
 for(const id of ids){const c=byId.get(id);if(!c||c.suspended)continue;if((c.due??0)<=now)ready.push(c);else waiting.push(c)}
 waiting.sort((a,b)=>a.due-b.due);
 return {ready,waiting};
}
