import React from "react";
import { Composition } from "remotion";
import { FORMAT } from "./style";
import { Starter } from "./Starter";
import timeline from "./timeline.json";
import { CgOncology } from "./CgOncology";

// ─────────────────────────────────────────────────────────────────────────
// CLEAN STARTER Root — no video yet.
//
// The only composition registered is `Starter` (a template health-check, see
// Starter.tsx) so the dev server loads on a fresh scaffold. When you build a
// video:
//   1. create src/<VideoName>.tsx — wire kit blocks to timeline.words[] via
//      CUE WORDS, never raw ms (see references/block-kit.md). Build it 3D from the
//      first pass: `export const CAMERA_3D = true;` and wrap each world's blocks in
//      `<Camera on={CAMERA_3D} keys={...}>` (kit/camera; `on` defaults to true).
//      Per chunk: write src/motion-plan.json, run scripts/motion-audit.mjs, then
//      scripts/storyboard.mjs for the operator's one-image preview.
//   2. register it below, driving durationInFrames off timeline.json, e.g.:
//
//        import timeline from "./timeline.json";
//        import { MyVideo } from "./MyVideo";
//        const DUR = Math.round(((timeline.durationMs + 1200) / 1000) * FORMAT.fps);
//        <Composition id="MyVideo" component={MyVideo}
//          fps={FORMAT.fps} width={FORMAT.width} height={FORMAT.height}
//          durationInFrames={DUR} defaultProps={{}} />
//
//   3. delete Starter.tsx + its <Composition> once your video is the comp you
//      preview and render.
// ─────────────────────────────────────────────────────────────────────────

const DUR = Math.round(((timeline.durationMs + 1200) / 1000) * FORMAT.fps);

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="CgOncology" component={CgOncology} fps={FORMAT.fps} width={FORMAT.width} height={FORMAT.height}
      durationInFrames={DUR} defaultProps={{}} />
    <Composition
      id="Starter"
      component={Starter}
      fps={FORMAT.fps}
      width={FORMAT.width}
      height={FORMAT.height}
      durationInFrames={90}
      defaultProps={{}}
    />
  </>
);
