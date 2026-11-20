// ─────────────────────────────────────────────────────────────────────────
// KIT · starna1 — Pfizer × Starna in vivo CAR-T SHORT (9:16), chunk 1, 2026-11-20. House style 11-16 (MOTION-RULES §0).
//  S1 hook (red)   "$330 million … Up front." → a white cash brick falls and squashes; $330M lands whole on its face;
//                   on "Up front" the brick steps FORWARD out of the frame plane, UPFRONT printing on it (camera pushes with it).
//  S2 vials (ink)  "Pfizer … license three pre-IND … programs from Starna" → a Starna tray springs in; three CAR-T vials
//                   fall onto it one after another; PRE-IND drops under the tray; STARNA prints on its face.
//  S3 queue (paper) "up to $2.3 billion in milestones behind it" → the $330M brick returns marked PAID; seven grey
//                   bricks (≈ $2.3B ÷ $330M) rise one by one in a row receding BEHIND it; the camera pulls back.
//  S4 bag (red)    "CAR-T has always been cancer medicine" → an IV bag drops on its line and swings to rest; FOR CANCER prints.
//  S5 loop (ink)   "Remove … Engineer … Re-infuse. Expensive, slow, bespoke." → a T-cell leaves the patient for the lab flask,
//                   grows its red receptors there, and flies back; the three costs drop as one line; on "Starna's" the lab falls away.
//  S6 in vivo (paper) "engineer the T-cells inside the patient, using RNA" → a red RNA capsule flies in from depth into the
//                   patient (camera pushes with it); the T-cells inside appear, then turn red one by one.
// Canvas 1080×1920; chrome band 0–112; key content above y 1632.
// On-screen limits (source: Pfizer release 2026-11-18): "$330M upfront", "UP TO $2.3B", "PRE-IND". No market-size number.
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill, interpolateColors } from "remotion";
import { clamp01, COLORS, useMs } from "./core";
import { useP3, useZ } from "./camera";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { EASE, EASE_IO, fadeOut } from "./plusone";
import { label, line } from "./inovio";
import { Print } from "./ryb1b";
import { Scatter, useDropX, useEnt, useSpringX } from "./v2style";
import { G_GREY, G_INK, G_WHITE, Puck } from "./argenx1v2b";
import { PathSolid } from "./pfb1v2";
import { Vial, WType } from "./summit1";
import { LineDrop } from "./jnjtype";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });
export const G_RED = `linear-gradient(155deg, #ff6a71 0%, ${COLORS.accent} 55%, #a3121b 100%)`;
const useThump = () => {
  const ms = useMs();
  const sp = useSpringX();
  return (t: number) => (ms >= t ? 1 - sp(t, 6, 210, 0.6) : 0);
};
const Shadow: React.FC<{ x: number; y: number; w: number; o?: number }> = ({ x, y, w, o = 1 }) => (
  <div style={{ ...abs(x - w / 2, y), width: w, height: 40, borderRadius: "50%", background: "rgba(0,0,0,0.24)", filter: "blur(12px)", opacity: o }} />
);

/** the cash brick: a thick rounded solid with a banded face */
export const Brick: React.FC<{ x: number; y: number; w: number; h: number; d: number; ink?: boolean; grey?: boolean; children?: React.ReactNode }> = ({ x, y, w, h, d, ink, grey, children }) => (
  <Puck x={x} y={y} w={w} h={h} d={d} r={Math.min(w, h) * 0.18} front={ink ? G_INK : grey ? G_GREY : G_WHITE} side={ink ? "#111" : grey ? "#5e5e5e" : "#a5a5a5"}>
    <div style={{ ...abs(w * 0.06, 0), width: w * 0.06, height: h, background: ink ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }} />
    <div style={{ ...abs(w * 0.88, 0), width: w * 0.06, height: h, background: ink ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }} />
    {children}
  </Puck>
);

