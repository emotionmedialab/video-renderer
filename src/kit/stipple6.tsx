// ─────────────────────────────────────────────────────────────────────────
// KIT · stipple6 — Lilly × Stipple Bio long-form, chunk 6 (2:32–2:59, "What to watch"). V2 house style.
// One ink world, three numbered pedestals in a row; the camera visits them in order, then pulls back.
//  S25 the pedestals rise on "signal"; the "$ ?" upfront coin (S5/S21 callback) drops onto pedestal 1;
//      THE REAL PRICE OF ENTRY prints.
//  S26 a mini PHASE 1 gate rises on pedestal 2 with the STP-100 cart waiting in front (S18 callback); the EARLY 2027
//      plate drops onto the lintel; FIRST TIME IN PEOPLE prints.
//  S27 a shut FIRST NAMED PROGRAM box drops onto pedestal 3 (S19 callback); the camera pulls back; the $5.9B plate
//      drops onto its cables over all three (S1 callback); A CEILING, NOT A PAYMENT prints under it.
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, COLORS, useMs } from "./core";
import { at, lerp, type Cued, type Win } from "./elora";
import { fadeOut } from "./plusone";
import { label, line } from "./inovio";
import { Print } from "./ryb1b";
import { useP3, useZ } from "./camera";
import { Scatter, useDropX, useSpringX } from "./v2style";
import { G_INK, G_STONE, G_WHITE, Puck } from "./argenx1v2b";
import { G_RED, shadow } from "./summit1";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });

export const SIG = { xs: [480, 960, 1440], floor: 840, pedW: 360, pedH: 150, plateY: 180 };
export const SIG_CAM = { z: 250 };
const PED_LAB = ["UPFRONT DISCLOSED?", "STP-100 PHASE 1", "FIRST NAMED PROGRAM"];

