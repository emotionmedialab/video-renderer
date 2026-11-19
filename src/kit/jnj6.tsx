// ─────────────────────────────────────────────────────────────────────────
// KIT · jnj6 — J&J × Ollin long-form, chunk 6 (§6 Why it matters — OUR READ), 16:9, 2026-11-19. House style 11-16.
//  S19 Handoff (ink):  callback of S2 in the SAME seats (K2): J&J rises, the vial lands on it ("ready for Phase 3"),
//                      the "?" hops back, the FINAL TRIALS bill falls on J&J and is flicked across; on "an outside
//                      funder" the newcomer's head turns and BLACKSTONE · OUTSIDE FUNDER prints (completes S2).
//  S20 Fork (paper):   a forked track: one ball rolls into IF THEY FAIL → BLACKSTONE'S MONEY SPENT; a second rolls into
//                      IF THEY SUCCEED → BLACKSTONE SHARES THE UPSIDE.
//  S21 Bar (ink):      high-jump posts; VABYSMO · APPROVED IN BOTH DISEASES bar drops on; OLN-324 slides under;
//                      a red MORE THAN MATCH bar drops on higher pegs.
// The whole section sits under the OUR READ plate (it is analysis, not reporting).
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, COLORS, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { EASE, fadeOut } from "./plusone";
import { label, line } from "./inovio";
import { Print } from "./ryb1b";
import { useP3, useZ } from "./camera";
import { Scatter, useDropX, useEnt, useSpringX } from "./v2style";
import { G_GREY, G_INK, G_STONE, G_WHITE, Puck } from "./argenx1v2b";
import { BILL, Bill, BH, BW, JJB, PERSON, Vial } from "./jnj1";
import { Y, YAntibody } from "./jnj3";
import { LineDrop } from "./jnjtype";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });
const G_RED = "linear-gradient(155deg, #ff6a71 0%, #F4212D 50%, #b3121b 100%)";
const chip = (txt: React.ReactNode, bg: string = COLORS.ink, fg: string = COLORS.paper, size = 30) => (
  <div style={{ background: bg, borderRadius: 34, padding: "12px 26px", ...label(fg, size), display: "inline-block" }}>{txt}</div>
);

