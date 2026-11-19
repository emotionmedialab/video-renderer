// ─────────────────────────────────────────────────────────────────────────
// KIT · argenx1 — argenx × UNP long-form, chunk 1 (0:00–0:30), 16:9, 2026-11-14.
// §1 hook (red): the $550M slab FALLS and squashes; the contingent $595M is lowered on a crane cable
//   and HANGS above it (the spine: it is locked in §3 and lowered in §8). §1b (ink): a capsule lands on a
//   pedestal, the pedestal splits and drops it; a lens flies in from depth over a ring field and finds one.
// §2 (paper): argenx drops in; UNP tumbles in from depth; a pin drops on it (Santa Cruz); a stake drives
//   from argenx into UNP; ink POURS across UNP's face (all remaining shares).
// One mover at a time; landed things go still. Limits: script.md SOURCE LIMITS ("up to" on $1.15B / $595M).
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { EASE, back, fadeOut } from "./plusone";
import { Box3, CUBE_INK, extrude, label, line, useDrop, type CubeC } from "./inovio";
import { Print, Slam } from "./ryb1b";
import { useP3, useZ } from "./camera";
import { cc, KType, Scatter, useDropX, useEnt, useV2 } from "./v2style";

const WHITE: CubeC = { front: "#ffffff", side: "#cfcfcf", top: "#ececec" };
const STONE: CubeC = { front: "#e6e6e6", side: "#b4b4b4", top: "#f2f2f2" };
const GREY: CubeC = { front: "#9a9a9a", side: "#5f5f5f", top: "#b8b8b8" };
const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left, top, ...extra });

// ══════════════════════════════════════════════════════════════════════════
// §1 HOOK (red) — "$550 million in cash, up front. Up to $1.15 billion in all."
//  · 0ms      → the $550M slab falls onto the floor and squashes (lands on "$550").
//  · "cash,"  → "Cash, up front" prints on its face.
//  · pin 3650 → the $595M slab is lowered on a crane cable and STOPS above the first (lands on "Up to").
//  · "$1.15"  → a bracket draws down both slabs; "Up to $1.15B" prints beside it.
// Settled: slab stack (hero) / bracket + total label (one support) / floor.
// ══════════════════════════════════════════════════════════════════════════
export const TRANCHE = { cx: 780, w: 620, h: 210, d: 240, floor: 880, gap: 150 };
const A_CY = TRANCHE.floor - TRANCHE.h / 2; // 775
export const B_CY = A_CY - TRANCHE.h - TRANCHE.gap; // 415 — the hanging $595M
const BR_X = TRANCHE.cx + TRANCHE.w / 2 + 70;

