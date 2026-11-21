// ─────────────────────────────────────────────────────────────────────────
// KIT · ryb1b — Rybrevant chunk 1, v3 "animated explainer" (Nel 11-09: "try animating it, not
// just moving or showing the text"). Things ACT: tumors shrink and regrow, a carton's label
// prints itself, a patient WALKS through treatment gates. One mover at a time; landed things
// go still. On-screen limits: script.md CLAIMS ("10 years" = the FDA's, scoped; accelerated
// approval; not for HPV-driven throat cancer).
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, COLORS, INK_SUB, INK_SUB_ON_RED, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { EASE, back, fadeOut } from "./plusone";
import { extrude, Flap, label, line, Odo, SlideWords, useDrop } from "./inovio";

export const Slam: React.FC<{ t: number; children: React.ReactNode }> = ({ t, children }) => {
  const ms = useMs();
  const k = useK();
  const s = k(t, 200);
  if (ms < t) return null;
  // lands clean: no shock-ring outline (Nel 11-09 — it read as a stray double border mid-fade)
  return <div style={{ opacity: clamp01(s * 4), transform: `scale(${lerp(2.4, 1, s * s)})` }}>{children}</div>;
};

// ── a tumor: an organic blob (three hand-drawn variants) ──
export const BLOBS = [
  "M50 8 C72 6 92 24 90 48 C94 72 74 94 50 92 C26 96 6 76 10 52 C6 28 28 10 50 8Z",
  "M54 6 C80 12 96 34 88 56 C86 80 62 96 40 90 C18 88 4 66 12 44 C14 22 32 4 54 6Z",
  "M46 10 C70 4 90 20 92 44 C96 66 80 90 56 94 C30 98 8 80 8 56 C6 32 24 14 46 10Z",
];
const Blob: React.FC<{ v: number; size: number; color: string; rot?: number }> = ({ v, size, color, rot = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible" }}>
    <path d={BLOBS[v % 3]} fill={color} transform={`rotate(${rot} 50 50)`} />
  </svg>
);

// 42 "responders" scattered through the 100 (deterministic), ordered by distance from centre
const RESP = (() => {
  const idx = Array.from({ length: 100 }, (_, i) => i);
  let seed = 7;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
  const set = idx.slice(0, 42);
  const d = (i: number) => Math.hypot((i % 10) - 4.5, Math.floor(i / 10) - 4.5);
  set.sort((a, b) => d(a) - d(b));
  const order = new Map<number, number>();
  set.forEach((i, n) => order.set(i, n));
  return order;
})();

// head & neck in profile, facing right (300 × 400 box); the tumor sits in the front of the neck
export const HEAD = "M150 20 C210 20 250 60 252 120 L258 150 L280 190 L258 200 L262 222 L255 232 L260 248 L250 262 C250 285 235 295 215 298 L190 300 C185 330 188 360 195 400 L90 400 C92 340 80 300 70 260 C45 200 50 130 70 80 C90 40 120 20 150 20 Z";
export const NECK_TUMOR = { x: 172, y: 336 };

// ══════════════════════════════════════════════════════════════════════════
// §1 HOOK (red) — "42%. That is the response rate behind the first new drug in 10 years for
// patients whose head and neck cancer keeps coming back."
//  · "42%." → 100 tumors pop in as a grid; the 42% odometer rolls beside it.
//  · "rate" → 42 of the tumors SHRINK to dots in one wave (that is what a response is).
//  · "first" → the grid collapses into one tile; nine empty YEAR tiles drop in before it;
//    "years" → that tile flips to the drug. The headline lands, attributed.
//  · "head" → the row rises to a header strip; a head-and-neck profile DRAWS itself; "neck" → a
//    tumor grows in the neck; "keeps coming back" → it shrinks… and grows back.
// ══════════════════════════════════════════════════════════════════════════
const GRID = { left: 230, top: 170, cell: 58, gap: 12 };
const GW = 10 * GRID.cell + 9 * GRID.gap;
const ROWB = { n: 10, tile: 120, gap: 20, top: 400 };
const rowBL = 960 - (ROWB.n * ROWB.tile + (ROWB.n - 1) * ROWB.gap) / 2;
const tileX = (i: number) => rowBL + i * (ROWB.tile + ROWB.gap);

export const HookAnimated: React.FC<Win & { fig: Cued; rate: Cued; first: Cued; years: Cued; forP: Cued; head: Cued; neck: Cued; keeps: Cued; coming: Cued }> = ({
  from, to, fig, rate, first, years, forP, head, neck, keeps, coming,
}) => {
  const ms = useMs();
  const k = useK();
  const drop = useDrop();
  const tFig = at(fig, from + 200, from);
  const tRate = at(rate, tFig + 3600, from, tFig + 800);
  const tFirst = at(first, tRate + 840, from, tRate + 300);
  const tYears = at(years, tFirst + 1290, from, tFirst + 600);
  const tFor = at(forP, tYears + 310, from, tYears + 100);
  const tHead = at(head, tFor + 1040, from, tFor + 400);
  const tNeck = at(neck, tHead + 550, from, tHead + 200);
  const tKeeps = at(keeps, tNeck + 830, from, tNeck + 300);
  const tCome = at(coming, tKeeps + 400, from, tKeeps + 200);
  if (ms > to + 320) return null;

  // stage 1 → 2: the grid collapses into tile 10
  const collapse = EASE(k(tFirst, 480));
  const gcx = GRID.left + GW / 2, gcy = GRID.top + GW / 2;
  const t10cx = tileX(9) + ROWB.tile / 2, t10cy = ROWB.top + ROWB.tile / 2;
  const gScale = lerp(1, ROWB.tile / GW, collapse);
  const figOut = EASE(k(tFirst - 100, 420));
  // stage 2 → 3: row + headline rise into a header strip
  const strip = EASE(k(tHead, 520));
  const flip = EASE(k(tYears, 420));
  // stage 3: the profile draws, the tumor grows / shrinks / regrows
  const draw = EASE(k(tHead + 250, 700));
  const grow = back(k(tNeck, 420));
  const shrink = EASE(k(tKeeps, 380));
  const regrow = back(k(tCome, 520));
  const tumS = grow * lerp(1, 0.25, shrink) + (ms >= tCome ? lerp(0, 0.95, regrow) : 0);

  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300) }}>
      {/* ── the 100 tumors ── */}
      {collapse < 1 ? (
        <div style={{ position: "absolute", left: GRID.left, top: GRID.top, width: GW, height: GW, transformOrigin: "50% 50%",
          transform: `translate(${(t10cx - gcx) * collapse}px, ${(t10cy - gcy) * collapse}px) scale(${gScale})`, opacity: 1 - 0.6 * collapse }}>
          {Array.from({ length: 100 }, (_, i) => {
            const pop = back(k(tFig + i * 6, 260));
            const r = RESP.get(i);
            const sh = r === undefined ? 0 : EASE(k(tRate + r * 18, 380));
            const s = pop * lerp(1, 0.2, sh);
            return (
              <div key={i} style={{ position: "absolute", left: (i % 10) * (GRID.cell + GRID.gap), top: Math.floor(i / 10) * (GRID.cell + GRID.gap), width: GRID.cell, height: GRID.cell,
                transform: `scale(${s})`, opacity: ms >= tFig ? 1 - 0.45 * sh : 0 }}>
                <Blob v={i} size={GRID.cell} color={COLORS.paper} rot={(i * 47) % 360} />
              </div>
            );
          })}
        </div>
      ) : null}
      {/* ── 42%, rolling ── */}
      {ms >= tFig && figOut < 1 ? (
        <div style={{ position: "absolute", left: 1040, top: 300, opacity: 1 - figOut, transform: `translateX(${200 * figOut}px)` }}>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <Odo digit={4} t={tFig} dur={800} size={300} color={COLORS.paper} />
            <Odo digit={2} t={tFig + 80} dur={800} size={300} color={COLORS.paper} />
            <div style={{ ...line(300, COLORS.paper), height: 300, lineHeight: "300px", opacity: clamp01(k(tFig + 700, 160) * 3) }}>%</div>
          </div>
          <div style={{ marginTop: 10, marginLeft: 10 }}>{ms >= tRate - 40 ? <SlideWords text="Response rate" t={tRate} size={64} color={COLORS.paper} align="left" /> : null}</div>
        </div>
      ) : null}
      {/* ── the year row + headline (→ header strip) ── */}
      {ms >= tFirst ? (
        <div style={{ position: "absolute", inset: 0, transformOrigin: "960px 400px", transform: `translateY(${-250 * strip}px) scale(${lerp(1, 0.62, strip)})` }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: ROWB.top - 150 }}>
            {ms >= tFor - 40 ? <SlideWords text="The first new drug in 10 years" t={tFor} size={66} color={COLORS.paper} /> : null}
          </div>
          {Array.from({ length: ROWB.n }, (_, i) => {
            const last = i === ROWB.n - 1;
            if (last) {
              if (collapse < 1) return null;
              return (
                <div key={i} style={{ position: "absolute", left: tileX(i), top: ROWB.top, width: ROWB.tile, height: ROWB.tile, perspective: 700 }}>
                  <div style={{ position: "absolute", inset: 0, borderRadius: 14, transform: `rotateY(${flip < 0.5 ? flip * 180 : (flip - 1) * 180}deg)`,
                    background: flip < 0.5 ? COLORS.ink : COLORS.paper, boxShadow: extrude(10, flip < 0.5 ? "#000" : "#c9c9c9", "rgba(0,0,0,0.3)"),
                    display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {flip >= 0.5 ? <Vial s={92} /> : null}
                  </div>
                </div>
              );
            }
            const d = drop(tFirst + 300 + (8 - i) * 55, 500, 280);
            if (!d.on) return null;
            return (
              <div key={i} style={{ position: "absolute", left: tileX(i), top: ROWB.top, width: ROWB.tile, height: ROWB.tile, borderRadius: 14, boxSizing: "border-box",
                border: "5px solid rgba(255,255,255,0.75)", transformOrigin: "50% 100%", transform: `translateY(${d.dy}px) scale(${d.sx}, ${d.sy})` }} />
            );
          })}
          <div style={{ position: "absolute", left: 0, right: 0, top: ROWB.top + ROWB.tile + 40, textAlign: "center", ...label(INK_SUB_ON_RED, 38), opacity: k(tFor + 600, 260) }}>The FDA, for these patients</div>
        </div>
      ) : null}
      {/* ── head & neck profile: draws, then the tumor grows / shrinks / grows back ── */}
      {ms >= tHead + 250 ? (
        <svg width={420} height={560} viewBox="0 0 300 400" style={{ position: "absolute", left: 960 - 210, top: 330, overflow: "visible" }}>
          <path d={HEAD} fill="none" stroke={COLORS.paper} strokeWidth={6} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
          {ms >= tNeck ? (
            <g transform={`translate(${NECK_TUMOR.x} ${NECK_TUMOR.y}) scale(${tumS}) translate(-28 -28)`}>
              <path d={BLOBS[1]} transform="scale(0.56)" fill={COLORS.paper} />
            </g>
          ) : null}
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};

export const Vial: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" style={{ display: "block" }}>
    <rect x={34} y={8} width={32} height={14} rx={3} fill={COLORS.ink} />
    <rect x={38} y={22} width={24} height={8} fill={COLORS.ink} />
    <path d="M30 34 Q30 30 34 30 L66 30 Q70 30 70 34 L70 86 Q70 94 62 94 L38 94 Q30 94 30 86 Z" fill="none" stroke={COLORS.ink} strokeWidth={6} />
    <path d="M34 58 L66 58 L66 86 Q66 90 62 90 L38 90 Q34 90 34 86 Z" fill={COLORS.accent} />
  </svg>
);

// ══════════════════════════════════════════════════════════════════════════
// §2a THE CARTON (ink, footage scrim behind) — "On November 5th, the FDA granted accelerated
// approval to Johnson and Johnson's Rybrevant Faspro, the version of amivantamab…"
//  · "November" → white split-flaps flip to NOV 5 (top left).
//  · "granted" → a BLANK carton drops (squash).  · "accelerated" → the FDA stamp slams across its
//    bottom edge (camera pushes in).  · then the label PRINTS onto the blank face on its words:
//    J&J, the name (two lines), the generic.  · "given" → the carton flies back into depth.
// ══════════════════════════════════════════════════════════════════════════
export const CARTON = { cx: 1110, top: 270, w: 760 };

export const Print: React.FC<{ t: number; children: React.ReactNode }> = ({ t, children }) => {
  const k = useK();
  const p = EASE(k(t, 380));
  return <div style={{ clipPath: `inset(0 ${100 - 100 * p}% 0 0)` }}>{children}</div>;
};

export const CartonApproval: React.FC<Win & { date: Cued; granted: Cued; accel: Cued; jnj: Cued; name: Cued; name2: Cued; generic: Cued; leave: Cued }> = ({
  from, to, date, granted, accel, jnj, name, name2, generic, leave,
}) => {
  const ms = useMs();
  const k = useK();
  const drop = useDrop();
  const tDate = at(date, from + 270, from);
  const tGr = at(granted, tDate + 1400, from, tDate + 300);
  const tAcc = at(accel, tGr + 500, from, tGr + 200);
  const tJ = at(jnj, tAcc + 1460, from, tAcc + 300);
  const tName = at(name, tJ + 1180, from, tJ + 300);
  const tName2 = at(name2, tName + 680, from, tName + 200);
  const tGen = at(generic, tName2 + 1600, from, tName2 + 300);
  const tLeave = at(leave, tGen + 830, from, tGen + 300);
  if (ms < tDate - 40 || ms > to + 320) return null;
  const c = drop(tGr, 800, 380);
  const gone = EASE(k(tLeave, 520));
  const DATE = "NOV 5".split("");
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300) }}>
      {/* the date board */}
      <div style={{ position: "absolute", left: 150, top: 150, display: "flex", gap: 10, transform: "scale(0.7)", transformOrigin: "0% 0%", opacity: 1 - gone }}>
        {DATE.map((ch, i) => {
          const d = drop(tDate + i * 50, 500, 300);
          if (!d.on) return <div key={i} style={{ width: 124, height: 184 }} />;
          return <div key={i} style={{ transformOrigin: "50% 100%", transform: `translateY(${d.dy}px) scale(${d.sx}, ${d.sy})` }}><Flap light delay={i * 50} states={[[tDate + 150, ch]]} /></div>;
        })}
      </div>
      {/* the carton */}
      {c.on && gone < 1 ? (
        <div style={{ position: "absolute", left: CARTON.cx - CARTON.w / 2, top: CARTON.top, width: CARTON.w, transformOrigin: "50% 100%",
          transform: `translateY(${c.dy - 120 * gone}px) scale(${c.sx * lerp(1, 0.35, gone)}, ${c.sy * lerp(1, 0.35, gone)})`, opacity: 1 - gone }}>
          <div style={{ borderRadius: 22, background: COLORS.paper, boxShadow: extrude(18, "#b5b5b5", "rgba(0,0,0,0.55)"), padding: "44px 48px 64px", boxSizing: "border-box" }}>
            <div style={{ height: 40 }}><Print t={tJ}><div style={label(COLORS.grayText, 34)}>Johnson &amp; Johnson</div></Print></div>
            <div style={{ marginTop: 16, height: 4, background: COLORS.ink, transformOrigin: "0% 50%", transform: `scaleX(${EASE(k(tJ, 400))})` }} />
            <div style={{ marginTop: 22, height: 222 }}>
              {ms >= tName - 40 ? <SlideWords text="Rybrevant" t={tName} size={104} color={COLORS.ink} align="left" /> : null}
              {ms >= tName2 - 40 ? <SlideWords text="Faspro" t={tName2} size={104} color={COLORS.ink} align="left" /> : null}
            </div>
            <div style={{ marginTop: 14, height: 36 }}><Print t={tGen}><div style={label(COLORS.grayText, 32)}>Amivantamab · injection under the skin</div></Print></div>
          </div>
          {/* the FDA stamp straddles the bottom edge */}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: -44, display: "flex", justifyContent: "center" }}>
            <Slam t={tAcc}>
              <div style={{ ...line(42, COLORS.accent), background: COLORS.paper, border: `7px solid ${COLORS.accent}`, borderRadius: 14, padding: "12px 30px" }}>FDA · Accelerated approval</div>
            </Slam>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// §2b THE PATIENT'S ROAD (ink) — "It is approved for adults with recurrent or metastatic head and
