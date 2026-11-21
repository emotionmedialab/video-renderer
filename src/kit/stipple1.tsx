// ─────────────────────────────────────────────────────────────────────────
// KIT · stipple1 — Lilly × Stipple Bio long-form, chunk 1 (0:00–0:31, "The headline" + "The terms" opening).
// V2 house style (MOTION-RULES §0): rounded solids (`Puck`), lit gradients, whole-word type, springs that stop.
//  S1 Ceiling   (ink)   — LILLY drops; the STIPPLE dot-orb rolls in; on "up to" a red $5.9B plate drops on two
//                         cables and bounces once, hanging high over an empty floor; "THE HEADLINE" prints under it.
//  S2 Unprinted (paper) — the headline plate (now ink) drops to one side; an empty number slot rises; on "neither"
//                         a red ? ball falls into the slot and squashes; NOT PUBLISHED prints on the slot base.
//  S3 Contract  (red)   — NOV 16 drops; a contract roll falls and unrolls; its title prints; a row of target rings
//                         and a row of drug shapes punch onto it (multi-target, multi-modality).
//  S4/S5 Money  (ink)   — a floor rises with LILLY and STIPPLE; the UPFRONT coin rolls out of LILLY to STIPPLE; the
//                         EQUITY coin arcs onto the orb; on "How big" both coins flip to "$ ?"; NOT DISCLOSED slams.
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, COLORS, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { EASE, fadeOut } from "./plusone";
import { label, line } from "./inovio";
import { Print, Slam } from "./ryb1b";
import { useP3, useZ } from "./camera";
import { Scatter, useDropX, useSpringX } from "./v2style";
import { G_INK, G_STONE, G_WHITE, Puck } from "./argenx1v2b";
import { G_RED, shadow } from "./summit1";
import { LineDrop } from "./jnjtype";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });

// ── the two parties ──
/** Lilly: a rounded ink block (centre x, centre y) */
export const LillyBlock: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <Puck x={x} y={y} w={330 * s} h={210 * s} d={90} r={44 * s} front={G_INK} side="#1b1b1b">
    <div style={label(COLORS.paper, 54 * s)}>LILLY</div>
  </Puck>
);
/** Stipple: a white orb covered in ink dots (stippling = drawing with dots), its name on a pill at the centre */
const DOTS = `radial-gradient(circle, #1c1c1c 0 3.6px, transparent 4.4px) 0 0/24px 24px, ${G_WHITE}`;
export const Orb: React.FC<{ x: number; y: number; r: number; rot?: number }> = ({ x, y, r, rot = 0 }) => (
  <Puck x={x} y={y} w={r * 2} h={r * 2} d={80} r="50%" front={DOTS} side="#9a9a9a" style={{ transform: `rotateZ(${rot}deg)` }}>
    <div style={{ transform: `rotateZ(${-rot}deg)`, padding: "10px 22px", borderRadius: 30, background: COLORS.paper, boxShadow: "0 4px 10px rgba(0,0,0,0.25)" }}>
      <div style={label(COLORS.ink, 30 * (r / 150))}>STIPPLE BIO</div>
    </div>
  </Puck>
);

// ══════════════════════════════════════════════════════════════════════════
// S1 (ink) — "Eli Lilly's new cancer deal with Stipple Bio is worth up to $5.9 billion. That is the headline."
// Settled: the red UP TO $5.9B plate hanging high (hero) / LILLY / STIPPLE on the empty floor below.
// ══════════════════════════════════════════════════════════════════════════
export const CEIL = { floor: 840, lillyX: 640, orbX: 1290, orbR: 150, plateY: 300, plateW: 940, plateH: 210, cableX: 380 };

