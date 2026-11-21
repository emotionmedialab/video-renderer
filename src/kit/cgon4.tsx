// ─────────────────────────────────────────────────────────────────────────
// KIT · cgon4 — CG Oncology PIVOT-006 long-form, chunk 4 (1:29–2:05, "The numbers" + "What's missing").
// V2 house style (MOTION-RULES §0).
//  S14 Ratio       (ink)   — callback to S1's 32% stub (K2): a full-height SURVEILLANCE column slides in beside
//                            it; 0.32 lands on the stub; a red bracket grows over the gap: −68%.
//  S15 Months      (paper) — 17 month tiles flip up in a cascade (the camera trucks with it); 17 MONTHS lands.
//  S16 Jars        (red)   — two glass jars drop and their lids slam: GRADE ≥3 TREATMENT-RELATED / STOPPED
//                            TREATMENT DUE TO ONE, both empty (0).
//  S17 Track       (ink)   — the TOPLINE sheet on its cart; two gates rise (PRESENTED, PEER-REVIEWED); on
//                            "not yet" it rolls toward them and halts short of the first.
//  S18 Drawers     (paper) — a cabinet of three hatches; on each "no" a hatch flips down onto an empty cavity.
//  S19 Pillars     (red)   — HIGH-GRADE / LOW-GRADE pillars; the BENEFIT plank lands across both; on "without
//                            the numbers" both value plates flip to NO NUMBER.
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
import { G_RED, shadow, WType } from "./summit1";
import { RISK } from "./cgon1";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });
const G_GLASS = "linear-gradient(155deg, #ffffff 0%, #e9eef0 45%, #b9c2c6 100%)";

// ══════════════════════════════════════════════════════════════════════════
// S14 (ink) — "The hazard ratio for recurrence-free survival was 0.32, which is where the 68% comes from."
// Settled: the two columns on their bases (hero) / 0.32 on the stub / the −68% bracket.
// ══════════════════════════════════════════════════════════════════════════
export const RATIO = { refX: 540, stubX: RISK.x, baseW: 380, brX: 1200 };
const STUB_H = RISK.h * RISK.cut;
const CUT_Y = RISK.floor - STUB_H;
const TOP_Y = RISK.floor - RISK.h;

