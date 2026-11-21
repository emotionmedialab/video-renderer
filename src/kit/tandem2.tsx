// ─────────────────────────────────────────────────────────────────────────
// KIT · tandem2 — Tandem Mobi tubeless SHORT (9:16), chunk 2, 2026-11-18. House style 11-16 (MOTION-RULES §0).
//  §5  Pharmacy-only: a road map with depth; the switch blade sends the MOBI parcel to the pharmacy; the DME warehouse tips over.
//  §5b The signpost: "Reimbursement path" and "Scale mechanics" boards each spin round to point the other way.
//  §6  One interval doubled, one channel reset: two plates; DOUBLED slams on one, the other flips and RESET prints.
//  §6b The open question: a red share coin hops Omnipod → Mobi and back; the pod steps forward; a big "?" drops.
// Canvas 1080×1920; chrome band 0–112; key text above y 1632. On-screen limits: script.md header
// ("takes share" is an open question: the coin never settles on Tandem).
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, COLORS, useMs } from "./core";
import { useP3, useZ } from "./camera";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { EASE, EASE_IO, fadeOut } from "./plusone";
import { label, line } from "./inovio";
import { Print } from "./ryb1b";
import { KType, Scatter, useDropX, useEnt, useSpringX } from "./v2style";
import { G_GREY, G_INK, G_WHITE, Puck } from "./argenx1v2b";
import { G_RED } from "./tandem1";
import { PathSolid } from "./pfb1v2";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });
const useThump = () => {
  const ms = useMs();
  const sp = useSpringX();
  return (t: number) => (ms >= t ? 1 - sp(t, 6, 210, 0.6) : 0);
};

// ══════════════════════════════════════════════════════════════════════════
// §5 PHARMACY-ONLY (ink) — rebuilt 2026-11-18 on Nel's note ("improve the visual presentation"): a map with depth.
//  The road runs AWAY from the viewer: the parcel sits near (bottom), the fork is mid-frame, the two buildings stand at
//  the far ends (top). Roads taper with distance; the parcel shrinks as it travels.
//  pin → the road, the DME warehouse and the switch blade (set left) spring in from depth.
//  "market" → the MOBI parcel drops onto the near end of the road.
//  "pharmacy-only" → the pharmacy drops in at the right-hand end.
//  "reroutes" → the switch blade swings from the left branch to the right; the parcel travels up the road and along the
//          right branch to the pharmacy door, shrinking with distance; the camera pushes in with it.
//  "away from" → the DME warehouse tips over backwards and its branch retracts into the fork (gone, M7).
// Settled: the parcel at the pharmacy door (hero) · the pharmacy's sign · MOBI on the parcel.
// ══════════════════════════════════════════════════════════════════════════
type Pt = [number, number];
export const ROUTE = { start: [540, 1550] as Pt, fork: [540, 1110] as Pt, left: [300, 835] as Pt, right: [780, 835] as Pt,
  bld: { w: 340, h: 290, d: 110 }, parcel: { w: 230, h: 180, d: 130 }, wNear: 150, wFork: 104, wFar: 70 };
export const ROUTE_CAM = { push: { x: -60, y: 60, z: 170 } };
const TRAVEL = 900;
const WAREHOUSE = "M0 110 L170 0 L340 110 V290 H0 Z";
const SHOP = "M0 36 H340 V290 H0 Z";

/** a tapered road segment lying on the floor, from a (width wa) to b (width wb) */
const Road: React.FC<{ a: Pt; b: Pt; wa: number; wb: number; len?: number }> = ({ a, b, wa, wb, len = 1 }) => {
  const bx = a[0] + (b[0] - a[0]) * len, by = a[1] + (b[1] - a[1]) * len, wbb = wa + (wb - wa) * len;
  const dx = bx - a[0], dy = by - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  const P = (x: number, y: number, w: number, s: number) => `${(x + nx * (w / 2) * s).toFixed(1)},${(y + ny * (w / 2) * s).toFixed(1)}`;
  const poly = `${P(a[0], a[1], wa, 1)} ${P(bx, by, wbb, 1)} ${P(bx, by, wbb, -1)} ${P(a[0], a[1], wa, -1)}`;
  return (
    <g>
      <polygon points={poly} fill="#262626" stroke="#4d4d4d" strokeWidth={5} strokeLinejoin="round" />
      <line x1={a[0]} y1={a[1]} x2={bx} y2={by} stroke="#6a6a6a" strokeWidth={4} strokeLinecap="round" />
    </g>
  );
};