// neck squamous cell carcinoma whose cancer progressed on or after platinum chemotherapy and
// immunotherapy. It is not approved for HPV-driven cancers of the throat."
//  · The road draws; the DESTINATION gate stands at its end and its sign writes on its words.
//  · "whose cancer" → a patient drops onto the road's start.  · "platinum" → gate 1 drops; the
//    patient WALKS; the gate's shutter rolls up, they pass, it rolls down: "Progressed".
//  · "immunotherapy" → gate 2, the same.  · they walk on; the destination shutter rolls up and stays.
//  · "not approved" → gates 1–2 retire; a fourth gate drops ("HPV-driven throat cancer"); a second,
//    hollow figure walks up to it and stops; "cancers" → a red bar locks it (the scene's one red).
// Camera: starts pushed in on the destination sign, pans to the patient, FOLLOWS each walk, lands square.
// ══════════════════════════════════════════════════════════════════════════
export const ROAD = { y: 720, x0: 120, x1: 1820, start: 200, g1: 520, g2: 840, dest: 1220, hpv: 1650, gw: 150, gh: 240 };

/** a walking figure: feet at (x, y). phase drives the leg / arm swing; `walking` 0..1 blends it in. */
const Walker: React.FC<{ x: number; y: number; phase: number; walking: number; hollow?: boolean; sx?: number; sy?: number }> = ({ x, y, phase, walking, hollow = false, sx = 1, sy = 1 }) => {
  const a = 28 * Math.sin(phase) * walking * (Math.PI / 180);
  const bob = -5 * Math.abs(Math.sin(phase)) * walking;
  const col = hollow ? "rgba(255,255,255,0.7)" : COLORS.paper;
  const leg = (s: number) => `M0 -86 L${Math.sin(s * a) * 86} ${-86 + Math.cos(s * a) * 86}`;
  const arm = (s: number) => `M0 -146 L${Math.sin(s * a * 0.9) * 64} ${-146 + Math.cos(s * a * 0.9) * 64}`;
  return (
    <svg width={200} height={260} viewBox="-100 -240 200 260" style={{ position: "absolute", left: x - 100, top: y - 240, overflow: "visible", transformOrigin: "50% 92%", transform: `scale(${sx}, ${sy})` }}>
      <g transform={`translate(0 ${bob})`} stroke={col} strokeWidth={14} strokeLinecap="round" fill="none">
        <path d={leg(1)} /><path d={leg(-1)} />
        <path d="M0 -86 L0 -150" />
        <path d={arm(-1)} /><path d={arm(1)} />
        <circle cx={0} cy={-182} r={24} fill={hollow ? "none" : col} />
      </g>
    </svg>
  );
};