export const Ratio: React.FC<Win & { ref0: Cued; fig: Cued; gap: Cued }> = ({ from, to, ref0, fig, gap }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const tRef = at(ref0, 89200, from);
  const tFig = at(fig, 92410, from, tRef + 900);
  const tGap = at(gap, 94720, from, tFig + 900);
  if (ms < from || ms > to + 320) return null;

  const slide = ms < tRef ? 0 : sp(tRef, 12, 150);
  const br = ms < tGap ? 0 : sp(tGap, 11, 160);
  const brH = (CUT_Y - TOP_Y) * Math.min(1.04, br);
  const col = (x: number, h: number, lbl: string, r: string) => (
    <>
      <div style={shadow(x, RISK.floor + RISK.baseH + 10, RATIO.baseW * 1.05, 0.45)} />
      <Puck x={x} y={RISK.floor + RISK.baseH / 2} w={RATIO.baseW} h={RISK.baseH} d={130} r={30} front={G_STONE} side="#8f8f8f">
        <div style={label(COLORS.ink, 26)}>{lbl}</div>
      </Puck>
      <Puck x={x} y={RISK.floor - h / 2} w={RISK.w} h={h} d={120} r={r} front={G_WHITE} side="#9a9a9a" />
    </>
  );
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {/* the stub returns on its S1 seat (K2) */}
      <div style={{ position: "absolute", inset: 0, ...p3 }}>{col(RATIO.stubX, STUB_H, "CRETOSTIMOGENE", "8px 8px 30px 30px")}</div>
      {/* the reference: surveillance = the full column, slides in from the left on "hazard ratio" */}
      {slide > 0 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateX(${lerp(-1000, 0, slide)}px)` }}>
          {col(RATIO.refX, RISK.h, "SURVEILLANCE", "30px")}
        </div>
      ) : null}
      {/* 0.32 lands on the stub */}
      <div style={{ ...abs(RATIO.stubX - 300, CUT_Y - 190), width: 600, display: "flex", justifyContent: "center", transform: z(30) || undefined }}>
        <WType text="0.32" t={tFig - 120} size={150} color={COLORS.paper} />
      </div>
      {/* the gap: a hairline from the surveillance top + a red bracket that grows up from the stub's top */}
      {br > 0 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: z(40) || undefined }}>
          <div style={{ ...abs(RATIO.refX + RISK.w / 2 + 10, TOP_Y - 2), width: RATIO.brX - RATIO.refX - RISK.w / 2 - 10, height: 4, background: "rgba(255,255,255,0.0)",
            borderTop: `4px solid ${COLORS.paper}`, transformOrigin: "0% 50%", transform: `scaleX(${clamp01(br)})` }} />
          <div style={{ ...abs(RATIO.brX - 10, CUT_Y - brH), width: 20, height: brH, borderRadius: 10, background: G_RED }} />
          {[CUT_Y, CUT_Y - brH].map((y, i) => <div key={i} style={{ ...abs(RATIO.brX - 40, y - 8), width: 50, height: 16, borderRadius: 8, background: G_RED }} />)}
          <div style={{ ...abs(RATIO.brX + 50, (CUT_Y + TOP_Y) / 2 - 60) }}>
            <WType text="−68%" t={tGap + 150} size={110} color={COLORS.paper} />
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S15 (paper) — "Median follow-up was 17 months."   Settled: 17 month tiles (hero) / 17 MONTHS / MEDIAN FOLLOW-UP.
// ══════════════════════════════════════════════════════════════════════════
export const MONTHS = { n: 17, w: 66, h: 86, pitch: 80, y: 430 };
export const MONTHS_OPEN_X = 420;

export const Months: React.FC<Win & { follow: Cued; fig: Cued }> = ({ from, to, follow, fig }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const tF = at(follow, 96790, from);
  const tFig = at(fig, 97830, from, tF + 800);
  if (ms < from || ms > to + 320) return null;

  const x0 = 960 - ((MONTHS.n - 1) * MONTHS.pitch) / 2;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {Array.from({ length: MONTHS.n }, (_, i) => {
        const t0 = tF - 150 + i * 50;
        if (ms < t0) return null;
        const p = sp(t0, 10, 180);
        const last = i === MONTHS.n - 1;
        return (
          <div key={i} style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${x0 + i * MONTHS.pitch}px ${MONTHS.y + MONTHS.h / 2}px`, transform: `rotateX(${lerp(-90, 0, p)}deg)` }}>
            <Puck x={x0 + i * MONTHS.pitch} y={MONTHS.y} w={MONTHS.w} h={MONTHS.h} d={24} r={14} front={last ? G_RED : G_INK} side={last ? "#8f0e15" : "#151515"}>
              <div style={label(COLORS.paper, 28)}>{i + 1}</div>
            </Puck>
          </div>
        );
      })}
      <div style={{ ...abs(0, 560), width: 1920, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, transform: z(30) || undefined }}>
        <WType text="17 MONTHS" t={tFig - 120} size={120} color={COLORS.ink} />
        {ms >= tFig ? <div style={label("#6b6b6b", 30)}>MEDIAN FOLLOW-UP</div> : null}
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S16 (red) — "On safety, the company reported no grade 3 or higher treatment-related side effects, and no
// patients stopping treatment because of one."   Settled: two empty jars (hero) with their labels.
// ══════════════════════════════════════════════════════════════════════════
export const JARS = { x: [680, 1240] as const, base: 790, w: 320, h: 380 };

