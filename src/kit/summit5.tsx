// ─────────────────────────────────────────────────────────────────────────
// KIT · summit5 — Summit ivonescimab CRL long-form, chunk 5 (2:17.8–2:41, "What comes next" part 1).
//  S18 CashTank (paper) — a glass tank fills to $629.8M; the AstraZeneca $2B canister swings in and pours; level
//                         rises; the surface settles flat. No total is printed (the release gives none).
//  S19 Resubmit (red)   — an envelope flies in from depth and hovers above the FDA slot, never going in; RESUBMIT?
//  S20 FaceOff  (ink)   — HARMONi-3 plate drops; ivonescimab + chemo slides in, red VS pops, Keytruda + chemo
//                         slides in to face it; "First-line lung cancer" prints on the plate.
// Text: whole-word `WType` / `Print` only (Nel 11-19).
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, COLORS, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { EASE, fadeOut } from "./plusone";
import { label, line } from "./inovio";
import { Print } from "./ryb1b";
import { useP3, useZ } from "./camera";
import { Scatter, useDropX, useEnt, useSpringX } from "./v2style";
import { G_GREY, G_INK, G_STONE, G_WHITE, Puck } from "./argenx1v2b";
import { G_RED, Vial, WType, shadow } from "./summit1";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });
const G_GLASS = "linear-gradient(155deg, rgba(255,255,255,0.95) 0%, #eef2f3 45%, #c3cbce 100%)";

// ══════════════════════════════════════════════════════════════════════════
// S18 (paper) — "The company is not short of cash. It held $629.8 million at the end of September, and then received
// $2 billion from an AstraZeneca equity investment."   Settled: the tank (hero) / $629.8M plate / AstraZeneca canister.
// ══════════════════════════════════════════════════════════════════════════
export const TK = { x: 820, floor: 830, w: 360, h: 560, d: 140, max: 3000, can: { x: 1150, y: 270, w: 230, h: 270 } };
const TK_IN = TK.h - 40; //                               inner fill height
const lvl = (m: number) => (m / TK.max) * TK_IN;

