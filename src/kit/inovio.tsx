// ─────────────────────────────────────────────────────────────────────────
// KIT · inovio — INOVIO Voceryq long-form (HORIZONTAL 16:9, 2026-11-06).
// Every onset is a spoken cue; every block holds still between cues (one mover).
//
// THE SPINE is the 26: the hook's 7-of-26 grid (HookGrid) is the same object the
// Numbers section rebuilds and explains. Papzimeos's figures never share its axis.
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, COLORS, DISPLAY, TRACK, useMs, INK_SUB_ON_RED } from "./core";
import { TYPE } from "../style";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { EASE, back, fadeOut } from "./plusone";
import { useP3, useZ } from "./camera";
import { FlowLine } from "./flowline";

export const line = (size: number, color: string, weight = 700): React.CSSProperties => ({
  fontFamily: DISPLAY, fontWeight: weight, fontSize: size, lineHeight: 1.04, letterSpacing: TRACK.headline, color, whiteSpace: "nowrap",
});
export const label = (color: string, size = TYPE.label): React.CSSProperties => ({
  fontFamily: DISPLAY, fontWeight: 700, fontSize: size, letterSpacing: TRACK.nav, color, whiteSpace: "nowrap",
});

/** a stamp that lands STRAIGHT: scale 1.6 -> 1, no rotation (stamps sit straight) */
const useStampK = () => {
  const k = useK();
  return (t: number): React.CSSProperties => {
    const s = k(t, 260);
    return { opacity: clamp01(s * 3), transform: `scale(${lerp(1.6, 1, EASE(s))})` };
  };
};

// ══════════════════════════════════════════════════════════════════════════
// 3D primitives (v2, 2026-11-06: Nel, "it looks plain all throughout… make it more engaging")
// ══════════════════════════════════════════════════════════════════════════
/** a solid's thickness for a flat element: stacked 1px steps down-right, then a soft drop (uniQure kit) */
export const extrude = (steps: number, edge: string, drop = "rgba(0,0,0,0.35)") =>
  Array.from({ length: steps }, (_, i) => `${i + 1}px ${i + 1}px 0 ${edge}`).join(", ") + `, ${steps + 8}px ${steps + 14}px 30px ${drop}`;
/** extruded TYPE: the same steps as a text-shadow */
export const extrudeText = (steps: number, edge: string) => Array.from({ length: steps }, (_, i) => `${i + 1}px ${i + 1}px 0 ${edge}`).join(", ");

export type CubeC = { front: string; side: string; top: string };
export const CUBE_RED: CubeC = { front: COLORS.accent, side: "#a3121b", top: "#ff6a71" };
export const CUBE_INK: CubeC = { front: "#3b3b3b", side: "#1f1f1f", top: "#5a5a5a" };
export const CUBE_PAPER: CubeC = { front: "#d4d4d4", side: "#a6a6a6", top: "#ececec" };

/** a real six-faced box (divarasib kit `Box`); w/h/d in px, centred on (cx, cy, cz); `extra` = more transform */
export const Box3: React.FC<{ cx: number; cy: number; cz?: number; w: number; h: number; d: number; c: CubeC; extra?: string; radius?: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({
  cx, cy, cz = 0, w, h, d, c, extra = "", radius = 0, children, style,
}) => {
  const face = (bg: string): React.CSSProperties => ({ position: "absolute", boxSizing: "border-box", background: bg, backfaceVisibility: "hidden" });
  return (
    <div style={{ position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, transformStyle: "preserve-3d", transform: `translateZ(${cz}px) ${extra}`, ...style }}>
      <div style={{ ...face(c.side), left: 0, top: 0, width: w, height: h, transform: `translateZ(${-d / 2}px) rotateY(180deg)` }} />
      <div style={{ ...face(c.side), left: (w - d) / 2, top: 0, width: d, height: h, transform: `rotateY(-90deg) translateZ(${w / 2}px)` }} />
      <div style={{ ...face(c.side), left: (w - d) / 2, top: 0, width: d, height: h, transform: `rotateY(90deg) translateZ(${w / 2}px)` }} />
      <div style={{ ...face(c.side), left: 0, top: (h - d) / 2, width: w, height: d, transform: `rotateX(-90deg) translateZ(${h / 2}px)` }} />
      <div style={{ ...face(c.top), left: 0, top: (h - d) / 2, width: w, height: d, transform: `rotateX(90deg) translateZ(${h / 2}px)` }} />
      <div style={{ ...face(c.front), left: 0, top: 0, width: w, height: h, borderRadius: radius, display: "flex", alignItems: "center", justifyContent: "center", transform: `translateZ(${d / 2}px)` }}>{children}</div>
    </div>
  );
};

/** a fall with a squash on landing: returns { dy, sx, sy } for an element dropping from `h` px above, landing at t0 + fall */
export const useDrop = () => {
  const ms = useMs();
  return (t0: number, h: number, fall = 380) => {
    if (ms < t0) return { dy: -h, sx: 1, sy: 1, on: false };
    const p = clamp01((ms - t0) / fall);
    const q = clamp01((ms - t0 - fall) / 180);
    const sq = ms >= t0 + fall ? Math.sin(Math.PI * q) : 0;
    return { dy: -h * (1 - p * p), sx: 1 + 0.14 * sq, sy: 1 - 0.24 * sq, on: true };
  };
};

/** word-by-word mask slide (each word rises out of its own baseline on its cue) */
export const SlideWords: React.FC<{ text: string; t: number; size: number; color: string; weight?: number; stagger?: number; align?: "center" | "left" }> = ({ text, t, size, color, weight = 700, stagger = 70, align = "center" }) => {
  const k = useK();
  const words = text.split(" ");
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start", columnGap: size * 0.26 }}>
      {words.map((w, i) => {
        const p = EASE(k(t + i * stagger, 380));
        return (
          <div key={i} style={{ overflow: "hidden", paddingBottom: size * 0.12, marginBottom: -size * 0.12 }}>
            <div style={{ ...line(size, color, weight), transform: `translateY(${lerp(110, 0, p)}%)` }}>{w}</div>
          </div>
        );
      })}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// §1 HookGrid v2 — "7 out of 26." (ink, no line art)
// ══════════════════════════════════════════════════════════════════════════
// A giant extruded "7" slams in on "7". On "26" it SHATTERS: seven red blocks burst out of
// the glyph and tumble into their seats while the camera swings square (CAM_HOOK); then the
// other 19 blocks rain onto the row, centre-out, each landing with a squash.
export const GRID = { cols: 13, rows: 2, tile: 84, gap: 20, top: 446 };
const gridW = GRID.cols * GRID.tile + (GRID.cols - 1) * GRID.gap;
export const gridLeft = 960 - gridW / 2;
/** x centre of the seven red tiles (for camera framing) */
export const RED_CX = gridLeft + (7 * GRID.tile + 6 * GRID.gap) / 2;
const seat = (i: number) => ({ x: gridLeft + (i % GRID.cols) * (GRID.tile + GRID.gap) + GRID.tile / 2, y: GRID.top + Math.floor(i / GRID.cols) * (GRID.tile + GRID.gap) + GRID.tile / 2 });
// seven points along the "7" glyph (top bar, then the diagonal), where the red blocks burst from
const GLYPH = [{ x: 840, y: 330 }, { x: 930, y: 330 }, { x: 1020, y: 330 }, { x: 1090, y: 340 }, { x: 1050, y: 450 }, { x: 1005, y: 560 }, { x: 965, y: 670 }];
const SPIN = [[220, -160], [-180, 200], [260, 140], [-240, -120], [160, 240], [-200, 180], [200, -220]];

export const Tiles: React.FC<Win & { red: number; tRed: number; tRest: number; count?: number }> = ({ to, tRed, tRest }) => {
  const ms = useMs();
  const k = useK();
  const p3 = useP3();
  const drop = useDrop();
  if (ms < tRed - 40 || ms > to + 320) return null;
  const T = GRID.tile;
  // the numeral: slams down from deep in front (scale 2.4 → 1), holds, bursts on tRest
  const slam = k(tRed, 240);
  const burst = ms >= tRest ? EASE(k(tRest, 140)) : 0;
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to + 300) }}>
      {burst < 1 ? (
        <div style={{ position: "absolute", left: 960 - 400, width: 800, top: 230, textAlign: "center", ...line(560, COLORS.paper), lineHeight: 0.9,
          textShadow: extrudeText(22, "#8a8a8a"), opacity: clamp01(slam * 4) * (1 - burst), transform: `scale(${lerp(2.4, 1, Easing_in(slam)) * lerp(1, 1.15, burst)})` }}>7</div>
      ) : null}
      {Array.from({ length: 26 }, (_, i) => {
        const s = seat(i);
        if (i < 7) {
          if (ms < tRest) return null;
          const p = EASE(k(tRest + i * 40, 700));
          const g = GLYPH[i];
          const [rx, ry] = SPIN[i];
          return <Box3 key={i} cx={lerp(g.x, s.x, p)} cy={lerp(g.y, s.y, p) - Math.sin(Math.PI * p) * 120} cz={lerp(220, 0, p)} w={T} h={T} d={T} c={CUBE_RED}
            radius={6} extra={`rotateX(${rx * (1 - p)}deg) rotateY(${ry * (1 - p)}deg)`} />;
        }
        const order = Math.abs((i % GRID.cols) - 6) + Math.floor(i / GRID.cols) * 0.5;
        const d = drop(tRest + 450 + order * 45, 760);
        if (!d.on) return null;
        return <Box3 key={i} cx={s.x} cy={s.y + d.dy + (T * (1 - d.sy)) / 2} w={T} h={T} d={T} c={CUBE_INK} radius={6} extra={`scale(${d.sx}, ${d.sy})`} />;
      })}
    </AbsoluteFill>
  );
};
const Easing_in = (t: number) => t * t;

export const HookType: React.FC<Win & { seven: Cued; of: Cued; result: Cued; rare: Cued }> = ({ from, to, seven, of, result, rare }) => {
  const ms = useMs();
  const t7 = at(seven, from + 170, from);
  const tOf = at(of, t7 + 900, from, t7 + 200);
  const tRes = at(result, tOf + 2500, from, tOf + 300);
  const tRare = at(rare, tRes + 2500, from, tRes + 300);
  if (ms < tOf - 40 || ms > to + 320) return null;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300) }}>
      <div style={{ position: "absolute", top: 170, left: 0, width: 1920 }}>
        <SlideWords text="7 out of 26" t={tOf + 500} size={130} color={COLORS.paper} stagger={90} />
      </div>
      <div style={{ position: "absolute", top: 720, left: 0, width: 1920 }}>
        {ms >= tRes - 40 ? <SlideWords text="The result behind the newest FDA approval" t={tRes} size={60} color={COLORS.paper} stagger={55} /> : null}
        <div style={{ marginTop: 18 }}>{ms >= tRare - 40 ? <SlideWords text="In a rare airway disease" t={tRare} size={40} color="rgba(255,255,255,0.62)" weight={400} /> : null}</div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// §2 ApprovalCard v2 — a slab tumbles in; the stamp SLAMS with one shock ring; the name is a
// SPLIT-FLAP board that flips Voceryq → INO-3107 → Voceryq on the spoken names (paper)
// ══════════════════════════════════════════════════════════════════════════
const FLAP = { n: 8, w: 124, h: 184, gap: 10 };
const boardW = FLAP.n * FLAP.w + (FLAP.n - 1) * FLAP.gap;
// row = board + 56 gap + stamp (~394): left = 960 - (boardW + 56 + 394) / 2
const rowL = 960 - (boardW + 56 + 394) / 2;
export const APPROVAL = { slabTop: 220, slabH: 380, rowCy: 400, stampCx: rowL + boardW + 56 + 197, stampCy: 400 };

