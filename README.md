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

このアプリは、シンプルなサイン波の音声ファイルを使用しています。音声ファイルを生成するには、以下のコマンドを実行してください。

```bash
python3 scripts/generate_audio.py
```

このスクリプトは以下を生成します：
- C2からC5までの37個のピアノ音（MIDI 36-72）
- 成功、失敗、ファンファーレの効果音
- TypeScriptのインデックスファイル（`assets/sounds/index.ts`）

**注意**: 音声ファイルは既にリポジトリに含まれているため、通常は再生成する必要はありません。

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

デフォルトの音声ファイルはシンプルなサイン波ですが、カスタム音声ファイルに置き換えることができます。

1. 各MIDI音符に対応するWAVファイルを `assets/sounds/` に配置
   - ファイル名: `C2.wav`, `Cs2.wav`, `D2.wav`, ...
   - 範囲: MIDI 36 (C2) から 72 (C5)

2. 効果音ファイルを配置
   - `success.wav`: マッチ成功時
   - `fail.wav`: マッチ失敗時
   - `fanfare.wav`: ゲームクリア時

3. インデックスファイルを再生成
   ```bash
   python3 scripts/generate_audio.py
   ```

## ライセンス

MIT
