// ─────────────────────────────────────────────────────────────────────────
// KIT · argenx2v2 — chunk 2 (0:30–0:56) REDESIGNED for the style reset (Nel, 2026-11-16). Same cues and timings as
// argenx2 (MoneyVault / LockedTranche / TogetherColumn / BoardsClose); the v1 composition is untouched.
//  · S5 (red): a ROUND bank-vault door falls in; its wheel spins, it swings open; the hook's cash bundles fly out in
//    arcs onto a stack; "$550M · UP FRONT" pops; "From cash on hand" prints on the vault's plaque.
//  · S6 (red): the hook's ink $595M capsule drops in and settles; two padlock silhouettes fly in and snap onto it.
//  · S7 (ink): the hook's two bar halves fly in from both sides and SNAP together; "UP TO ABOUT $1.15B" lands above
//    (K2: the hook's bar, completed).
//  · S8 (ink): two board-resolution cards fly in; round APPROVED seals slam onto each; a red ball rolls the track to
//    year-end. Loosened motion (PLAN.md "Style reset").
// Limits: "up to" on $595M / $1.15B; the $595M is contingent (locked), never shown paid.
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, COLORS, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { EASE, back, fadeOut } from "./plusone";
import { label, line } from "./inovio";
import { Print, Slam } from "./ryb1b";
import { useP3, useZ } from "./camera";
import { KType, Scatter, useDropX, useEnt, useSpringX } from "./v2style";
import { BUN, Bundle } from "./argenx1v2";
import { G_GREY, G_INK, G_WHITE, Puck } from "./argenx1v2b";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });

// ══════════════════════════════════════════════════════════════════════════
// S5 THE VAULT (red) — "Now the money, in order. argenx pays $550 million up front, from cash on hand."
// Settled: bundle stack + its chip (hero) / the open vault + plaque.
// ══════════════════════════════════════════════════════════════════════════
export const VDOOR = { x: 760, y: 470, R: 210, ring: 42 };
export const STACK = { x: 1290, base: 700 };
const STACK_SEATS: [number, number, number][] = [[-150, 0, -4], [150, 0, 3], [0, -112, -1]]; // dx, dy (bundle centre above base), rot

const Wheel: React.FC = () => (
  <svg width={220} height={220} viewBox="0 0 220 220">
    <circle cx={110} cy={110} r={84} fill="none" stroke={COLORS.ink} strokeWidth={16} />
    {Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * Math.PI * 2;
      return <line key={i} x1={110} y1={110} x2={110 + Math.cos(a) * 104} y2={110 + Math.sin(a) * 104} stroke={COLORS.ink} strokeWidth={14} strokeLinecap="round" />;
    })}
    <circle cx={110} cy={110} r={22} fill={COLORS.ink} />
  </svg>
);

