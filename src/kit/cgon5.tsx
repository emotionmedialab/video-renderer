// ─────────────────────────────────────────────────────────────────────────
// KIT · cgon5 — CG Oncology PIVOT-006 long-form, chunk 5 (2:05–2:49, "Our read").
// V2 house style (MOTION-RULES §0).
//  S20 ReadSign  (paper) — a sign drops (WHY IT MATTERS) and flips over its horizontal axis to a red OUR READ.
//  S21 Watching  (ink)   — callback to S13's trays (K2): an ANOTHER DRUG vial drops toward the surveillance
//                          tray and bounces off its tokens out of frame; an hourglass drops onto that tray.
//  S22 OneProp   (red)   — a prop rises; the 0.32 block drops onto it; LARGE EFFECT prints; the prop's plate
//                          prints IF THE FULL DATA HOLD UP.
//  S23 DecCoin   (ink)   — the DEC 2 seal from S3 rolls in as a coin; three question plates rise beneath it.
//  S24–26 Filings (paper) — a filing rail (section spine): binder 1 drops (BCG-UNRESPONSIVE), THIS QUARTER drops;
//                          FDA FEEDBACK tag swings on, the binder widens, slides to BY END OF MARCH 2027; binder 2
//                          (PIVOT-006) drops at Q2 2027.
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, COLORS, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { EASE, fadeOut } from "./plusone";
import { label, line } from "./inovio";
import { Print } from "./ryb1b";
import { useP3, useZ } from "./camera";
import { Scatter, useDropX, useSpringX } from "./v2style";
import { G_GREY, G_INK, G_STONE, G_WHITE, Puck } from "./argenx1v2b";
import { PathSolid } from "./pfb1v2";
import { G_RED, shadow } from "./summit1";
import { SORT } from "./cgon3";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });
const G_GLASS = "linear-gradient(155deg, #ffffff 0%, #e9eef0 45%, #b9c2c6 100%)";

// ══════════════════════════════════════════════════════════════════════════
// S20 (paper) — "Why it matters. This is our read."   Settled: the red OUR READ sign (hero).
// ══════════════════════════════════════════════════════════════════════════
export const SIGN = { x: 960, y: 420, w: 760, h: 230, floor: 800 };

