import { useState } from 'react';
import { TabelaLigacoes } from '../components/TabelaLigacoes';
import { Filter, Download, Calendar } from 'lucide-react';

export function Ligacoes() {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroSentimento, setFiltroSentimento] = useState('');

  // Novos Filtros de Data
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const handleExport = () => {
    alert("Funcionalidade de Exportar CSV será implementada em breve!");
  };

  return (
    <div className="p-8 animate-fade-in">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Histórico de Chamadas</h2>
          <p className="text-secondary">Consulte e filtre todas as interações registradas.</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 text-primary border border-primary/20 bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
        >
          <Download size={16} /> Exportar Relatório
        </button>
      </header>

      {/* Área de Filtros */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 mb-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-slate-500 border-b border-slate-100 pb-2">
          <Filter size={16} />
          <span className="text-xs font-bold uppercase tracking-wide">Filtros Avançados</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* 1. Busca Textual */}
          <div className="md:col-span-4">
            <label className="block text-xs font-medium text-slate-500 mb-1">Busca Rápida</label>
            <input
              type="text"
              placeholder="Nome, Cliente ou ID..."
              className="w-full p-2.5 border rounded-lg border-slate-300 outline-primary text-sm transition focus:ring-2 focus:ring-primary/20"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          {/* 2. Status */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
            <select
              className="w-full p-2.5 border rounded-lg border-slate-300 outline-primary text-sm bg-white text-slate-600"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="CONCLUIDO">Concluído</option>
              <option value="PENDENTE">Pendente</option>
              <option value="ERRO">Erro</option>
            </select>
          </div>

          {/* 3. Sentimento */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-500 mb-1">Sentimento</label>
            <select
              className="w-full p-2.5 border rounded-lg border-slate-300 outline-primary text-sm bg-white text-slate-600"
              value={filtroSentimento}
              onChange={(e) => setFiltroSentimento(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="POSITIVO">Positivo</option>
              <option value="NEUTRO">Neutro</option>
              <option value="NEGATIVO">Negativo</option>
            </select>
          </div>

          {/* 4. Data Início */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-500 mb-1">De</label>
            <div className="relative">
              <input
                type="date"
                className="w-full p-2.5 border rounded-lg border-slate-300 outline-primary text-sm text-slate-600"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>
          </div>

          {/* 5. Data Fim */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-500 mb-1">Até</label>
            <input
              type="date"
              className="w-full p-2.5 border rounded-lg border-slate-300 outline-primary text-sm text-slate-600"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tabela com as novas props */}
      <TabelaLigacoes
        filtroTexto={busca}
        filtroStatus={filtroStatus}
        filtroSentimento={filtroSentimento}
        dataInicio={dataInicio}
        dataFim={dataFim}
      />
    </div>
  );
}
