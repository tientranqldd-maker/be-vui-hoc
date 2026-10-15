const VERSION='be-vui-hoc-v24-20261015';
const SHELL=['./','./index.html','./styles.css?v=24','./app.js?v=24','./scene.svg','./teacher.svg','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
const AUDIO=['welcome','vi0','vi1','vi2','vi3','vi4','vi5','vi6','viDone','a','cam','right','retry','traceDone','math0','math1','math2','math3','math4','math5','mathDone','bye'].map(k=>'./audio/'+k+'.mp3');
self.addEventListener('install',event=>{event.waitUntil(caches.open(VERSION).then(cache=>cache.addAll([...SHELL,...AUDIO])).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('be-vui-hoc-')&&k!==VERSION).map(k=>caches.delete(k)))),self.clients.claim()]));});
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
 event.respondWith((async()=>{
  const cached=await caches.match(request.url);
  const range=request.headers.get('range');
  if(range&&cached){
   // Some mobile browsers request MP3 segments (HTTP Range) even when working offline.
   const match=/^bytes=(\d+)-(\d*)$/.exec(range);
   if(match){
    const data=await cached.arrayBuffer(),start=Number(match[1]),end=match[2]?Math.min(Number(match[2]),data.byteLength-1):data.byteLength-1;
    if(start>=data.byteLength||end<start)return new Response(null,{status:416,headers:{'Content-Range':`bytes */${data.byteLength}`}});
    return new Response(data.slice(start,end+1),{status:206,headers:{'Content-Type':cached.headers.get('Content-Type')||'audio/mpeg','Content-Range':`bytes ${start}-${end}/${data.byteLength}`,'Accept-Ranges':'bytes','Content-Length':String(end-start+1)}});
   }
  }
  if(cached)return cached;
  try{
   const response=await fetch(request);
   if(response.ok&&!range){const copy=response.clone();caches.open(VERSION).then(cache=>cache.put(request.url,copy)).catch(()=>{});}
   return response;
  }catch{return new Response('Không có kết nối mạng. Hãy mở ứng dụng một lần khi có Internet.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})}
 })());
});
