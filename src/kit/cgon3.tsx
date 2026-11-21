// ─────────────────────────────────────────────────────────────────────────
// KIT · cgon3 — CG Oncology PIVOT-006 long-form, chunk 3 (1:04–1:29, the rest of "The trial").
// V2 house style (MOTION-RULES §0).
//  S10 WallRegrow (ink)   — callback to S9's wall on the SAME seats (K2): a resection loop sweeps across and
//                           the tumours pop off and fly away; on "but they can" the high-grade one sprouts back.
//  S11 Crowd      (paper) — 50 patient figures fall and squash into rows (1 = 1,000); an empty pedestal rises,
//                           its plate prints NO FDA-APPROVED ADJUVANT TREATMENT.
//  S12 Enrolled   (red)   — 367 dots fly in from depth and assemble into a block; 367 PATIENTS lands; the
//                           ~90 SITES plate drops.
//  S13 Randomize  (ink)   — a chute, a flipper and two trays drop in; on "randomized" eight patient tokens drop
//                           one by one and the flipper sends them alternately to CRETOSTIMOGENE / SURVEILLANCE.
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, COLORS, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { EASE, EASE_IO, fadeOut } from "./plusone";
import { label, line } from "./inovio";
import { Print } from "./ryb1b";
import { useP3, useZ } from "./camera";
import { Scatter, useDropX, useSpringX } from "./v2style";
import { G_GREY, G_INK, G_STONE, G_WHITE, Puck } from "./argenx1v2b";
import { G_RED, shadow, WType } from "./summit1";
import { TUMORS, WALL } from "./cgon2";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ══════════════════════════════════════════════════════════════════════════
// S10 (ink) — "These tumors are removed in surgery, but they can come back."
// Settled: the wall with one red bud sprouted back (hero).
// ══════════════════════════════════════════════════════════════════════════
export const LOOP = { D: 150, stick: 260, x0: 300, x1: 1650, y: 440 };

