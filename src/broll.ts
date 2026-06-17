import data from "./broll.json";

export type Broll = {
  id: string;
  sceneKey: string;
  file: string; // path inside public/
  start: number; // displayed seconds within the scene
  end: number;
  query: string;
  credit: string;
  pexelsUrl: string;
};

export const BROLL = data as Broll[];
