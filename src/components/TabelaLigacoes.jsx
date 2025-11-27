import { useEffect, useState } from 'react';
import { Play, Clock, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import api from '../services/api';

// Recebe a prop onVisualizar
export function TabelaLigacoes({ filtroTexto = '', filtroStatus = '', filtroSentimento = '', onVisualizar }) {
  const [ligacoes, setLigacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const buscarDados = () => {
    api.get('/ligacoes')
      .then(response => {
        setLigacoes(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro:", err);
        setError("Erro ao carregar dados.");
        setLoading(false);
      });
  };

  useEffect(() => {
    buscarDados();
    const interval = setInterval(buscarDados, 5000);
    return () => clearInterval(interval);
  }, []);

  const dadosParaMostrar = ligacoes.filter(lig => {
    const termo = filtroTexto.toLowerCase();
    const id = String(lig.id);
    const analista = lig.analista?.nome?.toLowerCase() || '';
    const cliente = lig.clienteIdentificador?.toLowerCase() || '';

    const matchesTexto = !filtroTexto ||
      id.includes(termo) || analista.includes(termo) || cliente.includes(termo);
    const matchesStatus = !filtroStatus || lig.status === filtroStatus;
    const matchesSentimento = !filtroSentimento || lig.sentimento === filtroSentimento;

    return matchesTexto && matchesStatus && matchesSentimento;
  });

  const dadosOrdenados = [...dadosParaMostrar].sort((a, b) => b.id - a.id);

  if (loading) return <div className="p-8 text-center text-slate-500">⏳ Carregando dados...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-bold text-slate-700">Últimas Interações</h3>
        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
          Exibindo {dadosOrdenados.length} de {ligacoes.length}
        </span>
      </div>

      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50 font-medium text-slate-900">
          <tr>
            <th className="px-6 py-4">ID</th>
            <th className="px-6 py-4">Analista</th>
            <th className="px-6 py-4">Cliente</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Sentimento</th>
            <th className="px-6 py-4 text-right">Ação</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {dadosOrdenados.length === 0 ? (
            <tr><td colSpan="6" className="p-8 text-center text-slate-400">Nenhum resultado.</td></tr>
          ) : dadosOrdenados.map((lig) => (
            <tr key={lig.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-medium">#{lig.id}</td>
              <td className="px-6 py-4">{lig.analista ? lig.analista.nome : 'Sistema'}</td>
              <td className="px-6 py-4">{lig.clienteIdentificador || 'N/A'}</td>
              <td className="px-6 py-4"><StatusBadge status={lig.status} /></td>
              <td className="px-6 py-4"><SentimentoBadge sentimento={lig.sentimento} /></td>
              <td className="px-6 py-4 text-right">
                {/* Botão Play agora chama a função! */}
                <button
                  onClick={() => onVisualizar && onVisualizar(lig)}
                  className="text-slate-400 hover:text-primary transition p-2 hover:bg-blue-50 rounded-full"
                  title="Ver Detalhes"
                >
                  <Play size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// (Badge components continuam iguais, omitidos para brevidade mas o comando vai sobrescrever e manter se o arquivo estiver limpo)
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
    NEUTRO: 'text-slate-600 bg-slate-50 border border-slate-100',
    MISTO: 'text-orange-600 bg-orange-50 border border-orange-100'
  };
  return <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${styles[sentimento] || styles.NEUTRO}`}>{sentimento}</span>;
}
