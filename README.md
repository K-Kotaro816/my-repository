# ルームレイアウトプランナー

引っ越し時に部屋の間取り図上で家具を配置し、レイアウトをシミュレーションするWebアプリケーション。

## 技術スタック

- **Frontend**: React + TypeScript + Vite + react-konva (2Dキャンバス) + Zustand (状態管理) + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript + pg (PostgreSQL直接接続)
- **DB**: PostgreSQL 16
- **インフラ**: Docker Compose (frontend / backend / db の3サービス)
- **認証**: JWT + bcrypt
- **コード品質**: ESLint + Prettier + husky (pre-commit hook)

## 開発規約

### ブランチ戦略

```
main          ← 本番環境（リリース済み）
 └── staging  ← ステージング環境（リリース前検証）
      └── develop  ← 開発ベースブランチ
           └── feature/xxx  ← 機能開発ブランチ
```

- ベースブランチは `develop`
- 機能開発は `develop` から `feature/xxx` を切って作業
- `develop` → `staging` → `main` の順にマージ

### ブランチ命名規約

| プレフィックス | 用途 | 例 |
|---------------|------|-----|
| `feature/` | 新機能開発 | `feature/login` |
| `fix/` | バグ修正 | `fix/auth-token` |
| `docs/` | ドキュメント | `docs/api-spec` |
| `refactor/` | リファクタリング | `refactor/editor-store` |

### コミットメッセージ (Gitmoji)

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

### ドキュメント管理

```
manual/           ← 実装手順書
 └── <画面名>/    ← 画面別ディレクトリ
docs/             ← 実装完了後のドキュメント
 └── <画面名>/    ← 画面別ディレクトリ
```

## プロジェクト構成

```
my-repository/
├── docker-compose.yml
├── .env.example
├── .gitignore
├── CLAUDE.md
├── manual/               # 実装手順書（画面別ディレクトリ）
├── docs/                 # 実装ドキュメント（画面別ディレクトリ）
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── index.html
│   └── src/
│       ├── main.tsx / App.tsx
│       ├── api/          # Axiosクライアント、各APIモジュール
│       ├── store/        # Zustandストア (auth, editor, project)
│       ├── hooks/        # useCanvas, useCollisionDetection, useFurnitureDrag
│       ├── components/
│       │   ├── layout/   # Header, Sidebar, ProtectedRoute
│       │   ├── auth/     # LoginForm, RegisterForm
│       │   ├── dashboard/ # ProjectList, ProjectCard, CreateProjectDialog
│       │   └── editor/   # RoomCanvas, GridLayer, WallDrawingLayer,
│       │                 # FloorPlanImageLayer, FurnitureLayer,
│       │                 # FurnitureItem, FurnitureTransformer,
│       │                 # FurnitureSidebar, EditorToolbar, ExportMenu
│       ├── pages/        # LoginPage, RegisterPage, DashboardPage, EditorPage
│       ├── types/        # auth, project, furniture, editor
│       ├── utils/        # collision (SAT), geometry, grid, units
│       └── styles/
└── backend/
    ├── Dockerfile
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── index.ts
        ├── config/       # database.ts (pg Pool + マイグレーション), env.ts
        ├── middleware/    # auth (JWT), errorHandler, upload (multer), validate (zod)
        ├── routes/       # auth, project, furniture, upload
        ├── controllers/  # auth, project, furniture, upload
        ├── services/     # auth, project, furniture
        ├── db/
        │   ├── migrations/  # 001_users, 002_projects, 003_furniture_templates, 004_furniture_instances
        │   └── seed/        # default_furniture.sql (ベッド、デスク、椅子など17種)
        └── utils/        # jwt.ts, password.ts
```

## データベーススキーマ

### users
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | gen_random_uuid() |
| email | VARCHAR(255) UNIQUE | |
| password_hash | VARCHAR(255) | bcrypt (salt rounds=12) |
| display_name | VARCHAR(100) | |
| created_at / updated_at | TIMESTAMPTZ | |

### projects
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id | UUID FK → users | ON DELETE CASCADE |
| name | VARCHAR(255) | |
| room_width_mm / room_height_mm | INTEGER | 部屋サイズ(mm単位) |
| wall_data | JSONB | 壁の線分データ |
| floor_plan_image_path | VARCHAR(500) | アップロード画像パス |
| floor_plan_mode | VARCHAR(20) | 'draw' or 'image' |
| canvas_state | JSONB | ズーム・パン等 |

### furniture_templates
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id | UUID FK (nullable) | NULL=システムデフォルト |
| name / category | VARCHAR | |
| width_mm / height_mm | INTEGER | |
| color / shape | VARCHAR | |
| is_default | BOOLEAN | |

### furniture_instances
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| project_id | UUID FK → projects | ON DELETE CASCADE |
| template_id | UUID FK → templates | |
| x_position / y_position | FLOAT | mm単位 |
| width_mm / height_mm | FLOAT | テンプレートから変更可能 |
| rotation | FLOAT | 度数 |
| color / label | VARCHAR | |
| z_index | INTEGER | |

## API設計

