// ─────────────────────────────────────────────────────────────────────────
// KIT · plusq — WHAT THE RELEASE DOES NOT SAY, and THE SECOND PAIRING, for the
// ABBV-466 long-form (2026-10-25, HORIZONTAL 16:9). Absolute 1920×1080 seats;
// import by path. Same rules and 3D grammar as kit/plusone.
//
// `ChartQuestions` (the §5 white card, held): over the chart, each caveat is
// enacted where it applies (a "p = ?" tag by the gap, dashed whiskers on the
// columns, eyes opening under the arm names, "≈100" under each arm) and lands
// as a row in a dashed checklist on the right, where trosunilimab's column was.
// `DoseCodes` (same card): the registry page — the combination arm's two
// antibodies with their dose codes ≠ the single-drug arms' codes (codes only,
// no conclusion) — then the red gap returns, a dashed divider crosses it and
// the second antibody lands on it with a "?".
// `PlatformPartners` (ink): TARGET-CD returns, a platform rises; risankizumab in
// the middle, trosunilimab (solid, reported) and lutikizumab (DASHED: no results)
// either side; connectors on "more than one partner".
// ─────────────────────────────────────────────────────────────────────────

import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, COLORS, DISPLAY, INK_SUB, TRACK, caps, inkA, useMs } from "./core";
import { TYPE } from "../style";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { YGlyph } from "./pairing";
import { useP3, useZ } from "./camera";
import { back, bounce, EASE, EASE_IO, fadeOut, hump } from "./plusone";
import { CHART, levelY } from "./plusnum";

/** an antibody at a seat, for the 3D camera (no opacity on wrappers above it) */
const Yat: React.FC<{ x: number; y: number; s: number; color: string; dashed?: boolean; o?: number; z?: number; ry?: number; tips?: ["round" | "square" | "chevron", "round" | "square" | "chevron"] }> =
  ({ x, y, s, color, dashed, o = 1, z = 0, ry = 0, tips = ["round", "round"] }) => {
    const Z = useZ();
    return (
      <div style={{ position: "absolute", left: x - 200, top: y - 230, width: 400, height: 460, opacity: o, transform: `${Z(z)}rotateY(${ry}deg) scale(${s})` }}>
        <svg width={400} height={460} viewBox="-200 -230 400 460" style={{ display: "block", overflow: "visible" }}>
          <YGlyph color={color} tips={tips} dashed={dashed} />
        </svg>
      </div>
    );
  };

