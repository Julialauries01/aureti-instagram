// Feed posts for 21/10 – 14/11/2026 that didn't exist yet: tips, text posts, mockups and Reels covers.
// Writes HTML into template/mes/, then render with: node render-png.cjs template/mes/*.html
const fs = require("fs");
const path = require("path");
const { shell, foot, visual } = require("./build.cjs");

const MOTION = "file:///C:/Users/Martha/Documents/Projetos/aureti-instagram/template/motion/telas/";
const ASSETS = "file:///C:/Users/Martha/Documents/Projetos/your-dream-website/src/assets/";

// colour themes for text posts and covers
const TH = {
  navy: ["var(--navy)", "var(--ivory)", "var(--gold-soft)", "oklch(0.965 0.009 83 / .82)"],
  ivory: ["var(--ivory)", "var(--navy)", "var(--gold)", "var(--muted)"],
  gold: ["var(--gold-soft)", "var(--navy)", "oklch(0.98 0.01 83)", "oklch(0.175 0.052 257 / .75)"],
};
const themed = t => {
  const [bg, fg, ac, mu] = TH[t];
  return `<style>body{background:${bg}} .post{color:${fg}; padding-bottom:72px} .brand span,.mark{color:${fg}}
    .st h1,.mo h1{color:${fg}} .st h1 em,.mo h1 em,.big,.q,.sign{color:${ac}} .st p,.mo p{color:${mu}} .st p b{color:${ac}}
    .sign span{color:${fg}} .sign{border-color:${ac}}</style>`;
};
const textCss = `<style>
  .st { flex: 1; display: flex; flex-direction: column; justify-content: center; }
  .st h1 { margin: 0; font-size: 92px; line-height: 1.02; }
  .st p { margin-top: 48px; max-width: 820px; font-size: 32px; font-weight: 300; line-height: 1.45; }
  .st p b { font-weight: 500; }
  .big { font-size: 260px; font-weight: 600; line-height: .9; letter-spacing: -.05em; margin-bottom: 30px; }
  .q { font-size: 200px; line-height: .6; font-weight: 600; }
  .sign { display: flex; justify-content: space-between; align-items: flex-end; padding-top: 36px; border-top: 1.5px solid; font-size: 15px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; }
  .sign span { font-size: 22px; font-weight: 400; letter-spacing: .08em; text-transform: none; }
</style>`;
const statement = (mark, h1, p, t = "navy") => shell(mark, `${themed(t)}${textCss}
  <div class="st">${h1}${p ? `<p>${p}</p>` : ""}</div>
  <div class="sign">Aureti<span>@aure.tii</span></div>`);

// Reels cover (4:5 so the grid shows it well): big type + easing curve + optional image
const cover = (title, sub, img, t = "navy") => shell("Reels", `${themed(t)}
  <style>
    .mo { position: relative; flex: 1; display: flex; flex-direction: column; justify-content: flex-end; }
    .mo svg { position: absolute; left: -10px; top: 40px; width: 940px; height: 420px; }
    .mo img { position: absolute; right: -80px; top: 110px; width: 560px; height: 600px; object-fit: cover; object-position: top; border-radius: 40px; box-shadow: 0 30px 80px rgba(0,0,0,.35); transform: rotate(-6deg); }
    .mo h1 { position: relative; margin: 0; font-size: 96px; line-height: 1; }
    .mo p { position: relative; margin-top: 28px; font-size: 30px; font-weight: 300; }
  </style>
  <div class="mo">
    <svg viewBox="0 0 940 420"><path d="M20 380 C 420 380, 520 40, 920 40" fill="none" stroke="oklch(0.62 0.11 78)" stroke-width="5"/>
      <circle cx="20" cy="380" r="12" fill="oklch(0.62 0.11 78)"/><circle cx="920" cy="40" r="12" fill="oklch(0.62 0.11 78)"/></svg>
    ${img ? `<img src="${img}" alt="">` : ""}
    <h1>${title}</h1><p>${sub}</p>
  </div>`);

