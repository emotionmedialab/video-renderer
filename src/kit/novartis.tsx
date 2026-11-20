// ─────────────────────────────────────────────────────────────────────────
// KIT · novartis — A $1.94B SLICE OFF ONE ASSET. Added on the Novartis
// del-desiran impairment REEL, 2026-10-29 (VERTICAL 9:16). Absolute 1080×1920
// seats; import by path. Built 3D-first under one-mover (09-30), the frame
// budget (10-05), "busyness is the limit, not intensity" (10-22) and the
// camera rule (10-24: move only to follow a mover or push in on the claim).
//
// THE SPINE is THE COLUMN: del-desiran's carrying value as a bar in true
// proportion (7.48 → 5.54). Born in §3 where the $1.94B slice shears off it;
// called back in §5 for "still matters". Shared geometry in COL.
//
// On-screen limits (script.md comment): "impairment" / "partial", never
// "write-off"; growth figures carry "cc"; the deal is "~$12B"; the column is
// NOT drawn inside the deal (asset value vs price paid is not the VO's claim).
//
// Every onset is a spoken word with an optional ms pin, clamped monotonic.
// ─────────────────────────────────────────────────────────────────────────

import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { CLAMP, clamp01, COLORS, DISPLAY, TRACK, caps, inkA, useMs, useInkSub } from "./core";
import { LAYOUT, TYPE } from "../style";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { Camera, useCam3D, useP3, useZ, type CamKey } from "./camera";

const CAMERA_3D = true;
const ORIGIN: [number, number] = [540, 960];
const EASE = Easing.out(Easing.cubic);
const EASE_IO = Easing.inOut(Easing.cubic);
const EASE_IN = Easing.in(Easing.quad);
const fadeOut = (ms: number, to: number) => clamp01(interpolate(ms, [to - 300, to], [1, 0], CLAMP));
// overshoot for a weighted landing: 0 → ~1.08 → 1
const back = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : 1 + 2.4 * Math.pow(t - 1, 3) + 1.4 * Math.pow(t - 1, 2));

// the jagged break on the BOTTOM edge of the column's slice (% of the slice's height)
const CRACK = [[0, 52], [18, 44], [37, 57], [55, 46], [74, 58], [88, 47], [100, 53]];
const sliceBottomPoly = `polygon(0% 0%, 100% 0%, ${[...CRACK].reverse().map(([x, y]) => `${x}% ${100 - (58 - y)}%`).join(", ")})`;

// ══════════════════════════════════════════════════════════════════════════
// ImpairHook — "$1.94 billion, the size of the impairment Novartis just booked on del-desiran." (red)
// ══════════════════════════════════════════════════════════════════════════
// v3 (Nel 2026-10-29, "make it engaging"): the figure's characters FLY IN FROM DEEP Z one
// by one as "one point nine four" is spoken, tumbling on Y and landing as a solid
// EXTRUDED number (stacked shadows = depth). "billion" DROPS in with weight and the figure
// dips on its impact. On "impairment" a MINUS falls like a hammer into a gap that opens
// left of the figure: the figure recoils (squash) and the camera WHIP-pushes in:
// $1.94 → −$1.94, the charge read as a loss. "Partial impairment" lands under it.
// (v1 cracked the figure in two: unreadable. v2 blurred in and counted: flat.)
// "Novartis" stamps, the del-desiran plate joins it in the same row.
// Settled: −$1.94 + billion (hero) · the label · Novartis + plate.
export const HOOK = { figTop: 470, figSize: 240, minusW: 150, unitTop: 790, labelTop: 960, rowTop: 1170 };

// the extrusion: 14 stacked 1px steps down-right in a dark red, then a soft drop
const EXTRUDE = Array.from({ length: 14 }, (_, i) => `${i + 1}px ${i + 1}px 0 #8E0C14`).join(", ") + ", 22px 26px 30px rgba(0,0,0,0.28)";