export const Ceiling: React.FC<Win & { lilly: Cued; stipple: Cued; upto: Cued; fig: Cued; headline: Cued }> = ({ from, to, lilly, stipple, upto, fig, headline }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const drop = useDropX();
  const tL = at(lilly, 130, from);
  const tS = at(stipple, 2070, from, tL + 700);
  const tUp = at(upto, 3360, from, tS + 400);
  const tFig = at(fig, 3820, from, tUp + 250);
  const tHead = at(headline, 6600, from, tFig + 900);
  if (ms < from || ms > to + 320) return null;

  const L = drop(Math.max(from, tL - 300), 620, 300);
  // the orb rolls in from the right edge and stops on "Stipple" (rotation = distance / radius)
  const rollP = EASE(k(tS - 750, 750));
  const orbX = lerp(2250, CEIL.orbX, rollP);
  const orbRot = (-(2250 - orbX) / CEIL.orbR) * (180 / Math.PI);
  // the plate falls on its cables from above the frame, lands on "$5.9", dips once on the cables and stops
  const fallP = clamp01((ms - tUp) / Math.max(1, tFig - tUp));
  const e = ms - tFig;
  const dip = e < 0 ? 0 : 44 * Math.exp(-e / 170) * Math.sin(e / 65);
  const plateDy = ms < tFig ? -980 * (1 - fallP * fallP) : dip;
  const lillyY = CEIL.floor - 105;
  const orbY = CEIL.floor - CEIL.orbR;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {/* the floor line the two parties stand on: nothing paid sits on it */}
      {L.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${CEIL.lillyX}px ${CEIL.floor}px`, transform: `translateY(${L.dy}px) scale(${L.sx}, ${L.sy})` }}>
          <div style={shadow(CEIL.lillyX, CEIL.floor + 6, 340, 0.5)} />
          <LillyBlock x={CEIL.lillyX} y={lillyY} />
        </div>
      ) : null}
      <Scatter x={CEIL.lillyX} y={CEIL.floor} t={Math.max(from, tL - 300) + 300} seed={2} n={7} color="#9a9a9a" zz={60} />
      {rollP > 0 ? (
        <div style={{ position: "absolute", inset: 0, ...p3 }}>
          <div style={shadow(orbX, CEIL.floor + 6, 260, 0.5)} />
          <Orb x={orbX} y={orbY} r={CEIL.orbR} rot={orbRot} />
        </div>
      ) : null}

      {/* the hanging plate: two cables run up out of the frame; the plate never touches the floor */}
      {ms >= tUp ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(40)}translateY(${plateDy}px)` }}>
          {[-1, 1].map((sgn) => (
            <div key={sgn} style={{ ...abs(960 + sgn * CEIL.cableX - 3, CEIL.plateY - CEIL.plateH / 2 - 1600), width: 6, height: 1600, background: "#bdbdbd", borderRadius: 3 }} />
          ))}
          <Puck x={960} y={CEIL.plateY} w={CEIL.plateW} h={CEIL.plateH} d={60} r={40} front={G_RED} side="#8f0e15">
            <div style={{ display: "flex", alignItems: "baseline", gap: 28 }}>
              <div style={label(COLORS.paper, 46)}>UP TO</div>
              <div style={line(150, COLORS.paper)}>$5.9B</div>
            </div>
          </Puck>
          {/* the headline strip printed on the plate's under-edge */}
          <div style={{ ...abs(960 - 200, CEIL.plateY + CEIL.plateH / 2 + 18), width: 400, display: "flex", justifyContent: "center", transform: z(32) || undefined }}>
            {ms >= tHead ? (
              <Print t={tHead}>
                <div style={{ padding: "10px 26px", borderRadius: 26, background: COLORS.paper }}>
                  <div style={label(COLORS.ink, 30)}>THE HEADLINE</div>
                </div>
              </Print>
            ) : null}
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S2 (paper) — "The number that matters is the one neither company published."
// Settled: the empty slot holding the red ? (hero) / the small ink $5.9B HEADLINE plate / NOT PUBLISHED.
// ══════════════════════════════════════════════════════════════════════════
export const SLOT = { x: 1180, floor: 820, w: 560, h: 380, plateX: 560, plateY: 470, ballR: 96 };

