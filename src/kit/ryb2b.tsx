// ─────────────────────────────────────────────────────────────────────────
// KIT · ryb2b — Rybrevant chunk 2 (§3 + §4a), v3 "animated explainer" (Nel 11-09: chunk 1 v3
// approved, "more interactive now"). Things ACT: the antibody's arms DOCK onto EGFR and MET, it
// LEAPS from the lung to the neck, receptors SPROUT on tumor cells; 102 patients POUR out of the
// study card, responders HOP, a scan beam SWEEPS, the durable responders WALK past a 6-month line.
// On-screen limits (script.md CLAIMS): 80–90% attributed to J&J (same block); 56% is a share of
// RESPONDERS; counts are of 102 (43 responded, 15 complete, 24 of 43 durable).
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, COLORS, INK_SUB_ON_RED, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { EASE, back, fadeOut } from "./plusone";
import { extrude, label, line, Odo, SlideWords, useDrop } from "./inovio";
import { BLOBS, HEAD, NECK_TUMOR, Print, Slam, Vial } from "./ryb1b";

const rad = (d: number) => (d * Math.PI) / 180;
const ARM = 200; // hinge → tip centre

/** the antibody, arms DOWN. (hx, hy) = the hinge; aL / aR = each arm's angle from vertical. */
const DownAb: React.FC<{ hx: number; hy: number; s?: number; aL: number; aR: number; litL: number; litR: number; rot?: number }> = ({ hx, hy, s = 1, aL, aR, litL, litR, rot = 0 }) => {
  const Arm: React.FC<{ sgn: number; a: number; lit: number }> = ({ sgn, a, lit }) => (
    <g transform={`rotate(${-sgn * a})`}>
      <rect x={-18} y={-6} width={36} height={ARM - 10} rx={18} fill={COLORS.ink} />
      <rect x={sgn < 0 ? -44 : 14} y={14} width={30} height={116} rx={15} fill="#6b6b6b" />
      <circle cx={0} cy={ARM} r={24 + 4 * lit} fill={lit > 0.5 ? COLORS.accent : COLORS.ink} />
    </g>
  );
  return (
    <svg width={600 * s} height={600 * s} viewBox="-300 -260 600 600"
      style={{ position: "absolute", left: hx - 300 * s, top: hy - 260 * s, overflow: "visible", transform: `rotate(${rot}deg)`, transformOrigin: `${300 * s}px ${260 * s}px` }}>
      <rect x={-34} y={-170} width={28} height={176} rx={14} fill={COLORS.ink} />
      <rect x={6} y={-170} width={28} height={176} rx={14} fill={COLORS.ink} />
      <Arm sgn={-1} a={aL} lit={litL} />
      <Arm sgn={1} a={aR} lit={litR} />
    </svg>
  );
};
const tipAt = (hx: number, hy: number, a: number, sgn: number, s = 1) => ({ x: hx + sgn * Math.sin(rad(a)) * ARM * s, y: hy + Math.cos(rad(a)) * ARM * s });

/** a receptor standing on the membrane: EGFR = a cup, MET = a fork. Grows up from its base. */
const Receptor: React.FC<{ x: number; top: number; base: number; kind: "egfr" | "met"; grow: number; squash?: number; sc?: number; opacity?: number }> = ({ x, top, base, kind, grow, squash = 0, sc = 1, opacity = 1 }) => {
  const w = 12 * sc;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity }}>
      <g transform={`translate(${x} ${base}) scale(1 ${grow * (1 - 0.1 * squash)}) translate(${-x} ${-base})`} stroke={COLORS.ink} strokeWidth={w} strokeLinecap="round" fill="none">
        <path d={`M${x} ${base} L${x} ${top + 30 * sc}`} />
        {kind === "egfr"
          ? <path d={`M${x - 34 * sc} ${top} A ${34 * sc} ${34 * sc} 0 0 0 ${x + 34 * sc} ${top}`} />
          : <path d={`M${x - 32 * sc} ${top - 6 * sc} L${x} ${top + 30 * sc} L${x + 32 * sc} ${top - 6 * sc}`} />}
      </g>
    </svg>
  );
};