export const ImpairHook: React.FC<Win & {
  figure: { value: number } & Cued; unit: { text: string } & Cued;
  crack: { text: string } & Cued; payer: { text: string } & Cued; asset: { text: string } & Cued;
}> = ({ from, to, figure, unit, crack, payer, asset }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const cam = useCam3D();
  const W = COLORS.paper;
  const H = HOOK;

  const tFig = at(figure, from, from);
  const tUnit = at(unit, tFig + 1700, from, tFig + 600);
  const tCrack = at(crack, tUnit + 2000, from, tUnit + 400);
  const tPayer = at(payer, tCrack + 600, from, tCrack + 300);
  const tAsset = at(asset, tPayer + 1200, from, tPayer + 300);
  const vis = fadeOut(ms, to);
  if (ms < tFig - 60 || vis <= 0) return null;

  // "one · point · nine · four": the characters land spread over the spoken figure
  const chars = `$${figure.value.toFixed(2)}`.split("");
  const span = Math.max(600, tUnit - tFig - 250);
  const landAt = [0, 0, 0.33, 0.6, 0.86].map((f) => tFig + f * span);
  // "billion" falls; its impact dips the figure
  const uf = k(tUnit, 300);
  const uy = -620 * (1 - EASE_IN(uf));
  const dip = 22 * Math.sin(Math.PI * k(tUnit + 300, 300));
  // the minus: the gap opens as it falls; it lands at ~70% and the figure squashes
  const gap = EASE(k(tCrack, 380));
  const mf = k(tCrack, 480);
  const my = mf < 0.7 ? -900 * (1 - EASE_IN(mf / 0.7)) : 0;
  const sq = mf >= 0.7 ? Math.sin(((mf - 0.7) / 0.3) * Math.PI) : 0;
  const stamp = (t: number) => {
    const s = k(t, 260);
    return { opacity: clamp01(s * 3), transform: `scale(${lerp(1.7, 1, EASE(s))})` };
  };
  // the whip push-in on the hammer's impact
  const keys: CamKey[] = [{ at: tCrack + 340, dur: 360, z: 170, y: -50 }];

  const fly = (t: number): React.CSSProperties => {
    const p = k(t, 440);
    const e = back(p);
    return {
      display: "inline-block", ...p3, opacity: clamp01(p * 5), textShadow: EXTRUDE,
      transform: `${z(-2400 * (1 - e))}rotateY(${(1 - EASE(p)) * -80}deg)${cam ? "" : ` scale(${lerp(0.2, 1, e)})`}`,
    };
  };

  return (
    <AbsoluteFill style={{ opacity: vis }}>
      <Camera on={CAMERA_3D} keys={keys} origin={ORIGIN}>
        {/* the figure row: [minus][characters], the minus slot opens on "impairment" */}
        <div style={{ position: "absolute", left: 0, top: H.figTop, width: 1080, display: "flex", justifyContent: "center", alignItems: "baseline", ...p3,
          fontFamily: DISPLAY, fontWeight: 700, fontSize: H.figSize, letterSpacing: TRACK.display, lineHeight: 1.1, color: W, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap",
          transformOrigin: "50% 100%", transform: `translateY(${dip}px) scale(${1 + 0.05 * sq}, ${1 - 0.07 * sq})` }}>
          <span style={{ display: "inline-block", width: H.minusW * gap, textAlign: "center", overflow: "visible" }}>
            {ms >= tCrack ? (
              <span style={{ display: "inline-block", textShadow: EXTRUDE, transformOrigin: "50% 80%", transform: `translateY(${my}px) scale(${1 + 0.18 * sq}, ${1 - 0.22 * sq})` }}>−</span>
            ) : null}
          </span>
          {chars.map((c, i) => (ms >= landAt[i] - 30 ? <span key={i} style={fly(landAt[i])}>{c}</span> : <span key={i} style={{ display: "inline-block", opacity: 0 }}>{c}</span>))}
        </div>
        <div style={{ position: "absolute", left: 0, width: 1080, top: H.unitTop, textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: TYPE.headline + 16,
          letterSpacing: TRACK.headline, color: W, opacity: clamp01(uf * 4), transform: `translateY(${uy}px)` }}>
          {unit.text}
        </div>
        <div style={{ position: "absolute", left: 0, width: 1080, top: H.labelTop, textAlign: "center", ...caps(W, TYPE.label + 4),
          opacity: k(tCrack + 200, 260), transform: `translateY(${(1 - EASE(k(tCrack + 200, 320))) * 20}px)` }}>
          {crack.text}
        </div>
        {/* Novartis stamps; the asset plate joins it in the same flex row (laid out by the strings) */}
        {ms >= tPayer ? (
          <div style={{ position: "absolute", left: 0, width: 1080, top: H.rowTop, display: "flex", justifyContent: "center", alignItems: "center", gap: 30 }}>
            <span style={{ display: "inline-block", fontFamily: DISPLAY, fontWeight: 700, fontSize: 92, letterSpacing: TRACK.headline, color: W, whiteSpace: "nowrap", ...stamp(tPayer) }}>
              {payer.text}
            </span>
            {ms >= tAsset ? (
              <span style={{ display: "inline-flex", alignItems: "center", height: 104, padding: "0 40px", borderRadius: 52, background: W, color: COLORS.accent,
                fontFamily: DISPLAY, fontWeight: 700, fontSize: 60, letterSpacing: TRACK.headline, whiteSpace: "nowrap",
                ...stamp(tAsset) }}>
                {asset.text}
              </span>
            ) : null}
          </div>
        ) : null}
      </Camera>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// TriggerMiss — "The trigger: September's Phase 3 HARBOR trial, missing its primary endpoint in DM1." (ink, scrim)
// ══════════════════════════════════════════════════════════════════════════
// A kicker; "Sep 2026" joins its row; on "Phase 3" the row retires and the HARBOR card
// FLIPS in on X from the floor. A dashed target ring draws on "trial"; on "missing" an
// arrow flies up from the lower left and passes WIDE of the ring and out of frame (the
// camera follows it); "Primary endpoint" lands, "Not met" slams (the scene's one red).
// The disease joins the card as its third line. The arrow retires by leaving.
// Settled: the card (3 lines) · the empty ring · endpoint label + Not met.
export const TRIG = { kickTop: 300, cardTop: 300, cardW: 900, ringX: 540, ringY: 1010, ringR: 150, labelTop: 1250, metTop: 1330 };

export const TriggerMiss: React.FC<Win & {
  kicker: { text: string } & Cued; date: { text: string } & Cued;
  card: { kicker: string; name: string } & Cued; ring: Cued; miss: Cued;
  endpoint: { text: string } & Cued; notMet: { text: string } & Cued; disease: { text: string } & Cued;
}> = ({ from, to, kicker, date, card, ring, miss, endpoint, notMet, disease }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const W = COLORS.paper;
  const sub = useInkSub();
  const T = TRIG;

  const tKick = at(kicker, from, from);
  const tDate = at(date, tKick + 800, from, tKick + 300);
  const tCard = at(card, tDate + 700, from, tDate + 300);
  const tRing = at(ring, tCard + 800, from, tCard + 300);
  const tMiss = at(miss, tRing + 800, from, tRing + 300);
  const tEnd = at(endpoint, tMiss + 300, from, tMiss + 200);
  const tMet = at(notMet, tEnd + 400, from, tEnd + 200);
  const tDis = at(disease, tMet + 500, from, tMet + 300);
  const vis = fadeOut(ms, to);
  if (ms < tKick - 60 || vis <= 0) return null;

  const rowOut = EASE_IN(k(tCard - 80, 300));
  const flip = back(k(tCard, 560));
  const ringK = EASE(k(tRing, 520));
  const C = 2 * Math.PI * T.ringR;
  // the arrow: from the left edge, rising, exits top-right
  const fly = EASE_IO(k(tMiss, 760));
  // passes ~190px above-right of the centre: misses the ring by ~40px, clears the card and the labels
  const P0 = [40, 980], P1 = [1240, 580];
  const ax = lerp(P0[0], P1[0], fly), ay = lerp(P0[1], P1[1], fly);
  const ang = (Math.atan2(P1[1] - P0[1], P1[0] - P0[0]) * 180) / Math.PI;
  const keys: CamKey[] = [{ at: tMiss, dur: 760, x: -70, y: 40, rz: -1.5 }];
  const stamp = (t: number) => {
    const s = k(t, 260);
    return { opacity: clamp01(s * 3), transform: `scale(${lerp(1.8, 1, EASE(s))})` };
  };

  return (
    <AbsoluteFill style={{ opacity: vis }}>
      <Camera on={CAMERA_3D} keys={keys} origin={ORIGIN}>
        {rowOut < 1 ? (
          <div style={{ position: "absolute", left: 0, width: 1080, top: T.kickTop, display: "flex", justifyContent: "center", alignItems: "center", gap: 24,
            opacity: 1 - rowOut, transform: `translateY(${-120 * rowOut}px)` }}>
            <span style={{ ...caps(W, TYPE.label + 8), opacity: k(tKick, 240) }}>{kicker.text}</span>
            {ms >= tDate ? (
              <span style={{ ...caps(COLORS.ink, TYPE.label + 4), background: W, borderRadius: 30, padding: "10px 26px", whiteSpace: "nowrap", ...stamp(tDate) }}>{date.text}</span>
            ) : null}
          </div>
        ) : null}

        {/* the HARBOR card flips up off the floor on X */}
        {ms >= tCard ? (
          <div style={{ position: "absolute", left: 540 - T.cardW / 2, top: T.cardTop, width: T.cardW, ...p3, transformOrigin: "50% 100%",
            transform: `${z(0)}rotateX(${(1 - flip) * -90}deg)` }}>
            <div style={{ border: `6px solid ${W}`, borderRadius: 28, padding: "34px 40px 30px", background: inkA(0.55), textAlign: "center" }}>
              <div style={{ ...caps(sub, TYPE.label) }}>{card.kicker}</div>
              <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 150, letterSpacing: TRACK.display, lineHeight: 1.05, color: W }}>{card.name}</div>
              <div style={{ overflow: "hidden", height: lerp(0, 56, EASE(k(tDis, 360))) }}>
                <div style={{ ...caps(W, TYPE.label - 4), paddingTop: 10, whiteSpace: "nowrap", opacity: k(tDis + 120, 240) }}>{disease.text}</div>
              </div>
            </div>
          </div>
        ) : null}

        {/* the target: dashed ring + a centre dot, drawn on "trial" */}
        {ms >= tRing ? (
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <circle cx={T.ringX} cy={T.ringY} r={T.ringR} fill="none" stroke={W} strokeWidth={8} strokeDasharray={`${C * ringK} ${C}`}
              transform={`rotate(-90 ${T.ringX} ${T.ringY})`} />
            <circle cx={T.ringX} cy={T.ringY} r={T.ringR * 0.55} fill="none" stroke={sub} strokeWidth={5} strokeDasharray="14 12" opacity={clamp01(ringK * 2 - 1)} />
            <circle cx={T.ringX} cy={T.ringY} r={16 * ringK} fill={W} />
          </svg>
        ) : null}

        {/* the arrow flies past and leaves: nothing of it stays */}
        {ms >= tMiss && fly < 1 ? (
          <div style={{ position: "absolute", left: ax - 130, top: ay - 18, width: 260, height: 36, transform: `${z(80)}rotate(${ang}deg)` }}>
            <svg width={260} height={36} style={{ overflow: "visible" }}>
              <line x1={0} y1={18} x2={220} y2={18} stroke={W} strokeWidth={10} strokeLinecap="round" />
              <polygon points="210,0 260,18 210,36" fill={W} />
            </svg>
          </div>
        ) : null}

        <div style={{ position: "absolute", left: 0, width: 1080, top: T.labelTop, textAlign: "center", ...caps(W, TYPE.label + 8),
          opacity: k(tEnd, 240), transform: `translateY(${(1 - EASE(k(tEnd, 300))) * 20}px)` }}>
          {endpoint.text}
        </div>
        {ms >= tMet ? (
          <div style={{ position: "absolute", left: 0, width: 1080, top: T.metTop, display: "flex", justifyContent: "center" }}>
            <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 72, letterSpacing: TRACK.headline, color: W, background: COLORS.accent,
              borderRadius: 20, padding: "8px 38px", whiteSpace: "nowrap", ...stamp(tMet) }}>{notMet.text}</div>
          </div>
        ) : null}
      </Camera>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// THE COLUMN — del-desiran's carrying value, true proportion. Shared with §5.
