"use client";

import { Button } from "antd";
import { GENRES, Genre } from "@/lib/genres";

type Props = {
	selected: Genre;
	onChange: (genre: Genre) => void;
};

export default function GenreSelector({ selected, onChange }: Props) {
	return (
		<div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
			{GENRES.map((genre) => (
				<Button
					key={genre}
					type={genre === selected ? "primary" : "default"}
					size="small"
					onClick={() => onChange(genre)}
					className="shrink-0 uppercase font-bold tracking-wide rounded-full"
				>
					{genre}
				</Button>
			))}
		</div>
	);
}
