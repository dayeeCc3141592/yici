import {test} from 'node:test';
import assert from 'node:assert/strict';
import {dailyNewCount,makeQueue,splitQueue,localDay} from '../study-queue.js';
const now=new Date(2026,9,16,12).getTime();
const card=(id,reps=0,due=0)=>({id,reps,due});
test('new quota counts unique card IDs even after repeat failures',()=>{
 const logs=[{cardId:'a',wasNew:true,at:now},{cardId:'a',wasNew:true,at:now+1000},{cardId:'b',wasNew:true,at:now},{cardId:'c',wasNew:true,at:now-86400000}];
 assert.equal(dailyNewCount(logs,now),2);
 assert.equal(localDay(now), '2026-10-16');
});
test('oldest due reviews come first and new allowance is capped',()=>{
 const cards=[card('new1'),card('new2'),card('old2',2,now-1000),card('old1',1,now-2000),card('future',3,now+1000)];
 assert.deepEqual(makeQueue(cards,[{cardId:'x',wasNew:true,at:now}],{dailyNew:2},now),['old1','old2','new1']);
});
test('zero quota excludes new cards but never excludes due reviews',()=>{
 assert.deepEqual(makeQueue([card('new'),card('old',2,0)],[],{dailyNew:0},now),['old']);
});
test('relearning waits and resumes precisely at due timestamp',()=>{
 const c=[card('waiting',2,now+600000),card('ready',2,now)];
 assert.deepEqual(splitQueue(['waiting','ready'],c,now).ready.map(x=>x.id),['ready']);
 assert.deepEqual(splitQueue(['waiting','ready'],c,now+600000).ready.map(x=>x.id),['waiting','ready']);
});
test('suspended and removed cards never enter a session',()=>{
 const c=[card('a'),{...card('s'),suspended:true}];
 assert.deepEqual(makeQueue(c,[],{},now),['a']);
 assert.deepEqual(splitQueue(['s','missing','a'],c,now).ready.map(x=>x.id),['a']);
});
test('review backlog suppresses new cards',()=>{
 const cards=Array.from({length:101},(_,i)=>card('old'+i,1,now-1000));cards.push(card('new'));
 assert.equal(makeQueue(cards,[],{dailyNew:20},now).includes('new'),false);
});
