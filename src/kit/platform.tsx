// ─────────────────────────────────────────────────────────────────────────
// KIT · platform — §7 "WHY IT MATTERS" of the Roche × Hansoh HORIZONTAL long-form,
// 2026-10-24 (absolute 1920x1080 seats). Motion law as ./hansoh.
//
// `NotOneMolecule` (black): a single ADC rises on a pedestal over "One molecule"; a
//   red strike draws through the label on "not" (the one red); on "It is" the ADC,
//   pedestal and label fall away; the platform slab rises (the composition's camera
//   pulls back as it does: a reveal); its label tightens in; on "builds" three ADCs
//   are EMITTED from the slab one after another, each rising to aim at a DASHED target
//   (not named) that draws above it on "targets"; "Roche-proposed targets" lands.
// `OnlyIfAdvance` (red): "Most of the $15B+" flips in; the dashed run (open past the
//   frame: a floor) draws with a token at its start; on "only if" the token rolls
//   forward a SHORT way and only the stretch behind it turns solid, the rest stays
//   dashed; "if programs advance" lands under it. No positions are claimed for the
//   milestones: the token's stop is illustrative, a small step.
// ─────────────────────────────────────────────────────────────────────────

import React from "react";
import { Easing, interpolate } from "remotion";
import { CLAMP, clamp01, COLORS, INK_SUB, INK_SUB_ON_RED, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { big, label } from "./rona";
import { Letters } from "./hunt";
import { useP3, useZ } from "./camera";

const EASE = Easing.out(Easing.cubic);
const EASE_IN = Easing.in(Easing.quad);
const EASE_IO = Easing.inOut(Easing.cubic);
const BACK = Easing.out(Easing.back(1.6));

/** A white ADC glyph about its fork: stem down, two arms up, payload diamond below the stem. */
const Adc: React.FC<{ s?: number; color: string }> = ({ s = 1, color }) => {
  const arm = 90 * s, stem = 110 * s, sw = 16 * s, a = arm * 0.7071, py = stem + 34 * s;
  return (
    <g>
      <line x1={0} y1={0} x2={0} y2={stem} stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <line x1={0} y1={0} x2={-a} y2={-a} stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <line x1={0} y1={0} x2={a} y2={-a} stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <circle cx={-a} cy={-a} r={sw * 0.75} fill={color} />
      <circle cx={a} cy={-a} r={sw * 0.75} fill={color} />
      <polygon points={`0,${py - 22 * s} ${22 * s},${py} 0,${py + 22 * s} ${-22 * s},${py}`} fill={color} />
    </g>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// NotOneMolecule — §7 (black world)
// ══════════════════════════════════════════════════════════════════════════
export const NOM = {
  kicker: { x: 160, top: 96, size: 72 },
  one: { cx: 960, fork: 430, pedTop: 640, label: 720 },
  slab: { x: 460, top: 780, w: 1000, h: 96 },
  adcs: [660, 960, 1260],
  adcFork: 520,
  targetY: 290,
};

export const NotOneMolecule: React.FC<Win & {
  kicker: { text: string } & Cued; // "Why it matters"
  one: { label: string } & Cued; // "Roche": the ADC rises on its pedestal
  not: Cued; // "not": the strike
  drop: Cued; // "It is": it falls away
  slab: { text: string } & Cued; // "access": the platform rises
  slabLabel: Cued; // "platform"
  builds: Cued; // "builds": three ADCs are emitted
  targets: { label: [string, string] } & Cued; // "targets": dashed targets draw; the label
}> = ({ from, to, kicker, one, not, drop, slab, slabLabel, builds, targets }) => {
  const ms = useMs();
  const k = useK();
  const Z = useZ();
  const P3 = useP3();
  const W = COLORS.paper;
  const N = NOM;
  const tK = at(kicker, from, from);
  const tO = at(one, tK + 1500, from, tK + 300);
  const tN = at(not, tO + 700, from, tO + 200);
  const tD = at(drop, tN + 2200, from, tN + 600);
  const tS = at(slab, tD + 1000, from, tD + 300);
  const tSL = at(slabLabel, tS + 800, from, tS + 300);
  const tB = at(builds, tSL + 800, from, tSL + 300);
  const tT = at(targets, tB + 1300, from, tB + 600);
  const vis = clamp01(interpolate(ms, [from - 100, from + 150, to - 250, to], [0, 1, 1, 0], CLAMP));
  if (vis <= 0) return null;

  const oq = clamp01((ms - tO) / 650);
  const nq = EASE_IO(k(tN, 420));
  const fallen = ms >= tD;
  const ff = EASE_IN(clamp01((ms - tD) / 650));
  const sq = EASE(clamp01((ms - tS) / 700));
  const slq = k(tSL, 600);
  const tq = k(tT, 500);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: vis, ...P3 }}>
      <div style={{ position: "absolute", left: N.kicker.x, top: N.kicker.top }}>
        {ms >= tK ? <Letters text={kicker.text} t={tK} mode="rise" stagger={24} style={{ ...big(W, N.kicker.size) }} /> : null}
      </div>

      {/* one molecule on a pedestal; struck; falls away */}
      {oq > 0 && ff < 1 ? (
        <div style={{ position: "absolute", inset: 0, transform: fallen ? `translateY(${ff * 1100}px) rotate(${ff * 8}deg)` : `translateY(${(1 - BACK(oq)) * 500}px)`,
          opacity: clamp01(oq * 4) * (1 - clamp01((ff - 0.7) / 0.3)) }}>
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1920} height={1080}>
            <g transform={`translate(${N.one.cx} ${N.one.fork})`}><Adc s={1.3} color={W} /></g>
            <rect x={N.one.cx - 150} y={N.one.pedTop} width={300} height={34} rx={8} fill={W} />
          </svg>
          <div style={{ position: "absolute", left: 0, right: 0, top: N.one.label, display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", ...big(W, 64) }}>
              {one.label}
              {nq > 0 ? <div style={{ position: "absolute", left: -12, top: "52%", height: 10, width: `calc(${nq * 100}% + 24px)`, background: COLORS.accent, borderRadius: 5 }} /> : null}
            </div>
          </div>
        </div>
      ) : null}

      {/* the platform: rises out of the depth and from below */}
      {sq > 0 ? (
        <div style={{ position: "absolute", left: N.slab.x, top: N.slab.top + (1 - sq) * 300, width: N.slab.w, height: N.slab.h, borderRadius: 18, background: W,
          display: "flex", alignItems: "center", justifyContent: "center", transform: Z(lerp(-500, 0, sq)) || undefined }}>
          {slq > 0 ? <span style={{ ...big(COLORS.ink, 48), opacity: clamp01(slq * 3), letterSpacing: `${lerp(0.35, -0.042, EASE(slq))}em` }}>{slab.text}</span> : null}
        </div>
      ) : null}

      {/* three ADCs emitted from the slab, one after another, each rising to aim at its target */}
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1920} height={1080}>
        {N.adcs.map((x, i) => {
          const q = clamp01((ms - (tB + i * 260)) / 560);
          if (q <= 0) return null;
          const y = lerp(N.slab.top - 10, N.adcFork, BACK(q));
          return (
            <g key={i} transform={`translate(${x} ${y}) scale(${lerp(0.3, 1, EASE(q))})`} opacity={clamp01(q * 4)}>
              <Adc color={W} />
            </g>
          );
        })}
        {/* the targets: dashed (not named), drawn on "targets" */}
        {tq > 0
          ? N.adcs.map((x, i) => (
              <circle key={i} cx={x} cy={N.targetY} r={68} fill="none" stroke={W} strokeWidth={6} strokeDasharray="16 12" pathLength={427}
                opacity={clamp01((tq - i * 0.12) * 4)} transform={`rotate(${lerp(-90, 0, EASE(tq))} ${x} ${N.targetY})`} />
            ))
          : null}
      </svg>
      {tq > 0 ? (
        <div style={{ position: "absolute", right: 1920 - (N.adcs[0] - 110), top: N.targetY - 50, textAlign: "right", opacity: clamp01(tq * 3) }}>
          <div style={{ ...big(W, 44) }}>{targets.label[0]}</div>
          <div style={{ ...big(INK_SUB, 44) }}>{targets.label[1]}</div>
        </div>
      ) : null}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// OnlyIfAdvance — §7 close (red world)
// ══════════════════════════════════════════════════════════════════════════
export const ADV = {
  head: { x: 160, top: 200, size: 96 },
  run: { x: 160, y: 520, h: 110 },
  stop: 470, // the token's stop: a SHORT step (illustrative, no milestone position claimed)
};

export const OnlyIfAdvance: React.FC<Win & {
  head: { text: string } & Cued; // "Most"
  run: Cued; // "$15": the dashed run draws, the token appears
  roll: Cued; // "only if": the token rolls forward
  rollEnd: Cued; // "advance": it stops
  caption: { text: string } & Cued;
}> = ({ from, to, head, run, roll, rollEnd, caption }) => {
  const ms = useMs();
  const k = useK();
  const P3 = useP3();
  const W = COLORS.paper;
  const A = ADV;
  const tH = at(head, from, from);
  const tR = at(run, tH + 1000, from, tH + 300);
  const tRo = at(roll, tR + 1600, from, tR + 400);
  const tRe = at(rollEnd, tRo + 900, from, tRo + 400);
  const tC = at(caption, tRo + 200, from, tRo);
  const vis = clamp01(interpolate(ms, [from - 100, from + 150, to - 250, to], [0, 1, 1, 0], CLAMP));
  if (vis <= 0) return null;
  const rq = EASE_IO(k(tR, 600));
  const runW = rq * (1920 + 40 - A.run.x);
  const tokQ = k(tR + 200, 380);
  const roq = EASE_IO(clamp01((ms - tRo) / Math.max(500, tRe - tRo + 150)));
  const tx = lerp(A.run.x + 40, A.stop, roq);
  const cq = k(tC, 380);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: vis, ...P3 }}>
      <div style={{ position: "absolute", left: A.head.x, top: A.head.top }}>
        {ms >= tH ? <Letters text={head.text} t={tH} mode="flip" stagger={30} style={{ ...big(W, A.head.size) }} /> : null}
      </div>
      {rq > 0 ? (
        <svg style={{ position: "absolute", left: A.run.x, top: A.run.y, overflow: "visible" }} width={Math.max(1, runW)} height={A.run.h}>
          <rect x={2} y={2} width={runW + 60} height={A.run.h - 4} rx={6} fill="none" stroke={W} strokeWidth={5} strokeDasharray="24 15" />
        </svg>
      ) : null}
      {/* the stretch behind the token turns solid: only what has advanced */}
      {roq > 0 ? <div style={{ position: "absolute", left: A.run.x, top: A.run.y, width: tx - A.run.x, height: A.run.h, borderRadius: 6, background: W }} /> : null}
      {tokQ > 0 ? (
        <div style={{ position: "absolute", left: tx - 40, top: A.run.y - 100, width: 80, height: 80, borderRadius: 40, background: W, boxShadow: `0 0 0 10px ${INK_SUB_ON_RED}`,
          transform: `scale(${BACK(tokQ)}) rotate(${roq * 360}deg)` }}>
          <div style={{ position: "absolute", left: 36, top: 8, width: 8, height: 26, borderRadius: 4, background: COLORS.accent }} />
        </div>
      ) : null}
      {cq > 0 ? (
        <div style={{ position: "absolute", left: A.run.x, top: A.run.y + A.run.h + 40, ...big(W, 60), opacity: clamp01(cq * 3), transform: `translateY(${(1 - EASE(cq)) * 20}px)` }}>{caption.text}</div>
      ) : null}
    </div>
  );
};