export const Route: React.FC<Win & { arriveMs: number; market: Cued; pharmacy: Cued; reroutes: Cued; away: Cued }> = ({ from, to, arriveMs, market, pharmacy, reroutes, away }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const drop = useDropX();
  const thump = useThump();
  const tM = at(market, 22920, from, arriveMs + 300);
  const tP = at(pharmacy, 23390, from, tM + 400);
  const tR = at(reroutes, 24810, from, tP + 600);
  const tA = at(away, 25870, from, tR + 150 + TRAVEL);
  if (ms > to + 320) return null;
  const R = ROUTE, Bd = R.bld, Pc = R.parcel;
  const [fx, fy] = R.fork;
  const arr = ent(arriveMs, 450);
  const pd = drop(tM - 300, 900, 300);
  const ph = drop(tP - 300, 1100, 300);
  // the switch blade: points at the left branch, swings to the right one on "reroutes"
  const angL = (Math.atan2(R.left[1] - fy, R.left[0] - fx) * 180) / Math.PI + 90;
  const angR = (Math.atan2(R.right[1] - fy, R.right[0] - fx) * 180) / Math.PI + 90;
  const bl = ms >= tR ? sp(tR, 9, 220) : 0;
  const bladeAng = lerp(angL, angR, bl);
  // the parcel: up the trunk to the fork (first 40%), then along the right branch to the pharmacy door; shrinks with distance
  const tGo = tR + 150;
  const s = EASE_IO(k(tGo, TRAVEL));
  const px = s < 0.4 ? R.start[0] : lerp(fx, R.right[0], (s - 0.4) / 0.6);
  const py = s < 0.4 ? lerp(R.start[1], fy, s / 0.4) : lerp(fy, R.right[1], (s - 0.4) / 0.6);
  const pScale = lerp(1, 0.66, s);
  const arrive = tGo + TRAVEL;
  const pharmThump = thump(arrive);
  // the DME warehouse tips over backwards; its branch retracts into the fork, riding the fall
  const tip = EASE_IO(k(tA, 650));
  const retract = 1 - EASE(k(tA + 300, 450));
  const dmeGone = tip >= 1 && retract <= 0;
  const bldBase = (p: Pt) => p[1] - 15; //            the building's door sits on the road's far end
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to) }}>
      {ms >= arriveMs ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${fx}px ${fy}px`, transform: `${z(lerp(-1600, 0, arr))}` }}>
          {/* roads (on the floor) */}
          <svg width={1080} height={1920} style={abs(0, 0)}>
            <Road a={R.start} b={R.fork} wa={R.wNear} wb={R.wFork} />
            <Road a={R.fork} b={R.right} wa={R.wFork} wb={R.wFar} />
            {retract > 0 ? <Road a={R.fork} b={R.left} wa={R.wFork} wb={R.wFar} len={retract} /> : null}
            <circle cx={fx} cy={fy} r={R.wFork / 2 + 2} fill="#262626" stroke="#4d4d4d" strokeWidth={5} />
          </svg>
          {/* the switch blade at the fork */}
          <div style={{ ...abs(fx - 15, fy - 170), width: 30, height: 170, borderRadius: 15, background: "linear-gradient(90deg,#ffffff,#bdbdbd)",
            transformOrigin: "50% 100%", transform: `${z(20)}rotate(${bladeAng}deg)`, boxShadow: "0 0 0 4px #111" }} />
          <div style={{ ...abs(fx - 24, fy - 24), width: 48, height: 48, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#ffffff,#9a9a9a)", transform: z(22) || undefined }} />

          {/* the DME warehouse (the old channel): gabled roof, roller door */}
          {!dmeGone && tip < 1 ? (
            <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${R.left[0]}px ${bldBase(R.left)}px`, transform: `${z(10)}rotateX(${92 * tip}deg)` }}>
              <PathSolid id="tmDme" x={R.left[0]} y={bldBase(R.left) - Bd.h / 2} w={Bd.w} h={Bd.h} d={Bd.d} path={WAREHOUSE} front={["#d9d9d9", "#a9a9a9", "#7d7d7d"]} side="#4a4a4a">
                <div style={{ ...abs(0, 112), width: Bd.w, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <div style={line(66, COLORS.ink)}>DME</div>
                  <div style={label("#2a2a2a", 24)}>Durable equipment</div>
                </div>
                <div style={{ ...abs(Bd.w / 2 - 80, Bd.h - 76), width: 160, height: 76, borderRadius: "10px 10px 0 0", overflow: "hidden",
                  background: "repeating-linear-gradient(180deg,#5c5c5c 0px,#5c5c5c 10px,#474747 10px,#474747 14px)" }} />
              </PathSolid>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* the pharmacy (the new channel): sign band, glass door, red Rx on the roof (the scene's one red) */}
      {ph.on ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${R.right[0]}px ${bldBase(R.right)}px`,
          transform: `${z(10)}translateY(${ph.dy}px) scale(${ph.sx * (1 + 0.04 * pharmThump)}, ${ph.sy * (1 - 0.06 * pharmThump)})` }}>
          <PathSolid id="tmShop" x={R.right[0]} y={bldBase(R.right) - Bd.h / 2} w={Bd.w} h={Bd.h} d={Bd.d} path={SHOP} front={["#ffffff", "#efefef", "#c9c9c9"]} side="#8f8f8f">
            <div style={{ ...abs(18, 60), width: Bd.w - 36, height: 70, borderRadius: 14, background: "#161616", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={line(46, COLORS.paper)}>Pharmacy</div>
            </div>
            <div style={{ ...abs(Bd.w / 2 - 62, Bd.h - 130), width: 124, height: 130, borderRadius: "14px 14px 0 0", background: "linear-gradient(160deg,#4a4a4a,#1c1c1c)" }}>
              <div style={{ ...abs(92, 60), width: 10, height: 26, borderRadius: 5, background: "#d0d0d0" }} />
            </div>
            {[24, Bd.w - 24 - 80].map((x) => (
              <div key={x} style={{ ...abs(x, Bd.h - 120), width: 80, height: 70, borderRadius: 10, background: "linear-gradient(160deg,#8a8a8a,#3a3a3a)" }} />
            ))}
          </PathSolid>
          <Puck x={R.right[0]} y={bldBase(R.right) - Bd.h - 30} w={120} h={90} d={40} r={22} front={G_RED} side="#8f0e15" style={{ transform: `translateZ(${Bd.d / 2}px)` }}>
            <div style={label(COLORS.paper, 46)}>Rx</div>
          </Puck>
        </div>
      ) : null}
      <Scatter x={R.right[0]} y={bldBase(R.right)} t={tP} seed={12} n={7} color="#bdbdbd" zz={Bd.d / 2} />

      {/* the MOBI parcel */}
      {pd.on ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${R.start[0]}px ${R.start[1]}px`,
          transform: `${z(70)}translate(${px - R.start[0]}px, ${py - R.start[1] + pd.dy}px) scale(${pd.sx * pScale}, ${pd.sy * pScale})` }}>
          <Puck x={R.start[0]} y={R.start[1] - Pc.h / 2} w={Pc.w} h={Pc.h} d={Pc.d} r={20} front="linear-gradient(155deg,#ffffff 0%,#ededed 55%,#c4c4c4 100%)" side="#9a9a9a">
            <div style={{ ...abs(Pc.w / 2 - 16, 0), width: 32, height: Pc.h, background: "#dadada" }} />
            <div style={{ ...abs(0, Pc.h / 2 - 14), width: Pc.w, height: 28, background: "#dadada" }} />
            <div style={{ position: "relative", padding: "6px 14px", borderRadius: 10, background: "#ffffff", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={label("#6b6b6b", 22)}>TANDEM</div>
              <div style={label(COLORS.ink, 42)}>MOBI</div>
            </div>
          </Puck>
        </div>
      ) : null}
      <Scatter x={R.start[0]} y={R.start[1]} t={tM} seed={13} n={6} color="#9a9a9a" zz={60} />
    </AbsoluteFill>
  );
};


