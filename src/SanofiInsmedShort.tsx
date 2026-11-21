// Sanofi × Insmed — SHORT, VERTICAL 9:16, 2026-11-21. House style 11-16 (MOTION-RULES §0).
// On-screen limits (Bloomberg report, via the 11-21 caption): reported over $30B · ONE analyst scenario toward $40B ·
// Brinsupri 2026 guidance $1.35–1.4B · Q3 $400M · peak above $7B is Insmed's model · no deal signed.

import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { cue, MusicBed } from "./kit/core";
import { Camera, type CamKey } from "./kit/camera";
import { BroadcastFrame, World, type SectionDef, type WorldDef } from "./kit/world";
import { V2 } from "./kit/v2style";
import { LiquidWipeV } from "./kit/pfb1v2";
import { Cliff, CLIFF_CAM, Knob, KNOB_CAM, Unsigned, UNS_CAM } from "./kit/sanofi2";
import { CTACard } from "./kit/blocks";
import { Cheque, CHQ_CAM, Handover, HAND_CAM, Lift, LIFT_CAM, Lungs, LUNGS_CAM, Peak, PEAK_CAM } from "./kit/sanofi1";
import { MUSIC, BRAND, COLORS } from "./style";
import timeline from "./timeline.json";

export const CAMERA_3D = true;
const ORIGIN: [number, number] = [540, 960];
const BED_GAIN = 1.62; //                             mix-to-target -12.1: VO rose 4.2 dB, bed rises with it (balance kept)
const CTA_FROM = 42450; //                            section panel wipe in the pause 42.45–42.83 ("We're" 42.80)
const SECTIONS = (timeline.sections as SectionDef[]).map((s) => (s.title === "Subscribe" ? { ...s, startMs: CTA_FROM } : s));
const at = (from: number) => (w: string, fb: number) => cue(w, fb, from);

// ════ chunk 1 ════
// S1 cheque: push-in WITH the figure landing on "$30"
const c1 = at(0);
const CAM_CHQ: CamKey[] = [{ at: 0, dur: 0 }, { at: c1("$30", 740), dur: 700, z: CHQ_CAM.push.z }];
const HAND_FROM = 3100; //                           liquid wipe 2.75–3.10 in the pause ("That" 3.10)
const c2 = at(HAND_FROM);
const CAM_HAND: CamKey[] = [{ at: HAND_FROM, dur: 0 }, { at: c2("Insmed", 5880), dur: 700, ...HAND_CAM.crane }];
const LUNGS_FROM = 9600; //                           section panel wipe in the pause 9.60–10.04 ("The" 10.04)
const c3 = at(LUNGS_FROM);
const CAM_LUNGS: CamKey[] = [{ at: LUNGS_FROM, dur: 0 }, { at: c3("Brinsupri", 10970), dur: 700, ...LUNGS_CAM.push }];
const LIFT_FROM = 12650; //                           liquid wipe 12.30–12.65 over "drug" ("Insmed" 12.66)
const c4 = at(LIFT_FROM);
const CAM_LIFT: CamKey[] = [
  { at: LIFT_FROM, dur: 0 },
  { at: c4("raised", 13500), dur: 800, y: LIFT_CAM.crane.y },
  { at: c4("$400", 19510), dur: 800, ...LIFT_CAM.pull },
];
const PEAK_FROM = 21570; //                           plain edge wipe in the pause 21.57–21.97 ("Insmed" 21.95)
const c5 = at(PEAK_FROM);
const CAM_PEAK: CamKey[] = [{ at: PEAK_FROM, dur: 0 }, { at: c5("above", 24420), dur: 700, ...PEAK_CAM.push }];

// ════ chunk 2 ════
const DRIVER_FROM = 25850; //                         section panel wipe in the pause 25.85–26.20 ("The" 26.20)
const c6 = at(DRIVER_FROM);
// S6 cliff: crane down WITH the falling lip, pull back to reveal the empty pedestal
const CAM_CLIFF: CamKey[] = [
  { at: DRIVER_FROM, dur: 0 },
  { at: c6("Cliff", 28050), dur: 700, y: CLIFF_CAM.crane.y },
  { at: c6("needs", 31810), dur: 700, ...CLIFF_CAM.pull },
];
const READ_FROM = 33390; //                           section panel wipe in the pause 33.39–33.78 ("The" 33.84)
const c7 = at(READ_FROM);
const CAM_KNOB: CamKey[] = [{ at: READ_FROM, dur: 0 }, { at: c7("immunology", 37585), dur: 800, ...KNOB_CAM.push }];
const UNS_FROM = 39280; //                            plain edge wipe in the pause 39.28–39.82 ("The" 39.84)
const c8 = at(UNS_FROM);
const CAM_UNS: CamKey[] = [{ at: UNS_FROM, dur: 0 }, { at: c8("question", 40680), dur: 600, ...UNS_CAM.crane }];

