// ─────────────────────────────────────────────────────────────────────────
// KIT · stipple4 — Lilly × Stipple Bio long-form, chunk 4 (1:25–2:00, "The company"). V2 house style.
//  S15 Company  (ink)   — the STIPPLE orb drops onto a PRIVATE BIOTECH plinth; a red map pin plants beside it
//                         (CAMBRIDGE, MA).
//  S16 Funding  (paper) — an ink cloak over the orb lifts away on "stealth"; ten coins stack beside it on "$100";
//                         the $100M SERIES A · APRIL plate drops on top; three co-lead chips land, one per name.
//  S17 ADC      (red)   — STP-100 plate prints; an antibody drops in; on "antibody-drug" a payload clicks onto
//                         its stem (the conjugate).
//  S18 Pipeline (ink)   — the STP-100 cart rolls down the rail and stops short of the PHASE 1 gate, which rises;
//                         a red PLANNED · EARLY 2027 plate drops onto the gate; SOLID TUMORS prints.
//  S19 Doors    (paper) — three boxes (TARGETS / COUNT / CLINICAL); each door swings open on its "no" to an empty
//                         interior.
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
import { G_RED, shadow } from "./summit1";
import { Orb } from "./stipple1";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });

// ══════════════════════════════════════════════════════════════════════════
// S15 (ink) — "Stipple is a private biotech in Cambridge, Massachusetts."
// Settled: the orb on its PRIVATE BIOTECH plinth (hero) / the red pin / CAMBRIDGE, MA.
// ══════════════════════════════════════════════════════════════════════════
export const CO = { floor: 830, plX: 820, plW: 540, plH: 130, orbR: 150, pinX: 1360, pinS: 150 };

