if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
// convite pra instalar: Android e computador ganham o botão, iPhone o passo a passo, e dentro de outro app (Instagram etc.) a dica de abrir no navegador
(function(){
  const $=id=>document.getElementById(id), box=$('inst'), tx=$('instTx'), btn=$('instBtn'), lk=$('instLinkBox');
  if(matchMedia('(display-mode: standalone)').matches||navigator.standalone){
    // já instalado: some a cópia de segurança do rodapé e pede pro celular não apagar os dados do app quando faltar espaço
    document.documentElement.classList.add('instalado');
    if(navigator.storage&&navigator.storage.persist)navigator.storage.persist().catch(()=>{});
    return}
  const ua=navigator.userAgent, ios=/iphone|ipad|ipod/i.test(ua)||(/Macintosh/.test(ua)&&navigator.maxTouchPoints>1);
  const dentro=/Instagram|FBAN|FBAV|FB_IAB|Line\/|TikTok|musical_ly|LinkedInApp|Snapchat|; wv\)/i.test(ua);
  const ic=d=>`<span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${d}</svg></span>`;
  const TX={
    botao:'<b>Instale o Meu Mês</b> e abra como um app, até sem internet.',
    menu:'<b>Pra instalar:</b> toque em <b>⋮</b> no navegador e escolha <b>Instalar app</b> ou <b>Adicionar à tela inicial</b>.',
    ios:`<b>Instale o Meu Mês no ${/ipad|macintosh/i.test(ua)?'iPad':'iPhone'}</b><ol><li>Toque em ${ic('<path d="M12 3v12"/><path d="m8 7 4-4 4 4"/><path d="M7 10H5v11h14V10h-2"/>')} <b>Compartilhar</b> (se não aparecer, toque em <b>•••</b> antes)</li><li>Escolha ${ic('<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8v8M8 12h8"/>')} <b>Adicionar à Tela de Início</b></li></ol>`,
    fora:'<b>Pra instalar, abra no navegador:</b> toque em <b>⋮</b> ou <b>•••</b> e escolha <b>Abrir no navegador</b>.'};
  let ev=null, modo=null;
  const fechou=()=>{try{return localStorage.getItem('meu-mes-instalar')==='fechado'||localStorage.getItem('meu-mes-ios-dica')==='1'}catch(e){return false}};
  // o botão só existe enquanto o navegador deixa pedir; depois disso fica a explicação pelo menu
  function mostrar(m,abrir){modo=m;const k=m==='botao'&&!ev?'menu':m;
    tx.innerHTML=TX[k];btn.hidden=k!=='botao';box.classList.toggle('passos',k==='ios');lk.hidden=false;
    box.hidden=!abrir&&fechou()}
  if(dentro)mostrar('fora');else if(ios)mostrar('ios');else if(/Android/.test(ua)&&/Firefox/.test(ua))mostrar('menu');
  addEventListener('beforeinstallprompt',e=>{e.preventDefault();ev=e;if(!dentro)mostrar('botao')});
  btn.onclick=async()=>{if(!ev)return;const e=ev;ev=null;e.prompt();const r=await e.userChoice.catch(()=>null);if(r&&r.outcome==='accepted')box.hidden=lk.hidden=true;else{mostrar('botao');box.hidden=true}};
  $('instX').onclick=()=>{box.hidden=true;try{localStorage.setItem('meu-mes-instalar','fechado')}catch(e){}};
  $('instLink').onclick=()=>{try{localStorage.removeItem('meu-mes-instalar');localStorage.removeItem('meu-mes-ios-dica')}catch(e){}
    if(modo)mostrar(modo,true);scrollTo({top:0,behavior:'smooth'})};
  addEventListener('appinstalled',()=>{ev=null;box.hidden=lk.hidden=true});
})();