export const WORLDS: WorldDef[] = [
  { fromMs: 0, bg: "red" },
  { fromMs: HAND_FROM, bg: "ink", durationMs: 1 } as WorldDef,
  { fromMs: LUNGS_FROM, bg: "red", section: true, durationMs: 440 } as WorldDef,
  { fromMs: LIFT_FROM, bg: "paper", durationMs: 1 } as WorldDef,
  { fromMs: PEAK_FROM, bg: "ink", durationMs: 400 } as WorldDef,
  { fromMs: DRIVER_FROM, bg: "red", section: true, durationMs: 350 } as WorldDef,
  { fromMs: READ_FROM, bg: "paper", section: true, durationMs: 390 } as WorldDef,
  { fromMs: UNS_FROM, bg: "ink", durationMs: 500 } as WorldDef,
  { fromMs: CTA_FROM, bg: "paper", section: true, durationMs: 350 } as WorldDef,
];

export const SanofiInsmedShort: React.FC = () => (
  <V2.Provider value>
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Audio src={staticFile("vo/vo.mp3")} />
      <MusicBed volume={MUSIC.volume * BED_GAIN} />

      <World {...WORLDS[0]} lineArt={false}>
        <Camera on={CAMERA_3D} keys={CAM_CHQ} origin={ORIGIN}>
          <Cheque from={0} to={2750} arriveMs={60} fig={{ word: "$30" }} />
        </Camera>
        <LiquidWipeV start={2750} end={HAND_FROM} color={COLORS.ink} origin={[540, 1800]} />
      </World>

      <World {...WORLDS[1]} lineArt={false}>
        <Camera on={CAMERA_3D} keys={CAM_HAND} origin={ORIGIN}>
          <Handover from={HAND_FROM} to={LUNGS_FROM} says={{ word: "says" }} sanofi={{ word: "Sanofi" }} pay={{ word: "could pay" }} insmed={{ word: "Insmed" }}
            analyst={{ word: "analyst" }} scenario={{ word: "scenario" }} toward={{ word: "toward" }} />
        </Camera>
      </World>

      <World {...WORLDS[2]} lineArt={false}>
        <Camera on={CAMERA_3D} keys={CAM_LUNGS} origin={ORIGIN}>
          <Lungs from={LUNGS_FROM} to={12300} target={{ word: "target" }} name={{ word: "Brinsupri" }} />
        </Camera>
        <LiquidWipeV start={12300} end={LIFT_FROM} color={COLORS.paper} origin={[980, 300]} />
      </World>

      <World {...WORLDS[3]} lineArt={false}>
        <Camera on={CAMERA_3D} keys={CAM_LIFT} origin={ORIGIN}>
          <Lift from={LIFT_FROM} to={PEAK_FROM} just={{ word: "just raised" }} raised={{ word: "raised" }} lo={{ word: "$1.35" }} hi={{ word: "$1.4" }}
            year={{ word: "2026" }} q3={{ word: "$400" }} />
        </Camera>
      </World>

      <World {...WORLDS[4]} lineArt={false}>
        <Camera on={CAMERA_3D} keys={CAM_PEAK} origin={ORIGIN}>
          <Peak from={PEAK_FROM} to={DRIVER_FROM} insmed={{ word: "Insmed" }} models={{ word: "models" }} above={{ word: "above" }} />
        </Camera>
      </World>

      <World {...WORLDS[5]} lineArt={false}>
        <Camera on={CAMERA_3D} keys={CAM_CLIFF} origin={ORIGIN}>
          <Cliff from={DRIVER_FROM} to={READ_FROM} arriveMs={26050} dupi={{ word: "Dupixent" }} cliff={{ word: "Cliff" }} loses={{ word: "loses exclusivity" }}
            early={{ word: "early next" }} needs={{ word: "needs" }} />
        </Camera>
      </World>

      <World {...WORLDS[6]} lineArt={false}>
        <Camera on={CAMERA_3D} keys={CAM_KNOB} origin={ORIGIN}>
          <Knob from={READ_FROM} to={UNS_FROM} post={{ word: "post-Dupixent" }} turn={{ word: "immunology" }} />
        </Camera>
      </World>

      <World {...WORLDS[7]} lineArt={false}>
        <Camera on={CAMERA_3D} keys={CAM_UNS} origin={ORIGIN}>
          <Unsigned from={UNS_FROM} to={CTA_FROM} afford={{ word: "affordability" }} question={{ word: "question" }} />
        </Camera>
      </World>

      <World {...WORLDS[8]} lineArt={false}>
        <CTACard from={CTA_FROM} to={timeline.durationMs + 1200} bg="paper"
          headline="We track the deals that move biotech" emphasize="move biotech" sub="In this week's Catalyst Brief."
          button="Subscribe free" link="thecatalystbrief.com" tail="Signal over noise."
          cues={{ logo: "We're tracking", headline: "We're tracking", sub: "Catalyst Brief", button: "Subscribe free", tail: "Signal over" }} ms={{ link: 47100 }} />
      </World>

      <BroadcastFrame brand={BRAND} sections={SECTIONS} worlds={WORLDS} untilMs={timeline.durationMs} />
    </AbsoluteFill>
  </V2.Provider>
);
