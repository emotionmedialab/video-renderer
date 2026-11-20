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
  [3, "Up", 2600],            // first loud bin after "dollars." dip (2.45-2.6)
  [4, "front.", 2800],        // second burst
  [5, "That's", 3600],        // first loud bin after 3.25-3.55 pause; whisper 200 late
  [30, "it.", 13550],         // snap parked it on the pause start (its end)
  [31, "CAR", 14300],         // section head; first loud bin 14.30, whisper 180 late
  [38, "Remove", 17100],      // first loud bin after 16.65-17.1 pause; whisper 280 late
  [47, "re-infuse,", 21500],  // snap pushed it 306 late; soft "re" from ~21.45
  [50, "bespoke.", 23400],    // burst after 23.3-23.4 gap; snap moved it back onto "slow"
  [51, "Starna's", 24450],    // first loud bin after pause; whisper 270 late
  [55, "engineer", 26550],    // first loud bin after pause; whisper 330 late
  [58, "inside", 28500],      // -48 dB dip at 28.45 then burst
  [62, "RNA.", 29800],        // snap parked it on the pause start (its end); speech ends 29.95
  [69, "It's", 32400],        // first loud bin after 32.2-32.4 pause
  [70, "autoimmune", 32650],  // burst after the 32.6 dip; whisper 170 late
  [105, "a", 46450],          // collapsed onto "platform"; ":: ++" bins 46.35-46.55
  [119, "free!", 52720],      // tail token sat on the file's last frame; burst at 52.75 after the 52.65 dip
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
