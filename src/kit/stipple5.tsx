// ─────────────────────────────────────────────────────────────────────────
// KIT · stipple5 — Lilly × Stipple Bio long-form, chunk 5 (2:00–2:32, "Our read"). V2 house style.
//  S20 ReadBlock (ink)   — a red OUR READ block flies in from deep z, spinning flat in-plane, and lands square.
//  S21 Measure   (paper) — callback: the $5.9B plate drops onto its cables (PUBLIC); the S5 "$ ?" coin drops on the
//                          floor (UPFRONT · PRIVATE); a ruler grows from the coin to the plate on "how big"; on "not
//                          what Lilly has paid" the red moves to the coin (K3) and the plate goes ink.
//  S22 Road      (red)   — four signs in a row (TARGET DISCOVERY → PATIENTS); a LILLY flag plants on the first; the
//                          camera trucks all the way to PATIENTS, where NONE DESCRIBED prints.
//  S23 Bridge    (ink)   — the $5.9B plate hangs over a gap between two cliffs; one plank spans it; ONLY IF THE
//                          SCIENCE WORKS prints; two more planks slide up into place, program by program.
//  S24 Investor  (paper) — LILLY and the orb rise; a PARTNER rod joins them; the EQUITY coin drops onto the orb and a
//                          red slice of the orb lights (Lilly's stake); INVESTOR prints.
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
import { G_INK, G_STONE, G_WHITE, Puck } from "./argenx1v2b";
import { G_RED, shadow } from "./summit1";
import { LillyBlock, Orb } from "./stipple1";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });

/** the hanging $5.9B plate (cables run up out of the frame); `ink` = the red has moved elsewhere */
const HangPlate: React.FC<{ y: number; w?: number; ink?: boolean; dy: number; zz: string }> = ({ y, w = 760, ink, dy, zz }) => (
  <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `${zz}translateY(${dy}px)` }}>
    {[-1, 1].map((sg) => (
      <div key={sg} style={{ ...abs(960 + sg * (w * 0.4) - 3, y - 80 - 1600), width: 6, height: 1600, background: "#9a9a9a", borderRadius: 3 }} />
    ))}
    <Puck x={960} y={y} w={w} h={160} d={50} r={34} front={ink ? G_INK : G_RED} side={ink ? "#151515" : "#8f0e15"}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 22 }}>
        <div style={label(COLORS.paper, 36)}>UP TO</div>
        <div style={line(112, COLORS.paper)}>$5.9B</div>
      </div>
    </Puck>
  </div>
);
/** a plate falling onto its cables: lands at t, dips once */
const hangDy = (ms: number, t: number) => {
  const p = clamp01((ms - (t - 420)) / 420);
  const e = ms - t;
  return e < 0 ? -760 * (1 - p * p) : 32 * Math.exp(-e / 170) * Math.sin(e / 65);
};

// ══════════════════════════════════════════════════════════════════════════
// S20 (ink) — "Why it matters. This is our read."   Settled: the red OUR READ block (hero).
// ══════════════════════════════════════════════════════════════════════════
export const ReadBlock: React.FC<Win & { land: Cued }> = ({ from, to, land }) => {
  const ms = useMs();
  const sp = useSpringX();
  const tL = at(land, 121200, from);
  if (ms < from || ms > to + 320) return null;
  const FLY = 900;
  const p = clamp01((ms - (tL - FLY)) / FLY);
  const e = EASE(p);
  const sq = ms >= tL ? 1 - sp(tL, 7, 210, 0.6) : 0;
  if (p <= 0) return null;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), transformStyle: "preserve-3d" }}>
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transformOrigin: "960px 540px",
        transform: `translateZ(${lerp(-2600, 0, e)}px) rotateZ(${lerp(-360, 0, e)}deg) scale(${1 + 0.1 * sq}, ${1 - 0.14 * sq})` }}>
        <Puck x={960} y={540} w={820} h={250} d={90} r={60} front={G_RED} side="#8f0e15">
          <div style={line(140, COLORS.paper)}>OUR READ</div>
        </Puck>
      </div>
      <Scatter x={960} y={665} t={tL} seed={50} n={8} color={COLORS.paper} zz={60} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S21 (paper) — "When the ceiling is public and the upfront is private, the headline tells you how big success could
// be, not what Lilly has paid."   Settled: the red "$ ?" coin (hero) / the ink plate overhead / the ruler between.
// ══════════════════════════════════════════════════════════════════════════
export const MEAS = { plateY: 220, floor: 800, coinR: 92 };

