"use client";

import { App, Tooltip } from "antd";
import { Palette } from "@/lib/types";

type Props = {
	palette: Palette;
};

function luminance([r, g, b]: [number, number, number]) {
	return 0.299 * r + 0.587 * g + 0.114 * b;
}

export default function ColorPalette({ palette }: Props) {
	const { message } = App.useApp();

	const handleCopy = async (hex: string) => {
		await navigator.clipboard.writeText(hex);
		message.success(`Copied ${hex.toUpperCase()}`, 1.5);
	};

	return (
		<div className="flex flex-col gap-2">
			{palette.map((color, i) => {
				const light = luminance(color.rgb) > 140;
				const textColor = light ? "text-black/70" : "text-white/80";
				return (
					<Tooltip key={i} title="Click to copy">
						<button
							onClick={() => handleCopy(color.hex)}
							className={`w-full h-12 rounded-lg flex items-center justify-center font-mono text-sm font-medium tracking-wide cursor-pointer transition-opacity active:opacity-70 ${textColor}`}
							style={{ backgroundColor: color.hex }}
						>
							{color.hex.toUpperCase()}
						</button>
					</Tooltip>
				);
			})}
		</div>
	);
}
