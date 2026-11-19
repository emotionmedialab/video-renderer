// ─────────────────────────────────────────────────────────────────────────
// KIT · jnj5 — J&J × Ollin long-form, chunk 5 (§5 The funder), 16:9, 2026-11-19. House style 11-16.
// None of the Pfizer × Blackstone short's moves (11-17: vault, coin, umbrella, chute, bars, split chip) return.
//  S16 Hourglass (paper): THE UNUSUAL PART lands; an hourglass tumbles in (BLACKSTONE cap, red sand on top);
//                         $750M lands; "over several years" the sand pours; the bottom fills on "fund": FULLY FUNDED.
//  S17 Tickets (ink):     Blackstone's tray springs in ("eligible for"); three tickets drop in on their words.
//  S18 Dominoes (red):    ACQUISITION CLOSES stands up, BLACKSTONE FUNDING TAKES EFFECT stands up behind it in line.
//                         Nothing falls: the deal has not closed.
// Limits: $750M "over several years" (release: "over multiple years"); milestones = eligibility, never paid;
// royalties "single-digit"; the funding agreement is contingent on the acquisition closing.
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, COLORS, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { EASE, fadeOut } from "./plusone";
import { label, line } from "./inovio";
import { Print, Slam } from "./ryb1b";
import { useP3, useZ } from "./camera";
import { LineDrop } from "./jnjtype";
import { KType, Scatter, useDropX, useEnt, useSpringX } from "./v2style";
import { G_INK, G_WHITE, Puck } from "./argenx1v2b";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });
const chip = (txt: React.ReactNode, bg: string = COLORS.ink, fg: string = COLORS.paper, size = 30) => (
  <div style={{ background: bg, borderRadius: 34, padding: "12px 26px", ...label(fg, size), display: "inline-block" }}>{txt}</div>
);

// ══════════════════════════════════════════════════════════════════════════
// S16 (paper) — "Here is the unusual part. In a separate agreement, Blackstone Life Sciences will pay J&J $750 million over
// several years, to fully fund OLN-324's Phase 3 development."
// Settled: the hourglass (hero, its caps labelled) / $750M · over several years / FULLY FUNDED.
// ══════════════════════════════════════════════════════════════════════════
export const HG = { x: 1220, cy: 500, w: 380, h: 520, cap: 56 };
const GLASS = `M20,0 H360 C360,160 230,210 200,260 C230,310 360,360 360,520 H20 C20,360 150,310 180,260 C150,210 20,160 20,0 Z`;
export const HG_BOTTOM_Y = HG.cy + 140; //                     the bottom bulb's centre (push-in target)

