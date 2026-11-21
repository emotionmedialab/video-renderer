// ─────────────────────────────────────────────────────────────────────────
// KIT · terms — §4 THE MONEY and §5 THE OPTION of the Roche × Hansoh HORIZONTAL
// long-form, 2026-10-24 (absolute 1920x1080 seats). Motion law as ./hansoh: one
// designed mover per cue, landed things go still, nothing loops; the camera (the
// composition's) moves only to show something: here two push-ins on the claim.
//
// `MoneyTowers` (black, §4): a floor draws; "$400M" DROPS as a solid block and
//   counts, "$110M" drops onto it with its own label; then a ZOOM-OUT (the scale
//   shrinks exponentially, labels keep their size): the stack collapses to a sliver
//   while a DASHED tower comes down into frame from above, open at the top past its
//   $15B tick (the figure is a floor, "more than"); milestone kinds pop in as chips
//   (no split of the $15B by kind: none is given); "tiered royalties" lands under a
//   rule; the sliver is bracketed "$510M guaranteed"; "≈3%" lands as the one red
//   (510 / 15,510 = 3.3%, lower if milestones exceed $15B: "≈", never exact).
// `OptionClause` (red, §5): three headline bars; on "skipped" they fly off and the
//   fine print under them travels up and becomes the heading; the tray (./tray)
//   rises; two cards LIFT on "pick up to two" (the others dim) and take "Option"
//   tags; the terms caption writes on; a DASHED arrow ("eligible") draws to a US
//   tile that stamps "US sales"; the stage clears and "Licensor" drops, a "+" slams
//   in beside it on "more than".
// ─────────────────────────────────────────────────────────────────────────

