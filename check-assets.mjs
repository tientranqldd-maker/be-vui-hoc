import fs from 'node:fs';
import path from 'node:path';
const base=path.resolve('public');
const required=['index.html','styles.css','app.js','scene.svg','teacher.svg','manifest.webmanifest','sw.js','audio/test-tone.mp3','audio-approved/manifest.json','icons/icon-192.png','icons/icon-512.png'];
let issues=0;
for(const filename of required){const f=path.join(base,filename);if(!fs.existsSync(f)||!fs.statSync(f).size){console.error('Missing or empty:',filename);issues++;}}
const manifest=JSON.parse(fs.readFileSync(path.join(base,'manifest.webmanifest'),'utf-8'));
if(!manifest.icons?.length){console.error('No PWA icons');issues++;}
const available=JSON.parse(fs.readFileSync(path.join(base,'audio-approved/manifest.json'),'utf-8'));
for(const [id,ok] of Object.entries(available))if(ok && !fs.existsSync(path.join(base,'audio-approved',`${id}.mp3`))){console.error('Manifest announces missing verified clip:',id);issues++}
console.log(`Checked ${required.length} mandatory web assets, errors: ${issues}`);
process.exitCode=issues?1:0;
