"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import AlbumDetail from "@/components/AlbumDetail";
import HistoryList from "@/components/HistoryList";
import FavoriteList from "@/components/FavoriteList";
import GenreSelector from "@/components/GenreSelector";
import TopAlbumGrid from "@/components/TopAlbumGrid";
import {
	Album,
	AlbumMeta,
	HistoryItem,
	Palette,
	GenreTopAlbum,
} from "@/lib/types";
import { Genre } from "@/lib/genres";
import { getHistory, addToHistory, getFavorites } from "@/lib/storage";

export default function Home() {
	const [selected, setSelected] = useState<Album | null>(null);
	const [selectedPalette, setSelectedPalette] = useState<Palette | undefined>(
		undefined,
	);
	const [selectedMeta, setSelectedMeta] = useState<AlbumMeta | null>(null);
	const [history, setHistory] = useState<HistoryItem[]>([]);
	const [favorites, setFavorites] = useState<HistoryItem[]>([]);

	const [genre, setGenre] = useState<Genre>("pop");
	const [topAlbums, setTopAlbums] = useState<GenreTopAlbum[]>([]);
	const [genreLoading, setGenreLoading] = useState(true);

	useEffect(() => {
		setHistory(getHistory());
		setFavorites(getFavorites());
	}, []);

	const fetchGenreTop = useCallback(async (g: Genre) => {
		setGenreLoading(true);
		setTopAlbums([]);
		try {
			const res = await fetch(
				`/api/genre-top?tag=${encodeURIComponent(g)}&limit=100`,
			);
			const data = await res.json();
			setTopAlbums(data.items ?? []);
		} finally {
			setGenreLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchGenreTop(genre);
	}, [genre, fetchGenreTop]);

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
		setHistory(getHistory());
	};

	const handleTopAlbumSelect = (album: GenreTopAlbum) => {
		const { rank: _rank, palette, ...albumBase } = album;
		selectAlbum(albumBase, palette);
	};

	const handleTopAlbumPalette = (rank: number, palette: Palette) => {
		setTopAlbums((prev) =>
			prev.map((a) => (a.rank === rank ? { ...a, palette } : a)),
		);
	};

	const handleClose = () => {
		setSelected(null);
		setSelectedPalette(undefined);
		setSelectedMeta(null);
	};

	return (
		<main className="min-h-screen bg-gray-50 text-gray-900 px-4 py-4">
			<div className="mx-auto max-w-7xl flex flex-col gap-10">
				<div className="flex items-center justify-between">
					<h1 className="flex items-center gap-2.5">
						<svg viewBox="0 0 36 36" className="w-8 h-8 shrink-0" aria-hidden>
							<rect width="36" height="36" rx="9" fill="#f1f5f9" />
							<circle cx="18" cy="16" r="8" fill="none" stroke="#cbd5e1" strokeWidth="2.5" />
							<circle cx="18" cy="16" r="3" fill="#fb7185" />
							<rect x="5"  y="26" width="5" height="5" rx="1.5" fill="#fb7185" />
							<rect x="12" y="26" width="5" height="5" rx="1.5" fill="#fb923c" />
							<rect x="19" y="26" width="5" height="5" rx="1.5" fill="#facc15" />
							<rect x="26" y="26" width="5" height="5" rx="1.5" fill="#34d399" />
						</svg>
						<span className="text-2xl font-black tracking-tight text-gray-900">
							Album<span className="text-rose-500">Palette</span>
						</span>
					</h1>
					<Link
						href="/search"
						className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition cursor-pointer"
						aria-label="Search"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth={2}
							strokeLinecap="round"
							strokeLinejoin="round"
							className="w-5 h-5"
						>
							<circle cx="11" cy="11" r="8" />
							<path d="m21 21-4.35-4.35" />
						</svg>
					</Link>
				</div>

				<div className="flex flex-col gap-6">
					<div className="flex flex-col gap-4">
						<div>
							<h2 className="text-2xl font-bold tracking-tight text-gray-900">
								Top Albums by Genre
							</h2>
							<p className="text-gray-500 text-sm mt-1">
								各ジャンルで人気のアルバムからカラーパレットを抽出
							</p>
						</div>
						<GenreSelector selected={genre} onChange={setGenre} />
					</div>
					<TopAlbumGrid
						albums={topAlbums}
						loading={genreLoading}
						genre={genre}
						onSelect={handleTopAlbumSelect}
						onPaletteExtracted={handleTopAlbumPalette}
					/>
				</div>

				<HistoryList
					history={history}
					onSelect={(album) => selectAlbum(album)}
				/>

				<FavoriteList
					favorites={favorites}
					onSelect={(album) => selectAlbum(album)}
				/>
			</div>

			{selected && (
				<AlbumDetail
					album={selected}
					initialPalette={selectedPalette}
					initialMeta={selectedMeta}
					onPaletteReady={handlePaletteReady}
					onFavoriteChange={() => setFavorites(getFavorites())}
					onClose={handleClose}
				/>
			)}
		</main>
	);
}
