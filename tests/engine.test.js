import {schedule,isDue,dueLabel} from '../engine.js';
import assert from 'node:assert/strict';
import {test} from 'node:test';
const NOW=Date.UTC(2026,9,16,12);
test('ratings map to expected next review',()=>{
 const base={id:'word',due:0,reps:0};
 const easy=schedule(base,'easy',NOW),hard=schedule(base,'hard',NOW),again=schedule(base,'again',NOW);
 assert.ok(easy.due>hard.due);
 assert.equal(again.due,NOW+600000);
 assert.equal(again.fsrs.state,'Relearning');
 assert.equal(easy.fsrs.version,'4.5');
 assert.equal(base.reps,0);
});
test('review updates stability and retains previous object',()=>{
 const base=schedule({id:'word',due:0,reps:0},'hard',NOW);
 const later=schedule(base,'easy',NOW+86400000);
 assert.ok(later.fsrs.stability>base.fsrs.stability);
 assert.equal(base.reps,1);assert.equal(later.reps,2);
});
test('due threshold and labels',()=>{
 assert.equal(isDue({due:NOW},NOW),true);
 assert.equal(isDue({due:NOW+1},NOW),false);
 assert.equal(isDue({due:NOW,suspended:true},NOW),false);
 assert.equal(dueLabel({due:NOW+600000},NOW),'10分钟');
});
test('invalid rating rejected',()=>assert.throws(()=>schedule({},'good',NOW)));