const Jar: React.FC<{ x: number; t: number; l1: string; l2: string }> = ({ x, t, l1, l2 }) => {
  const ms = useMs();
  const p3 = useP3();
  const drop = useDropX();
  const k = useK();
  const d = drop(t - 380, 800, 380);
  if (!d.on) return null;
  const lidT = t + 260;
  const lid = EASE(k(lidT, 200));
  const bodyY = JARS.base - JARS.h / 2;
  return (
    <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${x}px ${JARS.base}px`, transform: `translateY(${d.dy}px) scale(${d.sx}, ${d.sy})` }}>
      <div style={shadow(x, JARS.base + 10, JARS.w * 1.1, 0.35)} />
      <Puck x={x} y={bodyY} w={JARS.w} h={JARS.h} d={120} r={50} front={G_GLASS} side="#8d979b">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={line(130, COLORS.ink)}>0</div>
          <div style={label(COLORS.ink, 24)}>{l1}</div>
          <div style={label(COLORS.ink, 24)}>{l2}</div>
        </div>
      </Puck>
      {ms >= lidT ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${-160 * (1 - lid)}px)` }}>
          <Puck x={x} y={bodyY - JARS.h / 2 - 22} w={JARS.w + 30} h={48} d={140} r={20} front={G_INK} side="#151515" />
        </div>
      ) : null}
    </div>
  );
};

