// ─────────────────────────────────────────────────────────────────────────
// KIT · stipple2 — Lilly × Stipple Bio long-form, chunk 2 (0:31–0:57). V2 house style (MOTION-RULES §0).
//  S6 Steps    (paper) — the S1 $5.9B plate drops back on its cables (K1: same plate, same "UP TO"); a PROGRAM
//                        puck lands on the empty floor on "conditional"; three milestone steps rise one per
//                        word; the puck hops onto step 1; one ink coin drops from the plate onto it.
//  S7 Tiers    (red)   — three rounded royalty tiers telescope up out of their base; a PRODUCT carton drops on top.
//  S8 Globe    (ink)   — a globe springs up; a red LILLY · EXCLUSIVE band drops onto its equator; the
//                        WORLDWIDE RIGHTS plate prints under it.
//  S9 NotADrug (paper) — a DRUG vial lands on a pedestal; on "not buying" it is knocked off and falls away;
//                        on "a way to find" a magnifying lens swings down onto the pedestal, a target in its glass.
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
import { G_RED, shadow, Vial } from "./summit1";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });

// ══════════════════════════════════════════════════════════════════════════
// S6 (paper) — "Everything after that is conditional. The $5.9 billion is the ceiling on research, development
// and commercial milestones, paid only as programs reach them."
// Settled: the three milestone steps (hero) / the $5.9B plate overhead / the PROGRAM puck + its coin on step 1.
// ══════════════════════════════════════════════════════════════════════════
export const STEPS = { floor: 880, xs: [690, 960, 1230], w: 270, hs: [140, 280, 420], plateY: 210, puckX0: 400, coinX: 760 };
const STEP_LAB = ["RESEARCH", "DEVELOPMENT", "COMMERCIAL"];

