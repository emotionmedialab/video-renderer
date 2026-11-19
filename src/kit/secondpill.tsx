// ─────────────────────────────────────────────────────────────────────────
// KIT · secondpill — THE SECOND TARGET. Added on the Gilead × PepStar LONG-FORM, 2026-11-02
// (HORIZONTAL 16:9). Absolute 1920×1080 seats; import by path. One-mover, frame budget, depth
// by default. White-card world.
//
// `SecondPill`: the camera rolls back along the days from Oct 22 to Oct 19; a capsule holding
// a black hexagon falls off the Oct 19 tick; the hexagon flies to a HEXAGONAL socket beside
// the first target (a different shape IS "a different target"); the bars burst up from the
// floor under a low camera; the capsule hops to a dashed Phase 3.
// The camera ends the roll at x +ROLL_X, so every later seat is written as S(screen x).
// Exports `BeadRing`, `Hex`, `HexSocket` for the §6 pairing and the §9 callback.
//
// Limits: 66% vs 37% = clinical response, week 12, TOP DOSE, Phase 2, ulcerative colitis.
// Phase 3 in 2027 is planned, monotherapy.
// ─────────────────────────────────────────────────────────────────────────

import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, DISPLAY, TRACK, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { useP3, useZ } from "./camera";
import { back, EASE, EASE_IO, fadeOut } from "./plusone";
import { FlyWord } from "./split";
import { Receptor, WALL_Y } from "./thering";

type Txt = { text: string } & Cued;
const sq = (t: number) => (t <= 0 || t >= 1 ? 0 : Math.exp(-5 * t) * Math.sin(11 * t));

export const ROLL_X = 1500;
const S = (x: number) => x - ROLL_X;

const hexPts = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ");

/** A solid hexagon: emvistegrast's mark. */
export const Hex: React.FC<{ x: number; y: number; r: number; color: string }> = ({ x, y, r, color }) => (
  <svg width={1920} height={1400} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}><polygon points={hexPts(x, y, r)} fill={color} /></svg>
);

