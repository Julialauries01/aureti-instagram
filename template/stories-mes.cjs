// Stories 20/10 – 14/11/2026: 3 per day (9h content, 12h interactive, 18h sales CTA), Mon–Sat.
// 12h stories leave a dashed slot for the native poll / quiz / question sticker, so they are
// scheduled with autoPublish:false (Metricool sends a phone notification to post by hand).
// Writes HTML into template/stories-mes/ and exports the plan for planejamento.cjs.
const fs = require("fs");
const path = require("path");
const { story } = require("./stories.cjs");

const T = "file:///C:/Users/Martha/Documents/Projetos/aureti-instagram/template/motion/telas/";
const A = "file:///C:/Users/Martha/Documents/Projetos/your-dream-website/src/assets/";
const P = "file:///C:/Users/Martha/Documents/Projetos/aureti-instagram/";

const extra = `<style>
  .ph { margin: 40px auto 0; width: 420px; height: 800px; border-radius: 64px; background: #0d0f14; padding: 16px; box-shadow: 0 40px 90px rgba(0,0,0,.35); }
  .ph div { width: 100%; height: 100%; border-radius: 50px; overflow: hidden; }
  .ph img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
  .pic { margin: 44px -90px 0; height: 500px; overflow: hidden; }
  .pic img { width: 100%; height: 100%; object-fit: cover; }
  .chip { display: inline-block; margin-top: 36px; padding: 18px 30px; border-radius: 999px; font-size: 28px; font-weight: 600; background: var(--gold-soft); color: var(--navy); }
</style>`;
const s = (theme, mark, body) => story(theme, mark, extra + body);

// building blocks
const dica = (theme, mark, h1, lead) => s(theme, mark, `<h1>${h1}</h1>${lead ? `<p class="lead">${lead}</p>` : ""}`);
const numero = (n, unit, h1, lead) => s("dark", "Você sabia?", `<p class="big">${n}<small>${unit}</small></p><h1 style="margin-top:40px;font-size:76px">${h1}</h1>${lead ? `<p class="lead">${lead}</p>` : ""}`);
const lista = (theme, mark, h1, items) => s(theme, mark, `<h1>${h1}</h1><div class="rows">${items.map((it, i) => `<div><span>0${i + 1}</span><p><strong>${it[0]}</strong>${it[1] ? `<small>${it[1]}</small>` : ""}</p></div>`).join("")}</div>`);
const slot = (theme, mark, h1, lead, label) => s(theme, mark, `<h1>${h1}</h1>${lead ? `<p class="lead">${lead}</p>` : ""}<div class="slot">${label} aqui</div>`);
const modelo = (cat, name, img, cta = "Responda MODELO e receba o link") => s("dark", "Modelo pronto", `
  <p class="lead" style="margin:0;color:var(--gold-soft)">${cat}</p><h1 style="font-size:88px;margin-top:10px">${name}</h1>
  <div class="ph"><div><img src="${img}"></div></div><p style="text-align:center"><span class="chip">${cta}</span></p>`);
const projeto = (mark, h1, img, tag, cta) => s("light", mark, `<h1 style="font-size:74px">${h1}</h1>
  <div class="pic"><img src="${img}"></div><p class="lead">${tag}</p><p><span class="chip">${cta}</span></p>`);

