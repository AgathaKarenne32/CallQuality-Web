import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Ligacoes } from './pages/Ligacoes';
import { Relatorios } from './pages/Relatorios';
import { Configuracoes } from './pages/Configuracoes';
import { Login } from './pages/Login';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { useContext } from 'react';

// Protege rota para estar logado
function PrivateRoute({ children }) {
  const { signed, loading } = useContext(AuthContext);
  if (loading) return <div className="h-screen flex items-center justify-center">Carregando...</div>;
  return signed ? children : <Navigate to="/login" />;
}

// Protege rota para ser ADMIN ou SUPERVISOR
function AdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return null;
  
  // Se não for chefe, manda pro início
  if (user?.perfil !== 'ADMIN' && user?.perfil !== 'SUPERVISOR') {
    return <Navigate to="/" />;
  }
  return children;
}

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
            <Route path="/login" element={<Login />} />

            <Route path="/" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
            <Route path="/ligacoes" element={<PrivateRoute><Layout><Ligacoes /></Layout></PrivateRoute>} />
            <Route path="/relatorios" element={<PrivateRoute><Layout><Relatorios /></Layout></PrivateRoute>} />
            
            {/* Rota Protegida por Perfil */}
            <Route path="/configuracoes" element={
                <PrivateRoute>
                    <AdminRoute>
                        <Layout><Configuracoes /></Layout>
                    </AdminRoute>
                </PrivateRoute>
            } />
          </Routes>
        </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
