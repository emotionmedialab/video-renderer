// ─────────────────────────────────────────────────────────────────────────
// KIT · cgon1 — CG Oncology PIVOT-006 long-form, chunk 1 (0:00–0:30, "The readout"). V2 house style
// (MOTION-RULES §0): rounded solids (`Puck`), lit gradients, whole-word type (`WType`), springs that stop,
// vanishing scatter.
//  S1 RiskCut     (ink)   — the RISK OF RECURRENCE column drops; a red blade slices it; the top 68% topples
//                           off the frame; −68% lands where it stood; PHASE 3 chip drops.
//  S2 FinishGate  (paper) — NOV 16 drops; the finish gate rises; the PIVOT-006 sled lands deep in z and on
//                           "met" slides through the gate, snapping the PRIMARY ENDPOINT ribbon.
//  S3 SealedFile  (red)   — the results folder drops; an ink NOT PUBLIC seal slams on; on "December" the seal
//                           flips to DEC 2; a podium rises under the folder (LATE-BREAKING TALK).
//  S4 Scope       (ink)   — a collapsed telescope (KNOWN NOW) lands; on "and what" it extends to TO WATCH.
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, COLORS, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { EASE, fadeOut } from "./plusone";
import { label, line } from "./inovio";
import { Print, Slam } from "./ryb1b";
import { useP3, useZ } from "./camera";
import { Scatter, useDropX, useSpringX } from "./v2style";
import { G_GREY, G_INK, G_STONE, G_WHITE, Puck } from "./argenx1v2b";
import { G_RED, shadow, WType } from "./summit1";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });
const row = (top: number, children: React.ReactNode, extra: React.CSSProperties = {}) => (
  <div style={{ ...abs(0, top), width: 1920, display: "flex", justifyContent: "center", ...extra }}>{children}</div>
);

// ══════════════════════════════════════════════════════════════════════════
// S1 (ink) — "…its bladder cancer drug cut the risk of the cancer coming back by 68% in a Phase 3 trial."
// Settled: −68% over the 32% stub (hero) / RISK OF RECURRENCE base label / PHASE 3 chip.
// ══════════════════════════════════════════════════════════════════════════
export const RISK = { x: 960, floor: 790, w: 250, h: 560, cut: 0.32, baseW: 600, baseH: 72, chipY: 150, figY: 330 };
const STUB_H = RISK.h * RISK.cut; //                     the 32% that stays (later callback: HR 0.32)
const CUT_Y = RISK.floor - STUB_H; //                    the blade's line
const TOP_H = RISK.h - STUB_H;