import React from "react";
import { Easing, interpolate } from "remotion";
import { CLAMP, clamp01, COLORS, INK_SUB, INK_SUB_ON_RED, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { big, label } from "./rona";
import { Letters } from "./hunt";
import { useP3, useZ } from "./camera";
import { Tray, TRAY, TRAY_W, trayCardX, type TrayState } from "./tray";

const EASE = Easing.out(Easing.cubic);
const EASE_IN = Easing.in(Easing.quad);
const EASE_IO = Easing.inOut(Easing.cubic);
const BACK = Easing.out(Easing.back(1.6));
const BOUNCE = Easing.out(Easing.bounce);

const money = (v: number) => `$${Math.round(v)}M`;

// ══════════════════════════════════════════════════════════════════════════
// MoneyTowers — §4 (black world)
// ══════════════════════════════════════════════════════════════════════════
export const MONEY = {
  floorY: 860,
  stack: { x: 520, w: 220 },
  tower: { x: 1000, w: 300 },
  u0: 0.9, // px per $M before the zoom-out ($400M = 360px)
  u1: 0.048, // after ($15B = 720px, the $510M stack = 24px)
  side: { x: 1360 }, // the "$15B" figure + the chips column
};

export const MoneyTowers: React.FC<Win & {
  kicker: { text: string } & Cued; // "Now the money": the kicker + the floor
  upfront: { value: number; label: string } & Cued; // "$400": drops + counts
  anniv: { value: number; label: string } & Cued; // "$110": drops onto it
  zoom: Cued; // "Potentially": the zoom-out begins
  zoomEnd: Cued; // "billion": it lands
  ceiling: { kicker: string; value: number; suffix: string } & Cued; // "$15": the figure counts
  kinds: ({ text: string } & Cued)[]; // the milestone kinds
  royalties: { text: string } & Cued;
  guaranteed: { kicker: string } & Cued; // "guaranteed": the bracket
  total: { value: number } & Cued; // "$510": the figure
  share: { text: string; sub: string } & Cued; // "3%": the one red
}> = ({ from, to, kicker, upfront, anniv, zoom, zoomEnd, ceiling, kinds, royalties, guaranteed, total, share }) => {
  const ms = useMs();
  const k = useK();
  const Z = useZ();
  const P3 = useP3();
  const M = MONEY;
  const W = COLORS.paper;
  const tK = at(kicker, from + 100, from);
  const tU = at(upfront, tK + 900, from, tK + 300);
  const tA = at(anniv, tU + 2200, from, tU + 600);
  const tZ = at(zoom, tA + 3300, from, tA + 800);
  const tZE = at(zoomEnd, tZ + 1600, from, tZ + 600);
  const tC = at(ceiling, tZ + 1100, from, tZ + 300);
  const tKs = kinds.map((c, i) => at(c, tZE + 600 + i * 900, from, tZE + 200));
  const tR = at(royalties, tKs[tKs.length - 1] + 1500, from);
  const tG = at(guaranteed, tR + 2800, from, tR + 400);
  const tT = at(total, tG + 1600, from, tG + 300);
  const tS = at(share, tT + 2200, from, tT + 400);
  const vis = clamp01(interpolate(ms, [from - 100, from + 150, to - 250, to], [0, 1, 1, 0], CLAMP));
  if (vis <= 0) return null;

  // the zoom-out: the px-per-$M scale shrinks exponentially (reads as a camera pull, labels stay legible)
  const zq = EASE_IO(clamp01((ms - tZ) / Math.max(600, tZE - tZ)));
  const u = M.u0 * Math.pow(M.u1 / M.u0, zq);
  const F = M.floorY;
  const floorQ = EASE_IO(k(tK, 700));
  const uq = clamp01((ms - tU) / 650);
  const aq = clamp01((ms - tA) / 650);
  const h1 = upfront.value * u;
  const h2 = anniv.value * u;
  const preLabels = 1 - clamp01((ms - tZ) / 300); // the per-block labels retire as the pull starts
  const towerTop = F - 15000 * u;
  const towerQ = clamp01((ms - tZ) / 300);
  const tickQ = BACK(k(tZE, 360));
  const cq = EASE(clamp01((ms - tC) / Math.max(300, tZE - tC)));
  const gq = k(tG, 420);
  const tq = k(tT, 400);
  const sq = clamp01((ms - tS) / 420);

  const blockLabel = (y: number, fig: string, sub: string, q: number) => (
    <div style={{ position: "absolute", left: M.stack.x + M.stack.w + 40, top: y, transform: "translateY(-50%)", opacity: clamp01(q * 3) * preLabels }}>
      <div style={{ ...big(W, 84), fontVariantNumeric: "tabular-nums" }}>{fig}</div>
      <div style={{ ...label(INK_SUB, 34), marginTop: 8 }}>{sub}</div>
    </div>
  );

  return (
    <div style={{ position: "absolute", inset: 0, opacity: vis, ...P3 }}>
      {/* the kicker (retires on the pull) and the floor */}
      <div style={{ position: "absolute", left: 160, top: 96, opacity: 1 - clamp01((ms - tZ) / 300) }}>
        {ms >= tK ? <Letters text={kicker.text} t={tK} mode="rise" stagger={26} style={{ ...big(W, 72) }} /> : null}
      </div>

      {/* the guaranteed stack: $400M drops, $110M drops onto it. Anchored by BOTTOM to the floor (a column
          that grows upward), so it sits ON the line at every scale (Nel: "it's not on the line", 2026-10-24) */}
      <div style={{ position: "absolute", left: M.stack.x, bottom: 1080 - F, width: M.stack.w, display: "flex", flexDirection: "column-reverse", gap: Math.max(2, 6 * u), ...P3 }}>
        {uq > 0 ? (
          <div style={{ height: h1, background: W, borderRadius: `${Math.min(10, h1 / 3)}px ${Math.min(10, h1 / 3)}px 0 0`,
            transform: `${Z(lerp(500, 0, BOUNCE(uq)))}translateY(${(1 - BOUNCE(uq)) * -900}px)` }} />
        ) : null}
        {aq > 0 ? (
          <div style={{ height: h2, background: W, borderRadius: Math.min(10, h2 / 3),
            transform: `${Z(lerp(500, 0, BOUNCE(aq)))}translateY(${(1 - BOUNCE(aq)) * -700}px)` }} />
        ) : null}
      </div>
      {/* the floor drawn OVER the stack's foot, so the seam is the line itself */}
      {floorQ > 0 ? <div style={{ position: "absolute", left: 160, top: F - 2, width: 1600 * floorQ, height: 4, background: "rgba(255,255,255,0.5)" }} /> : null}
      {uq > 0.3 ? blockLabel(F - h1 / 2, money(upfront.value * EASE(clamp01((ms - tU) / 700))), upfront.label, uq) : null}
      {aq > 0.3 ? blockLabel(F - h1 - h2 / 2 - 50, `+${money(anniv.value)}`, anniv.label, aq) : null}

      {/* the milestone tower: dashed sides, no top (a floor, "more than"), a tick at $15B */}
      {towerQ > 0 ? (
        <svg style={{ position: "absolute", left: M.tower.x, top: 0, overflow: "visible", opacity: towerQ }} width={M.tower.w} height={F}>
          <path d={`M 3 -40 L 3 ${F - 3} L ${M.tower.w - 3} ${F - 3} L ${M.tower.w - 3} -40`} fill="none" stroke={W} strokeWidth={5} strokeDasharray="22 14" />
        </svg>
      ) : null}
      {tickQ > 0 && towerTop > 0 ? (
        <div style={{ position: "absolute", left: M.tower.x - 30, top: towerTop - 3, width: (M.tower.w + 60) * Math.min(1, tickQ), height: 6, background: W, borderRadius: 3 }} />
      ) : null}
      {cq > 0 ? (
        <div style={{ position: "absolute", left: M.side.x, top: Math.max(70, towerTop - 70), opacity: clamp01(cq * 4) }}>
          <div style={{ ...label(INK_SUB, 40) }}>{ceiling.kicker}</div>
          <div style={{ ...big(W, 120), fontVariantNumeric: "tabular-nums" }}>
            ${Math.round(cq * ceiling.value)}
            <span style={{ display: "inline-block", opacity: tickQ > 0 ? 1 : 0, transform: `scale(${lerp(1.6, 1, Math.min(1, tickQ))})` }}>{ceiling.suffix}</span>
          </div>
        </div>
      ) : null}

      {/* the kinds, then the royalties under a rule (a list, not a split) */}
      <div style={{ position: "absolute", left: M.side.x, top: 330, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
        {kinds.map((c, i) => {
          const q = clamp01((ms - tKs[i]) / 420);
          return (
            <div key={i} style={{ padding: "10px 22px", border: `3px dashed ${W}`, borderRadius: 14, ...label(W, 36), opacity: clamp01(q * 4),
              transform: `${Z(lerp(260, 0, EASE(q)))}translateX(${(1 - EASE(q)) * 60}px)` }}>{c.text}</div>
          );
        })}
        {(() => {
          const q = clamp01((ms - tR) / 420);
          return (
            <div style={{ marginTop: 10, paddingTop: 22, borderTop: `3px solid rgba(255,255,255,${0.4 * clamp01(q * 3)})`, opacity: clamp01(q * 4), transform: `translateY(${(1 - EASE(q)) * 24}px)` }}>
              <div style={{ ...big(W, 44) }}>{royalties.text}</div>
            </div>
          );
        })()}
      </div>

      {/* the bracket + the guaranteed figure, laid out by the string, right-aligned to the stack */}
      {gq > 0 ? (
        <>
          <div style={{ position: "absolute", left: M.stack.x - 26, top: F - (h1 + h2 + Math.max(2, 6 * u)) - 12, width: 10, height: h1 + h2 + Math.max(2, 6 * u) + 12, transformOrigin: "50% 100%", borderLeft: `5px solid ${W}`, borderTop: `5px solid ${W}`, borderBottom: `5px solid ${W}`,
            opacity: clamp01(gq * 3), transform: `scaleY(${EASE(gq)})` }} />
          {/* bottom-anchored 14px above the floor: the label never crosses the line */}
          <div style={{ position: "absolute", right: 1920 - (M.stack.x - 50), bottom: 1080 - F + 14, textAlign: "right", opacity: clamp01(gq * 3) }}>
            <div style={{ ...label(INK_SUB, 34) }}>{guaranteed.kicker}</div>
            <div style={{ ...big(W, 84), opacity: clamp01(tq * 3), transform: `translateY(${(1 - EASE(tq)) * 18}px)` }}>{money(total.value)}</div>
          </div>
        </>
      ) : null}
      {/* "≈3%": the one red, slams over the sliver */}
      {sq > 0 ? (
        <div style={{ position: "absolute", left: M.stack.x + M.stack.w / 2 - 260, width: 520, top: 520, textAlign: "center", opacity: clamp01(sq * 5) }}>
          <div style={{ ...big(COLORS.accent, 130), transform: `${Z(lerp(300, 0, EASE(sq)))}scale(${sq < 0.35 ? lerp(1.5, 0.94, sq / 0.35) : lerp(0.94, 1, BACK((sq - 0.35) / 0.65))})` }}>{share.text}</div>
          <div style={{ ...label(W, 36), marginTop: 6 }}>{share.sub}</div>
        </div>
      ) : null}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// OptionClause — §5 (red world)
// ══════════════════════════════════════════════════════════════════════════
export const OPT = {
  heading: { x: 160, top: 96, size: 80 },
  traySc: 0.62, // the tray, scaled about its top-left (160, 330)
  picks: [1, 3], // the two cards that lift ("up to two"; which two is not disclosed: illustrative)
  caption: { top: 650 },
  us: { x: 1460, top: 280, w: 300, h: 300 }, // centre y 430 = the scaled cards' middle (330 + 320 x 0.62 / 2)
  plate: { top: 410 },
};
const trayX = (i: number) => TRAY.x + (trayCardX(i) - TRAY.x + TRAY.cardW / 2) * OPT.traySc; // a card's centre x on screen
const trayTop = TRAY.top; // scaling origin y: card tops stay put

export const OptionClause: React.FC<Win & {
  bars: Cued; // "Here": the headline bars
  skip: Cued; // "skipped": they fly off, the fine print travels up
  heading: { text: string } & Cued; // "Hansoh has": it becomes the heading
  tray: Cued; // "option": the tray rises
  pick: Cued; // "pick": two cards lift
  tags: { text: string } & Cued; // "two": the tags
  contribute: { lines: [string, string]; second?: string } & Cued; // the caption, two lines
  clearCaption: Cued; // "In return"
  arrow: { text: string } & Cued; // "eligible": the dashed arrow draws; its label
  upside: Cued; // "upside": the label
  us: { text: string } & Cued; // "United States": the tile stamps
  clear: Cued; // "That": the stage clears
  plate: { text: string; kicker: string } & Cued; // "makes": Licensor drops
  plus: Cued; // "more than": the "+"
  trayState: { slabText: string; stageText: string; proposedText: [string, string] };
}> = ({ from, to, bars, skip, heading, tray, pick, tags, contribute, clearCaption, arrow, upside, us, clear, plate, plus, trayState }) => {
  const ms = useMs();
  const k = useK();
  const Z = useZ();
  const P3 = useP3();
  const W = COLORS.paper;
  const tB = at(bars, from + 100, from);
  const tSk = at(skip, tB + 2000, from, tB + 600);
  const tH = at(heading, tSk + 700, from, tSk + 300);
  const tTr = at(tray, tH + 600, from, tH + 300);
  const tP = at(pick, tTr + 500, from, tTr + 300);
  const tTg = at(tags, tP + 450, from, tP + 250);
  const tC1 = at(contribute, tTg + 1100, from, tTg + 300);
  const tC2 = at({ word: contribute.second }, tC1 + 1700, from, tC1 + 400);
  const tCC = at(clearCaption, tC2 + 1800, from, tC2 + 400);
  const tAr = at(arrow, tCC + 1200, from, tCC + 200);
  const tUp = at(upside, tAr + 1100, from, tAr + 300);
  const tUS = at(us, tUp + 1700, from, tUp + 300);
  const tCl = at(clear, tUS + 900, from, tUS + 300);
  const tPl = at(plate, tCl + 500, from, tCl + 250);
  const tPlus = at(plus, tPl + 800, from, tPl + 300);
  const vis = clamp01(interpolate(ms, [from - 100, from + 150, to - 250, to], [0, 1, 1, 0], CLAMP));
  if (vis <= 0) return null;

  const cleared = ms >= tCl;
  const off = (t: number, i = 0) => {
    const f = EASE_IN(clamp01((ms - (t + i * 40)) / 420));
    return { transform: `translateX(${-f * 1500}px)`, opacity: 1 - clamp01((f - 0.7) / 0.3) };
  };
  // 1 · the headline bars, and the fine print that becomes the heading
  const bq = (i: number) => clamp01((ms - (tB + i * 130)) / 420);
  const skq = EASE_IN(clamp01((ms - tSk) / 520));
  const fpq = EASE_IO(clamp01((ms - tSk) / Math.max(500, tH - tSk + 200)));
  const fp = { x: lerp(560, OPT.heading.x, fpq), y: lerp(760, OPT.heading.top + 30, fpq), w: lerp(800, 640, fpq), h: lerp(14, 60, fpq) };
  const hq = k(tH, 360);
  // 2 · the tray
  const trq = EASE(clamp01((ms - tTr) / 650));
  const lift = OPT.picks.map(() => EASE_IO(clamp01((ms - tP) / 520)));
  const s: TrayState = {
    solid: [1, 1], stage: 1, dashed: [1, 1, 1], proposed: 1, slab: 1, slabLabel: 1,
    lift: [0, 1, 2, 3, 4].map((i) => (OPT.picks.includes(i) ? lift[0] : 0)),
    dim: [0, 1, 2, 3, 4].map((i) => (OPT.picks.includes(i) ? 0 : lift[0])),
  };
  const tagQ = clamp01((ms - tTg) / 380);
  const capQ = (t: number) => k(t, 380) * (1 - k(tCC, 300));
  // 3 · the arrow + the US tile
  // a STRAIGHT dashed connector from the tray's right edge to the tile, level with the cards' middle, ending in
  // an open chevron that touches the tile (the curved one with a separate filled head read badly: Nel, 2026-10-24)
  const aq = EASE_IO(clamp01((ms - tAr) / 600));
  const U = OPT.us;
  const lineY = U.top + U.h / 2;
  const x0 = TRAY.x + TRAY_W * OPT.traySc + 38;
  const x1 = U.x - 16;
  const xNow = lerp(x0, x1, aq);
  const upq = k(tUp, 380);
  const tileQ = k(tAr + 250, 420);
  const usq = clamp01((ms - tUS) / 420);
  // 4 · the plate
  const plq = clamp01((ms - tPl) / 620);
  const pq = clamp01((ms - tPlus) / 420);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: vis, ...P3 }}>
      {/* headline bars: skimmed past, they fly up and away on "skipped" */}
      {skq < 1 ? (
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${-skq * 900}px)`, filter: skq > 0.02 ? `blur(${skq * 12}px)` : undefined }}>
          {[1500, 1180, 1320].map((w, i) => (
            <div key={i} style={{ position: "absolute", left: 160, top: 250 + i * 120, width: w * EASE(bq(i)), height: 72, borderRadius: 14, background: W, opacity: clamp01(bq(i) * 3) }} />
          ))}
        </div>
      ) : null}
      {/* the fine print: travels up to the heading seat, then becomes the heading */}
      {ms >= tB + 500 && hq < 1 ? (
        <div style={{ position: "absolute", left: fp.x, top: fp.y, width: fp.w, height: fp.h, borderRadius: 8, background: INK_SUB_ON_RED,
          opacity: clamp01((ms - tB - 500) / 300) * (1 - hq), transform: Z(Math.sin(fpq * Math.PI) * 300) || undefined }} />
      ) : null}
      {hq > 0 ? (
        <div style={{ position: "absolute", left: OPT.heading.x, top: OPT.heading.top, ...(cleared ? off(tCl, 0) : {}) }}>
          <Letters text={heading.text} t={tH} mode="flip" stagger={28} style={{ ...big(W, OPT.heading.size) }} />
        </div>
      ) : null}

      {/* the tray (callback), scaled, rising from below */}
      {trq > 0 ? (
        <div style={{ position: "absolute", inset: 0, ...P3, ...(cleared ? off(tCl, 1) : {}) }}>
          <div style={{ position: "absolute", inset: 0, ...P3, transformOrigin: `${TRAY.x}px ${trayTop}px`, transform: `translateY(${(1 - trq) * 700}px) scale(${OPT.traySc})` }}>
            <Tray s={s} tone="light" {...trayState} />
          </div>
          {/* the tags on the lifted cards */}
          {tagQ > 0
            ? OPT.picks.map((i, n) => (
                <div key={i} style={{ position: "absolute", left: trayX(i), top: trayTop - 96, transform: `translateX(-50%) ${Z(lerp(260, 30, EASE(tagQ)))}scale(${lerp(1.5, 1, BACK(tagQ))})`,
                  opacity: clamp01((tagQ - n * 0.1) * 4), padding: "8px 22px", borderRadius: 30, background: W, ...big(COLORS.accent, 34) }}>{tags.text}</div>
              ))
            : null}
        </div>
      ) : null}
      {/* the caption, two lines; retires on "In return" */}
      <div style={{ position: "absolute", left: 160, top: OPT.caption.top }}>
        <div style={{ ...big(W, 50), opacity: capQ(tC1), transform: `translateY(${(1 - EASE(k(tC1, 380))) * 18}px)` }}>{contribute.lines[0]}</div>
        <div style={{ ...big(INK_SUB_ON_RED, 44), marginTop: 12, opacity: capQ(tC2), transform: `translateY(${(1 - EASE(k(tC2, 380))) * 18}px)` }}>{contribute.lines[1]}</div>
      </div>

      {/* the dashed arrow (eligible = conditional), its label, the US tile */}
      {aq > 0 ? (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", ...(cleared ? off(tCl, 2) : {}) }} width={1920} height={1080}>
          <line x1={x0} y1={lineY} x2={xNow - 4} y2={lineY} stroke={W} strokeWidth={8} strokeDasharray="20 14" strokeLinecap="round" />
          {/* the head travels with the line's tip: an open chevron, same weight, round joins */}
          <polyline points={`${xNow - 28},${lineY - 26} ${xNow},${lineY} ${xNow - 28},${lineY + 26}`} fill="none" stroke={W} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
      {upq > 0 ? (
        <div style={{ position: "absolute", left: (x0 + x1) / 2 - 200, width: 400, top: lineY - 86, textAlign: "center", ...big(W, 46), opacity: clamp01(upq * 3) * (cleared ? 1 - clamp01((ms - tCl) / 300) : 1),
          transform: `translateY(${(1 - EASE(upq)) * 20}px)` }}>{arrow.text}</div>
      ) : null}
      {tileQ > 0 ? (
        <div style={{ position: "absolute", left: U.x, top: U.top, width: U.w, height: U.h, ...P3, ...(cleared ? off(tCl, 3) : {}) }}>
          <svg style={{ position: "absolute", inset: 0, opacity: clamp01(tileQ * 3) * (1 - usq) }} width={U.w} height={U.h}>
            <rect x={3} y={3} width={U.w - 6} height={U.h - 6} rx={26} fill="none" stroke={W} strokeWidth={5} strokeDasharray="20 13" />
          </svg>
          {usq > 0 ? (
            <div style={{ position: "absolute", inset: 0, borderRadius: 26, background: W, display: "flex", alignItems: "center", justifyContent: "center",
              ...big(COLORS.ink, 56) /* "US sales" ≈ 8 x 0.6em x 56 = 269px of 300 */, transform: `${Z(lerp(240, 0, EASE(usq)))}scale(${lerp(1.3, 1, BACK(usq))})`, opacity: clamp01(usq * 4) }}>{us.text}</div>
          ) : null}
        </div>
      ) : null}

      {/* "more than a licensor": the plate drops, the "+" slams in beside it (one flex row, by the strings) */}
      {plq > 0 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: OPT.plate.top - 90, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, ...P3 }}>
          <div style={{ ...label(INK_SUB_ON_RED, 44), opacity: clamp01(plq * 3) }}>{plate.kicker}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 28, ...P3 }}>
            <div style={{ padding: "26px 54px", borderRadius: 26, background: W, ...big(COLORS.ink, 120), transform: `translateY(${(1 - BOUNCE(plq)) * -600}px)` }}>{plate.text}</div>
            {pq > 0 ? (
              <div style={{ width: 170, height: 170, borderRadius: 85, background: W, display: "flex", alignItems: "center", justifyContent: "center", ...big(COLORS.accent, 140),
                transform: `${Z(lerp(420, 0, EASE(pq)))}scale(${pq < 0.35 ? lerp(1.6, 0.9, pq / 0.35) : lerp(0.9, 1, BACK((pq - 0.35) / 0.65))})`, opacity: clamp01(pq * 5) }}>+</div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};
