// ─────────────────────────────────────────────────────────────────────────
// KIT · jnj2 — J&J × Ollin long-form, chunk 2 (§2 The money), 16:9, 2026-11-19. House style 11-16.
// ONE spine for the section: "the money, in order" = wagons on a track.
//  S5 wagon 1 rolls in ("$2.2B / UP FRONT").
//  S6 wagon 2 drops onto the rails ("UP TO ABOUT $1.125B"); a signal post springs up between the wagons and
//     REGULATORY / COMMERCIAL plates slam onto it ("only if … milestones").
//  S7 the post sinks away; both figures fly off the wagons and merge into the red total board (UP TO ABOUT $3.3B ·
//     OUR MATH). The wagons keep their qualifiers (UP FRONT / IF MILESTONES).
//  S8 the board lifts away; the train rolls toward a buffer stop (EXPECTED CLOSE · BEFORE END OF 2026) and stops
//     SHORT of it (not closed); SUBJECT TO REGULATORY APPROVALS prints.
// Limits: the contingent money is never shown as paid or coupled; every total carries "up to about" + "our math".
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, COLORS, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { EASE } from "./plusone";
import { label, line } from "./inovio";
import { Print, Slam } from "./ryb1b";
import { useP3, useZ } from "./camera";
import { KType, Scatter, useDropX, useSpringX } from "./v2style";
import { G_GREY, G_INK, G_WHITE, Puck } from "./argenx1v2b";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });
const G_RED = "linear-gradient(155deg, #ff6a71 0%, #F4212D 50%, #b3121b 100%)";

export const TRAIN = { rail: 830, w1: 960, w2: 220, post: 590, buffer: 2140, roll: 640 };
export const WAG = { w: 560, h: 290, d: 120 };
const WR = 56; //                                       wheel radius
const BODY_CY = TRAIN.rail - 2 * WR + 24 - WAG.h / 2; //  607
const BODY_TOP = BODY_CY - WAG.h / 2; //                  462
const BOARD = { x: TRAIN.post, y: 250, w: 1000, h: 230 };
const SIGN = { x: TRAIN.buffer - 80, y: 220, w: 700, h: 220 };

const Wheel: React.FC<{ x: number; rot: number }> = ({ x, rot }) => (
  <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transformOrigin: `${x}px ${TRAIN.rail - WR}px`, transform: `rotateZ(${rot}deg)` }}>
    <Puck x={x} y={TRAIN.rail - WR} w={WR * 2} h={WR * 2} d={40} r="50%" front="radial-gradient(circle at 38% 32%, #6a6a6a, #2b2b2b 70%)" side="#141414">
      <div style={{ position: "relative", width: WR * 2, height: WR * 2 }}>
        {[0, 60, 120].map((a) => (
          <div key={a} style={{ ...abs(WR - 4, 12), width: 8, height: WR * 2 - 24, borderRadius: 4, background: "#8a8a8a", transform: `rotate(${a}deg)` }} />
        ))}
        <div style={{ ...abs(WR - 16, WR - 16), width: 32, height: 32, borderRadius: "50%", background: "#bdbdbd" }} />
      </div>
    </Puck>
  </div>
);

/** a wagon at world x `x` (its centre), wheels turned by distance travelled */
export const Wagon: React.FC<{ x: number; dist: number; front: string; side: string; tilt?: number; children?: React.ReactNode }> = ({ x, dist, front, side, tilt = 0, children }) => {
  const rot = (dist / WR) * (180 / Math.PI);
  return (
    <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
      <div style={{ ...abs(x - WAG.w / 2 + 10, TRAIN.rail - 8), width: WAG.w - 20, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.75)", filter: "blur(6px)" }} />
      <Wheel x={x - 170} rot={rot} />
      <Wheel x={x + 170} rot={rot} />
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transformOrigin: `${x}px ${BODY_CY + WAG.h / 2}px`, transform: `rotateZ(${tilt}deg)` }}>
        <Puck x={x} y={BODY_CY} w={WAG.w} h={WAG.h} d={WAG.d} r="30px 30px 44px 44px" front={front} side={side}>
          <div style={{ position: "relative", width: WAG.w, height: WAG.h }}>{children}</div>
        </Puck>
      </div>
    </div>
  );
};

const Rail: React.FC = () => (
  <div style={{ position: "absolute", inset: 0 }}>
    {Array.from({ length: 44 }, (_, i) => (
      <div key={i} style={{ ...abs(-1400 + i * 120, TRAIN.rail + 12), width: 60, height: 22, borderRadius: 6, background: "#2a2a2a" }} />
    ))}
    <div style={{ ...abs(-1400, TRAIN.rail), width: 5300, height: 14, borderRadius: 7, background: "linear-gradient(180deg,#9a9a9a,#555)" }} />
  </div>
);