/** A socket with a hexagonal floor, open at the top, a stem through the wall. */
export const HexSocket: React.FC<{ x: number; y: number; r: number; color: string; sw?: number }> = ({ x, y, r, color, sw = 12 }) => {
  const dx = r * 0.5, dy = r * 0.866;
  return (
    <svg width={1920} height={1400} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <path d={`M ${x - r} ${y - r * 0.5} V ${y} L ${x - dx} ${y + dy} H ${x + dx} L ${x + r} ${y} V ${y - r * 0.5} M ${x} ${y + dy} V ${WALL_Y + 170}`}
        fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/** The closed ring at rest: HCXT-2001's mark. */
export const BeadRing: React.FC<{ x: number; y: number; r: number; color: string }> = ({ x, y, r, color }) => {
  const bead = r * 0.176;
  return (
    <svg width={1920} height={1400} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <circle cx={x} cy={y} r={r} fill="none" stroke={color} strokeWidth={Math.max(5, r * 0.07)} />
      {Array.from({ length: 10 }, (_, i) => {
        const a = (Math.PI / 5) * i;
        return <circle key={i} cx={x + r * Math.cos(a)} cy={y + r * Math.sin(a)} r={bead} fill={color} />;
      })}
    </svg>
  );
};

export const Capsule: React.FC<{ x: number; y: number; w: number; color: string; sw?: number }> = ({ x, y, w, color, sw = 9 }) => {
  const h = w * 0.42;
  return (
    <svg width={1920} height={1400} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h / 2} fill="none" stroke={color} strokeWidth={sw} />
    </svg>
  );
};

const line = (size: number, color: string, weight = 700): React.CSSProperties => ({ fontFamily: DISPLAY, fontWeight: weight, fontSize: size, lineHeight: 1, letterSpacing: TRACK.headline, color, whiteSpace: "nowrap" });

// Settled frames: the line · date + capsule + name + indication · two targets, their names and labels
// · two bars + figures + header · the phase rail + 2027 + its label.
export const SecondPill: React.FC<Win & {
  flow: { rows: { text: string; word: string }[][]; out: Cued };
  three: Cued; // the rail and "Oct 22"
  roll: Cued; // the camera rolls; the days land
  date: Txt; // Oct 19 stamps
  win: Txt; // "A mid-stage win, Phase 2"
  pill: Cued; // the capsule falls off the tick
  name: Txt; // emvistegrast
  uc: Txt; // "Ulcerative colitis"
  clear: Cued; // the rail, date, capsule and label leave (a pin inside the pause)
  go: Cued; // the name travels to the second target, the first target appears
  socket: Cued; // the hexagonal socket rises
  plug: Cued; // the hexagon slams in
  label: Txt; // α4β7
  targetsOut: Cued; // the two targets retire (a pin inside the pause)
  dose: Txt; // the top-dose label; the camera drops to the floor
  a: { value: number; suffix: string } & Cued; // red bar
  aEnd: Cued; // its count lands
  header: Txt; // "Responded at week 12"
  b: { value: number; suffix: string; label: string } & Cued; // dim bar
  barsOut: Cued; // the bars retire (a pin inside the pause)
  plans: Txt; // the phase rail + its label
  hop: Cued; // the capsule hops to the dashed stop
  year: Txt; // 2027 stamps
}> = ({ from, to, flow, three, roll, date, win, pill, name, uc, clear, go, socket, plug, label, targetsOut, dose, a, aEnd, header, b, barsOut, plans, hop, year }) => {
  const ms = useMs();
  const k = useK();
  const Z = useZ();
  const P3 = useP3();
  const INK = COLORS.ink;
  const GRAY = COLORS.grayText;

  const tFO = at(flow.out, from + 2000, from);
  const t3 = at(three, tFO + 300, from, tFO);
  const tR = at(roll, t3 + 500, from, t3);
  const tD = at(date, tR + 1400, from, tR);
  const tW = at(win, tD + 1500, from, tD);
  const tP = at(pill, tW + 1000, from, tW);
  const tN = at(name, tP + 1300, from, tP);
  const tUC = at(uc, tN + 1500, from, tN);
  const tCl = at(clear, tUC + 1800, from, tUC);
  const tGo = at(go, tCl + 100, from, tCl);
  const tSo = at(socket, tGo + 1000, from, tGo);
  const tPl = at(plug, tSo + 560, from, tSo);
  const tL = at(label, tPl + 370, from, tPl);
  const tTO = at(targetsOut, tL + 800, from, tL);
  const tDo = at(dose, tTO + 300, from, tTO);
  const tA = at(a, tDo + 550, from, tDo);
  const tAE = at(aEnd, tA + 800, from, tA);
  const tH = at(header, tAE + 400, from, tA);
  const tB = at(b, tH + 2400, from, tH);
  const tBO = at(barsOut, tB + 1700, from, tB);
  const tPla = at(plans, tBO + 200, from, tBO);
  const tHop = at(hop, tPla + 1000, from, tPla);
  const tY = at(year, tHop + 800, from, tHop);
  const vis = fadeOut(ms, to);
  if (ms < from - 40 || vis <= 0) return null;

  const clearQ = 1 - k(tCl, 200);
  const flyQ = EASE_IO(k(tGo, 640));
  const fallT = Math.pow(k(tP, 340), 2);
  const landSq = sq(k(tP + 340, 480));
  const capY = lerp(120, 470, fallT) + landSq * 8;
  const hexGoT = Math.pow(k(tSo, tPl - tSo), 1.8);
  const hexX = lerp(S(960), S(1300), EASE_IO(k(tGo, tSo - tGo)));
  const hexY = lerp(lerp(470, 240, EASE_IO(k(tGo, tSo - tGo))), 540, hexGoT);
  const hexR = lerp(40, 62, EASE_IO(k(tGo, tSo - tGo)));
  const hit = sq(k(tPl, 480));
  const targetsVis = 1 - k(tTO, 220);
  const sockQ = EASE(k(tSo, 480));
  const aQ = back(k(tA, 760));
  const bQ = back(k(tB, 760));
  const aShown = Math.round(lerp(0, a.value, EASE(k(tA, tAE - tA - 40))));
  const bShown = Math.round(lerp(0, b.value, EASE(k(tB, 760))));
  const barsVis = 1 - k(tBO, 220);
  const FLOOR = 870, UNIT = 7.4;
  const hopQ = EASE_IO(k(tHop, 620));
  const STOP2 = S(560), STOP3 = S(1360), PY = 590;

  const days = [{ x: S(2460), t: "Oct 22", at: t3 }, { x: S(1960), t: "Oct 21", at: tR + 150 }, { x: S(1460), t: "Oct 20", at: tR + 520 }];

  return (
    <AbsoluteFill style={{ opacity: vis, ...P3 }}>
      {/* the flowing line, word by word, before the camera moves */}
      {ms < tFO + 240 ? (
        <div style={{ position: "absolute", left: 0, width: 1920, top: 340, textAlign: "center", opacity: 1 - k(tFO, 220) }}>
          {flow.rows.map((row, r) => (
            <div key={r} style={{ ...line(130, INK), marginBottom: 20 }}>
              {row.map((w) => {
                const a0 = at({ word: w.word }, from, from);
                return <span key={w.word} style={{ display: "inline-block", marginRight: 30, opacity: k(a0, 110), transform: `translateY(${lerp(26, 0, EASE(k(a0, 130)))}px)` }}>{w.text}</span>;
              })}
            </div>
          ))}
        </div>
      ) : null}

      {/* the rail: the camera rolls back along it */}
      {ms >= t3 && clearQ > 0 ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: clearQ, ...P3 }}>
          <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <line x1={S(400)} y1={150} x2={S(3000)} y2={150} stroke={INK} strokeWidth={8} />
            {[...days.map((d) => d.x), S(960)].map((x) => <line key={x} x1={x} y1={126} x2={x} y2={174} stroke={INK} strokeWidth={8} />)}
          </svg>
          {days.map((d) => {
            const q = back(k(d.at, 280));
            return <div key={d.t} style={{ ...line(84, INK), position: "absolute", left: d.x - 200, width: 400, top: 200, textAlign: "center", opacity: k(d.at, 80), transform: `${Z(lerp(420, 0, q))}` }}>{d.t}</div>;
          })}
          <div style={{ ...line(120, INK), position: "absolute", left: S(960) - 400, width: 800, top: 196, textAlign: "center", opacity: k(tD, 80), transform: `${Z(lerp(800, 0, back(k(tD, 300))))}` }}>{date.text}</div>
          {ms >= tW && ms < tP + 240 ? <div style={{ ...line(84, INK), position: "absolute", left: S(960) - 700, width: 1400, top: 410, textAlign: "center", opacity: k(tW, 110) * (1 - k(tP, 200)) }}>{win.text}</div> : null}
          {ms >= tP ? <Capsule x={S(960)} y={capY} w={250} color={INK} /> : null}
          {ms >= tUC ? <div style={{ ...line(70, GRAY), position: "absolute", left: S(960) - 500, width: 1000, top: 740, textAlign: "center", opacity: k(tUC, 120) }}>{uc.text}</div> : null}
        </div>
      ) : null}

      {/* the name: arrives under the capsule, then travels to its target */}
      {ms >= tN && targetsVis > 0 ? (
        <div style={{ position: "absolute", left: S(0), width: 1920, top: lerp(580, 372, flyQ), textAlign: "center", opacity: targetsVis, transformOrigin: "50% 0%", transform: `translateX(${lerp(0, 340, flyQ)}px) scale(${lerp(1, 60 / 120, flyQ)})`, ...P3 }}>
          <FlyWord text={name.text} t={tN} size={120} color={INK} shade="rgba(0,0,0,0.1)" stagger={26} dur={280} />
        </div>
      ) : null}

      {/* the two targets on one wall. The first is the §3 picture, seated at the same height */}
      {ms >= tGo && targetsVis > 0 ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: targetsVis * k(tGo, 200) }}>
          <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <line x1={S(-200)} y1={WALL_Y} x2={S(2200)} y2={WALL_Y} stroke={INK} strokeWidth={6} />
          </svg>
          <Receptor x={S(620)} y={540} r={86} color={INK} />
          <BeadRing x={S(620)} y={540} r={62} color={COLORS.accent} />
          <div style={{ ...line(60, INK), position: "absolute", left: S(620) - 300, width: 600, top: 372, textAlign: "center" }}>HCXT-2001</div>
          <div style={{ ...line(58, INK), position: "absolute", left: S(620) - 520, top: 690 }}>IL-23 receptor</div>
        </div>
      ) : null}
      {ms >= tSo && targetsVis > 0 ? (
        <div style={{ position: "absolute", left: 0, top: lerp(380, 0, sockQ), width: 1920, height: 1080, opacity: targetsVis * k(tSo, 100) }}>
          <HexSocket x={S(1300)} y={540} r={86} color={INK} />
        </div>
      ) : null}
      {ms >= tP && (ms < tTO + 220) ? (
        <div style={{ position: "absolute", left: 0, top: hit * 12, width: 1920, height: 1080, opacity: targetsVis * Math.min(1, k(tP, 60)) }}>
          <Hex x={hexX} y={ms < tGo ? capY : hexY} r={hexR} color={INK} />
        </div>
      ) : null}
      {ms >= tL && targetsVis > 0 ? (
        <div style={{ ...line(110, INK), position: "absolute", left: S(1300) + 130, top: 480, opacity: k(tL, 80) * targetsVis, transform: `${Z(lerp(600, 0, back(k(tL, 300))))}` }}>{label.text}</div>
      ) : null}

      {/* the bars: burst up from the floor under a low camera */}
      {ms >= tDo && barsVis > 0 ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: barsVis, ...P3 }}>
          <div style={{ position: "absolute", left: S(480), width: 960, top: FLOOR, height: 8, background: INK }} />
          {[{ x: S(560), q: aQ, v: a.value, c: COLORS.accent, shown: aShown, on: tA, s: a.suffix, lab: dose.text, labOn: tDo }, { x: S(1060), q: bQ, v: b.value, c: GRAY, shown: bShown, on: tB, s: b.suffix, lab: b.label, labOn: tB }].map((bar) => (
            <React.Fragment key={bar.lab}>
              <div style={{ position: "absolute", left: bar.x, width: 300, top: FLOOR - bar.v * UNIT * bar.q, height: Math.max(0, bar.v * UNIT * bar.q), background: bar.c, borderRadius: "10px 10px 0 0" }} />
              <div style={{ ...line(130, bar.c), position: "absolute", left: bar.x - 100, width: 500, textAlign: "center", top: FLOOR - bar.v * UNIT * bar.q - 142, fontVariantNumeric: "tabular-nums", opacity: k(bar.on, 90) }}>{bar.shown}{bar.s}</div>
              <div style={{ ...line(46, INK), position: "absolute", left: bar.x - 100, width: 500, textAlign: "center", top: FLOOR + 22, opacity: k(bar.labOn, 110) }}>{bar.lab}</div>
            </React.Fragment>
          ))}
          <div style={{ ...line(60, INK), position: "absolute", left: S(0), width: 1920, textAlign: "center", top: 76, opacity: k(tH, 120) }}>{header.text}</div>
        </div>
      ) : null}

      {/* Phase 3: planned, so the leg is dashed */}
      {ms >= tPla ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: k(tPla, 120), ...P3 }}>
          <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <line x1={STOP2} y1={PY} x2={STOP3} y2={PY} stroke={INK} strokeWidth={8} strokeDasharray="26 20" />
            <circle cx={STOP2} cy={PY} r={22} fill={INK} />
            <circle cx={STOP3} cy={PY} r={22} fill={COLORS.paper} stroke={INK} strokeWidth={8} />
          </svg>
          <div style={{ ...line(64, INK), position: "absolute", left: STOP2 - 200, width: 400, textAlign: "center", top: PY + 46 }}>Phase 2</div>
          <div style={{ ...line(64, INK), position: "absolute", left: STOP3 - 300, width: 600, textAlign: "center", top: PY + 46 }}>Phase 3</div>
          <div style={{ ...line(50, GRAY), position: "absolute", left: STOP3 - 400, width: 800, textAlign: "center", top: PY + 126 }}>{plans.text}</div>
          {/* the capsule hops: one arc, a squash on landing */}
          <div style={{ position: "absolute", left: lerp(STOP2, STOP3, hopQ) - S(960), top: PY - 62 - Math.sin(hopQ * Math.PI) * 260 - 470 + sq(k(tHop + 620, 420)) * 6, width: 1920, height: 1080 }}>
            <Capsule x={S(960)} y={470} w={170} color={INK} sw={8} />
            <Hex x={S(960)} y={470} r={27} color={INK} />
          </div>
          {ms >= tY ? <div style={{ ...line(190, COLORS.accent), position: "absolute", left: STOP3 - 400, width: 800, textAlign: "center", top: 200, opacity: k(tY, 80), transform: `${Z(lerp(800, 0, back(k(tY, 300))))}` }}>{year.text}</div> : null}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
