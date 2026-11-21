// ─────────────────────────────────────────────────────────────────────────
// KIT · summit2 — Summit ivonescimab CRL long-form, chunk 2 (0:38–1:09.6, "The drug" + "The FDA's reasons").
//  S6 TwoAtOnce  (ink)   — IVONESCIMAB kinetic type; a Y antibody flies up from depth; PD-1 hangs from a T-cell
//                          membrane, VEGF floats in; on "at once" the antibody drives up and both arms clamp both.
//  S7 Plinths    (paper) — U.S. and China plinths rise; the vial bounces off the U.S. lid to the floor, hops onto
//                          China; APPROVED · MAY 2024 slams on China's face.
//  S8 ShortOfBar (ink)   — callback to S1's stand (same BAR seats): a lift carries the vial up, halts short on
//                          "not established"; the survival sign springs up over the bar (completing S1's tag).
//  S9 Balance    (red)   — a balance beam with a risk weight; the PFS weight drops on the benefit pan, the beam
//                          dips, then springs back to level on "could not".
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, useMs } from "./core";
import { at, lerp, type Cued, type Win } from "./elora";
import { EASE, fadeOut } from "./plusone";
import { label, line } from "./inovio";
import { Print, Slam } from "./ryb1b";
import { useP3, useZ } from "./camera";
import { Scatter, useDropX, useEnt, useSpringX } from "./v2style";
import { G_GREY, G_INK, G_STONE, G_WHITE, Puck } from "./argenx1v2b";
import { BAR, G_RED, Vial, WType, shadow } from "./summit1";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });
const deg = (r: number) => (r * 180) / Math.PI;

// ══════════════════════════════════════════════════════════════════════════
// S6 (ink) — "Ivonescimab is a bispecific antibody that blocks two targets at once, PD-1 and VEGF."
// Settled: antibody clamping both targets (hero) / name / the two target labels.
// ══════════════════════════════════════════════════════════════════════════
// v2 (Nel 2026-11-19, "i don't quite get this one"): no membrane, no dimer. Two plain target blocks, each with a
// socket in its underside; on "at once" both arm tips plug into the sockets and both targets go dark (BLOCKED).
export const AB = { x: 960, stemTop: 500, stemH: 230, stemW: 92, armL: 250, armW: 84, ang: 42, rise: 70 };
const TIP_DX = AB.armL * Math.sin((AB.ang * Math.PI) / 180);
const TIP_DY = AB.armL * Math.cos((AB.ang * Math.PI) / 180);
const TIP_Y = AB.stemTop - TIP_DY - AB.rise; //            arm tip height once plugged in (≈244)
export const TGT = { w: 290, h: 170, d: 120, sock: { w: 104, h: 54 }, zz: 30 };
export const HEADS: [number, number][] = [[AB.x - TIP_DX, TIP_Y + 46 - TGT.h / 2], [AB.x + TIP_DX, TIP_Y + 46 - TGT.h / 2]]; // block centres

