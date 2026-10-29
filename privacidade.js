// página de privacidade: a seta de descer some quando a pessoa já rolou ou quando a página inteira cabe na tela; tocar nela desce quase uma tela
(function(){
  const faixa=document.querySelector('.descer');if(!faixa)return;
  const raiz=document.documentElement;
  const ver=()=>faixa.classList.toggle('some',scrollY>40||innerHeight+scrollY>=raiz.scrollHeight-8);
  addEventListener('scroll',ver,{passive:true});addEventListener('resize',ver);ver();
  faixa.querySelector('a').addEventListener('click',e=>{e.preventDefault();scrollBy({top:innerHeight*.8,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})});
})();
