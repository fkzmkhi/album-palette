"use client";

import { useState } from "react";
import { Palette } from "@/lib/types";

type Props = {
  palette: Palette;
};

function luminance([r, g, b]: [number, number, number]) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

export default function ColorPalette({ palette }: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (hex: string) => {
    await navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="flex flex-col gap-2">
      {palette.map((color, i) => {
        const light = luminance(color.rgb) > 140;
        const textColor = light ? "text-black/70" : "text-white/80";
        return (
          <button
            key={i}
            onClick={() => handleCopy(color.hex)}
            className={`w-full h-12 rounded-lg flex items-center justify-center font-mono text-sm font-medium tracking-wide cursor-pointer transition-opacity active:opacity-70 ${textColor}`}
            style={{ backgroundColor: color.hex }}
          >
            {copied === color.hex ? "Copied!" : color.hex.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
