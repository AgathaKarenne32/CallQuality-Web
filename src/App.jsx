import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Ligacoes } from './pages/Ligacoes';
import { Relatorios } from './pages/Relatorios';
import { Configuracoes } from './pages/Configuracoes'; // <--- Importamos

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-background">
        <Sidebar />

        {/* Área Principal */}
        <main className="flex-1 ml-64 bg-slate-50 min-h-screen">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ligacoes" element={<Ligacoes />} />
            <Route path="/relatorios" element={<Relatorios />} />
            {/* Nova Rota */}
            <Route path="/configuracoes" element={<Configuracoes />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