/** one split-flap cell: flips through `states` ([t, char]) — top half folds down, new char lands */
/** `light`: a white cell with black type (reads over a footage scrim; Rybrevant 11-09) */
export const Flap: React.FC<{ states: [number, string][]; delay: number; light?: boolean }> = ({ states, delay, light = false }) => {
  const ms = useMs();
  let cur = " ", prev = " ", tCur = -Infinity;
  for (const [t, ch] of states) { if (ms >= t + delay) { prev = cur; cur = ch; tCur = t + delay; } }
  const f = clamp01((ms - tCur) / 260);
  const showing = f < 0.5 ? prev : cur;
  const ang = f < 0.5 ? -f * 180 : (1 - f) * 180;
  return (
    <div style={{ position: "relative", width: FLAP.w, height: FLAP.h, borderRadius: 14, background: light ? COLORS.paper : "#111", boxShadow: extrude(8, light ? "#9a9a9a" : "#000", "rgba(0,0,0,0.25)"), perspective: 600 }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", transform: `rotateX(${ang}deg)`, transformOrigin: "50% 50%" }}>
        <div style={line(140, light ? COLORS.ink : COLORS.paper)}>{showing}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: FLAP.h / 2 - 2, height: 4, background: light ? "rgba(0,0,0,0.14)" : "rgba(255,255,255,0.12)" }} />
    </div>
  );
};

export const ApprovalCard: React.FC<Win & { date: Cued; inovio: Cued; stampAt: Cued; name: Cued; prev: Cued; code: Cued; indication: Cued }> = ({
  from, to, date, inovio, stampAt, name, prev, code, indication,
}) => {
  const ms = useMs();
  const k = useK();
  const p3 = useP3();
  const z = useZ();
  const tDate = at(date, from + 700, from);
  const tIno = at(inovio, tDate + 1000, from, tDate + 200);
  const tStamp = at(stampAt, tIno + 800, from, tIno + 200);
  const tName = at(name, tStamp + 1500, from, tStamp + 300);
  const tPrev = at(prev, tName + 900, from, tName + 200);
  const tCode = at(code, tPrev + 500, from, tPrev + 100);
  const tInd = at(indication, tCode + 2000, from, tCode + 300);
  if (ms < tDate - 40 || ms > to + 320) return null;
  const slabK = EASE(k(tIno, 700));
  const slamK = k(tStamp, 200);
  const ring = k(tStamp + 200, 450);
  const pad = (s: string) => (s + "        ").slice(0, FLAP.n).split("");
  const NAME = pad("Voceryq"), CODE = pad("INO-3107");
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to + 300) }}>
      {/* the date: two chips that slam in on their words */}
      <div style={{ position: "absolute", top: 100, left: 0, width: 1920, display: "flex", justifyContent: "center", gap: 18 }}>
        {[{ t: tDate, s: "October 30, 2026", bg: COLORS.ink, fg: COLORS.paper }, { t: tIno, s: "INOVIO", bg: COLORS.panel, fg: COLORS.ink }].map((c) => (
          <div key={c.s} style={{ ...line(44, c.fg), background: c.bg, borderRadius: 999, padding: "12px 30px", opacity: ms >= c.t ? clamp01(k(c.t, 120) * 2) : 0,
            transform: `scale(${lerp(1.5, 1, EASE(k(c.t, 220)))})`, ...{} }}>{c.s}</div>
        ))}
      </div>
      {/* the slab tumbles in from deep space on "INOVIO announced" */}
      <div style={{ position: "absolute", left: 120, width: 1680, top: APPROVAL.slabTop, height: APPROVAL.slabH, borderRadius: 30, background: COLORS.panel,
        boxShadow: extrude(16, "#cfcfcf", "rgba(0,0,0,0.18)"), transformOrigin: "50% 100%",
        transform: `${z(lerp(-1400, 0, slabK))}rotateX(${lerp(75, 0, slabK)}deg)`, opacity: clamp01(slabK * 3) }} />
      {/* board + stamp: one flex row */}
      <div style={{ position: "absolute", left: rowL, top: APPROVAL.rowCy - FLAP.h / 2, display: "flex", alignItems: "center", gap: 56, opacity: ms >= tIno ? 1 : 0 }}>
        <div style={{ display: "flex", gap: FLAP.gap }}>
          {NAME.map((_, i) => (
            <Flap key={i} delay={i * 45} states={[[tName, NAME[i]], [tCode, CODE[i]], [tInd, NAME[i]]]} />
          ))}
        </div>
        <div style={{ position: "relative", opacity: ms >= tStamp ? 1 : 0 }}>
          {/* one shock ring, part of the slam (not a loop) */}
          <div style={{ position: "absolute", inset: 0, borderRadius: 16, border: `5px solid ${COLORS.accent}`, opacity: ms >= tStamp + 200 ? 0.8 * (1 - ring) : 0, transform: `scale(${lerp(1, 1.6, EASE(ring))})` }} />
          <div style={{ border: `8px solid ${COLORS.accent}`, borderRadius: 16, padding: "18px 30px", background: COLORS.paper, opacity: clamp01(slamK * 4), transform: `scale(${lerp(2.4, 1, slamK * slamK)})` }}>
            <div style={{ ...line(54, COLORS.accent), lineHeight: 1.0 }}>Accelerated</div>
            <div style={{ ...line(54, COLORS.accent), lineHeight: 1.0, marginTop: 6 }}>approval</div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: rowL + 6, top: APPROVAL.rowCy + FLAP.h / 2 + 22, display: "flex", gap: 14, opacity: ms >= tPrev ? k(tPrev, 160) : 0 }}>
        <div style={line(40, COLORS.grayText, 400)}>Previously</div>
        <div style={{ ...line(40, COLORS.ink), opacity: ms >= tCode ? k(tCode, 160) : 0 }}>INO-3107</div>
      </div>
      {/* indication: word-flow */}
      <div style={{ position: "absolute", top: 660, left: 210, width: 1500 }}>
        <FlowLine from={tInd} to={to} line="Approved to reduce how often adults with recurrent respiratory papillomatosis need surgery."
          size={58} color={COLORS.ink} align="center" lineHeight={1.15} />
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// §3 Airway v3 (red) — the viruses tumble in from depth spinning; the airway is DRAWN as an
// airway (Nel, 2026-11-06: "i can't see the respiratory tract", the 3/4 camera "not important"):
// a windpipe with cartilage rings, the voice box at the top, two bronchi forking below. Square
// camera. The growths sit on its inner walls; the blade sweeps DOWN the windpipe and cuts them
// off (they fly out and fall away); they regrow with a pop. The airway then drops away.
// ══════════════════════════════════════════════════════════════════════════
// windpipe walls at xL / xR from the larynx bottom (y0) to the fork (y1); larynx box above
export const AIR = { cx: 1180, xL: 1110, xR: 1250, y0: 300, y1: 690, larynx: { x0: 1080, x1: 1280, top: 200 }, voiceY: 250 };
const GROWTHS: { y: number; wall: "l" | "r"; r: number }[] = [
  { y: 232, wall: "l", r: 30 }, { y: 272, wall: "l", r: 24 }, { y: 244, wall: "r", r: 32 }, // the voice-box cluster
  { y: 370, wall: "r", r: 24 }, { y: 430, wall: "l", r: 28 }, { y: 520, wall: "r", r: 26 },
  { y: 590, wall: "l", r: 22 }, { y: 650, wall: "r", r: 24 },
];
const VIRUS = [
  { x: 330, y: 552, land: { x: AIR.larynx.x0, y: 250 } },
  { x: 520, y: 552, land: { x: AIR.xR, y: 520 } },
];
const GROWTH_BG = "radial-gradient(circle at 42% 30%, #ffffff 0%, #f1f1f1 45%, #cfcfcf 100%)";
const wallX = (g: { y: number; wall: "l" | "r" }) => (g.y < AIR.y0 ? (g.wall === "l" ? AIR.larynx.x0 : AIR.larynx.x1) : g.wall === "l" ? AIR.xL : AIR.xR);

// the outline as one path (drawn with a dash): larynx, windpipe, the fork into two bronchi
const L = AIR.larynx;
const AIR_PATH = [
  `M ${L.x0} ${L.top} L ${L.x0} ${AIR.y0 - 20} Q ${L.x0} ${AIR.y0} ${AIR.xL} ${AIR.y0 + 10} L ${AIR.xL} ${AIR.y1} Q ${AIR.xL} ${AIR.y1 + 60} 990 860`,
  `M ${L.x1} ${L.top} L ${L.x1} ${AIR.y0 - 20} Q ${L.x1} ${AIR.y0} ${AIR.xR} ${AIR.y0 + 10} L ${AIR.xR} ${AIR.y1} Q ${AIR.xR} ${AIR.y1 + 60} 1370 860`,
  `M 1080 860 Q ${AIR.cx} ${AIR.y1 + 40} 1280 860`,
];
const LUMEN = `M ${L.x0} ${L.top} L ${L.x1} ${L.top} L ${L.x1} ${AIR.y0 - 20} Q ${L.x1} ${AIR.y0} ${AIR.xR} ${AIR.y0 + 10} L ${AIR.xR} ${AIR.y1} Q ${AIR.xR} ${AIR.y1 + 60} 1370 860 L 1280 860 Q ${AIR.cx} ${AIR.y1 + 40} 1080 860 L 990 860 Q ${AIR.xL} ${AIR.y1 + 60} ${AIR.xL} ${AIR.y1} L ${AIR.xL} ${AIR.y0 + 10} Q ${L.x0} ${AIR.y0} ${L.x0} ${AIR.y0 - 20} Z`;

const Virus: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="-60 -60 120 120" style={{ display: "block" }}>
    {Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return <line key={i} x1={Math.cos(a) * 38} y1={Math.sin(a) * 38} x2={Math.cos(a) * 54} y2={Math.sin(a) * 54} stroke={color} strokeWidth={7} strokeLinecap="round" />;
    })}
    <circle r={36} fill={color} />
  </svg>
);

