"use client";

import { useRef, useState } from "react";
import { getPaletteSync } from "colorthief";
import { GenreTopAlbum, Palette } from "@/lib/types";

type Props = {
	album: GenreTopAlbum;
	index: number;
	onClick: (album: GenreTopAlbum) => void;
	onPaletteExtracted: (rank: number, palette: Palette) => void;
};

export default function TopAlbumCard({ album, index, onClick, onPaletteExtracted }: Props) {
	const imgRef = useRef<HTMLImageElement>(null);
	const [loaded, setLoaded] = useState(false);

	const handleLoad = () => {
		setLoaded(true);
		const img = imgRef.current;
		if (!img || album.palette) return;
		try {
			const colors = getPaletteSync(img, { colorCount: 5 });
			if (!colors) return;
			const p: Palette = colors.map((c) => {
				const { r, g, b } = c.rgb();
				return { rgb: [r, g, b], hex: c.hex() };
			});
			onPaletteExtracted(album.rank, p);
		} catch {
			// extraction failed
		}
	};

	const palette = album.palette;

	return (
		<button
			onClick={() => onClick(album)}
			className="group flex flex-col gap-3 text-left focus:outline-none cursor-pointer"
			style={{
				animation: "fadeInUp 0.4s ease both",
				animationDelay: `${index * 55}ms`,
			}}
		>
			<div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-slate-800 transition group-hover:-translate-y-0.5">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					ref={imgRef}
					src={album.imageUrl}
					alt={`${album.name} by ${album.artist}`}
					crossOrigin="anonymous"
					onLoad={handleLoad}
					className={`w-full h-full object-cover transition duration-300 group-hover:scale-105 ${loaded ? "opacity-100" : "opacity-0"}`}
				/>
				{!loaded && (
					<div className="absolute inset-0 bg-slate-800 animate-pulse" />
				)}
			</div>

			{palette ? (
				<div className="flex w-full h-2.5 rounded-full overflow-hidden gap-px">
					{palette.map((color, i) => (
						<div
							key={i}
							className="flex-1 transition hover:scale-y-150 origin-bottom"
							style={{ backgroundColor: color.hex }}
							onClick={(e) => {
								e.stopPropagation();
								navigator.clipboard.writeText(color.hex).catch(() => {});
							}}
							title={color.hex}
						/>
					))}
				</div>
			) : (
				<div className="h-2.5 w-full rounded-full bg-slate-800 animate-pulse" />
			)}

			<div className="min-w-0">
				<p className="truncate text-sm font-medium text-slate-100 leading-snug">{album.name}</p>
				<p className="truncate text-xs text-slate-400 mt-0.5">{album.artist}</p>
			</div>
		</button>
	);
}
