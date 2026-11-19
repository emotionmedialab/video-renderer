// ─────────────────────────────────────────────────────────────────────────
// KIT · summit6 — Summit ivonescimab CRL long-form, chunk 6 (2:41–3:12.7: HARMONi-3 timing + the close).
//  S21/22 Readouts (paper) — Q4 2026 and 1H 2027 tiles on a HARMONi-3 · SQUAMOUS GROUP base; one brick per
//                            analysis drops and stacks: PFS primary (red) and the early OS look on Q4 2026, the
//                            separate OS analysis on 1H 2027.
//  S23 Watch      (ink)    — callback to the stand (BAR seats) with the survival sign; on "survival number" a lens
//                            flies in from depth and stops over "overall survival".
// Then the standard kit CTACard (composition). Text: whole-word only (Nel 11-19).
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, useMs } from "./core";
import { at, lerp, type Cued, type Win } from "./elora";
import { fadeOut } from "./plusone";
import { label, line } from "./inovio";
import { useP3, useZ } from "./camera";
import { Scatter, useDropX, useEnt, useSpringX } from "./v2style";
import { G_GREY, G_INK, G_STONE, G_WHITE, Puck } from "./argenx1v2b";
import { BAR, G_RED, shadow } from "./summit1";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });

// ══════════════════════════════════════════════════════════════════════════
// S21/S22 (paper) — "In the squamous group, Summit expects to have enough progression-free survival events for its
// primary analysis in the fourth quarter of 2026. An early look at overall survival is planned alongside it, and a
// separate survival analysis in the first half of 2027."
// Settled: the two quarter tiles (hero) / the analysis bricks (a list of 3) / base label.
// ══════════════════════════════════════════════════════════════════════════
export const RO = { floor: 830, baseH: 70, tiles: [640, 1280] as const, tileW: 500, tileH: 150, brickW: 450, brickH: 100 };
const TILE_TOP = RO.floor - RO.baseH - RO.tileH; //     610

export const Readouts: React.FC<Win & { tiles: Cued; b1: Cued; b2: Cued; b3: Cued }> = ({ from, to, tiles, b1, b2, b3 }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const drop = useDropX();
  const tTiles = at(tiles, 161270, from);
  const tB = [at(b1, 165710, from, tTiles + 1500), at(b2, 171860, from), at(b3, 174920, from)];
  if (ms < from || ms > to + 320) return null;

  const tilesP = ent(tTiles - 200, 700);
  // brick seats: [tile index, stack level]
  const seats: [0 | 1, number, string, boolean][] = [[0, 0, "PFS primary analysis", true], [0, 1, "Early OS look", false], [1, 0, "Separate OS analysis", false]];
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(lerp(-1600, 0, tilesP))}translateY(${lerp(400, 0, tilesP)}px)` }}>
        <div style={shadow(960, RO.floor + 10, 1300, 0.22)} />
        <Puck x={960} y={RO.floor - RO.baseH / 2} w={1300} h={RO.baseH} d={180} r={24} front={G_STONE} side="#8f8f8f">
          <div style={{ display: "flex", gap: 20, alignItems: "baseline" }}>
            <div style={line(36, COLORS.ink)}>HARMONi-3</div>
            <div style={label("#6b6b6b", 26)}>SQUAMOUS GROUP · SUMMIT'S EXPECTED TIMING</div>
          </div>
        </Puck>
        {RO.tiles.map((x, i) => (
          <Puck key={x} x={x} y={TILE_TOP + RO.tileH / 2} w={RO.tileW} h={RO.tileH} d={150} r={28} front={G_INK} side="#111">
            <div style={line(72, COLORS.paper)}>{i === 0 ? "Q4 2026" : "1H 2027"}</div>
          </Puck>
        ))}
      </div>
      {seats.map(([ti, lv, txt, red], i) => {
        const b = drop(tB[i] - 380, 800, 380);
        if (!b.on) return null;
        const x = RO.tiles[ti];
        const base = TILE_TOP - lv * (RO.brickH + 6);
        return (
          <div key={i} style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${x}px ${base}px`, transform: `${z(20)}translateY(${b.dy}px) scale(${b.sx}, ${b.sy})` }}>
            <Puck x={x} y={base - RO.brickH / 2} w={RO.brickW} h={RO.brickH} d={110} r={26} front={red ? G_RED : G_WHITE} side={red ? "#8f0e15" : "#9a9a9a"}>
              <div style={line(40, red ? COLORS.paper : COLORS.ink)}>{txt}</div>
            </Puck>
          </div>
        );
      })}
      {seats.map(([ti, lv], i) => <Scatter key={i} x={RO.tiles[ti]} y={TILE_TOP - lv * (RO.brickH + 6)} t={tB[i]} seed={50 + i} color="#9a9a9a" zz={60} />)}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S23 (ink) — "After this letter, our read is simple. The survival number is the one to watch."
