// ─────────────────────────────────────────────────────────────────────────
// KIT · plusend — WHY IT MATTERS and THE SIGNAL, IN ORDER, for the ABBV-466
// long-form (2026-10-25, HORIZONTAL 16:9). Absolute 1920×1080 seats; import by
// path. Same rules and 3D grammar as kit/plusone.
//
// `NextStep` (red): the executive's line sets phrase by phrase in the RELEASE's
// own words (quote marks only on those), its one phrase underlined; then the
// thesis is a literal STAIR: a solid "Skyrizi" step, and a DASHED "+1" step that
// rises beside it ("if the data hold… may be").
// `SignalRail` (white card): a rail draws one leg per spoken ordinal; each stop is
// a card with a callback glyph from earlier in the video — dashed error bars that
// go solid (full data with statistics), a taller dashed column with an eye that
// closes (larger, blinded trial), the dashed lutikizumab beside a "?" bar.
// ─────────────────────────────────────────────────────────────────────────

import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, COLORS, DISPLAY, INK_SUB_ON_RED, TRACK, caps, inkA, useMs } from "./core";
import { TYPE } from "../style";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { YGlyph } from "./pairing";
import { useP3, useZ } from "./camera";
import { back, bounce, EASE, EASE_IO, fadeOut } from "./plusone";

// ══════════════════════════════════════════════════════════════════════════
// NextStep — the quote, then Skyrizi + 1 as a stair (red world)
// ══════════════════════════════════════════════════════════════════════════
// Page 1 settled: kicker · the quote (5 phrases, one underlined) · the attribution.
// Page 2 settled: kicker · the conditional chip · the two steps.
export const STEP = { kickTop: 108, quoteLeft: 150, quoteTop: 300, quoteW: 1620, quoteSize: 76, attrTop: 700, chipTop: 220, floor: 880, s1: { x: 470, w: 500, h: 250 }, s2: { x: 970, w: 500, h: 470 } };

