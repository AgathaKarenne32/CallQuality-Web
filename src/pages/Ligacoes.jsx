import { useState } from 'react';
import { TabelaLigacoes } from '../components/TabelaLigacoes';
import { Filter } from 'lucide-react';

export function Ligacoes() {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroSentimento, setFiltroSentimento] = useState('');

  return (
    <div className="p-8">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Histórico de Chamadas</h2>
        <p className="text-secondary">Consulte e filtre todas as interações registradas.</p>
      </header>

      {/* Área de Filtros (Grid) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2 text-slate-500">
            <Filter size={16} />
            <span className="text-xs font-bold uppercase tracking-wide">Filtros Avançados</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* 1. Busca por Texto (Ocupa metade da tela) */}
            <div className="md:col-span-6">
                <input 
                    type="text" 
                    placeholder="🔍 Buscar por cliente, analista ou ID..." 
                    className="w-full p-2.5 border rounded-lg border-slate-300 outline-primary text-sm"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />
            </div>

            {/* 2. Filtro de Status */}
            <div className="md:col-span-3">
                <select 
                    className="w-full p-2.5 border rounded-lg border-slate-300 outline-primary text-sm bg-white text-slate-600"
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                >
                    <option value="">Todos os Status</option>
                    <option value="CONCLUIDO">✅ Concluído</option>
                    <option value="PENDENTE">🕒 Pendente</option>
                    <option value="ERRO">❌ Erro</option>
                </select>
            </div>

            {/* 3. Filtro de Sentimento */}
            <div className="md:col-span-3">
                <select 
                    className="w-full p-2.5 border rounded-lg border-slate-300 outline-primary text-sm bg-white text-slate-600"
                    value={filtroSentimento}
                    onChange={(e) => setFiltroSentimento(e.target.value)}
                >
                    <option value="">Todos os Sentimentos</option>
                    <option value="POSITIVO">😀 Positivo</option>
                    <option value="NEUTRO">😐 Neutro</option>
                    <option value="NEGATIVO">😡 Negativo</option>
                </select>
            </div>
        </div>
      </div>

      {/* Passamos os 3 filtros para a tabela */}
      <TabelaLigacoes 
        filtroTexto={busca} 
        filtroStatus={filtroStatus} 
        filtroSentimento={filtroSentimento} 
      />
    </div>
  );
}
