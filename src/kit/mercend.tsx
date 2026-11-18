// ─────────────────────────────────────────────────────────────────────────
// KIT · mercend — WHY IT MATTERS + THE SIGNAL IN ORDER. Added on the Merck × Moderna intismeran
// LONG-FORM, 2026-11-02 (HORIZONTAL 16:9).
// WhyMatters (red): a course travels to the one person it is made for; "Biology" is thrown back as
// three new questions slam in; a word-flow page for the paraphrased executive line; nine trial tiles
// deal out, the numeral flips 9 → 3 and three tiles flip over. Tiles are never assigned to tumours.
// SignalOrder (white): a marker travels a dashed rail; each stop's dashed card hinges down off the
// rail as it is voiced. Grammar: dashed = has not happened yet. Nothing on this card is a result.
// Absolute 1920×1080 seats; import by path. One mover per cue; a finished idea retires.
// ─────────────────────────────────────────────────────────────────────────

import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, DISPLAY, INK_SUB_ON_RED, TRACK, useMs } from "./core";
import { at, lerp, useK, type Cued, type Win } from "./elora";
import { useP3, useZ } from "./camera";
import { back, EASE, EASE_IO, FlipFaces } from "./plusone";
import { FlyWord, thud } from "./split";

const type = (size: number, color: string): React.CSSProperties => ({ fontFamily: DISPLAY, fontWeight: 700, fontSize: size, letterSpacing: TRACK.headline, lineHeight: 1.04, color });
const SHADE_RED = "#a8111b";

type Word = { text: string } & Cued;

export const WHY_SEAT = {
  course: { x0: 180, x1: 620, y: 500, w: 520, h: 170 },
  person: { x: 1180, y: 340, w: 380 },
  rows: { x: 410, w: 1100, h: 170, tops: [300, 490, 680] },
  grid: { x: 860, y: 190, w: 280, h: 170, gap: 20 },
};

