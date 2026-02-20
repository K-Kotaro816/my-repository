# フェーズ1: プロジェクト基盤 - アーキテクチャドキュメント

## システム構成

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Frontend   │────▶│  Backend    │────▶│  PostgreSQL  │
│  (Vite)     │     │  (Express)  │     │  (Docker)    │
│  :5173      │     │  :3001      │     │  :5432       │
└─────────────┘     └─────────────┘     └─────────────┘
```

## Backendアーキテクチャ（クリーンアーキテクチャ）

```
┌──────────────────────────────────────────────────┐
│  Presentation (Express)                           │
│  ├── Controllers  ─ HTTP リクエスト/レスポンス処理   │
│  ├── Routes       ─ エンドポイント定義 + Swagger    │
│  └── Middleware    ─ 認証, バリデーション, エラー     │
├──────────────────────────────────────────────────┤
│  Application (Use Cases)                          │
│  ├── UseCases     ─ ビジネスロジック               │
│  └── Interfaces   ─ 外部サービスの抽象化            │
├──────────────────────────────────────────────────┤
│  Domain (Entities)                                │
│  ├── Entities     ─ ドメインモデル                  │
│  └── Repositories ─ データアクセスインターフェース    │
├──────────────────────────────────────────────────┤
│  Infrastructure (外部依存)                         │
│  ├── Repositories ─ Prisma実装                    │
│  ├── Services     ─ bcrypt, JWT実装               │
│  └── Config       ─ 環境変数, Swagger設定          │
└──────────────────────────────────────────────────┘
```

**依存の方向**: Presentation → Application → Domain ← Infrastructure

## 認証フロー

### 登録フロー
1. ユーザーが RegisterForm に情報を入力
2. `authStore.register()` → `authApi.register()` → `POST /api/auth/register`
3. Backend: zodバリデーション → RegisterUser usecase実行
4. bcryptでパスワードハッシュ化 → Prismaでユーザー作成
5. JWTトークン生成 → レスポンス返却
6. フロントエンド: トークンをlocalStorageに保存 → ダッシュボードにリダイレクト

### ログインフロー
1. ユーザーが LoginForm に情報を入力
2. `authStore.login()` → `authApi.login()` → `POST /api/auth/login`
3. Backend: zodバリデーション → LoginUser usecase実行
4. bcryptでパスワード照合 → JWTトークン生成
5. フロントエンド: トークンをlocalStorageに保存 → ダッシュボードにリダイレクト

### 認証状態管理
- Axios interceptor: リクエストごとに `Authorization: Bearer <token>` ヘッダーを自動付与
- 401レスポンス: トークン削除 → ログインページにリダイレクト
- ProtectedRoute: 未認証時にログインページにリダイレクト

## API仕様

| Method | Path | 認証 | 説明 |
|--------|------|------|------|
| POST | `/api/auth/register` | 不要 | ユーザー登録 |
| POST | `/api/auth/login` | 不要 | ログイン |
| GET | `/api/auth/me` | 必要 | 現在のユーザー情報取得 |
| GET | `/api/health` | 不要 | ヘルスチェック |
| GET | `/api-docs` | 不要 | Swagger UI |

## データベーススキーマ

### users テーブル
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, gen_random_uuid() |
| email | VARCHAR | UNIQUE, NOT NULL |
| password_hash | VARCHAR | NOT NULL |
| display_name | VARCHAR(100) | NULLABLE |
| created_at | TIMESTAMPTZ | DEFAULT now() |
| updated_at | TIMESTAMPTZ | 自動更新 |

## 技術スタック詳細

| レイヤー | 技術 | バージョン |
|----------|------|-----------|
| Frontend | React | 18.x |
| ビルド | Vite | 6.x |
| CSS | Tailwind CSS | 3.x |
| 状態管理 | Zustand | 5.x |
| HTTP | Axios | 1.x |
| Backend | Express | 4.x |
| ORM | Prisma | 6.x |
| 認証 | jsonwebtoken + bcryptjs | - |
| バリデーション | zod | 3.x |
| API docs | swagger-jsdoc + swagger-ui-express | - |
| DB | PostgreSQL | 16 |
| コンテナ | Docker Compose | - |
| パッケージ | pnpm | 10.x |
