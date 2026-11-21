// ─────────────────────────────────────────────────────────────────────────
// KIT · argenx3 — argenx × UNP long-form, chunk 3 (0:56–1:20), 16:9, V2 style (motion graphics + 2.5D + kinetic type,
// loosened motion: springs that stop, overlapping settles, scatter that vanishes), 2026-11-16.
// §4 WHAT UNP MAKES.
//  · S8 (paper): "MACROCYCLIC PEPTIDES" drops in as type; a chain of amino-acid beads snakes in and its ends swing
//    together and CLOSE into a ring; one bead is tagged "amino acid".
//  · S9 (ink): quote marks + "UNP's own words"; an antibody ("precision of biologic drugs") and a pill ("convenience of
//    a pill") fly in and MERGE into the ring; a cell draws; the ring dives through the membrane and docks on a target
//    inside ("long considered undruggable"), which turns red.
//  · S10 (paper): the discovery engine — a well plate fills in a wave, a model graph pops in, data dots stream across,
//    and the model outputs a red ring.  (§5 lifts this engine whole.)
// Limits: the "precision / pill / undruggable / inside cells" lines are UNP's own description (labelled), not the release.
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, COLORS, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { EASE, fadeOut } from "./plusone";
import { extrude, label, line } from "./inovio";
import { Print } from "./ryb1b";
import { useP3, useZ } from "./camera";
import { KType, Scatter, useEnt, useSpringX } from "./v2style";
import { G_INK, G_WHITE, Puck } from "./argenx1v2b";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });
const bead = (r: number, col: string): React.CSSProperties => ({ width: r * 2, height: r * 2, borderRadius: "50%",
  background: `radial-gradient(circle at 34% 30%, rgba(255,255,255,0.75), ${col} 58%, rgba(0,0,0,0.35) 100%)`, boxShadow: "0 8px 14px rgba(0,0,0,0.25)" });

/** a closed ring of beads (the macrocycle), drawn at (x, y) */
export const Ring: React.FC<{ x: number; y: number; R: number; r: number; n?: number; col: string; band: string; hot?: number }> = ({ x, y, R, r, n = 10, col, band, hot = -1 }) => (
  <>
    <div style={{ ...abs(x - R, y - R), width: 2 * R, height: 2 * R, borderRadius: "50%", border: `${Math.max(4, r * 0.3)}px solid ${band}`, boxSizing: "border-box" }} />
    {Array.from({ length: n }, (_, i) => {
      const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
      return <div key={i} style={{ ...abs(x + Math.cos(a) * R - r, y + Math.sin(a) * R - r), ...bead(r, i === hot ? COLORS.accent : col) }} />;
    })}
  </>
);

// ══════════════════════════════════════════════════════════════════════════
// S8 (paper) — "UNP works on macrocyclic peptides: ring-shaped molecules built from amino acids."
// Settled: the closed ring (hero) / title type / "amino acid" tag.
// ══════════════════════════════════════════════════════════════════════════
const S8 = { cx: 960, cy: 620, R: 175, r: 34, n: 10, tagBead: 2 };

