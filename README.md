# Meu Mês

App de organização financeira pessoal: salário, gastos do mês (de um mês só, de todo mês ou parcelados, com juros opcionais), para onde vai o dinheiro (gráfico por área e a divisão 50/30/20; saúde, educação, dívidas, projetos e assinaturas aparecem como área própria quando têm gasto, e o app sugere a área pelo nome do gasto), os meses (os que passaram, com o salário de cada um, e os próximos) e até 3 metas salvas com o progresso de cada uma.

**Abrir o app:** https://teste652.github.io/meu_mes/

## Como instalar no celular

- **Android (Chrome):** abra o link e toque em **Instalar** no aviso do topo. Se o aviso não aparecer, toque em **⋮** e escolha **Instalar app** ou **Adicionar à tela inicial**.
- **iPhone (Safari):** abra o link, toque em **Compartilhar** (se não aparecer, toque em **•••** antes) e escolha **Adicionar à Tela de Início**.
- **Computador (Chrome ou Edge):** clique em **Instalar** no aviso do topo ou no ícone de instalar na barra de endereço.
- Se o link abrir dentro do Instagram, do Facebook ou de outro app, abra no navegador primeiro.

Depois de instalado, o app abre direto da tela inicial e funciona sem internet. Se o aviso de instalar for fechado, ele volta pelo link **Instalar app** no rodapé.

## Seus dados

Quem abre pela primeira vez vê valores de exemplo e pode tocar em **Começar do zero**. Os dados de cada pessoa ficam salvos só no próprio celular, nada vai para a internet. No rodapé dá pra salvar uma cópia em arquivo e restaurar depois (ou em outro celular).

- O app não usa nenhum serviço de fora (nem fontes do Google): a internet só serve pra baixar o próprio app e as atualizações.
- A cópia em arquivo tem todos os valores e não tem senha: guarde num lugar só seu e não mande em grupo.
- No iPhone, use o app instalado na tela de início. Aberto só pelo Safari, o iPhone pode apagar os dados se o site passar uns 7 dias sem ser aberto.
- **Política de privacidade:** https://teste652.github.io/meu_mes/privacidade.html (link no rodapé do app). É o endereço pra colocar se um dia o app for pra Play Store ou App Store.

## Histórico dos meses

- O salário é de cada mês. Quando o mês vira, um aviso no topo pergunta se o salário continua o mesmo (**Continua**, **Mudar** ou fechar). Até a resposta, o mês novo fica com o salário do mês passado.
- Em **Meses**, a seta pra trás mostra os meses que passaram, desde o primeiro mês de uso do app, sempre 6 por vez. O lápis no salário do mês corrige o valor daquele mês sem mudar os outros.
- O que passou não muda: mudar o valor de um gasto de todo mês ou de uma meta vale do mês atual em diante, e apagar um gasto que já valia antes tira ele só do mês atual em diante. Um gasto lançado no próprio mês pode ser corrigido ou apagado de vez, e editar um parcelado corrige a compra inteira.
- O histórico guarda o ano passado e o atual. Na virada do ano, um aviso diz quais meses vão sair (**Entendi** ou **Salvar cópia**), e eles só saem no Entendi.
- No rodapé, **Apagar histórico** tira os meses que passaram depois de duas confirmações. Este mês e os gastos que continuam ficam.

## Segurança

- `index.html` tem uma política de segurança (Content-Security-Policy): só roda o código de `app.js` e `instalar.js`, e o app não consegue enviar nada para outro site. Script escrito direto no HTML não funciona.
- Ao abrir o app e ao restaurar uma cópia, cada gasto e cada meta passa por uma checagem de formato; o que não for do jeito que o app cria fica de fora.
- Quem pode mudar este repositório pode mudar o app de todo mundo: mantenha a verificação em duas etapas ligada na conta do GitHub.
