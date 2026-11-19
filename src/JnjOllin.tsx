// J&J × Ollin — LONG-FORM, HORIZONTAL 16:9, 2026-11-19. House style 11-16 (MOTION-RULES §0).
// On-screen limits: script.md header (milestones "up to", $3.3B "our math", JADE = company-reported, no Phase 3 vs Vabysmo).

import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { cue, MusicBed } from "./kit/core";
import { Camera, type CamKey } from "./kit/camera";
import { BroadcastFrame, World, type SectionDef, type WorldDef } from "./kit/world";
import { LiquidWipe, V2 } from "./kit/v2style";
import { BillPass, EyeOpens, Hook, Signing } from "./kit/jnj1";
import { MoneyTrain, TRAIN } from "./kit/jnj2";
import { Diseases, DrugDive, Partners, VIAL2_BODY_Y } from "./kit/jnj3";
import { Balance, CAV, Caveat, FaceOff, TileStacks } from "./kit/jnj4";
import { Dominoes, Hourglass, HG_BOTTOM_Y, Tickets } from "./kit/jnj5";
import { Bar, Fork, Handoff, OurRead } from "./kit/jnj6";
import { gateCamZ, Gates, WatchPlate } from "./kit/jnj7";
import { CTACard, FootageScrim } from "./kit/blocks";
import { MUSIC, BRAND, COLORS } from "./style";
import timeline from "./timeline.json";

export const CAMERA_3D = true;
const BED_GAIN = 1.6; // mix-to-target 2026-11-19: VO recut to -12.2 LUFS, bed raised the same +4.1 dB (approved balance kept)
const SECTIONS = timeline.sections as SectionDef[];
const at = (from: number) => (w: string, fb: number) => cue(w, fb, from);

