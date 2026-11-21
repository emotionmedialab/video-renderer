// ─────────────────────────────────────────────────────────────────────────
// KIT · argenx6 — argenx × UNP long-form, chunk 6 (2:45–3:08), 16:9, V2 style, 2026-11-16.
// §8 WHAT TO WATCH.
//  · S20 (paper): a signal tower springs up; its three lamps light IN ORDER on "First" / "Then" / "the real test",
//    each row printing its signal (lamp 3 = the one red).
//  · S21 (paper): the tower slides off; the hook's locked $595M capsule (S6) drops in above two steps, "Development" and
//    "Regulatory"; on each word the capsule lowers onto that step and its padlock springs open and falls away;
//    "Each payment = a step where the science held up" prints. (K2: the spine from the hook, completed.)
// Limits: the $595M is paid ONLY when milestones are reached; the steps are the two milestone TYPES the release names,
// not a count of payments.
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, COLORS, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { EASE, back, fadeOut } from "./plusone";
import { label, line } from "./inovio";
import { Print } from "./ryb1b";
import { useP3, useZ } from "./camera";
import { KType, Scatter, useDropX, useEnt, useSpringX } from "./v2style";
import { G_GREY, G_INK, G_WHITE, Puck } from "./argenx1v2b";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });

// ══════════════════════════════════════════════════════════════════════════
// S20 (paper) — "So the signal comes in order. First, the deal closing, expected by year-end. Then, the first
// UNP-derived program argenx names publicly. And then the real test:"   Settled: the tower with 3 lit rows (hero).
// ══════════════════════════════════════════════════════════════════════════
const TW = { x: 460, base: 850, w: 190, h: 640 };
const LAMPS = [250, 450, 650];
const ROWS = [
  { big: "The deal closes", small: "expected by year-end" },
  { big: "The first UNP-derived program", small: "argenx names it publicly" },
  { big: "The real test", small: "the $595M milestones" },
];

export const SignalTower: React.FC<Win & { signal: Cued; first: Cued; then: Cued; real: Cued }> = ({ from, to, signal, first, then, real }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const tSig = at(signal, 165970, from);
  const tL = [at(first, 167830, from, tSig + 600), at(then, 171020, from, tSig + 2000), at(real, 176230, from, tSig + 4000)];
  if (ms < from || ms > to + 320) return null;
  const rise = sp(tSig - 300, 9, 140);
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={{ ...abs(0, 120), width: 1920, display: "flex", justifyContent: "center", transform: z(20) || undefined }}>
        <KType text="THE SIGNAL, IN ORDER" t={tSig - 200} size={70} color={COLORS.ink} />
      </div>
      {/* the tower */}
      <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${TW.x}px ${TW.base}px`, transform: `translateY(${(1 - Math.min(1, rise)) * 700}px) scaleY(${lerp(0.7, 1, Math.min(1, rise))})` }}>
        <Puck x={TW.x} y={TW.base - TW.h / 2 + 60} w={TW.w} h={TW.h} d={90} r={60} front={G_INK} side="#111" />
        <Puck x={TW.x} y={TW.base + 40} w={340} h={60} d={70} r={24} front={G_GREY} side="#444" />
        {LAMPS.map((y, i) => {
          const on = ms >= tL[i];
          const flash = on ? sp(tL[i], 7, 230) : 0;
          const hot = i === 2 ? COLORS.accent : "#ffffff";
          return (
            <div key={i} style={{ ...abs(TW.x - 62, y - 62 + 60), width: 124, height: 124, borderRadius: "50%", transform: `${z(50)}scale(${on ? lerp(1.25, 1, Math.min(1, flash)) : 1})`,
              background: on ? `radial-gradient(circle at 38% 32%, #ffffff, ${hot} 55%, ${i === 2 ? "#8f0e15" : "#bdbdbd"} 100%)` : "radial-gradient(circle at 38% 32%, #6a6a6a, #2a2a2a 70%)",
              boxShadow: on ? `0 0 40px ${i === 2 ? "rgba(244,33,45,0.55)" : "rgba(255,255,255,0.5)"}` : "inset 0 6px 10px rgba(0,0,0,0.5)",
              display: "flex", alignItems: "center", justifyContent: "center", ...line(56, on ? (i === 2 ? COLORS.paper : COLORS.ink) : "#7a7a7a") }}>{i + 1}</div>
          );
        })}
      </div>
      {/* the rows */}
      {ROWS.map((r, i) => (ms >= tL[i] ? (
        <div key={i} style={{ ...abs(TW.x + 150, LAMPS[i] + 60 - 52), transform: `${z(40)}translateX(${lerp(-60, 0, EASE(k(tL[i], 300)))}px)` }}>
          <Print t={tL[i]}><div style={line(56, i === 2 ? COLORS.accent : COLORS.ink)}>{r.big}</div></Print>
          <Print t={tL[i] + 250}><div style={label("#666", 34)}>{r.small}</div></Print>
        </div>
      ) : null))}
      {tL.map((t, i) => <Scatter key={i} x={TW.x} y={LAMPS[i]} t={t} seed={181 + i} n={6} color={i === 2 ? COLORS.accent : "#bdbdbd"} zz={60} />)}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S21 (paper) — "the $595 million. It is paid only when development and regulatory milestones are reached, so each
