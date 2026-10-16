import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=readFileSync(new URL('../app.js',import.meta.url),'utf8');
test('sense selection is actually rendered in edit form',()=>{assert.match(src,/id="sense-picker"/);assert.match(src,/function renderSensePicker/);assert.match(src,/e.target.id==='sense-choice'/)});
test('home accounts for daily quota',()=>{assert.match(src,/todayNewCount\(\)/);assert.match(src,/今日新词余额/)});
test('last rating can be undone after finish',()=>{assert.match(src,/撤销最后一次评分/);assert.match(src,/tab='study';let idx=/)});
test('visible version comes from build constant',()=>{assert.match(src,/V'\+APP_VERSION/)});
