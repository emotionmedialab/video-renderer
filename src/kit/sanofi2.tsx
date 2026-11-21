// ─────────────────────────────────────────────────────────────────────────
// KIT · sanofi2 — Sanofi × Insmed SHORT (9:16), chunk 2, 2026-11-21. House style 11-16 (MOTION-RULES §0).
//  S6 cliff (red)    "The driver is the Dupixent cliff. Sanofi loses exclusivity early next decade… and needs the next
//                     growth story" → a DUPIXENT column on a ledge behind an EXCLUSIVITY fence; on "cliff" the ledge's lip
//                     breaks off and falls; on "loses exclusivity" the fence falls flat and slides off; EARLY NEXT DECADE
//                     drops; on "needs" an empty NEXT GROWTH STORY? pedestal springs up below.
//  S7 knob (paper)   "this is Sanofi's post-Dupixent bet. Immunology to respiratory." → a selector knob springs in pointing
//                     at IMMUNOLOGY; on "immunology" it turns to RESPIRATORY, which lights red.
//  S8 unsigned (ink) "The affordability question is the one that matters next." → the hook's $30B+ cheque returns to its
//                     seat; AFFORDABILITY drops; on "question" a red ? drops onto its empty signature line (no deal signed).
// Canvas 1080×1920; chrome band 0–112; key content above y 1632.
// On-screen limits: Dupixent loses exclusivity "early next decade" (no year on screen); the cheque stays unsigned.
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, COLORS, useMs } from "./core";
import { useP3, useZ } from "./camera";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { EASE_IO, fadeOut } from "./plusone";
import { label, line } from "./inovio";
import { Print } from "./ryb1b";
import { Scatter, useDropX, useEnt, useSpringX } from "./v2style";
import { G_GREY, G_INK, G_WHITE, Puck } from "./argenx1v2b";
import { G_RED } from "./summit1";
import { LineDrop } from "./jnjtype";
import { CHQ, ChequeFace } from "./sanofi1";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });
const Shadow: React.FC<{ x: number; y: number; w: number; o?: number }> = ({ x, y, w, o = 1 }) => (
  <div style={{ ...abs(x - w / 2, y), width: w, height: 40, borderRadius: "50%", background: "rgba(0,0,0,0.24)", filter: "blur(12px)", opacity: o }} />
);
const Centre: React.FC<{ y: number; children: React.ReactNode }> = ({ y, children }) => (
  <div style={{ ...abs(0, y), width: 1080, display: "flex", justifyContent: "center" }}>{children}</div>
);

// ══════════════════════════════════════════════════════════════════════════
// S6 CLIFF (red). Settled: DUPIXENT column on its broken ledge (hero) · EARLY NEXT DECADE · NEXT GROWTH STORY? pedestal.
// ══════════════════════════════════════════════════════════════════════════
export const CLIFF = { top: 960, ledge: { x: 540, w: 600, h: 150, d: 160 }, lip: { x: 920, w: 160 }, col: { x: 540, w: 360, h: 520, d: 140 },
  fence: { xs: [330, 435, 540, 645, 750], h: 210, z: 150 }, capY: 1250, ped: { y: 1500, w: 520, h: 170 } };
export const CLIFF_CAM = { crane: { y: -50 }, pull: { y: -40, z: -120 } };

