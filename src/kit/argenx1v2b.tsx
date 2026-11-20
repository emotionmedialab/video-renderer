// ─────────────────────────────────────────────────────────────────────────
// KIT · argenx1v2b — chunk 1 scenes 2–4 REDESIGNED for the style reset (Nel, 2026-11-16): new shapes, not just new
// motion. Same cues and timings as argenx1 (NotADrug / DealBlocks), so the v1 composition is untouched.
//  · Puck: a real rounded solid (stacked rounded layers), replacing "a rounded front face on a square box"
//    (the v2 glitch Nel flagged: square side faces poking out behind rounded corners).
//  · S2: a rounded plinth splits like trapdoor doors; the field is MACROCYCLES (rings of amino-acid beads), found by a lens.
//  · S3: argenx = a rounded tower; UNP = a domed lab building that tumbles in; the pin lands on the dome.
//  · S4: an argenx flag is thrown in an arc and plants in UNP's roof ("minority stake"); ink rises inside the lab like
//    liquid, its wave settling flat ("all the remaining shares").
// Loosened motion (PLAN.md "Style reset"): springs that stop, overlapping settles, scatter that vanishes.
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, COLORS, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { EASE, fadeOut } from "./plusone";
import { extrude, label, line } from "./inovio";
import { Print, Slam } from "./ryb1b";
import { useP3, useZ } from "./camera";
import { Scatter, useDropX, useEnt, useSpringX } from "./v2style";
import { DEAL } from "./argenx1";

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });

/** a rounded solid: `d` px thick, built from stacked rounded layers (back ones = `side`), front face = `front` + children */
export const Puck: React.FC<{ x: number; y: number; w: number; h: number; d: number; r: number | string; front: string; side: string;
  children?: React.ReactNode; clip?: boolean; style?: React.CSSProperties }> = ({ x, y, w, h, d, r, front, side, children, clip, style }) => {
  const n = Math.max(3, Math.round(d / 5));
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, transformStyle: "preserve-3d", ...style }}>
      {Array.from({ length: n }, (_, i) => (
        <div key={i} style={{ position: "absolute", inset: 0, borderRadius: r, background: side, transform: `translateZ(${-d / 2 + (i * d) / n}px)` }} />
      ))}
      <div style={{ position: "absolute", inset: 0, borderRadius: r, background: front, transform: `translateZ(${d / 2}px)`, overflow: clip ? "hidden" : undefined,
        display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
    </div>
  );
};
export const G_WHITE = "linear-gradient(155deg, #ffffff 0%, #f1f1f1 55%, #cfcfcf 100%)";
export const G_INK = "linear-gradient(155deg, #5a5a5a 0%, #3b3b3b 50%, #222 100%)";
export const G_GREY = "linear-gradient(155deg, #c4c4c4 0%, #9a9a9a 55%, #707070 100%)";
export const G_STONE = "linear-gradient(155deg, #ffffff 0%, #ececec 50%, #c8c8c8 100%)";

// ══════════════════════════════════════════════════════════════════════════
// S2 (ink) — "And what argenx is buying is not a drug. It is a way of finding them."   (cues as NotADrug)
// Settled: macrocycle field (hero) / lens / caption.
// ══════════════════════════════════════════════════════════════════════════
const PL = { cx: 960, cy: 790, w: 460, h: 120, d: 70 };
const MAC = { cols: 7, rows: 3, cell: 175, cy: 460, R: 44, beads: 9, br: 12 };
const MX0 = 960 - ((MAC.cols - 1) * MAC.cell) / 2;
const MY0 = MAC.cy - ((MAC.rows - 1) * MAC.cell) / 2;
const FOUND = { c: 4, r: 1 };
export const FOUND_XY2: [number, number] = [MX0 + FOUND.c * MAC.cell, MY0 + FOUND.r * MAC.cell];

