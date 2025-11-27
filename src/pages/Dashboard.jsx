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

  // Estados dos KPIs (Agora com labels dinâmicas)
  const [kpis, setKpis] = useState({
    total: { valor: 0, subtexto: 'Carregando...' },
    media: { valor: '0.0', subtexto: 'Aguardando dados...' },
    alertas: { valor: 0, subtexto: '0% do total' }
  });

  const [dadosGrafico, setDadosGrafico] = useState([]);

  const carregarDados = async () => {
    try {
      // 1. Busca Ligações
      const resLigacoes = await api.get('/ligacoes');
      const lista = resLigacoes.data;
      const total = lista.length;
      
      // Cálculo de Sentimentos
      const positivos = lista.filter(l => l.sentimento === 'POSITIVO').length;
      const neutros = lista.filter(l => l.sentimento === 'NEUTRO').length;
      const negativos = lista.filter(l => l.sentimento === 'NEGATIVO').length;

      // KPI de Alertas (Cálculo de Porcentagem)
      const percNegativos = total > 0 ? ((negativos / total) * 100).toFixed(1) : 0;

      // Dados para o Gráfico
      setDadosGrafico([
        { name: 'Positivo', value: positivos, color: '#22c55e' },
        { name: 'Neutro', value: neutros, color: '#94a3b8' }, 
        { name: 'Crítico', value: negativos, color: '#ef4444' },
      ]);

      // 2. Busca Avaliações (Média)
      const resAvaliacoes = await api.get('/avaliacoes');
      const totalAvaliacoes = resAvaliacoes.data.length;
      const somaNotas = resAvaliacoes.data.reduce((acc, curr) => acc + (curr.notaFinal || 0), 0);
      const media = totalAvaliacoes > 0 ? (somaNotas / totalAvaliacoes).toFixed(1) : '0.0';

      // Atualiza os KPIs com Matemática Real
      setKpis({
        total: { 
            valor: total, 
            subtexto: 'Total acumulado' 
        },
        media: { 
            valor: media, 
            subtexto: `Baseado em ${totalAvaliacoes} avaliações` 
        },
        alertas: { 
            valor: negativos, 
            subtexto: `${percNegativos}% das chamadas` 
        }
      });

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

      {/* Grid de KPIs DINÂMICOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard 
            title="Total de Ligações" 
            value={kpis.total.valor} 
            change={kpis.total.subtexto} 
            icon={<PhoneCall size={24} className="text-blue-600"/>} 
            color="bg-blue-50" 
        />
        <KpiCard 
            title="Nota Média (IA)" 
            value={kpis.media.valor} 
            change={kpis.media.subtexto} 
            icon={<TrendingUp size={24} className="text-green-600"/>} 
            color="bg-green-50" 
        />
        <KpiCard 
            title="Alertas Críticos" 
            value={kpis.alertas.valor} 
            change={kpis.alertas.subtexto} 
            icon={<AlertCircle size={24} className="text-red-600"/>} 
            color="bg-red-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 h-full">
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
