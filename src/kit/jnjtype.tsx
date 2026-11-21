// KIT · jnjtype — LineDrop: a WORD line lands as one solid piece (falls, squashes once, settles). Replaces the
// letter-by-letter KType on word text (Nel, 2026-11-19, on "THE UNUSUAL PART": "do not use this animation for the
// text" — mid-drop the letters read as a broken staircase). KType stays for figures ($2.2B, 90%).
import React from "react";
import { clamp01, useMs } from "./core";
import { line } from "./inovio";
import { useSpringX } from "./v2style";

export const LineDrop: React.FC<{ text: string; t: number; size: number; color: string; shadow?: string }> = ({ text, t, size, color, shadow }) => {
  const ms = useMs();
  const sp = useSpringX();
  if (ms < t) return <div style={{ ...line(size, color), visibility: "hidden" }}>{text}</div>;
  const f = clamp01((ms - t) / 260);
  const sq = ms >= t + 260 ? 1 - sp(t + 260, 7, 200, 0.6) : 0;
  return (
    <div style={{ ...line(size, color), textShadow: shadow, transformOrigin: "50% 100%",
      transform: `translateY(${-size * 1.6 * (1 - f * f)}px) scale(${1 + 0.06 * sq}, ${1 - 0.12 * sq})` }}>{text}</div>
  );
};