// ══════════════════════════════════════════════════════════════════════════
// §5b THE SIGNPOST (paper)
//  pin → the post rises with two grey boards pointing left (the old way).
//  "reimbursement" → board 1 spins round the post (one overshoot, stops) and now points right: ink face, red tip.
//  "scale" → board 2 spins the same way (camera cranes down with it).
// Settled: the signpost (hero) · "Reimbursement path" · "Scale mechanics".
// ══════════════════════════════════════════════════════════════════════════
export const SIGN = { x: 765, b1: 760, b2: 1080, bw: 450, bh: 170, t: 28, postTop: 600, postBot: 1560 };
// Nel 11-18: centre the sign, then the camera trucks WITH each board as it swings left → right (half a board each)
export const SIGN_CAM = { truck1: { x: -225 }, truck2: { x: -450, y: -90 } };
const LEFT_BOARD = (w: number, h: number) => `M70 0 H${w} V${h} H70 L0 ${h / 2} Z`;

const Board: React.FC<{ y: number; text: string; ang: number }> = ({ y, text, ang }) => {
  const S = SIGN, w = S.bw, h = S.bh, t = S.t;
  const path = LEFT_BOARD(w, h);
  const face = (back: boolean): React.CSSProperties => ({ position: "absolute", inset: 0, backfaceVisibility: "hidden",
    transform: back ? `rotateY(180deg) translateZ(${t / 2}px)` : `translateZ(${t / 2}px)` });
  return (
    <div style={{ ...abs(S.x - w, y - h / 2), width: w, height: h, transformStyle: "preserve-3d", transformOrigin: "100% 50%", transform: `rotateY(${ang}deg)` }}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width={w} height={h} style={{ position: "absolute", inset: 0, transform: `translateZ(${-t / 2 + (i * t) / 4}px)` }}><path d={path} fill="#6e6e6e" /></svg>
      ))}
      {/* front (the old way, pointing left) */}
      <div style={face(false)}>
        <svg width={w} height={h} style={abs(0, 0)}>
          <defs><linearGradient id={`sgF${y}`} x1="0" y1="0" x2="0.6" y2="1"><stop offset="0%" stopColor="#dcdcdc" /><stop offset="100%" stopColor="#a8a8a8" /></linearGradient></defs>
          <path d={path} fill={`url(#sgF${y})`} />
        </svg>
        <div style={{ ...abs(80, 0), width: w - 100, height: h, display: "flex", alignItems: "center", justifyContent: "center", ...label(COLORS.ink, 32) }}>{text}</div>
      </div>
      {/* back (the new way, pointing right once spun): ink with a red tip; drawn in its own unmirrored coordinates */}
      <div style={face(true)}>
        <svg width={w} height={h} style={abs(0, 0)}>
          <path d={`M0 0 H${w - 70} L${w} ${h / 2} L${w - 70} ${h} H0 Z`} fill="#1d1d1d" />
          <path d={`M${w - 110} 0 H${w - 70} L${w} ${h / 2} L${w - 70} ${h} H${w - 110} Z`} fill={COLORS.accent} />
        </svg>
        <div style={{ ...abs(20, 0), width: w - 150, height: h, display: "flex", alignItems: "center", justifyContent: "center", ...label(COLORS.paper, 32) }}>{text}</div>
      </div>
    </div>
  );
};

