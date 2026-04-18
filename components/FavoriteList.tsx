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
			<p className="text-xs text-zinc-400 mb-3 uppercase tracking-widest font-medium">Favorites</p>
			<div className="flex gap-3 overflow-x-auto pb-2">
				{favorites.map((item, i) => (
					<button
						key={i}
						onClick={() => onSelect(item)}
						className="flex-shrink-0 flex flex-col gap-1 text-left group cursor-pointer"
					>
						<div className="relative w-14 h-14 rounded-lg overflow-hidden bg-zinc-200 shadow-sm">
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
							{item.palette.slice(0, 5).map((c) => (
								<div
									key={c.hex}
									className="flex-1 h-1 rounded-full"
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