/** the OUR READ plate: the section's spine, top-left */
export const OurRead: React.FC<{ t: number; tRead: number; dark: boolean }> = ({ t, tRead, dark }) => {
  const z = useZ();
  return (
    <div style={{ ...abs(110, 90), display: "flex", alignItems: "center", gap: 20, transform: z(20) || undefined }}>
      <LineDrop text="Why it matters" t={t} size={56} color={dark ? COLORS.paper : COLORS.ink} />
      <Print t={tRead}>{chip("OUR READ", COLORS.accent, COLORS.paper, 28)}</Print>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S19 (ink) — "Why it matters. This is our read. J&J is buying a drug ready for Phase 3, and handing the bill for that
// costly, risky stage to an outside funder."   Settled: Blackstone holding the bill (hero) / J&J + vial / plate.
// ══════════════════════════════════════════════════════════════════════════
export const Handoff: React.FC<Win & { why: Cued; read: Cued; jj: Cued; drug: Cued; ready: Cued; and: Cued; bill: Cued; flickMs: number; revealMs: number }> = ({
  from, to, why, read, jj, drug, ready, and, bill, flickMs, revealMs,
}) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const drop = useDropX();
  const tWhy = at(why, 137000, from);
  const tRead = at(read, 139410, from, tWhy + 800);
  const tJJ = at(jj, 140360, from, tRead + 500);
  const tDrug = at(drug, 141330, from, tJJ + 600);
  const tReady = at(ready, 141660, from, tDrug + 200);
  const tAnd = at(and, 142960, from, tReady + 600);
  const tBill = at(bill, 144020, from, tAnd + 700);
  if (ms < from || ms > to + 320) return null;

  const rise = ent(tJJ, 450);
  const vial = drop(tDrug - 380, 700, 380);
  const hp = clamp01((ms - tAnd) / 460);
  const hopX = lerp(1250, 0, EASE(hp));
  const hopY = -Math.abs(Math.sin(hp * Math.PI * 3)) * 70 * (1 - hp * 0.5);
  const hopSq = ms >= tAnd + 460 ? 1 - sp(tAnd + 460, 7, 220, 0.6) : 0;
  const bd = drop(tBill - 380, 900, 380);
  const fl = clamp01((ms - flickMs) / 520);
  const fe = EASE(fl);
  const jTop = BILL.base - JJB.h;
  const b0: [number, number] = [BILL.jx, jTop - BH / 2];
  const b1: [number, number] = [BILL.px, BILL.base - PERSON.bh / 2 + 10];
  const bx = lerp(b0[0], b1[0], fe), by = lerp(b0[1], b1[1], fe) - 300 * 4 * fl * (1 - fl);
  const flicked = ms >= flickMs;
  const caught = ms >= flickMs + 520 ? 1 - sp(flickMs + 520, 8, 220, 0.6) : 0;
  // the head turns (edge-on at the midpoint, the face swaps there: never a mirrored back)
  const turn = clamp01((ms - revealMs) / 360);
  const headSX = Math.abs(Math.cos(turn * Math.PI));
  const revealed = turn >= 0.5;
  const headY = BILL.base - PERSON.bh - PERSON.headR + 6;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {/* J&J, same seat as S2, with the vial landing on top */}
      {ms >= tJJ ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(lerp(-1400, 0, rise))}translateY(${lerp(500, 0, rise)}px)` }}>
          <div style={{ ...abs(BILL.jx - 220, BILL.base - 8), width: 440, height: 30, borderRadius: "50%", background: "rgba(0,0,0,0.6)", filter: "blur(8px)" }} />
          <Puck x={BILL.jx} y={BILL.base - JJB.h / 2} w={JJB.w} h={JJB.h} d={JJB.d} r={40} front={G_GREY} side="#4a4a4a">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={line(110, COLORS.ink)}>J&amp;J</div>
              <div style={{ height: 36 }}><Print t={tReady}><div style={label("#1c1c1c", 26)}>READY FOR PHASE 3</div></Print></div>
            </div>
          </Puck>
          {vial.on ? (
            <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${BILL.jx - 110}px ${jTop}px`, transform: `${z(JJB.d / 2 - 10)}translateY(${vial.dy}px) scale(${vial.sx}, ${vial.sy})` }}>
              <Vial x={BILL.jx - 110} bottom={jTop} s={0.9} />
            </div>
          ) : null}
        </div>
      ) : null}
      {/* the newcomer hops back into its S2 seat */}
      {ms >= tAnd ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${BILL.px}px ${BILL.base}px`,
          transform: `translate(${hopX}px, ${hopY}px) scale(${1 + 0.08 * hopSq}, ${1 - 0.1 * hopSq})` }}>
          <div style={{ ...abs(BILL.px - 170, BILL.base - 8), width: 340, height: 30, borderRadius: "50%", background: "rgba(0,0,0,0.6)", filter: "blur(8px)" }} />
          <Puck x={BILL.px} y={BILL.base - PERSON.bh / 2} w={PERSON.bw} h={PERSON.bh} d={PERSON.d} r="150px 150px 34px 34px" front={G_STONE} side="#9c9c9c" />
          <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${BILL.px}px ${headY}px`, transform: `scaleX(${headSX})` }}>
            <Puck x={BILL.px} y={headY} w={PERSON.headR * 2} h={PERSON.headR * 2} d={PERSON.d - 10} r="50%" front={revealed ? G_RED : G_WHITE} side={revealed ? "#7a0b12" : "#9c9c9c"}>
              <div style={line(revealed ? 90 : 104, revealed ? COLORS.paper : COLORS.ink)}>{revealed ? "B" : "?"}</div>
            </Puck>
          </div>
        </div>
      ) : null}
      <div style={{ ...abs(BILL.px - 400, headY - PERSON.headR - 96), width: 800, display: "flex", justifyContent: "center", transform: z(60) || undefined }}>
        <Print t={revealMs + 180}>{chip("BLACKSTONE · OUTSIDE FUNDER", COLORS.paper, COLORS.ink, 32)}</Print>
      </div>
      {/* the bill */}
      {bd.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: z(flicked ? lerp(JJB.d / 2 - 30, PERSON.d / 2 + 30, fe) : JJB.d / 2 - 30) || undefined }}>
          <div style={{ ...abs(bx - BW / 2, by - BH / 2 + (flicked ? 0 : bd.dy)), width: BW, height: BH, transformOrigin: "50% 100%",
            transform: `rotate(${flicked ? lerp(0, 360, fe) : 0}deg) scale(${lerp(1, 0.86, fe) * (flicked ? 1 + 0.06 * caught : bd.sx)}, ${lerp(1, 0.86, fe) * (flicked ? 1 - 0.08 * caught : bd.sy)})` }}>
            <Bill />
          </div>
        </div>
      ) : null}
      <Scatter x={BILL.jx} y={jTop} t={tBill} seed={91} n={5} color="#d0d0d0" zz={JJB.d / 2} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S20 (paper) — "If the trials fail, the spending was Blackstone's money. If they succeed, Blackstone shares the upside."