// [date, slot (1=9h auto, 2=12h manual sticker, 3=18h auto), slug, html, short description]
const plan = [
  ["2026-10-20", 1, "karina-teaser", dica("dark", "Hoje no feed", `Hoje tem<br><em>projeto novo</em><br>no feed.`, "Um site de advocacia que passa confiança desde o primeiro clique. <b>Às 10h.</b>"), "Teaser da linha da Karina"],
  ["2026-10-20", 2, "enquete-confianca", slot("light", "Enquete", `Você confia mais<br>em quem tem<br><em>site próprio?</em>`, "Responda com sinceridade.", "Enquete"), "Enquete: confia mais em quem tem site? (Sim / Depende)"],
  ["2026-10-20", 3, "karina-cta", projeto("Projeto entregue", `Advocacia com<br><em>credibilidade.</em>`, T + "karina-0.jpg", "Site institucional · Karina Mendes", "Responda SITE e receba um orçamento"), "CTA projeto Karina"],

  ["2026-10-21", 1, "pdf-x-catalogo", null, "Comparativo PDF x catálogo no site"],
  ["2026-10-21", 2, "quiz-catalogo", null, "Quiz: quantos produtos cabem num catálogo online? (Até 50 / Até 500 / Quantos quiser)"],
  ["2026-10-21", 3, "modelo-clinica", modelo("Clínica odontológica", "SmileWell", T + "clinica-0.jpg"), "Modelo SmileWell (no dia do mockup da clínica)"],

  ["2026-10-22", 1, "dica-velocidade", null, "Dica 53%"],
  ["2026-10-22", 2, "enquete-site-proprio", null, "Enquete: seu negócio já tem site próprio? (Sim / Ainda não)"],
  ["2026-10-22", 3, "teste-velocidade", dica("dark", "Teste rápido", `Seu site abre em<br>menos de <em>3 segundos?</em>`, "Responda <b>VELOCIDADE</b> e a gente te mostra como testar o seu."), "CTA responda VELOCIDADE"],

  ["2026-10-23", 1, "teaser-clinica", dica("light", "Hoje às 18h", `Um vídeo para<br><em>dentistas</em> que<br>querem site pronto.`, "Seu site no ar em poucos dias, <b>sem começar do zero.</b>"), "Teaser do motion da clínica"],
  ["2026-10-23", 2, "caixinha-duvidas", null, "Caixinha: maior dúvida sobre ter um site"],
  ["2026-10-23", 3, "clinica-reels", projeto("Reels novo", `Seu site pronto<br>em <em>poucos dias.</em>`, T + "clinica-0.jpg", "Modelo pronto · Clínica odontológica", "Comente MODELO no Reels"), "Aviso do Reels da clínica"],

  ["2026-10-24", 1, "insta-alugado", dica("dark", "Presença digital", `Seu perfil é<br><em>alugado.</em><br>Seu site é seu.`, "Se o Instagram muda a regra, o alcance cai. <b>O site continua no Google, todo dia.</b>"), "Instagram x site"],
  ["2026-10-24", 2, "enquete-onde-acham", slot("light", "Enquete", `Por onde seus<br>clientes <em>te acham?</em>`, null, "Enquete"), "Enquete: Instagram / Google"],
  ["2026-10-24", 3, "modelo-matos", modelo("Escritório de advocacia", "Matos & Lima", T + "m-matos-0.jpg"), "Modelo Matos & Lima"],

  ["2026-10-26", 1, "perguntas-briefing", null, "Bastidores: perguntas do briefing"],
  ["2026-10-26", 2, "enquete-simples-completo", null, "Enquete: site simples ou completo"],
  ["2026-10-26", 3, "modelo-soraya", modelo("Coaching e mentoria", "Soraya Nunes", T + "m-soraya-0.jpg"), "Modelo Soraya Nunes"],

  ["2026-10-27", 1, "professor-metodo", dica("dark", "Para professores", `Seu método<br>é único. Seu site<br>precisa <em>mostrar isso.</em>`, "Metodologia, depoimentos de alunos e agendamento da aula em um só lugar."), "Professor: método único"],
  ["2026-10-27", 2, "quiz-alunos", slot("light", "Quiz", `Por onde chega<br>a maioria dos seus<br><em>alunos?</em>`, null, "Quiz"), "Quiz: Indicação / Instagram / Google"],
  ["2026-10-27", 3, "english-cta", projeto("Projeto entregue", `Um site que fala<br>a <em>língua do aluno.</em>`, T + "english-0.jpg", "Site para professor · English with JP", "Responda SITE e receba um orçamento"), "CTA projeto English with JP"],

  ["2026-10-28", 1, "site-professor", lista("light", "Dica rápida", `O que todo site<br>de <em>professor</em> precisa.`, [["Metodologia clara", "O aluno entende como são as aulas."], ["Depoimentos reais", "A prova de quem já aprendeu com você."], ["Agendamento fácil", "Um toque para marcar a primeira aula."]]), "Dica: site de professor"],
  ["2026-10-28", 2, "caixinha-site-faria", null, "Caixinha: o que seu site deveria fazer por você"],
  ["2026-10-28", 3, "modelo-smilewell", null, "Modelo SmileWell"],

  ["2026-10-29", 1, "sinal-celular", numero("1", "º", `sinal de alerta:<br>o site <em>quebra</em><br>no celular.`, "Texto pequeno, botão apertado, rolagem para o lado. <b>O cliente desiste.</b>"), "Sinal 1: quebra no celular"],
  ["2026-10-29", 2, "enquete-celular", slot("dark", "Enquete", `Você já abriu<br>o seu site <em>pelo</em><br><em>celular</em> hoje?`, null, "Enquete"), "Enquete: Sim / Nunca testei"],
  ["2026-10-29", 3, "modelo-armodent", modelo("Clínica odontológica", "Armodent", T + "m-armodent-0.jpg"), "Modelo Armodent"],

  ["2026-10-30", 1, "dominio-proprio", dica("light", "Você sabia?", `Domínio próprio<br>passa mais <em>confiança</em><br>que link genérico.`, "suaempresa.com.br no cartão, no Instagram e no e-mail."), "Dica domínio"],
  ["2026-10-30", 2, "enquete-modelo-zero", slot("light", "Enquete", `Você prefere<br>um <em>modelo pronto</em><br>ou um site do zero?`, "Os dois têm a sua vez. A gente te ajuda a escolher.", "Enquete"), "Enquete: modelo pronto / do zero"],
  ["2026-10-30", 3, "modelo-imob", modelo("Imobiliária", "Landing page", T + "m-imob-0.jpg"), "Modelo imobiliária"],

  ["2026-10-31", 1, "quem-somos", dica("dark", "Quem somos", `Sites, lojas,<br>sistemas e <em>apps.</em>`, "Somos a Aureti, engenharia de software para o seu negócio crescer. <b>Hoje às 18h tem vídeo de apresentação.</b>"), "Quem somos"],
  ["2026-10-31", 2, "caixinha-pergunte", slot("dark", "Caixinha de perguntas", `Pergunte o que<br>quiser sobre <em>ter</em><br><em>um site.</em>`, "Preço, prazo, domínio, manutenção. A gente responde aqui nos stories.", "Caixinha"), "Caixinha: pergunte sobre sites"],
  ["2026-10-31", 3, "vitrine-modelos", dica("dark", "Modelos prontos", `5 modelos<br>prontos. <em>Escolha</em><br><em>o seu.</em>`, "Advocacia, saúde, mentoria e imobiliária. <b>Responda MODELO</b> e receba os links."), "Vitrine de modelos"],

  ["2026-11-03", 1, "agencia-portfolio", dica("light", "Para agências", `Seu portfólio<br>está <em>vendendo</em><br>por você?`, "Filtros por cliente, serviços claros e contato a um toque."), "Agências: portfólio"],
  ["2026-11-03", 2, "enquete-portfolio", slot("light", "Enquete", `Seu portfólio<br>está <em>atualizado?</em>`, null, "Enquete"), "Enquete: Sim / Ainda não"],
  ["2026-11-03", 3, "azione-cta", projeto("Projeto entregue", `Presença à altura<br>da <em>marca.</em>`, T + "azione-desk-0.jpg", "Site institucional · Azione Marketing", "Responda SITE e receba um orçamento"), "CTA projeto Azione"],

  ["2026-11-04", 1, "etapa-briefing", lista("dark", "Bastidores", `Do briefing<br>ao <em>site no ar.</em>`, [["Briefing", "Entendemos seu negócio."], ["Planejamento", "Estrutura, conteúdo e tecnologia."], ["Desenvolvimento", "Design e código."], ["Suporte", "Evolução depois da entrega."]]), "Etapas do processo"],
  ["2026-11-04", 2, "enquete-etapa", slot("light", "Enquete", `Qual etapa você<br>acha <em>mais importante?</em>`, "Briefing, design, código ou suporte?", "Enquete"), "Enquete: etapa mais importante"],
  ["2026-11-04", 3, "modelo-x-medida", dica("dark", "Qual é o seu caso?", `Modelo pronto<br>ou <em>sob medida?</em>`, "Modelo: rápido e econômico. Sob medida: do seu jeito. <b>Responda QUAL</b> e a gente te orienta."), "Modelo x sob medida"],

  ["2026-11-05", 1, "portfolio-dicas", lista("light", "Dica rápida", `3 coisas que um<br><em>portfólio</em> precisa.`, [["Filtros por cliente", "O visitante acha o que procura."], ["Resultados visíveis", "Imagens e vídeos dos trabalhos."], ["Contato fácil", "Um toque para pedir orçamento."]]), "Dica: portfólio"],
  ["2026-11-05", 2, "caixinha-agencia", slot("dark", "Caixinha de perguntas", `O que falta no<br>site da sua<br><em>empresa?</em>`, "Conta pra gente aqui embaixo.", "Caixinha"), "Caixinha: o que falta no seu site"],
  ["2026-11-05", 3, "modelo-soraya-2", modelo("Coaching e mentoria", "Soraya Nunes", T + "m-soraya-1.jpg"), "Modelo Soraya (tela 2)"],

  ["2026-11-06", 1, "app-ou-site", dica("dark", "Você sabia?", `Quando vale ter<br>um <em>aplicativo?</em>`, "Quando a equipe ou o cliente usa todo dia, em campo, no celular. <b>Hoje no feed: o Sistema HP.</b>"), "App ou site"],
  ["2026-11-06", 2, "enquete-planilha", slot("light", "Enquete", `Sua empresa ainda<br>controla tudo<br>em <em>planilha?</em>`, null, "Enquete"), "Enquete: Sim / Não"],
  ["2026-11-06", 3, "hp-cta", projeto("Projeto entregue", `Serviços técnicos<br>na <em>palma da mão.</em>`, A + "sistema-hp.webp", "Aplicativo mobile · Sistema HP", "Responda APP e vamos conversar"), "CTA projeto Sistema HP"],

  ["2026-11-07", 1, "projetos-entregues", lista("dark", "Projetos entregues", `Quem já está<br><em>no ar</em> com a Aureti.`, [["Karina Mendes", "Advocacia"], ["AD Belém", "Loja de camisetas"], ["Escala", "Catálogo de produtos"], ["English with JP", "Professor de inglês"], ["Azione", "Agência de marketing"]]), "Lista de projetos entregues"],
  ["2026-11-07", 2, "enquete-qual-modelo", slot("light", "Enquete", `Qual modelo você<br>quer <em>ver primeiro?</em>`, null, "Enquete"), "Enquete: Advocacia / Saúde"],
  ["2026-11-07", 3, "vitrine-modelos-2", dica("light", "Modelos prontos", `Seu site pronto,<br><em>sem começar</em><br><em>do zero.</em>`, "<b>Responda MODELO</b> e receba os 5 links para ver cada um."), "Vitrine de modelos 2"],

  ["2026-11-09", 1, "bastidores-hp", dica("light", "Bastidores", `Do protótipo<br>ao <em>app pronto.</em>`, "Hoje às 18h tem vídeo novo do Sistema HP."), "Bastidores HP"],
  ["2026-11-09", 2, "caixinha-app", slot("dark", "Caixinha de perguntas", `Que aplicativo<br>a sua empresa<br><em>precisa?</em>`, "Conta a ideia aqui. A gente responde.", "Caixinha"), "Caixinha: ideia de app"],
  ["2026-11-09", 3, "modelo-smilewell-2", modelo("Clínica odontológica", "SmileWell", T + "clinica-1.jpg"), "Modelo SmileWell (tela 2)"],

  ["2026-11-10", 1, "dominio-dica", numero(".com", ".br", `é o endereço<br>que <em>ninguém tira</em><br>do seu negócio.`, null), "Dica domínio .com.br"],
  ["2026-11-10", 2, "enquete-dominio", slot("light", "Enquete", `Você já tem<br><em>domínio próprio?</em>`, null, "Enquete"), "Enquete: Sim / Não"],
  ["2026-11-10", 3, "dominio-cta", dica("dark", "A gente resolve", `Domínio, site<br>e e-mail <em>no seu</em><br><em>nome.</em>`, "<b>Responda DOMÍNIO</b> e a gente te explica o passo a passo."), "CTA domínio"],

  ["2026-11-11", 1, "site-clinica", null, "Dica: o que site de clínica precisa"],
  ["2026-11-11", 2, "enquete-whatsapp-site", null, "Enquete: marcar consulta por WhatsApp ou site"],
  ["2026-11-11", 3, "modelo-armodent-2", modelo("Clínica odontológica", "Armodent", T + "m-armodent-1.jpg"), "Modelo Armodent (tela 2)"],

  ["2026-11-12", 1, "tres-passos", lista("light", "Modelo pronto", `Seu site no ar<br>em <em>3 passos.</em>`, [["Escolha o modelo", "Advocacia, saúde, mentoria ou imobiliária."], ["Envie sua marca", "Logo, fotos e textos."], ["Site no ar", "Com domínio próprio."]]), "3 passos do modelo pronto"],
  ["2026-11-12", 2, "quiz-modelo", slot("dark", "Quiz", `Qual destes é um<br>modelo <em>da Aureti?</em>`, "Advocacia, clínica, mentoria ou imobiliária? Todos!", "Quiz"), "Quiz: todos são modelos da Aureti"],
  ["2026-11-12", 3, "modelo-clinica-cta", null, "Modelo clínica"],

  ["2026-11-13", 1, "clientes-falam", dica("dark", "Clientes", `O que fica<br>depois da <em>entrega.</em>`, "Suporte, ajustes e evolução do site. A gente continua por perto."), "Pós-entrega"],
  ["2026-11-13", 2, "caixinha-orcamento", slot("light", "Caixinha de perguntas", `Quer um orçamento?<br><em>Conta o seu</em><br><em>projeto.</em>`, "Tipo de negócio e o que precisa. A gente responde no direct.", "Caixinha"), "Caixinha: pedido de orçamento"],
  ["2026-11-13", 3, "modelo-imob-2", modelo("Imobiliária", "Landing page", T + "m-imob-1.jpg"), "Modelo imobiliária (tela 2)"],

  ["2026-11-14", 1, "teaser-vitrine", dica("dark", "Hoje às 18h", `Os 5 <em>modelos</em><br><em>prontos</em> num<br>só vídeo.`, "Advocacia, saúde, mentoria e imobiliária."), "Teaser do Reels de modelos"],
  ["2026-11-14", 2, "enquete-sua-cara", slot("light", "Enquete", `Qual modelo é<br>a <em>sua cara?</em>`, null, "Enquete"), "Enquete: qual modelo é a sua cara"],
  ["2026-11-14", 3, "comente-modelo", dica("dark", "Reels no ar", `Comente <em>MODELO</em><br>no Reels de hoje.`, "A gente te manda os links dos 5 modelos prontos."), "CTA comente MODELO"],

  // Escala postponed to the first week of January 2027
  ["2027-01-04", 3, "escala-cta", null, "CTA projeto Escala"],
  ["2027-01-06", 1, "bastidores-escala", dica("light", "Bastidores", `Como nasce<br>um <em>motion</em><br>na Aureti.`, "Hoje às 18h tem vídeo novo do catálogo da Escala, feito do zero com código e design."), "Bastidores do motion da Escala"],
  ["2027-01-06", 3, "escala-reels", projeto("Reels novo", `Seu cliente procura,<br>encontra e <em>chama.</em>`, T + "escala-0.jpg", "Catálogo online · Escala Materiais Elétricos", "Comente CATÁLOGO no Reels"), "Aviso do Reels da Escala"],
];