/** one macrocycle: a ring of bead "amino acids" joined by a band */
const Macro: React.FC<{ x: number; y: number; hot: number; seed: number }> = ({ x, y, hot, seed }) => {
  const col = hot > 0 ? COLORS.accent : "#8a8a8a";
  const band = hot > 0 ? "#8f0e15" : "#4d4d4d";
  return (
    <div style={{ ...abs(x - MAC.R - MAC.br, y - MAC.R - MAC.br), width: 2 * (MAC.R + MAC.br), height: 2 * (MAC.R + MAC.br), transform: `scale(${1 + 0.18 * hot}) rotate(${seed * 23}deg)` }}>
      <div style={{ ...abs(MAC.br, MAC.br), width: MAC.R * 2, height: MAC.R * 2, borderRadius: "50%", border: `6px solid ${band}`, boxSizing: "border-box" }} />
      {Array.from({ length: MAC.beads }, (_, i) => {
        const a = (i / MAC.beads) * Math.PI * 2;
        const r = MAC.br * (i % 3 === 0 ? 1.15 : 0.9);
        return <div key={i} style={{ ...abs(MAC.R + MAC.br + Math.cos(a) * MAC.R - r, MAC.R + MAC.br + Math.sin(a) * MAC.R - r), width: r * 2, height: r * 2, borderRadius: "50%",
          background: `radial-gradient(circle at 35% 30%, #ffffff55, ${col} 60%)` }} />;
      })}
    </div>
  );
};

export const NotADrugV2: React.FC<Win & { argenx: Cued; buying: Cued; not: Cued; way: Cued }> = ({ from, to, argenx, buying, not, way }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const drop = useDropX();
  const tArg = at(argenx, 7454, from);
  const tBuy = at(buying, 8340, from, tArg + 460);
  const tNot = at(not, 9080, from, tBuy + 560);
  const tAway = tNot + 640;
  const tIt = tAway + 300;
  const tLand = at(way, 10990, from, tIt + 450 + 430);
  const tFind = tLand - 300;
  if (ms < from || ms > to + 320) return null;

  const rise = ent(tArg, 460);
  const cap = drop(tBuy - 380, 900, 380);
  const door = EASE(k(tNot, 320)); //                 the two halves swing down on outer hinges
  const capFall = k(tNot + 140, 520);
  const away = k(tAway, 300);
  const lensP = ent(tLand - 430, 430);
  const hot = sp(tLand, 8, 180);
  const capY = cap.dy + 1200 * capFall * capFall;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {/* the plinth: rises, its two halves swing open like trapdoor doors, then drop away */}
      {away < 1 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${lerp(700, 0, rise) + 900 * away * away}px)` }}>
          {[-1, 1].map((s) => (
            <div key={s} style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${PL.cx + s * PL.w / 2}px ${PL.cy - PL.h / 2}px`, transform: `rotateZ(${s * 75 * door}deg)` }}>
              <Puck x={PL.cx + (s * PL.w) / 4} y={PL.cy} w={PL.w / 2} h={PL.h} d={PL.d} r={s < 0 ? "60px 0 0 60px" : "0 60px 60px 0"} front={G_GREY} side="#4f4f4f" />
            </div>
          ))}
          {door <= 0 ? (
            <div style={{ ...abs(PL.cx - PL.w / 2, PL.cy - 22), width: PL.w, textAlign: "center", transform: z(PL.d / 2 + 2) || undefined, ...label(COLORS.paper, 38) }}>argenx is buying</div>
          ) : null}
        </div>
      ) : null}
      <Scatter x={PL.cx} y={PL.cy - PL.h / 2} t={tBuy} seed={3} />
      {/* the capsule */}
      {cap.on && capFall < 1 ? (
        <div style={{ ...abs(PL.cx - 170, PL.cy - PL.h / 2 - 120), width: 340, height: 120, borderRadius: 60, overflow: "hidden", display: "flex",
          boxShadow: extrude(9, "#7d7d7d", "rgba(0,0,0,0.5)"), transformOrigin: "50% 100%",
          transform: `${z(50)}translateY(${capY}px) rotateZ(${50 * capFall}deg) scale(${cap.sx}, ${cap.sy})` }}>
          <div style={{ flex: 1, background: "linear-gradient(180deg, #ffffff, #dcdcdc)" }} />
          <div style={{ flex: 1, background: "linear-gradient(180deg, #d6d6d6, #a9a9a9)" }} />
        </div>
      ) : null}
      {/* caption */}
      {ms < tIt ? (
        <div style={{ ...abs(0, 430), width: 1920, display: "flex", justifyContent: "center", transform: z(30) || undefined }}>
          <Print t={tNot}><div style={line(84, COLORS.paper)}>Not a drug</div></Print>
        </div>
      ) : (
        <div style={{ ...abs(0, 730), width: 1920, display: "flex", justifyContent: "center", transform: z(30) || undefined }}>
          <Print t={tFind}><div style={line(76, COLORS.paper)}>A way of finding them</div></Print>
        </div>
      )}
      {/* the macrocycle field: flies in column by column (overlapping), each ring springs flat */}
      {ms >= tIt ? (
        <div style={{ position: "absolute", inset: 0, ...p3 }}>
          {Array.from({ length: MAC.cols * MAC.rows }, (_, i) => {
            const c = i % MAC.cols, r = Math.floor(i / MAC.cols);
            const t0 = tIt + c * 45;
            if (ms < t0) return null;
            const f = sp(t0, 11, 170);
            const isF = c === FOUND.c && r === FOUND.r;
            return (
              <div key={i} style={{ position: "absolute", inset: 0, transform: `${z(lerp(-1600, 0, f))}` }}>
                <Macro x={MX0 + c * MAC.cell} y={MY0 + r * MAC.cell} hot={isF ? hot : 0} seed={i} />
              </div>
            );
          })}
        </div>
      ) : null}
      {/* the lens */}
      {ms >= tLand - 430 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(lerp(-2400, 120, lensP))}translate(${lerp(500, 0, lensP)}px, ${lerp(-300, 0, lensP)}px)` }}>
          <div style={{ ...abs(FOUND_XY2[0] + 72, FOUND_XY2[1] + 72), width: 150, height: 34, borderRadius: 17, background: "linear-gradient(180deg,#fff,#cfcfcf)", transformOrigin: "0 50%", transform: "rotate(45deg)",
            boxShadow: extrude(6, "#8a8a8a", "rgba(0,0,0,0.4)") }} />
          <div style={{ ...abs(FOUND_XY2[0] - 104, FOUND_XY2[1] - 104), width: 208, height: 208, borderRadius: "50%", border: `22px solid #f2f2f2`, boxSizing: "border-box",
            background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.18), rgba(255,255,255,0.02) 60%)", boxShadow: extrude(6, "#8a8a8a", "rgba(0,0,0,0.4)") }} />
        </div>
      ) : null}
      <Scatter x={FOUND_XY2[0]} y={FOUND_XY2[1] - 60} t={tLand} seed={21} color={COLORS.accent} zz={140} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// S3 + S4 (paper) — cues as DealBlocks.
