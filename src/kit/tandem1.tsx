// ─────────────────────────────────────────────────────────────────────────
// KIT · tandem1 — Tandem Mobi tubeless SHORT (9:16), chunk 1, 2026-11-18. House style 11-16 (MOTION-RULES §0).
//  §1  "7 days" → a round dial: "7" drops in letter-kinetic, 7 segments fill red on "days".
//      "clock" → a white hand sweeps once. "Tandem's" → the pump falls in trailing a tube.
//      "tubeless" → the tube snaps off and falls away. "Mobi" → the dial docks onto the pump as its badge.
//      "cleared" → an FDA tag swings in on a string from the chrome and stops.
//  §2  Omnipod's pod + 3 beads vs Tandem's pump + 7 red beads shooting out on "doubled".
//  §3  The catch: the glass insulin cartridge springs out of the pump and is swapped ("every 3 days").
//  §4  US launch calendar: pages flip away, 2027 lands on "first half".
// Canvas 1080×1920; chrome band 0–112; key text above y 1632. On-screen limits: script.md header.
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill, interpolateColors } from "remotion";
import { clamp01, COLORS, INK_SUB, useMs } from "./core";
import { useP3, useZ } from "./camera";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { EASE, EASE_IO, fadeOut } from "./plusone";
import { label, line } from "./inovio";
import { Print } from "./ryb1b";
import { KType, Scatter, useDropX, useEnt, useSpringX } from "./v2style";
import { G_INK, G_WHITE, Puck } from "./argenx1v2b";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });
export const G_RED = `linear-gradient(155deg, #ff6a71 0%, ${COLORS.accent} 55%, #a3121b 100%)`;
const useThump = () => {
  const ms = useMs();
  const sp = useSpringX();
  return (t: number) => (ms >= t ? 1 - sp(t, 6, 210, 0.6) : 0);
};

/** the Mobi pump: a small rounded ink body with a port on its underside */
const Pump: React.FC<{ x: number; y: number; w: number; h: number; d: number; name?: boolean; children?: React.ReactNode }> = ({ x, y, w, h, d, name = true, children }) => (
  <>
    <Puck x={x} y={y + h / 2 + 8} w={70} h={34} d={d * 0.6} r={12} front="linear-gradient(155deg,#8a8a8a,#3a3a3a)" side="#1a1a1a" />
    <Puck x={x} y={y} w={w} h={h} d={d} r={Math.min(w, h) * 0.24} front={G_INK} side="#101010">
      {name ? <div style={{ ...label(COLORS.paper, Math.round(h * 0.15)), position: "absolute", left: w * 0.08, top: h * 0.12 }}>TANDEM MOBI</div> : null}
      {children}
    </Puck>
  </>
);

