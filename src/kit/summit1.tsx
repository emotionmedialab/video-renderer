// ─────────────────────────────────────────────────────────────────────────
// KIT · summit1 — Summit ivonescimab CRL long-form, chunk 1 (0:00–0:38, "The letter"). V2 house style
// (MOTION-RULES §0): rounded solids (`Puck`), lit gradients, kinetic type, springs that stop, vanishing scatter.
//  S1 BarSet     (ink)   — the FDA's high-jump stand; the bar is set, the vial waits, the bar springs to the
//                          high pegs and turns red on "statistically significant"; its tag swings down.
//  S2 Letter     (paper) — an envelope tumbles in, the flap hinges open, the letter slides out restating the
//                          bar ("same thing again"); NOT APPROVED slams on the envelope.
//  S3 Combo      (ink)   — COMPLETE RESPONSE LETTER as kinetic type; vial drops, red "+" pops, the platinum
//                          chemo bag swings in on its hook.
//  S4 Binder     (paper) — the application binder falls; three index tabs flip out on their hinges.
//  S5 DateCoin   (red)   — a coin rolls in and stops; NOV 14 drops onto its face.
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, COLORS, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { EASE, fadeOut } from "./plusone";
import { label, line } from "./inovio";
import { Print, Slam } from "./ryb1b";
import { useP3, useZ } from "./camera";
import { Scatter, useDropX, useEnt, useSpringX } from "./v2style";
import { G_GREY, G_INK, G_STONE, G_WHITE, Puck } from "./argenx1v2b";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });
export const G_RED = "linear-gradient(155deg, #ff6a71 0%, #F4212D 55%, #b5121b 100%)";
const G_GLASS = "linear-gradient(155deg, #ffffff 0%, #e9eef0 45%, #b9c2c6 100%)";
export const shadow = (x: number, y: number, w: number, o = 0.35): React.CSSProperties => ({
  ...abs(x - w / 2, y - 12), width: w, height: 24, borderRadius: "50%", background: `rgba(0,0,0,${o})`, filter: "blur(8px)",
});

/** a word as ONE solid piece (Nel 2026-11-19: "do not use this kind of text motion" — no per-letter drops):
 *  it swings up from a tilted, shrunken pose (rotateX hinge + scale from depth), overshoots once and settles */
export const WType: React.FC<{ text: string; t: number; size: number; color: string }> = ({ text, t, size, color }) => {
  const ms = useMs();
  const sp = useSpringX();
  if (ms < t) return <div style={{ ...line(size, color), visibility: "hidden" }}>{text}</div>;
  const p = sp(t, 11, 170);
  return (
    <div style={{ ...line(size, color), transformOrigin: "50% 100%", opacity: clamp01(p * 3),
      transform: `perspective(1200px) translateY(${lerp(size * 0.9, 0, Math.min(1, p))}px) rotateX(${lerp(-75, 0, p)}deg) scale(${lerp(0.55, 1, p)})` }}>{text}</div>
  );
};