// Settled (S3): UNP lab (hero) / argenx tower / pin + tag.  Settled (S4): the lab filled with argenx ink / flag label / fill label.
// ══════════════════════════════════════════════════════════════════════════
const BASE = 820; //                                   ground line for both buildings
const TOWER = { x: DEAL.ax, w: 480, h: 330, d: 90 };
const LAB = { x: DEAL.ux, w: 520, h: 250, d: 90, dome: 130 };
const LAB_TOP = BASE - LAB.h; //                      570 = roof line
const DOME_TOP = LAB_TOP - LAB.dome; //               440
const PAGE = { x: DEAL.ax, y: 270, w: 270, h: 250, head: 80, d: 26 };
const FLAG = { x: LAB.x - 230, top: LAB_TOP - 170 }; // planted in the roof, left of the dome

export const Flask: React.FC = () => (
  <svg width={70} height={70} viewBox="0 0 70 70">
    <path d="M26 8 H44 M30 8 V28 L14 58 Q12 64 18 64 H52 Q58 64 56 58 L40 28 V8" fill="none" stroke={COLORS.ink} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
    <path d="M20 50 H50 L54 58 Q55 61 52 61 H18 Q15 61 16 58 Z" fill={COLORS.accent} />
  </svg>
);

export const DealV2: React.FC<Win & {
  nov: Cued; ninth: Cued; argenx: Cued; immuno: Cued; vyv: Cued; agreed: Cued; unnatural: Cued; unp: Cued; santa: Cued;
  already: Cued; holds: Cued; minority: Cued; pour: Cued;
}> = ({ from, to, nov, ninth, argenx, immuno, vyv, agreed, unnatural, unp, santa, already, holds, minority, pour }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const ent = useEnt();
  const sp = useSpringX();
  const drop = useDropX();
  const tNov = at(nov, 12680, from);
  const tNinth = at(ninth, 13350, from, tNov + 520);
  const tArg = at(argenx, 13820, from, tNinth + 600);
  const tImm = at(immuno, 14630, from, tArg + 380);
  const tVyv = at(vyv, 16190, from, tImm + 400);
  const tAgreed = at(agreed, 17073, from, tVyv + 400);
  const tUnn = at(unnatural, 18220, from, tAgreed + 1040);
  const tUnp = at(unp, 20010, from, tUnn + 400);
  const tSanta = at(santa, 21280, from, tUnp + 800);
  const tAlready = at(already, 23750, from, tSanta + 600);
  const tHolds = at(holds, 24570, from, tAlready + 740);
  const tMin = at(minority, 25080, from, tHolds + 100);
  const tPour = at(pour, 27500, from, tMin + 400);
  if (ms < from || ms > to + 320) return null;

  const dateOut = EASE(k(tAgreed, 320));
  const tower = drop(tArg - 380, 1000, 380);
  const uP = ent(tUnn - 700, 700);
  const pin = drop(tSanta - 380, 700, 380);
  const pinOut = EASE(k(tAlready, 300));
  // the flag: thrown from the tower top in an arc, plants on "holds"
  const fl = clamp01((ms - (tHolds - 520)) / 520);
  const from0: [number, number] = [TOWER.x + 60, BASE - TOWER.h - 40];
  const fx = lerp(from0[0], FLAG.x, fl), fy = lerp(from0[1], FLAG.top, fl) - 260 * 4 * fl * (1 - fl);
  const spin = lerp(-300, 0, EASE(fl));
  const plant = ms >= tHolds ? 1 - sp(tHolds, 7, 220, 0.6) : 0; // wobble after planting, settles
  const fill = clamp01((ms - tPour) / 900);
  const lvl = EASE(fill);
  const wave = 18 * (1 - fill) * Math.sin(fill * Math.PI * 3); // the surface settles flat as it fills
  const thump = ms >= tHolds && ms < tHolds + 220 ? Math.sin((Math.PI * (ms - tHolds)) / 220) : 0;
  const fillH = LAB.h * lvl;
  const wavePath = (w: number) => {
    const pts = Array.from({ length: 21 }, (_, i) => `${(i / 20) * w},${(Math.sin(i * 0.9 + fill * 8) * wave).toFixed(1)}`);
    return `M0,${wave + 30} L${pts.join(" L")} L${w},${wave + 30} Z`;
  };
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {/* ground shadow line (2.5D), static */}
      <div style={{ ...abs(240, BASE + 6), width: 1440, height: 26, borderRadius: "50%", background: "rgba(0,0,0,0.12)", filter: "blur(8px)" }} />

      {/* the date page */}
      {dateOut < 1 && ms >= tNov ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${-700 * dateOut}px)` }}>
          <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${PAGE.x}px ${PAGE.y}px`,
            transform: `${z(lerp(-2200, 20, ent(tNov, 450)))}rotateX(${lerp(-160, 0, EASE(k(tNov, 450)))}deg)` }}>
            <Puck x={PAGE.x} y={PAGE.y} w={PAGE.w} h={PAGE.h} d={PAGE.d} r={18} front={G_WHITE} side="#bdbdbd" clip>
              <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: PAGE.head, background: COLORS.ink, display: "flex", alignItems: "flex-end", justifyContent: "center",
                paddingBottom: 10, boxSizing: "border-box", ...line(50, COLORS.paper) }}>NOV</div>
              <div style={{ position: "absolute", left: 0, right: 0, top: PAGE.head, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Slam t={tNinth - 200}><div style={line(160, COLORS.ink)}>9</div></Slam>
              </div>
            </Puck>
            {[0.25, 0.5, 0.75].map((f) => (
              <div key={f} style={{ ...abs(PAGE.x - PAGE.w / 2 + PAGE.w * f - 8, PAGE.y - PAGE.h / 2 - 18), width: 16, height: 36, borderRadius: 8, background: "#9a9a9a", border: "3px solid #6a6a6a",
                boxSizing: "border-box", transform: z(PAGE.d / 2 + 4) || undefined }} />
            ))}
          </div>
        </div>
      ) : null}

      {/* argenx: a rounded tower, drops and squashes */}
      {tower.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${TOWER.x}px ${BASE}px`, transform: `translateY(${tower.dy}px) scale(${tower.sx}, ${tower.sy})` }}>
          <Puck x={TOWER.x} y={BASE - TOWER.h / 2} w={TOWER.w} h={TOWER.h} d={TOWER.d} r="70px 70px 24px 24px" front={G_INK} side="#1c1c1c">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={line(92, COLORS.paper)}>argenx</div>
              <div style={{ height: 40, display: "flex" }}>
                <Print t={tImm}><div style={label("rgba(255,255,255,0.8)", 30)}>Immunology,&nbsp;</div></Print>
                <Print t={tVyv}><div style={label("rgba(255,255,255,0.8)", 30)}>maker of Vyvgart</div></Print>
              </div>
            </div>
          </Puck>
        </div>
      ) : null}
      <Scatter x={TOWER.x} y={BASE} t={tArg} seed={5} n={8} color="#3b3b3b" zz={TOWER.d / 2} />

      {/* UNP: a domed lab, tumbles in from depth */}
      {ms >= tUnn - 700 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${LAB.x}px ${BASE - LAB.h / 2}px`,
          transform: `${z(lerp(-2600, 0, uP))}translateX(${lerp(500, 0, uP)}px) rotateX(${lerp(200, 0, uP)}deg) scale(${1 + 0.04 * thump}, ${1 - 0.06 * thump})` }}>
          {/* dome */}
          <Puck x={LAB.x} y={LAB_TOP - LAB.dome / 2 + 1} w={LAB.dome * 2} h={LAB.dome} d={LAB.d - 20} r={`${LAB.dome}px ${LAB.dome}px 0 0`} front={G_STONE} side="#b0b0b0">
            <div style={{ marginTop: 30 }}><Flask /></div>
          </Puck>
          {/* body, with the rising ink inside its front face */}
          <Puck x={LAB.x} y={BASE - LAB.h / 2} w={LAB.w} h={LAB.h} d={LAB.d} r={26} front={G_STONE} side="#b0b0b0" clip>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={label("#4a4a4a", 36)}>Unnatural Products</div>
              <div style={{ height: 116 }}><Print t={tUnp}><div style={line(116, COLORS.ink)}>UNP</div></Print></div>
            </div>
            {fill > 0 ? (
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: fillH }}>
                <svg width={LAB.w} height={60} style={{ position: "absolute", left: 0, top: -30 }}><path d={wavePath(LAB.w)} fill="#2e2e2e" /></svg>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #2e2e2e, #141414)", overflow: "hidden" }}>
                  <div style={{ position: "absolute", left: 0, bottom: 0, width: LAB.w, height: LAB.h, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
                    <div style={label("rgba(255,255,255,0.8)", 36)}>All remaining shares</div>
                    <div style={line(116, COLORS.paper)}>UNP</div>
                  </div>
                </div>
              </div>
            ) : null}
          </Puck>
        </div>
      ) : null}

      {/* the pin: drops onto the dome (the one red) */}
      {pin.on && pinOut < 1 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(LAB.d / 2)}translateY(${pin.dy - 600 * pinOut}px)` }}>
          <div style={{ ...abs(LAB.x - 4, DOME_TOP - 110), width: 8, height: 112, background: COLORS.ink }} />
          <div style={{ ...abs(LAB.x - 34, DOME_TOP - 170), width: 68, height: 68, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #ff7a80, ${COLORS.accent} 60%)`,
            boxShadow: "0 8px 14px rgba(0,0,0,0.3)", transformOrigin: "50% 100%", transform: `scale(${pin.sx}, ${pin.sy})` }} />
          <div style={{ ...abs(LAB.x + 56, DOME_TOP - 172) }}>
            <Print t={tSanta + 200}><div style={{ background: COLORS.ink, borderRadius: 30, padding: "12px 24px", ...label(COLORS.paper, 34) }}>Santa Cruz, California</div></Print>
          </div>
        </div>
      ) : null}
      <Scatter x={LAB.x} y={DOME_TOP} t={tSanta} seed={7} color={COLORS.accent} zz={LAB.d / 2} />

      {/* the argenx flag: thrown in an arc from the tower, plants in UNP's roof, wobbles, settles */}
      {ms >= tHolds - 520 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: z(LAB.d / 2 + 10) || undefined }}>
          <div style={{ ...abs(fx - 4, fy), width: 8, height: 180, background: COLORS.ink, borderRadius: 4, transformOrigin: "50% 100%",
            transform: `rotate(${ms < tHolds ? spin : 12 * plant}deg)` }}>
            <div style={{ position: "absolute", left: 8, top: 0, height: 76, padding: "0 18px", borderRadius: "0 16px 16px 0", background: G_INK, display: "flex", alignItems: "center",
              whiteSpace: "nowrap", boxShadow: "0 8px 14px rgba(0,0,0,0.25)" }}>
              <div style={{ overflow: "hidden" }}>
                {ms < tMin ? <div style={label(COLORS.paper, 30)}>argenx</div> : <Print t={tMin}><div style={label(COLORS.paper, 30)}>Minority stake</div></Print>}
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <Scatter x={FLAG.x} y={LAB_TOP} t={tHolds} seed={9} color="#9a9a9a" zz={LAB.d / 2 + 12} />
    </AbsoluteFill>
  );
};
