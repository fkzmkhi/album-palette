"use client";

import { GENRES, Genre } from "@/lib/genres";

type Props = {
	selected: Genre;
	onChange: (genre: Genre) => void;
};

export default function GenreSelector({ selected, onChange }: Props) {
	return (
		<div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
			{GENRES.map((genre) => (
				<button
					key={genre}
					onClick={() => onChange(genre)}
					className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition cursor-pointer ${
						genre === selected
							? "bg-rose-500 text-white shadow-sm"
							: "bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 border border-gray-200"
					}`}
				>
					{genre}
				</button>
			))}
		</div>
	);
}
