# Retro Cluster

レトロスペクティブ用ノート自動クラスタリング &amp; CSV エクスポートツール

![Retro Cluster Demo](https://via.placeholder.com/800x450.png?text=Retro+Cluster+Demo)

## 📖 概要

チームのレトロスペクティブで集まったKPTノートを自動でグループ化し、共通点のあるノートをクラスタリングします。OpenAIのテキスト埋め込みとk-meansクラスタリングを使用して、意味的に似たノートを見つけ、代表的なノートを特定します。

## ✨ 機能

- KPT形式のテキスト入力 (`K:`/`P:`/`T:` プレフィックス必須)
- OpenAI APIを使った自動テキスト埋め込み
- k-meansアルゴリズムによるクラスタリング
- クラスタ結果のわかりやすい可視化
- CSVエクスポート機能

## 🚚 API仕様

### `/api/group` エンドポイント

**入力:**
```
{ rawText: string }
```

**処理:**
1. テキストをパース
2. OpenAI `text-embedding-3-large` でベクトル化
3. クラスタ数 k = max(2, ceil(√N)) でk-means
4. 各クラスタの代表ノートを選出

**出力:**
```
{
  clusters: [
    {
      id: number,
      category: "K" | "P" | "T",
      representative: string,
      noteIds: string[]
    }
  ],
  notes: [...]
}
```

## 🛠️ 技術スタック

- **Frontend:** Next.js, React, TypeScript, TailwindCSS
- **AI/ML:** OpenAI API (text-embedding-3-large), ml-kmeans
- **Tools:** PapaParse (CSV生成), UUID

## 🏃‍♂️ セットアップ手順

### 前提条件

- Node.js 18.0.0以上
- OpenAI APIキー

### ローカル環境でのセットアップ

1. リポジトリをクローン:
   ```bash
   git clone https://github.com/niya1123/retro_cluster.git
   cd retro_cluster
   ```

2. 依存関係をインストール:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. 環境変数を設定:
   ```bash
   cp .env.example .env.local
   ```
   `.env.local`ファイルを開き、`OPENAI_KEY`にOpenAI APIキーを設定してください。

4. 開発サーバーを起動:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. ブラウザで[http://localhost:3000](http://localhost:3000)にアクセス

### Docker環境でのセットアップ

1. リポジトリをクローン:
   ```bash
   git clone https://github.com/niya1123/retro_cluster.git
   cd retro_cluster
   ```

2. 環境変数を設定:
   ```bash
   cp .env.example .env.local
   ```
   `.env.local`ファイルを開き、`OPENAI_KEY`にOpenAI APIキーを設定してください。

3. Dockerコンテナをビルド・起動:
   ```bash
   docker-compose up -d
   ```

4. ブラウザで[http://localhost:3000](http://localhost:3000)にアクセス

## 🧪 テスト

テストを実行するには:

```bash
npm test
# or
yarn test
# or
pnpm test
```

テストカバレッジを確認するには:

```bash
npm run test:coverage
# or
yarn test:coverage
# or
pnpm test:coverage
```

## 🤝 貢献方法

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. Pull Requestを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。