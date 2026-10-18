// Post de texto (ponte entre o post da Karina e o Reels do site dela).
const fs = require("fs");
const path = require("path");
const { shell, foot } = require("./build.cjs");

const roomy = `<style>.list { margin: 52px 0; } .list li { padding: 26px 0; } .list li strong { font-size: 36px; } .list li small { font-size: 23px; margin-top: 6px; }</style>`;

const html = shell("Por dentro do projeto", `
  ${roomy}
  <h1>O que não pode<br>faltar no site de um<br><em>escritório de advocacia.</em></h1>
  <ol class="list">
    <li><span>01</span><div><strong>Áreas de atuação claras</strong><small>O cliente entende em segundos se você resolve o problema dele.</small></div></li>
    <li><span>02</span><div><strong>Quem está por trás</strong><small>Conhecer a advogada gera confiança antes do primeiro contato.</small></div></li>
    <li><span>03</span><div><strong>Conteúdo que orienta</strong><small>Artigos e notícias mostram conhecimento, dentro das regras da OAB.</small></div></li>
    <li><span>04</span><div><strong>Contato a um toque</strong><small>WhatsApp, telefone e e-mail visíveis em qualquer página.</small></div></li>
  </ol>
  ${foot("Amanhã à tarde: um tour pelo site da <b>Karina Mendes</b>, direto do celular.")}`);

fs.writeFileSync(path.join(__dirname, "post-karina-texto.html"), html);
console.log("ok");