export const Company: React.FC<Win & { orb: Cued; pin: Cued }> = ({ from, to, orb, pin }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const drop = useDropX();
  const tO = at(orb, 85840, from);
  const tP = at(pin, 87040, from, tO + 600);
  if (ms < from || ms > to + 320) return null;

  const plRise = ms < from + 250 ? 0 : sp(from + 250, 12, 170);
  const plTop = CO.floor - CO.plH;
  const O = drop(tO - 340, 760, 340);
  const P = drop(tP - 300, 820, 300);
  const pinTipY = CO.floor - 40;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {plRise > 0 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${lerp(360, 0, plRise)}px)` }}>
          <div style={shadow(CO.plX, CO.floor + 8, CO.plW * 1.04, 0.5)} />
          <Puck x={CO.plX} y={CO.floor - CO.plH / 2} w={CO.plW} h={CO.plH} d={160} r={30} front={G_STONE} side="#8a8a8a">
            <div style={label(COLORS.ink, 36)}>PRIVATE BIOTECH</div>
          </Puck>
        </div>
      ) : null}
      {O.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${CO.plX}px ${plTop}px`, transform: `${z(20)}translateY(${O.dy}px) scale(${O.sx}, ${O.sy})` }}>
          <Orb x={CO.plX} y={plTop - CO.orbR} r={CO.orbR} />
        </div>
      ) : null}
      <Scatter x={CO.plX} y={plTop} t={tO} seed={40} n={7} color={COLORS.paper} zz={60} />
      {/* the map pin plants its tip in the floor; its plate sits on the floor in front of it */}
      {P.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${CO.pinX}px ${pinTipY}px`, transform: `${z(30)}translateY(${P.dy}px) scale(${P.sx}, ${P.sy})` }}>
          <div style={shadow(CO.pinX, CO.floor - 30, 90, 0.5)} />
          <Puck x={CO.pinX} y={pinTipY - CO.pinS * 0.72} w={CO.pinS} h={CO.pinS} d={60} r="50% 50% 50% 0" front={G_RED} side="#8f0e15" style={{ transform: "rotateZ(-45deg)" }}>
            <div style={{ width: 50, height: 50, borderRadius: "50%", background: COLORS.paper }} />
          </Puck>
        </div>
      ) : null}
      <div style={{ ...abs(CO.pinX - 220, CO.floor + 16), width: 440, display: "flex", justifyContent: "center", transform: z(40) || undefined }}>
        {ms >= tP + 120 ? (
          <Print t={tP + 120}><div style={{ padding: "10px 24px", borderRadius: 24, background: COLORS.paper }}><div style={label(COLORS.ink, 32)}>CAMBRIDGE, MA</div></div></Print>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S16 (paper) — "It came out of stealth in April with a $100 million Series A, co-led by RA Capital, a16z Bio+Health,
// and Nextech Invest."   Settled: the ten-coin stack + $100M SERIES A plate (hero) / the orb / the co-lead chips.
// ══════════════════════════════════════════════════════════════════════════
export const FUND = { floor: 740, orbX: 600, orbR: 140, stackX: 1180, coinW: 300, coinH: 32, n: 10, chipY: 840, chipXs: [620, 960, 1300] };
const LEADS = ["RA CAPITAL", "a16z BIO+HEALTH", "NEXTECH INVEST"];

export const Funding: React.FC<Win & { stealth: Cued; hundred: Cued; series: Cued; l1: Cued; l2: Cued; l3: Cued }> = ({ from, to, stealth, hundred, series, l1, l2, l3 }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const drop = useDropX();
  const tSt = at(stealth, 89580, from);
  const tH = at(hundred, 90950, from, tSt + 700);
  const tSe = at(series, 92210, from, tH + 700);
  const tL = [at(l1, 93650, from, tSe + 500), 0, 0];
  tL[1] = at(l2, 94765, from, tL[0] + 400);
  tL[2] = at(l3, 96830, from, tL[1] + 400);
  if (ms < from || ms > to + 320) return null;

  const orbIn = ms < from + 200 ? 0 : sp(from + 200, 12, 170);
  // the cloak: an ink dome over the orb; on "stealth" it lifts straight up and leaves the card
  const lift = EASE(k(tSt - 150, 650));
  const pitch = (FUND.coinH + 2);
  const stackTop = FUND.floor - FUND.n * pitch;
  const plate = drop(tSe - 300, 520, 300);
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {orbIn > 0 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${lerp(420, 0, orbIn)}px)` }}>
          <div style={shadow(FUND.orbX, FUND.floor + 6, 300, 0.22)} />
          <Orb x={FUND.orbX} y={FUND.floor - FUND.orbR} r={FUND.orbR} />
          {lift < 1 ? (
            <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(60)}translateY(${-900 * lift * lift}px)` }}>
              <Puck x={FUND.orbX} y={FUND.floor - FUND.orbR - 10} w={FUND.orbR * 2 + 70} h={FUND.orbR * 2 + 40} d={70} r="50% 50% 18px 18px / 60% 60% 18px 18px" front={G_INK} side="#151515">
                <div style={label("rgba(255,255,255,0.75)", 30)}>IN STEALTH</div>
              </Puck>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ten coins drop one on another ($10M each, one action) */}
      {Array.from({ length: FUND.n }, (_, i) => {
        const d = drop(tH - 420 + i * 55, 520, 240);
        if (!d.on) return null;
        const y = FUND.floor - pitch * (i + 0.5);
        return (
          <div key={i} style={{ position: "absolute", inset: 0, ...p3, transform: `${z(10)}translateY(${d.dy}px)` }}>
            <Puck x={FUND.stackX} y={y} w={FUND.coinW} h={FUND.coinH} d={60} r={17} front={G_GREY} side="#5e5e5e" />
          </div>
        );
      })}
      {plate.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${FUND.stackX}px ${stackTop}px`, transform: `${z(30)}translateY(${plate.dy}px) scale(${plate.sx}, ${plate.sy})` }}>
          <Puck x={FUND.stackX} y={stackTop - 80} w={460} h={140} d={50} r={30} front={G_RED} side="#8f0e15">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={line(70, COLORS.paper)}>$100M</div>
              <div style={label(COLORS.paper, 28)}>SERIES A · APRIL</div>
            </div>
          </Puck>
        </div>
      ) : null}
      <Scatter x={FUND.stackX} y={stackTop} t={tSe} seed={41} n={6} color="#9a9a9a" zz={60} />

      {/* the co-leads: one chip per spoken name */}
      {FUND.chipXs.map((x, i) => {
        const d = drop(tL[i] - 260, 300, 260);
        if (!d.on) return null;
        return (
          <div key={i} style={{ position: "absolute", inset: 0, ...p3, transform: `${z(30)}translateY(${d.dy}px)` }}>
            <Puck x={x} y={FUND.chipY} w={310} h={62} d={30} r={31} front={G_INK} side="#151515">
              <div style={label(COLORS.paper, 26)}>{LEADS[i]}</div>
            </Puck>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S17 (red) — "Its lead drug, STP-100, is an antibody-drug conjugate."
// Settled: the antibody with its payload clicked onto the stem (hero) / the STP-100 plate.
// ══════════════════════════════════════════════════════════════════════════
export const ADC = { x: 960, armY: 200, fork: 400, stemEnd: 640, payR: 64, plateY: 860 };

const UprightY: React.FC<{ x: number }> = ({ x }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
    <g stroke="#ffffff" strokeWidth={54} strokeLinecap="round" fill="none">
      <path d={`M${x} ${ADC.stemEnd} V${ADC.fork} M${x} ${ADC.fork} L${x - 170} ${ADC.armY} M${x} ${ADC.fork} L${x + 170} ${ADC.armY}`} />
    </g>
  </svg>
);

export const AdcBuild: React.FC<Win & { name: Cued; drop: Cued; click: Cued }> = ({ from, to, name, drop: dropC, click }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const drop = useDropX();
  const tN = at(name, 98830, from);
  const tD = at(dropC, 99440, from, tN + 400);
  const tC = at(click, 101160, from, tD + 900);
  if (ms < from || ms > to + 320) return null;

  const Y = drop(tD - 340, 800, 340);
  // the payload flies in from the right on a low arc and clicks onto the stem end on "antibody-drug"
  const F = 520;
  const fp = clamp01((ms - (tC - F)) / F);
  const payX = lerp(ADC.x + 900, ADC.x, EASE(fp));
  const payY = lerp(ADC.stemEnd + 60, ADC.stemEnd + 40 + ADC.payR, fp) - 120 * Math.sin(Math.PI * fp);
  const clickSq = ms >= tC ? 1 - sp(tC, 7, 220, 0.6) : 0;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={{ ...abs(0, 70), width: 1920, display: "flex", justifyContent: "center", transform: z(40) || undefined }}>
        {ms >= tN ? (
          <Print t={tN}><div style={{ padding: "12px 30px", borderRadius: 30, background: COLORS.paper }}><div style={label(COLORS.ink, 36)}>STP-100 · STIPPLE'S LEAD DRUG</div></div></Print>
        ) : null}
      </div>
      {Y.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${ADC.x}px ${ADC.stemEnd}px`, transform: `${z(20)}translateY(${Y.dy}px) scale(${Y.sx}, ${Y.sy})` }}>
          <UprightY x={ADC.x} />
          {/* the linker stub the payload clicks onto */}
          <div style={{ ...abs(ADC.x - 12, ADC.stemEnd), width: 24, height: 44, borderRadius: 8, background: "#d0d0d0" }} />
        </div>
      ) : null}
      {fp > 0 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: z(30) || undefined }}>
          <div style={{ ...abs(payX - ADC.payR, payY - ADC.payR), width: ADC.payR * 2, height: ADC.payR * 2, borderRadius: "50%",
            background: "radial-gradient(circle at 35% 30%, #5a5a5a 0%, #262626 60%, #050505 100%)", boxShadow: "0 12px 22px rgba(0,0,0,0.45)",
            transformOrigin: "50% 0%", transform: `scale(${1 + 0.14 * clickSq}, ${1 - 0.18 * clickSq})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={label(COLORS.paper, 22)}>DRUG</div>
          </div>
        </div>
      ) : null}
      <Scatter x={ADC.x} y={ADC.stemEnd + 40} t={tC} seed={42} n={6} color={COLORS.paper} zz={60} />
      <div style={{ ...abs(0, ADC.plateY - 30), width: 1920, display: "flex", justifyContent: "center", transform: z(40) || undefined }}>
        {ms >= tC + 150 ? (
          <Print t={tC + 150}><div style={{ ...label(COLORS.paper, 40) }}>ANTIBODY + DRUG = ANTIBODY-DRUG CONJUGATE</div></Print>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S18 (ink) — "Stipple says the Lilly deal lets it keep advancing its own pipeline, with a Phase 1 trial of STP-100
// planned for early 2027, in solid tumors including pancreatic cancer."
// Settled: the rail, the cart stopped short of the PHASE 1 gate (hero) / PLANNED · EARLY 2027 / SOLID TUMORS.
// ══════════════════════════════════════════════════════════════════════════
export const PIPE = { railY: 720, x0: 180, x1: 1760, cartX0: 380, cartX: 930, gateX: 1290, gateW: 360, gateTop: 340 };

export const Pipeline: React.FC<Win & { advance: Cued; phase: Cued; early: Cued; solid: Cued }> = ({ from, to, advance, phase, early, solid }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const drop = useDropX();
  const tA = at(advance, 104830, from);
  const tP = at(phase, 106870, from, tA + 900);
  const tE = at(early, 109900, from, tP + 900);
  const tS = at(solid, 111370, from, tE + 700);
  if (ms < from || ms > to + 320) return null;

  const railIn = ms < from + 200 ? 0 : sp(from + 200, 12, 170);
  const roll = EASE(k(tA - 200, 1100));
  const cartX = lerp(PIPE.cartX0, PIPE.cartX, roll);
  const stopSq = ms >= tA + 900 ? 1 - sp(tA + 900, 8, 200, 0.6) : 0; // a springy lean forward as it stops
  const gate = ms < tP - 300 ? 0 : sp(tP - 300, 11, 170);
  const G = drop(tE - 320, 600, 320);
  const postH = PIPE.railY - PIPE.gateTop;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {railIn > 0 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${lerp(400, 0, railIn)}px)` }}>
          <Puck x={(PIPE.x0 + PIPE.x1) / 2} y={PIPE.railY + 30} w={PIPE.x1 - PIPE.x0} h={60} d={120} r={30} front={G_STONE} side="#7d7d7d" />
          <div style={{ ...abs(560, PIPE.railY + 80), ...label("rgba(255,255,255,0.7)", 28) }}>STIPPLE'S OWN PIPELINE</div>
        </div>
      ) : null}
      {/* the PHASE 1 gate: two ink posts and a lintel, rising out of the rail */}
      {gate > 0 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${lerp(postH + 120, 0, gate)}px)` }}>
          {[-1, 1].map((sg) => (
            <Puck key={sg} x={PIPE.gateX + (sg * PIPE.gateW) / 2} y={PIPE.gateTop + postH / 2} w={40} h={postH} d={40} r={14} front={G_INK} side="#111" />
          ))}
          <Puck x={PIPE.gateX} y={PIPE.gateTop} w={PIPE.gateW + 80} h={84} d={60} r={22} front={G_WHITE} side="#9a9a9a">
            <div style={label(COLORS.ink, 40)}>PHASE 1</div>
          </Puck>
        </div>
      ) : null}
      {/* the cart carrying STP-100: rolls in and stops short of the gate */}
      {railIn > 0 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: z(40) || undefined }}>
          <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${cartX}px ${PIPE.railY}px`, transform: `skewX(${-6 * stopSq}deg)` }}>
            <Puck x={cartX} y={PIPE.railY - 70} w={240} h={110} d={80} r={26} front={G_INK} side="#151515">
              <div style={label(COLORS.paper, 34)}>STP-100</div>
            </Puck>
            {[-70, 70].map((dx) => (
              <div key={dx} style={{ ...abs(cartX + dx - 22, PIPE.railY - 26), width: 44, height: 44, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #ffffff, #8a8a8a)" }} />
            ))}
          </div>
        </div>
      ) : null}
      {/* the date plate drops onto the lintel */}
      {G.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${PIPE.gateX}px ${PIPE.gateTop - 42}px`, transform: `${z(50)}translateY(${G.dy}px) scale(${G.sx}, ${G.sy})` }}>
          <Puck x={PIPE.gateX} y={PIPE.gateTop - 42 - 62} w={420} h={124} d={46} r={28} front={G_RED} side="#8f0e15">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={label(COLORS.paper, 26)}>PLANNED</div>
              <div style={line(60, COLORS.paper)}>EARLY 2027</div>
            </div>
          </Puck>
        </div>
      ) : null}
      <Scatter x={PIPE.gateX} y={PIPE.gateTop - 42} t={tE} seed={43} n={6} color={COLORS.paper} zz={70} />
      <div style={{ ...abs(PIPE.gateX - 400, PIPE.railY + 80), width: 800, display: "flex", justifyContent: "center", transform: z(40) || undefined }}>
        {ms >= tS ? <Print t={tS}><div style={{ padding: "10px 24px", borderRadius: 24, background: COLORS.paper }}><div style={label(COLORS.ink, 30)}>SOLID TUMORS · INCL. PANCREATIC</div></div></Print> : null}
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S19 (paper) — "The announcement names no targets for the Lilly work, gives no count, and describes none of it as
// clinical."   Settled: three open boxes, each empty (hero).
// ══════════════════════════════════════════════════════════════════════════
export const BOX = { floor: 790, xs: [520, 960, 1400], w: 330, h: 380 };
const BOX_LAB = ["TARGETS", "COUNT", "CLINICAL"];
const BOX_IN = ["NOT NAMED", "NOT GIVEN", "NONE"];