// payment marks a step where the science held up."   Settled: the capsule on its second step (hero) / steps / the line.
// ══════════════════════════════════════════════════════════════════════════
const ST = { x0: 560, w: 520, h: 120, top: 610 };      // step 1 left at x0, step 2 one step lower to the right
const CAP2 = { w: 520, h: 150 };
const LOCKX = [-150, 150];

export const MilestoneSteps: React.FC<Win & { m595: Cued; dev: Cued; reg: Cued; each: Cued }> = ({ from, to, m595, dev, reg, each }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const drop = useDropX();
  const t595 = at(m595, 177760, from);
  const tDev = at(dev, 180840, from, t595 + 800);
  const tReg = at(reg, 182070, from, tDev + 500);
  const tEach = at(each, 185160, from, tReg + 800);
  if (ms < from || ms > to + 320) return null;
  const steps = ent(from + 100, 500);
  const c = drop(t595 - 380, 900, 380);
  // the capsule: hangs above step 1, lowers onto step 1 on "development", hops to step 2 on "regulatory"
  const s1 = { x: ST.x0 + ST.w / 2, y: ST.top - CAP2.h / 2 };
  const s2 = { x: ST.x0 + ST.w + 40 + ST.w / 2, y: ST.top + ST.h - CAP2.h / 2 };
  const hang = { x: s1.x, y: s1.y - 230 };
  const d1 = sp(tDev - 200, 9, 170);
  const hop = clamp01((ms - (tReg - 300)) / 450);
  const cx = lerp(lerp(hang.x, s1.x, d1), s2.x, EASE(hop));
  const cy = lerp(lerp(hang.y, s1.y, d1), s2.y, EASE(hop)) - 160 * 4 * hop * (1 - hop);
  const land2 = hop >= 1 ? 1 - sp(tReg + 150, 6, 220, 0.6) : 0;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {/* the two steps */}
      <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${lerp(500, 0, steps)}px)` }}>
        {[{ x: s1.x, y: ST.top + ST.h / 2, t: "Development", h: ST.h }, { x: s2.x, y: ST.top + ST.h + ST.h / 2, t: "Regulatory", h: ST.h }].map((s, i) => (
          <Puck key={i} x={s.x} y={s.y} w={ST.w} h={s.h} d={80} r={24} front={i ? G_WHITE : G_GREY} side={i ? "#a3a3a3" : "#555"}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={label(i ? COLORS.ink : COLORS.paper, 40)}>{s.t}</div>
              <div style={label(i ? "#666" : "rgba(255,255,255,0.8)", 26)}>milestones · if reached</div>
            </div>
          </Puck>
        ))}
      </div>
      {/* the capsule (the hook's $595M), with two padlocks that spring open and fall on each step */}
      {c.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${cx}px ${cy + CAP2.h / 2}px`, transform: `translateY(${c.dy}px) scale(${c.sx * (1 + 0.14 * land2)}, ${c.sy * (1 - 0.2 * land2)})` }}>
          <Puck x={cx} y={cy} w={CAP2.w} h={CAP2.h} d={70} r={CAP2.h / 2} front={G_INK} side="#151515">
            <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
              <div style={label("rgba(255,255,255,0.8)", 34)}>UP TO</div>
              <KType text="$595M" t={t595 - 200} size={84} color={COLORS.paper} />
            </div>
          </Puck>
          {LOCKX.map((dx, i) => {
            const tOpen = i ? tReg + 150 : tDev + 100;
            const open = back(k(tOpen, 200));
            const fall = clamp01((ms - (tOpen + 220)) / 500);
            if (fall >= 1) return null;
            const lx = cx + dx, ly = cy + CAP2.h / 2 + 70;
            return (
              <div key={i} style={{ position: "absolute", inset: 0, transform: `${z(60)}translate(${fall * (i ? 120 : -120)}px, ${700 * fall * fall}px) rotate(${fall * (i ? 60 : -60)}deg)`, transformOrigin: `${lx}px ${ly}px` }}>
                <div style={{ ...abs(lx - 46, ly - 100 - 50 * open), width: 92, height: 110, borderRadius: "46px 46px 0 0", border: "18px solid #2b2b2b", borderBottom: "none", boxSizing: "border-box",
                  transformOrigin: "100% 100%", transform: `rotate(${30 * open}deg)` }} />
                <div style={{ ...abs(lx - 70, ly - 50), width: 140, height: 104, borderRadius: 24, background: G_WHITE, boxShadow: "0 10px 16px rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width={24} height={36} viewBox="0 0 30 44"><circle cx={15} cy={13} r={11} fill={COLORS.ink} /><path d="M9 20 L21 20 L18 42 L12 42 Z" fill={COLORS.ink} /></svg>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
      <Scatter x={s1.x} y={ST.top} t={tDev + 100} seed={191} n={7} zz={60} color="#555" />
      <Scatter x={s2.x} y={ST.top + ST.h} t={tReg + 150} seed={193} n={7} zz={60} color="#555" />
      {/* the line */}
      {ms >= tEach ? (
        <div style={{ ...abs(0, 150), width: 1920, display: "flex", flexDirection: "column", alignItems: "center", transform: z(40) || undefined }}>
          <KType text="EACH PAYMENT" t={tEach - 150} size={64} color={COLORS.ink} />
          <Print t={tEach + 600}><div style={label(COLORS.accent, 46)}>= a step where the science held up</div></Print>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
