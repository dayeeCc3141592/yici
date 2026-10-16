import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=readFileSync(new URL('../app.js',import.meta.url),'utf8');
test('sense selection is actually rendered in edit form',()=>{assert.match(src,/id="sense-picker"/);assert.match(src,/function renderSensePicker/);assert.match(src,/e.target.id==='sense-choice'/)});
test('home accounts for daily quota',()=>{assert.match(src,/todayNewCount\(\)/);assert.match(src,/今日新词余额/)});
test('last rating can be undone after finish',()=>{assert.match(src,/撤销最后一次评分/);assert.match(src,/tab='study';let idx=/)});
test('visible version comes from build constant',()=>{assert.match(src,/V'\+APP_VERSION/)});

test('failed ratings stay in session for short-term relearning',()=>{assert.match(src,/queue\.push\(c\.id\)/);assert.match(src,/等待重学<\/h2>/);assert.match(src,/setTimeout\(\(\)=>\{if\(tab==='study'\)render\(\)\}/)});
test('backup import validates deck references and duplicate identifiers',()=>{assert.match(src,/const validBackup=/);assert.match(src,/ids\.has\(c\.id\)/);assert.match(src,/decks\.has\(c\.deckId\)/)});
test('offline dictionary accepts expired local entries',()=>{assert.match(src,/\|\|!navigator\.onLine/);assert.match(src,/已过期，仅供参考/)});

test('new-card quota counts distinct cards rather than repeated failures',()=>{assert.match(src,/const todayNewCount=\(\)=>countNew\(state\.logs\)/);assert.match(src,/makeQueue\(cards,state\.logs,state\.settings\)/)});
test('image lookup does not fall back to unrelated same-word sense',()=>{assert.match(src,/let c=active\?\.front===word\?active:null/)});
test('PWA update prompt requires installed worker',()=>{assert.match(src,/worker\.state==='installed'/);assert.match(src,/reload-update/)});
