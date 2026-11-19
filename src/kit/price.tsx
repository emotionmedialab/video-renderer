// ─────────────────────────────────────────────────────────────────────────
// KIT · price — §6 "THE PRICE HAS MOVED" of the Roche × Hansoh HORIZONTAL long-form,
// 2026-10-24 (absolute 1920x1080 seats; white card). Motion law as ./hansoh: one
// designed mover per cue, landed things go still, nothing loops. No camera move in
// this scene: the copies' flight carries it (Nel: no camera "for its own sake").
//
// `PriceMoved`: the kicker rises; the 2025 card (a SOLID dark plate: everything about
//   it was disclosed) drops in and its rows fill on cue (HS-20110, CDH17, Phase 1);
//   an $80M bar drops under it, to scale; on "This time" the 2026 tray (./tray, dark
//   tone, dashed targets) slides in on the right; on "five times" the $80M bar COPIES
//   ITSELF five times, each copy arcing across through the depth into a row under
//   the tray ($400M = 5 x $80M, to the same scale); "5×" is the one red; two caption
//   lines say why the comparison is not like-for-like ("earlier", "+ Roche-proposed
//   targets"). On "It was also" the stage sweeps clear and a ONE-WEEK STRIP flips in
//   (Oct 13 → 19); Hansoh is pinned on the 19th, Rona on the 13th.
// Limits: the 2025 deal shows its UPFRONT only (no milestone total: Hansoh's 2025
// release gives none); "five times" is upfront to upfront (400 / 80).
// ─────────────────────────────────────────────────────────────────────────

