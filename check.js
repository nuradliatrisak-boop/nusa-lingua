const fs = require('node:fs');
const cp = require('node:child_process');
const path = require('node:path');
const files = [
'index.html','app.html','profile.css','profile.js','sumber-profil.html','assets/profile/hero.webp','assets/profile/ambient.mp3','styles.css','app.js','server.js','immersive.js','premium.js','v6.js','refined.js','refined.css',
'assets/brand-logo.webp','assets/photos/toba.webp','assets/photos/village.webp','assets/photos/house.webp','assets/photos/ulos.webp',
'assets/documentary/toba.mp4','assets/documentary/village.mp4','assets/documentary/house.mp4','assets/documentary/ulos.mp4'
];
let failures = 0;
for (const name of files) {
 const filename = path.join(__dirname,name);
 const size = fs.existsSync(filename) ? fs.statSync(filename).size : 0;
 console.log(`${size>0?'OK':'MISSING'} ${name}${size ? ` (${Math.round(size/1024)} KB)` : ''}`);
 if (!size) failures++;
}
for (const name of files.filter(f => f.endsWith('.js'))) {
 const result=cp.spawnSync(process.execPath,['--check',path.join(__dirname,name)],{encoding:'utf8'});
 if (result.status!==0){failures++;console.error('SYNTAX ERROR',name,result.stderr)}
}
const markup=fs.readFileSync(path.join(__dirname,'app.html'),'utf8');
for(const key of ['siteLang','themeSwitch','heroVideo','immMotionVideo','immSubtitles','generatePlan','map','menuBtn'])if(!markup.includes(`id="${key}"`)){failures++;console.error('MISSING ELEMENT',key)}
const profile=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
for(const key of ['href="app.html"','id="soundToggle"','id="filosofi"','id="pengalaman"'])if(!profile.includes(key)){failures++;console.error('PROFILE MISSING',key)}
console.log(failures ? `FAIL: ${failures} checks` : 'PASS: local files and JavaScript syntax validated.');
process.exit(failures?1:0);
