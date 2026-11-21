// ─────────────────────────────────────────────────────────────────────────
// KIT · cgon6 — CG Oncology PIVOT-006 long-form, chunk 6 (2:49–3:09, "What to watch").
// V2 house style (MOTION-RULES §0).
//  S27 Markers    (ink)   — three numbered marker posts rise in a receding line; marker 1 flips to DEC 2.
//  S28 Fills      (paper) — callback to S18's cabinet (K2): its three empty cavities each take a red DEC 2 tag.
//  S29 TwoFilings (red)   — callback to the two binders (S24–26): they drop in; their date plates drop under them.
//  S30 NotApproval(ink)   — a FILING binder drops; the FDA plinth rises with the APPROVAL stamp resting on it.
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, useMs } from "./core";
import { at, lerp, type Cued, type Win } from "./elora";
import { fadeOut } from "./plusone";
import { label, line } from "./inovio";
import { useP3, useZ } from "./camera";
import { Scatter, useDropX, useSpringX } from "./v2style";
import { G_GREY, G_INK, G_STONE, G_WHITE, Puck } from "./argenx1v2b";
import { G_RED, shadow } from "./summit1";
import { CAB } from "./cgon4";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });

// ══════════════════════════════════════════════════════════════════════════
// S27 (ink) — "Three markers, in order. First, December 2nd:"
// Settled: three marker posts receding (hero), marker 1 reading DEC 2.
// ══════════════════════════════════════════════════════════════════════════
export const MARK = { xs: [780, 1140, 1460] as const, zs: [0, -700, -1400] as const, floor: 820, postH: 330, disc: 190 };

