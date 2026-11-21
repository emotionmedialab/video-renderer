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
  [22, "On", 8400],  // first loud bin after 7.76-8.42 pause
  [64, "So", 26450],  // loud after 25.84-26.46
  [82, "an", 33700],  // an: voice resumes 33.70
  [83, "engineered", 33850],  // engineered after an
  [90, "It", 37400],  // loud after 36.79-37.16
  [121, "Pivot-006", 51450],  // section head, loud after 50.82-51.48
  [129, "plus", 57050],  // loud after 56.86-57.05
  [135, "in", 60357],  // in: voice resumes 60.35
  [136, "the", 60470],  // the: un-stack from in
  [137, "bladder", 60580],  // bladder after the
  [146, "These", 63850],  // section-ish head, loud after 63.69-63.87
  [189, "After", 82050],  // loud after 81.71-81.96
  [200, "in", 86850],  // loud after 86.64-86.89
  [224, "On", 99000],  // loud after 98.46-99.03
  [242, "because", 106320],  // because: dip 106.30
  [243, "of", 106610],  // of: dip 106.60
  [244, "one.", 106700],  // one.: un-stack, speech ends 106.95
  [245, "These", 107500],  // These: voice resumes 107.50
  [250, "not", 110550],  // loud after 110.34-110.54
  [325, "in", 141400],  // loud after 141.16-141.43
  [359, "After", 155350],  // loud after 155.13-155.36
  [376, "A", 163000],  // A: voice resumes 163.00 (whisper put it in the pause)
  [377, "second", 163100],  // second after A
  [378, "application,", 163400],  // application: dip 163.35
  [384, "for", 166400],  // loud after 166.25-166.41
  [390, "Three", 169450],  // section head, loud after 168.97-169.34
  [397, "the", 173350],  // loud after 172.86-173.15
  [433, "That", 186600],  // loud after 186.25-186.59
  [426, "And", 183850],  // loud after 183.45-183.80
  [427, "a", 184200],  // dip 184.15 (emphasize cue)
  [428, "filing", 184260],  // f-fricative 184.25-184.40
  [454, "at", 194950],  // loud after 194.75-194.98
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
