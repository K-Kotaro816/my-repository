# フェーズ2: ルームエディタ基盤 - アーキテクチャドキュメント

## 概要
フェーズ1の認証基盤の上に、プロジェクトCRUD機能と2Dルームエディタの基盤を構築した。ユーザーは部屋のサイズを指定してプロジェクトを作成し、キャンバス上で壁を描画できる。

## バックエンド

### Projectモデル（Prisma）
```
projects テーブル
├── id (UUID, PK)
├── user_id (FK → users.id, CASCADE)
├── name (VARCHAR 255)
├── room_width_mm (INT) - 部屋の幅（mm）
├── room_height_mm (INT) - 部屋の奥行き（mm）
├── wall_data (JSON, nullable) - 壁データ（WallSegment[]）
├── floor_plan_image_path (VARCHAR 500, nullable) - 間取り図画像パス
├── floor_plan_mode (VARCHAR 20, default: "draw") - 間取り作成モード
├── canvas_state (JSON, nullable) - キャンバス状態
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

### Clean Architectureレイヤー構成
```
domain/
├── entities/Project.ts        # Project, WallSegment, CanvasState 型定義
└── repositories/IProjectRepository.ts  # リポジトリインターフェース

application/usecases/
├── CreateProject.ts           # プロジェクト作成
├── ListProjects.ts            # ユーザーのプロジェクト一覧取得
├── GetProject.ts              # プロジェクト取得（所有者チェック付き）
├── UpdateProject.ts           # プロジェクト更新（所有者チェック付き）
└── DeleteProject.ts           # プロジェクト削除（所有者チェック付き）

infrastructure/repositories/
└── PrismaProjectRepository.ts # Prisma実装

presentation/
├── controllers/ProjectController.ts  # CRUD操作のハンドラー
└── routes/project.routes.ts          # Express ルート + Swagger
```

### APIエンドポイント
| Method | Path | 認証 | 説明 |
|--------|------|------|------|
| GET | `/api/projects` | 必要 | 自分のプロジェクト一覧取得 |
| GET | `/api/projects/:id` | 必要 | プロジェクト詳細取得 |
| POST | `/api/projects` | 必要 | プロジェクト作成 |
| PUT | `/api/projects/:id` | 必要 | プロジェクト更新 |
| DELETE | `/api/projects/:id` | 必要 | プロジェクト削除 |

### バリデーション（Zod）
- `name`: 1〜255文字の文字列
- `roomWidthMm`: 1000〜50000（1m〜50m）
- `roomHeightMm`: 1000〜50000（1m〜50m）

## フロントエンド

### ディレクトリ構成
```
src/
├── types/project.ts           # Project, WallSegment, CanvasState 型
├── api/project.ts             # CRUD API関数
├── store/
│   ├── projectStore.ts        # プロジェクト一覧・選択管理（Zustand）
│   └── editorStore.ts         # エディタ状態管理（Zustand）
├── components/
│   ├── layout/Header.tsx      # 共通ヘッダー
│   ├── dashboard/
│   │   ├── ProjectList.tsx    # プロジェクト一覧グリッド
│   │   ├── ProjectCard.tsx    # プロジェクトカード
│   │   └── CreateProjectDialog.tsx  # 新規作成ダイアログ
│   └── editor/
│       ├── RoomCanvas.tsx     # Konva Stage + ズーム/パン制御
│       ├── GridLayer.tsx      # グリッド線描画
│       ├── WallDrawingLayer.tsx    # 壁描画レイヤー
│       └── EditorToolbar.tsx  # ツール選択バー
└── pages/
    ├── DashboardPage.tsx      # ダッシュボード
    └── EditorPage.tsx         # エディタページ
```

### 状態管理

#### projectStore（Zustand）
- `projects`: プロジェクト一覧
- `currentProject`: 現在選択中のプロジェクト
- `isLoading` / `error`: 非同期状態
- アクション: `fetchProjects`, `fetchProject`, `createProject`, `deleteProject`

#### editorStore（Zustand）
- `tool`: 選択中のツール（`select` | `wall` | `pan`）
- `walls`: 確定済みの壁データ（`WallSegment[]`）
- `currentWallPoints`: 描画中の頂点座標
- `scale` / `position`: ズーム・パン状態
- `gridVisible`: グリッド表示状態
- アクション: `setTool`, `addWallPoint`, `finishWall`, `cancelWall`, `setScale`, `setPosition`

### キャンバス技術仕様

#### react-konva (Konva.js)
- `Stage` → `Layer` → Shape の階層構造
- React 18対応のため `react-konva@18` を使用

#### 単位系
- 内部データ: mm（ミリメートル）
- 表示ラベル: cm（センチメートル）
- ピクセル変換: `PIXELS_PER_MM = 0.5`（1mm = 0.5px）

#### ズーム
- マウスホイールでポインタ位置に向かってズーム
- スケール倍率: `scaleBy = 1.1`
- 範囲: 0.1倍 〜 5.0倍
- Stage の `scaleX/Y` と位置を同時更新してポインタ固定ズームを実現

#### グリッド
- 100mm（10cm）間隔の格子線
- `listening={false}` でイベント透過
- ON/OFF切り替え可能

#### 壁描画フロー
1. 「壁描画」ツール選択
2. キャンバスクリック → `addWallPoint(x, y)` で頂点追加
3. 描画中は青い破線（`dash`）と頂点マーカー（`Circle`）で可視化
4. ダブルクリック → `finishWall()` でポリゴン確定
5. 確定済みの壁は黒い実線 + 半透明フィルで描画
6. 頂点が2点未満の場合は `finishWall()` で破棄

### ルーティング
| Path | コンポーネント | 認証 |
|------|------------|------|
| `/dashboard` | DashboardPage | 必要 |
| `/editor/:projectId` | EditorPage | 必要 |

## データフロー

### プロジェクト作成
```
DashboardPage → CreateProjectDialog → projectStore.createProject
  → api/project.ts → POST /api/projects → CreateProject usecase
  → PrismaProjectRepository.create → DB INSERT
```

### エディタ読み込み
```
EditorPage → projectStore.fetchProject(id)
  → api/project.ts → GET /api/projects/:id → GetProject usecase
  → project.wallData → editorStore.setWalls()
  → RoomCanvas + GridLayer + WallDrawingLayer で描画
```

### 壁描画
```
WallDrawingLayer onClick → editorStore.addWallPoint(x, y)
  → currentWallPoints 更新 → Line (破線) + Circle 描画
WallDrawingLayer onDblClick → editorStore.finishWall()
  → walls 配列に追加 → Line (実線) 描画
```

## 依存パッケージ（フェーズ2で追加）
- `konva`: ^10.2.0 - 2D Canvas ライブラリ
- `react-konva`: ^18.2.14 - Konva の React ラッパー（React 18対応版）
