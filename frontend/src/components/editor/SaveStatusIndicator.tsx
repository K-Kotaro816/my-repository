import { useEffect, useState } from 'react';
import { useSaveStore } from '../../store/saveStore';

export function SaveStatusIndicator() {
  const { status, lastSavedAt } = useSaveStore();
  const [relativeTime, setRelativeTime] = useState('');

  useEffect(() => {
    if (!lastSavedAt) return;

    const update = () => {
      const diff = Math.floor((Date.now() - lastSavedAt.getTime()) / 1000);
      if (diff < 5) setRelativeTime('たった今');
      else if (diff < 60) setRelativeTime(`${diff}秒前`);
      else setRelativeTime(`${Math.floor(diff / 60)}分前`);
    };

    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, [lastSavedAt]);

  if (status === 'idle') return null;

  return (
    <span className="text-xs flex items-center gap-1">
      {status === 'saving' && <span className="text-gray-400 animate-pulse">保存中...</span>}
      {status === 'saved' && (
        <span className="text-green-500">
          &#10003; 保存済み {relativeTime && `(${relativeTime})`}
        </span>
      )}
      {status === 'error' && <span className="text-red-500">&#9888; 保存失敗</span>}
    </span>
  );
}
