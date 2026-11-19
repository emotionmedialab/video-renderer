// ─────────────────────────────────────────────────────────────────────────
// KIT · pfb2v2 — Pfizer × Blackstone SHORT, chunk 2 (0:21.6–end), 9:16, 2026-11-17, built in the v2 house style
// (MOTION-RULES §0) from the first pass: rounded solids, lit gradients, springs that stop, vanishing scatter.
//  §3  a coin drops down a rail chute through two butterfly valves (FDA approval · Sales milestones) into
//      Blackstone's bowl.
//  §3b "No rights. No equity. No ownership" → three bars slam shut on side hinges under the molecule.
//  §4  the joined Pfizer|Blackstone pill splits: Blackstone's half shrinks into a royalty chip ("Our read"),
//      Pfizer's half grows to "keeps control".
//  §5  a big-pharma pipeline tank drains its cash; the deal plate drops onto it as a lid ("The template").
// On-screen limits (script.md header): "synthetic royalty" only under "Our read"; "every future dollar" is never
// printed (the screen says "keeps control"). Canvas 1080×1920; key text above y 1632.
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, COLORS, useMs } from "./core";
import { useP3, useZ } from "./camera";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { EASE, EASE_IO, fadeOut } from "./plusone";
import { label, line } from "./inovio";
import { Print } from "./ryb1b";
import { Scatter, useDropX, useEnt, useSpringX } from "./v2style";
import { G_GREY, G_INK, G_WHITE, Puck } from "./argenx1v2b";
import { PathSolid } from "./pfb1v2";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });
const G_RED = `linear-gradient(155deg, #ff6a71 0%, ${COLORS.accent} 55%, #a3121b 100%)`;
const G_GLASS = "linear-gradient(155deg, #ffffff 0%, #eef0f1 50%, #c3c7ca 100%)";
const useThump = () => {
  const ms = useMs();
  const sp = useSpringX();
  return (t: number) => (ms >= t ? 1 - sp(t, 6, 210, 0.6) : 0);
};
const pill = (bg: string, fg: string, size: number): React.CSSProperties => ({ background: bg, borderRadius: 999, padding: "12px 26px", ...label(fg, size) });

// ══════════════════════════════════════════════════════════════════════════
// §3 THE TRADE (red) — "And here's the trade. Blackstone gets paid only if the FDA approves the drug, and only on
//   sales milestones after launch."
//  pin (in the pause) → the rail chute with its two closed valves flies in from depth.
//  pin (lands ON "Blackstone") → Blackstone's bowl drops in under the chute and squashes.
//  pin (lands ON "paid") → the payment coin drops in from the top and rests on valve 1.
//  "approves" → valve 1 (FDA approval) twists open; the coin falls to valve 2; the camera cranes down with it.
//  "sales milestones" → valve 2 twists open; the coin falls into the bowl, which thumps. [NEW: gated-chute]
// Settled: the coin in Blackstone's bowl under the open chute (hero) · the two valve labels.
// ══════════════════════════════════════════════════════════════════════════
export const CHUTE = { x: 540, top: 330, bottom: 1240, gap: 210, rail: 26, v1: 700, v2: 1040, coin: 150, bowlTop: 1290 };
export const CHUTE_CAM = { crane: { y: -130 } };
const BOWL_PATH = "M0 0 H480 Q480 200 240 200 Q0 200 0 0 Z";