export const ReadSign: React.FC<Win & { flip: Cued }> = ({ from, to, flip: flipC }) => {
  const ms = useMs();
  const p3 = useP3();
  const drop = useDropX();
  const sp = useSpringX();
  const tIn = from + 160;
  const tFlip = at(flipC, 126210, from, tIn + 700);
  if (ms < from || ms > to + 320) return null;

  const d = drop(tIn, 800, 380);
  const fl = ms < tFlip ? 0 : sp(tFlip, 10, 150);
  const postTop = SIGN.y + SIGN.h / 2;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {d.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${SIGN.x}px ${SIGN.floor}px`, transform: `translateY(${d.dy}px) scale(${d.sx}, ${d.sy})` }}>
          <div style={shadow(SIGN.x, SIGN.floor + 8, 320, 0.2)} />
          <Puck x={SIGN.x} y={(postTop + SIGN.floor) / 2} w={34} h={SIGN.floor - postTop} d={34} r={17} front={G_GREY} side="#555" />
          <Puck x={SIGN.x} y={SIGN.floor - 12} w={260} h={24} d={110} r={12} front={G_GREY} side="#555" />
          <div style={{ ...abs(SIGN.x - SIGN.w / 2, SIGN.y - SIGN.h / 2), width: SIGN.w, height: SIGN.h, ...p3, transform: `rotateX(${180 * fl}deg)` }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: G_WHITE, backfaceVisibility: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 14px 26px rgba(0,0,0,0.2)", border: `6px solid ${COLORS.ink}`, boxSizing: "border-box" }}>
              <div style={line(84, COLORS.ink)}>WHY IT MATTERS</div>
            </div>
            <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: G_RED, backfaceVisibility: "hidden", transform: "rotateX(180deg)",
              display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 26px rgba(0,0,0,0.25)" }}>
              <div style={line(100, COLORS.paper)}>OUR READ</div>
            </div>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S21 (ink) — "The comparison was surveillance, not another drug. Against watching and waiting,"
// Settled: the two trays (hero, S13 seats) / the hourglass on the surveillance tray.
// ══════════════════════════════════════════════════════════════════════════
const HOURGLASS = "M10 0 L150 0 L150 14 C150 70 96 92 96 110 C96 128 150 150 150 206 L150 220 L10 220 L10 206 C10 150 64 128 64 110 C64 92 10 70 10 14 Z";

export const Watching: React.FC<Win & { not: Cued; watching: Cued }> = ({ from, to, not, watching }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const drop = useDropX();
  const sp = useSpringX();
  const tIn = from + 80;
  const tNot = at(not, 130300, from, tIn + 900);
  const tW = at(watching, 132060, from, tNot + 900);
  if (ms < from || ms > to + 320) return null;

  const rise = sp(tIn, 12, 160);
  const rx = SORT.x + SORT.trayDX; //                    the surveillance tray
  const tokTop = SORT.trayY - SORT.trayH / 2 - SORT.tok - 22; //  the hourglass sits clear above the tokens
  // the vial: falls onto the tokens (380ms), then bounces off up and to the right, tumbling out of frame
  const vf = clamp01((ms - (tNot - 380)) / 380);
  const vb = clamp01((ms - tNot) / 700);
  const vOn = ms >= tNot - 380 && vb < 1;
  const vy = vb > 0 ? tokTop - 90 - 620 * vb + 500 * vb * vb : lerp(-300, tokTop - 90, vf * vf);
  const vx = rx + 900 * vb;
  const hg = drop(tW - 380, 700, 380);
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${lerp(560, 0, rise)}px)` }}>
        {[-1, 1].map((sd) => {
          const x = SORT.x + sd * SORT.trayDX;
          return (
            <React.Fragment key={sd}>
              <div style={shadow(x, SORT.trayY + SORT.trayH / 2 + 12, SORT.trayW, 0.45)} />
              <Puck x={x} y={SORT.trayY} w={SORT.trayW} h={SORT.trayH} d={150} r={30} front={sd < 0 ? G_RED : G_STONE} side={sd < 0 ? "#8f0e15" : "#8a8a8a"}>
                <div style={label(sd < 0 ? COLORS.paper : COLORS.ink, 30)}>{sd < 0 ? "CRETOSTIMOGENE" : "SURVEILLANCE ALONE"}</div>
              </Puck>
              {[0, 1, 2, 3].map((s) => (
                <Puck key={s} x={x + (s - 1.5) * 76} y={SORT.trayY - SORT.trayH / 2 - SORT.tok / 2 - 2} w={SORT.tok} h={SORT.tok} d={24} r="50%" front={G_WHITE} side="#9a9a9a" />
              ))}
            </React.Fragment>
          );
        })}
      </div>
      {vOn ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: z(40) || undefined }}>
          <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${vx}px ${vy}px`, transform: `translate(${vx - rx}px, 0px) rotateZ(${200 * vb}deg)` }}>
            <Puck x={rx} y={vy} w={130} h={170} d={50} r={26} front={G_GLASS} side="#8d979b">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={label(COLORS.ink, 18)}>ANOTHER</div>
                <div style={label(COLORS.ink, 18)}>DRUG</div>
              </div>
            </Puck>
            <Puck x={rx} y={vy - 105} w={90} h={40} d={50} r={10} front={G_GREY} side="#555" />
          </div>
        </div>
      ) : null}
      <Scatter x={rx} y={tokTop} t={tNot} seed={29} n={6} color={COLORS.paper} zz={60} />
      {hg.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${rx}px ${tokTop}px`, transform: `${z(30)}translateY(${hg.dy}px) scale(${hg.sx}, ${hg.sy})` }}>
          <Puck x={rx} y={tokTop - 10} w={190} h={22} d={90} r={10} front={G_INK} side="#111" />
          <PathSolid id="cg-hourglass" x={rx} y={tokTop - 21 - 110} w={160} h={220} d={70} path={HOURGLASS} front={["#ffffff", "#e9eef0", "#b9c2c6"]} side="#8d979b" />
          <Puck x={rx} y={tokTop - 21 - 220 - 11} w={190} h={22} d={90} r={10} front={G_INK} side="#111" />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S22 (red) — "a hazard ratio of 0.32 would be a large effect if the full data hold up."
