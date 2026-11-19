// ─────────────────────────────────────────────────────────────────────────
// KIT · jnj4 — J&J × Ollin long-form, chunk 4 (§4 The data), 16:9, 2026-11-19. House style 11-16.
//  S12 FaceOff (ink):    160 bead-patients pour onto the JADE tray; OLN-324 and Vabysmo slide in and face off;
//                        the same ball + star land on both drugs' arms ("blocks the same two targets").
//  S13 TileStacks (paper): 9 red tiles fall and stack on "90%"; 5.7 grey tiles on "57%" (1 tile = 10%).
//  S14 Balance (red):    a balance drops in tipped; Vabysmo drops into the empty pan and the beam swings level.
//  S15 Caveat (ink):     COMPANY-REPORTED stamps Ollin's results card; the camera trucks to J&J's release:
//                        the real quote prints ("The data generated to date are compelling"), NO NUMBERS GIVEN slams.
// Limits: the 90% vs 57% is Ollin's topline, DME, higher dose, week 12, the trial's own definition. Wet AMD
// "about the same" is Ollin's word. Patients are never split into arms on screen (the arm sizes aren't given).
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, COLORS, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { EASE, fadeOut } from "./plusone";
import { label, line } from "./inovio";
import { Print, Slam } from "./ryb1b";
import { useP3, useZ } from "./camera";
import { LineDrop } from "./jnjtype";
import { KType, Scatter, useDropX, useEnt, useSpringX } from "./v2style";
import { G_GREY, G_INK, G_WHITE, Puck } from "./argenx1v2b";
import { Y, YAntibody } from "./jnj3";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });
const G_RED = "linear-gradient(155deg, #ff6a71 0%, #F4212D 50%, #b3121b 100%)";
const chip = (txt: React.ReactNode, bg: string = COLORS.ink, fg: string = COLORS.paper, size = 32) => (
  <div style={{ background: bg, borderRadius: 34, padding: "12px 26px", ...label(fg, size), display: "inline-block" }}>{txt}</div>
);

