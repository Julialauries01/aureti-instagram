// Renders a motion scene (HTML with a paused GSAP timeline in window.tl) to an MP4 Reel.
// usage: node render.cjs <scene.html> <out.mp4> [music.mp3] [musicStartSec]
// Needs Playwright (Edge channel) and FFmpeg on PATH. Frames go to a temp folder and are removed after encoding.
const { chromium } = require("playwright");
const { execFileSync } = require("child_process");
const fs = require("fs"), os = require("os"), path = require("path");
const { pathToFileURL } = require("url");

const FPS = 30;
(async () => {
  const [scene, out, music, musicStart = "0"] = process.argv.slice(2);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "motion-"));
  const b = await chromium.launch({ channel: "msedge" });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  // "load" already waits for the images; img.decode() crashed Edge on 3D scenes, so it is not used here
  await p.goto(pathToFileURL(path.resolve(scene)).href, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready.then(() => true));
  await p.waitForTimeout(500);
  const dur = await p.evaluate(() => window.tl.duration());
  const n = Math.round(dur * FPS);
  for (let i = 0; i < n; i++) {
    await p.evaluate(t => window.tl.seek(t, false), i / FPS);
    await p.screenshot({ path: path.join(tmp, `f${String(i).padStart(5, "0")}.jpg`), type: "jpeg", quality: 92 });
  }
  await b.close();

  const args = ["-v", "error", "-y", "-framerate", String(FPS), "-i", path.join(tmp, "f%05d.jpg")];
  if (music) {
    const fadeAt = Math.max(0, dur - 2).toFixed(2);
    args.push("-ss", musicStart, "-i", music, "-filter_complex",
      `[1:a]atrim=0:${dur},asetpts=PTS-STARTPTS,loudnorm=I=-14:TP=-1.5:LRA=11,afade=t=in:d=0.4,afade=t=out:st=${fadeAt}:d=2,aresample=48000[a]`,
      "-map", "0:v", "-map", "[a]", "-c:a", "aac", "-b:a", "192k", "-shortest");
  }
  args.push("-c:v", "libx264", "-preset", "slow", "-crf", "19", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out);
  execFileSync("ffmpeg", args, { stdio: "inherit" });
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`${out} (${dur.toFixed(1)}s, ${n} frames)`);
})();
