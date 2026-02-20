# フェーズ1: プロジェクト基盤 - 実装手順書

## 1. Docker環境構築

### 1.1 ルートファイル作成
- `.env.example` - 環境変数テンプレート（DB接続、JWT秘密鍵、ポート設定）
- `docker-compose.yml` - 3サービス構成（db, backend, frontend）
- `.env` - `.env.example`をコピーして作成（git管理外）

### 1.2 Dockerfile
- `backend/Dockerfile` - Node 20 Alpine, pnpm, Prisma generate, ts-node-dev
- `frontend/Dockerfile` - Node 20 Alpine, pnpm, Vite dev server
- `backend/.dockerignore` / `frontend/.dockerignore` - node_modules, dist除外

### 1.3 起動確認
```bash
cp .env.example .env
docker-compose up --build
```
- db: PostgreSQL 16 (port 5432)
- backend: Express (port 3001)
- frontend: Vite (port 5173)

## 2. Backend実装（クリーンアーキテクチャ）

### 2.1 パッケージ設定
- `backend/package.json` - 依存関係定義
- `backend/tsconfig.json` - TypeScript strict mode, パスエイリアス

### 2.2 Prismaスキーマ
- `backend/prisma/schema.prisma` - Userモデル定義
- マイグレーション: `docker-compose exec backend pnpm prisma migrate dev --name init`

### 2.3 ドメイン層 (`src/domain/`)
- `entities/User.ts` - Userエンティティ型定義
- `repositories/IUserRepository.ts` - リポジトリインターフェース

### 2.4 アプリケーション層 (`src/application/`)
- `interfaces/IPasswordHasher.ts` - パスワードハッシュインターフェース
- `interfaces/ITokenService.ts` - JWT トークンインターフェース
- `usecases/RegisterUser.ts` - ユーザー登録ユースケース
- `usecases/LoginUser.ts` - ログインユースケース
- `usecases/GetCurrentUser.ts` - 現在のユーザー取得ユースケース

### 2.5 インフラ層 (`src/infrastructure/`)
- `repositories/PrismaUserRepository.ts` - Prisma実装
- `services/BcryptPasswordHasher.ts` - bcrypt実装（salt rounds=12）
- `services/JwtTokenService.ts` - JWT実装（有効期限24h）
- `config/env.ts` - 環境変数読み込み
- `config/swagger.ts` - OpenAPI仕様定義

### 2.6 プレゼンテーション層 (`src/presentation/`)
- `middleware/authMiddleware.ts` - JWT認証ミドルウェア
- `middleware/errorHandler.ts` - グローバルエラーハンドラ
- `middleware/validate.ts` - zodバリデーションミドルウェア
- `controllers/AuthController.ts` - 認証コントローラー
- `routes/auth.routes.ts` - 認証ルート + Swaggerドキュメント

### 2.7 エントリーポイント
- `src/index.ts` - Express起動、DI（依存注入）構築

## 3. Frontend実装

### 3.1 パッケージ設定
- `frontend/package.json` - React, Vite, Tailwind等
- `frontend/tsconfig.json` - TypeScript strict mode
- `frontend/vite.config.ts` - Vite設定（パスエイリアス）
- `frontend/tailwind.config.js` - Tailwind設定
- `frontend/postcss.config.js` - PostCSS設定

### 3.2 API層
- `src/api/client.ts` - Axios + JWT interceptor
- `src/api/auth.ts` - 認証API関数

### 3.3 状態管理
- `src/store/authStore.ts` - Zustand認証ストア

### 3.4 コンポーネント
- `src/components/auth/LoginForm.tsx` - ログインフォーム
- `src/components/auth/RegisterForm.tsx` - 登録フォーム
- `src/components/layout/ProtectedRoute.tsx` - 認証ガード

### 3.5 ページ
- `src/pages/LoginPage.tsx` - ログインページ
- `src/pages/RegisterPage.tsx` - 登録ページ
- `src/pages/DashboardPage.tsx` - ダッシュボード（仮）

### 3.6 ルーティング
- `src/App.tsx` - React Router設定

## 4. コード品質

### 4.1 ESLint + Prettier
- `backend/eslint.config.js` - TypeScript ESLint + Prettier
- `frontend/eslint.config.js` - TypeScript ESLint + React hooks + Prettier
- `backend/.prettierrc` / `frontend/.prettierrc` - Prettier設定

### 4.2 Husky + lint-staged
- `package.json`（ルート） - husky, lint-staged設定
- `.husky/pre-commit` - コミット前にlint-staged実行

## 5. 動作確認チェックリスト

- [x] `docker-compose up --build` で3サービス起動
- [x] `http://localhost:3001/api-docs` でSwagger UI表示
- [x] `POST /api/auth/register` でユーザー登録成功
- [x] `POST /api/auth/login` でJWTトークン取得成功
- [x] `GET /api/auth/me`（JWT付き）でユーザー情報取得成功
- [x] `http://localhost:5173` でフロントエンド表示
- [x] TypeScript型チェック通過（backend / frontend）
