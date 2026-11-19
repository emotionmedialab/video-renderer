// ─────────────────────────────────────────────────────────────────────────
// KIT · thering — A CHAIN THAT BENDS SHUT, THEN PLUGS A RECEPTOR. Added on the Gilead ×
// PepStar LONG-FORM, 2026-11-02 (HORIZONTAL 16:9). Absolute 1920×1080 seats; import by path.
// One-mover, frame budget, depth by default (kit/camera: `useZ()` / `useP3()`).
//
// `RingToReceptor` (ink), the first half of THE TWO TARGETS spine: the name flies in and
// docks; beads fly out of depth into a straight chain; the chain BENDS along a real arc of
// constant length until its ends meet (the curl IS "ring-shaped"); a capsule closes around
// it on "swallowed"; a syringe is struck on "injected"; the ring leaves, a receptor rises
// through the wall and the ring SLAMS into it; a signal falls and stops on the plug.
// Exports `Receptor` so the second target (§5) seats on the same wall.
//
// Mechanism limit: the picture says "blocks the receptor". It never draws efficacy.
// ─────────────────────────────────────────────────────────────────────────

import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, DISPLAY, INK_SUB, TRACK, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { useP3, useZ } from "./camera";
import { back, EASE, EASE_IO, fadeOut } from "./plusone";
import { FlyWord } from "./split";
import { IconSyringe } from "./icons";

type Txt = { text: string } & Cued;
const sq = (t: number) => (t <= 0 || t >= 1 ? 0 : Math.exp(-5 * t) * Math.sin(11 * t));

export const WALL_Y = 640;
const N = 10;
const R0 = 170; // the ring's radius at full size; the chain's length is 2πR0, so it closes exactly
const BEAD = 30;

/** Bead i of a chain of constant length, curled by c (0 straight → 1 closed), centred on 0,0. */
const beadAt = (i: number, c: number): [number, number] => {
  const L = 2 * Math.PI * R0;
  const s = (i - (N - 1) / 2) * (L / N);
  if (c < 0.001) return [s, 0];
  const kappa = (c * 2 * Math.PI) / L;
  return [Math.sin(kappa * s) / kappa, R0 * c - (1 - Math.cos(kappa * s)) / kappa];
};

/** A receptor: a socket open to the top, a stem through the wall. `x`, `y` = the socket's centre. */
export const Receptor: React.FC<{ x: number; y: number; r: number; color?: string; sw?: number; dashed?: boolean; opacity?: number }> = ({
  x, y, r, color = COLORS.paper, sw = 12, dashed = false, opacity = 1,
}) => (
  <svg width={1920} height={1400} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity }}>
    <path d={`M ${x - r} ${y - r * 0.5} V ${y} A ${r} ${r} 0 0 0 ${x + r} ${y} V ${y - r * 0.5} M ${x} ${y + r} V ${WALL_Y + 170}`}
      fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeDasharray={dashed ? "18 16" : undefined} />
  </svg>
);