export const Signpost: React.FC<Win & { arriveMs: number; reimb: Cued; scale: Cued }> = ({ from, to, arriveMs, reimb, scale }) => {
  const ms = useMs();
  const p3 = useP3();
  const z = useZ();
  const ent = useEnt();
  const sp = useSpringX();
  const t1 = at(reimb, 28610, from, arriveMs + 400);
  const t2 = at(scale, 30200, from, t1 + 700);
  if (ms > to + 320) return null;
  const S = SIGN;
  const rise = ent(arriveMs, 500);
  const a1 = ms >= t1 ? 180 * sp(t1, 10, 110) : 0;
  const a2 = ms >= t2 ? 180 * sp(t2, 10, 110) : 0;
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to) }}>
      <div style={{ ...abs(S.x - 300, S.postBot - 10), width: 600, height: 50, borderRadius: "50%", background: "rgba(0,0,0,0.14)", filter: "blur(12px)", opacity: rise > 0.5 ? 1 : 0 }} />
      {ms >= arriveMs ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transform: `translateY(${lerp(1300, 0, rise)}px)` }}>
          <Puck x={S.x} y={(S.postTop + S.postBot) / 2} w={46} h={S.postBot - S.postTop} d={46} r={23} front="linear-gradient(90deg,#9a9a9a,#5e5e5e)" side="#444" />
          <Puck x={S.x} y={S.postTop - 10} w={70} h={40} d={50} r={20} front="linear-gradient(90deg,#bdbdbd,#777)" side="#444" />
          <div style={{ ...p3, position: "absolute", inset: 0, transform: z(30) || undefined }}>
            <Board y={S.b1} text="Reimbursement path" ang={a1} />
            <Board y={S.b2} text="Scale mechanics" ang={a2} />
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// §6 ONE INTERVAL, ONE CHANNEL (red)
//  "One" → plate 1 drops and squashes. "doubled" → a red DOUBLED pill slams onto its face (straight, no ring).
//  "One" → plate 2 drops. "channel" → plate 2 flips over once (rotateX 360°) and RESET prints on landing; camera pushes in.
// Settled: the two plates (hero) · DOUBLED · RESET.
// ══════════════════════════════════════════════════════════════════════════
export const TWO = { x: 540, p1: 660, p2: 1060, w: 860, h: 260, d: 90 };
export const TWO_CAM = { push: { z: 140, y: 40 } };

