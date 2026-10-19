// Generates Instagram Story arts (1080x1920) in the Aureti style.
// Text stays inside the safe area (250px top, 340px bottom) so Instagram's UI never covers it.
// Interactive stories leave a dashed slot where the native poll / question sticker goes.
const fs = require("fs");
const path = require("path");

const ASSETS = "file:///C:/Users/Martha/Documents/Projetos/your-dream-website/src/assets/";

const css = `
  :root { --navy: oklch(0.175 0.052 257); --navy-soft: oklch(0.23 0.058 256); --gold: oklch(0.62 0.11 78); --gold-soft: oklch(0.78 0.08 80); --ivory: oklch(0.965 0.009 83); --muted: oklch(0.48 0.018 250); }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1080px; height: 1920px; overflow: hidden; }
  body { font-family: "DM Sans", sans-serif; }
  .story { position: relative; width: 1080px; height: 1920px; display: flex; flex-direction: column; padding: 250px 90px 340px; }
  .story.dark { background: var(--navy); color: var(--ivory); }
  .story.light { background: var(--ivory); color: var(--navy); }
  .top { display: flex; justify-content: space-between; align-items: flex-start; }
  .brand { display: flex; flex-direction: column; line-height: 1; }
  .brand span { font-size: 50px; font-weight: 300; }
  .brand small { margin-top: 10px; color: var(--gold); font-size: 14px; font-weight: 600; letter-spacing: .22em; }
  .dark .brand small { color: var(--gold-soft); }
  .mark { display: flex; align-items: center; gap: 18px; margin-top: 12px; font-size: 17px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; }
  .mark::before { content: ""; width: 56px; height: 1.5px; background: var(--gold); }
  .body { flex: 1; display: flex; flex-direction: column; justify-content: center; }
  h1 { font-weight: 600; font-size: 104px; line-height: 1; letter-spacing: -.035em; }
  h1 em { font-style: normal; color: var(--gold); }
  .dark h1 em { color: var(--gold-soft); }
  .lead { margin-top: 48px; font-size: 38px; font-weight: 300; line-height: 1.4; }
  .dark .lead { color: oklch(0.965 0.009 83 / .82); }
  .lead b { font-weight: 500; color: var(--gold); }
  .dark .lead b { color: var(--gold-soft); }
  .big { font-size: 300px; font-weight: 600; line-height: .9; letter-spacing: -.05em; color: var(--gold-soft); }
  .big small { font-size: 120px; letter-spacing: -.03em; }
  .source { margin-top: 28px; font-size: 20px; font-weight: 500; letter-spacing: .16em; text-transform: uppercase; color: oklch(0.965 0.009 83 / .5); }
  .slot { margin-top: 64px; height: 300px; border: 2px dashed oklch(0.62 0.11 78 / .55); border-radius: 28px; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; color: oklch(0.62 0.11 78 / .7); }
  .dark .slot { border-color: oklch(0.78 0.08 80 / .45); color: oklch(0.78 0.08 80 / .6); }
  .shot { margin: 56px -90px 0; height: 560px; overflow: hidden; position: relative; }
  .shot img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .shot .tag { position: absolute; left: 90px; bottom: 28px; padding: 14px 22px; background: var(--ivory); color: var(--navy); font-size: 17px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; }
  .shot .tag b { color: var(--gold); font-weight: 600; }
  .rows { margin-top: 56px; border-top: 1.5px solid oklch(0.62 0.11 78 / .35); }
  .rows div { display: grid; grid-template-columns: 90px 1fr; align-items: baseline; padding: 30px 0; border-bottom: 1.5px solid oklch(0.62 0.11 78 / .35); }
  .rows span { color: var(--gold); font-size: 26px; font-weight: 600; letter-spacing: .1em; }
  .dark .rows span { color: var(--gold-soft); }
  .rows strong { font-size: 42px; font-weight: 600; letter-spacing: -.02em; line-height: 1.15; }
  .rows small { display: block; margin-top: 8px; font-size: 28px; font-weight: 300; line-height: 1.35; opacity: .75; }
  .vs { margin-top: 56px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .vs div { padding: 40px 36px; border-radius: 24px; font-size: 30px; font-weight: 300; line-height: 1.45; }
  .vs div:first-child { background: oklch(0.965 0.009 83 / .06); color: oklch(0.965 0.009 83 / .6); }
  .vs div:last-child { background: var(--gold-soft); color: var(--navy); font-weight: 400; }
  .vs b { display: block; margin-bottom: 18px; font-size: 20px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; }
  .sign { display: flex; justify-content: space-between; align-items: flex-end; padding-top: 36px; border-top: 1.5px solid oklch(0.62 0.11 78 / .35); font-size: 17px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: var(--gold); }
  .dark .sign { border-color: oklch(0.78 0.08 80 / .35); color: var(--gold-soft); }
  .sign span { color: inherit; font-size: 26px; font-weight: 400; letter-spacing: .08em; text-transform: none; }
  .dark .sign span { color: var(--ivory); }
  .light .sign span { color: var(--navy); }
`;

