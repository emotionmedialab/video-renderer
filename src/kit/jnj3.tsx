// ─────────────────────────────────────────────────────────────────────────
// KIT · jnj3 — J&J × Ollin long-form, chunk 3 (§3 The drug), 16:9, 2026-11-19. House style 11-16.
//  S9  DrugDive (paper):  the hook's lone vial returns as the drug (OLN-324 lands above it); the camera dives INTO the
//                         vial; inside, two different halves snap into one Y antibody over the retina; two signals fly
//                         at the retina and the arm tips catch them (VEGF, Ang-2).
//  S10 Diseases (red):    wet AMD + DME discs spring in; "together" they roll into each other; on "40" they burst
//                         into 40 person icons (1 icon = 1 million) that settle into a grid.
//  S11 Partners (paper):  the antibody's plank rests tilted on Innovent's pillar; Ollin's pillar rises under the low
//                         end and levels it ("develops it together with Ollin").
// Limits: "more than 40 million" is J&J's figure (labelled "per J&J").
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, COLORS, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { EASE, fadeOut } from "./plusone";
import { label, line } from "./inovio";
import { Print } from "./ryb1b";
import { useP3, useZ } from "./camera";
import { LineDrop } from "./jnjtype";
import { KType, Scatter, useDropX, useEnt, useSpringX } from "./v2style";
import { G_GREY, G_INK, G_WHITE, Puck } from "./argenx1v2b";
import { Vial } from "./jnj1";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });
const G_RED = "linear-gradient(155deg, #ff6a71 0%, #F4212D 50%, #b3121b 100%)";

// ── the Y antibody: two arms (ink | grey = two different binding arms) on a two-tone stem ──
export const Y = { x: 960, top: 520, stemH: 210, armL: 300, armW: 66, ang: 38 };
const tipX = (s: -1 | 1) => Y.x + s * Y.armL * Math.sin((Y.ang * Math.PI) / 180);
const tipY = Y.top - Y.armL * Math.cos((Y.ang * Math.PI) / 180);
// where a caught signal sits: on the arm's axis, just past its rounded tip (arm end = armL - 10 from the hinge, + signal radius)
const CATCH_R = Y.armL + 30;
const catchX = (s: -1 | 1) => Y.x + s * CATCH_R * Math.sin((Y.ang * Math.PI) / 180);
const catchY = Y.top - CATCH_R * Math.cos((Y.ang * Math.PI) / 180);

/** one half of the antibody: arm + half-stem. `s` = -1 left (ink), 1 right (grey) */
const Half: React.FC<{ s: -1 | 1 }> = ({ s }) => {
  const front = s < 0 ? G_INK : G_GREY;
  const side = s < 0 ? "#141414" : "#4a4a4a";
  return (
    <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
      <Puck x={Y.x + (s * Y.armW) / 4} y={Y.top + Y.stemH / 2} w={Y.armW / 2} h={Y.stemH} d={50} r={s < 0 ? "30px 0 0 30px" : "0 30px 30px 0"} front={front} side={side} />
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transformOrigin: `${Y.x}px ${Y.top}px`, transform: `rotateZ(${s * Y.ang}deg)` }}>
        <Puck x={Y.x} y={Y.top - Y.armL / 2 + 10} w={Y.armW} h={Y.armL} d={50} r={33} front={front} side={side} />
      </div>
    </div>
  );
};
export const YAntibody: React.FC<{ join?: number }> = ({ join = 1 }) => (
  <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
    {([-1, 1] as const).map((s) => (
      <div key={s} style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `translateX(${s * 700 * (1 - join)}px) rotateZ(${s * 40 * (1 - join)}deg)` }}>
        <Half s={s} />
      </div>
    ))}
  </div>
);

