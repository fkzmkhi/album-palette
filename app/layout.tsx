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
	description: "Extract color palettes from album artwork",
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
				<footer className="mt-12 py-6 text-center text-xs text-zinc-400">
					© {new Date().getFullYear()} Album Palette. Powered by{" "}
					<a
						href="https://www.last.fm/"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-zinc-600 transition underline underline-offset-2"
					>
						Last.fm
					</a>
				</footer>
			</body>
		</html>
	);
}
