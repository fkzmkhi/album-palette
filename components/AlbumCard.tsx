"use client";

import Image from "next/image";
import { Album } from "@/lib/types";

type Props = {
  album: Album;
  onClick: (album: Album) => void;
};

export default function AlbumCard({ album, onClick }: Props) {
  return (
    <button
      onClick={() => onClick(album)}
      className="group flex flex-col gap-2 text-left focus:outline-none cursor-pointer"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-200 shadow-sm">
        {album.imageUrl ? (
          <Image
            src={album.imageUrl}
            alt={`${album.name} by ${album.artist}`}
            fill
            className="object-cover transition group-hover:scale-105"
            crossOrigin="anonymous"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-400 text-4xl">
            ♪
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-zinc-800">{album.name}</p>
        <p className="truncate text-xs text-zinc-400">{album.artist}</p>
      </div>
    </button>
  );
}