// ══════════════════════════════════════════════════════════════════════════
export const COL = { cx: 400, w: 300, base: 1500, pxPerB: 125, readX: 590 };
export const colTop = (b: number) => COL.base - b * COL.pxPerB;

// ══════════════════════════════════════════════════════════════════════════
// DealColumn — "Novartis closed the $12 billion Avidity acquisition in February. That lead
// asset's carrying value just dropped from $7.48 billion to $5.54 billion." (paper)
// ══════════════════════════════════════════════════════════════════════════
// Page 1: "Novartis" kicker; "~$12B" counts as voiced; "Avidity" slams; a "Closed Feb 2026"
// chip. Page 2 ("That"): the deal group shrinks to a chip at the top; THE COLUMN rises from
// its base; its label lands on "carrying value"; "$7.48B" lands on top as voiced. On "to"
// the top 1.94/7.48 of the column CRACKS off, turns red, carries "$1.94B" (the hook's
// figure) and falls out of frame (the camera cranes down after it); the readout rides down
// to the new top and counts to $5.54B; a grey "was $7.48B" stays at the old height.
// Settled p2: column + $5.54B (hero) · was $7.48B · the deal chip.
export const DEAL = { kickTop: 330, figTop: 400, figSize: 230, nameTop: 680, chipTop: 850 };

