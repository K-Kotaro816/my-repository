# フェーズ3: 家具配置・管理 - アーキテクチャドキュメント

## 概要
フェーズ2のルームエディタ（キャンバス + 壁描画）の上に、家具配置機能を追加。ユーザーは家具カタログから家具を選択し、部屋のレイアウト上にドラッグ＆ドロップで配置、回転、削除できる。

## 設計方針

### データ保存: JSON列方式
- `projects`テーブルに`furniture_data` JSON列を追加
- `wallData`と同じパターンで既存の`UpdateProject`ユースケースを通じて保存
- 家具ごとの個別テーブルは不要（プロジェクトに紐づくため）

### 家具カタログ: フロントエンドハードコード
- `constants/furnitureCatalog.ts`にTypeScript定数として定義
- 日本の一般的な家具サイズを採用
- 5カテゴリ・19種類の家具を収録

### 状態管理: 専用furnitureStore
- `editorStore`はキャンバス・ツール状態に専念
- `furnitureStore`で家具の配置・選択・ドラッグ状態を管理
- 自動保存用のダーティフラグを管理

## バックエンド変更

### Prismaスキーマ
```
projects テーブル（追加カラム）
└── furniture_data (JSON, nullable) - 家具配置データ
```

### 変更ファイル（最小限）
| ファイル | 変更内容 |
|---------|---------|
| `prisma/schema.prisma` | `furnitureData` カラム追加 |
| `domain/entities/Project.ts` | `FurnitureItem`インターフェース追加 |
| `domain/repositories/IProjectRepository.ts` | `UpdateProjectData`に`furnitureData`追加 |
| `presentation/routes/project.routes.ts` | Zodスキーマ + Swagger更新 |
| `infrastructure/config/swagger.ts` | Projectスキーマ更新 |

既存のコントローラー・ユースケース・リポジトリは変更不要（汎用的な`UpdateProjectData`を透過的に処理）。

## フロントエンド

### ディレクトリ構成（追加分）
```
src/
├── constants/
│   └── furnitureCatalog.ts       # 家具カタログ定数
├── hooks/
│   └── useAutoSave.ts            # デバウンス自動保存フック
├── store/
│   └── furnitureStore.ts         # 家具状態管理 (Zustand)
└── components/editor/
    ├── FurnitureLayer.tsx         # Konva家具描画レイヤー
    ├── FurniturePalette.tsx       # 家具カタログサイドバー
    └── FurniturePropertiesPanel.tsx # 選択家具プロパティ
```

### FurnitureItem型
```typescript
interface FurnitureItem {
  id: string;           // crypto.randomUUID()
  type: string;         // カタログキー
  name: string;         // 表示名
  x: number;            // 中心X座標 (mm)
  y: number;            // 中心Y座標 (mm)
  widthMm: number;      // 幅 (mm)
  heightMm: number;     // 奥行き (mm)
  rotation: number;     // 角度 (0/90/180/270)
  color: string;        // 塗りつぶし色
}
```

### furnitureStore（Zustand）
| 状態 | 型 | 説明 |
|-----|---|------|
| `furniture` | `FurnitureItem[]` | 配置済み家具 |
| `selectedId` | `string \| null` | 選択中の家具ID |
| `placingType` | `string \| null` | 配置モード中のカタログタイプ |
| `isDirty` | `boolean` | 自動保存用フラグ |

| アクション | 説明 |
|-----------|------|
| `addFurniture` | 家具追加（配置モード解除 + 選択） |
| `updateFurniture` | 位置・回転などの部分更新 |
| `removeFurniture` | 家具削除 |
| `selectFurniture` | 選択切替 |
| `setPlacingType` | 配置モード切替 |
| `rotateFurniture` | 90度回転 |

### コンポーネント詳細

#### FurnitureLayer（Konva Layer）
- 各家具を`Group` + `Rect` + `Text`で描画
- `Group`の`offsetX/Y`で中心回転を実現
- `draggable` + `dragBoundFunc`で部屋範囲内にドラッグ制限
- キャンバスクリックで新規家具配置（`placingType`設定時）
- 家具クリックで選択（`cancelBubble`でStageクリックと分離）

#### FurniturePalette（サイドバー）
- `editorStore.tool === 'furniture'`のときのみ表示
- カテゴリ別にグリッド表示
- 色プレビュー + 名前 + サイズ(cm)を表示
- クリックで`placingType`をトグル

#### FurniturePropertiesPanel
- `selectedId`がnullでないときのみ表示
- 位置(cm)・サイズ(cm)・角度を表示
- 90°回転ボタン・削除ボタン

### 自動保存（useAutoSave）
```
家具変更 → isDirty=true → 2秒デバウンス → PUT /api/projects/:id
                                            → isDirty=false
```
- `useRef`でタイマー管理
- 変更のたびにタイマーリセット（最後の変更から2秒後に保存）
- 保存失敗時はコンソールにエラー出力

### 座標系
- 保存データ: mm（ミリメートル）
- 表示ラベル: cm（÷10）
- ピクセル変換: `PIXELS_PER_MM = 0.5`
- `x, y`は家具の中心座標
- `Group`の`offsetX/Y`で中心基準の回転を実現

### ツール連携
| ツール | Stage draggable | 家具 draggable | 家具配置 |
|--------|----------------|---------------|---------|
| select | Yes | Yes | No |
| wall | No | No | No |
| furniture | Yes | Yes | Yes |
| pan | Yes | No | No |

## 依存パッケージ
フェーズ3で追加パッケージなし（react-konva, konvaはPhase 2で導入済み）。