/** the antibody, placed with its stem foot at (x, foot) and scaled */
const PlacedY: React.FC<{ x: number; foot: number; s: number; children?: React.ReactNode }> = ({ x, foot, s, children }) => (
  <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transformOrigin: `${Y.x}px ${Y.top + Y.stemH}px`,
    transform: `translate(${x - Y.x}px, ${foot - (Y.top + Y.stemH)}px) scale(${s})` }}>
    <YAntibody />
    {children}
  </div>
);
const CR = Y.armL + 30;
const catchXY = (s: -1 | 1): [number, number] => [Y.x + s * CR * Math.sin((Y.ang * Math.PI) / 180), Y.top - CR * Math.cos((Y.ang * Math.PI) / 180)];
const Ball: React.FC<{ r: number }> = ({ r }) => (
  <div style={{ width: r * 2, height: r * 2, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #ff8a90, #F4212D 55%, #a10f17)" }} />
);
const StarS: React.FC<{ r: number; id: string }> = ({ r, id }) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const rr = i % 2 ? r * 0.5 : r;
    return `${(r + Math.cos(a) * rr).toFixed(1)},${(r + Math.sin(a) * rr).toFixed(1)}`;
  }).join(" ");
  return (
    <svg width={r * 2} height={r * 2}>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0.7" y2="1"><stop offset="0%" stopColor="#ff6a71" /><stop offset="55%" stopColor="#F4212D" /><stop offset="100%" stopColor="#b3121b" /></linearGradient></defs>
      <polygon points={pts} fill={`url(#${id})`} stroke="#b3121b" strokeWidth={4} strokeLinejoin="round" />
    </svg>
  );
};
/** the two targets landing on a Y's arm tips (in the Y's own, unscaled coordinates) */
const Targets: React.FC<{ t: number; id: string }> = ({ t, id }) => {
  const ms = useMs();
  const sp = useSpringX();
  if (ms < t - 300) return null;
  const f = EASE(clamp01((ms - (t - 300)) / 300));
  const land = ms >= t ? 1 - sp(t, 7, 220, 0.6) : 0;
  const [lx, ly] = catchXY(-1), [rx, ry] = catchXY(1);
  const dy = -500 * (1 - f);
  return (
    <div style={{ position: "absolute", inset: 0, transform: "translateZ(60px)" }}>
      <div style={{ ...abs(lx - 46, ly - 46 + dy), transform: `scale(${1 + 0.15 * land}, ${1 - 0.15 * land})` }}><Ball r={46} /></div>
      <div style={{ ...abs(rx - 52, ry - 52 + dy), transform: `scale(${1 + 0.15 * land}, ${1 - 0.15 * land})` }}><StarS r={52} id={id} /></div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S12 (ink) — "The main data come from JADE, a Phase 1B trial of more than 160 patients, run head-to-head against Vabysmo,
// the approved Roche drug that blocks the same two targets."
// Settled: the face-off (hero) / OLN-324 chip / VABYSMO chip; the JADE tray of 160 beads is the stage.
// ══════════════════════════════════════════════════════════════════════════
const TRAY = { x: 960, y: 770, w: 820, h: 140 };
const BEAD = { cols: 20, rows: 8, cell: 32, r: 13 };
const BX0 = TRAY.x - ((BEAD.cols - 1) * BEAD.cell) / 2;
const BTOP = TRAY.y - TRAY.h / 2; //                         beads sit on the tray's top edge
export const FACE = { xl: 330, xr: 1590, foot: 840, s: 0.62 };

export const FaceOff: React.FC<Win & { jade: Cued; patients: Cued; head: Cued; vabysmo: Cued; roche: Cued; blocks: Cued }> = ({
  from, to, jade, patients, head, vabysmo, roche, blocks,
}) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const tJade = at(jade, 76490, from);
  const tPat = at(patients, 78820, from, tJade + 800);
  const tHead = at(head, 80710, from, tPat + 900);
  const tVab = at(vabysmo, 82030, from, tHead + 600);
  const tRoche = at(roche, 83540, from, tVab + 600);
  const tBlocks = at(blocks, 84520, from, tRoche + 400);
  if (ms < from || ms > to + 320) return null;

  const tray = ent(tJade - 400, 450);
  const slide = EASE(clamp01((ms - (tHead - 450)) / 450));
  const clash = ms >= tHead ? 1 - sp(tHead, 7, 200, 0.6) : 0;
  const n = BEAD.cols * BEAD.rows;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {/* the tray, rising in */}
      <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(lerp(-1800, 0, tray))}translateY(${lerp(300, 0, tray)}px)` }}>
        <div style={{ ...abs(TRAY.x - 430, TRAY.y + TRAY.h / 2 - 10), width: 860, height: 30, borderRadius: "50%", background: "rgba(0,0,0,0.7)", filter: "blur(8px)" }} />
        <Puck x={TRAY.x} y={TRAY.y} w={TRAY.w} h={TRAY.h} d={110} r={30} front={G_GREY} side="#3e3e3e">
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <LineDrop text="JADE" t={tJade - 260} size={74} color={COLORS.ink} />
            <div style={label("#1c1c1c", 34)}>PHASE 1B · 160+ PATIENTS</div>
          </div>
        </Puck>
      </div>
      {/* the beads: poured row by row from above, bottom row first (1 bead = 1 patient; 160) */}
      {ms >= tPat - 700 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: z(20) || undefined }}>
          {Array.from({ length: n }, (_, i) => {
            const r = Math.floor(i / BEAD.cols), c = i % BEAD.cols;
            const t0 = tPat - 700 + i * 2.5;
            if (ms < t0) return null;
            const f = clamp01((ms - t0) / 300);
            const y = BTOP - BEAD.cell / 2 - r * BEAD.cell;
            const yy = lerp(-120, y, f * f);
            return <div key={i} style={{ ...abs(BX0 + c * BEAD.cell - BEAD.r, yy - BEAD.r), width: BEAD.r * 2, height: BEAD.r * 2, borderRadius: "50%",
              background: "radial-gradient(circle at 35% 30%, #ffffff, #cfcfcf 60%, #8a8a8a)" }} />;
          })}
        </div>
      ) : null}
      {/* the two drugs slide in from the edges and stop facing each other */}
      {ms >= tHead - 450 ? (
        <>
          {([-1, 1] as const).map((s) => {
            const x = (s < 0 ? FACE.xl : FACE.xr) + s * 900 * (1 - slide) - s * 30 * clash;
            return (
              <div key={s} style={{ position: "absolute", inset: 0, ...p3 }}>
                <PlacedY x={x} foot={FACE.foot} s={FACE.s}><Targets t={tBlocks} id={`tg${s}`} /></PlacedY>
                <div style={{ ...abs(x - 300, 360), width: 600, display: "flex", justifyContent: "center", transform: z(40) || undefined }}>
                  {s < 0 ? <Print t={tHead}>{chip("OLN-324", COLORS.paper, COLORS.ink, 36)}</Print> : (
                    <Print t={tVab}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                        {chip("VABYSMO", COLORS.paper, COLORS.ink, 36)}
                        <div style={{ height: 34 }}><Print t={tRoche}><div style={label("rgba(255,255,255,0.8)", 28)}>ROCHE · APPROVED</div></Print></div>
                      </div>
                    </Print>
                  )}
                </div>
              </div>
            );
          })}
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S13 (paper) — "In diabetic macular edema, Ollin reported that nearly 90% of patients on the higher dose met the trial's
// definition of no edema at week 12, against 57% on Vabysmo."
// Settled: the two stacks (hero) / "No edema at week 12" / DME · OLLIN-REPORTED chip.
// ══════════════════════════════════════════════════════════════════════════
const ST = { xl: 1080, xr: 1480, base: 840, tw: 230, th: 50, pitch: 56 };

const Stack: React.FC<{ x: number; tiles: number; t0: number; front: string; side: string }> = ({ x, tiles, t0, front, side }) => {
  const ms = useMs();
  const sp = useSpringX();
  const whole = Math.floor(tiles), part = tiles - whole;
  const count = whole + (part > 0 ? 1 : 0);
  return (
    <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
      {Array.from({ length: count }, (_, i) => {
        const ti = t0 + i * 90;
        if (ms < ti) return null;
        const h = i === whole ? ST.th * part : ST.th;
        const seat = ST.base - i * ST.pitch - h / 2;
        const f = clamp01((ms - ti) / 380);
        const land = ms >= ti + 380 ? 1 - sp(ti + 380, 7, 230, 0.6) : 0;
        return (
          <div key={i} style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transformOrigin: `${x}px ${seat + h / 2}px`,
            transform: `translateY(${-900 * (1 - f * f)}px) scale(${1 + 0.08 * land}, ${1 - 0.18 * land})` }}>
            <Puck x={x} y={seat} w={ST.tw} h={h} d={80} r={Math.min(14, h / 2)} front={front} side={side} />
          </div>
        );
      })}
    </div>
  );
};

export const TileStacks: React.FC<Win & { dme: Cued; ninety: Cued; noedema: Cued; fiftyseven: Cued }> = ({ from, to, dme, ninety, noedema, fiftyseven }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const tDme = at(dme, 86710, from);
  const t90 = at(ninety, 89490, from, tDme + 1500);
  const tNo = at(noedema, 94190, from, t90 + 1500);
  const t57 = at(fiftyseven, 96610, from, tNo + 800);
  if (ms < from || ms > to + 320) return null;
  const startL = t90 - 380 - 8 * 90; //                   the 9th tile lands ON "90%"
  const startR = t57 - 380 - 5 * 90; //                   the 6th (0.7) tile lands ON "57%"
  const topL = ST.base - 9 * ST.pitch, topR = ST.base - 5 * ST.pitch - ST.th * 0.7;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={{ ...abs(110, 140), transform: z(10) || undefined }}>
        <Print t={tDme}>{chip("DME · OLLIN-REPORTED", COLORS.ink, COLORS.paper, 30)}</Print>
        <div style={{ height: 90, marginTop: 18 }}><Print t={tNo}><div style={line(70, COLORS.ink)}>No edema at week 12</div></Print></div>
        <div style={{ height: 40 }}><Print t={tNo}><div style={label(COLORS.grayText, 28)}>THE TRIAL&apos;S OWN DEFINITION · 1 TILE = 10%</div></Print></div>
      </div>
      {/* floor shadows */}
      {[ST.xl, ST.xr].map((x) => <div key={x} style={{ ...abs(x - 140, ST.base - 6), width: 280, height: 24, borderRadius: "50%", background: "rgba(0,0,0,0.16)", filter: "blur(6px)" }} />)}
      <Stack x={ST.xl} tiles={9} t0={startL} front={G_RED} side="#7a0b12" />
      <Stack x={ST.xr} tiles={5.7} t0={startR} front={G_GREY} side="#4a4a4a" />
      <Scatter x={ST.xl} y={topL} t={t90} seed={61} n={6} color={COLORS.accent} zz={50} />
      <Scatter x={ST.xr} y={topR} t={t57} seed={62} n={6} color="#9a9a9a" zz={50} />
      {/* figures on top */}
      <div style={{ ...abs(ST.xl - 200, topL - 150), width: 400, display: "flex", flexDirection: "column", alignItems: "center", transform: z(40) || undefined }}>
        <div style={{ height: 34 }}>{ms >= t90 - 300 ? <div style={label(COLORS.grayText, 28)}>NEARLY</div> : null}</div>
        <KType text="90%" t={t90 - 300} size={104} color={COLORS.ink} />
      </div>
      <div style={{ ...abs(ST.xr - 200, topR - 116), width: 400, display: "flex", justifyContent: "center", transform: z(40) || undefined }}>
        <KType text="57%" t={t57 - 300} size={104} color={COLORS.ink} />
      </div>
      {/* base labels */}
      <div style={{ ...abs(ST.xl - 220, ST.base + 22), width: 440, textAlign: "center", ...label(COLORS.ink, 30) }}>OLN-324 · HIGHER DOSE</div>
      <div style={{ ...abs(ST.xr - 220, ST.base + 22), width: 440, textAlign: "center", ...label(COLORS.ink, 30) }}>VABYSMO</div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S14 (red) — "In wet AMD, Ollin said the two drugs performed about the same."
// Settled: the level balance (hero) / WET AMD / ABOUT THE SAME · PER OLLIN.
// ══════════════════════════════════════════════════════════════════════════
const BAL = { x: 960, pivot: 300, half: 450, string: 280, floor: 880 };

export const Balance: React.FC<Win & { wet: Cued; drugs: Cued; performed: Cued }> = ({ from, to, wet, drugs, performed }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const drop = useDropX();
  const tWet = at(wet, 99060, from);
  const tDrugs = at(drugs, 101040, from, tWet + 1200);
  const tPerf = at(performed, 101490, from, tDrugs + 300);
  if (ms < from || ms > to + 320) return null;

  const scale = drop(tWet - 380, 900, 380);
  const yDrop = drop(tDrugs - 380, 700, 380);
  const lv = ms >= tDrugs ? sp(tDrugs, 8, 120) : 0; //       0 = tipped, 1 = level (one overshoot, settles)
  const ang = -13 * (1 - lv);
  const end = (s: -1 | 1): [number, number] => {
    const a = (ang * Math.PI) / 180;
    return [BAL.x + s * BAL.half * Math.cos(a), BAL.pivot + s * BAL.half * Math.sin(a)];
  };
  const pan = (s: -1 | 1, name: string, show: boolean, dy = 0, sx = 1, sy = 1) => {
    const [ex, ey] = end(s);
    const py = ey + BAL.string;
    return (
      <div style={{ position: "absolute", inset: 0, ...p3 }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible", transform: z(-10) || undefined }}>
          <path d={`M${ex - 125},${py} L${ex},${ey} L${ex + 125},${py}`} fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth={4} />
        </svg>
        <Puck x={ex} y={py + 20} w={280} h={40} d={60} r={20} front={G_WHITE} side="#9c9c9c">
          <div style={label(COLORS.ink, 24)}>{name}</div>
        </Puck>
        {show ? (
          <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${ex}px ${py}px`, transform: `translateY(${dy}px) scale(${sx}, ${sy})` }}>
            <PlacedY x={ex} foot={py} s={0.3} />
          </div>
        ) : null}
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {scale.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${BAL.x}px ${BAL.floor}px`, transform: `translateY(${scale.dy}px) scale(${scale.sx}, ${scale.sy})` }}>
          <div style={{ ...abs(BAL.x - 220, BAL.floor - 6), width: 440, height: 26, borderRadius: "50%", background: "rgba(80,0,4,0.35)", filter: "blur(8px)" }} />
          <Puck x={BAL.x} y={BAL.floor - 25} w={360} h={50} d={90} r={25} front={G_INK} side="#141414" />
          <Puck x={BAL.x} y={(BAL.pivot + BAL.floor) / 2} w={44} h={BAL.floor - BAL.pivot} d={44} r={22} front={G_INK} side="#141414" />
          {pan(-1, "OLN-324", true)}
          {pan(1, "VABYSMO", yDrop.on, yDrop.dy, yDrop.sx, yDrop.sy)}
          <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${BAL.x}px ${BAL.pivot}px`, transform: `rotateZ(${ang}deg)` }}>
            <Puck x={BAL.x} y={BAL.pivot} w={BAL.half * 2 + 40} h={34} d={50} r={17} front={G_INK} side="#141414" />
          </div>
          <Puck x={BAL.x} y={BAL.pivot} w={64} h={64} d={60} r="50%" front={G_WHITE} side="#9c9c9c" />
        </div>
      ) : null}
      <div style={{ ...abs(0, 90), width: 1920, display: "flex", justifyContent: "center", alignItems: "center", gap: 26, transform: z(30) || undefined }}>
        <Print t={tWet}><div style={line(68, COLORS.paper)}>Wet AMD</div></Print>
        <Print t={tPerf}>{chip("ABOUT THE SAME · PER OLLIN", COLORS.paper, COLORS.ink, 30)}</Print>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S15 (ink) — "These are company-reported results from an early-stage trial. J&J's release calls the data compelling,
