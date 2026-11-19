// ─────────────────────────────────────────────────────────────────────────
// KIT · split — THE TWO LINES. Added on the Merck × Moderna intismeran LONG-FORM,
// 2026-10-30 (HORIZONTAL 16:9). Absolute 1920×1080 seats; import by path. One-mover,
// frame budget, depth by default (kit/camera: `useZ()` / `useP3()` on every wrapper).
//
// THE SPINE: two lines that run as one ribbon for six months, then split. Red = the
// combination, white = the standard drug alone. Schematic on purpose: the release
// gives no curve, only the two-year values, so the frame always carries a note.
//
// `LevelSplit` (ink): the ribbon races to a six-month tick, the lines part, the gap
// fills, "More than half" flies out of depth word by word as it is spoken.
// `Readout` (red): a date block falls, the name's letters fly in; then a white card
// hinges up off the floor and retires into depth; then the journal's name arrives.
//
// Every onset is a spoken word with an optional ms pin (pins sit inside measured pauses).
// ─────────────────────────────────────────────────────────────────────────

import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { accentA, CLAMP, clamp01, COLORS, DISPLAY, INK_SUB, TRACK, caps, useMs } from "./core";
import { TYPE } from "../style";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { useP3, useZ } from "./camera";
import { back, EASE, EASE_IO, fadeOut } from "./plusone";

/** a thud after a landing: a damped dip, 0 at impact and at rest */
export const thud = (t: number) => (t <= 0 || t >= 1 ? 0 : Math.exp(-5 * t) * Math.sin(11 * t));

const extrude = (c: string, n = 5) => Array.from({ length: n }, (_, i) => `${i + 1}px ${i + 1}px 0 ${c}`).join(", ");

