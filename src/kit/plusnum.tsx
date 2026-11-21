// ─────────────────────────────────────────────────────────────────────────
// KIT · plusnum — THE THREE-ARM CHART, the second spine of the ABBV-466
// long-form (2026-10-25, HORIZONTAL 16:9). Absolute 1920×1080 seats; import by
// path. Same rules and 3D grammar as kit/plusone.
//
// `NumbersChart` (white card): the endpoint is defined on a card that then
// COLLAPSES into the week pill; three columns rise as their figures are voiced;
// the pill flips to week 24, trosunilimab (whose week-24 figure is not spoken)
// sinks out, the other two rise; the gap is a bracket that stretches from "~9"
// to "~18 pts" while the red slice fills (our arithmetic, so always "~");
// serious adverse events arrive on a black card from depth, three 1-in-10 rows.
// The chart's geometry is exported (`CHART`) so §6 redraws it on the same seats.
// ─────────────────────────────────────────────────────────────────────────

import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, COLORS, DISPLAY, INK_SUB, TRACK, caps, inkA, useMs } from "./core";
import { TYPE } from "../style";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { useP3, useZ } from "./camera";
import { back, EASE, EASE_IO, fadeOut, FlipFaces, fmt, hump } from "./plusone";

// 1% = 14px; 40.5% stands 567px tall above the baseline at 820.
export const CHART = { base: 820, pxPer: 14, colW: 240, xs: [560, 960, 1360], nameTop: 846, figSize: 84, kickTop: 90, pill: { x: 1440, y: 84, w: 250, h: 76 }, bracketX: 400 };
export const levelY = (v: number) => CHART.base - v * CHART.pxPer;

const WeekFace: React.FC<{ t: string }> = ({ t }) => (
  <div style={{ position: "absolute", inset: 0, borderRadius: 38, background: COLORS.ink, color: COLORS.paper, display: "flex", alignItems: "center",
    justifyContent: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: 46, letterSpacing: TRACK.headline, whiteSpace: "nowrap" }}>Week&nbsp;{t}</div>
);

type Arm ={ name: string; v12: number; v24?: number; red?: boolean; d12: number };

