// ─────────────────────────────────────────────────────────────────────────
// KIT · numbers — THE NUMBERS + THE SIX-MONTH SPLIT. Added on the Merck × Moderna
// intismeran LONG-FORM, 2026-11-02 (HORIZONTAL 16:9, one white card across two sections).
// §5: a slab of risk loses a red slice that falls away as 42% counts, then the spine's two
// lines return and are drawn to their only reported values (82 / 70), then a 38% plate.
// §6: a plain line says what the next part is (a red "42%" plate slammed here read as random,
// Nel 2026-11-02); the camera dives onto the six months (0.99), trucks to the 58%, labelled as the
// pre-specified analysis it is; a dashed "?" for the split the release does not explain, a
// DASHED staircase for the reading (dashed = not a result), and a stamp that says so.
// Same stage coordinates as the hook (kit/split SPINE): one chart, three appearances.
// Absolute 1920×1080 seats; import by path. One mover per cue; a finished idea retires.
// ─────────────────────────────────────────────────────────────────────────

import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, DISPLAY, TRACK, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { useP3, useZ } from "./camera";
import { back, EASE, EASE_IO, fadeOut } from "./plusone";
import { FlyWord, SPINE, thud, TwoLines } from "./split";

const type = (size: number, color: string): React.CSSProperties => ({ fontFamily: DISPLAY, fontWeight: 700, fontSize: size, letterSpacing: TRACK.headline, lineHeight: 1.04, color });
const GREY = "#6b6b6b";

export const NUM_SEAT = {
  slab: { x: 180, y: 190, w: 560, h: 640, cut: 0.42 },
  fig: { x: 860 },
  plate38: { x: 770, y: 118, w: 800, h: 180 }, // clear of the "6 months" label (it ends ~x 665) and of the 82% label below
  hideLine: { x: 770, y: 120 },
  level: { x: 700, y: 130 }, // right of the tick, above the faded lines: under the dive it stays clear of the chrome band
  ring: 78, // small enough to leave air under the "6 months" label
  stairs: { x: 190, base: 850, w: 34, gap: 9.5, step: 20 },
};