export const HookTranche: React.FC<Win & { cash: Cued; hang: Cued; total: Cued }> = ({ from, to, cash, hang, total }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const v2 = useV2();
  const ent = useEnt();
  const drop = useDropX();
  const tCash = at(cash, 2110, from);
  const tHang = at(hang, 3650, from);
  const tTotal = at(total, 4240, from, tHang + 480);
  if (ms > to + 320) return null;

  const a = drop(from, 1100, 330);
  const down = back(k(tHang, 460));
  const bY = lerp(-900, 0, down);
  const br = EASE(k(tTotal, 500));
  const brTop = B_CY - TRANCHE.h / 2;
  const brBot = TRANCHE.floor;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {/* floor */}
      <Box3 cx={TRANCHE.cx} cy={TRANCHE.floor + 40} w={1000} h={80} d={420} c={{ front: "#b5121b", side: "#8f0e15", top: "#d8333b" }} />
      {/* $550M — lands */}
      <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${TRANCHE.cx}px ${TRANCHE.floor}px`, transform: `translateY(${a.dy}px) scale(${a.sx}, ${a.sy})` }}>
        <Box3 cx={TRANCHE.cx} cy={A_CY} w={TRANCHE.w} h={TRANCHE.h} d={TRANCHE.d} c={cc(v2, WHITE)}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={line(104, COLORS.ink)}>$550M</div>
            <div style={{ height: 44 }}><Print t={tCash}><div style={label("#5a5a5a", 40)}>Cash, up front</div></Print></div>
          </div>
        </Box3>
      </div>
      {/* $595M — lowered on the cable, hangs */}
      {ms >= tHang ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${bY}px)` }}>
          <div style={{ ...abs(TRANCHE.cx - 6, -1400), width: 12, height: 1400 + B_CY - TRANCHE.h / 2 - 34, background: COLORS.ink, transform: z(0) || undefined }} />
          <div style={{ ...abs(TRANCHE.cx - 46, B_CY - TRANCHE.h / 2 - 44), width: 92, height: 44, borderRadius: "12px 12px 0 0", background: COLORS.ink, transform: z(10) || undefined }} />
          <Box3 cx={TRANCHE.cx} cy={B_CY} w={TRANCHE.w} h={TRANCHE.h} d={TRANCHE.d} c={cc(v2, CUBE_INK)}>
            <div style={line(104, COLORS.paper)}>$595M</div>
          </Box3>
        </div>
      ) : null}
      {/* bracket + total */}
      {ms >= tTotal ? (
        <div style={{ position: "absolute", inset: 0, transform: z(TRANCHE.d / 2 + 10) || undefined }}>
          <div style={{ ...abs(BR_X, brTop), width: 10, height: (brBot - brTop) * br, background: COLORS.paper }} />
          <div style={{ ...abs(BR_X - 40, brTop), width: 50 * br, height: 10, background: COLORS.paper }} />
          {br >= 1 ? <div style={{ ...abs(BR_X - 40, brBot - 10), width: 50, height: 10, background: COLORS.paper }} /> : null}
          <div style={{ ...abs(BR_X + 44, (brTop + brBot) / 2 - 70) }}>
            <Print t={tTotal + 200}>
              <div style={label(COLORS.paper, 44)}>Up to</div>
              <div style={line(104, COLORS.paper)}>$1.15B</div>
            </Print>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// §1b (ink) — "And what argenx is buying is not a drug. It is a way of finding them."
//  · "And what" → the pedestal rises ("argenx is buying" on its face), leading "argenx".
//  · "buying"  → a capsule falls onto it and squashes.
//  · "not"     → the pedestal SPLITS; the capsule drops through and out ("Not a drug" prints, riding it).
//  · capsule gone → the two halves fall away (retire).
//  · halves gone  → a field of rings flies in from depth (lands on "It").
//  · "way of"  → a lens flies in from deep z and LANDS over one ring, which turns red as it lands (the one red);
//               "A way of finding them" prints, riding it. Lands early so it holds 1s before the §2 wipe (F6).
// Settled: ring field (hero) / lens / caption.
// ══════════════════════════════════════════════════════════════════════════
export const PED = { cx: 960, cy: 790, w: 420, h: 130, d: 260 };
const FIELD = { cols: 7, rows: 3, cell: 160, cy: 470, r: 50 };
const CAPTION_Y = 730;
const NOT_Y = 430; // above the pedestal; at the "not" crane-down (y -140) it reads at ~290, not jammed into the top edge (Nel, 11-14) // below the field: stays in frame at the push-in (top caption cropped on board v1)
const FIELD_X0 = 960 - ((FIELD.cols - 1) * FIELD.cell) / 2;
const FIELD_Y0 = FIELD.cy - ((FIELD.rows - 1) * FIELD.cell) / 2;
const FOUND = { c: 4, r: 1 };
export const FOUND_XY: [number, number] = [FIELD_X0 + FOUND.c * FIELD.cell, FIELD_Y0 + FOUND.r * FIELD.cell];

export const NotADrug: React.FC<Win & { argenx: Cued; buying: Cued; not: Cued; way: Cued }> = ({
  from, to, argenx, buying, not, way,
}) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const v2 = useV2();
  const ent = useEnt();
  const drop = useDropX();
  const tArg = at(argenx, 7454, from);
  const tBuy = at(buying, 8340, from, tArg + 460);
  const tNot = at(not, 9080, from, tBuy + 560);
  const tAway = tNot + 640; //            the capsule is out of frame
  const tIt = tAway + 300; //              field flight starts as the halves are gone
  const tLand = at(way, 10990, from, tIt + 450 + 430); // lens lands here
  const tFind = tLand - 300; //            caption prints on "way"
  if (ms < from || ms > to + 320) return null;

  const rise = ent(tArg, 460);
  const cap = drop(tBuy - 380, 900, 380);
  const split = EASE(k(tNot, 300));
  const capFall = k(tNot + 120, 520);
  const away = k(tAway, 300);
  const fieldIn = ent(tIt, 450);
  const lensP = ent(tLand - 430, 430);
  const red = ms >= tLand;
  const capY = cap.dy + 1200 * capFall * capFall;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {/* pedestal: rises, splits, falls away */}
      {away < 1 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${lerp(700, 0, rise) + 900 * away * away}px)` }}>
          {[-1, 1].map((s) => (
            <div key={s} style={{ position: "absolute", inset: 0, ...p3, transform: `translateX(${s * 260 * split}px)` }}>
              <Box3 cx={PED.cx + (s * PED.w) / 4} cy={PED.cy} w={PED.w / 2} h={PED.h} d={PED.d} c={cc(v2, GREY)} />
            </div>
          ))}
          {split <= 0 ? (
            <div style={{ ...abs(PED.cx - PED.w / 2, PED.cy - 22), width: PED.w, textAlign: "center", transform: z(PED.d / 2 + 2) || undefined, ...label(COLORS.paper, 38) }}>argenx is buying</div>
          ) : null}
        </div>
      ) : null}
      <Scatter x={PED.cx} y={PED.cy - PED.h / 2} t={tBuy} seed={3} />
      {/* the capsule */}
      {cap.on && capFall < 1 ? (
        <div style={{ ...abs(PED.cx - 170, PED.cy - PED.h / 2 - 120), width: 340, height: 120, borderRadius: 60, overflow: "hidden", display: "flex",
          boxShadow: extrude(9, "#7d7d7d", "rgba(0,0,0,0.5)"), transformOrigin: "50% 100%",
          transform: `${z(40)}translateY(${capY}px) rotateZ(${50 * capFall}deg) scale(${cap.sx}, ${cap.sy})` }}>
          <div style={{ flex: 1, background: COLORS.paper }} />
          <div style={{ flex: 1, background: "#c9c9c9" }} />
        </div>
      ) : null}
      {/* caption: "Not a drug" → "A way of finding them" */}
      {ms < tIt ? (
        <div style={{ ...abs(0, NOT_Y), width: 1920, display: "flex", justifyContent: "center", transform: z(30) || undefined }}>
          <Print t={tNot}><div style={line(84, COLORS.paper)}>Not a drug</div></Print>
        </div>
      ) : (
        <div style={{ ...abs(0, CAPTION_Y), width: 1920, display: "flex", justifyContent: "center", transform: z(30) || undefined }}>
          <Print t={tFind}><div style={line(76, COLORS.paper)}>A way of finding them</div></Print>
        </div>
      )}
      {/* the ring field */}
      {ms >= tIt ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: z(lerp(-1800, 0, fieldIn)) || `scale(${lerp(0.4, 1, fieldIn)})` }}>
          {Array.from({ length: FIELD.cols * FIELD.rows }, (_, i) => {
            const c = i % FIELD.cols, r = Math.floor(i / FIELD.cols);
            const isF = c === FOUND.c && r === FOUND.r;
            const col = isF && red ? COLORS.accent : "#8a8a8a";
            return (
              <div key={i} style={{ ...abs(FIELD_X0 + c * FIELD.cell - FIELD.r, FIELD_Y0 + r * FIELD.cell - FIELD.r), width: FIELD.r * 2, height: FIELD.r * 2, borderRadius: "50%",
                border: `16px solid ${col}`, boxSizing: "border-box", boxShadow: extrude(5, isF && red ? "#8f0e15" : "#4a4a4a", "rgba(0,0,0,0.4)") }} />
            );
          })}
        </div>
      ) : null}
      {/* the lens */}
      {ms >= tLand - 430 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(lerp(-2400, 120, lensP))}translate(${lerp(500, 0, lensP)}px, ${lerp(-300, 0, lensP)}px)` }}>
          <div style={{ ...abs(FOUND_XY[0] + 70, FOUND_XY[1] + 70), width: 150, height: 34, borderRadius: 17, background: COLORS.paper, transformOrigin: "0 50%", transform: "rotate(45deg)",
            boxShadow: extrude(6, "#8a8a8a", "rgba(0,0,0,0.4)") }} />
          <div style={{ ...abs(FOUND_XY[0] - 100, FOUND_XY[1] - 100), width: 200, height: 200, borderRadius: "50%", border: `22px solid ${COLORS.paper}`, boxSizing: "border-box",
            boxShadow: extrude(6, "#8a8a8a", "rgba(0,0,0,0.4)") }} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// §2 THE DEAL (paper) — "On November 9th, argenx, the immunology company behind Vyvgart, agreed to acquire
