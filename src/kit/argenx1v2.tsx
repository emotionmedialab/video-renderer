// ─────────────────────────────────────────────────────────────────────────
// KIT · argenx1v2 — STYLE-RESET TEST of the hook (0:00–7.0s), 2026-11-16.
// Direction (Nel): motion graphics + 2.5D + kinetic type. Loosened motion for this build (PLAN.md "Style reset"):
// spring follow-through that stops, overlapping action, impact scatter that vanishes. Loops/drift stay banned.
// VO: "$550 million in cash, up front. Up to $1.15 billion in all."
//  · 0ms      → "$550M" drops in letter by letter; each letter squashes, springs, settles; a few dots scatter and vanish.
//  · "in cash,"  → three rounded gradient cash bundles spring up under it (staggered, overlapping settles).
//  · "up front." → an "UP FRONT" chip pops on with an overshoot.
//  · pin 3550 → the whole $550M group springs back and to the left (camera pulls back with it).
//  · "Up to"  → "UP TO" snaps in word by word, right side.
//  · lands on "$1.15" → "$1.15B" flies in from depth letter by letter, tumbling, and springs flat.
//  · "billion" → the total pill draws; its $550M segment fills (white); pin → its $595M segment fills (ink) while
//                the first settles. Limits: "Up to" always on $1.15B; the $595M is contingent ("if milestones").
//  · pin 6650 → an ink blob grows from the bottom-left corner and swallows the frame (liquid wipe into §1b ink).
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill, spring } from "remotion";
import { clamp01, COLORS, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { EASE, EASE_IO } from "./plusone";
import { extrude, extrudeText, label, line } from "./inovio";
import { useP3, useZ } from "./camera";

const FPS = 30;
/** a spring from onset t0 (0 → 1 with a real overshoot), stops by itself */
const useSpring = () => {
  const ms = useMs();
  return (t0: number, damping = 9, stiffness = 150, mass = 0.7) =>
    ms < t0 ? 0 : spring({ frame: ((ms - t0) / 1000) * FPS, fps: FPS, config: { damping, stiffness, mass } });
};
const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

/** impact scatter: n dots fly out of (x, y) under gravity and shrink to nothing in 450ms (they leave; nothing stays) */
const Scatter: React.FC<{ x: number; y: number; t: number; n?: number; seed: number; color?: string }> = ({ x, y, t, n = 5, seed, color = COLORS.paper }) => {
  const ms = useMs();
  const p = (ms - t) / 450;
  if (p <= 0 || p >= 1) return null;
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const a = Math.PI * (1.05 + 0.9 * rnd(seed + i)); // upward fan
        const v = 160 + 140 * rnd(seed + i + 50);
        const dx = Math.cos(a) * v * p, dy = Math.sin(a) * v * p + 260 * p * p;
        const r = (6 + 7 * rnd(seed + i + 90)) * (1 - p);
        return <div key={i} style={{ ...abs(x + dx - r, y + dy - r), width: r * 2, height: r * 2, borderRadius: "50%", background: color }} />;
      })}
    </>
  );
};

// ── layout ───────────────────────────────────────────────────────────────
const FIG = { cx: 960, base: 470, size: 220, gap: 4 };
const FIG_CHARS = ["$", "5", "5", "0", "M"];
const BUNDLES = [{ x: 720, r: -7 }, { x: 960, r: 2 }, { x: 1200, r: 8 }];
export const BUN = { y: 600, w: 280, h: 120 };
const SHIFT = { x: -430, y: -60, s: 0.6 }; // where the $550M group goes on "Up to"
const RIGHT = { x: 1010, figBase: 470, size: 210 };
const BIG_CHARS = ["$", "1", ".", "1", "5", "B"];
export const PILL = { x0: 230, x1: 1690, y: 790, h: 96 };
const SEG1 = 550 / 1145; // $550M of up to ~$1.15B (our math, the figures are the release's)

