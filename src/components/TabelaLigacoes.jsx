import { useEffect, useState } from 'react';
import { Play, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import api from '../services/api';

export function TabelaLigacoes({ filtroTexto = '', filtroStatus = '', filtroSentimento = '' }) {
  const [ligacoes, setLigacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
  }, []);

  // --- LÓGICA DE FILTRAGEM TURBINADA ---
  const dadosParaMostrar = ligacoes.filter(lig => {
    
    // 1. Verifica Texto (Busca Geral)
    const termo = filtroTexto.toLowerCase();
    const id = String(lig.id);
    const analista = lig.analista?.nome?.toLowerCase() || '';
    const cliente = lig.clienteIdentificador?.toLowerCase() || '';
    const matchesTexto = !filtroTexto || 
        id.includes(termo) || analista.includes(termo) || cliente.includes(termo);

    // 2. Verifica Status (Match Exato)
    const matchesStatus = !filtroStatus || lig.status === filtroStatus;

    // 3. Verifica Sentimento (Match Exato)
    const matchesSentimento = !filtroSentimento || lig.sentimento === filtroSentimento;

    // Só mostra se passar nas 3 condições (E)
    return matchesTexto && matchesStatus && matchesSentimento;
  });

  if (loading) return <div className="p-8 text-center text-slate-500">⏳ Carregando dados...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-bold text-slate-700">Últimas Interações</h3>
        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
          Exibindo {dadosParaMostrar.length} de {ligacoes.length}
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
          {dadosParaMostrar.length === 0 ? (
             <tr>
                <td colSpan="6" className="p-8 text-center text-slate-400">
                    Nenhum resultado encontrado para os filtros selecionados.
                </td>
             </tr>
          ) : dadosParaMostrar.map((lig) => (
            <tr key={lig.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-medium">#{lig.id}</td>
              <td className="px-6 py-4">{lig.analista ? lig.analista.nome : 'Sistema'}</td>
              <td className="px-6 py-4">{lig.clienteIdentificador || 'N/A'}</td>
              <td className="px-6 py-4"><StatusBadge status={lig.status} /></td>
              <td className="px-6 py-4"><SentimentoBadge sentimento={lig.sentimento} /></td>
              <td className="px-6 py-4 text-right">
                <button className="text-slate-400 hover:text-primary transition"><Play size={18} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    CONCLUIDO: 'bg-green-100 text-green-700',
    PENDENTE: 'bg-yellow-100 text-yellow-700',
    ERRO: 'bg-red-100 text-red-700',
    PROCESSANDO: 'bg-blue-100 text-blue-700'
  };
  const icons = {
    CONCLUIDO: <CheckCircle size={12} />,
    PENDENTE: <Clock size={12} />,
    ERRO: <AlertTriangle size={12} />,
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${styles[status] || 'bg-slate-100'}`}>
      {icons[status]} {status}
    </span>
  );
}

function SentimentoBadge({ sentimento }) {
  const styles = {
    POSITIVO: 'text-green-600 bg-green-50',
    NEGATIVO: 'text-red-600 bg-red-50',
    NEUTRO: 'text-slate-600 bg-slate-50'
  };
  return <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${styles[sentimento]}`}>{sentimento}</span>;
}