export const DealColumn: React.FC<Win & {
  kicker: { text: string } & Cued; figure: { value: number } & Cued; name: { text: string } & Cued; closed: { text: string } & Cued;
  turn: Cued; rise: Cued; label: { text: string } & Cued;
  before: { value: number; text: string } & Cued; cut: { text: string } & Cued; after: { value: number } & Cued; settle: Cued;
  was: string;
}> = ({ from, to, kicker, figure, name, closed, turn, rise, label, before, cut, after, settle, was }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const INK = COLORS.ink;
  const SUB = inkA(0.5);
  const D = DEAL;

  const tKick = at(kicker, from, from);
  const tFig = at(figure, tKick + 1200, from, tKick + 300);
  const tName = at(name, tFig + 1000, from, tFig + 300);
  const tClosed = at(closed, tName + 1400, from, tName + 300);
  const tTurn = at(turn, tClosed + 900, from, tClosed + 300);
  const tRise = at(rise, tTurn + 450, from, tTurn + 250);
  const tLabel = at(label, tRise + 800, from, tRise + 300);
  const tBefore = at(before, tLabel + 2000, from, tLabel + 300);
  const tCut = at(cut, tBefore + 1400, from, tBefore + 300);
  const tAfter = at(after, tCut + 200, from, tCut + 100);
  const tSettle = at(settle, tAfter + 900, from, tAfter + 300);
  const vis = fadeOut(ms, to);
  if (ms < tKick - 60 || vis <= 0) return null;

  // page 1 → the chip
  const shrink = EASE_IO(k(tTurn, 520));
  const q12 = EASE_IO(k(tFig, Math.max(500, tName - tFig - 120)));
  const stamp = (t: number) => {
    const s = k(t, 260);
    return { opacity: clamp01(s * 3), transform: `scale(${lerp(1.7, 1, EASE(s))})` };
  };

  // the column
  const riseK = back(k(tRise, 640));
  const fullTop = colTop(before.value);
  const newTop = colTop(after.value);
  const hFull = (COL.base - fullTop) * riseK;
  const crackK = k(tCut, 220); // the break shows, the slice reddens
  const fallK = EASE_IN(k(tCut + 220, 900));
  const sliceH = newTop - fullTop;
  // readout: lands with "$7.48", rides down + counts on "$5.54"
  const ride = EASE_IO(k(tAfter, Math.max(500, tSettle - tAfter)));
  const readV = ms < tAfter ? before.value * EASE(k(tBefore, 380)) : lerp(before.value, after.value, ride);
  const readTop = lerp(fullTop, newTop, ride) - 40;
  const keys: CamKey[] = [
    { at: tCut + 220, dur: 700, rx: 7, y: -100 }, // crane after the falling slice
    { at: tSettle, dur: 700, rx: 0, y: 0, z: 80, x: -60 }, // push in on the new value (keeps the readout on the card)
  ];

  const card = LAYOUT.card;

  return (
    <AbsoluteFill style={{ opacity: vis, clipPath: `inset(${card.top}px ${card.right}px ${card.bottom}px ${card.left}px round ${card.radius}px)` }}>
      <Camera on={CAMERA_3D} keys={keys} origin={ORIGIN}>
        {/* page 1: the deal, shrinking to a chip at the top on "That" */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transformOrigin: `540px ${D.kickTop}px`,
          transform: `translateY(${-150 * shrink}px) scale(${lerp(1, 0.4, shrink)})` }}>
          <div style={{ position: "absolute", left: 0, width: 1080, top: D.kickTop, textAlign: "center", ...caps(SUB, TYPE.label + 8), opacity: k(tKick, 240) * (1 - shrink) }}>
            {kicker.text}
          </div>
          {ms >= tFig ? (
            <div style={{ position: "absolute", left: 0, width: 1080, top: D.figTop, textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: D.figSize,
              letterSpacing: TRACK.display, lineHeight: 1, color: INK, fontVariantNumeric: "tabular-nums", ...stamp(tFig) }}>
              ~${Math.round(figure.value * q12)}B
            </div>
          ) : null}
          {ms >= tName ? (
            <div style={{ position: "absolute", left: 0, width: 1080, top: D.nameTop, textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: TYPE.headline + 20,
              letterSpacing: TRACK.headline, color: INK, transform: `translateY(${(1 - back(k(tName, 460))) * 120}px)`, opacity: clamp01(k(tName, 160) * 3) }}>
              {name.text}
            </div>
          ) : null}
          {ms >= tClosed ? (
            <div style={{ position: "absolute", left: 0, width: 1080, top: D.chipTop, display: "flex", justifyContent: "center" }}>
              <div style={{ ...caps(INK, TYPE.label + 6), border: `5px solid ${INK}`, borderRadius: 40, padding: "12px 34px", whiteSpace: "nowrap", ...stamp(tClosed) }}>{closed.text}</div>
            </div>
          ) : null}
        </div>

        {/* page 2: THE COLUMN */}
        {ms >= tRise ? (
          <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, ...p3 }}>
            {/* the body that stays: base → new top (the full height until the cut) */}
            <div style={{ position: "absolute", left: COL.cx - COL.w / 2, width: COL.w, top: COL.base - Math.min(hFull, COL.base - newTop),
              height: Math.min(hFull, COL.base - newTop), background: INK, borderRadius: "0 0 10px 10px" }} />
            {/* the slice: the top 1.94 — part of the column until "to", then cracks, reddens, falls */}
            {hFull > COL.base - newTop && fallK < 1 ? (
              <div style={{ position: "absolute", left: COL.cx - COL.w / 2, width: COL.w, top: COL.base - hFull, height: hFull - (COL.base - newTop) + 1,
                transformOrigin: "100% 100%", transform: `${z(140 * fallK)}translateY(${fallK * 1300}px) rotate(${fallK * 24}deg)` }}>
                <div style={{ position: "absolute", inset: 0, background: crackK > 0 ? COLORS.accent : INK, borderRadius: "10px 10px 0 0",
                  clipPath: crackK > 0 ? sliceBottomPoly : undefined }} />
                {crackK > 0 ? (
                  <div style={{ position: "absolute", left: 0, width: COL.w, top: sliceH / 2 - 34, textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: 64,
                    letterSpacing: TRACK.headline, color: COLORS.paper, opacity: crackK }}>{cut.text}</div>
                ) : null}
              </div>
            ) : null}
            {/* the column's label, under the base */}
            <div style={{ position: "absolute", left: COL.cx - COL.w / 2, top: COL.base + 24, whiteSpace: "nowrap", ...caps(INK, TYPE.label - 4),
              opacity: k(tLabel, 240), transform: `translateY(${(1 - EASE(k(tLabel, 300))) * 16}px)` }}>
              {label.text}
            </div>
            {/* the old height, grey, once the readout has left it */}
            {ms >= tAfter ? (
              <div style={{ position: "absolute", left: COL.readX, top: fullTop - 34, ...caps(SUB, TYPE.label + 4), whiteSpace: "nowrap", opacity: k(tAfter + 450, 300) }}>
                {was}
              </div>
            ) : null}
            {/* the readout */}
            {ms >= tBefore ? (
              <div style={{ position: "absolute", left: COL.readX, top: readTop, fontFamily: DISPLAY, fontWeight: 700, fontSize: 120, letterSpacing: TRACK.display,
                lineHeight: 1, color: INK, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", opacity: clamp01(k(tBefore, 160) * 3) }}>
                ${readV.toFixed(2)}B
              </div>
            ) : null}
          </div>
        ) : null}
      </Camera>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// CoreHolds — "Yet Q3 core operating income grew 10%. Core EPS grew 8%. And Novartis raised
// full-year core operating income guidance to low single-digit growth, from an earlier call
// for decline." (red)
// ══════════════════════════════════════════════════════════════════════════
// Page 1: "Yet" SLAMS from the lens and is thrown up and out on "core"; each stat's label
// lands on its own words, then its figure RISES out of the floor on an up-arrow and counts
// as voiced. Page 2 ("And Novartis"): both stats drop out of frame under gravity; the
// guidance arrow draws pointing DOWN; on "raised" it SWINGS up through 3D; "growth" stamps
// the new guide (the scene's one emphasis, white plate) and the camera pushes in on it;
// "decline" lands small and grey under it.
// Settled p1: two stats. p2: the arrow (hero) · the guide plate (with its title) · was-decline.
export const HOLD = { yetTop: 760, aTop: 470, bTop: 920, numSize: 210, arrow: { x: 230, y: 1010, len: 600, down: 26, up: -30 }, titleTop: 1170, plateTop: 1230, wasTop: 1370 };

const UpArrow: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size * 0.62} height={size} viewBox="0 0 62 100" style={{ display: "block" }}>
    <polygon points="31,0 62,38 42,38 42,100 20,100 20,38 0,38" fill={color} />
  </svg>
);

