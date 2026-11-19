// ─────────────────────────────────────────────────────────────────────────
// KIT · hansoh — A PLATFORM BOUGHT BEFORE ANY PROGRAM REACHES THE CLINIC. Added on
// the Roche × Hansoh HORIZONTAL long-form, 2026-10-24 (16:9; absolute 1920x1080
// seats, not portrait-safe as written).
//
// Motion law (Nel, 2026-10-24, chunk 1 v1 was "plain"): MORE motion graphics, but the
// scene must not get busy. So: ONE mover per cue, and that move is designed (particles
// that assemble then rest, a whip zoom, a pen that draws, a shatter, a 3D unfold, a tear,
// a streak, a weighted drop, an arc with a camera dive). Landed things go still; nothing
// loops; a settled frame holds one hero, two supports at most.
// Grammar: SOLID = paid / disclosed; DASHED = conditional / not named / not yet.
// "More than $15B" is a FLOOR, so the milestone run has no closed right edge: its
// dashes run off the frame past the $15B tick.
//
// `FloorHook` (red, the hook): ~140 particles fly in and ASSEMBLE into "$400M", then
//   rest; "upfront" is uncovered by a bar; a whip zoom collapses the figure into a
//   to-scale sliver; a pen draws the dashed run with "$15B" riding its tip until the
//   tick; on "none" the bar SHATTERS and falls; a dashed slot unfolds in 3D and
//   "None yet" slams in with a squash.
// `DealHand` (black over a scrim): a calendar pad, its top leaf TEARS off to "19";
//   Hansoh flips in; two chips swing out from behind the name like cards; on
//   "announced" a sweep clears them; the licence arrow FIRES as a streak (the one red)
//   and the terms surface in its wake; Roche DROPS in with weight; the subject flows in.
// `AdcBuild` (white card): "ADC" flips in; the antibody UNFOLDS from a point; the
//   payload loads with a snap and a recoil and turns red on "toxic"; a tumour cell
//   pops in; the ADC flies an ARC while the camera dives, and docks with a dent.
// ─────────────────────────────────────────────────────────────────────────

