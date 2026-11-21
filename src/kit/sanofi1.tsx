// ─────────────────────────────────────────────────────────────────────────
// KIT · sanofi1 — Sanofi × Insmed SHORT (9:16), chunk 1, 2026-11-21. House style 11-16 (MOTION-RULES §0).
//  S1 cheque (red)   "Over $30 billion" → a cheque flips in edge-on from depth; $30B+ lands whole in its amount box.
//  S2 handover (ink) "Bloomberg says Sanofi could pay for Insmed … one analyst scenario reaching toward $40B" →
//                     the hook cheque arcs from SANOFI and hovers over INSMED; a grey $40B scenario cheque slides in behind.
//  S3 lungs (red)    "The target is Brinsupri, a lung drug" → lungs fly in from deep z and tumble square; BRINSUPRI drops.
//  S4 lift (paper)   "raised to $1.35 to $1.4B in 2026 guidance … after a $400M third quarter" → the guidance platform
//                     lifts on its post; the blank base turns over to a red Q3 · $400M face.
//  S5 peak (ink)     "Insmed still models peak sales above $7B" → a mountain rises; a red $7B+ flag plants on the summit.
// Canvas 1080×1920; chrome band 0–112; key content above y 1632.
// On-screen limits (Bloomberg report via the 11-21 caption): REPORTED · ONE ANALYST SCENARIO (needle stops short of 40) ·
// 2026 GUIDANCE · INSMED'S MODEL. No deal signed.
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
import { G_RED, WType } from "./summit1";
import { LineDrop } from "./jnjtype";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });
const Shadow: React.FC<{ x: number; y: number; w: number; o?: number }> = ({ x, y, w, o = 1 }) => (
  <div style={{ ...abs(x - w / 2, y), width: w, height: 40, borderRadius: "50%", background: "rgba(0,0,0,0.24)", filter: "blur(12px)", opacity: o }} />
);
const Centre: React.FC<{ y: number; children: React.ReactNode }> = ({ y, children }) => (
  <div style={{ ...abs(0, y), width: 1080, display: "flex", justifyContent: "center" }}>{children}</div>
);

// ══════════════════════════════════════════════════════════════════════════
// S1 CHEQUE (red). Settled: the cheque with $30B+ in its amount box — hero only.
// ══════════════════════════════════════════════════════════════════════════
export const CHQ = { x: 540, y: 960, w: 820, h: 420, d: 40 };
export const CHQ_CAM = { push: { z: 110 } };

/** the cheque face (shared with the chunk-2 callback): grey memo bars, an ink amount box, a signature line */
export const ChequeFace: React.FC<{ amount: React.ReactNode; memo?: React.ReactNode }> = ({ amount, memo }) => {
  const W = CHQ.w, H = CHQ.h;
  return (
    <div style={{ position: "relative", width: W, height: H }}>
      {memo ? <div style={{ ...abs(56, 28), height: 80, display: "flex", alignItems: "center" }}>{memo}</div> : (
        <>
          <div style={{ ...abs(56, 58), width: 220, height: 22, borderRadius: 11, background: "#d9d9d9" }} />
          <div style={{ ...abs(56, 98), width: 140, height: 22, borderRadius: 11, background: "#e6e6e6" }} />
        </>
      )}
      <div style={{ ...abs(W - 56 - 500, 118), width: 500, height: 180, borderRadius: 34, background: COLORS.ink,
        display: "flex", alignItems: "center", justifyContent: "center" }}>{amount}</div>
      <div style={{ ...abs(W - 56 - 340, H - 50), width: 340, height: 6, borderRadius: 3, background: "#bdbdbd" }} />
    </div>
  );
};