export const Cliff: React.FC<Win & { arriveMs: number; dupi: Cued; cliff: Cued; loses: Cued; early: Cued; needs: Cued }> = ({ from, to, arriveMs, dupi, cliff, loses, early, needs }) => {
  const ms = useMs();
  const p3 = useP3();
  const z = useZ();
  const ent = useEnt();
  const sp = useSpringX();
  const k = useK();
  const tD = at(dupi, 27390, from);
  const tC = at(cliff, 28050, from, tD + 400);
  const tL = at(loses, 29220, from, tC + 600);
  const tE = at(early, 30440, from, tL + 800);
  const tN = at(needs, 31810, from, tE + 400);
  if (ms > to + 320 || ms < arriveMs) return null;
  const C = CLIFF, L = C.ledge, P = C.lip, K = C.col, F = C.fence;
  const e = ent(arriveMs, 600); //                     ledge + fenced column spring in from depth
  const ly = C.top + L.h / 2;
  // the lip breaks off on "cliff": tips and falls under gravity, gone (M7)
  const br = clamp01((ms - tC) / 800);
  const lipOn = br < 1;
  // the fence falls flat toward us on "loses exclusivity", then slides off the ledge and out of frame
  const fall = EASE_IO(k(tL, 450));
  const slide = clamp01((ms - tL - 450) / 550);
  const fenceOn = slide < 1;
  const ped = sp(tN, 10, 120);
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to + 300) }}>
      <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `540px ${C.top}px`, transform: `${z(lerp(-1500, 0, e))}` }}>
        {/* the ledge and its lip */}
        <Puck x={L.x} y={ly} w={L.w} h={L.h} d={L.d} r={36} front={G_INK} side="#111" />
        {lipOn ? (
          <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${P.x - P.w / 2}px ${C.top}px`,
            transform: `translateY(${1500 * br * br}px) rotate(${28 * br}deg)` }}>
            <Puck x={P.x} y={ly} w={P.w} h={L.h} d={L.d} r={36} front={G_INK} side="#111" />
          </div>
        ) : null}
        {/* the DUPIXENT column: its name prints on "Dupixent" */}
        <div style={{ ...p3, position: "absolute", inset: 0, transform: `${z(10)}` }}>
          <Puck x={K.x} y={C.top - K.h / 2} w={K.w} h={K.h} d={K.d} r={44} front={G_WHITE} side="#9c9c9c">
            <div style={{ height: 80 }}><Print t={tD}><div style={line(64, COLORS.ink)}>DUPIXENT</div></Print></div>
          </Puck>
        </div>
        {/* the EXCLUSIVITY fence: posts + a rail plate, in front of the column */}
        {fenceOn ? (
          <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `540px ${C.top}px`,
            transform: `${z(F.z)}translateY(${1300 * slide * slide}px) rotateX(${-86 * fall}deg)` }}>
            {F.xs.map((x) => <Puck key={x} x={x} y={C.top - F.h / 2} w={34} h={F.h} d={30} r={17} front={G_GREY} side="#5e5e5e" />)}
            <div style={{ ...p3, position: "absolute", inset: 0, transform: `${z(24)}` }}>
              <Puck x={540} y={C.top - F.h + 70} w={500} h={90} d={30} r={45} front={G_GREY} side="#5e5e5e">
                <div style={label(COLORS.ink, 48)}>EXCLUSIVITY</div>
              </Puck>
            </div>
          </div>
        ) : null}
      </div>
      <Scatter x={P.x - P.w / 2} y={C.top} t={tC} seed={17} n={6} color={COLORS.paper} zz={L.d / 2} />

      <Centre y={C.capY}><LineDrop text="EARLY NEXT DECADE" t={tE} size={76} color={COLORS.paper} /></Centre>

      {/* the empty pedestal: what Sanofi needs next, springs up from below */}
      {ms >= tN ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transform: `${z(30)}translateY(${lerp(700, 0, ped)}px)` }}>
          <Puck x={540} y={C.ped.y} w={C.ped.w} h={C.ped.h} d={70} r={44} front={G_WHITE} side="#9c9c9c">
            <div style={{ ...line(52, COLORS.ink), textAlign: "center", lineHeight: 1.08 }}>NEXT GROWTH<br />STORY?</div>
          </Puck>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S7 KNOB (paper). Settled: the selector knob on RESPIRATORY (hero; its two position labels are its own) · POST-DUPIXENT BET.
// ══════════════════════════════════════════════════════════════════════════
export const KNOB = { x: 540, y: 1020, size: 520, d: 120, from: -48, to: 48, labY: 610, kickY: 330 };
export const KNOB_CAM = { push: { z: 70, y: 30 } };

export const Knob: React.FC<Win & { post: Cued; turn: Cued }> = ({ from, to, post, turn }) => {
  const ms = useMs();
  const p3 = useP3();
  const z = useZ();
  const ent = useEnt();
  const sp = useSpringX();
  const tP = at(post, 36020, from);
  const tT = at(turn, 37585, from, tP + 500);
  if (ms > to + 320) return null;
  const N = KNOB;
  const e = ent(from + 450, 600); //                    after the section wipe
  const tw = sp(tT, 10, 90); //                         turns with one overshoot, then still
  const a = lerp(N.from, N.to, tw);
  const onResp = tw > 0.9;
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to + 300) }}>
      <Centre y={N.kickY}><LineDrop text="POST-DUPIXENT BET" t={tP} size={80} color={COLORS.ink} /></Centre>
      <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${N.x}px ${N.y}px`, transform: `${z(lerp(-1500, 0, e))}` }}>
        {/* the two positions */}
        <div style={{ ...abs(90, N.labY), width: 400, display: "flex", justifyContent: "center" }}>
          <div style={line(50, onResp ? "#b0b0b0" : COLORS.ink)}>IMMUNOLOGY</div>
        </div>
        <div style={{ ...abs(570, N.labY), width: 420, display: "flex", justifyContent: "center" }}>
          <div style={line(50, onResp ? COLORS.accent : "#b0b0b0")}>RESPIRATORY</div>
        </div>
        <Shadow x={N.x} y={N.y + N.size / 2 - 10} w={520} />
        {/* the knob: a ridged base and a turning cap with its pointer */}
        <Puck x={N.x} y={N.y} w={N.size + 60} h={N.size + 60} d={40} r="50%" front={G_GREY} side="#5e5e5e" />
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${N.x}px ${N.y}px`, transform: `${z(40)}rotate(${a}deg)` }}>
          <Puck x={N.x} y={N.y} w={N.size} h={N.size} d={N.d} r="50%" front={G_INK} side="#111">
            <div style={{ ...abs(N.size / 2 - 22, 40), width: 44, height: N.size / 2 - 60, borderRadius: 22, background: COLORS.paper }} />
          </Puck>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S8 UNSIGNED (ink). Settled: the $30B+ cheque with a red ? on its signature line (hero) · AFFORDABILITY.
// The callback (K1/K2): the hook's cheque returns to its own seat and is left UNSIGNED: the frame says why it is back.
// ══════════════════════════════════════════════════════════════════════════
export const UNS = { kickY: 420, q: { x: CHQ.x + CHQ.w / 2 - 56 - 170, y: CHQ.y + CHQ.h / 2 - 50, size: 104 } };
export const UNS_CAM = { crane: { y: -50, z: 60 } };

export const Unsigned: React.FC<Win & { afford: Cued; question: Cued }> = ({ from, to, afford, question }) => {
  const ms = useMs();
  const p3 = useP3();
  const z = useZ();
  const ent = useEnt();
  const drop = useDropX();
  const tA = at(afford, 40050, from);
  const tQ = at(question, 40680, from, tA + 400);
  if (ms > to + 320) return null;
  const C = CHQ, Q = UNS.q;
  const e = ent(from + 200, 500);
  const qd = drop(tQ, 1000, 380);
  return (
    <AbsoluteFill style={{ ...p3, opacity: fadeOut(ms, to + 300) }}>
      <Centre y={UNS.kickY}><LineDrop text="AFFORDABILITY" t={tA} size={96} color={COLORS.paper} /></Centre>
      <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${C.x}px ${C.y}px`, transform: `${z(lerp(-1600, 0, e))}` }}>
        <Shadow x={C.x} y={C.y + C.h / 2 + 30} w={760} />
        <Puck x={C.x} y={C.y} w={C.w} h={C.h} d={C.d} r={40} front={G_WHITE} side="#a5a5a5">
          <ChequeFace memo={<div style={label(COLORS.ink, 62)}>REPORTED</div>} amount={<div style={line(150, COLORS.paper)}>$30B+</div>} />
        </Puck>
      </div>
      {/* the ? falls onto the empty signature line and squashes once */}
      {qd.on ? (
        <div style={{ ...p3, position: "absolute", inset: 0, transformOrigin: `${Q.x}px ${Q.y + Q.size / 2}px`,
          transform: `${z(C.d / 2 + 30)}translateY(${qd.dy}px) scale(${qd.sx}, ${qd.sy})` }}>
          <Puck x={Q.x} y={Q.y} w={Q.size} h={Q.size} d={50} r="50%" front={G_RED} side="#8f0e15">
            <div style={line(78, COLORS.paper)}>?</div>
          </Puck>
        </div>
      ) : null}
      <Scatter x={Q.x} y={Q.y + Q.size / 2} t={tQ + 380} seed={23} n={6} color={COLORS.paper} zz={C.d} />
    </AbsoluteFill>
  );
};
