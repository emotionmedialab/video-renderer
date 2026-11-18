// ─────────────────────────────────────────────────────────────────────────
// KIT · argenx5 — argenx × UNP long-form, chunk 5 (1:59–2:45), 16:9, V2 style, 2026-11-16.
// §6 ARGENX CAN PAY FOR IT + §7 WHY IT MATTERS (OUR READ).
//  · S16 (ink): kinetic "ARGENX CAN PAY FOR IT"; a vial-shaped Q3 2026 bar springs up to $1.7B; the Q3 2025 bar rises
//    (height = 2026 / 1.54, the release's +54%; no 2025 figure printed); a red "+54%" arrow draws; a $506M profit badge lands.
//  · S17 (paper): the hook's bundles drop ("$550M upfront"); the $1.7B sales bar splits into thirds; one third lifts
//    beside the bundles: "≈ ⅓ of one quarter's sales" (OUR MATH: 550 / 1,721 = 32%).
//  · S18 (red): "WHY IT MATTERS" → an OUR READ plate that stays for the whole §7; an IV bag swings in, a syringe flies in;
//    on Massey's line they MORPH into a pill (oral) and a long-acting clock.
//  · S19 (ink): an argenx chip is tossed and lands ("THE BET"); a pill + clock dock beside it; it hops onto the
//    "Discovery platform" mat, the "A named drug" mat is struck; three program cards flip up: "Not named".
// Limits: "Our read" on all of §7; Massey's words are hers ("new possibilities"); "patients may find easier" is the bet.
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, COLORS, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { EASE, fadeOut } from "./plusone";
import { extrude, label, line } from "./inovio";
import { Print, Slam } from "./ryb1b";
import { useP3, useZ } from "./camera";
import { KType, Scatter, useDropX, useEnt, useSpringX } from "./v2style";
import { BUN, Bundle } from "./argenx1v2";
import { G_GREY, G_INK, G_WHITE, Puck } from "./argenx1v2b";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });

// ══════════════════════════════════════════════════════════════════════════
// S16 (ink) — "argenx can pay for it. In the third quarter alone, Vyvgart brought in $1.7 billion in global sales, up 54%
// from a year earlier, and argenx made a profit of $506 million."   Settled: two bars (hero) / +54% arrow / profit badge.
// ══════════════════════════════════════════════════════════════════════════
const BARS = { base: 860, w: 190, h26: 500, x25: 640, x26: 930 };
const H25 = BARS.h26 / 1.54;

const VialBar: React.FC<{ x: number; h: number; grow: number; front: string; side: string; cap: string }> = ({ x, h, grow, front, side, cap }) => (
  <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transformOrigin: `${x}px ${BARS.base}px`, transform: `scaleY(${Math.max(0.001, grow)})` }}>
    <Puck x={x} y={BARS.base - h / 2} w={BARS.w} h={h} d={70} r={`${BARS.w / 2}px ${BARS.w / 2}px 26px 26px`} front={front} side={side} />
    <Puck x={x} y={BARS.base - h - 10} w={BARS.w - 50} h={40} d={50} r={14} front={cap} side="#111" />
  </div>
);

