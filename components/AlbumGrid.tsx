"use client";

import { useEffect, useState } from "react";
import { Pagination } from "antd";
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
