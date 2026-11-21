// ─────────────────────────────────────────────────────────────────────────
// KIT · plusgut — THE RATIONALE AND THE TRIAL, for the ABBV-466 long-form
// (2026-10-25, HORIZONTAL 16:9). Absolute 1920×1080 seats; import by path.
// Same rules and 3D grammar as kit/plusone (one big mover per cue, landed
// things still, finished ideas retire; `useZ()` / `useP3()` for the camera).
//
// `GutLogic` (white card): a vessel over the gut. α4β7-carrying cells dive in;
// risankizumab docks on IL-23 while they stay; red clamps lock a second wave,
// which bounces off the wall on "limit… moving into the gut".
// `TrialSplit` (ink): the trial slab slams down; 300 dots stream from the count;
// the crowd sorts into the real arm sizes; a four-person legend for "three in
// four", drawn for ALL 300 (the release gives no per-arm split).
// ─────────────────────────────────────────────────────────────────────────

import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, COLORS, DISPLAY, INK_SUB, TRACK, caps, useMs } from "./core";
import { TYPE } from "../style";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { YGlyph } from "./pairing";
import { useP3, useZ } from "./camera";
import { back, bounce, EASE, EASE_IO, fadeOut, hump } from "./plusone";

// ══════════════════════════════════════════════════════════════════════════
// Cell — an immune cell with its α4β7 "hooks" (two short ticks on its rim)
// ══════════════════════════════════════════════════════════════════════════
const Cell: React.FC<{ r: number; color: string; hooks?: number; clamp?: number; clampColor?: string }> = ({ r, color, hooks = 1, clamp = 0, clampColor }) => (
  <svg width={r * 4} height={r * 4} viewBox={`${-r * 2} ${-r * 2} ${r * 4} ${r * 4}`} style={{ display: "block", overflow: "visible" }}>
    <circle r={r} fill={COLORS.paper} stroke={color} strokeWidth={6} />
    <circle r={r * 0.38} fill={color} opacity={0.85} />
    {[-40, 40].map((a, i) => {
      const rad = ((a + 90) * Math.PI) / 180;
      const x0 = Math.cos(rad) * r, y0 = Math.sin(rad) * r;
      const x1 = Math.cos(rad) * (r + 18 * hooks), y1 = Math.sin(rad) * (r + 18 * hooks);
      return (
        <g key={i}>
          <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={color} strokeWidth={6} strokeLinecap="round" />
          <circle cx={x1} cy={y1} r={6 * hooks} fill={color} />
          {clamp > 0 ? (
            <g transform={`translate(${x1 + Math.cos(rad) * 14} ${y1 + Math.sin(rad) * 14}) rotate(${a})`} opacity={clamp}>
              <path d="M -12 10 L 0 -6 L 12 10" fill="none" stroke={clampColor} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
              <line x1={0} y1={-6} x2={0} y2={-26} stroke={clampColor} strokeWidth={7} strokeLinecap="round" />
            </g>
          ) : null}
        </g>
      );
    })}
  </svg>
);

// ══════════════════════════════════════════════════════════════════════════
// GutLogic — AbbVie's rationale, enacted on a vessel over the gut (white card)
// ══════════════════════════════════════════════════════════════════════════
// The vessel and the gut wall draw; inflammation blooms in the gut; a first wave of
// cells slides in carrying α4β7 hooks and DIVES through the wall into the gut (the
// camera follows). Risankizumab drops in and docks on IL-23 ("blocks its own target")
// while those cells stay put ("even while"). The IL-23 group retires on "So"; a second
// wave slides in; red trosunilimab clamps streak in from the lens and lock on the hooks;
// on "moving into the gut" the wave dips at the wall and SPRINGS BACK.
// Settled frame: vessel + gut (the stage) · the clamped wave · one dashed caption.
export const GUT = { vTop: 210, vBot: 360, gTop: 600, gBot: 930, x0: 90, x1: 1830, cellR: 30, w1: [520, 700, 880, 1060], w2: [760, 960, 1160, 1360], il: [1420, 1580, 1740], diveTo: 740 };

