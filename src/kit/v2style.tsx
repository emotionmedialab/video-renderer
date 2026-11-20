// ─────────────────────────────────────────────────────────────────────────
// KIT · v2style — the STYLE-RESET switch for argenx × UNP (Nel, 2026-11-16): motion graphics + 2.5D + kinetic type,
// with the loosened motion rules (spring follow-through that stops, overlapping settles, impact scatter that vanishes).
// Only the `ArgenxUnpV2` composition turns it on; with it off every helper returns the ORIGINAL behaviour, so the
// v1 composition renders exactly as before (side-by-side comparison).
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { spring } from "remotion";
import { clamp01, COLORS, useMs } from "./core";
import { useK } from "./elora";
import { EASE, EASE_IO } from "./plusone";
import { line, useDrop, type CubeC } from "./inovio";
import { useZ } from "./camera";

export const V2 = React.createContext(false);
export const useV2 = () => React.useContext(V2);

const FPS = 30;
/** a spring from t0 (0 → 1 with a real overshoot); it stops by itself */
export const useSpringX = () => {
  const ms = useMs();
  return (t0: number, damping = 10, stiffness = 150, mass = 0.7) =>
    ms < t0 ? 0 : spring({ frame: ((ms - t0) / 1000) * FPS, fps: FPS, config: { damping, stiffness, mass } });
};

/** an entrance progress 0→1: v1 = ease-out over `dur`; v2 = a spring that overshoots and settles */
export const useEnt = () => {
  const v2 = useV2();
  const k = useK();
  const sp = useSpringX();
  return (t0: number, dur: number) => (v2 ? sp(t0, 11, 160) : EASE(k(t0, dur)));
};

/** a fall: v1 = the kit useDrop; v2 = the same fall, then a springy squash → stretch → settle with a small rebound */
export const useDropX = () => {
  const v2 = useV2();
  const ms = useMs();
  const v1 = useDrop();
  const sp = useSpringX();
  return (t0: number, h: number, fall = 380) => {
    if (!v2) return v1(t0, h, fall);
    if (ms < t0) return { dy: -h, sx: 1, sy: 1, on: false };
    const p = clamp01((ms - t0) / fall);
    if (p < 1) return { dy: -h * (1 - p * p), sx: 1 - 0.06 * p, sy: 1 + 0.1 * p, on: true }; // stretched in the fall
    const sq = 1 - sp(t0 + fall, 6, 210, 0.6); //  1 at impact, swings negative once, settles at 0
    return { dy: sq < 0 ? 70 * sq : 0, sx: 1 + 0.22 * sq, sy: 1 - 0.3 * sq, on: true };
  };
};

const mix = (hex: string, to: number, a: number) => {
  const n = parseInt(hex.replace("#", ""), 16);
  const ch = (s: number) => Math.round(((n >> s) & 255) * (1 - a) + to * a);
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
};
/** v2: a soft top-left light on the front face (2.5D); v1: the flat colours unchanged */
export const cc = (v2: boolean, c: CubeC): CubeC =>
  v2 && c.front.startsWith("#")
    ? { ...c, front: `linear-gradient(155deg, ${mix(c.front, 255, 0.28)} 0%, ${c.front} 55%, ${mix(c.front, 0, 0.22)} 100%)` }
    : c;

const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
/** v2 only: n dots burst from (x, y) on an impact, fall and shrink to nothing in 450ms (nothing stays) */
export const Scatter: React.FC<{ x: number; y: number; t: number; n?: number; seed?: number; color?: string; zz?: number }> = ({
  x, y, t, n = 6, seed = 1, color = COLORS.paper, zz = 160,
}) => {
  const v2 = useV2();
  const ms = useMs();
  const z = useZ();
  const p = (ms - t) / 450;
  if (!v2 || p <= 0 || p >= 1) return null;
  return (
    <div style={{ position: "absolute", inset: 0, transform: z(zz) || undefined }}>
      {Array.from({ length: n }, (_, i) => {
        const a = Math.PI * (1.05 + 0.9 * rnd(seed * 31 + i));
        const v = 170 + 150 * rnd(seed * 31 + i + 50);
        const dx = Math.cos(a) * v * p, dy = Math.sin(a) * v * p + 280 * p * p;
        const r = (6 + 8 * rnd(seed * 31 + i + 90)) * (1 - p);
        return <div key={i} style={{ position: "absolute", left: x + dx - r, top: y + dy - r, width: r * 2, height: r * 2, borderRadius: "50%", background: color }} />;
      })}
    </div>
  );
};

/** a figure as kinetic type: v2 = letters drop in one by one, squash and spring; v1 = the plain line */
export const KType: React.FC<{ text: string; t: number; size: number; color: string; shadow?: string }> = ({ text, t, size, color, shadow }) => {
  const v2 = useV2();
  const ms = useMs();
  const sp = useSpringX();
  if (!v2) return <div style={{ ...line(size, color), textShadow: shadow }}>{text}</div>;
  return (
    <div style={{ display: "flex" }}>
      {text.split("").map((ch, i) => {
        const t0 = t + i * 55, land = t0 + 260;
        const fall = clamp01((ms - t0) / 260);
        const sq = ms >= land ? 1 - sp(land, 7, 200, 0.6) : 0;
        return (
          <div key={i} style={{ ...line(size, color), textShadow: shadow, whiteSpace: "pre", opacity: ms >= t0 ? 1 : 0, transformOrigin: "50% 100%",
            transform: `translateY(${-size * 2.2 * (1 - fall * fall)}px) scale(${1 + 0.16 * sq}, ${1 - 0.24 * sq})` }}>{ch}</div>
        );
      })}
    </div>
  );
};

/** v2 only: a liquid blob of the NEXT world's colour grows from a corner and swallows the frame, ending at `at` */
export const LiquidWipe: React.FC<{ at: number; color: string; dur?: number; origin?: [number, number] }> = ({ at, color, dur = 420, origin = [120, 1140] }) => {
  const v2 = useV2();
  const ms = useMs();
  const k = useK();
  const w = EASE_IO(k(at - dur, dur));
  if (!v2 || w <= 0 || ms > at + 600) return null;
  const R = 2700 * w, N = 64;
  const pts = Array.from({ length: N }, (_, i) => {
    const a = (i / N) * Math.PI * 2;
    const rr = R * (1 + 0.07 * Math.sin(7 * a + 6 * w) + 0.04 * Math.sin(3 * a - 4 * w));
    return `${(origin[0] + Math.cos(a) * rr).toFixed(1)},${(origin[1] + Math.sin(a) * rr).toFixed(1)}`;
  });
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d={`M${pts.join("L")}Z`} fill={color} />
    </svg>
  );
};
