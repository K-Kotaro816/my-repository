# フェーズ2: ルームエディタ基盤 + 壁描画 - 操作手順書

## 前提条件
- フェーズ1のセットアップが完了していること
- Docker環境が起動していること（`docker-compose up`）

## 1. Prismaマイグレーション

Docker起動時に自動実行されますが、手動で実行する場合:

```bash
docker-compose exec backend npx prisma migrate dev
```

## 2. プロジェクトCRUD API

### Swagger UIで確認
ブラウザで `http://localhost:3000/api-docs` を開き、Projects セクションを確認。

### cURLでの操作例

**ログインしてトークン取得:**
```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' | jq -r '.token')
```

**プロジェクト作成:**
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"リビングルーム","roomWidthMm":6000,"roomHeightMm":4000}'
```

**プロジェクト一覧取得:**
```bash
curl http://localhost:3000/api/projects \
  -H "Authorization: Bearer $TOKEN"
```

**プロジェクト更新:**
```bash
curl -X PUT http://localhost:3000/api/projects/{id} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"更新後の名前"}'
```

**プロジェクト削除:**
```bash
curl -X DELETE http://localhost:3000/api/projects/{id} \
  -H "Authorization: Bearer $TOKEN"
```

## 3. ダッシュボード操作

1. ログイン後、ダッシュボードページ（`/dashboard`）に遷移
2. 「新規プロジェクト」ボタンをクリック
3. ダイアログにプロジェクト名・幅（cm）・奥行き（cm）を入力
4. 「作成」ボタンでプロジェクトが一覧に追加される
5. プロジェクトカードの「編集する」ボタンでエディタに遷移
6. 「削除」ボタンで確認ダイアログ後にプロジェクト削除

## 4. エディタ操作

### 基本操作
- **ズーム**: マウスホイールで拡大/縮小（ポインタ位置に向かってズーム）
- **パン**: 「移動」ツール選択時にドラッグ、または「選択」ツールでもドラッグ可能

### ツールバー
左上のツールバーから操作ツールを選択:
- **選択**: オブジェクトの選択・キャンバス移動
- **壁描画**: 壁の描画（後述）
- **移動**: キャンバスのパン操作
- **グリッド**: グリッド表示のON/OFF切り替え

### 壁描画
1. ツールバーから「壁描画」を選択
2. キャンバス上をクリックして頂点を配置（青い線とドットで表示）
3. ダブルクリックでポリゴンを閉じて壁を確定
4. 「キャンセル」ボタンで描画中の壁を破棄

### キャンバス仕様
- 内部単位: mm（ミリメートル）
- 表示単位: cm（センチメートル）
- グリッド間隔: 10cm（100mm）
- ズーム範囲: 10% 〜 500%
- 白い矩形がプロジェクトで指定した部屋のサイズ

## 5. トラブルシューティング

### プロジェクトが作成できない
- ログイン状態を確認（トークンの有効期限切れの可能性）
- ブラウザのネットワークタブでAPIレスポンスを確認
- バックエンドログ: `docker-compose logs backend`

### エディタが表示されない
- URLが `/editor/{projectId}` 形式になっているか確認
- ブラウザのコンソールでエラーを確認
- プロジェクトが存在し、自分のプロジェクトであるか確認

### グリッドが表示されない
- ツールバーの「グリッド」ボタンが有効になっているか確認
- ズームレベルが極端でないか確認