// Settled: the 0.32 block on its one prop (hero) / LARGE EFFECT / IF THE FULL DATA HOLD UP plate.
// ══════════════════════════════════════════════════════════════════════════
export const PROP = { x: 960, blockY: 360, blockW: 560, blockH: 230, floor: 800, plateY: 640 };

export const OneProp: React.FC<Win & { fig: Cued; large: Cued; ifc: Cued }> = ({ from, to, fig, large, ifc }) => {
  const ms = useMs();
  const p3 = useP3();
  const z = useZ();
  const drop = useDropX();
  const sp = useSpringX();
  const tIn = from + 80;
  const tFig = at(fig, 134620, from, tIn + 600);
  const tLarge = at(large, 135920, from, tFig + 700);
  const tIf = at(ifc, 136710, from, tLarge + 500);
  if (ms < from || ms > to + 320) return null;

  const rise = sp(tIn, 12, 160);
  const blk = drop(tFig - 380, 760, 380);
  const postTop = PROP.blockY + PROP.blockH / 2;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${lerp(600, 0, rise)}px)` }}>
        <div style={shadow(PROP.x, PROP.floor + 8, 300, 0.3)} />
        <Puck x={PROP.x} y={(postTop + PROP.floor) / 2} w={34} h={PROP.floor - postTop} d={34} r={17} front={G_INK} side="#111" />
        <Puck x={PROP.x} y={PROP.floor - 12} w={240} h={24} d={110} r={12} front={G_INK} side="#111" />
        <Puck x={PROP.x} y={PROP.plateY} w={460} h={76} d={40} r={18} front={G_INK} side="#111">
          <Print t={tIf}><div style={label(COLORS.paper, 26)}>IF THE FULL DATA HOLD UP</div></Print>
        </Puck>
      </div>
      {blk.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${PROP.x}px ${postTop}px`, transform: `${z(10)}translateY(${blk.dy}px) scale(${blk.sx}, ${blk.sy})` }}>
          <Puck x={PROP.x} y={PROP.blockY} w={PROP.blockW} h={PROP.blockH} d={140} r={30} front={G_WHITE} side="#9a9a9a">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <div style={line(120, COLORS.ink)}>0.32</div>
              <Print t={tLarge}><div style={label(COLORS.ink, 30)}>WOULD BE A LARGE EFFECT</div></Print>
            </div>
          </Puck>
        </div>
      ) : null}
      <Scatter x={PROP.x} y={postTop} t={tFig} seed={31} n={7} color={COLORS.paper} zz={80} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S23 (ink) — "December 2nd should show how large, in which patients, and for how long."
// Settled: the DEC 2 coin (hero) / the three question plates (a three-row list, F3).
// ══════════════════════════════════════════════════════════════════════════
export const COIN = { x: 960, y: 390, D: 300, plates: [580, 960, 1340] as const, plateY: 760 };
export const COIN_OPEN_X = 420;
const QS = ["HOW LARGE", "WHICH PATIENTS", "HOW LONG"];