export const Airway: React.FC<Win & { strains: Cued; six: Cued; eleven: Cued; tube: Cued; form: Cued; voice: Cued; surgery: Cued; removes: Cued; regrow: Cued; retire: Cued }> = ({
  from, strains, six, eleven, tube, form, voice, surgery, removes, regrow, retire,
}) => {
  const ms = useMs();
  const k = useK();
  const p3 = useP3();
  const z = useZ();
  const tStr = at(strains, from + 2400, from);
  const t6 = at(six, tStr + 1900, from, tStr + 200);
  const t11 = at(eleven, t6 + 400, from, t6 + 100);
  const tTube = at(tube, t11 + 700, from, t11 + 100);
  const tForm = at(form, tTube + 1100, from, tTube + 200);
  const tVoice = at(voice, tForm + 2600, from, tForm + 300);
  const tSurg = at(surgery, tVoice + 700, from, tVoice + 100);
  const tRem = at(removes, tSurg + 500, from, tSurg + 100);
  const tRe = at(regrow, tRem + 1600, from, tRem + 300);
  const tOut = at(retire, tRe + 1300, from, tRe + 300);
  if (ms < tStr - 40 || ms > tOut + 900) return null;
  const out = EASE(k(tOut, 800));
  const fly = EASE(k(tForm, 520));
  const draw = EASE(k(tTube, 800));
  const SWEEP = 900;
  const bladeY = lerp(L.top - 30, AIR.y1 + 20, EASE(k(tRem, SWEEP)));
  const sweeping = ms >= tRem && ms < tRem + SWEEP + 200;
  const sub = INK_SUB_ON_RED;
  const tagO = (t: number, off: number) => (ms >= t ? k(t, 160) : 0) * (1 - k(off, 200));
  return (
    <AbsoluteFill style={{ ...p3 }}>
      {/* the airway retires by FALLING away into depth */}
      <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(lerp(0, -900, out))}translateY(${lerp(0, 500, out * out)}px)`, opacity: 1 - k(tOut + 500, 300) }}>
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
          <path d={LUMEN} fill="rgba(0,0,0,0.16)" opacity={EASE(k(tTube + 500, 400))} />
          {/* cartilage rings across the windpipe */}
          {Array.from({ length: 8 }, (_, i) => {
            const y = AIR.y0 + 40 + i * 44;
            return <line key={i} x1={AIR.xL + 10} y1={y} x2={AIR.xR - 10} y2={y} stroke="rgba(255,255,255,0.35)" strokeWidth={10} strokeLinecap="round"
              opacity={ms >= tTube + 300 + i * 50 ? k(tTube + 300 + i * 50, 200) : 0} />;
          })}
          {AIR_PATH.map((d, i) => (
            <path key={i} d={d} fill="none" stroke={COLORS.paper} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} />
          ))}
        </svg>
        {/* labels on the left, clear of the airway */}
        <div style={{ position: "absolute", right: 1920 - (L.x0 - 40), top: AIR.voiceY - 22, ...label(COLORS.paper, 36), opacity: tagO(tVoice, tRe + 600) }}>Voice box</div>
        <div style={{ position: "absolute", right: 1920 - (AIR.xL - 40), top: 470, ...label(sub, 34), opacity: tagO(tTube + 500, tVoice) }}>Respiratory tract</div>
        {/* growths: sprout on the inner walls near each landing; cut OFF by the blade (fly out, spin, fall away); regrow with a pop */}
        {GROWTHS.map((g, i) => {
          const near = Math.min(...VIRUS.map((v) => Math.abs(v.land.y - g.y)));
          const t0 = tForm + 520 + near * 1.2;
          const grown = back(k(t0, 420));
          const tCut = tRem + clamp01((g.y - (L.top - 30)) / (AIR.y1 + 50 - L.top)) * SWEEP;
          const cutK = ms >= tCut && ms < tRe ? EASE(k(tCut, 600)) : 0;
          const re = ms >= tRe ? back(k(tRe + i * 45, 420)) : 0;
          const s = ms >= tRe ? re : ms >= tCut ? 1 : grown;
          const x = wallX(g) + (g.wall === "l" ? 7 : -7);
          const dir = g.wall === "l" ? 1 : -1; // grows INTO the airway
          return (
            <div key={i} style={{ position: "absolute", left: g.wall === "l" ? x : x - g.r, top: g.y - g.r, width: g.r, height: g.r * 2,
              borderRadius: g.wall === "l" ? `0 ${g.r}px ${g.r}px 0` : `${g.r}px 0 0 ${g.r}px`, background: GROWTH_BG,
              transformOrigin: g.wall === "l" ? "0 50%" : "100% 50%", opacity: ms < tRe ? 1 - clamp01(cutK * 1.4 - 0.4) : 1,
              transform: `${z(cutK * 260)}translate(${dir * cutK * 160}px, ${cutK * 120}px) rotate(${cutK * dir * 170}deg) scale(${s})` }} />
          );
        })}
        {/* the blade: a bar sweeping DOWN the windpipe */}
        {sweeping ? (
          <div style={{ position: "absolute", left: L.x0 - 50, top: bladeY - 5, width: L.x1 - L.x0 + 100, height: 10, borderRadius: 5, background: COLORS.paper,
            boxShadow: "0 0 0 4px rgba(255,255,255,0.25)", opacity: k(tRem, 100) * (1 - k(tRem + SWEEP, 200)) }} />
        ) : null}
        {/* the step label, left column */}
        <div style={{ position: "absolute", left: 140, width: 820, top: 640 }}>
          {ms < tRe ? (ms >= tSurg - 40 ? <SlideWords text="Surgery removes them" t={tSurg} size={64} color={COLORS.paper} align="left" /> : null)
            : <SlideWords text="They often grow back" t={tRe} size={64} color={COLORS.paper} align="left" />}
        </div>
      </div>
      {/* the two strains: tumble in from depth spinning, then fly into the walls */}
      {VIRUS.map((v, i) => {
        const tIn = tStr + i * 160;
        if (ms < tIn) return null;
        const inK = EASE(k(tIn, 650));
        const x = lerp(v.x, v.land.x, fly), y = lerp(v.y, v.land.y, fly);
        const s = lerp(1, 0.25, fly);
        return (
          <div key={i} style={{ position: "absolute", left: x - 60, top: y - 60, width: 120, height: 120, opacity: clamp01(inK * 3) * (1 - k(tForm + 420, 120)),
            transform: `${z(lerp(-1600, 0, inK))}rotate(${(1 - inK) * 320 + fly * 220}deg) scale(${s})` }}>
            <Virus size={120} color={COLORS.paper} />
          </div>
        );
      })}
      {VIRUS.map((v, i) => (
        <div key={`l${i}`} style={{ position: "absolute", left: v.x - 120, width: 240, top: v.y + 84, opacity: 1 - k(tForm, 160) }}>
          {ms >= (i === 0 ? t6 : t11) - 40 ? <SlideWords text={i === 0 ? "HPV-6" : "HPV-11"} t={i === 0 ? t6 : t11} size={44} color={COLORS.paper} /> : null}
        </div>
      ))}
      <div style={{ position: "absolute", left: 425 - 300, width: 600, top: 400, textAlign: "center", ...label(sub, 34), opacity: k(tStr, 160) * (1 - k(tForm, 160)) }}>Two strains of HPV</div>
    </AbsoluteFill>
  );
};

/** "INOVIO estimates at least 25,000 patients in the United States." (red, flat) —
 *  an ODOMETER: each digit column rolls up to its value while the figure is voiced */
export const Odo: React.FC<{ digit: number; t: number; dur: number; size: number; color: string }> = ({ digit, t, dur, size, color }) => {
  const k = useK();
  const h = size * 1.0;
  const turns = 10 + digit; // roll a full cycle, then land
  const p = EASE(k(t, dur));
  // the column is as wide as the digit it LANDS on (a hidden copy sets the width), not the widest
  // digit in the strip — a narrow "1" was sitting in a "0"-wide box and opened a gap (Nel 11-09).
  // The strip is centred and may overflow sideways mid-roll; only top/bottom are clipped.
  return (
    <div style={{ position: "relative", height: h, clipPath: "inset(0 -60% 0 -60%)" }}>
      <div style={{ ...line(size, color), height: h, lineHeight: `${h}px`, visibility: "hidden" }}>{digit}</div>
      <div style={{ position: "absolute", left: "50%", top: 0, transform: `translate(-50%, ${-p * turns * h}px)` }}>
        {Array.from({ length: turns + 1 }, (_, i) => <div key={i} style={{ ...line(size, color), height: h, lineHeight: `${h}px`, textAlign: "center" }}>{i % 10}</div>)}
      </div>
    </div>
  );
};

export const PatientCount: React.FC<Win & { by: Cued; fig: Cued; figEnd: Cued; where: Cued }> = ({ from, to, by, fig, figEnd, where }) => {
  const ms = useMs();
  const k = useK();
  const tBy = at(by, from, from);
  const tF = at(fig, tBy + 1300, from, tBy + 200);
  const tFe = at(figEnd, tF + 800, from, tF + 200);
  const tW = at(where, tFe + 400, from, tFe);
  if (ms < tBy - 40 || ms > to + 320) return null;
  const dur = Math.max(500, tFe - tF);
  const digits = [2, 5, -1, 0, 0, 0];
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300) }}>
      <div style={{ position: "absolute", top: 250, left: 0, width: 1920 }}>
        <div style={{ textAlign: "center", ...label(INK_SUB_ON_RED, 40), opacity: k(tBy, 160) }}>INOVIO estimates at least</div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 20, opacity: ms >= tF ? 1 : 0, textShadow: extrudeText(10, "#b3141d") }}>
          {digits.map((d, i) => d < 0
            ? <div key={i} style={{ ...line(230, COLORS.paper), height: 230, lineHeight: "230px" }}>,</div>
            : <Odo key={i} digit={d} t={tF + i * 60} dur={dur} size={230} color={COLORS.paper} />)}
        </div>
        <div style={{ marginTop: 26 }}>{ms >= tW - 40 ? <SlideWords text="patients in the United States" t={tW} size={56} color={COLORS.paper} /> : null}</div>
      </div>
    </AbsoluteFill>
  );
};
/** a section title card line (flat), in a world's own colours */
export const Title: React.FC<{ from: number; to: Cued; at0: Cued; text: string; color: string; top?: number; size?: number }> = ({ from, to, at0, text, color, top = 90, size = 64 }) => {
  const ms = useMs();
  const k = useK();
  const tI = at(at0, from, from);
  const tO = at(to, tI + 3000, from, tI + 200);
  if (ms < tI - 40 || ms > tO + 320) return null;
  return (
    <div style={{ position: "absolute", left: 110, top, opacity: fadeOut(ms, tO + 300) }}><SlideWords text={text} t={tI} size={size} color={color} align="left" stagger={80} /></div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// §4 DNA medicine v2 (ink, footage first) — square camera; each beat one physical move
// ══════════════════════════════════════════════════════════════════════════
/** type over the lab scrim, word by word: "A DNA medicine" → "Plasmids / Small circles of DNA" */
export const DnaTitle: React.FC<Win & { name: Cued; dna: Cued; plasmids: Cued; small: Cued }> = ({ from, to, name, dna, plasmids, small }) => {
  const ms = useMs();
  const tN = at(name, from, from);
  const tD = at(dna, tN + 1300, from, tN + 200);
  const tP = at(plasmids, tD + 1000, from, tD + 200);
  const tS = at(small, tP + 1000, from, tP + 200);
  if (ms < tN - 40 || ms > to + 320) return null;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300) }}>
      <div style={{ position: "absolute", top: 330, left: 0, width: 1920 }}>
        {ms < tP ? (<>
          <SlideWords text="Voceryq is" t={tN} size={56} color="rgba(255,255,255,0.72)" weight={400} />
          <div style={{ marginTop: 14 }}>{ms >= tD - 40 ? <SlideWords text="A DNA medicine" t={tD} size={150} color={COLORS.paper} stagger={90} /> : null}</div>
        </>) : (<>
          <SlideWords text="Plasmids" t={tP} size={150} color={COLORS.paper} />
          <div style={{ marginTop: 20 }}>{ms >= tS - 40 ? <SlideWords text="Small circles of DNA" t={tS} size={56} color="rgba(255,255,255,0.75)" weight={400} /> : null}</div>
        </>)}
      </div>
    </AbsoluteFill>
  );
};

export const RING = { cx: 720, cy: 520, rOut: 210, rIn: 168 };
const SEGS = [
  { a0: -62, a1: -18, text: "HPV-6 antigen code" },
  { a0: 18, a1: 62, text: "HPV-11 antigen code" },
];
const VIR2 = [{ x: 1420, y: 400 }, { x: 1660, y: 650 }];
const pol = (r: number, deg: number) => ({ x: Math.cos((deg * Math.PI) / 180) * r, y: Math.sin((deg * Math.PI) / 180) * r });
const arcPath = (r: number, a0: number, a1: number) => {
  const p = pol(r, a0), q = pol(r, a1);
  return `M ${p.x} ${p.y} A ${r} ${r} 0 0 1 ${q.x} ${q.y}`;
};

/** one layer of the ring (drawn `d` of the way round); `rungs` only on the front layer */
const RingLayer: React.FC<{ d: number; color: string; rungs: boolean }> = ({ d, color, rungs }) => {
  const R = RING;
  return (
    <svg width={520} height={520} viewBox="-260 -260 520 520" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <g transform="rotate(-90)">
        {[R.rOut, R.rIn].map((r) => (
          <circle key={r} r={r} fill="none" stroke={color} strokeWidth={9} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - d} />
        ))}
        {rungs ? Array.from({ length: 48 }, (_, i) => {
          const a = (i / 48) * 360;
          if (a / 360 > d) return null;
          const p = pol(R.rIn + 6, a), q = pol(R.rOut - 6, a);
          return <line key={i} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="rgba(255,255,255,0.55)" strokeWidth={4} />;
        }) : null}
      </g>
    </svg>
  );
};

/** the plasmid: a SOLID ring (four stacked layers in depth) that RISES from lying flat to face
 *  the viewer as it draws on "circles"; the two code segments burst on red on their numbers;
 *  the viruses tumble in from depth; red target brackets SPIN off the segments and SLAM onto them */
export const Plasmid: React.FC<Win & { draw: Cued; six: Cued; eleven: Cued; immune: Cued; virus: Cued; fly: Cued }> = ({ from, to, draw, six, eleven, immune, virus, fly }) => {
  const ms = useMs();
  const k = useK();
  const p3 = useP3();
  const z = useZ();
  const tDraw = at(draw, from + 3700, from);
  const t6 = at(six, tDraw + 2800, from, tDraw + 300);
  const t11 = at(eleven, t6 + 500, from, t6 + 100);
  const tIm = at(immune, t11 + 1600, from, t11 + 300);
  const tV = at(virus, tIm + 1800, from, tIm + 300);
  const tF = at(fly, tV + 400, from, tV + 100);
  if (ms < tDraw - 40 || ms > to + 320) return null;
  const d = EASE(k(tDraw, 900));
  const rise = EASE(k(tDraw, 1000));
  const R = RING;
  const flyK = EASE(k(tF, 650));
  const lock = k(tF + 650, 200);
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to + 300) }}>
      {/* the solid ring, rising from flat */}
      <div style={{ position: "absolute", left: R.cx - 260, top: R.cy - 260, width: 520, height: 520, ...p3, transform: `rotateX(${lerp(78, 0, rise)}deg)` }}>
        {[-24, -16, -8].map((dz) => (
          <div key={dz} style={{ position: "absolute", inset: 0, transform: `translateZ(${dz}px)` }}><RingLayer d={d} color="#7a7a7a" rungs={false} /></div>
        ))}
        <div style={{ position: "absolute", inset: 0 }}>
          <RingLayer d={d} color={COLORS.paper} rungs />
          <svg width={520} height={520} viewBox="-260 -260 520 520" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            {SEGS.map((s, i) => {
              const t = i === 0 ? t6 : t11;
              if (ms < t) return null;
              const g = EASE(k(t, 360));
              const w = (R.rOut - R.rIn + 4) * lerp(1.8, 1, EASE(k(t, 420)));
              return <path key={i} d={arcPath((R.rOut + R.rIn) / 2, s.a0, s.a1)} fill="none" stroke={COLORS.accent} strokeWidth={w} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - g} />;
            })}
          </svg>
        </div>
      </div>
      {SEGS.map((s, i) => {
        const m = pol(R.rOut + 70, (s.a0 + s.a1) / 2);
        const t = i === 0 ? t6 : t11;
        return (
          <div key={i} style={{ position: "absolute", left: R.cx + m.x, top: R.cy + m.y - 26, opacity: 1 - k(tIm, 200) }}>
            {ms >= t - 40 ? <SlideWords text={s.text} t={t} size={44} color={COLORS.paper} align="left" stagger={50} /> : null}
          </div>
        );
      })}
      {VIR2.map((v, i) => {
        const tIn = tV + i * 140;
        if (ms < tIn) return null;
        const inK = EASE(k(tIn, 600));
        return (
          <div key={i} style={{ position: "absolute", left: v.x - 60, top: v.y - 60, opacity: clamp01(inK * 3), transform: `${z(lerp(-1400, 0, inK))}rotate(${(1 - inK) * 300}deg)` }}>
            <Virus size={120} color={COLORS.paper} />
          </div>
        );
      })}
      {/* the brackets: spin off the segments, slam onto the viruses */}
      {ms >= tF ? SEGS.map((s, i) => {
        const m = pol((R.rOut + R.rIn) / 2, (s.a0 + s.a1) / 2);
        const x = lerp(R.cx + m.x, VIR2[i].x, flyK), y = lerp(R.cy + m.y, VIR2[i].y, flyK) - Math.sin(Math.PI * flyK) * 90;
        const size = lerp(60, 170, flyK) * lerp(1.25, 1, EASE(lock));
        return (
          <div key={i} style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, opacity: k(tF, 120), transform: `rotate(${(1 - flyK) * (i ? -270 : 270)}deg)` }}>
            <Corner l t /><Corner t /><Corner l /><Corner />
          </div>
        );
      }) : null}
      <div style={{ position: "absolute", top: 850, left: 160, width: 1600 }}>
        <FlowLine from={tIm - 200} to={to} line="So the immune system can go after the virus behind the growths." size={48} color={COLORS.paper} align="center" />
      </div>
    </AbsoluteFill>
  );
};

const Corner: React.FC<{ l?: boolean; t?: boolean }> = ({ l, t }) => {
  const b = `8px solid ${COLORS.accent}`;
  return (
    <div style={{ position: "absolute", width: 34, height: 34, left: l ? 0 : undefined, right: l ? undefined : 0, top: t ? 0 : undefined, bottom: t ? undefined : 0,
      borderTop: t ? b : undefined, borderBottom: t ? undefined : b, borderLeft: l ? b : undefined, borderRight: l ? undefined : b }} />
  );
};

/** "It is given with INOVIO's own delivery device, CELLECTRA, over 9 weeks." — nine week-blocks
 *  rise dark, then FLIP OVER like dominoes to white across "over 9 weeks" */
const WEEK_C: CubeC = { front: COLORS.paper, side: "#2b2b2b", top: "#cfcfcf" };
export const Cellectra: React.FC<Win & { own: Cued; name: Cued; over: Cued; weeks: Cued }> = ({ from, to, own, name, over, weeks }) => {
  const ms = useMs();
  const k = useK();
  const p3 = useP3();
  const tOwn = at(own, from + 600, from);
  const tName = at(name, tOwn + 900, from, tOwn + 200);
  const tOver = at(over, tName + 800, from, tName + 200);
  const tW = at(weeks, tOver + 600, from, tOver + 100);
  if (ms < tOwn - 40 || ms > to + 320) return null;
  const N = 9, cw = 110, gap = 18, left = 960 - (N * cw + (N - 1) * gap) / 2;
  const span = Math.max(500, tW + 300 - tOver);
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to + 300) }}>
      <div style={{ position: "absolute", top: 190, left: 0, width: 1920 }}>
        <SlideWords text="INOVIO's own delivery device" t={tOwn} size={48} color="rgba(255,255,255,0.72)" weight={400} />
        <div style={{ marginTop: 16, textAlign: "center", ...line(150, COLORS.paper), textShadow: extrudeText(12, "#6e6e6e"), opacity: ms >= tName ? clamp01(k(tName, 120) * 3) : 0,
          transform: `scale(${lerp(1.8, 1, Easing_in(k(tName, 220)))})` }}>CELLECTRA</div>
      </div>
      {Array.from({ length: N }, (_, i) => {
        const tIn = tOver - 380 + i * 20;
        if (ms < tIn) return null;
        const flip = ms >= tOver + (i / N) * span ? EASE(k(tOver + (i / N) * span, 320)) : 0;
        return <Box3 key={i} cx={left + i * (cw + gap) + cw / 2} cy={615} w={cw} h={cw} d={cw} c={WEEK_C} radius={10}
          extra={`rotateX(${lerp(180, 0, flip)}deg) scale(${back(k(tIn, 300))})`} />;
      })}
      <div style={{ position: "absolute", top: 712, left: 0, width: 1920 }}>
        {ms >= tW - 40 ? <SlideWords text="Over 9 weeks" t={tW} size={60} color={COLORS.paper} /> : null}
      </div>
    </AbsoluteFill>
  );
};

/** "INOVIO calls it the first FDA-approved DNA medicine." — attributed, never our voice.
 *  The opening quote mark slams in first; the claim writes on; the attribution chip stamps. */
export const ClaimQuote: React.FC<Win & { calls: Cued; quote: Cued }> = ({ from, to, calls, quote }) => {
  const ms = useMs();
  const k = useK();
  const stamp = useStampK();
  const tC = at(calls, from, from);
  const tQ = at(quote, tC + 700, from, tC + 100);
  if (ms < tC - 40 || ms > to + 320) return null;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300) }}>
      <div style={{ position: "absolute", top: 210, left: 0, width: 1920, textAlign: "center", ...line(260, "rgba(255,255,255,0.18)"), lineHeight: 0.8,
        opacity: clamp01(k(tC, 120) * 3), transform: `scale(${lerp(2.2, 1, Easing_in(k(tC, 240)))})` }}>{"“"}</div>
      <div style={{ position: "absolute", top: 330, left: 0, width: 1920 }}>
        <SlideWords text="INOVIO calls it" t={tC} size={48} color="rgba(255,255,255,0.72)" weight={400} />
      </div>
      <div style={{ position: "absolute", top: 420, left: 160, width: 1600 }}>
        <FlowLine from={tQ} to={to} line={"“The first FDA-approved DNA medicine”"} size={96} color={COLORS.paper} align="center" lineHeight={1.1} />
      </div>
      {ms >= tQ + 1600 ? (
        <div style={{ position: "absolute", top: 660, left: 0, width: 1920, display: "flex", justifyContent: "center" }}>
          <div style={{ ...label(COLORS.ink, 32), background: COLORS.paper, borderRadius: 999, padding: "12px 30px", ...stamp(tQ + 1600) }}>INOVIO's claim</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// §5 Numbers v2 (paper) — THE SPINE returns as SOLID blocks: 32 rain onto the ledge; the 6
// extra TUMBLE OFF the edge; the 7 LIFT out of the row and turn red; 27% slams over a veil
// ══════════════════════════════════════════════════════════════════════════
export const NumbersGrid: React.FC<Win & { enrolled: Cued; trim: Cued; seven: Cued; veil: Cued }> = ({ from, to, enrolled, trim, seven, veil }) => {
  const ms = useMs();
  const k = useK();
  const p3 = useP3();
  const drop = useDrop();
  const tE = at(enrolled, from + 2800, from);
  const tT = at(trim, tE + 1300, from, tE + 300);
  const t7 = at(seven, tT + 8000, from, tT + 300);
  const tV = at(veil, t7 + 3500, from, t7 + 300);
  if (ms < tE - 40 || ms > to + 320) return null;
  const T = GRID.tile;
  const row3Left = 960 - (6 * T + 5 * GRID.gap) / 2;
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to + 300) }}>
      {Array.from({ length: 32 }, (_, i) => {
        const extra = i >= 26;
        const c = extra ? i - 26 : i % GRID.cols, r = extra ? 2 : Math.floor(i / GRID.cols);
        const x = (extra ? row3Left + c * (T + GRID.gap) : gridLeft + c * (T + GRID.gap)) + T / 2;
        const y = GRID.top + r * (T + GRID.gap) + T / 2;
        const dr = drop(tE + (Math.abs(c - 6) + r * 2) * 30, 700, 340);
        if (!dr.on) return null;
        // the six extra tumble off the ledge: forward, down, spinning, out of frame
        const off = extra && ms >= tT ? clamp01((ms - tT - (i - 26) * 50) / 900) : 0;
        if (off >= 1) return null;
        // the seven lift out of the row and turn red
        const liftK = i < 7 && ms >= t7 + i * 70 ? EASE(k(t7 + i * 70, 380)) : 0;
        const c3 = liftK > 0.5 ? CUBE_RED : CUBE_PAPER;
        return <Box3 key={i} cx={x + off * 80} cy={y + dr.dy + (T * (1 - dr.sy)) / 2 + off * off * 700 - liftK * 26} cz={off * 260 + liftK * 70} w={T} h={T} d={T} c={c3} radius={6}
          extra={`rotateX(${off * (i % 2 ? 260 : 200)}deg) rotateZ(${off * (i % 2 ? 50 : -40)}deg) scale(${dr.sx}, ${dr.sy})`} style={{ opacity: 1 - clamp01(off * 1.6 - 0.6) }} />;
      })}
      {/* the verdict's veil: the grid steps back, it does not retire */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, background: "rgba(255,255,255,0.8)", opacity: ms >= tV ? EASE(k(tV, 300)) : 0, transform: "translateZ(200px)" }} />
    </AbsoluteFill>
  );
};

export const NumbersType: React.FC<Win & { title: Cued; study: Cued; n32: Cued; n26: Cued; three: Cued; median: Cued; twelve: Cued; seven: Cued; none: Cued; pct: Cued }> = ({
  from, to, title, study, n32, n26, three, median, twelve, seven, none, pct,
}) => {
  const ms = useMs();
  const k = useK();
  const tTi = at(title, from, from);
  const tSt = at(study, tTi + 1500, from, tTi + 200);
  const t32 = at(n32, tSt + 1200, from, tSt + 100);
  const t26 = at(n26, t32 + 1300, from, t32 + 300);
  const t3 = at(three, t26 + 1000, from, t26 + 100);
  const tMed = at(median, t3 + 3000, from, t3 + 300);
  const t12 = at(twelve, tMed + 2500, from, tMed + 300);
  const t7 = at(seven, t12 + 1500, from, t12 + 300);
  const tNo = at(none, t7 + 1800, from, t7 + 300);
  const tP = at(pct, tNo + 1700, from, tNo + 300);
  if (ms < tTi - 40 || ms > to + 320) return null;
  // the figure row: one seat, three states (32 → 26 → 7); each number ROLLS on an odometer
  const fig = ms < t26 ? { key: "f32", d: [3, 2], rest: "adults enrolled", tN: t32, tR: t32 }
    : ms < t7 ? { key: "f26", d: [2, 6], rest: "needed 3 or more surgeries the year before", tN: t26, tR: t3 }
    : { key: "f7", d: [7], rest: "of those 26 needed no surgery at all", tN: t7, tR: tNo };
  const sub = ms < t12 ? { text: "Median: 4.5 surgeries", t: tMed } : { text: "In the 12 months after treatment", t: t12 };
  const slam = k(tP, 220);
  const ring = k(tP + 220, 450);
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300) }}>
      <div style={{ position: "absolute", top: 400, left: 0, width: 1920, opacity: fadeOut(ms, tSt + 300) }}>
        <SlideWords text="The numbers" t={tTi} size={140} color={COLORS.ink} stagger={100} />
      </div>
      {ms >= t32 ? (
        <div style={{ position: "absolute", top: 140, left: 0, width: 1920, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 28, opacity: fadeOut(ms, tP + 300) }}>
          <div key={fig.key} style={{ display: "flex" }}>
            {fig.d.map((dg, i) => <Odo key={i} digit={dg} t={fig.tN + i * 60} dur={500} size={170} color={COLORS.ink} />)}
          </div>
          <div key={fig.key + "r"} style={{ paddingBottom: 26 }}>
            {ms >= fig.tR - 40 ? <SlideWords text={fig.rest} t={fig.tR} size={52} color={COLORS.ink} align="left" stagger={45} /> : null}
          </div>
        </div>
      ) : null}
      {ms >= tMed - 40 ? (
        <div key={sub.text} style={{ position: "absolute", top: 790, left: 0, width: 1920, opacity: fadeOut(ms, tP + 300) }}>
          <SlideWords text={sub.text} t={sub.t} size={48} color={COLORS.grayText} weight={400} />
        </div>
      ) : null}
      {/* the verdict: an extruded 27% SLAMS down, one shock ring */}
      {ms >= tP ? (
        <div style={{ position: "absolute", top: 330, left: 0, width: 1920, textAlign: "center" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <div style={{ position: "absolute", inset: "-20px -40px", borderRadius: 40, border: `6px solid ${COLORS.ink}`, opacity: ms >= tP + 220 ? 0.5 * (1 - ring) : 0, transform: `scale(${lerp(1, 1.4, EASE(ring))})` }} />
            <div style={{ ...line(300, COLORS.ink), textShadow: extrudeText(14, "#9a9a9a"), opacity: clamp01(slam * 4), transform: `scale(${lerp(2.6, 1, slam * slam)})` }}>27%</div>
          </div>
          <div style={{ marginTop: 10 }}>{ms >= tP + 250 ? <SlideWords text="7 of 26 · no surgery in the 12 months after" t={tP + 250} size={52} color={COLORS.ink} stagger={40} /> : null}</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
// ══════════════════════════════════════════════════════════════════════════
// §6a NotFirst v2 (ink) — "It is not the first drug here." Voceryq's stop rises as a pillar with
// a rank flap reading 1; on "In August" the rail draws LEFT (the camera follows it) and an
// earlier pillar rises: Papzimeos takes 1 and Voceryq's flap FLIPS to 2 (show, don't tell).
// Its own card carries its own numbers; Voceryq's 27% is NOT on this frame.
// ══════════════════════════════════════════════════════════════════════════
// stampCx/Cy: where the stamp column lands beside the card (flex row: card 660 wide + 64 gap + ~500 column)
export const RAIL = { y: 660, x0: 300, x1: 1640, papX: 560, vocX: 1360, stampCx: 1204, stampCy: 270 };

/** a small rank flap (white cell, ink numeral) that flips between states */
const RankFlap: React.FC<{ states: [number, string][] }> = ({ states }) => {
  const ms = useMs();
  let cur = "", prev = "", tCur = -Infinity;
  for (const [t, ch] of states) { if (ms >= t) { prev = cur; cur = ch; tCur = t; } }
  const f = clamp01((ms - tCur) / 300);
  const ang = f < 0.5 ? -f * 180 : (1 - f) * 180;
  return (
    <div style={{ width: 84, height: 96, borderRadius: 12, background: COLORS.paper, boxShadow: extrude(6, "#8a8a8a", "rgba(0,0,0,0.4)"), perspective: 500, position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", transform: `rotateX(${ang}deg)` }}>
        <div style={line(64, COLORS.ink)}>{f < 0.5 ? prev : cur}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 46, height: 4, background: "rgba(0,0,0,0.1)" }} />
    </div>
  );
};

export const NotFirst: React.FC<Win & { punch: Cued; august: Cued; year: Cued; precigen: Cued; papz: Cued; first: Cued; pivotal: Cued; n18: Cued; pct: Cued; complete: Cued; full: Cued; noConf: Cued }> = ({
  from, to, punch, august, year, precigen, papz, first, pivotal, n18, pct, complete, full, noConf,
}) => {
  const ms = useMs();
  const k = useK();
  const p3 = useP3();
  const tPu = at(punch, from + 1000, from);
  const tAu = at(august, tPu + 1600, from, tPu + 300);
  const tYr = at(year, tAu + 400, from, tAu + 100);
  const tPre = at(precigen, tYr + 2000, from, tYr + 200);
  const tPa = at(papz, tPre + 600, from, tPre + 100);
  const tFi = at(first, tPa + 700, from, tPa + 100);
  const tPiv = at(pivotal, tFi + 3200, from, tFi + 300);
  const t18 = at(n18, tPiv + 1100, from, tPiv + 100);
  const tPct = at(pct, t18 + 1800, from, t18 + 300);
  const tCo = at(complete, tPct + 1200, from, tPct + 200);
  const tFu = at(full, tCo + 3000, from, tCo + 300);
  const tNo = at(noConf, tFu + 1100, from, tFu + 100);
  if (ms < tPu - 40 || ms > to + 320) return null;
  const sub = "rgba(255,255,255,0.65)";
  const draw = EASE(k(tAu, 1000));
  const railL = lerp(RAIL.vocX, RAIL.x0, draw);
  const slam = k(tFu, 200);
  const ring = k(tFu + 200, 450);
  const Pillar: React.FC<{ x: number; t: number; date: string; rank: [number, string][] }> = ({ x, t, date, rank }) => {
    const h = 90 * back(k(t, 420)); // short: its rank flap must clear the card above (card bottom ~440, flap top ~460)
    return (
      <>
        <div style={{ position: "absolute", left: x - 22, top: RAIL.y - h, width: 44, height: h, borderRadius: "8px 8px 0 0", background: "rgba(255,255,255,0.9)", boxShadow: extrude(8, "#7a7a7a", "rgba(0,0,0,0)") }} />
        <div style={{ position: "absolute", left: x - 42, top: RAIL.y - h - 110, opacity: clamp01(k(t + 150, 160) * 2) }}><RankFlap states={rank} /></div>
        <div style={{ position: "absolute", left: x - 200, width: 400, top: RAIL.y + 30 }}>{ms >= t - 40 ? <SlideWords text={date} t={t} size={40} color={COLORS.paper} /> : null}</div>
      </>
    );
  };
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to + 300) }}>
      {/* the punch: its own move, retires when the history starts */}
      <div style={{ position: "absolute", top: 200, left: RAIL.vocX - 900, width: 1800, opacity: fadeOut(ms, tAu + 300) }}>
        <SlideWords text="Not the first drug here" t={tPu} size={110} color={COLORS.paper} stagger={60} />
      </div>
      {/* the rail: Voceryq's stop first, then drawing left */}
      <div style={{ position: "absolute", left: railL, top: RAIL.y - 4, width: RAIL.x1 - railL, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.5)", opacity: k(tPu, 200) }} />
      <Pillar x={RAIL.vocX} t={tPu} date="Oct 2026" rank={[[tPu + 150, "1"], [tYr + 500, "2"]]} />
      <div style={{ position: "absolute", left: RAIL.vocX + 60, top: RAIL.y - 120 }}>{ms >= tPu + 150 ? <SlideWords text="Voceryq" t={tPu + 150} size={52} color={sub} align="left" /> : null}</div>
      {ms >= tYr ? <Pillar x={RAIL.papX} t={tYr} date="Aug 2025" rank={[[tYr + 150, "1"]]} /> : null}
      {/* card + verdict share ONE flex row: the stamp is laid out by the card's width, never a fixed x */}
      <div style={{ position: "absolute", left: RAIL.papX - 330, top: 100, display: "flex", alignItems: "center", gap: 64 }}>
        <div style={{ width: 660 }}>
          <div style={{ height: 44 }}>{ms >= tPre - 40 ? <SlideWords text="Precigen" t={tPre} size={40} color={sub} /> : null}</div>
          <div style={{ marginTop: 8, height: 108 }}>{ms >= tPa - 40 ? <SlideWords text="Papzimeos" t={tPa} size={100} color={COLORS.paper} /> : null}</div>
          <div style={{ position: "relative", height: 190, marginTop: 10 }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, opacity: fadeOut(ms, tPiv + 300) }}>
              {ms >= tFi - 40 ? <SlideWords text="First therapy for adults with RRP" t={tFi} size={40} color={COLORS.paper} stagger={45} /> : null}
            </div>
            {ms >= tPct ? (
              <div style={{ position: "absolute", left: 0, right: 0, top: 0, display: "flex", justifyContent: "center" }}>
                <Odo digit={5} t={tPct} dur={600} size={120} color={COLORS.paper} /><Odo digit={1} t={tPct + 60} dur={600} size={120} color={COLORS.paper} />
                <div style={{ ...line(120, COLORS.paper), height: 120, lineHeight: "120px" }}>%</div>
              </div>
            ) : null}
            <div style={{ position: "absolute", left: 0, right: 0, top: 132 }}>
              {ms >= t18 - 40 ? <SlideWords text={ms >= tCo ? "18 of 35 patients · complete response" : "18 of 35 patients"} t={t18} size={36} color={sub} weight={400} stagger={40} /> : null}
            </div>
          </div>
        </div>
        {/* the regulatory verdict on Papzimeos: SLAMS straight with one shock ring, the scene's one red */}
        {ms >= tFu ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: 16, border: `5px solid ${COLORS.accent}`, opacity: ms >= tFu + 200 ? 0.8 * (1 - ring) : 0, transform: `scale(${lerp(1, 1.6, EASE(ring))})` }} />
              <div style={{ border: `8px solid ${COLORS.accent}`, borderRadius: 16, padding: "14px 30px", ...line(56, COLORS.accent), opacity: clamp01(slam * 4), transform: `scale(${lerp(2.4, 1, slam * slam)})` }}>Full approval</div>
            </div>
            <div style={{ marginTop: 18 }}>{ms >= tNo - 40 ? <SlideWords text="No confirmatory trial required" t={tNo} size={34} color={COLORS.paper} weight={400} stagger={40} /> : null}</div>
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// §6b TwoPaths v2 (paper) — two equal SLABS swing in from the sides; a wall FALLS between them and
// lands with a squash; the struck "vs". On "regulatory path" the slabs FOLD FLAT and two roads
// draw. Voceryq's road meets a red barrier that LIFTS on "accelerated", then runs DASHED past it.
// ══════════════════════════════════════════════════════════════════════════
export const PATHS = { x0: 360, x1: 1640, papY: 400, vocY: 690, gateX: 1000, protoX: 1330 };

export const TwoPaths: React.FC<Win & { different: Cued; notA: Cued; h2h: Cued; comparison: Cued; path: Cued; differs: Cued; vocApproval: Cued; accel: Cued; cont: Cued; may: Cued; draft: Cued; year: Cued }> = ({
  from, to, different, notA, h2h, comparison, path, differs, vocApproval, accel, cont, may, draft, year,
}) => {
  const ms = useMs();
  const k = useK();
  const p3 = useP3();
  const z = useZ();
  const drop = useDrop();
  const tDi = at(different, from + 600, from);
  const tNa = at(notA, tDi + 2000, from, tDi + 300);
  const tH = at(h2h, tNa + 200, from, tNa + 50);
  const tCm = at(comparison, tH + 700, from, tH + 100);
  const tPa = at(path, tCm + 1100, from, tCm + 200);
  const tDf = at(differs, tPa + 700, from, tPa + 100);
  const tVa = at(vocApproval, tDf + 900, from, tDf + 100);
  const tAc = at(accel, tVa + 1200, from, tVa + 100);
  const tCo = at(cont, tAc + 1300, from, tAc + 200);
  const tMa = at(may, tCo + 1400, from, tCo + 100);
  const tDr = at(draft, tMa + 3000, from, tMa + 300);
  const tYr = at(year, tDr + 1900, from, tDr + 200);
  if (ms < tDi - 40 || ms > to + 320) return null;
  const ink = COLORS.ink, gray = COLORS.grayText;
  const fold = ms >= tPa ? EASE(k(tPa, 450)) : 0;
  const Card: React.FC<{ side: -1 | 1; name: string; pct: string; n: string }> = ({ side, name, pct, n }) => {
    const inK = EASE(k(tDi + (side > 0 ? 140 : 0), 600));
    return (
      <div style={{ position: "absolute", left: 960 + side * 380 - 280, width: 560, top: 260, height: 380, borderRadius: 26, background: COLORS.panel,
        boxShadow: extrude(12, "#cfcfcf", "rgba(0,0,0,0.14)"), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        opacity: clamp01(inK * 3) * (1 - clamp01(fold * 1.5 - 0.5)), transformOrigin: "50% 100%",
        transform: `${z(lerp(-700, 0, inK))}translateX(${side * lerp(300, 0, inK)}px) rotateY(${side * lerp(-70, 0, inK)}deg) rotateX(${fold * 88}deg)` }}>
        <div style={line(56, ink)}>{name}</div>
        <div style={{ ...line(150, ink), marginTop: 6 }}>{pct}</div>
        <div style={{ ...line(34, gray, 400), marginTop: 6 }}>{n}</div>
      </div>
    );
  };
  const wall = drop(tNa, 900, 320);
  const papD = ms >= tDf ? EASE(k(tDf, 900)) : 0;
  const vocD = ms >= tVa ? EASE(k(tVa, 700)) : 0;
  const dashD = ms >= tCo ? EASE(k(tCo, 1200)) : 0;
  const W = PATHS.x1 - PATHS.x0;
  const lift = ms >= tAc + 380 ? EASE(k(tAc + 380, 420)) : 0;
  const diamond = drop(tDr, 300, 260);
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to + 300) }}>
      <Card side={-1} name="Voceryq" pct="27%" n="7 of 26 · no surgery in 12 months" />
      <Card side={1} name="Papzimeos" pct="51%" n="18 of 35 · complete response" />
      {/* the wall falls and lands with a squash */}
      {wall.on ? (
        <div style={{ position: "absolute", left: 952, top: 180 + wall.dy, width: 16, height: 560, borderRadius: 8, background: ink, transformOrigin: "50% 100%",
          transform: `scale(${wall.sx}, ${wall.sy})`, opacity: 1 - fold }} />
      ) : null}
      {ms >= tH ? (
        <div style={{ position: "absolute", left: 960 - 70, top: 415, width: 140, height: 90, borderRadius: 45, background: COLORS.paper, border: `5px solid ${ink}`,
          display: "flex", alignItems: "center", justifyContent: "center", opacity: k(tH, 120) * (1 - fold), transform: `scale(${back(k(tH, 360))})` }}>
          <div style={line(48, ink)}>vs</div>
          {/* centred on the word: the chip's inner box is 80px tall, lowercase "vs" sits ~3px below the box centre, so the slash sits at 40 and rotates about its own middle */}
          <div style={{ position: "absolute", left: 22, right: 22, top: 40, height: 6, background: ink, transformOrigin: "50% 50%", transform: `rotate(-18deg) scaleX(${EASE(k(tH + 200, 260))})` }} />
        </div>
      ) : null}
      <div style={{ position: "absolute", top: 820, left: 0, width: 1920, opacity: 1 - fold }}>
        {ms >= tCm - 40 ? <SlideWords text="Different trials · not a head-to-head comparison" t={tCm} size={48} color={ink} stagger={40} /> : null}
      </div>

      {/* the roads */}
      <div style={{ position: "absolute", left: 0, width: 1920, top: 110, opacity: fadeOut(ms, tCo + 300) }}>
        {ms >= tPa + 160 ? <SlideWords text="The regulatory path is what differs" t={tPa + 160} size={64} color={ink} stagger={50} /> : null}
      </div>
      {[{ name: "Papzimeos", y: PATHS.papY, t: tPa + 200 }, { name: "Voceryq", y: PATHS.vocY, t: tPa + 320 }].map((p) => (
        <div key={p.name} style={{ position: "absolute", left: PATHS.x0, top: p.y - 92 }}>{ms >= p.t - 40 ? <SlideWords text={p.name} t={p.t} size={56} color={ink} align="left" /> : null}</div>
      ))}
      <div style={{ position: "absolute", left: PATHS.x0, top: PATHS.papY - 9, width: W * papD, height: 18, borderRadius: 9, background: ink }} />
      {/* Papzimeos's road ends in a solid block: done */}
      {ms >= tDf + 800 ? <div style={{ position: "absolute", left: PATHS.x1 - 10, top: PATHS.papY - 34, width: 20, height: 68, borderRadius: 6, background: ink, transform: `scaleY(${back(k(tDf + 800, 360))})` }} /> : null}
      <div style={{ position: "absolute", left: PATHS.x1 - 440, width: 420, top: PATHS.papY + 30, textAlign: "right" }}>
        {ms >= tDf + 860 ? (<>
          <div style={{ display: "flex", justifyContent: "flex-end" }}><SlideWords text="Full approval" t={tDf + 860} size={40} color={ink} /></div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}><SlideWords text="No confirmatory trial" t={tDf + 960} size={32} color={gray} weight={400} /></div>
        </>) : null}
      </div>
      <div style={{ position: "absolute", left: PATHS.x0, top: PATHS.vocY - 9, width: (PATHS.gateX - PATHS.x0) * vocD, height: 18, borderRadius: 9, background: ink }} />
      {/* the barrier (the scene's one red): drops in closed across the road, then LIFTS open */}
      {ms >= tAc ? (<>
        <div style={{ position: "absolute", left: PATHS.gateX - 9, top: PATHS.vocY - 90, width: 18, height: 110, borderRadius: 6, background: COLORS.accent, transformOrigin: "50% 100%", transform: `scaleY(${back(k(tAc, 300))})` }} />
        <div style={{ position: "absolute", left: PATHS.gateX, top: PATHS.vocY - 84, width: 170, height: 16, borderRadius: 8, background: COLORS.accent, transformOrigin: "0 50%",
          opacity: clamp01(k(tAc + 150, 120) * 2), transform: `rotate(${lerp(0, -72, lift)}deg) scaleX(${EASE(k(tAc + 150, 220))})` }} />
        {/* below the road, left of the gate: clear of the lifting arm's sweep and of the dashed label */}
        <div style={{ position: "absolute", right: 1920 - (PATHS.gateX - 30), top: PATHS.vocY + 30, display: "flex", justifyContent: "flex-end" }}><SlideWords text="Accelerated approval" t={tAc + 100} size={40} color={COLORS.accent} /></div>
      </>) : null}
      {/* dashed past the gate: continued approval not yet settled */}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <line x1={PATHS.gateX + 14} y1={PATHS.vocY} x2={lerp(PATHS.gateX + 14, PATHS.x1, dashD)} y2={PATHS.vocY} stroke={ink} strokeWidth={14} strokeDasharray="30 22" />
      </svg>
      {ms >= tMa ? (
        <div style={{ position: "absolute", left: PATHS.gateX + 40, width: PATHS.x1 - PATHS.gateX - 40, top: PATHS.vocY + 30, opacity: fadeOut(ms, tDr + 300) }}>
          <SlideWords text="Continued approval may depend on a confirmatory study" t={tMa} size={34} color={ink} align="left" stagger={35} />
        </div>
      ) : null}
      {diamond.on ? (<>
        <div style={{ position: "absolute", left: PATHS.protoX - 20, top: PATHS.vocY - 20 + diamond.dy, width: 40, height: 40, background: ink,
          transform: `rotate(45deg) scale(${diamond.sx}, ${diamond.sy})` }} />
        <div style={{ position: "absolute", left: PATHS.protoX - 300, width: 600, top: PATHS.vocY + 44 }}>
          <SlideWords text="Draft confirmatory protocol" t={tDr + 260} size={38} color={ink} />
          <div style={{ marginTop: 6 }}>{ms >= tYr - 40 ? <SlideWords text="FDA wants it by the end of 2026" t={tYr} size={34} color={gray} weight={400} stagger={40} /> : null}</div>
        </div>
      </>) : null}
    </AbsoluteFill>
  );
};
// ══════════════════════════════════════════════════════════════════════════
// §7 Why it matters v2 (red) — the letter SLIDES UP out of an envelope that then drops away;
// the concern writes on; a "?" SLAMS with one ring and flips (one face per half) to a check;
// the §4 ring returns as the platform and drops into a carton whose lid slams shut
// ══════════════════════════════════════════════════════════════════════════
export const LETTER = { cx: 960, top: 210, w: 1040, h: 470, qX: 1360, qY: 450 };

export const Letter: React.FC<Win & { fold: Cued; accepting: Cued; raised: Cued; q: Cued; argued: Cued; answers: Cued }> = ({ from, to, fold, accepting, raised, q, argued, answers }) => {
  const ms = useMs();
  const k = useK();
  const p3 = useP3();
  const tF = at(fold, from + 1500, from);
  const tAc = at(accepting, tF + 800, from, tF + 100);
  const tR = at(raised, tAc + 1400, from, tAc + 200);
  const tQ = at(q, tR + 5000, from, tR + 300);
  const tAr = at(argued, tQ + 800, from, tQ + 200);
  const tAn = at(answers, tAr + 2700, from, tAr + 300);
  if (ms < tF - 40 || ms > to + 320) return null;
  const L = LETTER;
  const envIn = back(k(tF, 380)); // the envelope pops up from below
  const rise = EASE(k(tF + 300, 650)); // the letter slides up out of it
  const envOut = EASE(k(tAc, 500)); // then the envelope drops away
  const flip = EASE(k(tAn, 420));
  const slam = k(tQ, 200);
  const ring = k(tQ + 200, 450);
  const envTop = L.top + L.h - 120;
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to + 300) }}>
      {/* the letter (clipped to above the envelope's mouth until it is fully out) */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: rise < 1 ? `inset(0 0 ${1080 - envTop - 40}px 0)` : undefined }}>
        <div style={{ position: "absolute", left: L.cx - L.w / 2, top: L.top, width: L.w, height: L.h, borderRadius: 24, background: COLORS.paper,
          boxShadow: extrude(10, "#e3b5b8", "rgba(0,0,0,0.25)"), transform: `translateY(${lerp(L.h + 40, 0, rise)}px)`, padding: "44px 56px", boxSizing: "border-box" }}>
          <div style={{ ...label(COLORS.grayText, 30) }}>U.S. FDA</div>
          <div style={{ marginTop: 10, height: 52 }}>{ms >= tAc - 40 ? <SlideWords text="Application accepted" t={tAc} size={48} color={COLORS.ink} align="left" /> : null}</div>
          <div style={{ height: 4, background: COLORS.border, marginTop: 26, marginBottom: 26 }} />
          {ms < tR ? [0.92, 0.78, 0.85].map((w, i) => (
            <div key={i} style={{ height: 18, width: `${w * 100}%`, borderRadius: 9, background: COLORS.panel, marginBottom: 22 }} />
          )) : (
            <div style={{ width: 700 }}>
              <FlowLine from={tR} to={to} line="A preliminary concern about whether Voceryq qualified for accelerated approval at all." size={44} color={COLORS.ink} lineHeight={1.2} />
            </div>
          )}
        </div>
      </div>
      {/* the envelope */}
      {envOut < 1 ? (
        <div style={{ position: "absolute", left: L.cx - 600, top: envTop, width: 1200, height: 330, opacity: clamp01(envIn * 2) * (1 - envOut),
          transform: `translateY(${lerp(300, 0, envIn) + envOut * 700}px) rotate(${envOut * 8}deg)` }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 22, background: "#f6d4d6", boxShadow: extrude(10, "#c98d91", "rgba(0,0,0,0.25)") }} />
          <svg width={1200} height={330} style={{ position: "absolute", left: 0, top: 0 }}>
            <path d="M 0 0 L 600 190 L 1200 0" fill="none" stroke="#d9a5a9" strokeWidth={8} strokeLinejoin="round" />
          </svg>
        </div>
      ) : null}
      {/* the question mark → check */}
      {ms >= tQ ? (
        <div style={{ position: "absolute", left: L.qX - 90, top: L.qY - 90, width: 180, height: 180 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 90, border: `6px solid ${COLORS.paper}`, opacity: ms >= tQ + 200 ? 0.9 * (1 - ring) : 0, transform: `scale(${lerp(1, 1.7, EASE(ring))})` }} />
          <div style={{ width: 180, height: 180, borderRadius: 90, border: `8px solid ${COLORS.accent}`, background: COLORS.paper, boxSizing: "border-box",
            display: "flex", alignItems: "center", justifyContent: "center", opacity: clamp01(slam * 4),
            transform: `scale(${lerp(2.4, 1, slam * slam)}) rotateY(${flip < 0.5 ? flip * 180 : (flip - 1) * 180}deg)` }}>
            {flip < 0.5 ? <div style={line(120, COLORS.accent)}>?</div> : (
              <svg width={96} height={96} viewBox="0 0 96 96"><path d="M 16 50 L 40 74 L 82 24" fill="none" stroke={COLORS.accent} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" /></svg>
            )}
          </div>
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 0, width: 1920, top: L.top + L.h + 50 }}>
        {ms >= tAr - 40 ? <SlideWords text={ms >= tAn ? "INOVIO argued it did. The approval answers that." : "INOVIO argued it did"} t={tAr} size={48} color={COLORS.paper} stagger={45} /> : null}
      </div>
    </AbsoluteFill>
  );
};

/** "It also turns INOVIO's DNA platform into a product for the first time." */
export const PlatformBox: React.FC<Win & { platform: Cued; into: Cued; first: Cued }> = ({ from, to, platform, into, first }) => {
  const ms = useMs();
  const k = useK();
  const p3 = useP3();
  const drop = useDrop();
  const tP = at(platform, from + 1700, from);
  const tI = at(into, tP + 1000, from, tP + 200);
  const tF = at(first, tI + 800, from, tI + 200);
  if (ms < tP - 40 || ms > to + 320) return null;
  const box = { cx: 1180, top: 470, w: 380, h: 260 };
  const carton = drop(tP + 150, 700, 340);
  const fall = EASE(k(tI, 480));
  const lidK = ms >= tI + 430 ? k(tI + 430, 180) : 0;
  const rise = EASE(k(tP, 700));
  const ring = { x: lerp(620, box.cx, fall), y: lerp(540, box.top + 110, fall) - Math.sin(Math.PI * fall) * 160, s: lerp(1, 0.55, fall) };
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to + 300) }}>
      {/* the carton drops in and lands with a squash */}
      {carton.on ? (
        <div style={{ position: "absolute", left: box.cx - box.w / 2, top: box.top + carton.dy, width: box.w, height: box.h, transformOrigin: "50% 100%", transform: `scale(${carton.sx}, ${carton.sy})` }}>
          <div style={{ position: "absolute", inset: 0, border: `8px solid ${COLORS.paper}`, borderTop: "none", borderRadius: "0 0 18px 18px", boxSizing: "border-box", background: "rgba(255,255,255,0.1)" }} />
        </div>
      ) : null}
      {/* the ring: rises from flat (the §4 callback), arcs, spins and drops in */}
      {fall < 1 ? (
        <div style={{ position: "absolute", left: ring.x - 140, top: ring.y - 140, width: 280, height: 280, opacity: 1 - k(tI + 420, 80),
          transform: `rotateX(${lerp(78, 0, rise)}deg) rotate(${fall * 200}deg) scale(${ring.s})` }}>
          <svg width={280} height={280} viewBox="-140 -140 280 280">
            <circle r={120} fill="none" stroke={COLORS.paper} strokeWidth={9} /><circle r={92} fill="none" stroke={COLORS.paper} strokeWidth={9} />
            {Array.from({ length: 32 }, (_, i) => { const p = pol(98, (i / 32) * 360), q = pol(114, (i / 32) * 360); return <line key={i} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="rgba(255,255,255,0.6)" strokeWidth={4} />; })}
          </svg>
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 620 - 260, width: 520, top: 700, opacity: 1 - k(tI, 200) }}>
        {ms >= tP - 40 ? <SlideWords text="INOVIO's DNA platform" t={tP} size={44} color={COLORS.paper} /> : null}
      </div>
      {/* the lid SLAMS shut; the carton takes the name */}
      {ms >= tI + 300 ? (
        <div style={{ position: "absolute", left: box.cx - box.w / 2 - 10, top: box.top - 8, width: box.w + 20, height: 18, borderRadius: 9, background: COLORS.paper,
          transformOrigin: "0 50%", transform: `rotate(${lerp(-80, 0, lidK * lidK)}deg)` }} />
      ) : null}
      {ms >= tI + 600 ? (
        <div style={{ position: "absolute", left: box.cx - box.w / 2, width: box.w, top: box.top + 80, textAlign: "center", ...line(64, COLORS.paper), opacity: clamp01(k(tI + 600, 120) * 3), transform: `scale(${lerp(1.8, 1, Easing_in(k(tI + 600, 220)))})` }}>Voceryq</div>
      ) : null}
      <div style={{ position: "absolute", left: box.cx - 320, width: 640, top: box.top + box.h + 36 }}>
        {ms >= tF - 40 ? <SlideWords text="A product, for the first time" t={tF} size={48} color={COLORS.paper} /> : null}
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// §8 Funding v2 (ink; footage first) — the cash runs as a LIQUID FILL down a tube on a quarter
// axis; the full-launch FLAG is planted in the SAME quarter (pole drops, flag unfurls)
// ══════════════════════════════════════════════════════════════════════════
export const RUNWAY = { axisY: 650, barY: 560, x0: 240, q: 360, startX: 360, endX: 1250, q1: 960 };
const QUARTERS = ["Q3 2026", "Q4 2026", "Q1 2027", "Q2 2027"];

export const FundingType: React.FC<Win & { approval: Cued; notFund: Cued; august: Cued }> = ({ from, to, approval, notFund, august }) => {
  const ms = useMs();
  const tA = at(approval, from + 600, from);
  const tN = at(notFund, tA + 1000, from, tA + 200);
  const tAu = at(august, tN + 1200, from, tN + 200);
  if (ms < tA - 40 || ms > to + 320) return null;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300) }}>
      <div style={{ position: "absolute", top: 300, left: 0, width: 1920 }}>
        {ms < tAu ? (<>
          <SlideWords text="An approval" t={tA} size={120} color={COLORS.paper} />
          <div style={{ marginTop: 10 }}>{ms >= tN - 40 ? <SlideWords text="does not fund a launch" t={tN} size={120} color={COLORS.paper} stagger={70} /> : null}</div>
        </>) : <SlideWords text="INOVIO's cash guidance, August" t={tAu} size={84} color={COLORS.paper} />}
      </div>
    </AbsoluteFill>
  );
};

export const Runway: React.FC<Win & { cash: Cued; year: Cued; potential: Cued; same: Cued; full: Cued }> = ({ from, to, cash, year, potential, same, full }) => {
  const ms = useMs();
  const k = useK();
  const p3 = useP3();
  const drop = useDrop();
  const tC = at(cash, from + 4600, from);
  const tY = at(year, tC + 2700, from, tC + 300);
  const tPo = at(potential, tY + 1400, from, tY + 200);
  const tS = at(same, tPo + 2500, from, tPo + 300);
  const tFu = at(full, tS + 1600, from, tS + 200);
  if (ms < tC - 40 || ms > to + 320) return null;
  const R = RUNWAY;
  const axisK = EASE(k(tC, 400));
  const fillK = EASE(k(tC + 200, Math.max(600, tY - tC - 200)));
  const gray = "rgba(255,255,255,0.65)";
  const pole = drop(tS, 700, 300);
  const unfurl = ms >= tS + 300 ? back(k(tS + 380, 380)) : 0;
  const fillX = lerp(R.startX, R.endX, fillK);
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to + 300) }}>
      {/* the axis + quarters */}
      <div style={{ position: "absolute", left: R.x0, top: R.axisY - 3, width: R.q * 4 * axisK, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.5)" }} />
      {QUARTERS.map((q, i) => (
        <React.Fragment key={q}>
          <div style={{ position: "absolute", left: R.x0 + i * R.q - 2, top: R.axisY - 16, width: 4, height: 32, background: "rgba(255,255,255,0.5)", opacity: k(tC + i * 80, 200) }} />
          <div style={{ position: "absolute", left: R.x0 + i * R.q, width: R.q, top: R.axisY + 26 }}>
            {ms >= tC + i * 80 - 40 ? <SlideWords text={q} t={tC + i * 80} size={36} color={i === 2 && ms >= tS ? COLORS.paper : gray} /> : null}
          </div>
        </React.Fragment>
      ))}
      {/* the tube (outline) and the cash FILLING it from August, out late in Q1 2027 */}
      <div style={{ position: "absolute", left: R.startX - 6, top: R.barY - 28, width: R.endX - R.startX + 12, height: 56, borderRadius: 28, border: "4px solid rgba(255,255,255,0.35)", boxSizing: "border-box", opacity: k(tC, 200) }} />
      <div style={{ position: "absolute", left: R.startX, top: R.barY - 22, width: fillX - R.startX, height: 44, borderRadius: 22,
        background: "linear-gradient(180deg, #ffffff 0%, #e9e9e9 60%, #bdbdbd 100%)" }} />
      {/* the meniscus: a bright leading edge while it runs */}
      {fillK > 0 && fillK < 1 ? <div style={{ position: "absolute", left: fillX - 10, top: R.barY - 28, width: 20, height: 56, borderRadius: 10, background: COLORS.paper, boxShadow: "0 0 24px rgba(255,255,255,0.8)" }} /> : null}
      <div style={{ position: "absolute", left: R.startX, top: R.barY - 22 - 56 }}>{ms >= tC + 200 - 40 ? <SlideWords text="Cash · from Aug 2026" t={tC + 200} size={30} color={gray} align="left" /> : null}</div>
      {ms >= tY - 40 ? (
        <div style={{ position: "absolute", left: R.endX - 300, width: 600, top: R.barY - 210 }}>
          <SlideWords text="Into late Q1 2027" t={tY} size={52} color={COLORS.paper} />
          <div style={{ marginTop: 8 }}>{ms >= tPo - 40 ? <SlideWords text={"“through a potential launch”"} t={tPo} size={32} color={gray} weight={400} /> : null}</div>
        </div>
      ) : null}
      {/* the full-launch FLAG planted in the SAME quarter (the scene's one red): pole drops, flag unfurls */}
      {pole.on ? (<>
        {/* the pole pierces the axis at the START of Q1 2027, left of the "Q1 2027" label (x ~1065-1215), so it never crosses type */}
        <div style={{ position: "absolute", left: R.q1 + 36, top: R.axisY - 10 + pole.dy, width: 8, height: 210, borderRadius: 4, background: COLORS.paper, transformOrigin: "50% 100%", transform: `scaleY(${pole.sy})` }} />
        <div style={{ position: "absolute", left: R.q1 + 44, top: R.axisY + 80 + pole.dy, transformOrigin: "0 50%", transform: `scaleX(${unfurl})`,
          background: COLORS.accent, padding: "10px 22px", borderRadius: "0 10px 10px 0" }}>
          <div style={line(40, COLORS.paper)}>Full launch</div>
        </div>
        <div style={{ position: "absolute", left: R.q1 + 58, top: R.axisY + 158 }}>{ms >= tFu - 40 ? <SlideWords text="planned for the same quarter" t={tFu} size={30} color={gray} weight={400} align="left" /> : null}</div>
      </>) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// §9 SignalRail v2 (paper) — "So the signal comes in order." Three stops on one rail; the rail
// draws to each stop and the camera follows it, so a finished stop leaves the frame. Each stop
// is a SIGNPOST: the post shoots up, the numbered plate flips up on it. The only red: the open
// question at stop 3, which slams with one ring.
// ══════════════════════════════════════════════════════════════════════════
// stops 1300 apart: with the camera centred on one stop, its neighbours (columns 640 wide) sit fully off-frame
export const SIG = { y: 610, x0: 260, stops: [560, 1860, 3160] };

export const SignalRail: React.FC<Win & { title: Cued; first: Cued; second: Cued; third: Cued; orders: Cued; inovio: Cued; sixty: Cued; sixtyEnd: Cued;
  conf: Cued; due: Cued; yearEnd: Cued; question: Cued; options: Cued; which: Cued; reach: Cued }> = ({
  from, to, title, first, second, third, orders, inovio, sixty, sixtyEnd, conf, due, yearEnd, question, options, which, reach,
}) => {
  const ms = useMs();
  const k = useK();
  const p3 = useP3();
  const tTi = at(title, from + 700, from);
  const t1 = at(first, tTi + 1700, from, tTi + 200);
  const tOr = at(orders, t1 + 700, from, t1 + 100);
  const tIn = at(inovio, tOr + 1500, from, tOr + 200);
  const t60 = at(sixty, tIn + 1300, from, tIn + 200);
  const t60e = at(sixtyEnd, t60 + 400, from, t60 + 100);
  const t2 = at(second, t60e + 600, from, t60e + 100);
  const tCf = at(conf, t2 + 500, from, t2 + 100);
  const tDu = at(due, tCf + 1200, from, tCf + 200);
  const tYe = at(yearEnd, tDu + 450, from, tDu + 100);
  const t3 = at(third, tYe + 1000, from, tYe + 200);
  const tQu = at(question, t3 + 900, from, t3 + 100);
  const tOp = at(options, tQu + 2000, from, tQu + 300);
  const tWh = at(which, tOp + 1300, from, tOp + 200);
  const tRe = at(reach, tWh + 800, from, tWh + 100);
  if (ms < tTi - 40 || ms > to + 320) return null;
  const ink = COLORS.ink, gray = COLORS.grayText;
  const reachX = ms < t1 ? SIG.x0 : ms < t2 ? lerp(SIG.x0, SIG.stops[0], EASE(k(t1, 500)))
    : ms < t3 ? lerp(SIG.stops[0], SIG.stops[1], EASE(k(t2, 700))) : lerp(SIG.stops[1], SIG.stops[2], EASE(k(t3, 700)));
  const tStops = [t1, t2, t3];
  const col = (x: number): React.CSSProperties => ({ position: "absolute", left: x - 320, width: 640 });
  const W = (t: number, text: string, size: number, color: string, weight = 700) => (ms >= t - 40 ? <SlideWords text={text} t={t} size={size} color={color} weight={weight} stagger={45} /> : null);
  const slam = k(tWh, 200);
  const ring = k(tWh + 200, 450);
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to + 300) }}>
      <div style={{ position: "absolute", top: 400, left: 0, width: 1920, opacity: fadeOut(ms, t1 + 300) }}>
        <SlideWords text="The signal, in order" t={tTi} size={120} color={ink} stagger={80} />
      </div>
      {/* the rail */}
      <div style={{ position: "absolute", left: SIG.x0, top: SIG.y - 6, width: Math.max(0, reachX - SIG.x0), height: 12, borderRadius: 6, background: ink }} />
      {/* signposts: the post shoots up from the rail, the numbered plate flips up onto it */}
      {SIG.stops.map((x, i) => {
        const t = tStops[i] + 350;
        if (ms < t) return null;
        const h = 70 * back(k(t, 360));
        const plate = EASE(k(t + 200, 360));
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: x - 6, top: SIG.y - h, width: 12, height: h, borderRadius: 4, background: ink }} />
            <div style={{ position: "absolute", left: x - 38, top: SIG.y - 70 - 76, width: 76, height: 76, borderRadius: 14, background: ink, display: "flex", alignItems: "center", justifyContent: "center",
              transformOrigin: "50% 100%", transform: `perspective(600px) rotateX(${lerp(-90, 0, plate)}deg)`, opacity: plate > 0 ? 1 : 0 }}>
              <div style={line(44, COLORS.paper)}>{i + 1}</div>
            </div>
          </React.Fragment>
        );
      })}
      {/* stop 1: orders and shipping, ~60 days */}
      <div style={{ ...col(SIG.stops[0]), top: 300 }}>{W(tOr, "Orders and shipping", 60, ink)}<div style={{ marginTop: 12 }}>{W(tIn, "INOVIO expects, in about", 36, gray, 400)}</div></div>
      {ms >= t60 ? (
        <div style={{ ...col(SIG.stops[0]), top: 680, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 18 }}>
          <div style={{ display: "flex" }}><Odo digit={6} t={t60} dur={Math.max(400, t60e - t60)} size={120} color={ink} /><Odo digit={0} t={t60 + 60} dur={Math.max(400, t60e - t60)} size={120} color={ink} /></div>
          <div style={{ ...line(60, ink), paddingBottom: 14, opacity: k(t60e, 160) }}>days</div>
        </div>
      ) : null}
      {/* stop 2: the confirmatory protocol, by year-end */}
      <div style={{ ...col(SIG.stops[1]), top: 300 }}>{W(tCf, "Confirmatory protocol", 60, ink)}<div style={{ marginTop: 12 }}>{W(tDu, "Draft due by", 36, gray, 400)}</div></div>
      {ms >= tYe ? (
        <div style={{ ...col(SIG.stops[1]), top: 690, textAlign: "center", ...line(100, ink), textShadow: extrudeText(10, "#bcbcbc"), opacity: clamp01(k(tYe, 120) * 3), transform: `scale(${lerp(2, 1, Easing_in(k(tYe, 220)))})` }}>Year-end</div>
      ) : null}
      {/* stop 3: the market's question — two options, no winner */}
      <div style={{ ...col(SIG.stops[2]), top: 300 }}>{W(tQu, "The market's question", 60, ink)}<div style={{ marginTop: 12 }}>{W(tRe, "Which one doctors reach for first", 36, gray, 400)}</div></div>
      {ms >= tOp ? (
        <div style={{ position: "absolute", left: SIG.stops[2] - 330, width: 660, top: 690, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {["Papzimeos", "Voceryq"].map((n, i) => {
            const inK = EASE(k(tOp + i * 140, 520));
            return <div key={n} style={{ width: 250, padding: "22px 0", border: `5px solid ${ink}`, borderRadius: 18, textAlign: "center", ...line(44, ink), background: COLORS.paper,
              boxShadow: extrude(8, "#cfcfcf", "rgba(0,0,0,0.12)"), opacity: clamp01(inK * 3), transform: `translateX(${(i ? 1 : -1) * lerp(220, 0, inK)}px) rotateY(${(i ? -1 : 1) * lerp(70, 0, inK)}deg)` }}>{n}</div>;
          })}
        </div>
      ) : null}
      {ms >= tWh ? (
        <div style={{ position: "absolute", left: SIG.stops[2] - 50, top: 700, width: 100, height: 100 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 50, border: `5px solid ${COLORS.accent}`, opacity: ms >= tWh + 200 ? 0.8 * (1 - ring) : 0, transform: `scale(${lerp(1, 1.8, EASE(ring))})` }} />
          <div style={{ width: 100, height: 100, borderRadius: 50, background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", opacity: clamp01(slam * 4), transform: `scale(${lerp(2.4, 1, slam * slam)})` }}>
            <div style={line(70, COLORS.paper)}>?</div>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