import React from "react";
import { Easing, interpolate, interpolateColors, random } from "remotion";
import { CLAMP, clamp01, COLORS, INK_SUB, INK_SUB_ON_RED, inkA, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { big, label } from "./rona";
import { BarReveal, Letters } from "./hunt";
import { useP3, useZ } from "./camera";

const EASE = Easing.out(Easing.cubic);
const EASE_IN = Easing.in(Easing.quad);
const EASE_IO = Easing.inOut(Easing.cubic);
const EASE_EXPO = Easing.out(Easing.exp);
const BACK = Easing.out(Easing.back(1.6));
const BOUNCE = Easing.out(Easing.bounce);

/** A layer falls under gravity from `t` (`i` staggers and tilts it), fading near the bottom. */
const fall = (ms: number, t: number, i = 0) => {
  const f = clamp01((ms - (t + i * 60)) / 640);
  return { transform: `translateY(${f * f * 1100}px) rotate(${f * (i % 2 ? 14 : -10)}deg)`, opacity: 1 - clamp01((f - 0.65) / 0.35) };
};

/** A layer whipped off to the left with a smear (a sweep that clears the stage). */
const sweep = (ms: number, t: number, i = 0) => {
  const f = EASE_IN(clamp01((ms - (t + i * 50)) / 380));
  return { transform: `translateX(${-f * 1400}px) skewX(${f * 18}deg)`, filter: f > 0.02 ? `blur(${f * 14}px)` : undefined, opacity: 1 - clamp01((f - 0.7) / 0.3) };
};

// ══════════════════════════════════════════════════════════════════════════
// FloorHook — the hook (red world)
// ══════════════════════════════════════════════════════════════════════════
export const FLOOR = {
  fig: { top: 250, size: 300 },
  up: { size: 72 },
  // the bar, to scale: $15B = RUN px, so $400M = RUN * 400 / 15000
  bar: { x: 160, y: 600, h: 110, run: 1600 },
  dock: { s: 0.3, x: 160, top: 470 }, // the "$400M" group docks above the sliver, left-aligned
  ceil: { top: 300, size: 150 },
  chip: { top: 760 },
  slot: { w: 980, h: 230, top: 470 },
  kick: { top: 330, size: 66 },
  particles: 140,
  shards: 16,
};

export const FloorHook: React.FC<Win & {
  figure: { text: string; unit: string } & Cued; // particles assemble on "$400"
  unitAt: Cued; // "million": the M stamps
  upfront: { label: string } & Cued;
  pull: Cued; // "More": the whip zoom, the figure collapses into a sliver
  ceiling: { kicker: string; value: number; suffix: string } & Cued; // "$15": the pen draws, the figure rides it
  unitB: Cued; // "billion": B stamps as the pen passes the tick
  chip: { label: string } & Cued; // "potential"
  drop: Cued; // "none": the bar shatters
  kicker: { label: string } & Cued; // "programs"
  slot: Cued; // "clinic": the dashed slot unfolds
  verdict: { label: string } & Cued; // "yet."
}> = ({ from, to, figure, unitAt, upfront, pull, ceiling, unitB, chip, drop, kicker, slot, verdict }) => {
  const ms = useMs();
  const k = useK();
  const Z = useZ(); // depth (camera on) or "" (flat)
  const P3 = useP3();
  const zs = (z: number, st: React.CSSProperties = {}): React.CSSProperties => ({ ...P3, ...st, transform: Z(z) + (st.transform ?? "") });
  const W = COLORS.paper;
  const B = FLOOR.bar;
  const sliver = (B.run * 400) / 15000;

  const tFig = at(figure, from, from);
  const tUnit = at(unitAt, tFig + 1100, from, tFig + 600);
  const tUp = at(upfront, tUnit + 900, from, tUnit + 300);
  const tPull = at(pull, tUp + 900, from, tUp + 400);
  const tCeil = at(ceiling, tPull + 560, from, tPull + 400);
  const tB = at(unitB, tCeil + 700, from, tCeil + 400);
  const tChip = at(chip, tB + 500, from, tB + 200);
  const tDrop = at(drop, tChip + 1800, from, tChip + 600);
  const tKick = at(kicker, tDrop + 360, from, tDrop + 200);
  const tSlot = at(slot, tKick + 1000, from, tKick + 400);
  const tVer = at(verdict, tSlot + 250, from, tSlot + 150);

  const vis = clamp01(interpolate(ms, [to - 250, to], [1, 0], CLAMP));
  if (ms < tFig - 40 || vis <= 0) return null;

  // ── 1 · particles fly in and assemble into the figure box, then hand over to the type ──
  const figW = 1100; // a box wide enough for "$400M" at 300px; text centred inside it
  const textW = [...(figure.text + figure.unit)].length * 0.64 * FLOOR.fig.size; // bold Inter ≈ 0.64em/glyph
  const assembleEnd = Math.min(tUnit - 80, tFig + 900);
  const solid = EASE(clamp01((ms - (assembleEnd - 220)) / 260)); // the type resolves as the dots land
  const particles =
    ms < assembleEnd + 260
      ? Array.from({ length: FLOOR.particles }, (_, i) => {
          const sx = random(`sx${i}`) * 2400 - 240;
          const sy = random(`sy${i}`) * 1400 - 160;
          const tx = 960 - textW * 0.48 + random(`tx${i}`) * textW * 0.96;
          const ty = FLOOR.fig.top + 40 + random(`ty${i}`) * FLOOR.fig.size * 0.78;
          const d = tFig + random(`d${i}`) * 260;
          const q = EASE_EXPO(clamp01((ms - d) / Math.max(300, assembleEnd - d)));
          const r = lerp(7, 4, q) * (1 - solid);
          return r > 0.2 ? <circle key={i} cx={lerp(sx, tx, q)} cy={lerp(sy, ty, q)} r={r} fill={W} opacity={clamp01(q * 4)} /> : null;
        })
      : null;

  // ── 2 · the whip zoom (one transform of the figure group, with a speed smear) ──
  const pq = EASE_IO(k(tPull, 560));
  const smear = Math.sin(Math.PI * pq) * 12;
  const dockQ = clamp01((pq - 0.85) / 0.15); // the scaled figure → the docked flex row
  const figScale = lerp(1, FLOOR.dock.s, pq);
  const gcx = lerp(960, FLOOR.dock.x + (textW * FLOOR.dock.s) / 2, pq);
  const gx = gcx - figW / 2;
  const gy = lerp(FLOOR.fig.top, FLOOR.dock.top - 30, pq);
  const uq = k(tUnit, 320);
  const sliverQ = BACK(k(tPull + 380, 280)); // the sliver drops as the whip lands (the end of the same move)

  // ── 3 · the pen: it draws the run and carries the count until the tick ──
  const runStart = B.x + sliver + 10;
  const runEnd = 1920 + 60;
  const tickX = B.x + B.run;
  const tickFrac = (tickX - runStart) / (runEnd - runStart);
  const penDur = Math.max(500, (tB - tCeil) / tickFrac);
  const penQ = clamp01((ms - tCeil) / penDur);
  const penX = lerp(runStart, runEnd, EASE_IO(penQ));
  const penOn = penQ > 0 && penQ < 1;
  const cq = clamp01((penX - runStart) / (tickX - runStart));
  const shown = Math.round(cq * ceiling.value);
  const figX = Math.min(penX, tickX); // the figure rides the pen, then parks on the tick
  const ceilOp = clamp01(k(tCeil - 40, 200) * 3);
  const bq = k(tB, 300);
  const tickQ = BACK(k(tB, 340));
  const chipQ = k(tChip, 420);

  // ── 4 · the shatter ──
  const on3d = Z(1) !== ""; // not a hook call: this runs after the early return
  const shattered = ms >= tDrop;
  const shardW = (runEnd - B.x) / FLOOR.shards;
  const shard = (i: number) => {
    const f = clamp01((ms - (tDrop + random(`sd${i}`) * 140)) / 760);
    const vx = (random(`vx${i}`) - 0.5) * 500;
    const vy = -220 - random(`vy${i}`) * 260;
    const rot = (random(`rt${i}`) - 0.5) * 140;
    return { transform: `${Z(f * 900)}translate(${vx * f}px, ${vy * f + 1900 * f * f}px) rotate(${rot * f}deg) ${on3d ? `rotateX(${rot * f * 1.6}deg)` : ""}`, opacity: 1 - clamp01((f - 0.7) / 0.3) };
  };
  const barBody = (
    <>
      {sliverQ > 0 ? (
        <div style={{ position: "absolute", left: B.x, top: B.y + B.h * (1 - Math.min(1, sliverQ)), width: sliver, height: B.h * Math.min(1, sliverQ), background: W, borderRadius: 4 }} />
      ) : null}
      {penQ > 0 ? (
        <svg style={{ position: "absolute", left: runStart, top: B.y, overflow: "visible" }} width={Math.max(1, penX - runStart)} height={B.h}>
          <rect x={2} y={2} width={Math.max(0, penX - runStart + 60)} height={B.h - 4} rx={4} fill="none" stroke={W} strokeWidth={4} strokeDasharray="22 14" />
        </svg>
      ) : null}
      {tickQ > 0 ? <div style={{ position: "absolute", left: tickX - 3, top: B.y - 40, width: 6, height: (B.h + 80) * Math.min(1.05, tickQ), background: W, borderRadius: 3 }} /> : null}
    </>
  );

  // ── 5 · the slot: unfolds in 3D (hinged at its top), then the verdict slams with a squash ──
  const kq = k(tKick, 420);
  const sq = k(tSlot, 560);
  const vq = clamp01((ms - tVer) / 420);
  const SL = FLOOR.slot;
  const squash = vq <= 0 ? null : vq < 0.35 ? { sx: lerp(1.5, 1.18, vq / 0.35), sy: lerp(0.3, 0.78, vq / 0.35) } : { sx: lerp(1.18, 1, BACK((vq - 0.35) / 0.65)), sy: lerp(0.78, 1, BACK((vq - 0.35) / 0.65)) };

  return (
    <div style={{ position: "absolute", inset: 0, opacity: vis, ...P3 }}>
      {particles ? (
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>{particles}</svg>
      ) : null}

      {/* the figure group: "$400M" + "upfront" (falls on "none") */}
      <div style={zs(90, { position: "absolute", inset: 0, ...(shattered ? fall(ms, tDrop, 0) : {}) })}>
        <div style={{ position: "absolute", left: gx, top: gy, width: figW, transformOrigin: "50% 0%", transform: `scale(${figScale}) scaleX(${1 + smear * 0.02})`,
          filter: smear > 0.3 ? `blur(${smear}px)` : undefined, opacity: solid * (1 - dockQ), textAlign: "center" }}>
          <div style={{ ...big(W, FLOOR.fig.size) }}>
            {figure.text}
            <span style={{ display: "inline-block", opacity: clamp01(uq * 3), transform: `scale(${lerp(1.6, 1, BACK(uq))})` }}>{figure.unit}</span>
          </div>
          {/* "upfront" fades out during the whip: scaled down with the figure it would be ~22px */}
          <div style={{ marginTop: 44, height: FLOOR.up.size * 1.1, opacity: 1 - clamp01(pq / 0.4) }}>
            {ms >= tUp ? <BarReveal t={tUp} color={W}><span style={{ ...big(W, FLOOR.up.size) }}>{upfront.label}</span></BarReveal> : null}
          </div>
        </div>
        {/* docked: the scaled figure hands over to ONE flex row, "$400M upfront", laid out by the strings
            (scaled with the figure, "upfront" would be ~22px; Nel's screenshot 2026-10-24) */}
        {pq > 0.85 ? (
          <div style={{ position: "absolute", left: FLOOR.dock.x, top: gy, display: "flex", alignItems: "baseline", gap: 20, opacity: dockQ }}>
            <span style={{ ...big(W, FLOOR.fig.size * FLOOR.dock.s) }}>{figure.text + figure.unit}</span>
            <span style={{ ...big(W, 48) }}>{upfront.label}</span>
          </div>
        ) : null}
      </div>

      {/* the bar: whole until "none", then sixteen shards */}
      {!shattered ? (
        <div style={{ position: "absolute", inset: 0 }}>{barBody}</div>
      ) : (
        Array.from({ length: FLOOR.shards }, (_, i) => (
          <div key={i} style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${1920 - (B.x + (i + 1) * shardW)}px 0 ${B.x + i * shardW}px)`, transformOrigin: `${B.x + (i + 0.5) * shardW}px ${B.y + B.h / 2}px`, ...shard(i) }}>
            {barBody}
          </div>
        ))
      )}

      {/* the pen head, riding the run's top edge */}
      {penOn ? <div style={{ ...zs(20), position: "absolute", left: penX - 14, top: B.y - 14, width: 28, height: 28, borderRadius: 14, background: W, boxShadow: `0 0 0 8px ${INK_SUB_ON_RED}` }} /> : null}

      {/* "More than $15B": rides the pen, parks right-aligned on the tick (falls on "none") */}
      {ceilOp > 0 ? (
        <div style={zs(60, { position: "absolute", right: 1920 - figX, top: FLOOR.ceil.top, textAlign: "right", opacity: ceilOp, ...(shattered ? fall(ms, tDrop, 2) : {}) })}>
          <div style={{ ...label(INK_SUB_ON_RED, 52), marginBottom: 10 }}>{ceiling.kicker}</div>
          <div style={{ ...big(W, FLOOR.ceil.size), fontVariantNumeric: "tabular-nums" }}>
            ${shown}
            <span style={{ display: "inline-block", opacity: clamp01(bq * 3), transform: `scale(${lerp(1.6, 1, BACK(bq))})` }}>{ceiling.suffix}</span>
          </div>
        </div>
      ) : null}
      {chipQ > 0 ? (
        <div style={zs(-50, { position: "absolute", left: runStart, right: 1920 - tickX, top: FLOOR.chip.top, display: "flex", justifyContent: "center", ...(shattered ? fall(ms, tDrop, 3) : {}) })}>
          <Letters text={chip.label} t={tChip} mode="flip" style={{ ...big(INK_SUB_ON_RED, 54) }} />
        </div>
      ) : null}

      {/* the one thing left: a dashed, empty "in the clinic" slot */}
      {kq > 0 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: FLOOR.kick.top, display: "flex", justifyContent: "center", opacity: clamp01(kq * 3), transform: `translateY(${(1 - EASE(kq)) * 40}px)` }}>
          <div style={{ ...big(W, FLOOR.kick.size) }}>{kicker.label}</div>
        </div>
      ) : null}
      {sq > 0 ? (
        <div style={{ position: "absolute", left: 960 - SL.w / 2, top: SL.top, width: SL.w, height: SL.h, perspective: 1200 }}>
          <svg style={{ position: "absolute", inset: 0, transformOrigin: "50% 0%", transform: `rotateX(${lerp(-92, 0, BACK(sq))}deg)`, opacity: clamp01(sq * 4) }} width={SL.w} height={SL.h}>
            <rect x={3} y={3} width={SL.w - 6} height={SL.h - 6} rx={28} fill="none" stroke={W} strokeWidth={6} strokeDasharray="26 18" />
          </svg>
        </div>
      ) : null}
      {squash ? (
        <div style={{ position: "absolute", left: 960 - SL.w / 2, top: SL.top, width: SL.w, height: SL.h, display: "flex", alignItems: "center", justifyContent: "center", opacity: vq < 0.2 ? clamp01(vq * 5) : 1, ...P3 }}>
          <div style={{ ...big(W, 120), transformOrigin: "50% 100%", transform: `${Z(lerp(260, 0, EASE(vq)))}scale(${squash.sx}, ${squash.sy})` }}>{verdict.label}</div>
        </div>
      ) : null}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// DealHand — the announcement (black world over a scrim)
// ══════════════════════════════════════════════════════════════════════════
export const DEAL = {
  pad: { x: 160, y: 110, w: 150, h: 170 },
  row: { left: 160, right: 160, top: 400 },
  name: 150,
  arrowW: 440,
  terms: 40,
  tag: { top: 700, size: 60 },
};

/** One calendar leaf (month band + day), white with a black band. */
const Leaf: React.FC<{ w: number; h: number; month: string; day: string }> = ({ w, h, month, day }) => {
  const s = w / 180;
  return (
    <div style={{ width: w, height: h, borderRadius: 22 * s, overflow: "hidden", background: COLORS.paper, ...big(COLORS.ink, 116 * s), textAlign: "center" }}>
      <div style={{ height: 58 * s, background: COLORS.ink, border: `${4 * s}px solid ${COLORS.paper}`, borderRadius: `${22 * s}px ${22 * s}px 0 0`, boxSizing: "border-box",
        display: "flex", alignItems: "center", justifyContent: "center", ...big(COLORS.paper, 36 * s) }}>{month}</div>
      <div style={{ height: h - 58 * s, display: "flex", alignItems: "center", justifyContent: "center" }}>{day}</div>
    </div>
  );
};

export const DealHand: React.FC<Win & {
  date: { month: string; day: string; before: string } & Cued; // the pad appears showing `before`
  tear: Cued; // the top leaf tears off to the real day
  licensor: { name: string } & Cued;
  chips: ({ label: string } & Cued)[];
  clear: Cued; // "announced": a sweep clears the pad + chips
  arrow: Cued; // "collaboration": the arrow fires
  terms: { words: string[]; cues: (string | undefined)[] }; // the licence terms, word by word
  licensee: { name: string } & Cued;
  tag: { parts: ({ text: string } & Cued)[] };
}> = ({ from, to, date, tear, licensor, chips, clear, arrow, terms, licensee, tag }) => {
  const ms = useMs();
  const k = useK();
  const Z = useZ(); // depth (camera on) or "" (flat)
  const P3 = useP3();
  const zs = (z: number, st: React.CSSProperties = {}): React.CSSProperties => ({ ...P3, ...st, transform: Z(z) + (st.transform ?? "") });
  const W = COLORS.paper;
  const R = COLORS.accent;
  const tDate = at(date, from + 200, from);
  const tTear = at(tear, tDate + 450, from, tDate + 250);
  const tLic = at(licensor, tTear + 700, from, tTear + 300);
  const tChips = chips.map((c, i) => at(c, tLic + 900 + i * 900, from, tLic + 300));
  const tClear = at(clear, tChips[tChips.length - 1] + 1200, from);
  const tArrow = at(arrow, tClear + 400, from, tClear + 200);
  const tTerms = terms.cues.map((c, i) => Math.max(tArrow + 120, c ? at({ word: c }, tArrow + i * 300, tArrow) : tArrow + i * 300));
  const tLee = at(licensee, tArrow + 2400, from, tArrow + 600);
  const tTag = tag.parts.map((p, i) => at(p, tLee + 600 + i * 1000, from, tLee + 200));
  const vis = clamp01(interpolate(ms, [from - 100, from + 200, to - 300, to], [0, 1, 1, 0], CLAMP));
  if (vis <= 0) return null;

  const cleared = ms >= tClear;
  const P = DEAL.pad;
  const padQ = k(tDate, 420);
  const tq = clamp01((ms - tTear) / 560); // the tear: the leaf peels from its left edge, then drops
  const streak = clamp01((ms - tArrow) / 260); // the streak fires fast; the line is what it leaves
  const head = 34;
  const lq = clamp01((ms - tLee) / 620);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: vis, ...P3 }}>
      {/* the calendar pad: three leaves deep; the top one tears off */}
      {padQ > 0 ? (
        <div style={zs(160, { position: "absolute", left: P.x, top: P.y, width: P.w, height: P.h, perspective: 900, opacity: clamp01(padQ * 4),
          transform: `translateY(${(1 - BACK(padQ)) * -60}px)`, ...(cleared ? sweep(ms, tClear, 0) : {}) })}>
          <div style={{ position: "absolute", left: 8, top: 10 }}><div style={{ width: P.w, height: P.h, borderRadius: 18, background: "rgba(255,255,255,0.35)" }} /></div>
          <div style={{ position: "absolute", left: 0, top: 0 }}><Leaf w={P.w} h={P.h} month={date.month} day={date.day} /></div>
          {tq < 1 ? (
            <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "100% 0%",
              transform: `rotate(${-EASE_IN(tq) * 38}deg) translate(${-EASE_IN(tq) * 60}px, ${EASE_IN(clamp01((tq - 0.35) / 0.65)) * 520}px)`, opacity: 1 - clamp01((tq - 0.75) / 0.25) }}>
              <Leaf w={P.w} h={P.h} month={date.month} day={date.before} />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* the deal row, laid out by the strings: licensor · arrow · licensee */}
      <div style={{ position: "absolute", left: DEAL.row.left, right: DEAL.row.right, top: DEAL.row.top, display: "flex", alignItems: "center", justifyContent: "space-between", ...P3 }}>
        <div style={{ position: "relative", ...P3 }}>
          {/* chips swing out from behind the name like cards, hinged at their top-left */}
          <div style={zs(80, { position: "absolute", left: 0, top: DEAL.name + 30, display: "flex", flexDirection: "column", gap: 16 })}>
            {chips.map((c, i) => {
              const q = clamp01((ms - tChips[i]) / 520);
              if (q <= 0) return null;
              return (
                <div key={i} style={{ alignSelf: "flex-start", ...(cleared ? sweep(ms, tClear, i + 1) : {}) }}>
                  <div style={{ padding: "12px 22px", border: `3px solid ${W}`, borderRadius: 14, background: "rgba(0,0,0,0.55)", ...label(W, 38),
                    transformOrigin: "0% 0%", transform: `translateY(${(1 - EASE(q)) * -(DEAL.name * 0.6 + i * 70)}px) rotate(${lerp(-24, 0, BACK(q))}deg)`, opacity: clamp01(q * 4) }}>
                    {c.label}
                  </div>
                </div>
              );
            })}
          </div>
          {/* the name sits ABOVE its chips so they appear to come from behind it */}
          <div style={zs(30, { position: "relative" })}>
            {ms >= tLic ? <Letters text={licensor.name} t={tLic} mode="flip" stagger={40} style={{ ...big(W, DEAL.name) }} /> : <span style={{ ...big("transparent", DEAL.name) }}>{licensor.name}</span>}
          </div>
        </div>
        <div style={zs(-40, { position: "relative", width: DEAL.arrowW, height: 120, flex: "none" })}>
          {/* the licence terms surface in the streak's wake, each on its word */}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 74, display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 12, rowGap: 4 }}>
            {terms.words.map((w, i) => {
              const q = k(tTerms[i], 220);
              return <span key={i} style={{ ...label(W, DEAL.terms), opacity: q, filter: q < 1 ? `blur(${(1 - q) * 8}px)` : undefined }}>{w}</span>;
            })}
          </div>
          {streak > 0 ? (
            <svg style={{ position: "absolute", left: 0, top: 50, overflow: "visible" }} width={DEAL.arrowW} height={30}>
              <defs>
                <linearGradient id="hs-streak" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0" stopColor={R} stopOpacity={0} />
                  <stop offset="1" stopColor="#ffffff" stopOpacity={1} />
                </linearGradient>
              </defs>
              {/* the line it leaves */}
              <line x1={8} y1={15} x2={8 + (DEAL.arrowW - 16 - head) * EASE_EXPO(streak)} y2={15} stroke={R} strokeWidth={10} strokeLinecap="round" />
              {/* the streak's hot head, gone once it lands */}
              {streak < 1 ? (
                <rect x={8 + (DEAL.arrowW - 16 - head) * EASE_EXPO(streak) - 160} y={9} width={160} height={12} rx={6} fill="url(#hs-streak)" />
              ) : null}
              <polygon points={`${DEAL.arrowW - 8 - head},-6 ${DEAL.arrowW - 8},15 ${DEAL.arrowW - 8 - head},36`} fill={R}
                opacity={streak >= 1 ? 1 : 0} transform={`translate(${streak >= 1 ? 0 : -20} 0)`} />
            </svg>
          ) : null}
        </div>
        {/* Roche drops from above with weight: a fall, a squash on landing, settle */}
        <div style={{ ...big(W, DEAL.name), transformOrigin: "50% 100%", opacity: lq > 0 ? 1 : 0,
          transform: lq <= 0 ? undefined : `${Z(lerp(-700, 30, BOUNCE(lq)))}translateY(${(1 - BOUNCE(lq)) * -520}px) scale(${lq > 0.3 && lq < 0.5 ? 1.08 : 1}, ${lq > 0.3 && lq < 0.5 ? 0.9 : 1})` }}>
          {licensee.name}
        </div>
      </div>

      {/* what the deal is for, flowing in under the row */}
      <div style={zs(70, { position: "absolute", left: 0, right: 0, top: DEAL.tag.top, display: "flex", justifyContent: "center", gap: 22 })}>
        {tag.parts.map((p, i) => {
          const q = k(tTag[i], 220);
          return <span key={i} style={{ ...big(i === 0 ? W : INK_SUB, DEAL.tag.size), opacity: q, transform: `translateY(${(1 - EASE(q)) * 16}px)` }}>{p.text}</span>;
        })}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// AdcBuild — what an ADC is, acted out (white card)
// ══════════════════════════════════════════════════════════════════════════
export const ADC = {
  title: { x: 140, top: 110, size: 190 },
  sub: { top: 330, size: 54 },
  y: { cx: 700, cy: 505, arm: 120, stem: 150, sw: 22 },
  cell: { cx: 1480, cy: 600, r: 190 },
  plabel: { size: 36 },
  dive: 1.07, // the camera's dive as the ADC flies (about the membrane; >1.08 pushes the title off the card)
};

/** The antibody Y (+ its payload), about its fork. `open` 0..1 unfolds it from a point. */
const AntibodyY: React.FC<{ open: number; payQ: number; toxic: number; color: string }> = ({ open, payQ, toxic, color }) => {
  const { arm, stem, sw } = ADC.y;
  if (open <= 0) return null;
  const grow = clamp01(open / 0.5); // the stem grows from the point
  const spread = BACK(clamp01((open - 0.35) / 0.65)); // the arms spring open from closed (pointing up)
  const ang = lerp(0, 45, spread) * (Math.PI / 180);
  const ax = Math.sin(ang) * arm * clamp01(open / 0.35);
  const ay = -Math.cos(ang) * arm * clamp01(open / 0.35);
  const sL = stem * EASE(grow);
  const payFill = interpolateColors(toxic, [0, 1], [color, COLORS.accent]);
  const py = stem + 46;
  // the load: slides in on the linker, overshoots past its seat, then snaps back (recoil)
  const slide = payQ < 0.6 ? (1 - EASE(payQ / 0.6)) * -260 : Math.sin(((payQ - 0.6) / 0.4) * Math.PI) * 14;
  const punch = toxic > 0 && toxic < 1 ? 1 + Math.sin(toxic * Math.PI) * 0.35 : 1;
  return (
    <g>
      <circle r={open < 0.15 ? sw * 0.9 : 0} fill={color} />
      <line x1={0} y1={0} x2={0} y2={sL} stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <line x1={0} y1={0} x2={-ax} y2={ay} stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <line x1={0} y1={0} x2={ax} y2={ay} stroke={color} strokeWidth={sw} strokeLinecap="round" />
      {spread > 0.9 ? (
        <>
          <circle cx={-ax} cy={ay} r={sw * 0.75} fill={color} />
          <circle cx={ax} cy={ay} r={sw * 0.75} fill={color} />
        </>
      ) : null}
      {payQ > 0 ? (
        <g transform={`translate(${slide} 0)`} opacity={clamp01(payQ * 3)}>
          <line x1={0} y1={stem} x2={0} y2={py - 26} stroke={color} strokeWidth={8} strokeDasharray="10 8" />
          <g transform={`translate(0 ${py}) scale(${punch})`}>
            <polygon points="0,-30 30,0 0,30 -30,0" fill={payFill} />
          </g>
        </g>
      ) : null}
    </g>
  );
};

export const AdcBuild: React.FC<Win & {
  title: { text: string } & Cued; // "ADC,"
  sub: { words: string[]; cues: (string | undefined)[] }; // "antibody-drug conjugate"
  antibody: Cued; // "antibody": the Y unfolds
  carries: Cued; // "carries": the payload loads
  toxic: Cued; // "toxic": the payload turns red
  payLabel: { text: string } & Cued; // "payload"
  cell: { text: string } & Cued; // "to": the tumour cell pops in
  fly: Cued; // "tumor": the arc + the dive
  dock: Cued; // "cell.": it lands
}> = ({ from, to, title, sub, antibody, carries, toxic, payLabel, cell, fly, dock }) => {
  const ms = useMs();
  const k = useK();
  const Z = useZ(); // depth (camera on) or "" (flat)
  const P3 = useP3();
  const zs = (z: number, st: React.CSSProperties = {}): React.CSSProperties => ({ ...P3, ...st, transform: Z(z) + (st.transform ?? "") });
  const INK = COLORS.ink;
  const tT = at(title, from + 100, from);
  const tSub = sub.cues.map((c, i) => (c ? at({ word: c }, tT + 500 + i * 500, tT) : tT + 500 + i * 500));
  const tY = at(antibody, tT + 2800, from, tT + 400);
  const tC = at(carries, tY + 800, from, tY + 300);
  const tX = at(toxic, tC + 700, from, tC + 200);
  const tPL = at(payLabel, tX + 340, from, tX + 100);
  const tCell = at(cell, tPL + 550, from, tPL + 200);
  const tFly = at(fly, tCell + 300, from, tCell + 150);
  const tDock = at(dock, tFly + 600, from, tFly + 350);
  const vis = clamp01(interpolate(ms, [from - 100, from + 150, to - 250, to], [0, 1, 1, 0], CLAMP));
  if (vis <= 0) return null;

  const { cx, cy, arm } = ADC.y;
  const C = ADC.cell;
  // the flight: an ARC (quadratic, apex above the line) from the build seat to the dock, turning to point right
  const fq = EASE_IO(clamp01((ms - tFly) / Math.max(350, tDock - tFly)));
  const tipReach = arm * 0.7071 + ADC.y.sw * 0.75;
  const dockX = C.cx - C.r - tipReach + 6;
  const ctrl = { x: (cx + dockX) / 2, y: Math.min(cy, C.cy) - 300 };
  const x = (1 - fq) * (1 - fq) * cx + 2 * (1 - fq) * fq * ctrl.x + fq * fq * dockX;
  const y = (1 - fq) * (1 - fq) * cy + 2 * (1 - fq) * fq * ctrl.y + fq * fq * C.cy;
  const rot = lerp(0, 90, fq);
  // the dive: the camera pushes in on the dock point while the ADC is in the air, and holds
  const dive = lerp(1, ADC.dive, EASE_IO(clamp01((ms - tFly) / Math.max(350, tDock - tFly + 200))));
  // the impact: the membrane dents where the arms hit, and springs back
  const hit = clamp01((ms - tDock) / 380);
  const dent = hit > 0 && hit < 1 ? Math.sin(hit * Math.PI) * (1 - hit) : 0;
  const cq = k(tCell, 460);
  const plq = k(tPL, 300) * (1 - k(tFly, 200));

  return (
    <div style={{ position: "absolute", inset: 0, opacity: vis, transformOrigin: `${C.cx - C.r}px ${C.cy}px`, transform: Z(1) ? undefined : `scale(${dive})`, ...P3 }}>
      <div style={zs(40, { position: "absolute", left: ADC.title.x, top: ADC.title.top })}>
        {ms >= tT ? <Letters text={title.text} t={tT} mode="flip" stagger={60} style={{ ...big(INK, ADC.title.size) }} /> : null}
      </div>
      <div style={{ position: "absolute", left: ADC.title.x + 6, top: ADC.sub.top, display: "flex", gap: 16 }}>
        {sub.words.map((w, i) => {
          const q = k(tSub[i], 180);
          return <span key={i} style={{ ...big(COLORS.grayText, ADC.sub.size), opacity: q, transform: `translateY(${(1 - EASE(q)) * 14}px)` }}>{w}</span>;
        })}
      </div>

      {/* the tumour cell: a membrane with surface antigens; dents once on impact, then still */}
      {cq > 0 ? (
        <svg style={zs(-20, { position: "absolute", left: C.cx - C.r - 40, top: C.cy - C.r - 40, overflow: "visible" })} width={C.r * 2 + 80} height={C.r * 2 + 80}>
          <g transform={`translate(${C.r + 40} ${C.r + 40}) scale(${BACK(cq) * (1 - dent * 0.07)}, ${BACK(cq) * (1 + dent * 0.05)})`}>
            <circle r={C.r} fill={COLORS.panel} stroke={INK} strokeWidth={10} />
            <circle r={C.r * 0.36} fill="none" stroke={inkA(0.35)} strokeWidth={8} />
            {[-150, -120, -60, 0, 60, 120, 150, 180].map((deg) => (
              <rect key={deg} x={C.r - 2} y={-9} width={26} height={18} rx={6} fill={INK} transform={`rotate(${deg})`} />
            ))}
          </g>
        </svg>
      ) : null}
      {cq > 0 ? (
        <div style={{ position: "absolute", left: C.cx - 200, width: 400, top: C.cy + C.r + 30, textAlign: "center", ...label(COLORS.grayText, 36), opacity: clamp01(cq * 3) }}>{cell.text}</div>
      ) : null}

      {/* the ADC */}
      {ms >= tY ? (
        <svg style={zs(Math.sin(fq * Math.PI) * 260 + 20, { position: "absolute", left: 0, top: 0, overflow: "visible" })} width={1920} height={1080}>
          <g transform={`translate(${x} ${y}) rotate(${rot})`}>
            <AntibodyY open={clamp01((ms - tY) / 700)} payQ={clamp01((ms - tC) / 520)} toxic={k(tX, 320)} color={INK} />
          </g>
        </svg>
      ) : null}
      {plq > 0 ? (
        <div style={{ position: "absolute", left: cx + 60, top: cy + ADC.y.stem + 22, ...label(INK, ADC.plabel.size), opacity: clamp01(plq * 3), transform: `translateX(${(1 - EASE(k(tPL, 300))) * -20}px)` }}>{payLabel.text}</div>
      ) : null}
    </div>
  );
};
