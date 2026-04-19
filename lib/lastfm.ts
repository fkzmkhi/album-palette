import { Album, GenreTopAlbum } from "./types";

const BASE_URL = "https://ws.audioscrobbler.com/2.0/";

export async function searchAlbums(query: string): Promise<Album[]> {
	const params = new URLSearchParams({
		method: "album.search",
		album: query,
		api_key: process.env.LASTFM_API_KEY!,
		format: "json",
		limit: "100",
	});

	const res = await fetch(`${BASE_URL}?${params}`);
	if (!res.ok) throw new Error("Last.fm API error");

	const data = await res.json();
	const results = data.results?.albummatches?.album ?? [];

	return results
		.filter((a: Record<string, unknown>) => {
			const images = a.image as { "#text": string }[];
			return images?.some((img) => img["#text"]);
		})
		.map((a: Record<string, unknown>) => {
			const images = a.image as { "#text": string; size: string }[];
			const imageUrl =
				images.find((img) => img.size === "extralarge")?.["#text"] ||
				images.find((img) => img["#text"])?.["#text"] ||
				"";
			return {
				name: a.name as string,
				artist: a.artist as string,
				mbid: a.mbid as string | undefined,
				imageUrl,
			};
		});
}

export async function getTopAlbumsByTag(tag: string, limit = 10): Promise<GenreTopAlbum[]> {
	const params = new URLSearchParams({
		method: "tag.getTopAlbums",
		tag,
		api_key: process.env.LASTFM_API_KEY!,
		format: "json",
		limit: String(limit),
	});

	const res = await fetch(`${BASE_URL}?${params}`);
	if (!res.ok) throw new Error("Last.fm API error");

	const data = await res.json();
	const albums = data.albums?.album ?? [];

	return albums
		.filter((a: Record<string, unknown>) => {
			const images = a.image as { "#text": string }[];
			return images?.some((img) => img["#text"]);
		})
		.map((a: Record<string, unknown>, i: number) => {
			const images = a.image as { "#text": string; size: string }[];
			const imageUrl =
				images.find((img) => img.size === "extralarge")?.["#text"] ||
				images.find((img) => img["#text"])?.["#text"] ||
				"";
			const artist = a.artist as { name: string } | string;
			return {
				rank: i + 1,
				name: a.name as string,
				artist: typeof artist === "string" ? artist : artist.name,
				mbid: a.mbid as string | undefined,
				imageUrl,
			};
		});
}
