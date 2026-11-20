// ─────────────────────────────────────────────────────────────────────────
// KIT · pfb1v2 — Pfizer × Blackstone SHORT, chunk 1 REBUILT in the 2026-11-16 house style (MOTION-RULES §0):
// motion graphics + 2.5D + kinetic type. Real, rounded objects (`Puck` / `PathSolid`), lit gradients, springs that
// stop, vanishing impact scatter, liquid wipes. Same cues as pfb1 (v1 stays untouched for comparison).
//  §1  "$1.5B" drops in letter by letter; a rounded "UP TO" cap slams onto it ON "billion".
//  §1b Blackstone's VAULT lands; on "spend" its door swings open and a red $1.5B coin arcs into Pfizer's vial,
//      which fills red ("berobenatide" prints on the glass).
//  §2  Pfizer's dish rises; the METSERA pod falls onto it ON "Metsera"; on "and get" the pod cracks open and on
//      "this" the monthly pen springs out of it.
//  §2b the trial flask flies in; Blackstone's furled umbrella drops in and on "covers" springs open over it.
// On-screen limits: script.md header ("up to" on every figure; the unverified "10 trials" is never printed).
// Canvas 1080×1920; chrome band 0–112; keep key text above y 1632 (Reels UI).
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, COLORS, INK_SUB, useMs } from "./core";
import { useP3, useZ } from "./camera";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { EASE, EASE_IO, fadeOut } from "./plusone";
import { label, line } from "./inovio";
import { Print } from "./ryb1b";
import { KType, Scatter, useDropX, useEnt, useSpringX } from "./v2style";
import { G_GREY, G_INK, G_WHITE, Puck } from "./argenx1v2b";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });
const G_RED = `linear-gradient(155deg, #ff6a71 0%, ${COLORS.accent} 55%, #a3121b 100%)`;
const G_GLASS = "linear-gradient(155deg, #ffffff 0%, #eef0f1 50%, #c3c7ca 100%)";

/** a landing thump for the surface something lands ON: 1 at impact, swings once, settles at 0 (stops, M2b) */
const useThump = () => {
  const ms = useMs();
  const sp = useSpringX();
  return (t: number) => (ms >= t ? 1 - sp(t, 6, 210, 0.6) : 0);
};

/** a rounded solid with any outline: an SVG path extruded `d` px (stacked layers, lit front face). */
export const PathSolid: React.FC<{ id: string; x: number; y: number; w: number; h: number; d: number; path: string; front: [string, string, string]; side: string;
  children?: React.ReactNode; style?: React.CSSProperties }> = ({ id, x, y, w, h, d, path, front, side, children, style }) => {
  const n = Math.max(3, Math.round(d / 5));
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, transformStyle: "preserve-3d", ...style }}>
      {Array.from({ length: n }, (_, i) => (
        <svg key={i} width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", inset: 0, transform: `translateZ(${-d / 2 + (i * d) / n}px)` }}>
          <path d={path} fill={side} />
        </svg>
      ))}
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", inset: 0, transform: `translateZ(${d / 2}px)` }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0%" stopColor={front[0]} /><stop offset="55%" stopColor={front[1]} /><stop offset="100%" stopColor={front[2]} />
          </linearGradient>
        </defs>
        <path d={path} fill={`url(#${id})`} />
      </svg>
      <div style={{ position: "absolute", inset: 0, transform: `translateZ(${d / 2 + 1}px)` }}>{children}</div>
    </div>
  );
};

