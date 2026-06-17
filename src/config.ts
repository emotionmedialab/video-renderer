// Timeline config — built automatically from the analyzer's output.
// `scripts/analyze.mjs` writes cuts.json (kept segments per scene, dead air
// removed) and pacing.json (breathing-room holds). Nothing here is hand-edited.

import { FORMAT, frames, TRANSITIONS, MUSIC } from "./style";
import cuts from "./cuts.json";
import holds from "./pacing.json";

export const FPS = FORMAT.fps;
export const WIDTH = FORMAT.width;
export const HEIGHT = FORMAT.height;
export const TRANSITION_FRAMES = TRANSITIONS.crossfadeFrames;
export { frames };

export type Seg = { from: number; to: number };
export type SceneConfig = {
  key: string;
  src: string;
  segments: Seg[];
  hold: number;
  durationInFrames: number;
};

const CUTS = cuts as Record<string, Seg[]>;
const HOLDS = holds as Record<string, number>;

// Scenes, in order (scene1, scene2, …), straight from the analyzer.
export const SCENES: SceneConfig[] = Object.keys(CUTS).map((key) => {
  const segments = CUTS[key];
  const hold = HOLDS[key] ?? 0;
  const base = segments.reduce((a, s) => a + frames(s.to - s.from), 0);
  return { key, src: `scenes/${key}.mp4`, segments, hold, durationInFrames: base + hold };
});

// Re-export the kept segments for the caption remapper.
export { CUTS };

// Optional assets — drop these in public/assets/ (omit if a week has none).
export const OUTRO = { src: "assets/outro.mp4", durationInFrames: 152 };
export const BG_MUSIC = { src: "assets/bgmusic.mp3", volume: MUSIC.volume };

// Transitions: one after each scene (between scenes + into the outro).
export const TOTAL_FRAMES =
  SCENES.reduce((a, s) => a + s.durationInFrames, 0) +
  OUTRO.durationInFrames -
  SCENES.length * TRANSITION_FRAMES;