// device mockup made in CSS: laptop with the desktop screenshot + phone with the mobile one
const devices = (desk, mob, tag) => `
  <style>
    .dv { position: relative; margin: 52px -80px 0; height: 560px; background: linear-gradient(160deg, oklch(0.93 0.015 80), oklch(0.86 0.02 75)); overflow: hidden; }
    .lap { position: absolute; left: 130px; top: 70px; width: 760px; }
    .lap .s { width: 760px; height: 440px; border: 16px solid #15171c; border-bottom-width: 22px; border-radius: 22px 22px 6px 6px; overflow: hidden; background: #000; }
    .lap .s img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
    .lap .b { width: 900px; height: 22px; margin-left: -70px; background: linear-gradient(#c9ccd2, #9da1a8); border-radius: 0 0 26px 26px; }
    .mob { position: absolute; right: 120px; top: 150px; width: 200px; height: 410px; border: 10px solid #15171c; border-radius: 34px; overflow: hidden; background: #000; box-shadow: 0 30px 60px rgba(0,0,0,.35); }
    .mob img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
    .dv .tag { position: absolute; left: 80px; bottom: 28px; padding: 14px 22px; background: var(--ivory); font-size: 15px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; }
    .dv .tag b { color: var(--gold); font-weight: 600; }
  </style>
  <div class="dv"><div class="lap"><div class="s"><img src="${desk}"></div><div class="b"></div></div>
  <div class="mob"><img src="${mob}"></div><div class="tag">${tag}</div></div>`;