// Settled: the fork with a ball in each bin (hero) / the two bin texts.
// ══════════════════════════════════════════════════════════════════════════
const FK = { jx: 960, jy: 330, lx: 600, rx: 1320, ey: 640, binY: 770, ball: 40 };
const trackLen = Math.hypot(FK.rx - FK.jx, FK.ey - FK.jy);
const trackAng = (Math.atan2(FK.ey - FK.jy, FK.rx - FK.jx) * 180) / Math.PI;

const Track: React.FC<{ s: -1 | 1 }> = ({ s }) => (
  <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transformOrigin: `${FK.jx}px ${FK.jy + FK.ball + 12}px`, transform: `rotateZ(${s < 0 ? 180 - trackAng : trackAng}deg)` }}>
    <Puck x={FK.jx + trackLen / 2} y={FK.jy + FK.ball + 12} w={trackLen + 20} h={22} d={60} r={11} front={G_INK} side="#141414" />
  </div>
);

export const Fork: React.FC<Win & { if1: Cued; fail: Cued; spent: Cued; if2: Cued; succeed: Cued; shares: Cued }> = ({ from, to, if1, fail, spent, if2, succeed, shares }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const tIf1 = at(if1, 148500, from);
  const tFail = at(fail, 149390, from, tIf1 + 300);
  const tSpent = at(spent, 150790, from, tFail + 600);
  const tIf2 = at(if2, 152240, from, tSpent + 600);
  const tSucc = at(succeed, 152670, from, tIf2 + 200);
  const tShares = at(shares, 153384, from, tSucc + 400);
  if (ms < from || ms > to + 320) return null;

  const fx = ent(from, 450);
  const ball = (s: -1 | 1, t0: number, t1: number, popT: number) => {
    if (ms < popT) return null;
    const pop = ms >= popT ? sp(popT, 10, 170) : 0;
    const r = clamp01((ms - t0) / (t1 - t0 - 200));
    const fallP = clamp01((ms - (t1 - 200)) / 200);
    const ex = s < 0 ? FK.lx : FK.rx;
    const x = lerp(FK.jx, ex, EASE(r));
    const y = lerp(FK.jy, FK.ey, EASE(r)) + (FK.binY - 75 - FK.ball - FK.ey) * fallP * fallP;
    const rot = s * (Math.hypot(x - FK.jx, y - FK.jy) / FK.ball) * (180 / Math.PI);
    const land = ms >= t1 ? 1 - sp(t1, 7, 220, 0.6) : 0;
    return (
      <div style={{ ...abs(x - FK.ball, y - FK.ball), width: FK.ball * 2, height: FK.ball * 2, borderRadius: "50%", transformOrigin: "50% 100%",
        transform: `${z(60)}scale(${pop * (1 + 0.14 * land)}, ${pop * (1 - 0.14 * land)}) rotate(${rot}deg)`,
        background: "radial-gradient(circle at 35% 30%, #ff8a90, #F4212D 55%, #a10f17)" }}>
        <div style={{ ...abs(FK.ball - 4, 6), width: 8, height: 20, borderRadius: 4, background: "rgba(255,255,255,0.6)" }} />
      </div>
    );
  };
  const bin = (x: number, head: string, tHead: number, body: string, tBody: number) => (
    <div style={{ position: "absolute", inset: 0, ...p3 }}>
      <div style={{ ...abs(x - 200, FK.binY + 70), width: 400, height: 26, borderRadius: "50%", background: "rgba(0,0,0,0.16)", filter: "blur(8px)" }} />
      <Puck x={x} y={FK.binY} w={520} h={150} d={100} r="12px 12px 40px 40px" front={G_GREY} side="#4a4a4a">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ height: 32 }}><Print t={tHead}><div style={label("#1c1c1c", 26)}>{head}</div></Print></div>
          <div style={{ height: 36 }}><Print t={tBody}><div style={label(COLORS.ink, 28)}>{body}</div></Print></div>
        </div>
      </Puck>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(lerp(-1800, 0, fx))}translateY(${lerp(300, 0, fx)}px)` }}>
        <Track s={-1} />
        <Track s={1} />
        <Puck x={FK.jx} y={FK.jy + FK.ball + 12} w={70} h={70} d={60} r="50%" front={G_INK} side="#141414" />
        {bin(FK.lx, "IF THEY FAIL", tIf1, "BLACKSTONE'S MONEY SPENT", tSpent)}
        {bin(FK.rx, "IF THEY SUCCEED", tIf2, "BLACKSTONE SHARES THE UPSIDE", tShares)}
      </div>
      {ball(-1, tFail, tSpent, from + 300)}
      {ball(1, tSucc, tShares, tIf2)}
      <Scatter x={FK.lx} y={FK.binY - 75} t={tSpent} seed={95} n={6} color={COLORS.accent} zz={60} />
      <Scatter x={FK.rx} y={FK.binY - 75} t={tShares} seed={96} n={6} color={COLORS.accent} zz={60} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S21 (ink) — "And the bar is clear. Vabysmo is already approved in both diseases. OLN-324 has to show it does more than
// match it."   Settled: the two bars (hero) / OLN-324 under them / plate.
// ══════════════════════════════════════════════════════════════════════════
const HB = { xl: 640, xr: 1280, floor: 870, top: 300, bar1: 540, bar2: 400 };

export const Bar: React.FC<Win & { and: Cued; bar: Cued; vab: Cued; approved: Cued; oln: Cued; moreMs: number }> = ({ from, to, and, bar, vab, approved, oln, moreMs }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const drop = useDropX();
  const tAnd = at(and, 155300, from);
  const tBar = at(bar, 155960, from, tAnd + 400);
  const tVab = at(vab, 157120, from, tBar + 600);
  const tApp = at(approved, 158440, from, tVab + 600);
  const tOln = at(oln, 160600, from, tApp + 800);
  if (ms < from || ms > to + 320) return null;

  const posts = ent(tAnd - 150, 450);
  const b1 = drop(tBar - 380, 700, 380);
  const b2 = drop(moreMs - 380, 700, 380);
  const yIn = EASE(clamp01((ms - tOln) / 500));
  const barEl = (y: number, d: { dy: number; sx: number; sy: number }, front: string, side: string, kids: React.ReactNode) => (
    <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `960px ${y + 35}px`, transform: `${z(20)}translateY(${d.dy}px) scale(${d.sx}, ${d.sy})` }}>
      <Puck x={960} y={y} w={HB.xr - HB.xl + 120} h={70} d={60} r={35} front={front} side={side}>{kids}</Puck>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {/* the posts with two sets of pegs */}
      <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${lerp(800, 0, posts)}px)` }}>
        {[HB.xl, HB.xr].map((x) => (
          <div key={x} style={{ position: "absolute", inset: 0, ...p3 }}>
            <Puck x={x} y={(HB.top + HB.floor) / 2} w={40} h={HB.floor - HB.top} d={40} r={20} front={G_GREY} side="#3a3a3a" />
            {[HB.bar1, HB.bar2].map((py) => <Puck key={py} x={x} y={py + 46} w={70} h={18} d={50} r={9} front={G_WHITE} side="#8a8a8a" />)}
          </div>
        ))}
      </div>
      {b1.on ? barEl(HB.bar1, b1, G_WHITE, "#9c9c9c", (
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Print t={tVab}><div style={label(COLORS.ink, 32)}>VABYSMO</div></Print>
          <Print t={tApp}><div style={label(COLORS.grayText, 28)}>APPROVED IN BOTH DISEASES</div></Print>
        </div>
      )) : null}
      <Scatter x={960} y={HB.bar1 + 35} t={tBar} seed={97} n={6} color="#bdbdbd" zz={50} />
      {/* OLN-324 slides in under the bars */}
      {ms >= tOln ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateX(${lerp(-1300, 0, yIn)}px)` }}>
          <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transformOrigin: `${Y.x}px ${Y.top + Y.stemH}px`,
            transform: `translate(0px, ${HB.floor - (Y.top + Y.stemH)}px) scale(0.42)` }}>
            <YAntibody />
          </div>
          <div style={{ ...abs(960 + 110, HB.floor - 150), transform: z(30) || undefined }}>{chip("OLN-324", COLORS.paper, COLORS.ink, 28)}</div>
        </div>
      ) : null}
      {b2.on ? barEl(HB.bar2, b2, G_RED, "#7a0b12", <div style={label(COLORS.paper, 34)}>MORE THAN MATCH</div>) : null}
      <Scatter x={960} y={HB.bar2 + 35} t={moreMs} seed={98} n={7} color={COLORS.accent} zz={50} />
    </AbsoluteFill>
  );
};
