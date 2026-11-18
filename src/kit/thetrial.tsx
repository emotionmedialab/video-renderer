// ─────────────────────────────────────────────────────────────────────────
// KIT · thetrial — 1,137 PATIENTS, ONE FIELD. Added on the Merck × Moderna intismeran
// LONG-FORM, 2026-11-02 (HORIZONTAL 16:9, ink). The trial's name assembles and flies on
// through the lens; the figure counts and BURSTS its dots into a field; the field lights
// red on "melanoma" and a blade clears it on "removed"; the dots shuffle into two blocks
// at the true 2:1 ratio; then the dosing schedule as the release gives it: intismeran up to
// nine doses every three weeks, Keytruda up to nine cycles every six, about a year in all.
// Absolute 1920×1080 seats; import by path. One mover per cue; a finished idea retires.
// ─────────────────────────────────────────────────────────────────────────

import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, DISPLAY, INK_SUB, TRACK, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { useP3, useZ } from "./camera";
import { back, EASE, EASE_IO, fadeOut, hump } from "./plusone";
import { FlyWord, thud } from "./split";

const rnd = (i: number) => { const x = Math.sin(i * 78.233 + 1.7) * 43758.5453; return x - Math.floor(x); };

export const TRIAL_SEAT = {
  origin: { x: 370, y: 300 },
  field: { x: 900, y: 200, cols: 44, pitch: 20 },
  left: { x: 170, y: 250, cols: 38, pitch: 20 },
  right: { x: 1220, y: 250, cols: 19, pitch: 20 },
  rail: { x: 320, week: 26, red: 360, white: 590, pill: { w: 40, h: 76 } },
};
const N = 1137, N_LEFT = 758;
const T = TRIAL_SEAT;
// which block each dot goes to: a fixed shuffle
const ORDER = Array.from({ length: N }, (_, i) => i).sort((a, b) => rnd(a) - rnd(b));
const SLOT = new Array<number>(N);
ORDER.forEach((dot, rank) => { SLOT[dot] = rank; });

const line = (size: number, color: string): React.CSSProperties => ({ fontFamily: DISPLAY, fontWeight: 700, fontSize: size, letterSpacing: TRACK.headline, lineHeight: 1, color, whiteSpace: "nowrap" });