export const RingCloses: React.FC<Win & { title: Cued; ring: Cued; close: Cued; tag: Cued }> = ({ from, to, title, ring, close, tag }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const tTitle = at(title, 57100, from);
  const tRing = at(ring, 59090, from, tTitle + 600);
  const tClose = at(close, 59730, from, tRing + 400);
  const tTag = at(tag, 60360, from, tClose + 300);
  if (ms < from || ms > to + 320) return null;
  const c = sp(tClose, 9, 120); //                     chain → ring, overshoots and settles
  const pos = (i: number): [number, number] => {
    const lx = 600 + (i / (S8.n - 1)) * 720, ly = S8.cy + 46 * Math.sin(i * 0.95);
    const a = -Math.PI / 2 - Math.PI / S8.n * 3 + (i / S8.n) * Math.PI * 2; // the open ends sit at the top-left gap
    const rx = S8.cx + Math.cos(a) * S8.R, ry = S8.cy + Math.sin(a) * S8.R;
    return [lerp(lx, rx, c), lerp(ly, ry, c)];
  };
  const pts = Array.from({ length: S8.n }, (_, i) => pos(i));
  const tagP = pts[S8.tagBead];
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {/* title: kinetic type, word by word */}
      <div style={{ ...abs(0, 150), width: 1920, display: "flex", justifyContent: "center", gap: 34, transform: z(20) || undefined }}>
        <KType text="MACROCYCLIC" t={tTitle - 200} size={92} color={COLORS.ink} />
        <KType text="PEPTIDES" t={tTitle + 650} size={92} color={COLORS.accent} />
      </div>
      {/* bonds (behind the beads) */}
      {ms >= tRing ? (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, transform: z(30) || undefined }}>
          {pts.slice(1).map((p, i) => {
            const show = clamp01((ms - (tRing + (i + 1) * 60)) / 200);
            return show > 0 ? <line key={i} x1={pts[i][0]} y1={pts[i][1]} x2={lerp(pts[i][0], p[0], show)} y2={lerp(pts[i][1], p[1], show)} stroke="#7a7a7a" strokeWidth={12} strokeLinecap="round" /> : null;
          })}
          {c > 0.92 ? <line x1={pts[S8.n - 1][0]} y1={pts[S8.n - 1][1]} x2={pts[0][0]} y2={pts[0][1]} stroke={COLORS.accent} strokeWidth={12} strokeLinecap="round" /> : null}
        </svg>
      ) : null}
      {/* beads: snake in one after another (overlapping springs) */}
      {pts.map((p, i) => {
        const t0 = tRing - 300 + i * 60;
        if (ms < t0) return null;
        const s = sp(t0, 10, 170);
        return <div key={i} style={{ ...abs(p[0] - S8.r, p[1] - S8.r + (1 - s) * 500), ...bead(S8.r, i === S8.tagBead && ms >= tTag ? COLORS.ink : "#a9a9a9"),
          transform: `${z(40)}scale(${0.4 + 0.6 * s})` }} />;
      })}
      <Scatter x={(pts[0][0] + pts[S8.n - 1][0]) / 2} y={(pts[0][1] + pts[S8.n - 1][1]) / 2} t={tClose + 330} seed={71} n={7} color={COLORS.accent} zz={60} />
      {/* tag on one bead */}
      {ms >= tTag ? (
        <div style={{ ...abs(tagP[0] + 46, tagP[1] - 100), transform: `${z(60)}scale(${sp(tTag, 8, 200)})`, transformOrigin: "0 100%" }}>
          <div style={{ background: COLORS.ink, borderRadius: 30, padding: "10px 24px", ...label(COLORS.paper, 34), boxShadow: "0 10px 16px rgba(0,0,0,0.25)" }}>amino acid</div>
          <div style={{ ...abs(-10, 52), width: 4, height: 50, background: COLORS.ink, transform: "rotate(30deg)", transformOrigin: "50% 0" }} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S9 (ink) — "In its own words, they combine the precision of biologic drugs with the convenience of a pill, and can
// reach targets long considered undruggable, including targets inside cells."
// Settled: the cell with the ring docked on its red target (hero) / "UNP's own words" chip / "long considered undruggable".
// ══════════════════════════════════════════════════════════════════════════
const AB = { x: 470, y: 330 };
const PILLX = { x: 1450, y: 330 };
const RINGTOP = { x: 960, y: 300 };
const CELL = { x: 960, y: 760, R: 250 };
const TARGET = { x: 960, y: 790 };

const Antibody: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <svg width={220 * s} height={240 * s} viewBox="0 0 220 240">
    <defs><linearGradient id="abg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#b9b9b9" /></linearGradient></defs>
    <path d="M110 230 V130 M110 130 L40 40 M110 130 L180 40" stroke="url(#abg)" strokeWidth={34} strokeLinecap="round" fill="none" />
    <path d="M60 70 L20 22 M160 70 L200 22" stroke="#e7e7e7" strokeWidth={22} strokeLinecap="round" fill="none" />
  </svg>
);

export const OwnWords: React.FC<Win & { own: Cued; combine: Cued; precision: Cued; convenience: Cued; reach: Cued; undrug: Cued; including: Cued }> = ({
  from, to, own, combine, precision, convenience, reach, undrug, including,
}) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const tOwn = at(own, 62320, from);
  const tPrec = at(precision, 64030, from, at(combine, 63350, from) + 200);
  const tConv = at(convenience, 66040, from, tPrec + 600);
  const tReach = at(reach, 67620, from, tConv + 600);
  const tUnd = at(undrug, 69630, from, tReach + 900);
  const tInc = at(including, 70638, from, tUnd + 500);
  if (ms < from || ms > to + 320) return null;
  const abIn = ent(tPrec - 380, 420);
  const pIn = ent(tConv - 380, 420);
  const merge = EASE(k(tReach, 420)); //               both fly to the centre and shrink into the ring
  const ringIn = sp(tReach + 300, 8, 170);
  const cellDraw = EASE(k(tReach + 500, 700));
  const dive = ent(tInc, 900);
  const docked = ms >= tInc + 520;
  const ringX = RINGTOP.x, ringY = lerp(RINGTOP.y, TARGET.y - 60, dive);
  const dash = (p: number) => ({ pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p });
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {/* quote marks + chip */}
      {ms >= tOwn ? (
        <div style={{ ...abs(130, 110), display: "flex", alignItems: "center", gap: 20, transform: `${z(30)}scale(${sp(tOwn, 8, 200)})`, transformOrigin: "0 50%" }}>
          <div style={{ ...line(150, COLORS.accent), lineHeight: "100px", height: 100 }}>“</div>
          <div style={{ background: COLORS.paper, borderRadius: 30, padding: "10px 24px", ...label(COLORS.ink, 34) }}>UNP's own words</div>
        </div>
      ) : null}
      {/* the antibody: precision of biologic drugs */}
      {ms >= tPrec - 380 && merge < 1 ? (
        <div style={{ ...abs(lerp(AB.x, RINGTOP.x, merge) - 110, lerp(AB.y, RINGTOP.y, merge) - 120), transform: `${z(lerp(-1500, 40, abIn))}rotate(${lerp(-60, 0, abIn) + 200 * merge}deg) scale(${1 - merge})` }}>
          <Antibody />
          <div style={{ ...abs(-90, 250), width: 400, textAlign: "center", opacity: 1 - merge }}><Print t={tPrec}><div style={label(COLORS.paper, 32)}>precision of biologics</div></Print></div>
        </div>
      ) : null}
      {/* the pill: convenience */}
      {ms >= tConv - 380 && merge < 1 ? (
        <div style={{ ...abs(lerp(PILLX.x, RINGTOP.x, merge) - 140, lerp(PILLX.y, RINGTOP.y, merge) - 50), transform: `${z(lerp(-1500, 40, pIn))}rotate(${lerp(60, -20, pIn) - 200 * merge}deg) scale(${1 - merge})` }}>
          <div style={{ width: 280, height: 100, borderRadius: 50, overflow: "hidden", display: "flex", boxShadow: extrude(8, "#6d6d6d", "rgba(0,0,0,0.5)") }}>
            <div style={{ flex: 1, background: "linear-gradient(180deg,#fff,#d9d9d9)" }} /><div style={{ flex: 1, background: "linear-gradient(180deg,#d0d0d0,#9d9d9d)" }} />
          </div>
          <div style={{ ...abs(-60, 130), width: 400, textAlign: "center", opacity: 1 - merge }}><Print t={tConv}><div style={label(COLORS.paper, 32)}>convenience of a pill</div></Print></div>
        </div>
      ) : null}
      {/* the cell: membrane draws, an inner target sits at its heart */}
      {ms >= tReach + 500 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, transform: z(0) || undefined }}>
          <circle cx={CELL.x} cy={CELL.y} r={CELL.R} fill="rgba(255,255,255,0.05)" stroke="#8d8d8d" strokeWidth={14} {...dash(cellDraw)} />
          <circle cx={CELL.x} cy={CELL.y} r={CELL.R - 22} fill="none" stroke="#5d5d5d" strokeWidth={8} {...dash(cellDraw)} />
          <path d={`M${TARGET.x - 70} ${TARGET.y + 30} Q${TARGET.x - 70} ${TARGET.y - 40} ${TARGET.x - 34} ${TARGET.y - 40} L${TARGET.x - 34} ${TARGET.y - 6} Q${TARGET.x} ${TARGET.y + 24} ${TARGET.x + 34} ${TARGET.y - 6} L${TARGET.x + 34} ${TARGET.y - 40} Q${TARGET.x + 70} ${TARGET.y - 40} ${TARGET.x + 70} ${TARGET.y + 30} Z`}
            fill={docked ? COLORS.accent : "#9a9a9a"} opacity={cellDraw} />
        </svg>
      ) : null}
      {/* the label: long considered undruggable */}
      {ms >= tUnd ? (
        <div style={{ ...abs(CELL.x + CELL.R + 50, CELL.y - 120), transform: z(30) || undefined }}>
          <KType text="LONG CONSIDERED" t={tUnd - 150} size={40} color="rgba(255,255,255,0.8)" />
          <KType text="UNDRUGGABLE" t={tUnd} size={72} color={COLORS.paper} />
        </div>
      ) : null}
      {/* the ring: born from the merge, dives through the membrane, docks */}
      {ms >= tReach + 300 ? (
        <div style={{ position: "absolute", inset: 0, transform: `${z(60)}`, transformOrigin: `${ringX}px ${ringY}px` }}>
          <div style={{ position: "absolute", inset: 0, transformOrigin: `${ringX}px ${ringY}px`, transform: `scale(${lerp(0.2, 1, ringIn) * lerp(1, 0.62, dive)})` }}>
            <Ring x={ringX} y={ringY} R={90} r={22} col="#e4e4e4" band="#bcbcbc" />
          </div>
        </div>
      ) : null}
      <Scatter x={RINGTOP.x} y={RINGTOP.y} t={tReach + 380} seed={81} n={8} zz={70} />
      <Scatter x={CELL.x} y={CELL.y - CELL.R} t={tInc + 330} seed={83} n={6} color="#bdbdbd" zz={70} />
      <Scatter x={TARGET.x} y={TARGET.y - 40} t={tInc + 520} seed={85} n={7} color={COLORS.accent} zz={70} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S10 (paper) — "Its platform pairs parallel lab experiments with machine learning, to work through the hard chemistry
