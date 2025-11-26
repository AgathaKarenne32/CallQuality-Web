import { useState, useEffect } from 'react';
import api from '../services/api';
import { TabelaLigacoes } from '../components/TabelaLigacoes';
import { GraficoSentimentos } from '../components/GraficoSentimentos';
import { ModalUpload } from '../components/ModalUpload';
import { TrendingUp, AlertCircle, PhoneCall, Users } from 'lucide-react';

export function Dashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    // Estados para os números reais
    const [kpis, setKpis] = useState({
        totalLigacoes: 0,
        mediaNota: 0,
        alertasCriticos: 0
    });

    // Função para calcular os números baseados no Banco de Dados
    const calcularKpis = async () => {
        try {
            // 1. Busca todas as ligações
            const resLigacoes = await api.get('/ligacoes');
            const total = resLigacoes.data.length;

            // Conta quantos negativos (Alertas)
            const criticos = resLigacoes.data.filter(l => l.sentimento === 'NEGATIVO').length;

            // 2. Busca todas as avaliações para calcular a média
            const resAvaliacoes = await api.get('/avaliacoes');
            const totalNotas = resAvaliacoes.data.reduce((acc, curr) => acc + (curr.notaFinal || 0), 0);
            const media = resAvaliacoes.data.length > 0
                ? (totalNotas / resAvaliacoes.data.length).toFixed(1)
                : '0.0';

            setKpis({
                totalLigacoes: total,
                mediaNota: media,
                alertasCriticos: criticos
            });

        } catch (error) {
            console.error("Erro ao calcular KPIs:", error);
        }
    };

    useEffect(() => {
        calcularKpis();
    }, [refreshKey]); // Recalcula sempre que fizer upload

    const handleUploadSuccess = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="p-8 animate-fade-in">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Visão Geral</h2>
                    <p className="text-secondary">Dados em tempo real da operação.</p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-700 transition flex items-center gap-2"
                >
                    + Nova Auditoria
                </button>
            </header>

            {/* Grid de KPIs REAIS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <KpiCard
                    title="Total de Ligações"
                    value={kpis.totalLigacoes}
                    change="Registradas no banco"
                    icon={<PhoneCall size={24} className="text-blue-600" />}
                    color="bg-blue-50"
                />
                <KpiCard
                    title="Nota Média (IA)"
                    value={kpis.mediaNota}
                    change="Baseada nas avaliações"
                    icon={<TrendingUp size={24} className="text-green-600" />}
                    color="bg-green-50"
                />
                <KpiCard
                    title="Alertas Críticos"
                    value={kpis.alertasCriticos}
                    change="Sentimento Negativo"
                    icon={<AlertCircle size={24} className="text-red-600" />}
                    color="bg-red-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-1">
                    <GraficoSentimentos />
                </div>
                <div className="lg:col-span-2">
                    <TabelaLigacoes key={refreshKey} />
                </div>
            </div>

            <ModalUpload
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleUploadSuccess}
            />
        </div>
    );
}

function KpiCard({ title, value, change, icon, color }) {
    return (
        <div className="bg-surface p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${color}`}>
                    {icon}
                </div>
            </div>
            <h3 className="text-secondary text-sm font-medium mb-1">{title}</h3>
            <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-slate-800">{value}</span>
                <span className="text-xs font-medium text-slate-400 mb-1.5">{change}</span>
            </div>
        </div>
    );
}