export const TheTrial: React.FC<Win & {
  kicker: { text: string } & Cued; name: ({ text: string } & Cued)[]; nameOut: Cued;
  count: { value: number } & Cued; countEnd: Cued; countLabel: { text: string };
  melanoma: { text: string } & Cued; removed: { text: string } & Cued; blade: Cued;
  split: Cued; ratio: { left: string; right: string } & Cued; blind: { text: string } & Cued;
  against: { left: string; right: string } & Cued; rightWord: Cued; armsOut: Cued;
  head: { text: string } & Cued; rowRed: { text: string; n: number; every: number } & Cued; rowWhite: { text: string; n: number; every: number } & Cued; year: { text: string } & Cued;
}> = ({ from, to, kicker, name, nameOut, count, countEnd, countLabel, melanoma, removed, blade, split, ratio, blind, against, rightWord, armsOut, head, rowRed, rowWhite, year }) => {
  const ms = useMs();
  const k = useK();
  const Z = useZ();
  const P3 = useP3();
  const W = COLORS.paper, RED = COLORS.accent;

  const tK = at(kicker, from, from);
  const tNO = at(nameOut, tK + 3000, from, tK);
  const tN = at(count, tNO + 400, from, tNO);
  const tNE = at(countEnd, tN + 1500, from, tN);
  const tMel = at(melanoma, tNE + 500, from, tNE);
  const tBlade = at(blade, tMel + 2500, from, tMel);
  const tRem = at(removed, tBlade, from, tMel);
  const tSplit = at(split, tBlade + 1400, from, tBlade);
  const tRat = at(ratio, tSplit + 800, from, tSplit);
  const tBlind = at(blind, tRat + 800, from, tRat);
  const tAg = at(against, tBlind + 500, from, tBlind);
  const tRW = at(rightWord, tAg + 500, from, tAg);
  const tAO = at(armsOut, tRW + 1400, from, tRW);
  const tH = at(head, tAO + 500, from, tAO);
  const tR = at(rowRed, tH + 300, from, tH);
  const tW = at(rowWhite, tR + 800, from, tR);
  const tY = at(year, tW + 500, from, tW);
  const vis = fadeOut(ms, to);
  if (ms < tK - 40 || vis <= 0) return null;

  const dCount = Math.max(500, tNE - tN - 100);
  const countQ = k(tN, dCount);
  const armsQ = k(tAO, 280);
  const nOut = k(tNO, 320);
  const leftOut = k(tSplit, 260);

  return (
    <AbsoluteFill style={{ opacity: vis, ...P3 }}>
      {/* ── the name assembles, then flies on through the lens ── */}
      {nOut < 1 ? (
        <div style={{ position: "absolute", left: 180, top: 340, opacity: 1 - nOut, transform: `${Z(lerp(0, 1000, EASE_IO(nOut)))}`, ...P3 }}>
          <div style={{ ...line(84, INK_SUB), marginBottom: 28, opacity: k(tK, 100), transform: `translateY(${lerp(24, 0, EASE(k(tK, 260)))}px)` }}>{kicker.text}</div>
          <div style={{ display: "flex", gap: 44, ...P3 }}>
            {name.map((n) => <FlyWord key={n.text} text={n.text} t={at(n, tK + 1500, from, tK)} size={180} color={W} shade="#6b6b6b" stagger={38} dur={320} />)}
          </div>
        </div>
      ) : null}

      {/* ── the figure: the source the dots burst out of ── */}
      {ms >= tN - 40 && leftOut < 1 ? (
        <div style={{ position: "absolute", left: 130, top: 210, opacity: 1 - leftOut }}>
          <div style={{ ...line(190, W), letterSpacing: TRACK.display, fontVariantNumeric: "tabular-nums", transform: `scale(${1 + (1 - countQ) * 0.12})`, transformOrigin: "0% 50%" }}>
            {Math.round(1 + (count.value - 1) * countQ).toLocaleString("en-US")}
          </div>
          <div style={{ ...line(72, W), marginTop: 14, opacity: k(tNE, 100) }}>{countLabel.text}</div>
          <div style={{ ...line(56, INK_SUB), marginTop: 64, opacity: k(tMel, 120), transform: `translateY(${lerp(20, 0, EASE(k(tMel, 240)))}px)` }}>{melanoma.text}</div>
          <div style={{ ...line(56, W), marginTop: 20, opacity: k(tRem, 120), transform: `translateY(${lerp(20, 0, EASE(k(tRem, 240)))}px)` }}>{removed.text}</div>
        </div>
      ) : null}

      {/* ── the dots: one SVG, recomputed per frame ── */}
      {ms >= tN - 40 && armsQ < 1 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: 1 - armsQ }}>
          {Array.from({ length: N }, (_, i) => {
            const F = T.field;
            const fx = F.x + (i % F.cols) * F.pitch, fy = F.y + Math.floor(i / F.cols) * F.pitch;
            const born = tN + (i / N) * dCount;
            const q = EASE(k(born, 340));
            if (ms < born) return null;
            const rank = SLOT[i];
            const toLeft = rank < N_LEFT;
            const G = toLeft ? T.left : T.right;
            const slot = toLeft ? rank : rank - N_LEFT;
            const gx = G.x + (slot % G.cols) * G.pitch, gy = G.y + Math.floor(slot / G.cols) * G.pitch;
            const s = EASE_IO(k(tSplit + rnd(i) * 320, 620));
            const x = lerp(lerp(T.origin.x, fx, q), gx, s);
            const y = lerp(lerp(T.origin.y, fy, q), gy, s) - hump(s) * (toLeft ? 150 : 90) * rnd(i + 9);
            const xFrac = (fx - F.x) / (F.cols * F.pitch);
            const bladeAt = tBlade + xFrac * 620;
            const red = (ms >= tMel + xFrac * 420 && ms < bladeAt) || (toLeft && ms >= tAg + rnd(i) * 300);
            return <circle key={i} cx={x} cy={y} r={ms >= bladeAt && ms < tSplit ? 5 : 7} fill={red ? RED : W} opacity={lerp(0.2, 1, q)} />;
          })}
        </svg>
      ) : null}

      {/* the blade: only on screen while it moves */}
      {ms >= tBlade && ms < tBlade + 620 ? (
        <div style={{ position: "absolute", left: lerp(T.field.x - 10, T.field.x + T.field.cols * T.field.pitch, k(tBlade, 620)), top: T.field.y - 40, width: 7, height: 610, background: W }} />
      ) : null}

      {/* ── the ratio + the blind: each retires when the arms are named ── */}
      {ms >= tRat - 40 && ms < tAg + 300 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - k(tAg, 260) }}>
          <div style={{ position: "absolute", left: T.left.x, top: 92, ...line(130, W), opacity: k(tRat, 90), transform: `scale(${back(k(tRat, 300))})`, transformOrigin: "0% 100%" }}>{ratio.left}</div>
          <div style={{ position: "absolute", left: T.right.x, top: 92, ...line(130, W), opacity: k(tRat, 90), transform: `scale(${back(k(tRat, 300))})`, transformOrigin: "0% 100%" }}>{ratio.right}</div>
        </div>
      ) : null}
      {ms >= tBlind - 40 && ms < tAg + 300 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 740, display: "flex", justifyContent: "center", opacity: 1 - k(tAg, 260) }}>
          <div style={{ padding: "24px 56px", borderRadius: 18, background: W, ...line(72, COLORS.ink), opacity: k(tBlind, 80), transformOrigin: "50% 100%", transform: `rotateX(${lerp(-85, 0, EASE(k(tBlind, 260)))}deg)` }}>{blind.text}</div>
        </div>
      ) : null}
      {ms >= tAg - 40 && armsQ < 1 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - armsQ }}>
          <div style={{ position: "absolute", left: T.left.x, top: 690, ...line(64, W), opacity: k(tAg, 120), transform: `translateY(${lerp(24, 0, EASE(k(tAg, 260)))}px)` }}>{against.left}</div>
          <div style={{ position: "absolute", left: T.right.x, top: 690, ...line(64, W), opacity: k(tRW, 120), transform: `translateY(${lerp(24, 0, EASE(k(tRW, 260)))}px)` }}>{against.right}</div>
        </div>
      ) : null}

      {/* ── the schedule: pills fall out of the lens onto two rails ── */}
      {ms >= tH - 40 ? (
        <div style={{ position: "absolute", inset: 0, ...P3 }}>
          <div style={{ position: "absolute", left: T.rail.x, top: 120, ...line(96, W), opacity: k(tH, 100), transform: `translateY(${lerp(26, 0, EASE(k(tH, 260)))}px)` }}>{head.text}</div>
          {[{ row: rowRed, t: tR, y: T.rail.red, color: RED }, { row: rowWhite, t: tW, y: T.rail.white, color: W }].map(({ row, t, y, color }) => {
            const P = T.rail.pill;
            const span = (row.n - 1) * row.every * T.rail.week + P.w;
            return (
              <div key={row.text} style={{ position: "absolute", inset: 0, ...P3 }}>
                <div style={{ position: "absolute", left: T.rail.x, top: y - 66, ...line(46, W), opacity: k(t, 100) }}>{row.text}</div>
                <div style={{ position: "absolute", left: T.rail.x, top: y + P.h, width: span, height: 4, background: color, transformOrigin: "0% 50%", transform: `scaleX(${EASE_IO(k(t, 560))})` }} />
                {Array.from({ length: row.n }, (_, i) => {
                  const a = t + i * 58;
                  const q = EASE(k(a, 240));
                  const dip = thud(k(a + 240, 360));
                  return <div key={i} style={{ position: "absolute", left: T.rail.x + i * row.every * T.rail.week, top: y + dip * 8, width: P.w, height: P.h, borderRadius: 10, background: color, opacity: k(a, 60),
                    transform: `${Z(lerp(900, 0, q))}rotateX(${lerp(-60, 0, q)}deg)` }} />;
                })}
              </div>
            );
          })}
          {/* the year: one bracket under both rails, stamped on its word */}
          {ms >= tY - 40 ? (() => {
            const w = 8 * rowWhite.every * T.rail.week + T.rail.pill.w;
            return (
              <div style={{ position: "absolute", left: T.rail.x, top: T.rail.white + 112, width: w, opacity: k(tY, 80), transform: `scaleX(${lerp(1.12, 1, EASE(k(tY, 240)))})`, transformOrigin: "50% 50%" }}>
                <div style={{ height: 22, borderLeft: `6px solid ${W}`, borderRight: `6px solid ${W}`, borderBottom: `6px solid ${W}` }} />
                <div style={{ ...line(72, W), textAlign: "center", marginTop: 22 }}>{year.text}</div>
              </div>
            );
          })() : null}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