export const DecCoin: React.FC<Win & { how: Cued }> = ({ from, to, how }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const k = useK();
  const tIn = from + 80;
  const tHow = at(how, 140750, from, tIn + 1000);
  if (ms < from || ms > to + 320) return null;

  const ROLL = 950;
  const r = EASE(k(tIn, ROLL));
  const cx = lerp(-400, COIN.x, r);
  const spin = -360 * 2 * (1 - r); //                      two turns, ending upright
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={shadow(cx, COIN.y + COIN.D / 2 + 30, COIN.D * 0.9, 0.4)} />
      <div style={{ position: "absolute", inset: 0, ...p3, transform: z(20) || undefined }}>
        <div style={{ ...abs(cx - COIN.D / 2, COIN.y - COIN.D / 2), width: COIN.D, height: COIN.D, borderRadius: "50%", background: G_STONE, border: `12px solid ${COLORS.paper}`,
          boxSizing: "border-box", boxShadow: "0 16px 30px rgba(0,0,0,0.5), inset 0 0 0 10px #1a1a1a", display: "flex", alignItems: "center", justifyContent: "center",
          transform: `rotateZ(${spin}deg)` }}>
          <div style={line(86, COLORS.ink)}>DEC 2</div>
        </div>
      </div>
      {QS.map((q, i) => {
        const t0 = tHow + i * 140;
        const p = ms < t0 ? 0 : sp(t0, 12, 160);
        if (p <= 0) return null;
        return (
          <div key={q} style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${lerp(420, 0, p)}px)` }}>
            <Puck x={COIN.plates[i]} y={COIN.plateY} w={340} h={96} d={120} r={26} front={G_WHITE} side="#9a9a9a">
              <div style={label(COLORS.ink, 30)}>{q}</div>
            </Puck>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S24–S26 (paper) — the filing rail, one spine across three scenes.
// S24 "It also reshapes the filing plan. CG Oncology's first FDA application, in patients whose cancer no longer
//      responds to the standard treatment BCG, was due this quarter."
// S25 "After FDA feedback it now covers more patients, with completion expected by the end of March 2027."
// S26 "A second application, built on PIVOT-006, is planned for the second quarter of 2027."
// ══════════════════════════════════════════════════════════════════════════
export const RAIL = { y: 700, x0: 240, x1: 1720, slots: [500, 1000, 1460] as const, bW: 250, bWide: 340, bH: 330, plateY: 790, k: 1.15 };

const Binder: React.FC<{ x: number; w: number; title: string; sub: React.ReactNode }> = ({ x, w, title, sub }) => (
  <Puck x={x} y={RAIL.y - 13 - RAIL.bH / 2} w={w} h={RAIL.bH} d={70} r={18} front={G_INK} side="#151515">
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "0 12px", textAlign: "center" }}>
      <div style={{ ...label(COLORS.paper, 26), whiteSpace: "normal", lineHeight: 1.15 }}>{title}</div>
      {sub}
    </div>
  </Puck>
);

export const Filings: React.FC<Win & { rail: Cued; first: Cued; bcg: Cued; due: Cued; feedback: Cued; more: Cued; expected: Cued; slide: Cued; second: Cued; q2: Cued }> = ({
  from, to, rail, first, bcg, due, feedback, more, expected, slide, second, q2,
}) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const drop = useDropX();
  const sp = useSpringX();
  const k = useK();
  const tRail = at(rail, 144580, from);
  const tFirst = at(first, 147370, from, tRail + 900);
  const tBcg = at(bcg, 150370, from, tFirst + 900);
  const tDue = at(due, 153900, from, tBcg + 900);
  const tFb = at(feedback, 156210, from, tDue + 900);
  const tMore = at(more, 157270, from, tFb + 700);
  const tExp = at(expected, 159210, from, tMore + 900);
  const tSlide = at(slide, 160630, from, tExp + 900);
  const tSec = at(second, 163100, from, tSlide + 1200);
  const tQ2 = at(q2, 167080, from, tSec + 1200);
  if (ms < from || ms > to + 320) return null;

  const rl = drop(tRail - 380, 600, 380);
  const b1 = drop(tFirst - 380, 700, 380);
  const p1 = drop(tDue - 300, 400, 300);
  const tag = ms < tFb ? 0 : sp(tFb, 8, 150);
  const wide = ms < tMore ? 0 : sp(tMore, 11, 170);
  const p2 = drop(tExp - 300, 400, 300);
  const sl = ms < tSlide ? 0 : sp(tSlide, 13, 120);
  const b2 = drop(tSec - 380, 700, 380);
  const p3d = drop(tQ2 - 300, 400, 300);
  const b1x = lerp(RAIL.slots[0], RAIL.slots[1], sl);
  const b1w = lerp(RAIL.bW, RAIL.bWide, wide);
  const leave = EASE(k(tSlide, 500)); //                 THIS QUARTER and the FDA tag are finished ideas: they drop away as the binder leaves (F2)
  const plate = (x: number, d: { dy: number; sx: number; sy: number; on: boolean }, text: string, gone = 0) =>
    d.on && gone < 1 ? (
      <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(40)}translateY(${d.dy + 700 * gone * gone}px)` }}>
        <div style={{ ...abs(x - 170, RAIL.plateY - 34), width: 340, height: 68, borderRadius: 20, background: G_WHITE, border: `5px solid ${COLORS.ink}`, boxSizing: "border-box",
          display: "flex", alignItems: "center", justifyContent: "center", transformOrigin: "50% 100%", transform: `scale(${d.sx}, ${d.sy})` }}>
          <div style={label(COLORS.ink, 26)}>{text}</div>
        </div>
      </div>
    ) : null;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: "960px 640px", transform: `scale(${RAIL.k})` }}>
      {rl.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${rl.dy}px)` }}>
          <div style={shadow((RAIL.x0 + RAIL.x1) / 2, RAIL.y + 26, RAIL.x1 - RAIL.x0, 0.2)} />
          <Puck x={(RAIL.x0 + RAIL.x1) / 2} y={RAIL.y} w={RAIL.x1 - RAIL.x0} h={26} d={140} r={13} front={G_GREY} side="#555" />
        </div>
      ) : null}
      {plate(RAIL.slots[0], p1, "THIS QUARTER", leave)}
      {plate(RAIL.slots[1], p2, "BY END OF MARCH 2027")}
      {plate(RAIL.slots[2], p3d, "Q2 2027")}

      {b1.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${b1x}px ${RAIL.y}px`, transform: `${z(20)}translateY(${b1.dy}px) scale(${b1.sx}, ${b1.sy})` }}>
          <Binder x={b1x} w={b1w} title="FIRST APPLICATION" sub={<Print t={tBcg}><div style={{ ...label("#bdbdbd", 20), whiteSpace: "normal", lineHeight: 1.2 }}>BCG-UNRESPONSIVE</div></Print>} />
          {/* the FDA FEEDBACK tag swings in from the binder's top edge on its hinge, and drops away when the binder moves on */}
          {tag > 0 && leave < 1 ? (
            <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${b1x}px ${RAIL.y - 13 - RAIL.bH}px`,
              transform: `translateY(${700 * leave * leave}px) rotateX(${lerp(-88, 0, tag)}deg)` }}>
              <div style={{ ...abs(b1x - 120, RAIL.y - 13 - RAIL.bH - 96), width: 240, height: 80, borderRadius: 18, background: G_WHITE, border: `5px solid ${COLORS.ink}`, boxSizing: "border-box",
                display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 18px rgba(0,0,0,0.25)", transform: z(40) || undefined }}>
                <div style={label(COLORS.ink, 24)}>FDA FEEDBACK</div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
      {b2.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${RAIL.slots[2]}px ${RAIL.y}px`, transform: `${z(20)}translateY(${b2.dy}px) scale(${b2.sx}, ${b2.sy})` }}>
          <Binder x={RAIL.slots[2]} w={RAIL.bW} title="SECOND APPLICATION" sub={<div style={{ ...label(COLORS.accent, 22), whiteSpace: "normal" }}>PIVOT-006</div>} />
        </div>
      ) : null}
      <Scatter x={RAIL.slots[2]} y={RAIL.y} t={tSec} seed={33} n={7} color="#9a9a9a" zz={70} />
      </div>
    </AbsoluteFill>
  );
};
