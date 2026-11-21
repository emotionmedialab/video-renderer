// ─────────────────────────────────────────────────────────────────────────
// KIT · nextmarkers — §8 "THE SIGNAL TO WATCH" of the Roche × Hansoh HORIZONTAL
// long-form, 2026-10-24 (absolute 1920x1080 seats; white card). The standing answer
// for "watch for these, in order" (AZ × insitro, 2026-10-22): numbered plain-language
// cards, not a diagram. Three cards = the list's three-a-page budget.
//
// `SignalThree`: the title rises; each card SWINGS IN in 3D (hinged on its left edge)
//   on its ordinal; inside, one small glyph says what is still missing, drawn DASHED
//   (not yet): card 1 the tray's two empty name slots; card 2 the track's Phase 1A
//   stretch; card 3 a Hansoh → Roche handover whose arrow draws on "takes forward",
//   then a second line on "whether Hansoh" and a dashed "US option" tag on "United".
//   The badge numerals are the list's one accent.
// ─────────────────────────────────────────────────────────────────────────

import React from "react";
import { Easing, interpolate } from "remotion";
import { CLAMP, clamp01, COLORS, inkA, useAccent, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { big, label } from "./rona";
import { Letters } from "./hunt";
import { useP3, useZ } from "./camera";

const EASE = Easing.out(Easing.cubic);
const EASE_IO = Easing.inOut(Easing.cubic);
const BACK = Easing.out(Easing.back(1.4));

export const SIG3 = {
  title: { x: 140, top: 92, size: 64 },
  cards: { xs: [140, 720, 1300], top: 220, w: 520, h: 600 },
};

type Sig = { badge: string; kicker: string; body: string } & Cued;

export const SignalThree: React.FC<Win & {
  title: { text: string } & Cued;
  cards: [Sig, Sig, Sig];
  handover: Cued; // "takes forward": card 3's arrow draws
  option: { text: string } & Cued; // "whether Hansoh": card 3's second line
  us: { text: string } & Cued; // "United": the dashed tag
  names: [string, string]; // the pill names on card 3
}> = ({ from, to, title, cards, handover, option, us, names }) => {
  const ms = useMs();
  const k = useK();
  const Z = useZ();
  const P3 = useP3();
  const acc = useAccent();
  const INK = COLORS.ink;
  const sub = inkA(0.5);
  const S = SIG3;
  const tT = at(title, from + 100, from);
  const tC = cards.map((c, i) => at(c, tT + 1800 + i * 3500, from, tT + 300));
  const tH = at(handover, tC[2] + 2300, from, tC[2] + 300);
  const tO = at(option, tH + 1100, from, tH + 300);
  const tU = at(us, tO + 2300, from, tO + 300);
  const vis = clamp01(interpolate(ms, [from - 100, from + 150, to - 250, to], [0, 1, 1, 0], CLAMP));
  if (vis <= 0) return null;
  const hq = EASE_IO(k(tH, 600));
  const oq = k(tO, 380);
  const uq = k(tU, 380);

  const glyph = (i: number, q: number) => {
    const gy = S.cards.h - 170;
    if (i === 0) {
      // the tray's two empty name slots
      return (
        <div style={{ position: "absolute", left: 40, top: gy, display: "flex", gap: 22, opacity: clamp01(q * 2 - 0.6) }}>
          {[0, 1].map((n) => (
            <svg key={n} width={200} height={110}><rect x={3} y={3} width={194} height={104} rx={16} fill="none" stroke={sub} strokeWidth={4} strokeDasharray="14 10" /></svg>
          ))}
        </div>
      );
    }
    if (i === 1) {
      // a track: solid preclinical stretch, then the Phase 1A stretch dashed (not started)
      return (
        <svg style={{ position: "absolute", left: 40, top: gy + 20, overflow: "visible", opacity: clamp01(q * 2 - 0.6) }} width={440} height={90}>
          <line x1={10} y1={40} x2={170} y2={40} stroke={INK} strokeWidth={10} strokeLinecap="round" />
          <line x1={170} y1={40} x2={420} y2={40} stroke={INK} strokeWidth={8} strokeDasharray="18 13" />
          <line x1={420} y1={10} x2={420} y2={70} stroke={INK} strokeWidth={6} />
          <circle cx={170} cy={40} r={16} fill={INK} />
          <text x={420} y={100} textAnchor="end" fontFamily="inherit" style={{ ...label(sub, 26) }}>Phase 1A</text>
        </svg>
      );
    }
    // card 3: Hansoh → Roche, the arrow draws on "takes forward"
    return (
      <div style={{ position: "absolute", left: 40, top: gy + 20, display: "flex", alignItems: "center", gap: 14, opacity: clamp01(q * 2 - 0.6) }}>
        <div style={{ padding: "12px 20px", borderRadius: 30, border: `4px solid ${INK}`, ...big(INK, 30) }}>{names[0]}</div>
        <svg width={110} height={30} style={{ overflow: "visible" }}>
          <line x1={4} y1={15} x2={4 + 80 * hq} y2={15} stroke={INK} strokeWidth={7} strokeLinecap="round" />
          {hq > 0.9 ? <polyline points="78,1 100,15 78,29" fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" /> : null}
        </svg>
        <div style={{ padding: "12px 20px", borderRadius: 30, background: INK, ...big(COLORS.paper, 30), opacity: clamp01(hq * 3) }}>{names[1]}</div>
      </div>
    );
  };

  return (
    <div style={{ position: "absolute", inset: 0, opacity: vis, ...P3 }}>
      <div style={{ position: "absolute", left: S.title.x, top: S.title.top }}>
        {ms >= tT ? <Letters text={title.text} t={tT} mode="rise" stagger={24} style={{ ...big(INK, S.title.size) }} /> : null}
      </div>
      {cards.map((c, i) => {
        const q = clamp01((ms - tC[i]) / 650);
        if (q <= 0) return null;
        return (
          <div key={i} style={{ position: "absolute", left: S.cards.xs[i], top: S.cards.top, width: S.cards.w, height: S.cards.h, perspective: 1400 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 28, background: COLORS.panel, border: `3px solid ${inkA(0.12)}`, boxSizing: "border-box",
              transformOrigin: "0% 50%", transform: `${Z(lerp(200, 0, EASE(q)))}rotateY(${lerp(-95, 0, BACK(q))}deg)`, opacity: clamp01(q * 4) }}>
              {/* badge in the kicker's flex row (never at a coordinate) */}
              <div style={{ position: "absolute", left: 40, top: 40, display: "flex", alignItems: "baseline", gap: 18 }}>
                <span style={{ ...big(acc, 64) }}>{c.badge}</span>
                <span style={{ ...big(sub, 40) }}>{c.kicker}</span>
              </div>
              <div style={{ position: "absolute", left: 40, right: 40, top: 150, ...big(INK, 42), whiteSpace: "normal", lineHeight: 1.18 }}>{c.body}</div>
              {i === 2 ? (
                <div style={{ position: "absolute", left: 40, right: 40, top: 330, ...big(sub, 34), whiteSpace: "normal", lineHeight: 1.2, opacity: oq, transform: `translateY(${(1 - EASE(oq)) * 14}px)` }}>
                  {option.text}
                  {uq > 0 ? (
                    <span style={{ display: "inline-block", marginLeft: 12, padding: "4px 14px", borderRadius: 12, border: `3px dashed ${INK}`, ...big(INK, 30),
                      transform: `scale(${lerp(1.4, 1, BACK(uq))})`, opacity: clamp01(uq * 4) }}>{us.text}</span>
                  ) : null}
                </div>
              ) : null}
              {glyph(i, q)}
            </div>
          </div>
        );
      })}
    </div>
  );
};
