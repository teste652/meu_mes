// Meu Mês: guarda o app no celular pra abrir sem internet
const VERSAO='meu-mes-v31';
const ARQUIVOS=['./','index.html','privacidade.html','privacidade.js','app.js','instalar.js','fonts/fontes.css','fonts/bricolage-grotesque-latin.woff2','fonts/plus-jakarta-sans-latin.woff2','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSAO).then(c=>c.addAll(ARQUIVOS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSAO).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
// o que está guardado; abrir a página sem internet sempre cai no app
const guardado=req=>caches.match(req).then(r=>r||(req.mode==='navigate'?caches.match('index.html'):undefined));
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  // o app só usa arquivos do próprio site (até as fontes ficam aqui)
  if(new URL(req.url).origin!==location.origin)return;
  // tenta a internet primeiro (pra pegar atualizações), senão usa o que está guardado;
  // resposta de erro (site fora do ar, arquivo sumido) não toma o lugar da cópia boa
  e.respondWith(fetch(req).then(r=>{
    if(!r.ok)return guardado(req).then(h=>h||r);
    const c=r.clone();caches.open(VERSAO).then(x=>x.put(req,c));return r
  }).catch(()=>guardado(req).then(r=>r||Response.error())));
});
