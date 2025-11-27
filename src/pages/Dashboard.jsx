import { useState, useEffect } from 'react';
import api from '../services/api';
import { TabelaLigacoes } from '../components/TabelaLigacoes';
import { GraficoSentimentos } from '../components/GraficoSentimentos';
import { ModalUpload } from '../components/ModalUpload';
import { DrawerDetalhes } from '../components/DrawerDetalhes';
import { TrendingUp, AlertCircle, PhoneCall } from 'lucide-react';

export function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chamadaSelecionada, setChamadaSelecionada] = useState(null);

  // Estados de Dados
  const [kpis, setKpis] = useState({ totalLigacoes: 0, mediaNota: 0, alertasCriticos: 0 });
  const [dadosGrafico, setDadosGrafico] = useState([]);

  const carregarDados = async () => {
    try {
      // 1. Busca Ligações
      const resLigacoes = await api.get('/ligacoes');
      const lista = resLigacoes.data;

      // KPI: Totais
      const total = lista.length;
      const criticos = lista.filter(l => l.sentimento === 'NEGATIVO').length;

      // CÁLCULO PARA O GRÁFICO (Dinâmico)
      const positivos = lista.filter(l => l.sentimento === 'POSITIVO').length;
      const neutros = lista.filter(l => l.sentimento === 'NEUTRO').length;
      const negativos = lista.filter(l => l.sentimento === 'NEGATIVO').length; // ou Misto

      setDadosGrafico([
        { name: 'Positivo', value: positivos, color: '#22c55e' }, // Verde
        { name: 'Neutro', value: neutros, color: '#94a3b8' },    // Cinza
        { name: 'Crítico', value: negativos, color: '#ef4444' }, // Vermelho
      ]);

      // 2. Busca Avaliações (Para média)
      const resAvaliacoes = await api.get('/avaliacoes');
      const totalNotas = resAvaliacoes.data.reduce((acc, curr) => acc + (curr.notaFinal || 0), 0);
      const media = resAvaliacoes.data.length > 0
        ? (totalNotas / resAvaliacoes.data.length).toFixed(1)
        : '0.0';

      setKpis({ totalLigacoes: total, mediaNota: media, alertasCriticos: criticos });

    } catch (error) { console.error("Erro ao carregar dashboard:", error); }
  };

  useEffect(() => { carregarDados(); }, [refreshKey]);

  const handleUploadSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleAbrirDetalhes = (chamada) => {
    setChamadaSelecionada(chamada);
    setDrawerOpen(true);
  };

  return (
    <div className="p-8 animate-fade-in space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Visão Geral</h2>
          <p className="text-secondary">Acompanhe a qualidade do atendimento em tempo real.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-700 transition flex items-center gap-2"
        >
          + Nova Auditoria
        </button>
      </header>

      {/* KPIs Responsivos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard title="Total de Ligações" value={kpis.totalLigacoes} change="Registradas" icon={<PhoneCall size={24} className="text-blue-600" />} color="bg-blue-50" />
        <KpiCard title="Nota Média (IA)" value={kpis.mediaNota} change="Geral" icon={<TrendingUp size={24} className="text-green-600" />} color="bg-green-50" />
        <KpiCard title="Alertas Críticos" value={kpis.alertasCriticos} change="Negativos" icon={<AlertCircle size={24} className="text-red-600" />} color="bg-red-50" />
      </div>

      {/* Grid Principal Responsivo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 h-full">
          {/* Passamos os dados calculados para o gráfico */}
          <GraficoSentimentos dados={dadosGrafico} />
        </div>
        <div className="lg:col-span-2">
          <TabelaLigacoes key={refreshKey} onVisualizar={handleAbrirDetalhes} />
        </div>
      </div>

      <ModalUpload isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handleUploadSuccess} />
      <DrawerDetalhes isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} ligacao={chamadaSelecionada} />
    </div>
  );
}

function KpiCard({ title, value, change, icon, color }) {
  return (
    <div className="bg-surface p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
      </div>
      <h3 className="text-secondary text-sm font-medium mb-1">{title}</h3>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-slate-800">{value}</span>
        <span className="text-xs font-medium text-slate-400 mb-1.5">{change}</span>
      </div>
    </div>
  );
}