export const Steps: React.FC<Win & { plate: Cued; cond: Cued; s1: Cued; s2: Cued; s3: Cued; hop: Cued; coin: Cued }> = ({ from, to, plate, cond, s1, s2, s3, hop, coin }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const drop = useDropX();
  const sp = useSpringX();
  const tP = at(plate, 31710, from);
  const tC = at(cond, 33120, from, tP + 700);
  const tS = [at(s1, 36800, from, tC + 900), 0, 0];
  tS[1] = at(s2, 37530, from, tS[0] + 400);
  tS[2] = at(s3, 38790, from, tS[1] + 400);
  const tHop = at(hop, 40360, from, tS[2] + 700);
  const tCoin = at(coin, 41300, from, tHop + 600);
  if (ms < from || ms > to + 320) return null;

  // the plate drops back in on its cables and dips once (the S1 move, reversed nothing: same seat on a new card)
  const fallP = clamp01((ms - (tP - 120)) / 520);
  const e = ms - (tP + 400);
  const plateDy = e < 0 ? -760 * (1 - fallP * fallP) : 34 * Math.exp(-e / 170) * Math.sin(e / 65);
  const puck = drop(tC - 300, 520, 300);
  // the puck hops from the floor onto step 1 (arc), squashing on landing
  const HOP = 560;
  const hp = clamp01((ms - (tHop - HOP + 160)) / HOP);
  const puckTop1 = STEPS.floor - STEPS.hs[0];
  const puckX = lerp(STEPS.puckX0, STEPS.xs[0] - 60, EASE(hp));
  const puckY = lerp(STEPS.floor, puckTop1, hp) - 170 * Math.sin(Math.PI * hp);
  const hopSq = hp >= 1 ? 1 - sp(tHop - HOP + 160 + HOP, 7, 210, 0.6) : 0;
  const coinD = drop(tCoin - 360, puckTop1 - STEPS.plateY - 60, 360);
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {ms >= tP - 120 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(40)}translateY(${plateDy}px)` }}>
          {[-1, 1].map((sgn) => (
            <div key={sgn} style={{ ...abs(960 + sgn * 300 - 3, STEPS.plateY - 80 - 1600), width: 6, height: 1600, background: "#9a9a9a", borderRadius: 3 }} />
          ))}
          <Puck x={960} y={STEPS.plateY} w={760} h={160} d={50} r={34} front={G_RED} side="#8f0e15">
            <div style={{ display: "flex", alignItems: "baseline", gap: 22 }}>
              <div style={label(COLORS.paper, 36)}>UP TO</div>
              <div style={line(112, COLORS.paper)}>$5.9B</div>
            </div>
          </Puck>
        </div>
      ) : null}

      {/* the three milestone steps rise out of the card floor, one per spoken word */}
      {STEPS.xs.map((x, i) => {
        const r = ms < tS[i] - 260 ? 0 : sp(tS[i] - 260, 11, 170);
        if (r <= 0) return null;
        const h = STEPS.hs[i];
        return (
          <div key={i} style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${lerp(h + 120, 0, r)}px)` }}>
            <Puck x={x} y={STEPS.floor - h / 2} w={STEPS.w - 8} h={h} d={120} r={22} front={G_STONE} side="#a3a3a3">
              <div style={{ position: "absolute", bottom: 26, left: 0, right: 0, textAlign: "center", ...label(COLORS.ink, 26) }}>{STEP_LAB[i]}</div>
            </Puck>
          </div>
        );
      })}

      {/* the PROGRAM puck: lands on the floor on "conditional", hops onto step 1 on "paid only" */}
      {puck.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(70)}translateY(${hp > 0 ? 0 : puck.dy}px)` }}>
          <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${puckX}px ${puckY}px`,
            transform: hp > 0 ? `scale(${1 + 0.16 * hopSq}, ${1 - 0.22 * hopSq})` : `scale(${puck.sx}, ${puck.sy})` }}>
            <Puck x={puckX} y={puckY - 36} w={150} h={72} d={40} r={36} front={G_INK} side="#1b1b1b">
              <div style={label(COLORS.paper, 24)}>PROGRAM</div>
            </Puck>
          </div>
        </div>
      ) : null}
      <Scatter x={STEPS.puckX0} y={STEPS.floor} t={tC} seed={8} n={6} color="#9a9a9a" zz={70} />

      {/* one coin drops from the plate onto step 1, beside the program that reached it */}
      {coinD.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(70)}translateY(${coinD.dy}px)` }}>
          <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${STEPS.coinX}px ${puckTop1}px`, transform: `scale(${coinD.sx}, ${coinD.sy})` }}>
            <Puck x={STEPS.coinX} y={puckTop1 - 52} w={104} h={104} d={26} r="50%" front={G_INK} side="#111">
              <div style={line(54, COLORS.paper)}>$</div>
            </Puck>
          </div>
        </div>
      ) : null}
      <Scatter x={STEPS.coinX} y={puckTop1} t={tCoin} seed={9} n={6} color="#555" zz={80} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S7 (red) — "On top of that, tiered royalties if a product is ever sold."
// Settled: the three-tier stack (hero) with the TIERED ROYALTIES base / the PRODUCT · IF SOLD carton on top.
// ══════════════════════════════════════════════════════════════════════════
export const TIERS = { x: 960, floor: 830, ws: [760, 560, 360], h: 110, cartonW: 220, cartonH: 170 };

