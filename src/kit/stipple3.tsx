// ─────────────────────────────────────────────────────────────────────────
// KIT · stipple3 — Lilly × Stipple Bio long-form, chunk 3 (0:57–1:25, "The platform"). V2 house style.
// SECTION SPINE (S10–S13, one ink world): a tumour-cell surface that assembles from DOTS (pointillism), is
// interrogated, then performs.
//  S10 the surface assembles from dots on "Pointillist platform"; two binders drop in and hover; on "epitopes"
//      three protein tips on the tumour cell turn red.
//  S11 the camera dives to one protein; EPITOPE prints beside its red tip; an antibody descends and clamps on.
//  S12 the camera pulls back; a healthy cell rises beside the tumour cell (white tips only); on "hit" the two
//      binders fly down onto the remaining red tips, skipping the healthy cell; STIPPLE SAYS plate prints.
//  S13 an ordinary drug flies in and docks on a healthy cell's protein; on "off-tumor" the healthy cell sags and
//      greys; OFF-TUMOR TOXICITY prints.
//  S14 Pairing (red) — one binder drops; three ink LILLY bases with different sockets rise; the binder triples and
//      a copy drops into each base (more than one modality).
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, COLORS, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { EASE, fadeOut } from "./plusone";
import { label } from "./inovio";
import { Print } from "./ryb1b";
import { useP3, useZ } from "./camera";
import { Scatter, useDropX, useSpringX } from "./v2style";
import { G_INK, G_WHITE, Puck } from "./argenx1v2b";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });
const rnd = (i: number) => { const x = Math.sin(i * 91.7 + 17.3) * 43758.5453; return x - Math.floor(x); };

/** an antibody / binder as an inverted Y: stem up, two arms reaching DOWN; (x, y) = the LEFT arm's tip */
export const YBinder: React.FC<{ x: number; y: number; s?: number; body?: string; tip?: string; rot?: number }> = ({ x, y, s = 1, body = "#ffffff", tip = COLORS.accent, rot = 0 }) => (
  <svg width={140 * s} height={160 * s} viewBox="0 0 140 160" style={{ ...abs(x - 22 * s, y - 138 * s), overflow: "visible", transformOrigin: `${22 * s}px ${138 * s}px`, transform: rot ? `rotate(${rot}deg)` : undefined }}>
    <g stroke={body} strokeWidth={22} strokeLinecap="round" fill="none"><path d="M70 14 V74 M70 74 L26 128 M70 74 L114 128" /></g>
    <circle cx={22} cy={138} r={15} fill={tip} />
    <circle cx={118} cy={138} r={15} fill={tip} />
  </svg>
);

// ══════════════════════════════════════════════════════════════════════════
// The spine geometry (stage px; the camera trucks/dives over it)
// ══════════════════════════════════════════════════════════════════════════
export const CELL = {
  top: 690, h: 290,
  tumor: { x0: 130, x1: 1010, prots: [250, 410, 570, 730, 890], epi: [0, 2, 4] },
  healthy: { x0: 1110, x1: 1830, prots: [1230, 1400, 1570, 1740] },
  stalk: 120, knobR: 34, hover: [[1190, 320], [1400, 350]] as const,
};
export const SURF_CAM = { open: 390, dive: { x: 390, y: 10, z: 700 } }; // x shift that centres the tumour cell (570 → 960)
const KNOB_Y = CELL.top - CELL.stalk - CELL.knobR + 6;
const DOTS_FACE = (c: string) => `radial-gradient(circle, ${c} 0 4px, transparent 4.8px) 0 0/26px 26px`;

const Protein: React.FC<{ x: number; red: boolean; dark?: boolean }> = ({ x, red, dark }) => (
  <>
    <div style={{ ...abs(x - 13, CELL.top - CELL.stalk), width: 26, height: CELL.stalk + 10, borderRadius: 13, background: dark ? "#6a6a6a" : "linear-gradient(90deg, #f4f4f4, #bdbdbd)" }} />
    <div style={{ ...abs(x - CELL.knobR, KNOB_Y - CELL.knobR), width: CELL.knobR * 2, height: CELL.knobR * 2, borderRadius: "50%",
      background: red ? "radial-gradient(circle at 35% 30%, #ff7a80 0%, #F4212D 55%, #a8101a 100%)" : dark ? "#7a7a7a" : "radial-gradient(circle at 35% 30%, #ffffff 0%, #e3e3e3 60%, #b0b0b0 100%)",
      boxShadow: "0 6px 12px rgba(0,0,0,0.4)" }} />
  </>
);

