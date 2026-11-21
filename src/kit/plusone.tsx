// ─────────────────────────────────────────────────────────────────────────
// KIT · plusone — SKYRIZI PLUS ONE. Added on the AbbVie ABBV-466 / TARGET-CD
// LONG-FORM, 2026-10-25 (HORIZONTAL 16:9). Absolute 1920×1080 seats; import by path.
// Built under the one-mover rule (09-30), the frame budget (10-05) and "busyness is
// the limit, not intensity" (10-22): each cue gets ONE motion, made big; anything
// landed goes still; a finished idea retires. Elements live at DEPTH for the 3D
// camera (kit/camera): `useZ()` / `useP3()` on every wrapper, flat when it is off.
//
// THE SPINE glyph is THE PAIR OF Ys: the antibody AbbVie already sells (white,
// solid) beside the one it added (the scene's one red), joined by a "+".
// Grammar: solid = measured / reported; dashed = not named / no results yet.
//
// `PatientHook` (red): "30.2% at week 12. 40.5% at week 24." 100 patients in a
// 10×10 field; the figure counts while voiced and each patient POPS toward the lens
// as it fills, then counts on to week 24 and ten more rise. The week pill flips in 3D.
// `WhatItIs` (ink): a date block falls and lands, two chips swing in on hinges, the
// name's letters fly in from depth and lock; then one dashed antibody drops in
// spinning, "One new molecule", and SPLITS through depth into the pair.
//
// Every onset is a spoken word with an optional ms pin, clamped monotonic.
// ─────────────────────────────────────────────────────────────────────────

import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { CLAMP, clamp01, COLORS, DISPLAY, INK_SUB, TRACK, caps, useMs } from "./core";
import { TYPE } from "../style";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { YGlyph } from "./pairing";
import { useP3, useZ } from "./camera";

export const EASE = Easing.out(Easing.cubic);
export const EASE_IO = Easing.inOut(Easing.cubic);
export const fadeOut = (ms: number, to: number) => clamp01(interpolate(ms, [to - 300, to], [1, 0], CLAMP));
export const fmt = (v: number, d: number) => v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
/** overshoot then settle: 0 → ~1.1 → 1 (a weighted landing) */
export const back = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : 1 + 2.7 * Math.pow(t - 1, 3) + 1.7 * Math.pow(t - 1, 2));
/** a damped bounce for a thing that lands with weight: 0 at rest */
export const bounce = (t: number) => (t >= 1 ? 0 : Math.exp(-5 * t) * Math.cos(11 * t));
/** a hump: 0 → 1 → 0 across t in [0, 1] */
export const hump = (t: number) => Math.sin(Math.PI * clamp01(t));

/**
 * A two-faced card that flips over on X (0 = front, 1 = back). Draws ONLY the face that is
 * showing, turned the right way: `backfaceVisibility` fails as soon as any ancestor has
 * opacity < 1 (it flattens 3D), and the hidden face then shows MIRRORED ("Week 12" upside
 * down under the dimmed chart, Nel 2026-10-25).
 */
