// Yici V0.3: FSRS v4.5 formula implementation, fixed default parameters.
// Not FSRS-6; migration of older SM-2 cards starts fresh FSRS state while retaining old logs.
export const W=[0.4,0.6,2.4,5.8,4.93,0.94,0.86,0.01,1.49,0.14,0.94,2.18,0.05,0.34,1.26,0.29,2.61];
const DAY=86400000,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function isDue(c,now=Date.now()){return !c.suspended&&(c.due??0)<=now}
export function dueLabel(c,now=Date.now()){let d=(c.due??0)-now;if(d<=0)return '现在';if(d<3600000)return Math.ceil(d/60000)+'分钟';if(d<DAY)return Math.ceil(d/3600000)+'小时';return Math.ceil(d/DAY)+'天'}
export function stateName(c){return c.fsrs?.state||(!c.reps?'New':'Review')}
function interval(s,retention){return clamp(Math.round(s/(19/81)*(Math.pow(retention,-2)-1)),1,36500)}
function stabilityAfterSuccess(d,s,r,g){let hard=g===2?W[15]:1,easy=g===4?W[16]:1;return s*(1+Math.exp(W[8])*(11-d)*Math.pow(s,-W[9])*(Math.exp((1-r)*W[10])-1)*hard*easy)}
function stabilityAfterFail(d,s,r){return Math.min(s,W[11]*Math.pow(d,-W[12])*(Math.pow(s+1,W[13])-1)*Math.exp((1-r)*W[14]))}
export function schedule(card,rating,now=Date.now(),retention=.9){
 const g=({again:1,hard:2,easy:4})[rating];if(!g)throw Error('无效评分');
 const c={...card},old=c.fsrs||null;let d,s,elapsed=0;
 if(!old){d=clamp(W[4]-Math.exp(W[5]*(g-1))+1,1,10);s=W[g-1]}
 else{d=clamp(old.difficulty-W[6]*(g-3),1,10);d=clamp(W[7]* (W[4]-Math.exp(W[5]*(g-1))+1)+(1-W[7])*d,1,10);s=old.stability;elapsed=Math.max(0,(now-(old.lastReview||now))/DAY);
 const r=Math.pow(1+(19/81)*elapsed/Math.max(.01,s),-.5);
 s=g===1?stabilityAfterFail(d,s,r):stabilityAfterSuccess(d,s,r,g)}
 s=clamp(s,.1,36500);
 const state=g===1?'Relearning':old?'Review':'Learning';
 const days=interval(s,retention);
 const nextDue=g===1?now+10*60000:now+days*DAY;
 c.fsrs={version:'4.5',state,difficulty:d,stability:s,lastReview:now,scheduledDays:g===1?0:days};
 c.due=nextDue;c.interval=g===1?0:days;c.lastReview=now;c.reps=(c.reps||0)+1;c.lapses=(c.lapses||0)+(g===1?1:0);
 return c;
}
