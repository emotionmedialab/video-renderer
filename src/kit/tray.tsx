// ─────────────────────────────────────────────────────────────────────────
// KIT · tray — THE TRAY spine + the §2/§3 blocks of the Roche × Hansoh HORIZONTAL
// long-form, 2026-10-24 (absolute 1920x1080 seats). Same motion law as ./hansoh:
// one designed mover per cue, landed things go still, nothing loops.
//
// `Tray` — two Hansoh program cards (SOLID: they exist, preclinical, target slot
//   dashed) and three DASHED cards for "multiple programs built on targets Roche
//   proposes" (no count is given; three stand for "multiple"), on Hansoh's platform
//   slab. Every element takes its own progress so later sections can call it back.
// `TrayBuild` (black, §2): the kicker rises; two cards DROP and bounce; "Preclinical"
//   slams in; three dashed cards are DEALT in like a fanned hand; "Roche-proposed"
//   writes in; the slab RISES under them and every card hops once; its label
//   tightens in; an opaque red "Not named" stamp slams with a squash.
// `HandOff` (white card, §3): a pill drops at the start of a track that draws itself
//   (solid to the end of Phase 1A, dashed after); the marker shoots up; Hansoh rides
//   to it; Roche DROPS onto it and Hansoh is nudged off; Roche rides on; the camera
//   PANS up and Roche's world rises; each of the four markets ARCS out of it into
//   Hansoh's tray; the tray's frame turns red on "four".
// ─────────────────────────────────────────────────────────────────────────