export const NumbersChart: React.FC<Win & {
  kicker: { text: string } & Cued;
  def: { kicker: string; title: string; chips: string[]; word?: string; ms?: number; chipCues: Cued[] };
  arms: (Arm & { word?: string; ms?: number; end?: Cued })[]; // each rises from its figure's word to the next
  week: { from: string; to: string } & Cued; // the pill flips, the arm without a week-24 figure sinks
  rise24: (Cued & { end: Cued })[]; // per arm with v24, in arm order
  gap: { from: string; to: string } & Cued; // the bracket appears at week-12 size…
  gapGrow: Cued; // …and stretches to week-24 size while the red fills
  sae: { title: string; chip: string; rows: string[]; chipWord?: string; chipMs?: number; outWord?: string; outMs?: number } & Cued; // the card leaves on out
  kickerOut?: Cued; // the section kicker hands over (§6 brings its own)
  retire?: Cued; // the whole chart flies back into depth (§6 page 2)
}> = ({ from, to, kicker, def, arms, week, rise24, gap, gapGrow, sae, kickerOut, retire }) => {
  const ms = useMs();
  const k = useK();
  const Z = useZ();
  const P3 = useP3();
  const INK = COLORS.ink;
  const RED = COLORS.accent;
  const C = CHART;

  const tKick = at(kicker, from + 40, from);
  const tDef = at(def, tKick + 1400, from, tKick + 300);
  let p = tDef;
  const tChip = def.chipCues.map((c) => (p = at(c, p + 2000, from, p + 300)));
  const tArm: number[] = [];
  const tArmEnd: number[] = [];
  arms.forEach((a, i) => {
    tArm[i] = at(a, (i ? tArmEnd[i - 1] : p) + 1200, from, (i ? tArmEnd[i - 1] : p) + 200);
    tArmEnd[i] = at(a.end ?? {}, tArm[i] + 900, from, tArm[i] + 400);
  });
  const tWeek = at(week, tArmEnd[arms.length - 1] + 1000, from, tArmEnd[arms.length - 1]);
  const t24: number[] = [];
  const t24End: number[] = [];
  let q = tWeek;
  rise24.forEach((r, i) => { t24[i] = at(r, q + 1200, from, q + 300); t24End[i] = at(r.end, t24[i] + 900, from, t24[i] + 400); q = t24End[i]; });
  const tGap = at(gap, q + 1500, from, q + 200);
  const tGrow = at(gapGrow, tGap + 900, from, tGap + 400);
  const tSae = at(sae, tGrow + 1300, from, tGrow + 400);
  const tSaeChip = at({ word: sae.chipWord, ms: sae.chipMs }, tSae + 2500, from, tSae + 600);
  const tSaeOut = at({ word: sae.outWord, ms: sae.outMs }, tSaeChip + 2000, from, tSaeChip + 600);
  const tKickOut = kickerOut ? at(kickerOut, to, from, tKick + 300) : Infinity;
  const tRetire = retire ? at(retire, to, from, tKick + 300) : Infinity;
  const retK = EASE_IO(k(tRetire, 620));
  const vis = fadeOut(ms, to) * (1 - clamp01(retK * 1.2));
  if (ms < tKick - 60 || vis <= 0) return null;

  // ── the definition card: flips up from flat; on the first figure it COLLAPSES into the pill seat
  const defIn = k(tDef, 560);
  const collapse = EASE_IO(k(tArm[0] - 200, 620));
  const cardCX = 960, cardCY = 440, cardW = 1240, cardH = 420;
  const pillCX = C.pill.x + C.pill.w / 2, pillCY = C.pill.y + C.pill.h / 2;
  const cardX = lerp(cardCX, pillCX, collapse), cardY = lerp(cardCY, pillCY, collapse);
  const cardSX = lerp(1, C.pill.w / cardW, collapse), cardSY = lerp(1, C.pill.h / cardH, collapse);
  const pillO = clamp01((collapse - 0.85) * 8);
  const flip = EASE_IO(k(tWeek, 560));

  // ── column values
  const valOf = (i: number) => {
    const a = arms[i];
    const r12 = EASE_IO(k(tArm[i], Math.max(500, tArmEnd[i] - tArm[i] - 150)));
    let v = a.v12 * r12;
    const j = arms.slice(0, i + 1).filter((x) => x.v24 != null).length - 1;
    if (a.v24 != null && j >= 0) v = a.v12 + (a.v24 - a.v12) * EASE_IO(k(t24[j], Math.max(500, t24End[j] - t24[j] - 150)));
    if (a.v24 == null) v *= 1 - EASE_IO(k(tWeek + 150, 520)); // no week-24 figure spoken: it sinks out
    return { v, r12 };
  };

  // ── the gap bracket: between the risankizumab level and the combination level, on the left of the combination
  const combo = valOf(0).v, ris = valOf(1).v;
  const gapK = EASE(k(tGap, 420));
  const growK = EASE_IO(k(tGrow, 700));
  // the bracket shows the WEEK-12 gap first (dashed ticks at those levels), then stretches to week 24
  const loV = lerp(arms[1].v12, arms[1].v24 ?? arms[1].v12, growK);
  const hiV = lerp(arms[0].v12, arms[0].v24 ?? arms[0].v12, growK);
  const gapNum = lerp(Number(gap.from), Number(gap.to), growK);
  const slice = growK; // the red slice fills as it stretches

  // ── SAE card
  const saeK = k(tSae, 700);
  const outK = EASE_IO(k(tSaeOut, 520));
  const saeO = clamp01(saeK * 3) * (1 - outK);
  const chartDim = lerp(1, 0.25, EASE(k(tSae, 500)) * (1 - outK));

  const colLeft = (i: number) => C.xs[i] - C.colW / 2;

  return (
    <AbsoluteFill style={{ opacity: vis, ...P3, transform: Z(-1200 * retK) || undefined }}>
      {/* kicker */}
      <div style={{ position: "absolute", left: 120, top: C.kickTop + 18, ...caps(INK, TYPE.label + 6), opacity: clamp01(k(tKick, 260) * 2) * chartDim * (1 - k(tKickOut, 200)) }}>{kicker.text}</div>

      {/* the chart (dims under the SAE card) */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: chartDim }}>
        {/* baseline draws on the first figure */}
        <div style={{ position: "absolute", left: 300, top: C.base, height: 6, borderRadius: 3, background: INK, width: 1320 * EASE_IO(k(tArm[0] - 150, 500)) }} />
        {arms.map((a, i) => {
          const { v, r12 } = valOf(i);
          if (ms < tArm[i] - 60 || v <= 0.01) return null;
          const h = v * C.pxPer;
          // the rise overshoots a touch and settles (a spring on a weighted column)
          const over = 1 + 0.06 * hump(clamp01(r12 * 1.2 - 0.1)) * (r12 < 1 ? 1 : 0);
          const redH = i === 0 ? Math.max(0, (combo - ris)) * C.pxPer * slice : 0;
          return (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: colLeft(i), top: C.base - h * over, width: C.colW, height: h * over, borderRadius: "16px 16px 0 0",
                background: INK, overflow: "hidden" }}>
                {redH > 0 ? <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: redH, background: RED }} /> : null}
              </div>
              <div style={{ position: "absolute", left: C.xs[i] - 200, width: 400, top: C.base - h * over - C.figSize - 18, textAlign: "center", fontFamily: DISPLAY,
                fontWeight: 700, fontSize: C.figSize, letterSpacing: TRACK.display, lineHeight: 1, color: INK, fontVariantNumeric: "tabular-nums",
                opacity: clamp01(k(tArm[i] - 40, 140) * 2) }}>
                {fmt(v, a.d12)}%
              </div>
              <div style={{ position: "absolute", left: C.xs[i] - 220, width: 440, top: C.nameTop, textAlign: "center", fontFamily: DISPLAY, fontWeight: 700,
                fontSize: 40, letterSpacing: TRACK.headline, color: a.red ? RED : INK, whiteSpace: "nowrap", opacity: clamp01(k(tArm[i], 300) * 2),
                transformOrigin: "50% 0%", transform: `rotateX(${lerp(90, 0, back(k(tArm[i], 520)))}deg)` }}>
                {a.name}
              </div>
            </React.Fragment>
          );
        })}

        {/* the gap bracket: dashed reference from the risankizumab top, a red bracket, the "~N pts" label */}
        {gapK > 0 ? (
          <>
            <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: gapK }}>
              <line x1={C.bracketX + 10} y1={levelY(loV)} x2={colLeft(1)} y2={levelY(loV)} stroke={inkA(0.5)} strokeWidth={4} strokeDasharray="12 10" />
              <line x1={C.bracketX + 10} y1={levelY(hiV)} x2={colLeft(0)} y2={levelY(hiV)} stroke={inkA(0.5)} strokeWidth={4} strokeDasharray="12 10" />
              <path d={`M ${C.bracketX + 30} ${levelY(hiV)} L ${C.bracketX} ${levelY(hiV)} L ${C.bracketX} ${levelY(loV)} L ${C.bracketX + 30} ${levelY(loV)}`}
                fill="none" stroke={RED} strokeWidth={8} strokeLinejoin="round" />
            </svg>
            <div style={{ position: "absolute", left: C.bracketX - 260, width: 240, top: (levelY(loV) + levelY(hiV)) / 2 - 40, textAlign: "right",
              fontFamily: DISPLAY, fontWeight: 700, fontSize: 64, letterSpacing: TRACK.headline, lineHeight: 1, color: RED, opacity: gapK,
              transform: `${Z(lerp(400, 0, gapK))}` }}>
              ~{Math.round(gapNum)}
              <div style={{ ...caps(RED, TYPE.label), marginTop: 6 }}>points</div>
            </div>
          </>
        ) : null}
      </div>

      {/* the definition card → the week pill */}
      {collapse < 1 && ms >= tDef - 60 ? (
        <div style={{ position: "absolute", left: cardX - cardW / 2, top: cardY - cardH / 2, width: cardW, height: cardH, borderRadius: 30, background: INK,
          opacity: clamp01(defIn * 3), transformOrigin: "50% 100%",
          transform: `${Z(lerp(-500, 0, EASE(defIn)))}rotateX(${lerp(-80, 0, back(defIn))}deg) scale(${cardSX}, ${cardSY})` }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26,
            opacity: 1 - clamp01(collapse * 3) }}>
            <div style={{ ...caps(INK_SUB, TYPE.label + 6) }}>{def.kicker}</div>
            <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 76, letterSpacing: TRACK.headline, lineHeight: 1, color: COLORS.paper, whiteSpace: "nowrap" }}>{def.title}</div>
            <div style={{ display: "flex", gap: 18 }}>
              {def.chips.map((c, i) => {
                const ck = k(tChip[i], 460);
                return (
                  <div key={i} style={{ padding: "14px 26px", borderRadius: 30, border: `4px solid ${COLORS.paper}`, ...caps(COLORS.paper, TYPE.label + 2), whiteSpace: "nowrap",
                    opacity: clamp01(ck * 3), transform: `translateY(${(1 - back(ck)) * 40}px)` }}>{c}</div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
      {pillO > 0 ? (
        <div style={{ position: "absolute", left: C.pill.x, top: C.pill.y, width: C.pill.w, height: C.pill.h, opacity: pillO * chartDim }}>
          <FlipFaces flip={flip} front={<WeekFace t={week.from} />} back={<WeekFace t={week.to} />} />
        </div>
      ) : null}

      {/* the SAE card: flies in from depth, three rows of ten, one filled each */}
      {saeO > 0 ? (
        <div style={{ position: "absolute", left: 960 - 640, top: 180, width: 1280, height: 660, borderRadius: 30, background: INK, opacity: saeO,
          transform: `${Z(lerp(-1400, 0, EASE(saeK)) + 900 * outK)}rotateY(${lerp(-35, 0, EASE(saeK))}deg) scale(${Z(1) ? 1 : lerp(0.6, 1, EASE(saeK))})` }}>
          <div style={{ position: "absolute", left: 70, top: 56, fontFamily: DISPLAY, fontWeight: 700, fontSize: 60, letterSpacing: TRACK.headline, color: COLORS.paper }}>{sae.title}</div>
          {sae.rows.map((r, i) => (
            <div key={i} style={{ position: "absolute", left: 70, top: 190 + i * 110, display: "flex", alignItems: "center", gap: 34 }}>
              <div style={{ width: 420, ...caps(i === 0 ? RED : COLORS.paper, TYPE.label + 8), whiteSpace: "nowrap" }}>{r}</div>
              <svg width={10 * 52} height={60} style={{ display: "block" }}>
                {Array.from({ length: 10 }).map((_, j) => {
                  const lit = j === 0 ? EASE(k(tSaeChip + i * 150, 300)) : 0;
                  return (
                    <g key={j} transform={`translate(${j * 52} 6)`}>
                      <circle cx={20} cy={12} r={10} fill={COLORS.paper} opacity={lerp(0.25, 1, lit)} />
                      <rect x={6} y={26} width={28} height={22} rx={11} fill={COLORS.paper} opacity={lerp(0.25, 1, lit)} />
                    </g>
                  );
                })}
              </svg>
            </div>
          ))}
          <div style={{ position: "absolute", left: 70, top: 560, padding: "10px 24px", borderRadius: 26, background: COLORS.paper, ...caps(INK, TYPE.label + 4),
            opacity: clamp01(k(tSaeChip, 300) * 2) }}>{sae.chip}</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
