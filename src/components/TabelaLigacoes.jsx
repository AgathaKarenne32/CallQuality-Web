import { useEffect, useState } from 'react';
import { Play, Clock, CheckCircle, AlertTriangle, Loader2, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';

export function TabelaLigacoes({
  filtroTexto = '',
  filtroStatus = '',
  filtroSentimento = '',
  onVisualizar,
  dataInicio = '',
  dataFim = ''
}) {
  const [ligacoes, setLigacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const ITENS_POR_PAGINA = 7;

  const buscarDados = () => {
    api.get('/ligacoes')
      .then(response => {
        setLigacoes(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    buscarDados();
    const interval = setInterval(buscarDados, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- FORMATAÇÃO ---
  const formatarData = (dataString) => {
    if (!dataString) return '-';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatarDuracao = (segundos) => {
    if (!segundos) return '-';
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${min}:${seg.toString().padStart(2, '0')}`;
  };

  // --- FILTRAGEM ---
  const dadosFiltrados = ligacoes.filter(lig => {
    const termo = filtroTexto.toLowerCase();
    const id = String(lig.id);
    const analista = lig.analista?.nome?.toLowerCase() || '';
    const cliente = lig.clienteIdentificador?.toLowerCase() || '';

    // Filtros Básicos
    const matchTexto = !filtroTexto || id.includes(termo) || analista.includes(termo) || cliente.includes(termo);
    const matchStatus = !filtroStatus || lig.status === filtroStatus;
    const matchSentimento = !filtroSentimento || lig.sentimento === filtroSentimento;

    // Filtro de Data
    let matchData = true;
    if (lig.dataAtendimento) {
      const dataLigacao = new Date(lig.dataAtendimento).toISOString().split('T')[0];
      if (dataInicio && dataLigacao < dataInicio) matchData = false;
      if (dataFim && dataLigacao > dataFim) matchData = false;
    }

    return matchTexto && matchStatus && matchSentimento && matchData;
  });

  // Ordenação (Mais recente primeiro)
  const dadosOrdenados = [...dadosFiltrados].sort((a, b) => b.id - a.id);

  // --- PAGINAÇÃO ---
  const totalPaginas = Math.ceil(dadosOrdenados.length / ITENS_POR_PAGINA);
  const indiceInicial = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const dadosPaginados = dadosOrdenados.slice(indiceInicial, indiceInicial + ITENS_POR_PAGINA);

  // Reseta página se filtro mudar
  useEffect(() => { setPaginaAtual(1); }, [filtroTexto, filtroStatus, filtroSentimento, dataInicio, dataFim]);

  if (loading) return <div className="p-8 text-center text-slate-500">⏳ Carregando dados...</div>;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
        <h3 className="font-bold text-slate-700">Registros</h3>
        <span className="text-xs text-slate-500 bg-white border px-2 py-1 rounded-full shadow-sm">
          Total: {dadosOrdenados.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 font-semibold text-slate-700 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4">Data / ID</th>
              <th className="px-6 py-4">Analista</th>
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4 text-center">Duração</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Sentimento</th>
              <th className="px-6 py-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {dadosPaginados.length === 0 ? (
              <tr><td colSpan="7" className="p-8 text-center text-slate-400 italic">Nenhum resultado encontrado.</td></tr>
            ) : dadosPaginados.map((lig) => (
              <tr key={lig.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">#{lig.id}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Calendar size={10} /> {formatarData(lig.dataAtendimento)}
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-slate-700">{lig.analista ? lig.analista.nome : 'Sistema'}</td>
                <td className="px-6 py-4">{lig.clienteIdentificador || 'N/A'}</td>
                <td className="px-6 py-4 text-center font-mono text-slate-500 bg-slate-50 rounded mx-auto w-fit px-2">
                  {formatarDuracao(lig.duracaoSegundos)}
                </td>
                <td className="px-6 py-4"><StatusBadge status={lig.status} /></td>
                <td className="px-6 py-4"><SentimentoBadge sentimento={lig.sentimento} /></td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onVisualizar && onVisualizar(lig)}
                    className="text-slate-400 hover:text-primary hover:bg-blue-100 p-2 rounded-full transition group-hover:text-primary"
                    title="Ver Detalhes"
                  >
                    <Play size={18} fill="currentColor" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Play size={18} className="opacity-100 group-hover:opacity-0 absolute transition-opacity" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINAÇÃO (Rodapé) */}
      {totalPaginas > 1 && (
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
          <button
            onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
            disabled={paginaAtual === 1}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} /> Anterior
          </button>

          <span className="text-xs font-medium text-slate-500">
            Página {paginaAtual} de {totalPaginas}
          </span>

          <button
            onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
            disabled={paginaAtual === totalPaginas}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próximo <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

// (Manter os Badges iguais - Omitidos para economizar espaço, mas eles já estão no arquivo)
function StatusBadge({ status }) {
  const styles = {
    CONCLUIDO: 'bg-green-100 text-green-700 border border-green-200',
    PENDENTE: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    ERRO: 'bg-red-50 text-red-700 border border-red-200',
    TRANSCRICAO_EM_ANDAMENTO: 'bg-blue-50 text-blue-700 border border-blue-200',
    ANALISE_IA_EM_ANDAMENTO: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  };
  const icons = {
    CONCLUIDO: <CheckCircle size={12} />,
    PENDENTE: <Clock size={12} />,
    ERRO: <AlertTriangle size={12} />,
    TRANSCRICAO_EM_ANDAMENTO: <Loader2 size={12} className="animate-spin" />,
    ANALISE_IA_EM_ANDAMENTO: <Loader2 size={12} className="animate-spin" />,
  };
  const labels = {
    TRANSCRICAO_EM_ANDAMENTO: 'Transcrevendo...',
    ANALISE_IA_EM_ANDAMENTO: 'IA Analisando...',
  };
  const style = styles[status] || 'bg-slate-100 text-slate-600';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${style}`}>
      {icons[status] || <Clock size={12} />} {labels[status] || status}
    </span>
  );
}

function SentimentoBadge({ sentimento }) {
  const styles = {
    POSITIVO: 'text-green-600 bg-green-50 border border-green-100',
    NEGATIVO: 'text-red-600 bg-red-50 border border-red-100',
    NEUTRO: 'text-slate-600 bg-slate-50 border border-slate-100'
  };
  return <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${styles[sentimento] || styles.NEUTRO}`}>{sentimento}</span>;
}
