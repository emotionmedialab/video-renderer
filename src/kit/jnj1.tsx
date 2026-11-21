// ─────────────────────────────────────────────────────────────────────────
// KIT · jnj1 — J&J × Ollin long-form, chunk 1 (§1 The deal), 16:9, 2026-11-19. House style 11-16.
//  S1 Hook (red):     "$2.2B" drops letter by letter; a company pod falls and squashes; its roller shutter
//                     rolls up on "one" to show ONE vial standing alone inside.
//  S2 Bill (ink):     J&J block rises; "someone else" hops into line beside it; a FINAL TRIALS bill falls on
//                     J&J, then is flicked across into the newcomer's hands.
//  S3 Signing (paper): a contract flies in, NOV 16 drops onto its header, J&J's wax seal presses down on "agreed".
//  S4 Eye (paper):    a closed eye flies in; on "developing" its lids part and the iris springs open.
// On-screen limits: nothing names Blackstone before §5 ("someone else" stays a "?"). The drug is a VIAL, not an
// eye-drop bottle (OLN324 is an eye injection drug; never imply drops).
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, COLORS, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { EASE, fadeOut } from "./plusone";
import { label, line } from "./inovio";
import { Print } from "./ryb1b";
import { useP3, useZ } from "./camera";
import { LineDrop } from "./jnjtype";
import { KType, Scatter, useDropX, useEnt, useSpringX } from "./v2style";
import { G_GREY, G_INK, G_STONE, G_WHITE, Puck } from "./argenx1v2b";
import { PathSolid } from "./pfb1v2";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });
const G_RED = "linear-gradient(155deg, #ff6a71 0%, #F4212D 50%, #b3121b 100%)";