// ── the drug vial: cap, neck, glass body with a printed label and grey liquid (centre x, bottom y) ──
export const Vial: React.FC<{ x: number; base: number; name?: string; s?: number }> = ({ x, base, name = "ivonescimab", s = 1 }) => (
  <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transformOrigin: `${x}px ${base}px`, transform: s !== 1 ? `scale(${s})` : undefined }}>
    <Puck x={x} y={base - 115} w={200} h={230} d={60} r={36} front={G_GLASS} side="#8d979b" clip>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 92, background: "linear-gradient(180deg, #a8a8a8, #6e6e6e)" }} />
      <div style={{ position: "absolute", left: 14, right: 14, top: 62, height: 58, borderRadius: 10, background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 2px 0 rgba(0,0,0,0.12)" }}>
        <div style={label(COLORS.ink, 26)}>{name}</div>
      </div>
    </Puck>
    <Puck x={x} y={base - 248} w={92} h={40} d={44} r={10} front={G_GLASS} side="#8d979b" />
    <Puck x={x} y={base - 290} w={130} h={50} d={56} r={14} front={G_GREY} side="#5a5a5a" />
  </div>
);

// ══════════════════════════════════════════════════════════════════════════
// S1 (ink) — "In May 2025, the FDA told Summit … what it would take to approve ivonescimab … a statistically
// significant overall survival benefit."   Settled: the stand + red bar (hero) / vial / survival tag.
// ══════════════════════════════════════════════════════════════════════════
export const BAR = { floor: 800, slabH: 46, postX: [600, 1320] as const, postW: 46, postTop: 200, low: 470, high: 270, barW: 760, barH: 40, vialX: 960 };

export const BarSet: React.FC<Win & { may: Cued; fda: Cued; take: Cued; approve: Cued; leave: Cued; stat: Cued; overall: Cued }> = ({
  from, to, may, fda, take, approve, leave, stat, overall,
}) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const drop = useDropX();
  const tMay = at(may, 160, from);
  const tFda = at(fda, 1930, from);
  const tTake = at(take, 4430, from, tFda + 600);
  const tApp = at(approve, 5400, from, tTake + 500);
  const tLeave = at(leave, 6200, from, tApp + 500);
  const tStat = at(stat, 8660, from, tLeave + 800);
  const tOv = at(overall, 10190, from, tStat + 900);
  if (ms < from || ms > to + 320) return null;

  const stand = drop(tFda - 380, 900, 380);
  const bar0 = drop(tTake - 380, 700, 380);
  const vialP = ent(tApp - 450, 450);
  const dateOut = EASE(k(tLeave, 320));
  const rise = ms < tStat - 300 ? 0 : sp(tStat - 300, 9, 170); //   overshoots above the high pegs once, settles
  const hot = ms >= tStat ? 1 : 0;
  const barY = lerp(BAR.low, BAR.high, rise);
  const tag = ms < tOv ? 0 : sp(tOv, 8, 160);
  const postH = BAR.floor - BAR.slabH / 2 - BAR.postTop;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {/* the date: kinetic type, retires up once the drug is named */}
      {dateOut < 1 ? (
        <div style={{ ...abs(0, 110), width: 1920, display: "flex", justifyContent: "center", transform: `${z(40)}translateY(${-500 * dateOut * dateOut}px)` }}>
          <WType text="MAY 2025" t={tMay - 120} size={120} color={COLORS.paper} />
        </div>
      ) : null}

      {/* the stand: slab + two posts, falls and squashes as one */}
      {stand.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `960px ${BAR.floor}px`, transform: `translateY(${stand.dy}px) scale(${stand.sx}, ${stand.sy})` }}>
          <div style={shadow(960, BAR.floor + 30, 1000)} />
          <Puck x={960} y={BAR.floor} w={1000} h={BAR.slabH} d={90} r={23} front={G_STONE} side="#8f8f8f">
            <div style={label(COLORS.ink, 30)}>FDA</div>
          </Puck>
          {BAR.postX.map((x) => (
            <Puck key={x} x={x} y={BAR.postTop + postH / 2} w={BAR.postW} h={postH} d={46} r={23} front={G_WHITE} side="#9a9a9a" />
          ))}
          {/* the two peg heights */}
          {BAR.postX.flatMap((x) => [BAR.low, BAR.high].map((y) => (
            <Puck key={`${x}-${y}`} x={x + (x < 960 ? 34 : -34)} y={y + BAR.barH / 2 + 8} w={30} h={16} d={30} r={8} front={G_GREY} side="#5a5a5a" />
          )))}
        </div>
      ) : null}
      <Scatter x={960} y={BAR.floor - BAR.slabH / 2} t={tFda} seed={2} n={8} color="#bdbdbd" zz={50} />

      {/* the vial flies in from depth onto the slab, between the posts */}
      {ms >= tApp - 450 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(lerp(-2200, 20, vialP))}translateY(${lerp(-200, 0, vialP)}px)` }}>
          <div style={shadow(BAR.vialX, BAR.floor - BAR.slabH / 2 + 4, 220, 0.4)} />
          <Vial x={BAR.vialX} base={BAR.floor - BAR.slabH / 2} s={0.78} />
        </div>
      ) : null}

      {/* the bar: dropped onto the low pegs, then springs to the high pegs and turns red */}
      {bar0.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${bar0.dy}px)` }}>
          <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `960px ${barY}px`, transform: `scale(${bar0.sx}, ${bar0.sy})` }}>
            <Puck x={960} y={barY} w={BAR.barW} h={BAR.barH} d={40} r={20} front={hot ? G_RED : G_WHITE} side={hot ? "#8f0e15" : "#9a9a9a"} />
            {/* the tag hangs from the bar on two short cords and swings down on "overall survival" */}
            {tag > 0 ? (
              <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `960px ${barY + BAR.barH / 2}px`, transform: `${z(24)}rotateX(${lerp(-88, 0, tag)}deg)` }}>
                {[-150, 150].map((dx) => (
                  <div key={dx} style={{ ...abs(960 + dx - 3, barY + BAR.barH / 2), width: 6, height: 26, background: "#d9d9d9" }} />
                ))}
                <div style={{ ...abs(960 - 290, barY + BAR.barH / 2 + 24), width: 580, height: 132, borderRadius: 22, background: G_WHITE, display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 4, boxShadow: "0 14px 24px rgba(0,0,0,0.4)" }}>
                  <div style={line(46, COLORS.ink)}>Statistically significant</div>
                  <div style={line(46, COLORS.ink)}>overall survival</div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
      <Scatter x={960} y={BAR.high} t={tStat} seed={4} color={COLORS.accent} zz={40} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S2 (paper) — "On November 15th, it said the same thing again, this time in a rejection letter."
