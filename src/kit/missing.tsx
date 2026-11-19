// ─────────────────────────────────────────────────────────────────────────
// KIT · missing — WHAT IS STILL MISSING. Added on the Merck × Moderna intismeran LONG-FORM,
// 2026-11-02 (HORIZONTAL 16:9, ink). Three pages, each retiring before the next.
// Survival: a dashed slot reads "Not mature", then FLIPS over in 3D to "No numbers".
// Safety: two columns at true proportion rise out of a floor as their figures are voiced.
// Filing: a blank dashed page swings in; a dashed line runs to a solid "Regulators" tile.
// Grammar: dashed = does not exist yet; solid = reported. Nothing here is tilted at rest.
// Absolute 1920×1080 seats; import by path. One mover per cue; a finished idea retires.
// ─────────────────────────────────────────────────────────────────────────

import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, DISPLAY, INK_SUB, TRACK, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { useP3, useZ } from "./camera";
import { back, EASE, EASE_IO, fadeOut, FlipFaces } from "./plusone";
import { FlyWord, thud } from "./split";

const type = (size: number, color: string): React.CSSProperties => ({ fontFamily: DISPLAY, fontWeight: 700, fontSize: size, letterSpacing: TRACK.headline, lineHeight: 1.04, color });

export const MISS_SEAT = {
  slot: { x: 410, y: 340, w: 1100, h: 240 },
  cols: { floor: 860, perPct: 40, w: 300, xRed: 560, xWhite: 1060 },
  page: { x: 180, y: 230, w: 400, h: 560 },
  tile: { x: 1320, y: 470, w: 420, h: 170 },
};