export const Markers: React.FC<Win & { three: Cued; dec: Cued }> = ({ from, to, three, dec }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const tThree = at(three, 169950, from);
  const tDec = at(dec, 171990, from, tThree + 900);
  if (ms < from || ms > to + 320) return null;

  const flip = ms < tDec ? 0 : sp(tDec, 10, 150);
  const top = MARK.floor - MARK.postH;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {[2, 1, 0].map((i) => {
        const p = ms < tThree + i * 150 ? 0 : sp(tThree + i * 150, 12, 160);
        if (p <= 0) return null;
        const x = MARK.xs[i];
        return (
          <div key={i} style={{ position: "absolute", inset: 0, ...p3, transform: `${z(MARK.zs[i])}translateY(${lerp(700, 0, p)}px)` }}>
            <div style={shadow(x, MARK.floor + 8, 160, 0.4)} />
            <Puck x={x} y={top + MARK.postH / 2} w={44} h={MARK.postH} d={44} r={22} front={G_GREY} side="#555" />
            <div style={{ ...abs(x - MARK.disc / 2, top - MARK.disc + 20), width: MARK.disc, height: MARK.disc, ...p3, transform: `${z(30)}rotateY(${i === 0 ? 180 * flip : 0}deg)` }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: G_WHITE, backfaceVisibility: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 12px 22px rgba(0,0,0,0.5)" }}>
                <div style={line(110, COLORS.ink)}>{i + 1}</div>
              </div>
              {i === 0 ? (
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: G_RED, backfaceVisibility: "hidden", transform: "rotateY(180deg)",
                  display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 22px rgba(0,0,0,0.5)" }}>
                  <div style={line(56, COLORS.paper)}>DEC 2</div>
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S28 (paper) — "the recurrence-free rates in each arm, the event count, and the high-grade and low-grade results
// on their own."   Settled: the S18 cabinet, every cavity holding a DEC 2 tag (hero; a three-row list, F3).
// ══════════════════════════════════════════════════════════════════════════
const ROWS = ["RECURRENCE RATES BY ARM", "EVENT COUNTS", "HIGH- / LOW-GRADE FIGURES"];

export const Fills: React.FC<Win & { r1: Cued; r2: Cued; r3: Cued }> = ({ from, to, r1, r2, r3 }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const t1 = at(r1, 174250, from);
  const t2 = at(r2, 175770, from, t1 + 700);
  const t3 = at(r3, 177080, from, t2 + 700);
  if (ms < from || ms > to + 320) return null;

  const ts = [t1, t2, t3];
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      <div style={shadow(CAB.x, CAB.y + CAB.h / 2 + 14, CAB.w * 0.95, 0.2)} />
      <Puck x={CAB.x} y={CAB.y} w={CAB.w} h={CAB.h} d={120} r={28} front={G_STONE} side="#9a9a9a" />
      {CAB.rows.map((ry, i) => {
        const p = ms < ts[i] ? 0 : sp(ts[i], 12, 150);
        return (
          <React.Fragment key={i}>
            <div style={{ ...abs(CAB.lblX - 260, ry - 30), width: 520, display: "flex", justifyContent: "flex-end", transform: z(62) || undefined }}>
              <div style={label(COLORS.ink, 30)}>{ROWS[i]}</div>
            </div>
            <div style={{ position: "absolute", inset: 0, transform: z(61) || undefined }}>
              <div style={{ ...abs(CAB.doorX - CAB.doorW / 2, ry - CAB.rowH / 2), width: CAB.doorW, height: CAB.rowH, borderRadius: 16, background: "linear-gradient(180deg,#0a0a0a,#2a2a2a)" }} />
            </div>
            {/* the DEC 2 tag slides in from the right edge and seats in the cavity (completes S18's empty hatch, K2) */}
            {p > 0 ? (
              <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(80)}translateX(${lerp(900, 0, p)}px)` }}>
                <div style={{ ...abs(CAB.doorX - 130, ry - 40), width: 260, height: 80, borderRadius: 40, background: G_RED, display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 10px 18px rgba(0,0,0,0.35)" }}>
                  <div style={line(44, COLORS.paper)}>DEC 2</div>
                </div>
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S29 (red) — "Then, the two filings, on the dates the company has set."
// Settled: the two binders (hero) / their two date plates.
// ══════════════════════════════════════════════════════════════════════════
export const TWO = { xs: [720, 1200] as const, base: 700, w: 280, h: 360, plateY: 790 };
const TWO_LBL = [["FIRST", "APPLICATION"], ["SECOND", "APPLICATION"]];
const TWO_DATE = ["BY END OF MARCH 2027", "Q2 2027"];

export const TwoFilings: React.FC<Win & { filings: Cued; dates: Cued }> = ({ from, to, filings, dates }) => {
  const ms = useMs();
  const z = useZ();
  const p3 = useP3();
  const drop = useDropX();
  const tF = at(filings, 180860, from);
  const tD = at(dates, 182170, from, tF + 800);
  if (ms < from || ms > to + 320) return null;

  const b = drop(tF - 380, 760, 380);
  const pl = drop(tD - 300, 400, 300);
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {b.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `960px ${TWO.base}px`, transform: `translateY(${b.dy}px) scale(${b.sx}, ${b.sy})` }}>
          {TWO.xs.map((x, i) => (
            <React.Fragment key={x}>
              <div style={shadow(x, TWO.base + 8, TWO.w * 1.1, 0.35)} />
              <Puck x={x} y={TWO.base - TWO.h / 2} w={TWO.w} h={TWO.h} d={80} r={20} front={G_INK} side="#151515">
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  {TWO_LBL[i].map((l) => <div key={l} style={label(COLORS.paper, 28)}>{l}</div>)}
                </div>
              </Puck>
            </React.Fragment>
          ))}
        </div>
      ) : null}
      <Scatter x={960} y={TWO.base} t={tF} seed={35} n={8} color={COLORS.paper} zz={60} />
      {pl.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(40)}translateY(${pl.dy}px)` }}>
          {TWO.xs.map((x, i) => (
            <div key={x} style={{ ...abs(x - 190, TWO.plateY - 36), width: 380, height: 72, borderRadius: 22, background: G_WHITE, display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 10px 18px rgba(0,0,0,0.3)", transformOrigin: "50% 100%", transform: `scale(${pl.sx}, ${pl.sy})` }}>
              <div style={label(COLORS.ink, 28)}>{TWO_DATE[i]}</div>
            </div>
          ))}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S30 (ink) — "And a filing is not an approval. That decision sits with the FDA."
// Settled: the FDA plinth with the APPROVAL stamp resting on it (hero) / the FILING binder beside it.
// ══════════════════════════════════════════════════════════════════════════
export const DEC = { binX: 620, plX: 1240, floor: 800, binW: 260, binH: 330, plW: 380, plH: 280 };

export const NotApproval: React.FC<Win & { not: Cued }> = ({ from, to, not }) => {
  const ms = useMs();
  const p3 = useP3();
  const drop = useDropX();
  const sp = useSpringX();
  const tIn = from + 80;
  const tNot = at(not, 185210, from, tIn + 700);
  if (ms < from || ms > to + 320) return null;

  const b = drop(tIn, 760, 380);
  const pl = ms < tNot ? 0 : sp(tNot, 12, 150);
  const plTop = DEC.floor - DEC.plH;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {b.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${DEC.binX}px ${DEC.floor}px`, transform: `translateY(${b.dy}px) scale(${b.sx}, ${b.sy})` }}>
          <div style={shadow(DEC.binX, DEC.floor + 8, DEC.binW * 1.1, 0.4)} />
          <Puck x={DEC.binX} y={DEC.floor - DEC.binH / 2} w={DEC.binW} h={DEC.binH} d={80} r={20} front={G_WHITE} side="#9a9a9a">
            <div style={line(48, COLORS.ink)}>FILING</div>
          </Puck>
        </div>
      ) : null}
      {pl > 0 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${lerp(700, 0, pl)}px)` }}>
          <div style={shadow(DEC.plX, DEC.floor + 8, DEC.plW * 1.1, 0.4)} />
          <Puck x={DEC.plX} y={plTop + DEC.plH / 2} w={DEC.plW} h={DEC.plH} d={200} r={24} front={G_STONE} side="#8a8a8a">
            <div style={line(96, COLORS.ink)}>FDA</div>
          </Puck>
          {/* the stamp rests on the FDA's plinth: base + neck + knob */}
          <Puck x={DEC.plX} y={plTop - 40} w={300} h={80} d={150} r={18} front={G_RED} side="#8f0e15">
            <div style={label(COLORS.paper, 32)}>APPROVAL</div>
          </Puck>
          <Puck x={DEC.plX} y={plTop - 110} w={50} h={70} d={50} r={14} front={G_INK} side="#111" />
          <Puck x={DEC.plX} y={plTop - 170} w={130} h={70} d={110} r={35} front={G_INK} side="#111" />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
