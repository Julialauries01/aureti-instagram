// Posts do projeto AD Belém (camisas-com-estilo): um com mockup e um só de texto.
const fs = require("fs");
const path = require("path");
const { shell, foot } = require("./build.cjs");

const mockup = shell("Projeto entregue", `
  <h1>Camisetas oficiais<br>vendidas em <em>poucos</em><br><em>cliques.</em></h1>
  <div class="visual"><img src="mockup-camisas.webp" style="object-position:50% 45%" alt=""><div class="tag">Loja de camisetas · <b>AD Belém</b></div></div>
  ${foot("Catálogo por ministério, escolha de tamanho e cor, carrinho e atendimento pelo WhatsApp.")}`);

// Post só de texto: fundo azul-marinho inteiro, frase grande, sem imagem.
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
const textoPost = shell("Para igrejas e eventos", `
  ${texto}
  <div class="statement">
    <h1>A camiseta da<br>sua igreja merece<br>uma <em>vitrine à altura.</em></h1>
    <p>Em vez de lista no papel e pedido perdido no grupo, um site com <b>todas as camisetas</b>, tamanhos e cores — e o pedido chegando organizado.</p>
  </div>
  <div class="sign">Aureti<span>@aure.tii</span></div>`);

fs.writeFileSync(path.join(__dirname, "post-camisas-mockup.html"), mockup);
fs.writeFileSync(path.join(__dirname, "post-camisas-texto.html"), textoPost);
console.log("ok");