/** a glass vial: crimp cap, neck, glass body with red drug inside (2.5D gradients) */
export const Vial: React.FC<{ x: number; bottom: number; s?: number }> = ({ x, bottom, s = 1 }) => {
  const bw = 100 * s, bh = 124 * s, nw = 58 * s, nh = 18 * s, cw = 80 * s, ch = 36 * s;
  return (
    <div style={{ ...abs(x - cw / 2, bottom - bh - nh - ch), width: cw, height: bh + nh + ch }}>
      <div style={{ ...abs(0, 0), width: cw, height: ch, borderRadius: 9 * s, background: "linear-gradient(155deg,#e6e6e6,#a8a8a8 55%,#6e6e6e)" }} />
      <div style={{ ...abs((cw - nw) / 2, ch), width: nw, height: nh, background: "linear-gradient(90deg,#9fb3bd,#e8f1f4 40%,#8aa0aa)" }} />
      <div style={{ ...abs((cw - bw) / 2, ch + nh), width: bw, height: bh, borderRadius: `${12 * s}px ${12 * s}px ${18 * s}px ${18 * s}px`, overflow: "hidden",
        background: "linear-gradient(90deg, rgba(200,225,235,0.55), rgba(255,255,255,0.85) 35%, rgba(170,200,212,0.5))" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: bh * 0.58, background: "linear-gradient(90deg,#b3121b,#ff4d55 40%,#a10f17)" }} />
        <div style={{ position: "absolute", left: bw * 0.18, top: bh * 0.1, width: bw * 0.12, height: bh * 0.75, borderRadius: 8, background: "rgba(255,255,255,0.55)" }} />
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S1 (red) — "Johnson and Johnson is paying $2.2 billion up front for a company with one late-stage eye drug."
// Settled: pod with the lone vial (hero) / $2.2B / UP FRONT.
// ══════════════════════════════════════════════════════════════════════════
export const POD = { cx: 960, cy: 720, w: 860, h: 360, d: 110 };
const WIN = { l: 50, t: 30, w: POD.w - 100, h: 230 };
const FIG_Y = 250;

export const Hook: React.FC<Win & { jj: Cued; price: Cued; upfront: Cued; company: Cued; one: Cued; late: Cued }> = ({
  from, to, jj, price, upfront, company, one, late,
}) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const drop = useDropX();
  const tJJ = at(jj, 60, from);
  const tPrice = at(price, 2090, from);
  const tUp = at(upfront, 3670, from, tPrice + 600);
  const tCo = at(company, 4600, from, tUp + 500);
  const tOne = at(one, 5360, from, tCo + 500);
  const tLate = at(late, 5600, from, tOne + 200);
  if (ms < from || ms > to + 320) return null;

  const kOut = EASE(k(tCo - 380, 300));
  const pod = drop(tCo - 380, 1000, 380);
  const roll = EASE(k(tOne, 400)); //                      the shutter rolls up into its drum
  const shH = WIN.h * (1 - roll);
  const podTop = POD.cy - POD.h / 2;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {/* kicker: retires up as the pod falls */}
      {kOut < 1 ? (
        <div style={{ ...abs(0, 96), width: 1920, display: "flex", justifyContent: "center", transform: `${z(20)}translateY(${-260 * kOut}px)` }}>
          <Print t={tJJ}><div style={label(COLORS.paper, 46)}>JOHNSON &amp; JOHNSON</div></Print>
        </div>
      ) : null}
      {/* the figure */}
      <div style={{ ...abs(0, FIG_Y - 110), width: 1920, display: "flex", justifyContent: "center", transform: z(40) || undefined }}>
        <KType text="$2.2B" t={tPrice - 260} size={210} color={COLORS.paper} shadow="0 14px 0 #b3121b, 0 26px 40px rgba(0,0,0,0.25)" />
      </div>
      <div style={{ ...abs(0, FIG_Y + 118), width: 1920, display: "flex", justifyContent: "center", transform: z(30) || undefined }}>
        <Print t={tUp}><div style={label(COLORS.paper, 44)}>UP FRONT</div></Print>
      </div>

      {/* contact shadow (grows as the pod lands) */}
      {pod.on ? (
        <div style={{ ...abs(POD.cx - 470, POD.cy + POD.h / 2 - 6), width: 940, height: 40, borderRadius: "50%", background: "rgba(80,0,4,0.35)", filter: "blur(10px)",
          opacity: clamp01(1 + pod.dy / 1000) }} />
      ) : null}
      {/* the company pod: falls, squashes, settles */}
      {pod.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${POD.cx}px ${POD.cy + POD.h / 2}px`,
          transform: `translateY(${pod.dy}px) scale(${pod.sx}, ${pod.sy})` }}>
          <Puck x={POD.cx} y={POD.cy} w={POD.w} h={POD.h} d={POD.d} r={56} front={G_INK} side="#151515">
            <div style={{ position: "absolute", inset: 0 }}>
              {/* window: dark interior, one vial */}
              <div style={{ ...abs(WIN.l, WIN.t), width: WIN.w, height: WIN.h, borderRadius: 28, overflow: "hidden",
                background: "radial-gradient(ellipse at 50% 85%, #2a2a2a 0%, #0c0c0c 70%)" }}>
                <div style={{ ...abs(WIN.w / 2 - 90, WIN.h - 22), width: 180, height: 16, borderRadius: "50%", background: "rgba(0,0,0,0.7)", filter: "blur(4px)" }} />
                <Vial x={WIN.w / 2} bottom={WIN.h - 14} />
                {/* the roller shutter */}
                {shH > 0 ? (
                  <div style={{ ...abs(0, 0), width: WIN.w, height: shH, overflow: "hidden",
                    background: "repeating-linear-gradient(180deg, #e9e9e9 0px, #cfcfcf 24px, #8f8f8f 27px, #e9e9e9 29px)" }} />
                ) : null}
                <div style={{ ...abs(0, 0), width: WIN.w, height: 16, background: "linear-gradient(180deg,#6a6a6a,#2e2e2e)" }} />
              </div>
              <div style={{ ...abs(0, WIN.t + WIN.h + 22), width: POD.w, display: "flex", justifyContent: "center" }}>
                <Print t={tLate}><div style={label(COLORS.paper, 42)}>1 late-stage eye drug</div></Print>
              </div>
            </div>
          </Puck>
        </div>
      ) : null}
      <Scatter x={POD.cx} y={POD.cy + POD.h / 2} t={tCo} seed={4} n={8} color="#8f0e15" zz={POD.d / 2} />
      {podTop ? null : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S2 (ink) — "And it has already lined up someone else to pay for that drug's final trials."
// Settled: the newcomer holding the bill (hero) / J&J block.
// ══════════════════════════════════════════════════════════════════════════
export const BILL = { jx: 620, px: 1300, base: 780 };
export const JJB = { w: 380, h: 300, d: 100 };
export const PERSON = { headR: 78, bw: 300, bh: 250, d: 90 };
export const BW = 220, BH = 280;

export const Bill: React.FC = () => (
  <div style={{ width: BW, height: BH, position: "relative", borderRadius: 10, background: "linear-gradient(160deg,#ffffff,#ececec 60%,#d4d4d4)",
    boxShadow: "0 18px 30px rgba(0,0,0,0.45)", overflow: "hidden" }}>
    <div style={{ height: 74, background: G_RED, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...label(COLORS.paper, 30), lineHeight: 1.0, textAlign: "center", whiteSpace: "normal", width: 180 }}>FINAL TRIALS</div>
    </div>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ ...abs(26, 104 + i * 40), width: i === 2 ? 110 : 168, height: 14, borderRadius: 7, background: "#bdbdbd" }} />
    ))}
    <div style={{ ...abs(26, 226), width: 168, height: 26, borderRadius: 8, background: COLORS.ink }} />
  </div>
);

export const BillPass: React.FC<Win & { and: Cued; lined: Cued; someone: Cued; pay: Cued; flick: Cued }> = ({ from, to, and, lined, someone, pay, flick }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const drop = useDropX();
  const tAnd = at(and, 7560, from);
  const tLine = at(lined, 8360, from, tAnd + 450);
  const tSome = at(someone, 8820, from, tLine + 300);
  const tPay = at(pay, 9680, from, tSome + 500);
  const tFlick = at(flick, 10080, from, tPay + 300);
  if (ms < from || ms > to + 320) return null;

  const rise = ent(tAnd, 450);
  // the newcomer hops into line: three hops, landing on "someone"
  const hp = clamp01((ms - tLine) / (tSome - tLine));
  const hopX = lerp(1250, 0, EASE(hp));
  const hopY = -Math.abs(Math.sin(hp * Math.PI * 3)) * 70 * (1 - hp * 0.5);
  const landSq = ms >= tSome ? 1 - sp(tSome, 7, 220, 0.6) : 0;
  // the bill: falls onto J&J, then is flicked in an arc into the newcomer's hands
  const bd = drop(tPay - 380, 900, 380);
  const fl = clamp01((ms - tFlick) / 520);
  const fe = EASE(fl);
  const jTop = BILL.base - JJB.h;
  const b0: [number, number] = [BILL.jx, jTop - BH / 2];
  const b1: [number, number] = [BILL.px, BILL.base - PERSON.bh / 2 + 10];
  const bx = lerp(b0[0], b1[0], fe), by = lerp(b0[1], b1[1], fe) - 300 * 4 * fl * (1 - fl);
  const bz = ms >= tFlick ? lerp(0, PERSON.d / 2 + 30, fe) : JJB.d / 2 - 30;
  const bs = lerp(1, 0.86, fe);
  const brot = ms >= tFlick ? lerp(0, 360, fe) : 0;
  const caught = ms >= tFlick + 520 ? 1 - sp(tFlick + 520, 8, 220, 0.6) : 0;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {/* floor shadows */}
      <div style={{ ...abs(BILL.jx - 220, BILL.base - 8), width: 440, height: 30, borderRadius: "50%", background: "rgba(0,0,0,0.6)", filter: "blur(8px)", opacity: rise }} />
      {/* J&J */}
      <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(lerp(-1400, 0, rise))}translateY(${lerp(500, 0, rise)}px)` }}>
        <Puck x={BILL.jx} y={BILL.base - JJB.h / 2} w={JJB.w} h={JJB.h} d={JJB.d} r={40} front={G_GREY} side="#4a4a4a">
          <div style={line(120, COLORS.ink)}>J&amp;J</div>
        </Puck>
      </div>
      {/* the newcomer: "someone else" */}
      {ms >= tLine ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${BILL.px}px ${BILL.base}px`,
          transform: `translate(${hopX}px, ${hopY}px) scale(${1 + 0.08 * landSq}, ${1 - 0.1 * landSq})` }}>
          <div style={{ ...abs(BILL.px - 170, BILL.base - 8), width: 340, height: 30, borderRadius: "50%", background: "rgba(0,0,0,0.6)", filter: "blur(8px)" }} />
          <Puck x={BILL.px} y={BILL.base - PERSON.bh / 2} w={PERSON.bw} h={PERSON.bh} d={PERSON.d} r="150px 150px 34px 34px" front={G_STONE} side="#9c9c9c" />
          <Puck x={BILL.px} y={BILL.base - PERSON.bh - PERSON.headR + 6} w={PERSON.headR * 2} h={PERSON.headR * 2} d={PERSON.d - 10} r="50%" front={G_WHITE} side="#9c9c9c">
            <div style={line(104, COLORS.ink)}>?</div>
          </Puck>
        </div>
      ) : null}
      <Scatter x={BILL.px} y={BILL.base} t={tSome} seed={11} n={6} color="#9a9a9a" zz={PERSON.d / 2} />
      {/* the bill */}
      {bd.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: z(bz) || undefined }}>
          <div style={{ ...abs(bx - BW / 2, by - BH / 2 + (ms < tFlick ? bd.dy : 0)), width: BW, height: BH, transformOrigin: "50% 100%",
            transform: `rotate(${brot}deg) scale(${bs * (ms < tFlick ? bd.sx : 1 + 0.06 * caught)}, ${bs * (ms < tFlick ? bd.sy : 1 - 0.08 * caught)})` }}>
            <Bill />
          </div>
        </div>
      ) : null}
      <Scatter x={BILL.jx} y={jTop} t={tPay} seed={12} n={5} color="#d0d0d0" zz={JJB.d / 2} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S3 (paper) — "On November 16th, J&J agreed to acquire Ollin Biosciences, …"
// Settled: the sealed contract (hero) / NOV 16 / "J&J acquires Ollin Biosciences".
// ══════════════════════════════════════════════════════════════════════════
export const DOC = { cx: 960, cy: 500, w: 1000, h: 700, head: 170 };
const SEAL = { x: DOC.cx + 300, y: DOC.cy + 230, r: 105 };

export const Signing: React.FC<Win & { nov: Cued; jj: Cued; agreed: Cued; acquire: Cued }> = ({ from, to, nov, jj, agreed, acquire }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const tNov = at(nov, 12360, from);
  const tJJ = at(jj, 13860, from, tNov + 900);
  const tAgreed = at(agreed, 14100, from, tJJ + 200);
  const tAcq = at(acquire, 14780, from, tAgreed + 500);
  if (ms < from || ms > to + 320) return null;

  const docIn = ent(from, 330);
  const sealT0 = tAgreed - 380;
  const sf = clamp01((ms - sealT0) / 380);
  const press = ms >= tAgreed ? 1 - sp(tAgreed, 7, 220, 0.6) : 0;
  const spread = ms >= tAgreed ? EASE(k(tAgreed, 360)) : 0;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${DOC.cx}px ${DOC.cy}px`,
        transform: `${z(lerp(-2200, 0, docIn))}rotateX(${lerp(55, 0, EASE(k(from, 330)))}deg)` }}>
        <div style={{ ...abs(DOC.cx - DOC.w / 2 + 20, DOC.cy + DOC.h / 2 - 10), width: DOC.w - 40, height: 34, borderRadius: "50%", background: "rgba(0,0,0,0.18)", filter: "blur(10px)" }} />
        <Puck x={DOC.cx} y={DOC.cy} w={DOC.w} h={DOC.h} d={24} r={22} front={G_WHITE} side="#bdbdbd" clip>
          <div style={{ position: "absolute", inset: 0 }}>
            <div style={{ ...abs(0, 0), width: DOC.w, height: DOC.head, background: G_INK, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LineDrop text="NOV 16" t={tNov} size={108} color={COLORS.paper} />
            </div>
            <div style={{ ...abs(70, DOC.head + 70), width: DOC.w - 140 }}>
              <Print t={tAcq}>
                <div style={label(COLORS.grayText, 40)}>J&amp;J ACQUIRES</div>
                <div style={{ ...line(86, COLORS.ink), marginTop: 10 }}>Ollin Biosciences</div>
              </Print>
            </div>
            {/* signature line */}
            <div style={{ ...abs(70, DOC.h - 112), width: 420, height: 6, borderRadius: 3, background: "#cfcfcf" }} />
            <div style={{ ...abs(70, DOC.h - 96), ...label("#9a9a9a", 26) }}>AGREED</div>
          </div>
        </Puck>
        {/* the wax under the seal spreads as it presses */}
        {spread > 0 ? (
          <div style={{ ...abs(SEAL.x - SEAL.r * 1.18, SEAL.y - SEAL.r * 1.18), width: SEAL.r * 2.36, height: SEAL.r * 2.36, borderRadius: "50%",
            background: "#c3151f", transform: `${z(14)}scale(${lerp(0.7, 1, spread)})` }} />
        ) : null}
      </div>
      {/* J&J's seal: comes down from the camera and presses */}
      {ms >= sealT0 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: z(lerp(900, 30, sf * sf)) || undefined }}>
          <Puck x={SEAL.x} y={SEAL.y} w={SEAL.r * 2} h={SEAL.r * 2} d={36} r="50%" front={G_RED} side="#8f0e15"
            style={{ transform: `scale(${1 + 0.14 * press}, ${1 - 0.14 * press})`, transformStyle: "preserve-3d" }}>
            <div style={{ width: SEAL.r * 1.6, height: SEAL.r * 1.6, borderRadius: "50%", border: "5px solid rgba(255,255,255,0.55)", boxSizing: "border-box",
              display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={line(64, COLORS.paper)}>J&amp;J</div>
            </div>
          </Puck>
        </div>
      ) : null}
      <Scatter x={SEAL.x} y={SEAL.y + SEAL.r} t={tAgreed} seed={14} n={7} color={COLORS.accent} zz={40} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S4 (paper) — "…a clinical-stage company developing treatments for serious eye diseases."
// Settled: the open eye (hero) / "Ollin Biosciences" / clinical-stage chip (one row).
// ══════════════════════════════════════════════════════════════════════════
export const EYE = { cx: 960, cy: 430, w: 780, h: 360 };
const ALMOND = `M0,${EYE.h / 2} Q${EYE.w / 2},${-EYE.h * 0.42} ${EYE.w},${EYE.h / 2} Q${EYE.w / 2},${EYE.h * 1.42} 0,${EYE.h / 2} Z`;
const UPPER = `M-10,${EYE.h / 2 + 2} Q${EYE.w / 2},${-EYE.h * 0.42} ${EYE.w + 10},${EYE.h / 2 + 2} L${EYE.w + 10},-40 L-10,-40 Z`;
const LOWER = `M-10,${EYE.h / 2 - 2} Q${EYE.w / 2},${EYE.h * 1.42} ${EYE.w + 10},${EYE.h / 2 - 2} L${EYE.w + 10},${EYE.h + 40} L-10,${EYE.h + 40} Z`;

export const EyeOpens: React.FC<Win & { clinical: Cued; developing: Cued }> = ({ from, to, clinical, developing }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const tClin = at(clinical, 17050, from);
  const tDev = at(developing, 18260, from, tClin + 600);
  if (ms < from || ms > to + 320) return null;

  const fly = ent(from, 420);
  const open = EASE(k(tDev, 460)); //                       lids part
  const iris = ms >= tDev + 180 ? sp(tDev + 180, 9, 170) : 0;
  const lidOff = (EYE.h / 2 + 50) * open;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(lerp(-2400, 0, fly))}translateY(${lerp(-200, 0, fly)}px)` }}>
        <div style={{ ...abs(EYE.cx - 360, EYE.cy + EYE.h / 2 + 14), width: 720, height: 34, borderRadius: "50%", background: "rgba(0,0,0,0.14)", filter: "blur(12px)" }} />
        <PathSolid id="eyeW" x={EYE.cx} y={EYE.cy} w={EYE.w} h={EYE.h} d={40} path={ALMOND} front={["#ffffff", "#f2f2f2", "#d6d6d6"]} side="#a9a9a9">
          <svg width={EYE.w} height={EYE.h} viewBox={`0 0 ${EYE.w} ${EYE.h}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <defs>
              <clipPath id="eyeClip"><path d={ALMOND} /></clipPath>
              <radialGradient id="irisG" cx="40%" cy="35%" r="70%">
                <stop offset="0%" stopColor="#ff7a80" /><stop offset="55%" stopColor="#F4212D" /><stop offset="100%" stopColor="#8f0e15" />
              </radialGradient>
            </defs>
            <g clipPath="url(#eyeClip)">
              <g transform={`translate(${EYE.w / 2} ${EYE.h / 2}) scale(${lerp(0.55, 1, iris)})`}>
                <circle r={132} fill="url(#irisG)" />
                <circle r={56} fill={COLORS.ink} />
                <circle cx={-30} cy={-34} r={18} fill="rgba(255,255,255,0.85)" />
              </g>
              <path d={UPPER} fill="#1f1f1f" transform={`translate(0 ${-lidOff})`} />
              <path d={LOWER} fill="#2a2a2a" transform={`translate(0 ${lidOff})`} />
            </g>
            <path d={ALMOND} fill="none" stroke={COLORS.ink} strokeWidth={10} />
          </svg>
        </PathSolid>
      </div>
      <div style={{ ...abs(0, EYE.cy + EYE.h / 2 + 50), width: 1920, display: "flex", justifyContent: "center", transform: z(20) || undefined }}>
        <Print t={tClin}>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <div style={line(76, COLORS.ink)}>Ollin Biosciences</div>
            <div style={{ background: COLORS.ink, borderRadius: 40, padding: "14px 28px", ...label(COLORS.paper, 34) }}>CLINICAL-STAGE</div>
          </div>
        </Print>
      </div>
    </AbsoluteFill>
  );
};
