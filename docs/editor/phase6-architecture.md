# フェーズ6: 保存・エクスポート・仕上げ - アーキテクチャドキュメント

## 概要

フロントエンドのみの変更で、Undo/Redo、PNG出力、キーボードショートカット、保存状態インジケータを実装。バックエンド変更なし。

## ファイル構成

### 新規ストア (3)
```
frontend/src/store/
├── historyStore.ts   # Undo/Redo用の状態履歴スタック
├── saveStore.ts      # 保存ライフサイクル状態管理
└── canvasStore.ts    # Konva Stage refの共有
```

### 新規フック (2)
```
frontend/src/hooks/
├── useHistory.ts            # 履歴操作のオーケストレーション
└── useKeyboardShortcuts.ts  # キーボードイベント処理
```

### 新規コンポーネント (2)
```
frontend/src/components/editor/
├── SaveStatusIndicator.tsx    # 保存状態表示
└── KeyboardShortcutsHelp.tsx  # ショートカット一覧モーダル
```

### 新規ユーティリティ (1)
```
frontend/src/utils/
└── exportCanvas.ts  # PNG出力ヘルパー
```

## 主要設計

### 1. Undo/Redo システム

```
historyStore
├── past: HistorySnapshot[]    # 過去の状態（最大50件）
├── future: HistorySnapshot[]  # Redo用の状態
├── pushHistory(snapshot)      # 操作前にスナップショット保存
├── undo(currentSnapshot)      # past→復元、current→future
└── redo(currentSnapshot)      # future→復元、current→past
```

**HistorySnapshot**:
```typescript
{ furniture: FurnitureItem[], walls: WallSegment[] }
```

**useHistoryフック**:
- `pushSnapshot()`: 現在のeditorStore.walls + furnitureStore.furnitureを深コピーしてhistoryStoreに保存
- `undo()`: 現在の状態をfutureに退避 → pastからスナップショットを復元 → 両ストアを更新
- `redo()`: 現在の状態をpastに退避 → futureからスナップショットを復元 → 両ストアを更新

**auto-save抑制**:
- furnitureStoreの`isRestoring`フラグでundo/redo中のauto-saveをスキップ
- 復元完了後に`isDirty: true`をセットしてサーバー同期

### 2. 保存状態管理

```
saveStore
├── status: 'idle' | 'saving' | 'saved' | 'error'
├── lastSavedAt: Date | null
├── setSaving() → setSaved() / setError()
```

**useAutoSave統合**:
1. isDirty検出 → 2秒デバウンス → `setSaving()`
2. API成功 → `setSaved()` + `setDirty(false)`
3. API失敗 → `setError(msg)`
4. `isRestoring`時はスキップ

### 3. PNG出力

```
canvasStore
├── stageRef: Konva.Stage | null
└── setStageRef(ref)

RoomCanvas → useEffect → setStageRef(stageRef.current)
EditorToolbar → stageRef → stage.toDataURL({ pixelRatio: 2 }) → download
```

### 4. キーボードショートカット

```
useKeyboardShortcuts(projectId)
├── window.addEventListener('keydown', handler)
├── ガード: INPUT/TEXTAREA/SELECTタグはスキップ
└── 各キーに対応する処理を実行
```

## データフロー

### Undo操作の流れ
```
User: Ctrl+Z
  → useKeyboardShortcuts: undo()
    → useHistory.undo()
      → 現在の状態をJSON.parse(JSON.stringify())で深コピー
      → historyStore.undo(currentSnapshot)
        → pastの末尾をpop → futureにcurrentを追加
        → スナップショットを返却
      → furnitureStore.setRestoring(true)
      → furnitureStore.setFurniture(snapshot.furniture)
      → editorStore.setWalls(snapshot.walls)
      → furnitureStore.setDirty(true)
      → furnitureStore.setRestoring(false)
        → useAutoSave: isDirty=true, isRestoring=false → 2秒後にAPI保存
```

### pushSnapshot + 操作の流れ
```
User: 家具をドラッグ移動
  → FurnitureLayer.handleDragEnd
    → pushSnapshot() → 移動前の状態をhistoryStoreに保存
    → updateFurniture(id, {x, y})
      → furnitureStore: isDirty=true
        → useAutoSave: 2秒後にAPI保存
```

## 依存関係

新規パッケージなし。既存の依存関係のみ使用：
- `zustand`: 状態管理
- `konva` / `react-konva`: キャンバス描画・PNG出力
- `react`: フック・イベント処理
