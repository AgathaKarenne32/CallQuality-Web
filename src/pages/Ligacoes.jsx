import { useState } from 'react';
import { TabelaLigacoes } from '../components/TabelaLigacoes';
import { Filter, Download, Calendar } from 'lucide-react';
import api from '../services/api';

export function Ligacoes() {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroSentimento, setFiltroSentimento] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [exportando, setExportando] = useState(false);

  // --- LÓGICA DE EXPORTAÇÃO CSV ---
  const handleExport = async () => {
    setExportando(true);
    try {
      // 1. Busca os dados mais recentes do backend
      const response = await api.get('/ligacoes');
      const dados = response.data;

      // 2. Cria o cabeçalho do CSV
      const headers = ["ID", "Analista", "Cliente", "Data", "Duração (s)", "Status", "Sentimento", "Transcrição"];

      // 3. Mapeia os dados para linhas
      const rows = dados.map(row => [
        row.id,
        row.analista ? row.analista.nome : 'N/A',
        row.clienteIdentificador,
        row.dataAtendimento,
        row.duracaoSegundos,
        row.status,
        row.sentimento,
        // Limpa quebras de linha da transcrição para não quebrar o CSV
        row.transcricaoCompleta ? `"${row.transcricaoCompleta.replace(/"/g, '""').substring(0, 100)}..."` : ""
      ]);

      // 4. Junta tudo em uma string
      const csvContent = [
        headers.join(','),
        ...rows.map(e => e.join(','))
      ].join('\n');

      // 5. Cria o arquivo Blob e dispara o download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `relatorio_ligacoes_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error("Erro ao exportar:", error);
      alert("Erro ao gerar relatório.");
    } finally {
      setExportando(false);
    }
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
          disabled={exportando}
          className="flex items-center gap-2 text-primary border border-primary/20 bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition disabled:opacity-50"
        >
          <Download size={16} />
          {exportando ? 'Gerando...' : 'Exportar CSV'}
        </button>
      </header>

      {/* Área de Filtros */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 mb-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-slate-500 border-b border-slate-100 pb-2">
          <Filter size={16} />
          <span className="text-xs font-bold uppercase tracking-wide">Filtros Avançados</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
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

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-500 mb-1">De</label>
            <input
              type="date"
              className="w-full p-2.5 border rounded-lg border-slate-300 outline-primary text-sm text-slate-600"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
          </div>

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
