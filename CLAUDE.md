# CLAUDE.md - プロジェクト開発ガイド

## プロジェクト概要

ルームレイアウトプランナー：引っ越し時に間取り図上で家具を配置し、レイアウトをシミュレーションするWebアプリ。

## 実装フロー

すべての実装は以下のフローに従う：

1. **指示**: ユーザーが実装内容を指示する
2. **計画書作成**: Claudeが実装計画書を作成し提示する
3. **承認**: ユーザーが計画書を確認し承認する
4. **ブランチ作成**: `develop` から `feature/xxx` ブランチを切る
5. **Skills追加**: 実装に必要なSkillsを `.claude/skills/` に追加する
6. **実装**: 承認後に実装を開始する
7. **手順書作成**: 実装内容の手順書を `manual/<画面名>/` に保存する
8. **ドキュメント作成**: 実装完了後のドキュメントを `docs/<画面名>/` に保存する

**承認なしに実装を開始してはならない。**

## ディレクトリ構成ルール

### モノレポ構造

```
my-repository/
├── frontend/          # React + TypeScript + Vite
├── backend/           # Node.js + Express + TypeScript
├── manual/            # 実装手順書
│   └── <画面名>/      #   画面別に整理
├── docs/              # 実装ドキュメント
│   └── <画面名>/      #   画面別に整理
├── docker-compose.yml
├── CLAUDE.md
└── README.md
```

- フロントエンドのコードは `frontend/` 配下に実装する
- バックエンドのコードは `backend/` 配下に実装する
- それぞれ独立した `package.json` を持つ

### 手順書 (`manual/`)

実装の手順書を画面・機能単位で保存する。

```
manual/
├── auth/              # 認証（ログイン・登録）
├── dashboard/         # ダッシュボード
├── editor/            # ルームエディタ
├── furniture/         # 家具管理
└── infrastructure/    # Docker・DB・共通基盤
```

### ドキュメント (`docs/`)

実装完了後のドキュメントを画面・機能単位で保存する。

```
docs/
├── auth/
├── dashboard/
├── editor/
├── furniture/
└── infrastructure/
```

## ブランチ戦略

```
main ← staging ← develop ← feature/xxx
```

- ベースブランチ: `develop`
- 機能開発: `develop` から `feature/xxx` を切る
- マージ順: `feature/xxx` → `develop` → `staging` → `main`

## コミット規約 (Gitmoji)

| 絵文字 | コード | 用途 |
|--------|--------|------|
| :sparkles: | `:sparkles:` | 新規機能実装 |
| :zap: | `:zap:` | 既存の機能に別機能追加 |
| :fire: | `:fire:` | 機能の削除 |
| :bug: | `:bug:` | バグ修正 |
| :adhesive_bandage: | `:adhesive_bandage:` | 軽微な修正 |
| :tada: | `:tada:` | プロジェクト最初のコミット |
| :recycle: | `:recycle:` | リファクタリング |
| :memo: | `:memo:` | ドキュメント・README・コメントの追加 |

例: `:sparkles: ログイン機能を実装`

## 技術スタック

- **Frontend**: React + TypeScript + Vite + react-konva + Zustand + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript + pg (PostgreSQL直接接続)
- **DB**: PostgreSQL 16
- **インフラ**: Docker Compose
- **認証**: JWT + bcrypt
- **コード品質**: ESLint + Prettier + husky (pre-commit hook)

## コーディング規約

- パッケージマネージャーは **pnpm** を使用する（npm/yarn は使わない）
- TypeScript strict mode を使用する
- ESLint + Prettier の設定に従う
- コミット前に husky pre-commit hook で自動的にlint・フォーマットを実行する
- フロントエンドのスタイルは Tailwind CSS を使用する
- バックエンドは Controller → Service → DB の3層構造
- DB接続は ORM を使わず `pg` で直接SQLを書く
