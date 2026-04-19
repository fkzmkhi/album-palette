"use client";

import { useEffect, useState } from "react";
import { Album } from "@/lib/types";
import AlbumCard from "./AlbumCard";

const PAGE_SIZE = 20;

type Props = {
	albums: Album[];
	query: string;
	onSelect: (album: Album) => void;
};

export default function AlbumGrid({ albums, query, onSelect }: Props) {
	const [page, setPage] = useState(0);

	useEffect(() => {
		setPage(0);
	}, [query]);

	if (albums.length === 0) return null;

	const totalPages = Math.ceil(albums.length / PAGE_SIZE);
	const visible = albums.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
	const placeholders = Array.from({ length: PAGE_SIZE - visible.length });

	const goToPage = (n: number) => {
		setPage(n);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<div className="flex flex-col gap-8">
			<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
				{visible.map((album, i) => (
					<AlbumCard
						key={`${album.artist}-${album.name}-${i}`}
						album={album}
						onClick={onSelect}
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