export const TradeChute: React.FC<Win & { arriveMs: number; bowlMs: number; coinMs: number; open1: Cued; open2: Cued }> = ({ from, to, arriveMs, bowlMs, coinMs, open1, open2 }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const drop = useDropX();
  const thump = useThump();
  const t1 = at(open1, 26350, from, coinMs + 400);
  const t2 = at(open2, 27990, from, t1 + 700);
  if (ms > to + 320) return null;
  const C = CHUTE;
  const arr = ent(arriveMs, 450);
  const db = drop(bowlMs - 380, 1100, 380);
  const r1 = C.v1 - 14 - C.coin / 2, r2 = C.v2 - 14 - C.coin / 2, r3 = C.bowlTop - 30; //  rests in the bowl, its top half showing
  // coin: falls in from the top onto valve 1, then down through each opened valve (gravity, 300ms per stage)
  const fall = (t0: number, a: number, b: number) => lerp(a, b, clamp01((ms - t0) / 300) ** 2);
  const coinY = ms < t1 + 140 ? fall(coinMs - 380, -260, r1) : ms < t2 + 140 ? fall(t1 + 140, r1, r2) : fall(t2 + 140, r2, r3);
  const land = ms < t1 + 140 ? coinMs : ms < t2 + 140 ? t1 + 440 : t2 + 440;
  const cs = thump(land);
  const valve = (t: number) => (ms >= t ? sp(t, 9, 170) : 0); // 0 closed → 1 open (edge-on), one overshoot
  const o1 = valve(t1), o2 = valve(t2);
  const bowlS = thump(t2 + 440);
  // a valve = a trapdoor flap hinged on one rail: it swings down 90° and hangs along that rail (open)
  const Valve: React.FC<{ y: number; o: number; side: 1 | -1 }> = ({ y, o, side }) => (
    <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${C.x + side * (C.gap / 2)}px ${y}px`, transform: `rotateZ(${-side * 90 * o}deg)` }}>
      <Puck x={C.x} y={y} w={C.gap} h={28} d={40} r={14} front={G_INK} side="#111" />
    </div>
  );
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to) }}>
      {/* the chute: two rounded rails + two valves, flies in from depth */}
      {ms >= arriveMs ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transform: `${z(lerp(-1800, 0, arr))}` }}>
          {[-1, 1].map((s) => (
            <Puck key={s} x={C.x + s * (C.gap / 2 + C.rail / 2)} y={(C.top + C.bottom) / 2} w={C.rail} h={C.bottom - C.top} d={60} r={13} front={G_WHITE} side="#bdbdbd" />
          ))}
          <Valve y={C.v1} o={o1} side={-1} />
          <Valve y={C.v2} o={o2} side={1} />
          <div style={{ ...abs(C.x + C.gap / 2 + C.rail + 26, C.v1 - 30), transform: z(30) || undefined }}><div style={pill(COLORS.paper, COLORS.ink, 36)}>FDA approval</div></div>
          <div style={{ ...abs(0, C.v2 - 30), width: C.x - C.gap / 2 - C.rail - 26, display: "flex", justifyContent: "flex-end", transform: z(30) || undefined }}>
            <div style={pill(COLORS.paper, COLORS.ink, 36)}>Sales milestones</div>
          </div>
        </div>
      ) : null}

      {/* the coin (z between the bowl's back and front, so it sits INSIDE the bowl) */}
      {ms >= coinMs - 380 ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transform: z(10) || undefined }}>
          <Puck x={C.x} y={coinY} w={C.coin} h={C.coin} d={26} r="50%" front={G_WHITE} side="#9a9a9a"
            style={{ transformOrigin: "50% 100%", transform: `scale(${1 + 0.14 * cs}, ${1 - 0.2 * cs})` }}>
            <div style={line(84, COLORS.ink)}>$</div>
          </Puck>
        </div>
      ) : null}
      <Scatter x={C.x} y={C.v1 - 14} t={coinMs} seed={3} n={6} />
      <Scatter x={C.x} y={C.v2 - 14} t={t1 + 440} seed={5} n={6} />

      {/* Blackstone's bowl */}
      {db.on ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${C.x}px ${C.bowlTop + 200}px`,
          transform: `${z(40)}translateY(${db.dy}px) scale(${db.sx * (1 + 0.05 * bowlS)}, ${db.sy * (1 - 0.08 * bowlS)})` }}>
          <PathSolid id="pfbBowl" x={C.x} y={C.bowlTop + 100} w={480} h={200} d={70} path={BOWL_PATH} front={["#6a6a6a", "#353535", "#161616"]} side="#0d0d0d">
            <div style={{ ...abs(0, 54), width: 480, display: "flex", justifyContent: "center", ...label(COLORS.paper, 44) }}>BLACKSTONE</div>
          </PathSolid>
        </div>
      ) : null}
      <Scatter x={C.x} y={C.bowlTop} t={t2 + 440} seed={7} n={8} zz={80} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// §3b NO RIGHTS (ink) — "No rights. No equity. No ownership of the molecule."