export const VaultV2: React.FC<Win & { money: Cued; pays: Cued; upfront: Cued; cash: Cued }> = ({ from: f0, to, money, pays, upfront, cash }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const drop = useDropX();
  const tMoney = at(money, 30300, f0);
  const tPays = at(pays, 32060, f0, tMoney + 600);
  const tSwing = tPays + 260; //            the wheel spins first, the door swings while it finishes (overlap)
  const tSlide = tPays + 500;
  const tUp = at(upfront, 34180, f0, tSlide + 900);
  const tFrom = at(cash, 34880, f0, tUp + 400);
  if (ms < f0 || ms > to + 320) return null;

  const v = drop(tMoney - 380, 1100, 380);
  const spin = -360 * EASE(k(tPays, 420));
  const swing = EASE(k(tSwing, 460));
  const doorX = VDOOR.x - VDOOR.R;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 55% at 45% 42%, rgba(255,255,255,0.16), rgba(255,255,255,0) 70%)" }} />
      {/* the vault: frame ring + dark interior + plaque; falls and squashes */}
      <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${VDOOR.x}px ${VDOOR.y + VDOOR.R + VDOOR.ring}px`, transform: `translateY(${v.dy}px) scale(${v.sx}, ${v.sy})` }}>
        <Puck x={VDOOR.x} y={VDOOR.y} w={2 * (VDOOR.R + VDOOR.ring)} h={2 * (VDOOR.R + VDOOR.ring)} d={70} r="50%" front={G_INK} side="#151515">
          <div style={{ width: 2 * VDOOR.R, height: 2 * VDOOR.R, borderRadius: "50%", background: "radial-gradient(circle at 50% 40%, #2a2a2a, #050505 70%)" }} />
        </Puck>
        <Puck x={VDOOR.x} y={VDOOR.y + VDOOR.R + VDOOR.ring + 70} w={460} h={76} d={40} r={38} front={G_INK} side="#151515">
          <div style={{ height: 40, overflow: "hidden" }}><Print t={tFrom}><div style={label(COLORS.paper, 34)}>From cash on hand</div></Print></div>
        </Puck>
        {/* the door: hinged on its left edge; the wheel spins, then it swings */}
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${doorX}px ${VDOOR.y}px 40px`, transform: `rotateY(${-108 * swing}deg)` }}>
          <Puck x={VDOOR.x} y={VDOOR.y} w={2 * VDOOR.R} h={2 * VDOOR.R} d={50} r="50%" front={G_GREY} side="#5a5a5a" style={{ transform: "translateZ(40px)" }}>
            <div style={{ transform: `rotate(${spin}deg)` }}><Wheel /></div>
          </Puck>
        </div>
      </div>
      <Scatter x={VDOOR.x} y={VDOOR.y + VDOOR.R + VDOOR.ring} t={tMoney} seed={11} n={8} color="#7a0b10" zz={40} />

      {/* the bundles: fly out of the vault in arcs, staggered, and spring onto the stack */}
      {STACK_SEATS.map(([dx, dy, rot], i) => {
        const t0 = tSlide + i * 110;
        if (ms < t0) return null;
        const p = clamp01((ms - t0) / 480);
        const e = EASE(p);
        const x0 = VDOOR.x, y0 = VDOOR.y;
        const x1 = STACK.x + dx, y1 = STACK.base - BUN.h / 2 + dy;
        const x = lerp(x0, x1, e), y = lerp(y0, y1, e) - 220 * 4 * e * (1 - e);
        const zz = lerp(-60, 60, e);
        const settle = p >= 1 ? 1 - sp(t0 + 480, 8, 200, 0.6) : 0;
        return (
          <div key={i} style={{ ...abs(x - BUN.w / 2, y - BUN.h / 2), transformOrigin: "50% 100%",
            transform: `${z(zz)}rotate(${lerp(-200, rot, e)}deg) scale(${lerp(0.5, 1, e) * (1 + 0.12 * settle)}, ${lerp(0.5, 1, e) * (1 - 0.18 * settle)})` }}>
            <Bundle />
          </div>
        );
      })}
      {STACK_SEATS.map((_, i) => <Scatter key={i} x={STACK.x + STACK_SEATS[i][0]} y={STACK.base - BUN.h + STACK_SEATS[i][1]} t={tSlide + i * 110 + 480} seed={30 + i} n={4} zz={70} />)}
      {/* the chip */}
      {ms >= tUp ? (
        <div style={{ ...abs(STACK.x - 230, STACK.base + 30), width: 460, display: "flex", justifyContent: "center", transform: `${z(80)}scale(${sp(tUp, 7, 220)})` }}>
          <div style={{ background: COLORS.ink, borderRadius: 40, padding: "12px 30px", display: "flex", gap: 14, alignItems: "baseline", boxShadow: "0 12px 20px rgba(0,0,0,0.35)" }}>
            <div style={line(48, COLORS.paper)}>$550M</div>
            <div style={label(COLORS.paper, 34)}>UP FRONT</div>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S6 THE LOCKS (red) — "On top of that, up to $595 million more, but only if specified development and regulatory
// milestones are reached."  Settled: the locked $595M capsule (hero) / two padlocks.
// ══════════════════════════════════════════════════════════════════════════
export const CAP = { x: 960, y: 430, w: 820, h: 200 };
const PAD = { dx: 290, w: 230, h: 170, d: 60 };
export const PAD_Y = CAP.y + CAP.h / 2 + 70 + PAD.h / 2;

const Padlock2: React.FC<{ x: number; t: number; text: string }> = ({ x, t, text }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const k = useK();
  if (ms < t - 420) return null;
  const fly = ent(t - 420, 420);
  const snap = back(k(t, 170));
  return (
    <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${x}px ${PAD_Y}px`,
      transform: `${z(lerp(-1600, 90, fly))}translateY(${lerp(-320, 0, fly)}px) rotateZ(${lerp(-40, 0, fly)}deg)` }}>
      {/* shackle: a thick rounded U, open above, snaps down over the capsule's bottom edge */}
      <div style={{ ...abs(x - 72, PAD_Y - PAD.h / 2 - 128 + lerp(-46, 0, snap)), width: 144, height: 170, borderRadius: "72px 72px 0 0",
        border: "26px solid #2b2b2b", borderBottom: "none", boxSizing: "border-box", boxShadow: "inset 0 6px 0 rgba(255,255,255,0.12)" }} />
      <Puck x={x} y={PAD_Y} w={PAD.w} h={PAD.h} d={PAD.d} r={34} front={G_WHITE} side="#a9a9a9">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <svg width={30} height={44} viewBox="0 0 30 44"><circle cx={15} cy={13} r={11} fill={COLORS.ink} /><path d="M9 20 L21 20 L18 42 L12 42 Z" fill={COLORS.ink} /></svg>
          <div style={label(COLORS.ink, 30)}>{text}</div>
        </div>
      </Puck>
    </div>
  );
};

export const LockedV2: React.FC<Win & { lower: Cued; dev: Cued; reg: Cued }> = ({ from, to, lower, dev, reg }) => {
  const ms = useMs();
  const p3 = useP3();
  const drop = useDropX();
  const tLand = at(lower, 38320, from);
  const tDev = at(dev, 41680, from, tLand + 900);
  const tReg = at(reg, 42830, from, tDev + 600);
  if (ms < from || ms > to + 320) return null;
  const c = drop(tLand - 380, 1000, 380);
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 55% at 50% 40%, rgba(255,255,255,0.16), rgba(255,255,255,0) 70%)" }} />
      {c.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${CAP.x}px ${CAP.y + CAP.h / 2}px`, transform: `translateY(${c.dy}px) scale(${c.sx}, ${c.sy})` }}>
          <Puck x={CAP.x} y={CAP.y} w={CAP.w} h={CAP.h} d={80} r={CAP.h / 2} front={G_INK} side="#151515">
            <div style={{ display: "flex", alignItems: "baseline", gap: 22 }}>
              <div style={label("rgba(255,255,255,0.8)", 46)}>UP TO</div>
              <KType text="$595M" t={tLand - 250} size={112} color={COLORS.paper} />
            </div>
          </Puck>
        </div>
      ) : null}
      <Padlock2 x={CAP.x - PAD.dx} t={tDev} text="Development" />
      <Padlock2 x={CAP.x + PAD.dx} t={tReg} text="Regulatory" />
      <Scatter x={CAP.x - PAD.dx} y={PAD_Y - PAD.h / 2} t={tDev} seed={41} n={5} zz={160} />
      <Scatter x={CAP.x + PAD.dx} y={PAD_Y - PAD.h / 2} t={tReg} seed={43} n={5} zz={160} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S7 TOGETHER (ink) — "Together, that values UNP at up to about $1.15 billion."
