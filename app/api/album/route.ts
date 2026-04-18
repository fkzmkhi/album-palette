import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://ws.audioscrobbler.com/2.0/";

export async function GET(req: NextRequest) {
  const artist = req.nextUrl.searchParams.get("artist");
  const album = req.nextUrl.searchParams.get("album");
  const mbid = req.nextUrl.searchParams.get("mbid");

  if (!artist || !album) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const params = new URLSearchParams({
    method: "album.getinfo",
    api_key: process.env.LASTFM_API_KEY!,
    format: "json",
    ...(mbid ? { mbid } : { artist, album }),
  });

  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) return NextResponse.json({ error: "API error" }, { status: 500 });

  const data = await res.json();
  const a = data.album;
  if (!a) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    url: a.url as string,
    releaseDate: (a.wiki?.published as string | undefined)?.split(",")[0]?.trim() ?? null,
  });
}
