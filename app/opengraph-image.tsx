import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Album Palette";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "#f8fafc",
					gap: 32,
				}}
			>
				{/* Logo mark */}
				<svg viewBox="0 0 36 36" width={120} height={120}>
					<rect width="36" height="36" rx="9" fill="#f1f5f9" />
					<circle cx="18" cy="16" r="8" fill="none" stroke="#cbd5e1" strokeWidth="2.5" />
					<circle cx="18" cy="16" r="3" fill="#fb7185" />
					<rect x="5"  y="26" width="5" height="5" rx="1.5" fill="#fb7185" />
					<rect x="12" y="26" width="5" height="5" rx="1.5" fill="#fb923c" />
					<rect x="19" y="26" width="5" height="5" rx="1.5" fill="#facc15" />
					<rect x="26" y="26" width="5" height="5" rx="1.5" fill="#34d399" />
				</svg>

				{/* App name */}
				<div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
					<span style={{ fontSize: 72, fontWeight: 900, color: "#111827", letterSpacing: "-2px" }}>
						Album
					</span>
					<span style={{ fontSize: 72, fontWeight: 900, color: "#f43f5e", letterSpacing: "-2px" }}>
						Palette
					</span>
				</div>

				{/* Tagline */}
				<span style={{ fontSize: 28, color: "#6b7280", letterSpacing: "-0.5px" }}>
					アルバムジャケットからカラーパレットを抽出
				</span>

				{/* Color swatches bar */}
				<div style={{ display: "flex", gap: 12, marginTop: 8 }}>
					{["#fb7185", "#fb923c", "#facc15", "#34d399", "#818cf8"].map((color) => (
						<div
							key={color}
							style={{
								width: 48,
								height: 48,
								borderRadius: 12,
								backgroundColor: color,
							}}
						/>
					))}
				</div>
			</div>
		),
		{ ...size },
	);
}
