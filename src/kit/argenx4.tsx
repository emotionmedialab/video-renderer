// ─────────────────────────────────────────────────────────────────────────
// KIT · argenx4 — argenx × UNP long-form, chunk 4 (1:20–1:59), 16:9, V2 style, 2026-11-16.
// §5 NOT A FIRST MEETING.
//  · S11 (ink): "NOT A FIRST MEETING" drops in; the §2 calendar page flies in and riffles BACK to JUL 2025; a contract
//    slides out from behind it and two signatures draw ("multi-target research collaboration").
//  · S12 (paper): the ring rides a stage track (Discovery → Preclinical) and stops just short of the "Human trials" gate;
//    argenx's option key flies in and docks in the gate's lock (an option: the gate stays shut).
//  · S13 (red): coins stack up to "UP TO ABOUT $1.5B · 2025 deal" on a "milestones + option payments" plate; a royalty
//    coin springs on; a UNP share certificate takes an "argenx · EQUITY STAKE" stamp.
//  · S14 (ink): target tickets arrive one at a time; a crane lowers and lifts the whole discovery engine (§4).
//  · S15 (paper): the UNP lab springs up; the Santa Cruz pin returns; an "argenx · home for peptide discovery" sign
//    lowers on cables (the pin leaves for it); "Led by UNP" prints on the lab.
// Limits: $1.5B = the 2025 COLLABORATION ceiling (labelled), never the acquisition; equity stake size not disclosed
// (no wedge, no %); the option is not shown exercised.
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, COLORS, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { EASE, fadeOut } from "./plusone";
import { label, line } from "./inovio";
import { Print, Slam } from "./ryb1b";
import { useP3, useZ } from "./camera";
import { KType, Scatter, useDropX, useEnt, useSpringX } from "./v2style";
import { Flask, G_GREY, G_INK, G_STONE, G_WHITE, Puck } from "./argenx1v2b";
import { Ring } from "./argenx3";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });

// ══════════════════════════════════════════════════════════════════════════
// S11 (ink) — "This is not a first meeting. In July 2025, the two companies signed a multi-target research collaboration."
// Settled: the signed contract (hero) / the JUL 2025 page.
// ══════════════════════════════════════════════════════════════════════════
const PG = { x: 640, y: 500, w: 300, h: 290, head: 88 };
const CT = { x: 1220, y: 500, w: 560, h: 360 };
const SIGS = ["M0 30 C20 0 30 50 50 20 S80 40 100 10 S130 30 150 25", "M0 25 C15 40 30 0 55 30 S90 5 110 28 S140 10 160 22"];

