"use client";

import { useEffect, useState } from "react";
import { GenreTopAlbum, Palette } from "@/lib/types";
import TopAlbumCard from "./TopAlbumCard";

const PAGE_SIZE = 20;

type Props = {
	albums: GenreTopAlbum[];
	loading: boolean;
	genre: string;
	onSelect: (album: GenreTopAlbum) => void;
	onPaletteExtracted: (rank: number, palette: Palette) => void;
};

export default function TopAlbumGrid({
	albums,
	loading,
	genre,
	onSelect,
	onPaletteExtracted,
}: Props) {
	const [page, setPage] = useState(0);

	useEffect(() => {
		setPage(0);
	}, [genre]);

	if (loading) {
		return (
			<div className="flex flex-col gap-5">
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
					{Array.from({ length: PAGE_SIZE }).map((_, i) => (
						<div key={i} className="flex flex-col gap-3">
							<div className="aspect-square w-full rounded-2xl bg-gray-200 animate-pulse" />
							<div className="h-2.5 w-full rounded-full bg-gray-200 animate-pulse" />
							<div className="flex flex-col gap-1.5">
								<div className="h-3.5 w-3/4 rounded-lg bg-gray-200 animate-pulse" />
								<div className="h-3 w-1/2 rounded-lg bg-gray-200 animate-pulse" />
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	const totalPages = Math.ceil(albums.length / PAGE_SIZE);
	const visible = albums.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
	const placeholders = Array.from({ length: PAGE_SIZE - visible.length });

	const goToPage = (n: number) => {
		setPage(n);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<div className="flex flex-col gap-8">
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
				{visible.map((album, i) => (
					<TopAlbumCard
						key={album.rank}
						album={album}
						index={i}
						onClick={onSelect}
						onPaletteExtracted={onPaletteExtracted}
					/>
				))}
				{placeholders.map((_, i) => (
					<div key={`ph-${i}`} className="aspect-square w-full" aria-hidden />
				))}
			</div>

			{totalPages > 1 && (
				<div className="flex items-center justify-center gap-1">
					<button
						onClick={() => goToPage(page - 1)}
						disabled={page === 0}
						className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth={2.5}
							strokeLinecap="round"
							strokeLinejoin="round"
							className="w-4 h-4"
						>
							<path d="m15 18-6-6 6-6" />
						</svg>
					</button>

					{Array.from({ length: totalPages }).map((_, i) => (
						<button
							key={i}
							onClick={() => goToPage(i)}
							className={`w-9 h-9 rounded-lg text-sm font-medium transition cursor-pointer ${
								i === page
									? "bg-rose-500 text-white border border-rose-500"
									: "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
							}`}
						>
							{i + 1}
						</button>
					))}

					<button
						onClick={() => goToPage(page + 1)}
						disabled={page === totalPages - 1}
						className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth={2.5}
							strokeLinecap="round"
							strokeLinejoin="round"
							className="w-4 h-4"
						>
							<path d="m9 18 6-6-6-6" />
						</svg>
					</button>
				</div>
			)}
		</div>
	);
}
