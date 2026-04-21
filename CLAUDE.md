@AGENTS.md

# album-palette

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Last.fm API · colorthief · localStorage

## Routes
- `/` — single-page app (search + results + detail)
- `/api/search` — Last.fm search proxy
- `/api/album` — Last.fm album.getinfo proxy

## Directory
```
app/
  page.tsx, layout.tsx
  api/search/route.ts, api/album/route.ts
components/
  SearchBar, AlbumGrid, AlbumCard, AlbumDetail, ColorPalette, HistoryList
lib/
  lastfm.ts, storage.ts, types.ts
```

## Types
```ts
type Album = { name: string; artist: string; mbid?: string; imageUrl: string };
type Palette = { hex: string; rgb: [number, number, number] }[]; // length 5
type HistoryItem = Album & { palette: Palette; visitedAt: string }; // ISO datetime
```

## Git
- Commits are fine to create
- All remote operations (push, PR, etc.) are handled by the user — do not run them

## Status
Done: search, card grid, album detail, colorthief palette (5 colors), clipboard copy (HEX), history, favorites
Pending: palette image DL, CSS var export, history page, Spotify integration, Vercel deploy
