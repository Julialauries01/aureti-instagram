// Builds the full plan 20/10 – 14/11/2026 (feed, extra Reels, stories) from the week folders,
// copies the story arts into posts/<week>/stories/ and writes planejamento.csv + plano.json.
// usage: node planejamento.cjs
const fs = require("fs");
const path = require("path");
const { stories } = require("./stories-mes.cjs");

const ROOT = path.join(__dirname, "..");
const RAW = "https://raw.githubusercontent.com/Julialauries01/aureti-instagram/main/";
const WEEKS = ["2026-10-19", "2026-10-26", "2026-11-02", "2026-11-09", "2027-01-04"];
const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const weekOf = d => { const x = new Date(d + "T12:00:00"); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x.toISOString().slice(0, 10); };

// --- feed + extra Reels: parsed from posts/<week>/legendas.md ---
const items = [];
for (const w of WEEKS) {
  const md = fs.readFileSync(path.join(ROOT, "posts", w, "legendas.md"), "utf8").replace(/\r\n/g, "\n");
  for (const sec of md.split(/\n## /).slice(1)) {
    const head = sec.split("\n")[0];
    const m = head.match(/(\d{2})\/(\d{2}),?\s*(\d{1,2})h?\s*—\s*(.+)$/) || head.match(/(\d{2})\/(\d{2})\s*—\s*(.+)$/);
    if (!m) continue;
    const [dd, mm] = [m[1], m[2]];
    const hour = m.length === 5 ? m[3].padStart(2, "0") + ":00" : "";
    const title = m.length === 5 ? m[4] : m[3];
    const files = [...sec.matchAll(/`([^`]+\.(?:png|mp4))`/g)].map(x => x[1]);
    const body = sec.split("\n").slice(1).filter(l => !/^(Arquivo|Repostar)/.test(l)).join("\n").trim();
    const extra = /Reels extra/i.test(title);
    const video = files.find(f => f.endsWith(".mp4"));
    items.push({
      date: `${w.slice(0, 4)}-${mm}-${dd}`, time: hour, channel: extra ? "Reels extra (fora da grade)" : "Feed",
      format: extra ? "Reels" : video ? "Reels" : "Post", theme: title,
      file: video || files[0], cover: video ? files.find(f => f.endsWith(".png")) : "",
      text: body, week: w,
      status: /PENDENTE/.test(sec) ? "pendente (não agendado)" : "agendado",
    });
  }
}

// --- stories: copy arts into the week folders ---
for (const st of stories) {
  const w = weekOf(st.date);
  const dir = path.join(ROOT, "posts", w, "stories");
  fs.mkdirSync(dir, { recursive: true });
  const src = path.join(__dirname, st.source ? st.source + ".png" : path.join("stories-mes", st.name + ".png"));
  fs.copyFileSync(src, path.join(dir, st.name + ".png"));
  items.push({
    date: st.date, time: st.time, channel: "Story", format: st.manual ? "Story (figurinha)" : "Story",
    theme: st.desc, file: `stories/${st.name}.png`, cover: "", text: "", week: w,
    status: "agendado", manual: st.manual,
  });
}

items.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
for (const it of items) {
  it.path = `posts/${it.week}/${it.file}`;
  it.url = RAW + it.path;
  it.coverUrl = it.cover ? RAW + `posts/${it.week}/${it.cover}` : "";
  it.dia = DIAS[new Date(it.date + "T12:00:00").getDay()];
  it.publicacao = it.manual ? "Manual: Metricool avisa no celular para colocar a figurinha" : "Automática";
}

const esc = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
const cols = [["Data", "date"], ["Dia", "dia"], ["Horário", "time"], ["Canal", "channel"], ["Formato", "format"], ["Tema", "theme"],
  ["Arquivo", "path"], ["Capa", "cover"], ["Publicação", "publicacao"], ["Status", "status"], ["Legenda", "text"]];
const csv = [cols.map(c => esc(c[0])).join(";"), ...items.map(it => cols.map(c => esc(it[c[1]])).join(";"))].join("\r\n");
fs.writeFileSync(path.join(ROOT, "planejamento.csv"), "﻿" + csv);
fs.writeFileSync(path.join(__dirname, "plano.json"), JSON.stringify(items, null, 1));
const count = k => items.filter(i => i.channel.startsWith(k)).length;
console.log(`${items.length} itens: feed ${count("Feed")}, reels extra ${count("Reels extra")}, stories ${count("Story")}`);
