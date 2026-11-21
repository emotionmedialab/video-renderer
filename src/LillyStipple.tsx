// Lilly × Stipple Bio — 16:9 long-form (The Catalyst Brief, 2026-11-21). V2 house style, 3D camera on.
// Cues are spoken WORDS (timeline.words[]); ms appear only as fallbacks inside the kit blocks.
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import timeline from "./timeline.json";
import { BRAND, COLORS, MUSIC } from "./style";
import { MusicBed } from "./kit/core";
import { BroadcastFrame, World, type SectionDef, type WorldDef } from "./kit/world";
import { Camera } from "./kit/camera";
import { LiquidWipe, V2 } from "./kit/v2style";
import { Ceiling, Contract, Money, Unprinted } from "./kit/stipple1";
import { Globe, NotADrug, Steps, Tiers } from "./kit/stipple2";
import { Pairing, Surface, SURF_CAM } from "./kit/stipple3";
import { AdcBuild, Company, Doors, Funding, Pipeline } from "./kit/stipple4";
import { Bridge, Investor, Measure, ReadBlock, Road, ROAD } from "./kit/stipple5";
import { Signals, SIG_CAM } from "./kit/stipple6";
import { CTACard, FootageScrim } from "./kit/blocks";

export const CAMERA_3D = true;

const SECTIONS: SectionDef[] = timeline.sections.map((s, i) => ({ index: i, title: s.title, startMs: s.startMs }));

// world boundaries = scene boundaries (ms of the opening word)
const W = { s2: 7580, s3: 12386, sec2: 20630, s6: 31710, s7: 42740, s8: 46832, sec3: 51980, s10: 57320, s14: 79594, sec4: 85200, s16: 88853, s17: 98370, s18: 102983, s19: 114350, sec5: 120090, s21: 122950, s22: 131740, s23: 138560, s24: 144447, sec6: 152128, cta: 178860 };
const WORLDS: WorldDef[] = [
  { fromMs: 0, bg: "ink" },
  { fromMs: W.s2, bg: "paper" },
  { fromMs: W.s3, bg: "red" },
  { fromMs: W.sec2, bg: "ink", section: true },
  { fromMs: W.s6, bg: "paper" },
  { fromMs: W.s7, bg: "red" },
  { fromMs: W.s8, bg: "ink" },
  { fromMs: W.sec3, bg: "paper", section: true },
  { fromMs: W.s10, bg: "ink" },
  { fromMs: W.s14, bg: "red" },
  { fromMs: W.sec4, bg: "ink", section: true },
  { fromMs: W.s16, bg: "paper" },
  { fromMs: W.s17, bg: "red" },
  { fromMs: W.s18, bg: "ink" },
  { fromMs: W.s19, bg: "paper" },
  { fromMs: W.sec5, bg: "ink", section: true },
  { fromMs: W.s21, bg: "paper" },
  { fromMs: W.s22, bg: "red" },
  { fromMs: W.s23, bg: "ink" },
  { fromMs: W.s24, bg: "paper" },
  { fromMs: W.sec6, bg: "ink", section: true },
  { fromMs: W.cta, bg: "paper", section: true },
];

