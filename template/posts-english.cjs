// Posts do projeto English with JP: um com mockup e um só de texto.
const fs = require("fs");
const path = require("path");
const { shell, foot } = require("./build.cjs");

const mockup = shell("Projeto entregue", `
  <h1>Um site que fala<br>a língua do <em>aluno</em><br><em>que quer falar.</em></h1>
  <div class="visual"><img src="mockup-english.webp" style="object-position:50% 40%" alt=""><div class="tag">Site institucional · <b>English with JP</b></div></div>
  ${foot("Metodologia, apresentação do professor, depoimentos e agendamento de aula — tudo pensado para o celular.")}`);

const texto = `<style>
  body { background: var(--navy); }
  .post { color: var(--ivory); padding-bottom: 72px; }
  .brand span { color: var(--ivory); }
  .mark { color: var(--ivory); }
  .statement { flex: 1; display: flex; flex-direction: column; justify-content: center; }
  .statement h1 { margin: 0; font-size: 92px; line-height: 1.02; color: var(--ivory); }
  .statement p { margin-top: 48px; max-width: 820px; font-size: 32px; font-weight: 300; line-height: 1.45; color: oklch(0.965 0.009 83 / .82); }
  .statement p b { color: var(--gold-soft); font-weight: 500; }
  .sign { display: flex; justify-content: space-between; align-items: flex-end; padding-top: 36px; border-top: 1.5px solid oklch(0.78 0.08 80 / .35); font-size: 15px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: var(--gold-soft); }
  .sign span { color: var(--ivory); font-size: 22px; font-weight: 400; letter-spacing: .08em; text-transform: none; }
</style>`;
const textoPost = shell("Para professores e escolas", `
  ${texto}
  <div class="statement">
    <h1>Seu método é<br>único. Seu site<br><em>precisa mostrar isso.</em></h1>
    <p>Quem procura aula de inglês quer saber <b>como você ensina</b>, quem você é e como agendar — antes da primeira conversa.</p>
  </div>
  <div class="sign">Aureti<span>@aure.tii</span></div>`);

fs.writeFileSync(path.join(__dirname, "post-english-mockup.html"), mockup);
fs.writeFileSync(path.join(__dirname, "post-english-texto.html"), textoPost);
console.log("ok");