/** a person: rounded head + shoulders (centre x, top of head y) */
export const Person: React.FC<{ x: number; top: number; s?: number; front: string; side: string; children?: React.ReactNode }> = ({ x, top, s = 1, front, side, children }) => {
  const hd = 170 * s, tw = 320 * s, th = 400 * s;
  return (
    <>
      <Puck x={x} y={top + hd / 2} w={hd} h={hd} d={70 * s} r="50%" front={front} side={side} />
      <Puck x={x} y={top + hd + 24 * s + th / 2} w={tw} h={th} d={90 * s} r={`${tw / 2}px ${tw / 2}px ${40 * s}px ${40 * s}px`} front={front} side={side}>
        {children}
      </Puck>
    </>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S1 HOOK (red). Settled: the brick ($330M · UPFRONT) — hero only.
// ══════════════════════════════════════════════════════════════════════════
export const HOOK = { brick: { x: 540, y: 930, w: 620, h: 360, d: 140 }, step: 240 };
export const HOOK_CAM = { push: { z: 120 } };

export const Hook: React.FC<Win & { fallMs: number; figMs: number; up: Cued }> = ({ from, to, fallMs, figMs, up }) => {
  const ms = useMs();
  const p3 = useP3();
  const z = useZ();
  const drop = useDropX();
  const sp = useSpringX();
  const tU = at(up, 2600, from, figMs + 600);
  if (ms > to + 320) return null;
  const B = HOOK.brick;
  const d = drop(fallMs, 1300, 380);
  const st = sp(tU, 12, 130); //               steps forward out of the frame plane, one overshoot, then still
  const tilt = Math.sin(clamp01(st) * Math.PI) * 9; // a lean only while it travels; square at rest
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to + 300) }}>
      {d.on ? <Shadow x={B.x} y={B.y + B.h / 2 + 20} w={640} o={clamp01(1 + d.dy / 1300)} /> : null}
      {d.on ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${B.x}px ${B.y + B.h / 2}px`,
          transform: `${z(HOOK.step * st)}translateY(${d.dy - 40 * st}px) rotateX(${tilt}deg) scale(${d.sx}, ${d.sy})` }}>
          <Brick x={B.x} y={B.y} w={B.w} h={B.h} d={B.d}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <WType text="$330M" t={figMs} size={168} color={COLORS.ink} />
              <div style={{ height: 64 }}><Print t={tU + 120}><div style={label(COLORS.accent, 56)}>UPFRONT</div></Print></div>
            </div>
          </Brick>
        </div>
      ) : null}
      <Scatter x={B.x} y={B.y + B.h / 2} t={fallMs + 380} seed={2} n={7} color={COLORS.paper} zz={B.d / 2} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S2 VIALS (ink). Settled: three CAR-T vials on the tray (hero) · STARNA (tray face) · PRE-IND.
// ══════════════════════════════════════════════════════════════════════════
export const VIALS = { trayY: 1220, tray: { w: 860, h: 110, d: 70 }, xs: [290, 540, 790], s: 1.05, gap: 150, kickY: 330, tagY: 1380 };
export const VIALS_CAM = { crane: { y: -60 } };

export const Vials: React.FC<Win & { pfizer: Cued; license: Cued; three: Cued; preind: Cued; starna: Cued }> = ({ from, to, pfizer, license, three, preind, starna }) => {
  const ms = useMs();
  const p3 = useP3();
  const z = useZ();
  const ent = useEnt();
  const drop = useDropX();
  const thump = useThump();
  const tP = at(pfizer, 4570, from);
  const tL = at(license, 5870, from, tP + 500);
  const t3 = at(three, 6340, from, tL + 350);
  const tI = at(preind, 7050, from, t3 + 2 * VIALS.gap + 380);
  const tS = at(starna, 9040, from, tI + 600);
  if (ms > to + 320) return null;
  const V = VIALS, T = V.tray;
  const tr = ent(tL, 450);
  const landAll = t3 + 2 * V.gap + 380;
  const trayTh = thump(t3 + 380) * 0.4 + thump(t3 + V.gap + 380) * 0.4 + thump(landAll) * 0.4;
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to + 300) }}>
      {/* lead-in: retires once the vials have landed (F4) */}
      {ms >= tP && ms < landAll + 700 ? (
        <div style={{ ...abs(0, V.kickY), width: 1080, display: "flex", justifyContent: "center", opacity: 1 - clamp01((ms - landAll - 300) / 300) }}>
          <LineDrop text="Pfizer licenses" t={tP} size={92} color={COLORS.paper} />
        </div>
      ) : null}

      {/* the Starna tray: springs in from depth on "license" */}
      {ms >= tL ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `540px ${V.trayY}px`, transform: `${z(lerp(-1400, 0, tr))}scale(1, ${1 - 0.06 * trayTh})` }}>
          <Shadow x={540} y={V.trayY + T.h / 2 + 10} w={820} />
          <Puck x={540} y={V.trayY + T.h / 2} w={T.w} h={T.h} d={T.d} r={T.h / 2} front={G_WHITE} side="#9a9a9a">
            <div style={{ height: 60 }}><Print t={tS}><div style={label(COLORS.ink, 54)}>STARNA</div></Print></div>
          </Puck>
        </div>
      ) : null}

      {/* three vials fall onto the tray one after another on "three" */}
      {V.xs.map((x, i) => {
        const t0 = t3 + i * V.gap;
        const d = drop(t0, 1500, 380);
        if (!d.on) return null;
        return (
          <div key={i} style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${x}px ${V.trayY}px`, transform: `${z(T.d / 2)}translateY(${d.dy}px) scale(${d.sx}, ${d.sy})` }}>
            <Vial x={x} base={V.trayY} name="CAR-T" s={V.s} />
          </div>
        );
      })}
      {V.xs.map((x, i) => <Scatter key={i} x={x} y={V.trayY} t={t3 + i * V.gap + 380} seed={11 + i} n={5} color={COLORS.paper} zz={T.d} />)}

      {/* PRE-IND under the tray */}
      <div style={{ ...abs(0, V.tagY), width: 1080, display: "flex", justifyContent: "center" }}>
        <LineDrop text="PRE-IND" t={tI} size={84} color={COLORS.accent} />
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S3 QUEUE (paper). Settled: the brick row (hero: PAID $330M + 7 grey behind) · UP TO $2.3B / IN MILESTONES plate.
// ══════════════════════════════════════════════════════════════════════════
export const QUEUE = { x: 540, y: 1380, w: 460, h: 260, d: 110, n: 7, dz: 220, dy: 110, stagger: 95, plateY: 280 };
export const QUEUE_CAM = { pull: { z: -220, y: 60 } };