const story = (theme, mark, body, sign = "Aureti<span>@aure.tii</span>") => `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=block" rel="stylesheet">
<style>${css}</style></head>
<body><div class="story ${theme}">
  <div class="top"><div class="brand"><span>aureti</span><small>ENGENHARIA DE SOFTWARE</small></div><p class="mark">${mark}</p></div>
  <div class="body">${body}</div>
  <div class="sign">${sign}</div>
</div></body></html>`;

// Stories for Tuesday 20/10/2026: 09h tip, 12h poll, 18h question box
const stories = {
  "story-2026-10-20-1-dica": story("dark", "Você sabia?", `
    <p class="big">53<small>%</small></p>
    <h1 style="margin-top:40px;font-size:76px">dos visitantes <em>desistem</em><br>de um site que leva<br>mais de 3 segundos<br>para abrir no celular.</h1>
    <p class="source">Fonte: Google</p>
    <p class="lead">Velocidade não é detalhe. <b>É cliente</b> entrando ou indo embora.</p>`),

  "story-2026-10-20-2-enquete": story("light", "Enquete", `
    <h1>O seu negócio<br>já tem um <em>site</em><br><em>próprio?</em></h1>
    <p class="lead">Instagram é ótimo, mas é <b>alugado</b>. O site é o endereço que é só seu.</p>
    <div class="slot">Enquete aqui</div>`),

  "story-2026-10-20-3-caixinha": story("dark", "Caixinha de perguntas", `
    <h1>Qual a sua maior<br><em>dúvida</em> sobre<br>ter um site?</h1>
    <p class="lead">Preço, prazo, domínio, manutenção... <b>Pergunte aqui</b> que a gente responde nos stories.</p>
    <div class="slot">Caixinha aqui</div>`),

  // Monday 19/10: context for today's church shop posts (problem -> solution -> question)
  "story-2026-10-19-1-antes": story("dark", "Como era", `
    <h1>Lista no papel.<br>Pedido no grupo.<br><em>Tamanho anotado</em><br><em>errado.</em></h1>
    <p class="lead">Quem já organizou as camisetas da igreja conhece essa história. <b>Vem ver como ficou</b> na AD Belém.</p>`),

  "story-2026-10-19-2-depois": story("light", "Projeto entregue", `
    <h1>Agora é tudo<br><em>pelo site.</em></h1>
    <div class="shot"><img src="file:///C:/Users/Martha/Documents/Projetos/aureti-instagram/template/mockup-camisas.webp" style="object-position:50% 50%" alt=""><div class="tag">Loja de camisetas · <b>AD Belém</b></div></div>
    <p class="lead">Catálogo por ministério, tamanho e cor, carrinho e pedido direto no <b>WhatsApp</b>.</p>`),

  "story-2026-10-19-3-enquete": story("dark", "Enquete", `
    <h1>Na sua igreja,<br>como são feitos os<br><em>pedidos de camiseta?</em></h1>
    <p class="lead">Conta pra gente. Se for na <b>lista ou no grupo</b>, a gente tem uma ideia melhor.</p>
    <div class="slot">Enquete aqui</div>`),

  // Wednesday 21/10: ready-made clinic template week theme
  "story-2026-10-21-1-dica": story("light", "Dica rápida", `
    <h1>O que todo site<br>de <em>clínica</em><br><em>precisa ter.</em></h1>
    <div class="rows">
      <div><span>01</span><p><strong>Agendamento pelo WhatsApp</strong><small>Um toque e o paciente já está conversando com você.</small></p></div>
      <div><span>02</span><p><strong>Fotos reais do consultório</strong><small>Confiança começa antes da primeira consulta.</small></p></div>
      <div><span>03</span><p><strong>Convênios e especialidades</strong><small>A resposta que o paciente procura, sem precisar perguntar.</small></p></div>
    </div>`),

  "story-2026-10-21-2-enquete": story("dark", "Isso ou aquilo", `
    <h1>Na hora de marcar<br>uma consulta, você<br><em>prefere...</em></h1>
    <p class="lead">Chamar no <b>WhatsApp</b> ou escolher o horário direto no <b>site</b>?</p>
    <div class="slot">Enquete aqui</div>`),

  "story-2026-10-21-3-modelo": story("dark", "Modelo pronto", `
    <h1>Sua clínica com<br>um site <em>pronto</em><br><em>em poucos dias.</em></h1>
    <div class="shot"><img src="${ASSETS}modelo-smilewell.webp" style="object-position:50% 30%" alt=""><div class="tag">Modelo · <b>Clínica odontológica</b></div></div>
    <p class="lead">Personalizado com a sua marca, fotos e serviços. Envie <b>MODELO</b> no direct.</p>`),

  // Thursday 22/10: behind the scenes
  "story-2026-10-22-1-bastidores": story("dark", "Bastidores", `
    <h1>Antes de abrir o<br>código, a gente<br><em>pergunta.</em></h1>
    <div class="rows">
      <div><span>01</span><p><strong>Quem é o seu cliente?</strong></p></div>
      <div><span>02</span><p><strong>O que ele precisa encontrar primeiro?</strong></p></div>
      <div><span>03</span><p><strong>Como ele vai falar com você?</strong></p></div>
      <div><span>04</span><p><strong>O que faz você diferente?</strong></p></div>
    </div>
    <p class="lead">É assim que começa cada <b>briefing</b> na Aureti.</p>`),

  "story-2026-10-22-2-enquete": story("light", "Enquete", `
    <h1>Um bom site<br>para você é...</h1>
    <p class="lead"><b>Simples e direto</b>, com o essencial, ou <b>completo</b>, com tudo explicado em detalhes?</p>
    <div class="slot">Enquete aqui</div>`),

  "story-2026-10-22-3-caixinha": story("dark", "Caixinha de perguntas", `
    <h1>O que você mais<br>gostaria que o seu<br>site <em>fizesse por você?</em></h1>
    <p class="lead">Vender, agendar, mostrar portfólio, tirar dúvidas... <b>Conta pra gente</b> aqui embaixo.</p>
    <div class="slot">Caixinha aqui</div>`),

  // Friday 23/10: product catalog (Escala)
  "story-2026-10-23-1-dica": story("dark", "Comparativo", `
    <h1>Catálogo em PDF<br>ou catálogo <em>no site?</em></h1>
    <div class="vs">
      <div><b>PDF no WhatsApp</b>Arquivo pesado, preço desatualizado, cliente perde no meio das conversas.</div>
      <div><b>Catálogo no site</b>Busca, categorias, sempre atualizado e aberto 24 horas.</div>
    </div>`),

  "story-2026-10-23-2-quiz": story("light", "Quiz", `
    <h1>Quantos produtos<br>cabem num catálogo<br><em>online?</em></h1>
    <p class="lead">Responda e veja se acertou.</p>
    <div class="slot">Quiz aqui</div>`),

  "story-2026-10-23-3-projeto": story("dark", "Projeto entregue", `
    <h1>Seu cliente procura,<br>encontra e <em>chama.</em></h1>
    <div class="shot"><img src="${ASSETS}escala-materiais-eletricos.webp" style="object-position:50% 45%" alt=""><div class="tag">Catálogo · <b>Escala Materiais Elétricos</b></div></div>
    <p class="lead">Quer o seu catálogo assim? <b>Peça um orçamento</b> no direct.</p>`),
};

module.exports = { story };

if (require.main === module) {
  const outDir = __dirname;
  for (const [name, html] of Object.entries(stories)) fs.writeFileSync(path.join(outDir, name + ".html"), html);
  console.log(Object.keys(stories).join(" "));
}
