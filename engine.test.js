import test from 'node:test';import assert from 'node:assert/strict';import {schedule,isDue} from './engine.js';
const now=Date.UTC(2026,9,15);const card={id:'1',due:0,reps:0,interval:0,ease:2.5};
test('again schedules relearning in ten minutes',()=>{let r=schedule(card,'again',now);assert.equal(r.due,now+600000);assert.equal(r.lapses,1);assert.equal(card.reps,0)});
test('good grows intervals',()=>{let a=schedule(card,'good',now),b=schedule(a,'good',a.due),c=schedule(b,'good',b.due);assert.deepEqual([a.interval,b.interval,c.interval],[1,3,8])});
test('easy gives longer interval than good',()=>assert.ok(schedule(card,'easy',now).due>schedule(card,'good',now).due));
test('due check and suspended state',()=>{assert.ok(isDue(card,now));assert.ok(!isDue({...card,suspended:true},now));assert.ok(!isDue({...card,due:now+1},now))});
test('invalid rating rejected',()=>assert.throws(()=>schedule(card,'invalid',now)));
