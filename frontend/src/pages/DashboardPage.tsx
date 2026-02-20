import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export function DashboardPage() {
  const { user, checkAuth, logout } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">ルームレイアウトプランナー</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.displayName || user?.email}</span>
            <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-700">
              ログアウト
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">プロジェクト一覧</h2>
        <p className="text-gray-500">プロジェクトはまだありません。フェーズ2で実装予定です。</p>
      </main>
    </div>
  );
}