// Settled: the letter restating the bar (hero) / envelope + postmark / NOT APPROVED stamp.
// ══════════════════════════════════════════════════════════════════════════
export const ENV = { x: 960, y: 600, w: 700, h: 400, d: 26, letterW: 620, letterH: 400, letterTop: 130 };

export const Letter: React.FC<Win & { nov: Cued; fifteenth: Cued; same: Cued; rejection: Cued }> = ({ from, to, nov, fifteenth, same, rejection }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const tNov = at(nov, 12520, from);
  const tFif = at(fifteenth, 13170, from, tNov + 300);
  const tSame = at(same, 14700, from, tFif + 600);
  const tRej = at(rejection, 16880, from, tSame + 900);
  if (ms < from || ms > to + 320) return null;

  const fly = ent(tNov - 200, 700);
  const flap = EASE(k(tSame, 420));
  const out = ent(tSame + 260, 600); //                   the letter slides up out of the envelope
  const top0 = ENV.y - ENV.h / 2 + 30; //                 letter's top while inside
  const letterTop = lerp(top0, ENV.letterTop, out);
  const envTop = ENV.y - ENV.h / 2;
  const tri = (pts: string, bg: string, extra: string): React.CSSProperties => ({
    ...abs(ENV.x - ENV.w / 2, envTop), width: ENV.w, height: ENV.h * 0.55, background: bg, clipPath: `polygon(${pts})`, backfaceVisibility: "hidden", transform: extra,
  });
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${ENV.x}px ${ENV.y}px`,
        transform: `${z(lerp(-2600, 0, fly))}rotateY(${lerp(240, 0, fly)}deg) translateY(${lerp(-260, 0, fly)}px)` }}>
        <div style={shadow(ENV.x, ENV.y + ENV.h / 2 + 18, ENV.w * 0.9, 0.22)} />
        {/* the letter, inside the envelope (between its back and front) */}
        {ms >= tSame ? (
          <div style={{ position: "absolute", inset: 0, ...p3 }}>
            <Puck x={ENV.x} y={letterTop + ENV.letterH / 2} w={ENV.letterW} h={ENV.letterH} d={6} r={12} front="linear-gradient(180deg,#ffffff,#f3f3f3)" side="#d8d8d8">
              <div style={{ position: "absolute", left: 0, right: 0, top: 26, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={label("#7a7a7a", 26)}>AGAIN, THE FDA REQUIRES</div>
                <div style={line(46, COLORS.ink)}>Statistically significant</div>
                <div style={line(46, COLORS.ink)}>overall survival</div>
                <div style={{ width: 320, height: 14, borderRadius: 7, background: G_RED, marginTop: 10 }} />
              </div>
            </Puck>
          </div>
        ) : null}
        {/* envelope body (front face at +d/2) */}
        <Puck x={ENV.x} y={ENV.y} w={ENV.w} h={ENV.h} d={ENV.d} r={20} front="linear-gradient(155deg,#f7f7f7 0%,#e4e4e4 55%,#c9c9c9 100%)" side="#a3a3a3">
          <div style={{ position: "absolute", right: 46, top: 108, width: 128, height: 128, borderRadius: "50%", border: "6px solid #6b6b6b", boxSizing: "border-box",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: ms >= tFif ? 1 : 0 }}>
            <Slam t={tFif}><div style={{ textAlign: "center" }}><div style={label("#6b6b6b", 24)}>NOV</div><div style={line(48, "#6b6b6b")}>15</div></div></Slam>
          </div>
        </Puck>
        {/* the flap: hinged on the top edge, swings up and over */}
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${ENV.x}px ${envTop}px`,
          // closed it folds over the FRONT; past upright (edge-on, no visible jump) its hinge is the BACK panel, behind the letter
          transform: `${z(flap < 0.5 ? ENV.d / 2 + 2 : -ENV.d / 2 - 4)}rotateX(${-178 * flap}deg)` }}>
          <div style={tri("0 0, 100% 0, 50% 100%", "linear-gradient(180deg,#d9d9d9,#bdbdbd)", "")} />
          {/* inside face: same shape, facing back (rotateY keeps the symmetric triangle), so after the flip it stands above the edge */}
          <div style={tri("0 0, 100% 0, 50% 100%", "#cfcfcf", "rotateY(180deg)")} />
        </div>
        {/* NOT APPROVED: slams straight onto the envelope front */}
        {/* seated below the postmark (postmark ends y≈638, stamp starts y≈690) and centred on the envelope */}
        <div style={{ ...abs(ENV.x - 300, ENV.y + 70), width: 600, display: "flex", justifyContent: "center", transform: z(ENV.d / 2 + 8) || undefined }}>
          <Slam t={tRej}>
            <div style={{ background: G_RED, borderRadius: 24, padding: "16px 34px", boxShadow: "0 10px 18px rgba(0,0,0,0.25)" }}>
              <div style={line(62, COLORS.paper)}>NOT APPROVED</div>
            </div>
          </Slam>
        </div>
      </div>
      <Scatter x={ENV.x} y={ENV.y + 140} t={tRej + 200} seed={6} color={COLORS.accent} zz={30} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S3 (ink) — "Summit announced that the FDA has issued a complete response letter for ivonescimab plus platinum
