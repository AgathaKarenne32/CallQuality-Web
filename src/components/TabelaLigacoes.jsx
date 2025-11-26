import { useEffect, useState } from 'react';
import { Play, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import api from '../services/api';

export function TabelaLigacoes() {
    const [ligacoes, setLigacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("🚀 Iniciando busca de ligações...");

        api.get('/ligacoes')
            .then(response => {
                console.log("✅ Sucesso! Dados recebidos:", response.data);
                setLigacoes(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("❌ ERRO DETALHADO:", err);
                // Tenta mostrar a mensagem exata do erro
                if (err.code === "ERR_NETWORK") {
                    setError("Erro de Conexão: O Frontend não alcançou o Backend.");
                } else {
                    setError("Erro: " + err.message);
                }
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-8 text-center text-secondary">⏳ Tentando conectar ao servidor...</div>;

    if (error) return (
        <div className="p-8 text-center bg-red-50 rounded-lg border border-red-100">
            <p className="text-red-600 font-bold">{error}</p>
            <p className="text-xs text-red-400 mt-2">Abra o Console (F12) para ver detalhes.</p>
        </div>
    );

    return (
        <div className="bg-surface rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-700">Últimas Interações</h3>
                <span className="text-xs text-secondary bg-slate-100 px-2 py-1 rounded-full">
                    {ligacoes.length} registros
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
                    {ligacoes.map((lig) => (
                        <tr key={lig.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium">#{lig.id}</td>
                            <td className="px-6 py-4">{lig.analista ? lig.analista.nome : 'Sistema'}</td>
                            <td className="px-6 py-4">{lig.clienteIdentificador || 'N/A'}</td>
                            <td className="px-6 py-4">
                                <StatusBadge status={lig.status} />
                            </td>
                            <td className="px-6 py-4">
                                <SentimentoBadge sentimento={lig.sentimento} />
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-slate-400 hover:text-primary transition">
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
    const style = styles[status] || 'bg-slate-100 text-slate-600';
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${style}`}>
            {icons[status]} {status}
        </span>
    );
}

function SentimentoBadge({ sentimento }) {
    const styles = {
        POSITIVO: 'text-green-600 bg-green-50',
        NEGATIVO: 'text-red-600 bg-red-50',
        NEUTRO: 'text-slate-600 bg-slate-50',
        MISTO: 'text-orange-600 bg-orange-50'
    };
    return (
        <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${styles[sentimento] || styles.NEUTRO}`}>
            {sentimento}
        </span>
    );
}
