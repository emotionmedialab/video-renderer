// Pfizer × Starna in vivo CAR-T — SHORT, VERTICAL 9:16, 2026-11-20. House style 11-16 (MOTION-RULES §0).
// On-screen limits (Pfizer release 2026-11-18): $330M upfront · up to $2.3B in milestones · three programs, pre-IND /
// not yet in the clinic. "An order of magnitude larger" has no source: no market-size number on screen.

import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { cue, MusicBed } from "./kit/core";
import { Camera, type CamKey } from "./kit/camera";
import { BroadcastFrame, World, type SectionDef, type WorldDef } from "./kit/world";
import { V2 } from "./kit/v2style";
import { LiquidWipeV } from "./kit/pfb1v2";
import { Bag, BAG_CAM, Hook, HOOK_CAM, InVivo, Loop, LOOP_CAM, Queue, QUEUE_CAM, Vials, VIALS_CAM, VIVO_CAM } from "./kit/starna1";
import { Clinic, DOOR_CAM, Option, OPT_CAM, Target, TGT_CAM } from "./kit/starna2";
import { CTACard, FootageScrim } from "./kit/blocks";
import { MUSIC, BRAND, COLORS } from "./style";
import timeline from "./timeline.json";

export const CAMERA_3D = true;
const ORIGIN: [number, number] = [540, 960];
const BED_GAIN = 1.6; //                              mix-to-target -12.1: VO rose 4.1 dB, bed rises with it (balance kept)
const CTA_FROM = 50200; //                            section panel wipe in the pause 50.20–50.53 ("This" 50.53)
// the S9 payoff holds through "Signal over noise", so the chrome's Subscribe section starts with the end card
const SECTIONS = (timeline.sections as SectionDef[]).map((s) => (s.title === "Subscribe" ? { ...s, startMs: CTA_FROM } : s));
const at = (from: number) => (w: string, fb: number) => cue(w, fb, from);

// ════ chunk 1 ════
// S1 hook: push-in WITH the brick as it steps forward on "Up front"
const c1 = at(0);
const CAM_HOOK: CamKey[] = [{ at: 0, dur: 0 }, { at: c1("Up front", 2600), dur: 600, z: HOOK_CAM.push.z }];
const VIALS_FROM = 4450; //                           liquid wipe 4.00–4.45 under "what" ("Pfizer" 4.57)
const c2 = at(VIALS_FROM);
const CAM_VIALS: CamKey[] = [{ at: VIALS_FROM, dur: 0 }, { at: c2("three pre-IND", 6340), dur: 700, y: VIALS_CAM.crane.y }];
const QUEUE_FROM = 10300; //                          plain edge wipe in the pause 10.30–10.65 ("with" 10.66)
const c3 = at(QUEUE_FROM);
const CAM_QUEUE: CamKey[] = [{ at: QUEUE_FROM, dur: 0 }, { at: c3("$2.3", 11090), dur: 900, z: QUEUE_CAM.pull.z, y: QUEUE_CAM.pull.y }];
const BAG_FROM = 13700; //                            section panel wipe in the pause 13.70–14.15 ("CAR" 14.30)
const c4 = at(BAG_FROM);
const CAM_BAG: CamKey[] = [{ at: BAG_FROM, dur: 0 }, { at: c4("always", 15160), dur: 600, z: BAG_CAM.push.z, y: BAG_CAM.push.y }];
const LOOP_FROM = 17100; //                           liquid wipe fills the pause 16.65–17.10 ("Remove" 17.10)
const c5 = at(LOOP_FROM);
const CAM_LOOP: CamKey[] = [
  { at: LOOP_FROM, dur: 0 },
  { at: c5("T-cells", 18900), dur: 700, y: LOOP_CAM.crane.y },
  { at: c5("re-infuse", 21500), dur: 700, y: LOOP_CAM.pull.y, z: LOOP_CAM.pull.z },
];
const VIVO_FROM = 26000; //                           plain edge wipe in the pause 26.00–26.40 ("engineer" 26.55)
const c6 = at(VIVO_FROM);
const CAM_VIVO: CamKey[] = [{ at: VIVO_FROM, dur: 0 }, { at: c6("engineer the", 26550), dur: 900, z: VIVO_CAM.push.z, y: VIVO_CAM.push.y }];

