import { HistoryItem } from "./types";

const KEY = "album-palette-history";
const MAX = 10;

export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function addToHistory(item: HistoryItem): void {
  const history = getHistory().filter(
    (h) => !(h.name === item.name && h.artist === item.artist)
  );
  history.unshift(item);
  localStorage.setItem(KEY, JSON.stringify(history.slice(0, MAX)));
}