type Stat = { label: string; value: number; labelWord: string } & Cued;

export const CoreHolds: React.FC<Win & {
  yet: { text: string } & Cued; a: Stat; b: Stat;
  turn: Cued; raised: Cued; title: { text: string } & Cued; growth: { text: string } & Cued; was: { text: string } & Cued;
}> = ({ from, to, yet, a, b, turn, raised, title, growth, was }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const W = COLORS.paper;
  const sub = useInkSub();
  const H = HOLD;

  const tYet = at(yet, from, from);
  const tAL = at({ word: a.labelWord }, tYet + 450, from, tYet + 250);
  const tA = at(a, tAL + 2000, from, tAL + 400);
  const tBL = at({ word: b.labelWord }, tA + 800, from, tA + 300);
  const tB = at(b, tBL + 1400, from, tBL + 300);
  const tTurn = at(turn, tB + 900, from, tB + 300);
  const tRaise = at(raised, tTurn + 650, from, tTurn + 300);
  const tTitle = at(title, tRaise + 400, from, tRaise + 200);
  const tGrowth = at(growth, tTitle + 3200, from, tTitle + 400);
  const tWas = at(was, tGrowth + 1900, from, tGrowth + 400);
  const vis = fadeOut(ms, to);
  if (ms < tYet - 60 || vis <= 0) return null;

  const yetIn = EASE(k(tYet, 300));
  const yetOut = EASE_IN(k(tAL, 360));
  const dropOut = EASE_IN(k(tTurn - 60, 520));
  const arrowDraw = EASE(k(tTurn + 120, 380));
  const swing = back(k(tRaise, 700));
  const ang = lerp(H.arrow.down, H.arrow.up, swing);
  const keys: CamKey[] = [{ at: tGrowth, dur: 650, z: 110, y: -150 }];

  const stat = (s: Stat, tL: number, tN: number, top: number) => {
    const rise = back(k(tN, 520));
    const q = EASE_IO(k(tN, 600));
    return (
      <div style={{ position: "absolute", left: 0, width: 1080, top }}>
        <div style={{ textAlign: "center", ...caps(sub, TYPE.label), opacity: k(tL, 240), transform: `translateY(${(1 - EASE(k(tL, 300))) * 16}px)` }}>{s.label}</div>
        {ms >= tN ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 34, marginTop: 14, transform: `translateY(${(1 - rise) * 260}px)`, opacity: clamp01(k(tN, 140) * 3) }}>
            <UpArrow size={H.numSize * 0.78} color={W} />
            <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: H.numSize, letterSpacing: TRACK.display, lineHeight: 1, color: W, fontVariantNumeric: "tabular-nums" }}>
              +{Math.round(s.value * q)}%
            </span>
          </div>
        ) : null}
      </div>
    );
  };

  const A = H.arrow;
  return (
    <AbsoluteFill style={{ opacity: vis }}>
      <Camera on={CAMERA_3D} keys={keys} origin={ORIGIN}>
        {/* "Yet": from the lens, thrown up and out on "core" */}
        {yetOut < 1 ? (
          <div style={{ position: "absolute", left: 0, width: 1080, top: H.yetTop, textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: 260,
            letterSpacing: TRACK.display, lineHeight: 1, color: W, opacity: clamp01(yetIn * 3) * (1 - yetOut),
            transform: `translateY(${-700 * yetOut}px) scale(${lerp(3, 1, yetIn)})` }}>
            {yet.text}
          </div>
        ) : null}

        {/* page 1: the two stats, dropped out of frame on "And Novartis" */}
        {dropOut < 1 ? (
          <div style={{ position: "absolute", inset: 0, transform: `translateY(${dropOut * 1500}px) rotate(${dropOut * 6}deg)`, transformOrigin: "540px 900px" }}>
            {stat(a, tAL, tA, H.aTop)}
            {ms >= tBL ? stat(b, tBL, tB, H.bTop) : null}
          </div>
        ) : null}

        {/* page 2: the guidance arrow, pivoting on its tail; swings up through 3D on "raised" */}
        {ms >= tTurn ? (
          <div style={{ position: "absolute", left: A.x, top: A.y - 40, width: A.len, height: 80, ...p3, transformOrigin: "0% 50%",
            transform: `${z(0)}rotate(${ang}deg) rotateX(${Math.sin(swing * Math.PI) * 35}deg)` }}>
            <svg width={A.len} height={80} style={{ overflow: "visible" }}>
              <line x1={0} y1={40} x2={(A.len - 70) * arrowDraw} y2={40} stroke={W} strokeWidth={30} strokeLinecap="round" />
              {arrowDraw > 0.85 ? <polygon points={`${A.len - 90},0 ${A.len},40 ${A.len - 90},80`} fill={W} /> : null}
            </svg>
          </div>
        ) : null}
        <div style={{ position: "absolute", left: 0, width: 1080, top: H.titleTop, textAlign: "center", ...caps(sub, TYPE.label),
          opacity: k(tTitle, 260), transform: `translateY(${(1 - EASE(k(tTitle, 300))) * 16}px)` }}>
          {title.text}
        </div>
        {ms >= tGrowth ? (
          <div style={{ position: "absolute", left: 0, width: 1080, top: H.plateTop, display: "flex", justifyContent: "center" }}>
            <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 62, letterSpacing: TRACK.headline, color: COLORS.accent, background: W, borderRadius: 24,
              padding: "12px 40px", whiteSpace: "nowrap", opacity: clamp01(k(tGrowth, 260) * 3), transform: `scale(${lerp(1.7, 1, EASE(k(tGrowth, 260)))})` }}>
              {growth.text}
            </div>
          </div>
        ) : null}
        <div style={{ position: "absolute", left: 0, width: 1080, top: H.wasTop, textAlign: "center", ...caps(sub, TYPE.label),
          opacity: k(tWas, 260), transform: `translateY(${(1 - EASE(k(tWas, 300))) * 16}px)` }}>
          {was.text}
        </div>
      </Camera>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// Translation — "Translation. Book the loss. Defend the platform. Raise the guide. The market
