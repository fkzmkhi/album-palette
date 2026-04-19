import { NextRequest, NextResponse } from "next/server";
import { getTopAlbumsByTag } from "@/lib/lastfm";

export const revalidate = 3600;

export async function GET(req: NextRequest) {
	const tag = req.nextUrl.searchParams.get("tag") ?? "pop";
	const limit = Number(req.nextUrl.searchParams.get("limit") ?? "10");

	try {
		const items = await getTopAlbumsByTag(tag, limit);
		return NextResponse.json({
			genre: tag,
			fetchedAt: new Date().toISOString(),
			items,
		});
	} catch {
		return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
	}
}
