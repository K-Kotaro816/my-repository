import { useAuthStore } from '../../store/authStore';

interface HeaderProps {
  title?: string;
}

export function Header({ title = 'ルームレイアウトプランナー' }: HeaderProps) {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.displayName || user?.email}</span>
          <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-700">
            ログアウト
          </button>
        </div>
      </div>
    </header>
  );
}
