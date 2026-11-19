// ─────────────────────────────────────────────────────────────────────────
// KIT · pepstar — A PHASE 1 PILL AT A PHASE 3 PRICE. Added on the Gilead × PepStar
// REEL, 2026-10-25 (VERTICAL 9:16). Absolute 1080×1920 seats; import by path.
// Built under one-mover (09-30), the frame budget (10-05) and "busyness is the
// limit, not intensity" (10-22/10-23): each cue gets ONE big move, landed things
// go still, nothing loops, a finished idea retires.
//
// THE SPINE is THE PILL (half solid, half outline) and THE RAIL it sits on: a
// vertical Phase 1 → 3 track, Phase 1 at the bottom. Born in the hook, seated on
// the rail in the asset scene, called back in "the read" where the price climbs
// to Phase 3 while the pill stays on Phase 1. Shared geometry in RAIL so the
// callback seats on the same pixels.
// Grammar: solid = exists / disclosed; dashed = not yet (the combination pill).
//
// On-screen limits (script.md comment): the deal is AGREED, not paid or closed;
// Gilead buys the PROGRAM, not the company; never "first oral".
//
// Every onset is a spoken word with an optional ms pin, clamped monotonic.
// ─────────────────────────────────────────────────────────────────────────

import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { CLAMP, clamp01, COLORS, DISPLAY, TRACK, caps, useMs, useInkSub } from "./core";
import { TYPE } from "../style";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { Scramble } from "./course";

const EASE = Easing.out(Easing.cubic);
const EASE_IO = Easing.inOut(Easing.cubic);
const EASE_IN = Easing.in(Easing.quad);
const fadeOut = (ms: number, to: number) => clamp01(interpolate(ms, [to - 300, to], [1, 0], CLAMP));
// overshoot for a weighted landing: 0 → ~1.08 → 1
const back = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : 1 + 2.4 * Math.pow(t - 1, 3) + 1.4 * Math.pow(t - 1, 2));
// a gravity drop that lands at t=0.7 and squashes flat, then recovers by t=1
const drop = (t: number) => {
  if (t <= 0) return { y: -1, sx: 1, sy: 1 };
  if (t < 0.7) return { y: -1 + EASE_IN(t / 0.7), sx: 1, sy: 1 };
  const s = Math.sin(((t - 0.7) / 0.3) * Math.PI) * Math.min(1, 1.6 - t);
  return { y: 0, sx: 1 + 0.16 * s, sy: 1 - 0.2 * s };
};