export const FirstMeeting: React.FC<Win & { not: Cued; first: Cued; july: Cued; signed: Cued; multi: Cued }> = ({ from, to, not, first, july, signed, multi }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const tNot = at(not, 80680, from);
  const tFirst = at(first, 80990, from, tNot + 200);
  const tJuly = at(july, 82620, from, tFirst + 900);
  const tSigned = at(signed, 84940, from, tJuly + 900);
  const tMulti = at(multi, 85440, from, tSigned + 300);
  if (ms < from || ms > to + 320) return null;
  const typeOut = EASE(k(tJuly - 450, 260)); //       holds ~0.5s after the last letter lands
  const pageIn = ent(tJuly - 380, 420);
  const tRif = tJuly - 220; //                          riffles back, lands on "2025"
  const flips = 5;
  const done = ms >= tRif + flips * 90;
  const ctIn = ent(tSigned - 300, 500);
  const dash = (p: number) => ({ pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p });
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {/* kinetic type */}
      {typeOut < 1 ? (
        <div style={{ ...abs(0, 330), width: 1920, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transform: `${z(30)}translateY(${-700 * typeOut}px)` }}>
          <KType text="NOT A" t={tNot - 300} size={70} color="rgba(255,255,255,0.8)" />
          <KType text="FIRST MEETING" t={tNot - 60} size={150} color={COLORS.paper} />
        </div>
      ) : null}
      {/* the calendar page: flies in, riffles back to JUL 2025 */}
      {ms >= tJuly - 380 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${PG.x}px ${PG.y}px`, transform: `${z(lerp(-2000, 20, pageIn))}rotateZ(${lerp(-25, 0, pageIn)}deg)` }}>
          <Puck x={PG.x} y={PG.y} w={PG.w} h={PG.h} d={26} r={18} front={G_WHITE} side="#9d9d9d" clip>
            <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: PG.head, background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", ...line(52, COLORS.paper) }}>{done ? "JUL" : "NOV"}</div>
            <div style={{ position: "absolute", left: 0, right: 0, top: PG.head, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", ...line(done ? 110 : 150, COLORS.ink) }}>{done ? "2025" : "2026"}</div>
            {Array.from({ length: flips }, (_, i) => {
              const f = EASE(k(tRif + i * 90, 160));
              if (ms < tRif + i * 90 || f >= 1) return null;
              return <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, background: i % 2 ? "#f2f2f2" : "#ffffff", borderTop: "3px solid #d0d0d0",
                backfaceVisibility: "hidden", transformOrigin: "50% 0", transform: `rotateX(${-180 * f}deg)` }} />;
            })}
          </Puck>
        </div>
      ) : null}
      <Scatter x={PG.x} y={PG.y - PG.h / 2} t={tRif + flips * 90} seed={101} n={6} color={COLORS.accent} zz={40} />
      {/* the contract: slides out from behind the page; signatures draw */}
      {ms >= tSigned - 300 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `translate(${lerp(PG.x - CT.x, 0, ctIn)}px, 0px) ${z(lerp(-120, 0, ctIn))}rotateZ(${lerp(8, 0, ctIn)}deg)` }}>
          <Puck x={CT.x} y={CT.y} w={CT.w} h={CT.h} d={20} r={20} front={G_WHITE} side="#9d9d9d">
            <div style={{ position: "absolute", left: 40, top: 34 }}>
              <div style={label("#666", 28)}>MULTI-TARGET</div>
              <div style={line(46, COLORS.ink)}>Research collaboration</div>
            </div>
            {[0, 1].map((i) => (
              <div key={i} style={{ position: "absolute", left: 40 + i * 260, bottom: 40, width: 220 }}>
                <svg width={170} height={56} viewBox="-5 -5 170 56" style={{ display: "block" }}>
                  <path d={SIGS[i]} fill="none" stroke={COLORS.ink} strokeWidth={5} strokeLinecap="round" {...dash(EASE(k(tMulti + i * 420, 400)))} />
                </svg>
                <div style={{ height: 4, background: "#bdbdbd", marginTop: 4 }} />
                <div style={{ ...label("#555", 26), marginTop: 8 }}>{i ? "UNP" : "argenx"}</div>
              </div>
            ))}
          </Puck>
        </div>
      ) : null}
      <Scatter x={CT.x - CT.w / 2 + 120} y={CT.y + CT.h / 2 - 70} t={tMulti + 400} seed={103} n={4} zz={30} />
      <Scatter x={CT.x - CT.w / 2 + 380} y={CT.y + CT.h / 2 - 70} t={tMulti + 820} seed={105} n={4} zz={30} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S12 (paper) — "UNP did the research up to the stage before human trials. argenx held an exclusive option to develop
// and sell whatever came out of it."   Settled: the track with the ring stopped at the gate (hero) / gate / key + tag.
// ══════════════════════════════════════════════════════════════════════════
export const TRK = { y: 660, x0: 220, x1: 1700, stops: [400, 860], gate: 1320, stopAt: 1205 };

export const OptionGate: React.FC<Win & { did: Cued; research: Cued; human: Cued; excl: Cued; option: Cued; develop: Cued }> = ({ from, to, did, research, human, excl, option, develop }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const tDid = at(did, 87900, from);
  const tRes = at(research, 88630, from, tDid + 500);
  const tHum = at(human, 90550, from, tRes + 1200);
  const tOpt = at(option, 93160, from, at(excl, 92490, from, tHum + 600) + 300);
  const tDev = at(develop, 93760, from, tOpt + 300);
  if (ms < from || ms > to + 320) return null;
  const draw = EASE(k(tDid, 600));
  const ride = clamp01((ms - tRes) / 1100);
  const rx = lerp(TRK.x0 + 60, TRK.stopAt, EASE(ride));
  const bump = ride >= 1 ? 1 - sp(tRes + 1100, 6, 220, 0.6) : 0; // the stop: a squash + a little rock
  const gate = sp(tDid + 300, 10, 160);
  const keyIn = ent(tOpt - 420, 420);
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {/* the track */}
      <div style={{ ...abs(TRK.x0, TRK.y - 18), width: (TRK.x1 - TRK.x0) * draw, height: 36, borderRadius: 18, background: "linear-gradient(180deg, #e6e6e6, #bdbdbd)", boxShadow: "inset 0 -4px 0 rgba(0,0,0,0.08)", transform: z(10) || undefined }} />
      {TRK.stops.map((x, i) => (
        <div key={i} style={{ position: "absolute", inset: 0, transform: z(20) || undefined }}>
          <div style={{ ...abs(x - 16, TRK.y - 16), width: 32, height: 32, borderRadius: "50%", background: COLORS.ink, transform: `scale(${sp(tDid + 200 + i * 160, 8, 220)})` }} />
          <div style={{ ...abs(x - 150, TRK.y + 40), width: 300, textAlign: "center" }}><Print t={tDid + 250 + i * 160}><div style={label(COLORS.ink, 36)}>{i ? "Preclinical" : "Discovery"}</div></Print></div>
        </div>
      ))}
      {/* the gate: Human trials (stays shut) */}
      {ms >= tDid + 300 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${TRK.gate}px ${TRK.y + 20}px`, transform: `scaleY(${gate})` }}>
          <Puck x={TRK.gate} y={TRK.y - 120} w={70} h={300} d={50} r={18} front={G_INK} side="#151515" />
          <Puck x={TRK.gate} y={TRK.y - 250} w={110} h={110} d={40} r={22} front={G_GREY} side="#4f4f4f">
            <svg width={30} height={44} viewBox="0 0 30 44"><circle cx={15} cy={13} r={11} fill={COLORS.ink} /><path d="M9 20 L21 20 L18 42 L12 42 Z" fill={COLORS.ink} /></svg>
          </Puck>
        </div>
      ) : null}
      {ms >= tHum ? (
        <div style={{ ...abs(TRK.gate + 60, TRK.y + 40), width: 400, display: "flex", justifyContent: "flex-start", transform: `${z(30)}scale(${sp(tHum, 8, 220)})`, transformOrigin: "0 50%" }}>
          <div style={{ background: COLORS.ink, borderRadius: 30, padding: "10px 24px", ...label(COLORS.paper, 36) }}>Human trials</div>
        </div>
      ) : null}
      {/* the ring: rides the track, stops short of the gate */}
      {ms >= tRes - 200 ? (
        <div style={{ position: "absolute", inset: 0, transform: z(40) || undefined, transformOrigin: `${rx}px ${TRK.y - 18}px` }}>
          <div style={{ position: "absolute", inset: 0, transformOrigin: `${rx}px ${TRK.y - 18}px`, transform: `rotate(${ride * 540 + 10 * bump}deg) scale(${1 + 0.1 * bump}, ${1 - 0.14 * bump})` }}>
            <Ring x={rx} y={TRK.y - 18 - 62} R={50} r={14} col={COLORS.accent} band="#8f0e15" />
          </div>
        </div>
      ) : null}
      <Scatter x={TRK.stopAt + 60} y={TRK.y - 30} t={tRes + 1100} seed={111} n={5} color="#8a8a8a" zz={50} />
      {/* the key: argenx's exclusive option, docks in the gate lock */}
      {ms >= tOpt - 420 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(lerp(-1800, 60, keyIn))}translate(${lerp(400, 0, keyIn)}px, ${lerp(-250, 0, keyIn)}px) rotate(${lerp(-120, 0, keyIn)}deg)`,
          transformOrigin: `${TRK.gate}px ${TRK.y - 250}px` }}>
          <div style={{ ...abs(TRK.gate + 10, TRK.y - 262), width: 150, height: 24, borderRadius: 12, background: "linear-gradient(180deg,#5a5a5a,#1f1f1f)" }} />
          <div style={{ ...abs(TRK.gate + 150, TRK.y - 300), width: 100, height: 100, borderRadius: "50%", border: "20px solid #2b2b2b", boxSizing: "border-box", background: "transparent" }} />
          <div style={{ ...abs(TRK.gate - 150, TRK.y - 440) }}>
            <div style={{ background: G_INK, borderRadius: 18, padding: "12px 22px", boxShadow: "0 10px 16px rgba(0,0,0,0.25)" }}>
              <div style={label(COLORS.paper, 34)}>argenx · exclusive option</div>
              <div style={{ height: 34, overflow: "hidden" }}><Print t={tDev}><div style={label("rgba(255,255,255,0.75)", 28)}>to develop and sell</div></Print></div>
            </div>
          </div>
        </div>
      ) : null}
      <Scatter x={TRK.gate} y={TRK.y - 250} t={tOpt} seed={113} n={6} zz={80} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S13 (red) — "UNP was eligible for up to about $1.5 billion in milestones and option payments, plus royalties. And
// argenx bought an equity stake."   Settled: the coin stack + its plate (hero) / "UP TO ABOUT $1.5B · 2025 deal" / certificate.
// ══════════════════════════════════════════════════════════════════════════
const COIN = { x: 620, base: 790, w: 250, h: 30, n: 14 };

export const CoinStack: React.FC<Win & { upto: Cued; total: Cued; miles: Cued; roy: Cued; and: Cued; bought: Cued }> = ({ from, to, upto, total, miles, roy, and, bought }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const drop = useDropX();
  const tUp = at(upto, 98170, from);
  const tTot = at(total, 98550, from, tUp + 200);
  const tMil = at(miles, 100090, from, tTot + 800);
  const tRoy = at(roy, 102550, from, tMil + 900);
  const tAnd = at(and, 103710, from, tRoy + 500);
  const tBought = at(bought, 104170, from, tAnd + 300);
  if (ms < from || ms > to + 320) return null;
  const roySp = sp(tRoy - 200, 8, 200);
  const cert = ent(tAnd - 200, 500);
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 55% at 45% 45%, rgba(255,255,255,0.16), rgba(255,255,255,0) 70%)" }} />
      {/* the plate */}
      <Puck x={COIN.x} y={COIN.base + 32} w={500} h={64} d={50} r={32} front={G_INK} side="#151515" style={{ transform: `translateY(${(1 - sp(tUp - 300, 10, 170)) * 400}px)` }}>
        <div style={{ height: 36, overflow: "hidden" }}><Print t={tMil}><div style={label(COLORS.paper, 30)}>milestones + option payments</div></Print></div>
      </Puck>
      {/* coins: fall one by one, overlapping, each squashes */}
      {Array.from({ length: COIN.n }, (_, i) => {
        const t0 = tUp + i * 70;
        const d = drop(t0, 900, 280);
        if (!d.on) return null;
        const y = COIN.base - COIN.h / 2 - i * (COIN.h - 4);
        return (
          <div key={i} style={{ ...abs(COIN.x - COIN.w / 2 + ((i * 37) % 9) - 4, y - COIN.h / 2), width: COIN.w, height: COIN.h, borderRadius: COIN.h / 2,
            background: "linear-gradient(180deg, #ffffff 0%, #e4e4e4 50%, #b5b5b5 100%)", boxShadow: "0 4px 6px rgba(90,0,0,0.25), inset 0 -4px 0 rgba(0,0,0,0.08)",
            transformOrigin: "50% 100%", transform: `${z(30)}translateY(${d.dy}px) scale(${d.sx}, ${d.sy})` }} />
        );
      })}
      <Scatter x={COIN.x} y={COIN.base - COIN.n * (COIN.h - 4)} t={tUp + (COIN.n - 1) * 70 + 280} seed={121} n={6} zz={40} />
      {/* royalty coin */}
      {ms >= tRoy - 200 ? (
        <div style={{ ...abs(COIN.x + COIN.w / 2 + 40, COIN.base - 160), display: "flex", alignItems: "center", gap: 18, transform: `${z(40)}scale(${roySp})`, transformOrigin: "0 50%" }}>
          <div style={{ width: 110, height: 110, borderRadius: "50%", background: "radial-gradient(circle at 34% 30%, #ffffff, #dcdcdc 60%, #a9a9a9)", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 10px 16px rgba(90,0,0,0.3)", ...line(56, COLORS.accent) }}>%</div>
          <div style={label(COLORS.paper, 36)}>+ royalties</div>
        </div>
      ) : null}
      {/* the total */}
      {ms >= tTot ? (
        <div style={{ ...abs(1020, 230), transform: z(40) || undefined }}>
          <div style={{ display: "inline-block", background: COLORS.ink, borderRadius: 26, padding: "8px 20px", ...label(COLORS.paper, 30), transform: `scale(${sp(tTot, 8, 220)})`, transformOrigin: "0 50%" }}>2025 deal</div>
          <KType text="UP TO ABOUT" t={tTot - 100} size={44} color="rgba(255,255,255,0.85)" />
          <KType text="$1.5B" t={tTot + 100} size={170} color={COLORS.paper} shadow="8px 8px 0 #9e0f17" />
        </div>
      ) : null}
      {/* the certificate + equity stamp */}
      {ms >= tAnd - 200 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(lerp(-1600, 0, cert))}translateX(${lerp(500, 0, cert)}px) rotate(${lerp(20, 0, cert)}deg)`, transformOrigin: "1400px 720px" }}>
          <Puck x={1400} y={720} w={420} h={250} d={20} r={18} front={G_WHITE} side="#9d9d9d">
            <div style={{ position: "absolute", left: 30, top: 26, ...label(COLORS.ink, 34) }}>UNP shares</div>
            {[0, 1].map((r) => <div key={r} style={{ position: "absolute", left: 30, top: 84 + r * 28, width: [280, 220][r], height: 10, borderRadius: 5, background: "#d4d4d4" }} />)}
            <div style={{ position: "absolute", right: 20, bottom: 20 }}>
              <Slam t={tBought}>
                <div style={{ border: `6px solid ${COLORS.accent}`, borderRadius: 14, padding: "6px 16px", textAlign: "center" }}>
                  <div style={label(COLORS.accent, 24)}>argenx</div>
                  <div style={line(36, COLORS.accent)}>EQUITY STAKE</div>
                </div>
              </Slam>
            </div>
          </Puck>
        </div>
      ) : null}
      <Scatter x={1480} y={790} t={tBought + 150} seed={123} n={6} color={COLORS.accent} zz={30} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S14 (ink) — "Now, instead of paying target by target, argenx is buying the whole discovery engine."
