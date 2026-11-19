// ⚠️ PER-VIDEO — EDIT THE PINS TABLE. Ships EMPTY. Even empty it is a CHECK: it exits 1
// and lists every pair of words whisper stacked on one onset, which you then pin.
// retime.mjs — pin word onsets that whisper AND snap-onsets got wrong, read off the
// VO's WAVEFORM (not the transcript). Run AFTER snap-onsets, BEFORE align:
//
//   transcribe -> fix-mishears -> snap-onsets src/silences.json -> retime -> align
//
// Why it exists (Novartis x BoomRay, 2026-09-26): anchor-audit reported 106/106 words
// "on a whisper token start" — TRUE, and useless, because the TOKENS were wrong. Three
// failure shapes snap-onsets cannot see or makes worse:
//   1. A token that starts just BEFORE a silence ("That's" at 2.00, silence 2.08-2.75):
//      snap only moves starts INSIDE a silence, so it is never touched.
//   2. A sentence-final word snapped BACK to the silence START ("read?" 35.64 -> 34.78,
//      "Brief." -> 50.75). The silence start is where the word ENDS, so the snap parks
//      its onset late — or, for "The read?", on the wrong side of the pause entirely.
//   3. Drift inside continuous speech ("Novartis" at 36.08 when it starts at 36.95);
//      no silence is involved, so nothing flags it.
// 27 pins on a 54.7s VO. The ones that mattered: a section opener 0.9s early, the
// emphasis phrase ~0.5s early, and two stacked words collapsed onto one onset.
//
// HOW TO READ ONSETS — the 50ms RMS profile. Speech resumes where the level jumps
// from ~-75 to ~-25 dB; a word boundary inside speech is a dip (~-35 to -55 dB):
//
//   ffmpeg -hide_banner -nostats -ss 33.8 -to 37.4 -i public/vo/vo.mp3 \
//     -af "asetnsamples=2205,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level" \
//     -f null - 2>&1 | grep -o "RMS_level=.*"
//
// (2205 samples = 50ms at 44.1kHz; each printed line is the next 50ms window from -ss.)
//
// The silences JSON snap-onsets needs ([startSec,endSec] pairs), from the same VO:
//   ffmpeg -i public/vo/vo.mp3 -af silencedetect=noise=-35dB:d=0.15 -f null - 2>&1
//   -> pair each silence_start with the next silence_end.
//
// Each pin: [token index in src/vo-words.json, the text it must carry (guard), new
// start ms]. The guard makes a stale index fail loudly instead of retiming the wrong
// word. Idempotent: re-running with the same table writes the same result.
// Then run anchor-audit.mjs — and scrub, because an audit of token starts cannot tell
// you the token was right.

import { readFileSync, writeFileSync } from "fs";
const F = "src/vo-words.json";
const v = JSON.parse(readFileSync(F, "utf8"));

const PINS = [
  // [index, "text", startMs],  // why: the silence / dip you read it from
  [80, "math,", 34850],  // speech resumes 34.60 after the "By" pause; "our" is short, "math" follows ~250ms in
  [110, "is", 49120],  // silence ends 49.01 on "It"; "is" follows; "a" is at 49.14
  [53, "in", 22150],  // 'in order.' is the loud run 22.15-22.55, after the 'money,' dip
  [54, "order.", 22300],  // same run
  [55, "$2.2", 23150],  // silence 22.69-23.19; whisper parked it 600ms early inside it
  [56, "billion", 23700],  // 'two point two' ~0.55s after 23.15
  [90, "J&J", 39150],  // silence 38.76-39.11; 'J' onset is the faint run from 39.1
  [195, "Ollin", 88450],  // comma dip 88.15-88.45 after 'edema,'
  [196, "reported", 88750],  // follows Ollin
  [220, "In", 98750],  // first loud bin after silence 98.08-98.47
  [246, "and", 110250],  // silence end 110.26 ('compelling,' pause)
  [287, "plus", 130800],  // silence end 130.80
  [290, "That", 133200],  // first loud bin after silence 132.66-132.95
  [302, "This", 138600],  // first loud bin after silence 138.17-138.63
  [316, "handing", 143550],  // first loud bin after silence 143.27-143.49
  [328, "If", 148500],  // first loud bin after silence 147.93-148.27
  [344, "And", 155300],  // silence end 155.31
  [379, "Then", 170550],  // silence end 170.58
  [403, "And", 179750],  // first loud bin after silence 179.22-179.62
  [441, "Subscribe", 194500],  // silence end 194.51
  [445, "Signal", 197800],  // silence end 197.78; whisper 440ms late
  [105, "The", 45800],  // section head: 'approvals.' runs to 45.25, silence 45.27-45.80
  [106, "drug", 45950],  // follows The
  [250, "Here", 111950],  // section head: silence 111.41-111.94, loud from 111.95
  [299, "Why", 137000],  // section head: loud from 137.00 after silence 136.49-137.01
  [366, "So", 164850],  // section head: silence end 164.87
  [428, "We", 189850],  // section head: silence end 189.89
];

for (const [i, text, ms] of PINS) {
  if (v[i].text !== text) { console.error(`GUARD FAIL [${i}] expected ${text}, got ${v[i].text}`); process.exit(1); }
  console.log(`  [${i}] ${text.padEnd(14)} ${v[i].start} -> ${ms}`);
  v[i].start = ms;
}
// ends: each word ends where the next starts (keeps the last word's own end)
for (let i = 0; i < v.length - 1; i++) v[i].end = Math.max(v[i].start, Math.min(v[i].end, v[i + 1].start));
for (const [i] of PINS) if (i > 0) v[i - 1].end = Math.min(v[i - 1].end, v[i].start);
// STRICTLY increasing: two words on one onset is a collapse, not a timing.
const mono = v.every((w, i) => i === 0 || w.start > v[i - 1].start);
console.log(`${PINS.length} pin(s). strictly increasing starts: ${mono ? "YES" : "NO — FIX"}`);
if (!mono) {
  v.forEach((w, i) => { if (i && w.start <= v[i - 1].start) console.log(`  collapse: [${i - 1}] ${v[i - 1].text} ${v[i - 1].start} | [${i}] ${w.text} ${w.start}`); });
  process.exit(1);
}
// NEAR-collapses: whisper stacks a short word on its neighbour a few ms apart ("A"/"gap" 8ms,
// "If"/"weekly" 7ms, "New"/"England" 2ms on the Onswik horizontal, 2026-09-27). Strictly
// increasing passes them, yet the second word is really 100-300ms later. Listed, not fatal:
// pin the ones that carry a cue (read the dip in rms-strip), leave the rest.
const near = v.map((w, i) => (i && w.start - v[i - 1].start < 80 ? i : -1)).filter((i) => i > 0);
if (near.length) {
  console.log(`  ${near.length} near-collapse(s) <80ms — pin any that carry a cue:`);
  near.forEach((i) => console.log(`    [${i - 1}] ${v[i - 1].text} ${v[i - 1].start} | [${i}] ${v[i].text} ${v[i].start} (+${v[i].start - v[i - 1].start}ms)`));
}
writeFileSync(F, JSON.stringify(v, null, 2));
