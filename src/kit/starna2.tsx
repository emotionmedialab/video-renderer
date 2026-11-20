// ─────────────────────────────────────────────────────────────────────────
// KIT · starna2 — Pfizer × Starna in vivo CAR-T SHORT (9:16), chunk 2, 2026-11-20. House style 11-16 (MOTION-RULES §0).
//  S7 target (red)  "the first target isn't cancer. It's autoimmune disease … a market … larger than cancer CAR T"
//                    → a target board labelled CANCER springs in; on "isn't" it spins round to AUTOIMMUNE; on "autoimmune"
//                    a dart flies in and hits the bull (camera cranes with it); a small CANCER CAR-T disc drops below on
//                    "market"; on "larger" the target swells while the camera pulls back. No size NUMBER (no source).
//  S8 clinic (ink)  "Three programs, none yet in people. The next real read is an IND filing."
//                    → the three vials return to their tray seats (K2); a clinic door lands above them; on "none" its two
//                    leaves swing shut; on "next" an IND FILING envelope flies up to the door's slot and stops there, not in.
//  S9 option (red)  "$330 million is the price of a platform option, not a product."
//                    → the hook's brick returns to its seat, stepping back from the front (K2, reverses S1); on "platform option"
//                    an OPTION ticket prints up out of its top (camera cranes up); on "not" a PRODUCT carton drops below and on
//                    "product" it tips over backwards and falls out of the frame.
// Canvas 1080×1920; chrome band 0–112; key content above y 1632.
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, COLORS, useMs } from "./core";
import { useP3, useZ } from "./camera";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { EASE, fadeOut } from "./plusone";
import { label, line } from "./inovio";
import { Print } from "./ryb1b";
import { Scatter, useDropX, useEnt, useSpringX } from "./v2style";
import { G_GREY, G_INK, G_WHITE, Puck } from "./argenx1v2b";
import { Vial } from "./summit1";
import { Brick, HOOK, VIALS } from "./starna1";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });
const useThump = () => {
  const ms = useMs();
  const sp = useSpringX();
  return (t: number) => (ms >= t ? 1 - sp(t, 6, 210, 0.6) : 0);
};
const Shadow: React.FC<{ x: number; y: number; w: number; o?: number }> = ({ x, y, w, o = 1 }) => (
  <div style={{ ...abs(x - w / 2, y), width: w, height: 40, borderRadius: "50%", background: "rgba(0,0,0,0.24)", filter: "blur(12px)", opacity: o }} />
);

// ══════════════════════════════════════════════════════════════════════════
// S7 TARGET (red). Settled: the swollen AUTOIMMUNE target with the dart (hero) · CANCER CAR-T disc.
// ══════════════════════════════════════════════════════════════════════════
export const TGT = { x: 540, y: 780, r: 290, d: 70, swell: 1.45, smallY: 1470, smallR: 95 };
export const TGT_CAM = { crane: { y: -50 }, pull: { y: -60, z: -260 } };

const Rings: React.FC<{ r: number; d: number; children?: React.ReactNode }> = ({ r, d, children }) => {
  const rings = [1, 0.78, 0.56, 0.34, 0.16];
  return (
    <div style={{ position: "absolute", left: -r, top: -r, width: r * 2, height: r * 2, transformStyle: "preserve-3d" }}>
      {rings.map((f, i) => (
        <Puck key={i} x={r} y={r} w={r * 2 * f} h={r * 2 * f} d={i === 0 ? d : 6} r="50%" front={i % 2 === 0 ? G_WHITE : G_INK} side={i % 2 === 0 ? "#9c9c9c" : "#111"}
          style={i === 0 ? undefined : { transform: `translateZ(${d / 2 + i * 3}px)` }} />
      ))}
      <div style={{ ...abs(0, r * 2 - r * 0.42), width: r * 2, display: "flex", justifyContent: "center", transform: `translateZ(${d / 2 + 20}px)` }}>{children}</div>
    </div>
  );
};