// and gives no numbers."   Settled (after the truck): the release (hero) / the quote / NO NUMBERS GIVEN.
// ══════════════════════════════════════════════════════════════════════════
export const CAV = { card: 760, rel: 2200 };

export const Caveat: React.FC<Win & { these: Cued; company: Cued; early: Cued; compelling: Cued; noneMs: number }> = ({ from, to, these, company, early, compelling, noneMs }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const tThese = at(these, 103720, from);
  const tCo = at(company, 104240, from, tThese + 300);
  const tEarly = at(early, 106130, from, tCo + 800);
  const tComp = at(compelling, 109400, from, tEarly + 1500);
  if (ms < from || ms > to + 320) return null;
  const cardIn = ent(tThese - 450, 450);
  const rows = [300, 250, 320, 210];
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {/* Ollin's results card: flies in, gets stamped */}
      <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${CAV.card}px 500px`, transform: `${z(lerp(-2000, 0, cardIn))}rotateY(${lerp(-60, 0, cardIn)}deg)` }}>
        <Puck x={CAV.card} y={480} w={620} h={660} d={30} r={24} front={G_WHITE} side="#9c9c9c" clip>
          <div style={{ position: "absolute", inset: 0 }}>
            <div style={{ height: 120, background: G_INK, display: "flex", alignItems: "center", justifyContent: "center", ...label(COLORS.paper, 36) }}>OLLIN · JADE RESULTS</div>
            {rows.map((w, i) => <div key={i} style={{ ...abs(60, 180 + i * 62), width: w, height: 22, borderRadius: 11, background: "#cfcfcf" }} />)}
            <div style={{ ...abs(60, 470) }}><Print t={tEarly}>{chip("EARLY-STAGE · PHASE 1B", COLORS.ink, COLORS.paper, 30)}</Print></div>
          </div>
        </Puck>
        <div style={{ ...abs(CAV.card - 300, 300), width: 600, display: "flex", justifyContent: "center", transform: z(40) || undefined }}>
          <Slam t={tCo}>
            <div style={{ border: `8px solid ${COLORS.accent}`, borderRadius: 18, padding: "14px 30px", background: "rgba(255,255,255,0.92)", ...label(COLORS.accent, 52) }}>COMPANY-REPORTED</div>
          </Slam>
        </div>
      </div>
      {/* J&J's release: stands in the world to the right, the camera trucks to it */}
      <div style={{ position: "absolute", inset: 0, ...p3 }}>
        <Puck x={CAV.rel} y={480} w={900} h={660} d={30} r={24} front={G_WHITE} side="#9c9c9c" clip>
          <div style={{ position: "absolute", inset: 0 }}>
            <div style={{ height: 110, background: G_INK, display: "flex", alignItems: "center", paddingLeft: 50, ...label(COLORS.paper, 34) }}>J&amp;J · PRESS RELEASE · NOV 16</div>
            <div style={{ ...abs(50, 150), width: 800 }}>
              <Print t={tComp}>
                <div style={{ ...line(52, COLORS.ink), whiteSpace: "normal", lineHeight: 1.12 }}>&ldquo;The data generated to date are <span style={{ color: COLORS.accent }}>compelling</span>.&rdquo;</div>
              </Print>
            </div>
            <div style={{ ...abs(50, 380), width: 800, height: 220, borderRadius: 18, border: "4px solid #d6d6d6", boxSizing: "border-box" }}>
              <div style={{ ...abs(24, 16), ...label(COLORS.grayText, 26) }}>EFFICACY DATA</div>
            </div>
          </div>
        </Puck>
        <div style={{ ...abs(CAV.rel - 400, 610), width: 800, display: "flex", justifyContent: "center", transform: z(40) || undefined }}>
          <Slam t={noneMs}><div style={{ background: COLORS.ink, borderRadius: 16, padding: "16px 34px", ...label(COLORS.paper, 46) }}>NO NUMBERS GIVEN</div></Slam>
        </div>
      </div>
    </AbsoluteFill>
  );
};