export const Unprinted: React.FC<Win & { plate: Cued; slot: Cued; ball: Cued; printed: Cued }> = ({ from, to, plate, slot, ball, printed }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const drop = useDropX();
  const sp = useSpringX();
  const tP = at(plate, 7580, from);
  const tSlot = at(slot, 8693, from, tP + 600);
  const tBall = at(ball, 10400, from, tSlot + 700);
  const tPr = at(printed, 11070, from, tBall + 400);
  if (ms < from || ms > to + 320) return null;

  const P = drop(tP - 250, 700, 300);
  const rise = ms < tSlot - 300 ? 0 : sp(tSlot - 300, 11, 170);
  const slotTop = SLOT.floor - SLOT.h;
  const B = drop(tBall - 330, 900, 330);
  const ballY = slotTop + SLOT.h / 2 - 10;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {/* the headline, demoted: the same plate, ink now (the red moves to the missing number, K3) */}
      {P.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${SLOT.plateX}px ${SLOT.plateY + 70}px`, transform: `translateY(${P.dy}px) scale(${P.sx}, ${P.sy})` }}>
          <div style={shadow(SLOT.plateX, SLOT.plateY + 90, 420, 0.22)} />
          <Puck x={SLOT.plateX} y={SLOT.plateY} w={480} h={140} d={50} r={30} front={G_INK} side="#1b1b1b">
            <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
              <div style={label(COLORS.paper, 30)}>UP TO</div>
              <div style={line(92, COLORS.paper)}>$5.9B</div>
            </div>
          </Puck>
          <div style={{ ...abs(SLOT.plateX - 200, SLOT.plateY + 86), width: 400, textAlign: "center", ...label(COLORS.grayText, 30) }}>THE HEADLINE</div>
        </div>
      ) : null}

      {/* the empty slot: a white stone frame with a deep ink well, rising out of the card floor */}
      {rise > 0 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${lerp(520, 0, rise)}px)` }}>
          <div style={shadow(SLOT.x, SLOT.floor + 8, SLOT.w * 1.02, 0.25)} />
          <Puck x={SLOT.x} y={SLOT.floor - SLOT.h / 2} w={SLOT.w} h={SLOT.h} d={110} r={44} front={G_STONE} side="#a9a9a9" />
          <div style={{ position: "absolute", inset: 0, ...p3, transform: z(56) || undefined }}>
            <div style={{ ...abs(SLOT.x - 210, slotTop + 40), width: 420, height: 250, borderRadius: 34,
              background: "linear-gradient(180deg, #050505 0%, #2a2a2a 100%)", boxShadow: "inset 0 18px 30px rgba(0,0,0,0.8)" }} />
            <div style={{ ...abs(SLOT.x - 260, slotTop + 306), width: 520, display: "flex", justifyContent: "center" }}>
              {ms >= tPr ? <Print t={tPr}><div style={label(COLORS.ink, 34)}>NOT PUBLISHED</div></Print> : null}
            </div>
          </div>
        </div>
      ) : null}

      {/* the ? ball falls into the well and squashes on its floor */}
      {B.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(80)}translateY(${B.dy}px)` }}>
          <div style={{ ...abs(SLOT.x - SLOT.ballR, ballY - SLOT.ballR), width: SLOT.ballR * 2, height: SLOT.ballR * 2, transformOrigin: "50% 100%",
            transform: `scale(${B.sx}, ${B.sy})`, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #ff7a80 0%, #F4212D 55%, #a8101a 100%)",
            display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 24px rgba(0,0,0,0.4)" }}>
            <div style={line(120, COLORS.paper)}>?</div>
          </div>
        </div>
      ) : null}
      <Scatter x={SLOT.x} y={ballY + SLOT.ballR} t={tBall} seed={4} n={7} color="#F4212D" zz={90} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S3 (red) — "On November 16, Stipple announced a research collaboration and license agreement with Lilly,
// covering multiple targets and multiple types of drugs."
// Settled: the unrolled contract (hero) with its title, a row of target rings and a row of drug shapes.
// ══════════════════════════════════════════════════════════════════════════
export const DOC = { x: 960, top: 150, w: 1040, h: 700, rollH: 60 };

const Ring: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <div style={{ ...abs(x - r, y - r), width: r * 2, height: r * 2, borderRadius: "50%", border: `${r * 0.22}px solid #111`, boxSizing: "border-box",
    display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ width: r * 0.5, height: r * 0.5, borderRadius: "50%", background: "#111" }} />
  </div>
);
// three drug types in silhouette: an antibody (Y), a conjugate capsule, a small-molecule hexagon
const Shape: React.FC<{ kind: number; x: number; y: number }> = ({ kind, x, y }) => (
  <svg width={120} height={120} viewBox="0 0 120 120" style={abs(x - 60, y - 60)}>
    {kind === 0 ? (
      <g stroke="#111" strokeWidth={16} strokeLinecap="round" fill="none"><path d="M60 110 V62 M60 62 L26 20 M60 62 L94 20" /></g>
    ) : kind === 1 ? (
      <g><rect x={14} y={38} width={92} height={44} rx={22} fill="#111" /><circle cx={98} cy={60} r={16} fill="#F4212D" stroke="#111" strokeWidth={6} /></g>
    ) : (
      <polygon points="60,12 101,36 101,84 60,108 19,84 19,36" fill="none" stroke="#111" strokeWidth={14} strokeLinejoin="round" />
    )}
  </svg>
);

