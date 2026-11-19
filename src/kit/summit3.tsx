// ─────────────────────────────────────────────────────────────────────────
// KIT · summit3 — Summit ivonescimab CRL long-form, chunk 3 (1:09.6–1:45.9, "The trial").
// SECTION SPINE: Summit's application is a slab resting on two pillars (the two primary endpoints) on the HARMONi
// foundation. It is built in S10, acts in S11 (PFS wins) and returns on the SAME seats in S13 (OS falls short).
//  S10/S11 Pillars (ink) — slab hovers in, foundation slides under, two pillars grow; pillar 1 prints, turns red
//                          and thumps on "won", HR 0.52 lands on its face.
//  S12 Months     (paper)— two columns of month segments rise: 6.8 vs 4.4.
//  S13 Pillars    (ink)  — pillar 2 prints "Overall survival", sinks on "fell short" (gap under the slab), HR 0.79.
//  S14 PRuler     (red)  — a p-value ruler; the 0.057 marker slides in and stops; the 0.0448 flag springs up.
// Text: whole-word `WType` only (Nel 11-19: no per-letter drops).
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { EASE, fadeOut } from "./plusone";
import { label, line } from "./inovio";
import { Print } from "./ryb1b";
import { useP3, useZ } from "./camera";
import { Scatter, useEnt, useSpringX } from "./v2style";
import { G_INK, G_STONE, G_WHITE, Puck } from "./argenx1v2b";
import { G_RED, WType, shadow } from "./summit1";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });

// ══════════════════════════════════════════════════════════════════════════
// The spine. Seats exported so S13 returns to the same places (K2).
// ══════════════════════════════════════════════════════════════════════════
export const SP = { floor: 830, baseH: 80, baseW: 1160, slabY: 330, slabH: 90, slabW: 1020, px: [680, 1240] as const, pw: 330, short: 130 };
const BASE_TOP = SP.floor - SP.baseH; //                  750
const SLAB_BOT = SP.slabY + SP.slabH / 2; //              375
const PIL_H = BASE_TOP - SLAB_BOT; //                     375

export type PillarCues = {
  app: Cued; harmoni: Cued; two: Cued;
  first: Cued; won: Cued; hr1: Cued; //                   S11
  second: Cued; short: Cued; hr2: Cued; //                S13
  retireHr1?: Cued; //                                    S13: pillar 1's 0.52 retires (F2), it keeps "PFS"
};

