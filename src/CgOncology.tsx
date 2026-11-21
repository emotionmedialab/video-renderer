// CG Oncology PIVOT-006 — 16:9 long-form (The Catalyst Brief, 2026-11-21). V2 house style, 3D camera on.
// Cues are spoken WORDS (timeline.words[]); ms appear only as fallbacks inside the kit blocks.
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import timeline from "./timeline.json";
import { BRAND, COLORS, MUSIC } from "./style";
import { MusicBed } from "./kit/core";
import { BroadcastFrame, World, type SectionDef, type WorldDef } from "./kit/world";
import { Camera } from "./kit/camera";
import { LiquidWipe, V2 } from "./kit/v2style";
import { FinishGate, RiskCut, Scope, SCOPE_SHIFT, SealedFile } from "./kit/cgon1";
import { CarriesGene, DrugIn, GENE_OPEN_X, NotApproved, Replicate, TrialWall } from "./kit/cgon2";
import { Crowd, Enrolled, Randomize, WallRegrow } from "./kit/cgon3";
import { Drawers, Jars, Months, MONTHS_OPEN_X, Pillars, Ratio, Track, TRACK_OPEN_X } from "./kit/cgon4";
import { COIN_OPEN_X, DecCoin, Filings, OneProp, ReadSign, Watching } from "./kit/cgon5";
import { Fills, Markers, NotApproval, TwoFilings } from "./kit/cgon6";
import { CTACard, FootageScrim } from "./kit/blocks";

export const CAMERA_3D = true;

const SECTIONS: SectionDef[] = timeline.sections.map((s, i) => ({ index: i, title: s.title, startMs: s.startMs }));

// world boundaries = scene boundaries (ms of the opening word)
const W = { s2: 8400, s3: 16220, s4: 26450, sec2: 30460, s6: 37400, s7: 43820, s8: 49240, sec3: 51450, s10: 63850, s11: 68120, s12: 76160, s13: 82050, sec4: 88960, s15: 96280, s16: 99260, sec5: 107500, s18: 113160, s19: 120420, sec6: 124800, s21: 127900, s22: 133500, s23: 139000, s24: 144100, sec7: 169450, s28: 173350, s29: 180320, s30: 183850, cta: 189080 };
const WORLDS: WorldDef[] = [
  { fromMs: 0, bg: "ink" },
  { fromMs: W.s2, bg: "paper" },
  { fromMs: W.s3, bg: "red" },
  { fromMs: W.s4, bg: "ink" },
  { fromMs: W.sec2, bg: "ink", section: true },
  { fromMs: W.s6, bg: "paper" },
  { fromMs: W.s7, bg: "red" },
  { fromMs: W.s8, bg: "ink" },
  { fromMs: W.sec3, bg: "paper", section: true },
  { fromMs: W.s10, bg: "ink" },
  { fromMs: W.s11, bg: "paper" },
  { fromMs: W.s12, bg: "red" },
  { fromMs: W.s13, bg: "ink" },
  { fromMs: W.sec4, bg: "ink", section: true },
  { fromMs: W.s15, bg: "paper" },
  { fromMs: W.s16, bg: "red" },
  { fromMs: W.sec5, bg: "ink", section: true },
  { fromMs: W.s18, bg: "paper" },
  { fromMs: W.s19, bg: "red" },
  { fromMs: W.sec6, bg: "paper", section: true },
  { fromMs: W.s21, bg: "ink" },
  { fromMs: W.s22, bg: "red" },
  { fromMs: W.s23, bg: "ink" },
  { fromMs: W.s24, bg: "paper" },
  { fromMs: W.sec7, bg: "ink", section: true },
  { fromMs: W.s28, bg: "paper" },
  { fromMs: W.s29, bg: "red" },
  { fromMs: W.s30, bg: "ink" },
  { fromMs: W.cta, bg: "paper", section: true },
];