/** v2 liquid wipe for the VERTICAL frame: a blob of the next world's colour grows from `origin` between start and end. */
export const LiquidWipeV: React.FC<{ start: number; end: number; color: string; origin: [number, number] }> = ({ start, end, color, origin }) => {
  const ms = useMs();
  const k = useK();
  const w = EASE_IO(k(start, end - start));
  if (w <= 0 || ms > end + 400) return null;
  const R = 2400 * w, N = 64;
  const pts = Array.from({ length: N }, (_, i) => {
    const a = (i / N) * Math.PI * 2;
    const rr = R * (1 + 0.07 * Math.sin(7 * a + 6 * w) + 0.04 * Math.sin(3 * a - 4 * w));
    return `${(origin[0] + Math.cos(a) * rr).toFixed(1)},${(origin[1] + Math.sin(a) * rr).toFixed(1)}`;
  });
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <path d={`M${pts.join("L")}Z`} fill={color} />
    </svg>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// §1 HOOK (red) — "$1.5 billion."
//  pin 160 → "$1.5B" drops in letter by letter from depth (kinetic type), each letter squashing and settling.
//  pin (lands ON "billion") → a rounded ink "UP TO" cap falls onto the figure; the figure squashes under it and
//          springs back; a few dots scatter and vanish. The camera pushes in with the fall. [NEW: ceiling-slam v2]
// Settled: the figure (hero) · the "UP TO" cap sitting on it.
// ══════════════════════════════════════════════════════════════════════════
export const HOOK2 = { cy: 1020, size: 280, capW: 700, capH: 150, capD: 60 };
export const CAP_FALL2 = 380;

export const HookV2: React.FC<Win & { capMs: number }> = ({ from, to, capMs }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const drop = useDropX();
  const thump = useThump();
  if (ms > to + 320) return null;
  const H = HOOK2;
  const t0 = from + 160;
  const fly = EASE(k(t0, 500));
  const figTop = H.cy - H.size * 0.52;
  const d = drop(capMs - CAP_FALL2, 900, CAP_FALL2);
  const s = thump(capMs);
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to + 300) }}>
      <div style={{ ...p3, position: "absolute", left: 0, right: 0, top: H.cy - H.size / 2, display: "flex", justifyContent: "center",
        transformOrigin: `540px ${H.size}px`, transform: `${z(lerp(-1200, 0, fly))}scale(${1 + 0.1 * s}, ${1 - 0.16 * s})` }}>
        <KType text="$1.5B" t={t0} size={H.size} color={COLORS.paper} shadow="10px 14px 0 #a3121b" />
      </div>
      {d.on ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `540px ${figTop - 10}px`, transform: `${z(30)}translateY(${d.dy}px) scale(${d.sx}, ${d.sy})` }}>
          <Puck x={540} y={figTop - H.capH / 2 - 10} w={H.capW} h={H.capH} d={H.capD} r={H.capH / 2} front={G_INK} side="#111">
            <div style={label(COLORS.paper, 76)}>UP TO</div>
          </Puck>
        </div>
      ) : null}
      <Scatter x={540} y={figTop - 10} t={capMs} seed={2} n={8} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// §1b THE FUNDING (ink, footage behind) — "That's what Blackstone just agreed to spend on Pfizer's new weight
//   loss drug, berobenatide, through 2028."
//  pin (in the pause) → Pfizer's glass vial springs in from depth, its "Through 2028" pill riding with it.
//  "Blackstone" → Blackstone's rounded VAULT falls in beside it and squashes.
//  "spend" → the vault door swings open, a red $1.5B coin tumbles out in an arc and drops into the vial's mouth;
//          the vial fills red, its surface settling flat. The camera dollies with the coin. [NEW: coin-into-vial]
//  "berobenatide" → the drug's name prints on the glass.
// Settled: the filled vial with its name (hero) · the open vault · the "Through 2028" pill.
// ══════════════════════════════════════════════════════════════════════════
export const FUND2 = { floor: 1440, vx: 745, body: { w: 420, h: 560 }, neck: { w: 210, h: 80 }, lip: { w: 260, h: 44 }, vault: { x: 305, w: 380, h: 360, d: 200 }, coin: 180 };
export const FUND2_CAM = { dolly: { z: 160, y: -60 } };
const COIN_FLY = 680;