export const NextStep: React.FC<Win & {
  kicker: { text: string } & Cued;
  name: { text: string; title: string } & Cued; // the attribution (lands first: the VO names him first)
  phrases: ({ text: string; underline?: boolean } & Cued)[]; // the quote, phrase by phrase
  cond: { text: string } & Cued; // page 2: the quote leaves, the conditional lands
  step1: { text: string } & Cued; // "after Skyrizi": the solid step
  step2: { text: string; plus: string; plusWord?: string; plusMs?: number } & Cued; // "may be Skyrizi": the dashed step rises; "+1" stamps
}> = ({ from, to, kicker, name, phrases, cond, step1, step2 }) => {
  const ms = useMs();
  const k = useK();
  const Z = useZ();
  const P3 = useP3();
  const Wt = COLORS.paper;
  const S = STEP;

  const tKick = at(kicker, from + 40, from);
  const tName = at(name, tKick + 1500, from, tKick + 300);
  let p = tName;
  const tPh = phrases.map((ph) => (p = at(ph, p + 1200, from, p + 200)));
  const tCond = at(cond, p + 1000, from, p + 300);
  const tS1 = at(step1, tCond + 1200, from, tCond + 300);
  const tS2 = at(step2, tS1 + 1000, from, tS1 + 300);
  const tPlus = at({ word: step2.plusWord, ms: step2.plusMs }, tS2 + 600, from, tS2 + 300);
  const vis = fadeOut(ms, to);
  if (ms < tKick - 60 || vis <= 0) return null;

  const page1Out = EASE_IO(k(tCond, 560));
  const s1K = k(tS1, 640), s2K = k(tS2, 820), plusK = k(tPlus, 420);
  // the steps: step 1 drops in with weight; step 2 RISES out of the floor
  const s1Y = s1K < 0.55 ? lerp(-700, 0, EASE_IO(s1K / 0.55)) : -22 * bounce((s1K - 0.55) / 0.45);
  const s2H = S.s2.h * EASE_IO(clamp01(s2K / 0.85)) * (1 + 0.04 * bounce(clamp01((s2K - 0.85) / 0.15)));

  return (
    <AbsoluteFill style={{ opacity: vis, ...P3 }}>
      <div style={{ position: "absolute", left: 120, top: S.kickTop, ...caps(Wt, TYPE.label + 6), opacity: clamp01(k(tKick, 300) * 2) }}>{kicker.text}</div>

      {/* page 1 — the quote, each phrase flying in from depth on its spoken words */}
      {page1Out < 1 ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, ...P3, transform: Z(-1100 * page1Out) || undefined, opacity: 1 - page1Out }}>
          <div style={{ position: "absolute", left: S.quoteLeft, top: S.quoteTop, width: S.quoteW, display: "flex", flexWrap: "wrap", columnGap: "0.28em", rowGap: 10,
            fontFamily: DISPLAY, fontWeight: 700, fontSize: S.quoteSize, letterSpacing: TRACK.headline, lineHeight: 1.12, color: Wt }}>
            {phrases.map((ph, i) => {
              const e = k(tPh[i], 520);
              const ul = ph.underline ? EASE(k(tPh[i] + 300, 520)) : 0;
              return (
                <span key={i} style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap", opacity: clamp01(e * 3),
                  transform: `${Z(lerp(-900, 0, EASE(e)))}translateY(${Z(1) ? 0 : (1 - EASE(e)) * 26}px) rotateX(${lerp(-50, 0, EASE(e))}deg)` }}>
                  {ph.text}
                  {ul > 0 ? <span style={{ position: "absolute", left: 0, bottom: -6, height: 8, borderRadius: 4, background: Wt, width: `${ul * 100}%` }} /> : null}
                </span>
              );
            })}
          </div>
          <div style={{ position: "absolute", left: S.quoteLeft, top: S.attrTop, opacity: clamp01(k(tName, 300) * 2), transform: `translateY(${(1 - EASE(k(tName, 360))) * 18}px)` }}>
            <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 52, letterSpacing: TRACK.headline, color: Wt }}>{name.text}</div>
            <div style={{ marginTop: 10, ...caps(INK_SUB_ON_RED, TYPE.label + 4) }}>{name.title}</div>
          </div>
        </div>
      ) : null}

      {/* page 2 — the conditional, then the stair */}
      {ms >= tCond - 60 ? (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: S.chipTop, display: "flex", justifyContent: "center" }}>
            <div style={{ padding: "14px 32px", borderRadius: 30, border: `4px dashed ${Wt}`, ...caps(Wt, TYPE.label + 8), whiteSpace: "nowrap",
              opacity: clamp01(k(tCond + 200, 300) * 2), transformOrigin: "50% 0%", transform: `rotateX(${lerp(-90, 0, back(k(tCond + 200, 520)))}deg)` }}>{cond.text}</div>
          </div>
          {/* the floor */}
          <div style={{ position: "absolute", left: 300, top: S.floor, width: 1320 * EASE_IO(k(tCond + 300, 600)), height: 6, borderRadius: 3, background: Wt }} />
          {/* step 1: solid */}
          {s1K > 0 ? (
            <div style={{ position: "absolute", left: S.s1.x, top: S.floor - S.s1.h, width: S.s1.w, height: S.s1.h, borderRadius: "18px 18px 0 0", background: Wt,
              color: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: 72,
              letterSpacing: TRACK.headline, opacity: clamp01(s1K * 4), transform: `translateY(${s1Y}px)` }}>{step1.text}</div>
          ) : null}
          {/* step 2: dashed, rises out of the floor; "+1" stamps on it */}
          {s2K > 0 ? (
            <div style={{ position: "absolute", left: S.s2.x + 20, top: S.floor - s2H, width: S.s2.w - 20, height: s2H, borderRadius: "18px 18px 0 0",
              border: `6px dashed ${Wt}`, borderBottom: "none", boxSizing: "border-box", overflow: "hidden", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "flex-start", paddingTop: 54 }}>
              <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 72, letterSpacing: TRACK.headline, color: Wt, whiteSpace: "nowrap" }}>{step2.text}</div>
              <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 150, letterSpacing: TRACK.display, lineHeight: 1, color: Wt, marginTop: 8,
                opacity: clamp01(plusK * 4), transform: `${Z(lerp(900, 0, EASE(plusK)))}scale(${Z(1) ? 1 : lerp(1.8, 1, EASE(plusK))})` }}>{step2.plus}</div>
            </div>
          ) : null}
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// SignalRail — three stops, each a callback (white card)
// ══════════════════════════════════════════════════════════════════════════
// Settled frame: title · the rail · three cards (each one glyph + one line).
export const RAIL = { titleTop: 100, railY: 300, xs: [440, 960, 1480], card: { w: 460, top: 360, h: 500 } };

const Whiskers: React.FC<{ solid: number; color: string }> = ({ solid, color }) => (
  <svg width={260} height={190} viewBox="-130 -95 260 190" style={{ display: "block" }}>
    {[-60, 60].map((x, i) => (
      <g key={i} stroke={color} strokeWidth={8} fill="none" strokeDasharray={solid >= 1 ? undefined : `${lerp(12, 40, solid)} ${lerp(10, 0.01, solid)}`}>
        <line x1={x} y1={-70 + i * 30} x2={x} y2={60 - i * 10} />
        <line x1={x - 24} y1={-70 + i * 30} x2={x + 24} y2={-70 + i * 30} />
        <line x1={x - 24} y1={60 - i * 10} x2={x + 24} y2={60 - i * 10} />
        <circle cx={x} cy={(-70 + i * 30 + 60 - i * 10) / 2} r={14} fill={color} stroke="none" />
      </g>
    ))}
  </svg>
);