// ════ chunk 2 ════
// S7 target: crane WITH the dart onto the bull, pull back WITH the swell
const TGT_FROM = 30000; //                            section panel wipe in the pause 30.00–30.40 ("And" 30.44)
const c7 = at(TGT_FROM);
const CAM_TGT: CamKey[] = [
  { at: TGT_FROM, dur: 0 },
  { at: c7("autoimmune", 32650), dur: 480, y: TGT_CAM.crane.y },
  { at: c7("larger", 36020), dur: 800, y: TGT_CAM.pull.y, z: TGT_CAM.pull.z },
];
const CLINIC_FROM = 37450; //                         section panel wipe in the pause 37.45–37.83 ("Three" 37.84)
const c8 = at(CLINIC_FROM);
const CAM_CLINIC: CamKey[] = [{ at: CLINIC_FROM, dur: 0 }, { at: c8("next real", 41030), dur: 750, z: DOOR_CAM.push.z, y: DOOR_CAM.push.y }];
const OPT_FROM = 43200; //                            liquid wipe fills the pause 42.85–43.20 ("Until" 43.20)
const c9 = at(OPT_FROM);
const CAM_OPT: CamKey[] = [{ at: OPT_FROM, dur: 0 }, { at: c9("platform option", 46540), dur: 600, y: OPT_CAM.crane.y }];

export const WORLDS: WorldDef[] = [
  { fromMs: 0, bg: "red" },
  { fromMs: VIALS_FROM, bg: "ink", durationMs: 1 } as WorldDef,
  { fromMs: QUEUE_FROM, bg: "paper", durationMs: 300 } as WorldDef,
  { fromMs: BAG_FROM, bg: "red", section: true, durationMs: 450 } as WorldDef,
  { fromMs: LOOP_FROM, bg: "ink", durationMs: 1 } as WorldDef,
  { fromMs: VIVO_FROM, bg: "paper", durationMs: 380 } as WorldDef,
  { fromMs: TGT_FROM, bg: "red", section: true, durationMs: 400 } as WorldDef,
  { fromMs: CLINIC_FROM, bg: "ink", section: true, durationMs: 380 } as WorldDef,
  { fromMs: OPT_FROM, bg: "red", durationMs: 1 } as WorldDef,
  { fromMs: CTA_FROM, bg: "paper", section: true, durationMs: 330 } as WorldDef,
];