// Unnatural Products, or UNP, a biotech in Santa Cruz, California. argenx already holds a minority stake in
// UNP. Now it will buy all the remaining shares."
//  · "On November" → a desk-calendar page (rings, NOV header) flies in from depth, tumbling, and lands.
//  · "9th,"        → a huge 9 slams onto the page (lands on the word).
//                     (split-flaps → plate → month grid → this page: Nel, 11-14)
//                             · "argenx," → the argenx block drops and squashes.
//  · "immunology"  → "Immunology" prints.     · "Vyvgart," → "Maker of Vyvgart" prints.
//  · "agreed"      → the date leaves upward.  · pin (lands on "Unnatural") → UNP tumbles in from depth.
//  · "UNP,"        → "UNP" prints big.        · pin (lands on "Santa") → a red pin drops onto UNP; its tag prints.
//  · "argenx already" → pin + tag leave (done before the stake starts).         · pin (lands on "holds") → a stake drives from argenx into UNP.
//  · "minority"    → "Minority stake" prints ON the stake.
//  · pin 27500     → ink POURS across UNP's face; "All remaining shares" is revealed in the pour.
// Settled (scene 3): UNP (hero) / argenx / pin+tag.  Settled (scene 4): joined blocks / stake label / pour label.
// ══════════════════════════════════════════════════════════════════════════
export const DEAL = { ax: 560, ux: 1360, cy: 650, w: 540, h: 320, d: 300 };
const TOP = DEAL.cy - DEAL.h / 2;
const PAGE = { x: 560 - 135, y: 150, w: 270, h: 250, head: 80, d: 26 }; // centred over argenx = frame centre in the opening pose ("make the date centered", Nel 11-15); bottom 400, argenx top 490 ("too close", 11-14)