export const NumbersSplit: React.FC<Win & {
  opener: ({ text: string } & Cued)[]; openerOut: Cued;
  median: { text: string } & Cued; combo: { text: string } & Cued; slab: { text: string } & Cued;
  fortyTwo: { value: number } & Cued; fortyTwoLabel: { text: string } & Cued; slabOut: Cued;
  chart: Cued; tick: { text: string };
  red: { value: string; label: string } & Cued; alive: { text: string } & Cued;
  white: { value: string } & Cued; whiteDraw: Cued; alone: { text: string } & Cued;
  note: { text: string };
  plate: { value: string; label: string } & Cued; plateFig: Cued; plateOut: Cued;
  hideLead: { text: string } & Cued; hideTail: { text: string } & Cued; hideWord: { text: string } & Cued; lift: Cued;
  dive: Cued; level: { text: string } & Cued; hazard: { text: string } & Cued; hr: { text: string } & Cued;
  from6: Cued; dosing: { text: string } & Cued; prespec: { text: string } & Cued; fiftyEight: { value: number } & Cued; reduction: { text: string } & Cued; sixOut: Cued;
  question: Cued; questionLabel: { text: string } & Cued;
  effect: Cued; builds: Cued;
  stamp1: { text: string } & Cued; stamp2: { text: string } & Cued;
}> = (p) => {
  const { from, to } = p;
  const ms = useMs();
  const k = useK();
  const Z = useZ();
  const P3 = useP3();
  const INK = COLORS.ink, RED = COLORS.accent, W = COLORS.paper;
  const S = SPINE, L = NUM_SEAT.slab;

  const tOO = at(p.openerOut, from + 900, from);
  const tMed = at(p.median, tOO + 500, from, tOO);
  const tCombo = at(p.combo, tMed + 2000, from, tMed);
  const tSlab = at(p.slab, tCombo + 800, from, tCombo);
  const t42 = at(p.fortyTwo, tSlab + 2000, from, tSlab);
  const t42L = at(p.fortyTwoLabel, t42, from, tSlab);
  const tSO = at(p.slabOut, t42 + 1000, from, t42);
  const tChart = at(p.chart, tSO + 500, from, tSO);
  const tRed = at(p.red, tChart + 1200, from, tChart);
  const tAlive = at(p.alive, tRed + 900, from, tRed);
  const tWD = at(p.whiteDraw, tAlive + 1800, from, tAlive);
  const tWh = at(p.white, tWD + 500, from, tWD);
  const tAl = at(p.alone, tWh + 900, from, tWh);
  const tPl = at(p.plate, tAl + 2000, from, tAl);
  const tPlF = at(p.plateFig, tPl + 2200, from, tPl);
  const tPlO = at(p.plateOut, tPlF + 800, from, tPlF);
  const tHL = at(p.hideLead, tPlO + 800, from, tPlO);
  const tHT = at(p.hideTail, tHL + 1000, from, tHL);
  const tHW = at(p.hideWord, tHT + 1000, from, tHT);
  const tLift = at(p.lift, tHW, from, tHT);
  const tDive = at(p.dive, tLift + 900, from, tLift);
  const tLvl = at(p.level, tDive + 2500, from, tDive);
  const tHaz = at(p.hazard, tLvl + 1100, from, tLvl);
  const tHR = at(p.hr, tHaz + 1100, from, tHaz);
  const t6 = at(p.from6, tHR + 1200, from, tHR);
  const tDos = at(p.dosing, t6 + 2000, from, t6);
  const tPre = at(p.prespec, tDos + 1300, from, tDos);
  const t58 = at(p.fiftyEight, tPre + 2300, from, tPre);
  const tRdn = at(p.reduction, t58 + 500, from, t58);
  const t6O = at(p.sixOut, tRdn + 500, from, tRdn);
  const tQ = at(p.question, t6O + 1500, from, t6O);
  const tQL = at(p.questionLabel, t6O + 500, from, t6O);
  const tEff = at(p.effect, tQ + 900, from, tQ);
  const tB = at(p.builds, tEff + 700, from, tEff);
  const tS1 = at(p.stamp1, tB + 4700, from, tB);
  const tS2 = at(p.stamp2, tS1 + 900, from, tS1);
  const vis = fadeOut(ms, to);
  if (ms < from - 40 || vis <= 0) return null;

  // ── the slab + its slice ──
  const slabQ = back(k(tSlab, 360));
  const soQ = k(tSO, 300);
  const fall = k(t42 + 360, 700);
  const sliceH = L.h * L.cut;
  const count42 = Math.round(1 + (p.fortyTwo.value - 1) * EASE_IO(k(t42, Math.max(400, tSO - t42 - 100))));

  // ── the chart ──
  const ribbonQ = k(tChart, 420);
  const redQ = EASE_IO(k(tChart + 420, Math.max(400, tRed - tChart - 440)));
  const whQ = EASE_IO(k(tWD, Math.max(300, tWh - tWD - 40)));
  const gapQ = EASE_IO(k(tWD, 900));
  const post = ms < tDive ? 1 : ms < t6 ? lerp(1, 0.14, k(tDive, 400)) : lerp(0.14, 1, k(t6, 500));
  const chartLabelsOut = ms >= tLift;

  const figure = (top: number, left: number, size: number, value: string, a: number, color: string) => (
    <div style={{ position: "absolute", left, top, ...type(size, color), letterSpacing: TRACK.display, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums", opacity: k(a, 80), transform: `${Z(lerp(800, 0, EASE(k(a, 280))))}` }}>{value}</div>
  );

  return (
    <AbsoluteFill style={{ opacity: vis, ...P3 }}>
      {/* ── "Now the numbers" flies out of the lens and on through it ── */}
      {ms < tOO + 340 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 430, display: "flex", justifyContent: "center", gap: 34, opacity: 1 - k(tOO, 280), transform: `${Z(lerp(0, 900, EASE_IO(k(tOO, 320))))}`, ...P3 }}>
          {p.opener.map((o) => <FlyWord key={o.text} text={o.text} t={at(o, from, from)} size={150} color={INK} shade="#c9c9c9" stagger={24} dur={260} />)}
        </div>
      ) : null}

      {/* ── the slab of risk: it loses a red slice as the figure counts ── */}
      {ms >= tMed - 40 && soQ < 1 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - soQ, ...(soQ === 0 ? P3 : {}) }}>
          <div style={{ position: "absolute", left: NUM_SEAT.fig.x, top: 190, ...type(46, GREY), whiteSpace: "nowrap", opacity: k(tMed, 120) }}>{p.median.text}</div>
          <div style={{ position: "absolute", left: NUM_SEAT.fig.x, top: 254, ...type(72, INK), whiteSpace: "nowrap", opacity: k(tCombo, 100), transform: `translateY(${lerp(22, 0, EASE(k(tCombo, 240)))}px)` }}>{p.combo.text}</div>
          {ms >= tSlab - 40 ? (
            <>
              <div style={{ position: "absolute", left: L.x, top: L.y + sliceH, width: L.w, height: L.h - sliceH, background: INK, borderRadius: "0 0 18px 18px", display: "flex", alignItems: "flex-end", padding: 36, boxSizing: "border-box",
                ...type(52, W), opacity: k(tSlab, 80), transformOrigin: "50% 100%", transform: `rotateX(${lerp(-80, 0, Math.min(1, slabQ))}deg)` }}>
                {p.slab.text}
              </div>
              <div style={{ position: "absolute", left: L.x, top: L.y, width: L.w, height: sliceH, borderRadius: "18px 18px 0 0", background: ms >= t42 ? RED : INK, opacity: k(tSlab, 80),
                transformOrigin: "50% 100%",
                transform: ms < t42 ? `rotateX(${lerp(-80, 0, Math.min(1, slabQ))}deg)` : `translate(${-fall * 240}px, ${fall * fall * 1100 - k(t42, 300) * 26}px) ${Z(fall * 300)}rotateZ(${-fall * 34}deg)` }} />
            </>
          ) : null}
          {ms >= t42 - 40 ? (
            <>
              <div style={{ position: "absolute", left: NUM_SEAT.fig.x - 10, top: 340, ...type(340, INK), letterSpacing: TRACK.display, lineHeight: 1, fontVariantNumeric: "tabular-nums", opacity: k(t42, 60), transform: `${Z(lerp(1100, 0, EASE(k(t42, 300))))}` }}>{count42}%</div>
              <div style={{ position: "absolute", left: NUM_SEAT.fig.x, top: 700, ...type(56, INK), whiteSpace: "nowrap", opacity: k(t42L, 120) }}>{p.fortyTwoLabel.text}</div>
            </>
          ) : null}
        </div>
      ) : null}

      {/* ── THE SPINE returns: same stage, same lines, the base line now ink ── */}
      {ms >= tChart - 40 ? (
        <div style={{ position: "absolute", inset: 0, ...P3 }}>
          <TwoLines ribbon={ribbonQ} split={redQ} splitBase={whQ} gap={gapQ} clipId="num-gap" base={INK} postOpacity={post} />
          <div style={{ position: "absolute", left: S.x6 - 1, top: 290, width: 3, height: 180, background: INK, opacity: k(tChart, 200) }} />
          <div style={{ position: "absolute", left: S.x6 - 200, width: 400, top: 232, textAlign: "center", ...type(44, INK), opacity: k(tChart, 200) }}>{p.tick.text}</div>
          {!chartLabelsOut ? (
            <>
              {figure(S.yRed - 166, S.x24 - 250, 120, p.red.value, tRed, RED)}
              <div style={{ position: "absolute", right: 1920 - S.x24, top: S.yRed - 216, ...type(40, GREY), whiteSpace: "nowrap", opacity: k(tAlive, 120) }}>{p.alive.text}</div>
              {figure(S.yWhite - 178, S.x24 - 250, 120, p.white.value, tWh, INK)}
              <div style={{ position: "absolute", right: 1920 - S.x24, top: S.yWhite + 24, ...type(40, INK), whiteSpace: "nowrap", opacity: k(tAl, 120) }}>{p.alone.text}</div>
              <div style={{ position: "absolute", left: S.x0, top: 884, ...type(26, GREY), whiteSpace: "nowrap", opacity: k(tChart, 300) }}>{p.note.text}</div>
            </>
          ) : null}

          {/* the 38% plate falls in over the empty upper chart, then retires */}
          {ms >= tPl - 40 && ms < tPlO + 320 ? (() => {
            const Pl = NUM_SEAT.plate38;
            return (
              <div style={{ position: "absolute", left: Pl.x, top: Pl.y, width: Pl.w, height: Pl.h, borderRadius: 22, background: INK, display: "flex", alignItems: "center", gap: 36, padding: "0 48px", boxSizing: "border-box",
                opacity: k(tPl, 80) * (1 - k(tPlO, 280)), transformOrigin: "50% 0%", transform: `${Z(lerp(500, 0, EASE(k(tPl, 300))))}rotateX(${lerp(70, 0, EASE(k(tPl, 300)))}deg)` }}>
                <div style={{ ...type(130, W), letterSpacing: TRACK.display, opacity: k(tPlF, 80), transform: `scale(${back(k(tPlF, 280))})`, whiteSpace: "nowrap" }}>{p.plate.value}</div>
                <div style={{ ...type(44, W) }}>{p.plate.label}</div>
              </div>
            );
          })() : null}

          {/* §6: a plain line, word-led; it retires as the camera dives */}
          {ms >= tHL - 40 && ms < tDive + 300 ? (
            <div style={{ position: "absolute", left: NUM_SEAT.hideLine.x, top: NUM_SEAT.hideLine.y, opacity: 1 - k(tDive, 260) }}>
              <div style={{ ...type(72, INK), whiteSpace: "nowrap", opacity: k(tHL, 100), transform: `translateY(${lerp(22, 0, EASE(k(tHL, 240)))}px)` }}>{p.hideLead.text}</div>
              <div style={{ display: "flex", gap: 20, marginTop: 6 }}>
                <div style={{ ...type(72, INK), whiteSpace: "nowrap", opacity: k(tHT, 100), transform: `translateY(${lerp(22, 0, EASE(k(tHT, 240)))}px)` }}>{p.hideTail.text}</div>
                <div style={{ ...type(72, RED), whiteSpace: "nowrap", opacity: k(tHW, 80), transform: `scale(${back(k(tHW, 260))})`, transformOrigin: "0% 100%" }}>{p.hideWord.text}</div>
              </div>
            </div>
          ) : null}

          {/* the first six months: level, 0.99 */}
          {ms >= tLvl - 40 && ms < t6 + 300 ? (
            <div style={{ position: "absolute", left: NUM_SEAT.level.x, top: NUM_SEAT.level.y, opacity: 1 - k(t6, 260) }}>
              <div style={{ ...type(46, INK), whiteSpace: "nowrap", opacity: k(tLvl, 100) }}>{p.level.text}</div>
              <div style={{ ...type(38, GREY), whiteSpace: "nowrap", marginTop: 16, opacity: k(tHaz, 100) }}>{p.hazard.text}</div>
              <div style={{ ...type(112, INK), letterSpacing: TRACK.display, opacity: k(tHR, 80), transform: `${Z(lerp(600, 0, EASE(k(tHR, 260))))}`, transformOrigin: "0% 50%" }}>{p.hr.text}</div>
            </div>
          ) : null}

          {/* from six months on: the 58%, with its label attached */}
          {ms >= tDos - 40 && ms < t6O + 320 ? (
            <div style={{ position: "absolute", left: 900, top: 150, display: "flex", alignItems: "center", gap: 36, opacity: 1 - k(t6O, 280), ...(ms < t6O ? P3 : {}) }}>
              {ms >= t58 - 40 ? <div style={{ ...type(220, RED), letterSpacing: TRACK.display, lineHeight: 1, opacity: k(t58, 60), transform: `${Z(lerp(1200, 0, EASE(k(t58, 300))))}` }}>{p.fiftyEight.value}%</div> : null}
              {/* a fixed column: on one line these three ran past the card's right edge */}
              <div style={{ width: 560 }}>
                <div style={{ ...type(40, GREY), opacity: k(tDos, 120) }}>{p.dosing.text}</div>
                <div style={{ ...type(44, INK), marginTop: 12, opacity: k(tPre, 120) }}>{p.prespec.text}</div>
                <div style={{ ...type(44, INK), marginTop: 12, opacity: k(tRdn, 120) }}>{p.reduction.text}</div>
              </div>
            </div>
          ) : null}

          {/* the split nobody has explained: a dashed ring, a "?" dropped into it */}
          {ms >= tQL - 40 && ms < tEff + 320 ? (
            <div style={{ position: "absolute", inset: 0, opacity: 1 - k(tEff, 280), ...(ms < tEff ? P3 : {}) }}>
              <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
                <circle cx={S.x6} cy={S.y6} r={NUM_SEAT.ring} fill={W} stroke={INK} strokeWidth={8} strokeDasharray="16 12" opacity={k(tQL, 200)} transform={`rotate(${lerp(-60, 0, EASE(k(tQL, 500)))} ${S.x6} ${S.y6})`} />
              </svg>
              <div style={{ position: "absolute", left: S.x6 - 100, width: 200, top: S.y6 - 57, textAlign: "center", ...type(110, RED), lineHeight: 1, opacity: k(tQ, 60), transform: `${Z(lerp(900, 0, EASE(k(tQ, 280))))}` }}>?</div>
              <div style={{ position: "absolute", left: S.x6 + 120, top: S.y6 - 150, ...type(64, INK), whiteSpace: "nowrap", opacity: k(tQL, 120) }}>{p.questionLabel.text}</div>
            </div>
          ) : null}

          {/* the reading: a DASHED staircase rises under the first months as the doses are named */}
          {ms >= tB - 40 ? (
            <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
              {Array.from({ length: 9 }, (_, i) => {
                const St = NUM_SEAT.stairs;
                const h = (i + 1) * St.step;
                const q = back(k(tB + i * 70, 240));
                return <rect key={i} x={St.x + i * (St.w + St.gap)} y={St.base - h * q} width={St.w} height={Math.max(0, h * q)} fill="none" stroke={INK} strokeWidth={4} strokeDasharray="9 7" opacity={k(tB + i * 70, 60)} />;
              })}
            </svg>
          ) : null}

          {/* the chart steps back behind the stamp */}
          {ms >= tS1 - 40 ? <div style={{ position: "absolute", inset: -400, background: W, opacity: 0.75 * k(tS1, 220), transform: `${Z(20)}` }} /> : null}

          {/* the stamp: both halves, one plate; it says what the frame is */}
          {ms >= tS1 - 40 ? (() => {
            const q = EASE(k(tS1, 220));
            const dip = thud(k(tS1 + 220, 420));
            return (
              <div style={{ position: "absolute", left: 0, right: 0, top: 410, display: "flex", justifyContent: "center", ...P3 }}>
                <div style={{ padding: "44px 76px", borderRadius: 24, background: RED, display: "flex", gap: 30, ...type(112, W), whiteSpace: "nowrap", opacity: k(tS1, 50),
                  transform: `${Z(lerp(1400, 40, q))}scale(${1 - dip * 0.05})` }}>
                  <span>{p.stamp1.text}</span>
                  <span style={{ opacity: k(tS2, 80), transform: `translateY(${lerp(30, 0, EASE(k(tS2, 220)))}px)` }}>{p.stamp2.text}</span>
                </div>
              </div>
            );
          })() : null}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