// Settled: the engine on the crane (hero) / the target tickets / "THE WHOLE DISCOVERY ENGINE".
// ══════════════════════════════════════════════════════════════════════════
const TIX = [{ x: 330, y: 380 }, { x: 330, y: 560 }, { x: 330, y: 740 }];
export const ENG = { x: 1150, base: 780 };

const MiniEngine: React.FC = () => (
  <>
    <Puck x={ENG.x} y={ENG.base} w={760} h={34} d={50} r={17} front={G_GREY} side="#444" />
    <Puck x={ENG.x - 200} y={ENG.base - 130} w={300} h={210} d={40} r={22} front={G_WHITE} side="#9d9d9d">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 30px)", gap: 14 }}>
        {Array.from({ length: 15 }, (_, i) => <div key={i} style={{ width: 30, height: 30, borderRadius: "50%", background: i % 4 === 1 ? "#6b6b6b" : "#2b2b2b" }} />)}
      </div>
    </Puck>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {[[0, -1], [0, 0], [0, 1]].flatMap(([, a]) => [-1, 0, 1].map((b) => (
        <line key={`${a}${b}`} x1={ENG.x + 140} y1={ENG.base - 130 + a * 62} x2={ENG.x + 260} y2={ENG.base - 130 + b * 62} stroke="#9a9a9a" strokeWidth={4} />
      )))}
      {[-1, 0, 1].map((a) => <circle key={`l${a}`} cx={ENG.x + 140} cy={ENG.base - 130 + a * 62} r={20} fill="#f2f2f2" />)}
      {[-1, 0, 1].map((a) => <circle key={`r${a}`} cx={ENG.x + 260} cy={ENG.base - 130 + a * 62} r={20} fill="#f2f2f2" />)}
    </svg>
    <Ring x={ENG.x + 30} y={ENG.base - 330} R={62} r={16} col={COLORS.accent} band="#8f0e15" />
  </>
);