export const Tiers: React.FC<Win & { tiered: Cued; product: Cued }> = ({ from, to, tiered, product }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const drop = useDropX();
  const sp = useSpringX();
  const tT = at(tiered, 43860, from);
  const tPr = at(product, 44760, from, tT + 650);
  if (ms < from || ms > to + 320) return null;

  // base springs up, then each tier telescopes up out of the one below (120ms apart: one action)
  const rise = (i: number) => (ms < tT - 300 + i * 120 ? 0 : sp(tT - 300 + i * 120, 11, 170));
  const topY = TIERS.floor - TIERS.h * 3;
  const C = drop(tPr - 320, 700, 320);
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {[0, 1, 2].map((i) => {
        const r = rise(i);
        if (r <= 0) return null;
        const y = TIERS.floor - TIERS.h * (i + 0.5);
        return (
          <div key={i} style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${lerp(TIERS.h * (i + 1) + 80, 0, r)}px)` }}>
            {i === 0 ? <div style={shadow(TIERS.x, TIERS.floor + 8, TIERS.ws[0] * 1.02, 0.35)} /> : null}
            <Puck x={TIERS.x} y={y} w={TIERS.ws[i]} h={TIERS.h - 6} d={150 - i * 20} r={50} front={G_WHITE} side="#a8a8a8">
              {i === 0 ? <div style={label(COLORS.ink, 34)}>TIERED ROYALTIES</div> : null}
            </Puck>
          </div>
        );
      })}
      {C.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(30)}translateY(${C.dy}px)` }}>
          <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${TIERS.x}px ${topY}px`, transform: `scale(${C.sx}, ${C.sy})` }}>
            <Puck x={TIERS.x} y={topY - TIERS.cartonH / 2} w={TIERS.cartonW} h={TIERS.cartonH} d={110} r={16} front={G_INK} side="#151515">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={label(COLORS.paper, 30)}>PRODUCT</div>
                <div style={label("rgba(255,255,255,0.7)", 24)}>IF SOLD</div>
              </div>
            </Puck>
          </div>
        </div>
      ) : null}
      <Scatter x={TIERS.x} y={topY} t={tPr} seed={10} n={7} color={COLORS.paper} zz={60} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S8 (ink) — "In return, Lilly gets exclusive worldwide rights to the products that come out of the collaboration."
// Settled: the globe with the red LILLY · EXCLUSIVE band (hero) / WORLDWIDE RIGHTS plate.
// ══════════════════════════════════════════════════════════════════════════
export const GLOBE = { x: 960, y: 450, r: 250, bandW: 700, bandH: 96 };
const GLOBE_FACE =
  `repeating-linear-gradient(0deg, transparent 0 58px, rgba(0,0,0,0.16) 58px 62px), ` +
  `radial-gradient(ellipse 34% 50% at 50% 50%, transparent 0 96%, rgba(0,0,0,0.16) 97% 100%, transparent 100%), ` +
  `radial-gradient(ellipse 70% 50% at 50% 50%, transparent 0 97%, rgba(0,0,0,0.16) 98% 100%, transparent 100%), ${G_WHITE}`;

export const Globe: React.FC<Win & { gets: Cued; excl: Cued; rights: Cued }> = ({ from, to, gets, excl, rights }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const tG = at(gets, 47717, from);
  const tE = at(excl, 48240, from, tG + 450);
  const tR = at(rights, 49220, from, tE + 600);
  if (ms < from || ms > to + 320) return null;

  const g = ms < tG - 380 ? 0 : sp(tG - 380, 10, 160);
  // the band falls from above IN FRONT of the globe (z), lands on its equator and dips once
  const fallP = clamp01((ms - (tE - 300)) / 300);
  const e = ms - tE;
  const bandDy = e < 0 ? -700 * (1 - fallP * fallP) : 30 * Math.exp(-e / 150) * Math.sin(e / 60);
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {g > 0 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${GLOBE.x}px ${GLOBE.y + GLOBE.r}px`, transform: `translateY(${lerp(700, 0, Math.min(1, g))}px) scale(${lerp(0.6, 1, g)})` }}>
          <Puck x={GLOBE.x} y={GLOBE.y} w={GLOBE.r * 2} h={GLOBE.r * 2} d={90} r="50%" front={GLOBE_FACE} side="#8a8a8a" />
        </div>
      ) : null}
      {ms >= tE - 300 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(80)}translateY(${bandDy}px)` }}>
          <Puck x={GLOBE.x} y={GLOBE.y} w={GLOBE.bandW} h={GLOBE.bandH} d={50} r={48} front={G_RED} side="#8f0e15">
            <div style={label(COLORS.paper, 40)}>LILLY · EXCLUSIVE</div>
          </Puck>
        </div>
      ) : null}
      <div style={{ ...abs(0, GLOBE.y + GLOBE.r + 50), width: 1920, display: "flex", justifyContent: "center", transform: z(40) || undefined }}>
        {ms >= tR ? (
          <Print t={tR}>
            <div style={{ padding: "14px 34px", borderRadius: 34, background: COLORS.paper }}>
              <div style={label(COLORS.ink, 36)}>WORLDWIDE RIGHTS · PRODUCTS FROM THE DEAL</div>
            </div>
          </Print>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S9 (paper) — "So Lilly is not buying a drug. It is buying a way to find targets."
// Settled: the magnifying lens standing on the pedestal, a red target in its glass (hero) / the pedestal.
// ══════════════════════════════════════════════════════════════════════════
export const PED = { x: 960, floor: 880, w: 460, h: 150, lensR: 150, handleH: 200 };

export const NotADrug: React.FC<Win & { drug: Cued; not: Cued; way: Cued }> = ({ from, to, drug, not, way }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const drop = useDropX();
  const sp = useSpringX();
  const tD = at(drug, 53110, from);
  const tN = at(not, 53680, from, tD + 450);
  const tW = at(way, 55840, from, tN + 1000);
  if (ms < from || ms > to + 320) return null;

  const pedTop = PED.floor - PED.h;
  const ped = ms < from + 200 ? 0 : sp(from + 200, 12, 170);
  const V = drop(tD - 330, 700, 330);
  // knocked off: slides right along the top, tips past the edge and falls out of the card (gravity)
  const kn = clamp01((ms - tN) / 900);
  const slide = EASE(clamp01(kn / 0.35)) * 330;
  const fall = clamp01((kn - 0.3) / 0.7);
  const vialX = PED.x + slide + 160 * fall;
  const vialDy = 1100 * fall * fall;
  const vialRot = 85 * EASE(clamp01((kn - 0.25) / 0.45));
  // the lens swings down from above on a hinge at its handle end and stands upright on the pedestal
  const sw = ms < tW - 420 ? 0 : sp(tW - 420, 9, 150);
  const lensCy = pedTop - PED.handleH - PED.lensR + 10;
  const useZOn = z(1) !== ""; //                      fly in from depth only when the 3D camera is on
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {ped > 0 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${lerp(320, 0, ped)}px)` }}>
          <div style={shadow(PED.x, PED.floor + 8, PED.w * 1.05, 0.22)} />
          <Puck x={PED.x} y={PED.floor - PED.h / 2} w={PED.w} h={PED.h} d={160} r={28} front={G_STONE} side="#a6a6a6" />
        </div>
      ) : null}
      {V.on && kn < 1 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(20)}translateY(${V.dy + vialDy}px)` }}>
          <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${PED.x + 100}px ${pedTop}px`, transform: `translateX(${vialX - PED.x}px) rotateZ(${vialRot}deg) scale(${V.sx}, ${V.sy})` }}>
            <Vial x={PED.x} base={pedTop} name="DRUG" />
          </div>
        </div>
      ) : null}
      {sw > 0 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${PED.x}px ${pedTop}px`, transform: `${useZOn ? `translateZ(${lerp(-1400, 30, Math.min(1, sw))}px) ` : ""}rotateZ(${lerp(-95, 0, sw)}deg)` }}>
          {/* handle */}
          <Puck x={PED.x} y={pedTop - PED.handleH / 2} w={56} h={PED.handleH} d={50} r={28} front={G_INK} side="#151515" />
          {/* rim */}
          <Puck x={PED.x} y={lensCy} w={PED.lensR * 2 + 50} h={PED.lensR * 2 + 50} d={56} r="50%" front={G_INK} side="#151515">
            <div style={{ width: PED.lensR * 2, height: PED.lensR * 2, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #ffffff 0%, #eef3f5 50%, #c9d3d7 100%)",
              display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 160, height: 160, borderRadius: "50%", border: `22px solid ${COLORS.accent}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: COLORS.accent }} />
              </div>
            </div>
          </Puck>
        </div>
      ) : null}
      <Scatter x={PED.x} y={pedTop} t={tW} seed={12} n={6} color="#9a9a9a" zz={60} />
    </AbsoluteFill>
  );
};
