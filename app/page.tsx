"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import SearchBar from "@/components/SearchBar";
import AlbumGrid from "@/components/AlbumGrid";
import AlbumDetail from "@/components/AlbumDetail";
import HistoryList from "@/components/HistoryList";
import { Album, HistoryItem, Palette } from "@/lib/types";
import { getHistory, addToHistory } from "@/lib/storage";

export default function Home() {
	const [query, setQuery] = useState("");
	const [albums, setAlbums] = useState<Album[]>([]);
	const [selected, setSelected] = useState<Album | null>(null);
	const [history, setHistory] = useState<HistoryItem[]>([]);
	const [loading, setLoading] = useState(false);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		setHistory(getHistory());
	}, []);

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

	const handlePaletteReady = (palette: Palette) => {
		if (!selected) return;
		const item: HistoryItem = {
			...selected,
			palette,
			visitedAt: new Date().toISOString(),
		};
		addToHistory(item);
		setHistory(getHistory());
	};

	return (
		<main className="min-h-screen bg-zinc-950 text-white px-4 py-10">
			<div className="mx-auto max-w-3xl flex flex-col gap-8">
				<div className="flex flex-col gap-1">
					<h1 className="text-2xl font-bold tracking-tight text-center">
						Album Palette
					</h1>
					<p className="text-white/40 text-sm text-center">
						アルバムジャケットからカラーパレットを抽出
					</p>
				</div>

				<SearchBar value={query} onChange={setQuery} />

				{loading && (
					<p className="text-white/30 text-sm animate-pulse">Searching...</p>
				)}

				{!loading && query && albums.length === 0 && (
					<p className="text-white/30 text-sm">No results found.</p>
				)}

				<AlbumGrid albums={albums} onSelect={setSelected} />

				<HistoryList history={history} onSelect={setSelected} />
			</div>

			{selected && (
				<AlbumDetail
					album={selected}
					onPaletteReady={handlePaletteReady}
					onClose={() => setSelected(null)}
				/>
			)}
		</main>
	);
}