// Callback: the stand on its BAR seats with the survival sign over the red bar (S8's completed pose). On "survival
// number" the sign flips over its horizontal axis to a red face: OVERALL SURVIVAL · THE ONE TO WATCH.
// (v1 had a lens; it magnified only the middle letters and covered the rest of the sign: replaced before the gate.)
// Settled: stand + red sign (hero).
// ══════════════════════════════════════════════════════════════════════════
const SIGN = { y: BAR.high - BAR.barH / 2 - 26 - 66, w: 580, h: 132 }; //   sign centre (as S8)

export const Watch: React.FC<Win & { letter: Cued; number: Cued }> = ({ from, to, letter, number }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const tLet = at(letter, 177760, from);
  const tNum = at(number, 180240, from, tLet + 1200);
  if (ms < from || ms > to + 320) return null;

  const standP = ent(tLet - 300, 700);
  const flip = ms < tNum ? 0 : sp(tNum, 11, 120); //   one turn with a small overshoot, then still
  const postH = BAR.floor - BAR.slabH / 2 - BAR.postTop;
  const face = (back: boolean): React.CSSProperties => ({
    position: "absolute", inset: 0, borderRadius: 22, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
    background: back ? G_RED : G_WHITE, backfaceVisibility: "hidden", transform: back ? "rotateX(180deg)" : undefined, boxShadow: "0 14px 24px rgba(0,0,0,0.4)",
  });
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(lerp(-1800, 0, standP))}translateY(${lerp(700, 0, standP)}px)` }}>
        <div style={shadow(960, BAR.floor + 30, 1000)} />
        <Puck x={960} y={BAR.floor} w={1000} h={BAR.slabH} d={90} r={23} front={G_STONE} side="#8f8f8f"><div style={label(COLORS.ink, 30)}>FDA</div></Puck>
        {BAR.postX.map((x) => (
          <Puck key={x} x={x} y={BAR.postTop + postH / 2} w={BAR.postW} h={postH} d={46} r={23} front={G_WHITE} side="#9a9a9a" />
        ))}
        <Puck x={960} y={BAR.high} w={BAR.barW} h={BAR.barH} d={40} r={20} front={G_WHITE} side="#9a9a9a" /> {/* K3: the payoff (sign) takes the red */}
        {[-150, 150].map((dx) => (
          <div key={dx} style={{ ...abs(960 + dx - 3, BAR.high - BAR.barH / 2 - 26), width: 6, height: 26, background: "#d9d9d9" }} />
        ))}
        {/* the sign: two faces, the back pre-flipped so it reads upright after the turn (never mirrored) */}
        <div style={{ ...abs(960 - SIGN.w / 2, SIGN.y - SIGN.h / 2), width: SIGN.w, height: SIGN.h, ...p3, transform: `${z(14)}rotateX(${-180 * flip}deg)` }}>
          <div style={face(false)}>
            <div style={line(46, COLORS.ink)}>Statistically significant</div>
            <div style={line(46, COLORS.ink)}>overall survival</div>
          </div>
          <div style={face(true)}>
            <div style={label("rgba(255,255,255,0.85)", 24)}>THE ONE TO WATCH</div>
            <div style={line(58, COLORS.paper)}>OVERALL SURVIVAL</div>
          </div>
        </div>
      </div>
      <Scatter x={960} y={SIGN.y + SIGN.h / 2} t={tNum + 450} seed={55} color={COLORS.accent} zz={30} />
    </AbsoluteFill>
  );
};
