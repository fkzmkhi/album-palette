export type Album = {
  name: string;
  artist: string;
  mbid?: string;
  imageUrl: string;
};

export type PaletteColor = {
  hex: string;
  rgb: [number, number, number];
};

export type Palette = PaletteColor[];

export type HistoryItem = Album & {
  palette: Palette;
  visitedAt: string;
};