export const MoneyTrain: React.FC<Win & {
  money: Cued; order: Cued; price: Cued; upfront: Cued; ontop: Cued; upto: Cued; price2: Cued; onlyif: Cued; reg: Cued; com: Cued;
  ourmath: Cued; total: Cued; jj: Cued; close: Cued; year: Cued; subject: Cued; flyMs?: number;
}> = ({ from, to, money, order, price, upfront, ontop, upto, price2, onlyif, reg, com, ourmath, total, jj, close, year, subject, flyMs }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const drop = useDropX();
  const tMoney = at(money, 21540, from);
  const tOrder = at(order, 22300, from, tMoney + 400);
  const tPrice = at(price, 23150, from, tOrder + 400);
  const tUp = at(upfront, 24320, from, tPrice + 600);
  const tTop = at(ontop, 25914, from, tUp + 800);
  const tUpTo = at(upto, 27040, from, tTop + 600);
  const tPrice2 = at(price2, 27870, from, tUpTo + 400);
  const tOnly = at(onlyif, 30740, from, tPrice2 + 800);
  const tReg = at(reg, 31100, from, tOnly + 300);
  const tCom = at(com, 31890, from, tReg + 400);
  const tMath = at(ourmath, 33920, from, tCom + 800);
  const tTotal = at(total, 36290, from, tMath + 1200);
  const tFly = flyMs ?? tTotal - 690;
  const tJJ = at(jj, 39150, from, tTotal + 1500);
  const tClose = at(close, 40290, from, tJJ + 400);
  const tYear = at(year, 42000, from, tClose + 900);
  const tSub = at(subject, 43420, from, tYear + 600);
  if (ms < from || ms > to + 320) return null;

  // S5 wagon 1 rolls in, rocks once on the stop
  const r1 = EASE(clamp01((ms - tMoney) / (tOrder - tMoney)));
  const stop1 = ms >= tOrder ? 1 - sp(tOrder, 7, 200, 0.6) : 0;
  // S8 the whole train rolls toward the buffer
  const r8 = EASE(k(tClose, 900));
  const stop8 = ms >= tClose + 900 ? 1 - sp(tClose + 900, 7, 200, 0.6) : 0;
  const shift = TRAIN.roll * r8;
  const x1 = lerp(TRAIN.w1 - 1500, TRAIN.w1, r1) + shift;
  const d1 = 1500 * r1 + shift;
  // S6 wagon 2 drops onto the rails
  const w2 = drop(tTop - 380, 900, 380);
  const x2 = TRAIN.w2 + shift;
  // S6 the signal post: springs up, plates slam; S7 sinks away
  const postUp = ms >= tOnly - 300 ? sp(tOnly - 300, 11, 170) : 0;
  const postOut = EASE(k(tMath, 360));
  // S7 the figures fly off the wagons and merge into the board
  const fly = EASE(k(tFly, 690));
  const flown = ms >= tFly;
  const board = ms >= tTotal ? sp(tTotal, 9, 170) : 0;
  const boardOut = EASE(k(tJJ, 360));
  const figY = BODY_CY - 38; //                          the figure's seat on a wagon face
  const fx = (sx: number) => lerp(sx, BOARD.x, fly);
  const fy = lerp(figY, BOARD.y, fly) - 160 * 4 * fly * (1 - fly);
  const fs = lerp(1, 0.6, fly);

  const faceLabel = (txt: string, c: string = COLORS.grayText) => <div style={{ width: WAG.w, textAlign: "center", ...label(c, 34) }}>{txt}</div>;
  return (
    <AbsoluteFill style={{ ...p3 }}>
      <Rail />

      {/* the buffer stop + its sign (in the world from S7, off-frame until the S8 truck reveals it) */}
      {ms >= tMath ? <div style={{ position: "absolute", inset: 0, ...p3 }}>
        <div style={{ ...abs(TRAIN.buffer - 12, SIGN.y), width: 24, height: TRAIN.rail - SIGN.y, borderRadius: 12, background: "linear-gradient(90deg,#8a8a8a,#4a4a4a)" }} />
        <Puck x={TRAIN.buffer + 40} y={TRAIN.rail - 90} w={160} h={180} d={90} r={26} front={G_GREY} side="#3a3a3a">
          <div style={{ width: 110, height: 26, borderRadius: 13, background: COLORS.ink }} />
        </Puck>
        <Puck x={SIGN.x} y={SIGN.y} w={SIGN.w} h={SIGN.h} d={36} r={28} front={G_WHITE} side="#9c9c9c">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={label(COLORS.grayText, 32)}>EXPECTED CLOSE</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 18 }}>
              <div style={line(48, COLORS.ink)}>BEFORE END OF</div>
              <div style={{ width: 190, height: 88, display: "flex", alignItems: "flex-end" }}><KType text="2026" t={tYear - 260} size={84} color={COLORS.ink} /></div>
            </div>
          </div>
        </Puck>
        <div style={{ ...abs(SIGN.x - 400, SIGN.y + SIGN.h / 2 + 26), width: 800, display: "flex", justifyContent: "center", transform: z(30) || undefined }}>
          <Print t={tSub}><div style={{ background: COLORS.paper, borderRadius: 34, padding: "14px 28px", ...label(COLORS.ink, 30) }}>SUBJECT TO REGULATORY APPROVALS</div></Print>
        </div>
      </div> : null}

      {/* wagon 2: drops onto the rails (contingent money: grey) */}
      {w2.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${x2}px ${TRAIN.rail}px`, transform: `translateY(${w2.dy}px) scale(${w2.sx}, ${w2.sy})` }}>
          <Wagon x={x2} dist={shift} front={G_GREY} side="#4a4a4a" tilt={2.5 * stop8}>
            {ms < tFly + 200 ? <div style={{ ...abs(0, 56), width: WAG.w }}><Print t={tUpTo}>{faceLabel("UP TO ABOUT", "#1c1c1c")}</Print></div> : null}
            {!flown ? (
              <div style={{ ...abs(0, 110), width: WAG.w, display: "flex", justifyContent: "center" }}>
                <KType text="$1.125B" t={tPrice2 - 260} size={108} color={COLORS.ink} />
              </div>
            ) : null}
            {ms >= tFly + 200 ? <div style={{ ...abs(0, 118), width: WAG.w }}><Print t={tFly + 200}>{faceLabel("IF MILESTONES", "#1c1c1c")}</Print></div> : null}
          </Wagon>
        </div>
      ) : null}
      <Scatter x={x2} y={TRAIN.rail} t={tTop} seed={21} n={7} color="#9a9a9a" zz={WAG.d / 2} />

      {/* wagon 1: rolls in */}
      {ms >= tMoney ? (
        <Wagon x={x1} dist={d1} front={G_WHITE} side="#9c9c9c" tilt={-3 * stop1 + 2.5 * stop8}>
          {!flown ? (
            <div style={{ ...abs(0, 70), width: WAG.w, display: "flex", justifyContent: "center" }}>
              <KType text="$2.2B" t={tPrice - 260} size={124} color={COLORS.ink} />
            </div>
          ) : null}
          <div style={{ ...abs(0, lerp(204, 118, fly)), width: WAG.w }}><Print t={tUp}>{faceLabel("UP FRONT")}</Print></div>
        </Wagon>
      ) : null}

      {/* the signal post between the wagons */}
      {ms >= tOnly - 300 && postOut < 1 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${lerp(700, 0, postUp) + 760 * postOut * postOut}px)` }}>
          <div style={{ ...abs(TRAIN.post - 13, 150), width: 26, height: TRAIN.rail - 150, borderRadius: 13, background: "linear-gradient(90deg,#9a9a9a,#555)" }} />
          <Puck x={TRAIN.post} y={160} w={580} h={30} d={30} r={15} front={G_INK} side="#1c1c1c" />
          {[{ t: tReg, y: 232, txt: "REGULATORY" }, { t: tCom, y: 322, txt: "COMMERCIAL" }].map((p) => (
            <div key={p.txt} style={{ ...abs(TRAIN.post - 270, p.y - 38), width: 540, height: 76, transform: z(20) || undefined }}>
              <Slam t={p.t}>
                <div style={{ width: 540, height: 76, borderRadius: 38, background: G_WHITE, boxShadow: "0 10px 18px rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={label(COLORS.ink, 32)}>{p.txt} MILESTONES</div>
                </div>
              </Slam>
            </div>
          ))}
        </div>
      ) : null}

      {/* S7: the figures in flight */}
      {flown && ms < tTotal ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: z(lerp(WAG.d / 2, 120, fly)) || undefined }}>
          {[{ sx: TRAIN.w1, txt: "$2.2B", s: 124 }, { sx: TRAIN.w2, txt: "$1.125B", s: 108 }].map((f) => (
            <div key={f.txt} style={{ ...abs(fx(f.sx) - 300, fy - f.s / 2), width: 600, display: "flex", justifyContent: "center", transform: `scale(${fs})` }}>
              <div style={line(f.s, COLORS.paper)}>{f.txt}</div>
            </div>
          ))}
        </div>
      ) : null}

      {/* the total board: springs out of the collision, lifts away on "J&J" */}
      {ms >= tTotal && boardOut < 1 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(60)}translateY(${-900 * boardOut * boardOut}px)` }}>
          <Puck x={BOARD.x} y={BOARD.y} w={BOARD.w} h={BOARD.h} d={60} r={40} front={G_RED} side="#7a0b12"
            style={{ transform: `scale(${lerp(0.3, 1, board)})`, transformStyle: "preserve-3d" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
              <div style={{ ...label("rgba(255,255,255,0.9)", 40), lineHeight: 1.1, whiteSpace: "normal", width: 150 }}>UP TO ABOUT</div>
              <div style={line(150, COLORS.paper)}>$3.3B</div>
              <div style={{ background: COLORS.ink, borderRadius: 30, padding: "12px 22px", ...label(COLORS.paper, 30) }}>OUR MATH</div>
            </div>
          </Puck>
        </div>
      ) : null}
      <Scatter x={BOARD.x} y={BOARD.y} t={tTotal} seed={23} n={8} color={COLORS.accent} zz={120} />
    </AbsoluteFill>
  );
};
