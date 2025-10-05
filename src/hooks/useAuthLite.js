import { useMemo } from 'react';

export function useAuthLite() {
  const user = useMemo(() => {
    try {
      const raw = localStorage.getItem('current_user');
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  }, []);
  return { user };
}

export default useAuthLite;