// ════ chunk 1 · §1 The deal ════
// S1 hook: camera starts pushed in on the figure, pulls back WITH the pod's fall, pushes in WITH the shutter roll
const c1 = at(0);
const CAM_HOOK: CamKey[] = [
  { at: 0, dur: 0, y: 290, z: 200 },
  { at: c1("company", 4600) - 380, dur: 700, y: 0, z: 0 },
  { at: c1("one", 5360), dur: 600, y: -70, z: 120 },
];
const BILL_FROM = 7470; //                           liquid wipe fills the pause 7.05–7.47, "And" 7.47
const c2 = at(BILL_FROM);
const CAM_BILL: CamKey[] = [{ at: BILL_FROM, dur: 0, x: 160 }, { at: c2("that drug's", 10080), dur: 520, x: -120 }];
const SIGN_FROM = 11810; //                          plain edge wipe in the pause 11.81–12.03, "On" 12.16
const c3 = at(SIGN_FROM);
const CAM_SIGN: CamKey[] = [{ at: SIGN_FROM, dur: 0, y: 150 }, { at: c3("agreed", 14100) - 380, dur: 600, y: -40 }];
const EYE_FROM = 16880; //                           contract retires in the pause after "Biosciences," (15.71–16.88)
const c4 = at(EYE_FROM);
const CAM_EYE: CamKey[] = [{ at: EYE_FROM, dur: 0 }, { at: c4("treatments", 18920), dur: 600, y: 80, z: 140 }];
// ════ chunk 2 · §2 The money ════
const MONEY_FROM = 20910; //                         section panel wipe in the pause 20.91–21.34, "Now" 21.34
const c5 = at(MONEY_FROM);
const TRUCK_X = 960 - (TRAIN.w2 - 280 + TRAIN.w1 + 280) / 2; //   both wagons centred (370)
const CAM_MONEY: CamKey[] = [
  { at: MONEY_FROM, dur: 0, z: 300 },
  { at: c5("money", 21540), dur: 760, z: 0 }, //                         S5 pull-back WITH wagon 1's roll
  { at: c5("On top", 25914) - 380, dur: 700, x: TRUCK_X }, //            S6 truck WITH wagon 2's drop
  { at: c5("in all", 37830), dur: 600, x: TRUCK_X, y: 110, z: 120 }, //  S7 push-in on the total
  { at: c5("close", 40290), dur: 900, x: 960 - (TRAIN.w2 + TRAIN.roll + TRAIN.buffer) / 2, y: 0, z: 0 }, // S8 truck WITH the train
];
// ════ chunk 3 · §3 The drug ════
const DRUG_FROM = 45270; //                          section panel wipe in the pause 45.27–45.84, "The" 45.80
const c6 = at(DRUG_FROM);
const DIVE_MS = c6("It is", 49008); //               the dive rides "It is a bispecific…"
const INSIDE_MS = DIVE_MS + 500; //                  red flash covers the cut from vial to inside
const CAM_DRUG: CamKey[] = [
  { at: DRUG_FROM, dur: 0 },
  { at: DIVE_MS, dur: 500, y: 540 - VIAL2_BODY_Y, z: 1350 }, // S9 fly-through into the vial
  { at: INSIDE_MS, dur: 0, y: 0, z: 0 },
];
const DIS_FROM = 57220; //                           liquid blob paper→red ends on "It" 57.64; S9 holds ≥1s after ANG-2
const ANG2_MS = 55600; //                            pin: leads "Ang-2." (56.04) so S9 settles before the blob
const c7 = at(DIS_FROM);
const CAM_DIS: CamKey[] = [{ at: 57640, dur: 0 }, { at: c7("million", 66680), dur: 500, y: 40, z: 110 }]; // S10 push-in on the count
const PART_FROM = 68150; //                          plain edge wipe in the pause 68.15–68.55, "OLN-324" 68.89
const c8 = at(PART_FROM);
const CAM_PART: CamKey[] = [{ at: PART_FROM, dur: 0, z: 220, y: 40 }, { at: c8("OLN-324", 68892) - 380, dur: 700, z: 0, y: 0 }]; // S11 pull-back with the plank's drop
// ════ chunk 4 · §4 The data ════
const DATA_FROM = 74560; //                          section panel wipe in the pause 74.56–74.99, "The" 75.08
const c9 = at(DATA_FROM);
const CAM_FACE: CamKey[] = [{ at: DATA_FROM, dur: 0 }, { at: c9("blocks", 84520), dur: 500, y: -50, z: 140 }]; // S12 push-in on the face-off
const STACK_FROM = 85900; //                         plain edge wipe in the pause 85.90–86.19, "In" 86.58
const c10 = at(STACK_FROM);
const CAM_STACK: CamKey[] = [{ at: STACK_FROM, dur: 0, y: -20 }, { at: c10("90%", 89490) - 380 - 720, dur: 1000, y: 20 }]; // S13 crane up with the rising stack
const BAL_FROM = 98470; //                           liquid blob paper→red fills 98.05–98.47, "In" 98.75
const c11 = at(BAL_FROM);
const CAM_BAL: CamKey[] = [{ at: BAL_FROM, dur: 0, z: 250 }, { at: c11("wet", 99060) - 380, dur: 700, z: 0 }]; // S14 pull-back with the scale's drop
const CAV_FROM = 103440; //                          liquid blob red→ink fills 102.98–103.44, "These" 103.72
const c12 = at(CAV_FROM);
const CAM_CAV: CamKey[] = [{ at: CAV_FROM, dur: 0, x: 960 - CAV.card }, { at: c12("J&J's", 107390), dur: 700, x: 960 - CAV.rel }]; // S15 truck to the release
const NONE_MS = 110050; //                           pin: NO NUMBERS lands ahead of "no numbers" (111.10) so it holds 1s before the wipe
// ════ chunk 5 · §5 The funder ════
const FUND_FROM = 111410; //                         section panel wipe in the pause 111.41–111.94, "Here" 111.95
const c13 = at(FUND_FROM);
const CAM_HG: CamKey[] = [{ at: FUND_FROM, dur: 0 }, { at: c13("fund", 122490), dur: 500, y: 540 - HG_BOTTOM_Y + 60, z: 70 }]; // S16 push-in as the bottom fills
const TIX_FROM = 125610; //                          plain edge wipe in the pause 125.61–125.92, "In" 126.28
const c14 = at(TIX_FROM);
const CAM_TIX: CamKey[] = [{ at: TIX_FROM, dur: 0, y: 60 }, { at: c14("regulatory", 128820) - 380, dur: 700, y: 0 }]; // S17 crane down with the first ticket
const ROY_MS = 130800; //                            pin: the royalties ticket lands on "plus" so S17 holds 1s before the blob
const DOM_FROM = 132950; //                          liquid blob ink→red fills 132.53–132.95, "That" 133.20
const c15 = at(DOM_FROM);
const CAM_DOM: CamKey[] = [{ at: DOM_FROM, dur: 0, x: 60 }, { at: c15("only", 134320), dur: 600, x: -40 }]; // S18 truck with the second domino
// ════ chunk 6 · §6 Why it matters ════
const WHY_FROM = 136490; //                          section panel wipe in the pause 136.49–137.01, "Why" 137.00
const c16 = at(WHY_FROM);
const FLICK_MS = 145570; //                          pin: the bill flies on "risky" so the reveal lands by "to an"
const REVEAL_MS = 146520; //                         the head turns on "to an (outside funder)"; S19 holds 1s before the wipe
const CAM_HAND: CamKey[] = [{ at: WHY_FROM, dur: 0, x: -120 }, { at: REVEAL_MS, dur: 500, x: -200, y: 70, z: 100 }]; // S19 push-in on the reveal
const FORK_FROM = 147930; //                         plain edge wipe in the pause 147.93–148.27, "If" 148.50
const c17 = at(FORK_FROM);
const CAM_FORK: CamKey[] = [{ at: FORK_FROM, dur: 0, y: 60 }, { at: c17("fail", 149390) + 600, dur: 800, y: 0 }]; // S20 crane down with the first ball
const BAR_FROM = 154870; //                          plain edge wipe in the pause 154.87–155.31, "And" 155.30
const c18 = at(BAR_FROM);
const MORE_MS = 162800; //                           pin: the red bar lands on "does (more than)" so S21 holds ≥1s
const CAM_BAR: CamKey[] = [{ at: BAR_FROM, dur: 0 }, { at: MORE_MS, dur: 500, y: 60, z: 110 }]; // S21 push-in on the higher bar
// ════ chunk 7 · §7 What to watch + CTA ════
const WATCH_FROM = 164530; //                        section panel wipe in the pause 164.53–164.87, "So" 164.85
const c19 = at(WATCH_FROM);
const ORDER_MS = c19("in order", 166290);
const CAM_WATCH: CamKey[] = [
  { at: WATCH_FROM, dur: 0, y: -120, z: -300 },
  { at: ORDER_MS - 400, dur: 800, y: 0 }, //                                  S22 crane with the gates rising
  { at: c19("First", 167087), dur: 600, z: gateCamZ(1) }, //                  S22 push-in on gate 1
  { at: c19("Then the start", 170550), dur: 1000, z: gateCamZ(2) }, //                  S23 fly through gate 1
  { at: c19("second half", 177250), dur: 500, z: gateCamZ(2) + 120, y: 40 }, //     S23 push-in on the date
  { at: c19("And then", 179750), dur: 1000, z: gateCamZ(3), y: 0 }, //              S24 fly through gate 2
];
const CTA_FROM = 189450; //                          section panel wipe in the pause 189.45–189.89, "We" 189.85