// of designing these rings."   Settled: the engine (plate → model → red ring) (hero) / two labels.
// ══════════════════════════════════════════════════════════════════════════
export const ENGINE = { plate: { x: 560, y: 560, w: 460, h: 300 }, model: { x: 1360, y: 560 }, ring: { x: 960, y: 290 }, tray: 760 };
const WELL = { cols: 6, rows: 4, r: 24, gx: 66, gy: 62 };
const LAYERS = [3, 4, 3];
const node = (l: number, i: number): [number, number] => [ENGINE.model.x - 150 + l * 150, ENGINE.model.y + (i - (LAYERS[l] - 1) / 2) * 86];

export const Engine: React.FC<Win & { platform: Cued; parallel: Cued; lab: Cued; ml: Cued; work: Cued; chem: Cued }> = ({ from, to, platform, parallel, lab, ml, work, chem }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const tPlat = at(platform, 73250, from);
  const tPar = at(parallel, 74140, from, tPlat + 500);
  const tLab = at(lab, 74760, from, tPar + 300);
  const tMl = at(ml, 75910, from, tLab + 600);
  const tWork = at(work, 76880, from, tMl + 500);
  const tChem = at(chem, 77980, from, tWork + 600);
  if (ms < from || ms > to + 320) return null;
  const tray = ent(tPlat, 500);
  const plate = sp(tPar, 9, 170);
  const P = ENGINE.plate;
  const wx0 = P.x - ((WELL.cols - 1) * WELL.gx) / 2, wy0 = P.y - ((WELL.rows - 1) * WELL.gy) / 2;
  const ringOut = sp(tChem, 8, 170);
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {/* the platform tray */}
      {ms >= tPlat ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateX(${lerp(-1800, 0, tray)}px)` }}>
          <Puck x={960} y={ENGINE.tray} w={1400} h={40} d={60} r={20} front={G_INK} side="#151515" />
        </div>
      ) : null}
      {/* the well plate: springs up; wells fill in a diagonal wave */}
      {ms >= tPar ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${P.x}px ${ENGINE.tray}px`, transform: `translateY(${(1 - plate) * 600}px)` }}>
          <Puck x={P.x} y={P.y} w={P.w} h={P.h} d={50} r={30} front={G_WHITE} side="#a7a7a7">
            {Array.from({ length: WELL.cols * WELL.rows }, (_, i) => {
              const c = i % WELL.cols, r = Math.floor(i / WELL.cols);
              const f = sp(tLab + (c + r) * 45, 9, 220);
              return (
                <div key={i} style={{ ...abs(wx0 + c * WELL.gx - (P.x - P.w / 2) - WELL.r, wy0 + r * WELL.gy - (P.y - P.h / 2) - WELL.r), width: 2 * WELL.r, height: 2 * WELL.r, borderRadius: "50%",
                  background: "#e2e2e2", boxShadow: "inset 0 4px 6px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 2 * WELL.r - 10, height: 2 * WELL.r - 10, borderRadius: "50%", background: (c + r) % 5 === 2 ? "#6b6b6b" : "#2b2b2b", transform: `scale(${f})` }} />
                </div>
              );
            })}
          </Puck>
          <div style={{ ...abs(P.x - 260, ENGINE.tray + 44), width: 520, textAlign: "center", transform: z(40) || undefined }}>
            <Print t={tPar + 200}><div style={label(COLORS.ink, 36)}>Parallel lab experiments</div></Print>
          </div>
        </div>
      ) : null}
      {/* the model: edges draw, nodes pop in layer by layer */}
      {ms >= tMl ? (
        <div style={{ position: "absolute", inset: 0, transform: z(30) || undefined }}>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            {LAYERS.slice(1).flatMap((n, l) => Array.from({ length: LAYERS[l] }, (_, a) => Array.from({ length: n }, (_, b) => {
              const [x1, y1] = node(l, a), [x2, y2] = node(l + 1, b);
              const d = EASE(k(tMl + 120 + l * 140, 260));
              return <line key={`${l}-${a}-${b}`} x1={x1} y1={y1} x2={lerp(x1, x2, d)} y2={lerp(y1, y2, d)} stroke="#b9b9b9" strokeWidth={5} />;
            })))}
          </svg>
          {LAYERS.flatMap((n, l) => Array.from({ length: n }, (_, i) => {
            const [x, y] = node(l, i);
            const s = sp(tMl + l * 140 + i * 40, 8, 220);
            return <div key={`${l}-${i}`} style={{ ...abs(x - 26, y - 26), width: 52, height: 52, borderRadius: "50%", background: "radial-gradient(circle at 34% 30%, #6a6a6a, #111 70%)",
              boxShadow: "0 8px 12px rgba(0,0,0,0.25)", transform: `scale(${s})` }} />;
          }))}
          <div style={{ ...abs(ENGINE.model.x - 220, ENGINE.tray + 44), width: 440, textAlign: "center" }}>
            <Print t={tMl + 200}><div style={label(COLORS.ink, 36)}>Machine learning</div></Print>
          </div>
        </div>
      ) : null}
      {/* data dots: stream from the plate into the model and are absorbed (they stop) */}
      {Array.from({ length: 8 }, (_, i) => {
        const t0 = tWork + i * 70;
        const p = clamp01((ms - t0) / 520);
        if (p <= 0 || p >= 1) return null;
        const x = lerp(P.x + P.w / 2, node(0, 1)[0] - 30, EASE(p)), y = P.y - 150 * 4 * p * (1 - p) + (i % 3 - 1) * 30;
        return <div key={i} style={{ ...abs(x - 10, y - 10), width: 20, height: 20, borderRadius: "50%", background: COLORS.ink, transform: `${z(50)}scale(${1 - 0.6 * p})` }} />;
      })}
      {/* the output: the model pops out a red ring above the engine */}
      {ms >= tChem ? (
        <div style={{ position: "absolute", inset: 0, transform: z(60) || undefined }}>
          <div style={{ position: "absolute", inset: 0, transformOrigin: `${ENGINE.ring.x}px ${ENGINE.ring.y}px`,
            transform: `translate(${lerp(ENGINE.model.x - ENGINE.ring.x, 0, ringOut)}px, ${lerp(ENGINE.model.y - ENGINE.ring.y, 0, ringOut)}px) scale(${lerp(0.2, 1, ringOut)})` }}>
            <Ring x={ENGINE.ring.x} y={ENGINE.ring.y} R={92} r={22} col={COLORS.accent} band="#8f0e15" />
          </div>
        </div>
      ) : null}
      <Scatter x={ENGINE.ring.x} y={ENGINE.ring.y} t={tChem + 300} seed={91} n={8} color={COLORS.accent} zz={70} />
    </AbsoluteFill>
  );
};
