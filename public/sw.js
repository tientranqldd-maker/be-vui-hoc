/* BÉ VUI HỌC V2.5 – offline PWA with reliable update behavior */
const CACHE='be-vui-hoc-shell-v25-20261016';
const SHELL=['./','./index.html','./styles.css?v=25','./app.js?v=25','./scene.svg','./teacher.svg','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
const VOICES='welcome vi0 vi1 vi2 vi3 vi4 vi5 vi6 viDone a cam right retry traceDone math0 math1 math2 math3 math4 math5 mathDone bye'.split(' ').map(x=>`./audio/${x}.mp3?v=25`);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll([...SHELL,...VOICES])).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('be-vui-hoc-')&&k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()])));
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);if(req.method!=='GET'||url.origin!==self.location.origin)return;
 event.respondWith((async()=>{
  const range=req.headers.get('Range');
  // JS/CSS/HTML: prioritize new deployment; on network loss still show saved lessons.
  const isDoc=/\.(html|js|css)$/.test(url.pathname)||url.pathname.endsWith('/');
  if(isDoc){try{const net=await fetch(req);if(net.ok){const c=await caches.open(CACHE);c.put(req.url,net.clone()).catch(()=>{});return net}}catch{}const old=await caches.match(req);if(old)return old;return new Response('Không có kết nối mạng.',{status:503})}
  const hit=await caches.match(req.url);
  // Handle byte-range MP3 requests for Chromium/mobile/PWA offline.
  if(range&&hit){const m=/^bytes=(\d+)-(\d*)$/.exec(range);if(m){const ab=await hit.arrayBuffer(),st=Number(m[1]),en=m[2]?Math.min(Number(m[2]),ab.byteLength-1):ab.byteLength-1;if(st>=ab.byteLength||en<st)return new Response(null,{status:416,headers:{'Content-Range':`bytes */${ab.byteLength}`}});return new Response(ab.slice(st,en+1),{status:206,headers:{'Content-Type':hit.headers.get('Content-Type')||'audio/mpeg','Content-Range':`bytes ${st}-${en}/${ab.byteLength}`,'Content-Length':String(en-st+1),'Accept-Ranges':'bytes'}})}}
  if(hit&&!range)return hit;
  try{const response=await fetch(req);if(response.ok&&!range){const c=await caches.open(CACHE);c.put(req.url,response.clone()).catch(()=>{})}return response}catch{return hit||new Response('Không có kết nối mạng.',{status:503})}
 })());
});