export const Cheque: React.FC<Win & { arriveMs: number; fig: Cued }> = ({ from, to, arriveMs, fig }) => {
  const ms = useMs();
  const p3 = useP3();
  const z = useZ();
  const sp = useSpringX();
  const tF = at(fig, 740, from, arriveMs + 500);
  if (ms < arriveMs || ms > to + 320) return null;
  const C = CHQ;
  const p = sp(arriveMs, 10, 110); //            edge-on → square, one overshoot, then still
  const ry = lerp(88, 0, p); //                   never passes 90°: the front face is the only face ever shown
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to + 300) }}>
      <Shadow x={C.x} y={C.y + C.h / 2 + 30} w={820} o={clamp01(p)} />
      <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${C.x}px ${C.y}px`,
        transform: `${z(lerp(-1800, 0, Math.min(1, p)))}rotateY(${ry}deg)` }}>
        <Puck x={C.x} y={C.y} w={C.w} h={C.h} d={C.d} r={40} front={G_WHITE} side="#a5a5a5">
          <ChequeFace amount={<WType text="$30B+" t={tF} size={150} color={COLORS.paper} />} />
        </Puck>
      </div>
      <Scatter x={C.x + 130} y={C.y + 60} t={tF + 300} seed={3} n={6} color={COLORS.paper} zz={C.d} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S2 HANDOVER (ink) — replaces the gauge (Nel, 2026-11-21: "change the animation on this scene"; picked "cheque handover").
// Settled: SANOFI block → the $30B+ cheque hovering over the red INSMED block (hero diagram) · the grey $40B scenario cheque behind.
// The cheque stops ABOVE Insmed, never lands: "could pay", no deal signed.
// ══════════════════════════════════════════════════════════════════════════
export const HAND = { s: 0.72, sanY: 400, start: 740, end: 1200, insY: 1510, blk: { w: 560, h: 170, d: 70 }, ghostDy: -240, ghostDz: -110, bow: 210 };
export const HAND_CAM = { crane: { y: -80 } };

export const Handover: React.FC<Win & { says: Cued; sanofi: Cued; pay: Cued; insmed: Cued; analyst: Cued; scenario: Cued; toward: Cued }> = ({
  from, to, says, sanofi, pay, insmed, analyst, scenario, toward,
}) => {
  const ms = useMs();
  const p3 = useP3();
  const z = useZ();
  const ent = useEnt();
  const sp = useSpringX();
  const tSays = at(says, 4550, from);
  const tS = at(sanofi, 4800, from, tSays + 200);
  const tP = at(pay, 5180, from, tS + 300);
  const tI = at(insmed, 5880, from, tP + 600);
  const tA = at(analyst, 6810, from, tI + 700);
  const tSc = at(scenario, 7250, from, tA + 400);
  const tT = at(toward, 8200, from, tSc + 500);
  if (ms > to + 320) return null;
  const H = HAND, B = H.blk;
  const e = ent(from, 600); //                         SANOFI block + the hook's cheque spring in from depth together
  const rise = sp(tP, 10, 120); //                     INSMED rises from below on "could pay"
  const fly = sp(tI, 12, 110); //                      the cheque arcs down on "Insmed" and stops above it (small overshoot)
  const fl = Math.min(1, fly);
  const cy = lerp(H.start, H.end, fly), cx = 540 + Math.sin(fl * Math.PI) * H.bow, crz = Math.sin(fl * Math.PI) * -12;
  const ghost = sp(tA, 11, 120); //                    the grey scenario cheque slides in behind from depth
  const cheque = (y: number, x: number, rz: number, front: string, side: string, face: React.ReactNode, zz: number) => (
    <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `540px ${CHQ.y}px`, transform: `${z(zz)}translate(${x - 540}px, ${y - CHQ.y}px) rotate(${rz}deg) scale(${H.s})` }}>
      <Puck x={540} y={CHQ.y} w={CHQ.w} h={CHQ.h} d={CHQ.d} r={40} front={front} side={side}>{face}</Puck>
    </div>
  );
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to + 300) }}>
      {/* SANOFI: blank block, its name prints on "Sanofi" */}
      <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `540px ${H.sanY}px`, transform: `${z(lerp(-1500, 0, e))}` }}>
        <Puck x={540} y={H.sanY} w={B.w} h={B.h} d={B.d} r={44} front={G_WHITE} side="#9c9c9c">
          <div style={{ height: 96 }}><Print t={tS}><div style={line(88, COLORS.ink)}>SANOFI</div></Print></div>
        </Puck>
      </div>

      {/* INSMED: the red block rises from below the frame */}
      {ms >= tP ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transform: `translateY(${lerp(760, 0, rise)}px)` }}>
          <Shadow x={540} y={H.insY + B.h / 2 - 4} w={540} />
          <Puck x={540} y={H.insY} w={B.w} h={B.h} d={B.d} r={44} front={G_RED} side="#8f0e15">
            <div style={line(88, COLORS.paper)}>INSMED</div>
          </Puck>
        </div>
      ) : null}

      {/* the scenario cheque: grey, BEHIND the reported one, its $40B lands on "toward" */}
      {ms >= tA ? cheque(H.end + H.ghostDy, 540, 0, G_GREY, "#5e5e5e",
        <ChequeFace memo={<Print t={tSc}><div style={label(COLORS.ink, 50)}>ONE ANALYST SCENARIO</div></Print>}
          amount={<WType text="$40B" t={tT} size={140} color={COLORS.paper} />} />,
        lerp(-1400, H.ghostDz, Math.min(1, ghost))) : null}

      {/* the reported cheque: the hook's $30B+, REPORTED printing on its memo line; it arcs from Sanofi to hover over Insmed */}
      {cheque(cy, cx, crz, G_WHITE, "#a5a5a5",
        <ChequeFace memo={<Print t={tSays}><div style={label(COLORS.ink, 62)}>REPORTED</div></Print>}
          amount={<div style={line(150, COLORS.paper)}>$30B+</div>} />,
        lerp(-1500, 40, e))}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S3 LUNGS (red). Settled: the lungs (hero) · BRINSUPRI plate.
// ══════════════════════════════════════════════════════════════════════════
export const LUNGS = { x: 540, y: 880, w: 600, h: 640, d: 70, plateY: 1420 };
export const LUNGS_CAM = { push: { z: 140, y: 30 } };
const LUNG_PATH =
  "M262 190 C 190 150 70 250 45 420 C 28 540 80 625 160 625 C 235 625 262 570 262 480 Z " +
  "M338 190 C 410 150 530 250 555 420 C 572 540 520 625 440 625 C 365 625 338 570 338 480 Z " +
  "M282 0 H318 V200 L352 236 L338 250 L300 212 L262 250 L248 236 L282 200 Z";

export const Lungs: React.FC<Win & { target: Cued; name: Cued }> = ({ from, to, target, name }) => {
  const ms = useMs();
  const p3 = useP3();
  const z = useZ();
  const sp = useSpringX();
  const drop = useDropX();
  const tT = at(target, 10310, from);
  const tN = at(name, 10970, from, tT + 500);
  if (ms > to + 320 || ms < tT - 300) return null;
  const L = LUNGS;
  const t0 = tT - 300; //                         pin: leads "target" so the lungs LAND on the word (M5)
  const f = sp(t0, 11, 120);
  const rz = lerp(-34, 0, f), sc = lerp(0.4, 1, Math.min(1, f));
  const pd = drop(tN, 900, 340);
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to + 300) }}>
      <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${L.x}px ${L.y}px`,
        transform: `${z(lerp(-2400, 0, Math.min(1, f)))}rotate(${rz}deg) scale(${sc})` }}>
        <Shadow x={L.x} y={L.y + L.h / 2} w={560} o={clamp01(f)} />
        <PathSolid id="lungs3" x={L.x} y={L.y} w={L.w} h={L.h} d={L.d} path={LUNG_PATH} front={["#ffffff", "#f0f0f0", "#cdcdcd"]} side="#a3121b" />
      </div>
      {pd.on ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `540px ${L.plateY + 70}px`, transform: `${z(40)}translateY(${pd.dy}px) scale(${pd.sx}, ${pd.sy})` }}>
          <Puck x={540} y={L.plateY} w={680} h={150} d={50} r={75} front={G_WHITE} side="#a5a5a5">
            <div style={line(96, COLORS.ink)}>BRINSUPRI</div>
          </Puck>
        </div>
      ) : null}
      <Scatter x={540} y={L.plateY + 75} t={tN + 340} seed={5} n={6} color={COLORS.paper} zz={60} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S4 LIFT (paper). Settled: the guidance platform ($1.35–1.4B · 2026 GUIDANCE) on its post (hero) · BRINSUPRI · the Q3 base.
