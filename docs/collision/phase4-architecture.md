# フェーズ4: 衝突検出 - アーキテクチャドキュメント

## 概要
家具同士のリアルタイム衝突検出機能。SAT（Separating Axis Theorem）アルゴリズムを使用し、回転した矩形同士の衝突を正確に判定する。フロントエンドのみの変更でバックエンド変更なし。

## アーキテクチャ

### ファイル構成
```
frontend/src/
├── utils/
│   └── collision.ts              # SAT衝突検出アルゴリズム（純粋関数）
├── hooks/
│   └── useCollisionDetection.ts  # React衝突検出フック
├── store/
│   └── furnitureStore.ts         # collidingIds状態追加
└── components/editor/
    ├── FurnitureLayer.tsx         # onDragMove + useEffect統合
    └── FurniturePropertiesPanel.tsx  # 衝突警告バナー
```

### データフロー
```
[ドラッグ中]
onDragMove → checkCollisionsOnDrag(id, x, y)
  → detectCollisionsForItem() [O(n)]
  → setCollidingIds
  → FurnitureLayer再描画（赤枠+赤オーバーレイ）

[配置/回転/削除後]
furniture変更 → useEffect
  → checkAllCollisions()
  → detectAllCollisions() [O(n²)]
  → setCollidingIds
  → FurnitureLayer再描画
```

## SATアルゴリズム

### OBB（Oriented Bounding Box）
```typescript
interface OBB {
  cx: number;   // 中心X (mm)
  cy: number;   // 中心Y (mm)
  hw: number;   // 半幅 (mm)
  hh: number;   // 半高 (mm)
  angle: number; // 回転角度 (ラジアン)
}
```

### 判定ロジック
1. 2つのOBBから4つの分離軸を抽出（各矩形の2辺の法線方向）
2. 各軸に対して、両方のOBBを射影し半径を計算
3. 中心間距離の射影が、半径の合計を超えていれば分離（衝突なし）
4. すべての軸で分離が見つからなければ衝突

### 射影半径の計算
```
radius = hw * |dot(localX, axis)| + hh * |dot(localY, axis)|
```
ここで `localX = (cos θ, sin θ)`, `localY = (-sin θ, cos θ)`

## 状態管理

### furnitureStore追加項目
| 項目 | 型 | 説明 |
|------|------|------|
| `collidingIds` | `Set<string>` | 衝突中の家具IDの集合 |
| `setCollidingIds` | `(ids: Set<string>) => void` | 衝突IDを更新 |

### 衝突状態のライフサイクル
- `reset()`時に`new Set()`でクリア
- ドラッグ中は`onDragMove`で更新（O(n)）
- 家具の配置/回転/削除後は`useEffect`で全体再チェック（O(n²)）
- ページリロード時は`setFurniture`後の`useEffect`で再検出

## パフォーマンス

| 操作 | 計算量 | 想定頻度 |
|------|--------|----------|
| ドラッグ中 | O(n) | 60fps |
| 配置/回転/削除 | O(n²/2) | イベント発生時 |

- n=100の場合: ドラッグ中 ~2,000演算/フレーム、全体チェック ~100,000演算
- いずれも1ms未満で完了、スロットリング不要

## 視覚フィードバック

### 衝突中の家具
| プロパティ | 通常 | 衝突中 |
|-----------|------|--------|
| 枠色 | #64748b (slate) | #ef4444 (red) |
| 枠幅 | 1/scale | 2.5/scale |
| オーバーレイ | なし | #ef4444, opacity 0.15 |

### プロパティパネル
- 衝突中: 赤い警告バナー「⚠ 他の家具と重なっています」
- 非衝突: バナー非表示

## エクスポート一覧

### collision.ts
| 関数 | 引数 | 戻り値 | 用途 |
|------|------|--------|------|
| `furnitureToOBB` | `FurnitureItem` | `OBB` | 家具→OBB変換 |
| `checkCollision` | `OBB, OBB` | `boolean` | 2つのOBB衝突判定 |
| `detectCollisionsForItem` | `FurnitureItem, FurnitureItem[]` | `Set<string>` | 1つ vs 全体 |
| `detectAllCollisions` | `FurnitureItem[]` | `Set<string>` | 全ペア判定 |

### useCollisionDetection
| 関数 | 引数 | 用途 |
|------|------|------|
| `checkCollisionsOnDrag` | `id, x, y` | ドラッグ中のリアルタイム検出 |
| `checkAllCollisions` | なし | 全体再チェック |
