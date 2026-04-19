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
							? "bg-rose-500 text-white shadow-md"
							: "bg-slate-800 text-slate-300 hover:bg-slate-800 hover:text-slate-100 border border-slate-700"
					}`}
				>
					{genre}
				</button>
			))}
		</div>
	);
}