export const Hourglass: React.FC<Win & { unusual: Cued; separate: Cued; blackstone: Cued; price: Cued; over: Cued; fund: Cued; phase: Cued }> = ({
  from, to, unusual, separate, blackstone, price, over, fund, phase,
}) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const tUn = at(unusual, 113010, from);
  const tSep = at(separate, 114490, from, tUn + 600);
  const tBs = at(blackstone, 116130, from, tSep + 800);
  const tPrice = at(price, 118860, from, tBs + 1200);
  const tOver = at(over, 120320, from, tPrice + 800);
  const tFund = at(fund, 122490, from, tOver + 1200);
  const tPhase = at(phase, 124160, from, tFund + 800);
  if (ms < from || ms > to + 320) return null;

  const kOut = EASE(k(tBs - 600, 350));
  // the hourglass tumbles in from depth: two turns, lands upright ON "Blackstone"
  const tum = clamp01((ms - (tBs - 600)) / 600);
  const te = EASE(tum);
  const land = ms >= tBs ? 1 - sp(tBs, 7, 210, 0.6) : 0;
  const flow = clamp01((ms - tOver) / (tFund - tOver)); //   sand pours from "over" to "fund"
  const fe = flow * (2 - flow);
  const topFrac = 1 - fe, botFrac = fe;
  const pouring = ms >= tOver && ms < tFund;
  const botTop = HG.h - 250 * botFrac;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {/* lead-in: retires as the hourglass tumbles in */}
      {kOut < 1 ? (
        <div style={{ ...abs(200, 160), transform: `${z(20)}translateY(${-400 * kOut * kOut}px)` }}>
          <LineDrop text="THE UNUSUAL PART" t={tUn - 260} size={84} color={COLORS.ink} />
          <div style={{ height: 50, marginTop: 14 }}><Print t={tSep}><div style={label(COLORS.grayText, 34)}>A SEPARATE AGREEMENT</div></Print></div>
        </div>
      ) : null}
      {/* $750M · over several years */}
      <div style={{ ...abs(200, 330), transform: z(20) || undefined }}>
        <div style={{ height: 44 }}><Print t={tPrice - 300}><div style={label(COLORS.grayText, 32)}>BLACKSTONE PAYS J&amp;J</div></Print></div>
        <KType text="$750M" t={tPrice - 260} size={170} color={COLORS.ink} />
        <div style={{ height: 70, marginTop: 16 }}><Print t={tOver}>{chip("OVER SEVERAL YEARS", COLORS.ink, COLORS.paper, 32)}</Print></div>
      </div>
      {/* the hourglass */}
      {ms >= tBs - 600 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${HG.x}px ${HG.cy}px`,
          transform: `${z(lerp(-2600, 0, te))}translate(${lerp(500, 0, te)}px, ${lerp(-300, 0, te)}px) rotateZ(${lerp(-720, 0, te)}deg) scale(${1 + 0.05 * land}, ${1 - 0.07 * land})` }}>
          <div style={{ ...abs(HG.x - 230, HG.cy + HG.h / 2 + HG.cap - 6), width: 460, height: 28, borderRadius: "50%", background: "rgba(0,0,0,0.16)", filter: "blur(8px)" }} />
          <svg width={HG.w} height={HG.h} viewBox={`0 0 ${HG.w} ${HG.h}`} style={{ position: "absolute", left: HG.x - HG.w / 2, top: HG.cy - HG.h / 2, overflow: "visible" }}>
            <defs>
              <clipPath id="hgClip"><path d={GLASS} /></clipPath>
              <linearGradient id="hgGlass" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#dfe8ec" /><stop offset="40%" stopColor="#f8fbfc" /><stop offset="100%" stopColor="#c9d5da" /></linearGradient>
              <linearGradient id="hgSand" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#ff6a71" /><stop offset="60%" stopColor="#F4212D" /><stop offset="100%" stopColor="#b3121b" /></linearGradient>
            </defs>
            <path d={GLASS} fill="url(#hgGlass)" />
            <g clipPath="url(#hgClip)">
              <rect x={0} y={260 - 230 * topFrac} width={HG.w} height={230 * topFrac} fill="url(#hgSand)" />
              {pouring ? <rect x={186} y={250} width={8} height={Math.max(0, botTop - 250)} fill="#F4212D" /> : null}
              <rect x={0} y={botTop} width={HG.w} height={HG.h - botTop} fill="url(#hgSand)" />
            </g>
            <path d={GLASS} fill="none" stroke="#8fa2aa" strokeWidth={6} />
            <rect x={60} y={30} width={18} height={160} rx={9} fill="rgba(255,255,255,0.7)" />
          </svg>
          <Puck x={HG.x} y={HG.cy - HG.h / 2 - HG.cap / 2 + 6} w={440} h={HG.cap} d={70} r={22} front={G_INK} side="#141414">
            <div style={label(COLORS.paper, 30)}>BLACKSTONE</div>
          </Puck>
          <Puck x={HG.x} y={HG.cy + HG.h / 2 + HG.cap / 2 - 6} w={440} h={HG.cap} d={70} r={22} front={G_INK} side="#141414">
            <Print t={tPhase}><div style={label(COLORS.paper, 30)}>OLN-324 · PHASE 3</div></Print>
          </Puck>
        </div>
      ) : null}
      <Scatter x={HG.x} y={HG.cy + HG.h / 2 + HG.cap} t={tBs} seed={71} n={7} color="#9a9a9a" zz={40} />
      <div style={{ ...abs(HG.x - 300, HG_BOTTOM_Y + 10), width: 600, display: "flex", justifyContent: "center", transform: z(60) || undefined }}>
        <Slam t={tFund}>{chip("FULLY FUNDED", COLORS.paper, COLORS.ink, 40)}</Slam>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S17 (ink) — "In return, Blackstone is eligible for regulatory and sales milestones, plus single-digit royalties."
// Settled: the tray with three tickets (hero, a 3-row list) / ELIGIBLE FOR label on the tray.
// ══════════════════════════════════════════════════════════════════════════
export const TRAYB = { x: 960, y: 830, w: 820, h: 120 };
const TK = { w: 700, h: 84, pitch: 98 };

const Ticket: React.FC<{ stub: string; txt: string }> = ({ stub, txt }) => (
  <div style={{ width: TK.w, height: TK.h, display: "flex", borderRadius: 16, overflow: "hidden", boxShadow: "0 12px 20px rgba(0,0,0,0.5)" }}>
    <div style={{ width: 120, background: "linear-gradient(155deg,#ff6a71,#F4212D 50%,#b3121b)", display: "flex", alignItems: "center", justifyContent: "center", ...label(COLORS.paper, 34) }}>{stub}</div>
    <div style={{ flex: 1, background: G_WHITE, display: "flex", alignItems: "center", paddingLeft: 30, borderLeft: "4px dashed #bdbdbd", ...label(COLORS.ink, 34) }}>{txt}</div>
  </div>
);

export const Tickets: React.FC<Win & { ret: Cued; eligible: Cued; reg: Cued; sales: Cued; royMs: number }> = ({ from, to, ret, eligible, reg, sales, royMs }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const tRet = at(ret, 126280, from);
  const tEl = at(eligible, 127970, from, tRet + 600);
  const tReg = at(reg, 128820, from, tEl + 400);
  const tSales = at(sales, 129830, from, tReg + 600);
  if (ms < from || ms > to + 320) return null;
  const tray = ent(tRet, 500);
  const tickets = [
    { t: tReg, stub: "IF", txt: "REGULATORY MILESTONES" },
    { t: tSales, stub: "IF", txt: "SALES MILESTONES" },
    { t: royMs, stub: "%", txt: "SINGLE-DIGIT ROYALTIES" },
  ];
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(lerp(-1600, 0, tray))}translateY(${lerp(400, 0, tray)}px)` }}>
        <div style={{ ...abs(TRAYB.x - 440, TRAYB.y + TRAYB.h / 2 - 8), width: 880, height: 28, borderRadius: "50%", background: "rgba(0,0,0,0.7)", filter: "blur(8px)" }} />
        <Puck x={TRAYB.x} y={TRAYB.y} w={TRAYB.w} h={TRAYB.h} d={120} r="18px 18px 50px 50px" front={G_WHITE} side="#9c9c9c">
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={line(54, COLORS.ink)}>Blackstone</div>
            <Print t={tEl}><div style={label(COLORS.grayText, 32)}>IS ELIGIBLE FOR</div></Print>
          </div>
        </Puck>
      </div>
      {/* the tickets: each drops in on its word and lands on the stack */}
      {tickets.map((tk, i) => {
        if (ms < tk.t - 380) return null;
        const f = clamp01((ms - (tk.t - 380)) / 380);
        const landT = ms >= tk.t ? 1 - sp(tk.t, 7, 230, 0.6) : 0;
        const seat = TRAYB.y - TRAYB.h / 2 - TK.h / 2 - 10 - i * TK.pitch;
        return (
          <div key={i} style={{ ...abs(TRAYB.x - TK.w / 2, seat - TK.h / 2 - 1000 * (1 - f * f)), transformOrigin: "50% 100%",
            transform: `${z(40)}rotate(${lerp(i % 2 ? 14 : -14, 0, f)}deg) scale(${1 + 0.05 * landT}, ${1 - 0.12 * landT})` }}>
            <Ticket stub={tk.stub} txt={tk.txt} />
          </div>
        );
      })}
      {tickets.map((tk, i) => (
        <Scatter key={i} x={TRAYB.x} y={TRAYB.y - TRAYB.h / 2 - 10 - i * TK.pitch} t={tk.t} seed={80 + i} n={5} color="#bdbdbd" zz={50} />
      ))}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S18 (red) — "That agreement only takes effect if the acquisition closes."
