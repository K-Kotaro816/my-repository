# フェーズ5: 間取り画像アップロード - アーキテクチャドキュメント

## 概要

間取り図の画像をアップロードし、エディタキャンバスの背景として表示する機能。multerによるファイルアップロード、ローカルファイルシステムへの保存、express.staticによる配信、react-konvaによるキャンバス描画で構成される。

## システム構成

```
Frontend (React)              Backend (Express)           Storage
┌─────────────────┐          ┌────────────────────┐      ┌──────────────┐
│ FloorPlanPanel   │─upload──│ POST /floorplan     │─save─│ uploads/     │
│ (multipart/form) │         │ (multer middleware)  │      │  projects/   │
│                  │─delete──│ DELETE /floorplan    │─del──│   {id}/      │
│ FloorPlanImage   │◄─img────│ GET /uploads/...     │◄─────│   floorplan- │
│ Layer (Konva)    │         │ (express.static)     │      │   {ts}.ext   │
└─────────────────┘          └────────────────────┘      └──────────────┘
```

## APIエンドポイント

### POST `/api/projects/:id/floorplan`
- **Content-Type**: `multipart/form-data`
- **フィールド**: `floorPlanImage` (ファイル)
- **バリデーション**: JPEG/PNG/WebP、最大10MB
- **処理**: 旧画像削除 → 新画像保存 → DB更新（`floorPlanImagePath`, `floorPlanMode: 'image'`）
- **レスポンス**: 更新後のProjectオブジェクト

### DELETE `/api/projects/:id/floorplan`
- **処理**: 画像ファイル削除 → DB更新（`floorPlanImagePath: null`, `floorPlanMode: 'draw'`）
- **レスポンス**: 更新後のProjectオブジェクト

## ファイル構成

### Backend

```
backend/
├── src/
│   ├── application/usecases/
│   │   ├── UploadFloorPlan.ts    # アップロードユースケース
│   │   └── DeleteFloorPlan.ts    # 削除ユースケース
│   ├── infrastructure/config/
│   │   └── upload.ts             # multerストレージ設定
│   └── presentation/
│       ├── controllers/
│       │   └── ProjectController.ts  # uploadFloorPlan/deleteFloorPlanハンドラ追加
│       └── routes/
│           └── project.routes.ts     # POST/DELETEルート追加
├── uploads/                      # アップロードファイル保存先（.gitignore）
│   └── projects/{id}/
│       └── floorplan-{timestamp}.{ext}
└── .gitignore                    # uploads/除外
```

### Frontend

```
frontend/src/
├── api/
│   └── project.ts                # uploadFloorPlan/deleteFloorPlan関数追加
├── components/editor/
│   ├── FloorPlanImageLayer.tsx   # Konva Imageで背景画像描画
│   └── FloorPlanPanel.tsx        # アップロードUI + モード切替
└── pages/
    └── EditorPage.tsx            # レイヤー統合・条件付き表示
```

## 主要コンポーネント詳細

### multerストレージ設定（upload.ts）
- **保存先**: `uploads/projects/{projectId}/`（自動作成）
- **ファイル名**: `floorplan-{timestamp}.{ext}`（衝突回避）
- **ファイルフィルター**: `image/jpeg`, `image/png`, `image/webp`のみ許可
- **サイズ制限**: 10MB

### UploadFloorPlanユースケース
1. プロジェクト存在確認 + 所有者チェック
2. 既存画像があればファイルシステムから削除
3. `floorPlanImagePath`と`floorPlanMode: 'image'`でDB更新

### DeleteFloorPlanユースケース
1. プロジェクト存在確認 + 所有者チェック
2. 画像ファイルをファイルシステムから削除
3. `floorPlanImagePath: null`と`floorPlanMode: 'draw'`でDB更新

### FloorPlanImageLayer
- `window.Image()`で非同期画像ロード
- `VITE_API_URL`から`/api`を除去してベースURL算出
- 画像URL: `{baseUrl}/uploads/{floorPlanImagePath}`
- Konva `<Image>`で描画、`listening={false}`でイベント透過
- `opacity={0.6}`で半透明表示

### FloorPlanPanel
- `tool === 'furniture'`のとき非表示（FurniturePaletteとの重なり回避）
- モード切替ボタン（壁描画 / 画像）
- ファイルアップロード / 画像削除UI
- アップロード結果で`currentProject`を即座に更新

### EditorPageレイヤー順序
```
Layer 1: GridLayer          （常に表示）
Layer 2: FloorPlanImageLayer（floorPlanMode === 'image' && floorPlanImagePath存在時）
Layer 3: WallDrawingLayer   （floorPlanMode !== 'image'時）
Layer 4: FurnitureLayer     （常に表示）
```

## データモデル（既存）

Prismaスキーマに定義済みのフィールド：
```prisma
model Project {
  floorPlanImagePath String?              // 画像の相対パス
  floorPlanMode      String  @default("draw") // "draw" | "image"
}
```

## Docker構成

```yaml
backend:
  volumes:
    - ./backend/uploads:/app/uploads  # 画像永続化
```

## セキュリティ考慮事項

- multerのファイルフィルターでMIMEタイプを検証
- ファイルサイズを10MBに制限
- プロジェクト所有者のみアップロード・削除可能（認証ミドルウェア）
- `crossOrigin: 'anonymous'`でCORSに対応
- アップロードディレクトリは`.gitignore`で除外