export const Surface: React.FC<Win & {
  platform: Cued; binders: Cued; epi: Cued; spot: Cued; attach: Cued; says: Cued; hit: Cued; sel: Cued; drug: Cued; off: Cued; tox: Cued;
}> = ({ from, to, platform, binders, epi, spot, attach, says, hit, sel, drug, off, tox }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const drop = useDropX();
  const tPl = at(platform, 57990, from);
  const tBi = at(binders, 60080, from, tPl + 1000);
  const tEp = at(epi, 61730, from, tBi + 600);
  const tSpot = at(spot, 64710, from, tEp + 1200);
  const tAt = at(attach, 66610, from, tSpot + 800);
  const tSays = at(says, 68350, from, tAt + 600);
  const tHit = at(hit, 70340, from, tSays + 900);
  const tSel = at(sel, 71270, from, tHit + 500);
  const tDrug = at(drug, 73630, from, tSel + 900) + 400; // land on "on-target" (cued on "avoid")
  const tOff = at(off, 74666, from, tDrug + 500);
  const tTox = at(tox, 75250, from, tOff + 300);
  if (ms < from || ms > to + 320) return null;

  // S10 — the tumour surface assembles from dots, then sets solid (the dots ARE its texture; nothing loops)
  const ASM = 950;
  const asm = clamp01((ms - (tPl - 500)) / ASM);
  const solid = asm >= 1;
  const T = CELL.tumor, H = CELL.healthy;
  // the two hovering binders: drop in on "binders", then (S12) fly down onto the far red tips on "hit"
  const binderIn = (i: number) => drop(tBi - 280 + i * 120, 380, 280);
  const fly = (i: number) => EASE(k(tHit - 380 + i * 130, 520));
  const flyTo = [[T.prots[0], KNOB_Y], [T.prots[4], KNOB_Y]];
  // S11 — the antibody descends onto the middle red tip and clamps
  const abP = EASE(k(tAt - 520, 520));
  const abSq = ms >= tAt ? 1 - sp(tAt, 7, 210, 0.6) : 0;
  // S12 — the healthy cell rises beside the tumour cell
  const hRise = ms < tSays - 200 ? 0 : sp(tSays - 200, 11, 160);
  // S13 — the ordinary drug flies in from the right and docks on a healthy protein; the healthy cell sags + greys
  const dP = EASE(k(tDrug - 450, 450));
  const sag = ms < tOff ? 0 : sp(tOff, 12, 140); // the healthy cell SINKS (no squash: the label and tips stay round)
  const healthyX = H.prots[1];
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {/* the tumour cell: flying dots → solid stippled slab with its proteins */}
      {!solid && asm > 0
        ? Array.from({ length: 80 }, (_, i) => {
            const tx = T.x0 + 40 + rnd(i) * (T.x1 - T.x0 - 80), ty = CELL.top + 30 + rnd(i + 200) * (CELL.h - 60);
            const sx = tx + (rnd(i + 400) - 0.5) * 2200, sy = ty - 400 - rnd(i + 600) * 900;
            const p = EASE(clamp01((asm - rnd(i + 800) * 0.35) / 0.65));
            return <div key={i} style={{ ...abs(lerp(sx, tx, p) - 7, lerp(sy, ty, p) - 7), width: 14, height: 14, borderRadius: "50%", background: COLORS.paper, transform: z(lerp(-900, 0, p)) || undefined }} />;
          })
        : null}
      {solid ? (
        <div style={{ position: "absolute", inset: 0, ...p3 }}>
          {T.prots.map((x, i) => <Protein key={x} x={x} red={ms >= tEp + (T.epi.indexOf(i) >= 0 ? T.epi.indexOf(i) * 110 : 0) && T.epi.includes(i)} />)}
          <Puck x={(T.x0 + T.x1) / 2} y={CELL.top + CELL.h / 2} w={T.x1 - T.x0} h={CELL.h} d={90} r="140px 140px 30px 30px" front={`${DOTS_FACE("#2a2a2a")}, ${G_WHITE}`} side="#8a8a8a">
            <div style={{ ...label(COLORS.ink, 32), padding: "8px 20px", borderRadius: 22, background: COLORS.paper }}>TUMOR CELL</div>
          </Puck>
        </div>
      ) : null}
      <Scatter x={(T.x0 + T.x1) / 2} y={CELL.top} t={tPl - 500 + ASM} seed={13} n={8} color={COLORS.paper} zz={60} />

      {/* the healthy cell (S12+): rises out of the floor; on "off-tumor" it sags and greys (toxicity) */}
      {hRise > 0 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${(H.x0 + H.x1) / 2}px ${CELL.top + CELL.h}px`,
          transform: `translateY(${lerp(CELL.h + 260, 0, hRise) + 36 * sag}px)` }}>
          {H.prots.map((x) => <Protein key={x} x={x} red={false} dark={sag > 0.5} />)}
          <Puck x={(H.x0 + H.x1) / 2} y={CELL.top + CELL.h / 2} w={H.x1 - H.x0} h={CELL.h} d={90} r="140px 140px 30px 30px"
            front={sag > 0.5 ? "linear-gradient(155deg, #8a8a8a 0%, #5e5e5e 60%, #3c3c3c 100%)" : "linear-gradient(155deg, #f1f1f1 0%, #d6d6d6 60%, #a9a9a9 100%)"} side="#6f6f6f">
            <div style={{ ...label(COLORS.ink, 32), padding: "8px 20px", borderRadius: 22, background: COLORS.paper }}>HEALTHY CELL</div>
          </Puck>
        </div>
      ) : null}

      {/* S11: EPITOPE callout on a white plate beside the middle red tip */}
      <div style={{ ...abs(T.prots[2] - 200, KNOB_Y - 125), transform: z(40) || undefined }}>
        {ms >= tSpot && ms < tSays ? (
          <Print t={tSpot}><div style={{ padding: "6px 14px", borderRadius: 16, background: COLORS.paper }}><div style={label(COLORS.ink, 24)}>EPITOPE</div></div></Print>
        ) : null}
      </div>
      {/* S11: the antibody descends and clamps its left arm on the middle red tip */}
      {abP > 0 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(30)}translateY(${-420 * (1 - abP)}px)` }}>
          <div style={{ position: "absolute", inset: 0, transformOrigin: `${T.prots[2]}px ${KNOB_Y - 20}px`, transform: `scale(${1 + 0.1 * abSq}, ${1 - 0.14 * abSq})` }}>
            <YBinder x={T.prots[2]} y={KNOB_Y - CELL.knobR + 4} s={0.8} />
          </div>
        </div>
      ) : null}

      {/* the two binders: hover after S10, fly onto the tumour's other red tips on "hit" (S12) */}
      {[0, 1].map((i) => {
        const b = binderIn(i);
        if (!b.on) return null;
        const f = fly(i);
        const [hx, hy] = CELL.hover[i];
        const x = lerp(hx, flyTo[i][0], f), y = lerp(hy, flyTo[i][1] - CELL.knobR + 4, f) - 160 * Math.sin(Math.PI * f);
        return (
          <div key={i} style={{ position: "absolute", inset: 0, ...p3, transform: `${z(30)}translateY(${f > 0 ? 0 : b.dy}px)` }}>
            <YBinder x={x} y={y} s={0.8} />
          </div>
        );
      })}
      {[0, 1].map((i) => <Scatter key={i} x={flyTo[i][0]} y={KNOB_Y} t={tHit - 380 + i * 130 + 520} seed={20 + i} n={5} color={COLORS.accent} zz={50} />)}
      {/* S12: the claim, attributed */}
      <div style={{ ...abs(T.x0, 90), width: T.x1 - T.x0, display: "flex", justifyContent: "center", transform: z(40) || undefined }}>
        {ms >= tSel && ms < tDrug ? (
          <Print t={tSel}><div style={{ padding: "12px 26px", borderRadius: 26, background: COLORS.paper }}><div style={label(COLORS.ink, 32)}>TUMOR CELLS ONLY · STIPPLE SAYS</div></div></Print>
        ) : null}
      </div>

      {/* S13: an ordinary drug flies in and docks on a healthy protein */}
      {dP > 0 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(30)}translate(${600 * (1 - dP)}px, ${-380 * (1 - dP)}px)` }}>
          <div style={{ position: "absolute", inset: 0, transformOrigin: `${healthyX}px ${CELL.top + CELL.h}px`, transform: `translateY(${36 * sag}px)` }}>
            <YBinder x={healthyX} y={KNOB_Y - CELL.knobR + 4} s={0.7} body="#9a9a9a" tip="#cfcfcf" />
          </div>
        </div>
      ) : null}
      <div style={{ ...abs(H.x0, 90), width: H.x1 - H.x0, display: "flex", justifyContent: "center", transform: z(40) || undefined }}>
        {ms >= tTox ? (
          <Print t={tTox}><div style={{ padding: "12px 26px", borderRadius: 26, background: COLORS.paper }}><div style={label(COLORS.ink, 32)}>OFF-TUMOR TOXICITY</div></div></Print>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S14 (red) — "Lilly will pair those binders with its own oncology technologies, across more than one modality."
// Settled: three ink LILLY bases, each holding a binder in a different-shaped socket (hero).
// ══════════════════════════════════════════════════════════════════════════
export const PAIR = { xs: [520, 960, 1400], baseY: 740, baseW: 380, baseH: 210, binderY0: 300 };
const SOCKET: React.CSSProperties[] = [
  { borderRadius: "50%" },
  { borderRadius: 12 },
  { clipPath: "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)" },
];

export const Pairing: React.FC<Win & { pair: Cued; bases: Cued; more: Cued }> = ({ from, to, pair, bases, more }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const sp = useSpringX();
  const drop = useDropX();
  const tP = at(pair, 79870, from);
  const tB = at(bases, 81550, from, tP + 800);
  const tM = at(more, 83420, from, tB + 900);
  if (ms < from || ms > to + 320) return null;

  const B = drop(tP - 320, 600, 320);
  const baseTop = PAIR.baseY - PAIR.baseH / 2;
  const tipY = baseTop - 10; // where a seated binder's arm tips rest (in the socket)
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {PAIR.xs.map((x, i) => {
        const r = ms < tB - 300 + i * 110 ? 0 : sp(tB - 300 + i * 110, 11, 170);
        if (r <= 0) return null;
        return (
          <div key={x} style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${lerp(500, 0, r)}px)` }}>
            <Puck x={x} y={PAIR.baseY} w={PAIR.baseW} h={PAIR.baseH} d={130} r={36} front={G_INK} side="#151515">
              <div style={{ position: "absolute", bottom: 22, left: 0, right: 0, textAlign: "center", ...label(COLORS.paper, 30) }}>LILLY</div>
            </Puck>
            {/* the socket on the base's top face, a different shape per modality */}
            <div style={{ ...abs(x - 70, baseTop + 22), width: 140, height: 84, background: "#050505", transform: z(66) || undefined, ...SOCKET[i] }} />
          </div>
        );
      })}
      {/* the binder: drops in centre-top on "pair"; on "more than one" it triples and each copy drops into a base */}
      {B.on
        ? PAIR.xs.map((x, i) => {
            if (i !== 1 && ms < tM) return null;
            const p = EASE(k(tM + i * 90, 560));
            const cx = lerp(960, x, i === 1 ? 1 : p);
            const ty = lerp(PAIR.binderY0, tipY, p);
            const sq = ms >= tM + i * 90 + 560 ? 1 - sp(tM + i * 90 + 560, 7, 210, 0.6) : 0;
            return (
              <div key={i} style={{ position: "absolute", inset: 0, ...p3, transform: `${z(80)}translateY(${i === 1 && ms < tM ? B.dy : 0}px)` }}>
                <div style={{ position: "absolute", inset: 0, transformOrigin: `${cx}px ${ty}px`, transform: `scale(${1 + 0.1 * sq}, ${1 - 0.14 * sq})` }}>
                  <YBinder x={cx - 58} y={ty} s={1.2} tip={COLORS.ink} />
                </div>
              </div>
            );
          })
        : null}
      {PAIR.xs.map((x, i) => <Scatter key={i} x={x} y={tipY} t={tM + i * 90 + 560} seed={30 + i} n={5} color={COLORS.paper} zz={90} />)}
    </AbsoluteFill>
  );
};
