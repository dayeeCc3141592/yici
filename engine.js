// Transparent SM-2-style spaced repetition scheduler, not FSRS.
// Intervals depend on actual ratings and prior review history.
export function schedule(card, rating, now=Date.now()) {
  if(!['again','hard','good','easy'].includes(rating)) throw Error('Invalid rating');
  const c={...card}; const prev=Number.isFinite(c.interval)?c.interval:0;
  c.reps=(c.reps||0)+1; c.lapses=c.lapses||0;
  c.ease=Number.isFinite(c.ease)?c.ease:2.5;
  const day=86400000;
  if(rating==='again') {c.lapses++;c.streak=0;c.interval=0;c.due=now+10*60000;c.ease=Math.max(1.3,c.ease-0.2);}
  if(rating==='hard') {c.streak=(c.streak||0)+1;c.interval=prev<1?1:Math.max(1,Math.round(prev*1.2));c.due=now+c.interval*day;c.ease=Math.max(1.3,c.ease-0.15);}
  if(rating==='good') {c.streak=(c.streak||0)+1;c.interval=prev<1?1:prev===1?3:Math.max(1,Math.round(prev*c.ease));c.due=now+c.interval*day;}
  if(rating==='easy') {c.streak=(c.streak||0)+1;c.ease=Math.min(3.5,c.ease+0.15);c.interval=prev<1?4:Math.max(prev+1,Math.round(prev*c.ease*1.3));c.due=now+c.interval*day;}
  c.lastReview=now; return c;
}
export function isDue(card,now=Date.now()){return !card.suspended && (card.due??0)<=now;}
export function dueLabel(card,now=Date.now()){const delta=(card.due??0)-now;if(delta<=0)return '现在';if(delta<3600000)return Math.ceil(delta/60000)+'分钟';return Math.ceil(delta/86400000)+'天';}
