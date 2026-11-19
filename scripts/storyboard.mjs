// storyboard.mjs — ONE board image of a chunk's scenes at their peak, for the operator
// to see BEFORE the chunk is animated. Reads src/motion-plan.json (see motion-audit.mjs
// for the shape), renders each scene's `peakFrame` as a still, tiles them with ffmpeg
// and stamps a big panel number + short title on each tile. The long notes are printed
// as a numbered list (they never go on the image).
//
//   node scripts/storyboard.mjs out/board-c1.png [--plan src/motion-plan.json]
//
// Run from the PROJECT folder. Bundles ONCE and renders the stills through one browser
// (the same @remotion/renderer path comp-frames.mjs uses) on port 3150, so it never
// collides with the Studio on 3000/3100. Stills are cheap; this is not a video render.
//
// ⚠️ The board is capped at 2000px on its LONGEST side: one bigger image breaks image
// viewing for the rest of the session. The script refuses to write anything larger.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { bundle } from "@remotion/bundler";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";

const MAX = 2000;
const out = process.argv[2];
if (!out || out.startsWith("--")) {
  console.error("usage: node scripts/storyboard.mjs <board.png> [--plan src/motion-plan.json]");
  process.exit(1);
}
const pi = process.argv.indexOf("--plan");
const plan = JSON.parse(fs.readFileSync(path.resolve(pi > 0 ? process.argv[pi + 1] : "src/motion-plan.json"), "utf8"));
const scenes = plan.scenes ?? [];
if (!scenes.length) {
  console.log("(no scenes in the motion plan yet — nothing to board)");
  process.exit(0);
}

// grid: 1–3 in a row, 4 as 2×2, then 3 wide
const n = scenes.length;
const cols = n <= 3 ? n : n === 4 ? 2 : Math.ceil(Math.sqrt(n));
const rows = Math.ceil(n / cols);

const t0 = Date.now();
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const comp = await selectComposition({ serveUrl, id: plan.composition, inputProps: {}, port: 3150 });
// each cell = a label strip ABOVE the still (never on it: it hid content) + the still
const STRIP = 0.16; // strip height as a share of the still's height
const scale = Math.floor(Math.min(1, MAX / (cols * comp.width), MAX / (rows * comp.height * (1 + STRIP))) * 1000) / 1000;
const tw = Math.floor(comp.width * scale), th = Math.floor(comp.height * scale), sh = Math.round(th * STRIP);

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "storyboard-"));
const browser = await openBrowser("chrome");
const stills = [];
for (const sc of scenes) {
  const file = path.join(tmp, `s${sc.n}.png`);
  const s0 = Date.now();
  await renderStill({ composition: comp, serveUrl, output: file, frame: sc.peakFrame, scale, imageFormat: "png", puppeteerInstance: browser, port: 3150 });
  console.error(`still ${sc.n} @ frame ${sc.peakFrame} → ${((Date.now() - s0) / 1000).toFixed(1)}s`);
  stills.push(file);
}
await browser.close({ silent: true });

// tile: scale each still, pad a black strip above it with a red number + white title, xstack into the grid
const font = "C:/Windows/Fonts/arialbd.ttf";
// the drive colon is escaped once, inside the quoted option
const fontOpt = fs.existsSync(font) ? `fontfile='${font.replace(":", "\\:")}':` : "";
const size = Math.round(sh * 0.62);
const clean = (s) => String(s ?? "").replace(/[:'\\%,;[\]=]/g, " ").slice(0, 28);
const filters = scenes.map((sc, i) =>
  `[${i}:v]scale=${tw}:${th},pad=${tw}:${th + sh}:0:${sh}:black,` +
  `drawtext=${fontOpt}text='${sc.n}':x=${Math.round(size * 0.4)}:y=${Math.round((sh - size) / 2)}:y_align=font:fontsize=${size}:fontcolor=0xF4212D,` +
  `drawtext=${fontOpt}text='${clean(sc.title)}':x=${Math.round(size * (0.4 + 0.62 * String(sc.n).length + 0.5))}:y=${Math.round((sh - size) / 2)}:y_align=font:fontsize=${size}:fontcolor=white[t${i}]`);
const layout = scenes.map((_, i) => `${(i % cols) * tw}_${Math.floor(i / cols) * (th + sh)}`).join("|");
const graph = n === 1 ? filters[0].replace("[t0]", "") : `${filters.join(";")};${scenes.map((_, i) => `[t${i}]`).join("")}xstack=inputs=${n}:layout=${layout}:fill=black`;
fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
const ff = spawnSync("ffmpeg", ["-y", "-loglevel", "error", ...stills.flatMap((f) => ["-i", f]), "-filter_complex", graph, "-frames:v", "1", out], { encoding: "utf8" });
if (ff.status !== 0) {
  console.error(ff.stderr);
  process.exit(1);
}
fs.rmSync(tmp, { recursive: true, force: true });

const W = cols * tw, H = rows * (th + sh);
if (Math.max(W, H) > MAX) {
  fs.rmSync(out);
  console.error(`board would be ${W}×${H} (> ${MAX}px) — removed`);
  process.exit(1);
}
console.log(`STORYBOARD · ${plan.composition} chunk ${plan.chunk}\n` + "=".repeat(78));
console.log(`${path.resolve(out)}  ${W}×${H}px  (${n} panels, scale ${scale}, ${((Date.now() - t0) / 1000).toFixed(0)}s)`);
console.log("=".repeat(78));
for (const sc of scenes) console.log(`${String(sc.n).padStart(2)}. ${sc.title} — ${sc.move} · hero ${sc.hero}${sc.supports?.length ? ` + ${sc.supports.join(", ")}` : ""}\n    ${sc.note ?? ""}`);
