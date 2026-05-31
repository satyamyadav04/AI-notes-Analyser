import { createContext, useEffect, useMemo, useState } from "react";

import api from "../services/api";

const AuthContext = createContext(null);

const storageKey = "ai-notes-analyzer-auth";

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : { user: null, token: null };
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      if (!auth.token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        setAuth((current) => ({ ...current, user: data.user }));
      } catch (_error) {
        localStorage.removeItem(storageKey);
        setAuth({ user: null, token: null });
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, [auth.token]);

  const saveAuth = (payload) => {
    setAuth(payload);
    localStorage.setItem(storageKey, JSON.stringify(payload));
  };

  const logout = () => {
    setAuth({ user: null, token: null });
    localStorage.removeItem(storageKey);
  };

  const value = useMemo(
    () => ({
      ...auth,
      loading,
      saveAuth,
      logout,
      isAuthenticated: Boolean(auth.token),
    }),
    [auth, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