const posts = {
  "2026-10-22-dica-velocidade": statement("Dica",
    `<div class="big">53%</div><h1>dos visitantes desistem<br>de um site que leva<br>mais de <em>3 segundos.</em></h1>`,
    "Dado do Google para acessos pelo celular. Velocidade não é detalhe: <b>é cliente entrando ou indo embora.</b>"),
  "2026-10-24-site-x-instagram": statement("Presença digital",
    `<h1>Instagram é vitrine.<br>Site é <em>endereço</em><br><em>próprio.</em></h1>`,
    "O perfil depende das regras de outra empresa. O seu site é seu: aparece no Google, <b>passa confiança e trabalha 24 horas.</b>"),
  "2026-11-03-azione-mockup": shell("Projeto entregue", `
    <h1>Uma agência<br>com presença <em>à altura</em><br><em>da marca.</em></h1>
    ${devices(MOTION + "azione-desk-0.jpg", MOTION + "azione-mob-0.jpg", "Site institucional · <b>Azione Marketing</b>")}
    ${foot("Serviços, portfólio com filtros por cliente e contato direto, no computador e no celular.")}`),
  "2026-11-06-sistema-hp-mockup": shell("Projeto entregue", `
    <h1>Serviços técnicos<br>organizados na <em>palma</em><br><em>da mão.</em></h1>
    ${visual("sistema-hp.webp", "Aplicativo mobile · <b>Sistema HP</b>", "50% 45%")}
    ${foot("UX/UI e desenvolvimento de um app de gestão de serviços técnicos, no celular e no tablet.")}`),
  "2026-11-07-azione-texto": statement("Por dentro do projeto",
    `<h1>Um portfólio que<br><em>trabalha</em> enquanto<br>a agência cria.</h1>`,
    "No site da Azione, cada cliente tem seu filtro, os serviços ficam claros e o contato está a um toque. <b>Agência de Marketing Azione.</b>"),
  "2026-11-10-dica-dominio": statement("Dica",
    `<h1>Seu negócio com<br><em>domínio próprio</em><br>passa mais confiança.</h1>`,
    "suaempresa.com.br no cartão, no Instagram e no e-mail. <b>É o endereço que ninguém tira de você.</b>", "ivory"),
  "2026-11-13-depoimento": statement("Depoimento",
    `<div class="q">“</div><h1 style="font-size:66px">[Cole aqui o depoimento<br>de um cliente real,<br>com até 3 linhas.]</h1>`,
    "[Nome do cliente] · [Projeto]", "gold"),
  "2026-11-04-modelo-mentoria-texto": statement("Modelo pronto",
    `<h1>Mentoras e coaches:<br>seu site <em>já está</em><br><em>pronto.</em></h1>`,
    "Apresentação, serviços, depoimentos e contato no modelo Soraya Nunes. <b>Personalizado com a sua marca e suas fotos.</b>"),
  "2026-11-11-modelo-imobiliaria-texto": statement("Modelo pronto",
    `<h1 style="font-size:80px">Corretor, seus imóveis<br>merecem uma página<br>que <em>gera contato.</em></h1>`,
    "Landing page pronta para imobiliária e consultoria em compra e venda. <b>Comente MODELO e veja a página.</b>"),
  "2026-11-04-modelo-imobiliaria-mockup": shell("Modelo pronto", `
    <h1>Imóveis em destaque,<br>contato a <em>um toque.</em></h1>
    ${devices(MOTION + "m-imob-desk-0.jpg", MOTION + "m-imob-0.jpg", "Landing page · <b>Imobiliária</b>")}
    ${foot("Imóveis em destaque, serviços, depoimentos e WhatsApp em uma única página. <b>Personalizada com a sua marca.</b>")}`),
  "2026-11-13-modelo-x-medida": statement("Qual é o seu caso?",
    `<h1>Modelo pronto<br>ou site <em>sob medida?</em></h1>`,
    "Modelo: rápido e econômico, com a sua marca. Sob medida: do seu jeito, do zero. <b>A gente te ajuda a escolher.</b>", "ivory"),
  // Reels covers
  "2026-10-23-escala-motion-capa": cover(`Seu cliente procura,<br>encontra e <em>chama.</em>`, "Catálogo online · Escala Materiais Elétricos", MOTION + "escala-0.jpg", "ivory"),
  "2026-10-26-karina-motion-capa": cover(`Do rascunho<br>ao <em>site no ar.</em>`, "Karina Mendes Advocacia", MOTION + "karina-0.jpg", "ivory"),
  "2026-10-28-english-tour-capa": cover(`Um tour pelo<br>site do <em>English</em><br><em>with JP.</em>`, "Site para professor de inglês", ASSETS + "../../../aureti-instagram/template/post-english-mockup.png", "navy"),
  "2026-10-31-aureti-motion-capa": cover(`Olá, somos<br>a <em>Aureti.</em>`, "Sites, lojas, sistemas e apps", null, "navy"),
  "2026-11-05-azione-tour-capa": cover(`Um tour pelo<br>site da <em>Azione.</em>`, "Agência de Marketing Azione", MOTION + "azione-desk-0.jpg", "navy"),
  "2026-11-09-sistema-hp-motion-capa": cover(`Apresentando<br>o <em>Sistema HP.</em>`, "Aplicativo mobile", ASSETS + "sistema-hp.webp", "navy"),
  "2026-11-12-clinica-motion-capa": cover(`Seu site pronto<br>em <em>poucos dias.</em>`, "Modelo · Clínica odontológica", MOTION + "clinica-0.jpg", "ivory"),
  "2026-11-14-modelos-motion-capa": cover(`5 modelos<br>prontos. <em>Escolha</em><br><em>o seu.</em>`, "Advocacia, saúde, mentoria e imobiliária", MOTION + "m-soraya-0.jpg", "navy"),
};

if (require.main === module) {
  const out = path.join(__dirname, "mes");
  fs.mkdirSync(out, { recursive: true });
  for (const [name, html] of Object.entries(posts)) fs.writeFileSync(path.join(out, name + ".html"), html);
  console.log(Object.keys(posts).length, "posts");
}