export const Measure: React.FC<Win & { ceiling: Cued; upfront: Cued; big: Cued; paid: Cued }> = ({ from, to, ceiling, upfront, big, paid }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const drop = useDropX();
  const tC = at(ceiling, 124062, from);
  const tU = at(upfront, 125380, from, tC + 600);
  const tB = at(big, 128300, from, tU + 900);
  const tP = at(paid, 129900, from, tB + 700);
  if (ms < from || ms > to + 320) return null;

  const coinY = MEAS.floor - MEAS.coinR;
  const C = drop(tU - 330, 760, 330);
  const plateBottom = MEAS.plateY + 80;
  const rulerTop0 = coinY - MEAS.coinR - 10;
  const grow = EASE(k(tB - 150, 700));
  const rulerTop = lerp(rulerTop0, plateBottom + 14, grow);
  const red = ms >= tP;
  const redSq = red ? 1 - sp(tP, 7, 210, 0.6) : 0;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {ms >= tC - 420 ? <HangPlate y={MEAS.plateY} ink={red} dy={hangDy(ms, tC)} zz={z(30)} /> : null}
      <div style={{ ...abs(960 + 400, MEAS.plateY - 22), transform: z(40) || undefined }}>
        {ms >= tC + 200 ? <Print t={tC + 200}><div style={label(COLORS.grayText, 32)}>PUBLIC</div></Print> : null}
      </div>
      {/* the ruler: grows from the coin up to the plate's underside, ticks every 40px */}
      {grow > 0 ? (
        <div style={{ ...abs(960 - 22, rulerTop), width: 44, height: rulerTop0 - rulerTop, borderRadius: 10, transform: z(10) || undefined,
          background: "repeating-linear-gradient(180deg, transparent 0 36px, rgba(0,0,0,0.5) 36px 40px), linear-gradient(90deg, #f3f3f3, #c4c4c4)",
          boxShadow: "0 6px 14px rgba(0,0,0,0.18)" }} />
      ) : null}
      {C.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `960px ${MEAS.floor}px`, transform: `${z(30)}translateY(${C.dy}px) scale(${C.sx * (1 + 0.12 * redSq)}, ${C.sy * (1 - 0.16 * redSq)})` }}>
          <div style={shadow(960, MEAS.floor + 6, 200, 0.22)} />
          <Puck x={960} y={coinY} w={MEAS.coinR * 2} h={MEAS.coinR * 2} d={34} r="50%" front={red ? G_RED : G_INK} side={red ? "#8f0e15" : "#111"}>
            <div style={line(MEAS.coinR * 0.72, COLORS.paper)}>$ ?</div>
          </Puck>
        </div>
      ) : null}
      <div style={{ ...abs(960 - 300, MEAS.floor + 22), width: 600, display: "flex", justifyContent: "center", transform: z(40) || undefined }}>
        {ms >= tU + 150 ? <Print t={tU + 150}><div style={label(COLORS.ink, 32)}>UPFRONT · PRIVATE</div></Print> : null}
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S22 (red) — "Lilly is paying to come in at target discovery, before any program in this deal has been described as
// reaching patients."   Settled (camera at the far end): the PATIENTS sign with NONE DESCRIBED (hero) / CLINICAL sign.
// ══════════════════════════════════════════════════════════════════════════
export const ROAD = { xs: [480, 1180, 1880, 2580], floor: 840, boardY: 470, boardW: 540, boardH: 210, truckX: -1620 };
const SIGNS = ["TARGET DISCOVERY", "PRECLINICAL", "CLINICAL", "PATIENTS"];