export const FundV2: React.FC<Win & { arriveMs: number; stone: Cued; spend: Cued; name: Cued }> = ({ from, to, arriveMs, stone, spend, name }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const drop = useDropX();
  const sp = useSpringX();
  const tS = at(stone, 3670, from);
  const tB = at(spend, 4840, from, tS + 400);
  const tN = at(name, 7660, from, tB + 1700);
  if (ms > to + 320) return null;
  const F = FUND2, V = F.vault;
  const bodyCy = F.floor - F.body.h / 2;
  const bodyTop = F.floor - F.body.h;
  const neckCy = bodyTop - F.neck.h / 2;
  const lipCy = bodyTop - F.neck.h - F.lip.h / 2 + 6;
  const mouth = bodyTop - F.neck.h - F.lip.h + 6;
  const vaultCy = F.floor - V.h / 2;
  const doorCy = vaultCy + 34; //                  the door's centre, under the BLACKSTONE label

  const arr = ent(arriveMs, 450);
  const dv = drop(tS - 380, 1100, 380);
  const open = EASE(k(tB, 220));
  // the coin: out of the door, a tumbling arc to above the mouth (80%), then straight down into the vial (20%)
  const tC = tB + 120;
  const p = EASE_IO(k(tC, COIN_FLY));
  const q = clamp01(p / 0.8);
  const x0 = V.x, y0 = doorCy, xm = F.vx, ym = mouth - 120;
  const cx = lerp(x0, xm, q);
  const cy = p < 0.8 ? lerp(y0, ym, q) - 380 * Math.sin(Math.PI * q) : lerp(ym, mouth + 80, (p - 0.8) / 0.2);
  const cz = lerp(V.d / 2 + 20, 0, q);
  const tIn = tC + 0.8 * COIN_FLY;
  const tFill = tC + COIN_FLY;
  // the fill rides the coin's drop: rises to ~half the body, its wave settling flat (stops)
  const fill = clamp01((ms - tFill) / 900);
  const lvl = EASE(fill) * 0.5;
  const wave = 16 * (1 - fill) * Math.sin(fill * Math.PI * 3);
  const vialThump = ms >= tFill ? 1 - sp(tFill, 7, 220, 0.6) : 0;
  const wavePath = (w: number) => {
    const pts = Array.from({ length: 21 }, (_, i) => `${(i / 20) * w},${(Math.sin(i * 0.9 + fill * 8) * wave).toFixed(1)}`);
    return `M0,${wave + 30} L${pts.join(" L")} L${w},${wave + 30} Z`;
  };
  const fillH = F.body.h * lvl;
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to) }}>
      {/* Pfizer's vial (glass), springs in from depth */}
      {ms >= arriveMs ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${F.vx}px ${F.floor}px`,
          transform: `${z(lerp(-1800, 0, arr))}scale(${1 + 0.04 * vialThump}, ${1 - 0.05 * vialThump})` }}>
          <Puck x={F.vx} y={lipCy} w={F.lip.w} h={F.lip.h} d={110} r={22} front={G_GLASS} side="#9da3a7" />
          <Puck x={F.vx} y={neckCy} w={F.neck.w} h={F.neck.h} d={100} r={10} front={G_GLASS} side="#9da3a7" />
          <Puck x={F.vx} y={bodyCy} w={F.body.w} h={F.body.h} d={160} r="64px 64px 96px 96px" front={G_GLASS} side="#9da3a7" clip>
            <div style={{ ...abs(0, 52), width: F.body.w, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <div style={label("#6b6b6b", 40)}>PFIZER</div>
              <div style={{ height: 60 }}><Print t={tN}><div style={line(54, COLORS.ink)}>berobenatide</div></Print></div>
            </div>
            {fill > 0 ? (
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: fillH }}>
                <svg width={F.body.w} height={60} style={{ position: "absolute", left: 0, top: -30 }}><path d={wavePath(F.body.w)} fill="#ff4a53" /></svg>
                <div style={{ position: "absolute", inset: 0, background: G_RED, overflow: "hidden" }}>
                  <div style={{ position: "absolute", left: 0, bottom: 0, width: F.body.w, height: F.body.h * 0.5, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={line(84, COLORS.paper)}>$1.5B</div>
                  </div>
                </div>
              </div>
            ) : null}
          </Puck>
          {/* the term pill, in front of the vial's foot */}
          <Puck x={F.vx} y={F.floor + 62} w={380} h={84} d={36} r={42} front={G_GREY} side="#4f4f4f" style={{ transform: z(120) || undefined }}>
            <div style={label(COLORS.ink, 40)}>Through 2028</div>
          </Puck>
        </div>
      ) : null}

      {/* Blackstone's vault: falls in and squashes; its round door swings open on "spend" */}
      {dv.on ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${V.x}px ${F.floor}px`, transform: `translateY(${dv.dy}px) scale(${dv.sx}, ${dv.sy})` }}>
          <Puck x={V.x} y={vaultCy} w={V.w} h={V.h} d={V.d} r={56} front={G_INK} side="#121212">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <div style={label(COLORS.paper, 34)}>BLACKSTONE</div>
              <div style={{ position: "relative", width: 220, height: 220 }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 50% 50%, #000 0%, #0b0b0b 70%, #222 100%)" }} />
                <div style={{ position: "absolute", inset: 0, transformOrigin: "0 50%", transform: `perspective(600px) rotateY(${-105 * open}deg)` }}>
                  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #9a9a9a, #4a4a4a 65%, #2a2a2a 100%)",
                    border: "10px solid #262626", boxSizing: "border-box" }} />
                  {[0, 60, 120].map((a) => (
                    <div key={a} style={{ ...abs(110 - 70, 110 - 7), width: 140, height: 14, borderRadius: 7, background: "#d8d8d8", transform: `rotate(${a}deg)` }} />
                  ))}
                  <div style={{ ...abs(110 - 20, 110 - 20), width: 40, height: 40, borderRadius: "50%", background: "#efefef" }} />
                </div>
              </div>
            </div>
          </Puck>
        </div>
      ) : null}
      <Scatter x={V.x} y={F.floor} t={tS} seed={4} n={7} color="#8a8a8a" zz={V.d / 2} />

      {/* the $1.5B coin, out of the vault and into the vial (gone once it is inside) */}
      {ms >= tC && ms < tFill ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transform: z(cz) || undefined }}>
          <Puck x={cx} y={cy} w={F.coin} h={F.coin} d={28} r="50%" front={G_RED} side="#8f0e15" style={{ transform: `rotateZ(${540 * q}deg) scale(${p < 0.8 ? 1 : lerp(1, 0.8, (p - 0.8) / 0.2)})` }}>
            <div style={label(COLORS.paper, 46)}>$1.5B</div>
          </Puck>
        </div>
      ) : null}
      <Scatter x={F.vx} y={mouth} t={tIn} seed={11} n={6} color={COLORS.accent} zz={120} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// §2 THE METSERA DRUG (paper) — "Pfizer paid up to $10 billion to buy Metsera and get this monthly GLP-1 injectable."