// ══════════════════════════════════════════════════════════════════════════
export const LIFT = { x: 540, low: 1080, high: 760, pw: 880, ph: 320, pd: 90, baseY: 1500, bw: 560, bh: 210, bd: 80, postW: 90, kickY: 300 };
export const LIFT_CAM = { crane: { y: 110 }, pull: { y: 0, z: -150 } };

export const Lift: React.FC<Win & { just: Cued; raised: Cued; lo: Cued; hi: Cued; year: Cued; q3: Cued }> = ({ from, to, just, raised, lo, hi, year, q3 }) => {
  const ms = useMs();
  const p3 = useP3();
  const z = useZ();
  const ent = useEnt();
  const sp = useSpringX();
  const k = useK();
  const tJ = at(just, 13160, from);
  const tR = at(raised, 13500, from, tJ + 250);
  const tL = at(lo, 14180, from, tR + 480);
  const tH = at(hi, 15440, from, tL + 400);
  const tY = at(year, 17200, from, tH + 400);
  const tQ = at(q3, 19510, from, tY + 600);
  if (ms > to + 320) return null;
  const L = LIFT;
  const e = ent(from, 500);
  const lift = sp(tR, 9, 110); //                  springy rise, one overshoot, then still
  const py = lerp(L.low, L.high, lift);
  const postTop = py + L.ph / 2, postBot = L.baseY - L.bh / 2;
  // the base turns over on "$400 million": 0→90° shows its blank face edge-on, then the red face swings 90→0 (never mirrored)
  const turn = EASE_IO(k(tQ, 700));
  const showRed = turn >= 0.5;
  const rx = showRed ? lerp(-90, 0, (turn - 0.5) * 2) : lerp(0, 90, turn * 2);
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to + 300) }}>
      <Centre y={L.kickY}><LineDrop text="BRINSUPRI" t={tJ} size={84} color={COLORS.ink} /></Centre>
      <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `540px ${L.baseY}px`, transform: `${z(lerp(-1600, 0, e))}` }}>
        <Shadow x={540} y={L.baseY + L.bh / 2 - 6} w={600} />
        {/* the post: grows with the lift */}
        <Puck x={L.x} y={(postTop + postBot) / 2} w={L.postW} h={Math.max(10, postBot - postTop)} d={60} r={45} front={G_GREY} side="#5e5e5e" />
        {/* the base: blank grey, turns over to red Q3 · $400M */}
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `540px ${L.baseY}px`, transform: `rotateX(${rx}deg)` }}>
          <Puck x={L.x} y={L.baseY} w={L.bw} h={L.bh} d={L.bd} r={60} front={showRed ? G_RED : G_GREY} side={showRed ? "#8f0e15" : "#5e5e5e"}>
            {showRed ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <div style={label(COLORS.paper, 46)}>Q3</div>
                <div style={line(104, COLORS.paper)}>$400M</div>
              </div>
            ) : null}
          </Puck>
        </div>
        {/* the platform */}
        <Puck x={L.x} y={py} w={L.pw} h={L.ph} d={L.pd} r={70} front={G_INK} side="#111">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <WType text="$1.35–" t={tL} size={132} color={COLORS.paper} />
              <WType text="1.4B" t={tH} size={132} color={COLORS.paper} />
            </div>
            <div style={{ height: 60 }}><Print t={tY}><div style={label("#cfcfcf", 50)}>2026 GUIDANCE</div></Print></div>
          </div>
        </Puck>
      </div>
      <Scatter x={540} y={L.baseY - L.bh / 2} t={tQ + 700} seed={9} n={6} color={COLORS.accent} zz={L.bd} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S5 PEAK (ink). Settled: the mountain with the $7B+ flag on its summit (hero) · INSMED'S MODEL.
