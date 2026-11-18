// Tandem Mobi tubeless — SHORT, VERTICAL 9:16, 2026-11-18. House style 11-16 (MOTION-RULES §0).
// On-screen limits: script.md header ("up to 7 days" on the infusion set; "takes share" is an open question).

import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { cue, MusicBed } from "./kit/core";
import { Camera, type CamKey } from "./kit/camera";
import { BroadcastFrame, World, type SectionDef, type WorldDef } from "./kit/world";
import { V2 } from "./kit/v2style";
import { LiquidWipeV } from "./kit/pfb1v2";
import { CAL_CAM, CATCH_CAM, Catch, Hook, HOOK_CAM, Launch, Versus, VS_CAM } from "./kit/tandem1";
import { OpenQuestion, Q_CAM, Route, ROUTE_CAM, SIGN_CAM, Signpost, TWO_CAM, TwoPlates } from "./kit/tandem2";
import { CTACard, FootageScrim } from "./kit/blocks";
import { MUSIC, BRAND, COLORS } from "./style";
import timeline from "./timeline.json";

export const CAMERA_3D = true;
const ORIGIN: [number, number] = [540, 960];
const BED_GAIN = 1.6; // mix-to-target 2026-11-18: VO recut -16.3 → -12.2 LUFS, bed raised by the same dB (SUM -12.1)
const SECTIONS = timeline.sections as SectionDef[];
const at = (from: number) => (w: string, fb: number) => cue(w, fb, from);

// ── §1 hook: push-in on "days", crane down WITH the dial's dock, push-in WITH the FDA tag ──
const c1 = at(0);
const PUMP_MS = 3060; //                             the pump lands ON "Tandem's" (2.96) — fall starts 2.68
const CAM_HOOK: CamKey[] = [
  { at: 0, dur: 0 },
  { at: c1("days", 1000), dur: 600, z: HOOK_CAM.push1.z },
  { at: c1("Mobi", 3960), dur: 700, y: HOOK_CAM.crane.y, z: HOOK_CAM.crane.z },
  { at: c1("just cleared", 5500), dur: 700, z: HOOK_CAM.push2.z },
];
const VS_FROM = 7510; //                             liquid wipe fills the pause 7.07–7.51, "Omnipod" 7.56
const c2 = at(VS_FROM);
const CAM_VS: CamKey[] = [{ at: VS_FROM, dur: 0 }, { at: c2("Tandem has", 11950), dur: 600, y: VS_CAM.crane.y }];
const CATCH_FROM = 14350; //                         section panel wipe in the pause 14.35–14.77, "The" 14.84
const c3 = at(CATCH_FROM);
const CAM_CATCH: CamKey[] = [{ at: CATCH_FROM, dur: 0 }, { at: c3("still", 16620) + 250, dur: 600, z: CATCH_CAM.push.z, y: CATCH_CAM.push.y }];
const LAUNCH_FROM = 18550; //                        liquid wipe fills the pause 18.20–18.55, "and" 18.55
const c4 = at(LAUNCH_FROM);
const CAM_LAUNCH: CamKey[] = [{ at: LAUNCH_FROM, dur: 0 }, { at: c4("waits", 19190), dur: 700, y: CAL_CAM.crane.y }];
// ════ chunk 2 ════
const C2_FROM = 22230; //                            liquid wipe fills 21.86–22.23, "It" 22.28
const c5 = at(C2_FROM);
const CAM_ROUTE: CamKey[] = [{ at: C2_FROM, dur: 0 }, { at: c5("reroutes", 24810) + 150, dur: 900, x: ROUTE_CAM.push.x, y: ROUTE_CAM.push.y, z: ROUTE_CAM.push.z }];
const SIGN_FROM = 27730; //                          plain edge wipe in the pause 27.73–28.01, "which" 28.01
const c6 = at(SIGN_FROM);
const CAM_SIGN: CamKey[] = [
  { at: SIGN_FROM, dur: 0 },
  { at: c6("reimbursement", 28610), dur: 700, x: SIGN_CAM.truck1.x },
  { at: c6("scale", 30200), dur: 700, x: SIGN_CAM.truck2.x, y: SIGN_CAM.truck2.y },
];
const TWO_FROM = 32450; //                           liquid wipe fills 32.08–32.45, "One" 32.45
const c7 = at(TWO_FROM);
const CAM_TWO: CamKey[] = [{ at: TWO_FROM, dur: 0 }, { at: c7("channel", 35620), dur: 650, z: TWO_CAM.push.z, y: TWO_CAM.push.y }];
const Q_FROM = 37400; //                             liquid wipe 36.98–37.40 (held so RESET settles ≥1s; "Whether" under the blob)
const c8 = at(Q_FROM);
const CAM_Q: CamKey[] = [{ at: Q_FROM, dur: 0 }, { at: c8("pump share", 37860), dur: 600, x: Q_CAM.truck.x }];
const CTA_FROM = 42340; //                           section panel wipe in the pause 42.34–42.81, "That" 42.80

export const WORLDS: WorldDef[] = [
  { fromMs: 0, bg: "red" },
  { fromMs: VS_FROM, bg: "ink", durationMs: 1 } as WorldDef,
  { fromMs: CATCH_FROM, bg: "paper", section: true, durationMs: 400 } as WorldDef,
  { fromMs: LAUNCH_FROM, bg: "red", durationMs: 1 } as WorldDef,
  { fromMs: C2_FROM, bg: "ink", durationMs: 1 } as WorldDef,
  { fromMs: SIGN_FROM, bg: "paper", durationMs: 280 } as WorldDef,
  { fromMs: TWO_FROM, bg: "red", durationMs: 1 } as WorldDef,
  { fromMs: Q_FROM, bg: "ink", durationMs: 1 } as WorldDef,
  { fromMs: CTA_FROM, bg: "paper", section: true, durationMs: 400 } as WorldDef,
];

