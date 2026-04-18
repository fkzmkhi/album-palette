"use client";

import { useState } from "react";
import { Palette } from "@/lib/types";

type Props = {
  palette: Palette;
};

export default function ColorPalette({ palette }: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (hex: string) => {
    await navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="flex gap-2">
      {palette.map((color) => (
        <button
          key={color.hex}
          onClick={() => handleCopy(color.hex)}
          title={color.hex}
          className="group relative flex-1 rounded-lg overflow-hidden"
          style={{ backgroundColor: color.hex, minHeight: "4rem" }}
        >
          <span className="absolute inset-0 flex items-center justify-center text-xs font-mono opacity-0 group-hover:opacity-100 transition bg-black/40 text-white">
            {copied === color.hex ? "Copied!" : color.hex}
          </span>
        </button>
      ))}
    </div>
  );
}
