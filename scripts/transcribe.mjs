// Stage 2 — Transcribe each scene clip with Whisper → src/captions.json
// (word-timed). The model is CACHED at WHISPER_DIR and reused across runs.
//
// Env:
//   WHISPER_DIR    where whisper.cpp + model live (default: space-free cache)
//   WHISPER_MODEL  model name (default: small.en)
//   FFMPEG_BIN     folder holding ffmpeg/ffprobe (default: on PATH)

import {
  installWhisperCpp,
  downloadWhisperModel,
  transcribe,
  toCaptions,
} from "@remotion/install-whisper-cpp";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const PROJECT = process.cwd();
const isWin = process.platform === "win32";
const FF = process.env.FFMPEG_BIN ? path.join(process.env.FFMPEG_BIN, "ffmpeg") : "ffmpeg";
const MODEL = process.env.WHISPER_MODEL ?? "small.en";
const VERSION = "1.5.5";

// IMPORTANT (Windows): the whisper installer runs Expand-Archive UNQUOTED and
// drops the zip in process.cwd(), so a path with spaces breaks it. Default to a
// space-free cache and run the install from there.
const WHISPER_DIR =
  process.env.WHISPER_DIR ??
  (isWin ? "C:\\rw\\whisper" : path.join(os.homedir(), ".cache", "biointel-whisper"));

fs.mkdirSync(path.dirname(WHISPER_DIR), { recursive: true });

console.log(`→ Whisper cache: ${WHISPER_DIR} (model ${MODEL})`);
const origCwd = process.cwd();
process.chdir(path.dirname(WHISPER_DIR)); // space-free cwd for the unzip step
await installWhisperCpp({ to: WHISPER_DIR, version: VERSION }); // skips if cached
await downloadWhisperModel({ model: MODEL, folder: WHISPER_DIR }); // skips if cached
process.chdir(origCwd);

const scenesDir = path.join(PROJECT, "public", "scenes");
const scenes = fs
  .readdirSync(scenesDir)
  .filter((f) => /^scene\d+\.mp4$/i.test(f))
  .sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));

const result = {};
for (const f of scenes) {
  const key = f.replace(/\.mp4$/i, "");
  const mp4 = path.join(scenesDir, f);
  const wav = path.join(scenesDir, `${key}.wav`);
  console.log(`→ ${key}: extract + transcribe`);
  execFileSync(FF, ["-y", "-i", mp4, "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", wav], {
    stdio: "ignore",
  });
  const out = await transcribe({
    inputPath: wav,
    whisperPath: WHISPER_DIR,
    whisperCppVersion: VERSION,
    model: MODEL,
    tokenLevelTimestamps: true,
  });
  result[key] = toCaptions({ whisperCppOutput: out }).captions;
  fs.rmSync(wav);
}

fs.writeFileSync(path.join(PROJECT, "src", "captions.json"), JSON.stringify(result, null, 2));
console.log(`✓ Wrote src/captions.json (${scenes.length} scenes). Proofread it before Stage 4.`);
