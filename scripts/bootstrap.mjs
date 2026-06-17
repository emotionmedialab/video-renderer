// Step 0 — Make a fresh run buildable on any machine. Auto-fixes the safe
// things (npm install, rspack native binary); detects + instructs for the
// system tools (ffmpeg, Whisper). Run once per run folder.

import { execSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ok = (m) => console.log(`✓ ${m}`);
const warn = (m) => console.log(`!  ${m}`);

// 1) npm install
if (!fs.existsSync("node_modules")) {
  console.log("→ npm install …");
  execSync("npm install", { stdio: "inherit" });
}
ok("dependencies installed");

// 2) rspack native binary (npm's optional-deps bug drops it sometimes)
const triple = {
  "win32-x64": "win32-x64-msvc",
  "darwin-arm64": "darwin-arm64",
  "darwin-x64": "darwin-x64",
  "linux-x64": "linux-x64-gnu",
  "linux-arm64": "linux-arm64-gnu",
}[`${process.platform}-${process.arch}`];
try {
  const ver = JSON.parse(fs.readFileSync("node_modules/@rspack/binding/package.json")).version;
  const pkg = `@rspack/binding-${triple}`;
  if (triple && !fs.existsSync(path.join("node_modules", "@rspack", `binding-${triple}`))) {
    console.log(`→ installing ${pkg}@${ver} …`);
    execSync(`npm install --no-save ${pkg}@${ver}`, { stdio: "inherit" });
  }
  ok(`rspack binary (${triple})`);
} catch {
  warn("could not verify @rspack/binding — render may need the platform binary");
}

// 3) ffmpeg (used by analyze + transcribe + finalize)
const ff = process.env.FFMPEG_BIN ? path.join(process.env.FFMPEG_BIN, "ffmpeg") : "ffmpeg";
if (spawnSync(ff, ["-version"], { encoding: "utf8" }).status === 0) {
  ok("ffmpeg found");
} else {
  warn(
    "ffmpeg NOT found. Install it, then set FFMPEG_BIN if it's not on PATH:\n" +
      "   macOS:   brew install ffmpeg\n" +
      "   Windows: winget install --id Gyan.FFmpeg --source winget\n" +
      "   Linux:   sudo apt install ffmpeg"
  );
}

// 4) Whisper cache (transcribe.mjs installs on first run; just report)
const isWin = process.platform === "win32";
const wdir =
  process.env.WHISPER_DIR ?? (isWin ? "C:\\rw\\whisper" : "~/.cache/biointel-whisper");
console.log(`i  Whisper model caches at ${wdir} (downloaded once, reused weekly).`);
if (isWin) console.log("i  Windows: keep the Whisper path space-free (default C:\\rw\\whisper).");

console.log("\n✓ Bootstrap done. Next: add clips to public/, then npm run transcribe.");
