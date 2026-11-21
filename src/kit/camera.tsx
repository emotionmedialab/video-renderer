// ─────────────────────────────────────────────────────────────────────────
// KIT · camera — a 3D CAMERA over a block (Roche × Hansoh long-form, 2026-10-24;
// Nel: "do it with camera movement, make it 3D … make it reversible").
//
// `<Camera on keys>` films its children in CSS 3D: a perspective box and a stage
// transformed by the current camera pose. A pose moves ONLY on a key (each key = a
// spoken-cue onset + a duration to the new pose), so the camera holds still between
// cues: one mover at a time, landed things go still.
// `useZ()` / `useP3()` let a block put an element at a depth and keep its wrappers
// 3D. With `on={false}` both return nothing and the Camera renders its children
// bare: the block renders EXACTLY as the flat 2D version (the reversible switch).
//
// ⚠️ CSS flattens 3D under `opacity < 1`, `filter`, `clip-path` and `overflow:
// hidden`. A wrapper between the stage and a Z'd element must carry none of them
// (except while it is fading out, when flattening does not matter).
// ─────────────────────────────────────────────────────────────────────────

import React from "react";
import { Easing } from "remotion";
import { clamp01, useMs } from "./core";
import { lerp } from "./elora";

const Cam3DContext = React.createContext(false);
export const useCam3D = () => React.useContext(Cam3DContext);
/** `z(px)` → a "translateZ(..) " prefix for a transform string, or "" when the camera is off. */
export const useZ = () => {
  const on = useCam3D();
  return (z: number) => (on && z ? `translateZ(${z}px) ` : "");
};
/** spread onto every wrapper between the stage and a Z'd element */
export const useP3 = (): React.CSSProperties => (useCam3D() ? { transformStyle: "preserve-3d" } : {});

export type CamPose = { rx: number; ry: number; rz: number; x: number; y: number; z: number };
export type CamKey = Partial<CamPose> & { at: number; dur: number };
const ZERO: CamPose = { rx: 0, ry: 0, rz: 0, x: 0, y: 0, z: 0 };
const EASE = Easing.inOut(Easing.cubic);

export const camPoseAt = (keys: CamKey[], ms: number): CamPose => {
  let p: CamPose = { ...ZERO };
  for (const key of [...keys].sort((a, b) => a.at - b.at)) {
    if (ms < key.at) break;
    const q = key.dur > 0 ? EASE(clamp01((ms - key.at) / key.dur)) : 1;
    const target: CamPose = { ...p, ...Object.fromEntries(Object.entries(key).filter(([k]) => k in ZERO)) };
    p = { rx: lerp(p.rx, target.rx, q), ry: lerp(p.ry, target.ry, q), rz: lerp(p.rz, target.rz, q), x: lerp(p.x, target.x, q), y: lerp(p.y, target.y, q), z: lerp(p.z, target.z, q) };
  }
  return p;
};

// `on` defaults to TRUE (2026-11-11): a new composition is 3D unless it opts out. Every existing
// block passes `on={CAMERA_3D}` explicitly, so this default changes none of them.
export const Camera: React.FC<{ on?: boolean; keys: CamKey[]; perspective?: number; origin?: [number, number]; children: React.ReactNode }> = ({
  on = true, keys, perspective = 1500, origin = [960, 540], children,
}) => {
  const ms = useMs();
  if (!on) return <Cam3DContext.Provider value={false}>{children}</Cam3DContext.Provider>;
  const p = camPoseAt(keys, ms);
  return (
    <Cam3DContext.Provider value>
      <div style={{ position: "absolute", inset: 0, perspective, perspectiveOrigin: `${origin[0]}px ${origin[1]}px` }}>
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transformOrigin: `${origin[0]}px ${origin[1]}px`,
          transform: `translate3d(${p.x}px, ${p.y}px, ${p.z}px) rotateX(${p.rx}deg) rotateY(${p.ry}deg) rotateZ(${p.rz}deg)` }}>
          {children}
        </div>
      </div>
    </Cam3DContext.Provider>
  );
};