// Settled frames: chain + label · ring + name + label · capsule + label + syringe
// · receptor + ring + label + dots + signal label · receptor + ring + label + two tags.
export const RingToReceptor: React.FC<Win & {
  kicker: Txt; // "The lead drug"
  name: Txt; // flies in
  dock: Cued; // travels to the corner
  label: Txt; // "Macrocyclic peptide"
  chain: Cued; // beads fly in
  close: Cued; // the chain bends shut
  amino: Txt; // "Amino acids"
  labelOut: Cued; // the upper label and amino retire
  capsule: Txt; // closes on the ring, with its label
  syringe: Cued; // appears and is struck
  clearOut: Cued; // capsule and syringe leave (a pin inside the pause)
  rise: Cued; // wall + receptor rise
  plug: Cued; // the ring slams in
  rLabel: Txt; // "IL-23 receptor"
  signal: { rows: string[] } & Cued; // the dots fall, the label lands
  signalOut: Cued; // dots and name retire (a pin inside the pause)
  tagA: Txt; // solid: the aim
  tagB: Txt; // dashed: the potential
}> = ({ from, to, kicker, name, dock, label, chain, close, amino, labelOut, capsule, syringe, clearOut, rise, plug, rLabel, signal, signalOut, tagA, tagB }) => {
  const ms = useMs();
  const k = useK();
  const Z = useZ();
  const P3 = useP3();

  const tK = at(kicker, from, from);
  const tN = at(name, tK + 1300, from, tK);
  const tDock = at(dock, tN + 2000, from, tN);
  const tL = at(label, tDock + 300, from, tDock);
  const tCh = at(chain, tL, from, tDock);
  const tC = at(close, tCh + 2000, from, tCh);
  const tA = at(amino, tC + 1300, from, tC);
  const tLO = at(labelOut, tA + 700, from, tA);
  const tCap = at(capsule, tLO + 600, from, tLO);
  const tSy = at(syringe, tCap + 1600, from, tCap);
  const tOut = at(clearOut, tSy + 650, from, tSy);
  const tR = at(rise, tOut + 180, from, tOut);
  const tP = at(plug, tR + 1000, from, tR);
  const tRL = at(rLabel, tP + 900, from, tP);
  const tS = at(signal, tRL + 1000, from, tRL);
  const tSO = at(signalOut, tS + 2100, from, tS);
  const tTA = at(tagA, tSO + 1700, from, tSO);
  const tTB = at(tagB, tTA + 1900, from, tTA);
  const vis = fadeOut(ms, to);
  if (ms < tK - 40 || vis <= 0) return null;

  // ── the ring's one continuous life: chain → closed → capsuled → lifted → plugged ──
  const curl = EASE_IO(k(tC, 640));
  const CX = 960, CY = 520;
  const PLUG_Y = 540, PLUG_S = 62 / R0;
  const toCap = EASE_IO(k(tCap, 420)); // shrinks to fit the capsule
  const lift = EASE_IO(k(tOut, 460)); // rises out of the way of the receptor
  const slam = Math.pow(k(tP, 240), 2.4); // accelerates into the socket: no ease-out, it hits
  const hit = sq(k(tP + 240, 520));
  const scale = lerp(lerp(1, 90 / R0, toCap), PLUG_S, slam);
  const y = lerp(lerp(CY, 220, lift), PLUG_Y, slam) + hit * 14;
  const closedHit = sq(k(tC + 640, 500));

  const pts = Array.from({ length: N }, (_, i) => {
    const [px, py] = beadAt(i, curl);
    return [CX + px * scale * (1 + closedHit * 0.05), y + py * scale * (1 + closedHit * 0.05)] as [number, number];
  });
  const bead = BEAD * scale;
  const links = pts.map((p, i) => (i < N - 1 ? [p, pts[i + 1]] : curl >= 0.985 ? [p, pts[0]] : null));

  // ── the name: flies in centred, travels to its corner ──
  const dQ = EASE_IO(k(tDock, 600));
  const nameS = lerp(1, 64 / 190, dQ);
  const nameX = lerp(0, -633, dQ);
  const nameY = lerp(300, 120, dQ);
  const nameOut = 1 - k(tSO, 260);
  const capQ = EASE_IO(k(tCap, 460));
  const capOut = EASE_IO(k(tOut, 360));
  const capX = lerp(760, 0, capQ) + capOut * 900;
  const capVis = ms >= tCap && ms < tOut + 360;
  const syQ = back(k(tSy, 240));
  const strike = EASE(k(tSy + 170, 200));
  const rQ = EASE(k(tR, 520));
  const fall = (i: number) => {
    const a = tS + i * 170;
    const q = Math.pow(k(a, 340), 2);
    return { y: lerp(-120, 445 - i * 62, q), o: k(a, 60), sq: sq(k(a + 340, 420)) };
  };
  const tagQ = back(k(tTA, 320));
  const tagQ2 = back(k(tTB, 320));
  const AIM = 1340; // tag seat, stage x: on screen at 1000 once the camera has trucked 340 left

  return (
    <AbsoluteFill style={{ opacity: vis, ...P3 }}>
      {ms < tDock + 200 ? (
        <div style={{ position: "absolute", left: 0, width: 1920, top: 210, textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: 60, lineHeight: 1, letterSpacing: TRACK.headline, color: COLORS.paper, opacity: k(tK, 140) * (1 - k(tDock, 180)) }}>
          {kicker.text}
        </div>
      ) : null}
      {nameOut > 0 ? (
        <div style={{ position: "absolute", left: 0, width: 1920, top: nameY, textAlign: "center", opacity: nameOut, transformOrigin: "50% 0%", transform: `translateX(${nameX}px) scale(${nameS})`, ...P3 }}>
          <FlyWord text={name.text} t={tN} size={190} color={COLORS.paper} shade="rgba(255,255,255,0.18)" stagger={36} dur={360} />
        </div>
      ) : null}

      {ms < tLO + 260 ? (
        <>
          <div style={{ position: "absolute", left: 0, width: 1920, top: 216, textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: 72, lineHeight: 1, letterSpacing: TRACK.headline, color: COLORS.paper, opacity: k(tL, 120) * (1 - k(tLO, 240)) }}>
            {label.text}
          </div>
          <div style={{ position: "absolute", left: 0, width: 1920, top: 772, textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: 72, lineHeight: 1, letterSpacing: TRACK.headline, color: COLORS.paper, opacity: k(tA, 120) * (1 - k(tLO, 240)) }}>
            {amino.text}
          </div>
        </>
      ) : null}

      {/* the wall and the receptor rise through it */}
      {ms >= tR ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <line x1={-900} y1={WALL_Y} x2={lerp(-900, 3000, rQ)} y2={WALL_Y} stroke={INK_SUB} strokeWidth={6} />
          </svg>
          <div style={{ position: "absolute", left: 0, top: lerp(380, 0, rQ), width: 1920, height: 1080, opacity: k(tR, 100) }}>
            <Receptor x={CX} y={PLUG_Y} r={86} />
          </div>
        </>
      ) : null}

      {/* the chain: links, then beads out of depth */}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {links.map((l, i) => (l ? <line key={i} x1={l[0][0]} y1={l[0][1]} x2={l[1][0]} y2={l[1][1]} stroke={COLORS.accent} strokeWidth={Math.max(5, 12 * scale)} opacity={k(tCh + i * 70 + 200, 120)} /> : null))}
      </svg>
      {pts.map((p, i) => {
        const a = tCh + i * 70;
        const q = EASE(k(a, 320));
        return <div key={i} style={{ position: "absolute", left: p[0] - bead, top: p[1] - bead, width: bead * 2, height: bead * 2, borderRadius: "50%", background: COLORS.accent, opacity: k(a, 80), transform: `${Z(lerp(1100, 0, q))}` }} />;
      })}

      {/* the capsule: two halves meet around the ring, then leave the way they came */}
      {capVis ? (
        <>
          {[-1, 1].map((d) => (
            <svg key={d} width={1920} height={1080} style={{ position: "absolute", left: d * capX, top: 0, overflow: "visible" }}>
              <path d={d < 0 ? `M 960 390 H 780 A 130 130 0 0 0 780 650 H 960` : `M 960 390 H 1140 A 130 130 0 0 1 1140 650 H 960`} fill="none" stroke={COLORS.paper} strokeWidth={10} />
            </svg>
          ))}
          <div style={{ position: "absolute", left: 0, width: 1920, top: 700, textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: 64, lineHeight: 1, letterSpacing: TRACK.headline, color: COLORS.paper, opacity: k(tCap, 120) * (1 - capOut) }}>
            {capsule.text}
          </div>
        </>
      ) : null}
      {ms >= tSy && ms < tOut + 240 ? (
        <div style={{ position: "absolute", left: 1490, top: 410, opacity: k(tSy, 70) * (1 - k(tOut, 220)), transform: `${Z(lerp(500, 0, syQ))}` }}>
          <IconSyringe size={220} color={INK_SUB} sw={2} />
          <div style={{ position: "absolute", left: -30, top: 106, width: 280 * strike, height: 8, background: COLORS.paper }} />
        </div>
      ) : null}

      {/* the signal: falls one dot at a time and stops on the plug. Landed things go still */}
      {ms >= tS && nameOut > 0 ? (
        <>
          {[0, 1, 2].map((i) => {
            const f = fall(i);
            return <div key={i} style={{ position: "absolute", left: CX - 22, top: f.y - 22, width: 44, height: 44, borderRadius: "50%", background: COLORS.paper, opacity: f.o * nameOut, transform: `scale(${1 + f.sq * 0.2}, ${1 - f.sq * 0.25})` }} />;
          })}
          <div style={{ position: "absolute", left: 1060, top: 240, fontFamily: DISPLAY, fontWeight: 700, fontSize: 56, lineHeight: 1.12, letterSpacing: TRACK.headline, color: COLORS.paper, whiteSpace: "nowrap", opacity: k(tS, 140) * nameOut }}>
            {signal.rows.map((r) => <div key={r}>{r}</div>)}
          </div>
        </>
      ) : null}

      {ms >= tRL ? (
        <div style={{ position: "absolute", left: 370, top: 552, fontFamily: DISPLAY, fontWeight: 700, fontSize: 56, lineHeight: 1, letterSpacing: TRACK.headline, color: COLORS.paper, whiteSpace: "nowrap", opacity: k(tRL, 120) }}>
          {rLabel.text}
        </div>
      ) : null}

      {/* the aim: a solid plate. The potential: dashed */}
      {ms >= tTA ? (
        <div style={{ position: "absolute", left: AIM, top: 300, width: 860, height: 130, borderRadius: 14, background: COLORS.paper, color: COLORS.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: 50, letterSpacing: TRACK.headline, whiteSpace: "nowrap", opacity: k(tTA, 80), transform: `${Z(lerp(800, 0, tagQ))}` }}>
          {tagA.text}
        </div>
      ) : null}
      {ms >= tTB ? (
        <div style={{ position: "absolute", left: AIM, top: 462, width: 860, height: 110, boxSizing: "border-box", borderRadius: 14, border: `4px dashed ${COLORS.paper}`, background: COLORS.ink, color: COLORS.paper, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: 46, letterSpacing: TRACK.headline, whiteSpace: "nowrap", opacity: k(tTB, 80), transform: `${Z(lerp(800, 0, tagQ2))}` }}>
          {tagB.text}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
