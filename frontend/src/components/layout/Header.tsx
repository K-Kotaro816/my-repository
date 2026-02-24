import { useAuthStore } from '../../store/authStore';

interface HeaderProps {
  title?: string;
}

export function Header({ title = 'ルームレイアウトプランナー' }: HeaderProps) {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-gray-800 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-100">{title}</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{user?.displayName || user?.email}</span>
          <button onClick={logout} className="text-sm text-gray-400 hover:text-gray-200">
            ログアウト
          </button>
        </div>
      </div>
    </header>
  );
}