export const GutLogic: React.FC<Win & {
  kicker: { text: string } & Cued;
  draw: Cued; // the vessel + wall draw
  inflame: { text: string } & Cued; // blooms in the gut
  wave1: Cued; // cells slide in
  dive: { text: string } & Cued; // ...and dive through the wall (label: "α4β7")
  ris: { text: string } & Cued; // risankizumab drops in over the gut
  block: { text: string } & Cued; // docks on IL-23 (label)
  wave2: Cued; // the IL-23 group retires, a second wave slides in
  clamp: { text: string } & Cued; // red clamps streak in and lock
  bounce: Cued; // the wave dips at the wall and springs back
  caption: { text: string } & Cued;
}> = ({ from, to, kicker, draw, inflame, wave1, dive, ris, block, wave2, clamp, bounce: bounceCue, caption }) => {
  const ms = useMs();
  const k = useK();
  const Z = useZ();
  const P3 = useP3();
  const INK = COLORS.ink;
  const RED = COLORS.accent;
  const G = GUT;

  const tDraw = at(draw, from + 40, from);
  const tKick = at(kicker, tDraw + 600, from, tDraw);
  const tInf = at(inflame, tKick + 1800, from, tKick + 300);
  const tW1 = at(wave1, tInf + 1200, from, tInf + 400);
  const tDive = at(dive, tW1 + 1000, from, tW1 + 600);
  const tRis = at(ris, tDive + 2000, from, tDive + 900);
  const tBlock = at(block, tRis + 2400, from, tRis + 600);
  const tW2 = at(wave2, tBlock + 1400, from, tBlock + 400);
  const tClamp = at(clamp, tW2 + 1000, from, tW2 + 600);
  const tBounce = at(bounceCue, tClamp + 3800, from, tClamp + 900);
  const tCap = at(caption, tBounce - 1800, from, tClamp + 700);
  const vis = fadeOut(ms, to);
  if (ms < from - 60 || vis <= 0) return null;

  const drawK = EASE_IO(k(tDraw, 900));
  const ilOut = 1 - k(tW2, 300);
  const vMid = (G.vTop + G.vBot) / 2;

  // a cell's pose: slides in from off the left edge, then (wave 1) dives into the gut,
  // or (wave 2) dips toward the wall and springs back up into the vessel
  const cellAt = (wave: 1 | 2, i: number) => {
    const xs = wave === 1 ? G.w1 : G.w2;
    const tIn = (wave === 1 ? tW1 : tW2) + i * 110;
    const inK = EASE(k(tIn, 700));
    const x = lerp(-120 - (xs.length - i) * 140, xs[i], inK);
    let y = vMid;
    let z = 0;
    if (wave === 1) {
      const dK = EASE_IO(k(tDive + i * 140, 620));
      y = lerp(vMid, G.diveTo + (i % 2) * 70, dK);
      z = 120 * hump(dK);
    } else {
      const bK = clamp01((ms - (tBounce + i * 120)) / 820);
      y = vMid + (G.vBot - vMid + 70) * hump(bK) * (bK < 0.5 ? 1 : Math.exp(-3 * (bK - 0.5)));
    }
    return { x, y, z, o: clamp01(inK * 3) };
  };

  const label = (text: string, t: number, x: number, y: number, color: string = COLORS.grayText, alpha = 1) => (
    <div style={{ position: "absolute", left: x, top: y, ...caps(color, TYPE.label), whiteSpace: "nowrap", opacity: clamp01(k(t, 260) * 1.6) * alpha,
      transform: `translateY(${(1 - EASE(k(t, 300))) * 12}px)` }}>{text}</div>
  );

  return (
    <AbsoluteFill style={{ opacity: vis, ...P3 }}>
      {label(kicker.text, tKick, 120, 110, INK)}

      {/* the stage: vessel walls draw left→right; the gut's villi edge draws; panels fill */}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <rect x={G.x0} y={G.vTop} width={(G.x1 - G.x0) * drawK} height={G.vBot - G.vTop} fill={COLORS.panel} />
        <line x1={G.x0} y1={G.vTop} x2={G.x0 + (G.x1 - G.x0) * drawK} y2={G.vTop} stroke={INK} strokeWidth={6} />
        <line x1={G.x0} y1={G.vBot} x2={G.x0 + (G.x1 - G.x0) * drawK} y2={G.vBot} stroke={INK} strokeWidth={6} />
        <clipPath id="gutDraw"><rect x={G.x0 - 10} y={G.gTop - 60} width={(G.x1 - G.x0 + 20) * drawK} height={G.gBot - G.gTop + 80} /></clipPath>
        <g clipPath="url(#gutDraw)">
          <path d={`M ${G.x0} ${G.gBot} L ${G.x0} ${G.gTop + 30} ${Array.from({ length: 22 }).map((_, i) => {
            const x = G.x0 + ((i + 0.5) * (G.x1 - G.x0)) / 22;
            const xe = G.x0 + ((i + 1) * (G.x1 - G.x0)) / 22;
            return `Q ${x} ${G.gTop - 40} ${xe} ${G.gTop + 30}`;
          }).join(" ")} L ${G.x1} ${G.gBot} Z`} fill={COLORS.panel} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
          {/* inflammation: soft dark blooms in the gut */}
          {[[330, 780, 110], [700, 830, 90], [1080, 790, 120], [1460, 820, 100]].map(([x, y, r], i) => {
            const f = EASE(k(tInf + i * 140, 600));
            return <circle key={i} cx={x} cy={y} r={r * lerp(0.2, 1, f)} fill={INK} opacity={0.13 * f} />;
          })}
        </g>
      </svg>
      {label("Blood vessel", tDraw + 300, G.x0 + 30, G.vTop - 46)}
      {label("Gut", tDraw + 500, G.x0 + 30, G.gBot - 50)}
      {label(inflame.text, tInf + 200, 230, 690, INK, 1 - k(tW2, 260))}

      {/* risankizumab docked on IL-23 in the gut; retires on the second wave */}
      {ilOut > 0 && ms >= tRis - 60 ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: ilOut, ...P3 }}>
          {G.il.map((x, i) => {
            const dropK = k(tRis + i * 120, 640);
            const dockK = EASE(k(tBlock + i * 90, 360));
            return (
              <div key={i} style={{ position: "absolute", left: x - 60, top: 650, width: 120, height: 220, ...P3 }}>
                {/* IL-23: a small diamond that appears as "blocks" is voiced, then capped */}
                <div style={{ position: "absolute", left: 42, top: 160, width: 36, height: 36, background: INK,
                  transform: `rotate(45deg) scale(${lerp(0, 1, EASE(k(tBlock - 500 + i * 90, 300)))})` }} />
                {/* the antibody drops from in front of the card and seats on it, arms down */}
                <div style={{ position: "absolute", left: 0, top: 0, width: 120, height: 160, opacity: clamp01(dropK * 3),
                  transform: `${Z(lerp(600, 0, EASE(dropK)))}translateY(${lerp(-260, 0, EASE(dropK)) + 26 * (1 - dockK)}px) rotate(180deg)` }}>
                  <svg width={120} height={160} viewBox="-200 -200 400 400" style={{ display: "block", overflow: "visible" }}>
                    <g transform="scale(0.85)"><YGlyph color={INK} tips={["round", "round"]} /></g>
                  </svg>
                </div>
              </div>
            );
          })}
          {label(ris.text, tRis + 300, 1400, 450, INK)}
          {label(block.text, tBlock + 200, 1400, 492, COLORS.grayText)}
        </div>
      ) : null}

      {/* wave 1 (in the gut, quieted once wave 2 arrives) and wave 2 (clamped, held in the vessel) */}
      {([1, 2] as const).map((wave) =>
        (wave === 1 ? G.w1 : G.w2).map((_, i) => {
          const tIn = wave === 1 ? tW1 : tW2;
          if (ms < tIn - 60) return null;
          const p = cellAt(wave, i);
          const clampK = wave === 2 ? EASE(k(tClamp + i * 120, 520)) : 0;
          return (
            <div key={`${wave}${i}`} style={{ position: "absolute", left: p.x - G.cellR * 2, top: p.y - G.cellR * 2, width: G.cellR * 4, height: G.cellR * 4,
              opacity: p.o * (wave === 1 ? lerp(1, 0.45, k(tW2, 400)) : 1), transform: Z(p.z) || undefined }}>
              <Cell r={G.cellR} color={INK} clamp={clampK} clampColor={RED} />
            </div>
          );
        })
      )}
      {/* the clamps' flight: each red antibody streaks in from in front of the lens onto its cell */}
      {G.w2.map((x, i) => {
        const fK = k(tClamp - 420 + i * 120, 420);
        if (fK <= 0 || fK >= 1) return null;
        return (
          <div key={i} style={{ position: "absolute", left: x - 40, top: vMid - 120, width: 80, height: 110, opacity: clamp01(fK * 4),
            transform: `${Z(lerp(1100, 0, EASE(fK)))}translate(${lerp(-300 + i * 120, 0, EASE(fK))}px, ${lerp(-260, 0, EASE(fK))}px) scale(${Z(1) ? 1 : lerp(3, 1, EASE(fK))})` }}>
            <svg width={80} height={110} viewBox="-200 -230 400 460" style={{ display: "block", overflow: "visible" }}><YGlyph color={RED} tips={["square", "square"]} /></svg>
          </div>
        );
      })}
      {label(dive.text, tDive + 200, G.w1[3] + 70, G.diveTo + 10, INK, 1 - k(tW2, 260))}
      {label(clamp.text, tClamp + 400, G.w2[0] - 30, G.vTop - 46, RED)}

      {/* the caption: a DASHED tag, because "designed to" is intent, not a result */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 500, display: "flex", justifyContent: "center", ...P3 }}>
        <div style={{ padding: "16px 34px", borderRadius: 30, border: `4px dashed ${INK}`, ...caps(INK, TYPE.label + 4), whiteSpace: "nowrap",
          opacity: clamp01(k(tCap, 300) * 2), transform: `rotateX(${lerp(-90, 0, back(k(tCap, 520)))}deg)`, transformOrigin: "50% 0%" }}>
          {caption.text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// TrialSplit — TARGET-CD: 300 patients, three arms, who they were (ink)
// ══════════════════════════════════════════════════════════════════════════
// A name slab slams down from above on its top hinge; "300" counts while 300 dots stream
// out of it into a crowd (the camera pulls back); on "randomized" the crowd SORTS into
// three columns of the real arm sizes, each label flipping up as its arm is named (the
// combination's dots + label are the one red); on "three in four" the arms rise and quiet
// and a four-person legend lands below: three take a ring ("failed ≥1"), one goes solid
// on "three or more". Settled frame: name · three arms · the legend.
export const TRIAL3 = { nameTop: 70, countX: 170, countTop: 300, cloud: { cx: 1340, cy: 520, cols: 25, rows: 12, sp: 30 }, colXs: [420, 960, 1500], colTop: 330,
  dot: 9, sp: 26, per: 10, labelTop: 640, lift: 100, legendTop: 700, person: 92 };

export const TrialSplit: React.FC<Win & {
  name: { text: string } & Cued;
  count: { value: number; sub: string; end: Cued } & Cued; // 300 counts, dots stream
  sort: Cued; // the crowd sorts into the arms
  arms: ({ label: string; n: number; red?: boolean } & Cued)[];
  failed: { text: string; end: Cued } & Cued; // "Three in four": legend lands; three ringed on "failed"
  three: { text: string } & Cued; // one goes solid
}> = ({ from, to, name, count, sort, arms, failed, three }) => {
  const ms = useMs();
  const k = useK();
  const Z = useZ();
  const P3 = useP3();
  const Wt = COLORS.paper;
  const RED = COLORS.accent;
  const T = TRIAL3;

  const tName = at(name, from + 200, from);
  const tCount = at(count, tName + 1400, from, tName + 400);
  const tCountEnd = at(count.end, tCount + 900, from, tCount + 400);
  const tSort = at(sort, tCountEnd + 1500, from, tCountEnd + 300);
  let prev = tSort;
  const tArm = arms.map((a) => (prev = at(a, prev + 1000, from, prev + 200)));
  const tFail = at(failed, prev + 1200, from, prev + 400);
  const tFailEnd = at(failed.end, tFail + 1200, from, tFail + 300);
  const tThree = at(three, tFailEnd + 2000, from, tFailEnd + 300);
  const vis = fadeOut(ms, to);
  if (ms < tName - 60 || vis <= 0) return null;

  // the name slab: falls from above on a top hinge and lands with a bounce
  const nK = k(tName, 560);
  const nameRot = nK < 0.5 ? lerp(-95, 0, EASE_IO(nK / 0.5)) : 9 * bounce((nK - 0.5) / 0.5);

  // count + stream
  const cDur = Math.max(500, tCountEnd - tCount - 150);
  const cq = EASE_IO(k(tCount, cDur));
  const shown = Math.round(1 + (count.value - 1) * cq);
  const countO = clamp01(k(tCount - 40, 140) * 2) * (1 - k(tSort, 300));

  // each dot's arm and its index inside the arm
  const sortK = EASE_IO(k(tSort, 1000));
  const riseK = EASE_IO(k(tFail, 620));
  const armOf: number[] = [];
  arms.forEach((a, ai) => { for (let j = 0; j < a.n; j++) armOf.push(ai); });
  const seen = arms.map(() => 0);
  const idxInArm = armOf.map((ai) => seen[ai]++);
  const C = T.cloud;
  const origin = { x: T.countX + 260, y: T.countTop + 100 };

  const legendO = clamp01(k(tFail, 300) * 2);
  const ringK = (i: number) => EASE(k(tFailEnd + i * 120, 320));
  const solidK = EASE(k(tThree, 360));

  return (
    <AbsoluteFill style={{ opacity: vis, ...P3 }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: T.nameTop, display: "flex", justifyContent: "center", ...P3 }}>
        <div style={{ padding: "18px 46px", borderRadius: 22, background: Wt, color: COLORS.ink, fontFamily: DISPLAY, fontWeight: 700, fontSize: 96,
          letterSpacing: TRACK.display, lineHeight: 1, whiteSpace: "nowrap", opacity: clamp01(nK * 5), transformOrigin: "50% 0%",
          transform: `rotateX(${nameRot}deg)` }}>
          {name.text}
        </div>
      </div>

      {countO > 0 ? (
        <div style={{ position: "absolute", left: T.countX, top: T.countTop, opacity: countO }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 220, letterSpacing: TRACK.display, lineHeight: 0.86, color: Wt, fontVariantNumeric: "tabular-nums" }}>{shown}</div>
          <div style={{ marginTop: 26, ...caps(INK_SUB, TYPE.label + 8), whiteSpace: "nowrap", opacity: clamp01(k(tCount + 500, 300) * 2) }}>{count.sub}</div>
        </div>
      ) : null}

      {/* the dots: stream out of the count into the cloud, sort into the arms, then rise and quiet */}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: lerp(1, 0.5, riseK) }}>
        {armOf.map((ai, i) => {
          const born = tCount + (cDur * i) / count.value;
          if (ms < born) return null;
          const fly = EASE(clamp01((ms - born) / 520));
          const cx = C.cx + ((i % C.cols) - (C.cols - 1) / 2) * C.sp;
          const cy = C.cy + (Math.floor(i / C.cols) - (C.rows - 1) / 2) * C.sp;
          const j = idxInArm[i];
          const ax = T.colXs[ai] + ((j % T.per) - (T.per - 1) / 2) * T.sp;
          const ay = T.colTop + Math.floor(j / T.per) * T.sp - T.lift * riseK;
          // each dot sorts on its own beat: a sweep, left arm first
          const sK = EASE_IO(clamp01((ms - (tSort + ai * 120 + (j % 10) * 14)) / 900));
          const x0 = lerp(origin.x, cx, fly), y0 = lerp(origin.y, cy, fly) - 90 * hump(fly);
          const x = lerp(x0, ax, sK), y = lerp(y0, ay, sK) - 60 * hump(sK);
          return <circle key={i} cx={x} cy={y} r={T.dot} fill={arms[ai].red && sortK > 0.6 ? RED : Wt} />;
        })}
      </svg>

      {arms.map((a, i) => {
        const lk = k(tArm[i], 520);
        return (
          <div key={i} style={{ position: "absolute", left: T.colXs[i] - 260, width: 520, top: T.labelTop - T.lift * riseK, textAlign: "center", ...P3 }}>
            <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 44, letterSpacing: TRACK.headline, lineHeight: 1.05, color: a.red ? RED : Wt,
              opacity: clamp01(lk * 3) * lerp(1, 0.6, riseK), transformOrigin: "50% 100%", transform: `rotateX(${lerp(-90, 0, back(lk))}deg)` }}>
              {a.label}
            </div>
            <div style={{ marginTop: 8, ...caps(INK_SUB, TYPE.labelSm), opacity: clamp01(lk * 2) * lerp(1, 0.6, riseK) }}>{a.n} patients</div>
          </div>
        );
      })}

      {/* the legend: four people for "three in four", for ALL 300 */}
      {legendO > 0 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: T.legendTop + T.lift * (1 - riseK), display: "flex", justifyContent: "center", alignItems: "center",
          gap: 60, opacity: legendO, ...P3 }}>
          <div style={{ display: "flex", gap: 34, ...P3 }}>
            {[0, 1, 2, 3].map((i) => {
              const ringed = i < 3 ? ringK(i) : 0;
              const solid = i === 0 ? solidK : 0;
              const s = T.person;
              const o = i < 3 ? lerp(0.45, 1, ringed) : 0.45;
              return (
                <div key={i} style={{ position: "relative", width: s, height: s, transform: `${Z(200 * hump(ringed))}scale(${1 + 0.12 * hump(ringed)})` }}>
                  <svg width={s} height={s} style={{ display: "block", overflow: "visible" }}>
                    <circle cx={s / 2} cy={s * 0.26} r={s * 0.2} fill={solid > 0 ? Wt : "none"} fillOpacity={solid} stroke={Wt} strokeWidth={5} opacity={o} />
                    <rect x={s * 0.17} y={s * 0.52} width={s * 0.66} height={s * 0.48} rx={s * 0.24} fill={solid > 0 ? Wt : "none"} fillOpacity={solid} stroke={Wt} strokeWidth={5} opacity={o} />
                    {i < 3 ? <circle cx={s / 2} cy={s / 2} r={s * 0.62} fill="none" stroke={Wt} strokeWidth={4} strokeDasharray={`${ringed * 2 * Math.PI * s * 0.62} 999`}
                      transform={`rotate(-90 ${s / 2} ${s / 2})`} /> : null}
                  </svg>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ ...caps(Wt, TYPE.label + 8), whiteSpace: "nowrap", opacity: clamp01(k(tFailEnd, 300) * 2) }}>{failed.text}</div>
            <div style={{ ...caps(INK_SUB, TYPE.label + 8), whiteSpace: "nowrap", opacity: clamp01(k(tThree, 300) * 2) }}>{three.text}</div>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