// gets to decide if the lead asset still matters," (paper)
// ══════════════════════════════════════════════════════════════════════════
// Page 1: "Translation" slams; three rows, each landing on its verb as ONE move: a glyph
// drops onto its seat as the words whip in from the right. Each glyph calls back: the red
// slice (§3, the page's one red), a platform slab, the up arrow (§4).
// Page 2 ("The market"): the page slides out left; THE COLUMN returns on its §3 seats at
// $5.54B with its label; "The market decides" lands; "Still matters?" stamps on its words
// (the "?" in red) and the camera pushes in on the column.
// Settled p1: title + three rows. p2: column + readout (hero) · the question (with its kicker) · label.
export const TRANS = { titleTop: 300, rowTops: [560, 800, 1040], glyphX: 100, textX: 300, rowSize: 66, kickTop: 260, qTop: 310 };

const Glyph: React.FC<{ kind: "slice" | "platform" | "arrow"; color: string; red: string }> = ({ kind, color, red }) => {
  if (kind === "slice") return <div style={{ width: 150, height: 74, background: red, borderRadius: "10px 10px 0 0", clipPath: sliceBottomPoly }} />;
  if (kind === "platform")
    return (
      <div style={{ width: 160, height: 74, position: "relative" }}>
        <div style={{ position: "absolute", left: 30, right: 30, top: 10, height: 26, background: color, borderRadius: 6 }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 30, background: color, borderRadius: 6 }} />
      </div>
    );
  return (
    <svg width={160} height={90} viewBox="0 0 160 90" style={{ display: "block", overflow: "visible" }}>
      <line x1={10} y1={80} x2={126} y2={22} stroke={color} strokeWidth={18} strokeLinecap="round" />
      <polygon points="104,0 156,8 130,54" fill={color} />
    </svg>
  );
};

