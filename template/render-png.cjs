// Renders HTML files to PNG next to them (default 1080x1350, feed posts).
// usage: node render-png.cjs [--size 1080x1920] <file.html>...
const { chromium } = require("playwright");
const { pathToFileURL } = require("url");
const path = require("path");
(async () => {
  let args = process.argv.slice(2), [w, h] = [1080, 1350];
  if (args[0] === "--size") { [w, h] = args[1].split("x").map(Number); args = args.slice(2); }
  const b = await chromium.launch({ channel: "msedge" });
  const p = await b.newPage({ viewport: { width: w, height: h } });
  for (const f of args) {
    await p.goto(pathToFileURL(path.resolve(f)).href, { waitUntil: "load" });
    await p.evaluate(() => document.fonts.ready.then(() => true));
    await p.waitForTimeout(300);
    await p.screenshot({ path: f.replace(/\.html$/, ".png") });
  }
  await b.close();
})();