export const Contract: React.FC<Win & { date: Cued; announced: Cued; title: Cued; targets: Cued; drugs: Cued }> = ({ from, to, date, announced, title, targets, drugs }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const drop = useDropX();
  const tD = at(date, 12386, from);
  const tA = at(announced, 13760, from, tD + 600);
  const tT = at(title, 14370, from, tA + 400);
  const tTg = at(targets, 17902, from, tT + 900);
  const tDr = at(drugs, 19110, from, tTg + 600);
  if (ms < from || ms > to + 320) return null;

  const dateOut = EASE(k(tA - 100, 360)); //          the date is a lead-in: it lifts away as the roll falls
  const R = drop(tA - 320, 760, 320); //                the roll lands at the top seat
  const unroll = EASE(k(tA, 720)); //                   then unrolls down: the sheet grows, the roll travels with it
  const sheetH = DOC.h * unroll;
  const rows = [{ y: DOC.top + 330, t: tTg, lab: "MULTIPLE TARGETS" }, { y: DOC.top + 520, t: tDr, lab: "MULTIPLE DRUG TYPES" }];
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {dateOut < 1 ? (
        <div style={{ ...abs(0, 420), width: 1920, display: "flex", justifyContent: "center", transform: `${z(40)}translateY(${-640 * dateOut * dateOut}px)` }}>
          <LineDrop text="NOV 16" t={tD - 220} size={200} color={COLORS.paper} />
        </div>
      ) : null}

      {R.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${R.dy}px)` }}>
          {/* the sheet: a thin white slab growing down from the top seat */}
          {sheetH > 2 ? (
            <Puck x={DOC.x} y={DOC.top + sheetH / 2} w={DOC.w} h={sheetH} d={14} r={18} front={G_WHITE} side="#bdbdbd" style={{ alignItems: "flex-start" }} />
          ) : null}
          {/* everything printed on the sheet sits just in front of its face */}
          <div style={{ position: "absolute", inset: 0, ...p3, transform: z(12) || undefined, clipPath: `inset(0 0 ${1080 - (DOC.top + sheetH)}px 0)` }}>
            <div style={{ ...abs(DOC.x - DOC.w / 2, DOC.top + 70), width: DOC.w, display: "flex", justifyContent: "center" }}>
              {ms >= tT ? <Print t={tT}><div style={line(54, COLORS.ink)}>Research collaboration + license</div></Print> : null}
            </div>
            <div style={{ ...abs(DOC.x - DOC.w / 2 + 80, DOC.top + 170), width: DOC.w - 160, height: 4, borderRadius: 2, background: "#d9d9d9" }} />
            {rows.map((rw, ri) => (
              <React.Fragment key={ri}>
                <div style={{ ...abs(DOC.x - DOC.w / 2 + 80, rw.y - 18), ...label(COLORS.grayText, 30), opacity: ms >= rw.t ? 1 : 0 }}>{rw.lab}</div>
                {[0, 1, 2].map((i) => {
                  const d = drop(rw.t - 240 + i * 110, 260, 240);
                  if (!d.on) return null;
                  const x = DOC.x - 10 + i * 190;
                  return (
                    <div key={i} style={{ position: "absolute", inset: 0, transformOrigin: `${x}px ${rw.y + 55}px`, transform: `translateY(${d.dy}px) scale(${d.sx}, ${d.sy})` }}>
                      {ri === 0 ? <Ring x={x} y={rw.y} r={52} /> : <Shape kind={i} x={x} y={rw.y} />}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
          {/* the roll rides the sheet's bottom edge */}
          <Puck x={DOC.x} y={DOC.top + sheetH} w={DOC.w + 60} h={DOC.rollH} d={60} r={30} front="linear-gradient(180deg, #ffffff 0%, #e3e3e3 45%, #9f9f9f 100%)" side="#8a8a8a" />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S4 (ink) — "Here is the money, in order. Stipple gets an upfront payment, and Lilly makes an equity investment
// in the company."  S5 (same block) — "How big either one is has not been disclosed."
// Settled S4: the orb with the UPFRONT coin at its side and the EQUITY coin on top (hero) / LILLY.
// Settled S5: the same, both coins flipped to "$ ?" (hero) / LILLY / NOT DISCLOSED plate.
// ══════════════════════════════════════════════════════════════════════════
export const MONEY = { floor: 770, lillyX: 560, orbX: 1330, orbR: 160, coinR: 88, upX0: 640, upX: 1080, eqX0: 560, eqY0: 520 };

export const Coin: React.FC<{ x: number; y: number; r: number; face: string; flip: number; rot?: number; sq?: [number, number] }> = ({ x, y, r, face, flip, rot = 0, sq = [1, 1] }) => {
  // flip 0→1: 0→90° shows the front, 90→0° shows the back (pre-rotated, never mirrored)
  const back = flip >= 0.5;
  const ry = back ? lerp(-90, 0, (flip - 0.5) * 2) : lerp(0, 90, flip * 2);
  return (
    <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transformOrigin: `${x}px ${y + r}px`, transform: `scale(${sq[0]}, ${sq[1]})` }}>
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transformOrigin: `${x}px ${y}px`, transform: `rotateY(${ry}deg) rotateZ(${back ? 0 : rot}deg)` }}>
        <Puck x={x} y={y} w={r * 2} h={r * 2} d={34} r="50%" front={G_WHITE} side="#8f8f8f">
          {back ? <div style={line(r * 0.72, COLORS.ink)}>$ ?</div> : <div style={label(COLORS.ink, r * 0.27)}>{face}</div>}
        </Puck>
      </div>
    </div>
  );
};

export const Money: React.FC<Win & { money: Cued; upfront: Cued; equity: Cued; big: Cued; not: Cued }> = ({ from, to, money, upfront, equity, big, not }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const drop = useDropX();
  const tM = at(money, 21810, from);
  const tUp = at(upfront, 23940, from, tM + 800);
  const tEq = at(equity, 26080, from, tUp + 900);
  const tBig = at(big, 28720, from, tEq + 900);
  const tNot = at(not, 30070, from, tBig + 700);
  if (ms < from || ms > to + 320) return null;

  const rise = ms < tM - 350 ? 0 : sp(tM - 350, 11, 160);
  const platY = lerp(560, 0, rise);
  // UPFRONT coin: rolls out from behind LILLY and stops against the orb on "upfront"
  const ROLL = 820;
  const rollP = EASE(k(tUp - ROLL, ROLL));
  const upX = lerp(MONEY.upX0, MONEY.upX, rollP);
  const upRot = 360 * rollP; //                         one full turn, so the label lands upright
  const upY = MONEY.floor - MONEY.coinR;
  // EQUITY coin: hops from LILLY's top in an arc and lands on top of the orb on "equity"
  const HOP = 760;
  const hopP = clamp01((ms - (tEq - HOP)) / HOP);
  const eqTopY = MONEY.floor - MONEY.orbR * 2 - MONEY.coinR + 6;
  const eqX = lerp(MONEY.eqX0, MONEY.orbX, EASE(hopP));
  const eqY = lerp(MONEY.eqY0, eqTopY, hopP) - 300 * Math.sin(Math.PI * hopP);
  const eqSq = ms >= tEq ? 1 - sp(tEq, 7, 210, 0.6) : 0;
  // S5: both coins flip to "$ ?" (the second 140ms behind the first: one action)
  const f1 = EASE(k(tBig, 560));
  const f2 = EASE(k(tBig + 140, 560));
  const lillyY = MONEY.floor - 105;
  const orbY = MONEY.floor - MONEY.orbR;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {rise > 0 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${platY}px)` }}>
          {/* the floor slab both parties stand on */}
          <Puck x={960} y={MONEY.floor + 40} w={1400} h={80} d={140} r={40} front={G_STONE} side="#7d7d7d" />
          {/* the UPFRONT coin sits BEHIND Lilly at rest, so it rolls out from it */}
          {rollP > 0 ? <div style={{ position: "absolute", inset: 0, ...p3, transform: z(-30) || undefined }}>
            <Coin x={upX} y={upY} r={MONEY.coinR} face="UPFRONT" flip={f1} rot={upRot} />
          </div> : null}
          <LillyBlock x={MONEY.lillyX} y={lillyY} />
          <Orb x={MONEY.orbX} y={orbY} r={MONEY.orbR} />
          {hopP > 0 ? (
            <div style={{ position: "absolute", inset: 0, ...p3, transform: z(20) || undefined }}>
              <Coin x={eqX} y={eqY} r={MONEY.coinR} face="EQUITY" flip={f2} sq={[1 + 0.18 * eqSq, 1 - 0.24 * eqSq]} />
            </div>
          ) : null}
        </div>
      ) : null}
      <Scatter x={MONEY.orbX} y={eqTopY + MONEY.coinR} t={tEq} seed={6} n={7} color={COLORS.paper} zz={60} />

      {/* NOT DISCLOSED: a straight red plate slams down over the two coins */}
      <div style={{ ...abs(960 - 500, 150), width: 1000, display: "flex", justifyContent: "center", transform: z(90) || undefined }}>
        <Slam t={tNot}>
          <div style={{ padding: "22px 54px", borderRadius: 34, background: G_RED, boxShadow: "0 16px 30px rgba(0,0,0,0.5)" }}>
            <div style={line(84, COLORS.paper)}>NOT DISCLOSED</div>
          </div>
        </Slam>
      </div>
    </AbsoluteFill>
  );
};
