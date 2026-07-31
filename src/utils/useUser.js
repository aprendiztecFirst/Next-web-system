import { useState, useEffect, useCallback } from 'react';

const useUser = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/session');
      if (!res.ok) {
        setData(null);
        return;
      }
      const session = await res.json();
      if (session && session.user) {
        setData(session.user);
      } else {
        setData(null);
      }
    } catch (err) {
      console.error("Erro ao verificar sessão do usuário:", err);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return {
    user: data,
    data,
    loading,
    refetch: fetchSession
  };
};

export { useUser };
export default useUser;