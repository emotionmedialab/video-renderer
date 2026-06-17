// Stage 5 — Fetch the b-roll for the approved plan.
// The "brain" (deciding concept + window per scene) happens upstream and is
// written to src/broll-plan.json; this script just fetches + records.
//
// src/broll-plan.json: [{ id, sceneKey, query, start, end }]  (start/end = displayed seconds)
// Env: PEXELS_API_KEY (required)

import fs from "node:fs";
import path from "node:path";

const KEY = process.env.PEXELS_API_KEY;
if (!KEY) {
  console.error("✗ Set PEXELS_API_KEY (free key at https://www.pexels.com/api/).");
  process.exit(1);
}

const planPath = path.join("src", "broll-plan.json");
if (!fs.existsSync(planPath)) {
  console.error(
    "✗ Missing src/broll-plan.json. Stage 5 writes it from the transcript, e.g.:\n" +
      JSON.stringify(
        [{ id: "s2_market", sceneKey: "scene2", query: "stock exchange building", start: 1.0, end: 6.0 }],
        null,
        2
      )
  );
  process.exit(1);
}

const MIN_ON_SCREEN = 5; // every b-roll shows >= 5s (keep source clips at least this long)
const INSERTS = JSON.parse(fs.readFileSync(planPath, "utf8"));
const dir = path.join("public", "broll");
fs.mkdirSync(dir, { recursive: true });

const out = [];
for (const ins of INSERTS) {
  const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(
    ins.query
  )}&orientation=portrait&per_page=10&size=medium`;
  const j = await (await fetch(url, { headers: { Authorization: KEY } })).json();
  const vids = (j.videos || []).filter((v) => v.height > v.width);
  const need = Math.max(MIN_ON_SCREEN, ins.end - ins.start);
  const pick = vids.find((v) => v.duration >= need) || vids[0];
  if (!pick) {
    console.log(`✗ no result: "${ins.query}"`);
    continue;
  }
  const file = pick.video_files
    .filter((f) => f.height >= f.width)
    .sort((a, b) => Math.abs((a.height || 0) - 1600) - Math.abs((b.height || 0) - 1600))[0];
  const buf = Buffer.from(await (await fetch(file.link)).arrayBuffer());
  fs.writeFileSync(path.join(dir, `${ins.id}.mp4`), buf);
  out.push({
    ...ins,
    file: `broll/${ins.id}.mp4`,
    pexelsId: pick.id,
    credit: pick.user?.name ?? "Pexels",
    pexelsUrl: pick.url,
  });
  console.log(`✓ ${ins.id} <- "${ins.query}" (${file.width}x${file.height}, ${pick.duration}s)`);
}

fs.writeFileSync(path.join("src", "broll.json"), JSON.stringify(out, null, 2));
// Pexels requires attribution — keep a credits list with the deliverable.
fs.writeFileSync(
  path.join("public", "broll", "CREDITS.txt"),
  out.map((b) => `${b.id}: video by ${b.credit} on Pexels — ${b.pexelsUrl}`).join("\n") + "\n"
);
console.log(`✓ Wrote src/broll.json + public/broll/CREDITS.txt (${out.length} clips)`);
