# PitchMatch - 音の神経衰弱ゲーム

絶対音感を楽しく鍛える神経衰弱ゲームアプリです。

## 機能

- **ピッチモード**: 単音の高さを聴き分けるモード
- **コードモード**: 和音（メジャー/マイナー）を聴き分けるモード
- **難易度選択**: 簡単（4ペア）、普通（8ペア）、難しい（12ペア）
- **拡張ルール**: オクターブ違いや転回形を同じとみなすルール
- **ランキング機能**: ハイスコアを記録して競争
- **2人プレイ対応**: 友達と対戦可能

## セットアップ

### 依存関係のインストール

```bash
npm install
```

### 音声ファイルの生成

ピアノ音源（FluidR3_GM）を`assets/sounds/piano/`にダウンロードします。
音声ファイルは既にリポジトリに含まれているため、通常は実行不要です。

```bash
python3 scripts/generate_piano_samples.py
```

このスクリプトは以下をダウンロード・生成します：
- C2からC5までの37個のピアノ音（MIDI 36-72）をMP3形式で`assets/sounds/piano/`に保存
- TypeScriptのインデックスファイル（`assets/sounds/index.ts`）を更新

効果音（成功・失敗・ファンファーレ）を再生成する場合：

```bash
python3 scripts/generate_audio.py
```

### アプリの起動

```bash
# 開発サーバーの起動
npm start

# iOS シミュレーター
npm run ios

# Android エミュレーター
npm run android

# Web ブラウザ
npm run web
```

## プロジェクト構造

```
pitchmatch/
├── app/                    # 画面コンポーネント（Expo Router）
├── assets/                 # 静的アセット
│   └── sounds/            # 音声ファイル
├── components/            # UIコンポーネント
├── constants/             # 定数定義
├── lib/                   # ビジネスロジック
│   ├── audio/            # 音声エンジン
│   ├── context/          # React Context
│   ├── game/             # ゲームロジック
│   ├── hooks/            # カスタムフック
│   ├── storage/          # データ永続化
│   └── types/            # TypeScript型定義
├── scripts/               # ユーティリティスクリプト
│   └── generate_audio.py # 音声ファイル生成スクリプト
└── utils/                 # ユーティリティ関数
```

## 技術スタック

- **React Native** + **Expo**: クロスプラットフォーム開発
- **TypeScript**: 型安全な開発
- **Expo Router**: ファイルベースルーティング
- **Expo AV**: 音声再生
- **NativeWind**: Tailwind CSSスタイル
- **AsyncStorage**: ローカルストレージ

## カスタム音声ファイル

ピアノ音源を差し替えたい場合は`scripts/generate_piano_samples.py`を編集してください。

現在の音源構成：
- `assets/sounds/piano/*.mp3` — ピアノ音（MIDI 36-72、全12音）
- `assets/sounds/*.m4a` — 効果音（success / fail / fanfare）

## ライセンス

MIT

## クレジット

- **ピアノ音源**: FluidR3_GM soundfont by Frank Wen, licensed under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/)
  - Source: [gleitz/midi-js-soundfonts](https://github.com/gleitz/midi-js-soundfonts)