//  pin (in the pause) → the molecule (a ring of red atoms) springs in at the top.
//  pin / "No equity" / "No ownership" → three white bars SLAM SHUT on side hinges, one per "No", alternating
//          sides, each springing once against its stop. [NEW: bars-slam-shut]
//  "ownership" → the camera pushes in on the claim.
// Settled: the three bars (hero, a 3-row list) · the molecule.
// ══════════════════════════════════════════════════════════════════════════
export const NOBAR = { mol: { cx: 540, cy: 520, R: 120, atom: 34 }, bar: { w: 820, h: 150, ys: [900, 1090, 1280] } };
export const NOBAR_CAM = { push: { z: 200, y: 0 } };

export const NoBars: React.FC<Win & { molMs: number; bar1Ms: number; bar2: Cued; bar3: Cued }> = ({ from, to, molMs, bar1Ms, bar2, bar3 }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const t2 = at(bar2, 30950, from, bar1Ms + 500);
  const t3 = at(bar3, 31900, from, t2 + 500);
  if (ms > to + 320) return null;
  const M = NOBAR.mol, B = NOBAR.bar;
  const mp = ent(molMs, 350);
  const labels = ["No rights", "No equity", "No ownership"];
  const starts = [bar1Ms, t2, t3];
  const atoms = Array.from({ length: 6 }, (_, i) => {
    const a = -Math.PI / 2 + (i / 6) * Math.PI * 2;
    return [M.cx + Math.cos(a) * M.R, M.cy + Math.sin(a) * M.R] as [number, number];
  });
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to) }}>
      {/* the molecule */}
      {ms >= molMs ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${M.cx}px ${M.cy}px`, transform: `${z(lerp(-1600, 0, mp))}rotateZ(${lerp(-120, 0, mp)}deg)` }}>
          <svg width={1080} height={1000} style={{ position: "absolute", left: 0, top: 0 }}>
            {atoms.map(([x, y], i) => {
              const [x2, y2] = atoms[(i + 1) % 6];
              return <line key={i} x1={x} y1={y} x2={x2} y2={y2} stroke="#d0d0d0" strokeWidth={12} strokeLinecap="round" />;
            })}
            <line x1={atoms[1][0]} y1={atoms[1][1]} x2={atoms[1][0] + 110} y2={atoms[1][1] - 60} stroke="#d0d0d0" strokeWidth={12} strokeLinecap="round" />
            <line x1={atoms[4][0]} y1={atoms[4][1]} x2={atoms[4][0] - 110} y2={atoms[4][1] + 60} stroke="#d0d0d0" strokeWidth={12} strokeLinecap="round" />
          </svg>
          {[...atoms, [atoms[1][0] + 110, atoms[1][1] - 60], [atoms[4][0] - 110, atoms[4][1] + 60]].map(([x, y], i) => {
            const r = i < 6 ? M.atom : M.atom * 0.8;
            return <div key={i} style={{ ...abs(x - r, y - r), width: r * 2, height: r * 2, borderRadius: "50%", transform: z(10) || undefined,
              background: `radial-gradient(circle at 35% 30%, #ff8a90, ${COLORS.accent} 55%, #8f0e15 100%)`, boxShadow: "0 8px 16px rgba(0,0,0,0.45)" }} />;
          })}
        </div>
      ) : null}

      {/* the three bars, slamming shut on alternating hinges */}
      {B.ys.map((y, i) => {
        const t = starts[i];
        if (ms < t) return null;
        const left = i % 2 === 0;
        const s = sp(t, 9, 190); //            0 → 1 with one overshoot past the stop, then still
        const hinge = left ? 540 - B.w / 2 : 540 + B.w / 2;
        return (
          <React.Fragment key={i}>
            <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${hinge}px ${y}px`, transform: `rotateY(${(left ? -1 : 1) * 96 * (1 - s)}deg)` }}>
              <Puck x={540} y={y} w={B.w} h={B.h} d={70} r={B.h / 2} front={G_WHITE} side="#9a9a9a">
                <div style={line(64, COLORS.ink)}>{labels[i]}</div>
              </Puck>
            </div>
            <Scatter x={left ? 540 + B.w / 2 : 540 - B.w / 2} y={y} t={t + 260} seed={13 + i} n={6} zz={40} />
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// §4 OUR READ (paper) — "That's a synthetic royalty, not a partnership. Pfizer keeps every future dollar of revenue."
//  "That's" → one joined pill (PFIZER | BLACKSTONE) springs in: it reads as a partnership.
//  "synthetic" → the pill SPLITS at its seam: Blackstone's half pops off and shrinks into a small red royalty
//          chip that drops below; the camera cranes down with it. [NEW: split-to-chip]
//  "royalty," → "Our read · Synthetic royalty" prints under the chip.
//  "Pfizer keeps" → Pfizer's half springs to full size in the centre; "keeps control" prints with it.
// Settled: Pfizer's block, "keeps control" (hero) · the royalty chip · the Our read label.
// ══════════════════════════════════════════════════════════════════════════
export const READ = { cy: 760, w: 840, h: 220, chip: { x: 540, y: 1250, d: 130 } };
export const READ_CAM = { crane: { y: -90 } };

export const SplitRead: React.FC<Win & { join: Cued; split: Cued; royalty: Cued; keeps: Cued }> = ({ from, to, join, split, royalty, keeps }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const tJ = at(join, 33936, from);
  const tS = at(split, 34200, from, tJ + 260);
  const tR = at(royalty, 34980, from, tS + 600);
  const tK = at(keeps, 37400, from, tR + 600);
  if (ms > to + 320) return null;
  const R = READ, half = R.w / 2;
  const jn = ent(tJ, 400);
  // Blackstone's half → the chip: one arc down to the chip seat, shrinking and rounding into a coin (turns red as it lands)
  const pS = EASE_IO(clamp01((ms - tS) / 620));
  const bx = lerp(540 + half / 2, R.chip.x, pS), by = lerp(R.cy, R.chip.y, pS) - 160 * Math.sin(Math.PI * pS);
  const bw = lerp(half, R.chip.d, pS), bh = lerp(R.h, R.chip.d, pS);
  const chipS = ms >= tS + 620 ? 1 - sp(tS + 620, 6, 210, 0.6) : 0;
  // Pfizer's half: holds after the split, then springs to the full block in the centre on "Pfizer keeps"
  const g = ms >= tK ? sp(tK, 10, 150) : 0;
  const px = lerp(540 - half / 2, 540, g), pw = lerp(half, R.w, g), ph = lerp(R.h, 300, g);
  const joined = ms < tS;
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to) }}>
      {/* contact shadow under the block */}
      <div style={{ ...abs(540 - 440, R.cy + 170), width: 880, height: 40, borderRadius: "50%", background: "rgba(0,0,0,0.14)", filter: "blur(10px)", opacity: ms >= tJ ? 1 : 0 }} />
      {ms >= tJ ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transform: `${z(lerp(-1800, 0, jn))}` }}>
          {/* Pfizer's half */}
          <Puck x={px} y={R.cy} w={pw} h={ph} d={90} r={joined ? `${R.h / 2}px 0 0 ${R.h / 2}px` : ph / 2} front={G_GREY} side="#5a5a5a">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={line(g > 0 ? 84 : 60, COLORS.ink)}>PFIZER</div>
              {ms >= tK ? <div style={{ height: 52 }}><Print t={tK + 150}><div style={label(COLORS.ink, 46)}>keeps control</div></Print></div> : null}
            </div>
          </Puck>
          {/* Blackstone's half (→ the royalty chip) */}
          <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${bx}px ${by + bh / 2}px`, transform: `scale(${1 + 0.14 * chipS}, ${1 - 0.2 * chipS})` }}>
            <Puck x={bx} y={by} w={bw} h={bh} d={lerp(90, 30, pS)} r={joined ? `0 ${R.h / 2}px ${R.h / 2}px 0` : Math.min(bw, bh) / 2}
              front={pS < 0.7 ? G_INK : G_RED} side={pS < 0.7 ? "#111" : "#8f0e15"}>
              {pS < 0.5 ? <div style={line(52, COLORS.paper)}>BLACKSTONE</div> : <div style={line(48, COLORS.paper)}>$</div>}
            </Puck>
          </div>
        </div>
      ) : null}
      <Scatter x={R.chip.x} y={R.chip.y + R.chip.d / 2} t={tS + 620} seed={17} n={6} color="#9a9a9a" zz={30} />
      <div style={{ ...abs(0, R.chip.y + R.chip.d / 2 + 30), width: 1080, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, transform: z(20) || undefined }}>
        <Print t={tR}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={pill(COLORS.ink, COLORS.paper, 30)}>Our read</div>
            <div style={line(56, COLORS.ink)}>Synthetic royalty</div>
          </div>
        </Print>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// §5 THE TEMPLATE (red) — "Watch for the copycats, every big pharma with a cash-draining pipeline just got a template."