export const Translation: React.FC<Win & {
  title: { text: string } & Cued;
  rows: [{ text: string } & Cued, { text: string } & Cued, { text: string } & Cued];
  turn: Cued; kicker: { text: string } & Cued; question: { text: string } & Cued;
  column: { value: number; label: string };
}> = ({ from, to, title, rows, turn, kicker, question, column }) => {
  const ms = useMs();
  const k = useK();
  const INK = COLORS.ink;
  const T = TRANS;

  const tTitle = at(title, from, from);
  const t0 = at(rows[0], tTitle + 1100, from, tTitle + 300);
  const t1 = at(rows[1], t0 + 1200, from, t0 + 300);
  const t2 = at(rows[2], t1 + 1400, from, t1 + 300);
  const tR = [t0, t1, t2];
  const tTurn = at(turn, t2 + 1300, from, t2 + 400);
  const tKick = at(kicker, tTurn + 200, from, tTurn);
  const tQ = at(question, tKick + 2000, from, tKick + 400);
  const vis = fadeOut(ms, to);
  if (ms < tTitle - 60 || vis <= 0) return null;

  const out = EASE_IN(k(tTurn - 40, 460));
  const colRise = back(k(tTurn + 300, 620));
  const top = colTop(column.value);
  const h = (COL.base - top) * colRise;
  const keys: CamKey[] = [{ at: tQ + 250, dur: 700, z: 110, x: -60, y: -40 }];
  const card = LAYOUT.card;
  const kinds = ["slice", "platform", "arrow"] as const;

  return (
    <AbsoluteFill style={{ opacity: vis, clipPath: `inset(${card.top}px ${card.right}px ${card.bottom}px ${card.left}px round ${card.radius}px)` }}>
      <Camera on={CAMERA_3D} keys={keys} origin={ORIGIN}>
        {/* page 1 */}
        {out < 1 ? (
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${-1200 * out}px)` }}>
            <div style={{ position: "absolute", left: 0, width: 1080, top: T.titleTop, textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: TYPE.display,
              letterSpacing: TRACK.display, lineHeight: 1, color: INK, opacity: clamp01(k(tTitle, 200) * 3), transform: `scale(${lerp(1.8, 1, EASE(k(tTitle, 300)))})` }}>
              {title.text}
            </div>
            {rows.map((r, i) => {
              if (ms < tR[i]) return null;
              const g = back(k(tR[i], 460));
              const w = EASE(k(tR[i], 340));
              return (
                <div key={i} style={{ position: "absolute", left: 0, top: T.rowTops[i], width: 1080, height: 120 }}>
                  <div style={{ position: "absolute", left: T.glyphX, top: 20, transform: `translateY(${(1 - g) * -420}px)` }}>
                    <Glyph kind={kinds[i]} color={INK} red={COLORS.accent} />
                  </div>
                  <div style={{ position: "absolute", left: T.textX, top: 16, fontFamily: DISPLAY, fontWeight: 700, fontSize: T.rowSize, letterSpacing: TRACK.headline,
                    lineHeight: 1.2, color: INK, whiteSpace: "nowrap", opacity: clamp01(w * 3), transform: `translateX(${(1 - w) * 640}px) skewX(${(1 - w) * -16}deg)` }}>
                    {r.text}
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        {/* page 2: THE COLUMN returns on its §3 seats */}
        {ms >= tTurn + 300 ? (
          <>
            <div style={{ position: "absolute", left: COL.cx - COL.w / 2, width: COL.w, top: COL.base - h, height: h, background: INK, borderRadius: 10 }} />
            <div style={{ position: "absolute", left: COL.readX, top: top - 40, fontFamily: DISPLAY, fontWeight: 700, fontSize: 120, letterSpacing: TRACK.display,
              lineHeight: 1, color: INK, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", opacity: clamp01(k(tTurn + 600, 200) * 3) }}>
              ${column.value.toFixed(2)}B
            </div>
            <div style={{ position: "absolute", left: COL.cx - COL.w / 2, top: COL.base + 24, whiteSpace: "nowrap", ...caps(INK, TYPE.label - 4), opacity: k(tTurn + 600, 260) }}>
              {column.label}
            </div>
          </>
        ) : null}
        <div style={{ position: "absolute", left: 0, width: 1080, top: T.kickTop, textAlign: "center", ...caps(inkA(0.5), TYPE.label + 4),
          opacity: k(tKick + 200, 260) }}>
          {kicker.text}
        </div>
        {ms >= tQ ? (
          <div style={{ position: "absolute", left: 0, width: 1080, top: T.qTop, textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: TYPE.headline + 24,
            letterSpacing: TRACK.headline, lineHeight: 1.05, color: INK, whiteSpace: "nowrap",
            opacity: clamp01(k(tQ, 200) * 3), transform: `scale(${lerp(1.7, 1, EASE(k(tQ, 280)))})` }}>
            {question.text.replace(/\?$/, "")}<span style={{ color: COLORS.accent }}>?</span>
          </div>
        ) : null}
      </Camera>
    </AbsoluteFill>
  );
};
