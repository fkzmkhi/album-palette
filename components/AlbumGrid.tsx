"use client";

import { Album } from "@/lib/types";
import AlbumCard from "./AlbumCard";

type Props = {
  albums: Album[];
  onSelect: (album: Album) => void;
};

export default function AlbumGrid({ albums, onSelect }: Props) {
  if (albums.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {albums.map((album, i) => (
        <AlbumCard key={`${album.artist}-${album.name}-${i}`} album={album} onClick={onSelect} />
      ))}
    </div>
  );
}
