// stitch-local.mjs — rescue a cloud render whose `stitch` job never ran (billing
// block, runner outage). The 16 chunk-* + audio artifacts survive 2 days on the
// run's Summary page; download them, then this does the SAME stitch locally:
// concat the muted chunks in frame order + two-pass loudnorm mux. ffmpeg only,
// no Remotion, so it does not OOM the way a local render does.
//
// Usage: node scripts/stitch-local.mjs <artifactDir> <comp-frames.json> <out.mp4>
//   <artifactDir> holds the downloaded zips (chunk-0.zip … audio.zip) or their
//   extracted chunk-*.mp4 + audio.wav. Zips are extracted in place with `tar`.
// Env:   LUFS (default -14), TPEAK (default -1.5) — match render.yml's env block.

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const [dir, framesFile, output] = process.argv.slice(2);
if (!dir || !framesFile || !output) {
  console.error("Usage: node scripts/stitch-local.mjs <artifactDir> <comp-frames.json> <out.mp4>");
  process.exit(1);
}
const LUFS = process.env.LUFS || "-14";
const TPEAK = process.env.TPEAK || "-1.5";

const run = (cmd, args, opts = {}) => {
  const r = spawnSync(cmd, args, { encoding: "utf8", ...opts });
  if (r.status !== 0) {
    console.error(`✗ ${cmd} failed\n${r.stderr || ""}`);
    process.exit(1);
  }
  return r;
};

// 1. Extract any zips. Windows' own tar is bsdtar (reads zip); Git Bash's GNU tar
// can shadow it on PATH and cannot, so name it explicitly.
const TAR = process.platform === "win32" ? "C:\\Windows\\System32\\tar.exe" : "unzip";
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".zip"))) {
  run(TAR, process.platform === "win32" ? ["-xf", f] : ["-o", f], { cwd: dir });
}

// 2. Concat chunks — zero-padded names, so lexical sort == frame order.
const chunks = fs.readdirSync(dir).filter((f) => /^chunk-\d+\.mp4$/.test(f)).sort();
const audio = path.join(dir, "audio.wav");
if (!chunks.length || !fs.existsSync(audio)) {
  console.error(`✗ need chunk-*.mp4 + audio.wav in ${dir} (found ${chunks.length} chunks)`);
  process.exit(1);
}
console.log(`→ ${chunks.length} chunks: ${chunks[0]} … ${chunks.at(-1)}`);
const list = path.join(dir, "concat.txt");
fs.writeFileSync(list, chunks.map((c) => `file '${path.resolve(dir, c).replace(/\\/g, "/")}'`).join("\n"));
const video = path.join(dir, "video.mp4");
run("ffmpeg", ["-y", "-f", "concat", "-safe", "0", "-i", list, "-c", "copy", video]);

// 3. Guard: duration must match comp-frames.json (catches a missing chunk).
const cf = JSON.parse(fs.readFileSync(framesFile, "utf8"));
const expect = cf.durationInFrames / cf.fps;
const got = Number(run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", video]).stdout);
console.log(`→ duration: expected ${expect.toFixed(2)}s, got ${got.toFixed(2)}s`);
if (Math.abs(expect - got) > 0.15) {
  console.error("✗ duration mismatch — a chunk is missing or comp-frames.json is stale");
  process.exit(1);
}

// 4. Two-pass loudnorm mux (same as render.yml's stitch job).
const meas = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", audio,
  "-af", `loudnorm=I=${LUFS}:TP=${TPEAK}:LRA=11:print_format=json`, "-f", "null", "-"], { encoding: "utf8" });
const m = (meas.stderr || "").match(/\{[\s\S]*?\}/);
let ln = "";
if (m) {
  const j = JSON.parse(m[0]);
  console.log(`→ measured I=${j.input_i} TP=${j.input_tp}`);
  ln = `:measured_I=${j.input_i}:measured_TP=${j.input_tp}:measured_LRA=${j.input_lra}` +
    `:measured_thresh=${j.input_thresh}:offset=${j.target_offset}`;
} else {
  console.log("→ measure failed — single-pass loudnorm");
}
run("ffmpeg", ["-y", "-i", video, "-i", audio, "-c:v", "copy",
  "-filter:a", `loudnorm=I=${LUFS}:TP=${TPEAK}:LRA=11${ln}`, "-c:a", "aac", "-b:a", "256k", "-ar", "48000",
  "-map", "0:v:0", "-map", "1:a:0", "-shortest", output]);
console.log(`✓ Wrote ${output}`);
