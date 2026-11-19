// motion-audit.mjs — audit ONE chunk's motion plan (src/motion-plan.json) BEFORE it is
// animated, so a flat / un-3D / busy chunk never reaches the operator. Exit 1 on any FAIL.
//
//   node scripts/motion-audit.mjs [--plan src/motion-plan.json] [--comp-file src/<Comp>.tsx] [--moves <MOVES.md>]
//
// Run from the PROJECT folder (timeline.json and the plan's paths resolve from the cwd).
// Checks:
//   1. the 3D camera is on (no `CAMERA_3D = false`, no `<Camera on={false}`, a <Camera> exists)
//      and every scene has at least one `camera` entry
//   2. no two MAIN moves launched together (cue → ms exactly as kit/core.tsx does, + durMs). Since 2026-11-16
//      (MOTION-RULES M1b, "the next move may start while the previous one settles") an overlap PASSES when the
//      later move starts after the earlier one is ≥60% done (its settle tail); earlier than that = FAIL.
//   3. at most 2 supports per scene (the frame budget)
//   4. no two consecutive scenes use the same `move`
//   5. at least one scene uses a `big: yes` move from references/MOVES.md
//   6. every `move` is in MOVES.md or prefixed `NEW:` (SKIP when MOVES.md is missing)
//   7. no banned element (BANNED below) in the composition file or the chunk's `kit` files
//
// Plan shape (the session writes one per chunk; `after` = ms, as in cue-checks.json):
// { "composition": "MyVideo", "chunk": 1, "kit": ["src/kit/myvideo1.tsx"],
//   "scenes": [ { "n": 1, "title": "carton drops", "peakFrame": 420, "world": "ink",
//     "hero": "carton", "supports": ["date", "label"], "move": "camera-dive",
//     "note": "camera dives to the carton on 'approved', lands square, still",
//     "camera": [ { "cue": "approved", "after": 17000 } ],
//     "movers": [ { "what": "carton", "cue": "approved", "after": 17000, "durMs": 600 } ] } ] }
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { homedir } from "os";

// kit names that implement banned elements (SKILL.md "ONE MOVER AT A TIME"; RETROSPECTIVE: no stamp rings)
const BANNED = [
  ["stamp/shock ring", /<Shock\b|<SignalPing\b/],
  ["looping breathe/glow", /<IconMotion\b(?![^>]*breathe=\{false\})/], // IconMotion breathes by default
  ["frame shake", /\w*[sS]hake\w*\s*=/],
];

const arg = (name, fb) => {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : fb;
};
const planPath = resolve(arg("--plan", "src/motion-plan.json"));
const plan = JSON.parse(readFileSync(planPath, "utf8"));
const scenes = plan.scenes ?? [];
if (!scenes.length) {
  console.log(`(no scenes in ${planPath} yet — write the chunk's plan before building it)`);
  process.exit(0);
}

const WORDS = JSON.parse(readFileSync(resolve("src/timeline.json"), "utf8")).words;
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
// verbatim port of cueMs() from kit/core.tsx (same as cue-audit.mjs)
function cueMs(phrase, afterMs = 0) {
  const target = phrase.split(/\s+/).filter(Boolean).map(norm).filter(Boolean);
  if (!target.length) return undefined;
  for (let i = 0; i < WORDS.length; i++) {
    if (WORDS[i].startMs < afterMs) continue;
    let ok = true;
    for (let k = 0; k < target.length; k++) {
      const a = norm(WORDS[i + k]?.raw ?? "");
      const b = target[k];
      if (!a || !(a === b || a.startsWith(b) || b.startsWith(a))) { ok = false; break; }
    }
    if (ok) return WORDS[i].startMs;
  }
  return undefined;
}
const t = (ms) => (ms / 1000).toFixed(2) + "s";

const rows = []; // [status, where, message]
const fail = (where, msg) => rows.push(["FAIL", where, msg]);

// ── 1. camera on ──────────────────────────────────────────────────────────
const compFile = resolve(arg("--comp-file", `src/${plan.composition}.tsx`));
const files = [compFile, ...(plan.kit ?? []).map((f) => resolve(f))];
const src = files.map((f) => {
  if (!existsSync(f)) { fail("files", `not found: ${f}`); return [f, ""]; }
  return [f, readFileSync(f, "utf8")];
});
const all = src.map(([, s]) => s).join("\n");
if (/CAMERA_3D\s*=\s*false/.test(all)) fail("camera", "CAMERA_3D = false (the 3D camera is off)");
if (/<Camera\s+on=\{false\}/.test(all)) fail("camera", "<Camera on={false}> (the 3D camera is off)");
if (!/<Camera\b/.test(all)) fail("camera", "no <Camera> in the composition or the chunk's kit files");