/** One word whose letters fly out of depth and lock, starting on its cue. */
export const FlyWord: React.FC<{ text: string; t: number; size: number; color: string; shade: string; stagger?: number; dur?: number; fromZ?: number }> = ({
  text, t, size, color, shade, stagger = 30, dur = 320, fromZ = 1000,
}) => {
  const k = useK();
  const Z = useZ();
  const P3 = useP3();
  return (
    <span style={{ display: "inline-block", whiteSpace: "nowrap", ...P3 }}>
      {text.split("").map((c, i) => {
        const a = t + i * stagger;
        const q = EASE(k(a, dur));
        return (
          <span key={i} style={{ display: "inline-block", fontFamily: DISPLAY, fontWeight: 700, fontSize: size, lineHeight: 1, letterSpacing: TRACK.display, color,
            textShadow: extrude(shade), opacity: k(a, 90), transform: `${Z(lerp(fromZ, 0, q))}translateY(${lerp(60, 0, q)}px) rotateY(${lerp(-50, 0, q)}deg)` }}>
            {c === " " ? "\u00A0" : c}
          </span>
        );
      })}
    </span>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// The spine's geometry (shared with the §5 chart and the §6 interrogation)
// ══════════════════════════════════════════════════════════════════════════
export const SPINE = {
  x0: 180, x6: 570, x24: 1740, yTop: 180, y6: 380, yRed: 540, yWhite: 780, w: 12,
  ribbon: (dy: number) => `M180,${180 + dy} C300,${230 + dy} 450,${320 + dy} 570,${380 + dy}`,
  red: "M570,373 C900,430 1400,510 1740,540",
  white: "M570,387 C800,520 1300,720 1740,780",
  gap: "M570,373 C900,430 1400,510 1740,540 L1740,780 C1300,720 800,520 570,387 Z",
};

/** The two lines. `ribbon` / `split` / `gap` are 0..1 draw progress. */
export const TwoLines: React.FC<{ ribbon: number; split: number; gap: number; clipId: string; base?: string; splitBase?: number; postOpacity?: number }> = ({
  ribbon, split, gap, clipId, base = COLORS.paper, splitBase, postOpacity = 1,
}) => {
  const S = SPINE;
  const line = (d: string, color: string, q: number) => (q <= 0 ? null : (
    <path d={d} fill="none" stroke={color} strokeWidth={S.w} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - q} />
  ));
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {gap > 0 ? (
        <>
          <clipPath id={clipId}><rect x={S.x6} y={0} width={(S.x24 - S.x6) * gap} height={1080} /></clipPath>
          <path d={S.gap} fill={accentA(0.2)} clipPath={`url(#${clipId})`} opacity={postOpacity} />
        </>
      ) : null}
      {line(S.ribbon(7), base, ribbon)}
      {line(S.ribbon(-7), COLORS.accent, ribbon)}
      <g opacity={postOpacity}>
        {line(S.white, base, splitBase ?? split)}
        {line(S.red, COLORS.accent, split)}
      </g>
    </svg>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// LevelSplit — the hook (ink)
// ══════════════════════════════════════════════════════════════════════════
// Settled frame: the lines · "More than half" · the tick · one line label · the note.
export const LevelSplit: React.FC<Win & {
  start: Cued; // the ribbon starts
  tick: { text: string } & Cued; // the six-month tick drops in ahead of the ribbon
  end: Cued; // the ribbon reaches the tick on this word
  lead: ({ text: string } & Cued)[]; // the lead lines, one per cue
  leadOut: Cued; // they retire (a pin inside the pause)
  split: Cued; // the lines part
  gap: Cued; // the gap fills
  claim: ({ text: string } & Cued)[]; // the hero, word by word
  lineLabel: { text: string };
  note: { text: string };
}> = ({ from, to, start, tick, end, lead, leadOut, split, gap, claim, lineLabel, note }) => {
  const ms = useMs();
  const k = useK();
  const Z = useZ();
  const P3 = useP3();
  const S = SPINE;

  const t0 = at(start, from, from);
  const tT = at(tick, t0 + 400, from, t0);
  const tE = at(end, t0 + 4000, from, tT);
  const tOut = at(leadOut, tE + 200, from, tE);
  const tS = at(split, tOut + 800, from, tOut);
  const tG = at(gap, tS + 1800, from, tS);
  const tC = claim.map((c) => at(c, tG + 500, from, tG));
  const vis = fadeOut(ms, to);
  if (ms < t0 - 40 || vis <= 0) return null;

  const dS = Math.max(600, tG - tS - 60);
  const tickQ = EASE(k(tT, 300));
  const labelQ = k(tS + dS - 200, 300);

  return (
    <AbsoluteFill style={{ opacity: vis, ...P3 }}>
      <TwoLines ribbon={k(t0, tE - t0)} split={EASE_IO(k(tS, dS))} gap={EASE_IO(k(tG, 700))} clipId="hook-gap" />

      {/* the tick drops in ahead of the ribbon: it is what the ribbon races to */}
      <div style={{ position: "absolute", left: S.x6 - 1, top: 290, width: 3, height: 180, background: COLORS.paper, transform: `${Z(lerp(420, 0, tickQ))}`, opacity: k(tT, 100) }} />
      <div style={{ position: "absolute", left: S.x6 - 200, width: 400, top: 232, textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: 44,
        letterSpacing: TRACK.headline, color: COLORS.paper, lineHeight: 1, transform: `${Z(lerp(420, 0, tickQ))}`, opacity: k(tT, 100) }}>
        {tick.text}
      </div>

      {/* the lead lines hinge up, each on its own words */}
      {ms < tOut + 300 ? (
        <div style={{ position: "absolute", left: S.x0, top: 510, opacity: 1 - k(tOut, 280), transformOrigin: "50% 100%", ...P3 }}>
          {lead.map((l, i) => {
            const a = at(l, t0 + 1000, from, t0);
            const q = EASE(k(a, 300));
            return (
              <div key={l.text} style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 62, lineHeight: 1.16, letterSpacing: TRACK.headline, color: COLORS.paper, whiteSpace: "nowrap",
                opacity: k(a, 80), transformOrigin: "0% 100%", transform: `rotateX(${lerp(-80, 0, q)}deg)` }}>
                {l.text}
              </div>
            );
          })}
        </div>
      ) : null}

      {/* the white line's name, once it has reached the end of the chart */}
      <div style={{ position: "absolute", right: 1920 - S.x24, top: S.yWhite + 26, ...caps(COLORS.paper, 34), opacity: labelQ, whiteSpace: "nowrap" }}>{lineLabel.text}</div>

      {/* the hero: each word's letters fly out of depth as it is spoken */}
      <div style={{ position: "absolute", left: 790, top: 118, display: "flex", gap: 34, ...P3 }}>
        {claim.map((c, i) => <FlyWord key={c.text} text={c.text} t={tC[i]} size={128} color={COLORS.paper} shade="#6b6b6b" stagger={24} dur={280} />)}
      </div>

      <div style={{ position: "absolute", left: S.x0, top: 918, ...caps(INK_SUB, TYPE.label), opacity: k(tS, 300), whiteSpace: "nowrap" }}>{note.text}</div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// Readout — the news, in two movements (red)
// ══════════════════════════════════════════════════════════════════════════
// Settled A: the name (hero) · date + companies · trial + disease.
// Settled B: the symposium card alone, then the journal's name + its label.
export const Readout: React.FC<Win & {
  date: { text: string } & Cued;
  companies: ({ text: string } & Cued)[];
  phase: { text: string } & Cued;
  name: ({ text: string } & Cued)[];
  disease: { text: string } & Cued;
  aOut: Cued; // movement A retires (a pin inside the pause)
  card: Cued; // the card hinges up
  title: ({ text: string } & Cued)[]; // its lines, on their words
  venue: ({ text: string } & Cued)[];
  cardOut: Cued; // it retires into depth (a pin inside the pause)
  accepted: { text: string } & Cued;
  journal: ({ text: string; row: number } & Cued)[];
}> = ({ from, to, date, companies, phase, name, disease, aOut, card, title, venue, cardOut, accepted, journal }) => {
  const ms = useMs();
  const k = useK();
  const Z = useZ();
  const P3 = useP3();
  const W = COLORS.paper;
  const SHADE = "#a3121b";

  const tD = at(date, from, from);
  const tA = at(aOut, tD + 6000, from, tD);
  const tC = at(card, tA + 900, from, tA);
  const tCO = at(cardOut, tC + 4000, from, tC);
  const tJ = at(accepted, tCO + 300, from, tCO);
  const vis = fadeOut(ms, to);
  if (ms < tD - 40 || vis <= 0) return null;

  // A: the block falls and lands with weight
  const fall = EASE_IO(k(tD, 360));
  const dip = thud(k(tD + 360, 500));
  const aQ = k(tA, 300);
  const cardUp = back(k(tC, 460));
  const cOut = EASE_IO(k(tCO, 340));

  return (
    <AbsoluteFill style={{ opacity: vis, ...P3 }}>
      {/* ── movement A ── */}
      {aQ < 1 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - aQ, transform: `${Z(lerp(0, 700, EASE_IO(aQ)))}`, ...(aQ === 0 ? P3 : {}) }}>
          <div style={{ position: "absolute", left: 130, top: 150, display: "flex", alignItems: "center", gap: 40, ...P3 }}>
            <div style={{ padding: "22px 40px", borderRadius: 22, background: W, color: COLORS.accent, fontFamily: DISPLAY, fontWeight: 700, fontSize: 72, letterSpacing: TRACK.headline, lineHeight: 1, whiteSpace: "nowrap",
              opacity: k(tD, 60), transform: `translateY(${lerp(-760, 0, fall) + dip * 26}px) scaleY(${1 - dip * 0.08})`, transformOrigin: "50% 100%" }}>
              {date.text}
            </div>
            {companies.map((c) => {
              const a = at(c, tD + 1000, from, tD);
              const q = back(k(a, 320));
              return (
                <div key={c.text} style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 72, letterSpacing: TRACK.headline, lineHeight: 1, color: W, whiteSpace: "nowrap",
                  opacity: k(a, 80), transformOrigin: "50% 100%", transform: `rotateX(${lerp(-85, 0, clamp01(q))}deg)` }}>
                  {c.text}
                </div>
              );
            })}
          </div>

          <div style={{ position: "absolute", left: 130, top: 400, display: "flex", gap: 40, ...P3 }}>
            {name.map((n) => <FlyWord key={n.text} text={n.text} t={at(n, tD + 4000, from, tD)} size={170} color={W} shade={SHADE} stagger={36} />)}
          </div>

          <div style={{ position: "absolute", left: 130, top: 640, display: "flex", gap: 34, alignItems: "baseline", ...P3 }}>
            {[phase, disease].map((c) => {
              const a = at(c, tD + 2000, from, tD);
              const q = EASE(k(a, 300));
              return (
                <div key={c.text} style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 64, letterSpacing: TRACK.headline, lineHeight: 1, color: W, whiteSpace: "nowrap",
                  opacity: k(a, 80), transformOrigin: "0% 100%", transform: `rotateX(${lerp(-80, 0, q)}deg)` }}>
                  {c.text}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* ── movement B: the card hinges up off the floor, then falls away into depth ── */}
      {ms >= tC - 40 && cOut < 1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 240, display: "flex", justifyContent: "center", opacity: 1 - cOut,
          transform: `${Z(lerp(0, -900, cOut))}translateY(${lerp(0, -60, cOut)}px)`, ...(cOut === 0 ? P3 : {}) }}>
          <div style={{ padding: "64px 84px", minHeight: 440, boxSizing: "border-box", borderRadius: 30, background: W, transformOrigin: "50% 100%", transform: `rotateX(${lerp(82, 0, cardUp)}deg)`, opacity: k(tC, 80) }}>
            {title.map((l) => {
              const a = at(l, tC + 500, from, tC);
              return (
                <div key={l.text} style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 96, letterSpacing: TRACK.headline, lineHeight: 1.1, color: COLORS.ink, whiteSpace: "nowrap",
                  opacity: k(a, 100), transform: `translateY(${lerp(26, 0, EASE(k(a, 260)))}px)` }}>
                  {l.text}
                </div>
              );
            })}
            <div style={{ display: "flex", gap: 22, marginTop: 40 }}>
              {venue.map((v) => {
                const a = at(v, tC + 2000, from, tC);
                return (
                  <div key={v.text} style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 56, letterSpacing: TRACK.headline, lineHeight: 1, color: COLORS.accent, whiteSpace: "nowrap",
                    opacity: k(a, 100), transform: `translateY(${lerp(20, 0, EASE(k(a, 240)))}px)` }}>
                    {v.text}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      {/* ── movement B2: the journal's name ── */}
      {ms >= tJ - 40 ? (
        <div style={{ position: "absolute", left: 150, top: 262, ...P3 }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 64, letterSpacing: TRACK.headline, lineHeight: 1, color: W, whiteSpace: "nowrap", marginBottom: 44,
            opacity: k(tJ, 80), transformOrigin: "0% 100%", transform: `rotateX(${lerp(-80, 0, EASE(k(tJ, 280)))}deg)` }}>
            {accepted.text}
          </div>
          {[0, 1].map((row) => (
            <div key={row} style={{ display: "flex", gap: 36, marginBottom: 14, ...P3 }}>
              {journal.filter((j) => j.row === row).map((j) => <FlyWord key={j.text} text={j.text} t={at(j, tJ + 500, from, tJ)} size={136} color={W} shade={SHADE} stagger={26} dur={280} />)}
            </div>
          ))}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