// ══════════════════════════════════════════════════════════════════════════
const MW = 860, MH = 660;
export const PEAK = { x: 540, y: 1200, d: 110, summit: [540 - MW / 2 + 470, 1200 - MH / 2 + 40] as [number, number], pole: 300, kickY: 360 };
export const PEAK_CAM = { push: { z: 130, y: 40 } };
const MOUNTAIN = `M0 ${MH} C 140 600 240 420 340 230 Q 420 60 470 40 Q 520 60 590 230 C 680 420 740 600 ${MW} ${MH} Z`;

export const Peak: React.FC<Win & { insmed: Cued; models: Cued; above: Cued }> = ({ from, to, insmed, models, above }) => {
  const ms = useMs();
  const p3 = useP3();
  const z = useZ();
  const sp = useSpringX();
  const drop = useDropX();
  const tI = at(insmed, 21950, from);
  const tM = at(models, 23070, from, tI + 400);
  const tA = at(above, 24420, from, tM + 700);
  if (ms > to + 320) return null;
  const P = PEAK, [sx, sy] = P.summit;
  const rise = sp(tM, 10, 110);
  const fd = drop(tA, 1100, 420);
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to + 300) }}>
      <Centre y={P.kickY}><LineDrop text="INSMED'S MODEL" t={tI} size={84} color={COLORS.paper} /></Centre>
      {ms >= tM ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transform: `translateY(${lerp(900, 0, rise)}px)` }}>
          <PathSolid id="peak5" x={P.x} y={P.y} w={MW} h={MH} d={P.d} path={MOUNTAIN} front={["#ffffff", "#e9e9e9", "#a9a9a9"]} side="#6f6f6f">
            <div style={{ ...abs(0, MH - 150), width: MW, display: "flex", justifyContent: "center" }}><div style={label(COLORS.ink, 50)}>PEAK SALES</div></div>
          </PathSolid>
        </div>
      ) : null}
      {/* the flag: falls through depth onto the summit and plants, a small squash */}
      {fd.on ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${sx}px ${sy}px`,
          transform: `${z(lerp(-900, P.d / 2 + 6, clamp01((ms - tA) / 420)))}translateY(${fd.dy}px) scale(${fd.sx}, ${fd.sy})` }}>
          <div style={{ ...abs(sx - 8, sy - P.pole), width: 16, height: P.pole + 10, borderRadius: 8, background: "#e8e8e8" }} />
          <Puck x={sx + 8 + 170} y={sy - P.pole + 100} w={340} h={200} d={30} r={24} front={G_RED} side="#8f0e15">
            <div style={line(104, COLORS.paper)}>$7B+</div>
          </Puck>
        </div>
      ) : null}
      <Scatter x={sx} y={sy} t={tA + 420} seed={13} n={6} color={COLORS.paper} zz={P.d / 2} />
    </AbsoluteFill>
  );
};
