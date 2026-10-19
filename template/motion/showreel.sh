#!/usr/bin/env bash
# Builds the 20 s showreel from the month's videos with varied transitions.
# usage: bash showreel.sh <out.mp4> <music.mp3> [musicStartSec]
# Needs the motion/tour videos already in posts/ and the two still cards rendered:
#   (the intro and closing cards are rendered from showreel.html by the script itself)
set -euo pipefail
cd "$(dirname "$0")"
OUT="$1"; MUSIC="$2"; MSTART="${3:-0}"
P=../../posts
TMP=$(mktemp -d)

# still cards (intro / fim) as images
node -e '
const { chromium } = require("playwright"); const { pathToFileURL } = require("url"); const path = require("path");
(async () => { const b = await chromium.launch({ channel: "msedge" }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const id of ["intro", "fim"]) { await p.goto(pathToFileURL(path.resolve("showreel.html")).href + "#" + id, { waitUntil: "load" });
    await p.evaluate(() => document.fonts.ready.then(() => 1)); await p.waitForTimeout(300); await p.screenshot({ path: process.argv[1] + "/" + id + ".png" }); }
  await b.close(); })();' "$TMP"

# clip list: source, start second (each clip is 2.7 s; the cards are stills)
CLIPS=(
  "$P/2026-10-19/2026-10-23-escala-motion.mp4 5.0"
  "$P/2026-10-26/2026-10-28-english-tour.mp4 9.0"
  "$P/2026-10-26/2026-10-26-karina-motion.mp4 5.2"
  "$P/2026-11-02/2026-11-05-azione-tour.mp4 20.0"
  "$P/2026-11-09/2026-11-09-sistema-hp-motion.mp4 3.6"
  "$P/2026-11-09/2026-11-12-clinica-motion.mp4 5.0"
  "$P/2026-10-26/2026-10-31-aureti-motion.mp4 2.4"
)
TRANS=(circleopen slideleft wipeup smoothright zoomin radial slideup dissolve)

ff=(ffmpeg -v error -y -loop 1 -t 2.0 -framerate 30 -i "$TMP/intro.png")
for c in "${CLIPS[@]}"; do set -- $c; ff+=(-ss "$2" -t 2.7 -i "$1"); done
ff+=(-loop 1 -t 2.6 -framerate 30 -i "$TMP/fim.png")

n=$(( ${#CLIPS[@]} + 2 ))
f=""; for i in $(seq 0 $((n-1))); do f+="[$i:v]scale=1080:1920,setsar=1,fps=30,format=yuv420p,settb=AVTB[v$i];"; done
prev="v0"; off=0; len0=2.0
durs=(2.0); for c in "${CLIPS[@]}"; do durs+=(2.7); done; durs+=(2.6)
acc=${durs[0]}
for i in $(seq 1 $((n-1))); do
  off=$(awk "BEGIN{print $acc-0.4}")
  t=${TRANS[$(( (i-1) % ${#TRANS[@]} ))]}
  f+="[$prev][v$i]xfade=transition=$t:duration=0.4:offset=$off[x$i];"
  prev="x$i"; acc=$(awk "BEGIN{print $acc-0.4+${durs[$i]}}")
done
total=$acc
fade=$(awk "BEGIN{print $total-2}")
f+="[$n:a]atrim=0:$total,asetpts=PTS-STARTPTS,loudnorm=I=-14:TP=-1.5:LRA=11,afade=t=in:d=0.4,afade=t=out:st=$fade:d=2,aresample=48000[a]"
ff+=(-ss "$MSTART" -i "$MUSIC" -filter_complex "$f" -map "[$prev]" -map "[a]" -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart "$OUT")
"${ff[@]}"
rm -rf "$TMP"
echo "$OUT (${total}s)"
