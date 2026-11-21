// ─────────────────────────────────────────────────────────────────────────
// KIT · cgon2 — CG Oncology PIVOT-006 long-form, chunk 2 (0:30–1:04, "The drug" + the trial's patients).
// V2 house style (MOTION-RULES §0).
//  S5 DrugIn       (ink)   — the bladder drops; the drug's name lands; a red virus lands beside it and on
//                            "delivered" rides the catheter up into the bladder.
//  S6 Replicate    (paper) — a tumour cell drops; the virus drops into it and on "replicate" springs into
//                            eight copies; on "pathway called" the RB ring on the cell's edge cracks open.
//  S7 CarriesGene  (red)   — a big virus springs in; on "carries" the GM-CSF gene capsule flies in and docks;
//                            on "immune signal" a flag hinges up off the capsule.
//  S8 NotApproved  (ink)   — the drug's vial drops; NOT APPROVED ANYWHERE slams straight across it.
//  S9 TrialWall    (paper) — the bladder wall's three layers fall and stack; tumours sprout from the lining
//                            (the high-grade one red); MUSCLE WALL prints under them with a push-in.
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, COLORS, useMs } from "./core";
import { at, lerp, type Cued, type Win } from "./elora";
import { EASE, EASE_IO, fadeOut } from "./plusone";
import { label, line } from "./inovio";
import { Print, Slam } from "./ryb1b";
import { useP3, useZ } from "./camera";
import { Scatter, useDropX, useEnt, useSpringX } from "./v2style";
import { G_GREY, G_INK, G_STONE, G_WHITE, Puck } from "./argenx1v2b";
import { PathSolid } from "./pfb1v2";
import { G_RED, shadow, WType } from "./summit1";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });
const row = (top: number, children: React.ReactNode, extra: React.CSSProperties = {}) => (
  <div style={{ ...abs(0, top), width: 1920, display: "flex", justifyContent: "center", ...extra }}>{children}</div>
);

/** a virus particle: a rounded capsid with knobs round its rim (centre x, y; diameter D) */
export const Virion: React.FC<{ x: number; y: number; D: number; red?: boolean }> = ({ x, y, D, red = true }) => {
  const knob = D * 0.2;
  const front = red ? G_RED : G_WHITE;
  const side = red ? "#8f0e15" : "#9a9a9a";
  return (
    <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return <Puck key={i} x={x + Math.cos(a) * D * 0.56} y={y + Math.sin(a) * D * 0.56} w={knob} h={knob} d={knob * 0.6} r="50%" front={front} side={side} />;
      })}
      <Puck x={x} y={y} w={D} h={D} d={D * 0.3} r="50%" front={front} side={side} />
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S5 (ink) — "The drug is cretostimogene grenadenorepvec, an engineered virus delivered directly into the bladder."
// Settled: the bladder with the virus inside (hero) / the name / BLADDER.
// ══════════════════════════════════════════════════════════════════════════
export const BLAD = { x: 960, y: 560, w: 520, h: 420, tubeBot: 930, virX: 1440, virY: 600, virD: 120 };
const BLADDER_PATH = "M232 420 L232 380 C120 372 20 300 20 190 C20 80 130 10 260 10 C390 10 500 80 500 190 C500 300 400 372 288 380 L288 420 Z";

