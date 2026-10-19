// Short "tour" Reels (outside the grid): scrolls a site on a phone-sized browser and frames it
// with an Aureti hook band on top. One call per Reel.
// usage: node reels-extra.cjs <url> <out.mp4> "<hook html>" "<tag>" <music.mp3> [musicStart] [seconds]
const { chromium, devices } = require("playwright");
const { execFileSync } = require("child_process");
const fs = require("fs"), os = require("os"), path = require("path");

const FPS = 30;
const overlay = (hook, tag) => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;600&display=block" rel="stylesheet">
<style>
  :root { --navy: oklch(0.175 0.052 257); --gold-soft: oklch(0.78 0.08 80); --ivory: oklch(0.965 0.009 83); }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1080px; height: 1920px; background: transparent; font-family: "DM Sans", sans-serif; overflow: hidden; }
  .win { position: absolute; left: 190px; top: 330px; width: 700px; height: 1515px; border-radius: 56px; box-shadow: 0 0 0 2000px var(--navy); }
  .rim { position: absolute; left: 178px; top: 318px; width: 724px; height: 1539px; border-radius: 66px; border: 12px solid #0d0f14; }
  .top { position: absolute; left: 80px; right: 80px; top: 110px; color: var(--ivory); }
  .top small { display: block; font-size: 22px; font-weight: 600; letter-spacing: .26em; text-transform: uppercase; color: var(--gold-soft); margin-bottom: 14px; }
  .top b { font-size: 64px; font-weight: 600; letter-spacing: -.03em; line-height: 1.05; }
  .top b em { font-style: normal; color: var(--gold-soft); }
  .bot { position: absolute; left: 0; right: 0; top: 1868px; text-align: center; color: var(--ivory); font-size: 26px; letter-spacing: .08em; opacity: .85; }
</style></head><body>
  <div class="win"></div><div class="rim"></div>
  <div class="top"><small>${tag}</small><b>${hook}</b></div>
  <div class="bot">aureti.com.br · @aure.tii</div>
</body></html>`;

(async () => {
  const [url, out, hook, tag, music, mstart = "0", secs = "14"] = process.argv.slice(2);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "reel-"));
  const b = await chromium.launch({ channel: "msedge" });

  // 1) overlay with a transparent window for the screen
  const po = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await po.setContent(overlay(hook, tag), { waitUntil: "load" });
  await po.evaluate(() => document.fonts.ready.then(() => 1)); await po.waitForTimeout(300);
  await po.screenshot({ path: path.join(tmp, "overlay.png"), omitBackground: true });

  // 2) smooth scroll of the site, one screenshot per frame (700x1515 window = 350x757.5 css @2x)
  const ctx = await b.newContext({ ...devices["iPhone 13"], viewport: { width: 350, height: 758 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  const H = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  for (let y = 0; y <= H; y += 300) { await p.evaluate(v => scrollTo(0, v), y); await p.waitForTimeout(120); }
  await p.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; scrollTo(0, 0); });
  await p.waitForTimeout(1200);
  const n = Math.round(+secs * FPS), hold = FPS, travel = Math.min(H, 4200);
  const ease = t => (t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  for (let i = 0; i < n; i++) {
    const t = Math.min(1, Math.max(0, (i - hold) / (n - 2 * hold)));
    await p.evaluate(v => scrollTo(0, v), Math.round(ease(t) * travel));
    await p.screenshot({ path: path.join(tmp, `f${String(i).padStart(5, "0")}.jpg`), type: "jpeg", quality: 90 });
  }
  await b.close();

  // 3) compose: navy canvas + screen in the window + overlay, music with fades
  const fadeAt = (+secs - 2).toFixed(2);
  execFileSync("ffmpeg", ["-v", "error", "-y",
    "-f", "lavfi", "-i", `color=c=0x0b1226:s=1080x1920:r=${FPS}:d=${secs}`,
    "-framerate", String(FPS), "-i", path.join(tmp, "f%05d.jpg"),
    "-i", path.join(tmp, "overlay.png"),
    "-ss", mstart, "-i", music,
    "-filter_complex", `[1:v]scale=700:1515[s];[0:v][s]overlay=190:330[a];[a][2:v]overlay=0:0,fade=in:0:10,format=yuv420p[v];` +
      `[3:a]atrim=0:${secs},asetpts=PTS-STARTPTS,loudnorm=I=-14:TP=-1.5:LRA=11,afade=t=in:d=0.4,afade=t=out:st=${fadeAt}:d=2,aresample=48000[au]`,
    "-map", "[v]", "-map", "[au]", "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-c:a", "aac", "-b:a", "192k",
    "-shortest", "-movflags", "+faststart", out], { stdio: "inherit" });
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(out);
})();
