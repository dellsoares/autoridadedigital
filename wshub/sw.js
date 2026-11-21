/* WS Hub: versão de publicação unificada. Nada de HTML guardado indefinidamente. */
const OLD_PREFIXES=['ws-hub-','wshub-','ws_hub_'];
self.addEventListener('install',event=>{event.waitUntil(self.skipWaiting())});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{
 const keys=await caches.keys();await Promise.all(keys.filter(key=>OLD_PREFIXES.some(prefix=>key.toLowerCase().startsWith(prefix))).map(key=>caches.delete(key)));
 await self.clients.claim();
})())});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||event.request.mode!=='navigate')return;
 const url=new URL(event.request.url);if(url.origin!==self.location.origin||!url.pathname.startsWith('/wshub/'))return;
 event.respondWith(fetch(event.request,{cache:'no-store'}));
});