// ── 7. banned elements ────────────────────────────────────────────────────
for (const [f, s] of src) {
  s.split("\n").forEach((line, i) => {
    if (/^\s*(\/\/|\*)/.test(line)) return; // comments may name them
    for (const [label, re] of BANNED) if (re.test(line)) fail("banned", `${label} — ${f.split(/[\\/]/).pop()}:${i + 1}  ${line.trim().slice(0, 60)}`);
  });
}

// ── MOVES.md (another session owns it; missing → SKIP) ────────────────────
const here = dirname(fileURLToPath(import.meta.url));
const movesPath = [arg("--moves"), resolve(here, "..", "..", "references", "MOVES.md"), resolve(homedir(), ".claude/skills/long-form-builder/references/MOVES.md")].find((p) => p && existsSync(p));
const MOVES = new Map(); // id → big?
if (movesPath) {
  let id = null;
  for (const line of readFileSync(movesPath, "utf8").split("\n")) {
    const h = line.match(/^###\s+`([^`]+)`/);
    if (h) { id = h[1]; MOVES.set(id, false); continue; }
    const b = line.match(/^\W*big\W*:\s*(yes|no)/i);
    if (id && b) MOVES.set(id, b[1].toLowerCase() === "yes");
  }
}

// ── per scene ─────────────────────────────────────────────────────────────
let maxSim = 0, maxSimAt = "";
scenes.forEach((sc, idx) => {
  const where = `scene ${sc.n ?? idx + 1}`;
  if (!sc.camera?.length) fail(where, "no `camera` entry (every scene needs a camera move)");
  for (const c of sc.camera ?? []) if ((c.ms ?? cueMs(c.cue, c.after ?? 0)) === undefined) fail(where, `camera cue "${c.cue}" not found`);

  if ((sc.supports ?? []).length > 2) fail(where, `${sc.supports.length} supports (max 2): ${sc.supports.join(", ")}`);

  const prev = scenes[idx - 1];
  if (prev && prev.move && prev.move === sc.move) fail(where, `same move as the scene before: ${sc.move}`);

  if (movesPath && sc.move && !sc.move.startsWith("NEW:") && !MOVES.has(sc.move)) fail(where, `move "${sc.move}" not in MOVES.md (prefix NEW: to invent one)`);

  // movers → [start, end) windows
  const win = [];
  for (const m of sc.movers ?? []) {
    const at = m.ms ?? cueMs(m.cue, m.after ?? 0);
    if (at === undefined) { fail(where, `mover "${m.what}" cue "${m.cue}" not found`); continue; }
    const a = at + (m.offsetMs ?? 0); // offsetMs: a pinned lead or lag off the cue (e.g. -450 = lands ON the word; Bayer Sunharbo 2026-11-13)
    win.push({ what: m.what, a, b: a + (m.durMs ?? 0) });
  }
  for (let i = 0; i < win.length; i++)
    for (let j = i + 1; j < win.length; j++) {
      const [p, q] = [win[i], win[j]];
      if (!(p.a < q.b && q.a < p.b)) continue;
      const [e, l] = p.a <= q.a ? [p, q] : [q, p]; //  earlier / later launch
      const frac = e.b > e.a ? (l.a - e.a) / (e.b - e.a) : 0;
      if (frac < 0.6) fail(where, `movers launched together: ${e.what} ${t(e.a)}–${t(e.b)} × ${l.what} ${t(l.a)}–${t(l.b)} (starts at ${Math.round(frac * 100)}% of the first; settle overlap needs ≥60%)`);
    }
  for (const w of win) {
    const sim = win.filter((o) => o.a <= w.a && w.a < o.b).length;
    if (sim > maxSim) { maxSim = sim; maxSimAt = `${where} @ ${t(w.a)}`; }
  }
});


if (!movesPath) {
  rows.push(["SKIP", "moves", "references/MOVES.md not found — move names and big: yes not checked"]);
} else if (!scenes.some((sc) => MOVES.get(sc.move) === true)) {
  fail("chunk", "no scene uses a big: yes move from MOVES.md");
}

// ── report ────────────────────────────────────────────────────────────────
const fails = rows.filter((r) => r[0] === "FAIL").length;
console.log(`MOTION AUDIT · ${plan.composition} chunk ${plan.chunk} · ${scenes.length} scenes\n` + "=".repeat(78));
for (const [s, w, m] of rows) console.log(`${s.padEnd(6)}${w.padEnd(10)}${m}`);
if (rows.length) console.log("=".repeat(78));
const used = scenes.map((sc) => sc.move + (movesPath && MOVES.get(sc.move) ? " (big)" : "")).join(" → ");
console.log(`moves used: ${used}`);
console.log(`max simultaneous movers: ${maxSim}${maxSimAt ? ` (${maxSimAt})` : ""}`);
console.log(fails === 0 ? "PASS" : `FAIL — ${fails} problem(s)`);
process.exit(fails === 0 ? 0 : 1);