export const FlipFaces: React.FC<{ flip: number; front: React.ReactNode; back: React.ReactNode; style?: React.CSSProperties }> = ({ flip, front, back: rear, style }) => {
  const a = 180 * flip;
  const showBack = flip >= 0.5;
  return (
    <div style={{ position: "absolute", inset: 0, ...style, transform: `rotateX(${showBack ? a - 180 : a}deg)` }}>
      {showBack ? rear : front}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// Person — one patient in the field (head + shoulders), filled from the feet up
// ══════════════════════════════════════════════════════════════════════════
const Person: React.FC<{ s: number; f: number; color: string; id: string }> = ({ s, f, color, id }) => {
  const head = <circle cx={s / 2} cy={s * 0.26} r={s * 0.2} />;
  const body = <rect x={s * 0.17} y={s * 0.52} width={s * 0.66} height={s * 0.48} rx={s * 0.24} />;
  return (
    <svg width={s} height={s} style={{ display: "block", overflow: "visible" }}>
      <g fill={color} opacity={0.22}>{head}{body}</g>
      {f > 0 ? (
        <>
          <clipPath id={id}><rect x={0} y={s * (1 - f)} width={s} height={s * f} /></clipPath>
          <g fill={color} clipPath={`url(#${id})`}>{head}{body}</g>
        </>
      ) : null}
    </svg>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// PatientHook — 30.2% → 40.5%, counted and filled (red world)
// ══════════════════════════════════════════════════════════════════════════
// Left column: the figure with its week pill, the label, the chips. Right: the field.
// Widths by arithmetic (Inter 700 ≈ 0.62em/glyph): "40.5%" at 210 ≈ 650 + 34 + the pill ≈ 260 → x 1075;
// the chip row at TYPE.label ≈ 890 → x 1020; the field starts at 1160. Left group 250–720, centred on the field.
// Settled frame: figure + field (one idea) · label · chip row.
export const HOOK = { left: 130, figTop: 250, figSize: 210, labelTop: 520, chipTop: 650, field: { x: 1160, y: 168, cell: 54, gap: 12 } };
/** the field's centre, for camera framing */
export const HOOK_FIELD_C = { x: 1160 + (10 * 54 + 9 * 12) / 2, y: 168 + (10 * 54 + 9 * 12) / 2 };

export const PatientHook: React.FC<Win & {
  first: { value: number } & Cued; firstEnd: Cued; // 30.2 counts while voiced, lands before this word
  week1: { text: string } & Cued; // the pill lands on the week's NUMBER
  second: { value: number } & Cued; secondEnd: Cued; // counts on to 40.5
  week2: { text: string } & Cued; // the pill flips over in 3D
  label: { text: string } & Cued;
  chips: ({ text: string } & Cued)[];
}> = ({ from, to, first, firstEnd, week1, second, secondEnd, week2, label, chips }) => {
  const ms = useMs();
  const k = useK();
  const Z = useZ();
  const P3 = useP3();
  const W = COLORS.paper;
  const H = HOOK;
  const F = H.field;

  const t1 = at(first, from + 60, from);
  const t1e = at(firstEnd, t1 + 1300, from, t1 + 600);
  const tW1 = at(week1, t1e + 500, from, t1 + 300);
  const t2 = at(second, tW1 + 600, from, t1e + 200);
  const t2e = at(secondEnd, t2 + 1600, from, t2 + 600);
  const tW2 = at(week2, t2e + 600, from, t2e);
  let prev = tW2;
  const tChip = chips.map((c) => (prev = at(c, prev + 900, from, prev + 150)));
  const tLabel = at(label, tChip[0] + 1200, from, tW2 + 300);
  const vis = fadeOut(ms, to);
  if (ms < t1 - 60 || vis <= 0) return null;

  // the count starts at 1 (never a "0.0%" frame) and lands ~200ms before the next word
  const d1 = Math.max(500, t1e - t1 - 200);
  const d2 = Math.max(500, t2e - t2 - 200);
  const q1 = EASE_IO(k(t1, d1));
  const q2 = EASE_IO(k(t2, d2));
  const v = ms < t2 ? 1 + (first.value - 1) * q1 : first.value + (second.value - first.value) * q2;
  // the ms each patient i starts to fill (inverse of the count curve), for its pop toward the lens
  const fillAt = (i: number) => {
    const inv = (q: number, a: number, d: number) => {
      let lo = 0, hi = 1;
      for (let n = 0; n < 18; n++) { const m = (lo + hi) / 2; if (EASE_IO(m) < q) lo = m; else hi = m; }
      return a + lo * d;
    };
    if (i < first.value - 1) return inv(i / (first.value - 1), t1, d1);
    return inv((i - first.value) / (second.value - first.value), t2, d2);
  };

  // the week pill: lands, then flips over (rotateX 180) to the new week
  const tagK = k(tW1, 320);
  const flip = EASE_IO(k(tW2, 520));
  const Face: React.FC<{ text: string }> = ({ text }) => (
    <div style={{ position: "absolute", inset: 0, borderRadius: 38, background: W, color: COLORS.accent, display: "flex", alignItems: "center",
      justifyContent: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: 46, letterSpacing: TRACK.headline, whiteSpace: "nowrap" }}>
      Week&nbsp;{text}
    </div>
  );

  return (
    <AbsoluteFill style={{ opacity: vis, ...P3 }}>
      {/* the figure + its pill in one flex row, so the pill sits by the string */}
      <div style={{ position: "absolute", left: H.left, top: H.figTop, display: "flex", alignItems: "flex-end", gap: 34, ...P3 }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: H.figSize, letterSpacing: TRACK.display, lineHeight: 0.86, color: W,
          opacity: k(t1 - 40, 140), fontVariantNumeric: "tabular-nums" }}>
          {fmt(v, 1)}%
        </div>
        {/* the pill drops in from the lens, then flips in place */}
        <div style={{ position: "relative", width: 250, height: 76, marginBottom: 14, ...P3, opacity: clamp01(tagK * 3),
          transform: `${Z(lerp(700, 0, EASE(tagK)))}scale(${Z(1) ? 1 : lerp(1.5, 1, EASE(tagK))})` }}>
          <FlipFaces flip={flip} front={<Face text={week1.text} />} back={<Face text={week2.text} />} />
        </div>
      </div>

      {/* the label rises out of depth, the chips slam down from in front of the lens */}
      <div style={{ position: "absolute", left: H.left, top: H.labelTop, fontFamily: DISPLAY, fontWeight: 700, fontSize: 84, letterSpacing: TRACK.headline,
        lineHeight: 1, color: W, whiteSpace: "nowrap", opacity: clamp01(k(tLabel, 380) * 2),
        transform: `${Z(lerp(-900, 0, EASE(k(tLabel, 560))))}translateY(${Z(1) ? 0 : (1 - EASE(k(tLabel, 380))) * 20}px)` }}>
        {label.text}
      </div>
      <div style={{ position: "absolute", left: H.left, top: H.chipTop, display: "flex", gap: 16, whiteSpace: "nowrap", ...P3 }}>
        {chips.map((c, i) => {
          const ck = k(tChip[i], 420);
          return (
            <div key={i} style={{ padding: "14px 26px", borderRadius: 30, border: `4px solid ${W}`, ...caps(W, TYPE.label), opacity: clamp01(ck * 3),
              transform: `${Z(lerp(520, 0, back(ck)))}rotateX(${lerp(-70, 0, EASE(ck))}deg) translateY(${(1 - EASE(ck)) * 30}px)`, transformOrigin: "50% 100%" }}>
              {c.text}
            </div>
          );
        })}
      </div>

      {/* the field: 100 patients; each pops toward the lens as it fills, then settles */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: 1, ...P3 }}>
        {Array.from({ length: 100 }).map((_, i) => {
          const x = F.x + (i % 10) * (F.cell + F.gap);
          const y = F.y + Math.floor(i / 10) * (F.cell + F.gap);
          const f = clamp01(v - i);
          const appear = k(t1 - 40 + (i % 10) * 12 + Math.floor(i / 10) * 12, 260); // the empty field ripples in
          const pop = f > 0 ? hump(clamp01((ms - fillAt(i)) / 420)) : 0;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, width: F.cell, height: F.cell, opacity: clamp01(appear * 2),
              transform: `${Z(160 * pop + lerp(-300, 0, EASE(appear)))}scale(${1 + (Z(1) ? 0 : 0.25 * pop)})` }}>
              <Person id={`ph${i}`} s={F.cell} f={f} color={W} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// FlyLetters — a word whose letters fly in from deep space, staggered, and lock
// ══════════════════════════════════════════════════════════════════════════
const FlyLetters: React.FC<{ text: string; t: number; per?: number; dur?: number }> = ({ text, t, per = 45, dur = 620 }) => {
  const ms = useMs();
  const Z = useZ();
  const P3 = useP3();
  return (
    <span style={{ display: "inline-flex", ...P3 }}>
      {text.split("").map((ch, i) => {
        const q = clamp01((ms - (t + i * per)) / dur);
        const e = EASE(q);
        // each letter starts off to its own side, deep, turned; arrives square
        const side = (i - (text.length - 1) / 2) * 90;
        return (
          <span key={i} style={{ display: "inline-block", opacity: clamp01(q * 3), whiteSpace: "pre",
            transform: `${Z(lerp(-2400, 0, e))}translate(${lerp(side, 0, e)}px, ${lerp(i % 2 ? -160 : 160, 0, e)}px) rotateY(${lerp(i % 2 ? 80 : -80, 0, e)}deg) scale(${Z(1) ? 1 : lerp(0.3, 1, e)})` }}>
            {ch}
          </span>
        );
      })}
    </span>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// WhatItIs — the congress, the name, and the pair (ink)
// ══════════════════════════════════════════════════════════════════════════
// Page 1: a date BLOCK falls from above and lands with a bounce; the congress and city
// swing in on hinges; the lead line lands; the name's letters fly in from depth.
// Page 2: page 1 retires as the name rises to the header; ONE dashed antibody drops
// in spinning, "One new molecule" under the header; on "pairs" it splits through depth
// (left goes back, right comes forward, both settle) and the label flips to "Two
// antibodies"; the left takes its names; the right spins once as it fills red.
// The struck "A single new molecule" label of v1 read as a stray mark (Nel, 2026-10-25).
// Settled: name · pair · plates.
const CountLabel: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DISPLAY,
    fontWeight: 700, fontSize: 64, letterSpacing: TRACK.headline, color: COLORS.paper, whiteSpace: "nowrap" }}>{text}</div>
);

export const WHAT = { chipTop: 250, leadTop: 430, nameTop: 500, nameSize: 230, headTop: 92, headScale: 0.42, yCY: 540, yScale: 1.35, xs: [650, 1270], plateTop: 760, labelTop: 205 };

export const WhatItIs: React.FC<Win & {
  chips: ({ text: string; solid?: boolean } & Cued)[]; // the date falls, the rest swing in
  lead: { text: string } & Cued;
  name: { text: string } & Cued;
  rise: Cued; // page 2: the chips go, the name rises to the header
  single: { text: string; after: string } & Cued; // the dashed antibody + its label, which flips to `after` on the split
  split: Cued;
  left: { name: string; sub: string; subWord?: string; subMs?: number } & Cued;
  right: { name: string; fill: Cued } & Cued;
}> = ({ from, to, chips, lead, name, rise, single, split, left, right }) => {
  const ms = useMs();
  const k = useK();
  const Z = useZ();
  const P3 = useP3();
  const Wt = COLORS.paper;
  const R = COLORS.accent;
  const Q = WHAT;

  let prev = from;
  const tChip = chips.map((c, i) => (prev = at(c, prev + 900, from, i ? prev + 150 : from)));
  const tLead = at(lead, prev + 900, from, prev + 200);
  const tName = at(name, tLead + 1500, from, tLead + 300);
  const tRise = at(rise, tName + 1300, from, tName + 500);
  const tSingle = at(single, tRise + 700, from, tRise + 300);
  const tSplit = at(split, tSingle + 1200, from, tSingle + 600);
  const tLeft = at(left, tSplit + 500, from, tSplit + 300);
  const tSub = at({ word: left.subWord, ms: left.subMs }, tLeft + 2500, from, tLeft + 300);
  const tFill = at(right.fill, tSub + 1000, from, tSub + 200);
  const tRight = at(right, tFill + 800, from, tFill + 200);
  const vis = fadeOut(ms, to);
  if (ms < from - 60 || vis <= 0) return null;

  // page 1 retires as the name rises (one mover: the name)
  const riseK = EASE_IO(k(tRise, 620));
  const page1 = 1 - k(tRise, 260);

  // the single antibody: drops from above and in front, spinning 1.5 turns, lands with a bounce
  const sK = k(tSingle, 700);
  const splitK = k(tSplit, 760);
  const singleO = clamp01(sK * 3) * (splitK > 0 ? 0 : 1);
  const dx = (Q.xs[1] - Q.xs[0]) / 2;
  const cx = 960;
  const sep = back(splitK);
  const fillK = EASE(k(tFill, 520));
  const pairO = splitK > 0 ? 1 : 0;
  // the label under the pair: "One new molecule" lands with the antibody, flips on the split, retires on the names
  const labK = k(tSingle + 250, 320);
  const labFlip = EASE_IO(k(tSplit, 480));
  const labO = clamp01(labK * 2) * (1 - k(tSub, 260));

  const Y: React.FC<{ x: number; z: number; ry: number; color: string; tips: ["round" | "square", "round" | "square"]; dashed?: boolean; o?: number; sx?: number }> =
    ({ x, z, ry, color, tips, dashed, o = 1, sx = 1 }) => (
      <div style={{ position: "absolute", left: x - 200, top: Q.yCY - 230, width: 400, height: 460, opacity: o,
        transform: `${Z(z)}rotateY(${ry}deg) scale(${Q.yScale * sx}, ${Q.yScale})` }}>
        <svg width={400} height={460} viewBox="-200 -230 400 460" style={{ display: "block", overflow: "visible" }}>
          <YGlyph color={color} tips={tips} dashed={dashed} />
        </svg>
      </div>
    );

  return (
    <AbsoluteFill style={{ opacity: vis, ...P3 }}>
      {/* page 1: the date block falls and bounces; the others swing in on their left hinge */}
      {page1 > 0 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: Q.chipTop, display: "flex", justifyContent: "center", gap: 22, opacity: page1, ...P3 }}>
          {chips.map((c, i) => {
            const ck = k(tChip[i], c.solid ? 520 : 480);
            const st: React.CSSProperties = c.solid
              ? { opacity: clamp01(ck * 4), background: Wt, color: COLORS.ink, border: `4px solid ${Wt}`,
                  transform: `translateY(${ck < 0.45 ? lerp(-520, 0, EASE_IO(ck / 0.45)) : -46 * bounce((ck - 0.45) / 0.55)}px) rotateX(${ck < 0.45 ? lerp(-60, 0, ck / 0.45) : 0}deg)` }
              : { opacity: clamp01(ck * 3), color: Wt, border: `4px solid ${Wt}`, transformOrigin: "0% 50%",
                  transform: `rotateY(${lerp(-100, 0, back(ck))}deg)` };
            return (
              <div key={i} style={{ padding: "16px 34px", borderRadius: 36, fontFamily: DISPLAY, fontWeight: 700, fontSize: 52, letterSpacing: TRACK.headline,
                whiteSpace: "nowrap", ...st }}>
                {c.text}
              </div>
            );
          })}
        </div>
      ) : null}
      {page1 > 0 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: Q.leadTop, textAlign: "center", ...caps(INK_SUB, TYPE.label + 10),
          opacity: page1 * clamp01(k(tLead, 260) * 1.6), transform: `translateY(${(1 - EASE(k(tLead, 300))) * 16}px)` }}>
          {lead.text}
        </div>
      ) : null}

      {/* the name: letters fly in from depth and lock, then the word rises to the header seat */}
      {ms >= tName - 40 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: lerp(Q.nameTop, Q.headTop, riseK), textAlign: "center", fontFamily: DISPLAY, fontWeight: 700,
          fontSize: Q.nameSize, letterSpacing: TRACK.display, lineHeight: 1, color: Wt, whiteSpace: "nowrap",
          transform: `scale(${lerp(1, Q.headScale, riseK)})`, transformOrigin: "50% 0", ...P3 }}>
          <FlyLetters text={name.text} t={tName} />
        </div>
      ) : null}

      {/* page 2: the single dashed antibody, dropping and spinning in */}
      {singleO > 0 ? (
        <Y x={cx} z={lerp(900, 0, EASE(sK))} ry={lerp(540, 0, EASE(sK))} color={Wt} tips={["round", "square"]} dashed
          o={singleO} />
      ) : null}

      {/* the pair, born from the split: left goes back and out, right comes forward and out, both settle flat */}
      {pairO > 0 ? (
        <>
          <Y x={cx - dx * sep} z={-420 * hump(splitK)} ry={-35 * hump(splitK)} color={Wt} tips={["round", "round"]} sx={1 + 0.3 * hump(splitK * 1.6)} />
          {/* the right antibody: dashed until "second antibody", then it spins once and fills red */}
          <Y x={cx + dx * sep} z={320 * hump(splitK)} ry={35 * hump(splitK) + 360 * EASE_IO(k(tFill, 760))} color={Wt} tips={["square", "square"]} dashed
            o={1 - fillK} sx={1 + 0.3 * hump(splitK * 1.6)} />
          {fillK > 0 ? <Y x={cx + dx * sep} z={0} ry={360 * EASE_IO(k(tFill, 760))} color={R} tips={["square", "square"]} o={fillK} /> : null}
          {/* the "+" punches in from the lens once the pair has landed */}
          <div style={{ position: "absolute", left: cx - 40, top: Q.yCY, width: 80, height: 80, opacity: clamp01((splitK - 0.75) * 6),
            transform: `${Z(lerp(600, 0, EASE(clamp01((splitK - 0.75) * 4))))}scale(${Z(1) ? 1 : lerp(1.8, 1, EASE(clamp01((splitK - 0.75) * 4)))})` }}>
            <svg width={80} height={80} viewBox="-40 -40 80 80"><g stroke={Wt} strokeWidth={14} strokeLinecap="round"><line x1={-32} y1={0} x2={32} y2={0} /><line x1={0} y1={-32} x2={0} y2={32} /></g></svg>
          </div>
          {/* name plates flip up from flat, each under its antibody */}
          <div style={{ position: "absolute", left: Q.xs[0] - 330, width: 660, top: Q.plateTop, textAlign: "center", ...P3 }}>
            <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 64, letterSpacing: TRACK.headline, color: Wt, lineHeight: 1, transformOrigin: "50% 100%",
              opacity: clamp01(k(tLeft, 400) * 3), transform: `rotateX(${lerp(-90, 0, back(k(tLeft, 520)))}deg)` }}>{left.name}</div>
            <div style={{ marginTop: 18, display: "flex", justifyContent: "center" }}>
              <div style={{ padding: "10px 24px", borderRadius: 26, background: Wt, ...caps(COLORS.ink, TYPE.label + 4), transformOrigin: "50% 0%",
                opacity: clamp01(k(tSub, 400) * 3), transform: `rotateX(${lerp(90, 0, back(k(tSub, 520)))}deg)` }}>{left.sub}</div>
            </div>
          </div>
          <div style={{ position: "absolute", left: Q.xs[1] - 330, width: 660, top: Q.plateTop, textAlign: "center", ...P3 }}>
            <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 64, letterSpacing: TRACK.headline, color: R, lineHeight: 1, transformOrigin: "50% 100%",
              opacity: clamp01(k(tRight, 400) * 3), transform: `rotateX(${lerp(-90, 0, back(k(tRight, 520)))}deg)` }}>{right.name}</div>
          </div>
        </>
      ) : null}

      {/* the count label, under the header: "One new molecule" → (flips) "Two antibodies", retires on "Skyrizi" */}
      {labO > 0 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: Q.labelTop, display: "flex", justifyContent: "center", opacity: labO, ...P3 }}>
          <div style={{ position: "relative", width: 760, height: 80 }}>
            <FlipFaces flip={labFlip} front={<CountLabel text={single.text} />} back={<CountLabel text={single.after} />} />
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