export const TwoAtOnce: React.FC<Win & { name: Cued; bispecific: Cued; two: Cued; once: Cued }> = ({ from, to, name, bispecific, two, once }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const tName = at(name, 38000, from);
  const tBi = at(bispecific, 39310, from, tName + 900);
  const tTwo = at(two, 42060, from, tBi + 900);
  const tOnce = at(once, 43200, from, tTwo + 700);
  if (ms < from || ms > to + 320) return null;

  const abP = ent(tBi - 200, 700);
  const armP = ms < tBi + 150 ? 0 : sp(tBi + 150, 9, 180); //  the arms spring open off the stem
  const tgt = ent(tTwo, 600);
  const clamp = ms < tOnce - 150 ? 0 : sp(tOnce - 150, 10, 200); //  one move: the whole Y drives up into both targets
  const docked = ms >= tOnce + 100;
  const lift = -AB.rise * Math.min(1.08, clamp);
  const arm = (s: -1 | 1) => (
    <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${AB.x}px ${AB.stemTop}px`, transform: `rotateZ(${s * AB.ang * armP}deg)` }}>
      <Puck x={AB.x} y={AB.stemTop - AB.armL / 2} w={AB.armW} h={AB.armL} d={60} r={42} front={G_WHITE} side="#9a9a9a" clip>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 70, background: docked ? G_RED : "transparent" }} />
      </Puck>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {/* the name */}
      {/* seated at 720 so the crane (+40) and push-in (z130) keep it clear of the chrome band */}
      <div style={{ ...abs(0, 720), width: 1920, display: "flex", justifyContent: "center", transform: z(30) || undefined }}>
        <WType text="IVONESCIMAB" t={tName + 100} size={90} color={COLORS.paper} />
      </div>

      {/* the two targets: lit blocks with a socket in the underside; they go dark (BLOCKED) once plugged */}
      {ms >= tTwo ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(lerp(-1400, TGT.zz, tgt))}translateY(${lerp(-260, 0, tgt)}px)` }}>
          {(["PD-1", "VEGF"] as const).map((name, i) => (
            <Puck key={name} x={HEADS[i][0]} y={HEADS[i][1]} w={TGT.w} h={TGT.h} d={TGT.d} r={30} front={docked ? G_INK : G_STONE} side={docked ? "#111" : "#8f8f8f"}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: -36 }}>
                <div style={line(58, docked ? COLORS.paper : COLORS.ink)}>{name}</div>
                <div style={{ height: 30 }}>{docked ? <Print t={tOnce + 100}><div style={label("rgba(255,255,255,0.8)", 26)}>BLOCKED</div></Print> : null}</div>
              </div>
              <div style={{ position: "absolute", left: (TGT.w - TGT.sock.w) / 2, bottom: 0, width: TGT.sock.w, height: TGT.sock.h, borderRadius: `${TGT.sock.w / 2}px ${TGT.sock.w / 2}px 0 0`,
                background: docked ? "#000" : "linear-gradient(180deg,#2a2a2a,#555)" }} />
            </Puck>
          ))}
        </div>
      ) : null}

      {/* the antibody: flies up from depth, arms spring open, then drives up into both targets at once */}
      {ms >= tBi - 200 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(lerp(-2400, 40, abP))}translateY(${lerp(500, 0, abP) + lift}px)` }}>
          {arm(-1)}
          {arm(1)}
          <Puck x={AB.x} y={AB.stemTop + AB.stemH / 2 - 20} w={AB.stemW} h={AB.stemH} d={64} r={44} front={G_WHITE} side="#9a9a9a" />
        </div>
      ) : null}
      <Scatter x={HEADS[0][0]} y={HEADS[0][1] + TGT.h / 2} t={tOnce + 100} seed={12} color={COLORS.accent} zz={TGT.zz + TGT.d / 2} />
      <Scatter x={HEADS[1][0]} y={HEADS[1][1] + TGT.h / 2} t={tOnce + 100} seed={13} color={COLORS.accent} zz={TGT.zz + TGT.d / 2} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S7 (paper) — "No drug of that kind is approved in the U.S. It has been approved in China since May 2024."
// Settled: the vial on the China plinth (hero) / plinth labels / APPROVED · MAY 2024 plate.
// ══════════════════════════════════════════════════════════════════════════
export const PLI = { us: 640, cn: 1280, floor: 820, w: 380, h: 300, d: 120, vs: 0.7, gapX: 960 };
const PTOP = PLI.floor - PLI.h; //                       520

export const Plinths: React.FC<Win & { rise: Cued; us: Cued; hop: Cued; since: Cued }> = ({ from, to, rise, us, hop, since }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const tRise = at(rise, 45570, from);
  const tUs = at(us, 47721, from, tRise + 900);
  const tHop = at(hop, 48930, from, tUs + 900);
  const tSince = at(since, 50130, from, tHop + 800);
  if (ms < from || ms > to + 320) return null;

  const up = ent(tRise, 650);
  // vial path: fall onto the U.S. lid → bounce off to the floor between the plinths → hop up onto China
  const FALL = 380, BOUNCE = 560, HOP = 700;
  let vx = PLI.us, vb = -400, sq = 0;
  if (ms >= tUs - FALL) {
    if (ms < tUs) { const p = (ms - (tUs - FALL)) / FALL; vb = lerp(-400, PTOP, p * p); }
    else if (ms < tUs + BOUNCE) { const p = (ms - tUs) / BOUNCE; vx = lerp(PLI.us, PLI.gapX, p); vb = lerp(PTOP, PLI.floor, p) - 220 * 4 * p * (1 - p); sq = ms < tUs + 120 ? Math.sin((Math.PI * (ms - tUs)) / 120) : 0; }
    else if (ms < tHop) { vx = PLI.gapX; vb = PLI.floor; const q = ms - (tUs + BOUNCE); sq = q < 160 ? 0.7 * Math.sin((Math.PI * q) / 160) : 0; }
    else if (ms < tHop + HOP) { const p = EASE((ms - tHop) / HOP); vx = lerp(PLI.gapX, PLI.cn, p); vb = lerp(PLI.floor, PTOP, p) - 260 * 4 * p * (1 - p); }
    else { vx = PLI.cn; vb = PTOP; const q = ms - (tHop + HOP); sq = q < 180 ? 0.8 * Math.sin((Math.PI * q) / 180) : 0; }
  }
  const plinth = (x: number, name: string, sub: string, lid: boolean) => (
    <>
      <div style={shadow(x, PLI.floor + 10, PLI.w * 1.05, 0.2)} />
      <Puck x={x} y={PLI.floor - PLI.h / 2} w={PLI.w} h={PLI.h} d={PLI.d} r={30} front={G_INK} side="#111">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginTop: -70 }}>
          <div style={line(78, COLORS.paper)}>{name}</div>
          {sub.split("\n").map((s) => <div key={s} style={label("rgba(255,255,255,0.7)", 26)}>{s}</div>)}
        </div>
      </Puck>
      {/* the top: the U.S. carries a shut lid; China an open cradle */}
      <Puck x={x} y={PTOP - 10} w={lid ? PLI.w - 30 : 220} h={20} d={PLI.d - 10} r={10} front={lid ? G_GREY : G_STONE} side={lid ? "#4a4a4a" : "#9a9a9a"} />
    </>
  );
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(lerp(-1600, 0, up))}translateY(${lerp(600, 0, up)}px)` }}>
        {plinth(PLI.us, "U.S.", "NONE OF THIS KIND\nAPPROVED", true)}
        {plinth(PLI.cn, "China", "APPROVED", false)}
        <div style={{ ...abs(PLI.cn - 200, PLI.floor - 120), width: 400, display: "flex", justifyContent: "center", transform: z(PLI.d / 2 + 6) || undefined }}>
          <Slam t={tSince}>
            <div style={{ background: G_RED, borderRadius: 18, padding: "10px 24px" }}><div style={line(44, COLORS.paper)}>MAY 2024</div></div>
          </Slam>
        </div>
      </div>
      {vb > -400 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: z(PLI.d / 2 - 20) || undefined }}>
          <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${vx}px ${vb}px`, transform: `scale(${1 + 0.18 * sq}, ${1 - 0.22 * sq})` }}>
            <Vial x={vx} base={vb} s={PLI.vs} />
          </div>
        </div>
      ) : null}
      <Scatter x={PLI.us} y={PTOP} t={tUs} seed={14} color="#6b6b6b" zz={PLI.d / 2} />
      <Scatter x={PLI.cn} y={PTOP} t={tHop + HOP} seed={15} color={COLORS.accent} zz={PLI.d / 2} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S8 (ink) — "According to Summit, the FDA found that substantial evidence of effectiveness was not established,
// without a statistically significant improvement in overall survival."
// Callback (K1/K2): S1's stand on the SAME seats; the vial is lifted toward the red bar and stops short; the
// survival sign springs UP over the bar (S1's tag swung down; here it completes as the reason).
// Settled: stand + red bar + vial on the lift (hero) / lift label / survival sign.
// ══════════════════════════════════════════════════════════════════════════
const SLAB_TOP = BAR.floor - BAR.slabH / 2; //          777
const LIFT = { w: 300, d: 80, topHigh: 640, topLow: 690 };

export const ShortOfBar: React.FC<Win & { found: Cued; evidence: Cued; not: Cued; stat: Cued }> = ({ from, to, found, evidence, not, stat }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const tFound = at(found, 53340, from);
  const tEv = at(evidence, 54100, from, tFound + 600);
  const tNot = at(not, 56450, from, tEv + 1200);
  const tStat = at(stat, 57970, from, tNot + 800);
  if (ms < from || ms > to + 320) return null;

  const standP = ent(tFound - 300, 600);
  const raise = ms < tEv ? 0 : sp(tEv, 14, 60, 1.2); //            a slow, heavy climb
  const sinkP = ms < tNot ? 0 : sp(tNot, 7, 200, 0.7);
  const top = lerp(SLAB_TOP, LIFT.topHigh, Math.min(1.02, raise)) + (LIFT.topLow - LIFT.topHigh) * sinkP;
  const sign = ms < tStat ? 0 : sp(tStat, 8, 150);
  const postH = BAR.floor - BAR.slabH / 2 - BAR.postTop;
  const liftH = Math.max(0, SLAB_TOP - top);
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(lerp(-1800, 0, standP))}translateY(${lerp(700, 0, standP)}px)` }}>
        <div style={shadow(960, BAR.floor + 30, 1000)} />
        <Puck x={960} y={BAR.floor} w={1000} h={BAR.slabH} d={90} r={23} front={G_STONE} side="#8f8f8f"><div style={label(COLORS.ink, 30)}>FDA</div></Puck>
        {BAR.postX.map((x) => (
          <Puck key={x} x={x} y={BAR.postTop + postH / 2} w={BAR.postW} h={postH} d={46} r={23} front={G_WHITE} side="#9a9a9a" />
        ))}
        {BAR.postX.map((x) => (
          <Puck key={`p${x}`} x={x + (x < 960 ? 34 : -34)} y={BAR.high + BAR.barH / 2 + 8} w={30} h={16} d={30} r={8} front={G_GREY} side="#5a5a5a" />
        ))}
        <Puck x={960} y={BAR.high} w={BAR.barW} h={BAR.barH} d={40} r={20} front={G_RED} side="#8f0e15" />
        {/* the survival sign springs up over the bar, hinged on its top edge */}
        {sign > 0 ? (
          <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `960px ${BAR.high - BAR.barH / 2}px`, transform: `${z(10)}rotateX(${lerp(88, 0, sign)}deg)` }}>
            {[-150, 150].map((dx) => (
              <div key={dx} style={{ ...abs(960 + dx - 3, BAR.high - BAR.barH / 2 - 26), width: 6, height: 26, background: "#d9d9d9" }} />
            ))}
            <div style={{ ...abs(960 - 290, BAR.high - BAR.barH / 2 - 26 - 132), width: 580, height: 132, borderRadius: 22, background: G_WHITE, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 4, boxShadow: "0 14px 24px rgba(0,0,0,0.4)" }}>
              <div style={line(46, COLORS.ink)}>Statistically significant</div>
              <div style={line(46, COLORS.ink)}>overall survival</div>
            </div>
          </div>
        ) : null}
        {/* the lift column grows out of the slab, the vial rides its top */}
        {liftH > 1 ? (
          <Puck x={960} y={SLAB_TOP - liftH / 2} w={LIFT.w} h={liftH} d={LIFT.d} r={18} front={G_INK} side="#111" clip>
            <div style={label("rgba(255,255,255,0.85)", 28)}>EVIDENCE</div>
          </Puck>
        ) : null}
        <Vial x={960} base={top} s={0.78} />
      </div>
      <Scatter x={960} y={top} t={tNot + 120} seed={16} n={5} color="#9a9a9a" zz={50} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S9 (red) — "It also said the progression-free survival benefit could not, on its own, support a positive balance
