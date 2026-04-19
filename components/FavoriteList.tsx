"use client";

import Image from "next/image";
import { HistoryItem, Album } from "@/lib/types";

type Props = {
	favorites: HistoryItem[];
	onSelect: (album: Album) => void;
};

export default function FavoriteList({ favorites, onSelect }: Props) {
	if (favorites.length === 0) return null;

	return (
		<div>
			<p className="text-lg font-bold text-gray-900 mb-4">Favorites</p>
			<div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
				{favorites.map((item, i) => (
					<button
						key={i}
						onClick={() => onSelect(item)}
						className="flex-shrink-0 flex flex-col gap-2 text-left group cursor-pointer"
					>
						<div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 group-hover:-translate-y-0.5 transition">
							{item.imageUrl && (
								<Image
									src={item.imageUrl}
									alt={item.name}
									fill
									className="object-cover group-hover:scale-105 transition"
									unoptimized
								/>
							)}
						</div>
						<div className="flex gap-0.5">
							{item.palette.slice(0, 5).map((c, i) => (
								<div
									key={i}
									className="flex-1 h-1.5 rounded-full"
									style={{ backgroundColor: c.hex }}
								/>
							))}
						</div>
					</button>
				))}
			</div>
		</div>
	);
}