import React from "react";
import { Easing, interpolate, interpolateColors } from "remotion";
import { CLAMP, clamp01, COLORS, INK_SUB, inkA, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { big, label } from "./rona";
import { Letters } from "./hunt";
import { useP3, useZ } from "./camera";

const EASE = Easing.out(Easing.cubic);
const EASE_IO = Easing.inOut(Easing.cubic);
const EASE_EXPO = Easing.out(Easing.exp);
const BACK = Easing.out(Easing.back(1.6));
const BOUNCE = Easing.out(Easing.bounce);

// ══════════════════════════════════════════════════════════════════════════
// THE TRAY
// ══════════════════════════════════════════════════════════════════════════
export const TRAY = { x: 160, top: 330, cardW: 280, cardH: 320, gap: 50, slabTop: 670, slabH: 96 };
export type TrayState = {
  solid: number[]; // per solid card: drop-in 0..1 (bounce)
  stage: number; // "Preclinical" slams in
  dashed: number[]; // per dashed card: dealt in 0..1
  proposed: number; // "Roche-proposed" writes in
  slab: number; // the platform rises under the cards
  slabLabel: number; // its label tightens in
  lift?: number[]; // per card (0..4): lifted off the tray 0..1 (the option, §5)
  dim?: number[]; // per card (0..4): pushed back to 30% 0..1 (the cards not picked)
};
export const trayCardX = (i: number) => TRAY.x + i * (TRAY.cardW + TRAY.gap);
export const TRAY_W = 5 * TRAY.cardW + 4 * TRAY.gap;

export const Tray: React.FC<{ s: TrayState; tone: "light" | "dark"; slabText: string; stageText: string; proposedText: [string, string] }> = ({
  s, tone, slabText, stageText, proposedText,
}) => {
  const fg = tone === "light" ? COLORS.paper : COLORS.ink; // the plate colour
  const on = tone === "light" ? COLORS.ink : COLORS.paper; // type on a plate
  const sub = tone === "light" ? inkA(0.55) : "rgba(255,255,255,0.62)"; // secondary type on a plate
  const lineSub = tone === "light" ? INK_SUB : inkA(0.55); // secondary type off a plate
  const T = TRAY;
  const Z = useZ(); // depth (camera on) or "" (flat)
  const P3 = useP3();
  const zs = (z: number, st: React.CSSProperties = {}): React.CSSProperties => ({ ...P3, ...st, transform: Z(z) + (st.transform ?? "") });
  // the slab's arrival hops every card up and down once
  const hop = s.slab > 0 && s.slab < 1 ? Math.sin(clamp01((s.slab - 0.55) / 0.45) * Math.PI) * -22 : 0;
  const liftY = (i: number) => -EASE(s.lift?.[i] ?? 0) * 70;
  const dimO = (i: number) => 1 - 0.7 * (s.dim?.[i] ?? 0);
  return (
    <>
      {s.slab > 0 ? (
        <div style={{ ...zs(-30), position: "absolute", left: T.x - 20, top: T.slabTop + (1 - EASE(s.slab)) * 260, width: TRAY_W + 40, height: T.slabH, borderRadius: 18,
          background: fg, opacity: clamp01(s.slab * 3), display: "flex", alignItems: "center", justifyContent: "center" }}>
          {s.slabLabel > 0 ? (
            <span style={{ ...big(on, 46), opacity: clamp01(s.slabLabel * 3), letterSpacing: `${lerp(0.35, -0.042, EASE(s.slabLabel))}em` }}>{slabText}</span>
          ) : null}
        </div>
      ) : null}
      {[0, 1].map((i) => {
        const q = s.solid[i] ?? 0;
        if (q <= 0) return null;
        const sq = s.stage;
        return (
          <div key={`s${i}`} style={{ position: "absolute", left: trayCardX(i), top: T.top + hop + liftY(i), width: T.cardW, height: T.cardH, borderRadius: 22, background: fg,
            transform: `${Z(lerp(900, 20, BOUNCE(q)))}translateY(${(1 - BOUNCE(q)) * -700}px)`, opacity: clamp01(q * 6) * dimO(i) }}>
            <div style={{ position: "absolute", left: 28, top: 30, ...label(sub, 26) }}>Stage</div>
            {sq > 0 ? (
              <div style={{ position: "absolute", left: 28, top: 70, ...big(on, 34), /* 11 glyphs x 0.58em x 34 = 217px of a 224px plate */ opacity: clamp01(sq * 4), transformOrigin: "0% 50%", transform: `scale(${lerp(1.5, 1, BACK(sq))})` }}>
                {stageText}
              </div>
            ) : null}
            <div style={{ position: "absolute", left: 28, top: 160, ...label(sub, 26) }}>Target</div>
            <svg style={{ position: "absolute", left: 24, top: 196 }} width={T.cardW - 48} height={80}>
              <rect x={2} y={2} width={T.cardW - 52} height={76} rx={12} fill="none" stroke={sub} strokeWidth={3} strokeDasharray="12 9" />
            </svg>
          </div>
        );
      })}
      {[0, 1, 2].map((j) => {
        const q = s.dashed[j] ?? 0;
        if (q <= 0) return null;
        const i = j + 2;
        const e = EASE_EXPO(q);
        return (
          <div key={`d${j}`} style={{ position: "absolute", left: trayCardX(i), top: T.top + hop + liftY(i), width: T.cardW, height: T.cardH,
            transform: `${Z(lerp(-900, 20, e))}translateX(${(1 - e) * (1200 - j * 120)}px) rotate(${(1 - e) * (14 + j * 6)}deg)`, opacity: clamp01(q * 4) * dimO(i) }}>
            <svg style={{ position: "absolute", inset: 0 }} width={T.cardW} height={T.cardH}>
              <rect x={3} y={3} width={T.cardW - 6} height={T.cardH - 6} rx={22} fill="none" stroke={fg} strokeWidth={5} strokeDasharray="20 13" />
            </svg>
            <div style={{ position: "absolute", left: 30, top: 30, ...label(lineSub, 26) }}>Target</div>
            {s.proposed > 0 ? (
              <div style={{ position: "absolute", left: 30, top: 70, opacity: clamp01(s.proposed * 3), transform: `translateY(${(1 - EASE(s.proposed)) * 16}px)` }}>
                <div style={{ ...big(fg, 40) }}>{proposedText[0]}</div>
                <div style={{ ...big(fg, 40), marginTop: 6 }}>{proposedText[1]}</div>
              </div>
            ) : null}
          </div>
        );
      })}
    </>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// TrayBuild — §2 "What Roche is buying" (black world)
// ══════════════════════════════════════════════════════════════════════════
export const TrayBuild: React.FC<Win & {
  kicker: { text: string } & Cued; // "what"
  two: Cued; // "Two": the two cards drop
  stage: { text: string } & Cued; // "preclinical": slams in
  multiple: Cued; // "multiple": three dashed cards are dealt in
  proposed: { lines: [string, string] } & Cued; // "proposes"
  slab: { text: string } & Cued; // "Hansoh's": the platform rises under them
  slabLabel: Cued; // "technology platform"
  stamp: { text: string } & Cued; // "None": the red stamp
}> = ({ from, to, kicker, two, stage, multiple, proposed, slab, slabLabel, stamp }) => {
  const ms = useMs();
  const k = useK();
  const tK = at(kicker, from + 300, from);
  const tTwo = at(two, tK + 1500, from, tK + 300);
  const tSt = at(stage, tTwo + 400, from, tTwo + 250);
  const tM = at(multiple, tSt + 2500, from, tSt + 400);
  const tP = at(proposed, tM + 2500, from, tM + 600);
  const tS = at(slab, tP + 1300, from, tP + 300);
  const tSL = at(slabLabel, tS + 1000, from, tS + 400);
  const tX = at(stamp, tSL + 1500, from, tSL + 300);
  const Z = useZ(); // depth (camera on) or "" (flat)
  const P3 = useP3();
  const zs = (z: number, st: React.CSSProperties = {}): React.CSSProperties => ({ ...P3, ...st, transform: Z(z) + (st.transform ?? "") });
  const vis = clamp01(interpolate(ms, [from - 100, from + 150, to - 250, to], [0, 1, 1, 0], CLAMP));
  if (vis <= 0) return null;
  const s: TrayState = {
    solid: [clamp01((ms - tTwo) / 700), clamp01((ms - tTwo - 140) / 700)],
    stage: k(tSt, 300),
    dashed: [0, 1, 2].map((j) => clamp01((ms - tM - j * 160) / 560)),
    proposed: k(tP, 500),
    slab: clamp01((ms - tS) / 700),
    slabLabel: k(tSL, 600),
  };
  const xq = clamp01((ms - tX) / 380);
  const dashedCx = trayCardX(2) + (3 * TRAY.cardW + 2 * TRAY.gap) / 2;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: vis, ...P3 }}>
      <div style={zs(60, { position: "absolute", left: TRAY.x, top: 130 })}>
        {ms >= tK ? <Letters text={kicker.text} t={tK} mode="rise" stagger={24} style={{ ...big(COLORS.paper, 72) }} /> : null}
      </div>
      <Tray s={s} tone="light" slabText={slab.text} stageText={stage.text} proposedText={proposed.lines} />
      {/* the stamp: opaque red, so it never sits transparent over type; slams with a squash */}
      {xq > 0 ? (
        <div style={{ position: "absolute", left: dashedCx - 260, width: 520, top: 520, height: 120, display: "flex", alignItems: "center", justifyContent: "center",
          background: COLORS.accent, borderRadius: 16, ...big(COLORS.paper, 64), opacity: clamp01(xq * 5),
          transform: `${Z(lerp(700, 120, EASE(clamp01(xq / 0.4))))}rotate(-5deg) scale(${xq < 0.4 ? lerp(1.8, 0.92, xq / 0.4) : lerp(0.92, 1, BACK((xq - 0.4) / 0.6))})` }}>
          {stamp.text}
        </div>
      ) : null}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// HandOff — §3 "Who does what" (white card)
// ══════════════════════════════════════════════════════════════════════════
export const HAND = {
  track: { x0: 200, x1: 1720, y: 470, mark: 860 },
  road: 38, // degrees the track's plane turns away (camera on only)
  pill: { h: 84, size: 46 },
  block: { x: 160, top: 250, w: 960, h: 560 },
  tray: { x: 1220, top: 250, w: 540, h: 560 },
};

const Pill: React.FC<{ text: string; dark: boolean }> = ({ text, dark }) => (
  <div style={{ height: HAND.pill.h, padding: "0 34px", borderRadius: HAND.pill.h / 2, display: "flex", alignItems: "center", boxSizing: "border-box",
    background: dark ? COLORS.ink : COLORS.paper, border: `5px solid ${COLORS.ink}`, ...big(dark ? COLORS.paper : COLORS.ink, HAND.pill.size) }}>{text}</div>
);

export const HandOff: React.FC<Win & {
  lead: { name: string } & Cued; // "Hansoh": its pill drops at the start
  draw: Cued; // "leads": the track draws (solid to the marker, dashed on)
  marker: { lines: [string, string] } & Cued; // "end": the marker shoots up
  ride: Cued; // "global": the pill rides to the marker
  arrive: Cued; // "trials": it arrives
  taker: { name: string } & Cued; // "Roche": drops onto the marker
  onward: Cued; // "develops": Roche rides on
  onwardEnd: Cued; // "worldwide": it arrives
  pan: { blockTitle: string; blockSub: string } & Cued; // "outside": the camera pans, Roche's world rises
  markets: ({ text: string } & Cued)[]; // each arcs out of the block into the tray
  keeps: { text: string } & Cued; // "keeps": the tray's header
  four: Cued; // "four": the tray's frame turns red
}> = ({ from, to, lead, draw, marker, ride, arrive, taker, onward, onwardEnd, pan, markets, keeps, four }) => {
  const ms = useMs();
  const k = useK();
  const INK = COLORS.ink;
  const H = HAND;
  const tL = at(lead, from + 100, from);
  const tD = at(draw, tL + 450, from, tL + 250);
  const tMk = at(marker, tD + 2300, from, tD + 600);
  const tR = at(ride, tMk + 380, from, tMk + 200);
  const tA = at(arrive, tR + 1000, from, tR + 400);
  const tT = at(taker, tA + 1100, from, tA + 300);
  const tO = at(onward, tT + 350, from, tT + 250);
  const tOE = at(onwardEnd, tO + 1300, from, tO + 600);
  const tPan = at(pan, tOE + 600, from, tOE + 300);
  const tMs = markets.map((m, i) => at(m, tPan + 600 + i * 800, from, tPan + 300));
  const tKp = at(keeps, tMs[tMs.length - 1] + 800, from);
  const tF = at(four, tKp + 1500, from, tKp + 400);
  const Z = useZ(); // depth (camera on) or "" (flat)
  const P3 = useP3();
  const zs = (z: number, st: React.CSSProperties = {}): React.CSSProperties => ({ ...P3, ...st, transform: Z(z) + (st.transform ?? "") });
  // the ROAD: with the camera on, the track's plane turns away from the lens about its start, so it runs
  // into the distance; the pills and the marker label turn back to face the lens (billboards)
  const road = Z(1) ? HAND.road : 0;
  const face: React.CSSProperties = road ? { transform: `rotateY(${-road}deg)` } : {};
  const vis = clamp01(interpolate(ms, [from - 100, from + 150, to - 250, to], [0, 1, 1, 0], CLAMP));
  if (vis <= 0) return null;

  const T = H.track;
  const panQ = EASE_IO(k(tPan, 700));
  const dq = EASE_IO(k(tD, 900));
  const solidEnd = lerp(T.x0, T.mark, clamp01(dq / 0.45));
  const dashEnd = lerp(T.mark, T.x1, clamp01((dq - 0.45) / 0.55));
  const mq = BACK(k(tMk, 420));
  const hq = k(tL, 380);
  const rideQ = EASE_IO(clamp01((ms - tR) / Math.max(400, tA - tR)));
  const handQ = EASE_IO(k(tT + 250, 450)); // Hansoh is nudged down and back as Roche lands
  const hx = lerp(T.x0, T.mark, rideQ);
  const tq = clamp01((ms - tT) / 520);
  const oq = EASE_IO(clamp01((ms - tO) / Math.max(400, tOE - tO)));
  const rx = lerp(T.mark, T.x1 - 60, oq);
  const B = H.block;
  const TR = H.tray;
  const bq = EASE(k(tPan + 150, 650));
  const kq = k(tKp, 420);
  const fq = EASE_IO(k(tF, 600));

  return (
    <div style={{ position: "absolute", inset: 0, opacity: vis, ...P3 }}>
      {/* ── the track scene: the camera pans up and away on "outside" ── */}
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${-panQ * 900}px)`, opacity: 1 - clamp01((panQ - 0.6) / 0.4), ...P3 }}>
      <div style={{ position: "absolute", inset: 0, ...P3, ...(road ? { transformOrigin: `${HAND.track.x0}px ${HAND.track.y}px`, transform: `rotateY(${road}deg)` } : {}) }}>
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          {dq > 0 ? <line x1={T.x0} y1={T.y} x2={solidEnd} y2={T.y} stroke={INK} strokeWidth={12} strokeLinecap="round" /> : null}
          {dq > 0.45 ? <line x1={T.mark} y1={T.y} x2={dashEnd} y2={T.y} stroke={INK} strokeWidth={8} strokeDasharray="22 16" /> : null}
          {mq > 0 ? <line x1={T.mark} y1={T.y - 150 * mq} x2={T.mark} y2={T.y + 40} stroke={INK} strokeWidth={8} /> : null}
        </svg>
        {mq > 0 ? (
          <div style={{ position: "absolute", left: T.mark - 300, width: 600, top: T.y + 70, textAlign: "center", opacity: clamp01(mq * 3), ...face }}>
            <div style={{ ...label(COLORS.grayText, 34) }}>{marker.lines[0]}</div>
            <div style={{ ...big(INK, 54), marginTop: 6 }}>{marker.lines[1]}</div>
          </div>
        ) : null}
        {hq > 0 ? (
          <div style={{ position: "absolute", left: hx, top: T.y - H.pill.h - 30,
            transform: `translate(-50%, ${(1 - BACK(hq)) * -200 + handQ * 150}px) rotate(${handQ * -8}deg)`, opacity: clamp01(hq * 4) * (1 - handQ), ...P3 }}>
            <div style={face}><Pill text={lead.name} dark={false} /></div>
          </div>
        ) : null}
        {tq > 0 ? (
          <div style={{ position: "absolute", left: rx, top: T.y - H.pill.h - 30, transform: `translate(-50%, ${(1 - BOUNCE(tq)) * -460}px)`, ...P3 }}>
            <div style={face}><Pill text={taker.name} dark /></div>
          </div>
        ) : null}
      </div>
      </div>

      {/* ── Roche's world rises as the camera pans ── */}
      {bq > 0 ? (
        <div style={zs(lerp(-700, 0, bq), { position: "absolute", left: B.x, top: B.top + (1 - bq) * 700, width: B.w, height: B.h, borderRadius: 26, background: INK, padding: 48, boxSizing: "border-box" })}>
          <div style={{ ...label(INK_SUB, 34) }}>{pan.blockSub}</div>
          <div style={{ ...big(COLORS.paper, 96), marginTop: 14 }}>{pan.blockTitle}</div>
        </div>
      ) : null}
      {/* Hansoh's tray: the first market's arrival draws its frame; the header on "keeps"; red on "four" */}
      {ms >= tMs[0] ? (
        <svg style={{ position: "absolute", left: TR.x, top: TR.top, overflow: "visible" }} width={TR.w} height={TR.h}>
          <rect x={4} y={4} width={TR.w - 8} height={TR.h - 8} rx={26} fill="none" stroke={interpolateColors(fq, [0, 1], [inkA(0.3), COLORS.accent])} strokeWidth={lerp(4, 8, fq)}
            pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - EASE_IO(k(tMs[0], 600))} />
        </svg>
      ) : null}
      {kq > 0 ? (
        <div style={{ ...zs(40), position: "absolute", left: TR.x + 40, top: TR.top + 36, ...big(INK, 50), opacity: clamp01(kq * 3), transform: `translateY(${(1 - EASE(kq)) * 20}px)` }}>{keeps.text}</div>
      ) : null}
      {markets.map((m, i) => {
        const q = clamp01((ms - tMs[i]) / 560);
        if (q <= 0) return null;
        const e = EASE_IO(q);
        // an arc: up out of the block, over, and down into its slot in the tray
        const x = lerp(B.x + B.w / 2 - 170, TR.x + 40, e);
        const y = lerp(B.top + B.h / 2 + 40, TR.top + 130 + i * 98, e) - Math.sin(e * Math.PI) * 160;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, height: 78, padding: "0 26px", borderRadius: 16, display: "flex", alignItems: "center", boxSizing: "border-box",
            background: COLORS.panel, border: `3px solid ${INK}`, ...big(INK, 42), transform: `${Z(Math.sin(e * Math.PI) * 320 + 10)}rotate(${Math.sin(e * Math.PI) * -10}deg) scale(${lerp(0.6, 1, BACK(q))})`, opacity: clamp01(q * 5) }}>
            {m.text}
          </div>
        );
      })}
    </div>
  );
};