export const DrugIn: React.FC<Win & { drug: Cued; name: Cued; virus: Cued; delivered: Cued }> = ({ from, to, drug, name, virus, delivered }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const drop = useDropX();
  const sp = useSpringX();
  const tDrug = at(drug, 30670, from);
  const tName = at(name, 31100, from, tDrug + 300);
  const tVir = at(virus, 33850, from, tName + 900);
  const tDel = at(delivered, 34600, from, tVir + 500);
  if (ms < from || ms > to + 320) return null;

  const bl = drop(tDrug, 700, 380);
  const vin = drop(tVir - 380, 600, 380);
  // the ride: arc down to the catheter's foot, then straight up the tube into the bladder (shrinking), then a springy stop
  const RIDE = 1100;
  const r = clamp01((ms - tDel) / RIDE);
  const bot: [number, number] = [BLAD.x, BLAD.tubeBot];
  const inside: [number, number] = [BLAD.x, BLAD.y - 20];
  let vx = BLAD.virX, vy = BLAD.virY;
  if (r > 0 && r <= 0.45) {
    // a quadratic curve bowed down-right (control point below the virus), so the path never crosses the bladder
    const q = EASE_IO(r / 0.45);
    const cx = BLAD.virX, cyy = BLAD.tubeBot;
    vx = (1 - q) * (1 - q) * BLAD.virX + 2 * (1 - q) * q * cx + q * q * bot[0];
    vy = (1 - q) * (1 - q) * BLAD.virY + 2 * (1 - q) * q * cyy + q * q * bot[1];
  } else if (r > 0.45) {
    const q = EASE(clamp01((r - 0.45) / 0.55));
    vx = bot[0];
    vy = lerp(bot[1], inside[1], q);
  }
  const vs = lerp(1, 0.62, EASE(clamp01(r / 0.6)));
  const landed = ms >= tDel + RIDE ? 1 - sp(tDel + RIDE, 8, 200) : 0; //   a small squash on arrival, then still
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {row(130, <WType text="cretostimogene grenadenorepvec" t={tName - 120} size={78} color={COLORS.paper} />, { transform: z(30) || undefined })}

      {bl.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${BLAD.x}px ${BLAD.tubeBot}px`, transform: `translateY(${bl.dy}px) scale(${bl.sx}, ${bl.sy})` }}>
          {/* the two ureters running into the top of the bladder (it reads as the organ, not a balloon) */}
          {[-1, 1].map((sd) => (
            <div key={sd} style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transformOrigin: `${BLAD.x + sd * 150}px ${BLAD.y - BLAD.h / 2 + 40}px`, transform: `rotateZ(${sd * 28}deg)` }}>
              <Puck x={BLAD.x + sd * 150} y={BLAD.y - BLAD.h / 2 - 10} w={26} h={120} d={26} r={13} front={G_GREY} side="#555" />
            </div>
          ))}
          {/* the catheter up into the bladder's neck */}
          <Puck x={BLAD.x} y={(BLAD.y + BLAD.h / 2 + BLAD.tubeBot) / 2} w={30} h={BLAD.tubeBot - BLAD.y - BLAD.h / 2 + 10} d={30} r={15} front={G_GREY} side="#555" />
          <PathSolid id="cg-bladder" x={BLAD.x} y={BLAD.y} w={BLAD.w} h={BLAD.h} d={60} path={BLADDER_PATH} front={["#ffffff", "#ededed", "#c4c4c4"]} side="#8f8f8f">
            <div style={{ position: "absolute", left: 0, right: 0, top: 290, display: "flex", justifyContent: "center" }}>
              <div style={label(COLORS.ink, 30)}>BLADDER</div>
            </div>
          </PathSolid>
        </div>
      ) : null}

      {vin.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(50)}translateY(${r > 0 ? 0 : vin.dy}px)` }}>
          <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${vx}px ${vy}px`,
            transform: `scale(${vs * (r > 0 ? 1 + 0.18 * landed : vin.sx)}, ${vs * (r > 0 ? 1 - 0.22 * landed : vin.sy)})` }}>
            <Virion x={vx} y={vy} D={BLAD.virD} />
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S6 (paper) — "It is built to replicate in tumor cells where a growth-control pathway called RB is disrupted,"
// Settled: the tumour cell full of copies (hero) / the cracked RB ring / TUMOR CELL.
// ══════════════════════════════════════════════════════════════════════════
export const CELL = { x: 960, y: 540, w: 680, h: 470, ringX: 1250, ringY: 345, ringD: 150, copyD: 66 };
const CELL_PATH = "M340 12 C520 6 668 110 662 240 C670 370 540 462 352 458 C170 466 14 380 18 236 C10 104 160 18 340 12 Z";
const COPIES: [number, number][] = [[-170, -60], [-60, -110], [70, -95], [180, -40], [-190, 60], [-70, 30], [60, 50], [170, 85]];

export const Replicate: React.FC<Win & { cell: Cued; enter: Cued; replicate: Cued; rb: Cued }> = ({ from, to, cell, enter, replicate, rb }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const drop = useDropX();
  const sp = useSpringX();
  const tCell = at(cell, 37400, from);
  const tEnter = at(enter, 37820, from, tCell + 300);
  const tRep = at(replicate, 38390, from, tEnter + 450);
  const tRb = at(rb, 41650, from, tRep + 1200);
  if (ms < from || ms > to + 320) return null;

  const c = drop(Math.max(from + 40, tCell - 300), 700, 340);
  const v = drop(tEnter - 340, 520, 340);
  const crack = ms < tRb ? 0 : sp(tRb, 9, 150);
  const cy = CELL.y + 10;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {c.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${CELL.x}px ${CELL.y + CELL.h / 2}px`, transform: `translateY(${c.dy}px) scale(${c.sx}, ${c.sy})` }}>
          <div style={shadow(CELL.x, CELL.y + CELL.h / 2 + 16, CELL.w * 0.85, 0.2)} />
          <PathSolid id="cg-cell" x={CELL.x} y={CELL.y} w={CELL.w} h={CELL.h} d={70} path={CELL_PATH} front={["#d9d9d9", "#bdbdbd", "#949494"]} side="#6f6f6f">
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, display: "flex", justifyContent: "center" }}>
              <div style={label(COLORS.ink, 30)}>TUMOR CELL</div>
            </div>
          </PathSolid>
          {/* the RB brake ring on the cell's edge: cracks into two halves that swing open on "pathway called" */}
          <div style={{ position: "absolute", inset: 0, ...p3, transform: z(50) || undefined }}>
            {[0, 1].map((i) => (
              <div key={i} style={{ ...abs(CELL.ringX - CELL.ringD / 2, CELL.ringY - CELL.ringD / 2), width: CELL.ringD, height: CELL.ringD,
                clipPath: i === 0 ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)", transformOrigin: i === 0 ? "50% 100%" : "50% 100%",
                transform: `translateX(${(i === 0 ? -1 : 1) * 34 * crack}px) rotateZ(${(i === 0 ? -1 : 1) * 24 * crack}deg)` }}>
                <div style={{ width: "100%", height: "100%", borderRadius: "50%", border: `30px solid ${COLORS.ink}`, boxSizing: "border-box",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.3)" }} />
              </div>
            ))}
            <div style={{ ...abs(CELL.ringX - 60, CELL.ringY - CELL.ringD / 2 - 64), width: 120, display: "flex", justifyContent: "center" }}>
              <div style={line(46, COLORS.ink)}>RB</div>
            </div>
          </div>
        </div>
      ) : null}
      <Scatter x={CELL.ringX} y={CELL.ringY} t={tRb} seed={13} n={7} color={COLORS.ink} zz={70} />

      {/* the virus drops into the cell, then springs out into eight copies (they settle and stop) */}
      {v.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(60)}translateY(${ms < tRep ? v.dy : 0}px)` }}>
          {ms < tRep ? (
            <Virion x={CELL.x} y={cy} D={CELL.copyD * 1.3} />
          ) : (
            COPIES.map(([dx, dy], i) => {
              const p = sp(tRep + i * 70, 10, 170);
              return <Virion key={i} x={CELL.x + dx * p} y={cy + dy * p} D={CELL.copyD * lerp(0.4, 1, Math.min(1, p))} />;
            })
          )}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S7 (red) — "and it carries a gene for GM-CSF, an immune signal."
// Settled: virus + docked capsule (hero) / GM-CSF GENE on the capsule / IMMUNE SIGNAL flag.
// ══════════════════════════════════════════════════════════════════════════
export const GENE = { vx: 800, vy: 540, vD: 300, capX: 1150, capY: 540, capW: 300, capH: 100, flagW: 330, flagH: 96 };
/** the camera opens trucked so the lone virus sits centred, then trucks home as the capsule docks (C11) */
export const GENE_OPEN_X = 960 - GENE.vx;

export const CarriesGene: React.FC<Win & { enter: Cued; carries: Cued; signal: Cued }> = ({ from, to, enter, carries, signal }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const tIn = at(enter, from + 80, from);
  const tCar = at(carries, 44420, from, tIn + 450);
  const tSig = at(signal, 47711, from, tCar + 900);
  if (ms < from || ms > to + 320) return null;

  const vin = ent(tIn, 500);
  const cap = ms < tCar ? 0 : sp(tCar, 12, 160);
  const flag = ms < tSig ? 0 : sp(tSig, 9, 150);
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {ms >= tIn ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(lerp(-2400, 0, vin))}` }}>
          <div style={shadow(GENE.vx, GENE.vy + GENE.vD * 0.7, GENE.vD, 0.3)} />
          <Virion x={GENE.vx} y={GENE.vy} D={GENE.vD} red={false} />
        </div>
      ) : null}
      {cap > 0 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(20)}translateX(${lerp(1100, 0, cap)}px)` }}>
          {/* the flag hinges up off the capsule's top on "immune signal" */}
          {flag > 0 ? (
            <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${GENE.capX}px ${GENE.capY - GENE.capH / 2}px`, transform: `rotateX(${lerp(-90, 0, flag)}deg)` }}>
              <div style={{ ...abs(GENE.capX - 7, GENE.capY - GENE.capH / 2 - 130), width: 14, height: 130, borderRadius: 7, background: G_INK }} />
              <div style={{ ...abs(GENE.capX - GENE.flagW / 2, GENE.capY - GENE.capH / 2 - 130 - GENE.flagH), width: GENE.flagW, height: GENE.flagH, borderRadius: 22,
                background: G_WHITE, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 18px rgba(0,0,0,0.35)" }}>
                <div style={label(COLORS.ink, 32)}>IMMUNE SIGNAL</div>
              </div>
            </div>
          ) : null}
          <Puck x={GENE.capX} y={GENE.capY} w={GENE.capW} h={GENE.capH} d={90} r={50} front={G_INK} side="#151515">
            <div style={label(COLORS.paper, 32)}>GM-CSF GENE</div>
          </Puck>
        </div>
      ) : null}
      <Scatter x={GENE.capX - GENE.capW / 2} y={GENE.capY} t={tCar + 380} seed={15} n={6} color={COLORS.paper} zz={60} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S8 (ink) — "It is not approved anywhere."   Settled: the vial (hero) / the NOT APPROVED ANYWHERE plate.
