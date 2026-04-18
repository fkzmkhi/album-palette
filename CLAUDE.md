@AGENTS.md

---
project: album-palette
status: in-progress
created: 2026-04-18
tags:
  - project
  - webdev
  - music
---

# 🎨 Album Palette - コンセプトと要件定義

## 1. コンセプト

アーティスト名 / アルバム名で検索し、表示されたアルバムジャケットから **主要5色のカラーパレットを抽出して可視化** するWebアプリ。

### なぜ作る

- 音楽制作時の **ジャケット連想配色** のインスピレーション源
- Last.fm API + 画像処理 + Next.js の組み合わせを試す題材
- 半日でデプロイまで持っていけるスコープ

### 想定ユーザー

- 自分（音楽制作 / Web 開発両方の関心）
- 同じくジャケアートに興味があるデザイナー / 音楽ファン

## 2. ユーザーフロー

```
[トップ画面]
   ↓ アーティスト名/アルバム名を入力
[検索結果一覧] - ジャケサムネ + アーティスト + アルバム名
   ↓ クリック
[詳細表示] - 大きなジャケ + 5色パレット + メタ情報
   ↓ 色をクリックするとHEXがクリップボードにコピー
   ↓ 表示したアルバムは履歴に自動保存
[履歴] - 直近10件を再表示可能
```

## 3. 機能要件

### MVP（半日で必達）

- [x] アルバム検索（Last.fm API、Server-side で API キー隠蔽）
- [x] 検索結果カードグリッド表示
- [x] アルバム選択 → ジャケ拡大表示
- [x] colorthief で 5色パレット抽出
- [x] 各色クリックで HEX コードをクリップボードコピー
- [x] localStorage で直近10件履歴保存
- [ ] Vercel デプロイ

### 拡張（時間あれば）

- [ ] パレットを画像化してDLボタン
- [ ] CSS変数 (`--color-1: #abcdef;`) としてエクスポート
- [ ] 履歴ページ独立化
- [ ] 似た色のアルバムをローカル履歴から提案
- [ ] Spotify Web API 連携で検索精度UP（OAuth要）

## 4. 非機能要件

- **レスポンス**: 検索 → 結果表示 1秒以内（API 待ち除く）
- **モバイル対応**: スマホ縦持ちでも崩れない（Tailwind の responsive）
- **API キー秘匿**: クライアントから Last.fm 直接叩かない（Route Handler 経由）
- **検索デバウンス**: 入力300ms待ってから API 呼び出し（rate limit 対策）

## 5. 技術スタック

| 項目          | 採用                    |
| ------------- | ----------------------- |
| Framework     | Next.js 14 (App Router) |
| Language      | TypeScript              |
| Styling       | Tailwind CSS            |
| Color Extract | colorthief (npm)        |
| Music API     | Last.fm API             |
| Storage       | localStorage            |
| Deploy        | Vercel                  |

## 6. 画面構成

```
/                  メイン（検索・結果・詳細を1ページ完結）
/api/search        Last.fm 検索プロキシ（Route Handler）
/api/album         Last.fm album.getinfo プロキシ（Route Handler）
```

## 7. ディレクトリ設計

```
album-palette/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── api/
│       ├── search/route.ts
│       └── album/route.ts
├── components/
│   ├── SearchBar.tsx
│   ├── AlbumGrid.tsx
│   ├── AlbumCard.tsx
│   ├── AlbumDetail.tsx
│   ├── ColorPalette.tsx
│   └── HistoryList.tsx
├── lib/
│   ├── lastfm.ts
│   ├── storage.ts
│   └── types.ts
├── .env.local        ← LASTFM_API_KEY
└── README.md
```

## 8. 主要データ型

```ts
type Album = {
  name: string;
  artist: string;
  mbid?: string; // MusicBrainz ID
  imageUrl: string; // extralarge を使用
};

type Palette = {
  hex: string; // "#aabbcc"
  rgb: [number, number, number];
}[]; // length 5

type HistoryItem = Album & {
  palette: Palette;
  visitedAt: string; // ISO datetime
};
```

## 9. リスク・想定ハマりポイント

| リスク                             | 対策                                         |
| ---------------------------------- | -------------------------------------------- |
| 画像 CORS で colorthief が動かない | `<img crossOrigin="anonymous">` 必須         |
| Last.fm レートリミット             | 検索 debounce 300ms                          |
| API キー漏洩                       | Route Handler 経由で Server-side 呼び出し    |
| 検索結果に画像なし（古いアルバム） | 空文字フォルバックで非表示 or プレースホルダ |
| colorthief は SSR NG               | クライアントコンポーネントに分離             |

## 10. タイムボックス（半日 = 4時間）

| 時間      | フェーズ                                |
| --------- | --------------------------------------- |
| 0:00-0:30 | セットアップ + Last.fm API キー取得     |
| 0:30-1:30 | 検索 → カード一覧表示まで               |
| 1:30-2:30 | 詳細表示 + colorthief パレット抽出      |
| 2:30-3:00 | クリップボードコピー + スタイリング調整 |
| 3:00-3:30 | localStorage 履歴                       |
| 3:30-4:00 | Vercel デプロイ + README                |

## 11. 参考リンク

- [Last.fm API](https://www.last.fm/api)
- [colorthief GitHub](https://github.com/lokesh/color-thief)
- [Next.js App Router](https://nextjs.org/docs/app)