export const CashTank: React.FC<Win & { co: Cued; held: Cued; mil: Cued; received: Cued; two: Cued }> = ({ from, to, co, held, mil, received, two }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const tCo = at(co, 138080, from);
  const tHeld = at(held, 140580, from, tCo + 800);
  const tMil = at(mil, 141940, from, tHeld + 900);
  const tRec = at(received, 144500, from, tMil + 900);
  const tTwo = at(two, 145170, from, tRec + 500);
  if (ms < from || ms > to + 320) return null;

  const tankP = ent(tCo - 200, 700);
  const f1 = EASE(k(tHeld, 900));
  const pourOn = tTwo + 280, pourEnd = pourOn + 1400;
  const f2 = EASE(k(pourOn, 1400));
  const h = lvl(629.8) * f1 + lvl(2000) * f2;
  const wave = 14 * Math.sin(ms / 70) * (ms > tHeld && ms < tHeld + 900 ? 1 - f1 : ms > pourOn && ms < pourEnd + 400 ? clamp01(1 - (ms - pourOn) / 1800) : 0);
  const canIn = ent(tRec - 200, 650);
  const tilt = ms < tTwo ? 0 : ms < pourEnd ? sp(tTwo, 12, 140) : 1 - sp(pourEnd, 12, 140); //   tips to pour, then rights itself
  const stream = ms >= pourOn && ms < pourEnd;
  const top = TK.floor - 20 - TK.h;
  const surf = TK.floor - 40 - h;
  const spout: [number, number] = [TK.can.x - TK.can.w / 2 + 14, TK.can.y - TK.can.h / 2 + 10];
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(lerp(-1800, 0, tankP))}translateY(${lerp(500, 0, tankP)}px)` }}>
        <div style={shadow(TK.x, TK.floor + 6, TK.w * 1.15, 0.22)} />
        <Puck x={TK.x} y={top + TK.h / 2} w={TK.w} h={TK.h} d={TK.d} r={50} front={G_GLASS} side="#aab3b6" clip>
          {/* two layers: Summit's own $629.8M (ink) and AstraZeneca's $2B poured on top (red, like its canister) */}
          {h > 0 ? (
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 20, height: h }}>
              <svg width={TK.w} height={40} style={{ position: "absolute", left: 0, top: -20 }}>
                <path d={`M0,40 ${Array.from({ length: 21 }, (_, i) => `L${(i / 20) * TK.w},${(20 + Math.sin(i * 0.8 + ms / 90) * wave).toFixed(1)}`).join(" ")} L${TK.w},40 Z`}
                  fill={f2 > 0 ? "#e8323b" : "#3b3b3b"} />
              </svg>
              <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: h - lvl(629.8) * f1, background: G_RED }} />
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: lvl(629.8) * f1, background: "linear-gradient(180deg,#3b3b3b,#151515)" }} />
            </div>
          ) : null}
          <div style={{ position: "absolute", left: 0, right: 0, top: 24, textAlign: "center", ...label("#6b6b6b", 26) }}>SUMMIT'S CASH</div>
        </Puck>
        {/* the $629.8M plate, seated at the first level, left of the tank */}
        <div style={{ ...abs(TK.x - TK.w / 2 - 330, TK.floor - 40 - lvl(629.8) - 56), width: 310, display: "flex", justifyContent: "flex-end", transform: z(30) || undefined }}>
          <Print t={tMil}>
            <div style={{ background: G_INK, borderRadius: 20, padding: "10px 22px", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={line(52, COLORS.paper)}>$629.8M</div>
              <div style={label("rgba(255,255,255,0.75)", 20)}>END OF SEPTEMBER</div>
            </div>
          </Print>
        </div>
      </div>
      {/* the pour: a column of liquid from the spout down to the surface */}
      {stream ? (
        <div style={{ ...abs(spout[0] - 14, spout[1] + 20), width: 28, height: Math.max(0, surf - spout[1] - 20), borderRadius: 14, background: "linear-gradient(90deg,#b5121b,#ff4b53,#b5121b)",
          transform: z(20) || undefined }} />
      ) : null}
      {/* the AstraZeneca canister: swings in, tips over its spout corner to pour, rights itself */}
      {ms >= tRec - 200 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(lerp(-1600, 30, canIn))}translateX(${lerp(700, 0, canIn)}px)` }}>
          <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${spout[0]}px ${spout[1]}px`, transform: `rotateZ(${-105 * tilt}deg)` }}>
            <Puck x={TK.can.x} y={TK.can.y} w={TK.can.w} h={TK.can.h} d={110} r={34} front={G_RED} side="#8f0e15">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={label("rgba(255,255,255,0.85)", 22)}>ASTRAZENECA</div>
                <div style={line(64, COLORS.paper)}>$2B</div>
                <div style={label("rgba(255,255,255,0.85)", 20)}>EQUITY</div>
              </div>
            </Puck>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S19 (red) — "The release does not say whether Summit will resubmit."   Settled: the envelope hovering over the
// slot (hero) / RESUBMIT? / slot label.
// ══════════════════════════════════════════════════════════════════════════
export const RS = { box: { x: 1180, y: 690, w: 460, h: 260 }, env: { x: 1180, y: 360, w: 400, h: 250 } };

export const Resubmit: React.FC<Win & { fly: Cued; whether: Cued }> = ({ from, to, fly, whether }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const tFly = at(fly, 149490, from);
  const tWh = at(whether, 150090, from, tFly + 500);
  if (ms < from || ms > to + 320) return null;

  const boxP = ent(from + 80, 500);
  const envP = ent(tFly - 300, 700);
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(lerp(-1400, 0, boxP))}translateY(${lerp(300, 0, boxP)}px)` }}>
        <div style={shadow(RS.box.x, RS.box.y + RS.box.h / 2 + 10, RS.box.w * 1.05, 0.3)} />
        <Puck x={RS.box.x} y={RS.box.y} w={RS.box.w} h={RS.box.h} d={200} r={30} front={G_INK} side="#111">
          <div style={{ position: "absolute", left: 60, right: 60, top: 30, height: 30, borderRadius: 15, background: "#000" }} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 30 }}>
            <div style={line(60, COLORS.paper)}>FDA</div>
            <div style={label("rgba(255,255,255,0.7)", 24)}>RESUBMISSIONS</div>
          </div>
        </Puck>
      </div>
      {/* the envelope flies in from deep left, flipping face-up, and stops in mid-air above the slot */}
      {ms >= tFly - 300 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${RS.env.x}px ${RS.env.y}px`,
          transform: `${z(lerp(-2600, 40, envP))}translateX(${lerp(-1300, 0, Math.min(1, envP))}px) rotateY(${lerp(200, 0, Math.min(1, envP))}deg)` }}>
          <Puck x={RS.env.x} y={RS.env.y} w={RS.env.w} h={RS.env.h} d={18} r={18} front="linear-gradient(155deg,#ffffff,#e6e6e6 55%,#cfcfcf)" side="#a9a9a9">
            <svg width={RS.env.w} height={RS.env.h * 0.5} style={{ position: "absolute", left: 0, top: 0 }}>
              <path d={`M0,0 L${RS.env.w / 2},${RS.env.h * 0.45} L${RS.env.w},0`} fill="none" stroke="#bdbdbd" strokeWidth={5} />
            </svg>
            <div style={{ marginTop: 70 }}>{ms >= tWh ? <WType text="RESUBMIT?" t={tWh} size={54} color={COLORS.ink} /> : null}</div>
          </Puck>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S20 (ink) — "The bigger test is HARMONi-3. It pits ivonescimab plus chemotherapy against Keytruda plus chemotherapy,
// in first-line lung cancer."   Settled: the two combos face to face (hero) / HARMONi-3 plate / VS.
// ══════════════════════════════════════════════════════════════════════════
export const FO = { floor: 820, lx: 560, rx: 1360, plate: { y: 190, w: 860, h: 190 } };

export const FaceOff: React.FC<Win & { title: Cued; left: Cued; vs: Cued; right: Cued; line1: Cued }> = ({ from, to, title, left, vs, right, line1 }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const drop = useDropX();
  const tTitle = at(title, 153150, from);
  const tL = at(left, 154800, from, tTitle + 700);
  const tVs = at(vs, 156720, from, tL + 900);
  const tR = at(right, 157310, from, tVs + 400);
  const tLine = at(line1, 159210, from, tR + 900);
  if (ms < from || ms > to + 320) return null;

  const pl = drop(tTitle - 380, 800, 380);
  const side = (s: -1 | 1, t: number, name: string, front: string, txt: string) => {
    const p = ms < t - 350 ? 0 : sp(t - 350, 11, 140); // launches after VS (156.72s) is ≥60% landed
    if (p <= 0) return null;
    const x = s < 0 ? FO.lx : FO.rx;
    return (
      <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateX(${lerp(s * 1300, 0, p)}px)` }}>
        <div style={shadow(x, FO.floor + 30, 440, 0.45)} />
        <Puck x={x} y={FO.floor} w={420} h={70} d={180} r={35} front={front} side="#3a3a3a">
          <div style={label(txt, 26)}>+ CHEMOTHERAPY</div>
        </Puck>
        <Vial x={x} base={FO.floor - 35} name={name} />
      </div>
    );
  };
  const vsP = ms < tVs ? 0 : sp(tVs, 9, 220);
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {pl.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `960px ${FO.plate.y + FO.plate.h / 2}px`, transform: `${z(20)}translateY(${pl.dy}px) scale(${pl.sx}, ${pl.sy})` }}>
          <Puck x={960} y={FO.plate.y} w={FO.plate.w} h={FO.plate.h} d={90} r={30} front={G_STONE} side="#8f8f8f">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={label("#6b6b6b", 24)}>THE BIGGER TEST</div>
              <div style={line(76, COLORS.ink)}>HARMONi-3</div>
              <div style={{ height: 36 }}><Print t={tLine}><div style={label(COLORS.ink, 30)}>FIRST-LINE LUNG CANCER</div></Print></div>
            </div>
          </Puck>
        </div>
      ) : null}
      {side(-1, tL, "ivonescimab", G_WHITE, COLORS.ink)}
      {side(1, tR, "Keytruda", G_GREY, COLORS.paper)}
      {vsP > 0 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: z(lerp(-800, 40, Math.min(1, vsP))) || undefined }}>
          <Puck x={960} y={620} w={150} h={150} d={60} r="50%" front={G_RED} side="#8f0e15" style={{ transform: `scale(${vsP})` }}>
            <div style={line(58, COLORS.paper)}>VS</div>
          </Puck>
        </div>
      ) : null}
      <Scatter x={960} y={FO.plate.y + FO.plate.h / 2} t={tTitle} seed={40} color="#bdbdbd" zz={70} />
    </AbsoluteFill>
  );
};
