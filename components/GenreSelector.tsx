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
					className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition cursor-pointer ${
						genre === selected
							? "bg-indigo-600 text-white shadow-md"
							: "bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 border border-zinc-300"
					}`}
				>
					{genre}
				</button>
			))}
		</div>
	);
}