export const Bundle: React.FC = () => (
  <div style={{ width: BUN.w, height: BUN.h, borderRadius: 26, position: "relative",
    background: "linear-gradient(160deg, #ffffff 0%, #ececec 55%, #c9c9c9 100%)", boxShadow: "0 22px 30px rgba(80,0,0,0.35), inset 0 -8px 0 rgba(0,0,0,0.08)" }}>
    <div style={{ position: "absolute", left: BUN.w / 2 - 22, top: 0, bottom: 0, width: 44, background: "linear-gradient(180deg, #2a2a2a, #000)" }} />
    <div style={{ position: "absolute", left: 22, top: 22, width: 54, height: 54, borderRadius: "50%", border: "6px solid #bdbdbd", boxSizing: "border-box" }} />
  </div>
);

export const HookV2: React.FC<Win & { cash: Cued; upfront: Cued; upto: Cued; to2: Cued; big: Cued; billion: Cued }> = ({
  from, to, cash, upfront, upto, to2, big, billion,
}) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpring();
  const tCash = at(cash, 1890, from);
  const tUp = at(upfront, 2956, from, tCash + 500);
  const tShift = Math.max(tUp + 400, 3550);
  const tUpto = at(upto, 4000, from, tShift + 300);
  const tTo = at(to2, 4120, from, tUpto + 60);
  const tBig = at(big, 4240, from, tTo + 60); // first big letter LANDS here
  const tBill = at(billion, 5320, from, tBig + 600);
  const tSeg2 = tBill + 280; //                starts while segment 1 settles (overlap, loosened rule 2)
  const tWipe = 6650;
  if (ms > to + 600) return null;

  const shift = sp(tShift, 12, 120);
  const groupT = `translate(${SHIFT.x * shift}px, ${SHIFT.y * shift}px) scale(${lerp(1, SHIFT.s, shift)})`;
  const pillDraw = EASE(k(tBill - 200, 260));
  const seg1 = sp(tBill, 14, 140);
  const seg2 = sp(tSeg2, 14, 140);
  const wipe = EASE_IO(k(tWipe, 420));

  // the ink blob (liquid wipe): wobbly edge only while it grows, then it is the next world
  const blob = () => {
    const R = 2700 * wipe, cx = 120, cy = 1140, N = 64;
    const pts = Array.from({ length: N }, (_, i) => {
      const a = (i / N) * Math.PI * 2;
      const rr = R * (1 + 0.07 * Math.sin(7 * a + 6 * wipe) + 0.04 * Math.sin(3 * a - 4 * wipe));
      return `${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`;
    });
    return `M${pts.join("L")}Z`;
  };

  return (
    <AbsoluteFill style={{ ...p3 }}>
      {/* 2.5D light: a soft glow on the red, static */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 55% at 50% 42%, rgba(255,255,255,0.20), rgba(255,255,255,0) 70%)" }} />

      {/* ── the $550M group ── */}
      <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${FIG.cx}px 510px`, transform: groupT }}>
        {/* figure: letters drop, squash, spring, settle */}
        <div style={{ ...abs(0, FIG.base - FIG.size), width: 1920, display: "flex", justifyContent: "center", gap: FIG.gap, ...p3 }}>
          {FIG_CHARS.map((ch, i) => {
            const t0 = i * 70; //                             lands ~300ms after its start; "$550" is voiced at 110
            const fall = clamp01((ms - t0) / 300);
            const land = t0 + 300;
            const s = sp(land, 7, 190, 0.6); //               the squash-spring after landing
            const sq = ms >= land ? 1 - s : 0; //            1 at impact → 0 settled, overshoots negative once
            return (
              <div key={i} style={{ ...line(FIG.size, COLORS.paper), textShadow: extrudeText(12, "#9e0f17"), opacity: ms >= t0 ? 1 : 0,
                transformOrigin: "50% 100%", transform: `translateY(${-700 * (1 - fall * fall)}px) scale(${1 + 0.18 * sq}, ${1 - 0.26 * sq})` }}>{ch}</div>
            );
          })}
        </div>
        {FIG_CHARS.map((_, i) => <Scatter key={i} x={FIG.cx - 290 + i * 145} y={FIG.base - 10} t={i * 70 + 300} seed={i * 7} n={4} />)}

        {/* cash bundles: spring up, staggered, overlapping settles */}
        {BUNDLES.map((b, i) => {
          const t0 = tCash + i * 90;
          const s = sp(t0, 8, 160);
          if (ms < t0) return null;
          return (
            <div key={i} style={{ ...abs(b.x - BUN.w / 2, BUN.y - BUN.h / 2), transformOrigin: "50% 100%",
              transform: `${z(30 + i * 6)}translateY(${(1 - s) * 420}px) rotate(${b.r * s + (1 - s) * -30}deg)` }}>
              <Bundle />
            </div>
          );
        })}
        {/* contact shadow under the bundles (2.5D), appears with them */}
        {ms >= tCash ? <div style={{ ...abs(FIG.cx - 430, BUN.y + 62), width: 860, height: 40, borderRadius: "50%", background: "rgba(90,0,0,0.35)", filter: "blur(10px)", opacity: clamp01((ms - tCash) / 300) }} /> : null}

        {/* UP FRONT chip: pops with an overshoot */}
        {ms >= tUp ? (
          <div style={{ ...abs(FIG.cx - 160, BUN.y + 92), width: 320, display: "flex", justifyContent: "center", transform: `${z(60)}scale(${sp(tUp, 7, 220)})` }}>
            <div style={{ background: COLORS.ink, borderRadius: 40, padding: "12px 34px", ...label(COLORS.paper, 40), boxShadow: "0 12px 20px rgba(0,0,0,0.35)" }}>UP FRONT</div>
          </div>
        ) : null}
      </div>

      {/* ── UP TO + $1.15B (kinetic type, right) ── */}
      <div style={{ ...abs(RIGHT.x, RIGHT.figBase - RIGHT.size - 78), display: "flex", gap: 18, transform: z(40) || undefined }}>
        {ms >= tUpto ? <div style={{ ...label(COLORS.paper, 60), transform: `scale(${lerp(1.6, 1, clamp01((ms - tUpto) / 130))})`, transformOrigin: "0 100%" }}>UP</div> : null}
        {ms >= tTo ? <div style={{ ...label(COLORS.paper, 60), transform: `scale(${lerp(1.6, 1, clamp01((ms - tTo) / 130))})`, transformOrigin: "0 100%" }}>TO</div> : null}
      </div>
      <div style={{ ...abs(RIGHT.x, RIGHT.figBase - RIGHT.size), display: "flex", ...p3 }}>
        {BIG_CHARS.map((ch, i) => {
          const land = tBig + i * 55;
          const t0 = land - 300;
          if (ms < t0) return null;
          const fly = EASE(clamp01((ms - t0) / 300));
          const s = sp(land, 8, 170);
          return (
            <div key={i} style={{ ...line(RIGHT.size, COLORS.paper), textShadow: extrudeText(12, "#9e0f17"), transformOrigin: "50% 80%",
              transform: `${z(lerp(-2200, 0, fly))}rotateY(${lerp(-90, 0, fly)}deg) scale(${ms >= land ? lerp(1.25, 1, s) : 1})` }}>{ch}</div>
          );
        })}
      </div>

      {/* ── the total pill: $550M up front | $595M if milestones ── */}
      {ms >= tBill - 200 ? (
        <div style={{ ...abs(PILL.x0, PILL.y - PILL.h / 2), width: (PILL.x1 - PILL.x0) * pillDraw, height: PILL.h, borderRadius: PILL.h / 2,
          background: "rgba(0,0,0,0.18)", overflow: "hidden", transform: z(20) || undefined, boxShadow: "inset 0 6px 14px rgba(0,0,0,0.25)" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: (PILL.x1 - PILL.x0) * SEG1 * seg1, borderRadius: PILL.h / 2,
            background: "linear-gradient(180deg, #ffffff, #e2e2e2)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <div style={label(COLORS.ink, 36)}>$550M · up front</div>
          </div>
          {ms >= tSeg2 ? (
            <div style={{ position: "absolute", left: (PILL.x1 - PILL.x0) * SEG1 + 8, top: 0, bottom: 0, width: Math.max(0, ((PILL.x1 - PILL.x0) * (1 - SEG1) - 8) * seg2), borderRadius: PILL.h / 2,
              background: "linear-gradient(180deg, #2b2b2b, #000)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              <div style={label(COLORS.paper, 36)}>up to $595M · if milestones</div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ── liquid wipe out ── */}
      {wipe > 0 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, transform: z(200) || undefined }}>
          <path d={blob()} fill={COLORS.ink} />
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};