export const PfizerStarnaShort: React.FC = () => (
  <V2.Provider value>
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Audio src={staticFile("vo/vo.mp3")} />
      <MusicBed volume={MUSIC.volume * BED_GAIN} />

      <World {...WORLDS[0]} lineArt={false}>
        <Camera on={CAMERA_3D} keys={CAM_HOOK} origin={ORIGIN}>
          <Hook from={0} to={4000} fallMs={-330} figMs={350} up={{ word: "Up front" }} />
        </Camera>
        <LiquidWipeV start={4000} end={VIALS_FROM} color={COLORS.ink} origin={[960, 1800]} />
      </World>

      <World {...WORLDS[1]} lineArt={false}>
        {/* b-roll: Pexels 8863362, gloved pipette at a bright bench (white: scrim 0.3) */}
        <FootageScrim from={VIALS_FROM} to={QUEUE_FROM} src="broll/s2_lab.mp4" max={0.3} />
        <Camera on={CAMERA_3D} keys={CAM_VIALS} origin={ORIGIN}>
          <Vials from={VIALS_FROM} to={QUEUE_FROM} pfizer={{ word: "Pfizer" }} license={{ word: "license" }} three={{ word: "three pre-IND" }}
            preind={{ ms: 7050 }} starna={{ word: "Starna Therapeutics" }} />
        </Camera>
      </World>

      <World {...WORLDS[2]} lineArt={false}>
        <Camera on={CAMERA_3D} keys={CAM_QUEUE} origin={ORIGIN}>
          <Queue from={QUEUE_FROM} to={BAG_FROM} arrive={{ word: "up to" }} row={{ word: "$2.3" }} plate={{ word: "billion" }} />
        </Camera>
      </World>

      <World {...WORLDS[3]} lineArt={false}>
        <Camera on={CAMERA_3D} keys={CAM_BAG} origin={ORIGIN}>
          <Bag from={BAG_FROM} to={16650} car={{ word: "CAR T has" }} cancer={{ word: "always" }} />
        </Camera>
        <LiquidWipeV start={16650} end={LOOP_FROM} color={COLORS.ink} origin={[100, 1820]} />
      </World>

      <World {...WORLDS[4]} lineArt={false}>
        {/* b-roll: Pexels 8852383, pipette over culture dishes (white: scrim 0.3) */}
        <FootageScrim from={LOOP_FROM} to={VIVO_FROM} src="broll/s5_cells.mp4" max={0.3} />
        <Camera on={CAMERA_3D} keys={CAM_LOOP} origin={ORIGIN}>
          <Loop from={LOOP_FROM} to={VIVO_FROM} remove={{ word: "Remove" }} tcells={{ word: "T-cells" }} engineer={{ word: "Engineer them" }}
            reinfuse={{ word: "re-infuse" }} exp={{ word: "expensive" }} slow={{ word: "slow" }} bespoke={{ word: "bespoke" }} starna={{ word: "Starna's bet" }} />
        </Camera>
      </World>

      <World {...WORLDS[5]} lineArt={false}>
        <Camera on={CAMERA_3D} keys={CAM_VIVO} origin={ORIGIN}>
          <InVivo from={VIVO_FROM} to={30000} arriveMs={26100} engineer={{ word: "engineer the" }} tcells={{ word: "T-cells inside" }} inside={{ word: "inside the" }} />
        </Camera>
      </World>

      <World {...WORLDS[6]} lineArt={false}>
        <Camera on={CAMERA_3D} keys={CAM_TGT} origin={ORIGIN}>
          <Target from={TGT_FROM} to={CLINIC_FROM} arrive={{ word: "target" }} isnt={{ word: "isn't cancer" }} hit={{ word: "autoimmune" }}
            market={{ word: "market" }} larger={{ word: "larger" }} />
        </Camera>
      </World>

      <World {...WORLDS[7]} lineArt={false}>
        {/* b-roll: Pexels 29241126, dim hospital corridor (dark: default 0.4) */}
        <FootageScrim from={CLINIC_FROM} to={42850} src="broll/s8_clinic.mp4" />
        <Camera on={CAMERA_3D} keys={CAM_CLINIC} origin={ORIGIN}>
          <Clinic from={CLINIC_FROM} to={42850} three={{ word: "Three programs" }} door={{ word: "programs" }} none={{ word: "none yet" }} next={{ word: "next real" }} />
        </Camera>
        <LiquidWipeV start={42850} end={OPT_FROM} color={COLORS.accent} origin={[980, 300]} />
      </World>

      <World {...WORLDS[8]} lineArt={false}>
        <Camera on={CAMERA_3D} keys={CAM_OPT} origin={ORIGIN}>
          <Option from={OPT_FROM} to={CTA_FROM} back={{ word: "$330 million" }} option={{ word: "platform option" }} not={{ word: "not a product" }} product={{ word: "product" }} />
        </Camera>
      </World>

      <World {...WORLDS[9]} lineArt={false}>
        <CTACard from={CTA_FROM} to={timeline.durationMs + 1200} bg="paper"
          headline="We track the deals that move biotech" emphasize="move biotech" sub="In this week's Catalyst Brief."
          button="Subscribe free" link="thecatalystbrief.com" tail="Signal over noise."
          cues={{ logo: "This week's", headline: "This week's", sub: "Catalyst Brief", button: "Subscribe free" }} ms={{ link: 52720, tail: 53000 }} />
      </World>

      <BroadcastFrame brand={BRAND} sections={SECTIONS} worlds={WORLDS} untilMs={timeline.durationMs} />
    </AbsoluteFill>
  </V2.Provider>
);