// Settled: the joined bar (hero) / "UP TO ABOUT $1.15B".
// ══════════════════════════════════════════════════════════════════════════
export const BAR = { x0: 230, x1: 1690, y: 660, h: 120 };
const SEG1 = 550 / 1145;

export const TogetherV2: React.FC<Win & { together: Cued; total: Cued }> = ({ from, to, together, total }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const tTog = at(together, 45830, from);
  const tTot = at(total, 48370, from, tTog + 700);
  if (ms < from || ms > to + 320) return null;
  const inP = ent(tTog, 620);
  const W = BAR.x1 - BAR.x0, w1 = W * SEG1, w2 = W - w1;
  const seam = BAR.x0 + w1;
  const tMeet = tTog + 330; //                         ~ where the spring first reaches the seam
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateX(${lerp(-1300, 0, inP)}px)` }}>
        <Puck x={BAR.x0 + w1 / 2} y={BAR.y} w={w1} h={BAR.h} d={60} r={`${BAR.h / 2}px 0 0 ${BAR.h / 2}px`} front={G_WHITE} side="#9d9d9d">
          <KType text="$550M" t={tTog + 200} size={64} color={COLORS.ink} />
          <div style={{ ...label("#555", 32), marginLeft: 16, marginTop: 18 }}>up front</div>
        </Puck>
      </div>
      <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateX(${lerp(1300, 0, inP)}px)` }}>
        <Puck x={seam + w2 / 2} y={BAR.y} w={w2} h={BAR.h} d={60} r={`0 ${BAR.h / 2}px ${BAR.h / 2}px 0`} front={G_GREY} side="#4c4c4c">
          <div style={{ ...label("rgba(255,255,255,0.9)", 32), marginRight: 14, marginTop: 18 }}>up to</div>
          <KType text="$595M" t={tTog + 260} size={64} color={COLORS.paper} />
          <div style={{ ...label("rgba(255,255,255,0.9)", 32), marginLeft: 14, marginTop: 18 }}>if milestones</div>
        </Puck>
      </div>
      <Scatter x={seam} y={BAR.y - BAR.h / 2} t={tMeet} seed={51} n={7} zz={60} />
      {/* the total, as kinetic type */}
      {ms >= tTot ? (
        <div style={{ ...abs(0, BAR.y - BAR.h / 2 - 300), width: 1920, display: "flex", flexDirection: "column", alignItems: "center", transform: `${z(60)}` }}>
          <div style={{ ...label("rgba(255,255,255,0.85)", 50), transform: `scale(${lerp(1.5, 1, clamp01((ms - tTot) / 130))})` }}>UP TO ABOUT</div>
          <div style={{ transform: `scale(${lerp(1.2, 1, sp(tTot + 150, 9, 180))})` }}><KType text="$1.15B" t={tTot + 150} size={170} color={COLORS.accent} /></div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S8 BOARDS + CLOSE (ink) — "Both boards have approved the deal, and argenx expects it to close by the end of the year."
// Settled: the track + red ball at year-end (hero) / two approved cards.
// ══════════════════════════════════════════════════════════════════════════
export const TRACK2 = { y: 800, x0: 380, x1: 1540 };
const CARDS = [{ x: 640, name: "argenx board" }, { x: 1280, name: "UNP board" }];
const CARD = { y: 370, w: 440, h: 300 };

export const BoardsV2: React.FC<Win & { both: Cued; approved: Cued; expects: Cued; close: Cued }> = ({ from, to, both, approved, expects, close }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const tBoth = at(both, 50230, from);
  const tApp = at(approved, 51430, from, tBoth + 460);
  const tApp2 = tApp + 350;
  const tExp = at(expects, 53570, from, tApp2 + 300);
  const tClose = at(close, 54420, from, tExp + 520);
  if (ms < from || ms > to + 320) return null;
  const draw = EASE(k(tExp, 500));
  const roll = ent(tClose, 700);
  const bx = lerp(TRACK2.x0, TRACK2.x1, roll);
  const BALL = 38;
  const rot = ((bx - TRACK2.x0) / (Math.PI * 2 * BALL)) * 360;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {/* the cards: fly in (staggered, overlapping springs) */}
      {CARDS.map((c, i) => {
        const t0 = tBoth + i * 90;
        if (ms < t0) return null;
        const f = sp(t0, 11, 160);
        const tA = i ? tApp2 : tApp;
        return (
          <div key={i} style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${c.x}px ${CARD.y}px`, transform: `${z(lerp(-1800, 0, f))}rotateZ(${lerp(i ? 25 : -25, 0, f)}deg)` }}>
            <Puck x={c.x} y={CARD.y} w={CARD.w} h={CARD.h} d={24} r={22} front={G_WHITE} side="#9d9d9d">
              <div style={{ position: "absolute", left: 34, top: 30, ...label(COLORS.ink, 36) }}>{c.name}</div>
              {[0, 1, 2].map((r) => <div key={r} style={{ position: "absolute", left: 34, top: 96 + r * 30, width: [300, 250, 280][r], height: 10, borderRadius: 5, background: "#d4d4d4" }} />)}
              {/* the round seal */}
              <div style={{ position: "absolute", right: 26, bottom: 18 }}>
                <Slam t={tA}>
                  <div style={{ width: 150, height: 150, borderRadius: "50%", border: `8px solid ${COLORS.ink}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center",
                    ...label(COLORS.ink, 19) }}>
                    <div style={{ width: 118, height: 118, borderRadius: "50%", border: `3px solid ${COLORS.ink}`, display: "flex", alignItems: "center", justifyContent: "center" }}>APPROVED</div>
                  </div>
                </Slam>
              </div>
            </Puck>
          </div>
        );
      })}
      <Scatter x={CARDS[0].x + CARD.w / 2 - 100} y={CARD.y + CARD.h / 2 - 95} t={tApp + 120} seed={61} n={6} zz={40} />
      <Scatter x={CARDS[1].x + CARD.w / 2 - 100} y={CARD.y + CARD.h / 2 - 95} t={tApp2 + 120} seed={63} n={6} zz={40} />
      {/* the track */}
      {ms >= tExp ? (
        <div style={{ position: "absolute", inset: 0, transform: z(30) || undefined }}>
          <div style={{ ...abs(TRACK2.x0 - 14, TRACK2.y - 14), width: (TRACK2.x1 - TRACK2.x0 + 28) * draw, height: 28, borderRadius: 14, background: "linear-gradient(180deg, #555, #2a2a2a)" }} />
          <div style={{ ...abs(TRACK2.x0 - 150, TRACK2.y + 46), width: 300, textAlign: "center", ...label("rgba(255,255,255,0.8)", 34) }}>Nov 9 · agreed</div>
          {draw >= 1 ? <div style={{ ...abs(TRACK2.x1 - 150, TRACK2.y + 46), width: 300, textAlign: "center", ...label("rgba(255,255,255,0.8)", 34) }}>Dec 31</div> : null}
        </div>
      ) : null}
      {/* the red ball: rolls to year-end, springs to rest */}
      {ms >= tClose ? (
        <div style={{ position: "absolute", inset: 0, transform: z(50) || undefined }}>
          <div style={{ ...abs(bx - BALL, TRACK2.y - 14 - 2 * BALL), width: 2 * BALL, height: 2 * BALL, borderRadius: "50%",
            background: `radial-gradient(circle at 35% 30%, #ff8a90, ${COLORS.accent} 55%, #8f0e15 100%)`, boxShadow: "0 10px 18px rgba(0,0,0,0.45)", transform: `rotate(${rot}deg)` }}>
            <div style={{ position: "absolute", left: BALL - 4, top: 8, width: 8, height: 20, borderRadius: 4, background: "rgba(255,255,255,0.55)" }} />
          </div>
          <div style={{ ...abs(TRACK2.x1 + 40 - 720, TRACK2.y - 150), width: 720, display: "flex", justifyContent: "flex-end" }}>
            <Print t={tClose + 300}><div style={line(46, COLORS.paper)}>Expected close: by year-end</div></Print>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