export const Road: React.FC<Win & { signs: Cued; flag: Cued; patients: Cued }> = ({ from, to, signs, flag, patients }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const drop = useDropX();
  const tS = at(signs, 131740, from);
  const tF = at(flag, 133200, from, tS + 700);
  const tP = at(patients, 137030, from, tF + 1500);
  if (ms < from || ms > to + 320) return null;

  const postTop = ROAD.boardY + ROAD.boardH / 2;
  const F = drop(tF - 300, 700, 300);
  const boardTop = ROAD.boardY - ROAD.boardH / 2;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {ROAD.xs.map((x, i) => {
        const r = ms < tS - 300 + i * 110 ? 0 : sp(tS - 300 + i * 110, 12, 170);
        if (r <= 0) return null;
        return (
          <div key={x} style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${lerp(700, 0, r)}px)` }}>
            <div style={shadow(x, ROAD.floor + 6, 160, 0.3)} />
            <Puck x={x} y={(postTop + ROAD.floor) / 2} w={44} h={ROAD.floor - postTop} d={44} r={14} front={G_INK} side="#111" />
            <Puck x={x} y={ROAD.boardY} w={ROAD.boardW} h={ROAD.boardH} d={60} r={30} front={G_WHITE} side="#9a9a9a">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <div style={label(COLORS.grayText, 26)}>{`STAGE ${i + 1}`}</div>
                <div style={line(50, COLORS.ink)}>{SIGNS[i]}</div>
              </div>
            </Puck>
          </div>
        );
      })}
      {/* the LILLY flag plants on top of the first sign */}
      {F.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${ROAD.xs[0]}px ${boardTop}px`, transform: `${z(40)}translateY(${F.dy}px) scale(${F.sx}, ${F.sy})` }}>
          <div style={{ ...abs(ROAD.xs[0] - 6, boardTop - 230), width: 12, height: 230, borderRadius: 6, background: "#1c1c1c" }} />
          <Puck x={ROAD.xs[0] + 6 + 110} y={boardTop - 175} w={220} h={100} d={20} r="8px 30px 30px 8px" front={G_INK} side="#111">
            <div style={label(COLORS.paper, 36)}>LILLY</div>
          </Puck>
        </div>
      ) : null}
      <Scatter x={ROAD.xs[0]} y={boardTop} t={tF} seed={52} n={6} color={COLORS.paper} zz={60} />
      <div style={{ ...abs(ROAD.xs[3] - 300, ROAD.boardY + ROAD.boardH / 2 + 40), width: 600, display: "flex", justifyContent: "center", transform: z(70) || undefined }}>
        {ms >= tP ? (
          <Print t={tP}><div style={{ padding: "12px 28px", borderRadius: 28, background: G_INK }}><div style={label(COLORS.paper, 34)}>NO PROGRAM DESCRIBED HERE</div></div></Print>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S23 (ink) — "Most of the $5.9 billion only exists if the science works, program by program."
// Settled: the bridge with three of five planks laid (hero) / the hanging $5.9B plate / ONLY IF THE SCIENCE WORKS.
// ══════════════════════════════════════════════════════════════════════════
export const BRIDGE = { deckY: 640, gapX0: 560, gapX1: 1360, plankW: 150, plankH: 72, plateY: 250 };

export const Bridge: React.FC<Win & { plate: Cued; only: Cued; p2: Cued; p3c: Cued }> = ({ from, to, plate, only, p2, p3c }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const tPl = at(plate, 139190, from);
  const tO = at(only, 140380, from, tPl + 600);
  const tP = [0, at(p2, 141990, from, tO + 700), 0];
  tP[2] = at(p3c, 142760, from, tP[1] + 500);
  if (ms < from || ms > to + 320) return null;

  const rise = ms < from + 150 ? 0 : sp(from + 150, 12, 170);
  const slot = (i: number) => BRIDGE.gapX0 + 80 + i * 160;
  const plankAt = (i: number) => (i === 0 ? rise : ms < tP[i] - 300 ? 0 : sp(tP[i] - 300, 11, 180));
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {rise > 0 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${lerp(520, 0, rise)}px)` }}>
          {/* the two cliffs */}
          <Puck x={(160 + BRIDGE.gapX0) / 2} y={BRIDGE.deckY + 200} w={BRIDGE.gapX0 - 160} h={400} d={160} r="30px 30px 0 0" front={G_STONE} side="#7d7d7d" />
          <Puck x={(BRIDGE.gapX1 + 1760) / 2} y={BRIDGE.deckY + 200} w={1760 - BRIDGE.gapX1} h={400} d={160} r="30px 30px 0 0" front={G_STONE} side="#7d7d7d" />
        </div>
      ) : null}
      {/* the planks: one spans at the start, the next two slide up into place program by program */}
      {[0, 1, 2].map((i) => {
        const p = plankAt(i);
        if (p <= 0) return null;
        return (
          <div key={i} style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${lerp(600, 0, p)}px)` }}>
            <Puck x={slot(i)} y={BRIDGE.deckY + BRIDGE.plankH / 2} w={BRIDGE.plankW} h={BRIDGE.plankH} d={150} r={14} front={G_WHITE} side="#9a9a9a">
              {i > 0 ? <div style={label(COLORS.ink, 24)}>PROGRAM</div> : null}
            </Puck>
          </div>
        );
      })}
      {[1, 2].map((i) => <Scatter key={i} x={slot(i)} y={BRIDGE.deckY} t={tP[i]} seed={54 + i} n={5} color={COLORS.paper} zz={60} />)}
      {ms >= tPl - 420 ? <HangPlate y={BRIDGE.plateY} dy={hangDy(ms, tPl)} zz={z(30)} /> : null}
      <div style={{ ...abs(0, BRIDGE.plateY + 110), width: 1920, display: "flex", justifyContent: "center", transform: z(40) || undefined }}>
        {ms >= tO ? (
          <Print t={tO}><div style={{ padding: "12px 28px", borderRadius: 28, background: COLORS.paper }}><div style={label(COLORS.ink, 34)}>ONLY IF THE SCIENCE WORKS</div></div></Print>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S24 (paper) — "And the equity matters. Lilly is not only a partner. It is also an investor in the company whose
// platform it is betting on."   Settled: LILLY + orb joined by the PARTNER rod, EQUITY coin on the orb, red stake
// slice (hero) / INVESTOR plate.
// ══════════════════════════════════════════════════════════════════════════
export const INV = { floor: 790, lillyX: 600, orbX: 1300, orbR: 160, rodY: 660 };

export const Investor: React.FC<Win & { equity: Cued; partner: Cued; investor: Cued }> = ({ from, to, equity, partner, investor }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const drop = useDropX();
  const tE = at(equity, 144740, from);
  const tPa = at(partner, 147390, from, tE + 800);
  const tI = at(investor, 148940, from, tPa + 700);
  if (ms < from || ms > to + 320) return null;

  const rise = ms < tE - 350 ? 0 : sp(tE - 350, 11, 160);
  const rodP = EASE(k(tPa - 200, 520));
  const rodX0 = INV.lillyX + 165, rodX1 = INV.orbX - INV.orbR + 10;
  const orbY = INV.floor - INV.orbR;
  const coinR = 70;
  const coinTopY = orbY - INV.orbR - coinR + 6;
  const C = drop(tI - 320, 640, 320);
  const slice = ms >= tI ? clamp01((ms - tI) / 260) : 0;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {rise > 0 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${lerp(500, 0, rise)}px)` }}>
          <div style={shadow(INV.lillyX, INV.floor + 6, 340, 0.22)} />
          <div style={shadow(INV.orbX, INV.floor + 6, 300, 0.22)} />
          <LillyBlock x={INV.lillyX} y={INV.floor - 105} />
          <Orb x={INV.orbX} y={orbY} r={INV.orbR} />
          {/* Lilly's stake: a red slice lights on the orb's face as the equity coin lands */}
          {slice > 0 ? (
            <div style={{ ...abs(INV.orbX - INV.orbR, orbY - INV.orbR), width: INV.orbR * 2, height: INV.orbR * 2, borderRadius: "50%", transform: z(44) || undefined,
              background: `conic-gradient(from 20deg, #F4212D 0deg ${70 * slice}deg, transparent ${70 * slice}deg 360deg)`,
              WebkitMaskImage: "radial-gradient(circle, transparent 0 58%, #000 59%)", maskImage: "radial-gradient(circle, transparent 0 58%, #000 59%)" }} />
          ) : null}
        </div>
      ) : null}
      {/* the PARTNER rod extends from LILLY to the orb */}
      {rodP > 0 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: z(20) || undefined }}>
          <div style={{ ...abs(rodX0, INV.rodY - 30), width: (rodX1 - rodX0) * rodP, height: 60, borderRadius: 30, overflow: "hidden",
            background: "linear-gradient(180deg, #4a4a4a, #1a1a1a)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={label(COLORS.paper, 30)}>PARTNER</div>
          </div>
        </div>
      ) : null}
      {C.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${INV.orbX}px ${coinTopY + coinR}px`, transform: `${z(30)}translateY(${C.dy}px) scale(${C.sx}, ${C.sy})` }}>
          <Puck x={INV.orbX} y={coinTopY} w={coinR * 2} h={coinR * 2} d={30} r="50%" front={G_STONE} side="#8f8f8f">
            <div style={label(COLORS.ink, 22)}>EQUITY</div>
          </Puck>
        </div>
      ) : null}
      <Scatter x={INV.orbX} y={coinTopY + coinR} t={tI} seed={58} n={6} color="#9a9a9a" zz={60} />
      <div style={{ ...abs(INV.orbX - 300, INV.floor + 24), width: 600, display: "flex", justifyContent: "center", transform: z(40) || undefined }}>
        {ms >= tI + 200 ? <Print t={tI + 200}><div style={label(COLORS.ink, 32)}>LILLY IS ALSO AN INVESTOR</div></Print> : null}
      </div>
    </AbsoluteFill>
  );
};
