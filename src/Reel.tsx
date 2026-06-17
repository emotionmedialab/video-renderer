import React from "react";
import {
  AbsoluteFill,
  Audio,
  Freeze,
  interpolate,
  OffthreadVideo,
  Sequence,
  Series,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { SCENES, OUTRO, BG_MUSIC, SceneConfig, frames, TRANSITION_FRAMES } from "./config";
import { PAGES } from "./captions";
import { BROLL } from "./broll";
import { CAPTIONS, MUSIC } from "./style";

const BROLL_FADE = 4;
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ── B-roll cutaway: full-screen footage while a topic is spoken. Fades only at
//    the OUTER edges so adjacent clips read as one continuous stretch. ──
const BrollCard: React.FC<{
  file: string;
  durationInFrames: number;
  fadeIn: boolean;
  fadeOut: boolean;
}> = ({ file, durationInFrames, fadeIn, fadeOut }) => {
  const f = useCurrentFrame();
  const F = BROLL_FADE;
  const op = Math.min(
    fadeIn ? interpolate(f, [0, F], [0, 1], CLAMP) : 1,
    fadeOut ? interpolate(f, [durationInFrames - F, durationInFrames], [1, 0], CLAMP) : 1
  );
  return (
    <AbsoluteFill style={{ opacity: op, backgroundColor: "black" }}>
      <OffthreadVideo
        src={staticFile(file)}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};

const BrollLayer: React.FC<{ sceneKey: string }> = ({ sceneKey }) => {
  const items = BROLL.filter((b) => b.sceneKey === sceneKey);
  return (
    <>
      {items.map((clip) => {
        const dur = frames(clip.end - clip.start);
        const fadeIn = !items.some((o) => o !== clip && Math.abs(o.end - clip.start) < 0.2);
        const fadeOut = !items.some((o) => o !== clip && Math.abs(o.start - clip.end) < 0.2);
        return (
          <Sequence key={clip.id} from={frames(clip.start)} durationInFrames={dur}>
            <BrollCard file={clip.file} durationInFrames={dur} fadeIn={fadeIn} fadeOut={fadeOut} />
          </Sequence>
        );
      })}
    </>
  );
};

// ── White-box caption (style from style.ts). ──
const SceneCaptions: React.FC<{ sceneKey: string }> = ({ sceneKey }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = (frame / fps) * 1000;
  const active = (PAGES[sceneKey] ?? []).find((p) => ms >= p.start && ms < p.end);
  if (!active) return null;
  return (
    <AbsoluteFill
      style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: CAPTIONS.paddingBottom }}
    >
      <span
        style={{
          display: "inline-block",
          maxWidth: CAPTIONS.maxWidth,
          textAlign: "center",
          fontFamily: CAPTIONS.fontFamily,
          fontWeight: CAPTIONS.fontWeight,
          fontSize: CAPTIONS.fontSize,
          lineHeight: 1.25,
          color: CAPTIONS.color,
          background: CAPTIONS.background,
          padding: "10px 22px",
          borderRadius: 10,
        }}
      >
        {active.text}
      </span>
    </AbsoluteFill>
  );
};

// ── One scene: kept segments back-to-back (dead air cut), a breathing-room
//    freeze hold, b-roll, and captions. ──
const SceneClip: React.FC<{ scene: SceneConfig }> = ({ scene }) => {
  const lastSeg = scene.segments[scene.segments.length - 1];
  const base = scene.durationInFrames - scene.hold;
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Series>
        {scene.segments.map((seg, i) => {
          const isLast = i === scene.segments.length - 1;
          return (
            <Series.Sequence key={i} durationInFrames={frames(seg.to - seg.from)}>
              <OffthreadVideo
                src={staticFile(scene.src)}
                trimBefore={frames(seg.from)}
                trimAfter={isLast ? undefined : frames(seg.to)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Series.Sequence>
          );
        })}
      </Series>
      {scene.hold > 0 ? (
        <Sequence from={base} durationInFrames={scene.hold}>
          <Freeze frame={Math.max(0, frames(lastSeg.to - lastSeg.from) - 2)}>
            <AbsoluteFill style={{ backgroundColor: "black" }}>
              <OffthreadVideo
                src={staticFile(scene.src)}
                trimBefore={frames(lastSeg.from)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </AbsoluteFill>
          </Freeze>
        </Sequence>
      ) : null}
      <BrollLayer sceneKey={scene.key} />
      <SceneCaptions sceneKey={scene.key} />
    </AbsoluteFill>
  );
};

export const Reel: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  const fadeStart = durationInFrames - MUSIC.fadeOutFrames;
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <TransitionSeries>
        {SCENES.map((scene, i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Sequence durationInFrames={scene.durationInFrames}>
              <SceneClip scene={scene} />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition
              presentation={fade()}
              timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
            />
          </React.Fragment>
        ))}
        <TransitionSeries.Sequence durationInFrames={OUTRO.durationInFrames}>
          <AbsoluteFill style={{ backgroundColor: "black" }}>
            <OffthreadVideo
              src={staticFile(OUTRO.src)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </AbsoluteFill>
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <Audio
        src={staticFile(BG_MUSIC.src)}
        volume={(f) =>
          f < fadeStart
            ? BG_MUSIC.volume
            : interpolate(f, [fadeStart, durationInFrames], [BG_MUSIC.volume, 0], CLAMP)
        }
      />
    </AbsoluteFill>
  );
};
