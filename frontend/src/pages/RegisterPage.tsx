import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '../components/auth/RegisterForm';

export function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-100 mb-8">
          ルームレイアウトプランナー
        </h1>
        <div className="bg-gray-800 shadow-lg shadow-black/20 rounded-lg p-8">
          <RegisterForm onSuccess={() => navigate('/dashboard')} />
        </div>
      </div>
    </div>
  );
}
