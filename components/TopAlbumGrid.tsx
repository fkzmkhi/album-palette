"use client";

import { useEffect, useState } from "react";
import { Pagination, Skeleton } from "antd";
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
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
				{Array.from({ length: PAGE_SIZE }).map((_, i) => (
					<div key={i} className="flex flex-col gap-3">
						<div className="aspect-square w-full rounded-2xl bg-gray-200 animate-pulse" />
						<div className="h-2.5 w-full rounded-full bg-gray-200 animate-pulse" />
						<Skeleton active title={{ width: "75%" }} paragraph={{ rows: 1, width: "50%" }} />
					</div>
				))}
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
				<div className="flex justify-center">
					<Pagination
						current={page + 1}
						total={albums.length}
						pageSize={PAGE_SIZE}
						onChange={(p) => goToPage(p - 1)}
						showSizeChanger={false}
					/>
				</div>
			)}
		</div>
	);
}