/** a small open/closed eye (open = 1) */
const Eye: React.FC<{ open: number; color: string; w?: number }> = ({ open, color, w = 64 }) => {
  const h = (w / 2) * open;
  return (
    <svg width={w} height={w * 0.6} viewBox={`${-w / 2} ${-w * 0.3} ${w} ${w * 0.6}`} style={{ display: "block", overflow: "visible" }}>
      <path d={`M ${-w / 2} 0 Q 0 ${-h} ${w / 2} 0 Q 0 ${h} ${-w / 2} 0 Z`} fill="none" stroke={color} strokeWidth={5} strokeLinejoin="round" />
      <circle r={w * 0.13 * open} fill={color} />
    </svg>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// ChartQuestions — the caveats, enacted on the held chart + a dashed checklist
// ══════════════════════════════════════════════════════════════════════════
// Settled frame: the chart (hero) · the checklist (one support). Each chart-side
// enactment retires when the next caveat starts, so only one is ever on the chart.
export const QS = { kickTop: CHART.kickTop + 18, listX: 1440, listTop: 280, rowH: 74, rowGap: 18, listW: 410, eyeTop: 902 };

export const ChartQuestions: React.FC<Win & {
  kicker: { text: string } & Cued;
  rows: ({ text: string } & Cued)[]; // p-values · confidence intervals · open-label · ≈100 per arm
  knew: Cued; // the eyes open
  out: Cued; // the checklist + enactments retire (the kicker stays for the rest of the section)
}> = ({ from, to, kicker, rows, knew, out }) => {
  const ms = useMs();
  const k = useK();
  const Z = useZ();
  const P3 = useP3();
  const INK = COLORS.ink;
  const RED = COLORS.accent;
  const C = CHART;
  const Q = QS;

  const tKick = at(kicker, from + 40, from);
  let p = tKick;
  const tRow = rows.map((r) => (p = at(r, p + 1500, from, p + 300)));
  const tKnew = at(knew, tRow[2] + 1300, from, tRow[2] + 300);
  const tOut = at(out, tRow[3] + 1500, from, tRow[3] + 300);
  const listO = 1 - k(tOut, 360);
  const vis = fadeOut(ms, to);
  if (ms < tKick - 60 || vis <= 0) return null;

  // an enactment lives from its row's cue until the next row's cue (the last: until `to`)
  const live = (i: number, dur = 420) => {
    const a = i === 2 ? tKnew : tRow[i];
    const end = i + 1 < rows.length ? tRow[i + 1] : tOut;
    return EASE(k(a, dur)) * (1 - k(end, 300));
  };
  const comboTop = levelY(40.5), risTop = levelY(22.4);
  const colRight = (i: number) => C.xs[i] + C.colW / 2;

  return (
    <AbsoluteFill style={{ opacity: vis, ...P3 }}>
      <div style={{ position: "absolute", left: 120, top: Q.kickTop, ...caps(INK, TYPE.label + 6), whiteSpace: "nowrap", opacity: clamp01(k(tKick, 300) * 2),
        transform: `translateY(${(1 - EASE(k(tKick, 300))) * 14}px)` }}>{kicker.text}</div>

      {/* the checklist: each row swings in on its hinge as its caveat is voiced */}
      <div style={{ position: "absolute", left: Q.listX, top: Q.listTop, width: Q.listW, display: "flex", flexDirection: "column", gap: Q.rowGap, ...P3,
        transform: Z(-900 * EASE_IO(k(tOut, 560))) || undefined, visibility: listO > 0 ? undefined : "hidden" }}>
        {rows.map((r, i) => {
          const rk = k(tRow[i], 520);
          return (
            <div key={i} style={{ height: Q.rowH, borderRadius: 18, border: `4px dashed ${INK}`, display: "flex", alignItems: "center", padding: "0 24px",
              ...caps(INK, TYPE.label), whiteSpace: "nowrap", opacity: clamp01(rk * 3) * listO, transformOrigin: "100% 50%",
              transform: `${Z(lerp(300, 0, EASE(rk)))}rotateY(${lerp(80, 0, back(rk))}deg)` }}>
              {r.text}
            </div>
          );
        })}
      </div>

      {/* 0 · no p-values: a dashed "p = ?" tag pops by the gap bracket */}
      {live(0) > 0 ? (
        <div style={{ position: "absolute", left: C.bracketX - 250, top: (comboTop + risTop) / 2 + 90, padding: "10px 22px", borderRadius: 22,
          border: `4px dashed ${RED}`, fontFamily: DISPLAY, fontWeight: 700, fontSize: 44, color: RED, opacity: live(0),
          transform: `${Z(lerp(500, 0, live(0)))}scale(${Z(1) ? 1 : lerp(1.4, 1, live(0))})` }}>p = ?</div>
      ) : null}

      {/* 1 · no confidence intervals: dashed whiskers with "?" beside each column top */}
      {live(1) > 0 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: live(1) }}>
          {[[colRight(0) + 36, comboTop], [colRight(1) + 36, risTop]].map(([x, y], i) => {
            const g = EASE(k(tRow[1] + i * 150, 420));
            return (
              <g key={i} stroke={INK} strokeWidth={5} strokeDasharray="10 8" fill="none">
                <line x1={x} y1={y - 70 * g} x2={x} y2={y + 70 * g} />
                <line x1={x - 18} y1={y - 70 * g} x2={x + 18} y2={y - 70 * g} />
                <line x1={x - 18} y1={y + 70 * g} x2={x + 18} y2={y + 70 * g} />
                <text x={x + 28} y={y + 16} stroke="none" fill={INK} fontFamily={DISPLAY} fontWeight={700} fontSize={48} opacity={g}>?</text>
              </g>
            );
          })}
        </svg>
      ) : null}

      {/* 2 · open-label: an eye opens under each arm's name on "knew who got what" */}
      {live(2) > 0 ? (
        <>
          {[C.xs[0], C.xs[1]].map((x, i) => {
            const e = EASE(k(tKnew + i * 160, 380));
            return (
              <div key={i} style={{ position: "absolute", left: x - 32, top: Q.eyeTop, opacity: live(2), transform: `${Z(220 * hump(e))}` }}>
                <Eye open={e} color={INK} />
              </div>
            );
          })}
        </>
      ) : null}

      {/* 3 · about 100 per arm: "≈100" tags flip up under each arm */}
      {live(3) > 0 ? (
        <>
          {[C.xs[0], C.xs[1]].map((x, i) => {
            const e = k(tRow[3] + i * 140, 520);
            return (
              <div key={i} style={{ position: "absolute", left: x - 120, width: 240, top: Q.eyeTop - 6, display: "flex", justifyContent: "center", opacity: live(3) }}>
                <div style={{ padding: "6px 20px", borderRadius: 20, background: INK, ...caps(COLORS.paper, TYPE.label), transformOrigin: "50% 0%",
                  transform: `rotateX(${lerp(90, 0, back(e))}deg)` }}>{"≈"}100 patients</div>
              </div>
            );
          })}
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// DoseCodes — the registry page, then the gap with a question in it (white card)
// ══════════════════════════════════════════════════════════════════════════
export const DOSE = { chipTop: 96, headTop: 210, yCY: 470, yS: 0.82, left: [440, 680], right: [1240, 1480], tagTop: 650, nameTop: 716,
  gap: { cx: 960, w: 560, top: 300, h: 18.1 * 14 }, gapLabelTop: 220 };

export const DoseCodes: React.FC<Win & {
  chip: { text: string } & Cued;
  pair: { names: [string, string] } & Cued; // the combination arm's two antibodies drop in
  combo: { text: string } & Cued; // its header
  comboTags: { tags: [string, string] } & Cued; // its codes flip in
  singles: { text: string; tags: [string, string] } & Cued; // the single-drug arms land, then ≠
  neq: Cued;
  gap: { text: string } & Cued; // page 3: the groups go, the red gap returns
  divide: Cued; // a dashed divider crosses it
  second: Cued; // the second antibody lands on it with "?"
  ask: Cued; // the two "?" badges
}> = ({ from, to, chip, pair, combo, comboTags, singles, neq, gap, divide, second, ask }) => {
  const ms = useMs();
  const k = useK();
  const Z = useZ();
  const P3 = useP3();
  const INK = COLORS.ink;
  const RED = COLORS.accent;
  const D = DOSE;

  const tChip = at(chip, from + 40, from);
  const tPair = at(pair, tChip + 1500, from, tChip + 300);
  const tCombo = at(combo, tPair + 900, from, tPair + 300);
  const tTags = at(comboTags, tCombo + 1000, from, tCombo + 300);
  const tSingles = at(singles, tTags + 1500, from, tTags + 300);
  const tNeq = at(neq, tSingles + 600, from, tSingles + 350);
  const tGap = at(gap, tNeq + 700, from, tNeq + 300);
  const tDiv = at(divide, tGap + 2500, from, tGap + 600);
  const tSecond = at(second, tDiv + 1300, from, tDiv + 300);
  const tAsk = at(ask, tSecond + 1000, from, tSecond + 300);
  const vis = fadeOut(ms, to);
  if (ms < tChip - 60 || vis <= 0) return null;

  const page2Out = EASE_IO(k(tGap, 560));
  const p2o = 1 - page2Out;
  const p2z = -1200 * page2Out;

  const tagPill = (text: string, t: number, x: number, color = INK) => {
    const e = k(t, 520);
    return (
      <div style={{ position: "absolute", left: x - 130, width: 260, top: D.tagTop, display: "flex", justifyContent: "center" }}>
        <div style={{ padding: "10px 24px", borderRadius: 24, background: color, ...caps(COLORS.paper, TYPE.label + 6), whiteSpace: "nowrap", opacity: clamp01(e * 3),
          transformOrigin: "50% 0%", transform: `rotateX(${lerp(90, 0, back(e))}deg)` }}>{text}</div>
      </div>
    );
  };
  const nameAt = (text: string, x: number, t: number, color = COLORS.grayText) => (
    <div style={{ position: "absolute", left: x - 140, width: 280, top: D.nameTop, textAlign: "center", ...caps(color, TYPE.label), whiteSpace: "nowrap",
      opacity: clamp01(k(t, 300) * 2) }}>{text}</div>
  );
  const head = (text: string, cx: number, t: number) => {
    const e = k(t, 520);
    return (
      <div style={{ position: "absolute", left: cx - 360, width: 720, top: D.headTop, textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: 56,
        letterSpacing: TRACK.headline, color: INK, whiteSpace: "nowrap", opacity: clamp01(e * 3), transformOrigin: "50% 100%",
        transform: `rotateX(${lerp(-90, 0, back(e))}deg)` }}>{text}</div>
    );
  };
  const dropIn = (t: number, i: number) => { const e = k(t + i * 140, 620); return { o: clamp01(e * 3), z: lerp(800, 0, EASE(e)), ry: lerp(360, 0, EASE(e)) }; };
  const L0 = dropIn(tPair, 0), L1 = dropIn(tPair, 1), R0 = dropIn(tSingles, 0), R1 = dropIn(tSingles, 1);
  const neqK = k(tNeq, 420);
  const leftCX = (D.left[0] + D.left[1]) / 2, rightCX = (D.right[0] + D.right[1]) / 2;

  // page 3 — the gap block rises from its floor, a dashed divider crosses it, the antibody lands on its top
  const g = D.gap;
  const gapK = EASE_IO(k(tGap + 200, 700));
  const divK = EASE_IO(k(tDiv, 600));
  const secK = k(tSecond, 700);
  const askK = (i: number) => k(tAsk + i * 160, 420);
  const blockTop = g.top + g.h * (1 - gapK);
  const divY = g.top + g.h * 0.45;

  return (
    <AbsoluteFill style={{ opacity: vis, ...P3 }}>
      {/* page 2 — flies back into depth as page 3 arrives */}
      {p2o > 0 ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, ...P3, transform: Z(p2z) || undefined }}>
          <div style={{ position: "absolute", right: 120, top: D.chipTop, padding: "10px 24px", borderRadius: 24, border: `4px solid ${INK}`, ...caps(INK, TYPE.label),
            whiteSpace: "nowrap", opacity: clamp01(k(tChip, 300) * 2) * p2o }}>{chip.text}</div>
          {head(combo.text, leftCX, tCombo)}
          {head(singles.text, rightCX, tSingles)}
          <Yat x={D.left[0]} y={D.yCY} s={D.yS} color={INK} o={L0.o * p2o} z={L0.z} ry={L0.ry} />
          <Yat x={D.left[1]} y={D.yCY} s={D.yS} color={RED} tips={["square", "square"]} o={L1.o * p2o} z={L1.z} ry={L1.ry} />
          <Yat x={D.right[0]} y={D.yCY} s={D.yS} color={INK} o={R0.o * p2o} z={R0.z} ry={R0.ry} />
          <Yat x={D.right[1]} y={D.yCY} s={D.yS} color={RED} tips={["square", "square"]} o={R1.o * p2o} z={R1.z} ry={R1.ry} />
          {/* the single-drug arms are SEPARATE arms: a hairline between their two antibodies */}
          <div style={{ position: "absolute", left: rightCX - 2, top: D.yCY - 170, width: 4, height: 340, background: inkA(0.25), opacity: R1.o * p2o }} />
          {p2o > 0.01 ? (
            <div style={{ opacity: p2o }}>
              {tagPill(comboTags.tags[0], tTags, D.left[0])}
              {tagPill(comboTags.tags[1], tTags + 160, D.left[1], RED)}
              {tagPill(singles.tags[0], tSingles + 450, D.right[0])}
              {tagPill(singles.tags[1], tSingles + 610, D.right[1], RED)}
              {nameAt(pair.names[0], D.left[0], tPair + 300)}
              {nameAt(pair.names[1], D.left[1], tPair + 440, RED)}
              {nameAt(pair.names[0], D.right[0], tSingles + 300)}
              {nameAt(pair.names[1], D.right[1], tSingles + 440, RED)}
            </div>
          ) : null}
          {/* ≠ slams in from the lens between the two groups */}
          {neqK > 0 ? (
            <div style={{ position: "absolute", left: 960 - 80, top: D.yCY - 90, width: 160, textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: 170,
              lineHeight: 1, color: INK, opacity: clamp01(neqK * 4) * p2o,
              transform: `${Z(lerp(1000, 0, EASE(neqK)))}translateY(${-16 * bounce(neqK)}px) scale(${Z(1) ? 1 : lerp(2.2, 1, EASE(neqK))})` }}>{"≠"}</div>
          ) : null}
        </div>
      ) : null}

      {/* page 3 — the gap, with a question in it */}
      {gapK > 0 ? (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: D.gapLabelTop - 60, textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: 56,
            letterSpacing: TRACK.headline, color: RED, opacity: clamp01(gapK * 2) }}>{gap.text}</div>
          <div style={{ position: "absolute", left: g.cx - g.w / 2, top: blockTop, width: g.w, height: g.h * gapK, borderRadius: 18, background: RED }} />
          <div style={{ position: "absolute", left: g.cx - g.w / 2 - 80, top: g.top + g.h, width: g.w + 160, height: 6, borderRadius: 3, background: INK, opacity: gapK }} />
          {divK > 0 ? (
            <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
              <line x1={g.cx - g.w / 2} y1={divY} x2={g.cx - g.w / 2 + g.w * divK} y2={divY} stroke={COLORS.paper} strokeWidth={8} strokeDasharray="20 14" />
            </svg>
          ) : null}
          {[g.top + (divY - g.top) / 2, divY + (g.top + g.h - divY) / 2].map((y, i) => {
            const e = askK(i);
            return e > 0 ? (
              <div key={i} style={{ position: "absolute", left: g.cx - 40, top: y - 44, width: 80, textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: 80,
                lineHeight: 1.1, color: COLORS.paper, opacity: clamp01(e * 3), transform: `scale(${lerp(1.6, 1, EASE(e))})` }}>?</div>
            ) : null;
          })}
          {secK > 0 ? (
            <>
              <Yat x={g.cx + g.w / 2 + 130} y={g.top + g.h / 2} s={0.62} color={INK} tips={["square", "square"]} o={clamp01(secK * 3)}
                z={lerp(900, 0, EASE(secK))} ry={lerp(-540, 0, EASE(secK))} />
              <div style={{ position: "absolute", left: g.cx + g.w / 2 + 130 - 150, width: 300, top: g.top + g.h + 30, textAlign: "center", ...caps(INK, TYPE.label),
                opacity: clamp01(k(tSecond + 300, 300) * 2) }}>Second antibody</div>
            </>
          ) : null}
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// PlatformPartners — one trial, more than one partner for Skyrizi (ink)
// ══════════════════════════════════════════════════════════════════════════
// Settled frame: the slab (TARGET-CD) · risankizumab with two partners · their names.
export const PLAT = { chipTop: 96, slab: { x: 360, w: 1200, top: 770, h: 110 }, xs: [560, 960, 1360], yCY: 630, yS: 0.92, nameTop: 300 };

export const PlatformPartners: React.FC<Win & {
  chip: { text: string } & Cued;
  slab: { text: string } & Cued; // the platform rises
  ris: { name: string; pill: string } & Cued; // risankizumab + trosunilimab return on it
  partner1: { name: string };
  third: { name: string; sub: string } & Cued; // lutikizumab drops in dashed
  links: Cued; // connectors draw: "more than one partner"
}> = ({ from, to, chip, slab, ris, partner1, third, links }) => {
  const ms = useMs();
  const k = useK();
  const Z = useZ();
  const P3 = useP3();
  const Wt = COLORS.paper;
  const RED = COLORS.accent;
  const P = PLAT;

  const tChip = at(chip, from + 40, from);
  const tSlab = at(slab, tChip + 2000, from, tChip + 300);
  const tRis = at(ris, tSlab + 1500, from, tSlab + 400);
  const tThird = at(third, tRis + 1500, from, tRis + 400);
  const tLinks = at(links, tThird + 2000, from, tThird + 400);
  const vis = fadeOut(ms, to);
  if (ms < tChip - 60 || vis <= 0) return null;

  // the slab rises from below and swings up to face the lens; lands with a bounce
  const sK = k(tSlab, 760);
  const slabY = sK < 0.6 ? lerp(420, 0, EASE_IO(sK / 0.6)) : 18 * bounce((sK - 0.6) / 0.4);
  const slabRX = lerp(75, 0, EASE(clamp01(sK / 0.7)));
  const rK = k(tRis, 640), pK = k(tRis + 220, 640), tK = k(tThird, 700);
  const lK = EASE_IO(k(tLinks, 700));
  const linkY = P.yCY + 80 * P.yS; // on the stems: below the arms (which start at +10), above the feet (+150)

  const name = (text: string, x: number, t: number, color: string, sub?: string, subColor?: string) => {
    const e = k(t + 200, 520);
    return (
      <div style={{ position: "absolute", left: x - 220, width: 440, top: P.nameTop, textAlign: "center", ...P3 }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 52, letterSpacing: TRACK.headline, color, whiteSpace: "nowrap", opacity: clamp01(e * 3),
          transformOrigin: "50% 100%", transform: `rotateX(${lerp(-90, 0, back(e))}deg)` }}>{text}</div>
        {sub ? (
          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <div style={{ padding: "8px 20px", borderRadius: 22, ...(subColor ? { background: subColor, color: COLORS.ink } : { border: `3px dashed ${Wt}`, color: Wt }),
              ...caps(subColor ? COLORS.ink : Wt, TYPE.label), whiteSpace: "nowrap", opacity: clamp01(k(t + 450, 300) * 2) }}>{sub}</div>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ opacity: vis, ...P3 }}>
      <div style={{ position: "absolute", right: 120, top: P.chipTop, padding: "10px 24px", borderRadius: 24, border: `4px solid ${Wt}`, ...caps(Wt, TYPE.label),
        whiteSpace: "nowrap", opacity: clamp01(k(tChip, 300) * 2) }}>{chip.text}</div>

      {/* the platform */}
      {sK > 0 ? (
        <div style={{ position: "absolute", left: P.slab.x, top: P.slab.top, width: P.slab.w, height: P.slab.h, borderRadius: 22, background: Wt, color: COLORS.ink,
          display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: 52, letterSpacing: TRACK.headline,
          opacity: clamp01(sK * 4), transformOrigin: "50% 0%", transform: `translateY(${slabY}px) rotateX(${slabRX}deg)` }}>
          {slab.text}
        </div>
      ) : null}

      {/* risankizumab in the middle, trosunilimab (solid) left, lutikizumab (dashed) right */}
      {rK > 0 ? <Yat x={P.xs[1]} y={P.yCY - lerp(500, 0, EASE(rK)) + 0} s={P.yS} color={Wt} o={clamp01(rK * 3)} z={lerp(400, 0, EASE(rK))} /> : null}
      {pK > 0 ? <Yat x={P.xs[0] - lerp(400, 0, EASE(pK))} y={P.yCY} s={P.yS} color={RED} tips={["square", "square"]} o={clamp01(pK * 3)} /> : null}
      {tK > 0 ? <Yat x={P.xs[2]} y={P.yCY - 18 * bounce(tK)} s={P.yS} color={Wt} tips={["chevron", "chevron"]} dashed o={clamp01(tK * 3)}
        z={lerp(1200, 0, EASE(clamp01(tK * 1.3)))} ry={lerp(720, 0, EASE(tK))} /> : null}

      {/* connectors from risankizumab's foot to each partner's foot: solid to the reported one, dashed to the other */}
      {lK > 0 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
          {/* straight, at STEM height: below the arms, above the platform, clear of every label
              (v1 dipped under the feet into the slab, Nel 2026-10-25) */}
          {[0, 2].map((i) => {
            const dir = i === 0 ? -1 : 1;
            const xa = P.xs[1] + dir * 24, xb = P.xs[i] - dir * 24;
            const xe = lerp(xa, xb, lK);
            return <line key={i} x1={xa} y1={linkY} x2={xe} y2={linkY} stroke={i === 0 ? RED : Wt} strokeWidth={7} strokeLinecap="round"
              strokeDasharray={i === 0 ? undefined : "16 12"} />;
          })}
        </svg>
      ) : null}

      {name(partner1.name, P.xs[0], tRis + 220, RED)}
      {name(ris.name, P.xs[1], tRis, Wt, ris.pill, Wt)}
      {name(third.name, P.xs[2], tThird, Wt, third.sub)}
    </AbsoluteFill>
  );
};