export const TandemMobiShort: React.FC = () => (
  <V2.Provider value>
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Audio src={staticFile("vo/vo.mp3")} />
      <MusicBed volume={MUSIC.volume * BED_GAIN} />

      <World {...WORLDS[0]} lineArt={false}>
        <Camera on={CAMERA_3D} keys={CAM_HOOK} origin={ORIGIN}>
          <Hook from={0} to={7070} seven={{ word: "7" }} days={{ word: "days" }} clock={{ word: "clock" }} pumpMs={PUMP_MS}
            tubeless={{ word: "tubeless" }} dock={{ word: "Mobi" }} cleared={{ word: "just cleared" }} />
        </Camera>
        <LiquidWipeV start={7070} end={VS_FROM} color={COLORS.ink} origin={[980, 1820]} />
      </World>

      <World {...WORLDS[1]} lineArt={false}>
        {/* Pexels 6942242, glucose meter + lancing pen on a bright table: bright source, 0.2 */}
        <FootageScrim from={7600} to={CATCH_FROM} src="broll/s4_cgm.mp4" max={0.2} />
        <Camera on={CAMERA_3D} keys={CAM_VS} origin={ORIGIN}>
          <Versus from={VS_FROM} to={CATCH_FROM} pod={{ word: "Omnipod" }} incumbent={{ word: "incumbent" }} three={{ word: "3" }}
            tandem={{ word: "Tandem has" }} doubled={{ word: "doubled" }} />
        </Camera>
      </World>

      <World {...WORLDS[2]} lineArt={false}>
        <Camera on={CAMERA_3D} keys={CAM_CATCH} origin={ORIGIN}>
          <Catch from={CATCH_FROM} to={18200} catchW={{ word: "catch" }} cartridge={{ word: "cartridge" }} swap={{ word: "still" }} />
        </Camera>
      </World>
      {/* outside the paper world so the blob also swallows the black margins around the card */}
      <LiquidWipeV start={18200} end={LAUNCH_FROM} color={COLORS.accent} origin={[100, 300]} />

      <World {...WORLDS[3]} lineArt={false}>
        <Camera on={CAMERA_3D} keys={CAM_LAUNCH} origin={ORIGIN}>
          <Launch from={LAUNCH_FROM} to={21860} us={{ word: "US" }} waits={{ word: "waits" }} until={{ word: "until" }} half={{ word: "first half" }} />
        </Camera>
        <LiquidWipeV start={21860} end={C2_FROM} color={COLORS.ink} origin={[960, 1800]} />
      </World>

      <World {...WORLDS[4]} lineArt={false}>
        {/* Pexels 8657611, a medicine bottle set down at a pharmacy counter by the card terminal: darker source, 0.3 */}
        <FootageScrim from={22300} to={SIGN_FROM} src="broll/s7_pharmacy.mp4" max={0.3} />
        <Camera on={CAMERA_3D} keys={CAM_ROUTE} origin={ORIGIN}>
          <Route from={C2_FROM} to={SIGN_FROM} arriveMs={22280} market={{ word: "market" }} pharmacy={{ word: "pharmacy-only" }} reroutes={{ word: "reroutes" }} away={{ word: "away from" }} />
        </Camera>
      </World>

      <World {...WORLDS[5]} lineArt={false}>
        <Camera on={CAMERA_3D} keys={CAM_SIGN} origin={ORIGIN}>
          <Signpost from={SIGN_FROM} to={32080} arriveMs={27800} reimb={{ word: "reimbursement" }} scale={{ word: "scale" }} />
        </Camera>
      </World>
      <LiquidWipeV start={32080} end={TWO_FROM} color={COLORS.accent} origin={[980, 300]} />

      <World {...WORLDS[6]} lineArt={false}>
        <Camera on={CAMERA_3D} keys={CAM_TWO} origin={ORIGIN}>
          <TwoPlates from={TWO_FROM} to={36980} one1={{ word: "One wear" }} doubled={{ word: "doubled" }} one2={{ word: "One distribution" }} channel={{ word: "channel" }} />
        </Camera>
        <LiquidWipeV start={36980} end={Q_FROM} color={COLORS.ink} origin={[100, 1820]} />
      </World>

      <World {...WORLDS[7]} lineArt={false}>
        <Camera on={CAMERA_3D} keys={CAM_Q} origin={ORIGIN}>
          <OpenQuestion from={Q_FROM} to={CTA_FROM} arriveMs={Q_FROM} share={{ word: "pump share" }} back={{ word: "or just" }} forces={{ word: "forces" }} move={{ word: "move" }} />
        </Camera>
      </World>

      <World {...WORLDS[8]} lineArt={false}>
        <CTACard from={CTA_FROM} to={timeline.durationMs + 1200} bg="paper"
          headline="We track the deals that move biotech" emphasize="move biotech" sub="In this week's Catalyst Brief."
          button="Subscribe free" link="thecatalystbrief.com" tail="Signal over noise."
          cues={{ logo: "That read", headline: "That read", sub: "this week's", button: "Subscribe free", tail: "Signal over" }} ms={{ link: 47560 }} />
      </World>

      <BroadcastFrame brand={BRAND} sections={SECTIONS} worlds={WORLDS} untilMs={timeline.durationMs} />
    </AbsoluteFill>
  </V2.Provider>
);