export const WORLDS: WorldDef[] = [
  { fromMs: 0, bg: "red" },
  { fromMs: BILL_FROM, bg: "ink", durationMs: 1 } as WorldDef,
  { fromMs: SIGN_FROM, bg: "paper", durationMs: 280 } as WorldDef,
  { fromMs: MONEY_FROM, bg: "ink", section: true, durationMs: 430 } as WorldDef,
  { fromMs: DRUG_FROM, bg: "paper", section: true, durationMs: 530 } as WorldDef,
  { fromMs: 57640, bg: "red", durationMs: 1 } as WorldDef,
  { fromMs: PART_FROM, bg: "paper", durationMs: 300 } as WorldDef,
  { fromMs: DATA_FROM, bg: "ink", section: true, durationMs: 430 } as WorldDef,
  { fromMs: STACK_FROM, bg: "paper", durationMs: 280 } as WorldDef,
  { fromMs: BAL_FROM, bg: "red", durationMs: 1 } as WorldDef,
  { fromMs: CAV_FROM, bg: "ink", durationMs: 1 } as WorldDef,
  { fromMs: FUND_FROM, bg: "paper", section: true, durationMs: 530 } as WorldDef,
  { fromMs: TIX_FROM, bg: "ink", durationMs: 300 } as WorldDef,
  { fromMs: DOM_FROM, bg: "red", durationMs: 1 } as WorldDef,
  { fromMs: WHY_FROM, bg: "ink", section: true, durationMs: 510 } as WorldDef,
  { fromMs: FORK_FROM, bg: "paper", durationMs: 300 } as WorldDef,
  { fromMs: BAR_FROM, bg: "ink", durationMs: 300 } as WorldDef,
  { fromMs: WATCH_FROM, bg: "paper", section: true, durationMs: 330 } as WorldDef,
  { fromMs: CTA_FROM, bg: "ink", section: true, durationMs: 400 } as WorldDef,
];