//  pin (in the pause) → Pfizer's rounded dish springs up into the card.
//  "$10" → "Paid up to $10B" prints on the dish.
//  pin (lands ON "Metsera") → the METSERA pod falls onto the dish and squashes; the dish thumps. [MOVES: fall-and-squash]
//  "and get" → the pod cracks at its seam: the top shell pops off and tumbles out of the card.
//  pin (on "this") → the monthly pen springs out of the open pod, twisting from upright to flat, while the shell's
//          lower half sinks into the dish; the camera cranes up with the pen.
// Settled: the pen above the dish (hero) · the dish with "Paid up to $10B" · the pen's label.
// ══════════════════════════════════════════════════════════════════════════
export const BUY2 = { cx: 540, dishCy: 1250, dish: { w: 700, h: 210, d: 90 }, pod: { w: 320, half: 200, d: 150 }, penCy: 600, fall: 380 };
export const BUY2_CAM = { crane: { y: 130 } };
const POD_FRONT = "linear-gradient(155deg, #ffffff 0%, #e9e9e9 55%, #b9b9b9 100%)";

export const BuyV2: React.FC<Win & { dishMs: number; price: Cued; podMs: number; crack: Cued; penMs: number }> = ({ from, to, dishMs, price, podMs, crack, penMs }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const drop = useDropX();
  const thump = useThump();
  const tP = at(price, 11490, from);
  const tCk = at(crack, 13540, from, podMs + 200);
  if (ms > to + 320) return null;
  const B = BUY2;
  const dishTop = B.dishCy - B.dish.h / 2;
  const rise = ent(dishMs, 600);
  const dS = thump(podMs);
  const pd = drop(podMs - B.fall, 1300, B.fall);
  const topCy = dishTop - B.pod.half * 1.5;
  const botCy = dishTop - B.pod.half * 0.5;
  // the top shell: pops off and tumbles away to the right, out of the card
  const sh = clamp01((ms - tCk) / 560);
  const shX = 620 * sh, shY = -520 * sh + 1500 * sh * sh, shR = 230 * EASE(sh);
  // the pen: springs out of the pod on "this"; the lower shell sinks into the dish as it goes (rides the pen)
  const pe = sp(penMs, 10, 140);
  const sink = EASE(k(penMs, 320));
  const penCy = lerp(botCy, B.penCy, pe);
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to) }}>
      {/* contact shadow (2.5D), rides the dish */}
      <div style={{ ...abs(B.cx - 380, B.dishCy + B.dish.h / 2 - 6), width: 760, height: 40, borderRadius: "50%", background: "rgba(0,0,0,0.16)", filter: "blur(10px)",
        transform: `translateY(${lerp(800, 0, rise)}px)` }} />
      {/* Pfizer's dish */}
      {ms >= dishMs ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${B.cx}px ${B.dishCy + B.dish.h / 2}px`,
          transform: `translateY(${lerp(800, 0, rise)}px) scale(${1 + 0.06 * dS}, ${1 - 0.09 * dS})` }}>
          <Puck x={B.cx} y={B.dishCy} w={B.dish.w} h={B.dish.h} d={B.dish.d} r={105} front={G_INK} side="#111">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={line(64, COLORS.paper)}>PFIZER</div>
              <div style={{ height: 50 }}><Print t={tP}><div style={label("rgba(255,255,255,0.85)", 42)}>Paid up to $10B</div></Print></div>
            </div>
          </Puck>
        </div>
      ) : null}

      {/* the METSERA pod: two shells meeting at a seam; falls onto the dish ON "Metsera" */}
      {pd.on ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${B.cx}px ${dishTop}px`, transform: `${z(10)}translateY(${pd.dy}px) scale(${pd.sx}, ${pd.sy})` }}>
          {sink < 1 ? (
            <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${B.cx}px ${dishTop}px`, transform: `scaleY(${1 - sink})` }}>
              <Puck x={B.cx} y={botCy} w={B.pod.w} h={B.pod.half} d={B.pod.d} r="0 0 160px 160px / 0 0 170px 170px" front={POD_FRONT} side="#a3a3a3">
                <div style={{ ...label(COLORS.ink, 50), marginTop: -40 }}>METSERA</div>
              </Puck>
            </div>
          ) : null}
          {sh < 1 ? (
            <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${B.cx}px ${topCy}px`, transform: `translate(${shX}px, ${shY}px) rotateZ(${shR}deg)` }}>
              <Puck x={B.cx} y={topCy} w={B.pod.w} h={B.pod.half} d={B.pod.d} r="160px 160px 0 0 / 230px 230px 0 0" front={POD_FRONT} side="#a3a3a3" />
            </div>
          ) : null}
        </div>
      ) : null}
      <Scatter x={B.cx} y={dishTop} t={podMs} seed={6} n={8} color="#9a9a9a" zz={B.dish.d / 2} />
      <Scatter x={B.cx} y={topCy + B.pod.half / 2} t={tCk} seed={8} n={6} color="#b0b0b0" zz={B.pod.d / 2 + 10} />

      {/* the monthly pen: springs out of the open pod, twisting from upright to flat */}
      {ms >= penMs ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${B.cx}px ${penCy}px`,
          transform: `${z(60)}translateY(${penCy - B.penCy}px) rotateZ(${lerp(-90, 0, pe)}deg) scale(${lerp(0.45, 1, Math.min(1, pe))})` }}>
          <Puck x={B.cx - 60} y={B.penCy} w={440} h={130} d={110} r="65px 0 0 65px" front={G_WHITE} side="#bdbdbd">
            <div style={label(COLORS.ink, 44)}>Monthly GLP-1</div>
          </Puck>
          <Puck x={B.cx + 220} y={B.penCy} w={120} h={130} d={110} r="0 65px 65px 0" front={G_RED} side="#8f0e15" />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// §2b THE TRIALS (ink, footage behind) — "Now Blackstone covers the next phase of trials, 10 of them, underway or planned."
//  pin (in the pause) → the trial flask flies in from depth (red liquid: the scene's one red).
//  pin (lands during "Blackstone") → Blackstone's furled umbrella drops in above it and stops with a spring.
//  "covers" → the umbrella SPRINGS OPEN over the flask; the camera pushes in on it. [NEW: umbrella-covers]
//  "trials," → "Underway or planned" prints (no count: "10" is unverified).
// Settled: the open umbrella over the flask (hero) · BLACKSTONE on the canopy · "Underway or planned".
// ══════════════════════════════════════════════════════════════════════════
export const COVER2 = { floor: 1440, flask: { w: 460, h: 540, d: 120 }, canopy: { w: 720, h: 280, d: 34, top: 520 }, umbFall: 380 };
export const COVER2_CAM = { push: { z: 220, y: -60 } };
const FLASK_PATH = "M170 0 H290 V170 L432 446 Q460 540 362 540 H98 Q0 540 28 446 L170 170 Z";
const CANOPY_PATH = "M0 280 Q0 0 360 0 Q720 0 720 280 Q630 228 540 280 Q450 228 360 280 Q270 228 180 280 Q90 228 0 280 Z";

export const CoverV2: React.FC<Win & { arriveMs: number; umbMs: number; covers: Cued; trials: Cued }> = ({ from, to, arriveMs, umbMs, covers, trials }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const drop = useDropX();
  const tC = at(covers, 17720, from, umbMs + 300);
  const tT = at(trials, 19070, from, tC + 700);
  if (ms > to + 320) return null;
  const C = COVER2, Fl = C.flask, Cn = C.canopy;
  const flaskCy = C.floor - Fl.h / 2;
  const arr = ent(arriveMs, 450);
  const du = drop(umbMs - C.umbFall, 1300, C.umbFall);
  const o = ms >= tC ? sp(tC, 8, 160) : 0; //   0 furled → 1 open (overshoots once, stops)
  const canCy = Cn.top + Cn.h / 2;
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to) }}>
      {/* the trial flask */}
      {ms >= arriveMs ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transform: `${z(lerp(-1800, 0, arr))}translateY(${lerp(200, 0, arr)}px)` }}>
          <PathSolid id="pfbFlask" x={540} y={flaskCy} w={Fl.w} h={Fl.h} d={Fl.d} path={FLASK_PATH} front={["#ffffff", "#eef0f1", "#bfc4c7"]} side="#8f969a">
            <svg width={Fl.w} height={Fl.h} viewBox={`0 0 ${Fl.w} ${Fl.h}`} style={{ position: "absolute", inset: 0 }}>
              <defs>
                <clipPath id="pfbFlaskClip"><path d={FLASK_PATH} /></clipPath>
                <linearGradient id="pfbLiquid" x1="0" y1="0" x2="0.5" y2="1"><stop offset="0%" stopColor="#ff6a71" /><stop offset="60%" stopColor={COLORS.accent} /><stop offset="100%" stopColor="#a3121b" /></linearGradient>
              </defs>
              <rect x={0} y={400} width={Fl.w} height={Fl.h - 400} fill="url(#pfbLiquid)" clipPath="url(#pfbFlaskClip)" />
            </svg>
            <div style={{ ...abs(0, 300), width: Fl.w, display: "flex", flexDirection: "column", alignItems: "center", ...label(COLORS.ink, 40), lineHeight: 1.12 }}>
              <div>Next-phase</div><div>trials</div>
            </div>
          </PathSolid>
        </div>
      ) : null}

      {/* Blackstone's umbrella: drops in furled, then springs open over the flask on "covers" */}
      {du.on ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transform: `${z(40)}translateY(${du.dy}px)` }}>
          <svg width={90} height={110} style={{ ...abs(540 - 6, Cn.top + Cn.h - 20) }}>
            <path d="M6 0 V70 Q6 100 36 100 Q66 100 66 72" fill="none" stroke="#d4d4d4" strokeWidth={12} strokeLinecap="round" />
          </svg>
          <div style={{ ...abs(540 - 14, Cn.top - 46), width: 28, height: 56, borderRadius: 14, background: "#d4d4d4" }} />
          <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `540px ${Cn.top}px`,
            transform: `scale(${lerp(0.12, 1, o) * du.sx}, ${lerp(1.7, 1, o) * du.sy})` }}>
            <PathSolid id="pfbCanopy" x={540} y={canCy} w={Cn.w} h={Cn.h} d={Cn.d} path={CANOPY_PATH} front={["#7a7a7a", "#3a3a3a", "#1c1c1c"]} side="#0e0e0e">
              <div style={{ ...abs(0, 128), width: Cn.w, display: "flex", justifyContent: "center", ...label(COLORS.paper, 50) }}>BLACKSTONE</div>
            </PathSolid>
          </div>
        </div>
      ) : null}

      <div style={{ ...abs(0, C.floor + 50), width: 1080, display: "flex", justifyContent: "center", transform: z(60) || undefined }}>
        <Print t={tT}><div style={label(INK_SUB, 48)}>Underway or planned</div></Print>
      </div>
    </AbsoluteFill>
  );
};
