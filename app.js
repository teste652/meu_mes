(function(){
const $=s=>document.querySelector(s);
const ICONS={
  contas:'<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',
  comida:'<path d="M5 3v8a3 3 0 0 0 6 0V3M8 3v18"/><path d="M17 3c-2 1-3 4-3 7h3v11"/>',
  transporte:'<rect x="4" y="4" width="16" height="13" rx="4"/><path d="M4 11h16M8 21l1-4M16 21l-1-4"/><circle cx="8.5" cy="14" r=".6"/><circle cx="15.5" cy="14" r=".6"/>',
  pessoal:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  compras:'<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  lazer:'<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5s1.2 2 3.5 2 3.5-2 3.5-2M9 9.5h.01M15 9.5h.01"/>',
  reserva:'<path d="M12 3v18M16 7H10a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6H7"/>',
  investir:'<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  saude:'<path d="M9.5 3.5h5v6h6v5h-6v6h-5v-6h-6v-5h6z"/>',
  educacao:'<path d="M2.5 9 12 4.5 21.5 9 12 13.5z"/><path d="M6.5 11v4.5c0 1.6 2.5 3 5.5 3s5.5-1.4 5.5-3V11"/><path d="M21.5 9v5"/>',
  dividas:'<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3 10h18M7 14.5h3"/>',
  projetos:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>',
  assinaturas:'<path d="M19.5 10.5A7.5 7.5 0 0 0 6 6.6L4.5 8"/><path d="M4.5 4v4h4"/><path d="M4.5 13.5A7.5 7.5 0 0 0 18 17.4l1.5-1.4"/><path d="M19.5 20v-4h-4"/>'
};
const svg=k=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${ICONS[k]}</svg>`;
// as áreas do dia a dia, cada uma num grupo: necessidades, vontades ou guardar e investir
const CATS=[
  {k:'contas',n:'Contas da casa',g:'n'},
  {k:'comida',n:'Comida',g:'n'},
  {k:'transporte',n:'Transporte',g:'n'},
  {k:'saude',n:'Saúde',g:'n'},
  {k:'educacao',n:'Educação',g:'n'},
  {k:'pessoal',n:'Pessoal',g:'n'},
  {k:'dividas',n:'Dívidas',g:'n'},
  {k:'compras',n:'Compras',g:'v'},
  {k:'lazer',n:'Lazer',g:'v'},
  {k:'assinaturas',n:'Assinaturas',g:'v'},
  {k:'projetos',n:'Projetos',g:'g'},
  {k:'reserva',n:'Guardar',g:'g'},
  {k:'investir',n:'Investimentos',g:'g'}
];
const CAT=Object.fromEntries(CATS.map(c=>[c.k,c]));
const GRUPOS=[{g:'n',n:'Necessidades'},{g:'v',n:'Vontades'},{g:'g',n:'Guardar/investir'}];
const color=k=>`var(--c-${k})`;
// o nome quase sempre já diz a área (sem acento e em minúsculas); vale a primeira que bater, então as mais específicas vêm antes
const PISTAS=[
  ['dividas',/emprestimo|divida|acordo|serasa|\bspc\b|limpa nome|negociacao|renegocia|cheque especial|consignado|credito pessoal|agiota|fatura atrasada|cartao atrasado|conta atrasada|boleto atrasado|boleto vencido|rotativo|parcelamento da fatura|juros|\bfies\b|credito educativo/],
  ['educacao',/facul|universidade|curso|cursinho|escola|colegio|creche|material escolar|papelaria|caderno|apostila|livr[oa]|ingles|espanhol|idioma|\baulas?\b|professor|reforco|vestibular|\benem\b|concurso|matricula|uniforme|bolsa de estudo|\bmba\b|pos-?gradua|\bpos\b|mestrado|doutorado|\btcc\b|duolingo|alura|udemy|coursera|auto ?escola|\bcnh\b|habilitacao|educacao/],
  ['saude',/saude|farmacia|drogaria|drogasil|\braia\b|pague menos|panvel|pacheco|remedio|medic|vitamina|suplemento|\bwhey\b|creatina|consulta|dentista|odonto|ortodont|aparelho dental|exame|laboratorio|hospital|clinica|pronto.?socorro|\bupa\b|psicolog|psiquiatr|terapia|terapeuta|nutricionista|fisio|fono|oculos|lentes? de contato|oftalmo|dermato|ginecolog|pediatra|cardiolog|vacina|unimed|hapvida|\bamil\b|sulamerica|notre ?dame|academia|smart ?fit|bluefit|crossfit|pilates|yoga|\bpersonal\b/],
  ['projetos',/projeto|negocio|empresa|\bmei\b|\bcnpj\b|contador|contabilidade|estoque|mercadoria|materia.?prima|insumo|fornecedor|empreend|startup|freela|loja (virtual|online)|\bsite\b|\bdominio|hospedagem do site|marketing|anuncio|trafego pago|impulsionamento|cartao de visita|embalage|maquininha|equipamento/],
  ['assinaturas',/assinatura|netflix|spotify|deezer|tidal|streaming|disney|star\+|prime video|amazon prime|\bhbo|\bmax\b|globoplay|paramount|crunchyroll|mubi|telecine|premiere|youtube|twitch|icloud|google one|dropbox|apple (music|tv|one|arcade)|chatgpt|openai|claude|gemini|copilot|canva|adobe|office 365|microsoft 365|game pass|xbox live|ps plus|playstation plus|nintendo online|kindle unlimited|audible|skeelo|patreon|tinder|clube/],
  ['reserva',/reserva|poupanca|guardar|guardado|emergencia|cofrinho|caixinha|porquinho|juntar|economia/],
  ['investir',/investimento|investir|aporte|tesouro|selic|\bcdb|\blci\b|\blca\b|\bcri\b|\bcra\b|debenture|\bacoes\b|\bacao\b|bolsa de valores|\bb3\b|\bfiis?\b|fundo imobiliario|fundo de investimento|\betf|bitcoin|\bbtc\b|cripto|ethereum|binance|previdencia|\bpgbl\b|\bvgbl\b|corretora|\bxp\b|nuinvest|renda fixa|renda variavel|dolar|\bouro\b/],
  ['compras',/mercado livre|shopee|shein|\btemu\b|aliexpress|amazon|magalu|magazine|americanas|casas bahia|\bc&a\b|renner|riachuelo|\bzara\b|centauro|netshoes|\bnike\b|adidas|roupa|camis[ae]|calca|bermuda|\bshorts?\b|vestido|blusa|jaqueta|casaco|moletom|cueca|calcinha|\bmeias?\b|tenis|sapato|sandalia|chinelo|\bbotas?\b|bolsa|mochila|relogio|\bjoias?\b|brinco|\banel\b|\bcolar\b|celular novo|iphone|samsung|xiaomi|motorola|notebook|computador|tablet|\bfones?\b|headphone|eletronic|televisao|smart tv|videogame|console|playstation|\bxbox\b|nintendo|geladeira|fogao|maquina de lavar|micro-?ondas|air ?fryer|liquidificador|\bsofa\b|\bcama\b|colchao|\bmoveis?\b|armario|decoracao|cortina|panela|utensilio|ferramenta|presente|brinquedo|\bloja|shopping|compra/],
  ['transporte',/onibus|uber(?! eats)|\b99\b(?! ?food)|\btaxi|metro\b|\btrem\b|\bvlt\b|\bbrt\b|bilhete unico|\bpasse\b|passagem(?! aerea)|recarga do bilhete|riocard|cartao de transporte|gasolina|etanol|diesel|\bgnv\b|combustivel|abastec|\bposto\b|estacionamento|zona azul|pedagio|sem parar|conectcar|veloe|ipva|licenciamento|multa|dpvat|seguro (do carro|auto|da moto)|mecanic|oficina|revisao|troca de oleo|pneu|borracharia|lava.?(jato|rapido)|lavagem|tapece|funilaria|guincho|(financiamento|parcela) (do carro|da moto)|consorcio|carro|\bmotos?\b|bicicleta|\bbike\b|patinete|transporte/],
  ['comida',/mercado|atacad|assai|carrefour|pao de acucar|hortifruti|sacolao|feira|acougue|padaria|\bpao\b|ifood|rappi|uber eats|99 ?food|ze delivery|delivery|restaurante|lanchonete|self.?service|rodizio|churrascaria|bandejao|marmita|quentinha|almoco|janta|\bcafe\b|cafe da manha|lanche|salgad|coxinha|pastel|esfiha|hamburguer|burger|mc ?donalds|\bbk\b|subway|pizza|sushi|acai|sorvete|doce|docinho|bolo|chocolate|bombom|biscoito|bolacha|refrigerante|\bcoca\b|suco|leite|\bovos?\b|carne|frango|peixe|arroz|feijao|fruta|verdura|legume|oleo de cozinha|azeite|agua mineral|agua com gas|galao|comida|alimentacao/],
  ['contas',/aluguel|condominio|\bluz\b|energia|enel|cemig|copel|\blight\b|celpe|coelba|cpfl|equatorial|neoenergia|\bagua\b|sabesp|copasa|cedae|sanepar|embasa|compesa|caesb|saneamento|esgoto|\bgas\b|botijao|comgas|internet|wi-?fi|fibra|banda larga|\bvivo\b|\bclaro\b|\btim\b|\boi\b|\bnet\b|telefone|celular|tv a cabo|\bsky\b|iptu|taxa de lixo|seguro (residencial|da casa)|faxina|diarista|empregada|lavanderia|encanador|eletricista|pedreiro|reforma|conserto|manutencao|(financiamento|prestacao|parcela) (da casa|do ap)|\bcasa\b|conta de/],
  ['pessoal',/cabelo|\bcorte\b|barbe|salao|manicure|pedicure|\bunhas?\b|sobrancelha|cilios|depila|estetica|maquiagem|batom|perfume|desodorante|shampoo|xampu|condicionador|sabonete|hidratante|creme|(protetor|filtro) solar|escova de dente|pasta de dente|creme dental|fio dental|absorvente|barbeador|gilete|lamina|skin ?care|cosmetic|boticario|\bnatura\b|\bavon\b|eudora|sephora|higiene|pessoal/],
  ['lazer',/\bsair\b|\bsaida\b|\brole\b|happy hour|\bbar\b|barzinho|boteco|balada|festa|\bshows?\b|cinema|teatro|museu|exposicao|parque|zoologico|praia|viage|viajar|passeio|hotel|pousada|airbnb|hospedagem|passagem aerea|\bvoos?\b|ingresso|futebol|estadio|pelada|\bjogos?\b|\bgames?\b|steam|karaoke|boliche|sinuca|cerveja|chopp?|drink|\bvinho|bebida|churrasco|aniversario|lazer|diversao|hobby/]
];
const areaPeloNome=t=>{const s=t.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();return (PISTAS.find(([,r])=>r.test(s))||[])[0]||null};


const brl=new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'});
const H=new Date(), Y0=H.getFullYear(), M0=H.getMonth();
const ym=(y,m)=>{const d=new Date(y,m,1);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')};
const ymParse=v=>{const [y,m]=String(v||'').split('-').map(Number);return y&&m?{y,m:m-1}:null};
const mesLongo=(y,m)=>new Date(y,m,1).toLocaleDateString('pt-BR',{month:'long',year:'numeric'});
const mesCurto=(y,m)=>new Date(y,m,1).toLocaleDateString('pt-BR',{month:'short',year:'2-digit'}).replace('.','').replace(' de ','/');
const taxa=v=>{const n=parseFloat(String(v||'').replace(',','.'));return isFinite(n)&&n>0?n/100:0};
const idxMes=(y,m)=>y*12+m;
const MES_ATUAL=ym(Y0,M0);
// Projetos conta como investir na barra do grupo, mas o lembrete de guardar só some com Guardar ou Investimentos
const guarda=c=>c==='reserva'||c==='investir';
/* ---------- metas ---------- */
// o plano: guarda 'mensal' todo mês a partir de 'inicio', com rendimento, até chegar no valor
function planoMeta(t){const r=+t.taxa||0;let b=+t.ja||0,n=0;while(b<t.valor&&n<600){b=b*(1+r)+t.mensal;n++}return {n,b,ok:b>=t.valor}}
// os meses que já passaram contam como guardados; o deste mês ainda não
function metaInfo(t){
  const p=planoMeta(t), i=ymParse(t.inicio)||{y:Y0,m:M0}, i0=idxMes(i.y,i.m), r=+t.taxa||0, passou=Math.max(0,idxMes(Y0,M0)-i0), fim=i0+p.n-1;
  let b=+t.ja||0;for(let k=0;k<Math.min(passou,p.n);k++)b=b*(1+r)+t.mensal;
  return {...p,tem:Math.min(b,t.valor),feita:p.ok&&passou>=p.n,fim:{y:Math.floor(fim/12),m:fim%12}}}
// o valor do mês entra nos gastos como Guardar (ou Investimentos, se rende) só até a meta ser batida
function itemDaMeta(t,id){const p=planoMeta(t),r=+t.taxa||0;
  return {id,nome:t.nome,valor:t.mensal,cat:r?'investir':'reserva',meta:t.id,inicio:t.inicio,parcelas:Math.max(1,p.n),...(r?{taxa:r}:{})}}
const EXEMPLO=()=>{const c=(id,nome,valor)=>({id,nome,valor,cat:'contas'}),
  meta={id:'t1',nome:'Reserva de emergência',valor:5000,mensal:300,ja:1200,inicio:MES_ATUAL};
  return {exemplo:true,salario:3500,metas:[meta],
  fixos:[c('e1','Aluguel',950),c('e2','Luz',160),c('e3','Água',85),c('e4','Internet',100),{id:'e5',nome:'Passe de ônibus',valor:220,cat:'transporte'},{id:'e6',nome:'Mercado',valor:600,cat:'comida'},{id:'e7',nome:'Tênis novo',valor:70,cat:'compras',parcelas:4,inicio:MES_ATUAL},itemDaMeta(meta,'e8')]}};
let S=EXEMPLO();
// gasto parcelado só conta nos meses das parcelas
function ativo(f,y,m){if(f.mes){const u=ymParse(f.mes);return !!u&&u.y===y&&u.m===m}
  if(!f.parcelas||!f.inicio)return true;const i=ymParse(f.inicio);if(!i)return true;const d=idxMes(y,m)-idxMes(i.y,i.m);return d>=0&&d<f.parcelas}
const fixosDoMes=(y,m)=>S.fixos.filter(f=>ativo(f,y,m));
// some da lista o que já ficou pra trás (continua salvo)
function acabou(f){const agora=idxMes(Y0,M0);if(f.mes){const u=ymParse(f.mes);return !!u&&idxMes(u.y,u.m)<agora}
  if(f.parcelas&&f.inicio){const i=ymParse(f.inicio);return !!i&&idxMes(i.y,i.m)+f.parcelas-1<agora}return false}
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// embaixo do nome: a área e, no parcelado, em que parcela está
function subInfo(x){let t=CAT[x.cat].n;
  if(x.parcelas&&x.inicio&&!x.meta){const i=ymParse(x.inicio),d=idxMes(Y0,M0)-idxMes(i.y,i.m);if(i)t+=d<0?` · a partir de ${mesCurto(i.y,i.m)}`:d<x.parcelas?` · ${d+1}/${esc(x.parcelas)}`:''}
  else if(x.mes){const u=ymParse(x.mes);if(u&&idxMes(u.y,u.m)!==idxMes(Y0,M0))t+=` · ${mesCurto(u.y,u.m)}`}
  return t}
const fmt=v=>brl.format(v||0);
const brl0=new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0});
const fmt0=v=>brl0.format(Math.round(v||0));
// sem o ,00 quando o valor é redondo
const fmtS=v=>Math.round(v*100)%100?fmt(v):fmt0(v);
// "2.800" e "1.234.567" usam ponto de milhar; "2.80" e "2,80" são centavos
const parse=s=>{s=String(s||'').replace(/[^\d,.-]/g,'');if(s.includes(','))s=s.replace(/\./g,'').replace(',','.');else if(/^\d{1,3}(\.\d{3})+$/.test(s))s=s.replace(/\./g,'');const n=parseFloat(s);return isFinite(n)&&n>0?Math.round(n*100)/100:0};
const uid=()=>Math.random().toString(36).slice(2,9);
const sum=a=>a.reduce((t,x)=>t+(+x.valor||0),0);

$('#mes').textContent=new Date().toLocaleDateString('pt-BR',{month:'long',year:'numeric'});

/* ---------- números animados ---------- */
const shown=new Map();
function tween(el,to){
  const from=shown.has(el)?shown.get(el):to; shown.set(el,to);
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(el.id==='livre'){el.innerHTML=money(to,el);caber(el)}
  if(from===to||reduce){el.innerHTML=money(to,el);return}
  const t0=performance.now(),d=700;
  (function step(t){const p=Math.min(1,(t-t0)/d),e=1-Math.pow(1-p,3);el.innerHTML=money(from+(to-from)*e,el);if(p<1&&shown.get(el)===to)requestAnimationFrame(step)})(t0);
}
function caber(el,min=18,passo=2){el.style.fontSize='';let f=parseFloat(getComputedStyle(el).fontSize);while(el.scrollWidth>el.clientWidth&&f>min){f-=passo;el.style.fontSize=f+'px'}}
// o Sai e o Sobra do detalhe do mês ficam lado a lado: a letra diminui até caber; só se nem assim couber, um desce
function caberDres(){const el=$('#cDet .dres');if(!el||!el.clientWidth)return;el.classList.remove('quebra');caber(el,10.5,.5);if(el.scrollWidth>el.clientWidth)el.classList.add('quebra')}
addEventListener('resize',()=>{caber($('#livre'));caberDres()});
// a fonte chega depois do primeiro desenho e muda a largura do texto
if(document.fonts){document.fonts.ready.then(caberDres);document.fonts.addEventListener('loadingdone',caberDres)}
function money(v,el){
  if(el.id!=='livre')return fmt(v);
  const s=fmt(Math.abs(v)).replace(/^R\$\s?/,'');
  return `<small>R$</small>${s}`;
}

/* ---------- quanto saiu em cada área neste mês ---------- */
function usadoNoMes(){const u=Object.fromEntries(CATS.map(c=>[c.k,0]));fixosDoMes(Y0,M0).forEach(f=>{u[f.cat]+=+f.valor});return u}

/* ---------- render ---------- */
function render(){
  const fx=sum(fixosDoMes(Y0,M0)), semSal=!S.salario, livre=S.salario-fx;
  $('#salTxt').textContent=semSal?'':fmt(S.salario);
  $('#livre').hidden=semSal;$('#addSal').hidden=!semSal;$('#salBtn').hidden=semSal;
  if(!semSal)tween($('#livre'),livre);
  $('#lFix').textContent=fmt(fx);
  $('#bFix').style.width=(fx/Math.max(S.salario,fx,1)*100)+'%';
  $('#hero').classList.toggle('neg',!semSal&&livre<0);
  $('#livreLbl').textContent=livre<0?'Passou do salário em':'Ainda pode gastar';$('#livreLbl').hidden=semSal;
  $('#exBox').hidden=!S.exemplo;
  $('.copia').classList.toggle('novo',S.exemplo||!(S.salario||S.fixos.length||S.metas.length));
  renderLembrete(livre);

  renderOnde(usadoNoMes());
  renderList(S.fixos.filter(x=>!acabou(x)));
  renderMetas();
}
// some quando o mês já tem algo pra guardar, quando não sobra nada ou quando a pessoa fecha
function renderLembrete(livre){
  const v=Math.floor(Math.min(S.salario*.1,livre)/10)*10, tem=fixosDoMes(Y0,M0).some(f=>guarda(f.cat));
  const ver=!S.exemplo&&S.salario>0&&!tem&&S.lembrete!==MES_ATUAL&&v>=10;
  $('#lembrete').hidden=!ver;if(ver){$('#lemSim').textContent=`Separar ${fmt0(v)} por mês`;$('#lemSim').dataset.v=v}}
// rosca com as maiores áreas do mês e, embaixo, quanto do salário vai pra cada grupo
function renderOnde(usado){
  const box=$('#onde'), tot=CATS.reduce((t,c)=>t+usado[c.k],0);
  if(!tot)box.innerHTML='<div class="empty">Seus gastos por área aparecem aqui</div>';
  else{
    let fat=CATS.filter(c=>usado[c.k]>0).map(c=>({n:c.n,v:usado[c.k],cor:color(c.k)})).sort((a,b)=>b.v-a.v);
    // mais de 5 fatias fica difícil de ler: as menores viram "Outros"
    if(fat.length>5)fat=[...fat.slice(0,4),{n:'Outros',v:fat.slice(4).reduce((t,f)=>t+f.v,0),cor:'var(--c-outros)'}];
    const r=56,C=2*Math.PI*r,gap=fat.length>1?2:0;let a=0;
    const arcos=fat.map(f=>{const l=f.v/tot*C,el=`<circle r="${r}" cx="66" cy="66" stroke="${f.cor}" stroke-dasharray="${Math.max(.5,l-gap)} ${C}" stroke-dashoffset="${-a}"/>`;a+=l;return el}).join('');
    box.innerHTML=`<div class="donut"><svg viewBox="0 0 132 132" aria-hidden="true"><circle r="${r}" cx="66" cy="66" stroke="var(--line)"/>${arcos}</svg><div class="c"><b>${fmt0(tot)}</b><span>no mês</span></div></div>
      <ul class="leg-onde">${fat.map(f=>`<li><i style="background:${f.cor}"></i><b>${f.n}</b><small>${Math.round(f.v/tot*100)}%</small></li>`).join('')}</ul>`;
  }
  const gr=$('#grupos');gr.hidden=!S.salario||!tot;
  if(gr.hidden)return;
  // uma barra por grupo: a barra inteira é o salário e enche até a porcentagem que o grupo leva, sem meta e sem valor.
  // Um gasto pequeno que não chega a 1% aparece como <1% (e um risquinho na barra), não 0%; passando do salário a barra fica cheia e em alerta
  gr.innerHTML=`<div class="lbl">Do salário</div>${GRUPOS.map(x=>{
    const real=CATS.filter(c=>c.g===x.g).reduce((t,c)=>t+usado[c.k],0), pc=real/S.salario*100;
    return `<div class="gb${pc>100?' over':''}"><div class="gl"><span>${x.n}</span><b class="num">${real>0&&pc<.5?'&lt;1':Math.round(pc)}%</b></div>
      <div class="gt"><span style="width:${real>0?Math.min(100,Math.max(pc,1.5)):0}%"></span></div></div>`}).join('')}`;
}
let verTodos=false;
// o gasto mais novo aparece primeiro
const ordem=arr=>arr.slice().reverse();
function renderList(arr){
  const box=$('#fixList'), todos=ordem(arr), lista=verTodos?todos:todos.slice(0,5), ids=new Set(lista.map(x=>x.id));
  // guarda onde cada linha estava pra ela deslizar até o lugar novo
  const antes=new Map([...box.querySelectorAll('.row')].map(r=>[r,r.getBoundingClientRect().top]));
  box.querySelectorAll('.row').forEach(r=>{if(!ids.has(r.dataset.id))r.remove()});
  box.querySelector('.empty')?.remove();
  const mais=$('#fixMais');mais.hidden=todos.length<=5;mais.textContent=verTodos?'Mostrar menos':`Ver todos (${todos.length})`;
  if(!lista.length){box.insertAdjacentHTML('beforeend','<div class="empty">Nenhum gasto ainda</div>');return}
  lista.forEach((x,i)=>{
    let r=box.querySelector(`[data-id="${x.id}"]`);
    if(!r){r=document.createElement('div');r.className='row';r.dataset.id=x.id}
    if(box.children[i]!==r)box.insertBefore(r,box.children[i]||null);
    r.classList.toggle('off',!ativo(x,Y0,M0));
    r.innerHTML=`<span class="dot ${x.cat}" style="background:${color(x.cat)}">${svg(x.cat)}</span>
      <span class="tx"><b></b><span>${subInfo(x)}</span></span>
      <span class="val num">−${fmt(x.valor)}</span>`;
    r.querySelector('b').textContent=x.nome;
  });
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  antes.forEach((top,r)=>{if(!r.isConnected)return;const d=top-r.getBoundingClientRect().top;
    if(Math.abs(d)>1)r.animate([{transform:`translateY(${d}px)`},{transform:'none'}],{duration:420,easing:'cubic-bezier(.22,1,.36,1)'})});
}
$('#fixMais').onclick=()=>{verTodos=!verTodos;render()};

/* ---------- salvar ---------- */
let saveTimer=null;
const SALVO='Seus dados ficam salvos só neste celular';
// se o celular não deixar salvar (memória cheia, por exemplo), avisa em vez de fingir que salvou
function persist(){
  clearTimeout(saveTimer);
  saveTimer=setTimeout(()=>{
    let ok=true;try{localStorage.setItem('meu-mes',JSON.stringify(S))}catch(e){ok=false}
    const el=$('#saveTxt');el.textContent=ok?SALVO:'Não deu pra salvar neste celular. Use Salvar cópia pra não perder nada';el.classList.toggle('erro',!ok);
    if(!ok)toast('Não deu pra salvar neste celular');
  },500);
}
// a primeira mudança de verdade apaga os exemplos, pra não misturar com os dados da pessoa
function change(fn,msg,desfazer){const ex=S.exemplo;if(ex)S={exemplo:false,salario:0,fixos:[],metas:[]};
  fn();S.exemplo=false;render();persist();if(ex)msg=msg?msg+' · exemplos apagados':'Exemplos apagados';if(msg)toast(msg,ex?null:desfazer)}
let migrou=false;
// o que vem do celular ou de um arquivo de cópia só entra no formato que o próprio app cria:
// texto vira texto, número vira número, área e mês precisam existir e o resto fica de fora
const ehArea=k=>CATS.some(c=>c.k===k);
const ehMes=v=>typeof v==='string'&&/^\d{4}-(0[1-9]|1[0-2])$/.test(v);
const ehId=v=>typeof v==='string'&&/^[\w-]{1,40}$/.test(v);
const num=v=>typeof v==='number'?v:typeof v==='string'&&v.trim()?Number(v):NaN;
const positivo=v=>{const n=num(v);return n>0&&isFinite(n)?n:0};
const texto=(v,padrao)=>typeof v==='string'?v.slice(0,100):padrao;
function gastoValido(x,ids){
  if(!x||typeof x!=='object'||!ehArea(x.cat)||!positivo(x.valor))return null;
  const id=ehId(x.id)&&!ids.has(x.id)?x.id:uid(), p=num(x.parcelas), dia=num(x.dia);ids.add(id);
  const g={id,nome:texto(x.nome,CAT[x.cat].n),valor:positivo(x.valor),cat:x.cat};
  if(ehMes(x.mes))g.mes=x.mes;
  else if(ehMes(x.inicio)&&Number.isInteger(p)&&p>=1&&p<=600){g.parcelas=p;g.inicio=x.inicio;if(x.vence===1)g.vence=1}
  if(positivo(x.taxa))g.taxa=positivo(x.taxa);
  if(ehId(x.meta))g.meta=x.meta;
  if(Number.isInteger(dia)&&dia>=1&&dia<=31){g.dia=dia;if(ehMes(x.pago))g.pago=x.pago}
  return g}
function metaValida(t){
  if(!t||typeof t!=='object'||!ehId(t.id)||!positivo(t.valor)||!positivo(t.mensal))return null;
  return {id:t.id,nome:texto(t.nome,'Minha meta'),valor:positivo(t.valor),mensal:positivo(t.mensal),ja:positivo(t.ja),
    ...(ehMes(t.inicio)?{inicio:t.inicio}:{}),...(positivo(t.taxa)?{taxa:positivo(t.taxa)}:{})}}
// versões antigas tinham simulações: as deste mês viram gastos deste mês, pra o saldo não mudar
function ler(d){if(!d||typeof d!=='object'||typeof d.salario!=='number'||!isFinite(d.salario)||!Array.isArray(d.fixos))return null;
  if(d.exemplo)return EXEMPLO();
  const ids=new Set(), fixos=d.fixos.map(x=>gastoValido(x,ids)).filter(Boolean), sims=Array.isArray(d.sims)?d.sims:[];
  sims.filter(x=>x&&(!x.mes||x.mes===MES_ATUAL)).forEach(x=>{const g=gastoValido({id:x.id,nome:x.nome,valor:x.valor,cat:x.cat,mes:MES_ATUAL},ids);if(g)fixos.push(g)});
  const vistas=new Set(), metas=(Array.isArray(d.metas)?d.metas:[]).map(metaValida).filter(t=>t&&!vistas.has(t.id)&&vistas.add(t.id)).slice(0,3);
  return {exemplo:false,salario:d.salario,fixos,metas,...(ehMes(d.lembrete)?{lembrete:d.lembrete}:{})}}
function load(d){const n=ler(d);if(!n)return false;S=n;migrou=!d.exemplo&&Array.isArray(d.sims)&&d.sims.length>0;return true}
try{load(JSON.parse(localStorage.getItem('meu-mes')||'null'))}catch(e){}
$('#saveTxt').textContent=SALVO;
render();
// o app aberto em dois lugares (navegador e app instalado): pega o que o outro salvou, pra um não apagar o que foi feito no outro
addEventListener('storage',e=>{if(e.key!=='meu-mes'||!e.newValue)return;try{if(load(JSON.parse(e.newValue)))render()}catch(_){}});
/* ---------- toast ---------- */
let tt;function toast(m,desfazer){const t=$('#toast');t.textContent=m;t.classList.toggle('acao',!!desfazer);
  if(desfazer){const b=document.createElement('button');b.type='button';b.textContent='Desfazer';b.onclick=()=>{clearTimeout(tt);t.classList.remove('on');desfazer()};t.append(b)}
  t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),desfazer?5000:1800)}
if(migrou)persist();

/* ---------- efeito de clique ---------- */
document.addEventListener('pointerdown',e=>{const b=e.target.closest('.press');if(!b)return;b.classList.add('down');const up=()=>{b.classList.remove('down');removeEventListener('pointerup',up);removeEventListener('pointercancel',up)};addEventListener('pointerup',up);addEventListener('pointercancel',up)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&pilha.length)closeSheet(pilha[pilha.length-1])});

/* ---------- sheets ---------- */
let catSel=null, catAuto=false, editando=null;
$('#gCats').innerHTML=CATS.map(c=>`<button type="button" class="press" data-cat="${c.k}" aria-pressed="false" style="--cc:${color(c.k)}"><i style="background:${color(c.k)}">${svg(c.k)}</i>${c.n}</button>`).join('');
// gasto: só um mês, todo mês (água, luz) ou parcelado (o valor é o total e vira parcelas nos meses certos)
// no parcelado, a primeira parcela pode vencer no mês seguinte ao do dinheiro que paga (gVence=1, salvo como vence:1)
let gPag='unico', gN=3, gVM='total', gVence=0;
const PAGS=['unico','mes','parc'];
function setPag(p){gPag=p;const seg=$('#gPagSeg');seg.querySelector('.pill').style.transform=`translateX(${PAGS.indexOf(p)*100}%)`;
  seg.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.pag===p));
  $('#gParcOpts').hidden=p==='mes';$('#gVMF').hidden=$('#gStepF').hidden=$('#gVenceF').hidden=p!=='parc';$('#gJurosF').hidden=p!=='parc'||gVM!=='total';
  // o mês é o do dinheiro que paga: a conta que vence no mês que vem, paga com o salário deste, fica neste
  $('#gMesLbl').textContent=p==='parc'?'Primeira parcela sai do dinheiro de':'Sai do dinheiro de';
  $('label[for="gValor"]').textContent=p!=='parc'?'Valor':gVM==='parc'?'Valor de cada parcela':'Valor total';
  const vm=$('#gVMSeg');vm.classList.toggle('right',gVM==='parc');vm.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.vm===gVM));
  gParc();corpos.forEach(sombra)}
// o meio das janelas rola: enquanto tem mais coisa embaixo, a borda de baixo some aos poucos
const corpos=[...document.querySelectorAll('#gForm .corpo')];
const sombra=c=>c.classList.toggle('mais',c.scrollTop+c.clientHeight<c.scrollHeight-4);
corpos.forEach(c=>c.addEventListener('scroll',()=>sombra(c),{passive:true}));
if(window.ResizeObserver){const ro=new ResizeObserver(es=>es.forEach(e=>sombra(e.target.closest('.corpo'))));corpos.forEach(c=>[c,...c.children].forEach(k=>ro.observe(k)))}
// com juros, a parcela segue a tabela price (a mesma conta das lojas e dos bancos)
const gTaxa=()=>gPag==='parc'&&gVM==='total'?taxa($('#gJuros').value):0;
const valorParcela=v=>{const j=gTaxa();return gVM==='parc'?v:Math.round((j?v*j/(1-Math.pow(1+j,-gN)):v/gN)*100)/100};
function itemDoForm(v){
  let item={id:editando?editando.id:uid(),nome:$('#gNome').value.trim()||(catSel?CAT[catSel].n:'Gasto'),valor:v,cat:catSel};
  const mesSel=$('#gInicio').value||MES_ATUAL;
  if(gPag==='parc')item={...item,valor:valorParcela(v),parcelas:gN,inicio:mesSel,...(gVence?{vence:1}:{})};
  else if(gPag==='unico')item.mes=mesSel;
  else if(editando&&editando.taxa)item.taxa=editando.taxa;
  if(editando&&editando.dia){item.dia=editando.dia;if(editando.pago)item.pago=editando.pago}
  return item}
const SETA='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
// os botões do vencimento dizem o mês: o mesmo do dinheiro ou o seguinte
const nomeMes=(y,m)=>{const d=new Date(y,m,1),n=d.toLocaleDateString('pt-BR',{month:'long'});return n[0].toUpperCase()+n.slice(1)+(d.getFullYear()!==Y0?' '+d.getFullYear():'')};
function syncVence(i){const seg=$('#gVenceSeg');seg.classList.toggle('right',gVence===1);
  seg.querySelectorAll('button').forEach(b=>{const k=+b.dataset.vence;b.textContent=nomeMes(i.y,i.m+k);b.setAttribute('aria-pressed',k===gVence)})}
function gParc(){
  $('#gNum').textContent=gN+'x';syncMesBtns();
  // o resumo mostra quando as parcelas vencem
  const v=parse($('#gValor').value), d=ymParse($('#gInicio').value)||{y:Y0,m:M0}, i={y:d.y,m:d.m+gVence}, f=new Date(i.y,i.m+gN-1,1);
  syncVence(d);
  // sem juros, o total é o valor que a pessoa pôs: a parcela arredonda o centavo, e isso não é juros
  const por=valorParcela(v), j=gTaxa(), tot=gVM==='total'&&!j?v:Math.round(por*gN*100)/100, juros=j?tot-v:0;
  $('#gVMLbl').innerHTML=`O valor de <b>${fmt(v)}</b> é`;
  $('#gParcRes').hidden=gPag!=='parc'||!v;
  // curto: a parcela grande; embaixo o total e de que mês a que mês, com uma seta
  $('#gParcRes').innerHTML=v?`<b>${gN}x de ${fmt(por)}</b>
    <span class="pr-l"><span>Total <b>${fmt(tot)}</b></span><span class="pr-m">${mesCurto(i.y,i.m)}${SETA}<span class="so-leitor"> a </span>${mesCurto(f.getFullYear(),f.getMonth())}</span></span>
    ${juros>0.004?`<small>${fmt(juros)} de juros</small>`:''}`:'';
  depois()}
// no lugar das simulações: enquanto digita, mostra quanto sobra no mês em que o gasto cai
function depois(){
  const v=parse($('#gValor').value), el=$('#gDepois');el.className='depois';
  if(!v||!S.salario||S.exemplo){el.textContent='';return}
  const item=itemDoForm(v), i=ymParse(item.mes||item.inicio)||{y:Y0,m:M0};
  const alvo=gPag==='mes'||idxMes(i.y,i.m)<idxMes(Y0,M0)?{y:Y0,m:M0}:i;
  const outros=S.fixos.filter(f=>(!editando||f.id!==editando.id)&&ativo(f,alvo.y,alvo.m));
  const sobra=S.salario-sum(outros)-(ativo(item,alvo.y,alvo.m)?item.valor:0);
  const quando=idxMes(alvo.y,alvo.m)===idxMes(Y0,M0)?'neste mês':`em ${mesLongo(alvo.y,alvo.m)}`;
  if(sobra<0){el.classList.add('neg');el.innerHTML=`Passa do salário em <b>${fmt(-sobra)}</b> ${quando}`}
  else el.innerHTML=`Sobram <b>${fmt(sobra)}</b> ${quando}`}
$('#gPagSeg').onclick=e=>{const b=e.target.closest('button');if(b)setPag(b.dataset.pag)};
$('#gMenos').onclick=()=>{gN=Math.max(2,gN-1);gParc()};
$('#gMais').onclick=()=>{gN=Math.min(120,gN+1);gParc()};
$('#gVMSeg').onclick=e=>{const b=e.target.closest('button');if(b){gVM=b.dataset.vm;setPag(gPag)}};
$('#gVenceSeg').onclick=e=>{const b=e.target.closest('button');if(b){gVence=+b.dataset.vence;gParc()}};
// segurar + ou − passa rápido (financiamento de 60x sem 60 toques)
function repetir(b){let t,i;const parar=()=>{clearTimeout(t);clearInterval(i)};
  b.addEventListener('pointerdown',()=>{parar();t=setTimeout(()=>{i=setInterval(()=>b.click(),60)},450)});
  ['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,parar));b.addEventListener('contextmenu',e=>e.preventDefault())}
['#gMenos','#gMais'].forEach(id=>repetir($(id)));
$('#gValor').addEventListener('input',gParc);
$('#gJuros').addEventListener('input',gParc);
function setCat(k,auto){catSel=k;catAuto=!!(k&&auto);$('#gCats').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.cat===k));
  const l=$('#gAreaLbl');if(k)l.classList.remove('pick');
  if(!l.classList.contains('pick'))l.textContent=catAuto?'Área sugerida':'Área'}
// enquanto a pessoa não toca numa área, ela acompanha o que vai sendo escrito
$('#gNome').addEventListener('input',e=>{if(catSel&&!catAuto)return;const k=areaPeloNome(e.target.value);if(k||catAuto)setCat(k,true)});
// no celular o Enter fecha o teclado e mostra as áreas; no computador o foco vai pra elas (tracejado, que não parece área escolhida)
const toque=()=>matchMedia('(pointer:coarse)').matches;
function verAreas(el){if(toque()){document.activeElement?.blur();el.scrollIntoView({block:'nearest',behavior:'smooth'})}else el.focus()}
function pedirArea(){const l=$('#gAreaLbl');l.classList.add('pick');l.textContent='Escolha a área';verAreas($('#gCats').querySelector('button'))}
// a área que o app achou pelo nome fica marcada, mas quem confirma é a pessoa: o Enter só mostra, o Próximo segue
function mostrarArea(){const b=$('#gCats [aria-pressed="true"]');if(!b)return pedirArea();
  b.classList.remove('realce');void b.offsetWidth;b.classList.add('realce');verAreas(b)}
// Enter: valor -> o que é -> área (a pessoa confere a sugerida) -> próximo; na segunda janela, o Enter adiciona
$('#gForm').addEventListener('keydown',e=>{
  if(e.key!=='Enter'||e.isComposing)return;
  const t=e.target;
  if(t.id==='gValor'){e.preventDefault();if(!parse(t.value)){toast('Coloque um valor');return}$('#gNome').focus();return}
  if(t.id==='gNome'){e.preventDefault();mostrarArea();return}
  const chip=t.closest&&t.closest('#gCats button');
  if(chip){e.preventDefault();setCat(chip.dataset.cat);proximo()}
});
$('#gCats').addEventListener('keydown',e=>{
  if(!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp'].includes(e.key))return;
  const bs=[...$('#gCats').querySelectorAll('button')],i=bs.indexOf(document.activeElement);if(i<0)return;
  e.preventDefault();bs[(i+(e.key==='ArrowRight'||e.key==='ArrowDown'?1:bs.length-1))%bs.length].focus()});
// janelas abertas, de baixo pra cima: só a de cima responde; as de baixo recuam e ficam apagadas
const pilha=[];
function arrumarPilha(){pilha.forEach((el,i)=>{const atras=i<pilha.length-1;el.style.zIndex=21+i;el.classList.toggle('atras',atras);el.inert=atras});
  $('#scrim').classList.toggle('on',pilha.length>0)}
function open(id,foco){const el=$(id);if(!pilha.includes(el))pilha.push(el);el.classList.add('on');arrumarPilha();historico();
  setTimeout(()=>(foco?$(foco):el.querySelector('input:not([type="hidden"])'))?.focus({preventScroll:true}),350)}
function fechar(el){const i=pilha.indexOf(el);if(i>=0)pilha.splice(i,1);el.classList.remove('on','atras');el.inert=false}
function closeSheet(el){fechar(el);arrumarPilha();document.activeElement?.blur();historico()}
function closeSheets(){[...pilha].forEach(fechar);arrumarPilha();document.activeElement?.blur();historico()}
// o teclado do celular cobre a parte de baixo da tela: a janela aberta sobe junto e fica inteira à vista em cima dele.
// No Android o navegador já encolhe a tela (interactive-widget, lá no HTML) e aqui a conta dá zero; no iPhone é esta conta que sobe a janela
const vv=window.visualViewport;let tecAntes='';
function teclado(){if(!vv||vv.scale>1.01)return;
  let baixo=Math.round(innerHeight-vv.height-vv.offsetTop);if(baixo<40)baixo=0;
  // só mexe na página quando algo mudou (o evento também chega com a página parada)
  const vis=Math.round(vv.height),k=baixo+'/'+vis;if(k===tecAntes)return;tecAntes=k;
  const raiz=document.documentElement;raiz.style.setProperty('--teclado',baixo+'px');raiz.style.setProperty('--visivel',vis+'px');raiz.classList.toggle('teclado',baixo>0);
  // depois que a janela sobe (e encolhe, se for alta), o campo em que está digitando continua à vista dentro dela
  const a=document.activeElement,box=a&&a.closest('.sheet.on .in');
  if(box)setTimeout(()=>{const r=a.getBoundingClientRect(),q=box.getBoundingClientRect();
    if(r.bottom>q.bottom-12)box.scrollTop+=r.bottom-q.bottom+12;else if(r.top<q.top+12)box.scrollTop-=q.top+12-r.top},300)}
if(vv){vv.addEventListener('resize',teclado);vv.addEventListener('scroll',teclado);teclado()}
// o voltar do celular fecha a janela de cima, e só com todas fechadas sai do app:
// cada janela aberta ganha uma entrada no histórico, que guarda quantas estavam abertas
let voltando=0;
const noHistorico=()=>history.state&&history.state.folhas||0;
function historico(){if(voltando)return;const n=noHistorico();
  try{if(pilha.length<n){voltando=setTimeout(()=>{voltando=0},1000);history.go(pilha.length-n)}
    else for(let k=n+1;k<=pilha.length;k++)history.pushState({folhas:k},'')}catch(e){clearTimeout(voltando);voltando=0}}
addEventListener('popstate',()=>{
  if(voltando){clearTimeout(voltando);voltando=0}
  else{const n=noHistorico();if(pilha.length>n){while(pilha.length>n)fechar(pilha[pilha.length-1]);arrumarPilha();document.activeElement?.blur()}}
  historico()});
// o celular fechou o app no fundo com uma janela aberta: ele volta sem janela
if(noHistorico())try{history.replaceState(null,'')}catch(e){}
document.addEventListener('click',e=>{const b=e.target.closest('[data-back]');if(b)closeSheet(b.closest('.sheet'))});
// tocar fora volta uma janela (não perde o que já foi preenchido na de baixo)
$('#scrim').onclick=()=>{if(pilha.length)closeSheet(pilha[pilha.length-1])};
$('#gCats').onclick=e=>{const b=e.target.closest('button');if(b)setCat(b.dataset.cat)};

// Próximo: com valor e área, abre por cima a janela de como paga
function proximo(){
  if(!parse($('#gValor').value)){$('#gValor').focus();toast('Coloque um valor');return}
  if(!catSel){pedirArea();toast('Escolha a área');return}
  setPag(gPag);open('#sheetPag','#gGo')}
$('#gProx').onclick=proximo;
// abre a janela vazia ou preenchida pra editar
function abrirGasto(id){const x=id?S.fixos.find(x=>x.id===id):null;
  editando=x?{id,taxa:x.taxa,dia:x.dia,pago:x.pago}:null;
  $('#gValor').value=x?String(x.valor).replace('.',','):'';$('#gNome').value=x?x.nome:'';$('#gJuros').value='';setCat(x?x.cat:null);
  gN=x&&x.parcelas||3;gVM=x&&x.parcelas?'parc':'total';gVence=x&&x.parcelas&&x.vence===1?1:0;
  gPag=!x?'unico':x.parcelas?'parc':x.mes?'unico':'mes';
  $('#gInicio').dataset.min=ym(Y0-2,M0);$('#gInicio').value=x?(x.mes||x.inicio||MES_ATUAL):MES_ATUAL;
  $('#gTitle').textContent=x?'Editar gasto':'Novo gasto';$('#gGo').textContent=x?'Salvar':'Adicionar';$('#gDel').hidden=!x;
  corpos.forEach(c=>c.scrollTop=0);
  setPag(gPag);open('#sheetGasto')}
document.addEventListener('click',e=>{
  if(e.target.closest('[data-add]')){abrirGasto();return}
  const row=e.target.closest('#fixList .row');if(!row)return;
  // o Guardar de uma meta se muda pela própria meta
  const x=S.fixos.find(f=>f.id===row.dataset.id);
  if(!(x&&x.meta&&abrirMeta(x.meta)))abrirGasto(row.dataset.id);
});
$('#gForm').onsubmit=e=>{e.preventDefault();const v=parse($('#gValor').value);
  if(!v||!catSel){closeSheet($('#sheetPag'));proximo();return}
  const ed=editando, item=itemDoForm(v);
  let msg='Gasto de todo mês adicionado';
  if(gPag==='parc')msg=`${gN}x de ${fmt(item.valor)} adicionado`;
  else if(gPag==='unico'){const u=ymParse(item.mes);msg=idxMes(u.y,u.m)===idxMes(Y0,M0)?'Gasto adicionado neste mês':`Gasto adicionado em ${mesCurto(u.y,u.m)}`}
  if(ed)msg='Gasto atualizado';
  closeSheets();setTimeout(()=>change(()=>{const i=ed?S.fixos.findIndex(x=>x.id===ed.id):-1;if(i>=0)S.fixos[i]=item;else S.fixos.push(item)},msg),250)};
// apagar fica dentro da janela de editar (menos risco de apagar sem querer) e pode ser desfeito
$('#gDel').onclick=()=>{const ed=editando, i=ed?S.fixos.findIndex(x=>x.id===ed.id):-1;if(i<0)return;const item=S.fixos[i];
  closeSheets();setTimeout(()=>change(()=>{S.fixos.splice(i,1)},'Gasto apagado',()=>change(()=>{S.fixos.splice(i,0,item)},'Voltou')),250)};
const openSal=()=>{$('#sValor').value=S.salario?String(S.salario).replace('.',','):'';open('#sheetSal')};
$('#salBtn').onclick=openSal;$('#addSal').onclick=openSal;
$('#sForm').onsubmit=e=>{e.preventDefault();const v=parse($('#sValor').value);closeSheets();setTimeout(()=>change(()=>{S.salario=v},'Salário atualizado'),250)};
$('#exClear').onclick=()=>{change(()=>{S={exemplo:false,salario:0,fixos:[],metas:[]}});openSal()};

function syncMesBtns(){document.querySelectorAll('[data-mes-for]').forEach(b=>{const v=ymParse($('#'+b.dataset.mesFor).value);b.querySelector('span').textContent=v?mesLongo(v.y,v.m):'Escolher mês'})}

/* ---------- seletor de mês ---------- */
const MESES=['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
let mesAlvo=null, mAno=Y0;
function desenharMeses(){
  const alvo=$('#'+mesAlvo), v=ymParse(alvo.value), min=ymParse(alvo.dataset.min||'');
  $('#mAno').textContent=mAno; $('#mPrev').disabled=!!min&&mAno<=min.y; $('#mNext').disabled=mAno>=Y0+10;
  $('#mGrid').innerHTML=MESES.map((n,m)=>{const off=min&&idxMes(mAno,m)<idxMes(min.y,min.m),sel=v&&v.y===mAno&&v.m===m,hoje=mAno===Y0&&m===M0;
    return `<button type="button" class="press${sel?' sel':''}${hoje?' hoje':''}" data-m="${m}" aria-pressed="${!!sel}"${off?' disabled':''}>${n}</button>`}).join('');
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-mes-for]');if(!b)return;mesAlvo=b.dataset.mesFor;const v=ymParse($('#'+mesAlvo).value);mAno=v?v.y:Y0;desenharMeses();open('#sheetMes')});
$('#mPrev').onclick=()=>{mAno--;desenharMeses()};
$('#mNext').onclick=()=>{mAno++;desenharMeses()};
$('#mGrid').onclick=e=>{const b=e.target.closest('button');if(!b||b.disabled)return;$('#'+mesAlvo).value=ym(mAno,+b.dataset.m);desenharMeses();setTimeout(()=>{closeSheet($('#sheetMes'));gParc()},160)};

/* ---------- próximos meses ---------- */
let cPag=0, calSel={y:Y0,m:M0};
function mesInfo(y,m){const itens=fixosDoMes(y,m), sai=sum(itens);return {itens,sai,sobra:S.salario-sai}}
/* ---------- metas salvas (até 3) ---------- */
const br=v=>String(v).replace('.',',');
function renderMetas(){
  const ms=S.metas||[], box=$('#metas'), nova=$('#metaNova');
  nova.hidden=ms.length>=3;nova.textContent=ms.length?'Nova meta':'Criar uma meta';box.hidden=!ms.length;
  if(!ms.length){box.innerHTML='';return}
  box.innerHTML=ms.map(t=>{const i=metaInfo(t), pc=i.feita?100:i.tem/t.valor*100;
    return `<button type="button" class="meta press soft${i.feita?' feita':''}" data-meta="${esc(t.id)}">
      <span class="mt"><b>${esc(t.nome)}</b><span class="num">${i.feita?'Meta batida':Math.floor(pc)+'%'}</span></span>
      <span class="mbar"><span style="width:${Math.max(pc,2)}%;background:${i.feita?'var(--hero)':color(t.taxa?'investir':'reserva')}"></span></span>
      <span class="ms"><span>${i.feita?`Você juntou ${fmt0(t.valor)}`:`${fmt0(i.tem)} de ${fmt0(t.valor)}`}</span><span>${i.feita?'':`até ${mesCurto(i.fim.y,i.fim.m)}`}</span></span>
    </button>`}).join('')}
$('#metas').onclick=e=>{const b=e.target.closest('[data-meta]');if(b)abrirMeta(b.dataset.meta)};
$('#metaNova').onclick=()=>abrirMeta();
let metaEd=null;
function abrirMeta(id){const t=id?(S.metas||[]).find(x=>x.id===id):null;if(id&&!t)return false;
  metaEd=t;
  $('#tNome').value=t?t.nome:'';$('#tValor').value=t?br(t.valor):'';$('#tMes').value=t?br(t.mensal):'';
  // editar recomeça a conta deste mês, com o que já foi guardado até aqui
  $('#tJa').value=t?br(Math.round(metaInfo(t).tem*100)/100):'';
  $('#tTaxa').value=t&&t.taxa?br(+(t.taxa*100).toFixed(2)):'';
  $('#tMes').placeholder=S.salario?br(Math.round(S.salario*.1)):'300';
  $('#tTitle').textContent=t?'Editar meta':'Nova meta';$('#tGo').textContent=t?'Salvar':'Criar meta';$('#tDel').hidden=!t;
  calcMetaForm();open('#sheetMeta');return true}
function lerMeta(){return {nome:$('#tNome').value.trim()||'Minha meta',valor:parse($('#tValor').value),mensal:parse($('#tMes').value),ja:parse($('#tJa').value),inicio:MES_ATUAL,...(taxa($('#tTaxa').value)?{taxa:taxa($('#tTaxa').value)}:{})}}
// enquanto digita: em que mês chega lá e quanto sobra no mês com esse valor guardado
function calcMetaForm(){
  const t=lerMeta(), box=$('#tRes');box.hidden=!t.valor;
  if(!t.valor){box.innerHTML='';return null}
  if(t.ja>=t.valor){box.innerHTML='<p>Você já tem esse valor guardado.</p>';return null}
  if(!t.mensal){box.innerHTML='<p>Coloque quanto vai guardar por mês.</p>';return null}
  const p=planoMeta(t), r=+t.taxa||0;
  if(!p.ok){box.innerHTML='<p>Assim levaria mais de 50 anos. Tente guardar mais por mês.</p>';return null}
  const k=idxMes(Y0,M0)+p.n-1, fy=Math.floor(k/12), fm=k%12, rend=p.b-t.ja-t.mensal*p.n;
  // o gráfico só aparece com rendimento: sem ele seria uma rampa reta que não diz nada
  let graf='';
  if(r){let b=t.ja;const serie=[];for(let n=1;n<=p.n;n++){b=b*(1+r)+t.mensal;serie.push({dep:t.ja+t.mensal*n,tot:b})}
    const passo=Math.ceil(serie.length/36), pts=serie.filter((_,i)=>(i+1)%passo===0||i===serie.length-1);
    graf=`<div class="chart" aria-hidden="true">${pts.map(x=>`<span style="height:${Math.max(x.tot/p.b*100,3)}%;background:linear-gradient(to top,var(--hero) ${x.dep/x.tot*100}%,var(--c-investir) ${x.dep/x.tot*100}%)"></span>`).join('')}</div>
    <div class="chart-x"><span>${mesCurto(Y0,M0)}</span><span>${mesCurto(fy,fm)}</span></div>
    <div class="leg2"><span><i style="background:var(--hero)"></i>O que você guardou</span><span><i style="background:var(--c-investir)"></i>Rendimento</span></div>`}
  // o mês em destaque e, embaixo, um andar pra cada coisa: quantos meses, quanto por mês, o rendimento (se tiver)
  // e, no fim, quanto sobra (ou passa do salário) neste mês com a meta
  const andar=(nome,v,cls)=>`<div${cls?` class="${cls}"`:''}><span>${nome}</span><b class="num">${v}</b></div>`;
  let sobra='';
  if(S.salario&&!S.exemplo){const v=S.salario-sum(fixosDoMes(Y0,M0).filter(f=>!metaEd||f.meta!==metaEd.id))-t.mensal;
    sobra=andar(v<0?'Passa do salário':'Sobra no mês',fmtS(Math.abs(v)),v<0?'fim neg':'fim')}
  box.innerHTML=`<div class="lbl">Você chega lá em</div>
    <div class="big2">${mesLongo(fy,fm)}</div>
    <div class="andares">${andar('Guardando por',`${p.n} ${p.n===1?'mês':'meses'}`)}${andar('Valor por mês',fmtS(t.mensal))}${rend>=1?andar('Rendimento',fmtS(rend)):''}${sobra}</div>
    ${graf}`;
  return t}
['tNome','tValor','tMes','tJa','tTaxa'].forEach(id=>$('#'+id).addEventListener('input',calcMetaForm));
$('#tForm').addEventListener('keydown',e=>{if(e.key!=='Enter'||e.isComposing)return;const ord=['tNome','tValor','tMes','tJa','tTaxa'],i=ord.indexOf(e.target.id);
  if(i>=0&&i<ord.length-1){e.preventDefault();$('#'+ord[i+1]).focus()}});
$('#tForm').onsubmit=e=>{e.preventDefault();const t=calcMetaForm();
  if(!t){const v=lerMeta();toast(!v.valor?'Coloque quanto quer juntar':v.ja>=v.valor?'Você já tem esse valor':!v.mensal?'Coloque quanto vai guardar por mês':'Guarde mais por mês');return}
  const ed=metaEd;t.id=ed?ed.id:uid();
  closeSheets();setTimeout(()=>change(()=>{
    S.metas=S.metas||[];const i=ed?S.metas.findIndex(x=>x.id===ed.id):-1;if(i>=0)S.metas[i]=t;else S.metas.push(t);
    const j=S.fixos.findIndex(f=>f.meta===t.id), it=itemDaMeta(t,j>=0?S.fixos[j].id:uid());if(j>=0)S.fixos[j]=it;else S.fixos.push(it);
  },ed?'Meta atualizada':`Meta criada: ${fmt0(t.mensal)} por mês nos gastos`),250)};
$('#tDel').onclick=()=>{const ed=metaEd;if(!ed)return;
  const i=S.metas.findIndex(x=>x.id===ed.id), j=S.fixos.findIndex(f=>f.meta===ed.id), t=S.metas[i], it=S.fixos[j];
  closeSheets();setTimeout(()=>change(()=>{S.metas=S.metas.filter(x=>x.id!==ed.id);S.fixos=S.fixos.filter(f=>f.meta!==ed.id)},'Meta apagada',
    ()=>change(()=>{if(t)S.metas.splice(i,0,t);if(it)S.fixos.splice(j,0,it)},'Voltou')),250)};

/* ---------- lembrete de guardar ---------- */
$('#lemSim').onclick=e=>{const v=+e.currentTarget.dataset.v, id=uid();if(!v)return;
  change(()=>{S.fixos.push({id,nome:'Guardar',valor:v,cat:'reserva'})},`${fmt0(v)} por mês pra guardar`,()=>change(()=>{S.fixos=S.fixos.filter(f=>f.id!==id)},'Voltou'))};
$('#lemX').onclick=()=>change(()=>{S.lembrete=MES_ATUAL});

/* ---------- cópia de segurança ---------- */
// no celular abre o compartilhar (Drive, WhatsApp, Arquivos); no computador baixa o arquivo
let baixar=async(nome,txt)=>{
  const f=new File([txt],nome,{type:'application/json'});
  if(matchMedia('(pointer:coarse)').matches&&navigator.canShare&&navigator.canShare({files:[f]})){
    try{await navigator.share({files:[f],title:'Cópia do Meu Mês'});return true}catch(e){if(e.name==='AbortError')return false}}
  const a=document.createElement('a');a.href=URL.createObjectURL(f);a.download=nome;document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href),4000);return true};
$('#bkSalvar').onclick=async()=>{
  const d=new Date(), dia=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const txt=JSON.stringify({app:'meu-mes',versao:2,salvoEm:d.toISOString(),dados:S},null,1);
  try{if(await baixar(`meu-mes-${dia}.json`,txt))toast('Cópia salva')}catch(e){toast('Não deu pra salvar a cópia')}};
$('#bkAbrir').onclick=()=>$('#bkArq').click();
// restaurar troca tudo pelo que está na cópia, mas dá pra desfazer
$('#bkArq').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;
  // uma cópia de verdade tem poucos KB: arquivo grande demais nem é aberto
  if(f.size>5e6){toast('Esse arquivo não é uma cópia do Meu Mês');return}
  let d=null;try{d=JSON.parse(await f.text())}catch(_){}
  const novo=d&&ler(d.app==='meu-mes'?d.dados:d);
  if(!novo){toast('Esse arquivo não é uma cópia do Meu Mês');return}
  const antes=S;change(()=>{S=novo},'Cópia restaurada',()=>change(()=>{S=antes},'Voltou'))};

// parcela que termina neste mês (o Guardar das metas fica de fora: lá o que conta é bater a meta)
const ultimaParcela=(f,y,m)=>{if(f.meta||!f.parcelas||!f.inicio)return false;const i=ymParse(f.inicio);return !!i&&idxMes(i.y,i.m)+f.parcelas-1===idxMes(y,m)};
const metasNoMes=(y,m)=>(S.metas||[]).filter(t=>{const i=metaInfo(t);return i.ok&&!i.feita&&i.fim.y===y&&i.fim.m===m});
function renderCal(){
  // 6 meses a partir do mês atual, de página em página: quanto sai em cada um e o que acaba nele
  const ini=idxMes(Y0,M0)+cPag*6, z=ini+5;
  $('#cAno').textContent=`${MESES[ini%12]}/${String(Math.floor(ini/12)).slice(2)} – ${MESES[z%12]}/${String(Math.floor(z/12)).slice(2)}`;
  $('#cPrev').disabled=cPag<=0;$('#cNext').disabled=cPag>=19;
  const meses=Array.from({length:6},(_,i)=>{const k=ini+i,y=Math.floor(k/12),m=k%12;return {k,y,m,...mesInfo(y,m)}});
  $('#cGrid').innerHTML=meses.map(x=>{const sel=calSel.y===x.y&&calSel.m===x.m,hoje=x.k===idxMes(Y0,M0),over=S.salario>0&&x.sobra<0;
    const fins=x.itens.filter(f=>ultimaParcela(f,x.y,x.m)).length, meta=metasNoMes(x.y,x.m).length;
    // no cartão fica só um pontinho; o que acaba aparece embaixo, ao tocar no mês
    const pontos=(fins?'<i></i>':'')+(meta?'<i class="cmeta"></i>':''), nota=(fins?`, ${fins>1?`${fins} parcelas acabam`:'última parcela'}`:'')+(meta?', bate a meta':'');
    return `<button type="button" class="press${sel?' sel':''}${hoje?' hoje':''}" data-k="${x.k}" aria-pressed="${sel}" aria-label="${mesLongo(x.y,x.m)}: sai ${fmt(x.sai)}${nota}">
      <span class="cm">${MESES[x.m]}${x.y!==Y0?`<small>${String(x.y).slice(2)}</small>`:''}</span>
      <span class="cv num${over?' over':''}"><small>R$</small>${fmt0(x.sai).replace(/^R\$\s?/,'')}</span>
      ${S.salario?`<span class="cmt"><span class="${over?'over':''}" style="width:${Math.min(100,x.sai/S.salario*100)}%"></span></span>`:''}${pontos?`<span class="cdots" aria-hidden="true">${pontos}</span>`:''}</button>`}).join('');
  const {y,m}=calSel, inf=mesInfo(y,m), atual=y===Y0&&m===M0;
  // em todo mês, também no atual, aparece um por um o que é só daquele mês
  // (parcela, meta, gasto de um mês só) e o que é de todo mês vira uma linha
  // aqui tudo é o que sai: o valor vai sem o sinal de menos e sem o ,00
  const linha=(ic,cor,nome,sub,v,lista)=>`<div><i style="background:${cor}">${ic}</i><span class="t"><span>${nome}</span><small${lista?' class="lista"':''}>${sub}</small></span><b>${fmtS(v)}</b></div>`;
  const todoMes=x=>!x.mes&&!(x.parcelas&&x.inicio), todo=inf.itens.filter(todoMes);
  const linhas=[...inf.itens.filter(x=>!todoMes(x)).map(x=>{let sub='Só neste mês';
      if(x.meta)sub='Meta';
      else if(x.parcelas){const i=ymParse(x.inicio),n=idxMes(y,m)-idxMes(i.y,i.m)+1;sub=n===x.parcelas?'Última parcela':`Parcela ${n} de ${esc(x.parcelas)}`}
      return linha(svg(x.cat),color(x.cat),esc(x.nome),sub,x.valor)}),
    ...(todo.length?[linha(svg('assinaturas'),'var(--c-outros)','Todo mês',esc(todo.map(x=>x.nome).join(', ')),sum(todo),1)]:[])].join('')||'<p>Nenhum gasto neste mês.</p>';
  // o resumo do mês numa linha só: quanto sai e quanto sobra (ou falta), e a barra embaixo
  const neg=S.salario>0&&inf.sobra<0, topoM=Math.max(S.salario,inf.sai,1);
  $('#cDet').innerHTML=`<div class="lbl">${mesLongo(y,m)}${atual?' · este mês':''}</div>
    <div class="dres${neg?' neg':''}"><span>Sai <b>${fmt0(inf.sai)}</b></span><span class="sb">${neg?'Falta':'Sobra'} <b>${S.salario?fmt0(Math.abs(inf.sobra)):'—'}</b></span></div>
    <div class="split-bar" aria-hidden="true"><span class="d-gasto" style="width:${Math.min(inf.sai,S.salario||inf.sai)/topoM*100}%"></span>${neg?`<span class="d-falta" style="width:${(inf.sai-S.salario)/topoM*100}%"></span>`:`<span class="d-sobra" style="width:${Math.max(0,inf.sobra)/topoM*100}%"></span>`}</div>
    <div class="mini">${linhas}</div>
    ${metasNoMes(y,m).map(t=>`<p><b>Bate a meta “${esc(t.nome)}”</b></p>`).join('')}`;
  caberDres();
}
$('#cGrid').onclick=e=>{const b=e.target.closest('button');if(!b)return;const k=+b.dataset.k;calSel={y:Math.floor(k/12),m:k%12};renderCal()};
$('#cPrev').onclick=()=>{cPag--;renderCal()};
$('#cNext').onclick=()=>{cPag++;renderCal()};
const renderBase=render; render=function(){renderBase();renderCal()};
renderCal();
})();
