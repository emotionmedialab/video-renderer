import React from "react";
import { Composition } from "remotion";
import { Reel } from "./Reel";
import { FPS, WIDTH, HEIGHT, TOTAL_FRAMES } from "./config";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Reel"
      component={Reel}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