export const RiskCut: React.FC<Win & { drug: Cued; cut: Cued; back: Cued; fig: Cued; phase: Cued }> = ({ from, to, drug, cut, back, fig, phase }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const drop = useDropX();
  const tDrug = at(drug, 1470, from);
  const tCut = at(cut, 3070, from, tDrug + 800);
  const tBack = at(back, 4540, from, tCut + 600);
  const tFig = at(fig, 5060, from, tBack + 300);
  const tPhase = at(phase, 6370, from, tFig + 700);
  if (ms < from || ms > to + 320) return null;

  const col = drop(tDrug - 380, 900, 380);
  // the blade crosses the frame left → right; it is level with the column's centre exactly on "cut"
  const bladeP = k(tCut - 260, 620);
  const bladeX = lerp(-500, 2420, bladeP);
  // the top piece hinges on its bottom-right corner and falls out of the frame (gravity: p²)
  const fall = clamp01((ms - tBack) / 760);
  const fallOn = fall < 1;
  const chip = drop(tPhase - 300, 420, 300);
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {col.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${RISK.x}px ${RISK.floor + RISK.baseH}px`, transform: `translateY(${col.dy}px) scale(${col.sx}, ${col.sy})` }}>
          <div style={shadow(RISK.x, RISK.floor + RISK.baseH + 10, RISK.baseW * 1.05, 0.45)} />
          <Puck x={RISK.x} y={RISK.floor + RISK.baseH / 2} w={RISK.baseW} h={RISK.baseH} d={130} r={30} front={G_STONE} side="#8f8f8f">
            <div style={label(COLORS.ink, 30)}>RISK OF RECURRENCE</div>
          </Puck>
          {/* the stub: the 32% that stays */}
          <Puck x={RISK.x} y={RISK.floor - STUB_H / 2} w={RISK.w} h={STUB_H} d={120} r="8px 8px 30px 30px" front={G_WHITE} side="#9a9a9a" />
          {/* the top 68%: until "back" it sits on the stub; then it hinges off the right edge and falls away */}
          {ms < tBack || fallOn ? (
            <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${RISK.x + RISK.w / 2}px ${CUT_Y}px`,
              transform: `translate(${260 * fall}px, ${1100 * fall * fall}px) rotateZ(${lerp(0, 78, EASE(clamp01(fall * 1.6)))}deg)` }}>
              <Puck x={RISK.x} y={CUT_Y - TOP_H / 2} w={RISK.w} h={TOP_H} d={120} r="30px 30px 8px 8px" front={G_WHITE} side="#9a9a9a" />
            </div>
          ) : null}
        </div>
      ) : null}
      <Scatter x={RISK.x} y={RISK.floor + 10} t={tDrug} seed={3} n={8} color="#bdbdbd" zz={70} />

      {/* the red blade: a thin rounded slab that slices through on "cut" and leaves the frame */}
      {bladeP > 0 && bladeP < 1 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: z(10) }}>
          <Puck x={bladeX} y={CUT_Y} w={560} h={20} d={30} r={10} front={G_RED} side="#8f0e15" />
        </div>
      ) : null}
      <Scatter x={RISK.x + RISK.w / 2} y={CUT_Y} t={tBack + 120} seed={5} n={7} color={COLORS.paper} zz={80} />

      {/* the figure lands whole where the 68% stood */}
      {row(RISK.figY, <WType text="−68%" t={tFig - 120} size={230} color={COLORS.paper} />, { transform: z(30) || undefined })}

      {/* the qualifier chip drops onto its seat above the figure */}
      {chip.on ? (
        <div style={{ ...abs(0, RISK.chipY), width: 1920, display: "flex", justifyContent: "center", transform: `${z(30)}translateY(${chip.dy}px)` }}>
          <div style={{ transformOrigin: "50% 100%", transform: `scale(${chip.sx}, ${chip.sy})`, padding: "14px 30px", borderRadius: 40, background: G_WHITE,
            boxShadow: "0 10px 20px rgba(0,0,0,0.4)" }}>
            <div style={label(COLORS.ink, 30)}>PHASE 3 · COMPANY-REPORTED</div>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S2 (paper) — "On November 16, the company reported topline results from PIVOT-006. The trial met its
// primary endpoint."  Settled: the broken gate + the sled through it (hero) / PRIMARY ENDPOINT plate / NOV 16.
// ══════════════════════════════════════════════════════════════════════════
export const GATE = { lx: 690, rx: 1230, floor: 740, top: 300, postW: 44, ribbonY: 600, sledW: 330, sledH: 150, sledFar: -2400, sledNear: 70 };

export const FinishGate: React.FC<Win & { date: Cued; topline: Cued; trial: Cued; met: Cued }> = ({ from, to, date, topline, trial, met }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const drop = useDropX();
  const sp = useSpringX();
  const tDate = at(date, 8630, from);
  const tTop = at(topline, 11060, from, tDate + 900);
  const tTrial = at(trial, 12350, from, tTop + 600);
  const tMet = at(met, 14300, from, tTrial + 900);
  if (ms < from || ms > to + 320) return null;

  const dateOut = EASE(k(tTop, 320)); //                 the date is a lead-in: it retires as the gate rises
  const rise = ms < tTop ? 0 : sp(tTop, 11, 170);
  const sledIn = drop(tTrial - 300, 300, 300); //         lands far down the floor, squashes
  const SLIDE = 700;
  const slideP = EASE(k(tMet, SLIDE));
  const sledZ = lerp(GATE.sledFar, GATE.sledNear, slideP);
  // the sled's nose reaches the ribbon plane (z 0) at this progress → the ribbon snaps then
  const snapP = (0 - GATE.sledFar - GATE.sledH / 2) / (GATE.sledNear - GATE.sledFar);
  const tSnap = tMet + SLIDE * snapP * 0.55; //            EASE front-loads the travel: the nose arrives early
  const snapped = ms >= tSnap;
  const swing = snapped ? sp(tSnap, 9, 140) : 0; //       each half swings down on its post and stops
  const postH = GATE.floor - GATE.top;
  const half = (GATE.rx - GATE.lx) / 2;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {dateOut < 1 ? (
        <div style={{ ...abs(0, 140), width: 1920, display: "flex", justifyContent: "center", transform: `${z(40)}translateY(${-520 * dateOut * dateOut}px)` }}>
          <WType text="NOV 16" t={tDate - 120} size={150} color={COLORS.ink} />
        </div>
      ) : null}

      {/* the gate rises out of the floor: two posts, a plate across the top */}
      {rise > 0 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${lerp(560, 0, rise)}px)` }}>
          {[GATE.lx, GATE.rx].map((x) => (
            <React.Fragment key={x}>
              <div style={shadow(x, GATE.floor + 8, 110, 0.18)} />
              <Puck x={x} y={GATE.top + postH / 2} w={GATE.postW} h={postH} d={44} r={22} front={G_STONE} side="#a5a5a5" />
            </React.Fragment>
          ))}
          <Puck x={(GATE.lx + GATE.rx) / 2} y={GATE.top - 10} w={GATE.rx - GATE.lx + 120} h={96} d={50} r={24} front={G_INK} side="#1a1a1a">
            <div style={label(COLORS.paper, 34)}>PRIMARY ENDPOINT</div>
          </Puck>
          {/* the ribbon: one red band until the sled's nose reaches it, then two halves hinged on the posts */}
          {!snapped ? (
            <div style={{ ...abs(GATE.lx, GATE.ribbonY - 9), width: GATE.rx - GATE.lx, height: 18, borderRadius: 9, background: G_RED, transform: z(4) || undefined }} />
          ) : (
            [GATE.lx, GATE.rx].map((x, i) => (
              <div key={x} style={{ ...abs(i === 0 ? x : x - half, GATE.ribbonY - 9), width: half - 6, height: 18, borderRadius: 9, background: G_RED,
                transformOrigin: i === 0 ? "0% 50%" : "100% 50%", transform: `${z(4)}rotateZ(${(i === 0 ? 1 : -1) * lerp(0, 32, swing)}deg)` }} />
            ))
          )}
        </div>
      ) : null}

      {/* the trial sled: lands far back on the floor on PIVOT-006, slides through the gate on "met" */}
      {sledIn.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(sledZ)}translateY(${sledIn.dy}px)` }}>
          <div style={shadow(960, GATE.floor + 6, GATE.sledW * 1.05, 0.25)} />
          <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `960px ${GATE.floor}px`, transform: `scale(${sledIn.sx}, ${sledIn.sy})` }}>
            <Puck x={960} y={GATE.floor - GATE.sledH / 2} w={GATE.sledW} h={GATE.sledH} d={90} r={40} front={G_INK} side="#151515">
              <div style={label(COLORS.paper, 38)}>PIVOT-006</div>
            </Puck>
          </div>
        </div>
      ) : null}
      <Scatter x={960} y={GATE.ribbonY} t={tSnap} seed={7} n={7} color={COLORS.accent} zz={60} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S3 (red) — "The details are not public yet. CG Oncology will present them on December 2, as a late-breaking