import React from "react";
import { Easing, interpolate } from "remotion";
import { CLAMP, clamp01, COLORS, inkA, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { big, CandidateCard, label } from "./rona";
import { Letters } from "./hunt";
import { useP3, useZ } from "./camera";
import { Tray, TRAY, type TrayState } from "./tray";

const EASE = Easing.out(Easing.cubic);
const EASE_IN = Easing.in(Easing.quad);
const EASE_IO = Easing.inOut(Easing.cubic);
const BACK = Easing.out(Easing.back(1.6));

export const PRICE = {
  kicker: { x: 140, top: 92, size: 64 },
  card: { x: 140, y: 230, w: 640 },
  pxPerM: 1.5, // $80M = 120px, $400M = 600px
  bar: { top: 680, h: 80 },
  tray: { x: 1000, top: 250, sc: 0.42 },
  week: { x0: 258, top: 470, cell: 180, gap: 24 },
};

export const PriceMoved: React.FC<Win & {
  kicker: { text: string } & Cued;
  card: { title: string } & Cued; // "October 2025": the card drops
  rows: ({ label: string; value: string } & Cued)[]; // each value slams in on its word
  bar2025: { value: number; label: string } & Cued; // "$80"
  now: { header: string } & Cued; // "This time": the 2026 tray slides in
  copies: Cued; // "five times": the bar copies itself x5
  times: { text: string; label: string } & Cued; // "larger": "5×"
  why: ({ text: string } & Cued)[]; // the two caption lines
  clear: Cued; // "It was also": the stage sweeps clear
  week: { header: string; month: string; days: number[] } & Cued; // "second license": header + strip
  pins: ({ day: number; name: string } & Cued)[];
  trayState: { slabText: string; stageText: string; proposedText: [string, string] };
}> = ({ from, to, kicker, card, rows, bar2025, now, copies, times, why, clear, week, pins, trayState }) => {
  const ms = useMs();
  const k = useK();
  const Z = useZ();
  const P3 = useP3();
  const INK = COLORS.ink;
  const P = PRICE;
  const tK = at(kicker, from + 100, from);
  const tCard = at(card, tK + 1700, from, tK + 300);
  const tRows = rows.map((r, i) => at(r, tCard + 1500 + i * 2500, from, tCard + 300));
  const tBar = at(bar2025, tRows[tRows.length - 1] + 2000, from);
  const tNow = at(now, tBar + 1300, from, tBar + 300);
  const tCp = at(copies, tNow + 1700, from, tNow + 300);
  const copyEnd = tCp + 4 * 110 + 520;
  const tX = Math.max(at(times, tCp + 600, from, tCp + 200), copyEnd - 100);
  const tWhy = why.map((w, i) => at(w, tX + 700 + i * 700, from, tX + 200));
  const tCl = at(clear, tWhy[tWhy.length - 1] + 1800, from);
  const tWk = at(week, tCl + 1200, from, tCl + 300);
  const tPins = pins.map((p, i) => at(p, tWk + 1200 + i * 700, from, tWk + 300));
  const vis = clamp01(interpolate(ms, [from - 100, from + 150, to - 250, to], [0, 1, 1, 0], CLAMP));
  if (vis <= 0) return null;

  const cleared = ms >= tCl;
  const sweep = (i: number) => {
    const f = EASE_IN(clamp01((ms - (tCl + i * 45)) / 420));
    return { transform: `translateX(${-f * 1700}px)`, opacity: 1 - clamp01((f - 0.7) / 0.3) };
  };
  const kq = k(tK, 400) * (1 - k(tNow, 300));
  const cq = clamp01((ms - tCard) / 520);
  const w80 = bar2025.value * P.pxPerM;
  const bq = clamp01((ms - tBar) / 520);
  const nq = EASE(clamp01((ms - tNow) / 650));
  const xq = clamp01((ms - tX) / 420);
  const tray: TrayState = { solid: [1, 1], stage: 1, dashed: [1, 1, 1], proposed: 1, slab: 1, slabLabel: 1 };

  return (
    <div style={{ position: "absolute", inset: 0, opacity: vis, ...P3 }}>
      {kq > 0 ? (
        <div style={{ position: "absolute", left: P.kicker.x, top: P.kicker.top, opacity: kq }}>
          <Letters text={kicker.text} t={tK} mode="rise" stagger={24} style={{ ...big(INK, P.kicker.size) }} />
        </div>
      ) : null}

      {/* ── 2025: the solid card + its $80M bar ── */}
      <div style={{ position: "absolute", inset: 0, ...P3, ...(cleared ? sweep(0) : {}) }}>
        {cq > 0 ? (
          <div style={{ position: "absolute", inset: 0, transform: Z(lerp(600, 0, EASE(cq))) || undefined }}>
            <CandidateCard x={P.card.x} y={P.card.y} w={P.card.w} tone="dark" title={card.title} q={cq} titleSize={50}
              rows={rows.map((r, i) => ({ label: r.label, value: ms >= tRows[i] ? r.value : undefined, q: clamp01((ms - tCard - 200 - i * 120) / 400) }))} />
          </div>
        ) : null}
        {bq > 0 ? (
          <div style={{ position: "absolute", left: P.card.x, top: P.bar.top, display: "flex", alignItems: "center", gap: 30 }}>
            <div style={{ width: w80, height: P.bar.h, borderRadius: 8, background: INK, transform: `translateY(${(1 - BACK(bq)) * -260}px)`, opacity: clamp01(bq * 4) }} />
            <div style={{ opacity: clamp01(bq * 3) }}>
              <div style={{ ...big(INK, 64) }}>${bar2025.value}M</div>
              <div style={{ ...label(COLORS.grayText, 32), marginTop: 6 }}>{bar2025.label}</div>
            </div>
          </div>
        ) : null}
      </div>

      {/* ── 2026: the tray slides in on the right; the five copies land under it ── */}
      <div style={{ position: "absolute", inset: 0, ...P3, ...(cleared ? sweep(1) : {}) }}>
        {nq > 0 ? (
          <>
            <div style={{ position: "absolute", left: P.tray.x, top: P.tray.top - 70, ...big(INK, 50), opacity: clamp01(nq * 3), transform: `translateX(${(1 - nq) * 500}px)` }}>{now.header}</div>
            <div style={{ position: "absolute", inset: 0, opacity: clamp01(nq * 3), transformOrigin: `${TRAY.x}px ${TRAY.top}px`,
              transform: `translate(${P.tray.x - TRAY.x + (1 - nq) * 500}px, ${P.tray.top - TRAY.top}px) scale(${P.tray.sc})` }}>
              <Tray s={tray} tone="dark" {...trayState} />
            </div>
          </>
        ) : null}
        {/* the two lines that say this is not like-for-like */}
        <div style={{ position: "absolute", left: P.tray.x, top: 470, display: "flex", flexDirection: "column", gap: 10 }}>
          {why.map((w, i) => {
            const q = k(tWhy[i], 360);
            return <div key={i} style={{ ...big(i === 0 ? INK : COLORS.grayText, i === 0 ? 46 : 40), opacity: q, transform: `translateY(${(1 - EASE(q)) * 16}px)` }}>{w.text}</div>;
          })}
        </div>
        {/* five copies of the $80M bar: each arcs from the 2025 bar, through the depth, into the 2026 row */}
        {[0, 1, 2, 3, 4].map((i) => {
          const q = clamp01((ms - (tCp + i * 110)) / 520);
          if (q <= 0) return null;
          const e = EASE_IO(q);
          const x = lerp(P.card.x, P.tray.x + i * w80, e);
          const y = P.bar.top - Math.sin(e * Math.PI) * 220;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, width: w80 - 4, height: P.bar.h, borderRadius: 8, background: INK,
              transform: `${Z(Math.sin(e * Math.PI) * 360)}rotate(${Math.sin(e * Math.PI) * -12}deg)` }} />
          );
        })}
        {xq > 0 ? (
          <div style={{ position: "absolute", left: P.tray.x + 5 * w80 + 30, top: P.bar.top + P.bar.h / 2, transform: "translateY(-50%)", display: "flex", alignItems: "baseline", gap: 14 }}>
            <div style={{ ...big(COLORS.accent, 120), transform: `${Z(lerp(320, 0, EASE(xq)))}scale(${xq < 0.35 ? lerp(1.6, 0.92, xq / 0.35) : lerp(0.92, 1, BACK((xq - 0.35) / 0.65))})`, opacity: clamp01(xq * 5) }}>{times.text}</div>
          </div>
        ) : null}
        {xq > 0 ? (
          <div style={{ position: "absolute", left: P.tray.x, top: P.bar.top + P.bar.h + 22, ...label(COLORS.grayText, 32), opacity: clamp01(xq * 3) }}>{times.label}</div>
        ) : null}
      </div>

      {/* ── the week: Oct 13 → 19, two pins ── */}
      {ms >= tWk ? (
        <>
          <div style={{ position: "absolute", left: P.week.x0, top: 180 }}>
            <Letters text={week.header} t={tWk} mode="rise" stagger={22} style={{ ...big(INK, 64) }} />
          </div>
          {week.days.map((d, i) => {
            const q = clamp01((ms - (tWk + 250 + i * 60)) / 420);
            const pinI = pins.findIndex((p) => p.day === d);
            const pq = pinI >= 0 ? clamp01((ms - tPins[pinI]) / 520) : 0;
            const x = P.week.x0 + i * (P.week.cell + P.week.gap);
            const filled = pq > 0.4;
            return (
              <React.Fragment key={d}>
                <div style={{ position: "absolute", left: x, top: P.week.top, width: P.week.cell, height: P.week.cell, borderRadius: 22, perspective: 900,
                  opacity: clamp01(q * 4) }}>
                  <div style={{ width: "100%", height: "100%", borderRadius: 22, boxSizing: "border-box", border: `4px solid ${filled ? INK : inkA(0.25)}`, background: filled ? INK : "transparent",
                    transformOrigin: "50% 0%", transform: `rotateX(${lerp(-90, 0, BACK(q))}deg)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ ...label(filled ? "rgba(255,255,255,0.7)" : COLORS.grayText, 30) }}>{week.month}</div>
                    <div style={{ ...big(filled ? COLORS.paper : INK, 76), marginTop: 4 }}>{d}</div>
                  </div>
                </div>
                {pq > 0 ? (
                  <div style={{ position: "absolute", left: x + P.week.cell / 2, top: P.week.top - 34, transform: `translate(-50%, -100%) translateY(${(1 - BACK(pq)) * -160}px)`, opacity: clamp01(pq * 4),
                    display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ padding: "14px 28px", borderRadius: 18, background: INK, ...big(COLORS.paper, 46) }}>{pins[pinI].name}</div>
                    <div style={{ width: 6, height: 40, background: INK }} />
                  </div>
                ) : null}
              </React.Fragment>
            );
          })}
        </>
      ) : null}
    </div>
  );
};
