import { Album } from "./types";

const BASE_URL = "https://ws.audioscrobbler.com/2.0/";

export async function searchAlbums(query: string): Promise<Album[]> {
  const params = new URLSearchParams({
    method: "album.search",
    album: query,
    api_key: process.env.LASTFM_API_KEY!,
    format: "json",
    limit: "20",
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
