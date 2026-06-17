// ─────────────────────────────────────────────────────────────────────────
// THE BIOINTEL REEL FORMAT — the one place the look & feel lives.
// Tweak the recognizable style here; every component reads from this file.
// ─────────────────────────────────────────────────────────────────────────

export const FORMAT = {
  width: 1080,
  height: 1920,
  fps: 30,
};

export const frames = (seconds: number) => Math.round(seconds * FORMAT.fps);

// White-box caption (CapCut look): Helvetica, normal weight, black on white.
export const CAPTIONS = {
  fontFamily: "Helvetica, Arial, sans-serif",
  fontWeight: 400 as const,
  fontSize: 52,
  color: "#000",
  background: "#fff",
  paddingBottom: 380, // distance from the bottom (clears the platform UI)
  maxWidth: 940,
  lineMaxChars: 18, // grouping target for one caption line
  // Brand-name fixes for things Whisper mishears. Edit per client.
  corrections: [
    { wrong: /bio\s*intel/gi, right: "BioIntel" },
    { wrong: /bion?tel/gi, right: "BioIntel" },
    { wrong: /bye\s*o?\s*intel/gi, right: "BioIntel" }, // Whisper hears "BioIntel" as "Bye Ointel"
  ] as { wrong: RegExp; right: string }[],
};

export const TRANSITIONS = {
  crossfadeFrames: 8, // ~0.27s dissolve between scenes and into the outro
};

export const PACING = {
  minDeadAirSec: 1.0, // remove silences >= this (the dead-air rule)
  breathTargetSec: 0.5, // desired breathing room at a rushed transition
};

export const MUSIC = {
  volume: 0.18, // ducked under the voice
  fadeOutFrames: 45, // fade to 0 over ~1.5s at the end
};

export const BROLL = {
  fadeFrames: 4,
  adjacencySec: 0.2, // adjacent b-rolls within this gap hard-connect (no fade)
  minOnScreenSec: 5, // every b-roll shows at least this long
  // b-roll plays only on MIDDLE scenes — never the hook (first) or CTA (last).
  role: "middle" as "middle",
};
