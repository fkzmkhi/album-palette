import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
	variable: "--font-jakarta",
	subsets: ["latin"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "Album Palette",
	description: "アルバムジャケットから5色のカラーパレットを抽出・コピーできるWebアプリ。Last.fm APIを使ったアルバム検索に対応。",
	metadataBase: new URL("https://album-palette.vercel.app"),
	openGraph: {
		title: "Album Palette",
		description: "アルバムジャケットから5色のカラーパレットを抽出・コピーできるWebアプリ。",
		url: "https://album-palette.vercel.app",
		siteName: "Album Palette",
		locale: "ja_JP",
		type: "website",
	},
	twitter: {
		card: "summary",
		title: "Album Palette",
		description: "アルバムジャケットから5色のカラーパレットを抽出・コピーできるWebアプリ。",
	},
	icons: {
		icon: "/icon.svg",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja" className={`${jakarta.variable} h-full antialiased`}>
			<body className="min-h-full flex flex-col font-sans">
				{children}
				<footer className=" py-12 text-center text-xs text-gray-400 bg-gray-50">
					© {new Date().getFullYear()} Album Palette. Powered by{" "}
					<a
						href="https://www.last.fm/"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-slate-300 transition underline underline-offset-2 text-slate-400"
					>
						Last.fm
					</a>
				</footer>
			</body>
		</html>
	);
}