export const LillyStipple: React.FC = () => (
  <V2.Provider value>
    <AbsoluteFill style={{ backgroundColor: COLORS.ink }}>
      {/* ── §1 The headline ── */}
      <World fromMs={0} bg="ink" lineArt={false}>
        <FootageScrim from={400} to={W.s2} src="broll/s1_lab.mp4" max={0.2} /> {/* bright lab bench: 0.2 */}
        <Camera on={CAMERA_3D} keys={[{ at: 3360, dur: 900, y: 40, z: 110 }]}>
          <Ceiling from={0} to={W.s2} lilly={{ word: "Eli Lilly's" }} stipple={{ word: "Stipple Bio" }} upto={{ word: "up to" }}
            fig={{ word: "$5.9" }} headline={{ word: "headline." }} />
        </Camera>
      </World>
      <World fromMs={W.s2} bg="paper">
        <Camera on={CAMERA_3D} keys={[{ at: 10400, dur: 800, x: -120, z: 120 }]}>
          <Unprinted from={W.s2} to={W.s3} plate={{ word: "The number" }} slot={{ word: "number that" }} ball={{ word: "neither company" }}
            printed={{ word: "published." }} />
        </Camera>
      </World>
      <LiquidWipe at={W.s3} color={COLORS.accent} />
      <World fromMs={W.s3} bg="red" durationMs={1}>
        <Camera on={CAMERA_3D} keys={[{ at: 13760, dur: 700, y: -40 }, { at: 17902, dur: 800, y: -40, z: 90 }]}>
          <Contract from={W.s3} to={W.sec2} date={{ word: "November 16," }} announced={{ word: "announced" }} title={{ word: "research collaboration" }}
            targets={{ word: "covering multiple" }} drugs={{ word: "and multiple types" }} />
        </Camera>
      </World>
      {/* ── §2 The terms ── */}
      <World fromMs={W.sec2} bg="ink" section lineArt={false}>
        <Camera on={CAMERA_3D} keys={[{ at: 23120, dur: 820, x: -60 }, { at: 30070, dur: 800, x: -60, z: 110 }]}>
          <Money from={W.sec2} to={W.s6} money={{ word: "the money," }} upfront={{ word: "upfront payment," }} equity={{ word: "equity investment" }}
            big={{ word: "How big" }} not={{ word: "not been disclosed." }} />
        </Camera>
      </World>
      <World fromMs={W.s6} bg="paper">
        <Camera on={CAMERA_3D} keys={[{ at: 36150, dur: 800, y: 30 }, { at: 41300, dur: 800, y: -20, x: 120, z: 90 }]}>
          <Steps from={W.s6} to={W.s7} plate={{ word: "Everything after" }} cond={{ word: "conditional." }} s1={{ word: "research," }} s2={{ word: "development and" }}
            s3={{ word: "commercial milestones," }} hop={{ word: "paid only" }} coin={{ word: "programs reach" }} />
        </Camera>
      </World>
      <LiquidWipe at={W.s7} color={COLORS.accent} />
      <World fromMs={W.s7} bg="red" durationMs={1}>
        <Camera on={CAMERA_3D} keys={[{ at: 43560, dur: 700, y: 40 }, { at: 44760, dur: 800, y: 40, z: 110 }]}>
          <Tiers from={W.s7} to={W.s8} tiered={{ word: "tiered royalties" }} product={{ word: "if a product" }} />
        </Camera>
      </World>
      <World fromMs={W.s8} bg="ink" lineArt={false}>
        <Camera on={CAMERA_3D} keys={[{ at: 47940, dur: 800, z: 100 }]}>
          <Globe from={W.s8} to={W.sec3} gets={{ word: "Lilly gets" }} excl={{ word: "exclusive worldwide" }} rights={{ word: "rights to" }} />
        </Camera>
      </World>
      {/* ── §3 The platform ── */}
      <World fromMs={W.sec3} bg="paper" section>
        <Camera on={CAMERA_3D} keys={[{ at: 53680, dur: 800, x: -80 }, { at: 55420, dur: 800, x: 0, z: 120 }]}>
          <NotADrug from={W.sec3} to={W.s10} drug={{ word: "Lilly is not" }} not={{ word: "not buying" }} way={{ word: "way to find" }} />
        </Camera>
      </World>
      {/* the platform spine: one tumour-cell surface across four scenes */}
      <World fromMs={W.s10} bg="ink" lineArt={false}>
        <Camera on={CAMERA_3D} keys={[{ at: 0, dur: 0, x: SURF_CAM.open }, { at: 61400, dur: 700, x: SURF_CAM.open, y: 60 },
          { at: 63810, dur: 900, ...SURF_CAM.dive }, { at: 68350, dur: 1000, x: 0, y: 0, z: 0 }, { at: 76810, dur: 800, x: -500, z: 150 }]}>
          <Surface from={W.s10} to={W.s14} platform={{ word: "Pointillist platform" }} binders={{ word: "binders to" }} epi={{ word: "epitopes on" }}
            spot={{ word: "exact spot" }} attach={{ word: "antibody attaches." }} says={{ word: "says these" }} hit={{ word: "hit tumor" }} sel={{ word: "selectively." }}
            drug={{ word: "avoid on-target," }} off={{ word: "off-tumor" }} tox={{ word: "toxicity: a drug" }} />
        </Camera>
      </World>
      <LiquidWipe at={W.s14} color={COLORS.accent} />
      <World fromMs={W.s14} bg="red" durationMs={1}>
        <Camera on={CAMERA_3D} keys={[{ at: 79600, dur: 700, y: 40 }, { at: 83420, dur: 800, y: 40, z: 90 }]}>
          <Pairing from={W.s14} to={W.sec4} pair={{ word: "will pair" }} bases={{ word: "own oncology" }} more={{ word: "more than one" }} />
        </Camera>
      </World>
      {/* ── §4 The company ── */}
      <World fromMs={W.sec4} bg="ink" section lineArt={false}>
        <Camera on={CAMERA_3D} keys={[{ at: 85500, dur: 700, y: 40 }, { at: 87040, dur: 800, y: 40, x: -120, z: 90 }]}>
          <Company from={W.sec4} to={W.s16} orb={{ word: "private biotech" }} pin={{ word: "Cambridge," }} />
        </Camera>
      </World>
      <World fromMs={W.s16} bg="paper">
        <Camera on={CAMERA_3D} keys={[{ at: 89430, dur: 800, y: 50 }, { at: 92210, dur: 800, y: 0, x: -140, z: 70 }]}>
          <Funding from={W.s16} to={W.s17} stealth={{ word: "of stealth" }} hundred={{ word: "$100" }} series={{ word: "Series A," }}
            l1={{ word: "RA Capital," }} l2={{ word: "a16z Bio+Health," }} l3={{ word: "Nextech" }} />
        </Camera>
      </World>
      <LiquidWipe at={W.s17} color={COLORS.accent} />
      <World fromMs={W.s17} bg="red" durationMs={1}>
        <Camera on={CAMERA_3D} keys={[{ at: 99100, dur: 700, y: 40 }, { at: 101160, dur: 800, y: 20, z: 110 }]}>
          <AdcBuild from={W.s17} to={W.s18} name={{ word: "lead drug," }} drop={{ word: "STP-100," }} click={{ word: "an antibody-drug" }} />
        </Camera>
      </World>
      <World fromMs={W.s18} bg="ink" lineArt={false}>
        <FootageScrim from={W.s18 + 300} to={W.s19} src="broll/s18_lab.mp4" max={0.2} /> {/* bright blue vials: 0.2 */}
        <Camera on={CAMERA_3D} keys={[{ at: 104630, dur: 1100, x: -180 }, { at: 109600, dur: 800, x: -290, y: 40, z: 100 }]}>
          <Pipeline from={W.s18} to={W.s19} advance={{ word: "keep advancing" }} phase={{ word: "Phase 1 trial" }} early={{ word: "early 2027," }} solid={{ word: "solid tumors" }} />
        </Camera>
      </World>
      <World fromMs={W.s19} bg="paper">
        <Camera on={CAMERA_3D} keys={[{ at: 114500, dur: 700, y: -30 }, { at: 118680, dur: 800, y: -30, z: 70 }]}>
          <Doors from={W.s19} to={W.sec5} d1={{ word: "no targets" }} d2={{ word: "no count," }} d3={{ word: "none of it" }} />
        </Camera>
      </World>
      {/* ── §5 Our read ── */}
      <World fromMs={W.sec5} bg="ink" section lineArt={false}>
        <Camera on={CAMERA_3D} keys={[{ at: 120300, dur: 900, z: 80 }]}>
          <ReadBlock from={W.sec5} to={W.s21} land={{ word: "matters." }} />
        </Camera>
      </World>
      <World fromMs={W.s21} bg="paper">
        <Camera on={CAMERA_3D} keys={[{ at: 123660, dur: 700, y: 30 }, { at: 129900, dur: 800, y: -50, z: 80 }]}>
          <Measure from={W.s21} to={W.s22} ceiling={{ word: "ceiling is" }} upfront={{ word: "upfront is" }} big={{ word: "how big" }} paid={{ word: "not what" }} />
        </Camera>
      </World>
      <LiquidWipe at={W.s22} color={COLORS.accent} />
      <World fromMs={W.s22} bg="red" durationMs={1}>
        <Camera on={CAMERA_3D} keys={[{ at: 134260, dur: 1500, x: ROAD.truckX }, { at: 137030, dur: 800, x: ROAD.truckX, z: 90 }]}>
          <Road from={W.s22} to={W.s23} signs={{ word: "Lilly is paying" }} flag={{ word: "target discovery," }} patients={{ word: "reaching patients." }} />
        </Camera>
      </World>
      <World fromMs={W.s23} bg="ink" lineArt={false}>
        <FootageScrim from={W.s23 + 250} to={W.s24} src="broll/s23_micro.mp4" max={0.2} /> {/* bright microscope room: 0.2 */}
        <Camera on={CAMERA_3D} keys={[{ at: 138790, dur: 700, y: 40 }, { at: 142760, dur: 800, y: 20, z: 90 }]}>
          <Bridge from={W.s23} to={W.s24} plate={{ word: "$5.9" }} only={{ word: "only exists" }} p2={{ word: "works," }} p3c={{ word: "program by" }} />
        </Camera>
      </World>
      <World fromMs={W.s24} bg="paper">
        <Camera on={CAMERA_3D} keys={[{ at: 147190, dur: 700, x: -40 }, { at: 148940, dur: 800, x: -250, z: 100 }]}>
          <Investor from={W.s24} to={W.sec6} equity={{ word: "equity matters." }} partner={{ word: "a partner." }} investor={{ word: "an investor" }} />
        </Camera>
      </World>
      {/* ── §6 What to watch: three pedestals, visited in order, then the pull-back to the ceiling ── */}
      <World fromMs={W.sec6} bg="ink" section lineArt={false}>
        <Camera on={CAMERA_3D} keys={[{ at: 154440, dur: 900, x: 480, y: -90, z: SIG_CAM.z }, { at: 160526, dur: 900, x: 0, y: -30, z: SIG_CAM.z },
          { at: 169588, dur: 500, x: -480, y: -90, z: SIG_CAM.z }, { at: 173281, dur: 1000, x: 0, y: 0, z: 0 }]}>
          <Signals from={W.sec6} to={W.cta} signal={{ word: "signal comes" }} coin={{ word: "discloses the" }} entry={{ word: "real price" }}
            gate={{ word: "Phase 1 start" }} early={{ word: "early 2027," }} people={{ word: "in people" }} box={{ word: "first named" }}
            until={{ word: "Until that" }} plate={{ word: "$5.9" }} ceiling={{ word: "ceiling, not" }} />
        </Camera>
      </World>
      {/* ── §7 Subscribe: the standard kit end card (A5) ── */}
      <World fromMs={W.cta} bg="paper" section>
        <CTACard from={W.cta} to={timeline.durationMs + 1200} bg="paper"
          headline="We track the deals that move biotech" emphasize="move biotech" sub="Every week in The Catalyst Brief."
          button="Subscribe free" link="thecatalystbrief.com" tail="Signal over noise."
          cues={{ logo: "We track", headline: "We track", sub: "every week", button: "Subscribe free", link: "at thecatalystbrief.com", tail: "Signal over" }} />
      </World>
      <BroadcastFrame brand={BRAND} kicker="DEAL" date="NOV 2026" sections={SECTIONS} worlds={WORLDS}
        tally={{ steps: [{ label: "OUR READ", fromMs: 122350 }, { label: "", fromMs: W.sec6 }], fromMs: 122350 }} />
      <Audio src={staticFile("vo/vo.mp3")} />
      <MusicBed outAtMs={timeline.durationMs + 1000} volume={MUSIC.volume * 1.62} /> {/* BED_GAIN 1.62 from mix-to-target -12.1 */}
    </AbsoluteFill>
  </V2.Provider>
);