export const Pillars: React.FC<Win & PillarCues> = ({ from, to, app, harmoni, two, first, won, hr1, second, short, hr2, retireHr1 }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const tApp = at(app, 69870, from);
  const tHar = at(harmoni, 71340, from, tApp + 600);
  const tTwo = at(two, 74210, from, tHar + 800);
  const tFirst = at(first, 76610, from, tTwo + 700);
  const tWon = at(won, 79230, from, tFirst + 600);
  const tHr1 = at(hr1, 80220, from, tWon + 600);
  const tSecond = at(second, 90480, from, tHr1 + 600);
  const tShort = at(short, 93120, from, tSecond + 600);
  const tHr2 = at(hr2, 96380, from, tShort + 600);
  const tRet = retireHr1 ? at(retireHr1, 1e9, from) : 1e9;
  if (ms < from || ms > to + 320) return null;

  const slabP = ent(tApp - 300, 650);
  const baseP = ent(tHar - 300, 650);
  const grow = ms < tTwo - 200 ? 0 : sp(tTwo - 200, 12, 150);
  const won1 = ms >= tWon;
  const thump = ms >= tWon && ms < tWon + 240 ? Math.sin((Math.PI * (ms - tWon)) / 240) : 0;
  const sink = ms < tShort ? 0 : sp(tShort, 9, 140);
  const hr1Out = EASE(k(tRet, 300));
  const pillar = (i: 0 | 1) => {
    const h = PIL_H * Math.min(1.04, grow) - (i === 1 ? SP.short * sink : 0);
    if (h <= 2) return null;
    const red = i === 0 && won1;
    return (
      <div key={i} style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${SP.px[i]}px ${BASE_TOP}px`, transform: i === 0 ? `scale(${1 + 0.05 * thump}, ${1 - 0.04 * thump})` : undefined }}>
        <Puck x={SP.px[i]} y={BASE_TOP - h / 2} w={SP.pw} h={h} d={110} r={28} front={red ? G_RED : G_WHITE} side={red ? "#8f0e15" : "#9a9a9a"} clip>
          <div style={{ position: "absolute", left: 0, right: 0, top: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            {i === 0 ? (
              <>
                <div style={{ height: 96, display: "flex", alignItems: "center" }}>
                  {ms >= tRet ? <div style={line(64, COLORS.paper)}>PFS</div> : (
                    <Print t={tFirst}><div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={line(40, red ? COLORS.paper : COLORS.ink)}>Progression-free</div><div style={line(40, red ? COLORS.paper : COLORS.ink)}>survival</div>
                    </div></Print>
                  )}
                </div>
                {hr1Out < 1 && ms >= tHr1 ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: 1 - hr1Out }}>
                    <div style={label("rgba(255,255,255,0.85)", 26)}>HAZARD RATIO</div>
                    <WType text="0.52" t={tHr1} size={110} color={COLORS.paper} />
                  </div>
                ) : null}
              </>
            ) : (
              <>
                <div style={{ height: 96, display: "flex", alignItems: "center" }}>
                  <Print t={tSecond}><div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={line(40, COLORS.ink)}>Overall</div><div style={line(40, COLORS.ink)}>survival</div>
                  </div></Print>
                </div>
                {ms >= tHr2 ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={label("#6b6b6b", 26)}>HAZARD RATIO</div>
                    <WType text="0.79" t={tHr2} size={84} color={COLORS.ink} />
                  </div>
                ) : null}
              </>
            )}
          </div>
        </Puck>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {/* the HARMONi foundation slides in from depth under where the slab will rest */}
      {ms >= tHar - 300 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(lerp(-1800, 0, baseP))}translateY(${lerp(400, 0, baseP)}px)` }}>
          <div style={shadow(960, SP.floor + 14, SP.baseW, 0.45)} />
          <Puck x={960} y={SP.floor - SP.baseH / 2} w={SP.baseW} h={SP.baseH} d={160} r={24} front={G_STONE} side="#8f8f8f">
            <div style={{ display: "flex", gap: 22, alignItems: "baseline" }}>
              <div style={line(44, COLORS.ink)}>HARMONi</div>
              <div style={label("#6b6b6b", 26)}>GLOBAL PHASE 3 TRIAL</div>
            </div>
          </Puck>
        </div>
      ) : null}
      {pillar(0)}
      {pillar(1)}
      <Scatter x={SP.px[0]} y={BASE_TOP} t={tWon} seed={20} color={COLORS.accent} zz={60} />
      <Scatter x={SP.px[1]} y={SLAB_BOT + SP.short} t={tShort + 150} seed={21} n={5} color="#9a9a9a" zz={60} />
      {/* the application slab: hovers in from depth; once the pillars arrive it sits on them */}
      {ms >= tApp - 300 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(lerp(-2400, 0, slabP))}translateY(${lerp(-400, 0, slabP)}px)` }}>
          <Puck x={960} y={SP.slabY} w={SP.slabW} h={SP.slabH} d={150} r={26} front={G_INK} side="#111">
            <div style={{ display: "flex", gap: 18, alignItems: "baseline" }}>
              <div style={label("rgba(255,255,255,0.7)", 26)}>SUMMIT'S</div>
              <div style={line(48, COLORS.paper)}>Application</div>
            </div>
          </Puck>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S12 (paper) — "Median progression-free survival was 6.8 months, against 4.4 on chemotherapy alone."
// Settled: the two month columns (hero) / their values / the base labels.
// ══════════════════════════════════════════════════════════════════════════
export const MO = { floor: 800, baseH: 90, unit: 62, cols: [{ x: 760, v: 6.8, red: true }, { x: 1160, v: 4.4, red: false }], w: 250 };

export const Months: React.FC<Win & { g1: Cued; v1: Cued; g2: Cued; v2: Cued }> = ({ from, to, g1, v1, g2, v2 }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const tG1 = at(g1, 85300, from);
  const tV1 = at(v1, 86130, from, tG1 + 600);
  const tG2 = at(g2, 87000, from, tV1 + 400);
  const tV2 = at(v2, 87830, from, tG2 + 600);
  if (ms < from || ms > to + 320) return null;

  const baseP = ent(from + 150, 600);
  const top = MO.floor - MO.baseH;
  const col = (i: 0 | 1, tg: number, tv: number) => {
    const c = MO.cols[i];
    const g = ms < tg ? 0 : sp(tg, 13, 130);
    const H = c.v * MO.unit;
    const h = H * Math.min(1.03, g);
    if (h <= 2) return null;
    return (
      <div key={i} style={{ position: "absolute", inset: 0, ...p3 }}>
        <Puck x={c.x} y={top - h / 2} w={MO.w} h={h} d={120} r={22} front={c.red ? G_RED : G_INK} side={c.red ? "#8f0e15" : "#111"} clip>
          {/* one groove per month (countable) */}
          {Array.from({ length: Math.floor(c.v) }, (_, m) => (
            <div key={m} style={{ position: "absolute", left: 0, right: 0, bottom: (m + 1) * MO.unit - 3, height: 6, background: "rgba(0,0,0,0.28)" }} />
          ))}
        </Puck>
        <div style={{ ...abs(c.x - 200, top - H - 96), width: 400, display: "flex", justifyContent: "center", transform: z(60) || undefined }}>
          {ms >= tv ? <WType text={`${c.v} mo`} t={tv} size={72} color={COLORS.ink} /> : null}
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(lerp(-1400, 0, baseP))}translateY(${lerp(300, 0, baseP)}px)` }}>
        <div style={shadow(960, MO.floor + 10, 900, 0.22)} />
        <Puck x={960} y={MO.floor - MO.baseH / 2} w={900} h={MO.baseH} d={160} r={24} front={G_STONE} side="#9a9a9a">
          <div style={{ display: "flex", width: "100%", justifyContent: "space-around" }}>
            <div style={label(COLORS.ink, 28)}>IVONESCIMAB + CHEMO</div>
            <div style={label(COLORS.ink, 28)}>CHEMO ALONE</div>
          </div>
        </Puck>
        <div style={{ ...abs(0, 110), width: 1920, textAlign: "center", ...label("#6b6b6b", 30), transform: z(20) || undefined }}>MEDIAN PROGRESSION-FREE SURVIVAL</div>
      </div>
      {col(0, tG1, tV1)}
      {col(1, tG2, tV2)}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S14 (red) — "…with a p-value of 0.057. The trial's plan required 0.0448."