const Ring: React.FC<{ x: number; y: number; t: number; r?: number }> = ({ x, y, t, r = 40 }) => {
  const ms = useMs();
  const k = useK();
  const p = k(t, 520);
  if (ms < t || p >= 1) return null;
  return <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: `6px solid ${COLORS.accent}`, opacity: 1 - p, transform: `scale(${lerp(0.6, 2.2, EASE(p))})` }} />;
};

// lung outline (LungIcon geometry, drawn as strokes)
const LUNG = [
  "M60 6 V40 M60 40 Q52 46 46 52 M60 40 Q68 46 74 52",
  "M40 30 Q14 36 12 70 Q12 94 30 94 Q48 94 50 78 L50 46 Q48 32 40 30Z",
  "M80 30 Q106 36 108 70 Q108 94 90 94 Q72 94 70 78 L70 46 Q72 32 80 30Z",
];

// ══════════════════════════════════════════════════════════════════════════
// §3 TWO TARGETS (paper) — "Rybrevant is an antibody that hits two targets at once, EGFR and MET.
// Until now, all of its approved uses were in lung cancer. This is its first indication outside
// lung. J&J says EGFR and MET are overexpressed in 80 to 90% of these tumors."
//  · "Rybrevant" → a tumor cell's membrane rises; two receptors grow on it.  · "antibody" → the
//    antibody drops in and hovers.  · "EGFR" → its left arm swings down and DOCKS (tip goes red);
//    "MET" → the right arm docks.  (camera pushes in on the docking)
//  · "Until now" → the cell sinks away, the antibody shrinks; a lung DRAWS itself; "lung cancer" →
//    the antibody lands in it.  · "This is" → the head-and-neck profile (chunk 1's) draws;
//    "outside lung" → the antibody LEAPS across, flipping once, and lands on the neck tumor.
//  · "J&J says" → ten tumor cells drop in; "overexpressed" → receptors SPROUT on them one by one;
//    "80" rolls at eight cells, "90%" at the ninth (faint = the range); the tenth stays bare.
// ══════════════════════════════════════════════════════════════════════════
const CELL = { cx: 960, cy: 1300, r: 560 };
const memY = (x: number) => CELL.cy - Math.sqrt(CELL.r * CELL.r - (x - CELL.cx) ** 2);
const DOCK = { hy0: 340, hy1: 420, a0: 50, a1: 34, rTop: 600 };
export const DOCK_FOCUS = { x: 960, y: 560 };
const LUNG_BOX = { left: 360, top: 300, sc: 4.33 };
const AB_LUNG = { x: 494, y: 530 };
const PROF = { left: 1160, top: 290, sc: 1.2 };
const NECK = { x: PROF.left + NECK_TUMOR.x * PROF.sc, y: PROF.top + NECK_TUMOR.y * PROF.sc };
const SMALL = 0.32;
const AB_NECK = { x: NECK.x, y: NECK.y - Math.cos(rad(38)) * ARM * SMALL - 14 };
const ROW10 = { n: 10, size: 130, gap: 32, top: 600 };
const row10X = (i: number) => (1920 - (ROW10.n * ROW10.size + (ROW10.n - 1) * ROW10.gap)) / 2 + i * (ROW10.size + ROW10.gap);

