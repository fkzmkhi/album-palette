import { NextRequest, NextResponse } from "next/server";
import { searchAlbums } from "@/lib/lastfm";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");
  if (!query || query.trim().length === 0) {
    return NextResponse.json({ albums: [] });
  }

  try {
    const albums = await searchAlbums(query);
    return NextResponse.json({ albums });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