export const WhyMatters: React.FC<Win & {
  opener: Word[]; openerOut: Cued;
  course: Word; made: Cued; title: Word[]; person: Cued; personOut: Cued;
  ifRows: Word[][]; ifEnd: Cued; ifOut: Cued;
  header: Word[]; biology: Word; biologyOut: Cued; questions: Word[]; questionsOut: Cued;
  name: Word; role: Word; line: { text: string; word?: string; ms?: number; hero?: boolean }[][]; lineOut: Cued;
  spans: Word; nine: { value: string } & Cued; nineLabel: Word & { rows: string[] };
  three: { value: string } & Cued; lit: Cued[]; litLabel: Word; lung: Word;
}> = (p) => {
  const { from } = p;
  const ms = useMs();
  const k = useK();
  const Z = useZ();
  const P3 = useP3();
  const W = COLORS.paper, INK = COLORS.ink;
  const C = WHY_SEAT.course, Pn = WHY_SEAT.person, R = WHY_SEAT.rows, G = WHY_SEAT.grid;

  const tOO = at(p.openerOut, from + 1200, from);
  const tCo = at(p.course, tOO + 500, from, tOO);
  const tMade = at(p.made, tCo + 1000, from, tCo);
  const tPer = at(p.person, tMade + 500, from, tMade);
  const tPO = at(p.personOut, tPer + 700, from, tPer);
  const tIf = at(p.ifRows[0][0], tPO + 400, from, tPO);
  const tIE = at(p.ifEnd, tIf + 1500, from, tIf);
  const tIO = at(p.ifOut, tIE + 200, from, tIE);
  const tHd = at(p.header[0], tIO + 200, from, tIO);
  const tBio = at(p.biology, tHd + 1500, from, tHd);
  const tBO = at(p.biologyOut, tBio + 450, from, tBio);
  const tQs = p.questions.map((q) => at(q, tBO + 150, from, tBO));
  const tQO = at(p.questionsOut, tQs[2] + 500, from, tQs[2]);
  const tName = at(p.name, tQO + 450, from, tQO);
  const tRole = at(p.role, tName + 400, from, tName);
  const tLO = at(p.lineOut, tRole + 4000, from, tRole);
  const tSp = at(p.spans, tLO + 500, from, tLO);
  const tNine = at(p.nine, tSp + 1300, from, tSp);
  const tNL = at(p.nineLabel, tNine + 600, from, tNine);
  const tThree = at(p.three, tNL + 1900, from, tNL);
  const tLit = p.lit.map((l, i) => at(l, tThree + 500 + i * 400, tThree, tThree)); // "Phase 3 trials" is voiced twice: search from "three"
  const tLL = at(p.litLabel, tLit[0], tThree, tThree);
  const tLung = at(p.lung, tLit[2] + 600, from, tLit[2]);
  if (ms < from - 40) return null;

  const tile = (text: string, color: string, bg: string, style: React.CSSProperties) => (
    <div style={{ position: "absolute", borderRadius: 20, background: bg, display: "flex", alignItems: "center", justifyContent: "center", whiteSpace: "nowrap", ...type(style.fontSize as number, color), ...style }}>{text}</div>
  );

  return (
    <AbsoluteFill style={P3}>
      {/* ── the question flies out of the lens and on through it ── */}
      {ms < tOO + 340 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 430, display: "flex", justifyContent: "center", gap: 30, opacity: 1 - k(tOO, 280), transform: `${Z(lerp(0, 900, EASE_IO(k(tOO, 320))))}`, ...P3 }}>
          {p.opener.map((o) => <FlyWord key={o.text} text={o.text} t={at(o, from, from)} size={140} color={W} shade={SHADE_RED} stagger={24} dur={260} />)}
        </div>
      ) : null}

      {/* ── one course travels to the one person it is made for ── */}
      {ms >= tCo - 40 && ms < tPO + 300 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - k(tPO, 260), ...(ms < tPO ? P3 : {}) }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", justifyContent: "center", gap: 28, ...P3 }}>
            {p.title.map((o) => <FlyWord key={o.text} text={o.text} t={at(o, tMade, from)} size={110} color={W} shade={SHADE_RED} stagger={18} dur={240} />)}
          </div>
          {tile(p.course.text, INK, W, { left: lerp(C.x0, C.x1, EASE_IO(k(tMade, Math.max(300, tPer - tMade)))), top: C.y + thud(k(tPer, 460)) * 14, width: C.w, height: C.h, fontSize: 68, opacity: k(tCo, 70), transform: `${Z(lerp(1100, 0, EASE(k(tCo, 300))))}` })}
          {ms >= tPer - 40 ? (
            <div style={{ position: "absolute", left: Pn.x, top: Pn.y, width: Pn.w, height: 560, transform: `translateY(${lerp(640, 0, back(k(tPer, 420)))}px)` }}>
              <div style={{ position: "absolute", left: 95, top: 0, width: 190, height: 190, borderRadius: 95, background: W }} />
              <div style={{ position: "absolute", left: 0, top: 220, width: Pn.w, height: 340, borderRadius: "170px 170px 30px 30px", background: W }} />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ── the condition: a dashed line, because it has not happened ── */}
      {ms >= tIf - 40 && ms < tIO + 340 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - k(tIO, 240), transform: `${Z(lerp(0, 900, EASE_IO(k(tIO, 300))))}`, ...P3 }}>
          {p.ifRows.map((row, i) => (
            <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 300 + i * 160, display: "flex", justifyContent: "center", gap: 34, ...P3 }}>
              {row.map((o) => <FlyWord key={o.text} text={o.text} t={at(o, tIf, from)} size={132} color={W} shade={SHADE_RED} stagger={16} dur={220} />)}
            </div>
          ))}
          <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
            <defs><clipPath id="if-line"><rect x={360} y={600} width={1200 * EASE_IO(k(tIf, Math.max(400, tIE - tIf + 200)))} height={40} /></clipPath></defs>
            <line x1={360} y1={620} x2={1560} y2={620} stroke={W} strokeWidth={8} strokeDasharray="26 20" clipPath="url(#if-line)" />
          </svg>
        </div>
      ) : null}

      {/* ── biology is thrown back; three new questions slam in ── */}
      {ms >= tHd - 40 && ms < tQO + 300 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - k(tQO, 260), ...(ms < tQO ? P3 : {}) }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", justifyContent: "center", gap: 24, ...P3 }}>
            {p.header.map((o) => <FlyWord key={o.text} text={o.text} t={at(o, tHd, from)} size={92} color={W} shade={SHADE_RED} stagger={12} dur={200} />)}
          </div>
          {ms >= tBio - 40 && ms < tBO + 460 ? tile(p.biology.text, INK, W, { left: R.x, top: R.tops[1], width: R.w, height: R.h, fontSize: 104, opacity: k(tBio, 60) * (1 - k(tBO + 180, 260)),
            transform: `${Z(lerp(lerp(1000, 0, EASE(k(tBio, 260))), -1800, EASE_IO(k(tBO, 440))))}rotateX(${lerp(0, 70, EASE_IO(k(tBO, 440)))}deg)` }) : null}
          {p.questions.map((q, i) => (ms >= tQs[i] - 40 ? (
            <div key={q.text}>{tile(q.text, INK, W, { left: R.x, top: R.tops[i] + thud(k(tQs[i] + 240, 460)) * 12, width: R.w, height: R.h, fontSize: 104, opacity: k(tQs[i], 60), transform: `${Z(lerp(1200, 0, EASE(k(tQs[i], 260))))}` })}</div>
          ) : null))}
        </div>
      ) : null}

      {/* ── the executive's line: a paraphrase, never quote marks ── */}
      {ms >= tName - 40 && ms < tLO + 300 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - k(tLO, 260), ...(ms < tLO ? P3 : {}) }}>
          <div style={{ position: "absolute", left: 180, top: 130, ...P3 }}><FlyWord text={p.name.text} t={tName} size={150} color={W} shade={SHADE_RED} stagger={22} dur={260} /></div>
          <div style={{ position: "absolute", left: 180, top: 300, ...type(56, INK_SUB_ON_RED), whiteSpace: "nowrap", opacity: k(tRole, 120), transform: `translateY(${lerp(24, 0, EASE(k(tRole, 240)))}px)` }}>{p.role.text}</div>
          {p.line.map((row, i) => (
            <div key={i} style={{ position: "absolute", left: 180, top: 450 + i * 138, display: "flex", gap: 26, ...P3 }}>
              {row.map((o) => <FlyWord key={o.text} text={o.text} t={at(o, tRole, from)} size={o.hero ? 118 : 104} color={o.hero ? W : INK_SUB_ON_RED} shade={SHADE_RED} stagger={14} dur={220} />)}
            </div>
          ))}
        </div>
      ) : null}

      {/* ── nine trials deal out; the numeral flips to three; three tiles flip over ── */}
      {ms >= tSp - 40 ? (
        <div style={{ position: "absolute", inset: 0, ...P3 }}>
          <div style={{ position: "absolute", left: 180, top: 170, ...type(56, INK_SUB_ON_RED), whiteSpace: "nowrap", opacity: k(tSp, 120) }}>{p.spans.text}</div>
          {ms >= tNine - 40 ? (
            <div style={{ position: "absolute", left: 180, top: 240, width: 300, height: 320, opacity: k(tNine, 60), transform: `${Z(lerp(1000, 0, EASE(k(tNine, 280))))}`, ...P3 }}>
              <FlipFaces flip={EASE_IO(k(tThree, 400))}
                front={<div style={{ ...type(330, W), textShadow: `6px 6px 0 ${SHADE_RED}` }}>{p.nine.value}</div>}
                back={<div style={{ ...type(330, W), textShadow: `6px 6px 0 ${SHADE_RED}` }}>{p.three.value}</div>} />
            </div>
          ) : null}
          {p.nineLabel.rows.map((r, i) => (
            <div key={r} style={{ position: "absolute", left: 180, top: 590 + i * 70, ...type(60, W), whiteSpace: "nowrap", opacity: k(tNL, 120) * (1 - k(tThree, 160)) }}>{r}</div>
          ))}
          <div style={{ position: "absolute", left: 180, top: 590, ...type(60, W), whiteSpace: "nowrap", opacity: k(tLL, 120) }}>{p.litLabel.text}</div>
          <div style={{ position: "absolute", left: 180, top: 660, ...type(60, W), whiteSpace: "nowrap", opacity: k(tLung, 100), transform: `translateY(${lerp(24, 0, EASE(k(tLung, 240)))}px)` }}>{p.lung.text}</div>

          {Array.from({ length: 9 }, (_, i) => {
            const a = tNine + i * 45;
            const col = i % 3, row = Math.floor(i / 3);
            const li = row === 2 ? col : -1;
            if (ms < a - 40) return null;
            const face = (lit: boolean) => (
              <div style={{ position: "absolute", inset: 0, borderRadius: 18, boxSizing: "border-box", border: `5px solid ${W}`, background: lit ? W : "rgba(0,0,0,0.14)", display: "flex", alignItems: "center", justifyContent: "center", ...type(58, INK), whiteSpace: "nowrap" }}>{lit ? "Phase 3" : ""}</div>
            );
            return (
              <div key={i} style={{ position: "absolute", left: G.x + col * (G.w + G.gap), top: G.y + row * (G.h + G.gap), width: G.w, height: G.h, opacity: k(a, 60), transform: `${Z(lerp(1200, 0, EASE(k(a, 280))))}`, ...P3 }}>
                <FlipFaces flip={li >= 0 ? EASE_IO(k(tLit[li], 340)) : 0} front={face(false)} back={face(true)} />
              </div>
            );
          })}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const ORDER_SEAT = { railY: 300, x0: 180, x1: 1740, xs: [430, 960, 1490], card: { w: 500, top: 370, h: 500 }, disc: 34 };

export const SignalOrder: React.FC<Win & {
  title: ({ text: string; red?: boolean } & Cued)[]; rail: Cued;
  stops: ({ n: string; go: Cued; title: Word } & Cued)[];
  chart: Cued; chartEnd: Cued; question: Word;
  noNumbers: Word; tilesLabel: string; beyond: Word;
}> = (p) => {
  const { from } = p;
  const ms = useMs();
  const k = useK();
  const Z = useZ();
  const P3 = useP3();
  const INK = COLORS.ink, RED = COLORS.accent;
  const S = ORDER_SEAT, Cd = S.card;

  const tRail = at(p.rail, from + 1200, from);
  const tGo = p.stops.map((s) => at(s.go, tRail + 500, from, tRail));
  const tArr = p.stops.map((s, i) => at(s, tGo[i] + 400, from, tGo[i]));
  const tCh = at(p.chart, tArr[0] + 1000, from, tArr[0]);
  const tChE = at(p.chartEnd, tCh + 800, from, tCh);
  const tQ = at(p.question, tChE, from, tCh);
  const tNo = at(p.noNumbers, tArr[1], from, tArr[1]);
  const tBy = at(p.beyond, tArr[2] + 1500, from, tArr[2]);
  if (ms < from - 40) return null;

  // the marker: travels one leg per spoken ordinal
  let mx = S.x0;
  tGo.forEach((g, i) => { mx = lerp(i === 0 ? S.x0 : mx, S.xs[i], EASE_IO(k(g, Math.max(200, tArr[i] - g)))); });
  const railQ = EASE_IO(k(tRail, 460));

  const chartQ = EASE_IO(k(tCh, Math.max(300, tChE - tCh)));
  const glyph = [
    <svg key="split" width={440} height={190} viewBox="0 0 440 190" style={{ display: "block" }}>
      <defs><clipPath id="order-split"><rect x={0} y={0} width={150 + 290 * chartQ} height={190} /></clipPath></defs>
      <line x1={150} y1={8} x2={150} y2={180} stroke={INK} strokeWidth={3} strokeDasharray="8 8" />
      <g clipPath="url(#order-split)" fill="none" strokeWidth={8} strokeLinecap="round">
        <path d="M6 40 L150 56 L434 150" stroke={INK} />
        <path d="M6 40 L150 56 L434 76" stroke={RED} />
      </g>
    </svg>,
    <div key="slot" style={{ width: 440, height: 170, borderRadius: 18, border: `5px dashed ${RED}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", ...type(52, RED), whiteSpace: "nowrap", opacity: k(tNo + 260, 120) }}>{p.noNumbers.text}</div>,
    <div key="tiles" style={{ display: "flex", gap: 16 }}>
      {[0, 1, 2].map((i) => {
        const a = tArr[2] + 320 + i * 160;
        return <div key={i} style={{ width: 136, height: 170, borderRadius: 16, background: INK, color: COLORS.paper, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", ...type(34, COLORS.paper), opacity: k(a, 60), transform: `translateY(${lerp(40, 0, back(k(a, 300)))}px)` }}>{p.tilesLabel}</div>;
      })}
    </div>,
  ];
  const caption = [
    { node: p.question.text, t: tQ },
    { node: "", t: 0 },
    { node: p.beyond.text, t: tBy },
  ];

  return (
    <AbsoluteFill style={P3}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 96, display: "flex", justifyContent: "center", gap: 28, ...P3 }}>
        {p.title.map((o) => <FlyWord key={o.text} text={o.text} t={at(o, from, from)} size={104} color={o.red ? RED : INK} shade={o.red ? "#b9b9b9" : "#c8c8c8"} stagger={16} dur={230} />)}
      </div>

      {/* the rail: dashed, because none of this has happened yet; the trail behind the marker is red */}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <defs>
          <clipPath id="order-rail"><rect x={S.x0} y={S.railY - 20} width={(S.x1 - S.x0) * railQ} height={40} /></clipPath>
          <clipPath id="order-trail"><rect x={S.x0} y={S.railY - 20} width={Math.max(0, mx - S.x0)} height={40} /></clipPath>
        </defs>
        <line x1={S.x0} y1={S.railY} x2={S.x1} y2={S.railY} stroke={INK} strokeWidth={6} strokeDasharray="22 16" clipPath="url(#order-rail)" />
        <line x1={S.x0} y1={S.railY} x2={S.x1} y2={S.railY} stroke={RED} strokeWidth={10} strokeDasharray="22 16" clipPath="url(#order-trail)" />
      </svg>

      {/* each dashed card hinges down off the rail as its stop is voiced */}
      {p.stops.map((s, i) => {
        if (ms < tArr[i] - 40) return null;
        const q = back(k(tArr[i], 460));
        return (
          <div key={s.n} style={{ position: "absolute", left: S.xs[i] - Cd.w / 2, top: Cd.top, width: Cd.w, height: Cd.h, boxSizing: "border-box", borderRadius: 24, border: `5px dashed ${INK}`, background: COLORS.paper, padding: "34px 28px",
            transformOrigin: "50% 0%", transform: `rotateX(${lerp(-96, 0, q)}deg)` }}>
            <div style={{ ...type(46, INK), whiteSpace: "nowrap" }}>{s.title.text}</div>
            <div style={{ marginTop: 34 }}>{glyph[i]}</div>
            {caption[i].node ? <div style={{ marginTop: 30, ...type(40, INK), opacity: k(caption[i].t, 120) }}>{caption[i].node}</div> : null}
          </div>
        );
      })}

      {/* the stops, then the marker on top of them */}
      {p.stops.map((s, i) => {
        const lit = k(tArr[i], 80);
        return (
          <div key={s.n} style={{ position: "absolute", left: S.xs[i] - S.disc, top: S.railY - S.disc + thud(k(tArr[i], 460)) * 12, width: S.disc * 2, height: S.disc * 2, borderRadius: S.disc, boxSizing: "border-box", border: `5px solid ${lit > 0.5 ? RED : INK}`, background: lit > 0.5 ? RED : COLORS.paper,
            display: "flex", alignItems: "center", justifyContent: "center", ...type(40, lit > 0.5 ? COLORS.paper : INK), opacity: railQ }}>{s.n}</div>
        );
      })}
      {ms >= tGo[0] && ms < tArr[2] + 60 ? <div style={{ position: "absolute", left: mx - S.disc, top: S.railY - S.disc, width: S.disc * 2, height: S.disc * 2, borderRadius: S.disc, background: RED, transform: `${Z(30)}` }} /> : null}
    </AbsoluteFill>
  );
};