export const CanPay: React.FC<Win & { can: Cued; vyv: Cued; sales: Cued; up: Cued; pct: Cued; profit: Cued; m506: Cued }> = ({ from, to, can, vyv, sales, up, pct, profit, m506 }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const tCan = at(can, 119280, from);
  const tVyv = at(vyv, 122378, from, tCan + 1200);
  const tSales = at(sales, 123530, from, tVyv + 400);
  const tUp = at(up, 126320, from, tSales + 1000);
  const tPct = at(pct, 126470, from, tUp + 100);
  const tProf = at(profit, 129550, from, tPct + 800);
  const t506 = at(m506, 130220, from, tProf + 300);
  if (ms < from || ms > to + 320) return null;
  const typeOut = EASE(k(tVyv - 250, 300)); //   leaves as the bar rises (no blank beat)
  const g26 = sp(tVyv, 10, 120);
  const g25 = sp(tUp, 10, 140);
  const arrow = EASE(k(tPct + 100, 420));
  const badge = ent(tProf - 300, 500);
  const top26 = BARS.base - BARS.h26, top25 = BARS.base - H25;
  const dash = (p: number) => ({ pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p });
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {typeOut < 1 ? (
        <div style={{ ...abs(0, 400), width: 1920, display: "flex", justifyContent: "center", transform: `${z(30)}translateY(${-700 * typeOut}px)` }}>
          <KType text="ARGENX CAN PAY FOR IT" t={tCan - 100} size={104} color={COLORS.paper} />
        </div>
      ) : null}
      {/* the bars */}
      {ms >= tUp ? <VialBar x={BARS.x25} h={H25} grow={g25} front={G_GREY} side="#3f3f3f" cap="#2b2b2b" /> : null}
      {ms >= tVyv ? <VialBar x={BARS.x26} h={BARS.h26} grow={g26} front={G_WHITE} side="#9a9a9a" cap={G_INK} /> : null}
      {ms >= tVyv ? (
        <div style={{ position: "absolute", inset: 0, transform: z(50) || undefined }}>
          <div style={{ ...abs(BARS.x26 - 150, BARS.base + 18), width: 300, textAlign: "center", ...label(COLORS.paper, 34) }}>Q3 2026</div>
          {ms >= tUp ? <div style={{ ...abs(BARS.x25 - 150, BARS.base + 18), width: 300, textAlign: "center", ...label("rgba(255,255,255,0.7)", 34) }}>Q3 2025</div> : null}
        </div>
      ) : null}
      {/* $1.7B */}
      {ms >= tSales ? (
        <div style={{ ...abs(BARS.x26 - 300, top26 - 220), width: 600, display: "flex", flexDirection: "column", alignItems: "center", transform: z(60) || undefined }}>
          <KType text="$1.7B" t={tSales - 150} size={120} color={COLORS.paper} />
          <Print t={tSales + 250}><div style={label("rgba(255,255,255,0.75)", 34)}>Vyvgart global sales</div></Print>
        </div>
      ) : null}
      {/* +54% arrow */}
      {ms >= tPct ? (
        <div style={{ position: "absolute", inset: 0, transform: z(70) || undefined }}>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <path d={`M${BARS.x25 + 30} ${top25 - 50} Q${(BARS.x25 + BARS.x26) / 2 - 40} ${top26 - 120} ${BARS.x26 - 110} ${top26 + 60}`} fill="none" stroke={COLORS.accent} strokeWidth={10} strokeLinecap="round" {...dash(arrow)} />
          </svg>
          <div style={{ ...abs(BARS.x25 - 210, top25 - 170), transform: `scale(${sp(tPct, 7, 220)})`, transformOrigin: "100% 100%" }}>
            <div style={{ background: COLORS.accent, borderRadius: 34, padding: "10px 26px", ...line(56, COLORS.paper), boxShadow: "0 10px 18px rgba(0,0,0,0.4)" }}>+54%</div>
          </div>
        </div>
      ) : null}
      {/* profit badge */}
      {ms >= tProf - 300 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: "1460px 560px", transform: `${z(lerp(-1800, 0, badge))}rotate(${lerp(-90, 0, badge)}deg)` }}>
          <Puck x={1460} y={560} w={330} h={330} d={50} r="50%" front={G_WHITE} side="#8f8f8f">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={label("#555", 34)}>Q3 profit</div>
              <KType text="$506M" t={t506 - 150} size={92} color={COLORS.ink} />
            </div>
          </Puck>
        </div>
      ) : null}
      <Scatter x={1460} y={400} t={tProf + 200} seed={141} n={6} zz={60} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S17 (paper) — "The $550 million upfront is about a third of one quarter of Vyvgart sales."
// Settled: the split sales bar (hero) / bundles + chip / "≈ ⅓ · our math".
// ══════════════════════════════════════════════════════════════════════════
const SB = { x0: 360, x1: 1560, y: 740, h: 130 };
const BUN2 = { x: 480, y: 360 };