export const Doors: React.FC<Win & { d1: Cued; d2: Cued; d3: Cued }> = ({ from, to, d1, d2, d3 }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const tD = [at(d1, 115360, from), 0, 0];
  tD[1] = at(d2, 117390, from, tD[0] + 500);
  tD[2] = at(d3, 118680, from, tD[1] + 500);
  if (ms < from || ms > to + 320) return null;

  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {BOX.xs.map((x, i) => {
        const r = ms < from + 150 + i * 110 ? 0 : sp(from + 150 + i * 110, 12, 170);
        if (r <= 0) return null;
        const open = ms < tD[i] - 160 ? 0 : sp(tD[i] - 160, 12, 240); // the door swings on its outer hinge (box 3: right, so its inner face shows), overshoots once
        const cy = BOX.floor - BOX.h / 2;
        const left = x - BOX.w / 2;
        return (
          <div key={x} style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${lerp(BOX.h + 200, 0, r)}px)` }}>
            <div style={shadow(x, BOX.floor + 8, BOX.w * 1.04, 0.22)} />
            {/* the box body; its front is the empty interior */}
            <Puck x={x} y={cy} w={BOX.w} h={BOX.h} d={180} r={26} front="linear-gradient(180deg, #050505 0%, #262626 100%)" side="#9a9a9a">
              <div style={{ ...label("rgba(255,255,255,0.55)", 30) }}>{BOX_IN[i]}</div>
            </Puck>
            {/* the door: hinged on the left edge, in front of the body */}
            <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${i === 2 ? left + BOX.w : left}px ${cy}px`, transform: `${z(92)}rotateY(${(i === 2 ? 80 : -80) * open}deg)` }}>
              <div style={{ ...abs(left, cy - BOX.h / 2), width: BOX.w, height: BOX.h, borderRadius: 26, background: G_STONE, backfaceVisibility: "hidden",
                boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={label(COLORS.ink, 40)}>{BOX_LAB[i]}</div>
                <div style={{ position: "absolute", [i === 2 ? "left" : "right"]: 26, top: BOX.h / 2 - 30, width: 18, height: 60, borderRadius: 9, background: "#8a8a8a" }} />
              </div>
              <div style={{ ...abs(left, cy - BOX.h / 2), width: BOX.w, height: BOX.h, borderRadius: 26, background: "linear-gradient(155deg, #d9d9d9, #a9a9a9)",
                backfaceVisibility: "hidden", transform: "rotateY(180deg)" }} />
            </div>
            {open > 0 ? (
              <div style={{ ...abs(x - 200, BOX.floor + 22), width: 400, textAlign: "center", ...label(COLORS.ink, 30), transform: z(40) || undefined }}>{BOX_LAB[i]}</div>
            ) : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
