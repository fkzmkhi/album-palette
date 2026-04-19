export const GENRES = [
	"pop",
	"rock",
	"j-pop",
	"hip-hop",
	"electronic",
	"jazz",
	"indie",
	"metal",
	"classical",
	"r&b",
	"ambient",
] as const;

export type Genre = (typeof GENRES)[number];