export const ThirdOfQuarter: React.FC<Win & { m550: Cued; third: Cued; quarter: Cued }> = ({ from, to, m550, third, quarter }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const t550 = at(m550, 133100, from);
  const tThird = at(third, 135390, from, t550 + 800);
  const tQ = at(quarter, 136020, from, tThird + 300);
  if (ms < from || ms > to + 320) return null;
  const barIn = ent(from + 100, 500);
  const split = sp(tThird, 9, 160);
  const lift = ent(tQ - 150, 500);
  const W = (SB.x1 - SB.x0) / 3;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {/* bundles: the hook's $550M */}
      {[-1, 0, 1].map((d, i) => {
        const t0 = t550 - 250 + i * 80;
        if (ms < t0) return null;
        const s = sp(t0, 8, 170);
        return <div key={i} style={{ ...abs(BUN2.x + d * 180 - BUN.w / 2, BUN2.y - BUN.h / 2 - (i === 1 ? 30 : 0)), transformOrigin: "50% 100%",
          transform: `${z(30 + i * 5)}translateY(${(1 - s) * -500}px) rotate(${d * 5}deg) scale(0.75)` }}><Bundle /></div>;
      })}
      {ms >= t550 ? (
        <div style={{ ...abs(BUN2.x - 200, BUN2.y + 70), width: 400, display: "flex", justifyContent: "center", transform: `${z(50)}scale(${sp(t550 + 150, 7, 220)})` }}>
          <div style={{ background: COLORS.ink, borderRadius: 34, padding: "10px 26px", display: "flex", gap: 12, alignItems: "baseline" }}>
            <div style={line(46, COLORS.paper)}>$550M</div><div style={label(COLORS.paper, 30)}>upfront</div>
          </div>
        </div>
      ) : null}
      {/* the sales bar: three thirds that split apart; the first lifts up beside the bundles */}
      {[0, 1, 2].map((i) => {
        const dx = (i - 1) * 40 * split;
        const isFirst = i === 0;
        const lx = isFirst ? lerp(0, 1090 - (SB.x0 + W / 2), lift) : 0;
        const ly = isFirst ? lerp(0, BUN2.y - SB.y + 10, lift) : 0;
        return (
          <div key={i} style={{ position: "absolute", inset: 0, ...p3, transform: `translateX(${lerp(1400, 0, barIn) + dx + lx}px) translateY(${ly}px)` }}>
            <Puck x={SB.x0 + W * i + W / 2} y={SB.y} w={W + (split > 0.02 ? -6 : 0)} h={SB.h} d={60}
              r={i === 0 ? `${SB.h / 2}px 0 0 ${SB.h / 2}px` : i === 2 ? `0 ${SB.h / 2}px ${SB.h / 2}px 0` : 0} front={G_INK} side="#151515">
              {i === 1 && split < 0.02 ? <div style={{ ...label(COLORS.paper, 36), whiteSpace: "nowrap" }}>Q3 Vyvgart sales · $1.7B</div> : null}
              {split >= 0.02 ? <div style={line(60, COLORS.paper)}>⅓</div> : null}
            </Puck>
          </div>
        );
      })}
      <Scatter x={SB.x0 + W} y={SB.y - SB.h / 2} t={tThird + 120} seed={151} n={5} color="#666" zz={50} />
      <Scatter x={SB.x0 + 2 * W} y={SB.y - SB.h / 2} t={tThird + 120} seed={153} n={5} color="#666" zz={50} />
      {ms >= tQ + 300 ? (
        <div style={{ ...abs(745, 290), transform: `${z(60)}scale(${sp(tQ + 300, 7, 220)})`, transformOrigin: "50% 50%" }}>
          <div style={line(120, COLORS.accent)}>≈</div>
        </div>
      ) : null}
      {ms >= tQ + 400 ? (
        <div style={{ ...abs(SB.x0, SB.y + 100), width: SB.x1 - SB.x0, display: "flex", justifyContent: "center", transform: z(40) || undefined }}>
          <Print t={tQ + 400}><div style={{ ...label(COLORS.ink, 34), display: "flex", gap: 14 }}><span>about a third of one quarter's sales</span><span style={{ color: "#888" }}>· our math</span></div></Print>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S18 (red) — "Why it matters. This is our read. Vyvgart is given by infusion or injection. argenx's chief executive,
// Karen Massey, says UNP creates new possibilities for oral and long-acting medicines."
// Settled: the two forms (hero) / OUR READ plate / Massey chip.
// ══════════════════════════════════════════════════════════════════════════
export const OUR_READ = { x: 130, y: 120 };
export const OurReadPlate: React.FC<{ t?: number }> = ({ t }) => {
  const ms = useMs();
  const z = useZ();
  const inner = (
    <div style={{ background: COLORS.paper, borderRadius: 14, padding: "10px 24px", border: `5px solid ${COLORS.ink}`, ...line(40, COLORS.ink), boxShadow: "0 10px 16px rgba(0,0,0,0.25)" }}>OUR READ</div>
  );
  if (t !== undefined && ms < t) return null;
  return <div style={{ ...abs(OUR_READ.x, OUR_READ.y), transform: z(60) || undefined }}>{t !== undefined ? <Slam t={t}>{inner}</Slam> : inner}</div>;
};

const IVBag: React.FC = () => (
  <div style={{ position: "relative", width: 200, height: 330 }}>
    <div style={{ position: "absolute", left: 92, top: 0, width: 16, height: 40, borderRadius: 8, background: "#2b2b2b" }} />
    <div style={{ position: "absolute", left: 0, top: 34, width: 200, height: 230, borderRadius: "40px 40px 70px 70px", background: "linear-gradient(160deg, #ffffff, #e2e2e2 60%, #bdbdbd)", overflow: "hidden",
      boxShadow: "0 16px 24px rgba(90,0,0,0.35)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 120, background: "linear-gradient(180deg, #d9d9d9, #b0b0b0)" }} />
    </div>
    <div style={{ position: "absolute", left: 96, top: 262, width: 8, height: 70, background: "#2b2b2b" }} />
  </div>
);
const Syringe: React.FC = () => (
  <div style={{ position: "relative", width: 420, height: 90 }}>
    <div style={{ position: "absolute", left: 0, top: 30, width: 80, height: 30, borderRadius: 8, background: "#2b2b2b" }} />
    <div style={{ position: "absolute", left: 70, top: 10, width: 230, height: 70, borderRadius: 18, background: "linear-gradient(180deg, #ffffff, #d4d4d4)", boxShadow: "0 14px 22px rgba(90,0,0,0.35)" }} />
    <div style={{ position: "absolute", left: 300, top: 30, width: 40, height: 30, borderRadius: 6, background: "#9a9a9a" }} />
    <div style={{ position: "absolute", left: 340, top: 42, width: 80, height: 6, borderRadius: 3, background: "#5a5a5a" }} />
  </div>
);
const PillIcon: React.FC<{ w?: number }> = ({ w = 260 }) => (
  <div style={{ width: w, height: w * 0.38, borderRadius: w, overflow: "hidden", display: "flex", boxShadow: extrude(8, "#7d1015", "rgba(0,0,0,0.35)") }}>
    <div style={{ flex: 1, background: "linear-gradient(180deg,#fff,#dedede)" }} /><div style={{ flex: 1, background: "linear-gradient(180deg,#3a3a3a,#111)" }} />
  </div>
);
const ClockIcon: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <div style={{ width: 230 * s, height: 230 * s, borderRadius: "50%", background: "radial-gradient(circle at 34% 30%, #ffffff, #e6e6e6 60%, #bcbcbc)", position: "relative", boxShadow: "0 14px 22px rgba(0,0,0,0.35)" }}>
    <div style={{ position: "absolute", left: "50%", top: "18%", width: 12 * s, height: 82 * s, marginLeft: -6 * s, borderRadius: 6 * s, background: COLORS.ink }} />
    <div style={{ position: "absolute", left: "50%", top: "48%", width: 62 * s, height: 12 * s, borderRadius: 6 * s, background: COLORS.ink }} />
    <div style={{ position: "absolute", left: "50%", top: "50%", width: 26 * s, height: 26 * s, margin: -13 * s, borderRadius: "50%", background: COLORS.ink }} />
  </div>
);
const FORM = { y: 560, l: 640, r: 1280 };

export const FormsMorph: React.FC<Win & { why: Cued; read: Cued; inf: Cued; inj: Cued; says: Cued; oral: Cued; long: Cued }> = ({ from, to, why, read, inf, inj, says, oral, long }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const tWhy = at(why, 138230, from);
  const tRead = at(read, 140530, from, tWhy + 800);
  const tInf = at(inf, 142860, from, tRead + 600);
  const tInj = at(inj, 143650, from, tInf + 400);
  const tSays = at(says, 147440, from, tInj + 800);
  const tOral = at(oral, 149810, from, tSays + 800);
  const tLong = at(long, 150340, from, tOral + 300);
  if (ms < from || ms > to + 320) return null;
  const whyOut = EASE(k(tInf - 400, 300)); //    holds until the IV bag swings in (no empty frame)
  const swing = sp(tInf - 300, 5, 120); //         the bag swings in on its hook and settles
  const syr = ent(tInj - 350, 450);
  const toPill = clamp01((ms - tOral) / 260), pill = sp(tOral + 180, 8, 200);
  const toClock = clamp01((ms - tLong) / 260), clock = sp(tLong + 180, 8, 200);
  const chip = ent(tSays - 200, 450);
  const formLabel = (x: number, text: string, t: number) => (
    <div style={{ ...abs(x - 200, FORM.y + 200), width: 400, textAlign: "center", transform: z(40) || undefined }}><Print t={t}><div style={label(COLORS.paper, 40)}>{text}</div></Print></div>
  );
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 55% at 50% 45%, rgba(255,255,255,0.16), rgba(255,255,255,0) 70%)" }} />
      {whyOut < 1 && ms >= tWhy - 200 ? (
        <div style={{ ...abs(0, 420), width: 1920, display: "flex", justifyContent: "center", transform: `${z(30)}translateY(${-700 * whyOut}px)` }}>
          <KType text="WHY IT MATTERS" t={tWhy - 200} size={130} color={COLORS.paper} />
        </div>
      ) : null}
      <OurReadPlate t={tRead} />
      {/* IV bag → pill */}
      {ms >= tInf - 300 && toPill < 1 ? (
        <div style={{ ...abs(FORM.l - 100, FORM.y - 230), transformOrigin: "100px -200px", transform: `${z(40)}translateY(${(1 - Math.min(1, swing)) * -500}px) rotate(${(1 - swing) * -35}deg) scale(${1 - toPill})` }}>
          <div style={{ position: "absolute", left: 98, top: -400, width: 4, height: 400, background: "rgba(0,0,0,0.5)" }} />
          <IVBag />
        </div>
      ) : null}
      {ms >= tOral ? <div style={{ ...abs(FORM.l - 130, FORM.y - 50), transform: `${z(50)}scale(${pill}) rotate(${(1 - pill) * -40}deg)` }}><PillIcon /></div> : null}
      {ms >= tInf ? formLabel(FORM.l, ms >= tOral ? "oral" : "infusion", ms >= tOral ? tOral + 150 : tInf) : null}
      {/* syringe → long-acting clock */}
      {ms >= tInj - 350 && toClock < 1 ? (
        <div style={{ ...abs(FORM.r - 210, FORM.y - 45), transform: `${z(lerp(-1500, 40, syr))}translateX(${lerp(500, 0, syr)}px) rotate(${lerp(40, -12, syr)}deg) scale(${1 - toClock})` }}>
          <Syringe />
        </div>
      ) : null}
      {ms >= tLong ? <div style={{ ...abs(FORM.r - 115, FORM.y - 115), transform: `${z(50)}scale(${clock})` }}><ClockIcon /></div> : null}
      {ms >= tInj ? formLabel(FORM.r, ms >= tLong ? "long-acting" : "injection", ms >= tLong ? tLong + 150 : tInj) : null}
      <Scatter x={FORM.l} y={FORM.y} t={tOral + 200} seed={161} n={7} zz={60} />
      <Scatter x={FORM.r} y={FORM.y} t={tLong + 200} seed={163} n={7} zz={60} />
      {/* Massey chip */}
      {ms >= tSays - 200 ? (
        <div style={{ ...abs(0, 880), width: 1920, display: "flex", justifyContent: "center", transform: `${z(50)}translateY(${lerp(240, 0, chip)}px)` }}>
          <div style={{ background: COLORS.ink, borderRadius: 40, padding: "12px 30px", display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ ...line(56, COLORS.accent), lineHeight: "40px", height: 40 }}>“</div>
            <div style={label(COLORS.paper, 34)}>Karen Massey, argenx CEO: “new possibilities”</div>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S19 (ink) — "That is the bet: argenx's immunology science, in forms patients may find easier to take. And it is a bet
// on a discovery platform, not on a named drug. The release names no programs."
// Settled: the chip on the platform mat (hero) / the struck "named drug" mat with 3 "Not named" cards / OUR READ.
// ══════════════════════════════════════════════════════════════════════════
const CHIP = { x: 960, y: 470, R: 150 };
const MATS = { y: 860, l: 620, r: 1320, w: 520, h: 110 };

export const BetChip: React.FC<Win & { bet: Cued; science: Cued; forms: Cued; easier: Cued; platform: Cued; not: Cued; release: Cued }> = ({ from, to, bet, science, forms, easier, platform, not, release }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const tBet = at(bet, 152640, from);
  const tSci = at(science, 153920, from, tBet + 600);
  const tForms = at(forms, 155803, from, tSci + 600);
  const tEasy = at(easier, 157330, from, tForms + 600);
  const tPlat = at(platform, 159840, from, tEasy + 800);
  const tNot = at(not, 161520, from, tPlat + 900);
  const tRel = at(release, 163480, from, tNot + 600);
  if (ms < from || ms > to + 320) return null;
  // chip toss: rises from below, flips twice, lands with a squash
  const toss = clamp01((ms - (tBet - 450)) / 450);
  const land = ms >= tBet ? 1 - sp(tBet, 6, 220, 0.6) : 0;
  const hop = clamp01((ms - (tPlat + 400)) / 450); //  hops onto the platform mat on "platform,"
  const cx = lerp(CHIP.x, MATS.l, EASE(hop)), cy = lerp(CHIP.y, MATS.y - MATS.h / 2 - 110, EASE(hop)) - 180 * 4 * hop * (1 - hop);
  const iconsIn = sp(tForms, 9, 170);
  const iconsOut = EASE(k(tPlat, 300));
  const bounce = ms >= tEasy ? Math.max(0, Math.sin(Math.PI * clamp01((ms - tEasy) / 300))) : 0;
  const mats = ent(tPlat, 450);
  const strike = EASE(k(tNot, 350));
  const typeOut = EASE(k(tPlat, 300));
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <OurReadPlate />
      {typeOut < 1 && ms >= tBet - 200 ? (
        <div style={{ ...abs(0, 170), width: 1920, display: "flex", justifyContent: "center", transform: `${z(30)}translateY(${-600 * typeOut}px)` }}>
          <KType text="THE BET" t={tBet - 200} size={110} color={COLORS.paper} />
        </div>
      ) : null}
      {/* the mats */}
      {ms >= tPlat ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${lerp(400, 0, mats)}px)` }}>
          {[{ x: MATS.l, t: "Discovery platform" }, { x: MATS.r, t: "A named drug" }].map((m, i) => (
            <Puck key={i} x={m.x} y={MATS.y} w={MATS.w} h={MATS.h} d={40} r={MATS.h / 2} front={i ? G_GREY : G_WHITE} side={i ? "#3f3f3f" : "#8f8f8f"}>
              <div style={{ position: "relative", ...label(i ? COLORS.paper : COLORS.ink, 38) }}>
                {m.t}
                {i ? <div style={{ position: "absolute", left: -10, top: "50%", height: 8, marginTop: -4, width: `${(100 + 6) * strike}%`, background: COLORS.accent, borderRadius: 4 }} /> : null}
              </div>
            </Puck>
          ))}
        </div>
      ) : null}
      {/* program cards: flip up out of the named-drug mat, all "Not named" */}
      {[0, 1, 2].map((i) => {
        const t0 = tRel + i * 120;
        if (ms < t0) return null;
        const f = sp(t0, 9, 170);
        const x = MATS.r - 170 + i * 170;
        return (
          <div key={i} style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${x}px ${MATS.y - MATS.h / 2}px`, transform: `${z(30)}translateY(${(1 - Math.min(1, f)) * 120}px) rotateY(${(1 - f) * 90}deg)` }}>
            <Puck x={x} y={MATS.y - MATS.h / 2 - 130} w={150} h={210} d={14} r={16} front={G_WHITE} side="#9a9a9a">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={label("#666", 22)}>PROGRAM</div>
                <div style={{ width: 90, height: 8, borderRadius: 4, background: "#d0d0d0" }} />
                <div style={{ ...label(COLORS.ink, 26), textAlign: "center", lineHeight: 1.1 }}>Not<br />named</div>
              </div>
            </Puck>
          </div>
        );
      })}
      {/* forms icons dock beside the chip, bounce on "easier", leave for the mats */}
      {ms >= tForms && iconsOut < 1 ? (
        <div style={{ position: "absolute", inset: 0, transform: `${z(40)}translateY(${-40 * bounce}px)` }}>
          <div style={{ ...abs(lerp(CHIP.x - 900, CHIP.x - 420, iconsIn), CHIP.y - 40), transform: `scale(${0.7 * (1 - iconsOut)})` }}><PillIcon w={220} /></div>
          <div style={{ ...abs(lerp(CHIP.x + 900, CHIP.x + 210, iconsIn), CHIP.y - 95), transform: `scale(${0.8 * (1 - iconsOut)})` }}><ClockIcon s={0.8} /></div>
        </div>
      ) : null}
      {ms >= tEasy && iconsOut < 1 ? (
        <div style={{ ...abs(0, CHIP.y + CHIP.R + 40), width: 1920, display: "flex", justifyContent: "center", transform: z(40) || undefined, opacity: 1 - iconsOut }}>
          <Print t={tEasy}><div style={label("rgba(255,255,255,0.8)", 36)}>forms patients may find easier to take</div></Print>
        </div>
      ) : null}
      {/* the chip */}
      {ms >= tBet - 450 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${cx}px ${cy + CHIP.R}px`,
          transform: `${z(60)}translateY(${(1 - toss) * 700 - 260 * 4 * toss * (1 - toss)}px) scale(${(1 + 0.18 * land) * lerp(1, 0.6, EASE(hop))}, ${(1 - 0.26 * land) * lerp(1, 0.6, EASE(hop))})` }}>
          <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${cx}px ${cy}px`, transform: `rotateX(${(1 - toss) * 720}deg)` }}>
            <Puck x={cx} y={cy} w={CHIP.R * 2} h={CHIP.R * 2} d={34} r="50%" front={G_INK} side="#111">
              <div style={{ width: CHIP.R * 2 - 34, height: CHIP.R * 2 - 34, borderRadius: "50%", border: "8px dashed rgba(255,255,255,0.75)", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={line(56, COLORS.paper)}>argenx</div>
                {/* two bright lines, clear of the dashed ring (Nel 11-16: "can't be seen") */}
                <div style={{ height: 64, overflow: "hidden", marginTop: 4 }}><Print t={tSci}><div style={{ ...label(COLORS.paper, 28), textAlign: "center", lineHeight: 1.1 }}>immunology<br />science</div></Print></div>
              </div>
            </Puck>
          </div>
        </div>
      ) : null}
      <Scatter x={CHIP.x} y={CHIP.y + CHIP.R} t={tBet} seed={171} n={8} zz={60} />
      <Scatter x={MATS.l} y={MATS.y - MATS.h / 2} t={tPlat + 850} seed={173} n={6} zz={60} />
    </AbsoluteFill>
  );
};