export const TwoTargets: React.FC<Win & { ryb: Cued; antibody: Cued; two: Cued; egfr: Cued; met: Cued; until: Cued; uses: Cued; lung: Cued; thisIs: Cued; first: Cued; outside: Cued; jj: Cued; over: Cued; eighty: Cued; ninety: Cued; these: Cued }> = ({
  from, to, ryb, antibody, two, egfr, met, until, uses, lung, thisIs, first, outside, jj, over, eighty, ninety, these,
}) => {
  const ms = useMs();
  const k = useK();
  const drop = useDrop();
  const tRyb = at(ryb, from + 120, from);
  const tAb = at(antibody, tRyb + 1300, from, tRyb + 300);
  const tTwo = at(two, tAb + 1600, from, tAb + 300);
  const tE = at(egfr, tTwo + 1800, from, tTwo + 600);
  const tM = at(met, tE + 640, from, tE + 400);
  const tUn = at(until, tM + 700, from, tM + 420);
  const tUses = at(uses, tUn + 1500, from, tUn + 400);
  const tLung = at(lung, tUses + 1380, from, tUses + 300);
  const tThis = at(thisIs, tLung + 760, from, tLung + 620);
  const tFirst = at(first, tThis + 990, from, tThis + 300);
  const tOut = at(outside, tFirst + 1120, from, tFirst + 300);
  const tJ = at(jj, tOut + 1310, from, tOut + 900);
  const tOver = at(over, tJ + 1750, from, tJ + 600);
  const t80 = at(eighty, tOver + 1470, from, tOver + 1300);
  const t90 = at(ninety, t80 + 900, from, t80 + 300);
  const tThese = at(these, t90 + 1380, from, t90 + 300);
  if (ms < from - 40 || ms > to + 320) return null;

  // ── stage A: the cell + docking ──
  const rise = back(k(tRyb, 600));
  const recGrow = back(k(tRyb + 350, 450));
  const cellOut = EASE(k(tUn, 500));
  const abIn = back(k(tAb, 560));
  const dL = EASE(k(tE, 380));
  const dR = EASE(k(tM, 380));
  const xL = 960 - Math.sin(rad(DOCK.a1)) * ARM;
  const xR = 960 + Math.sin(rad(DOCK.a1)) * ARM;
  // ── stage B: shrink → lung → leap → neck ──
  const shrink = EASE(k(tUn, 600));
  const toLung = EASE(k(tLung, 600));
  const leap = k(tOut, 850);
  const tLand = tOut + 850;
  const bOut = EASE(k(tJ, 420));
  // antibody position through every stage
  let hx = 960, hy = lerp(-300, DOCK.hy0, abIn) + (DOCK.hy1 - DOCK.hy0) * dL, s = 1, rot = lerp(-14, 0, abIn);
  let aL = lerp(DOCK.a0, DOCK.a1, dL), aR = lerp(DOCK.a0, DOCK.a1, dR);
  if (ms >= tUn) {
    s = lerp(1, SMALL, shrink);
    hy = lerp(DOCK.hy1, 260, shrink);
    aL = aR = lerp(DOCK.a1, 38, shrink);
    hx = lerp(960, AB_LUNG.x, toLung);
    hy = lerp(hy, AB_LUNG.y, toLung) - 160 * Math.sin(Math.PI * toLung);
  }
  // the leap: a quadratic arc lung → neck, one full flip
  const P0 = AB_LUNG, P2 = AB_NECK, P1 = { x: (P0.x + P2.x) / 2, y: 2 * 256 - (P0.y + P2.y) / 2 };
  const bez = (t: number) => ({ x: (1 - t) ** 2 * P0.x + 2 * (1 - t) * t * P1.x + t * t * P2.x, y: (1 - t) ** 2 * P0.y + 2 * (1 - t) * t * P1.y + t * t * P2.y });
  if (ms >= tOut) {
    const p = EASE(leap);
    const b = bez(p);
    hx = b.x; hy = b.y; rot = 360 * p;
  }
  const abOpacity = ms >= tUn ? 1 - bOut : 1;
  const draw = EASE(k(tUn + 400, 700));
  const prof = EASE(k(tThis, 700));
  const tumor = back(k(tFirst, 420));
  const lungLand = tLung + 600;

  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300) }}>
      {/* ── A: header ── */}
      {cellOut < 1 ? (
        <div style={{ position: "absolute", left: 150, top: 110, opacity: 1 - cellOut }}>
          <SlideWords text="Rybrevant" t={tRyb} size={84} color={COLORS.ink} align="left" />
          <div style={{ marginTop: 14, height: 44 }}><Print t={tTwo}><div style={label(COLORS.grayText, 36)}>One antibody, two targets</div></Print></div>
        </div>
      ) : null}
      {/* ── A: the tumor cell, its two receptors and their labels ── */}
      {ms >= tRyb && cellOut < 1 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - cellOut, transform: `translateY(${lerp(500, 0, rise) + 600 * cellOut}px)` }}>
          <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <circle cx={CELL.cx} cy={CELL.cy} r={CELL.r} fill="#ececec" stroke={COLORS.ink} strokeWidth={8} />
          </svg>
          <Receptor x={xL} top={DOCK.rTop} base={memY(xL) + 4} kind="egfr" grow={recGrow} squash={Math.sin(Math.PI * k(tE + 380, 200))} />
          <Receptor x={xR} top={DOCK.rTop} base={memY(xR) + 4} kind="met" grow={recGrow} squash={Math.sin(Math.PI * k(tM + 380, 200))} />
          <div style={{ position: "absolute", left: xL - 70 - 300, width: 300, top: 640, display: "flex", justifyContent: "flex-end" }}>
            <Slam t={tE + 380}><div style={line(56, COLORS.ink)}>EGFR</div></Slam>
          </div>
          <div style={{ position: "absolute", left: xR + 70, top: 640 }}>
            <Slam t={tM + 380}><div style={line(56, COLORS.ink)}>MET</div></Slam>
          </div>
        </div>
      ) : null}
      {ms < tUn ? <><Ring x={xL} y={DOCK.rTop - 14} t={tE + 380} /><Ring x={xR} y={DOCK.rTop - 14} t={tM + 380} /></> : null}

      {/* ── B: the lung (draws) and the head-and-neck profile (draws) ── */}
      {ms >= tUn + 400 && bOut < 1 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - bOut, transform: `translateY(${-80 * bOut}px)` }}>
          <svg width={120 * LUNG_BOX.sc} height={100 * LUNG_BOX.sc} viewBox="0 0 120 100" style={{ position: "absolute", left: LUNG_BOX.left, top: LUNG_BOX.top, overflow: "visible" }}>
            {LUNG.map((d, i) => (
              <path key={i} d={d} fill={i > 0 ? `rgba(0,0,0,${0.07 * EASE(k(tUn + 1100, 300))})` : "none"} stroke={COLORS.ink} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"
                pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
            ))}
          </svg>
          <div style={{ position: "absolute", left: 620 - 320, width: 640, top: 790, textAlign: "center" }}>
            <div style={{ height: 52, display: "flex", justifyContent: "center" }}><Print t={tLung}><div style={label(COLORS.ink, 44)}>Lung cancer</div></Print></div>
            <div style={{ marginTop: 6, height: 40, display: "flex", justifyContent: "center" }}><Print t={tUses}><div style={label(COLORS.grayText, 30)}>Every approved use until now</div></Print></div>
          </div>
          {ms >= tThis ? (
            <svg width={300 * PROF.sc} height={400 * PROF.sc} viewBox="0 0 300 400" style={{ position: "absolute", left: PROF.left, top: PROF.top, overflow: "visible" }}>
              <path d={HEAD} fill="none" stroke={COLORS.ink} strokeWidth={5} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - prof} />
              {ms >= tFirst ? (
                <g transform={`translate(${NECK_TUMOR.x} ${NECK_TUMOR.y}) scale(${tumor}) translate(-26 -26)`}>
                  <path d={BLOBS[1]} transform="scale(0.52)" fill="#bdbdbd" stroke={COLORS.ink} strokeWidth={6} />
                </g>
              ) : null}
            </svg>
          ) : null}
          <div style={{ position: "absolute", left: PROF.left + 150 * PROF.sc - 320, width: 640, top: 790, textAlign: "center" }}>
            <div style={{ height: 52, display: "flex", justifyContent: "center" }}><Print t={tFirst}><div style={label(COLORS.ink, 44)}>Head &amp; neck</div></Print></div>
            <div style={{ marginTop: 6, height: 40, display: "flex", justifyContent: "center" }}><Print t={tLand}><div style={label(COLORS.accent, 30)}>First use outside lung</div></Print></div>
          </div>
          {/* the leap's trail */}
          {ms >= tOut ? (
            <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
              {Array.from({ length: 28 }, (_, i) => {
                const t = (i + 1) / 29;
                if (t > EASE(leap)) return null;
                const b = bez(t);
                return <circle key={i} cx={b.x} cy={b.y + 40} r={5} fill="#9a9a9a" />;
              })}
            </svg>
          ) : null}
          <Ring x={AB_LUNG.x} y={AB_LUNG.y + 60} t={lungLand} r={30} />
          <Ring x={NECK.x} y={NECK.y} t={tLand} />
        </div>
      ) : null}

      {/* ── the antibody (one element, every stage) ── */}
      {ms >= tAb && abOpacity > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: abOpacity }}>
          <DownAb hx={hx} hy={hy} s={s} aL={aL} aR={aR} rot={rot} litL={k(tE + 380, 120)} litR={k(tM + 380, 120)} />
        </div>
      ) : null}

      {/* ── C: J&J says 80–90% — receptors sprout on the tumor cells ── */}
      {ms >= tJ ? (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: 186, display: "flex", justifyContent: "center", height: 44 }}>
            <Print t={tJ}><div style={label(COLORS.grayText, 36)}>J&amp;J says</div></Print>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 240, display: "flex", justifyContent: "center", alignItems: "flex-start", opacity: ms >= t80 ? 1 : 0 }}>
            <Odo digit={8} t={t80} dur={700} size={170} color={COLORS.accent} />
            <Odo digit={0} t={t80 + 60} dur={700} size={170} color={COLORS.accent} />
            <div style={{ display: "flex", opacity: ms >= t90 ? 1 : 0 }}>
              <div style={{ ...line(170, COLORS.accent), height: 170, lineHeight: "170px", padding: "0 10px" }}>–</div>
              <Odo digit={9} t={t90} dur={700} size={170} color={COLORS.accent} />
              <Odo digit={0} t={t90 + 60} dur={700} size={170} color={COLORS.accent} />
              <div style={{ ...line(170, COLORS.accent), height: 170, lineHeight: "170px", opacity: clamp01(k(t90 + 500, 160) * 3) }}>%</div>
            </div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 432, display: "flex", justifyContent: "center", height: 46 }}>
            <Print t={tThese}><div style={label(COLORS.ink, 38)}>of these tumors overexpress EGFR and MET</div></Print>
          </div>
          {Array.from({ length: ROW10.n }, (_, i) => {
            const d = drop(tJ + 250 + i * 50, 500, 320);
            if (!d.on) return null;
            const x = row10X(i);
            const tS = i < 8 ? tOver + i * 150 : i === 8 ? t90 : Infinity;
            const g = Number.isFinite(tS) ? back(k(tS, 320)) : 0;
            const cx = x + ROW10.size / 2, top = ROW10.top + 8;
            return (
              <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${cx}px ${ROW10.top + ROW10.size}px`, transform: `translateY(${d.dy}px) scale(${d.sx}, ${d.sy})` }}>
                {g > 0 ? (
                  <>
                    <Receptor x={cx - 26} top={top - 50} base={top + 6} kind="egfr" grow={g} sc={0.5} opacity={i === 8 ? 0.45 : 1} />
                    <Receptor x={cx + 26} top={top - 50} base={top + 6} kind="met" grow={g} sc={0.5} opacity={i === 8 ? 0.45 : 1} />
                  </>
                ) : null}
                <svg width={ROW10.size} height={ROW10.size} viewBox="0 0 100 100" style={{ position: "absolute", left: x, top: ROW10.top, overflow: "visible" }}>
                  <path d={BLOBS[i % 3]} fill="#e2e2e2" stroke={COLORS.ink} strokeWidth={5} />
                </svg>
              </div>
            );
          })}
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// §4a THE NUMBERS (red) — "Now the numbers. The study, called OrigAMI-4, treated 102 patients with
// the drug on its own. 42% responded. 15% had a complete response, meaning no measurable tumor
// left on scans. Of the patients who responded, 56% were still responding at 6 months or longer."
//  · "Now" → a study card drops; "OrigAMI-4" writes on it.  · "treated" → it shrinks to a header and
//    102 patients POUR out of it into a crowd.  · "the drug" → a vial tile drops: "Drug on its own".
//  · "42%" → 43 of them HOP; the rest go hollow.  · "complete response" → a scan beam SWEEPS the
//    crowd; 15 turn ink as it passes.  · "Of the patients" → the 59 fall away, the 43 regroup; a
//    6-month line drops.  · "still responding" → 24 WALK across the line; the other 19 go hollow.
//  The number column on the right swaps one figure at a time: 102 → 42% → 15% → 56%.
// ══════════════════════════════════════════════════════════════════════════
const CR = { left: 150, top: 330, cols: 17, px: 58, py: 88, w: 44, h: 70 };
const gridXY = (i: number, cols = CR.cols, left = CR.left) => ({ x: left + (i % cols) * CR.px, y: CR.top + Math.floor(i / cols) * CR.py });
const pick = (n: number, of: number, seed0: number) => {
  const idx = Array.from({ length: of }, (_, i) => i);
  let seed = seed0;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
  return idx.slice(0, n).sort((a, b) => a - b);
};
const RESP = pick(43, 102, 11); //                 crowd indices that responded (in reading order)
const RANK = new Map(RESP.map((i, r) => [i, r] as const)); // crowd index → responder rank 0..42
const CR15 = new Set(pick(15, 43, 23)); //          responder ranks with a complete response
const DUR = pick(24, 43, 37); //                    responder ranks still responding at 6 months
const DUR_Q = new Map(DUR.map((r, q) => [r, q] as const));
const POST = { x: 730, top: 300, bottom: 800 };
const DEST = { left: 790, cols: 6 };
const COL = { left: 1300, top: 380 };

const Fig: React.FC<{ fill: number; ink?: number }> = ({ fill, ink = 0 }) => {
  const c = ink > 0.5 ? COLORS.ink : `rgba(255,255,255,${fill})`;
  const st = ink > 0.5 ? COLORS.ink : COLORS.paper;
  return (
    <svg width={CR.w} height={CR.h} viewBox="0 0 44 70" style={{ display: "block", overflow: "visible" }}>
      <circle cx={22} cy={12} r={10} fill={c} stroke={st} strokeWidth={3} />
      <path d="M4 68 L4 44 Q4 27 22 27 Q40 27 40 44 L40 68 Z" fill={c} stroke={st} strokeWidth={3} strokeLinejoin="round" />
    </svg>
  );
};

/** one figure in the swap column: rolls in on `tIn`, lifts away on `tOut` */
const ColFig: React.FC<{ digits: number[]; pct?: boolean; tIn: number; tOut?: number; color: string; children?: React.ReactNode }> = ({ digits, pct = false, tIn, tOut = Infinity, color, children }) => {
  const ms = useMs();
  const k = useK();
  if (ms < tIn || ms > tOut + 320) return null;
  const out = Number.isFinite(tOut) ? EASE(k(tOut, 300)) : 0;
  return (
    <div style={{ position: "absolute", left: COL.left, top: COL.top, opacity: 1 - out, transform: `translateY(${-70 * out}px)` }}>
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        {digits.map((d, i) => <Odo key={i} digit={d} t={tIn + i * 60} dur={700} size={170} color={color} />)}
        {pct ? <div style={{ ...line(170, color), height: 170, lineHeight: "170px", opacity: clamp01(k(tIn + 500, 160) * 3) }}>%</div> : null}
      </div>
      <div style={{ marginTop: 16, width: 560 }}>{children}</div>
    </div>
  );
};

export const OrigamiCrowd: React.FC<Win & { now: Cued; study: Cued; origami: Cued; treated: Cued; n102: Cued; drug: Cued; own: Cued; r42: Cued; r15: Cued; complete: Cued; noTumor: Cued; ofThe: Cued; r56: Cued; still: Cued; months: Cued }> = ({
  from, to, now, study, origami, treated, n102, drug, own, r42, r15, complete, noTumor, ofThe, r56, still, months,
}) => {
  const ms = useMs();
  const k = useK();
  const drop = useDrop();
  const tNow = at(now, from + 50, from);
  const tStudy = at(study, tNow + 1470, from, tNow + 300);
  const tOri = at(origami, tStudy + 1240, from, tStudy + 300);
  const tTreat = at(treated, tOri + 1210, from, tOri + 300);
  const t102 = at(n102, tTreat + 260, from, tTreat + 100);
  const tDrug = at(drug, t102 + 1390, from, t102 + 600);
  const tOwn = at(own, tDrug + 940, from, tDrug + 300);
  const t42 = at(r42, tOwn + 690, from, tOwn + 300);
  const t15 = at(r15, t42 + 2350, from, t42 + 900);
  const tCR = at(complete, t15 + 1490, from, t15 + 300);
  const tNo = at(noTumor, tCR + 1820, from, tCR + 300);
  const tOf = at(ofThe, tNo + 2370, from, tNo + 600);
  const t56 = at(r56, tOf + 1570, from, tOf + 1300);
  const tStill = at(still, t56 + 1550, from, t56 + 300);
  const tMo = at(months, tStill + 1220, from, tStill + 300);
  if (ms < tNow - 40 || ms > to + 320) return null;

  const card = drop(tNow, 700, 380);
  const sh = EASE(k(tTreat, 450));
  const headOut = EASE(k(tOf, 400));
  const pour0 = Math.max(t102, tTreat + 450);
  const src = { x: 150 + 130 - CR.w / 2, y: 130 + 71 - CR.h / 2 };
  const beamP = k(tCR, 1100);
  const beamX = lerp(120, 1150, beamP);
  const post = drop(tOf + 900, 600, 340);

  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300) }}>
      {/* ── the study card → header ── */}
      {card.on && headOut < 1 ? (
        <div style={{ position: "absolute", left: lerp(650, 150, sh), top: lerp(330, 130, sh), width: 620, height: 340, transformOrigin: "0% 0%",
          transform: `translateY(${card.dy}px) scale(${lerp(1, 0.42, sh) * card.sx}, ${lerp(1, 0.42, sh) * card.sy})`, opacity: 1 - headOut }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 26, background: COLORS.paper, boxShadow: extrude(14, "#b8b8b8", "rgba(0,0,0,0.35)"), padding: "56px 60px", boxSizing: "border-box" }}>
            <div style={{ height: 44 }}><Print t={tStudy}><div style={label(COLORS.grayText, 38)}>The study</div></Print></div>
            <div style={{ marginTop: 28 }}>{ms >= tOri - 40 ? <SlideWords text="OrigAMI-4" t={tOri} size={128} color={COLORS.ink} align="left" /> : null}</div>
          </div>
        </div>
      ) : null}
      {/* ── the drug, on its own ── */}
      {headOut < 1 ? (() => {
        const v = drop(tDrug, 500, 320);
        if (!v.on) return null;
        return (
          <div style={{ opacity: 1 - headOut }}>
            <div style={{ position: "absolute", left: 440, top: 136, width: 130, height: 130, borderRadius: 18, background: COLORS.paper, boxShadow: extrude(8, "#b8b8b8", "rgba(0,0,0,0.3)"),
              display: "flex", alignItems: "center", justifyContent: "center", transformOrigin: "50% 100%", transform: `translateY(${v.dy}px) scale(${v.sx}, ${v.sy})` }}>
              <Vial s={100} />
            </div>
            <div style={{ position: "absolute", left: 600, top: 178, height: 48 }}><Print t={tOwn}><div style={label(COLORS.paper, 40)}>Drug on its own</div></Print></div>
          </div>
        );
      })() : null}

      {/* ── the crowd ── */}
      {ms >= pour0
        ? Array.from({ length: 102 }, (_, i) => {
            const r = RANK.get(i);
            const isR = r !== undefined;
            const g = gridXY(i);
            // pour out of the card
            const p = EASE(k(pour0 + i * 4, 500));
            if (p <= 0) return null;
            let x = lerp(src.x, g.x, p), y = lerp(src.y, g.y, p) - 90 * Math.sin(Math.PI * p);
            let sc = lerp(0.3, 1, p), op = 1, fill = 1, ink = 0;
            if (isR) {
              const hop = k(t42 + r! * 18, 360);
              y -= 40 * Math.sin(Math.PI * hop);
              if (CR15.has(r!)) ink = clamp01((beamX - (g.x + CR.w / 2)) / 40) * (beamP > 0 ? 1 : 0) * (1 - k(tOf, 300));
              // regroup into a 9-wide block, then the durable ones walk across the line
              const b = gridXY(r!, 9);
              const go = EASE(k(tOf + 500 + r! * 8, 650));
              x = lerp(x, b.x, go); y = lerp(y, b.y, go);
              const q = DUR_Q.get(r!);
              if (q !== undefined) {
                const d = gridXY(q, DEST.cols, DEST.left);
                const m = EASE(k(tStill + q * 25, 1000));
                x = lerp(x, d.x, m); y = lerp(y, d.y, m) - (m > 0 && m < 1 ? 6 * Math.abs(Math.sin(x / 12)) : 0);
              } else {
                fill = 1 - 0.85 * k(tStill + 900, 400);
                op = 1 - 0.5 * k(tStill + 900, 400);
              }
            } else {
              const dim = k(t42 + 200 + (i % 17) * 10, 300);
              fill = 1 - dim; op = 1 - 0.55 * dim;
              const fall = EASE(k(tOf + (i % 17) * 12, 520));
              y += 420 * fall * fall; op *= 1 - fall;
              if (fall >= 1) return null;
            }
            return (
              <div key={i} style={{ position: "absolute", left: x, top: y, opacity: op, transform: `scale(${sc})` }}>
                <Fig fill={fill} ink={ink} />
              </div>
            );
          })
        : null}
      {/* ── the scan beam ── */}
      {ms >= tCR && beamP < 1 ? (
        <div style={{ position: "absolute", left: beamX - 4, top: CR.top - 30, width: 8, height: 6 * CR.py + 40, borderRadius: 4, background: COLORS.paper, boxShadow: "0 0 40px 12px rgba(255,255,255,0.45)", opacity: Math.sin(Math.PI * beamP) * 0.6 + 0.4 }} />
      ) : null}
      {/* ── the 6-month line ── */}
      {post.on ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${POST.x}px ${POST.bottom}px`, transform: `translateY(${post.dy}px) scale(${post.sx}, ${post.sy})` }}>
          <div style={{ position: "absolute", left: POST.x - 4, top: POST.top, width: 8, height: POST.bottom - POST.top, background: "repeating-linear-gradient(to bottom, #fff 0 22px, transparent 22px 36px)" }} />
          <div style={{ position: "absolute", left: POST.x - 110, top: POST.top - 70, width: 220, height: 60, borderRadius: 12, background: COLORS.paper, boxShadow: extrude(6, "#b8b8b8", "rgba(0,0,0,0.3)"),
            display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Print t={tMo}><div style={label(COLORS.ink, 34)}>6 months</div></Print>
          </div>
        </div>
      ) : null}

      {/* ── the number column: one figure at a time ── */}
      <ColFig digits={[1, 0, 2]} tIn={t102} tOut={t42} color={COLORS.paper}>
        <div style={label(COLORS.paper, 46)}>patients</div>
      </ColFig>
      <ColFig digits={[4, 2]} pct tIn={t42} tOut={t15} color={COLORS.paper}>
        <div style={{ ...label(COLORS.paper, 46), opacity: k(t42 + 400, 260) }}>responded</div>
      </ColFig>
      <ColFig digits={[1, 5]} pct tIn={t15} tOut={tOf} color={COLORS.ink}>
        <div style={{ height: 54 }}><Print t={tCR}><div style={label(COLORS.ink, 46)}>complete response</div></Print></div>
        <div style={{ marginTop: 10, height: 40 }}><Print t={tNo}><div style={label(INK_SUB_ON_RED, 30)}>No measurable tumor left on scans</div></Print></div>
      </ColFig>
      <ColFig digits={[5, 6]} pct tIn={t56} color={COLORS.paper}>
        <div style={{ ...label(COLORS.paper, 46), opacity: k(t56 + 400, 260) }}>of responders</div>
        <div style={{ marginTop: 10, height: 40 }}><Print t={tStill}><div style={label(INK_SUB_ON_RED, 34)}>still responding at</div></Print></div>
        <div style={{ height: 40 }}><Print t={tMo}><div style={label(INK_SUB_ON_RED, 34)}>6 months or longer</div></Print></div>
      </ColFig>
    </AbsoluteFill>
  );
};
