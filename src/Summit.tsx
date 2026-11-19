// Summit ivonescimab CRL — 16:9 long-form (The Catalyst Brief, 2026-11-19). V2 house style, 3D camera on.
// Cues are spoken WORDS (timeline.words[]); ms appear only as fallbacks inside the kit blocks.
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import timeline from "./timeline.json";
import { BRAND, COLORS, MUSIC } from "./style";
import { MusicBed } from "./kit/core";
import { BroadcastFrame, World, type SectionDef, type WorldDef } from "./kit/world";
import { Camera } from "./kit/camera";
import { LiquidWipe, V2 } from "./kit/v2style";
import { BarSet, Binder, Combo, DateCoin, Letter } from "./kit/summit1";
import { Balance, Plinths, ShortOfBar, TwoAtOnce } from "./kit/summit2";
import { Months, Pillars, PRuler } from "./kit/summit3";
import { CaseGate, FollowUp, Held } from "./kit/summit4";
import { CashTank, FaceOff, Resubmit } from "./kit/summit5";
import { Readouts, Watch } from "./kit/summit6";
import { CTACard, FootageScrim } from "./kit/blocks";

export const CAMERA_3D = true;

const SECTIONS: SectionDef[] = timeline.sections.map((s, i) => ({ index: i, title: s.title, startMs: s.startMs }));

// world boundaries = scene boundaries (ms of the opening word / beat start)
const W = { s2: 12360, s3: 18440, s4: 25080, s5: 34520, sec2: 38000, s7: 45400, sec3: 51650, s9: 61820, sec4: 69600, s12: 83140, s13: 89520, s14: 98500, s15: 105950, sec5: 116760, s17: 129760, sec6: 137820, s19: 148880, s20: 151840, s21: 161000, s23: 177043, cta: 182840 };
const WORLDS: WorldDef[] = [
  { fromMs: 0, bg: "ink" },
  { fromMs: W.s2, bg: "paper" },
  { fromMs: W.s3, bg: "ink" },
  { fromMs: W.s4, bg: "paper" },
  { fromMs: W.s5, bg: "red" },
  { fromMs: W.sec2, bg: "ink", section: true },
  { fromMs: W.s7, bg: "paper" },
  { fromMs: W.sec3, bg: "ink", section: true },
  { fromMs: W.s9, bg: "red" },
  { fromMs: W.sec4, bg: "ink", section: true },
  { fromMs: W.s12, bg: "paper" },
  { fromMs: W.s13, bg: "ink" },
  { fromMs: W.s14, bg: "red" },
  { fromMs: W.s15, bg: "ink" },
  { fromMs: W.sec5, bg: "paper", section: true },
  { fromMs: W.s17, bg: "ink" },
  { fromMs: W.sec6, bg: "paper", section: true },
  { fromMs: W.s19, bg: "red" },
  { fromMs: W.s20, bg: "ink" },
  { fromMs: W.s21, bg: "paper" },
  { fromMs: W.s23, bg: "ink" },
  { fromMs: W.cta, bg: "paper", section: true },
];