export const StillMissing: React.FC<Win & {
  opener: ({ text: string } & Cued)[]; openerOut: Cued;
  os: { text: string } & Cued; notMature: { text: string } & Cued; trend: { text: string } & Cued; noNumbers: { text: string } & Cued; osOut: Cued;
  safety: { text: string } & Cued; floor: Cued; red: { value: number; label: string } & Cued; redEnd: Cued; white: { value: number; label: string } & Cued; whiteEnd: Cued; safetyOut: Cued;
  page: Cued; filing: { text: string } & Cued; companies: { text: string } & Cued; tile: { text: string } & Cued; arrives: Cued;
}> = (p) => {
  const { from, to } = p;
  const ms = useMs();
  const k = useK();
  const Z = useZ();
  const P3 = useP3();
  const W = COLORS.paper, RED = COLORS.accent;
  const S = MISS_SEAT.slot, C = MISS_SEAT.cols, Pg = MISS_SEAT.page, T = MISS_SEAT.tile;

  const tOO = at(p.openerOut, from + 1300, from);
  const tOS = at(p.os, tOO + 500, from, tOO);
  const tNM = at(p.notMature, tOS + 1300, from, tOS);
  const tTr = at(p.trend, tNM + 1000, from, tNM);
  const tNN = at(p.noNumbers, tTr + 2000, from, tTr);
  const tOSO = at(p.osOut, tNN + 800, from, tNN);
  const tSaf = at(p.safety, tOSO + 300, from, tOSO);
  const tFl = at(p.floor, tSaf + 2000, from, tSaf);
  const tR = at(p.red, tFl + 1500, from, tFl);
  const tRE = at(p.redEnd, tR + 900, from, tR);
  const tW = at(p.white, tRE + 400, from, tR);
  const tWE = at(p.whiteEnd, tW + 1000, from, tW);
  const tSO = at(p.safetyOut, tWE + 100, from, tW);
  const tPg = at(p.page, tSO + 400, from, tSO);
  const tFi = at(p.filing, tPg, from, tSO);
  const tCo = at(p.companies, tFi + 1800, from, tFi);
  const tTi = at(p.tile, tCo + 1500, from, tCo);
  const tAr = at(p.arrives, tTi + 800, from, tTi);
  const vis = fadeOut(ms, to);
  if (ms < from - 40 || vis <= 0) return null;

  const slotFace = (text: string, color: string) => (
    <div style={{ position: "absolute", inset: 0, borderRadius: 26, border: `6px dashed ${W}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", ...type(116, color), whiteSpace: "nowrap" }}>{text}</div>
  );

  // the columns count while voiced and rise with their count
  const rQ = EASE_IO(k(tR, Math.max(400, tRE - tR - 60)));
  const wQ = EASE_IO(k(tW, Math.max(400, tWE - tW - 60)));
  const col = (x: number, q: number, value: number, label: string, color: string, a: number) => {
    const h = value * C.perPct * q;
    return (
      <div key={label} style={{ position: "absolute", inset: 0, ...P3 }}>
        <div style={{ position: "absolute", left: x, top: C.floor - h, width: C.w, height: h, background: color, borderRadius: "14px 14px 0 0", opacity: k(a, 60) }} />
        <div style={{ position: "absolute", left: x - 60, width: C.w + 120, top: C.floor - h - 112, textAlign: "center", ...type(100, W), letterSpacing: TRACK.display, fontVariantNumeric: "tabular-nums", opacity: k(a, 80) }}>{(value * q).toFixed(1)}%</div>
        <div style={{ position: "absolute", left: x - 120, width: C.w + 240, top: C.floor + 18, textAlign: "center", ...type(40, W), whiteSpace: "nowrap", opacity: k(a, 120) }}>{label}</div>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ opacity: vis, ...P3 }}>
      {/* ── the question flies out of the lens and on through it ── */}
      {ms < tOO + 340 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 430, display: "flex", justifyContent: "center", gap: 30, opacity: 1 - k(tOO, 280), transform: `${Z(lerp(0, 900, EASE_IO(k(tOO, 320))))}`, ...P3 }}>
          {p.opener.map((o) => <FlyWord key={o.text} text={o.text} t={at(o, from, from)} size={132} color={W} shade="#6b6b6b" stagger={24} dur={260} />)}
        </div>
      ) : null}

      {/* ── survival: the slot flips from "Not mature" to "No numbers" ── */}
      {ms >= tOS - 40 && ms < tOSO + 300 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - k(tOSO, 260), ...(ms < tOSO ? P3 : {}) }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", ...type(120, W), opacity: k(tOS, 100), transform: `translateY(${lerp(30, 0, EASE(k(tOS, 260)))}px)` }}>{p.os.text}</div>
          <div style={{ position: "absolute", left: S.x, top: S.y, width: S.w, height: S.h, opacity: k(tOS + 120, 120), ...P3 }}>
            <FlipFaces flip={EASE_IO(k(tNN, 420))}
              front={ms >= tNM ? slotFace(p.notMature.text, W) : slotFace("", W)}
              back={slotFace(p.noNumbers.text, RED)} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: S.y + S.h + 56, textAlign: "center", ...type(58, INK_SUB), opacity: k(tTr, 120) }}>{p.trend.text}</div>
        </div>
      ) : null}

      {/* ── safety: two columns, the true proportion, one floor ── */}
      {ms >= tSaf - 40 && ms < tSO + 300 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - k(tSO, 260), ...(ms < tSO ? P3 : {}) }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 84, textAlign: "center", ...type(56, W), whiteSpace: "nowrap", opacity: k(tSaf, 120) }}>{p.safety.text}</div>
          <div style={{ position: "absolute", left: 300, width: 1320, top: C.floor, height: 5, background: W, transformOrigin: "50% 50%", transform: `scaleX(${EASE_IO(k(tFl, 520))})` }} />
          {ms >= tR - 40 ? col(C.xRed, rQ, p.red.value, p.red.label, RED, tR) : null}
          {ms >= tW - 40 ? col(C.xWhite, wQ, p.white.value, p.white.label, W, tW) : null}
        </div>
      ) : null}

      {/* ── filing: a blank dashed page swings in; a dashed line runs to a solid tile ── */}
      {ms >= tPg - 40 ? (
        <div style={{ position: "absolute", inset: 0, ...P3 }}>
          <div style={{ position: "absolute", left: Pg.x, top: Pg.y, width: Pg.w, height: Pg.h, borderRadius: 18, border: `6px dashed ${W}`, boxSizing: "border-box", opacity: k(tPg, 80),
            transformOrigin: "0% 50%", transform: `${Z(lerp(600, 0, EASE(k(tPg, 420))))}rotateY(${lerp(-82, 0, back(k(tPg, 420)))}deg)` }} />
          <div style={{ position: "absolute", left: 680, top: 230, ...type(96, W), whiteSpace: "nowrap", opacity: k(tFi, 100), transform: `translateY(${lerp(28, 0, EASE(k(tFi, 260)))}px)` }}>{p.filing.text}</div>
          <div style={{ position: "absolute", left: 680, top: 352, ...type(46, INK_SUB), whiteSpace: "nowrap", opacity: k(tCo, 120) }}>{p.companies.text}</div>
          <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <defs><clipPath id="filing-line"><rect x={600} y={T.y} width={(T.x - 620) * EASE_IO(k(tTi, Math.max(300, tAr - tTi)))} height={T.h} /></clipPath></defs>
            <line x1={600} y1={T.y + T.h / 2} x2={T.x - 22} y2={T.y + T.h / 2} stroke={W} strokeWidth={8} strokeDasharray="26 20" clipPath="url(#filing-line)" />
          </svg>
          {ms >= tTi - 40 ? (
            <div style={{ position: "absolute", left: T.x, top: T.y + thud(k(tTi + 300, 460)) * 10, width: T.w, height: T.h, borderRadius: 20, background: W, display: "flex", alignItems: "center", justifyContent: "center", ...type(68, COLORS.ink), opacity: k(tTi, 70),
              transform: `${Z(lerp(1000, 0, EASE(k(tTi, 300))))}` }}>{p.tile.text}</div>
          ) : null}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
