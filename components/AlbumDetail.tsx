"use client";

import { useEffect, useRef, useState } from "react";
import { getPaletteSync } from "colorthief";
import { Album, HistoryItem, Palette } from "@/lib/types";
import { isFavorited, toggleFavorite } from "@/lib/storage";
import ColorPalette from "./ColorPalette";

type AlbumMeta = {
	url: string;
	releaseDate: string | null;
};

type Props = {
	album: Album;
	onPaletteReady: (palette: Palette) => void;
	onFavoriteChange: () => void;
	onClose: () => void;
};

export default function AlbumDetail({ album, onPaletteReady, onFavoriteChange, onClose }: Props) {
	const imgRef = useRef<HTMLImageElement>(null);
	const [palette, setPalette] = useState<Palette | null>(null);
	const [loaded, setLoaded] = useState(false);
	const [meta, setMeta] = useState<AlbumMeta | null>(null);
	const [favorited, setFavorited] = useState(false);

	useEffect(() => {
		setPalette(null);
		setLoaded(false);
		setMeta(null);
		setFavorited(isFavorited(album.name, album.artist));

		const params = new URLSearchParams({
			artist: album.artist,
			album: album.name,
			...(album.mbid ? { mbid: album.mbid } : {}),
		});
		fetch(`/api/album?${params}`)
			.then((r) => r.json())
			.then((d) => setMeta(d.url ? d : null))
			.catch(() => {});
	}, [album]);

	const extractPalette = () => {
		const img = imgRef.current;
		if (!img) return;
		try {
			const colors = getPaletteSync(img, { colorCount: 5 });
			if (!colors) return;
			const p: Palette = colors.map((c) => {
				const { r, g, b } = c.rgb();
				return { rgb: [r, g, b], hex: c.hex() };
			});
			setPalette(p);
			onPaletteReady(p);
		} catch {
			// extraction failed
		}
	};

	const handleFavorite = () => {
		if (!palette) return;
		const item: HistoryItem = {
			...album,
			palette,
			visitedAt: new Date().toISOString(),
		};
		const next = toggleFavorite(item);
		setFavorited(next);
		onFavoriteChange();
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
			onClick={onClose}
		>
			<div
				className="relative w-full max-w-md rounded-2xl bg-zinc-900 p-6 pt-12 flex flex-col gap-5"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="absolute right-4 top-2 flex items-center gap-2">
					<button
						onClick={handleFavorite}
						disabled={!palette}
						className={`text-xl transition cursor-pointer ${
							favorited ? "text-red-400" : "text-white/30 hover:text-white/70"
						} disabled:opacity-30 disabled:cursor-not-allowed`}
						title={favorited ? "Remove from favorites" : "Add to favorites"}
					>
						{favorited ? "♥" : "♡"}
					</button>
					<button
						onClick={onClose}
						className="text-white/40 hover:text-white transition text-xl cursor-pointer"
					>
						✕
					</button>
				</div>

				<div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white/5">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						ref={imgRef}
						src={album.imageUrl}
						alt={album.name}
						crossOrigin="anonymous"
						onLoad={() => {
							setLoaded(true);
							extractPalette();
						}}
						className="w-full h-full object-cover"
					/>
					{!loaded && (
						<div className="absolute inset-0 flex items-center justify-center text-white/20 animate-pulse">
							Loading...
						</div>
					)}
				</div>

				<div className="flex flex-col gap-1">
					<p className="font-semibold text-white text-lg leading-tight">
						{album.name}
					</p>
					<p className="text-white/50 text-sm">{album.artist}</p>
					<div className="flex items-center gap-3 mt-1 text-xs text-white/30 justify-between">
						{meta?.releaseDate && <span>{meta.releaseDate}</span>}
						{meta?.url && (
							<a
								href={meta.url}
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-white/70 transition underline underline-offset-2 cursor-pointer"
							>
								Last.fm →
							</a>
						)}
					</div>
				</div>

				{palette ? (
					<ColorPalette palette={palette} />
				) : (
					<div className="h-16 rounded-lg bg-white/5 animate-pulse" />
				)}
			</div>
		</div>
	);
}
