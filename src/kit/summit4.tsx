// ─────────────────────────────────────────────────────────────────────────
// KIT · summit4 — Summit ivonescimab CRL long-form, chunk 4 (1:45.9–2:17.8: follow-up + "Why it matters").
//  S15 FollowUp (ink)   — a follow-up rail with the 0.79 primary disc; the rail extends, the 0.76 disc drops on,
//                         POST-HOC pops, a PRESPECIFIED TEST fence slams down around the first disc only.
//  S16 Held     (paper) — callback to the stand (BAR seats, ink posts on the card): Summit's own 2025 announcement
//                         flies in and prints the FDA's requirement; on "held" two clamps slam onto the bar ends.
//  S17 CaseGate (ink)   — SUMMIT'S CASE (a briefcase) slides along a conveyor, its argument prints on a tag; on
//                         "did not" it drives into the FDA REVIEW wall and recoils; the wall stays shut.
// Text: whole-word `WType` / `Print` only (Nel 11-19).
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { EASE, fadeOut } from "./plusone";
import { label, line } from "./inovio";
import { Print } from "./ryb1b";
import { useP3, useZ } from "./camera";
import { Scatter, useDropX, useEnt, useSpringX } from "./v2style";
import { G_GREY, G_INK, G_STONE, G_WHITE, Puck } from "./argenx1v2b";
import { BAR, G_RED, WType, shadow } from "./summit1";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });

// ══════════════════════════════════════════════════════════════════════════
// S15 (ink) — "With longer follow-up, the survival hazard ratio moved to 0.76. Summit itself calls that a post-hoc
// analysis, outside the prespecified test."   Settled: the rail + two discs (hero) / POST-HOC / fence label.
// ══════════════════════════════════════════════════════════════════════════
export const FU = { y: 640, x0: 200, xShort: 900, xLong: 1720, s1: 520, s2: 1420, disc: 200, fence: { x0: 330, x1: 710, top: 360 } };