export const Jars: React.FC<Win & { grade: Cued; stop: Cued }> = ({ from, to, grade, stop }) => {
  const ms = useMs();
  const p3 = useP3();
  const tG = at(grade, 101110, from);
  const tS = at(stop, 104810, from, tG + 1200);
  if (ms < from || ms > to + 320) return null;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <Jar x={JARS.x[0]} t={tG} l1="GRADE ≥3" l2="TREATMENT-RELATED" />
      <Jar x={JARS.x[1]} t={tS} l1="STOPPED TREATMENT" l2="BECAUSE OF ONE" />
      <Scatter x={JARS.x[0]} y={JARS.base} t={tG} seed={23} n={6} color={COLORS.paper} zz={60} />
      <Scatter x={JARS.x[1]} y={JARS.base} t={tS} seed={25} n={6} color={COLORS.paper} zz={60} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S17 (ink) — "These are company-reported topline results, not yet presented or peer-reviewed."
// Settled: the sheet halted short of the gates (hero) / PRESENTED gate / PEER-REVIEWED gate.
// ══════════════════════════════════════════════════════════════════════════
export const TRACK = { y: 760, x0: 260, x1: 1660, sheetX0: 480, sheetX1: 780, gates: [1200, 1500] as const, gateTop: 470, sheetW: 260, sheetH: 300 };
export const TRACK_OPEN_X = 960 - (TRACK.sheetX0 + TRACK.gates[0]) / 2 + 60;

export const Track: React.FC<Win & { co: Cued; notYet: Cued }> = ({ from, to, co, notYet }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const drop = useDropX();
  const sp = useSpringX();
  const tIn = from + 80;
  const tCo = at(co, 108420, from, tIn + 600);
  const tNot = at(notYet, 110550, from, tCo + 900);
  if (ms < from || ms > to + 320) return null;

  const sh = drop(tIn, 700, 360);
  const gates = ms < tCo ? 0 : sp(tCo, 12, 160);
  const roll = ms < tNot ? 0 : sp(tNot, 13, 120); //      rolls and halts with one small rock forward
  const sx = lerp(TRACK.sheetX0, TRACK.sheetX1, Math.min(1, roll));
  const rock = (roll - Math.min(1, roll)) * 60; //       the overshoot becomes a forward lean, not a crossing
  const sheetBot = TRACK.y - 50;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={shadow((TRACK.x0 + TRACK.x1) / 2, TRACK.y + 30, TRACK.x1 - TRACK.x0, 0.4)} />
      <Puck x={(TRACK.x0 + TRACK.x1) / 2} y={TRACK.y} w={TRACK.x1 - TRACK.x0} h={26} d={120} r={13} front={G_GREY} side="#555" />
      {gates > 0 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${lerp(500, 0, gates)}px)` }}>
          {TRACK.gates.map((gx, i) => (
            <React.Fragment key={gx}>
              {[-120, 120].map((dx) => (
                <Puck key={dx} x={gx + dx} y={(TRACK.gateTop + TRACK.y) / 2} w={26} h={TRACK.y - TRACK.gateTop} d={26} r={13} front={G_STONE} side="#8a8a8a" />
              ))}
              <Puck x={gx} y={TRACK.gateTop} w={270} h={70} d={40} r={18} front={G_WHITE} side="#9a9a9a">
                <div style={label(COLORS.ink, 26)}>{i === 0 ? "PRESENTED" : "PEER-REVIEWED"}</div>
              </Puck>
            </React.Fragment>
          ))}
        </div>
      ) : null}
      {sh.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(30)}translate(${sx - TRACK.sheetX0}px, ${sh.dy}px)` }}>
          <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${TRACK.sheetX0 + TRACK.sheetW / 2}px ${sheetBot}px`, transform: `rotateZ(${rock}deg) scale(${sh.sx}, ${sh.sy})` }}>
            {/* cart */}
            <Puck x={TRACK.sheetX0} y={TRACK.y - 30} w={TRACK.sheetW + 40} h={34} d={90} r={14} front={G_INK} side="#111" />
            {[-90, 90].map((dx) => <Puck key={dx} x={TRACK.sheetX0 + dx} y={TRACK.y - 10} w={34} h={34} d={20} r="50%" front={G_GREY} side="#444" />)}
            {/* the sheet */}
            <Puck x={TRACK.sheetX0} y={sheetBot - TRACK.sheetH / 2} w={TRACK.sheetW} h={TRACK.sheetH} d={14} r={14} front="linear-gradient(180deg,#ffffff,#ececec)" side="#cfcfcf">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <div style={line(40, COLORS.ink)}>TOPLINE</div>
                <div style={{ width: 160, height: 10, borderRadius: 5, background: "#d0d0d0" }} />
                <div style={{ width: 180, height: 10, borderRadius: 5, background: "#d0d0d0" }} />
                <div style={label("#6b6b6b", 20)}>COMPANY-REPORTED</div>
              </div>
            </Puck>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S18 (paper) — "The release gives no recurrence rates for each arm, no event counts, and no separate high-grade
// or low-grade figures."   Settled: the cabinet with three open, empty hatches (hero; a three-row list, F3).
// ══════════════════════════════════════════════════════════════════════════
export const CAB = { x: 960, y: 520, w: 1120, h: 560, rows: [330, 520, 710] as const, rowH: 150, doorX: 1150, doorW: 380, lblX: 640 };
const ROWS = ["RECURRENCE RATES BY ARM", "EVENT COUNTS", "HIGH- / LOW-GRADE FIGURES"];

export const Drawers: React.FC<Win & { r1: Cued; r2: Cued; r3: Cued }> = ({ from, to, r1, r2, r3 }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const drop = useDropX();
  const sp = useSpringX();
  const t1 = at(r1, 114160, from);
  const t2 = at(r2, 116070, from, t1 + 800);
  const t3 = at(r3, 117260, from, t2 + 700);
  if (ms < from || ms > to + 320) return null;

  const cab = drop(from + 60, 700, 360);
  const ts = [t1, t2, t3];
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {cab.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${CAB.x}px ${CAB.y + CAB.h / 2}px`, transform: `translateY(${cab.dy}px) scale(${cab.sx}, ${cab.sy})` }}>
          <div style={shadow(CAB.x, CAB.y + CAB.h / 2 + 14, CAB.w * 0.95, 0.2)} />
          <Puck x={CAB.x} y={CAB.y} w={CAB.w} h={CAB.h} d={120} r={28} front={G_STONE} side="#9a9a9a" />
          {CAB.rows.map((ry, i) => {
            const open = ms < ts[i] ? 0 : sp(ts[i], 9, 150);
            return (
              <React.Fragment key={i}>
                <div style={{ ...abs(CAB.lblX - 260, ry - 30), width: 520, display: "flex", justifyContent: "flex-end", transform: z(62) || undefined }}>
                  <div style={label(COLORS.ink, 30)}>{ROWS[i]}</div>
                </div>
                {/* the empty cavity behind the hatch */}
                <div style={{ position: "absolute", inset: 0, transform: z(61) || undefined }}>
                  <div style={{ ...abs(CAB.doorX - CAB.doorW / 2, ry - CAB.rowH / 2), width: CAB.doorW, height: CAB.rowH, borderRadius: 16, background: "linear-gradient(180deg,#0a0a0a,#2a2a2a)",
                    display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {open > 0.5 ? <div style={label("#8a8a8a", 24)}>NOT IN THE RELEASE</div> : null}
                  </div>
                </div>
                {/* the hatch: hinged on its bottom edge, flips down toward the camera */}
                <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${CAB.doorX}px ${ry + CAB.rowH / 2}px`, transform: `${z(64)}rotateX(${lerp(0, 82, open)}deg)` }}>
                  <div style={{ ...abs(CAB.doorX - CAB.doorW / 2, ry - CAB.rowH / 2), width: CAB.doorW, height: CAB.rowH, borderRadius: 16, background: G_WHITE,
                    boxShadow: "0 6px 12px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 120, height: 18, borderRadius: 9, background: G_GREY }} />
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S19 (red) — "The company says the benefit held in both, without the numbers."
// Settled: the two pillars carrying the plank (hero) / plank label / NO NUMBER plates.
// ══════════════════════════════════════════════════════════════════════════
export const PIL = { x: [720, 1200] as const, top: 470, floor: 800, w: 190, plankY: 430, plankW: 760, plateY: 560 };

export const Pillars: React.FC<Win & { held: Cued; without: Cued }> = ({ from, to, held, without }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const drop = useDropX();
  const sp = useSpringX();
  const tIn = from + 80;
  const tHeld = at(held, 122270, from, tIn + 900);
  const tW = at(without, 123190, from, tHeld + 600);
  if (ms < from || ms > to + 320) return null;

  const rise = sp(tIn, 12, 160);
  const plank = drop(tHeld - 380, 700, 380);
  const flip = ms < tW ? 0 : sp(tW, 10, 150);
  const h = PIL.floor - PIL.top;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${lerp(600, 0, rise)}px)` }}>
        {PIL.x.map((x, i) => (
          <React.Fragment key={x}>
            <div style={shadow(x, PIL.floor + 8, PIL.w * 1.3, 0.3)} />
            <Puck x={x} y={PIL.top + h / 2} w={PIL.w} h={h} d={150} r={22} front={G_WHITE} side="#9a9a9a">
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 30, display: "flex", justifyContent: "center" }}>
                <div style={label(COLORS.ink, 26)}>{i === 0 ? "HIGH-GRADE" : "LOW-GRADE"}</div>
              </div>
            </Puck>
            {/* the value plate: blank face → flips over its horizontal axis to NO NUMBER (pre-rotated back face) */}
            <div style={{ ...abs(x - 75, PIL.plateY - 45), width: 150, height: 90, ...p3, transform: `${z(80)}rotateX(${180 * flip}deg)` }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: 14, background: G_GREY, backfaceVisibility: "hidden" }} />
              <div style={{ position: "absolute", inset: 0, borderRadius: 14, background: G_INK, backfaceVisibility: "hidden", transform: "rotateX(180deg)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={label(COLORS.paper, 24)}>NO</div>
                <div style={label(COLORS.paper, 24)}>NUMBER</div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
      {plank.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `960px ${PIL.top}px`, transform: `${z(10)}translateY(${plank.dy}px) scale(${plank.sx}, ${plank.sy})` }}>
          <Puck x={960} y={PIL.plankY} w={PIL.plankW} h={80} d={170} r={20} front={G_INK} side="#151515">
            <div style={label(COLORS.paper, 30)}>COMPANY: BENEFIT HELD IN BOTH</div>
          </Puck>
        </div>
      ) : null}
      <Scatter x={960} y={PIL.top} t={tHeld} seed={27} n={8} color={COLORS.paper} zz={80} />
    </AbsoluteFill>
  );
};