// Settled: the ruler (hero) / 0.057 marker / REQUIRED 0.0448 flag.
// ══════════════════════════════════════════════════════════════════════════
export const PR = { x0: 330, x1: 1590, y: 610, h: 96, lo: 0.04, hi: 0.06 };
const px = (v: number) => PR.x0 + ((v - PR.lo) / (PR.hi - PR.lo)) * (PR.x1 - PR.x0);

export const PRuler: React.FC<Win & { marker: Cued; required: Cued }> = ({ from, to, marker, required }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const tMark = at(marker, 99320, from);
  const tReq = at(required, 103120, from, tMark + 1200);
  if (ms < from || ms > to + 320) return null;

  const rulerP = ent(from + 100, 650);
  const slide = ms < tMark ? 0 : EASE(k(tMark, 780));
  const rock = ms >= tMark + 780 ? 1 - sp(tMark + 780, 7, 220, 0.6) : 0;
  const mx = lerp(2200, px(0.057), slide) + 18 * rock;
  const flag = ms < tReq ? 0 : sp(tReq, 8, 170);
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(lerp(-1600, 0, rulerP))}translateY(${lerp(300, 0, rulerP)}px)` }}>
        <div style={shadow(960, PR.y + PR.h / 2 + 24, 1300, 0.25)} />
        <Puck x={(PR.x0 + PR.x1) / 2} y={PR.y} w={PR.x1 - PR.x0 + 80} h={PR.h} d={70} r={24} front={G_WHITE} side="#a9a9a9">
          {[0.04, 0.045, 0.05, 0.055, 0.06].map((v) => (
            <div key={v} style={{ position: "absolute", left: px(v) - PR.x0 + 40 - 3, top: 0, width: 6, height: v * 1000 % 10 === 0 ? 34 : 22, background: "#7a7a7a" }} />
          ))}
          {[0.04, 0.05, 0.06].map((v) => (
            <div key={v} style={{ position: "absolute", left: px(v) - PR.x0 + 40 - 60, width: 120, bottom: 10, textAlign: "center", ...label("#4a4a4a", 26) }}>{v.toFixed(2)}</div>
          ))}
        </Puck>
        <div style={{ ...abs(0, PR.y + PR.h / 2 + 50), width: 1920, textAlign: "center", ...label(COLORS.ink, 30), transform: z(20) || undefined }}>P-VALUE · LOWER IS STRONGER</div>
      </div>
      {/* the 0.057 marker slides in on the ruler and rocks to a stop */}
      {ms >= tMark ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: z(40) || undefined }}>
          <div style={{ ...abs(mx - 12, PR.y - PR.h / 2 - 36), width: 24, height: 40, background: COLORS.ink, clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
          <Puck x={mx} y={PR.y - PR.h / 2 - 96} w={250} h={110} d={60} r={30} front={G_INK} side="#111">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={label("rgba(255,255,255,0.75)", 22)}>HARMONi</div>
              <div style={line(54, COLORS.paper)}>0.057</div>
            </div>
          </Puck>
        </div>
      ) : null}
      {/* the required threshold: a flag springs up out of the ruler at 0.0448 */}
      {flag > 0 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${px(0.0448)}px ${PR.y - PR.h / 2}px`, transform: `${z(40)}scaleY(${Math.min(1.08, flag)})` }}>
          <div style={{ ...abs(px(0.0448) - 5, PR.y - PR.h / 2 - 300), width: 10, height: 300, borderRadius: 5, background: COLORS.ink }} />
          <Puck x={px(0.0448) + 160} y={PR.y - PR.h / 2 - 240} w={310} h={116} d={40} r="0 30px 30px 0" front={G_WHITE} side="#a9a9a9">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={label("#6b6b6b", 22)}>REQUIRED</div>
              <div style={line(54, COLORS.ink)}>0.0448</div>
            </div>
          </Puck>
        </div>
      ) : null}
      <Scatter x={px(0.0448)} y={PR.y - PR.h / 2} t={tReq} seed={22} color={COLORS.paper} zz={40} />
    </AbsoluteFill>
  );
};