export const TwoPlates: React.FC<Win & { one1: Cued; doubled: Cued; one2: Cued; channel: Cued }> = ({ from, to, one1, doubled, one2, channel }) => {
  const ms = useMs();
  const p3 = useP3();
  const z = useZ();
  const sp = useSpringX();
  const drop = useDropX();
  const t1 = at(one1, 32450, from);
  const tD = at(doubled, 33820, from, t1 + 600);
  const t2 = at(one2, 34350, from, tD + 400);
  const tC = at(channel, 35620, from, t2 + 700);
  if (ms > to + 320) return null;
  const T = TWO;
  const d1 = drop(t1 - 300, 1000, 300);
  const pill = drop(tD - 260, 500, 260);
  const d2 = drop(t2 - 300, 1000, 300);
  const fl = ms >= tC ? sp(tC, 11, 120) : 0;
  const landed = tC + 650;
  const plate = (y: number, text: string, sub: string, up = true) => (
    <Puck x={T.x} y={y} w={T.w} h={T.h} d={T.d} r={56} front={G_WHITE} side="#9c9c9c">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: T.w - 120, marginTop: -40, opacity: up ? 1 : 0 }}>
        <div style={line(92, COLORS.ink)}>{text}</div>
        <div style={label("#6b6b6b", 40)}>{sub}</div>
      </div>
    </Puck>
  );
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to) }}>
      {d1.on ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${T.x}px ${T.p1 + T.h / 2}px`, transform: `translateY(${d1.dy}px) scale(${d1.sx}, ${d1.sy})` }}>
          {plate(T.p1, "1 wear interval", "Infusion set")}
          {pill.on ? (
            <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${T.x + 200}px ${T.p1 + 80}px`, transform: `${z(T.d / 2 + 24)}translateY(${pill.dy}px) scale(${pill.sx}, ${pill.sy})` }}>
              <Puck x={T.x + 200} y={T.p1 + 62} w={340} h={92} d={30} r={46} front={G_RED} side="#8f0e15"><div style={label(COLORS.paper, 50)}>DOUBLED</div></Puck>
            </div>
          ) : null}
        </div>
      ) : null}
      <Scatter x={T.x + 200} y={T.p1 + 62} t={tD} seed={14} n={6} color={COLORS.paper} zz={T.d / 2 + 30} />
      {d2.on ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${T.x}px ${T.p2 + T.h / 2}px`, transform: `translateY(${d2.dy}px) scale(${d2.sx}, ${d2.sy})` }}>
          <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${T.x}px ${T.p2}px`, transform: `rotateX(${360 * fl}deg)` }}>
            {plate(T.p2, "1 channel", "Distribution", Math.cos((360 * fl * Math.PI) / 180) > 0)}
            <div style={{ ...abs(T.x + 30, T.p2 + 18), transform: `translateZ(${T.d / 2 + 2}px)` }}>
              <Print t={landed}>
                <div style={{ padding: "14px 34px", borderRadius: 46, background: COLORS.ink, ...label(COLORS.paper, 50) }}>RESET</div>
              </Print>
            </div>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// §6b THE OPEN QUESTION (ink)
