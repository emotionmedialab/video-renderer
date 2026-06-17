import raw from "./captions.json";
import { CUTS, Seg } from "./config";
import { CAPTIONS } from "./style";

type Token = { text: string; startMs: number; endMs: number };
export type Page = { text: string; start: number; end: number };

// Apply brand-name corrections (from style.ts) to a caption line.
const correct = (s: string) =>
  CAPTIONS.corrections.reduce((acc, c) => acc.replace(c.wrong, c.right), s);

// Map a source-time ms onto the trimmed timeline (removed segments collapsed).
const remapMs = (ms: number, segs: Seg[]): number => {
  let acc = 0;
  for (const s of segs) {
    const f = s.from * 1000;
    const t = s.to * 1000;
    if (ms < f) return acc;
    if (ms <= t) return acc + (ms - f);
    acc += t - f;
  }
  return acc;
};

type Word = { text: string; start: number; end: number };

function buildPages(tokens: Token[]): Page[] {
  // 1) Merge Whisper sub-word tokens into whole words.
  const words: Word[] = [];
  for (const t of tokens) {
    const startsNew = words.length === 0 || /^\s/.test(t.text);
    if (startsNew) words.push({ text: t.text, start: t.startMs, end: t.endMs });
    else {
      const w = words[words.length - 1];
      w.text += t.text;
      w.end = t.endMs;
    }
  }
  // 2) Group whole words into short lines.
  const groups: Word[][] = [];
  let cur: Word[] = [];
  let chars = 0;
  const flush = () => {
    if (cur.length) {
      groups.push(cur);
      cur = [];
      chars = 0;
    }
  };
  for (const w of words) {
    cur.push(w);
    chars += w.text.trim().length + 1;
    if (chars >= CAPTIONS.lineMaxChars || /[.!?]$/.test(w.text.trim())) flush();
  }
  flush();
  // 3) Continuous windows (each line shows until the next begins).
  return groups
    .map((g, i) => ({
      text: correct(g.map((x) => x.text).join("").replace(/\s+/g, " ").trim()),
      start: g[0].start,
      end: i < groups.length - 1 ? groups[i + 1][0].start : g[g.length - 1].end + 500,
    }))
    .filter((p) => p.text.length > 0);
}

export const PAGES: Record<string, Page[]> = Object.fromEntries(
  Object.entries(raw as Record<string, Token[]>).map(([k, v]) => {
    const segs = CUTS[k] ?? [{ from: 0, to: Infinity }];
    const pages = buildPages(v)
      .map((p) => ({ text: p.text, start: remapMs(p.start, segs), end: remapMs(p.end, segs) }))
      .filter((p) => p.end - p.start > 40);
    return [k, pages];
  })
);