export const Signals: React.FC<Win & {
  signal: Cued; coin: Cued; entry: Cued; gate: Cued; early: Cued; people: Cued; box: Cued; until: Cued; plate: Cued; ceiling: Cued;
}> = ({ from, to, signal, coin, entry, gate, early, people, box, until, plate, ceiling }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const drop = useDropX();
  const tSg = at(signal, 152430, from);
  const tCo = at(coin, 156480, from, tSg + 1200);
  const tEn = at(entry, 158840, from, tCo + 800);
  const tGa = at(gate, 162370, from, tEn + 1200);
  const tEa = at(early, 163460, from, tGa + 600);
  const tPe = at(people, 167500, from, tEa + 1000);
  const tBx = at(box, 170502, from, tPe + 1000);
  const tUn = at(until, 173281, from, tBx + 800);
  const tPl = at(plate, 174780, from, tUn + 700);
  const tCe = at(ceiling, 176580, from, tPl + 600);
  if (ms < from || ms > to + 320) return null;

  const pedTop = SIG.floor - SIG.pedH;
  const C = drop(tCo - 330, 700, 330);
  const gateR = ms < tGa - 300 ? 0 : sp(tGa - 300, 11, 170);
  const E = drop(tEa - 300, 420, 300);
  const B = drop(tBx - 330, 700, 330);
  const gx = SIG.xs[1] + 55, gW = 200, gTop = pedTop - 150;
  // the hanging plate (S1 callback)
  const pp = clamp01((ms - (tPl - 420)) / 420);
  const e = ms - tPl;
  const plateDy = e < 0 ? -760 * (1 - pp * pp) : 32 * Math.exp(-e / 170) * Math.sin(e / 65);
  // tags print under their pedestal and retire when the camera leaves it (F2)
  const tag = (i: number, t: number, until: number, text: string) =>
    ms >= t && ms < until ? (
      <div key={i} style={{ ...abs(SIG.xs[i] - 260, SIG.floor + 24), width: 520, display: "flex", justifyContent: "center", transform: z(40) || undefined }}>
        <Print t={t}><div style={{ padding: "8px 20px", borderRadius: 20, background: COLORS.paper }}><div style={label(COLORS.ink, 28)}>{text}</div></div></Print>
      </div>
    ) : null;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {/* the three numbered pedestals rise in order (one action) */}
      {SIG.xs.map((x, i) => {
        const r = ms < tSg - 300 + i * 120 ? 0 : sp(tSg - 300 + i * 120, 12, 170);
        if (r <= 0) return null;
        return (
          <div key={x} style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${lerp(500, 0, r)}px)` }}>
            <div style={shadow(x, SIG.floor + 6, SIG.pedW * 1.04, 0.5)} />
            <Puck x={x} y={SIG.floor - SIG.pedH / 2} w={SIG.pedW} h={SIG.pedH} d={170} r={28} front={G_STONE} side="#7d7d7d">
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={line(76, COLORS.ink)}>{i + 1}</div>
                <div style={{ ...label(COLORS.ink, 24), whiteSpace: "normal", width: 210, lineHeight: 1.1 }}>{PED_LAB[i]}</div>
              </div>
            </Puck>
          </div>
        );
      })}

      {/* 1 · the "$ ?" upfront coin drops onto pedestal 1 */}
      {C.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${SIG.xs[0]}px ${pedTop}px`, transform: `${z(20)}translateY(${C.dy}px) scale(${C.sx}, ${C.sy})` }}>
          <Puck x={SIG.xs[0]} y={pedTop - 92} w={184} h={184} d={34} r="50%" front={G_INK} side="#111">
            <div style={line(66, COLORS.paper)}>$ ?</div>
          </Puck>
        </div>
      ) : null}
      <Scatter x={SIG.xs[0]} y={pedTop} t={tCo} seed={60} n={6} color={COLORS.paper} zz={60} />
      {tag(0, tEn, tGa - 1000, "THE REAL PRICE OF ENTRY")}

      {/* 2 · a mini PHASE 1 gate rises on pedestal 2; the STP-100 cart waits in front of it */}
      {gateR > 0 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${lerp(320, 0, gateR)}px)` }}>
          {[-1, 1].map((sg) => (
            <Puck key={sg} x={gx + (sg * gW) / 2} y={(gTop + pedTop) / 2} w={26} h={pedTop - gTop} d={26} r={10} front={G_INK} side="#111" />
          ))}
          <Puck x={gx} y={gTop} w={gW + 60} h={64} d={44} r={18} front={G_WHITE} side="#9a9a9a">
            <div style={label(COLORS.ink, 28)}>PHASE 1</div>
          </Puck>
          <Puck x={SIG.xs[1] - 110} y={pedTop - 40} w={130} h={66} d={50} r={18} front={G_INK} side="#151515" style={{ transform: "translateZ(40px)" }}>
            <div style={label(COLORS.paper, 20)}>STP-100</div>
          </Puck>
        </div>
      ) : null}
      {E.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${gx}px ${gTop - 32}px`, transform: `${z(40)}translateY(${E.dy}px) scale(${E.sx}, ${E.sy})` }}>
          <Puck x={gx} y={gTop - 32 - 40} w={250} h={80} d={36} r={20} front={G_WHITE} side="#9a9a9a">
            <div style={line(40, COLORS.ink)}>EARLY 2027</div>
          </Puck>
        </div>
      ) : null}
      {tag(1, tPe, tBx - 900, "FIRST TIME IN PEOPLE")}

      {/* 3 · the shut box drops onto pedestal 3 */}
      {B.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${SIG.xs[2]}px ${pedTop}px`, transform: `${z(20)}translateY(${B.dy}px) scale(${B.sx}, ${B.sy})` }}>
          <Puck x={SIG.xs[2]} y={pedTop - 120} w={230} h={240} d={150} r={22} front={G_WHITE} side="#9a9a9a">
            <div style={line(120, COLORS.ink)}>?</div>
            <div style={{ position: "absolute", right: 18, top: 90, width: 14, height: 56, borderRadius: 7, background: "#8a8a8a" }} />
          </Puck>
        </div>
      ) : null}
      <Scatter x={SIG.xs[2]} y={pedTop} t={tBx} seed={61} n={6} color={COLORS.paper} zz={60} />

      {/* the $5.9B plate drops over all three; the read prints under it */}
      {ms >= tPl - 420 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(30)}translateY(${plateDy}px)` }}>
          {[-1, 1].map((sg) => (
            <div key={sg} style={{ ...abs(960 + sg * 300 - 3, SIG.plateY - 80 - 1600), width: 6, height: 1600, background: "#9a9a9a", borderRadius: 3 }} />
          ))}
          <Puck x={960} y={SIG.plateY} w={760} h={160} d={50} r={34} front={G_RED} side="#8f0e15">
            <div style={{ display: "flex", alignItems: "baseline", gap: 22 }}>
              <div style={label(COLORS.paper, 36)}>UP TO</div>
              <div style={line(112, COLORS.paper)}>$5.9B</div>
            </div>
          </Puck>
        </div>
      ) : null}
      <div style={{ ...abs(0, SIG.plateY + 104), width: 1920, display: "flex", justifyContent: "center", transform: z(40) || undefined }}>
        {ms >= tCe ? (
          <Print t={tCe}><div style={{ padding: "12px 30px", borderRadius: 30, background: COLORS.paper }}><div style={label(COLORS.ink, 38)}>A CEILING, NOT A PAYMENT</div></div></Print>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
