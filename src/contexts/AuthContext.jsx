import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ao abrir o site, verifica se já tem dados salvos
    const storagedUser = localStorage.getItem('@CallQuality:user');
    const storagedToken = localStorage.getItem('@CallQuality:token');

    if (storagedUser && storagedToken) {
      setUser(JSON.parse(storagedUser));
    }
    setLoading(false);
  }, []);

  async function signIn({ email, senha }) {
    try {
      const response = await api.post('/auth/login', { email, senha });

      const { token, nome, perfil } = response.data;

      // Salva no navegador para não perder ao dar F5
      localStorage.setItem('@CallQuality:token', token);
      localStorage.setItem('@CallQuality:user', JSON.stringify({ nome, perfil }));

      setUser({ nome, perfil });
      return true; // Login sucesso
    } catch (error) {
      console.error(error);
      return false; // Login falhou
    }
  }

  function signOut() {
    localStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
