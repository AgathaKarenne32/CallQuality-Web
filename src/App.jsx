import { Sidebar } from './components/Sidebar';
import { TabelaLigacoes } from './components/TabelaLigacoes';
import { TrendingUp, AlertCircle, PhoneCall } from 'lucide-react';

function App() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Visão Geral</h2>
            <p className="text-secondary">Acompanhe a qualidade do atendimento em tempo real.</p>
          </div>
          <button className="bg-primary text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-700 transition">
            + Nova Auditoria
          </button>
        </header>

        {/* Grid de KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <KpiCard 
            title="Total de Ligações" 
            value="124" 
            change="+12% hoje"
            icon={<PhoneCall size={24} className="text-blue-600"/>} 
            color="bg-blue-50"
          />
          <KpiCard 
            title="Nota Média (IA)" 
            value="8.5" 
            change="Estável"
            icon={<TrendingUp size={24} className="text-green-600"/>} 
            color="bg-green-50"
          />
          <KpiCard 
            title="Alertas Críticos" 
            value="2" 
            change="Requer atenção"
            icon={<AlertCircle size={24} className="text-red-600"/>} 
            color="bg-red-50"
          />
        </div>

        {/* AQUI ESTÁ A MUDANÇA: Trocamos o texto pelo Componente Real */}
        <TabelaLigacoes />
        
      </main>
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
        <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full">Hoje</span>
      </div>
      <h3 className="text-secondary text-sm font-medium mb-1">{title}</h3>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-slate-800">{value}</span>
        <span className="text-xs font-medium text-emerald-600 mb-1.5">{change}</span>
      </div>
    </div>
  );
}

export default App;