// talk at the Society of Urologic Oncology annual meeting."
// Settled: folder with the DEC 2 seal (hero) / podium plate / FULL RESULTS tab.
// ══════════════════════════════════════════════════════════════════════════
export const FILE = { x: 960, y: 450, w: 620, h: 400, sealD: 230, podTop: 650, podW: 720, podH: 230 };

export const SealedFile: React.FC<Win & { details: Cued; notPublic: Cued; dec: Cued; late: Cued; society: Cued }> = ({ from, to, details, notPublic, dec, late, society }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const drop = useDropX();
  const sp = useSpringX();
  const tDet = at(details, 16440, from);
  const tNot = at(notPublic, 17170, from, tDet + 500);
  const tDec = at(dec, 20260, from, tNot + 900);
  const tLate = at(late, 21540, from, tDec + 800);
  const tSoc = at(society, 23000, from, tLate + 900);
  if (ms < from || ms > to + 320) return null;

  const fol = drop(Math.max(from + 60, tDet - 380), 760, 380);
  const flip = ms < tDec ? 0 : sp(tDec, 10, 150); //       the seal turns over its horizontal axis to DEC 2
  const podP = ms < tLate ? 0 : sp(tLate, 12, 150); //     the podium rises from below to meet the folder
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {/* the podium: rounded lectern block, rises from below the frame on "late-breaking" */}
      {podP > 0 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${lerp(700, 0, podP)}px)` }}>
          <Puck x={FILE.x} y={FILE.podTop + FILE.podH / 2} w={FILE.podW} h={FILE.podH} d={160} r={34} front={G_WHITE} side="#a0a0a0">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={line(56, COLORS.ink)}>LATE-BREAKING TALK</div>
              <Print t={tSoc}><div style={label("#6b6b6b", 26)}>SOCIETY OF UROLOGIC ONCOLOGY · ANNUAL MEETING</div></Print>
            </div>
          </Puck>
        </div>
      ) : null}

      {fol.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${fol.dy}px)` }}>
          <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${FILE.x}px ${FILE.y + FILE.h / 2}px`, transform: `scale(${fol.sx}, ${fol.sy})` }}>
            {podP <= 0 ? <div style={shadow(FILE.x, FILE.y + FILE.h / 2 + 30, FILE.w, 0.3)} /> : null}
            {/* tab */}
            <Puck x={FILE.x - FILE.w / 2 + 150} y={FILE.y - FILE.h / 2 - 26} w={260} h={70} d={36} r="20px 20px 0 0" front={G_WHITE} side="#a0a0a0">
              <div style={{ ...label(COLORS.ink, 24), marginTop: -8 }}>FULL RESULTS</div>
            </Puck>
            <Puck x={FILE.x} y={FILE.y} w={FILE.w} h={FILE.h} d={40} r={26} front={G_WHITE} side="#a0a0a0" />
            {/* the seal: slams on "not public", then flips (pre-rotated back face, never mirrored) */}
            {ms >= tNot ? (
              <div style={{ position: "absolute", inset: 0, ...p3, transform: z(40) || undefined }}>
                <div style={{ ...abs(FILE.x - FILE.sealD / 2, FILE.y - FILE.sealD / 2), width: FILE.sealD, height: FILE.sealD }}>
                  <Slam t={tNot}>
                    <div style={{ position: "relative", width: FILE.sealD, height: FILE.sealD, ...p3, transform: `rotateX(${180 * flip}deg)` }}>
                      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: G_INK, backfaceVisibility: "hidden", display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center", gap: 2, boxShadow: "0 10px 18px rgba(0,0,0,0.35)" }}>
                        <div style={label(COLORS.paper, 32)}>NOT</div>
                        <div style={label(COLORS.paper, 32)}>PUBLIC</div>
                        <div style={label(COLORS.paper, 32)}>YET</div>
                      </div>
                      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: G_STONE, backfaceVisibility: "hidden", transform: "rotateX(180deg)",
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: `8px solid ${COLORS.ink}`, boxSizing: "border-box" }}>
                        <div style={line(58, COLORS.ink)}>DEC 2</div>
                      </div>
                    </div>
                  </Slam>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
      <Scatter x={FILE.x} y={FILE.y + FILE.h / 2} t={Math.max(from + 60, tDet - 380) + 380} seed={9} n={8} color={COLORS.paper} zz={60} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S4 (ink) — "So here is what is known now, and what to look for then."
// Settled: the extended telescope (hero) / KNOWN NOW on the body / TO WATCH on the draw tube.
// ══════════════════════════════════════════════════════════════════════════
export const SCOPE = { bx: 952, y: 470, big: { w: 340, h: 170, d: 150 }, mid: { w: 320, h: 130, d: 120, dx: 280 }, small: { w: 330, h: 100, d: 90, dx: 560 }, standY: 560, floor: 800 };
/** horizontal centre shift of the extended telescope vs collapsed (the camera trucks by this, C11) */
export const SCOPE_K = 1.3; //       the whole telescope is drawn at 1.3× around (bx, y)
export const SCOPE_SHIFT = Math.round(280 * SCOPE_K); //  collapsed centre ≈ bx+12, extended ≈ bx+292 (×K)

export const Scope: React.FC<Win & { so: Cued; known: Cued; look: Cued }> = ({ from, to, so, known, look }) => {
  const ms = useMs();
  const p3 = useP3();
  const drop = useDropX();
  const sp = useSpringX();
  const tSo = at(so, 26450, from);
  const tKnown = at(known, 27720, from, tSo + 600);
  const tLook = at(look, 28530, from, tKnown + 500);
  if (ms < from || ms > to + 320) return null;

  const d = drop(tSo, 800, 380);
  const ext = ms < tLook ? 0 : sp(tLook, 12, 140); //     the draw tubes slide out to the right (one spring)
  const { bx, y } = SCOPE;
  const midX = bx + SCOPE.mid.dx * ext;
  const smallX = bx + SCOPE.small.dx * ext;
  const capX = smallX + SCOPE.small.w / 2 + 14;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {d.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${bx}px ${y}px`, transform: `scale(${SCOPE_K})` }}>
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${bx}px ${SCOPE.floor}px`, transform: `translateY(${d.dy}px) scale(${d.sx}, ${d.sy})` }}>
          <div style={shadow(bx, SCOPE.floor + 8, 360, 0.45)} />
          {/* mount: post + foot */}
          <Puck x={bx} y={(SCOPE.standY + SCOPE.floor) / 2} w={40} h={SCOPE.floor - SCOPE.standY} d={40} r={20} front={G_GREY} side="#555" />
          <Puck x={bx} y={SCOPE.floor - 14} w={260} h={28} d={120} r={14} front={G_GREY} side="#555" />
          {/* draw tubes sit inside the body (behind its front face) until they slide out */}
          <Puck x={smallX} y={y} w={SCOPE.small.w} h={SCOPE.small.h} d={SCOPE.small.d} r={44} front={G_STONE} side="#8a8a8a">
            {ext > 0.6 ? <Print t={tLook + 420}><div style={label(COLORS.ink, 26)}>TO WATCH · DEC 2</div></Print> : null}
          </Puck>
          <Puck x={capX} y={y} w={30} h={SCOPE.small.h + 16} d={SCOPE.small.d + 16} r={15} front={G_RED} side="#8f0e15" />
          <Puck x={midX} y={y} w={SCOPE.mid.w} h={SCOPE.mid.h} d={SCOPE.mid.d} r={56} front={G_GREY} side="#666" />
          <Puck x={bx} y={y} w={SCOPE.big.w} h={SCOPE.big.h} d={SCOPE.big.d} r={74} front={G_WHITE} side="#8f8f8f">
            <Print t={tKnown}><div style={label(COLORS.ink, 32)}>KNOWN NOW</div></Print>
          </Puck>
        </div>
        </div>
      ) : null}
      <Scatter x={bx} y={SCOPE.floor} t={tSo + 380} seed={11} n={7} color="#bdbdbd" zz={60} />
    </AbsoluteFill>
  );
};