// chemotherapy."   Settled: the combination vial + bag (hero) / title / the red plus.
// ══════════════════════════════════════════════════════════════════════════
export const COMBO = { floor: 820, vialX: 650, plusX: 960, plusY: 640, bagX: 1270, hookY: 250, bagTop: 360, bagW: 260, bagH: 330 };

export const Combo: React.FC<Win & { issued: Cued; ivo: Cued; plus: Cued; platinum: Cued }> = ({ from, to, issued, ivo, plus, platinum }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const drop = useDropX();
  const tIss = at(issued, 19980, from);
  const tIvo = at(ivo, 22120, from, tIss + 1400);
  const tPlus = at(plus, 22880, from, tIvo + 500);
  const tPlat = at(platinum, 23080, from, tPlus + 200);
  if (ms < from || ms > to + 320) return null;

  const vial = drop(tIvo - 380, 900, 380);
  const plusP = ms < tPlus ? 0 : sp(tPlus, 9, 220);
  // the bag drops in on its cord from above the frame, then swings once and hangs still
  const swing = ms < tPlat - 250 ? -1 : sp(tPlat - 250, 12, 170);
  const bagY = swing < 0 ? -900 : lerp(-900, 0, Math.min(1, swing));
  const bagRot = swing < 0 ? 0 : 28 * (1 - sp(tPlat - 250, 6, 110, 0.8));
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={{ ...abs(0, 120), width: 1920, display: "flex", justifyContent: "center", transform: z(30) || undefined }}>
        <WType text="COMPLETE RESPONSE LETTER" t={tIss} size={86} color={COLORS.paper} />
      </div>
      {/* the vial drops and squashes */}
      {vial.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${COMBO.vialX}px ${COMBO.floor}px`, transform: `translateY(${vial.dy}px) scale(${vial.sx}, ${vial.sy})` }}>
          <div style={shadow(COMBO.vialX, COMBO.floor + 6, 240, 0.5)} />
          <Vial x={COMBO.vialX} base={COMBO.floor} />
        </div>
      ) : null}
      <Scatter x={COMBO.vialX} y={COMBO.floor} t={tIvo} seed={8} color="#9a9a9a" zz={30} />
      {/* the plus: pops from depth, the one red */}
      {plusP > 0 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(lerp(-900, 30, Math.min(1, plusP)))}` }}>
          <div style={{ ...abs(COMBO.plusX - 70, COMBO.plusY - 70), width: 140, height: 140, transform: `scale(${plusP}) rotate(${lerp(-90, 0, Math.min(1, plusP))}deg)` }}>
            <div style={{ ...abs(0, 50), width: 140, height: 40, borderRadius: 20, background: G_RED }} />
            <div style={{ ...abs(50, 0), width: 40, height: 140, borderRadius: 20, background: G_RED }} />
          </div>
        </div>
      ) : null}
      {/* the chemo bag: swings in on its hook from above-left, overshoots once, hangs still */}
      {swing > -1 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(10)}translateY(${bagY}px)` }}>
          {/* the IV pole: foot on the floor, a short arm out to the hook (nothing crosses the title above) */}
          <Puck x={COMBO.bagX + 180} y={(COMBO.hookY - 14 + COMBO.floor) / 2} w={20} h={COMBO.floor - COMBO.hookY + 14} d={20} r={10} front={G_GREY} side="#5a5a5a" />
          <Puck x={COMBO.bagX + 90} y={COMBO.hookY - 4} w={200} h={16} d={16} r={8} front={G_GREY} side="#5a5a5a" />
          <Puck x={COMBO.bagX + 180} y={COMBO.floor - 10} w={170} h={22} d={60} r={11} front={G_GREY} side="#4a4a4a" />
          <div style={shadow(COMBO.bagX + 180, COMBO.floor + 8, 200, 0.5)} />
          <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${COMBO.bagX}px ${COMBO.hookY}px`, transform: `rotateZ(${bagRot}deg)` }}>
          <div style={{ ...abs(COMBO.bagX - 4, COMBO.hookY), width: 8, height: COMBO.bagTop - COMBO.hookY + 10, background: "#bdbdbd", borderRadius: 4 }} />
          <div style={{ ...abs(COMBO.bagX - 26, COMBO.hookY - 26), width: 52, height: 52, borderRadius: "50%", border: "8px solid #d0d0d0", boxSizing: "border-box" }} />
          <Puck x={COMBO.bagX} y={COMBO.bagTop + COMBO.bagH / 2} w={COMBO.bagW} h={COMBO.bagH} d={50} r="44px 44px 70px 70px" front={G_GLASS} side="#8d979b" clip>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 150, background: "linear-gradient(180deg, #b3b3b3, #7a7a7a)" }} />
            <div style={{ position: "absolute", left: 18, right: 18, top: 70, height: 96, borderRadius: 12, background: "#ffffff", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center" }}>
              <div style={label(COLORS.ink, 28)}>Platinum</div>
              <div style={label(COLORS.ink, 28)}>chemo</div>
            </div>
          </Puck>
          <div style={{ ...abs(COMBO.bagX - 8, COMBO.bagTop + COMBO.bagH - 4), width: 16, height: 110, borderRadius: 8, background: "#c9c9c9", transform: z(20) || undefined }} />
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S4 (paper) — "The application covered advanced non-small cell lung cancer with an EGFR mutation, in patients
// already treated with an EGFR-targeted drug."   Settled: binder (hero) / the tab list (3 rows, one page).
// ══════════════════════════════════════════════════════════════════════════
export const BIND = { x: 560, y: 520, w: 380, h: 560, d: 70, tabX: 760, rows: [330, 500, 670], tabH: 116 };
const TABS = ["Advanced non-small cell lung cancer", "With an EGFR mutation", "Already treated with an EGFR-targeted drug"];

export const Binder: React.FC<Win & { app: Cued; t1: Cued; t2: Cued; t3: Cued }> = ({ from, to, app, t1, t2, t3 }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const drop = useDropX();
  const tApp = at(app, 25330, from);
  const tT = [at(t1, 26680, from, tApp + 700), at(t2, 29470, from), at(t3, 31250, from)];
  if (ms < from || ms > to + 320) return null;

  const b = drop(tApp - 200, 1000, 380);
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {/* index tabs: each hinges out of the binder's right edge (rotateY 90 → 0) with one overshoot */}
      {TABS.map((txt, i) => {
        if (ms < tT[i]) return null;
        const p = sp(tT[i], 8, 170);
        const last = i === TABS.length - 1;
        return (
          <div key={i} style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${BIND.tabX}px ${BIND.rows[i]}px`, transform: `${z(-10)}rotateY(${lerp(92, 0, p)}deg)` }}>
            <Puck x={BIND.tabX + 470} y={BIND.rows[i]} w={940} h={BIND.tabH} d={24} r="0 58px 58px 0" front={last ? G_RED : G_INK} side={last ? "#8f0e15" : "#1c1c1c"}>
              <div style={{ ...line(44, COLORS.paper), paddingLeft: 30 }}>{txt}</div>
            </Puck>
          </div>
        );
      })}
      {/* the binder: drops, squashes */}
      {b.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${BIND.x}px ${BIND.y + BIND.h / 2}px`, transform: `translateY(${b.dy}px) scale(${b.sx}, ${b.sy})` }}>
          <div style={shadow(BIND.x, BIND.y + BIND.h / 2 + 14, BIND.w, 0.25)} />
          <Puck x={BIND.x} y={BIND.y} w={BIND.w} h={BIND.h} d={BIND.d} r={26} front={G_INK} side="#111">
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 70, background: "linear-gradient(90deg,#1a1a1a,#2c2c2c)", borderRadius: "26px 0 0 26px" }} />
            {[0.28, 0.5, 0.72].map((f) => (
              <div key={f} style={{ ...abs(22, BIND.h * f - 18), width: 26, height: 36, borderRadius: 13, background: G_GREY }} />
            ))}
            <div style={{ marginLeft: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={label("rgba(255,255,255,0.7)", 28)}>SUMMIT'S</div>
              <div style={line(58, COLORS.paper)}>Application</div>
            </div>
          </Puck>
        </div>
      ) : null}
      <Scatter x={BIND.x} y={BIND.y + BIND.h / 2} t={tApp + 180} seed={10} color="#9a9a9a" zz={40} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S5 (red) — "The FDA's decision date had been November 14th."   Settled: the date coin (hero) / caption.
// ══════════════════════════════════════════════════════════════════════════
export const COIN = { x: 960, y: 470, r: 190, d: 56, startX: -320, floor: 470 + 190 };

export const DateCoin: React.FC<Win & { roll: Cued; date: Cued; nov: Cued }> = ({ from, to, roll, date, nov }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const tRoll = at(roll, 34820, from);
  const tDate = at(date, 35710, from, tRoll + 850);
  const tNov = at(nov, 36530, from, tDate + 500);
  if (ms < from || ms > to + 320) return null;

  const p = ms < tRoll ? 0 : EASE(k(tRoll, 850));
  const rock = ms >= tRoll + 850 ? 1 - sp(tRoll + 850, 7, 200, 0.6) : 0; //  a small rock back after it stops
  const x = lerp(COIN.startX, COIN.x, p) - 26 * rock;
  const spin = (-(COIN.x - COIN.startX) * (1 - p)) / COIN.r * (180 / Math.PI);
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={shadow(x, COIN.floor + 4, COIN.r * 1.6, 0.3)} />
      <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${COIN.x}px ${COIN.y}px`, transform: `translateX(${x - COIN.x}px) rotateZ(${spin - 8 * rock}deg)` }}>
        <Puck x={COIN.x} y={COIN.y} w={COIN.r * 2} h={COIN.r * 2} d={COIN.d} r="50%" front={G_WHITE} side="#a9a9a9">
          <div style={{ position: "absolute", inset: 22, borderRadius: "50%", border: "6px solid #d2d2d2" }} />
          {ms >= tNov - 100 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <WType text="NOV" t={tNov - 400} size={70} color={COLORS.ink} />
              <WType text="14" t={tNov + 60} size={140} color={COLORS.ink} />
            </div>
          ) : null}
        </Puck>
      </div>
      <div style={{ ...abs(0, COIN.floor + 50), width: 1920, display: "flex", justifyContent: "center", transform: z(20) || undefined }}>
        <Print t={tDate}><div style={line(56, COLORS.ink)}>The FDA's decision date</div></Print>
      </div>
    </AbsoluteFill>
  );
};
