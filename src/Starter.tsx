// Starter — a self-contained TEMPLATE HEALTH-CHECK, not a video.
// It exists so a freshly-scaffolded (empty) project still loads in the Remotion
// dev server and proves the brand tokens + fonts compile. It uses ONLY style.ts
// (no kit imports) so it can never break as the kit evolves.
//
// DELETE this + its <Composition> in Root.tsx once you register your real video.

import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, SANS, TYPE, TRACK, BRAND } from "./style";

export const Starter: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: COLORS.ink,
      fontFamily: SANS,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 24,
    }}
  >
    <div style={{ fontSize: TYPE.label, fontWeight: 700, letterSpacing: TRACK.nav, color: COLORS.accent }}>
      Long-Form Builder
    </div>
    <div style={{ fontSize: TYPE.headline, fontWeight: 700, letterSpacing: TRACK.headline, color: COLORS.paper }}>
      Clean template · {BRAND}
    </div>
    <div style={{ fontSize: TYPE.body, fontWeight: 400, letterSpacing: TRACK.body, color: "rgba(255,255,255,0.62)" }}>
      Engine ready — drop in a script + VO to begin.
    </div>
  </AbsoluteFill>
);
