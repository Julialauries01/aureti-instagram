// Generates the week's Instagram posts (1080x1350) as HTML files, rendered to PNG by headless Chrome.
const fs = require("fs");
const path = require("path");

const ASSETS = "file:///C:/Users/Martha/Documents/Projetos/your-dream-website/src/assets/";

const css = `
  :root { --navy: oklch(0.175 0.052 257); --navy-soft: oklch(0.23 0.058 256); --gold: oklch(0.62 0.11 78); --gold-soft: oklch(0.78 0.08 80); --ivory: oklch(0.965 0.009 83); --muted: oklch(0.48 0.018 250); }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1080px; height: 1350px; overflow: hidden; }
  body { background: var(--ivory); color: var(--navy); font-family: "DM Sans", sans-serif; }
  .post { position: relative; width: 1080px; height: 1350px; display: flex; flex-direction: column; padding: 72px 80px 0; }
  .top { display: flex; justify-content: space-between; align-items: flex-start; }
  .brand { display: flex; flex-direction: column; line-height: 1; }
  .brand span { font-size: 46px; font-weight: 300; }
  .brand small { margin-top: 10px; color: var(--gold); font-size: 13px; font-weight: 600; letter-spacing: .22em; }
  .mark { display: flex; align-items: center; gap: 18px; margin-top: 10px; font-size: 15px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; }
  .mark::before { content: ""; width: 56px; height: 1.5px; background: var(--gold); }
  h1 { margin-top: 70px; font-weight: 600; font-size: 88px; line-height: 1; letter-spacing: -.035em; }
  h1 em { font-style: normal; color: var(--gold); }
  .visual { position: relative; margin: 52px -80px 0; height: 560px; overflow: hidden; }
  .visual img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 40%; display: block; }
  .tag { position: absolute; left: 80px; bottom: 28px; padding: 14px 22px; background: var(--ivory); font-size: 15px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; }
  .tag b { color: var(--gold); font-weight: 600; }
  .foot { flex: 1; margin: 0 -80px; padding: 44px 80px; background: var(--navy); color: var(--ivory); display: flex; justify-content: space-between; align-items: center; gap: 48px; }
  .foot p { max-width: 600px; font-size: 25px; font-weight: 300; line-height: 1.4; }
  .foot p b { font-weight: 500; color: var(--gold-soft); }
  .foot .handle { flex-shrink: 0; text-align: right; font-size: 15px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: var(--gold-soft); }
  .foot .handle span { display: block; margin-top: 10px; color: var(--ivory); font-weight: 400; letter-spacing: .08em; text-transform: none; font-size: 22px; }

  /* list layout (tips) */
  .list { margin: 44px 0 44px; display: grid; gap: 0; border-top: 1.5px solid oklch(0.62 0.11 78 / .35); }
  .list li { list-style: none; display: grid; grid-template-columns: 84px 1fr; align-items: baseline; padding: 19px 0; border-bottom: 1.5px solid oklch(0.62 0.11 78 / .35); }
  .list li span { color: var(--gold); font-size: 22px; font-weight: 600; letter-spacing: .1em; }
  .list li strong { display: block; font-size: 32px; font-weight: 600; letter-spacing: -.02em; }
  .list li small { display: block; margin-top: 4px; color: var(--muted); font-size: 21px; font-weight: 400; }

  /* steps layout (process) */
  .steps { margin: 60px -80px 0; padding: 84px 80px; row-gap: 64px; background: var(--navy-soft); color: var(--ivory); display: grid; grid-template-columns: 1fr 1fr; gap: 44px 56px; }
  .steps div span { color: var(--gold-soft); font-size: 20px; font-weight: 600; letter-spacing: .14em; }
  .steps div strong { display: block; margin-top: 16px; font-size: 40px; font-weight: 600; letter-spacing: -.02em; }
  .steps div small { display: block; margin-top: 12px; font-size: 23px; font-weight: 300; line-height: 1.4; color: oklch(0.965 0.009 83 / .8); }
  .steps + .foot { border-top: 1.5px solid oklch(0.62 0.11 78 / .4); }
`;

const shell = (mark, body) => `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=block" rel="stylesheet">
<style>${css}</style></head>
<body><div class="post">
  <div class="top"><div class="brand"><span>aureti</span><small>ENGENHARIA DE SOFTWARE</small></div><p class="mark">${mark}</p></div>
  ${body}
</div></body></html>`;

const foot = (text) => `<div class="foot"><p>${text}</p><div class="handle">Aureti<span>@aure.tii</span></div></div>`;

const visual = (img, tag, position = "50% 40%") =>
  `<div class="visual"><img src="${ASSETS}${img}" style="object-position:${position}" alt=""><div class="tag">${tag}</div></div>`;

const posts = {
  "post-02": shell("Dica", `
    <h1>5 sinais de que seu<br>site está <em>afastando</em><br><em>clientes.</em></h1>
    <ol class="list">
      <li><span>01</span><div><strong>Demora para carregar</strong><small>Cada segundo de espera é um visitante a menos.</small></div></li>
      <li><span>02</span><div><strong>Quebra no celular</strong><small>Texto pequeno, botões apertados, rolagem para o lado.</small></div></li>
      <li><span>03</span><div><strong>Contato difícil de achar</strong><small>WhatsApp e telefone precisam estar sempre à vista.</small></div></li>
      <li><span>04</span><div><strong>Informações desatualizadas</strong><small>Preços, serviços e endereço antigos geram desconfiança.</small></div></li>
      <li><span>05</span><div><strong>Sem cadeado de segurança</strong><small>O aviso de "não seguro" espanta antes do primeiro clique.</small></div></li>
    </ol>
    ${foot("Reconheceu algum? <b>Salve este post</b> e confira o seu site hoje mesmo.")}`),

  "post-03": shell("Modelo pronto", `
    <h1>Sua clínica com<br>um site <em>pronto</em><br><em>para atender.</em></h1>
    ${visual("modelo-smilewell.webp", "Modelo · <b>Clínica odontológica</b>")}
    ${foot("Modelo completo para dentistas, personalizado com a sua marca, fotos e serviços. <b>Chame no WhatsApp.</b>")}`),

  "post-04": shell("Bastidores", `
    <h1>Do briefing ao ar:<br>como nasce um <em>site</em><br><em>na Aureti.</em></h1>
    <div class="steps">
      <div><span>01</span><strong>Briefing</strong><small>Entendemos seu negócio, seus objetivos e seus desafios.</small></div>
      <div><span>02</span><strong>Planejamento</strong><small>Definimos estrutura, conteúdo e a tecnologia certa.</small></div>
      <div><span>03</span><strong>Desenvolvimento</strong><small>Design e código com foco em qualidade e performance.</small></div>
      <div><span>04</span><strong>Suporte</strong><small>Acompanhamos e evoluímos o produto depois da entrega.</small></div>
    </div>
    ${foot("Cada etapa com você por perto — <b>sem surpresas</b> no caminho.")}`),

  "post-05": shell("Projeto entregue", `
    <h1>Seu catálogo<br>inteiro na <em>palma</em><br><em>da mão.</em></h1>
    ${visual("escala-materiais-eletricos.webp", "Catálogo de produtos · <b>Escala Materiais Elétricos</b>", "50% 45%")}
    ${foot("Catálogo online com busca, categorias e produtos organizados — no computador, tablet ou celular.")}`),
};

const outDir = __dirname;
for (const [name, html] of Object.entries(posts)) fs.writeFileSync(path.join(outDir, name + ".html"), html);
console.log(Object.keys(posts).join(" "));