// arts already made earlier (stories.cjs) are reused instead of regenerated
const reuse = {
  "2026-10-21-1": "story-2026-10-23-1-dica", "2026-10-21-2": "story-2026-10-23-2-quiz", "2027-01-04-3": "story-2026-10-23-3-projeto",
  "2026-10-22-1": "story-2026-10-20-1-dica", "2026-10-22-2": "story-2026-10-20-2-enquete",
  "2026-10-23-2": "story-2026-10-20-3-caixinha",
  "2026-10-26-1": "story-2026-10-22-1-bastidores", "2026-10-26-2": "story-2026-10-22-2-enquete",
  "2026-10-28-2": "story-2026-10-22-3-caixinha", "2026-10-28-3": "story-2026-10-21-3-modelo",
  "2026-11-11-1": "story-2026-10-21-1-dica", "2026-11-11-2": "story-2026-10-21-2-enquete",
  "2026-11-12-3": "story-2026-10-21-3-modelo",
};

const HOURS = { 1: "09:00", 2: "12:00", 3: "18:00" };
const stories = plan.map(([date, slot, slug, html, desc]) => ({
  date, time: HOURS[slot], slot, slug, html, desc,
  name: `${date}-story-${slot}-${slug}`,
  source: reuse[`${date}-${slot}`] || null,
  manual: slot === 2,
}));

module.exports = { stories };

if (require.main === module) {
  const out = path.join(__dirname, "stories-mes");
  fs.mkdirSync(out, { recursive: true });
  let n = 0;
  for (const st of stories) {
    if (st.html) { fs.writeFileSync(path.join(out, st.name + ".html"), st.html); n++; }
    else if (!st.source) throw new Error("missing art for " + st.name);
  }
  console.log(stories.length, "stories,", n, "new arts");
}