export const Target: React.FC<Win & { arrive: Cued; isnt: Cued; hit: Cued; market: Cued; larger: Cued }> = ({ from, to, arrive, isnt, hit, market, larger }) => {
  const ms = useMs();
  const p3 = useP3();
  const z = useZ();
  const k = useK();
  const ent = useEnt();
  const sp = useSpringX();
  const drop = useDropX();
  const thump = useThump();
  const tA = at(arrive, 31170, from);
  const tN = at(isnt, 31630, from, tA + 300);
  const tH = at(hit, 32650, from, tN + 600);
  const tM = at(market, 34280, from, tH + 500);
  const tL = at(larger, 36020, from, tM + 600);
  if (ms > to + 320) return null;
  const T = TGT;
  const a = ent(tA, 450);
  // the spin: 0 → 180°; the face swaps at 90° and the back face is shown un-mirrored
  const spin = (ms >= tN ? sp(tN, 12, 140) : 0) * 180; // one small overshoot past 180, then square
  const shown = spin <= 90 ? spin : spin - 180;
  const back = spin > 90;
  // the dart: flies in from the lower left, through depth, its tip landing on the bull
  const fl = EASE(k(tH, 480));
  const dartOn = ms >= tH;
  const th = thump(tH + 480);
  const sw = ms >= tL ? sp(tL, 11, 120) : 0;
  const S = lerp(1, T.swell, sw);
  const sm = drop(tM, 1100, 380);
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to + 300) }}>
      {/* the target */}
      {ms >= tA ? (
        <div style={{ ...p3, position: "absolute", left: T.x, top: T.y, transform: `${z(lerp(-1500, 0, a) - 30 * th)}scale(${S})` }}>
          <div style={{ ...p3, position: "absolute", left: 0, top: 0, transform: `rotateY(${shown}deg)` }}>
            <Rings r={T.r} d={T.d}>
              <div style={{ background: COLORS.ink, borderRadius: 14, padding: "8px 20px" }}>
                <div style={label(COLORS.paper, 40)}>{back ? "AUTOIMMUNE" : "CANCER"}</div>
              </div>
            </Rings>
          </div>
          {dartOn ? (
            <div style={{ ...p3, position: "absolute", left: 0, top: 0, transform: `${z(lerp(1400, T.d / 2 + 30, fl))}translate(${lerp(-480, 0, fl)}px, ${lerp(-400, 0, fl)}px)` }}>
              {/* shaft from the tip (0,0) back up-left, clear of the label; fletch at its tail (300 · cos/sin 218°) */}
              <div style={{ ...abs(-8, -8), width: 300, height: 16, borderRadius: 8, background: COLORS.ink, transformOrigin: "8px 8px", transform: "rotate(218deg)" }} />
              <div style={{ ...abs(-36, -36), width: 72, height: 72, transform: "translate(-236px, -185px) rotate(218deg)", background: COLORS.paper, clipPath: "polygon(0 50%, 100% 0, 70% 50%, 100% 100%)" }} />
            </div>
          ) : null}
        </div>
      ) : null}
      <Scatter x={T.x} y={T.y} t={tH + 480} seed={31} n={6} color={COLORS.paper} zz={T.d} />

      {/* the small disc: cancer CAR-T, dropped below for scale */}
      {sm.on ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${T.x}px ${T.smallY + T.smallR}px`, transform: `translateY(${sm.dy}px) scale(${sm.sx}, ${sm.sy})` }}>
          <Shadow x={T.x} y={T.smallY + T.smallR - 6} w={200} />
          <Puck x={T.x} y={T.smallY} w={T.smallR * 2} h={T.smallR * 2} d={50} r="50%" front={G_WHITE} side="#9c9c9c" />
          <div style={{ ...abs(0, T.smallY + T.smallR + 26), width: 1080, display: "flex", justifyContent: "center" }}>
            <div style={label(COLORS.paper, 44)}>CANCER CAR-T</div>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S8 CLINIC (ink). Settled: the shut clinic door + the three vials (hero) · CLINIC sign (lintel) · IND FILING envelope.
// ══════════════════════════════════════════════════════════════════════════
export const DOOR = { x: 540, top: 250, w: 540, h: 620, frame: 34, slotY: 640, env: { w: 330, h: 200 } };
export const DOOR_CAM = { push: { z: 150, y: 70 } };

export const Clinic: React.FC<Win & { three: Cued; door: Cued; none: Cued; next: Cued }> = ({ from, to, three, door, none, next }) => {
  const ms = useMs();
  const p3 = useP3();
  const z = useZ();
  const k = useK();
  const ent = useEnt();
  const sp = useSpringX();
  const drop = useDropX();
  const thump = useThump();
  const t3 = at(three, 37843, from);
  const tD = at(door, 38250, from, t3 + 300);
  const tN = at(none, 39210, from, tD + 500);
  const tX = at(next, 41030, from, tN + 600);
  if (ms > to + 320) return null;
  const D = DOOR, V = VIALS, E = D.env;
  const tr = ent(t3, 500); //                       the vials + tray come back on their S2 seats (K2: no re-count, they arrive as a set)
  const dd = drop(tD, 1300, 380);
  const shut = ms >= tN ? sp(tN, 9, 150) : 0;
  const leaf = lerp(68, 0, shut); //               open → shut, one bounce against the stop, then still
  const slam = thump(tN + 330);
  const ev = EASE(k(tX, 750));
  const leafW = (D.w - D.frame * 2) / 2, leafH = D.h - D.frame;
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to + 300) }}>
      {/* the door: frame with the CLINIC lintel, two leaves on side hinges */}
      {dd.on ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${D.x}px ${D.top + D.h}px`,
          transform: `translateY(${dd.dy}px) scale(${dd.sx * (1 + 0.02 * slam)}, ${dd.sy * (1 - 0.03 * slam)})` }}>
          <Puck x={D.x} y={D.top + D.h / 2} w={D.w} h={D.h} d={60} r="40px 40px 10px 10px" front={G_GREY} side="#4a4a4a" />
          <div style={{ ...p3, position: "absolute", inset: 0, transform: z(34) }}>
            <div style={{ ...abs(D.x - D.w / 2, D.top + 8), width: D.w, display: "flex", justifyContent: "center" }}>
              <div style={label(COLORS.ink, 46)}>CLINIC</div>
            </div>
            {[-1, 1].map((s) => {
              const hx = D.x + s * leafW; //       hinge on the outer edge
              return (
                <div key={s} style={{ ...p3, position: "absolute", left: s < 0 ? hx : hx - leafW, top: D.top + D.frame + 40, width: leafW, height: leafH - 40,
                  transformOrigin: s < 0 ? "0% 50%" : "100% 50%", transform: `rotateY(${-s * leaf}deg)` }}>
                  <Puck x={leafW / 2} y={(leafH - 40) / 2} w={leafW - 6} h={leafH - 40} d={26} r={10} front={G_WHITE} side="#9c9c9c">
                    {/* half of the mail slot on each leaf, meeting at the seam once shut */}
                    <div style={{ ...abs(s < 0 ? leafW - 6 - 120 : 0, D.slotY - (D.top + D.frame + 40) - 14), width: 120, height: 28, borderRadius: s < 0 ? "14px 0 0 14px" : "0 14px 14px 0", background: "#222" }} />
                  </Puck>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
      <Scatter x={D.x} y={D.top + D.h} t={tD + 380} seed={41} n={6} color={COLORS.paper} zz={30} />

      {/* the three vials on their tray (S2 seats) */}
      {ms >= t3 ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `540px ${V.trayY}px`, transform: `${z(lerp(-1400, 0, tr))}` }}>
          <Shadow x={540} y={V.trayY + V.tray.h / 2 + 10} w={820} />
          <Puck x={540} y={V.trayY + V.tray.h / 2} w={V.tray.w} h={V.tray.h} d={V.tray.d} r={V.tray.h / 2} front={G_WHITE} side="#9a9a9a">
            <div style={label(COLORS.ink, 54)}>STARNA</div>
          </Puck>
          {V.xs.map((x, i) => (
            <div key={i} style={{ ...p3, position: "absolute", inset: 0, transform: z(V.tray.d / 2) }}>
              <Vial x={x} base={V.trayY} name="CAR-T" s={V.s} />
            </div>
          ))}
        </div>
      ) : null}

      {/* the IND FILING envelope: flies up from below to the slot and STOPS at it (it is the next read, not filed) */}
      {ms >= tX ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${D.x}px ${D.slotY}px`,
          transform: `${z(lerp(900, 70, ev))}translateY(${lerp(1000, 0, ev) + E.h / 2 + 30}px)` }}>
          <Puck x={D.x} y={D.slotY} w={E.w} h={E.h} d={14} r={14} front={G_WHITE} side="#9c9c9c">
            <svg width={E.w} height={E.h} style={{ position: "absolute", inset: 0 }}>
              <path d={`M8 10 L${E.w / 2} ${E.h * 0.52} L${E.w - 8} 10`} fill="none" stroke="#bdbdbd" strokeWidth={5} strokeLinejoin="round" />
            </svg>
            <div style={{ ...label(COLORS.accent, 44), marginTop: E.h * 0.38 }}>IND FILING</div>
          </Puck>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S9 OPTION (red). Settled: the brick with its OPTION ticket (hero) · PLATFORM OPTION (on the ticket).
// ══════════════════════════════════════════════════════════════════════════
export const OPT = { ticket: { w: 440, h: 300 }, cartonY: 1430, carton: { w: 300, h: 260 } };
export const OPT_CAM = { crane: { y: 90 } };

export const Option: React.FC<Win & { back: Cued; option: Cued; not: Cued; product: Cued }> = ({ from, to, back, option, not, product }) => {
  const ms = useMs();
  const p3 = useP3();
  const z = useZ();
  const k = useK();
  const sp = useSpringX();
  const drop = useDropX();
  const tB = at(back, 44274, from);
  const tO = at(option, 46540, from, tB + 600);
  const tNo = at(not, 47710, from, tO + 650);
  const tP = at(product, 48080, from, tNo + 300);
  if (ms > to + 320) return null;
  const B = HOOK.brick, Tk = OPT.ticket, C = OPT.carton;
  // the brick steps BACK from the front into its hook seat (reverses S1's step)
  const st = 1 - sp(tB, 12, 130);
  const brickOn = ms >= tB;
  // the ticket prints up out of the brick's top edge
  const pr = ms >= tO ? sp(tO, 13, 120) : 0;
  const tkTop = B.y - B.h / 2 - Tk.h * clamp01(pr) + 18;
  // the carton: drops in on "not", tips over backwards on "product" and falls away (M7)
  // slower than the other drops: "not a product" is 0.8s of VO, so it lands, holds, THEN tips (Nel 11-20: too fast)
  const cd = drop(tNo, 1300, 520);
  const tip = clamp01((ms - (tP + 450)) / 1000);
  const cFall = 1500 * tip * tip, cRot = -95 * EASE(Math.min(1, tip * 1.6));
  const cy = OPT.cartonY;
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to + 300) }}>
      {/* ticket behind the brick so it rises out of it */}
      {pr > 0 ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transform: z(-10) }}>
          <div style={{ ...abs(B.x - Tk.w / 2, tkTop), width: Tk.w, height: Tk.h, borderRadius: 18, background: G_WHITE, boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
            display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 30, gap: 6 }}>
            <div style={label("#7a7a7a", 34)}>A PLATFORM</div>
            <div style={line(96, COLORS.ink)}>OPTION</div>
            <div style={{ ...abs(0, Tk.h - 70), width: Tk.w, borderTop: "6px dotted #c8c8c8" }} />
          </div>
        </div>
      ) : null}
      {brickOn ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${B.x}px ${B.y + B.h / 2}px`,
          transform: `${z(HOOK.step * st)}translateY(${-40 * st}px) rotateX(${Math.sin(clamp01(1 - st) * Math.PI) * 8}deg)` }}>
          <Shadow x={B.x} y={B.y + B.h / 2 + 20} w={600} />
          <Brick x={B.x} y={B.y} w={B.w} h={B.h} d={B.d}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={line(168, COLORS.ink)}>$330M</div>
              <div style={label("#6b6b6b", 48)}>UPFRONT</div>
            </div>
          </Brick>
        </div>
      ) : null}
      {/* the product carton */}
      {cd.on && tip < 1 ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `540px ${cy + C.h / 2}px`,
          transform: `${z(-80)}translateY(${cd.dy + cFall}px) rotateX(${cRot}deg) scale(${cd.sx}, ${cd.sy})` }}>
          <Puck x={540} y={cy} w={C.w} h={C.h} d={200} r={18} front={G_INK} side="#111">
            <div style={label(COLORS.paper, 50)}>PRODUCT</div>
          </Puck>
        </div>
      ) : null}
      <Scatter x={540} y={cy + C.h / 2} t={tNo + 520} seed={51} n={5} color={COLORS.paper} zz={100} />
    </AbsoluteFill>
  );
};