### 認証
- `POST /api/auth/register` - ユーザー登録
- `POST /api/auth/login` - ログイン → JWT返却 (有効期限24h)
- `GET /api/auth/me` - 現在のユーザー情報

### プロジェクト
- `GET /api/projects` - 一覧取得
- `GET /api/projects/:id` - 詳細取得 (家具インスタンス含む)
- `POST /api/projects` - 新規作成
- `PUT /api/projects/:id` - 更新 (名前、壁データ、キャンバス状態)
- `DELETE /api/projects/:id` - 削除

### 家具テンプレート
- `GET /api/furniture/templates` - テンプレート一覧 (デフォルト + カスタム)
- `POST /api/furniture/templates` - カスタムテンプレート作成
- `DELETE /api/furniture/templates/:id` - 削除

### 家具インスタンス
- `POST /api/projects/:projectId/furniture` - 配置
- `PUT /api/projects/:projectId/furniture/:id` - 位置/回転/サイズ更新
- `DELETE /api/projects/:projectId/furniture/:id` - 削除
- `PUT /api/projects/:projectId/furniture/batch` - 一括更新 (自動保存用)

### ファイルアップロード
- `POST /api/projects/:projectId/floorplan` - 間取り図画像アップロード (max 10MB)

## 主要な技術的ポイント

### キャンバス (react-konva)
- **ズーム**: マウスホイールで `Stage.scaleX/Y` を変更、ポインタ位置に向かってズーム
- **パン**: ミドルクリックドラッグまたはスペースキー+ドラッグ
- **グリッド**: `GridLayer`で格子線を描画、snap-to-gridは`dragBoundFunc`で座標を丸める
- **単位系**: 内部は全てmm、表示はcm、`PIXELS_PER_MM = 0.5`で変換

### 壁描画
- クリックで頂点配置、ダブルクリックで閉じてポリゴン完成
- `<Line>`要素で描画、`strokeWidth`が壁の厚さ

### 家具操作
- **サイドバー→キャンバス**: HTML5ドラッグイベント → Stageコンテナの`onDrop`で座標変換
- **Transformer**: `konva.Transformer`で回転ハンドル+リサイズアンカーを表示
- **変形確定**: `onTransformEnd`で`scaleX/Y`から実寸計算し、scaleを1にリセット

### 衝突検出 (クライアントサイド)
- `onDragMove`イベントで毎フレーム実行
- **SAT (Separating Axis Theorem)**: 回転した矩形同士の衝突判定
- 衝突時は赤枠+半透明赤オーバーレイで視覚的警告 (配置は阻止しない)
- 家具数100個未満を想定、O(n)で十分な性能

### 保存戦略
- **自動保存**: 3秒デバウンスで一括更新APIを呼び出し
- **手動保存**: Ctrl+Sで即時保存

## 実装フェーズ

### フェーズ1: プロジェクト基盤
Docker環境、DB、認証、基本的なフロントエンドルーティング
- `docker-compose.yml`, Dockerfile (frontend/backend)
- DBマイグレーション (usersテーブル)
- 認証API + JWT + bcrypt
- ログイン/登録ページ、ProtectedRoute
- **マイルストーン**: `docker-compose up`で3サービス起動、ユーザー登録・ログイン可能

### フェーズ2: ルームエディタ基盤 + 壁描画
キャンバス、グリッド、ズーム/パン、壁描画、プロジェクトCRUD
- DBマイグレーション (projectsテーブル)
- プロジェクトCRUD API
- ダッシュボードページ (プロジェクト一覧)
- RoomCanvas, GridLayer, WallDrawingLayer, EditorToolbar
- **マイルストーン**: プロジェクト作成→エディタ開く→グリッド表示→壁描画→ズーム/パン動作

### フェーズ3: 家具配置 (ドラッグ&ドロップ + 回転 + リサイズ)
- DBマイグレーション (furniture_templates, furniture_instances)
- デフォルト家具シードデータ (17種)
- 家具テンプレート/インスタンスAPI
- FurnitureSidebar, FurnitureItem, FurnitureTransformer
- サイドバー→キャンバスへのドラッグ&ドロップ
- **マイルストーン**: サイドバーから家具をドラッグ配置、選択→移動→回転→リサイズ可能

### フェーズ4: 衝突検出
- `collision.ts` (SAT アルゴリズム)
- `useCollisionDetection` フック
- FurnitureItemに衝突時の赤表示を統合
- **マイルストーン**: 家具ドラッグ時にリアルタイムで衝突ハイライト表示

### フェーズ5: 画像アップロード間取り図 (フェーズ3/4と並行可能)
- multerアップロードミドルウェア + APIエンドポイント
- FloorPlanImageLayer (背景画像表示)
- スケール校正 (画像のピクセル幅を実寸mmにマッピング)
- **マイルストーン**: 画像アップロード→背景表示→スケール設定→家具配置可能

### フェーズ6: 保存・エクスポート・仕上げ
- 自動保存 (3秒デバウンス + batch API)
- Undo/Redo (状態履歴スタック)
- PNG エクスポート (`stage.toDataURL()`)
- キーボードショートカット (Delete, Ctrl+Z, R, Escape等)
- UI/UXの仕上げ

## セットアップ

```bash
docker-compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- PostgreSQL: localhost:5432