const Star: React.FC<{ r: number }> = ({ r }) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const rr = i % 2 ? r * 0.5 : r;
    return `${(r + Math.cos(a) * rr).toFixed(1)},${(r + Math.sin(a) * rr).toFixed(1)}`;
  }).join(" ");
  return (
    <svg width={r * 2} height={r * 2} style={{ filter: "drop-shadow(0 8px 10px rgba(0,0,0,0.3))" }}>
      <defs><linearGradient id="starG" x1="0" y1="0" x2="0.7" y2="1"><stop offset="0%" stopColor="#ff6a71" /><stop offset="55%" stopColor="#F4212D" /><stop offset="100%" stopColor="#b3121b" /></linearGradient></defs>
      <polygon points={pts} fill="url(#starG)" strokeLinejoin="round" stroke="#b3121b" strokeWidth={4} />
    </svg>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S9 (paper) — "The drug is OLN-324. It is a bispecific antibody: one molecule that blocks two signals behind retinal
// disease, VEGF and Ang-2."   Settled (inside): Y antibody (hero) / VEGF / ANG-2, retina band as ground.
// ══════════════════════════════════════════════════════════════════════════
export const VIAL2 = { x: 960, bottom: 800, s: 2.2 };
export const VIAL2_BODY_Y = VIAL2.bottom - (124 * VIAL2.s) / 2; //   the dive target
const RET = { y: 840, w: 1500, h: 70 };

export const DrugDive: React.FC<Win & { drug: Cued; name: Cued; dive: Cued; antibody: Cued; two: Cued; vegf: Cued; ang2Ms: number; inMs: number }> = ({
  from, to, drug, name, dive, antibody, two, vegf, ang2Ms, inMs,
}) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const drop = useDropX();
  const tDrug = at(drug, 45800, from);
  const tName = at(name, 46470, from, tDrug + 300);
  const tDive = at(dive, 49008, from, tName + 1500);
  const tAb = at(antibody, 50140, from, inMs + 300);
  const tTwo = at(two, 52490, from, tAb + 800);
  const tVegf = at(vegf, 54844, from, tTwo + 1200);
  if (ms < from || ms > to + 320) return null;

  const vial = drop(tDrug - 380, 900, 380);
  const inside = ms >= inMs;
  const flash = inside ? 1 - EASE(k(inMs, 300)) : 0;
  const join = ms >= tAb - 400 ? sp(tAb - 400, 10, 160) : 0;
  const fl = clamp01((ms - tTwo) / 600);
  const caught = ms >= tTwo + 600 ? 1 - sp(tTwo + 600, 7, 220, 0.6) : 0;
  const sig = (s: -1 | 1) => {
    const ex = catchX(s), ey = catchY;
    const sx = s < 0 ? 140 : 1780, sy = -160;
    const e = fl * fl * (3 - 2 * fl);
    return { x: lerp(sx, ex, e), y: lerp(sy, ey, e) };
  };
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {!inside ? (
        <div style={{ position: "absolute", inset: 0, ...p3 }}>
          <div style={{ ...abs(0, 150), width: 1920, display: "flex", justifyContent: "center", transform: z(30) || undefined }}>
            <LineDrop text="OLN-324" t={tName - 260} size={150} color={COLORS.ink} />
          </div>
          {vial.on ? (
            <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${VIAL2.x}px ${VIAL2.bottom}px`, transform: `${z(20)}translateY(${vial.dy}px) scale(${vial.sx}, ${vial.sy})` }}>
              <div style={{ ...abs(VIAL2.x - 160, VIAL2.bottom - 14), width: 320, height: 28, borderRadius: "50%", background: "rgba(0,0,0,0.18)", filter: "blur(8px)" }} />
              <Vial x={VIAL2.x} bottom={VIAL2.bottom} s={VIAL2.s} />
            </div>
          ) : null}
          <Scatter x={VIAL2.x} y={VIAL2.bottom} t={tDrug} seed={31} n={7} color="#9a9a9a" zz={40} />
        </div>
      ) : (
        <div style={{ position: "absolute", inset: 0, ...p3 }}>
          {/* the retina */}
          <Puck x={960} y={RET.y} w={RET.w} h={RET.h} d={60} r={35} front={G_INK} side="#141414">
            <div style={label(COLORS.paper, 32)}>RETINA</div>
          </Puck>
          <YAntibody join={join} />
          <Scatter x={Y.x} y={Y.top + 40} t={tAb} seed={33} n={7} color="#9a9a9a" zz={40} />
          {/* the two signals, caught at the arm tips */}
          {ms >= tTwo ? (
            <div style={{ position: "absolute", inset: 0, ...p3, transform: z(70) || undefined }}>
              {(() => { const p = sig(-1); return (
                <div style={{ ...abs(p.x - 46, p.y - 46), width: 92, height: 92, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #ff8a90, #F4212D 55%, #a10f17)",
                  boxShadow: "0 10px 16px rgba(0,0,0,0.3)", transform: `scale(${1 + 0.15 * caught}, ${1 - 0.15 * caught})` }} />
              ); })()}
              {(() => { const p = sig(1); return (
                <div style={{ ...abs(p.x - 52, p.y - 52), transform: `scale(${1 + 0.15 * caught}, ${1 - 0.15 * caught})` }}><Star r={52} /></div>
              ); })()}
            </div>
          ) : null}
          <Scatter x={catchX(-1)} y={catchY} t={tTwo + 600} seed={35} n={5} color={COLORS.accent} zz={80} />
          <Scatter x={catchX(1)} y={catchY} t={tTwo + 600} seed={36} n={5} color={COLORS.accent} zz={80} />
          {/* labels, outboard of each catch */}
          <div style={{ ...abs(catchX(-1) - 70 - 330, catchY - 30), width: 330, display: "flex", justifyContent: "flex-end", transform: z(30) || undefined }}>
            <Print t={tVegf}><div style={{ background: COLORS.ink, borderRadius: 34, padding: "12px 26px", ...label(COLORS.paper, 36) }}>VEGF</div></Print>
          </div>
          <div style={{ ...abs(catchX(1) + 70, catchY - 30), width: 330, transform: z(30) || undefined }}>
            <Print t={ang2Ms}><div style={{ background: COLORS.ink, borderRadius: 34, padding: "12px 26px", ...label(COLORS.paper, 36), display: "inline-block" }}>ANG-2</div></Print>
          </div>
          {flash > 0 ? <div style={{ position: "absolute", left: -600, top: -600, right: -600, bottom: -600, background: COLORS.accent, opacity: flash }} /> : null}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S10 (red) — "It is being developed for wet age-related macular degeneration and diabetic macular edema, which J&J says
// together affect more than 40 million people worldwide."   Settled: 40-person grid (hero) / the line + legend.
// ══════════════════════════════════════════════════════════════════════════
const DISC = { r: 170, y: 430, x1: 620, x2: 1300 };
const GRID = { cols: 10, rows: 4, cell: 112, y0: 250 };
const GX0 = 960 - ((GRID.cols - 1) * GRID.cell) / 2;

const Fundus: React.FC<{ kind: "amd" | "dme" }> = ({ kind }) => (
  <div style={{ position: "relative", width: DISC.r * 2, height: DISC.r * 2 }}>
    {kind === "amd" ? (
      <div style={{ ...abs(DISC.r - 62, DISC.r - 52), width: 124, height: 104, borderRadius: "48% 52% 44% 56%", background: "radial-gradient(circle at 40% 40%, #5a5a5a, #1c1c1c 70%)" }} />
    ) : (
      Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return <div key={i} style={{ ...abs(DISC.r + Math.cos(a) * 78 - 14, DISC.r + Math.sin(a) * 78 - 14), width: 28, height: 28, borderRadius: "50%", background: "#2a2a2a" }} />;
      })
    )}
    <div style={{ ...abs(DISC.r * 1.42, DISC.r * 0.9), width: 46, height: 46, borderRadius: "50%", background: "#bdbdbd" }} />
  </div>
);

const Person: React.FC = () => (
  <div style={{ position: "relative", width: 60, height: 86 }}>
    <div style={{ ...abs(16, 0), width: 28, height: 28, borderRadius: "50%", background: G_WHITE }} />
    <div style={{ ...abs(4, 32), width: 52, height: 54, borderRadius: "26px 26px 10px 10px", background: G_WHITE }} />
  </div>
);

export const Diseases: React.FC<Win & { wet: Cued; diabetic: Cued; together: Cued; forty: Cued; million: Cued }> = ({ from, to, wet, diabetic, together, forty, million }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const tWet = at(wet, 59100, from);
  const tDia = at(diabetic, 61340, from, tWet + 800);
  const tTog = at(together, 64690, from, tDia + 1200);
  const t40 = at(forty, 66210, from, tTog + 700);
  const tMil = at(million, 66680, from, t40 + 300);
  if (ms < from || ms > to + 320) return null;

  const d1 = ms >= tWet - 350 ? sp(tWet - 350, 10, 160) : 0;
  const d2 = ms >= tDia - 350 ? sp(tDia - 350, 10, 160) : 0;
  const tog = EASE(k(tTog, 500));
  const burst = ms >= t40;
  const lblOut = EASE(k(tTog, 250));
  const disc = (x: number, p: number, kind: "amd" | "dme", rollDir: 1 | -1) => (
    <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(lerp(-2000, 0, p))}` }}>
      <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${x}px ${DISC.y}px`, transform: `translateX(${rollDir * 230 * tog}px) rotateZ(${rollDir * 80 * tog}deg)` }}>
        <Puck x={x} y={DISC.y} w={DISC.r * 2} h={DISC.r * 2} d={60} r="50%" front={G_WHITE} side="#9c9c9c"><Fundus kind={kind} /></Puck>
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {!burst ? (
        <>
          {ms >= tWet - 350 ? disc(DISC.x1, d1, "amd", 1) : null}
          {ms >= tDia - 350 ? disc(DISC.x2, d2, "dme", -1) : null}
          {lblOut < 1 ? (
            <div style={{ position: "absolute", inset: 0, opacity: 1 - lblOut }}>
              <div style={{ ...abs(DISC.x1 - 300, DISC.y + DISC.r + 40), width: 600, display: "flex", justifyContent: "center" }}>
                <Print t={tWet}><div style={label(COLORS.paper, 40)}>WET AMD</div></Print>
              </div>
              <div style={{ ...abs(DISC.x2 - 300, DISC.y + DISC.r + 40), width: 600, display: "flex", justifyContent: "center" }}>
                <Print t={tDia}><div style={label(COLORS.paper, 40)}>DIABETIC MACULAR EDEMA</div></Print>
              </div>
            </div>
          ) : null}
        </>
      ) : null}
      <Scatter x={960} y={DISC.y} t={tTog + 500} seed={41} n={7} color="#8f0e15" zz={60} />
      {/* the burst: 40 people fly from the collision to their seats and land */}
      {burst ? (
        <div style={{ position: "absolute", inset: 0, ...p3 }}>
          {Array.from({ length: GRID.cols * GRID.rows }, (_, i) => {
            const c = i % GRID.cols, r = Math.floor(i / GRID.cols);
            const t0 = t40 + i * 8;
            const p = EASE(clamp01((ms - t0) / 420));
            const land = ms >= t0 + 420 ? 1 - sp(t0 + 420, 8, 220, 0.6) : 0;
            const tx = GX0 + c * GRID.cell, ty = GRID.y0 + r * GRID.cell + 43;
            const x = lerp(960, tx, p), y = lerp(DISC.y, ty, p) - 120 * 4 * p * (1 - p);
            return (
              <div key={i} style={{ ...abs(x - 30, y - 43), transformOrigin: "50% 100%", transform: `${z(lerp(80, 0, p))}scale(${lerp(0.3, 1, p) * (1 + 0.1 * land)}, ${lerp(0.3, 1, p) * (1 - 0.12 * land)})` }}>
                <Person />
              </div>
            );
          })}
        </div>
      ) : null}
      <div style={{ ...abs(0, GRID.y0 + GRID.rows * GRID.cell + 30), width: 1920, display: "flex", justifyContent: "center", transform: z(20) || undefined }}>
        <Print t={tMil}>
          <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
            <div style={line(64, COLORS.paper)}>More than 40 million people</div>
            <div style={{ background: COLORS.ink, borderRadius: 30, padding: "10px 22px", ...label(COLORS.paper, 28) }}>1 FIGURE = 1 MILLION · PER J&amp;J</div>
          </div>
        </Print>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S11 (paper) — "OLN-324 was discovered by Innovent Biologics, which develops it together with Ollin."
// Settled: level plank carrying the antibody (hero) / INNOVENT BIOLOGICS pillar / OLLIN pillar.
// ══════════════════════════════════════════════════════════════════════════
const PIL = { xl: 560, xr: 1360, top: 600, w: 300 };
const PLANK = { x0: 410, w: 1100, h: 56 };
const PLANK_Y = PIL.top - PLANK.h / 2;
const TILT = (Math.atan((900 - PIL.top) / (PLANK.w - 150)) * 180) / Math.PI; //  low end rests near the card floor

export const Partners: React.FC<Win & { name: Cued; innovent: Cued; develops: Cued }> = ({ from, to, name, innovent, develops }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const k = useK();
  const sp = useSpringX();
  const drop = useDropX();
  const tName = at(name, 68892, from);
  const tInn = at(innovent, 70880, from, tName + 800);
  const tDev = at(develops, 72720, from, tInn + 800);
  if (ms < from || ms > to + 320) return null;

  const pl = drop(tName - 380, 800, 380);
  // the pillar rises to meet the plank's low end, then lifts it level (a short spring on the level)
  const q = EASE(k(tDev - 100, 700));
  const contact = 0.5;
  const lowY = (PIL.xr - PIL.xl) * Math.tan((TILT * Math.PI) / 180); //  plank's height above the pillar top seat, tilted
  const lift = q < contact ? 0 : (q - contact) / (1 - contact);
  const settle = ms >= tDev + 600 ? 1 - sp(tDev + 600, 8, 220, 0.6) : 0;
  const pilDy = q < contact ? lerp(560, lowY, q / contact) : lerp(lowY, 0, lift);
  const tilt = TILT * (1 - lift) - 1.2 * settle;
  const pillar = (x: number, dy: number, txt: React.ReactNode) => (
    <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${dy}px)` }}>
      <Puck x={x} y={PIL.top + 260} w={PIL.w} h={520} d={90} r="26px 26px 0 0" front={G_GREY} side="#4a4a4a">
        <div style={{ position: "absolute", top: 50, left: 0, right: 0, display: "flex", justifyContent: "center", textAlign: "center" }}>{txt}</div>
      </Puck>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {pillar(PIL.xl, 0, <Print t={tInn}><div style={{ ...label(COLORS.ink, 34), whiteSpace: "normal", width: 240, lineHeight: 1.15 }}>INNOVENT BIOLOGICS</div></Print>)}
      {pillar(PIL.xr, pilDy, <div style={{ ...label(COLORS.ink, 40) }}>OLLIN</div>)}
      {/* the plank + the antibody: lands tilted (left end on Innovent, right end on the floor), levels as Ollin rises */}
      {pl.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${PLANK.x0 + 150}px ${PIL.top}px`,
          transform: `translateY(${pl.dy}px) rotateZ(${tilt}deg) scale(${pl.sx}, ${pl.sy})` }}>
          <Puck x={PLANK.x0 + PLANK.w / 2} y={PLANK_Y} w={PLANK.w} h={PLANK.h} d={80} r={18} front={G_INK} side="#141414">
            <div style={label(COLORS.paper, 30)}>OLN-324</div>
          </Puck>
          <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${Y.x}px ${Y.top + Y.stemH}px`,
            transform: `translateY(${PIL.top - PLANK.h - (Y.top + Y.stemH)}px) scale(0.55)` }}>
            <YAntibody />
          </div>
        </div>
      ) : null}
      <Scatter x={PIL.xr} y={PIL.top} t={tDev + 300} seed={51} n={6} color="#9a9a9a" zz={50} />
    </AbsoluteFill>
  );
};