// of benefit and risk."   Settled: the level balance (hero) / PFS weight / pan labels.
// ══════════════════════════════════════════════════════════════════════════
export const BAL = { x: 960, pivotY: 330, floor: 830, half: 500, string: 260, panW: 340, maxTilt: 9 }; // long strings + narrow weights: strings clear the weights (Nel 11-19)

export const Balance: React.FC<Win & { said: Cued; benefit: Cued; not: Cued }> = ({ from, to, said, benefit, not }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const drop = useDropX();
  const tSaid = at(said, 62210, from);
  const tBen = at(benefit, 64240, from, tSaid + 900);
  const tNot = at(not, 65190, from, tBen + 600);
  if (ms < from || ms > to + 320) return null;

  const inP = ent(tSaid - 200, 700);
  // the weight flies in from DEPTH straight onto the pan (a fall from above crossed the beam and the strings), squash on landing
  const w = drop(tBen, 0, 1);
  const wz = ms < tBen - 420 ? null : lerp(-1400, 0, EASE(Math.min(1, (ms - (tBen - 420)) / 420)));
  const dip = ms < tBen ? 0 : sp(tBen, 9, 170); //              the beam dips toward benefit as the weight lands
  const back = ms < tNot ? 0 : sp(tNot, 8, 160); //            …then springs back to level
  const tilt = -BAL.maxTilt * Math.max(0, Math.min(1.1, dip) - back);
  const a = (tilt * Math.PI) / 180;
  const ends: [number, number][] = [-1, 1].map((s) => [BAL.x + s * BAL.half * Math.cos(a), BAL.pivotY + s * BAL.half * Math.sin(a)]) as [number, number][];
  const panY = (i: number) => ends[i][1] + BAL.string;
  const pan = (i: number, name: string, children?: React.ReactNode) => (
    <>
      {[-1, 1].map((s) => {
        const x2 = ends[i][0] + s * (BAL.panW / 2 - 10), y2 = panY(i);
        const len = Math.hypot(x2 - ends[i][0], y2 - ends[i][1]);
        return <div key={s} style={{ ...abs(ends[i][0], ends[i][1] - 2), width: len, height: 4, background: "rgba(0,0,0,0.55)", transformOrigin: "0 50%",
          transform: `rotate(${deg(Math.atan2(y2 - ends[i][1], x2 - ends[i][0]))}deg)` }} />;
      })}
      <Puck x={ends[i][0]} y={panY(i) + 20} w={BAL.panW} h={42} d={BAL.panW * 0.5} r={21} front={G_WHITE} side="#a9a9a9">
        <div style={label(COLORS.ink, 26)}>{name}</div>
      </Puck>
      {children}
    </>
  );
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(lerp(-2200, 0, inP))}translateY(${lerp(-500, 0, inP)}px)` }}>
        <div style={shadow(BAL.x, BAL.floor + 6, 360, 0.3)} />
        <Puck x={BAL.x} y={BAL.floor - 16} w={320} h={32} d={120} r={16} front={G_INK} side="#111" />
        <Puck x={BAL.x} y={(BAL.pivotY + BAL.floor) / 2} w={40} h={BAL.floor - BAL.pivotY} d={40} r={20} front={G_INK} side="#111" />
        {/* the beam */}
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${BAL.x}px ${BAL.pivotY}px`, transform: `${z(30)}rotateZ(${tilt}deg)` }}>
          <Puck x={BAL.x} y={BAL.pivotY} w={BAL.half * 2 + 40} h={34} d={34} r={17} front={G_INK} side="#111" />
        </div>
        <Puck x={BAL.x} y={BAL.pivotY} w={64} h={64} d={50} r="50%" front={G_WHITE} side="#9a9a9a" style={{ transform: z(40) || undefined }} />
        {/* pans hang plumb from the beam ends */}
        <div style={{ position: "absolute", inset: 0, ...p3, transform: z(30) || undefined }}>
          {pan(1, "RISK",
            <Puck x={ends[1][0]} y={panY(1) - 46} w={150} h={92} d={90} r={24} front={G_INK} side="#111" />)}
          {pan(0, "BENEFIT",
            wz !== null ? (
              <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${ends[0][0]}px ${panY(0)}px`, transform: `${z(wz)}scale(${w.on ? w.sx : 1}, ${w.on ? w.sy : 1})` }}>
                <Puck x={ends[0][0]} y={panY(0) - 50} w={160} h={100} d={90} r={26} front={G_WHITE} side="#9a9a9a">
                  <div style={line(52, COLORS.ink)}>PFS</div>
                </Puck>
              </div>
            ) : null)}
        </div>
      </div>
      <Scatter x={ends[0][0]} y={panY(0)} t={tBen} seed={17} color={COLORS.paper} zz={40} />
    </AbsoluteFill>
  );
};