export const Summit: React.FC = () => (
  <V2.Provider value>
    <AbsoluteFill style={{ backgroundColor: COLORS.ink }}>
      {/* ── §1 The letter ── */}
      <World fromMs={0} bg="ink" lineArt={false}>
        <Camera on={CAMERA_3D} keys={[{ at: 8360, dur: 700, y: 60 }, { at: 10510, dur: 900, z: 150 }]}>
          <BarSet from={0} to={W.s2} may={{ word: "May" }} fda={{ word: "FDA told" }} take={{ word: "take" }} approve={{ word: "ivonescimab" }}
            leave={{ word: "in one form" }} stat={{ word: "statistically" }} overall={{ word: "overall survival" }} />
        </Camera>
      </World>
      <World fromMs={W.s2} bg="paper">
        <Camera on={CAMERA_3D} keys={[{ at: 14960, dur: 600, y: 60 }, { at: 17030, dur: 800, z: 140 }]}>
          <Letter from={W.s2} to={W.s3} nov={{ word: "November 15th" }} fifteenth={{ word: "15th" }} same={{ word: "same thing" }} rejection={{ word: "rejection" }} />
        </Camera>
      </World>
      <World fromMs={W.s3} bg="ink" lineArt={false}>
        <FootageScrim from={W.s3} to={W.s4} src="broll/s3_infusion.mp4" max={0.25} /> {/* IV drip by a bright window */}
        <Camera on={CAMERA_3D} keys={[{ at: 22830, dur: 700, x: -80 }, { at: 23700, dur: 700, z: 110 }]}>
          <Combo from={W.s3} to={W.s4} issued={{ word: "has issued" }} ivo={{ word: "ivonescimab plus" }} plus={{ word: "plus platinum" }} platinum={{ word: "platinum" }} />
        </Camera>
      </World>
      <World fromMs={W.s4} bg="paper">
        <Camera on={CAMERA_3D} keys={[{ at: 26680, dur: 700, x: -75 }, { at: 31550, dur: 900, z: 120 }]}>
          <Binder from={W.s4} to={W.s5} app={{ word: "application covered" }} t1={{ word: "advanced" }} t2={{ word: "EGFR mutation" }} t3={{ word: "already treated" }} />
        </Camera>
      </World>
      {/* paper → red: the liquid blob swallows the card and its black margins, the red world cuts in under it */}
      <LiquidWipe at={W.s5} color={COLORS.accent} />
      <World fromMs={W.s5} bg="red" durationMs={1}>
        <Camera on={CAMERA_3D} keys={[{ at: 0, dur: 0, x: 420 }, { at: 34820, dur: 850, x: 0 }]}>
          <DateCoin from={W.s5} to={W.sec2} roll={{ word: "FDA's decision" }} date={{ word: "date had" }} nov={{ word: "November 14th" }} />
        </Camera>
      </World>
      {/* ── §2 The drug ── */}
      <World fromMs={W.sec2} bg="ink" section lineArt={false}>
        <Camera on={CAMERA_3D} keys={[{ at: 43050, dur: 500, y: 40 }, { at: 43820, dur: 700, z: 130 }]}>
          <TwoAtOnce from={W.sec2} to={W.s7} name={{ word: "Ivonescimab" }} bispecific={{ word: "bispecific" }} two={{ word: "two targets" }} once={{ word: "at once" }} />
        </Camera>
      </World>
      <World fromMs={W.s7} bg="paper">
        <Camera on={CAMERA_3D} keys={[{ at: 48930, dur: 700, x: -120 }, { at: 50330, dur: 800, z: 120 }]}>
          <Plinths from={W.s7} to={W.sec3} rise={{ word: "drug of" }} us={{ word: "U.S. It" }} hop={{ word: "approved in China" }} since={{ word: "since May" }} />
        </Camera>
      </World>
      {/* ── §3 The FDA's reasons ── */}
      <World fromMs={W.sec3} bg="ink" section lineArt={false}>
        <Camera on={CAMERA_3D} keys={[{ at: 54100, dur: 1500, y: 40 }, { at: 58500, dur: 900, z: 140 }]}>
          <ShortOfBar from={W.sec3} to={W.s9} found={{ word: "FDA found" }} evidence={{ word: "substantial evidence" }} not={{ word: "not established" }} stat={{ word: "statistically significant" }} />
        </Camera>
      </World>
      {/* ink → red: liquid blob, the red world cuts in under it */}
      <LiquidWipe at={W.s9} color={COLORS.accent} />
      <World fromMs={W.s9} bg="red" durationMs={1}>
        <Camera on={CAMERA_3D} keys={[{ at: 63860, dur: 500, y: -40 }, { at: 66520, dur: 900, z: 120 }]}>
          <Balance from={W.s9} to={W.sec4} said={{ word: "said the" }} benefit={{ word: "benefit could" }} not={{ word: "not, on" }} />
        </Camera>
      </World>
      {/* ── §4 The trial — section spine: the application slab on two endpoint pillars ── */}
      <World fromMs={W.sec4} bg="ink" section lineArt={false}>
        <FootageScrim from={70200} to={W.s12} src="broll/s10_trial.mp4" max={0.2} /> {/* after the section wipe settles; bright white lab: 0.2 */}
        <Camera on={CAMERA_3D} keys={[{ at: 74010, dur: 700, y: 40 }, { at: 76400, dur: 800, x: 280 }, { at: 80500, dur: 900, z: 200 }]}>
          <Pillars from={W.sec4} to={W.s12} app={{ word: "application rested" }} harmoni={{ word: "HARMONi, a" }} two={{ word: "two primary" }}
            first={{ word: "progression-free" }} won={{ word: "won." }} hr1={{ word: "hazard ratio" }} second={{ ms: 1e9 }} short={{ ms: 1e9 }} hr2={{ ms: 1e9 }} />
        </Camera>
      </World>
      <World fromMs={W.s12} bg="paper">
        <Camera on={CAMERA_3D} keys={[{ at: 85300, dur: 700, y: 50 }, { at: 88300, dur: 800, z: 120 }]}>
          <Months from={W.s12} to={W.s13} g1={{ word: "was 6.8" }} v1={{ word: "months, against" }} g2={{ word: "against 4.4" }} v2={{ word: "on chemotherapy" }} />
        </Camera>
      </World>
      {/* back to the spine on the SAME seats (K2): pillar 2 */}
      <World fromMs={W.s13} bg="ink" lineArt={false}>
        <Camera on={CAMERA_3D} keys={[{ at: 90300, dur: 800, x: -280 }, { at: 96700, dur: 900, z: 200 }]}>
          <Pillars from={W.s13} to={W.s14} app={{ ms: 60000 }} harmoni={{ ms: 60000 }} two={{ ms: 60000 }} first={{ ms: 60000 }} won={{ ms: 60000 }} hr1={{ ms: 60000 }}
            retireHr1={{ ms: W.s13 }} second={{ word: "overall survival, and" }} short={{ word: "fell short" }} hr2={{ word: "hazard ratio" }} />
        </Camera>
      </World>
      <LiquidWipe at={W.s14} color={COLORS.accent} />
      <World fromMs={W.s14} bg="red" durationMs={1}>
        <Camera on={CAMERA_3D} keys={[{ at: 0, dur: 0, x: -250 }, { at: 99320, dur: 780, x: -60 }, { at: 103500, dur: 900, z: 140 }]}>
          <PRuler from={W.s14} to={W.s15} marker={{ word: "p-value" }} required={{ word: "required" }} />
        </Camera>
      </World>
      <World fromMs={W.s15} bg="ink" lineArt={false}>
        <Camera on={CAMERA_3D} keys={[{ at: 0, dur: 0, x: 410 }, { at: 106250, dur: 1300, x: 10 }, { at: 115300, dur: 800, z: 110 }]}>
          <FollowUp from={W.s15} to={W.sec5} longer={{ word: "longer follow-up" }} drop={{ word: "hazard ratio moved" }} value={{ word: "to 0.76" }} posthoc={{ word: "post-hoc" }} pre={{ word: "prespecified" }} />
        </Camera>
      </World>
      {/* ── §5 Why it matters (OUR READ rides in the chrome band) ── */}
      <World fromMs={W.sec5} bg="paper" section>
        <Camera on={CAMERA_3D} keys={[{ at: 119960, dur: 700, y: -40 }, { at: 127940, dur: 800, z: 130 }]}>
          <Held from={W.sec5} to={W.s17} filed={{ word: "Summit filed" }} ann={{ word: "Its own" }} necessary={{ word: "considered a" }} held={{ word: "held to" }} />
        </Camera>
      </World>
      <World fromMs={W.s17} bg="ink" lineArt={false}>
        <Camera on={CAMERA_3D} keys={[{ at: 0, dur: 0, x: 350 }, { at: 130160, dur: 900, x: 120 }, { at: 136300, dur: 800, z: 120, x: -60 }]}>
          <CaseGate from={W.s17} to={W.sec6} arrive={{ word: "case was" }} tag={{ word: "regimen in" }} carry={{ word: "did not" }} />
        </Camera>
      </World>
      {/* ── §6 What comes next ── */}
      <World fromMs={W.sec6} bg="paper" section>
        <Camera on={CAMERA_3D} keys={[{ at: 145450, dur: 1400, y: 40 }, { at: 147000, dur: 800, z: 120 }]}>
          <CashTank from={W.sec6} to={W.s19} co={{ word: "company is" }} held={{ word: "held $629.8" }} mil={{ word: "million at" }} received={{ word: "received" }} two={{ word: "$2 billion" }} />
        </Camera>
      </World>
      <LiquidWipe at={W.s19} color={COLORS.accent} />
      <World fromMs={W.s19} bg="red" durationMs={1}>
        <Camera on={CAMERA_3D} keys={[{ at: 0, dur: 0, x: 200 }, { at: 149190, dur: 800, x: 0 }]}>
          <Resubmit from={W.s19} to={W.s20} fly={{ word: "does not say" }} whether={{ word: "whether Summit" }} />
        </Camera>
      </World>
      <World fromMs={W.s20} bg="ink" lineArt={false}>
        <FootageScrim from={W.s20} to={W.s21} src="broll/s20_lung.mp4" max={0.2} /> {/* bright grey x-ray room: 0.2 */}
        <Camera on={CAMERA_3D} keys={[{ at: 152770, dur: 600, y: -30 }, { at: 159500, dur: 800, z: 120 }]}>
          <FaceOff from={W.s20} to={W.s21} title={{ word: "HARMONi-3. It" }} left={{ word: "ivonescimab plus" }} vs={{ word: "against Keytruda" }} right={{ word: "Keytruda plus" }} line1={{ word: "first-line" }} />
        </Camera>
      </World>
      <World fromMs={W.s21} bg="paper">
        <Camera on={CAMERA_3D} keys={[{ at: 165330, dur: 600, y: 30 }, { at: 175300, dur: 800, z: 110 }]}>
          <Readouts from={W.s21} to={W.s23} tiles={{ word: "squamous group" }} b1={{ word: "primary analysis" }} b2={{ word: "alongside it" }} b3={{ word: "first half" }} />
        </Camera>
      </World>
      <World fromMs={W.s23} bg="ink" lineArt={false}>
        <Camera on={CAMERA_3D} keys={[{ at: 177460, dur: 800, y: 100 }, { at: 180700, dur: 800, z: 160 }]}>
          <Watch from={W.s23} to={W.cta} letter={{ word: "letter, our" }} number={{ word: "survival number" }} />
        </Camera>
      </World>
      {/* ── §7 Subscribe: the standard kit end card (copy as the Tandem build, cues to this VO) ── */}
      <World fromMs={W.cta} bg="paper" section>
        <CTACard from={W.cta} to={timeline.durationMs + 1200} bg="paper"
          headline="We track the FDA decisions that move biotech" emphasize="move biotech" sub="Every week in The Catalyst Brief."
          button="Subscribe free" link="thecatalystbrief.com" tail="Signal over noise."
          cues={{ logo: "We track", headline: "We track", sub: "every week", button: "Subscribe free", link: "at thecatalystbrief.com", tail: "Signal over" }} />
      </World>

      <BroadcastFrame brand={BRAND} kicker="FDA DECISION" date="NOV 2026" sections={SECTIONS} worlds={WORLDS}
        tally={{ steps: [{ label: "OUR READ", fromMs: 118200 }, { label: "", fromMs: 137820 }, { label: "OUR READ", fromMs: 178440 }, { label: "", fromMs: 182840 }], fromMs: 118200 }} />
      <Audio src={staticFile("vo/vo.mp3")} />
      <MusicBed outAtMs={190000} volume={MUSIC.volume * 1.62} /> {/* BED_GAIN 1.62 from mix-to-target -12.1 (bed rises with the VO, balance kept) */}
    </AbsoluteFill>
  </V2.Provider>
);