export const CgOncology: React.FC = () => (
  <V2.Provider value>
    <AbsoluteFill style={{ backgroundColor: COLORS.ink }}>
      {/* ── §1 The readout ── */}
      <World fromMs={0} bg="ink" lineArt={false}>
        <Camera on={CAMERA_3D} keys={[{ at: 1090, dur: 700, y: 40 }, { at: 5060, dur: 800, z: 150 }]}>
          <RiskCut from={0} to={W.s2} drug={{ word: "bladder cancer drug" }} cut={{ word: "cut the risk" }} back={{ word: "coming back" }}
            fig={{ word: "68%" }} phase={{ word: "Phase 3" }} />
        </Camera>
      </World>
      <World fromMs={W.s2} bg="paper">
        <Camera on={CAMERA_3D} keys={[{ at: 11060, dur: 700, y: 40 }, { at: 14300, dur: 800, z: 90 }]}>
          <FinishGate from={W.s2} to={W.s3} date={{ word: "November 16," }} topline={{ word: "topline results" }} trial={{ word: "PIVOT-006." }} met={{ word: "met its" }} />
        </Camera>
      </World>
      {/* paper → red: the liquid blob swallows the card and its black margins, the red world cuts in under it */}
      <LiquidWipe at={W.s3} color={COLORS.accent} />
      <World fromMs={W.s3} bg="red" durationMs={1}>
        <Camera on={CAMERA_3D} keys={[{ at: 16300, dur: 700, y: 40 }, { at: 20260, dur: 800, z: 120 }, { at: 21540, dur: 800, y: -60 }]}>
          <SealedFile from={W.s3} to={W.s4} details={{ word: "details are" }} notPublic={{ word: "not public" }} dec={{ word: "December 2," }}
            late={{ word: "late-breaking" }} society={{ word: "Society of" }} />
        </Camera>
      </World>
      <World fromMs={W.s4} bg="ink" lineArt={false}>
        <Camera on={CAMERA_3D} keys={[{ at: 28330, dur: 800, x: -SCOPE_SHIFT }]}>
          <Scope from={W.s4} to={W.sec2} so={{ word: "So here" }} known={{ word: "known now" }} look={{ word: "and what to look" }} />
        </Camera>
      </World>

      {/* ── §2 The drug ── */}
      <World fromMs={W.sec2} bg="ink" section lineArt={false}>
        <FootageScrim from={31000} to={W.s6} src="broll/s5_hospital.mp4" max={0.2} /> {/* bright corridor: 0.2, after the section wipe settles */}
        <Camera on={CAMERA_3D} keys={[{ at: 35100, dur: 600, y: 30 }]}>
          <DrugIn from={W.sec2} to={W.s6} drug={{ word: "drug is" }} name={{ word: "cretostimogene grenadenorepvec," }} virus={{ word: "engineered virus" }} delivered={{ word: "delivered directly" }} />
        </Camera>
      </World>
      <World fromMs={W.s6} bg="paper">
        <Camera on={CAMERA_3D} keys={[{ at: 41650, dur: 800, z: 120 }]}>
          <Replicate from={W.s6} to={W.s7} cell={{ word: "It is built" }} enter={{ word: "built to" }} replicate={{ word: "replicate" }} rb={{ word: "pathway called" }} />
        </Camera>
      </World>
      <LiquidWipe at={W.s7} color={COLORS.accent} />
      <World fromMs={W.s7} bg="red" durationMs={1}>
        <Camera on={CAMERA_3D} keys={[{ at: 0, dur: 0, x: GENE_OPEN_X }, { at: 44420, dur: 700, x: 0 }, { at: 47711, dur: 800, z: 110 }]}>
          <CarriesGene from={W.s7} to={W.s8} enter={{ ms: W.s7 + 80 }} carries={{ word: "carries a" }} signal={{ word: "immune signal." }} />
        </Camera>
      </World>
      <World fromMs={W.s8} bg="ink" lineArt={false}>
        <Camera on={CAMERA_3D} keys={[{ at: 49240, dur: 600, y: 40 }]}>
          <NotApproved from={W.s8} to={W.sec3} drop={{ ms: W.s8 + 60 }} not={{ word: "approved anywhere." }} />
        </Camera>
      </World>
      {/* ── §3 The trial ── */}
      <World fromMs={W.sec3} bg="paper" section>
        <Camera on={CAMERA_3D} keys={[{ at: 61910, dur: 800, z: 120 }]}>
          <TrialWall from={W.sec3} to={W.s10} enrolled={{ word: "enrolled patients" }} inter={{ word: "intermediate-risk" }} nmi={{ word: "non-muscle-invasive" }}
            hg={{ word: "high-grade TA" }} reached={{ word: "not reached" }} />
        </Camera>
      </World>

      {/* back to the wall on the SAME seats (K2): the tumours are cut out, one comes back */}
      <World fromMs={W.s10} bg="ink" lineArt={false}>
        <Camera on={CAMERA_3D} keys={[{ at: 0, dur: 0, x: 90 }, { at: 65070, dur: 900, x: 0 }]}>
          <WallRegrow from={W.s10} to={W.s11} removed={{ word: "removed in" }} back={{ word: "but they can" }} />
        </Camera>
      </World>
      <World fromMs={W.s11} bg="paper">
        <Camera on={CAMERA_3D} keys={[{ at: 70270, dur: 800, z: 90 }, { at: 72320, dur: 700, y: 40 }]}>
          <Crowd from={W.s11} to={W.s12} count={{ word: "50,000" }} no={{ word: "says no" }} adjuvant={{ word: "adjuvant" }} />
        </Camera>
      </World>
      <LiquidWipe at={W.s12} color={COLORS.accent} />
      <World fromMs={W.s12} bg="red" durationMs={1}>
        <Camera on={CAMERA_3D} keys={[{ at: 77540, dur: 800, z: 100 }]}>
          <Enrolled from={W.s12} to={W.s13} enrolled={{ word: "enrolled 367" }} fig={{ word: "367" }} sites={{ word: "90 sites" }} />
        </Camera>
      </World>
      <World fromMs={W.s13} bg="ink" lineArt={false}>
        <FootageScrim from={W.s13} to={W.sec4} src="broll/s13_waiting.mp4" max={0.3} /> {/* mid-tone waiting room: 0.3 */}
        <Camera on={CAMERA_3D} keys={[{ at: 83690, dur: 700, y: -40 }]}>
          <Randomize from={W.s13} to={W.sec4} rig={{ ms: W.s13 + 60 }} randomized={{ word: "randomized" }} />
        </Camera>
      </World>
      {/* ── §4 The numbers — the S1 stub returns on its seat (K2) ── */}
      <World fromMs={W.sec4} bg="ink" section lineArt={false}>
        <Camera on={CAMERA_3D} keys={[{ at: 92410, dur: 800, z: 110 }]}>
          <Ratio from={W.sec4} to={W.s15} ref0={{ word: "hazard ratio" }} fig={{ word: "0.32," }} gap={{ word: "68% comes" }} />
        </Camera>
      </World>
      <World fromMs={W.s15} bg="paper">
        <Camera on={CAMERA_3D} keys={[{ at: 0, dur: 0, x: MONTHS_OPEN_X }, { at: 96640, dur: 1000, x: 0 }]}>
          <Months from={W.s15} to={W.s16} follow={{ word: "follow-up" }} fig={{ word: "17 months." }} />
        </Camera>
      </World>
      <LiquidWipe at={W.s16} color={COLORS.accent} />
      <World fromMs={W.s16} bg="red" durationMs={1}>
        <Camera on={CAMERA_3D} keys={[{ at: 100730, dur: 600, y: -30 }, { at: 104810, dur: 800, z: 90 }]}>
          <Jars from={W.s16} to={W.sec5} grade={{ word: "no grade" }} stop={{ word: "no patients" }} />
        </Camera>
      </World>
      {/* ── §5 What's missing ── */}
      <World fromMs={W.sec5} bg="ink" section lineArt={false}>
        <FootageScrim from={108040} to={W.s18} src="broll/s17_lab.mp4" max={0.2} /> {/* bright lab: 0.2, after the section wipe settles */}
        <Camera on={CAMERA_3D} keys={[{ at: 0, dur: 0, x: TRACK_OPEN_X }, { at: 110550, dur: 800, x: 0 }]}>
          <Track from={W.sec5} to={W.s18} co={{ word: "company-reported topline" }} notYet={{ word: "not yet" }} />
        </Camera>
      </World>
      <World fromMs={W.s18} bg="paper">
        <Camera on={CAMERA_3D} keys={[{ at: 117260, dur: 800, z: 80 }]}>
          <Drawers from={W.s18} to={W.s19} r1={{ word: "no recurrence" }} r2={{ word: "no event" }} r3={{ word: "no separate" }} />
        </Camera>
      </World>
      <LiquidWipe at={W.s19} color={COLORS.accent} />
      <World fromMs={W.s19} bg="red" durationMs={1}>
        <Camera on={CAMERA_3D} keys={[{ at: 121890, dur: 600, y: -30 }]}>
          <Pillars from={W.s19} to={W.sec6} held={{ word: "held in both" }} without={{ word: "without the numbers" }} />
        </Camera>
      </World>
      {/* ── §6 Our read ── */}
      <World fromMs={W.sec6} bg="paper" section>
        <Camera on={CAMERA_3D} keys={[{ at: 126210, dur: 800, z: 90 }]}>
          <ReadSign from={W.sec6} to={W.s21} flip={{ word: "This is" }} />
        </Camera>
      </World>
      <World fromMs={W.s21} bg="ink" lineArt={false}>
        <Camera on={CAMERA_3D} keys={[{ at: 132060, dur: 600, y: -30 }]}>
          <Watching from={W.s21} to={W.s22} not={{ word: "not another" }} watching={{ word: "watching and" }} />
        </Camera>
      </World>
      <LiquidWipe at={W.s22} color={COLORS.accent} />
      <World fromMs={W.s22} bg="red" durationMs={1}>
        <Camera on={CAMERA_3D} keys={[{ at: 134620, dur: 800, z: 100 }]}>
          <OneProp from={W.s22} to={W.s23} fig={{ word: "0.32 would" }} large={{ word: "large effect" }} ifc={{ word: "if the full" }} />
        </Camera>
      </World>
      <World fromMs={W.s23} bg="ink" lineArt={false}>
        <Camera on={CAMERA_3D} keys={[{ at: 0, dur: 0, x: COIN_OPEN_X }, { at: W.s23 + 80, dur: 950, x: 0 }]}>
          <DecCoin from={W.s23} to={W.s24} how={{ word: "how large," }} />
        </Camera>
      </World>
      {/* the filing rail: one spine across three scenes */}
      <World fromMs={W.s24} bg="paper">
        <Camera on={CAMERA_3D} keys={[{ at: 144580, dur: 600, y: 30 }, { at: 160630, dur: 900, x: -140 }, { at: 167080, dur: 800, z: 80 }]}>
          <Filings from={W.s24} to={W.sec7} rail={{ word: "reshapes the" }} first={{ word: "first FDA" }} bcg={{ word: "no longer responds" }} due={{ word: "due this" }}
            feedback={{ word: "FDA feedback" }} more={{ word: "covers more" }} expected={{ word: "completion expected" }} slide={{ word: "end of March" }}
            second={{ word: "second application," }} q2={{ word: "second quarter of 2027." }} />
        </Camera>
      </World>
      {/* ── §7 What to watch ── */}
      <World fromMs={W.sec7} bg="ink" section lineArt={false}>
        <Camera on={CAMERA_3D} keys={[{ at: 169950, dur: 700, y: 40 }]}>
          <Markers from={W.sec7} to={W.s28} three={{ word: "Three markers" }} dec={{ word: "December 2nd:" }} />
        </Camera>
      </World>
      {/* back to the S18 cabinet on its seats (K2): each empty cavity takes a DEC 2 tag */}
      <World fromMs={W.s28} bg="paper">
        <Camera on={CAMERA_3D} keys={[{ at: 177080, dur: 800, z: 80 }]}>
          <Fills from={W.s28} to={W.s29} r1={{ word: "rates in each" }} r2={{ word: "event count," }} r3={{ word: "high-grade and" }} />
        </Camera>
      </World>
      <LiquidWipe at={W.s29} color={COLORS.accent} />
      <World fromMs={W.s29} bg="red" durationMs={1}>
        <Camera on={CAMERA_3D} keys={[{ at: 180480, dur: 600, y: -30 }]}>
          <TwoFilings from={W.s29} to={W.s30} filings={{ word: "two filings," }} dates={{ word: "dates the company" }} />
        </Camera>
      </World>
      <World fromMs={W.s30} bg="ink" lineArt={false}>
        <Camera on={CAMERA_3D} keys={[{ at: 187090, dur: 800, z: 100 }]}>
          <NotApproval from={W.s30} to={W.cta} not={{ word: "not an approval." }} />
        </Camera>
      </World>
      {/* ── §8 Subscribe: the standard kit end card (A5) ── */}
      <World fromMs={W.cta} bg="paper" section>
        <CTACard from={W.cta} to={timeline.durationMs + 1200} bg="paper"
          headline="We track the trials that move biotech" emphasize="move biotech" sub="Every week in The Catalyst Brief."
          button="Subscribe free" link="thecatalystbrief.com" tail="Signal over noise."
          cues={{ logo: "We track", headline: "We track", sub: "every week", button: "Subscribe free", link: "at thecatalystbrief.com", tail: "Signal over" }} />
      </World>
      <BroadcastFrame brand={BRAND} kicker="TRIAL READOUT" date="NOV 2026" sections={SECTIONS} worlds={WORLDS}
        tally={{ steps: [{ label: "OUR READ", fromMs: 126210 }, { label: "", fromMs: W.sec7 }], fromMs: 126210 }} />
      <Audio src={staticFile("vo/vo.mp3")} />
      <MusicBed outAtMs={196000} volume={MUSIC.volume * 1.62} /> {/* BED_GAIN 1.62 from mix-to-target -12.1 (bed rises with the VO, balance kept) */}
    </AbsoluteFill>
  </V2.Provider>
);