export const FollowUp: React.FC<Win & { longer: Cued; drop: Cued; value: Cued; posthoc: Cued; pre: Cued }> = ({ from, to, longer, drop: dropC, value, posthoc, pre }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const drop = useDropX();
  const tLong = at(longer, 106250, from);
  const tDrop = at(dropC, 108570, from, tLong + 1300);
  const tVal = at(value, 109910, from, tDrop + 500);
  const tPh = at(posthoc, 113080, from, tVal + 800);
  const tPre = at(pre, 115170, from, tPh + 800);
  if (ms < from || ms > to + 320) return null;

  const inP = ent(from + 100, 600);
  const ext = EASE(k(tLong, 1300));
  const x1 = lerp(FU.xShort, FU.xLong, ext);
  const d2 = drop(tDrop - 380, 700, 380);
  const ph = ms < tPh ? 0 : sp(tPh, 9, 200);
  const fence = drop(tPre - 380, 900, 380);
  const discY = FU.y - 13 - FU.disc / 2;
  const disc = (x: number, v: string, sub: string, vt: number | null) => (
    <Puck x={x} y={discY} w={FU.disc} h={FU.disc} d={60} r="50%" front={G_WHITE} side="#9a9a9a">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 10 }}>
        <div style={label("#6b6b6b", 20)}>SURVIVAL HR</div>
        {vt === null ? <div style={line(66, COLORS.ink)}>{v}</div> : ms >= vt ? <WType text={v} t={vt} size={66} color={COLORS.ink} /> : <div style={{ height: 69 }} />}
        <div style={label("#6b6b6b", 20)}>{sub}</div>
      </div>
    </Puck>
  );
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(lerp(-1400, 0, inP))}` }}>
        {/* the rail grows to the right on "longer follow-up" */}
        <div style={shadow((FU.x0 + x1) / 2, FU.y + 34, x1 - FU.x0, 0.4)} />
        <Puck x={(FU.x0 + x1) / 2} y={FU.y} w={x1 - FU.x0} h={26} d={40} r={13} front={G_GREY} side="#4a4a4a" />
        <div style={{ ...abs(FU.x0, FU.y + 30), width: 260, ...label("rgba(255,255,255,0.6)", 22), transform: z(10) || undefined }}>FOLLOW-UP TIME →</div>
        {disc(FU.s1, "0.79", "PRIMARY", null)}
      </div>
      {/* the 0.76 disc drops onto the far end */}
      {d2.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${FU.s2}px ${FU.y - 13}px`, transform: `translateY(${d2.dy}px) scale(${d2.sx}, ${d2.sy})` }}>
          {disc(FU.s2, "0.76", "LATER", tVal)}
        </div>
      ) : null}
      <Scatter x={FU.s2} y={FU.y - 13} t={tDrop} seed={30} color="#9a9a9a" zz={30} />
      {/* POST-HOC: the one red, pops in under the later disc */}
      {ph > 0 ? (
        <div style={{ ...abs(FU.s2 - 140, FU.y + 50), width: 280, display: "flex", justifyContent: "center", transform: `${z(40)}scale(${ph})` }}>
          <div style={{ background: G_RED, borderRadius: 30, padding: "12px 30px", boxShadow: "0 10px 18px rgba(0,0,0,0.4)" }}><div style={line(44, COLORS.paper)}>POST-HOC</div></div>
        </div>
      ) : null}
      {/* the PRESPECIFIED TEST fence slams down around the primary disc only */}
      {fence.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${(FU.fence.x0 + FU.fence.x1) / 2}px ${FU.y}px`, transform: `${z(10)}translateY(${fence.dy}px) scale(${fence.sx}, ${fence.sy})` }}>
          <Puck x={(FU.fence.x0 + FU.fence.x1) / 2} y={FU.fence.top} w={FU.fence.x1 - FU.fence.x0} h={70} d={80} r={22} front={G_STONE} side="#8f8f8f">
            <div style={label(COLORS.ink, 26)}>PRESPECIFIED TEST</div>
          </Puck>
          {[FU.fence.x0 + 14, FU.fence.x1 - 14].map((x) => (
            <Puck key={x} x={x} y={(FU.fence.top + FU.y) / 2 + 10} w={28} h={FU.y - FU.fence.top} d={80} r={14} front={G_STONE} side="#8f8f8f" />
          ))}
        </div>
      ) : null}
      <Scatter x={(FU.fence.x0 + FU.fence.x1) / 2} y={FU.y} t={tPre} seed={31} color="#bdbdbd" zz={40} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S16 (paper) — "Summit filed knowing the bar. Its own 2025 announcement said the FDA considered a survival benefit
// necessary. The FDA held to that."   Settled: the stand with the clamped red bar (hero) / the 2025 announcement.
// (OUR READ rides in the chrome band, not in the frame.)
// ══════════════════════════════════════════════════════════════════════════
const SHEET = { x: 960, y: 520, w: 700, h: 230 };

export const Held: React.FC<Win & { filed: Cued; ann: Cued; necessary: Cued; held: Cued }> = ({ from, to, filed, ann, necessary, held }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const drop = useDropX();
  const tFiled = at(filed, 120160, from);
  const tAnn = at(ann, 122200, from, tFiled + 800);
  const tNec = at(necessary, 124800, from, tAnn + 900);
  const tHeld = at(held, 128270, from, tNec + 900);
  if (ms < from || ms > to + 320) return null;

  const standP = ent(tFiled - 200, 700);
  const sheetP = ent(tAnn - 200, 650);
  const cl = drop(tHeld - 380, 700, 380);
  const postH = BAR.floor - BAR.slabH / 2 - BAR.postTop;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {ms >= tFiled - 200 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(lerp(-1800, 0, standP))}translateY(${lerp(600, 0, standP)}px)` }}>
          <div style={shadow(960, BAR.floor + 30, 1000, 0.2)} />
          <Puck x={960} y={BAR.floor} w={1000} h={BAR.slabH} d={90} r={23} front={G_INK} side="#111"><div style={label(COLORS.paper, 30)}>FDA</div></Puck>
          {BAR.postX.map((x) => (
            <Puck key={x} x={x} y={BAR.postTop + postH / 2} w={BAR.postW} h={postH} d={46} r={23} front={G_INK} side="#111" />
          ))}
          <Puck x={960} y={BAR.high} w={BAR.barW} h={BAR.barH} d={40} r={20} front={G_RED} side="#8f0e15" />
        </div>
      ) : null}
      {/* Summit's own 2025 announcement flies in from depth and settles under the bar */}
      {ms >= tAnn - 200 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${SHEET.x}px ${SHEET.y}px`,
          transform: `${z(lerp(-2400, 30, sheetP))}rotateY(${lerp(-70, 0, Math.min(1, sheetP))}deg)` }}>
          <Puck x={SHEET.x} y={SHEET.y} w={SHEET.w} h={SHEET.h} d={8} r={14} front="linear-gradient(180deg,#ffffff,#eeeeee)" side="#cfcfcf"
            style={{ boxShadow: "0 18px 30px rgba(0,0,0,0.18)" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={label("#6b6b6b", 24)}>SUMMIT · 2025 ANNOUNCEMENT</div>
              <div style={{ height: 116, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Print t={tNec}><div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={line(46, COLORS.ink)}>The FDA considers a survival</div>
                  <div style={line(46, COLORS.ink)}>benefit necessary</div>
                </div></Print>
              </div>
            </div>
          </Puck>
        </div>
      ) : null}
      {/* the clamps: slam down onto both bar ends at once (one move, a pair) */}
      {cl.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(30)}translateY(${cl.dy}px)` }}>
          {BAR.postX.map((x) => {
            const cx = x + (x < 960 ? 70 : -70);
            return (
              <div key={x} style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${cx}px ${BAR.high}px`, transform: `scale(${cl.sx}, ${cl.sy})` }}>
                <Puck x={cx} y={BAR.high} w={86} h={104} d={70} r={22} front={G_INK} side="#111" />
                <Puck x={cx} y={BAR.high - 60} w={40} h={30} d={40} r={10} front={G_GREY} side="#4a4a4a" />
              </div>
            );
          })}
        </div>
      ) : null}
      {BAR.postX.map((x, i) => <Scatter key={x} x={x + (x < 960 ? 70 : -70)} y={BAR.high + 52} t={tHeld} seed={32 + i} color={COLORS.ink} zz={60} />)}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S17 (ink) — "Summit's case was that no approved regimen in this setting has shown a significant survival benefit
// either. That case did not carry the review."   Settled: the case stopped at the wall (hero) / its tag / wall label.
// ══════════════════════════════════════════════════════════════════════════
export const CG = { floor: 760, x0: 160, x1: 1560, stop: 720, hit: 1150, wallX: 1420, wallW: 170, wallH: 360, caseW: 330, caseH: 220 };

export const CaseGate: React.FC<Win & { arrive: Cued; tag: Cued; carry: Cued }> = ({ from, to, arrive, tag, carry }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const tArr = at(arrive, 130160, from);
  const tTag = at(tag, 131260, from, tArr + 950);
  const tCarry = at(carry, 136060, from, tTag + 1500);
  if (ms < from || ms > to + 320) return null;

  const setP = ent(from + 100, 600);
  const slide = EASE(k(tArr, 900));
  const stopSq = ms >= tArr + 900 && ms < tArr + 1080 ? Math.sin((Math.PI * (ms - tArr - 900)) / 180) : 0;
  const push = ms < tCarry ? 0 : clampIn((ms - tCarry) / 380); //  drives forward into the wall
  const recoil = ms < tCarry + 380 ? 0 : sp(tCarry + 380, 7, 180, 0.7); // …and bounces back a little, then still
  const hitSq = ms >= tCarry + 380 && ms < tCarry + 560 ? Math.sin((Math.PI * (ms - tCarry - 380)) / 180) : 0;
  const caseX = lerp(-400, CG.stop, slide) + (CG.hit - CG.stop) * push * push - 90 * Math.min(1, recoil);
  const sq = stopSq * 0.6 + hitSq;
  const caseTop = CG.floor - 24 - CG.caseH;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(lerp(-1400, 0, setP))}translateY(${lerp(300, 0, setP)}px)` }}>
        {/* the conveyor */}
        <div style={shadow((CG.x0 + CG.x1) / 2, CG.floor + 30, CG.x1 - CG.x0, 0.45)} />
        <Puck x={(CG.x0 + CG.x1) / 2} y={CG.floor} w={CG.x1 - CG.x0} h={48} d={140} r={24} front={G_GREY} side="#3a3a3a">
          <div style={{ display: "flex", gap: 54 }}>
            {Array.from({ length: 22 }, (_, i) => <div key={i} style={{ width: 14, height: 14, borderRadius: 7, background: "#6a6a6a" }} />)}
          </div>
        </Puck>
        {/* the FDA REVIEW wall: shut, and it stays shut */}
        <div style={shadow(CG.wallX, CG.floor - 20, CG.wallW * 1.3, 0.5)} />
        <Puck x={CG.wallX} y={CG.floor - 24 - CG.wallH / 2} w={CG.wallW} h={CG.wallH} d={200} r={26} front={G_STONE} side="#8f8f8f">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={line(40, COLORS.ink)}>FDA</div>
            <div style={line(34, COLORS.ink)}>REVIEW</div>
          </div>
        </Puck>
      </div>
      {/* the case + its tag (the tag rides the case) */}
      {slide > 0 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(30)}translateX(${caseX - CG.stop}px)` }}>
          <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${CG.stop}px ${CG.floor - 24}px`, transform: `scale(${1 - 0.14 * sq}, ${1 + 0.06 * sq})` }}>
            <div style={{ ...abs(CG.stop - 70, caseTop - 46), width: 140, height: 60, borderRadius: "30px 30px 0 0", border: "16px solid #cfcfcf", borderBottom: "none", boxSizing: "border-box" }} />
            <Puck x={CG.stop} y={caseTop + CG.caseH / 2} w={CG.caseW} h={CG.caseH} d={110} r={30} front={G_WHITE} side="#9a9a9a">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={label("#6b6b6b", 24)}>SUMMIT'S</div>
                <div style={line(64, COLORS.ink)}>CASE</div>
              </div>
            </Puck>
          </div>
          <div style={{ ...abs(CG.stop - 380, caseTop - 290), width: 760, display: "flex", justifyContent: "center", transform: z(20) || undefined }}>
            <Print t={tTag}>
              <div style={{ background: G_INK, borderRadius: 22, padding: "16px 28px", display: "flex", flexDirection: "column", alignItems: "center", boxShadow: "0 12px 22px rgba(0,0,0,0.45)" }}>
                <div style={line(36, COLORS.paper)}>No approved regimen in this setting</div>
                <div style={line(36, COLORS.paper)}>has shown a significant survival benefit either</div>
              </div>
            </Print>
          </div>
        </div>
      ) : null}
      <Scatter x={CG.wallX - CG.wallW / 2} y={CG.floor - 140} t={tCarry + 380} seed={34} color="#d0d0d0" zz={60} />
    </AbsoluteFill>
  );
};
const clampIn = (x: number) => Math.max(0, Math.min(1, x));