//  pin (in the pause) → a glass pipeline tank, full of cash, springs in from depth.
//  "big pharma" → "Big pharma pipeline" prints on the tank.
//  "cash-draining" → the cash DRAINS: the level falls, its surface sloshing flat.
//  pin (lands during "pipeline") → the deal plate "The template" drops onto the tank as its lid; the tank thumps;
//          the camera pushes in on it. [NEW: template-lid]
// Settled: the drained tank (hero) · the template lid · the tank's label.
// ══════════════════════════════════════════════════════════════════════════
export const TANK = { cx: 540, cy: 1080, w: 500, h: 620, d: 150, lid: { w: 600, h: 120 } };
export const TANK_CAM = { push: { z: 180, y: -40 } };
const LID_FALL = 380;

export const TemplateLid: React.FC<Win & { arriveMs: number; pharma: Cued; drain: Cued; lidMs: number }> = ({ from, to, arriveMs, pharma, drain, lidMs }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const drop = useDropX();
  const thump = useThump();
  const tP = at(pharma, 42300, from);
  const tD = at(drain, 43060, from, tP + 400);
  if (ms > to + 320) return null;
  const T = TANK;
  const top = T.cy - T.h / 2;
  const arr = ent(arriveMs, 450);
  const dn = clamp01((ms - tD) / 640);
  const lvl = lerp(0.62, 0.14, EASE(dn));
  const wave = 22 * (dn > 0 ? 1 - clamp01((ms - tD) / 900) : 0) * Math.sin(clamp01((ms - tD) / 900) * Math.PI * 4);
  const fillH = T.h * lvl;
  const dl = drop(lidMs - LID_FALL, 1300, LID_FALL);
  const ts = thump(lidMs);
  const wavePath = (w: number) => {
    const pts = Array.from({ length: 21 }, (_, i) => `${(i / 20) * w},${(Math.sin(i * 0.8 + dn * 9) * wave).toFixed(1)}`);
    return `M0,${Math.abs(wave) + 30} L${pts.join(" L")} L${w},${Math.abs(wave) + 30} Z`;
  };
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to) }}>
      {ms >= arriveMs ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${T.cx}px ${T.cy + T.h / 2}px`,
          transform: `${z(lerp(-1800, 0, arr))}translateY(${lerp(240, 0, arr)}px) scale(${1 + 0.04 * ts}, ${1 - 0.06 * ts})` }}>
          <Puck x={T.cx} y={T.cy} w={T.w} h={T.h} d={T.d} r={110} front={G_GLASS} side="#9da3a7" clip>
            <div style={{ ...abs(0, 60), width: T.w, display: "flex", justifyContent: "center", height: 60 }}>
              <Print t={tP}><div style={label(COLORS.ink, 42)}>Big pharma pipeline</div></Print>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: fillH }}>
              <svg width={T.w} height={70} style={{ position: "absolute", left: 0, top: -30 }}><path d={wavePath(T.w)} fill="#3a3a3a" /></svg>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #3a3a3a, #121212)", overflow: "hidden" }}>
                <div style={{ position: "absolute", left: 0, bottom: 0, width: T.w, height: T.h * 0.14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={label(COLORS.paper, 40)}>Cash</div>
                </div>
              </div>
            </div>
          </Puck>
        </div>
      ) : null}

      {dl.on ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${T.cx}px ${top}px`, transform: `${z(30)}translateY(${dl.dy}px) scale(${dl.sx}, ${dl.sy})` }}>
          <Puck x={T.cx} y={top - T.lid.h / 2 + 8} w={T.lid.w} h={T.lid.h} d={70} r={T.lid.h / 2} front={G_INK} side="#111">
            <div style={line(54, COLORS.paper)}>The template</div>
          </Puck>
        </div>
      ) : null}
      <Scatter x={T.cx} y={top} t={lidMs} seed={19} n={8} zz={60} />
    </AbsoluteFill>
  );
};
