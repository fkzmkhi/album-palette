"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Modal, Typography, Tooltip } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
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

export default function AlbumDetail({
	album,
	initialPalette,
	initialMeta,
	onPaletteReady,
	onFavoriteChange,
	onClose,
}: Props) {
	const imgRef = useRef<HTMLImageElement>(null);
	const [palette, setPalette] = useState<Palette | null>(
		initialPalette ?? null,
	);
	const [loaded, setLoaded] = useState(false);
	const [meta, setMeta] = useState<AlbumMeta | null>(initialMeta ?? null);
	const [favorited, setFavorited] = useState(false);

	useEffect(() => {
		setPalette(initialPalette ?? null);
		setLoaded(false);
		setMeta(initialMeta ?? null);
		setFavorited(isFavorited(album.name, album.artist));
	}, [album, initialPalette, initialMeta]);

	const extractPalette = useCallback(() => {
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
	}, [initialPalette, onPaletteReady]);

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
		<Modal
			open
			onCancel={onClose}
			footer={null}
			width={448}
			centered
			styles={{ body: { padding: 0, paddingTop: 28 } }}
		>
			<div className="flex flex-col gap-5 pt-2">
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
						<Typography.Title level={5} className="!mb-0 !leading-tight">
							{album.name}
						</Typography.Title>
						<Tooltip
							title={favorited ? "Remove from favorites" : "Add to favorites"}
						>
							<button
								onClick={handleFavorite}
								disabled={!palette}
								className={`shrink-0 mt-0.5 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
									favorited
										? "text-rose-400"
										: "text-gray-300 hover:text-rose-400"
								}`}
							>
								{favorited ? (
									<HeartFilled className="text-lg" />
								) : (
									<HeartOutlined className="text-lg" />
								)}
							</button>
						</Tooltip>
					</div>
					<Typography.Text type="secondary">{album.artist}</Typography.Text>
					<div className="flex items-center gap-3 mt-1 text-xs text-gray-400 justify-between">
						{meta?.releaseDate && <span>{meta.releaseDate}</span>}
						{meta?.url && (
							<Typography.Link
								href={meta.url}
								target="_blank"
								rel="noopener noreferrer"
							>
								Last.fm →
							</Typography.Link>
						)}
					</div>
				</div>

				{palette ? (
					<ColorPalette palette={palette} />
				) : (
					<div className="h-16 rounded-lg bg-gray-100 animate-pulse" />
				)}
			</div>
		</Modal>
	);
}
