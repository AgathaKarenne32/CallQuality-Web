import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Ligacoes } from './pages/Ligacoes';
import { Relatorios } from './pages/Relatorios';
import { Configuracoes } from './pages/Configuracoes';
import { Login } from './pages/Login'; // Importa Login
import { AuthProvider, AuthContext } from './contexts/AuthContext'; // Importa Contexto
import { useContext } from 'react';

// Componente que protege rotas
function PrivateRoute({ children }) {
  const { signed, loading } = useContext(AuthContext);

  if (loading) return <div className="h-screen flex items-center justify-center">Carregando...</div>;

  return signed ? children : <Navigate to="/login" />;
}

// Layout com Sidebar (só aparece se logado)
function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 bg-slate-50 min-h-screen">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rota Pública */}
          <Route path="/login" element={<Login />} />

          {/* Rotas Privadas (Protegidas) */}
          <Route path="/" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
          <Route path="/ligacoes" element={<PrivateRoute><Layout><Ligacoes /></Layout></PrivateRoute>} />
          <Route path="/relatorios" element={<PrivateRoute><Layout><Relatorios /></Layout></PrivateRoute>} />
          <Route path="/configuracoes" element={<PrivateRoute><Layout><Configuracoes /></Layout></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