/** a 7- (or n-) segment ring for the dial face; `lit(i)` 0..1 per segment */
const Segments: React.FC<{ r: number; n: number; lit: (i: number) => number; color: string; base: string }> = ({ r, n, lit, color, base }) => {
  const R = r, rIn = r * 0.78, gap = 0.06;
  const arc = (a0: number, a1: number) => {
    const p = (a: number, rr: number) => `${(R + Math.cos(a) * rr).toFixed(1)},${(R + Math.sin(a) * rr).toFixed(1)}`;
    return `M${p(a0, R)} A${R},${R} 0 0 1 ${p(a1, R)} L${p(a1, rIn)} A${rIn},${rIn} 0 0 0 ${p(a0, rIn)} Z`;
  };
  return (
    <svg width={R * 2} height={R * 2} style={{ position: "absolute", left: 0, top: 0 }}>
      {Array.from({ length: n }, (_, i) => {
        const a0 = -Math.PI / 2 + (i / n) * Math.PI * 2 + gap, a1 = -Math.PI / 2 + ((i + 1) / n) * Math.PI * 2 - gap;
        return (
          <g key={i}>
            <path d={arc(a0, a1)} fill={base} />
            <path d={arc(a0, a1)} fill={color} opacity={lit(i)} />
          </g>
        );
      })}
    </svg>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// §1 HOOK (red)
// Settled (end): the pump with its 7-day badge (hero) · TANDEM MOBI · the FDA tag.
// ══════════════════════════════════════════════════════════════════════════
export const HOOK = { dial: { x: 540, y: 720, r: 290, d: 70 }, pump: { x: 540, y: 1350, w: 560, h: 300, d: 130 }, badge: { dx: 172, s: 0.31 },
  tag: { hx: 540, hy: 360, len: 330, w: 460, h: 190 } };
export const HOOK_CAM = { push1: { z: 110 }, crane: { y: -130, z: 0 }, push2: { z: 160 } };
const PUMP_FALL = 380;

export const Hook: React.FC<Win & { seven: Cued; days: Cued; clock: Cued; pumpMs: number; tubeless: Cued; dock: Cued; cleared: Cued }> = ({
  from, to, seven, days, clock, pumpMs, tubeless, dock, cleared,
}) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const drop = useDropX();
  const thump = useThump();
  const t7 = at(seven, 190, from);
  const tD = at(days, 1000, from, t7 + 300);
  const tC = at(clock, 2230, from, tD + 600);
  const tT = at(tubeless, 3480, from, pumpMs + 400);
  const tK = at(dock, 3960, from, tT + 300);
  const tF = at(cleared, 5900, from, tK + 900);
  if (ms > to + 320) return null;
  const H = HOOK, D = H.dial, P = H.pump;

  // the dial: springs in from depth just ahead of "7"; docks onto the pump on "Mobi"
  const arr = ent(t7 - 120, 450);
  const dk = sp(tK, 12, 120);
  const bx = P.x + H.badge.dx, by = P.y;
  const dX = lerp(D.x, bx, dk), dY = lerp(D.y, by, dk), dS = lerp(1, H.badge.s, dk);
  const lit = (i: number) => clamp01((ms - tD - i * 70) / 120);
  const hand = EASE_IO(k(tC, 700)) * 360;
  const docked = dk > 0.98;

  // the pump falls in trailing its tube
  const pd = drop(pumpMs - PUMP_FALL, 1100, PUMP_FALL);
  const pS = thump(tK + 260) * 0.6; //       the pump gives a little under the badge's landing
  // the tube snaps off at the port and falls away (gone once it leaves the frame, M7)
  const tb = clamp01((ms - tT) / 600);
  const tubeY = 1700 * tb * tb, tubeR = 40 * tb, tubeX = 120 * tb;
  const portY = P.y + P.h / 2 + 24;

  // the FDA tag: swings in on its string from the left, overshoots once and stops
  const sw = ms >= tF ? sp(tF, 7, 90, 0.9) : 0;
  const ang = lerp(-95, 0, sw);
  const T = H.tag;

  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to + 300) }}>
      {/* contact shadow under the pump */}
      {pd.on ? <div style={{ ...abs(P.x - 300, P.y + P.h / 2 + 30), width: 600, height: 44, borderRadius: "50%", background: "rgba(0,0,0,0.22)", filter: "blur(12px)",
        opacity: clamp01(1 + pd.dy / 1100) }} /> : null}

      {/* the tube: from the port out to the right edge of frame; snaps off on "tubeless" */}
      {pd.on && tb < 1 ? (
        <svg width={1080} height={1920} style={{ ...abs(0, 0), transformOrigin: `${P.x}px ${portY}px`, transform: `${z(10)}translate(${tubeX}px, ${pd.dy + tubeY}px) rotate(${tubeR}deg)` }}>
          <path d={`M${P.x} ${portY} C ${P.x} ${portY + 160}, ${P.x + 260} ${portY + 40}, ${P.x + 330} ${portY + 160} S ${P.x + 420} ${portY + 330}, 1120 ${portY + 250}`}
            fill="none" stroke="#e9e9e9" strokeWidth={18} strokeLinecap="round" />
        </svg>
      ) : null}
      <Scatter x={P.x} y={portY} t={tT} seed={3} n={6} color={COLORS.paper} zz={P.d / 2} />

      {/* the pump */}
      {pd.on ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${P.x}px ${P.y + P.h / 2}px`,
          transform: `translateY(${pd.dy}px) scale(${pd.sx * (1 + 0.05 * pS)}, ${pd.sy * (1 - 0.07 * pS)})` }}>
          <Pump x={P.x} y={P.y} w={P.w} h={P.h} d={P.d} />
        </div>
      ) : null}
      <Scatter x={P.x} y={P.y + P.h / 2} t={pumpMs} seed={5} n={7} color="#ffb3b7" zz={P.d / 2} />

      {/* the dial (becomes the pump's 7-day badge) */}
      {ms >= t7 - 120 ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${D.x}px ${D.y}px`,
          transform: `${z(lerp(-1600, 0, arr) + (docked ? P.d / 2 + 6 : lerp(0, P.d / 2 + 6, dk)))}translate(${dX - D.x}px, ${dY - D.y}px) scale(${dS})` }}>
          <Puck x={D.x} y={D.y} w={D.r * 2} h={D.r * 2} d={D.d} r="50%" front={G_WHITE} side="#a9a9a9">
            <div style={{ position: "absolute", inset: 0 }}>
              <Segments r={D.r} n={7} lit={lit} color={interpolateColors(clamp01(dk), [0, 1], ["#141414", COLORS.accent])} base="#e4e4e4" />{/* black on the red world, red once docked on the pump (Nel 11-18) */}
              {/* the clock hand: one sweep on "clock", then still */}
              {ms >= tC ? (
                <div style={{ ...abs(D.r - 7, D.r * 0.2), width: 14, height: D.r * 0.8, borderRadius: 7, background: COLORS.accent,
                  transformOrigin: "50% 100%", transform: `rotate(${hand}deg)`, opacity: hand >= 359.9 ? 0 : 1 }} />
              ) : null}
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: -10 }}>
              <KType text="7" t={t7} size={260} color={COLORS.ink} />
              <div style={{ height: 56, marginTop: -16 }}><Print t={tD}><div style={label(COLORS.ink, 52)}>DAYS</div></Print></div>
            </div>
          </Puck>
        </div>
      ) : null}

      {/* the FDA tag on its string, hinged at the chrome */}
      {ms >= tF ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${T.hx}px ${T.hy}px`, transform: `${z(40)}rotate(${ang}deg)` }}>
          <div style={{ ...abs(T.hx - 4, T.hy - 400), width: 8, height: T.len + 400, background: "#f2f2f2", borderRadius: 4 }} />
          <div style={{ ...p3, position: "absolute", inset: 0 }}>
            <Puck x={T.hx} y={T.hy + T.len + T.h / 2} w={T.w} h={T.h} d={36} r={36} front={G_WHITE} side="#9c9c9c">
              <div style={{ ...abs(T.w / 2 - 18, 18), width: 36, height: 36, borderRadius: "50%", background: "#8a8a8a" }} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginTop: 34 }}>
                <div style={line(64, COLORS.ink)}>FDA cleared</div>
                <div style={label("#6b6b6b", 34)}>510(k) · Nov 12</div>
              </div>
            </Puck>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// §2 OMNIPOD vs TANDEM (ink)
//  "Omnipod" → the white pod falls in (row 1). "incumbent" → INSULET prints on it.
//  "3" → 3 white beads cascade beside it, "3 days" riding the last. "Tandem" → the pump springs in (row 2), camera cranes.
//  "doubled" → 7 RED beads shoot out of the pump one after another; "Infusion set · up to 7 days" rides the last.
// Settled: the two rows (hero) · "3 days" · "Infusion set · up to 7 days".
// ══════════════════════════════════════════════════════════════════════════
// Nel 11-18: "make these center" → each row stacks centred: the device, its beads under it, then the label.
export const VS = { r1: 680, r2: 1180, beadDy: 200, bead: { w: 86, gap: 14 }, pod: { w: 300, h: 180 }, pump: { w: 320, h: 180 } };
export const VS_CAM = { crane: { y: -110 } };

const Bead: React.FC<{ x: number; y: number; red?: boolean }> = ({ x, y, red }) => (
  <Puck x={x} y={y} w={VS.bead.w} h={VS.bead.w} d={44} r="50%" front={red ? G_RED : G_WHITE} side={red ? "#8f0e15" : "#9c9c9c"} />
);

export const Versus: React.FC<Win & { pod: Cued; incumbent: Cued; three: Cued; tandem: Cued; doubled: Cued }> = ({ from, to, pod, incumbent, three, tandem, doubled }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const drop = useDropX();
  const tP = at(pod, 7560, from);
  const tI = at(incumbent, 8970, from, tP + 500);
  const t3 = at(three, 11150, from, tI + 500);
  const tT = at(tandem, 11950, from, t3 + 400);
  const tD = at(doubled, 12890, from, tT + 500);
  if (ms > to + 320) return null;
  const V = VS, B = V.bead, X = 540;
  /** centre x of bead i in a centred row of n */
  const bx = (i: number, n: number) => X - (n * (B.w + B.gap) - B.gap) / 2 + B.w / 2 + i * (B.w + B.gap);
  const y1 = V.r1 + V.beadDy, y2 = V.r2 + V.beadDy;
  const pd = drop(tP - 380, 1000, 380);
  const pm = ms >= tT ? sp(tT, 10, 150) : 0;
  const tLast3 = t3 + 2 * 110 + 300;
  const tLast7 = tD + 6 * 70 + 300;
  const caption = (y: number, t: number, text: string, color: string) => (
    <div style={{ ...abs(0, y), width: 1080, display: "flex", justifyContent: "center", transform: z(30) || undefined }}>
      <Print t={t}><div style={label(color, 48)}>{text}</div></Print>
    </div>
  );
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to) }}>
      {/* row 1 — Omnipod 5 */}
      {pd.on ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${X}px ${V.r1 + V.pod.h / 2}px`, transform: `translateY(${pd.dy}px) scale(${pd.sx}, ${pd.sy})` }}>
          <Puck x={X} y={V.r1} w={V.pod.w} h={V.pod.h} d={110} r="50%" front={G_WHITE} side="#a2a2a2">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={label(COLORS.ink, 44)}>Omnipod 5</div>
              <div style={{ height: 30 }}><Print t={tI}><div style={label("#6b6b6b", 28)}>INSULET</div></Print></div>
            </div>
          </Puck>
        </div>
      ) : null}
      {/* 3 white beads shoot out of the pod's underside into a centred row (the same grammar as row 2) */}
      {[0, 1, 2].map((i) => {
        const t = t3 + i * 110;
        if (ms < t) return null;
        const s = sp(t, 9, 170);
        const tx = bx(i, 3), y = lerp(V.r1 + V.pod.h / 2, y1, Math.min(1, s));
        return (
          <div key={i} style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${tx}px ${y1}px`, transform: `translate(${lerp(X, tx, s) - tx}px, ${y - y1}px) scale(${lerp(0.3, 1, Math.min(1, s))})` }}>
            <Bead x={tx} y={y1} />
          </div>
        );
      })}
      {caption(y1 + 66, tLast3, "3 days", INK_SUB)}

      {/* row 2 — Tandem Mobi */}
      {ms >= tT ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${X}px ${V.r2}px`, transform: `${z(lerp(-1400, 0, pm))}scale(${lerp(0.4, 1, Math.min(1.08, pm))})` }}>
          <Pump x={X} y={V.r2} w={V.pump.w} h={V.pump.h} d={100} name={false}>
            <div style={label(COLORS.paper, 40)}>Tandem Mobi</div>
          </Pump>
        </div>
      ) : null}
      {/* 7 red beads shoot out of the pump's underside and fan into a centred row */}
      {Array.from({ length: 7 }, (_, i) => {
        const t = tD + i * 70;
        if (ms < t) return null;
        const s = sp(t, 9, 170);
        const tx = bx(i, 7), sx = X, sy = V.r2 + V.pump.h / 2;
        const x = lerp(sx, tx, s), y = lerp(sy, y2, Math.min(1, s));
        return (
          <div key={i} style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${tx}px ${y2}px`, transform: `translate(${x - tx}px, ${y - y2}px) scale(${lerp(0.3, 1, Math.min(1, s))})` }}>
            <Bead x={tx} y={y2} red />
          </div>
        );
      })}
      {caption(y2 + 66, tLast7, "Infusion set · up to 7 days", COLORS.paper)}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// §3 THE CATCH (paper)
//  Rebuilt 2026-11-18 on Nel's note ("what is that red pill for?"): the cartridge is now a glass insulin vial. See Catch.
// ══════════════════════════════════════════════════════════════════════════
export const CATCH = { x: 640, y: 1120, w: 520, h: 360, d: 150, vial: { w: 420, h: 130, seatL: 140, label: 190 } };
export const CATCH_CAM = { push: { z: 170, y: -40 } };
const G_GLASS = "linear-gradient(170deg, #ffffff 0%, #eef0f1 45%, #c3c7ca 100%)";

/** the insulin cartridge: a glass vial lying on its side. Left: ink cap + white label; right: glass with red insulin
 *  between a grey plunger and the needle end. `fill` 0..1 = how much is left. Drawn with its left edge at `l`. */
const Vial: React.FC<{ l: number; y: number; fill: number }> = ({ l, y, fill }) => {
  const V = CATCH.vial, glassW = V.w - V.label;
  const liq = glassW * fill;
  return (
    <Puck x={l + V.w / 2} y={y} w={V.w} h={V.h} d={70} r={V.h / 2} front={G_GLASS} side="#9da3a7" clip>
      <div style={{ ...abs(V.w - liq - 10, 14), width: liq, height: V.h - 28, borderRadius: "0 50px 50px 0", background: G_RED }} />
      <div style={{ ...abs(V.w - liq - 34, 8), width: 30, height: V.h - 16, borderRadius: 10, background: "linear-gradient(90deg,#6a6a6a,#2c2c2c)" }} />
      <div style={{ ...abs(0, 0), width: V.label, height: V.h, background: "linear-gradient(170deg,#ffffff,#e9e9e9)", borderRight: "4px solid #d0d0d0",
        display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 30, boxSizing: "border-box" }}>
        <div style={{ ...label(COLORS.ink, 30), lineHeight: 1.05 }}>Insulin</div>
        <div style={{ ...label(COLORS.ink, 30), lineHeight: 1.05 }}>cartridge</div>
      </div>
      <div style={{ ...abs(0, 0), width: 22, height: V.h, background: "linear-gradient(90deg,#4a4a4a,#1a1a1a)" }} />
    </Puck>
  );
};

// "catch" → the pump falls onto the card. "cartridge" → the glass insulin cartridge springs up out of the pump's end,
// nearly empty. "still" → it tumbles away out of the card; a full one flies in from the left and slides home into the
// pump (thump; camera pushes in). "Every 3 days" prints as it clicks in.
// Settled: the pump with its new cartridge (hero) · the cartridge's own label · "Every 3 days".
export const Catch: React.FC<Win & { catchW: Cued; cartridge: Cued; swap: Cued }> = ({ from, to, catchW, cartridge, swap }) => {
  const ms = useMs();
  const k = useK();
  const p3 = useP3();
  const z = useZ();
  const sp = useSpringX();
  const drop = useDropX();
  const thump = useThump();
  const tC = at(catchW, 15110, from);
  const tK = at(cartridge, 16040, from, tC + 500);
  const tS = at(swap, 16620, from, tK + 400);
  if (ms > to + 320) return null;
  const C = CATCH, V = C.vial;
  const top = C.y - C.h / 2;
  const seatY = C.y - 50;
  const popL = C.x - V.w / 2 - 40, popY = top - V.h / 2 - 50;
  const pd = drop(tC - 380, 1300, 380);
  const pop = ms >= tK ? sp(tK, 9, 150) : 0; //          seated → up out of the pump
  const old = clamp01((ms - tS) / 750); //               then tumbles away down-left, out of the card
  const oL = lerp(V.seatL, popL, pop) - 700 * old;
  const oY = lerp(seatY, popY, pop) - 220 * old + 1500 * old * old;
  const tN = tS + 250, NEW_IN = 520;
  const ni = EASE(k(tN, NEW_IN));
  const nL = lerp(-V.w - 60, V.seatL, ni);
  const seated = tN + NEW_IN;
  const s2 = thump(seated);
  const behind = z(-12) || undefined; //                 behind the pump's front face: the pump hides the inserted end
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to) }}>
      <div style={{ ...abs(C.x - 300, C.y + C.h / 2 - 4), width: 600, height: 46, borderRadius: "50%", background: "rgba(0,0,0,0.16)", filter: "blur(12px)", opacity: pd.on ? 1 : 0 }} />
      {pd.on && old < 1 ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transform: `${pop > 0.5 ? z(40) ?? "" : behind ?? ""} translateY(${pd.dy}px)` }}>
          <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${oL + V.w / 2}px ${oY}px`, transform: `rotate(${-190 * EASE(old)}deg)` }}>
            <Vial l={oL} y={oY} fill={0.12} />
          </div>
        </div>
      ) : null}
      {ms >= tN ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transform: behind }}>
          <Vial l={nL} y={seatY} fill={0.9} />
        </div>
      ) : null}
      {pd.on ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${C.x}px ${C.y + C.h / 2}px`,
          transform: `translateY(${pd.dy}px) scale(${pd.sx * (1 + 0.04 * s2)}, ${pd.sy * (1 - 0.06 * s2)})` }}>
          <Pump x={C.x} y={C.y} w={C.w} h={C.h} d={C.d} />
        </div>
      ) : null}
      <Scatter x={C.x} y={C.y + C.h / 2} t={tC} seed={7} n={8} color="#9a9a9a" zz={C.d / 2} />
      <Scatter x={V.seatL} y={seatY} t={seated} seed={9} n={6} color="#9a9a9a" zz={10} />

      {/* the "every 3 days" plate */}
      <div style={{ ...abs(0, C.y + C.h / 2 + 90), width: 1080, display: "flex", justifyContent: "center", transform: z(60) || undefined }}>
        <Print t={seated}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {[0, 1, 2].map((i) => <div key={i} style={{ width: 40, height: 40, borderRadius: "50%", background: COLORS.ink }} />)}
            <div style={{ ...line(58, COLORS.ink), marginLeft: 12 }}>Every 3 days</div>
          </div>
        </Print>
      </div>
    </AbsoluteFill>
  );
};


// ══════════════════════════════════════════════════════════════════════════
// §4 THE US LAUNCH (red)
//  "US" → the launch calendar springs in from depth (NOV 2026 on its page).
//  "waits" → the NOV page flips up and away; "until" → DEC flips away (camera cranes with the pages).
//  "first half" → "2027" drops in letter by letter, "FIRST HALF" printing above it.
// Settled: the 2027 page (hero) · US LAUNCH header · FIRST HALF.
// ══════════════════════════════════════════════════════════════════════════
export const CAL = { x: 540, y: 1000, w: 700, h: 760, d: 90, head: 150 };
export const CAL_CAM = { crane: { y: 70 } };

export const Launch: React.FC<Win & { us: Cued; waits: Cued; until: Cued; half: Cued }> = ({ from, to, us, waits, until, half }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const tU = at(us, 18670, from);
  const tW = at(waits, 19190, from, tU + 350);
  const tN = at(until, 19510, from, tW + 250);
  const tH = at(half, 20020, from, tN + 350);
  if (ms > to + 320) return null;
  const C = CAL;
  const left = C.x - C.w / 2, top = C.y - C.h / 2;
  const pageTop = top + C.head;
  const pageH = C.h - C.head;
  const arr = ent(tU - 150, 450);
  const page = (txt: [string, string], t: number, i: number) => {
    const f = EASE_IO(k(t, 520));
    if (f >= 1) return null;
    return (
      <div key={i} style={{ ...abs(left + 24, pageTop), width: C.w - 48, height: pageH - 24, transformOrigin: "50% 0%",
        transform: `translateZ(${C.d / 2 + 6 + (2 - i) * 4}px) rotateX(${185 * f}deg)`, backfaceVisibility: "hidden",
        background: "linear-gradient(170deg,#ffffff 0%,#f3f3f3 60%,#dcdcdc 100%)", borderRadius: "0 0 40px 40px",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: "0 4px 0 #d0d0d0" }}>
        <div style={label("#6b6b6b", 52)}>{txt[0]}</div>
        <div style={line(190, COLORS.ink)}>{txt[1]}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to) }}>
      {ms >= tU - 150 ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${C.x}px ${C.y}px`, transform: `${z(lerp(-1800, 0, arr))}` }}>
          {/* the calendar body: header + base page */}
          <Puck x={C.x} y={C.y} w={C.w} h={C.h} d={C.d} r={48} front={G_WHITE} side="#9c9c9c">
            <div style={{ ...abs(0, 0), width: C.w, height: C.head, background: G_INK, borderRadius: "48px 48px 0 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={label(COLORS.paper, 54)}>US LAUNCH</div>
            </div>
            <div style={{ ...abs(0, C.head), width: C.w, height: pageH, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <div style={{ height: 62 }}><Print t={tH}><div style={label(COLORS.accent, 56)}>FIRST HALF</div></Print></div>
              <KType text="2027" t={tH} size={230} color={COLORS.ink} />
            </div>
          </Puck>
          {/* binder rings */}
          {[-180, 0, 180].map((dx) => (
            <Puck key={dx} x={C.x + dx} y={top + 6} w={40} h={90} d={30} r={20} front="linear-gradient(155deg,#e0e0e0,#8a8a8a)" side="#555" style={{ transform: `translateZ(${C.d / 2 + 12}px)` }} />
          ))}
          {/* the pages that flip away */}
          <div style={{ ...p3, position: "absolute", inset: 0 }}>
            {page(["DECEMBER", "2026"], tN, 1)}
            {page(["NOVEMBER", "2026"], tW, 2)}
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