export const DealBlocks: React.FC<Win & {
  nov: Cued; ninth: Cued; argenx: Cued; immuno: Cued; vyv: Cued; agreed: Cued; unnatural: Cued; unp: Cued; santa: Cued;
  already: Cued; holds: Cued; minority: Cued; pour: Cued;
}> = ({ from, to, nov, ninth, argenx, immuno, vyv, agreed, unnatural, unp, santa, already, holds, minority, pour }) => {
  const ms = useMs();
  const k = useK();
  const z = useZ();
  const p3 = useP3();
  const v2 = useV2();
  const ent = useEnt();
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
  const a = drop(tArg - 380, 1000, 380);
  const uP = ent(tUnn - 700, 700);
  const pin = drop(tSanta - 380, 700, 380);
  const pinOut = EASE(k(tAlready, 300));
  const stake = ent(tHolds - 400, 400);
  const fill = EASE(k(tPour, 800));
  const thump = ms >= tHolds && ms < tHolds + 200 ? Math.sin((Math.PI * (ms - tHolds)) / 200) : 0;
  return (
    <AbsoluteFill style={{ opacity: fadeOut(ms, to + 300), ...p3 }}>
      {/* the date: a desk-calendar page flies in from depth; the 9 slams on "9th" */}
      {dateOut < 1 && ms >= tNov ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `translateY(${-700 * dateOut}px)` }}>
          <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${PAGE.x + PAGE.w / 2}px ${PAGE.y + PAGE.h / 2}px`,
            transform: `${z(lerp(-2200, 20, ent(tNov, 450)))}rotateX(${lerp(-160, 0, back(k(tNov, 450)))}deg)` }}>
            <Box3 cx={PAGE.x + PAGE.w / 2} cy={PAGE.y + PAGE.h / 2} w={PAGE.w} h={PAGE.h} d={PAGE.d} c={cc(v2, WHITE)} radius={16}>
              <div style={{ position: "absolute", inset: 0, borderRadius: 16, boxShadow: "inset 0 0 0 3px #d6d6d6" }}>
                <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: PAGE.head, borderRadius: "16px 16px 0 0", background: COLORS.ink,
                  display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 10, boxSizing: "border-box", ...line(50, COLORS.paper) }}>NOV</div>
                {[0.25, 0.5, 0.75].map((f) => (
                  <div key={f} style={{ ...abs(PAGE.w * f - 8, -18), width: 16, height: 36, borderRadius: 8, background: "#9a9a9a", border: "3px solid #6a6a6a", boxSizing: "border-box" }} />
                ))}
                <div style={{ position: "absolute", left: 0, right: 0, top: PAGE.head, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Slam t={tNinth - 200}><div style={line(160, COLORS.ink)}>9</div></Slam>
                </div>
              </div>
            </Box3>
          </div>
        </div>
      ) : null}

      {/* argenx */}
      {a.on ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${DEAL.ax}px ${DEAL.cy + DEAL.h / 2}px`, transform: `translateY(${a.dy}px) scale(${a.sx}, ${a.sy})` }}>
          <Box3 cx={DEAL.ax} cy={DEAL.cy} w={DEAL.w} h={DEAL.h} d={DEAL.d} c={cc(v2, CUBE_INK)} radius={v2 ? 30 : 0}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={line(96, COLORS.paper)}>argenx</div>
              {/* one row, printed in two cued halves (one support) */}
              <div style={{ height: 40, display: "flex" }}>
                <Print t={tImm}><div style={label("rgba(255,255,255,0.78)", 34)}>Immunology,&nbsp;</div></Print>
                <Print t={tVyv}><div style={label("rgba(255,255,255,0.78)", 34)}>maker of Vyvgart</div></Print>
              </div>
            </div>
          </Box3>
        </div>
      ) : null}

      <Scatter x={DEAL.ax} y={DEAL.cy + DEAL.h / 2} t={tArg} seed={5} n={8} color="#3b3b3b" />
      <Scatter x={DEAL.ux} y={TOP} t={tSanta} seed={7} color={COLORS.accent} zz={DEAL.d / 2} />
      <Scatter x={DEAL.ux - DEAL.w / 2} y={DEAL.cy + 40} t={tHolds} seed={9} color="#9a9a9a" />
      {/* the stake: drives from argenx into UNP's side */}
      {ms >= tHolds - 400 ? (
        <div style={{ position: "absolute", inset: 0, ...p3 }}>
          <Box3 cx={DEAL.ax + DEAL.w / 2 + lerp(0, 130, stake)} cy={DEAL.cy + 40} w={lerp(20, 300, stake)} h={92} d={80} c={cc(v2, GREY)}>
            <div style={{ height: 40, overflow: "hidden" }}><Print t={tMin}><div style={label(COLORS.paper, 32)}>Minority stake</div></Print></div>
          </Box3>
        </div>
      ) : null}

      {/* UNP: tumbles in from depth */}
      {ms >= tUnn - 700 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transformOrigin: `${DEAL.ux}px ${DEAL.cy}px`,
          transform: `${z(lerp(-2600, 0, uP))}translateX(${lerp(500, 0, uP)}px) rotateX(${lerp(200, 0, uP)}deg) scaleX(${1 - 0.05 * thump})` }}>
          <Box3 cx={DEAL.ux} cy={DEAL.cy} w={DEAL.w} h={DEAL.h} d={DEAL.d} c={cc(v2, STONE)}>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <div style={label("#4a4a4a", 40)}>Unnatural Products</div>
              <div style={{ height: 120 }}><Print t={tUnp}><div style={line(120, COLORS.ink)}>UNP</div></Print></div>
            </div>
            {/* the pour: ink fills from the stake side */}
            {fill > 0 ? (
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${100 * fill}%`, overflow: "hidden", background: "#3b3b3b" }}>
                <div style={{ position: "absolute", left: 0, top: 0, width: DEAL.w, height: DEAL.h, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <div style={label("rgba(255,255,255,0.78)", 40)}>All remaining shares</div>
                  <div style={line(120, COLORS.paper)}>UNP</div>
                </div>
              </div>
            ) : null}
          </Box3>
        </div>
      ) : null}

      {/* the pin: drops onto UNP's top (the one red) */}
      {pin.on && pinOut < 1 ? (
        <div style={{ position: "absolute", inset: 0, ...p3, transform: `${z(DEAL.d / 4)}translateY(${pin.dy - 600 * pinOut}px)` }}>
          <div style={{ ...abs(DEAL.ux - 4, TOP - 110), width: 8, height: 110, background: COLORS.ink }} />
          <div style={{ ...abs(DEAL.ux - 34, TOP - 170), width: 68, height: 68, borderRadius: "50%", background: COLORS.accent, boxShadow: extrude(6, "#8f0e15", "rgba(0,0,0,0.3)") }} />
          <div style={{ ...abs(DEAL.ux + 60, TOP - 172) }}>
            <Print t={tSanta + 200}><div style={{ background: COLORS.ink, borderRadius: 12, padding: "12px 22px", ...label(COLORS.paper, 36) }}>Santa Cruz, California</div></Print>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
