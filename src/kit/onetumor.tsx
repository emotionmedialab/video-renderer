// ─────────────────────────────────────────────────────────────────────────
// KIT · onetumor — ONE PATIENT, ONE TUMOR, ONE mRNA. Added on the Merck × Moderna
// intismeran LONG-FORM, 2026-11-02 (HORIZONTAL 16:9, the white card). One section, one
// chain of travelling elements: a crowd falls away from one person, the tumor bursts out
// of them and travels to head its DNA, a scan pulls up to 34 marks off the strand, those
// marks fly into a single mRNA, the mRNA pours into the immune system, a DASHED line
// (the aim, not a result) runs back to the tumor, then the therapy seats on Keytruda.
// Grammar: solid = reported; dashed = the aim. The strand bars are schematic, never data.
// Absolute 1920×1080 seats; import by path. One mover per cue; a finished idea retires.
//
// `OneTumor` goes inside the Camera; `OneTumorCaption` is screen-fixed, outside it.
// ─────────────────────────────────────────────────────────────────────────

import React from "react";
import { AbsoluteFill } from "remotion";
import { CLAMP, clamp01, COLORS, DISPLAY, TRACK, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { useP3, useZ } from "./camera";
import { back, EASE, EASE_IO, fadeOut, hump } from "./plusone";
import { FlyWord, thud } from "./split";

const rnd = (i: number) => { const x = Math.sin(i * 12.9898 + 4.1) * 43758.5453; return x - Math.floor(x); };

// an irregular smooth blob, radius ~100, centred on 0,0
const BLOB = (() => {
  const pts = Array.from({ length: 11 }, (_, i) => {
    const a = (i / 11) * Math.PI * 2, r = 100 * (0.76 + 0.36 * rnd(i + 3));
    return [Math.cos(a) * r, Math.sin(a) * r];
  });
  const mid = (a: number[], b: number[]) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const m0 = mid(pts[10], pts[0]);
  return `M${m0[0]},${m0[1]} ` + pts.map((p, i) => { const m = mid(p, pts[(i + 1) % 11]); return `Q${p[0]},${p[1]} ${m[0]},${m[1]}`; }).join(" ") + " Z";
})();

export const SEAT = {
  grid: { cols: 15, rows: 7, cell: 92, x: 270, y: 158, hero: { c: 7, r: 3 } },
  strand: { x: 230, n: 170, pitch: 9, w: 6, h: 90, top: 240, bottom: 430 },
  ribbon: { x: 432, gap: 32, y: 415, h: 110 },
  cell: { x: 470, y: 470, r: 120 },
  blob: { x: 1450, y: 470 },
  bar: { w: 1100, h: 170, top: 570 }, plug: { w: 720, h: 170 },
};
const N_MARKS = 34;
const MARKS = Array.from({ length: N_MARKS }, (_, j) => Math.min(169, Math.floor((j + 0.1 + 0.8 * rnd(j + 40)) * 5)));

export const OneTumor: React.FC<Win & {
  opener: ({ text: string } & Cued)[]; openerOut: Cued;
  crowd: Cued; one: Cued; tumor: Cued; travel: Cued; // the blob leaves for the strand on a pin in the pause
  tumorDna: { text: string } & Cued; compared: Cued; normalDna: { text: string } & Cued;
  scan: Cued; scanEnd: Cued; count: { value: number; lead: string }; marksLabel: { text: string } & Cued;
  encoded: Cued; single: { text: string } & Cued;
  aimMove: Cued; teach: Cued; immune: { text: string } & Cued; recognize: Cued; lock: { text: string } & Cued; aimOut: Cued;
  given: { text: string } & Cued; keytruda: { text: string } & Cued; sub: { text: string } & Cued;
}> = ({ from, to, opener, openerOut, crowd, one, tumor, travel, tumorDna, compared, normalDna, scan, scanEnd, count, marksLabel, encoded, single, aimMove, teach, immune, recognize, lock, aimOut, given, keytruda, sub }) => {
  const ms = useMs();
  const k = useK();
  const Z = useZ();
  const P3 = useP3();
  const INK = COLORS.ink;
  const RED = COLORS.accent;
  const G = SEAT.grid, S = SEAT.strand, R = SEAT.ribbon, C = SEAT.cell, B = SEAT.blob;

  const tOO = at(openerOut, from + 1400, from);
  const tCrowd = at(crowd, tOO + 500, from, tOO);
  const tOne = at(one, tCrowd + 1800, from, tCrowd);
  const tTum = at(tumor, tOne + 800, from, tOne);
  const tTrav = at(travel, tTum + 500, from, tTum);
  const tDna = at(tumorDna, tTrav + 700, from, tTrav);
  const tCmp = at(compared, tDna + 900, from, tDna);
  const tNorm = at(normalDna, tCmp + 1600, from, tCmp);
  const tScan = at(scan, tNorm + 1200, from, tNorm);
  const tScanE = at(scanEnd, tScan + 700, from, tScan + 300);
  const tLbl = at(marksLabel, tScanE, from, tScanE);
  const tEnc = at(encoded, tLbl + 1800, from, tLbl);
  const tSingle = at(single, tEnc + 650, from, tEnc);
  const tAim = at(aimMove, tSingle + 1200, from, tSingle);
  const tTeach = at(teach, tAim + 900, from, tAim);
  const tImm = at(immune, tTeach + 600, from, tTeach);
  const tRec = at(recognize, tImm + 1100, from, tImm);
  const tLock = at(lock, tRec + 1000, from, tRec);
  const tAimO = at(aimOut, tLock + 400, from, tLock);
  const tGiven = at(given, tAimO + 500, from, tAimO);
  const tKey = at(keytruda, tGiven + 1000, from, tGiven);
  const tSub = at(sub, tKey + 900, from, tKey);
  const vis = fadeOut(ms, to);
  if (ms < from - 40 || vis <= 0) return null;

  const dScan = Math.max(400, tScanE - tScan - 40);
  const scanQ = EASE_IO(k(tScan, dScan));
  const strandsOut = k(tEnc, 260);
  const ribbonOut = EASE_IO(k(tTeach, 700));
  const aimOutQ = k(tAimO, 280);

  // ── the blob: the one element that travels the whole section ──
  const bornS = back(k(tTum, 420)) * 0.5;
  const tv = EASE_IO(k(tTrav, 480));
  const tv2 = EASE_IO(k(tAim, 620));
  const heroX = G.x + G.hero.c * G.cell + 46, heroY = G.y + G.hero.r * G.cell + 56;
  const blobX = lerp(lerp(heroX, 170, tv), B.x, tv2);
  const blobY = lerp(lerp(heroY, 285, tv), B.y, tv2);
  const blobS = lerp(lerp(bornS, 0.42, tv), 1, tv2);
  const lockQ = k(tLock, 260);
  const lockDip = thud(k(tLock + 260, 500));

  const Person: React.FC<{ color: string; style: React.CSSProperties }> = ({ color, style }) => (
    <div style={{ position: "absolute", width: 72, height: 80, ...style }}>
      <div style={{ position: "absolute", left: 20, top: 0, width: 32, height: 32, borderRadius: 16, background: color }} />
      <div style={{ position: "absolute", left: 8, top: 38, width: 56, height: 42, borderRadius: "26px 26px 8px 8px", background: color }} />
    </div>
  );

  return (
    <AbsoluteFill style={{ opacity: vis, ...P3 }}>
      {/* ── "Start with what it is." flies out of the lens, and on through it ── */}
      {ms < tOO + 340 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 440, display: "flex", justifyContent: "center", gap: 28, opacity: 1 - k(tOO, 280),
          transform: `${Z(lerp(0, 900, EASE_IO(k(tOO, 320))))}`, ...P3 }}>
          {opener.map((o) => <FlyWord key={o.text} text={o.text} t={at(o, from, from)} size={124} color={INK} shade="#c9c9c9" stagger={26} dur={280} />)}
        </div>
      ) : null}

      {/* ── the crowd rises in a wave from the centre; on "one" everyone else drops away ── */}
      {ms >= tCrowd - 40 && ms < tTrav + 400 ? (
        <div style={{ position: "absolute", inset: 0, ...P3 }}>
          {Array.from({ length: G.cols * G.rows }, (_, i) => {
            const c = i % G.cols, r = Math.floor(i / G.cols);
            const hero = c === G.hero.c && r === G.hero.r;
            const d = Math.hypot(c - G.hero.c, r - G.hero.r);
            const a = tCrowd + d * 62;
            const q = EASE(k(a, 340));
            const drop = hero ? 0 : EASE_IO(k(tOne + d * 16 + rnd(i) * 90, 380));
            const out = hero ? k(tTrav, 300) : drop;
            if (out >= 1) return null;
            return <Person key={i} color={hero && ms >= tOne ? INK : "#b9b9b9"}
              style={{ left: G.x + c * G.cell + 10, top: G.y + r * G.cell + 6, opacity: k(a, 80) * (1 - out),
                transform: `${Z(lerp(-900, 0, q) - drop * 1400)}` }} />;
          })}
        </div>
      ) : null}

      {/* ── the two strands ── */}
      {ms >= tDna - 40 && strandsOut < 1 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - strandsOut }}>
          <div style={{ position: "absolute", left: S.x, top: S.top - 62, fontFamily: DISPLAY, fontWeight: 700, fontSize: 44, letterSpacing: TRACK.headline, lineHeight: 1, color: INK, whiteSpace: "nowrap", opacity: k(tDna, 100) }}>{tumorDna.text}</div>
          <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            {Array.from({ length: S.n }, (_, i) => {
              const a = tDna + i * 3.4;
              const h = S.h * (0.55 + 0.45 * rnd(i));
              return MARKS.includes(i) ? null : <rect key={i} x={S.x + i * S.pitch} y={S.top + (S.h - h) / 2} width={S.w} height={h} fill={INK} opacity={k(a, 90)} transform={`translate(0 ${lerp(-120, 0, EASE(k(a, 240)))})`} />;
            })}
            {/* dashed on "compared" (a slot waiting), solid on "normal DNA" */}
            {ms >= tCmp ? <rect x={S.x - 12} y={S.bottom - 6} width={S.n * S.pitch + 18} height={S.h + 12} rx={10} fill="none" stroke={INK} strokeWidth={3} strokeDasharray="14 12" opacity={k(tCmp, 200) * (1 - k(tNorm, 200))} /> : null}
            {Array.from({ length: S.n }, (_, i) => {
              const a = tNorm + (S.n - i) * 2.4;
              const h = S.h * (0.55 + 0.45 * rnd(i));
              return <rect key={i} x={S.x + i * S.pitch} y={S.bottom + (S.h - h) / 2} width={S.w} height={h} fill="#9c9c9c" opacity={k(a, 90)} transform={`translate(0 ${lerp(120, 0, EASE(k(a, 240)))})`} />;
            })}
          </svg>
          <div style={{ position: "absolute", left: S.x, top: S.bottom - 62, fontFamily: DISPLAY, fontWeight: 700, fontSize: 44, letterSpacing: TRACK.headline, lineHeight: 1, color: "#6b6b6b", whiteSpace: "nowrap", opacity: k(tNorm, 100) }}>{normalDna.text}</div>
          {/* the scan: a red blade across both strands, on screen only while it moves */}
          {scanQ > 0 && scanQ < 1 ? <div style={{ position: "absolute", left: lerp(S.x, S.x + S.n * S.pitch, scanQ), top: S.top - 30, width: 7, height: S.bottom + S.h - S.top + 60, background: RED }} /> : null}
          {/* the count + its label, in one row, laid out by the string */}
          <div style={{ position: "absolute", left: S.x, top: 590, display: "flex", alignItems: "baseline", gap: 26, opacity: k(tScan, 80) }}>
            <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 72, letterSpacing: TRACK.headline, color: INK, whiteSpace: "nowrap" }}>{count.lead}</span>
            <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 190, lineHeight: 1, letterSpacing: TRACK.display, color: RED, fontVariantNumeric: "tabular-nums" }}>{Math.round(1 + (count.value - 1) * scanQ)}</span>
            <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 60, letterSpacing: TRACK.headline, color: INK, whiteSpace: "nowrap", opacity: k(tLbl, 120) }}>{marksLabel.text}</span>
          </div>
        </div>
      ) : null}

      {/* ── the marks: each lights as the blade crosses it, flies into the mRNA, then pours into the cell ── */}
      {ms >= tDna - 40 && ribbonOut < 1 ? (
        <div style={{ position: "absolute", inset: 0, ...P3 }}>
          {MARKS.map((idx, i) => {
            const a = tDna + idx * 3.4;
            const hit = tScan + (idx / S.n) * dScan;
            const lit = ms >= hit;
            const up = back(k(hit, 240));
            const f = EASE_IO(k(tEnc + i * 12, 620));
            const p = EASE_IO(k(tTeach + i * 9, 460));
            const sx = S.x + idx * S.pitch, sy = S.top - up * 16;
            const rx = R.x + i * R.gap, ry = R.y;
            const x = lerp(lerp(sx, rx, f), C.x, p);
            const y = lerp(lerp(sy, ry, f), C.y - 50, p);
            const w = lerp(S.w, 10, f);
            const h = lerp(S.h, R.h, f) * (1 - p);
            return <div key={i} style={{ position: "absolute", left: x, top: y, width: w, height: h, background: lit ? RED : INK, opacity: k(a, 90),
              transform: `${Z(up * 60 * (1 - f) + hump(f) * 520)}rotateZ(${hump(f) * (i % 2 ? 40 : -40)}deg)` }} />;
          })}
          {/* the spine of the mRNA draws under the marks once they have arrived */}
          <div style={{ position: "absolute", left: R.x, top: R.y + R.h / 2 - 4, width: (N_MARKS - 1) * R.gap + 10, height: 8, background: RED, transformOrigin: "0% 50%",
            transform: `scaleX(${EASE_IO(k(tSingle, 360)) * (1 - ribbonOut)})` }} />
        </div>
      ) : null}
      {ms >= tSingle - 40 && ms < tAim + 300 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 590, textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: 104, letterSpacing: TRACK.headline, lineHeight: 1, color: INK,
          opacity: k(tSingle, 100) * (1 - k(tAim, 240)), transform: `translateY(${lerp(30, 0, EASE(k(tSingle, 260)))}px)` }}>
          {single.text}
        </div>
      ) : null}

      {/* ── the aim: the cell takes the mRNA in, a DASHED line runs to the tumor, the sight locks ── */}
      {ms >= tImm - 40 && aimOutQ < 1 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - aimOutQ, ...(aimOutQ === 0 ? P3 : {}) }}>
          <div style={{ position: "absolute", left: C.x - C.r, top: C.y - C.r, width: C.r * 2, height: C.r * 2, borderRadius: C.r, background: INK, transform: `scale(${back(k(tImm, 340))})` }} />
          <div style={{ position: "absolute", left: C.x - 300, width: 600, top: C.y + C.r + 34, textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: 60, letterSpacing: TRACK.headline, lineHeight: 1, color: INK, opacity: k(tImm, 120) }}>{immune.text}</div>
          <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <defs><clipPath id="aim-line"><rect x={C.x + C.r + 14} y={C.y - 20} width={(B.x - 172 - (C.x + C.r + 14)) * EASE_IO(k(tRec, Math.max(300, tLock - tRec - 60)))} height={40} /></clipPath></defs>
            <line x1={C.x + C.r + 14} y1={C.y} x2={B.x - 172} y2={C.y} stroke={INK} strokeWidth={8} strokeDasharray="26 20" clipPath="url(#aim-line)" />
            {lockQ > 0 ? (
              <g transform={`translate(${B.x} ${B.y}) scale(${lerp(2.1, 1, EASE(lockQ)) * (1 - lockDip * 0.05)})`} opacity={k(tLock, 90)}>
                <circle r={166} fill="none" stroke={INK} strokeWidth={8} />
                {[0, 90, 180, 270].map((d) => <line key={d} x1={150} x2={196} y1={0} y2={0} stroke={INK} strokeWidth={8} transform={`rotate(${d})`} />)}
              </g>
            ) : null}
          </svg>
          <div style={{ position: "absolute", left: B.x - 300, width: 600, top: B.y + 212, textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: 60, letterSpacing: TRACK.headline, lineHeight: 1, color: INK, opacity: k(tLock, 120) }}>{lock.text}</div>
        </div>
      ) : null}

      {/* ── the blob, on top of everything until the aim retires ── */}
      {ms >= tTum - 40 && aimOutQ < 1 ? (
        <svg width={240} height={240} viewBox="-120 -120 240 240" style={{ position: "absolute", left: blobX - 120, top: blobY - 120, overflow: "visible", opacity: 1 - aimOutQ,
          transform: `${Z(40)}scale(${blobS})` }}>
          <path d={BLOB} fill={RED} />
        </svg>
      ) : null}

      {/* ── the seat: the therapy flies in from the lens and drops onto Keytruda ── */}
      {ms >= tGiven - 40 ? (() => {
        const P = SEAT.plug, Bar = SEAT.bar;
        const fly = EASE(k(tGiven, 520));
        const drop = EASE_IO(k(tKey + 240, 300));
        const dip = thud(k(tKey + 540, 480));
        const hoverTop = Bar.top - P.h - 170;
        return (
          <div style={{ position: "absolute", inset: 0, ...P3 }}>
            <div style={{ position: "absolute", left: 960 - Bar.w / 2, top: Bar.top + dip * 12, width: Bar.w, height: Bar.h, borderRadius: 18, background: INK, display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: DISPLAY, fontWeight: 700, fontSize: 84, letterSpacing: TRACK.headline, color: COLORS.paper, opacity: k(tKey, 80), transformOrigin: "50% 100%", transform: `rotateX(${lerp(-85, 0, clamp01(back(k(tKey, 300))))}deg)` }}>
              {keytruda.text}
            </div>
            <div style={{ position: "absolute", left: 960 - P.w / 2, top: lerp(hoverTop, Bar.top - P.h, drop) + dip * 12, width: P.w, height: P.h, borderRadius: "18px 18px 0 0", background: RED, display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: DISPLAY, fontWeight: 700, fontSize: 84, letterSpacing: TRACK.headline, color: COLORS.paper, opacity: k(tGiven, 80), transformOrigin: "50% 100%",
              transform: `${Z(lerp(1100, 0, fly))}rotateY(${lerp(-40, 0, fly)}deg) scaleY(${1 - dip * 0.1})` }}>
              {given.text}
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: Bar.top + Bar.h + 38, textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: 56, letterSpacing: TRACK.headline, lineHeight: 1, color: "#6b6b6b", opacity: k(tSub, 120) }}>{sub.text}</div>
          </div>
        );
      })() : null}
    </AbsoluteFill>
  );
};

/** Screen-fixed lines (they do not ride the camera's push-in). */
export const OneTumorCaption: React.FC<{ from: number; rows: { top: number; out: Cued; size: number; words: ({ text: string } & Cued)[] }[] }> = ({ from, rows }) => {
  const ms = useMs();
  const k = useK();
  return (
    <AbsoluteFill>
      {rows.map((row, r) => {
        const tOut = at(row.out, from + 5000, from);
        if (ms > tOut + 300) return null;
        return (
          <div key={r} style={{ position: "absolute", left: 0, right: 0, top: row.top, display: "flex", justifyContent: "center", gap: 18, opacity: 1 - k(tOut, 260) }}>
            {row.words.map((w) => {
              const a = at(w, from, from);
              return <div key={w.text} style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: row.size, letterSpacing: TRACK.headline, lineHeight: 1, color: COLORS.ink, whiteSpace: "nowrap", opacity: k(a, 90), transform: `translateY(${lerp(22, 0, EASE(k(a, 220)))}px)` }}>{w.text}</div>;
            })}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