export const SignalRail: React.FC<Win & {
  title: { text: string } & Cued;
  stops: ({ badge: string; line: string; act: Cued } & Cued)[]; // each card lands on its ordinal; `act` = its one motion
}> = ({ from, to, title, stops }) => {
  const ms = useMs();
  const k = useK();
  const Z = useZ();
  const P3 = useP3();
  const INK = COLORS.ink;
  const RED = COLORS.accent;
  const R = RAIL;

  const tTitle = at(title, from + 40, from);
  let p = tTitle;
  const tStop: number[] = [];
  const tAct: number[] = [];
  stops.forEach((s, i) => { tStop[i] = at(s, p + 1600, from, p + 300); tAct[i] = at(s.act, tStop[i] + 1200, from, tStop[i] + 300); p = tAct[i]; });
  const vis = fadeOut(ms, to);
  if (ms < tTitle - 60 || vis <= 0) return null;

  // the rail: one leg per stop, drawn toward that stop as its ordinal is voiced
  let railX = R.xs[0] - 260;
  stops.forEach((_, i) => { const e = EASE_IO(k(tStop[i] - 100, 520)); if (e > 0) railX = lerp(i ? R.xs[i - 1] : R.xs[0] - 260, R.xs[i], e); });

  const glyph = (i: number) => {
    const a = EASE(k(tAct[i], 600));
    if (i === 0) return <Whiskers solid={a} color={INK} />;
    if (i === 1) {
      // a taller DASHED column (a larger trial) with an eye that closes on "blinded"
      const open = 1 - a;
      return (
        <svg width={260} height={190} viewBox="-130 -95 260 190" style={{ display: "block" }}>
          <rect x={-110} y={-20} width={70} height={110} rx={8} fill={inkA(0.25)} />
          <rect x={-20} y={-90} width={110} height={180} rx={10} fill="none" stroke={INK} strokeWidth={7} strokeDasharray="16 12" />
          <path d={`M 5 -10 Q 35 ${-10 - 26 * open} 65 -10 Q 35 ${-10 + 26 * open} 5 -10 Z`} fill="none" stroke={INK} strokeWidth={6} />
          {open > 0.15 ? <circle cx={35} cy={-10} r={9 * open} fill={INK} /> : null}
          {a > 0 ? <line x1={5} y1={-10} x2={65} y2={-10} stroke={INK} strokeWidth={6} opacity={a} /> : null}
        </svg>
      );
    }
    // the dashed lutikizumab beside a "?" bar the height of the combination's
    return (
      <svg width={260} height={190} viewBox="-130 -95 260 190" style={{ display: "block", overflow: "visible" }}>
        <g transform="translate(-60 10) scale(0.42)"><YGlyph color={INK} tips={["chevron", "chevron"]} dashed /></g>
        <rect x={30} y={90 - 160 * a} width={70} height={160 * a} rx={8} fill="none" stroke={RED} strokeWidth={6} strokeDasharray="12 9" />
        <text x={65} y={20} textAnchor="middle" fontFamily={DISPLAY} fontWeight={700} fontSize={64} fill={RED} opacity={a}>?</text>
      </svg>
    );
  };

  return (
    <AbsoluteFill style={{ opacity: vis, ...P3 }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: R.titleTop, textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: 76,
        letterSpacing: TRACK.headline, color: INK, opacity: clamp01(k(tTitle, 300) * 2), transform: `translateY(${(1 - EASE(k(tTitle, 360))) * 18}px)` }}>{title.text}</div>

      {/* the rail */}
      <div style={{ position: "absolute", left: R.xs[0] - 260, top: R.railY - 3, height: 6, borderRadius: 3, background: INK, width: Math.max(0, railX - (R.xs[0] - 260)) }} />
      {stops.map((s, i) => {
        const e = k(tStop[i], 640);
        return (
          <React.Fragment key={i}>
            {/* the station dot */}
            <div style={{ position: "absolute", left: R.xs[i] - 22, top: R.railY - 22, width: 44, height: 44, borderRadius: 22, background: i === 2 ? RED : INK,
              transform: `scale(${back(k(tStop[i] + 300, 400))})` }} />
            {/* the card swings down from the rail on a top hinge */}
            <div style={{ position: "absolute", left: R.xs[i] - R.card.w / 2, top: R.card.top, width: R.card.w, height: R.card.h, borderRadius: 26,
              border: `5px solid ${INK}`, background: COLORS.paper, boxSizing: "border-box", opacity: clamp01(e * 4), transformOrigin: "50% 0%",
              transform: `${Z(lerp(260, 0, EASE(e)))}rotateX(${lerp(-100, 0, back(e))}deg)`, display: "flex", flexDirection: "column", alignItems: "center", padding: "34px 30px" }}>
              <div style={{ ...caps(i === 2 ? RED : COLORS.grayText, TYPE.label + 4) }}>{s.badge}</div>
              <div style={{ marginTop: 22 }}>{glyph(i)}</div>
              <div style={{ marginTop: 26, fontFamily: DISPLAY, fontWeight: 700, fontSize: 40, letterSpacing: TRACK.headline, lineHeight: 1.12, color: INK, textAlign: "center" }}>{s.line}</div>
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
