import { HistoryItem } from "./types";

const KEY = "album-palette-history";
const FAV_KEY = "album-palette-favorites";
const MAX = 50;

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

export function getFavorites(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function isFavorited(name: string, artist: string): boolean {
  return getFavorites().some((f) => f.name === name && f.artist === artist);
}

export function toggleFavorite(item: HistoryItem): boolean {
  const favs = getFavorites();
  const exists = favs.some((f) => f.name === item.name && f.artist === item.artist);
  if (exists) {
    localStorage.setItem(FAV_KEY, JSON.stringify(favs.filter(
      (f) => !(f.name === item.name && f.artist === item.artist)
    )));
    return false;
  } else {
    localStorage.setItem(FAV_KEY, JSON.stringify([item, ...favs]));
    return true;
  }
}