// ══════════════════════════════════════════════════════════════════════════
export const VIAL = { x: 960, base: 820, w: 280, h: 330 };

export const NotApproved: React.FC<Win & { drop: Cued; not: Cued }> = ({ from, to, drop: dropC, not }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const drop = useDropX();
  const tDrop = at(dropC, from + 60, from);
  const tNot = at(not, 49890, from, tDrop + 500);
  if (ms < from || ms > to + 320) return null;

  const d = drop(tDrop, 800, 380);
  const bodyY = VIAL.base - VIAL.h / 2;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {d.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${VIAL.x}px ${VIAL.base}px`, transform: `translateY(${d.dy}px) scale(${d.sx}, ${d.sy})` }}>
          <div style={shadow(VIAL.x, VIAL.base + 8, VIAL.w * 1.1, 0.45)} />
          <Puck x={VIAL.x} y={bodyY} w={VIAL.w} h={VIAL.h} d={80} r={46} front="linear-gradient(155deg, #ffffff 0%, #e9eef0 45%, #b9c2c6 100%)" side="#8d979b" clip>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 120, background: "linear-gradient(180deg, #a8a8a8, #6e6e6e)" }} />
            <div style={{ position: "absolute", left: 16, right: 16, top: 90, height: 70, borderRadius: 12, background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={label(COLORS.ink, 28)}>cretostimogene</div>
            </div>
          </Puck>
          <Puck x={VIAL.x} y={bodyY - VIAL.h / 2 - 22} w={130} h={50} d={60} r={12} front="linear-gradient(155deg, #ffffff 0%, #e9eef0 45%, #b9c2c6 100%)" side="#8d979b" />
          <Puck x={VIAL.x} y={bodyY - VIAL.h / 2 - 72} w={180} h={64} d={70} r={16} front={G_GREY} side="#5a5a5a" />
        </div>
      ) : null}
      <Scatter x={VIAL.x} y={VIAL.base} t={tDrop + 380} seed={17} n={7} color="#bdbdbd" zz={60} />
      {/* the plate slams STRAIGHT across the vial's label */}
      {ms >= tNot ? (
        <div style={{ ...abs(0, bodyY - 70), width: 1920, display: "flex", justifyContent: "center", transform: z(70) || undefined }}>
          <Slam t={tNot}>
            <div style={{ padding: "18px 40px", borderRadius: 24, background: G_WHITE, border: `8px solid ${COLORS.ink}`, display: "flex", flexDirection: "column", alignItems: "center",
              boxShadow: "0 16px 30px rgba(0,0,0,0.5)" }}>
              <div style={line(50, COLORS.ink)}>NOT APPROVED</div>
              <div style={line(50, COLORS.ink)}>ANYWHERE</div>
            </div>
          </Slam>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S9 (paper) — "PIVOT-006 enrolled patients with intermediate-risk non-muscle-invasive bladder cancer, plus small
// high-grade TA tumors: cancer in the bladder lining that has not reached the muscle wall."
// Settled: the wall with its tumours (hero) / NON-MUSCLE-INVASIVE / MUSCLE WALL.
// ══════════════════════════════════════════════════════════════════════════
export const WALL = { x: 960, w: 1200, liningTop: 530, liningH: 40, midH: 70, muscleH: 170 };
export const TUMORS = [{ x: 640, w: 120, h: 105 }, { x: 900, w: 130, h: 120 }, { x: 1220, w: 150, h: 135, red: true }];

export const TrialWall: React.FC<Win & { enrolled: Cued; inter: Cued; nmi: Cued; hg: Cued; reached: Cued }> = ({ from, to, enrolled, inter, nmi, hg, reached }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const drop = useDropX();
  const sp = useSpringX();
  const tEn = at(enrolled, 52680, from);
  const tInt = at(inter, 53950, from, tEn + 700);
  const tNmi = at(nmi, 55030, from, tInt + 500);
  const tHg = at(hg, 58000, from, tNmi + 900);
  const tReach = at(reached, 61910, from, tHg + 900);
  if (ms < from || ms > to + 320) return null;

  const midTop = WALL.liningTop + WALL.liningH;
  const musTop = midTop + WALL.midH;
  const layers = [
    { top: musTop, h: WALL.muscleH, front: G_INK, side: "#151515", delay: 0 },
    { top: midTop, h: WALL.midH, front: G_GREY, side: "#5a5a5a", delay: 120 },
    { top: WALL.liningTop, h: WALL.liningH, front: G_STONE, side: "#9a9a9a", delay: 240 },
  ];
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {row(150, <WType text="NON-MUSCLE-INVASIVE" t={tNmi - 120} size={96} color={COLORS.ink} />, { transform: z(30) || undefined })}

      <div style={shadow(WALL.x, musTop + WALL.muscleH + 16, WALL.w * 0.95, 0.2)} />
      {layers.map((L, i) => {
        const d = drop(tEn - 380 + L.delay, 700, 380);
        if (!d.on) return null;
        return (
          <div key={i} style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${WALL.x}px ${L.top + L.h}px`, transform: `translateY(${d.dy}px) scale(${d.sx}, ${d.sy})` }}>
            <Puck x={WALL.x} y={L.top + L.h / 2} w={WALL.w} h={L.h} d={160} r={i === 0 ? "10px 10px 30px 30px" : 10} front={L.front} side={L.side}>
              {i === 0 ? <Print t={tReach}><div style={label(COLORS.paper, 38)}>MUSCLE WALL</div></Print> : null}
            </Puck>
          </div>
        );
      })}
      <Scatter x={WALL.x} y={WALL.liningTop} t={tEn + 240} seed={19} n={8} color="#9a9a9a" zz={90} />

      {/* the tumours sprout from the lining: two on "intermediate-risk", the red high-grade one on "high-grade" */}
      {TUMORS.map((T, i) => {
        const t0 = T.red ? tHg : tInt + i * 140;
        const g = ms < t0 ? 0 : sp(t0, 9, 170);
        if (g <= 0) return null;
        return (
          <div key={i} style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${T.x}px ${WALL.liningTop + 4}px`, transform: `${z(10)}scale(${lerp(0.6, 1, Math.min(1, g))}, ${g})` }}>
            <Puck x={T.x} y={WALL.liningTop + 4 - T.h / 2} w={T.w} h={T.h} d={110} r={`${T.w / 2}px ${T.w / 2}px 22px 22px`} front={T.red ? G_RED : G_WHITE} side={T.red ? "#8f0e15" : "#9a9a9a"} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
