import fs from 'node:fs';
import path from 'node:path';
const base=path.resolve('public');
const names=['welcome','vi0','vi1','vi2','vi3','vi4','vi5','vi6','viDone','a','cam','right','retry','traceDone','math0','math1','math2','math3','math4','math5','mathDone','bye'];
const required=['index.html','styles.css','app.js','scene.svg','teacher.svg','manifest.webmanifest','sw.js','icons/icon-192.png','icons/icon-512.png',...names.map(n=>`audio/${n}.mp3`)];
let issues=0;
for(const filename of required){const f=path.join(base,filename);if(!fs.existsSync(f)||!fs.statSync(f).size){console.error('Missing or empty:',filename);issues++;}}
const manifest=JSON.parse(fs.readFileSync(path.join(base,'manifest.webmanifest'),'utf-8'));
if(!manifest.icons?.length){console.error('No PWA icons');issues++;}
console.log(`Checked ${required.length} web assets, missing: ${issues}`);
process.exitCode=issues?1:0;
