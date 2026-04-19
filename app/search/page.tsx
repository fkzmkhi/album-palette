"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import AlbumGrid from "@/components/AlbumGrid";
import AlbumDetail from "@/components/AlbumDetail";
import { Album, AlbumMeta, HistoryItem, Palette } from "@/lib/types";
import { getHistory, addToHistory, getFavorites } from "@/lib/storage";

export default function SearchPage() {
	const [query, setQuery] = useState("");
	const [albums, setAlbums] = useState<Album[]>([]);
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState<Album | null>(null);
	const [selectedPalette, setSelectedPalette] = useState<Palette | undefined>(undefined);
	const [selectedMeta, setSelectedMeta] = useState<AlbumMeta | null>(null);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const search = useCallback(async (q: string) => {
		if (!q.trim()) {
			setAlbums([]);
			return;
		}
		setLoading(true);
		try {
			const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
			const data = await res.json();
			setAlbums(data.albums ?? []);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => search(query), 300);
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, [query, search]);

	const selectAlbum = useCallback(async (album: Album, palette?: Palette) => {
		setSelectedPalette(palette);
		const params = new URLSearchParams({
			artist: album.artist,
			album: album.name,
			...(album.mbid ? { mbid: album.mbid } : {}),
		});
		const meta = await fetch(`/api/album?${params}`)
			.then((r) => r.json())
			.then((d) => (d.url ? (d as AlbumMeta) : null))
			.catch(() => null);
		setSelectedMeta(meta);
		setSelected(album);
	}, []);

	const handlePaletteReady = (palette: Palette) => {
		if (!selected) return;
		const item: HistoryItem = {
			...selected,
			palette,
			visitedAt: new Date().toISOString(),
		};
		addToHistory(item);
	};

	const handleClose = () => {
		setSelected(null);
		setSelectedPalette(undefined);
		setSelectedMeta(null);
	};

	return (
		<main className="min-h-screen bg-[#0f172a] text-slate-100 px-4 py-4">
			<div className="mx-auto max-w-7xl flex flex-col gap-8">
				<div className="flex items-center gap-3">
					<Link
						href="/"
						className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition cursor-pointer"
						aria-label="Back"
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
							<path d="m15 18-6-6 6-6" />
						</svg>
					</Link>
					<div className="flex-1">
						<SearchBar value={query} onChange={setQuery} />
					</div>
				</div>

				{loading && (
					<p className="text-slate-400 text-sm animate-pulse">Searching...</p>
				)}
				{!loading && query && albums.length === 0 && (
					<p className="text-slate-400 text-sm">No results found.</p>
				)}

				<AlbumGrid albums={albums} query={query} onSelect={selectAlbum} />
			</div>

			{selected && (
				<AlbumDetail
					album={selected}
					initialPalette={selectedPalette}
					initialMeta={selectedMeta}
					onPaletteReady={handlePaletteReady}
					onFavoriteChange={() => getFavorites()}
					onClose={handleClose}
				/>
			)}
		</main>
	);
}