//  pin → Omnipod's pod and Tandem's Mobi spring in side by side; a red SHARE coin sits on the pod.
//  "pump share" → the coin hops in an arc onto the Mobi (camera trucks with it). "or just" → it hops back onto the pod.
//  "forces" → the pod steps forward with a squash. "move" → a big "?" drops in above them, letter-kinetic.
// Settled: pod + pump (hero) · the coin back on the pod · "?".
// ══════════════════════════════════════════════════════════════════════════
export const Q = { pod: [290, 1180] as [number, number], pump: [790, 1180] as [number, number], coin: 150 };
export const Q_CAM = { truck: { x: -60 } };

export const OpenQuestion: React.FC<Win & { arriveMs: number; share: Cued; back: Cued; forces: Cued; move: Cued }> = ({ from, to, arriveMs, share, back, forces, move }) => {
  const ms = useMs();
  const k = useK();
  const p3 = useP3();
  const z = useZ();
  const ent = useEnt();
  const sp = useSpringX();
  const thump = useThump();
  const tS = at(share, 37860, from, arriveMs + 400);
  const tB = at(back, 39370, from, tS + 700);
  const tF = at(forces, 39760, from, tB + 350);
  const tQ = at(move, 40810, from, tF + 600);
  if (ms > to + 320) return null;
  const [ox, oy] = Q.pod, [mx, my] = Q.pump;
  const arr = ent(arriveMs, 450);
  const podTop = oy - 100, pumpTop = my - 95;
  // the coin: on the pod → arc to the pump → arc back
  const go = EASE_IO(k(tS, 600)), ret = EASE_IO(k(tB, 600));
  const q = go - ret; //                              0 on the pod, 1 on the pump
  const cx = lerp(ox, mx, q);
  const arcY = (p: number) => -300 * Math.sin(Math.PI * p);
  const cy = lerp(podTop, pumpTop, q) - Q.coin / 2 + (ms < tB ? arcY(go) : arcY(ret));
  const landPump = thump(tS + 600), landPod = thump(tB + 600);
  // the pod steps forward (toward the centre) on "forces"
  const st = ms >= tF ? sp(tF, 9, 170) : 0;
  const podDx = 90 * st;
  const coinX = cx + (q < 0.5 ? podDx : 0);
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to) }}>
      {ms >= arriveMs ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `540px ${oy}px`, transform: `${z(lerp(-1600, 0, arr))}` }}>
          <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${ox}px ${oy + 100}px`, transform: `translateX(${podDx}px) scale(${1 + 0.05 * landPod}, ${1 - 0.08 * landPod})` }}>
            <Puck x={ox} y={oy} w={330} h={200} d={120} r="50%" front={G_WHITE} side="#a2a2a2">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={label(COLORS.ink, 44)}>Omnipod 5</div>
                <div style={label("#6b6b6b", 28)}>INSULET</div>
              </div>
            </Puck>
          </div>
          <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${mx}px ${my + 95}px`, transform: `scale(${1 + 0.05 * landPump}, ${1 - 0.08 * landPump})` }}>
            <Puck x={mx} y={my} w={340} h={190} d={110} r={46} front={G_INK} side="#101010">
              <div style={label(COLORS.paper, 44)}>Tandem Mobi</div>
            </Puck>
          </div>
          {/* the share coin */}
          <div style={{ ...p3, position: "absolute", inset: 0, transform: z(70) || undefined }}>
            <Puck x={coinX} y={cy} w={Q.coin} h={Q.coin} d={26} r="50%" front={G_RED} side="#8f0e15"
              style={{ transform: `rotateZ(${(ms < tB ? go : 1 - ret) * 360}deg)` }}>
              <div style={label(COLORS.paper, 32)}>SHARE</div>
            </Puck>
          </div>
        </div>
      ) : null}
      {/* the open question */}
      <div style={{ ...abs(0, 520), width: 1080, display: "flex", justifyContent: "center", transform: z(40) || undefined }}>
        {ms >= tQ ? <KType text="?" t={tQ} size={360} color={COLORS.paper} shadow="10px 14px 0 #333" /> : null}
      </div>
    </AbsoluteFill>
  );
};