// ══════════════════════════════════════════════════════════════════════════
// Pill — the capsule glyph. Left half solid, right half outline; `dashed` = not yet
// ══════════════════════════════════════════════════════════════════════════
export const Pill: React.FC<{ w: number; color: string; dashed?: boolean; solidHalf?: boolean; sw?: number }> = ({ w, color, dashed = false, solidHalf = true, sw = 8 }) => {
  const h = w * 0.4;
  const r = h / 2;
  return (
    <svg width={w + sw} height={h + sw} style={{ display: "block", overflow: "visible" }}>
      <g transform={`translate(${sw / 2} ${sw / 2})`}>
        {solidHalf && !dashed ? <path d={`M ${w / 2} 0 H ${r} A ${r} ${r} 0 0 0 ${r} ${h} H ${w / 2} Z`} fill={color} /> : null}
        <rect x={0} y={0} width={w} height={h} rx={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={dashed ? `${sw * 2.4} ${sw * 1.8}` : undefined} />
        <line x1={w / 2} y1={0} x2={w / 2} y2={h} stroke={color} strokeWidth={sw} strokeDasharray={dashed ? `${sw * 1.6} ${sw * 1.4}` : undefined} />
      </g>
    </svg>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// Rail — the Phase 1 → 3 track, Phase 1 at the bottom. `draw` 0→1 grows it up.
// ══════════════════════════════════════════════════════════════════════════
export const RAIL = { cx: 540, bottom: 1540, top: 1060, pillW: 220, labels: ["Phase 1", "Phase 2", "Phase 3"] };
export const rungY = (i: number) => RAIL.bottom - (i * (RAIL.bottom - RAIL.top)) / 2;

export const Rail: React.FC<{ draw: number; color: string; sub: string; lit?: number }> = ({ draw, color, sub, lit = 0 }) => {
  const R = RAIL;
  const yTop = lerp(R.bottom, R.top, draw);
  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={R.cx} y1={R.bottom} x2={R.cx} y2={yTop} stroke={sub} strokeWidth={6} strokeLinecap="round" />
        {R.labels.map((_, i) => (rungY(i) >= yTop - 1 ? <line key={i} x1={R.cx - 44} x2={R.cx + 44} y1={rungY(i)} y2={rungY(i)} stroke={i === lit ? color : sub} strokeWidth={6} strokeLinecap="round" /> : null))}
      </svg>
      {R.labels.map((l, i) => (
        <div key={i} style={{ position: "absolute", left: R.cx + R.pillW / 2 + 48, top: rungY(i) - 24, whiteSpace: "nowrap", ...caps(i === lit ? color : sub, TYPE.label),
          opacity: clamp01((draw - i / 2) * 6 + (i === 0 ? 1 : 0)) }}>
          {l}
        </div>
      ))}
    </>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// PriceHook — "$1.275 billion. In cash. Upfront. For a Phase 1 pill." + the payer (red)
// ══════════════════════════════════════════════════════════════════════════
// Page 1: the figure SMASH-ZOOMS out of blur and counts while voiced; "billion" lands;
// "Cash" slams a plate and "Upfront" joins it in the same flex row; a "Phase 1" step
// rises from below; the pill falls onto it with a squash.
// Page 2 ("That is what…"): the step + pill fall out of frame; the figure group rises to
// the top; Gilead stamps; a straight dashed arrow with an open chevron draws down to
// the PepStar chip; "agreed · program" lands under it (never "paid": the deal has not closed).
// Settled frames: p1 figure · plate · pill-on-step (3). p2 figure+plate · Gilead→PepStar · tag.
export const HOOK = { figTop: 470, figSize: 230, unitTop: 730, plateTop: 870, stepTop: 1430, stepW: 460, stepH: 104, pillW: 260, rise: -250,
  payerTop: 930, arrowTop: 1090, arrowBot: 1250, chipTop: 1270, tagTop: 1420 };

export const PriceHook: React.FC<Win & {
  figure: { value: number } & Cued; unit: { text: string } & Cued;
  plateA: { text: string } & Cued; plateB: { text: string } & Cued;
  step: { text: string } & Cued; pill: Cued;
  leave: Cued; rise: Cued;
  payer: { text: string } & Cued; arrow: Cued; seller: { text: string } & Cued; tag: { text: string } & Cued;
}> = ({ from, to, figure, unit, plateA, plateB, step, pill, leave, rise, payer, arrow, seller, tag }) => {
  const ms = useMs();
  const k = useK();
  const W = COLORS.paper;
  const H = HOOK;

  const tFig = at(figure, from, from);
  const tUnit = at(unit, tFig + 1900, from, tFig + 600);
  const tA = at(plateA, tUnit + 1500, from, tUnit + 300);
  const tB = at(plateB, tA + 800, from, tA + 300);
  const tStep = at(step, tB + 1400, from, tB + 300);
  const tPill = at(pill, tStep + 1000, from, tStep + 400);
  const tLeave = at(leave, tPill + 500, from, tPill + 250);
  const tRise = at(rise, tLeave + 450, from, tLeave + 350);
  const tPayer = at(payer, tRise + 300, from, tRise + 200);
  const tArrow = at(arrow, tPayer + 700, from, tPayer + 300);
  const tSeller = at(seller, tArrow + 300, from, tArrow + 200);
  const tTag = at(tag, tSeller + 500, from, tSeller + 300);
  const vis = fadeOut(ms, to);
  if (ms < tFig - 60 || vis <= 0) return null;

  // the smash zoom: out of a blur at 2.6× to rest in 420ms
  const zk = EASE(k(tFig, 420));
  // the count runs while "$1.275" is voiced and lands ~150ms before "billion"
  const q = EASE_IO(k(tFig, Math.max(600, tUnit - tFig - 150)));
  const v = 0.1 + (figure.value - 0.1) * q;
  const riseK = EASE_IO(k(tRise, 520));
  const gy = H.rise * riseK;
  const gs = lerp(1, 0.78, riseK);

  // page 1 objects leave on "That": a fall out of the bottom of the frame
  const lk = EASE_IN(k(tLeave, 420));
  const stepK = back(k(tStep, 460));
  const pd = drop(k(tPill, 620));
  const arrowK = EASE(k(tArrow, 380));
  const stamp = (t: number) => {
    const s = k(t, 260);
    return { opacity: clamp01(s * 3), transform: `scale(${lerp(1.7, 1, EASE(s))})` };
  };

  return (
    <AbsoluteFill style={{ opacity: vis }}>
      {/* the figure group: figure · unit · plate, rises to the top on page 2 */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transformOrigin: `540px ${H.figTop}px`, transform: `translateY(${gy}px) scale(${gs})` }}>
        <div style={{ position: "absolute", left: 0, width: 1080, top: H.figTop, textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: H.figSize,
          letterSpacing: TRACK.display, lineHeight: 1, color: W, fontVariantNumeric: "tabular-nums",
          opacity: clamp01(zk * 2.5), transform: `scale(${lerp(2.6, 1, zk)})`, filter: zk < 1 ? `blur(${(1 - zk) * 24}px)` : undefined }}>
          ${v.toFixed(3)}
        </div>
        <div style={{ position: "absolute", left: 0, width: 1080, top: H.unitTop, textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: TYPE.headline + 12,
          letterSpacing: TRACK.headline, color: W, opacity: clamp01(k(tUnit, 200) * 2), transform: `translateY(${(1 - EASE(k(tUnit, 300))) * 40}px)` }}>
          {unit.text}
        </div>
        {/* one plate: "Cash" slams, "Upfront" joins it in the same flex row (laid out by the strings) */}
        <div style={{ position: "absolute", left: 0, width: 1080, top: H.plateTop, display: "flex", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", height: 92, borderRadius: 46, background: W, padding: "0 40px", gap: 26, whiteSpace: "nowrap",
            fontFamily: DISPLAY, fontWeight: 700, fontSize: 50, letterSpacing: TRACK.headline, color: COLORS.accent, ...stamp(tA) }}>
            <span>{plateA.text}</span>
            {ms >= tB ? (
              <>
                <span style={{ width: 12, height: 12, borderRadius: 6, background: COLORS.accent, opacity: k(tB, 160) }} />
                <span style={{ display: "inline-block", ...stamp(tB) }}>{plateB.text}</span>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* page 1: the Phase 1 step rises from below, the pill falls onto it */}
      {lk < 1 ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `translateY(${lk * 900}px)` }}>
          <div style={{ position: "absolute", left: 540 - H.stepW / 2, top: H.stepTop, width: H.stepW, height: H.stepH, borderRadius: 18, background: W,
            display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: 52, letterSpacing: TRACK.headline,
            color: COLORS.accent, opacity: clamp01(k(tStep, 120) * 3), transform: `translateY(${(1 - stepK) * 340}px)` }}>
            {step.text}
          </div>
          {ms >= tPill ? (
            <div style={{ position: "absolute", left: 540 - H.pillW / 2, top: H.stepTop - H.pillW * 0.4 - 14, transformOrigin: "50% 100%",
              transform: `translateY(${pd.y * 900}px) scale(${pd.sx}, ${pd.sy})` }}>
              <Pill w={H.pillW} color={W} />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* page 2: the payer → the seller's program */}
      {ms >= tPayer ? (
        <div style={{ position: "absolute", left: 0, width: 1080, top: H.payerTop, textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: TYPE.display,
          letterSpacing: TRACK.display, lineHeight: 1, color: W, ...stamp(tPayer) }}>
          {payer.text}
        </div>
      ) : null}
      {ms >= tArrow ? (
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          {(() => {
            const yTip = lerp(H.arrowTop, H.arrowBot, arrowK);
            return (
              <g stroke={W} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round">
                <line x1={540} y1={H.arrowTop} x2={540} y2={yTip} strokeDasharray="22 16" />
                <polyline points={`${520},${yTip - 24} 540,${yTip} ${560},${yTip - 24}`} />
              </g>
            );
          })()}
        </svg>
      ) : null}
      {ms >= tSeller ? (
        <div style={{ position: "absolute", left: 0, width: 1080, top: H.chipTop, display: "flex", justifyContent: "center" }}>
          <div style={{ padding: "20px 40px", borderRadius: 24, border: `6px solid ${W}`, fontFamily: DISPLAY, fontWeight: 700, fontSize: 66, letterSpacing: TRACK.headline,
            color: W, whiteSpace: "nowrap", opacity: clamp01(k(tSeller, 160) * 3), transform: `translateY(${(1 - back(k(tSeller, 420))) * -60}px)` }}>
            {seller.text}
          </div>
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 0, width: 1080, top: H.tagTop, textAlign: "center", ...caps(W, TYPE.label), opacity: k(tTag, 240),
        transform: `translateY(${(1 - EASE(k(tTag, 300))) * 16}px)` }}>
        {tag.text}
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// AssetCard — "The asset: HCXT-2001, an oral IL-23 receptor inhibitor still in early trials." (ink, scrim)
// ══════════════════════════════════════════════════════════════════════════
// A kicker; the name SCRAMBLES and locks with a slam; two spec lines whip in from
// the left on their words; then the RAIL draws up on "still" and the pill drops onto
// the Phase 1 rung on "early". Settled: name + two lines (one card) · rail + pill.
export const ASSET = { kickTop: 300, nameTop: 370, nameSize: 172, line1Top: 600, line2Top: 690, lineSize: 64 };

export const AssetCard: React.FC<Win & {
  kicker: { text: string } & Cued; name: { text: string } & Cued;
  lines: [{ text: string } & Cued, { text: string } & Cued];
  rail: Cued; pill: Cued;
}> = ({ from, to, kicker, name, lines, rail, pill }) => {
  const ms = useMs();
  const k = useK();
  const W = COLORS.paper;
  const sub = useInkSub();
  const A = ASSET;

  const tKick = at(kicker, from, from);
  const tName = at(name, tKick + 1000, from, tKick + 300);
  const tL1 = at(lines[0], tName + 2000, from, tName + 600);
  const tL2 = at(lines[1], tL1 + 500, from, tL1 + 250);
  const tRail = at(rail, tL2 + 1800, from, tL2 + 400);
  const tPill = at(pill, tRail + 600, from, tRail + 350);
  const vis = fadeOut(ms, to);
  if (ms < tKick - 60 || vis <= 0) return null;

  const nameSlam = k(tName + 520, 220);
  const whip = (t: number) => {
    const s = EASE(k(t, 360));
    return { opacity: clamp01(s * 3), transform: `translateX(${(1 - s) * -700}px) skewX(${(1 - s) * -18}deg)`, filter: s < 1 ? `blur(${(1 - s) * 10}px)` : undefined };
  };
  const pd = drop(k(tPill, 560));
  const pillTop = rungY(0) - RAIL.pillW * 0.4 - 12; // seated ON the Phase 1 rung

  return (
    <AbsoluteFill style={{ opacity: vis }}>
      <div style={{ position: "absolute", left: 0, width: 1080, top: A.kickTop, textAlign: "center", ...caps(sub, TYPE.label), opacity: k(tKick, 240) }}>
        {kicker.text}
      </div>
      <div style={{ position: "absolute", left: 0, width: 1080, top: A.nameTop, textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: A.nameSize,
        letterSpacing: TRACK.display, lineHeight: 1, color: W, whiteSpace: "nowrap", transform: `scale(${1 + 0.06 * Math.sin(nameSlam * Math.PI)})` }}>
        <Scramble text={name.text} t={tName} />
      </div>
      {lines.map((l, i) => (
        <div key={i} style={{ position: "absolute", left: 0, width: 1080, top: i ? A.line2Top : A.line1Top, textAlign: "center", fontFamily: DISPLAY, fontWeight: i ? 400 : 700,
          fontSize: A.lineSize, letterSpacing: TRACK.headline, color: W, whiteSpace: "nowrap", ...whip(i ? tL2 : tL1) }}>
          {l.text}
        </div>
      ))}
      {ms >= tRail ? <Rail draw={EASE_IO(k(tRail, 600))} color={W} sub={sub} lit={ms >= tPill ? 0 : -1} /> : null}
      {ms >= tPill ? (
        <div style={{ position: "absolute", left: RAIL.cx - RAIL.pillW / 2, top: pillTop, transformOrigin: "50% 100%", transform: `translateY(${pd.y * 700}px) scale(${pd.sx}, ${pd.sy})` }}>
          <Pill w={RAIL.pillW} color={W} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// TheRead — "The read: pharma is paying Phase 3 money for Phase 1 oral programs." (white card)
// ══════════════════════════════════════════════════════════════════════════
// THE SPINE's callback: the rail from the asset scene, filmed 1.4× larger from its foot.
// It draws on "The read" and the pill drops onto Phase 1 on "Pharma"; on "paying" the
// red price plate slams beside the Phase 1 rung (the scene's one red); on "Phase 3 money"
// it CLIMBS the rail to the Phase 3 rung and that label goes bold; on "for Phase 1" a
// straight dashed leader with an open chevron drops from the plate back down to the
// Phase 1 rung, where the pill still sits. The kicker says "The read": an opinion.
// Settled: kicker · rail + pill · plate at Phase 3 + its leader.
// The plate clears the pill by 30px at the Phase 1 rung (pill 430–650, plate 170–400 unscaled);
// at 1.25× the plate's left edge lands at x 77 and the "Phase 3" label ends at ~950.
export const READ = { kickTop: 300, scale: 1.25, ox: 540, oy: 1580, plateW: 230, plateH: 84 };

export const TheRead: React.FC<Win & {
  kicker: { text: string } & Cued; rail: Cued; pill: Cued;
  plate: { text: string } & Cued; climb: Cued; leader: Cued;
}> = ({ from, to, kicker, rail, pill, plate, climb, leader }) => {
  const ms = useMs();
  const k = useK();
  const INK = COLORS.ink;
  const R = COLORS.accent;
  const sub = `rgba(0,0,0,0.38)`;
  const Q = READ;

  const tKick = at(kicker, from, from);
  const tRail = at(rail, tKick, from, tKick);
  const tPill = at(pill, tRail + 800, from, tRail + 500);
  const tPlate = at(plate, tPill + 800, from, tPill + 300);
  const tClimb = at(climb, tPlate + 500, from, tPlate + 300);
  const tLead = at(leader, tClimb + 1100, from, tClimb + 600);
  const vis = fadeOut(ms, to);
  if (ms < tKick - 60 || vis <= 0) return null;

  const pd = drop(k(tPill, 560));
  const climbK = EASE_IO(k(tClimb, 700));
  const plateX = RAIL.cx - RAIL.pillW / 2 - 30 - Q.plateW; // left of the pill, in the rail's own (unscaled) space
  const plateY = lerp(rungY(0), rungY(2), climbK) - Q.plateH / 2;
  const plateS = k(tPlate, 260);
  const leadK = EASE(k(tLead, 420));
  const lx = plateX + Q.plateW / 2;
  const ly0 = rungY(2) + Q.plateH / 2 + 10;
  const ly1 = lerp(ly0, rungY(0) - 14, leadK);

  return (
    <AbsoluteFill style={{ opacity: vis }}>
      <div style={{ position: "absolute", left: 0, width: 1080, top: Q.kickTop, textAlign: "center", ...caps(INK, TYPE.label), opacity: k(tKick, 240) }}>
        {kicker.text}
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transformOrigin: `${Q.ox}px ${Q.oy}px`, transform: `scale(${Q.scale})` }}>
        <Rail draw={EASE_IO(k(tRail, 600))} color={INK} sub={sub} lit={ms >= tClimb + 500 ? 2 : ms >= tPill ? 0 : -1} />
        {ms >= tLead ? (
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
            <g stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1={lx} y1={ly0} x2={lx} y2={ly1} strokeDasharray="14 11" />
              <polyline points={`${lx - 16},${ly1 - 18} ${lx},${ly1} ${lx + 16},${ly1 - 18}`} />
            </g>
          </svg>
        ) : null}
        {ms >= tPill ? (
          <div style={{ position: "absolute", left: RAIL.cx - RAIL.pillW / 2, top: rungY(0) - RAIL.pillW * 0.4 - 12, transformOrigin: "50% 100%",
            transform: `translateY(${pd.y * 700}px) scale(${pd.sx}, ${pd.sy})` }}>
            <Pill w={RAIL.pillW} color={INK} />
          </div>
        ) : null}
        {ms >= tPlate ? (
          <div style={{ position: "absolute", left: plateX, top: plateY, width: Q.plateW, height: Q.plateH, borderRadius: Q.plateH / 2, background: R,
            display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: 46, letterSpacing: TRACK.headline,
            color: COLORS.paper, whiteSpace: "nowrap", opacity: clamp01(plateS * 3), transform: `scale(${lerp(1.7, 1, EASE(plateS))})` }}>
            {plate.text}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// Syringe — vertical, needle UP (aimed at the target above it)
// ══════════════════════════════════════════════════════════════════════════
export const Syringe: React.FC<{ h: number; color: string; sw?: number }> = ({ h, color, sw = 7 }) => {
  const w = h * 0.3;
  const cx = w / 2;
  return (
    <svg width={w} height={h} style={{ display: "block", overflow: "visible" }}>
      <g stroke={color} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <line x1={cx} y1={0} x2={cx} y2={h * 0.2} />
        <rect x={w * 0.18} y={h * 0.2} width={w * 0.64} height={h * 0.5} rx={6} />
        <line x1={w * 0.18} y1={h * 0.36} x2={w * 0.5} y2={h * 0.36} />
        <line x1={w * 0.18} y1={h * 0.5} x2={w * 0.5} y2={h * 0.5} />
        <line x1={cx} y1={h * 0.7} x2={cx} y2={h * 0.92} />
        <line x1={w * 0.1} y1={h * 0.94} x2={w * 0.9} y2={h * 0.94} />
      </g>
    </svg>
  );
};

// the target ring both §2 scenes share (the oral scene seats its pill on the SAME pixels)
export const TARGET = { cx: 540, cy: 600, r: 210, sw: 14, syrH: 230, syrXs: [330, 750], syrTop: 1010, nameTop: 1262, bracketY: 1350, tagTop: 1384 };

const Ring: React.FC<{ draw: number; color: string; label: string; labelK: number; size?: number }> = ({ draw, color, label, labelK, size = 120 }) => {
  const T = TARGET;
  const c = 2 * Math.PI * T.r;
  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <circle cx={T.cx} cy={T.cy} r={T.r} fill="none" stroke={color} strokeWidth={T.sw} strokeDasharray={`${c * draw} ${c}`} transform={`rotate(-90 ${T.cx} ${T.cy})`} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", left: 0, width: 1080, top: T.cy - size * 0.55, textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: size,
        letterSpacing: TRACK.display, lineHeight: 1.1, color, opacity: clamp01(labelK * 3), transform: `scale(${lerp(1.6, 1, EASE(labelK))})` }}>
        {label}
      </div>
    </>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// TargetInjectables — "IL-23 is one of the most lucrative targets in inflammation.
// Skyrizi. Tremfya. All injectables." (white card)
// ══════════════════════════════════════════════════════════════════════════
// The red ring draws itself round and "IL-23" slams inside it (the scene's one red);
// a line lands under it on "lucrative"; it RETIRES on the first brand; two syringes
// swing up from a hinge at their base, needles aimed at the ring, each naming itself;
// a bracket draws under both on "All" and "Injectables" lands.
// Settled: ring · two syringes + names · bracket + tag.
export const TargetInjectables: React.FC<Win & {
  target: { text: string } & Cued; line: { text: string } & Cued;
  brands: [{ text: string } & Cued, { text: string } & Cued];
  bracket: Cued; tag: { text: string } & Cued;
}> = ({ from, to, target, line, brands, bracket, tag }) => {
  const ms = useMs();
  const k = useK();
  const INK = COLORS.ink;
  const R = COLORS.accent;
  const T = TARGET;

  const tT = at(target, from, from);
  const tLine = at(line, tT + 1600, from, tT + 500);
  const tB0 = at(brands[0], tLine + 2300, from, tLine + 600);
  const tB = [tB0, at(brands[1], tB0 + 900, from, tB0 + 300)];
  const tBr = at(bracket, tB[1] + 1000, from, tB[1] + 300);
  const tTag = at(tag, tBr + 100, from, tBr + 80);
  const vis = fadeOut(ms, to);
  if (ms < tT - 60 || vis <= 0) return null;

  const lineO = k(tLine, 260) * (1 - k(tB[0] - 200, 240));
  const brK = EASE_IO(k(tBr, 420));
  const bx0 = T.syrXs[0] - 120;
  const bx1 = T.syrXs[1] + 120;

  return (
    <AbsoluteFill style={{ opacity: vis }}>
      <Ring draw={EASE_IO(k(tT, 520))} color={R} label={target.text} labelK={k(tT + 160, 300)} />
      <div style={{ position: "absolute", left: 90, right: 90, top: T.cy + T.r + 70, textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: 60,
        letterSpacing: TRACK.headline, lineHeight: 1.12, color: INK, opacity: lineO, transform: `translateY(${(1 - EASE(k(tLine, 300))) * 24}px)` }}>
        {line.text}
      </div>
      {brands.map((b, i) => {
        if (ms < tB[i]) return null;
        const s = back(k(tB[i], 520));
        const x = T.syrXs[i];
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: x - T.syrH * 0.15, top: T.syrTop, transformOrigin: "50% 100%", transform: `rotate(${(1 - s) * (i ? 90 : -90)}deg)`,
              opacity: clamp01(k(tB[i], 120) * 3) }}>
              <Syringe h={T.syrH} color={INK} />
            </div>
            <div style={{ position: "absolute", left: x - 260, width: 520, top: T.nameTop, textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: 64,
              letterSpacing: TRACK.headline, color: INK, opacity: k(tB[i] + 120, 220) }}>
              {b.text}
            </div>
          </React.Fragment>
        );
      })}
      {ms >= tBr ? (
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <polyline points={`${bx0},${T.bracketY - 26} ${bx0},${T.bracketY} ${lerp(bx0, bx1, brK)},${T.bracketY}` + (brK >= 1 ? ` ${bx1},${T.bracketY - 26}` : "")}
            fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
      <div style={{ position: "absolute", left: 0, width: 1080, top: T.tagTop, textAlign: "center", ...caps(INK, TYPE.label), opacity: k(tTag, 220) }}>
        {tag.text}
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// OralSameRing — "An oral version of the same mechanism could reset the economics of
// inflammatory bowel disease." (black)
// ══════════════════════════════════════════════════════════════════════════
// The SAME ring on the same pixels (red on black), the two syringes already standing,
// dim. The pill flies in on an arc and docks INSIDE the ring with a recoil; the ring
// answers once on "same mechanism"; on "reset" the syringes sink out of the frame;
// "IBD" lands with its full name. Never "first oral" (an oral IL-23R drug already exists).
// Settled: ring + pill · IBD label (+ its name).
export const OralSameRing: React.FC<Win & {
  pill: Cued; same: Cued; reset: Cued; ibd: { text: string; sub: string } & Cued;
}> = ({ from, to, pill, same, reset, ibd }) => {
  const ms = useMs();
  const k = useK();
  const W = COLORS.paper;
  const R = COLORS.accent;
  const sub = useInkSub();
  const T = TARGET;

  const tPill = at(pill, from + 200, from);
  const tSame = at(same, tPill + 1000, from, tPill + 600);
  const tReset = at(reset, tSame + 1200, from, tSame + 400);
  const tIbd = at(ibd, tReset + 1300, from, tReset + 400);
  const vis = fadeOut(ms, to);
  if (ms < from - 60 || vis <= 0) return null;

  const fk = EASE_IO(k(tPill, 560));
  // an arc in from below-right that docks on the ring's centre
  const px = lerp(1180, T.cx, fk);
  const py = lerp(1500, T.cy, fk) - Math.sin(fk * Math.PI) * 260;
  const recoil = Math.sin(k(tPill + 560, 260) * Math.PI) * 0.12;
  const ringPulse = 1 + 0.05 * Math.sin(k(tSame, 360) * Math.PI);
  const sink = EASE_IN(k(tReset, 520));
  const pw = 250;

  return (
    <AbsoluteFill style={{ opacity: vis }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transformOrigin: `${T.cx}px ${T.cy}px`, transform: `scale(${ringPulse})` }}>
        <Ring draw={1} color={R} label="" labelK={1} />
      </div>
      {sink < 1
        ? T.syrXs.map((x, i) => (
            <div key={i} style={{ position: "absolute", left: x - T.syrH * 0.15, top: T.syrTop + sink * 900, opacity: 0.32 }}>
              <Syringe h={T.syrH} color={W} />
            </div>
          ))
        : null}
      {ms >= tPill ? (
        <div style={{ position: "absolute", left: px - pw / 2, top: py - pw * 0.2, transform: `rotate(${(1 - fk) * 140}deg) scale(${1 + recoil}, ${1 - recoil})` }}>
          <Pill w={pw} color={W} />
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 0, width: 1080, top: T.syrTop + 40, textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: TYPE.display + 40,
        letterSpacing: TRACK.display, lineHeight: 1, color: W, opacity: clamp01(k(tIbd, 200) * 3), transform: `scale(${lerp(1.5, 1, EASE(k(tIbd, 320)))})` }}>
        {ibd.text}
      </div>
      <div style={{ position: "absolute", left: 0, width: 1080, top: T.syrTop + 240, textAlign: "center", ...caps(sub, TYPE.label), opacity: k(tIbd + 300, 260) }}>
        {ibd.sub}
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// Endgame — "Gilead's chief medical officer flagged a combination with emvistegrast as
// the endgame. A daily oral IBD pill." (red)
// ══════════════════════════════════════════════════════════════════════════
// The attribution lands as a label (no quote marks: "endgame" is the VO's word; the
// release says "potential … alone or in combination"). HCXT-2001's pill slides in from
// the left on "combination", emvistegrast's (outline) from the right; on "endgame" the
// two converge and FUSE into one DASHED pill (it does not exist yet) with a pop, their
// names retire, "sees potential" joins the attribution row; "Daily · Oral · IBD" lands
// word by word. Settled: attribution row · dashed pill · the word row.
export const ENDGAME = { attrTop: 330, pillY: 760, pillW: 280, xs: [290, 790], nameTop: 930, fusedW: 440, rowTop: 1110 };

export const Endgame: React.FC<Win & {
  attr: { text: string; more: string } & Cued;
  a: { text: string } & Cued; b: { text: string } & Cued;
  fuse: Cued; words: ({ text: string } & Cued)[];
}> = ({ from, to, attr, a, b, fuse, words }) => {
  const ms = useMs();
  const k = useK();
  const W = COLORS.paper;
  const sub = useInkSub();
  const E = ENDGAME;

  const tAttr = at(attr, from, from);
  const tA = at(a, tAttr + 1800, from, tAttr + 600);
  const tB = at(b, tA + 1000, from, tA + 400);
  const tFuse = at(fuse, tB + 1200, from, tB + 500);
  let prev = tFuse + 300;
  const tW = words.map((w) => (prev = at(w, prev + 400, from, prev + 150)));
  const vis = fadeOut(ms, to);
  if (ms < tAttr - 60 || vis <= 0) return null;

  const fz = EASE_IO(k(tFuse, 420));
  const slide = (t: number, dir: number) => {
    const s = EASE(k(t, 460));
    return { opacity: clamp01(s * 3), dx: (1 - s) * 700 * dir };
  };
  const sa = slide(tA, -1);
  const sb = slide(tB, 1);
  const halfH = E.pillW * 0.2;
  const fusedK = k(tFuse + 380, 300);

  return (
    <AbsoluteFill style={{ opacity: vis }}>
      <div style={{ position: "absolute", left: 0, width: 1080, top: E.attrTop, display: "flex", justifyContent: "center", gap: 18, whiteSpace: "nowrap", ...caps(W, TYPE.label),
        opacity: k(tAttr, 240) }}>
        <span>{attr.text}</span>
        {ms >= tFuse ? <span style={{ color: sub, opacity: k(tFuse + 300, 240) }}>{attr.more}</span> : null}
      </div>

      {/* the two pills, converging on the fuse */}
      {fusedK < 1 && ms >= tA ? (
        <div style={{ position: "absolute", left: lerp(E.xs[0], 540 - E.pillW * 0.25, fz) - E.pillW / 2 + sa.dx, top: E.pillY - halfH, opacity: sa.opacity * (1 - fusedK) }}>
          <Pill w={E.pillW} color={W} />
        </div>
      ) : null}
      {fusedK < 1 && ms >= tB ? (
        <div style={{ position: "absolute", left: lerp(E.xs[1], 540 + E.pillW * 0.25, fz) - E.pillW / 2 + sb.dx, top: E.pillY - halfH, opacity: sb.opacity * (1 - fusedK) }}>
          <Pill w={E.pillW} color={W} solidHalf={false} />
        </div>
      ) : null}
      {[a, b].map((p, i) =>
        ms >= (i ? tB : tA) ? (
          <div key={i} style={{ position: "absolute", left: E.xs[i] - 260, width: 520, top: E.nameTop, textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: 58,
            letterSpacing: TRACK.headline, color: W, opacity: k((i ? tB : tA) + 200, 220) * (1 - k(tFuse, 240)) }}>
            {p.text}
          </div>
        ) : null
      )}
      {ms >= tFuse + 380 ? (
        <div style={{ position: "absolute", left: 540 - E.fusedW / 2, top: E.pillY - E.fusedW * 0.2, opacity: clamp01(fusedK * 3), transform: `scale(${back(fusedK)})` }}>
          <Pill w={E.fusedW} color={W} dashed sw={10} />
        </div>
      ) : null}

      <div style={{ position: "absolute", left: 0, width: 1080, top: E.rowTop, display: "flex", justifyContent: "center", alignItems: "center", gap: 30, whiteSpace: "nowrap" }}>
        {words.map((w, i) => (
          <React.Fragment key={i}>
            {i ? <span style={{ width: 14, height: 14, borderRadius: 7, background: W, opacity: k(tW[i], 160) }} /> : null}
            <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: TYPE.headline, letterSpacing: TRACK.headline, color: W, display: "inline-block",
              opacity: clamp01(k(tW[i], 160) * 3), transform: `translateY(${(1 - back(k(tW[i], 380))) * 50}px)` }}>
              {w.text}
            </span>
          </React.Fragment>
        ))}
      </div>
    </AbsoluteFill>
  );
};
