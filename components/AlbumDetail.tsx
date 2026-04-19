"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getPaletteSync } from "colorthief";
import { Album, AlbumMeta, HistoryItem, Palette } from "@/lib/types";
import { isFavorited, toggleFavorite } from "@/lib/storage";
import ColorPalette from "./ColorPalette";

type Props = {
	album: Album;
	initialPalette?: Palette;
	initialMeta?: AlbumMeta | null;
	onPaletteReady: (palette: Palette) => void;
	onFavoriteChange: () => void;
	onClose: () => void;
};

export default function AlbumDetail({ album, initialPalette, initialMeta, onPaletteReady, onFavoriteChange, onClose }: Props) {
	const imgRef = useRef<HTMLImageElement>(null);
	const [palette, setPalette] = useState<Palette | null>(initialPalette ?? null);
	const [loaded, setLoaded] = useState(false);
	const [meta, setMeta] = useState<AlbumMeta | null>(initialMeta ?? null);
	const [favorited, setFavorited] = useState(false);
	const [visible, setVisible] = useState(false);

	// Entrance animation + scroll lock
	useEffect(() => {
		const raf = requestAnimationFrame(() =>
			requestAnimationFrame(() => setVisible(true))
		);
		document.body.style.overflow = "hidden";
		return () => {
			cancelAnimationFrame(raf);
			document.body.style.overflow = "";
		};
	}, []);

	useEffect(() => {
		setPalette(initialPalette ?? null);
		setLoaded(false);
		setMeta(initialMeta ?? null);
		setFavorited(isFavorited(album.name, album.artist));
	}, [album, initialPalette, initialMeta]);

	const handleClose = useCallback(() => {
		setVisible(false);
		setTimeout(onClose, 250);
	}, [onClose]);

	// ESC key
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [handleClose]);

	const extractPalette = () => {
		if (initialPalette) {
			onPaletteReady(initialPalette);
			return;
		}
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
			className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-250 ${
				visible ? "opacity-100" : "opacity-0"
			}`}
			onClick={handleClose}
		>
			{/* Backdrop */}
			<div className="absolute inset-0 bg-black/40" />

			{/* Modal card */}
			<div
				className={`relative w-full max-w-md rounded-2xl bg-white p-6 pt-12 flex flex-col gap-5 shadow-xl transition-all duration-250 max-h-[90dvh] overflow-y-auto ${
					visible
						? "opacity-100 scale-100 translate-y-0"
						: "opacity-0 scale-95 translate-y-3"
				}`}
				onClick={(e) => e.stopPropagation()}
			>
				<button
					onClick={handleClose}
					className="absolute right-4 top-3 text-gray-300 hover:text-gray-600 transition text-xl cursor-pointer"
				>
					✕
				</button>

				<div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100 shrink-0">
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
						<div className="absolute inset-0 flex items-center justify-center text-gray-300 animate-pulse">
							Loading...
						</div>
					)}
				</div>

				<div className="flex flex-col gap-1">
					<div className="flex items-start justify-between gap-2">
						<p className="font-semibold text-gray-900 text-lg leading-tight">
							{album.name}
						</p>
						<button
							onClick={handleFavorite}
							disabled={!palette}
							className={`shrink-0 mt-0.5 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
								favorited ? "text-red-400" : "text-gray-300 hover:text-red-400"
							}`}
							title={favorited ? "Remove from favorites" : "Add to favorites"}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill={favorited ? "currentColor" : "none"}
								stroke="currentColor"
								strokeWidth={2}
								strokeLinecap="round"
								strokeLinejoin="round"
								className="w-5 h-5"
							>
								<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
							</svg>
						</button>
					</div>
					<p className="text-gray-500 text-sm">{album.artist}</p>
					<div className="flex items-center gap-3 mt-1 text-xs text-gray-400 justify-between">
						{meta?.releaseDate && <span>{meta.releaseDate}</span>}
						{meta?.url && (
							<a
								href={meta.url}
								target="_blank"
								rel="noopener noreferrer"
								className="text-rose-500 hover:text-rose-400 transition underline underline-offset-2 cursor-pointer"
							>
								Last.fm →
							</a>
						)}
					</div>
				</div>

				{palette ? (
					<ColorPalette palette={palette} />
				) : (
					<div className="h-16 rounded-lg bg-gray-100 animate-pulse" />
				)}
			</div>
		</div>
	);
}
