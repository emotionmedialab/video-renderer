// ─────────────────────────────────────────────────────────────────────────
// KIT · notfirst — THE FLIGHT DOWN THE TRACK. Added on the Gilead × PepStar LONG-FORM,
// 2026-11-02 (HORIZONTAL 16:9), after Nel called the flat two-row scene "kinda boring".
// Absolute 1920×1080 seats; import by path. White-card world, real depth.
//
// `NotFirst`: two lanes on a floor that recedes 6000px. "Not first" stands over HCXT-2001 at the
// near end. On "In March" the camera FLIES 4000px down the lanes, through the words and through
// a "March" gate, to Icotyde standing at the far end. There its ring flies into the same
// receptor. On "Gilead" the camera whips ALL the way back: HCXT-2001 huge in front, Icotyde a tiny
// shape far up the other lane. The distance on screen IS "not first". Schematic, no scale.
//
// The camera (in the composition) must end its flight at x +NF_X, z +NF_Z and return to x -NF_X, z 0.
// Limits: Icotyde is approved in plaque psoriasis only. Extended half-life is Gilead's description.
// ─────────────────────────────────────────────────────────────────────────

import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, DISPLAY, TRACK, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { useP3, useZ } from "./camera";
import { back, EASE, EASE_IO, fadeOut } from "./plusone";
import { FlyWord } from "./split";
import { BeadRing, Capsule } from "./secondpill";
import { Receptor } from "./thering";

type Txt = { text: string } & Cued;
const sq = (t: number) => (t <= 0 || t >= 1 ? 0 : Math.exp(-5 * t) * Math.sin(11 * t));
const line = (size: number, color: string, weight = 700): React.CSSProperties => ({ fontFamily: DISPLAY, fontWeight: weight, fontSize: size, lineHeight: 1, letterSpacing: TRACK.headline, color, whiteSpace: "nowrap" });

export const NF_X = 300;
export const NF_Z = 4000;
const FLOOR_Y = 770;
const LANES = [660, 1260];
const FAR = -NF_Z; // the far group's depth: at scale 1 once the camera has flown