// Settled: two dominoes in line (hero) / ONLY IF THE DEAL CLOSES.
// ══════════════════════════════════════════════════════════════════════════
export const DOM = { foot: 880, w: 320, h: 540, d1x: 820, d2x: 1150, d2z: -320 };

export const Dominoes: React.FC<Win & { firstMs: number; only: Cued }> = ({ from, to, firstMs, only }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const tOnly = at(only, 134320, from, firstMs + 600);
  if (ms < from || ms > to + 320) return null;
  const up = (t: number) => (ms >= t ? sp(t, 9, 170) : 0);
  const domino = (x: number, zz: number, p: number, front: string, side: string, txt: string, color: string) => (
    <div style={{ position: "absolute", inset: 0, ...p3, transform: z(zz) || undefined }}>
      <div style={{ ...abs(x - DOM.w / 2 - 20, DOM.foot - 10), width: DOM.w + 40, height: 26, borderRadius: "50%", background: "rgba(80,0,4,0.4)", filter: "blur(8px)", opacity: clamp01(p) }} />
      <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${x}px ${DOM.foot}px`, transform: `rotateX(${lerp(-90, 0, p)}deg)` }}>
        <Puck x={x} y={DOM.foot - DOM.h / 2} w={DOM.w} h={DOM.h} d={90} r={30} front={front} side={side}>
          <div style={{ ...label(color, 40), whiteSpace: "normal", width: DOM.w - 60, textAlign: "center", lineHeight: 1.15 }}>{txt}</div>
        </Puck>
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {ms >= tOnly ? domino(DOM.d2x, DOM.d2z, up(tOnly), G_INK, "#141414", "BLACKSTONE FUNDING TAKES EFFECT", COLORS.paper) : null}
      {ms >= firstMs ? domino(DOM.d1x, 0, up(firstMs), G_WHITE, "#9c9c9c", "ACQUISITION CLOSES", COLORS.ink) : null}
      <div style={{ ...abs(0, 110), width: 1920, display: "flex", justifyContent: "center", transform: z(30) || undefined }}>
        <Print t={tOnly}>{chip("ONLY IF THE DEAL CLOSES", COLORS.paper, COLORS.ink, 40)}</Print>
      </div>
    </AbsoluteFill>
  );
};