export const JnjOllin: React.FC = () => (
  <V2.Provider value>
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Audio src={staticFile("vo/vo.mp3")} />
      <MusicBed volume={MUSIC.volume * BED_GAIN} />

      <World {...WORLDS[0]} lineArt={false}>
        <Camera on={CAMERA_3D} keys={CAM_HOOK}>
          <Hook from={0} to={7050} jj={{ word: "Johnson" }} price={{ word: "$2.2" }} upfront={{ word: "up front" }} company={{ word: "company" }}
            one={{ word: "one" }} late={{ word: "late-stage" }} />
        </Camera>
        <LiquidWipe at={BILL_FROM} dur={420} color={COLORS.ink} origin={[1820, 980]} />
      </World>

      <World {...WORLDS[1]} lineArt={false}>
        <Camera on={CAMERA_3D} keys={CAM_BILL}>
          <BillPass from={BILL_FROM} to={SIGN_FROM} and={{ word: "it has" }} lined={{ word: "lined up" }} someone={{ word: "someone" }}
            pay={{ word: "pay" }} flick={{ word: "that drug's" }} />
        </Camera>
      </World>

      <World {...WORLDS[2]} lineArt={false}>
        <Camera on={CAMERA_3D} keys={CAM_SIGN}>
          <Signing from={12030} to={EYE_FROM} nov={{ word: "November" }} jj={{ word: "J&J" }} agreed={{ word: "agreed" }} acquire={{ word: "acquire" }} />
        </Camera>
        <Camera on={CAMERA_3D} keys={CAM_EYE}>
          <EyeOpens from={EYE_FROM} to={MONEY_FROM} clinical={{ word: "company" }} developing={{ word: "developing" }} />
        </Camera>
      </World>

      <World {...WORLDS[3]} lineArt={false}>
        <Camera on={CAMERA_3D} keys={CAM_MONEY}>
          <MoneyTrain from={MONEY_FROM} to={DRUG_FROM} money={{ word: "money" }} order={{ word: "order" }} price={{ word: "$2.2" }} upfront={{ word: "up front" }}
            ontop={{ word: "On top" }} upto={{ word: "up to" }} price2={{ word: "$1.125" }} onlyif={{ word: "only if" }} reg={{ word: "regulatory" }} com={{ word: "commercial" }}
            ourmath={{ word: "By our" }} total={{ word: "$3.3" }} jj={{ word: "J&J" }} close={{ word: "close" }} year={{ word: "2026" }} subject={{ word: "subject" }} />
        </Camera>
      </World>

      <World {...WORLDS[4]} lineArt={false}>
        <Camera on={CAMERA_3D} keys={CAM_DRUG}>
          <DrugDive from={DRUG_FROM} to={DIS_FROM} drug={{ word: "The drug" }} name={{ word: "OLN-324" }} dive={{ word: "It is" }} antibody={{ ms: 50140 }}
            two={{ word: "two signals" }} vegf={{ word: "VEGF" }} ang2Ms={ANG2_MS} inMs={INSIDE_MS} />
        </Camera>
      </World>
      {/* outside the paper world so the blob also swallows the black margins around the card */}
      <LiquidWipe at={57640} dur={420} color={COLORS.accent} origin={[1820, 100]} />

      <World {...WORLDS[5]} lineArt={false}>
        <Camera on={CAMERA_3D} keys={CAM_DIS}>
          <Diseases from={57640} to={PART_FROM} wet={{ word: "wet" }} diabetic={{ word: "diabetic" }} together={{ word: "together" }} forty={{ word: "40" }} million={{ word: "million" }} />
        </Camera>
      </World>

      <World {...WORLDS[6]} lineArt={false}>
        <Camera on={CAMERA_3D} keys={CAM_PART}>
          <Partners from={PART_FROM} to={DATA_FROM} name={{ word: "OLN-324" }} innovent={{ word: "Innovent" }} develops={{ word: "develops" }} />
        </Camera>
      </World>

      <World {...WORLDS[7]} lineArt={false}>
        <Camera on={CAMERA_3D} keys={CAM_FACE}>
          <FaceOff from={DATA_FROM} to={STACK_FROM} jade={{ word: "JADE" }} patients={{ word: "160" }} head={{ word: "head-to-head" }} vabysmo={{ word: "Vabysmo" }}
            roche={{ word: "Roche" }} blocks={{ word: "blocks" }} />
        </Camera>
      </World>

      <World {...WORLDS[8]} lineArt={false}>
        <Camera on={CAMERA_3D} keys={CAM_STACK}>
          <TileStacks from={STACK_FROM} to={98050} dme={{ word: "diabetic" }} ninety={{ word: "90%" }} noedema={{ word: "no edema" }} fiftyseven={{ word: "57%" }} />
        </Camera>
      </World>
      <LiquidWipe at={BAL_FROM} dur={420} color={COLORS.accent} origin={[100, 100]} />

      <World {...WORLDS[9]} lineArt={false}>
        <Camera on={CAMERA_3D} keys={CAM_BAL}>
          <Balance from={BAL_FROM} to={102980} wet={{ word: "wet" }} drugs={{ word: "drugs" }} performed={{ word: "performed" }} />
        </Camera>
        <LiquidWipe at={CAV_FROM} dur={460} color={COLORS.ink} origin={[1820, 980]} />
      </World>

      <World {...WORLDS[10]} lineArt={false}>
        <FootageScrim from={CAV_FROM} to={FUND_FROM} src="broll/s15_lab.mp4" max={0.2} /> {/* bright white lab: 0.2, not 0.4 */}
        <Camera on={CAMERA_3D} keys={CAM_CAV}>
          <Caveat from={CAV_FROM} to={FUND_FROM} these={{ word: "These" }} company={{ word: "company-reported" }} early={{ word: "early-stage" }}
            compelling={{ word: "compelling" }} noneMs={NONE_MS} />
        </Camera>
      </World>

      <World {...WORLDS[11]} lineArt={false}>
        <Camera on={CAMERA_3D} keys={CAM_HG}>
          <Hourglass from={FUND_FROM} to={TIX_FROM} unusual={{ word: "unusual" }} separate={{ word: "separate" }} blackstone={{ word: "Blackstone" }} price={{ word: "$750" }}
            over={{ word: "over several" }} fund={{ word: "fund" }} phase={{ word: "Phase" }} />
        </Camera>
      </World>

      <World {...WORLDS[12]} lineArt={false}>
        <FootageScrim from={TIX_FROM} to={132530} src="broll/s17_finance.mp4" max={0.3} />
        <Camera on={CAMERA_3D} keys={CAM_TIX}>
          <Tickets from={TIX_FROM} to={132530} ret={{ word: "In return" }} eligible={{ word: "eligible" }} reg={{ word: "regulatory" }} sales={{ word: "sales" }} royMs={ROY_MS} />
        </Camera>
        <LiquidWipe at={DOM_FROM} dur={420} color={COLORS.accent} origin={[100, 980]} />
      </World>

      <World {...WORLDS[13]} lineArt={false}>
        <Camera on={CAMERA_3D} keys={CAM_DOM}>
          <Dominoes from={DOM_FROM} to={WHY_FROM} firstMs={133200} only={{ word: "only" }} />
        </Camera>
      </World>

      <World {...WORLDS[14]} lineArt={false}>
        <Camera on={CAMERA_3D} keys={CAM_HAND}>
          <Handoff from={WHY_FROM} to={FORK_FROM} why={{ word: "Why" }} read={{ word: "our read" }} jj={{ word: "J&J" }} drug={{ word: "drug" }} ready={{ word: "ready for" }}
            and={{ word: "and handing" }} bill={{ word: "bill" }} flickMs={FLICK_MS} revealMs={REVEAL_MS} />
        </Camera>
        <OurRead t={c16("Why", 137000)} tRead={c16("our read", 139410)} dark />
      </World>

      <World {...WORLDS[15]} lineArt={false}>
        <Camera on={CAMERA_3D} keys={CAM_FORK}>
          <Fork from={FORK_FROM} to={BAR_FROM} if1={{ word: "If the" }} fail={{ word: "fail" }} spent={{ word: "Blackstone's" }} if2={{ ms: 152240 }}
            succeed={{ word: "succeed" }} shares={{ word: "Blackstone shares" }} />
        </Camera>
        <OurRead t={-1} tRead={-1} dark={false} />
      </World>

      <World {...WORLDS[16]} lineArt={false}>
        <Camera on={CAMERA_3D} keys={CAM_BAR}>
          <Bar from={BAR_FROM} to={WATCH_FROM} and={{ word: "And the" }} bar={{ word: "bar" }} vab={{ word: "Vabysmo" }} approved={{ word: "approved" }} oln={{ word: "OLN-324" }} moreMs={MORE_MS} />
        </Camera>
        <OurRead t={-1} tRead={-1} dark />
      </World>

      <World {...WORLDS[17]} lineArt={false}>
        <Camera on={CAMERA_3D} keys={CAM_WATCH}>
          <Gates from={WATCH_FROM} to={CTA_FROM} keys={CAM_WATCH} order={{ ms: ORDER_MS }} g1={[{ word: "deal" }, { word: "expected" }]}
            g2={[{ word: "start" }, { word: "second half" }]} g3={[{ word: "real test" }, { word: "large" }]} money={{ word: "milestone" }} />
        </Camera>
        <WatchPlate t={c19("So", 164850)} tOrder={ORDER_MS} />
      </World>

      <World {...WORLDS[18]} lineArt={false}>
        <CTACard from={CTA_FROM} to={timeline.durationMs + 1200} bg="ink"
          headline="We track the deals that move biotech" emphasize="move biotech" sub="Every week in The Catalyst Brief."
          button="Subscribe free" link="thecatalystbrief.com" tail="Signal over noise."
          cues={{ logo: "We track", headline: "We track", sub: "every week", button: "Subscribe free", tail: "Signal over" }} ms={{ link: 195910 }} />
      </World>

      <BroadcastFrame brand={BRAND} sections={SECTIONS} worlds={WORLDS} untilMs={timeline.durationMs} />
    </AbsoluteFill>
  </V2.Provider>
);
