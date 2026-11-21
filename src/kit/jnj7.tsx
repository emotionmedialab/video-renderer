// ─────────────────────────────────────────────────────────────────────────
// KIT · jnj7 — J&J × Ollin long-form, chunk 7 (§7 What to watch), 16:9, 2026-11-19. House style 11-16.
// ONE spine: three arches stand down a receding track ("the signal comes in order"). The camera pushes to gate 1,
// flies through it to gate 2, pushes in, flies through to gate 3. Behind gate 3 the S7 milestone wagon rolls in:
// "the milestone money sits on the far side of that answer" (K1/K2 callback, its label says what it is).
// A gate the camera has flown past is unmounted (CSS 3D past the perspective plane renders inside-out).
// Limits: close "expected before year-end"; Phase 3 start is Ollin's June statement (2H 2026); gate 3 is a question.
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, COLORS, useMs } from "./core";
import { at, lerp, type Cued, type Win } from "./elora";
import { EASE, fadeOut } from "./plusone";
import { label, line } from "./inovio";
import { Print } from "./ryb1b";
import { camPoseAt, useP3, useZ, type CamKey } from "./camera";
import { useSpringX } from "./v2style";
import { G_GREY, G_INK, G_WHITE, Puck } from "./argenx1v2b";
import { TRAIN, Wagon } from "./jnj2";
import { LineDrop } from "./jnjtype";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });
const chip = (txt: React.ReactNode, bg: string = COLORS.ink, fg: string = COLORS.paper, size = 30) => (
  <div style={{ background: bg, borderRadius: 34, padding: "12px 26px", ...label(fg, size), display: "inline-block" }}>{txt}</div>
);

export const GATE = { gap: 1800, floor: TRAIN.rail + 14, half: 330, lintelY: 320, lintelH: 160, wagonZ: -700 };
/** the camera z that frames gate n (1-based) like a near object */
export const gateCamZ = (n: number) => 300 + GATE.gap * (n - 1);
const HIDE_Z = 1100; //                                   unmount anything nearer than this to the camera

/** the plate outside the camera: What to watch · IN ORDER */
export const WatchPlate: React.FC<{ t: number; tOrder: number }> = ({ t, tOrder }) => (
  <div style={{ ...abs(110, 90), display: "flex", alignItems: "center", gap: 20 }}>
    <LineDrop text="What to watch" t={t} size={56} color={COLORS.ink} />
    <Print t={tOrder}>{chip("IN ORDER", COLORS.accent, COLORS.paper, 28)}</Print>
  </div>
);

export const Gates: React.FC<Win & { keys: CamKey[]; order: Cued; g1: [Cued, Cued]; g2: [Cued, Cued]; g3: [Cued, Cued]; money: Cued }> = ({
  from, to, keys, order, g1, g2, g3, money,
}) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const tOrder = at(order, 166290, from);
  const tg = [g1, g2, g3].map(([a, b], i) => [at(a, [167720, 171470, 180750][i], from), at(b, [168880, 177250, 182260][i], from)]);
  const tMoney = at(money, 186850, from);
  if (ms < from || ms > to + 320) return null;
  const cz = camPoseAt(keys, ms).z;
  const titles = ["1 · DEAL CLOSES", "2 · PHASE 3 STARTS", "3 · THE REAL TEST"];
  const subs = ["EXPECTED BEFORE YEAR-END", "SECOND HALF OF 2026 · OLLIN, IN JUNE", "DO LARGE TRIALS CONFIRM ~160 PATIENTS?"];
  const roll = EASE(clamp01((ms - (tMoney - 300)) / 900));
  const stopW = ms >= tMoney + 600 ? 1 - sp(tMoney + 600, 7, 200, 0.6) : 0;
  const wz = -2 * GATE.gap + GATE.wagonZ;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {/* the track: floor tiles receding (rails + sleepers), each unmounted once the camera has passed it */}
      {Array.from({ length: 12 }, (_, i) => {
        const near = 600 - i * 600;
        if (near + cz > HIDE_Z) return null;
        return (
          <div key={i} style={{ position: "absolute", inset: 0, ...p3, transform: z(near) || undefined }}>
            <div style={{ ...abs(960 - 360, GATE.floor), width: 720, height: 600, transformOrigin: "50% 0", transform: "rotateX(90deg)",
              background: "repeating-linear-gradient(180deg, #e2e2e2 0px, #e2e2e2 40px, transparent 40px, transparent 120px)" }}>
              <div style={{ ...abs(120, 0), width: 18, height: 600, background: "#8a8a8a" }} />
              <div style={{ ...abs(582, 0), width: 18, height: 600, background: "#8a8a8a" }} />
            </div>
          </div>
        );
      })}
      {/* the milestone wagon, on the far side of gate 3 */}
      {ms >= tMoney - 300 && wz + cz <= HIDE_Z ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(wz)}translateX(${lerp(1700, 0, roll)}px)` }}>
          <Wagon x={960} dist={1700 * roll} front={G_GREY} side="#4a4a4a" tilt={-2.5 * stopW}>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <div style={line(56, COLORS.ink)}>MILESTONE MONEY</div>
              <div style={label("#1c1c1c", 30)}>UP TO ABOUT $1.125B · IF MILESTONES</div>
            </div>
          </Wagon>
        </div>
      ) : null}
      {/* the gates, far to near so nearer ones paint on top */}
      {[2, 1, 0].map((i) => {
        const gz = -i * GATE.gap;
        if (gz + cz > HIDE_Z) return null;
        const t0 = tOrder - 400 + i * 120;
        const up = ms >= t0 ? sp(t0, 11, 170) : 0;
        if (ms < t0) return null;
        return (
          <div key={i} style={{ position: "absolute", inset: 0, ...p3, transform: `${z(gz)}translateY(${lerp(700, 0, up)}px)` }}>
            {[-1, 1].map((s) => (
              <Puck key={s} x={960 + s * GATE.half} y={(GATE.lintelY + GATE.floor) / 2} w={70} h={GATE.floor - GATE.lintelY} d={70} r={20} front={G_INK} side="#141414" />
            ))}
            <Puck x={960} y={GATE.lintelY} w={GATE.half * 2 + 160} h={GATE.lintelH} d={80} r={30} front={i === 2 ? G_INK : G_WHITE} side={i === 2 ? "#141414" : "#9c9c9c"}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <div style={{ height: 58 }}><Print t={tg[i][0]}><div style={line(52, i === 2 ? COLORS.paper : COLORS.ink)}>{titles[i]}</div></Print></div>
                <div style={{ height: 34 }}><Print t={tg[i][1]}><div style={label(i === 2 ? "rgba(255,255,255,0.85)" : COLORS.grayText, 26)}>{subs[i]}</div></Print></div>
              </div>
            </Puck>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