export const NotFirst: React.FC<Win & {
  claim: Txt; // "Not first"
  sub: Txt; // "to an oral drug on this pathway"
  fly: Cued; // the camera leaves
  gate: { text: string }; // stands mid-flight
  stamp: Txt; // "FDA approved"
  jj: Txt; // "Johnson & Johnson"
  name: Txt; // "Icotyde"
  spec: Txt; // "Once-daily oral peptide"
  launch: Cued; // the ring leaves the capsule; the receptor rises
  plug: Cued; // the ring slams in
  rLabel: Txt; // "Same IL-23 receptor"
  use: Txt; // "Plaque psoriasis" plate
  clearOut: Cued; // receptor, ring, labels leave (a pin inside the pause)
  back: Cued; // the camera whips back to HCXT-2001
  half: Txt; // "Extended half-life"
  by: { text: string }; // attribution, lands with it
  hcxt: { text: string };
}> = ({ from, to, claim, sub, fly, gate, stamp, jj, name, spec, launch, plug, rLabel, use, clearOut, back: whip, half, by, hcxt }) => {
  const ms = useMs();
  const k = useK();
  const Z = useZ();
  const P3 = useP3();
  const INK = COLORS.ink;
  const GRAY = COLORS.grayText;

  const tC = at(claim, from, from);
  const tSub = at(sub, tC + 650, from, tC);
  const tF = at(fly, tSub + 2200, from, tSub);
  const tSt = at(stamp, tF + 1050, from, tF);
  const tJ = at(jj, tSt + 570, from, tSt);
  const tN = at(name, tJ + 1200, from, tJ);
  const tSp = at(spec, tN + 900, from, tN);
  const tL = at(launch, tSp + 1700, from, tSp);
  const tP = at(plug, tL + 800, from, tL);
  const tRL = at(rLabel, tP, from, tL);
  const tU = at(use, tRL + 1700, from, tRL);
  const tCl = at(clearOut, tU + 1300, from, tU);
  const tB = at(whip, tCl + 300, from, tCl);
  const tH = at(half, tB + 3500, from, tB);
  const vis = fadeOut(ms, to);
  if (ms < from - 40 || vis <= 0) return null;

  const clear = 1 - k(tCl, 220);
  const flyT = k(tL, tP - tL);
  const ringP = Math.pow(flyT, 2);
  const ringX = lerp(620 - NF_X, 1380 - NF_X, EASE_IO(flyT));
  const ringY = lerp(650, 560, ringP) - Math.sin(flyT * Math.PI) * 220;
  const hit = sq(k(tP, 480));
  const sockQ = EASE(k(tL, 420));
  const hcxtPop = back(k(tB + 430, 340));
  const halfQ = back(k(tH, 520));
  const groupFar: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `${Z(FAR)}`, ...P3 };
  const stripe = `repeating-linear-gradient(0deg, ${INK} 0 14px, ${COLORS.panel} 14px 300px)`;

  return (
    <AbsoluteFill style={{ opacity: vis, ...P3 }}>
      {/* the floor: two lanes receding 6000px. The stripes are what make the flight read as speed */}
      {LANES.map((x) => (
        <div key={x} style={{ position: "absolute", left: x - 180, top: FLOOR_Y, width: 360, height: 6000, background: stripe, borderLeft: `8px solid ${INK}`, borderRight: `8px solid ${INK}`, boxSizing: "border-box", transformOrigin: "50% 0%", transform: `${Z(-5200)}rotateX(90deg)` }} />
      ))}

      {/* the near end: the camera flies straight through these words */}
      {ms < tF + 1100 ? (
        <>
          <div style={{ position: "absolute", left: 0, width: 1920, top: 150, textAlign: "center", ...P3 }}>
            <FlyWord text={claim.text} t={tC} size={250} color={INK} shade="rgba(0,0,0,0.12)" stagger={22} dur={300} />
          </div>
          <div style={{ ...line(70, INK), position: "absolute", left: 0, width: 1920, textAlign: "center", top: 430, opacity: k(tSub, 140) }}>{sub.text}</div>
        </>
      ) : null}

      {/* HCXT-2001 waits at the near end of its lane: it is there at the start and at the end */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: k(tC, 120), transform: `${Z(200)} scale(${ms >= tB ? hcxtPop : 1})`, transformOrigin: `${LANES[1]}px 660px` }}>
        <Capsule x={LANES[1]} y={660} w={300} color={INK} />
        <BeadRing x={LANES[1]} y={660} r={38} color={COLORS.accent} />
        {ms >= tB + 300 ? <div style={{ ...line(56, INK), position: "absolute", left: LANES[1] - 300, width: 600, textAlign: "center", top: 492, opacity: k(tB + 430, 160) }}>{hcxt.text}</div> : null}
      </div>

      {/* the gate the camera flies through, mid-track */}
      {ms >= tF && ms < tF + 1500 ? (
        <div style={{ ...line(280, INK), position: "absolute", left: LANES[0] - 600, width: 1200, textAlign: "center", top: 360, transform: `${Z(-2400)}` }}>{gate.text}</div>
      ) : null}

      {/* the far end: everything here sits at scale 1 once the flight lands. x is written as screen x − NF_X */}
      <div style={groupFar}>
        {ms >= tSt ? <div style={{ ...line(66, COLORS.paper), position: "absolute", left: 620 - NF_X - 240, width: 480, height: 96, top: 84, borderRadius: 12, background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", opacity: k(tSt, 70), transform: `${Z(lerp(700, 0, back(k(tSt, 300))))}` }}>{stamp.text}</div> : null}
        {ms >= tN ? (
          <div style={{ position: "absolute", left: 620 - NF_X - 480, width: 960, top: 200, textAlign: "center", ...P3 }}>
            <FlyWord text={name.text} t={tN} size={150} color={INK} shade="rgba(0,0,0,0.12)" stagger={24} dur={260} />
          </div>
        ) : null}
        {ms >= tJ ? <div style={{ ...line(52, GRAY), position: "absolute", left: 620 - NF_X - 480, width: 960, textAlign: "center", top: 366, opacity: k(tJ, 120) * clear }}>{jj.text}</div> : null}
        <div style={{ opacity: k(tF, 100) }}><Capsule x={620 - NF_X} y={650} w={520} color={INK} sw={12} /></div>
        {ms < tL ? <div style={{ opacity: k(tF, 100) }}><BeadRing x={620 - NF_X} y={650} r={70} color={INK} /></div> : null}

        {ms >= tSp && ms < tL + 220 ? <div style={{ ...line(60, INK), position: "absolute", left: 1000 - NF_X, top: 340, opacity: k(tSp, 120) * (1 - k(tL, 200)) }}>{spec.text}</div> : null}

        {ms >= tL && clear > 0 ? (
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: clear }}>
            <div style={{ position: "absolute", left: 0, top: lerp(420, 0, sockQ), width: 1920, height: 1080, opacity: k(tL, 100) }}>
              <Receptor x={1380 - NF_X} y={560} r={86} color={INK} />
            </div>
            <div style={{ position: "absolute", left: 0, top: hit * 12, width: 1920, height: 1080 }}>
              <BeadRing x={ringX} y={ringY} r={lerp(70, 62, flyT)} color={INK} />
            </div>
            {ms >= tRL ? <div style={{ ...line(62, INK), position: "absolute", left: 1380 - NF_X - 400, width: 800, textAlign: "center", top: 300, opacity: k(tRL, 120) }}>{rLabel.text}</div> : null}
            {ms >= tU ? <div style={{ ...line(60, COLORS.paper), position: "absolute", left: 1380 - NF_X - 280, width: 560, height: 96, top: 84, borderRadius: 12, background: INK, display: "flex", alignItems: "center", justifyContent: "center", opacity: k(tU, 70), transform: `${Z(lerp(700, 0, back(k(tU, 300))))}` }}>{use.text}</div> : null}
          </div>
        ) : null}
      </div>

      {/* back at the near end: the word stretches as it is spoken */}
      {ms >= tH ? (
        <div style={{ position: "absolute", left: LANES[1] - 800, width: 1600, top: 150, textAlign: "center" }}>
          <div style={{ ...line(116, INK), display: "inline-block", opacity: k(tH, 70), transformOrigin: "50% 50%", transform: `scaleX(${lerp(0.45, 1, halfQ)})` }}>{half.text}</div>
          <div style={{ ...line(50, GRAY), marginTop: 18, opacity: k(tH + 120, 120) }}>{by.text}</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
