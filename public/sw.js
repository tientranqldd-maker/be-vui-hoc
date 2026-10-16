const VERSION='be-vui-hoc-v241-20261016';
const SHELL=['./','./index.html','./styles.css?v=241','./app.js?v=241','./scene.svg','./teacher.svg','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./audio/test-tone.mp3?v=241'];
self.addEventListener('install',e=>e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('be-vui-hoc-')&&k!==VERSION).map(k=>caches.delete(k)))),self.clients.claim()])));
self.addEventListener('fetch',e=>{
 const req=e.request,u=new URL(req.url);
 if(req.method!=='GET'||u.origin!==self.location.origin)return;
 // Verified audio is network first and can be updated independently of the shell.
 const isVoice=u.pathname.includes('/audio-approved/');
 e.respondWith((async()=>{
  const cached=await caches.match(req,{ignoreSearch:false});
  if(isVoice){try{const network=await fetch(req);if(network.ok&&network.status===200){const copy=network.clone();caches.open(VERSION).then(c=>c.put(req,copy)).catch(()=>{});}return network;}catch{return cached||Response.error();}}
  if(cached)return cached;
  try{const network=await fetch(req);if(network.ok&&network.status===200&&!req.headers.has('range')){const copy=network.clone();caches.open(VERSION).then(c=>c.put(req,copy)).catch(()=>{});}return network;}
  catch{return new Response('Không có mạng. Hãy thử lại khi có Internet.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})}
 })());
});
