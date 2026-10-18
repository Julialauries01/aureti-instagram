// LinkedIn posts (1080x1350), same visual system as the Instagram posts.
const fs = require("fs");
const path = require("path");
const { shell, foot: baseFoot, visual } = require("./build.cjs");

// On LinkedIn the Instagram handle means nothing; sign with the WhatsApp instead.
const foot = (text) => baseFoot(text, "WhatsApp<span>(16) 99435-6011</span>");
const roomyList = `<style>.list { margin: 64px 0; } .list li { padding: 34px 0; } .list li strong { font-size: 40px; } .list li small { font-size: 24px; margin-top: 8px; }</style>`;

const posts = {
  "linkedin-01": shell("Case", `
    <h1>Do papel ao sistema:<br><em>gestão técnica</em><br><em>sem retrabalho.</em></h1>
    ${visual("sistema-hp.webp", "Sistema web e app · <b>Sistema HP</b>", "50% 50%")}
    ${foot("Clientes, equipamentos, protocolos e checklists de inspeção num só lugar, do escritório ao campo.")}`),

  "linkedin-02": shell("Para gestores", `
    ${roomyList}
    <h1>Site, sistema ou<br><em>automação</em>: por<br><em>onde começar?</em></h1>
    <ol class="list">
      <li><span>01</span><div><strong>Site</strong><small>Quando o cliente ainda não te encontra — ou não confia no que encontra.</small></div></li>
      <li><span>02</span><div><strong>Sistema</strong><small>Quando planilhas e papel já não dão conta da operação.</small></div></li>
      <li><span>03</span><div><strong>Automação</strong><small>Quando a equipe gasta horas em tarefas repetitivas.</small></div></li>
    </ol>
    ${foot("Não sabe qual é o seu caso? <b>Converse com a gente</b> — o diagnóstico é o primeiro passo.")}`),

  "linkedin-03": shell("Projeto entregue", `
    <h1>Seu site é o<br>primeiro <em>vendedor</em><br><em>da empresa.</em></h1>
    ${visual("azione-mkt.webp", "Site institucional · <b>Azione Marketing</b>")}
    ${foot("Serviços, trabalhos e contato organizados para transformar visitas em conversas.")}`),
};

for (const [name, html] of Object.entries(posts)) fs.writeFileSync(path.join(__dirname, name + ".html"), html);
console.log(Object.keys(posts).join(" "));