/** a gate: two posts, a sign plate on top (ink text on white), a shutter that rolls UP (open 0..1) */
const Gate: React.FC<{ x: number; open: number; tag?: number; tagText?: string; plateW: number; children: React.ReactNode; dropT: number; bar?: number; opacity?: number }> = ({
  x, open, tag = 0, tagText = "Progressed", plateW, children, dropT, bar = 0, opacity = 1,
}) => {
  const drop = useDrop();
  const d = drop(dropT, 520, 340);
  if (!d.on) return null;
  const { y, gw, gh } = { y: ROAD.y, gw: ROAD.gw, gh: ROAD.gh };
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity, transformOrigin: `${x}px ${y}px`, transform: `translateY(${d.dy}px) scale(${d.sx}, ${d.sy})` }}>
      {/* posts */}
      {[-1, 1].map((s) => <div key={s} style={{ position: "absolute", left: x + s * (gw / 2 + 6) - 6, top: y - gh, width: 12, height: gh, background: COLORS.paper, borderRadius: 4 }} />)}
      {/* shutter: rolls up into the plate */}
      <div style={{ position: "absolute", left: x - gw / 2, top: y - gh, width: gw, height: gh * (1 - open), background: COLORS.paper, borderRadius: "0 0 6px 6px", overflow: "hidden",
        display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 20, boxSizing: "border-box" }}>
        <div style={{ ...label(COLORS.ink, 24), opacity: tag }}>{tagText}</div>
      </div>
      {bar > 0 ? <div style={{ position: "absolute", left: x - gw / 2 - 24, top: y - gh / 2 - 9, width: gw + 48, height: 18, borderRadius: 6, background: COLORS.accent, transformOrigin: "0% 50%", transform: `scaleX(${EASE(bar)})` }} /> : null}
      {/* sign plate */}
      <div style={{ position: "absolute", left: x - plateW / 2, width: plateW, bottom: 1080 - (y - gh - 10), borderRadius: 14, background: COLORS.paper, boxShadow: extrude(8, "#9a9a9a", "rgba(0,0,0,0.4)"), padding: "16px 20px", boxSizing: "border-box", textAlign: "center" }}>
        {children}
      </div>
    </div>
  );
};