export const Queue: React.FC<Win & { arrive: Cued; row: Cued; plate: Cued }> = ({ from, to, arrive, row, plate }) => {
  const ms = useMs();
  const p3 = useP3();
  const z = useZ();
  const ent = useEnt();
  const drop = useDropX();
  const tA = at(arrive, 10710, from);
  const tR = at(row, 11090, from, tA + 300);
  const tPl = at(plate, 11880, from, tR + 700);
  if (ms > to + 320) return null;
  const Q = QUEUE;
  const a = ent(tA, 450);
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to + 300) }}>
      {/* the plate: the contingent sum, never the upfront */}
      <div style={{ ...abs(0, Q.plateY), width: 1080, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <WType text="UP TO $2.3B" t={tPl} size={124} color={COLORS.ink} />
        <WType text="in milestones" t={tPl + 140} size={64} color="#6b6b6b" />
      </div>

      {/* seven grey bricks rise one by one, each further BEHIND (far ones first so the near ones draw on top) */}
      {Array.from({ length: Q.n }, (_, j) => Q.n - j).map((i) => {
        const t0 = tR + (i - 1) * Q.stagger;
        const d = drop(t0, -900, 380); // negative height = rises from below
        if (!d.on) return null;
        return (
          <div key={i} style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${Q.x}px ${Q.y + Q.h / 2}px`, transform: `${z(-Q.dz * i)}translateY(${d.dy - Q.dy * i}px)` }}>
            <Brick x={Q.x} y={Q.y} w={Q.w} h={Q.h} d={Q.d} grey />
          </div>
        );
      })}

      {/* the paid brick in front: springs in from depth (it is the hook's $330M, marked PAID: K1) */}
      {ms >= tA ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${Q.x}px ${Q.y}px`, transform: `${z(lerp(-1600, 60, a))}` }}>
          <Shadow x={Q.x} y={Q.y + Q.h / 2 + 10} w={440} />
          <Brick x={Q.x} y={Q.y} w={Q.w} h={Q.h} d={Q.d} ink>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <div style={line(104, COLORS.paper)}>$330M</div>
              <div style={label(COLORS.accent, 40)}>PAID</div>
            </div>
          </Brick>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S4 BAG (red). Settled: the CAR-T IV bag on its line (hero) · FOR CANCER (on the bag).
// ══════════════════════════════════════════════════════════════════════════
export const BAG = { hx: 540, hy: 112, len: 360, w: 440, h: 600, d: 90 };
export const BAG_CAM = { push: { z: 140, y: -40 } };

export const Bag: React.FC<Win & { car: Cued; cancer: Cued }> = ({ from, to, car, cancer }) => {
  const ms = useMs();
  const p3 = useP3();
  const z = useZ();
  const sp = useSpringX();
  const tC = at(car, 14300, from);
  const tX = at(cancer, 15160, from, tC + 600);
  if (ms > to + 320) return null;
  const B = BAG;
  const fall = clamp01((ms - tC) / 360);
  const dy = -900 * (1 - fall * fall);
  const sw = ms >= tC + 360 ? sp(tC + 360, 6, 80, 0.9) : 0; //  swings from 22° to rest, one overshoot, stops
  const ang = ms < tC + 360 ? 22 : lerp(22, 0, sw);
  const cy = B.hy + B.len + B.h / 2;
  if (ms < tC) return null;
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to + 300) }}>
      <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${B.hx}px ${B.hy}px`, transform: `${z(30)}translateY(${dy}px) rotate(${ang}deg)` }}>
        <div style={{ ...abs(B.hx - 4, B.hy - 200), width: 8, height: B.len + 200 - 40, background: "#f2f2f2", borderRadius: 4 }} />
        <div style={{ ...p3, position: "absolute", inset: 0 }}>
          {/* hanger tab + the bag + the port at the bottom */}
          <Puck x={B.hx} y={B.hy + B.len - 10} w={120} h={70} d={30} r={30} front={G_WHITE} side="#9c9c9c" />
          <Puck x={B.hx} y={cy + B.h / 2 + 30} w={70} h={80} d={40} r={16} front={G_GREY} side="#5e5e5e" />
          <Puck x={B.hx} y={cy} w={B.w} h={B.h} d={B.d} r="38% 38% 22% 22% / 18% 18% 14% 14%" front={G_WHITE} side="#9c9c9c">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
              <div style={line(132, COLORS.ink)}>CAR-T</div>
              <div style={{ height: 96 }}>
                <Print t={tX}>
                  <div style={{ background: COLORS.ink, borderRadius: 18, padding: "14px 26px" }}><div style={label(COLORS.paper, 54)}>FOR CANCER</div></div>
                </Print>
              </div>
            </div>
          </Puck>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S5 LOOP (ink). Settled: patient + lab flask + the T-cell (hero diagram) · EXPENSIVE · SLOW · BESPOKE · LAB.
// ══════════════════════════════════════════════════════════════════════════
export const LOOP = { px: 540, ptop: 250, ps: 0.9, cellIn: [540, 700] as [number, number], flask: { x: 540, y: 1360, w: 340, h: 400, d: 90 }, costY: 930 };
export const LOOP_CAM = { crane: { y: -90 }, pull: { y: 0, z: -110 } };
const FLASK = "M128 0 H212 V140 L330 352 Q345 400 296 400 H44 Q-5 400 10 352 L128 140 Z";

const Cell: React.FC<{ x: number; y: number; nubs: number; red?: number }> = ({ x, y, nubs, red = 0 }) => (
  <>
    {Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * Math.PI * 2 - Math.PI / 2, rr = 62 * nubs;
      const s = clamp01(nubs);
      return s > 0 ? <div key={i} style={{ ...abs(x + Math.cos(a) * rr - 16 * s, y + Math.sin(a) * rr - 16 * s), width: 32 * s, height: 32 * s, borderRadius: "50%", background: COLORS.accent }} /> : null;
    })}
    <Puck x={x} y={y} w={96} h={96} d={50} r="50%" front={red > 0.5 ? G_RED : G_WHITE} side={red > 0.5 ? "#8f0e15" : "#9c9c9c"} />
  </>
);

export const Loop: React.FC<Win & { remove: Cued; tcells: Cued; engineer: Cued; reinfuse: Cued; exp: Cued; slow: Cued; bespoke: Cued; starna: Cued }> = ({
  from, to, remove, tcells, engineer, reinfuse, exp, slow, bespoke, starna,
}) => {
  const ms = useMs();
  const p3 = useP3();
  const z = useZ();
  const k = useK();
  const ent = useEnt();
  const sp = useSpringX();
  const tR = at(remove, 17100, from);
  const tT = at(tcells, 18900, from, tR + 500);
  const tE = at(engineer, 19540, from, tT + 450);
  const tI = at(reinfuse, 21500, from, tE + 600);
  const tX = at(exp, 22020, from, tI + 450);
  const tW = at(slow, 22900, from, tX + 300);
  const tB = at(bespoke, 23050, from, tW + 150);
  const tS = at(starna, 24450, from, tB + 600);
  if (ms > to + 320) return null;
  const L = LOOP, F = L.flask;
  const pe = ent(tR, 450);
  const fe = ent(tR + 120, 450);
  // the cell: out of the patient down into the flask, then back up (arcs bow to the right, then to the left)
  const inLab: [number, number] = [F.x, F.y - 20]; // upper body, clear of the LAB label below
  const go = EASE_IO(k(tT, 700)), back = EASE_IO(k(tI, 700));
  const arc = (p: number, side: number) => Math.sin(p * Math.PI) * 300 * side;
  let cx = L.cellIn[0], cy = L.cellIn[1];
  if (ms >= tT && ms < tI) { cx = lerp(L.cellIn[0], inLab[0], go) + arc(go, 1); cy = lerp(L.cellIn[1], inLab[1], go); }
  if (ms >= tI) { cx = lerp(inLab[0], L.cellIn[0], back) + arc(back, -1); cy = lerp(inLab[1], L.cellIn[1], back); }
  const nubs = ms >= tE ? sp(tE, 9, 160) : 0;
  // on "Starna's": the lab falls out of the frame and is gone (M7); the costs line goes with it
  const fl = clamp01((ms - tS) / 700);
  const flY = 1400 * fl * fl, flR = 18 * fl;
  const costGone = clamp01((ms - tS) / 300);
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to + 300) }}>
      {/* patient */}
      {ms >= tR ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${L.px}px ${L.ptop + 300}px`, transform: `${z(lerp(-1400, 0, pe))}` }}>
          <Person x={L.px} top={L.ptop} s={L.ps} front={G_WHITE} side="#9c9c9c" />
        </div>
      ) : null}
      {/* lab flask */}
      {ms >= tR + 120 && fl < 1 ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${F.x}px ${F.y}px`, transform: `${z(lerp(-1400, 0, fe))}translateY(${flY}px) rotate(${flR}deg)` }}>
          <Shadow x={F.x} y={F.y + F.h / 2 - 10} w={360} o={1 - fl} />
          <PathSolid id="flask5" x={F.x} y={F.y} w={F.w} h={F.h} d={F.d} path={FLASK} front={["#ffffff", "#e6e6e6", "#bdbdbd"]} side="#8a8a8a">
            <div style={{ ...abs(0, 318), width: F.w, display: "flex", justifyContent: "center" }}><div style={label(COLORS.ink, 46)}>LAB</div></div>
          </PathSolid>
        </div>
      ) : null}
      {/* the T-cell (in front of both) */}
      {ms >= tT - 200 && !(ms >= tS + 700) ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transform: `${z(110)}` }}>
          <Cell x={cx} y={cy} nubs={nubs} />
        </div>
      ) : null}
      {/* the costs: one line, one word per cue */}
      {ms < tS + 300 ? (
        <div style={{ ...abs(0, L.costY), width: 1080, display: "flex", justifyContent: "center", gap: 34, opacity: 1 - costGone,
          transform: `translateY(${600 * costGone * costGone}px)` }}>
          <LineDrop text="Expensive" t={tX} size={72} color={COLORS.paper} />
          <LineDrop text="slow" t={tW} size={72} color={COLORS.paper} />
          <LineDrop text="bespoke" t={tB} size={72} color={COLORS.accent} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S6 IN VIVO (paper). Settled: the patient with red T-cells inside (hero) · IN VIVO plate.
// ══════════════════════════════════════════════════════════════════════════
export const VIVO = { px: 540, ptop: 400, ps: 1.35, cells: [[470, 900], [610, 880], [540, 1010], [450, 1110], [630, 1100]] as [number, number][], target: [540, 990] as [number, number], plateY: 1600 };
export const VIVO_CAM = { push: { z: 170, y: -30 } };

export const InVivo: React.FC<Win & { arriveMs: number; engineer: Cued; tcells: Cued; inside: Cued }> = ({ from, to, arriveMs, engineer, tcells, inside }) => {
  const ms = useMs();
  const p3 = useP3();
  const z = useZ();
  const k = useK();
  const ent = useEnt();
  const sp = useSpringX();
  const tE = at(engineer, 26550, from);
  const tT = at(tcells, 27800, from, tE + 950);
  const tIn = at(inside, 28500, from, tT + 450);
  if (ms > to + 320) return null;
  const V = VIVO;
  const pe = ent(arriveMs, 450);
  // the RNA capsule: from deep z low in the frame, into the patient's chest, shrinking to nothing as it enters (M7)
  const fly = EASE(k(tE, 900));
  const capOn = ms >= tE && fly < 1;
  const cx = lerp(540, V.target[0], fly), cy = lerp(1500, V.target[1], fly);
  const cz = lerp(-2200, 120, fly), cs = fly > 0.8 ? lerp(1, 0, (fly - 0.8) / 0.2) : 1;
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to + 300) }}>
      {ms >= arriveMs ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${V.px}px 900px`, transform: `${z(lerp(-1400, 0, pe))}` }}>
          <Person x={V.px} top={V.ptop} s={V.ps} front={G_INK} side="#111" />
          {/* the T-cells inside: pop in on "T-cells", then turn red one by one on "inside" */}
          {V.cells.map(([x, y], i) => {
            const pop = ms >= tT + i * 70 ? sp(tT + i * 70, 10, 180) : 0;
            const red = clamp01((ms - tIn - i * 110) / 120);
            if (pop <= 0) return null;
            return (
              <div key={i} style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${x}px ${y}px`, transform: `${z(72)}scale(${pop})` }}>
                <Puck x={x} y={y} w={84} h={84} d={40} r="50%" front={interpolateColors(red, [0, 1], ["#f1f1f1", COLORS.accent])} side={red > 0.5 ? "#8f0e15" : "#9c9c9c"} />
              </div>
            );
          })}
        </div>
      ) : null}
      {capOn ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${cx}px ${cy}px`, transform: `${z(cz)}scale(${cs})` }}>
          <Puck x={cx} y={cy} w={230} h={230} d={110} r="50%" front={G_RED} side="#8f0e15">
            <svg width={150} height={60} viewBox="0 0 150 60" style={{ position: "absolute", left: 40, top: 40 }}>
              <path d="M5 30 C 25 5, 45 55, 65 30 S 105 5, 125 30 S 145 50, 148 40" fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" />
            </svg>
            <div style={{ ...label(COLORS.paper, 46), marginTop: 70 }}>RNA</div>
          </Puck>
        </div>
      ) : null}
      <Scatter x={V.target[0]} y={V.target[1]} t={tE + 900} seed={21} n={6} color={COLORS.accent} zz={120} />
    </AbsoluteFill>
  );
};