export const WholeEngine: React.FC<Win & { paying: Cued; t1: Cued; t2: Cued; argenx: Cued; buying: Cued }> = ({ from, to, paying, t1, t2, argenx, buying }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const tTix = [at(paying, 106930, from), at(t1, 107370, from), at(t2, 108000, from)];
  const tEng = at(argenx, 108789, from, tTix[2] + 300);
  const tBuy = at(buying, 109240, from, tEng + 300);
  if (ms < from || ms > to + 320) return null;
  const engIn = ent(tEng - 300, 450);
  const hook = EASE(k(tBuy - 400, 400)); //               the hook comes down…
  const lift = sp(tBuy + 50, 9, 120); //                   …and lifts the engine (springy)
  const liftY = -170 * lift;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {/* target tickets */}
      {TIX.map((t, i) => {
        if (ms < tTix[i] - 250) return null;
        const f = ent(tTix[i] - 250, 400);
        return (
          <div key={i} style={{ position: "absolute", inset: 0, ...p3, transform: `${z(lerp(-1400, 20, f))}translateX(${lerp(-400, 0, f)}px) rotate(${lerp(-30, 0, f)}deg)`, transformOrigin: `${t.x}px ${t.y}px` }}>
            <Puck x={t.x} y={t.y} w={290} h={130} d={18} r={20} front={G_WHITE} side="#8a8a8a">
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", border: "10px solid #8a8a8a", boxSizing: "border-box" }} />
                <div style={label(COLORS.ink, 40)}>target</div>
              </div>
            </Puck>
          </div>
        );
      })}
      {/* the engine + the crane */}
      {ms >= tEng - 300 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(lerp(-2000, 0, engIn))}translateY(${liftY}px)` }}>
          <MiniEngine />
        </div>
      ) : null}
      {ms >= tBuy - 400 ? (
        <div style={{ position: "absolute", inset: 0, transform: `${z(60)}translateY(${lerp(-900, 0, hook) + liftY}px)` }}>
          <div style={{ ...abs(ENG.x - 5, -1200), width: 10, height: 1200 + ENG.base - 470, background: "#9a9a9a" }} />
          <div style={{ ...abs(ENG.x - 90, ENG.base - 470), width: 180, height: 56, borderRadius: 16, background: G_INK, display: "flex", alignItems: "center", justifyContent: "center", ...label(COLORS.paper, 30) }}>argenx</div>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <path d={`M${ENG.x - 70} ${ENG.base - 414} L${ENG.x - 370} ${ENG.base - 20} M${ENG.x + 70} ${ENG.base - 414} L${ENG.x + 370} ${ENG.base - 20}`} stroke="#9a9a9a" strokeWidth={6} />
          </svg>
        </div>
      ) : null}
      {/* the line */}
      {ms >= tBuy + 300 ? (
        <div style={{ ...abs(150, 120), transform: z(50) || undefined }}>
          <KType text="THE WHOLE" t={tBuy + 300} size={48} color="rgba(255,255,255,0.8)" />
          <KType text="DISCOVERY ENGINE" t={tBuy + 600} size={82} color={COLORS.paper} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S15 (paper) — "UNP's team stays in Santa Cruz, which becomes argenx's home for peptide discovery, and UNP keeps
// leading that work."   Settled: the lab (hero, with its "Led by UNP" line) / the argenx sign / (pin, until the sign).
// ══════════════════════════════════════════════════════════════════════════
const HL = { x: 960, base: 840, w: 600, h: 270, dome: 140 };
const HL_TOP = HL.base - HL.h;
const HL_DOME = HL_TOP - HL.dome;

export const HomeLab: React.FC<Win & { stays: Cued; santa: Cued; becomes: Cued; home: Cued; keeps: Cued }> = ({ from, to, stays, santa, becomes, home, keeps }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const drop = useDropX();
  const tStay = at(stays, 112370, from);
  const tSanta = at(santa, 113280, from, tStay + 600);
  const tBec = at(becomes, 114050, from, tSanta + 500);
  const tHome = at(home, 115200, from, tBec + 600);
  const tKeep = at(keeps, 117170, from, tHome + 800);
  if (ms < from || ms > to + 320) return null;
  const rise = sp(tStay - 400, 9, 150);
  const pin = drop(tSanta - 380, 700, 380);
  const pinOut = EASE(k(tBec, 300));
  const sign = drop(tHome - 420, 900, 420);
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={{ ...abs(380, HL.base + 6), width: 1160, height: 26, borderRadius: "50%", background: "rgba(0,0,0,0.12)", filter: "blur(8px)" }} />
      {/* the lab springs up out of the ground */}
      <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${HL.x}px ${HL.base}px`, transform: `translateY(${(1 - rise) * 700}px) scaleY(${lerp(0.6, 1, Math.min(1, rise))})` }}>
        <Puck x={HL.x} y={HL_TOP - HL.dome / 2 + 1} w={HL.dome * 2} h={HL.dome} d={70} r={`${HL.dome}px ${HL.dome}px 0 0`} front={G_STONE} side="#b0b0b0">
          <div style={{ marginTop: 34 }}><Flask /></div>
        </Puck>
        <Puck x={HL.x} y={HL.base - HL.h / 2} w={HL.w} h={HL.h} d={90} r={26} front={G_STONE} side="#b0b0b0">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={line(104, COLORS.ink)}>UNP</div>
            <div style={label("#555", 34)}>Santa Cruz team</div>
            <div style={{ height: 50, marginTop: 6 }}>
              {ms >= tKeep ? <div style={{ background: COLORS.ink, borderRadius: 26, padding: "8px 22px", ...label(COLORS.paper, 32), transform: `scale(${sp(tKeep, 8, 220)})` }}>Led by UNP</div> : null}
            </div>
          </div>
        </Puck>
      </div>
      {/* the pin (returns from §2), leaves for the sign */}
      {pin.on && pinOut < 1 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(40)}translateY(${pin.dy - 600 * pinOut}px)` }}>
          <div style={{ ...abs(HL.x - 4, HL_DOME - 110), width: 8, height: 112, background: COLORS.ink }} />
          <div style={{ ...abs(HL.x - 34, HL_DOME - 170), width: 68, height: 68, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #ff7a80, ${COLORS.accent} 60%)`,
            transformOrigin: "50% 100%", transform: `scale(${pin.sx}, ${pin.sy})` }} />
          <div style={{ ...abs(HL.x + 56, HL_DOME - 172) }}>
            <Print t={tSanta + 150}><div style={{ background: COLORS.ink, borderRadius: 30, padding: "12px 24px", ...label(COLORS.paper, 34) }}>Santa Cruz, California</div></Print>
          </div>
        </div>
      ) : null}
      <Scatter x={HL.x} y={HL_DOME} t={tSanta} seed={131} color={COLORS.accent} zz={50} />
      {/* the argenx sign: lowers on two cables and settles above the dome */}
      {sign.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(60)}translateY(${sign.dy}px)` }}>
          {[-260, 260].map((dx) => <div key={dx} style={{ ...abs(HL.x + dx - 3, -900), width: 6, height: 900 + 200, background: "#9a9a9a" }} />)}
          <div style={{ ...abs(HL.x - 380, 200), width: 760, height: 120, borderRadius: 60, background: G_INK, display: "flex", alignItems: "center", justifyContent: "center", gap: 18,
            boxShadow: "0 16px 26px rgba(0,0,0,0.3)", transformOrigin: "50% 0", transform: `scale(${sign.sx}, ${sign.sy})` }}>
            <div style={line(56, COLORS.paper)}>argenx</div>
            <div style={label("rgba(255,255,255,0.8)", 34)}>· home for peptide discovery</div>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