export const PatientRoad: React.FC<Win & { approved: Cued; recurrent: Cued; head: Cued; squamous: Cued; whose: Cued; platinum: Cued; immuno: Cued; not: Cued; approved2: Cued; hpv: Cued; cancers: Cued }> = ({
  from, to, approved, recurrent, head, squamous, whose, platinum, immuno, not, approved2, hpv, cancers,
}) => {
  const ms = useMs();
  const k = useK();
  const drop = useDrop();
  const tApp = at(approved, from + 280, from);
  const tRec = at(recurrent, tApp + 1280, from, tApp + 300);
  const tHead = at(head, tRec + 1270, from, tRec + 300);
  const tSq = at(squamous, tHead + 680, from, tHead + 200);
  const tWho = at(whose, tSq + 1490, from, tSq + 300);
  const tPlat = at(platinum, tWho + 2240, from, tWho + 600);
  const tImm = at(immuno, tPlat + 1780, from, tPlat + 1300);
  const tNot = at(not, tImm + 1640, from, tImm + 1300);
  const tApp2 = at(approved2, tNot + 240, from, tNot + 100);
  const tHpv = at(hpv, tApp2 + 950, from, tApp2 + 300);
  const tCan = at(cancers, tHpv + 730, from, tHpv + 300);
  if (ms < from - 40 || ms > to + 320) return null;
  const R = ROAD;
  // the patient's walk: three legs, each a cued travel
  const W1 = [tPlat + 300, 950, R.start, R.g1 + 160] as const;
  const W2 = [tImm + 220, 620, R.g1 + 160, R.g2 + 160] as const;
  const W3 = [W2[0] + W2[1], 560, R.g2 + 160, R.dest] as const;
  const leg = (w: readonly [number, number, number, number]) => EASE(k(w[0], w[1]));
  const px = lerp(lerp(lerp(R.start, W1[3], leg(W1)), W2[3], leg(W2)), W3[3], leg(W3));
  const walkingNow = [W1, W2, W3].some((w) => ms >= w[0] && ms < w[0] + w[1]) ? 1 : 0;
  const phase = (px / 70) * Math.PI;
  const pd = drop(tWho, 500, 320);
  // a shutter opens as the walker approaches, closes once they are through
  const shutter = (gx: number, stay = false) => {
    const opening = clamp01((px - (gx - 170)) / 90);
    const closing = stay ? 0 : clamp01((px - (gx + 70)) / 70);
    return opening * (1 - closing);
  };
  const tag = (gx: number) => clamp01((px - (gx + 150)) / 30);
  const retire = EASE(k(tNot, 420));
  // the second (HPV-driven) walker
  const f2 = drop(tApp2, 420, 300);
  const w2 = EASE(k(tHpv, 520));
  const f2x = lerp(R.hpv - 250, R.hpv - 110, w2);
  const bump = ms >= tHpv + 520 ? Math.sin(Math.PI * clamp01((ms - tHpv - 520) / 180)) : 0;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300) }}>
      {/* the road */}
      <div style={{ position: "absolute", left: R.x0, top: R.y, width: (R.x1 - R.x0) * EASE(k(from, 700)), height: 6, borderRadius: 3, background: "rgba(255,255,255,0.45)" }} />
      {/* destination gate: its sign writes on the indication's words */}
      <Gate x={R.dest} open={shutter(R.dest, true)} plateW={440} dropT={from + 100}>
        <div style={{ ...label(COLORS.grayText, 26), opacity: k(tApp, 260) }}>Approved for adults</div>
        <div style={{ marginTop: 8, height: 36 }}><Print t={tRec}><div style={label(COLORS.ink, 32)}>Recurrent or metastatic</div></Print></div>
        <div style={{ height: 36 }}><Print t={tHead}><div style={label(COLORS.ink, 32)}>head &amp; neck squamous</div></Print></div>
        <div style={{ height: 36 }}><Print t={tSq}><div style={label(COLORS.ink, 32)}>cell carcinoma</div></Print></div>
      </Gate>
      {/* treatment gates */}
      <Gate x={R.g1} open={shutter(R.g1)} tag={tag(R.g1)} plateW={260} dropT={tPlat} opacity={1 - retire}>
        <div style={{ ...label(COLORS.ink, 28), lineHeight: 1.2 }}>Platinum<br />chemotherapy</div>
      </Gate>
      <Gate x={R.g2} open={shutter(R.g2)} tag={tag(R.g2)} plateW={260} dropT={tImm} opacity={1 - retire}>
        <div style={{ ...label(COLORS.ink, 28), lineHeight: 1.2 }}>Immuno-<br />therapy</div>
      </Gate>
      {/* not approved: HPV-driven throat cancer */}
      <Gate x={R.hpv} open={0} plateW={280} dropT={tNot} bar={k(tCan, 220)} tagText="" >
        <div style={{ ...label(COLORS.grayText, 24) }}>Not approved for</div>
        <div style={{ marginTop: 6, ...label(COLORS.ink, 28), lineHeight: 1.2 }}>HPV-driven<br />throat cancer</div>
      </Gate>
      {/* the patient */}
      {pd.on ? <Walker x={px} y={R.y + pd.dy} phase={phase} walking={walkingNow} sx={pd.sx} sy={pd.sy} /> : null}
      {f2.on ? <Walker x={f2x} y={R.y + f2.dy} phase={(f2x / 70) * Math.PI} walking={ms >= tHpv && ms < tHpv + 520 ? 1 : 0} hollow sx={f2.sx * (1 + 0.08 * bump)} sy={f2.sy * (1 - 0.12 * bump)} /> : null}
    </AbsoluteFill>
  );
};