export const WallRegrow: React.FC<Win & { removed: Cued; back: Cued }> = ({ from, to, removed, back }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const tRem = at(removed, 65070, from);
  const tBack = at(back, 66510, from, tRem + 900);
  if (ms < from || ms > to + 320) return null;

  const SWEEP = 900;
  const sw = EASE_IO(k(tRem, SWEEP));
  const loopX = lerp(LOOP.x0, LOOP.x1, sw);
  const midTop = WALL.liningTop + WALL.liningH;
  const musTop = midTop + WALL.midH;
  const layers = [
    { top: musTop, h: WALL.muscleH, front: G_GREY, side: "#555" },
    { top: midTop, h: WALL.midH, front: G_STONE, side: "#8a8a8a" },
    { top: WALL.liningTop, h: WALL.liningH, front: G_WHITE, side: "#9a9a9a" },
  ];
  // the time the loop reaches a tumour's x (inverse of the eased sweep, sampled)
  const reach = (x: number) => {
    for (let i = 0; i <= 60; i++) { const q = i / 60; if (lerp(LOOP.x0, LOOP.x1, EASE_IO(q)) >= x - LOOP.D / 2) return tRem + q * SWEEP; }
    return tRem + SWEEP;
  };
  const regrow = ms < tBack ? 0 : sp(tBack, 9, 160);
  const red = TUMORS[2];
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={shadow(WALL.x, musTop + WALL.muscleH + 16, WALL.w * 0.95, 0.4)} />
      {layers.map((L, i) => (
        <Puck key={i} x={WALL.x} y={L.top + L.h / 2} w={WALL.w} h={L.h} d={160} r={i === 0 ? "10px 10px 30px 30px" : 10} front={L.front} side={L.side}>
          {i === 0 ? <Print t={tRem + SWEEP - 200}><div style={label(COLORS.ink, 38)}>AFTER SURGERY</div></Print> : null}
        </Puck>
      ))}
      {/* the tumours: each pops off and flies up and away as the loop reaches it (riding the sweep) */}
      {TUMORS.map((T, i) => {
        const tr = reach(T.x);
        const f = clamp01((ms - tr) / 650);
        if (f >= 1) return null;
        return (
          <div key={i} style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${T.x}px ${WALL.liningTop}px`,
            transform: `${z(10 + 900 * f)}translate(${260 * f}px, ${-700 * f + 500 * f * f}px) rotateZ(${120 * f}deg) scale(${1 - 0.5 * f})` }}>
            <Puck x={T.x} y={WALL.liningTop + 4 - T.h / 2} w={T.w} h={T.h} d={110} r={`${T.w / 2}px ${T.w / 2}px 22px 22px`} front={T.red ? G_RED : G_WHITE} side={T.red ? "#8f0e15" : "#9a9a9a"} />
          </div>
        );
      })}
      {/* the resection loop: a wire ring on a handle, sweeps left → right through the tumours and leaves */}
      {sw > 0 && sw < 1 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: z(70) || undefined }}>
          <div style={{ ...abs(loopX - LOOP.D / 2, LOOP.y - LOOP.D / 2), width: LOOP.D, height: LOOP.D, borderRadius: "50%", border: `14px solid ${COLORS.paper}`, boxSizing: "border-box" }} />
          <div style={{ ...abs(loopX - 8, LOOP.y - LOOP.D / 2 - LOOP.stick), width: 16, height: LOOP.stick + 6, borderRadius: 8, background: G_GREY }} />
        </div>
      ) : null}
      {/* the high-grade one sprouts back on its own seat */}
      {regrow > 0 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${red.x}px ${WALL.liningTop + 4}px`, transform: `${z(10)}scale(${lerp(0.6, 1, Math.min(1, regrow))}, ${regrow})` }}>
          <Puck x={red.x} y={WALL.liningTop + 4 - red.h / 2} w={red.w} h={red.h} d={110} r={`${red.w / 2}px ${red.w / 2}px 22px 22px`} front={G_RED} side="#8f0e15" />
        </div>
      ) : null}
      <Scatter x={red.x} y={WALL.liningTop} t={tBack} seed={21} n={6} color={COLORS.paper} zz={60} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S11 (paper) — "CG Oncology puts this group at about 50,000 patients, and says no FDA-approved adjuvant
// treatment exists for them."   Settled: the 50 figures (hero) / their label / the empty pedestal + plate.
// ══════════════════════════════════════════════════════════════════════════
export const CROWD = { x0: 300, y0: 250, cols: 10, rows: 5, dx: 58, dy: 80, pedX: 1390, pedTop: 430, pedW: 320, pedH: 350 };

const Person: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <>
    <div style={{ ...abs(x - 13, y - 58), width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(155deg, #5a5a5a 0%, #2a2a2a 100%)" }} />
    <div style={{ ...abs(x - 21, y - 28), width: 42, height: 40, borderRadius: "21px 21px 8px 8px", background: "linear-gradient(155deg, #5a5a5a 0%, #222 100%)" }} />
  </>
);

export const Crowd: React.FC<Win & { count: Cued; no: Cued; adjuvant: Cued }> = ({ from, to, count, no, adjuvant }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const tCount = at(count, 70270, from);
  const tNo = at(no, 72320, from, tCount + 1200);
  const tAdj = at(adjuvant, 73580, from, tNo + 700);
  if (ms < from || ms > to + 320) return null;

  const ped = ms < tNo ? 0 : sp(tNo, 12, 150);
  const people: React.ReactNode[] = [];
  for (let r = 0; r < CROWD.rows; r++) for (let c = 0; c < CROWD.cols; c++) {
    const i = r * CROWD.cols + c;
    // the rows land back to front, left to right: each figure falls 260px and squashes (the whole cascade ≈ 900ms, landing ON the figure's word)
    const t0 = tCount - 420 + (r * CROWD.cols + c) * 13;
    if (ms < t0) continue;
    const f = clamp01((ms - t0) / 240);
    const sq = ms >= t0 + 240 ? 1 - sp(t0 + 240, 7, 220, 0.6) : 0;
    const x = CROWD.x0 + c * CROWD.dx, y = CROWD.y0 + r * CROWD.dy + 60;
    people.push(
      <div key={i} style={{ position: "absolute", inset: 0, transformOrigin: `${x}px ${y + 12}px`,
        transform: `translateY(${-260 * (1 - f * f)}px) scale(${1 + 0.18 * sq}, ${1 - 0.22 * sq})` }}>
        <Person x={x} y={y} />
      </div>,
    );
  }
  const lblX = CROWD.x0 + ((CROWD.cols - 1) * CROWD.dx) / 2;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={{ position: "absolute", inset: 0, transform: z(20) || undefined }}>{people}</div>
      {ms >= tCount ? (
        <div style={{ ...abs(lblX - 400, CROWD.y0 + CROWD.rows * CROWD.dy + 70), width: 800, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transform: z(20) || undefined }}>
          <WType text="≈50,000 PATIENTS" t={tCount} size={60} color={COLORS.ink} />
          <div style={label("#6b6b6b", 24)}>COMPANY ESTIMATE · 1 FIGURE = 1,000</div>
        </div>
      ) : null}

      {/* the empty pedestal rises out of the floor; nothing sits on it */}
      {ped > 0 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${lerp(620, 0, ped)}px)` }}>
          <div style={shadow(CROWD.pedX, CROWD.pedTop + CROWD.pedH + 6, CROWD.pedW * 1.2, 0.2)} />
          <Puck x={CROWD.pedX} y={CROWD.pedTop + CROWD.pedH / 2} w={CROWD.pedW} h={CROWD.pedH} d={200} r={18} front={G_WHITE} side="#a8a8a8">
            <Print t={tAdj}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={line(40, COLORS.accent)}>NO</div>
                <div style={label(COLORS.ink, 24)}>FDA-APPROVED</div>
                <div style={label(COLORS.ink, 24)}>ADJUVANT</div>
                <div style={label(COLORS.ink, 24)}>TREATMENT</div>
              </div>
            </Print>
          </Puck>
          <Puck x={CROWD.pedX} y={CROWD.pedTop - 18} w={CROWD.pedW + 60} h={36} d={240} r={14} front={G_STONE} side="#9a9a9a" />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S12 (red) — "The trial enrolled 367 patients at about 90 sites in the U.S. and Canada."
// Settled: the 367-dot block (hero) / 367 PATIENTS / ~90 SITES plate.
// ══════════════════════════════════════════════════════════════════════════
export const DOTS = { cols: 23, rows: 16, n: 367, pitch: 24, d: 16, cx: 720, cy: 530, figX: 1370 };

export const Enrolled: React.FC<Win & { enrolled: Cued; fig: Cued; sites: Cued }> = ({ from, to, enrolled, fig, sites }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const drop = useDropX();
  const tEn = at(enrolled, 76850, from);
  const tFig = at(fig, 77540, from, tEn + 450);
  const tSites = at(sites, 79610, from, tFig + 900);
  if (ms < from || ms > to + 320) return null;

  const w = DOTS.cols * DOTS.pitch, h = DOTS.rows * DOTS.pitch;
  const left = DOTS.cx - w / 2, top = DOTS.cy - h / 2;
  const plate = drop(tSites - 320, 420, 320);
  const dots: React.ReactNode[] = [];
  for (let i = 0; i < DOTS.n; i++) {
    const t0 = tEn - 200 + (i / DOTS.n) * 520;
    if (ms < t0) continue;
    const p = EASE(clamp01((ms - t0) / 420));
    const c = i % DOTS.cols, r = Math.floor(i / DOTS.cols);
    const sx = (rnd(i) - 0.5) * 1400, sy = (rnd(i + 999) - 0.5) * 900;
    dots.push(
      <div key={i} style={{ ...abs(left + c * DOTS.pitch, top + r * DOTS.pitch), width: DOTS.d, height: DOTS.d, borderRadius: "50%", background: COLORS.paper,
        transform: `translate3d(${sx * (1 - p)}px, ${sy * (1 - p)}px, ${-1600 * (1 - p)}px)` }} />,
    );
  }
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={{ position: "absolute", inset: 0, ...p3 }}>{dots}</div>
      <div style={{ ...abs(DOTS.figX - 300, 300), width: 600, display: "flex", flexDirection: "column", alignItems: "center", gap: 0, transform: z(30) || undefined }}>
        <WType text="367" t={tFig - 120} size={210} color={COLORS.paper} />
        {ms >= tFig ? <WType text="PATIENTS" t={tFig + 80} size={56} color={COLORS.paper} /> : null}
      </div>
      {plate.on ? (
        <div style={{ ...abs(DOTS.figX - 300, 640), width: 600, display: "flex", justifyContent: "center", transform: `${z(30)}translateY(${plate.dy}px)` }}>
          <div style={{ transformOrigin: "50% 100%", transform: `scale(${plate.sx}, ${plate.sy})`, padding: "16px 34px", borderRadius: 26, background: G_WHITE,
            boxShadow: "0 12px 22px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={line(44, COLORS.ink)}>~90 SITES</div>
            <div style={label("#6b6b6b", 24)}>U.S. AND CANADA</div>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S13 (ink) — "After surgery, they were randomized to cretostimogene or to surveillance alone, in an open-label design."
// Settled: the two trays with four tokens each (hero) / the two tray labels.
// ══════════════════════════════════════════════════════════════════════════
export const SORT = { x: 960, chuteTop: 150, chuteH: 280, pivotY: 480, flipW: 210, trayY: 770, trayW: 440, trayH: 96, trayDX: 330, tok: 50, n: 8, gap: 240 };

export const Randomize: React.FC<Win & { rig: Cued; randomized: Cued }> = ({ from, to, rig, randomized }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const drop = useDropX();
  const tRig = at(rig, 82050, from);
  const tRan = at(randomized, 83690, from, tRig + 800);
  if (ms < from || ms > to + 320) return null;

  const rigD = drop(tRig, 700, 380);
  const FALL = 220, FLY = 460;
  // flipper: tilts toward each token's side just before it arrives (one short swing per token)
  let ang = 0;
  for (let j = 0; j < SORT.n; j++) {
    const tj = tRan + j * SORT.gap + FALL - 120;
    if (ms >= tj) ang = lerp(ang, j % 2 === 0 ? 28 : -28, EASE(k(tj, 110)));
  }
  const slotY = SORT.trayY - SORT.trayH / 2 - SORT.tok / 2 - 2;
  const toks: React.ReactNode[] = [];
  for (let j = 0; j < SORT.n; j++) {
    const t0 = tRan + j * SORT.gap;
    if (ms < t0) continue;
    const side = j % 2 === 0 ? -1 : 1; //                    even → left (cretostimogene), odd → right (surveillance)
    const slot = Math.floor(j / 2);
    const tx = SORT.x + side * SORT.trayDX + (slot - 1.5) * 76;
    let x = SORT.x, y = SORT.chuteTop + 30;
    const a = clamp01((ms - t0) / FALL);
    if (a < 1) y = lerp(SORT.chuteTop + 30, SORT.pivotY - 40, a * a);
    else {
      const b = clamp01((ms - t0 - FALL) / FLY);
      x = lerp(SORT.x + side * 60, tx, EASE(b));
      y = lerp(SORT.pivotY - 30, slotY, b * b) - Math.sin(b * Math.PI) * 120;
    }
    toks.push(<Puck key={j} x={x} y={y} w={SORT.tok} h={SORT.tok} d={24} r="50%" front={G_WHITE} side="#9a9a9a" />);
  }
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {rigD.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${SORT.x}px ${SORT.trayY}px`, transform: `translateY(${rigD.dy}px) scale(${rigD.sx}, ${rigD.sy})` }}>
          {/* chute */}
          <Puck x={SORT.x} y={SORT.chuteTop + SORT.chuteH / 2} w={90} h={SORT.chuteH} d={90} r={30} front={G_GREY} side="#555" />
          {/* flipper on its pivot */}
          <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${SORT.x}px ${SORT.pivotY}px`, transform: `rotateZ(${ang}deg)` }}>
            <Puck x={SORT.x} y={SORT.pivotY} w={SORT.flipW} h={22} d={40} r={11} front={G_STONE} side="#8a8a8a" />
          </div>
          <Puck x={SORT.x} y={SORT.pivotY} w={34} h={34} d={50} r="50%" front={G_INK} side="#111" />
          {/* trays */}
          {[-1, 1].map((sd) => (
            <React.Fragment key={sd}>
              <div style={shadow(SORT.x + sd * SORT.trayDX, SORT.trayY + SORT.trayH / 2 + 12, SORT.trayW, 0.45)} />
              <Puck x={SORT.x + sd * SORT.trayDX} y={SORT.trayY} w={SORT.trayW} h={SORT.trayH} d={150} r={30} front={sd < 0 ? G_RED : G_STONE} side={sd < 0 ? "#8f0e15" : "#8a8a8a"}>
                <div style={label(sd < 0 ? COLORS.paper : COLORS.ink, 30)}>{sd < 0 ? "CRETOSTIMOGENE" : "SURVEILLANCE ALONE"}</div>
              </Puck>
            </React.Fragment>
          ))}
        </div>
      ) : null}
      <div style={{ position: "absolute", inset: 0, ...p3, transform: z(60) || undefined }}>{toks}</div>
    </AbsoluteFill>
  );
};
