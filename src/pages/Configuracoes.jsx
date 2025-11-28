import { useState, useEffect } from 'react';
import { Settings, Plus, Trash2, Save, Scale } from 'lucide-react';
import api from '../services/api';

export function Configuracoes() {
  const [criterios, setCriterios] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [novoCriterio, setNovoCriterio] = useState({
    descricao: '',
    instrucaoIa: '',
    peso: 1
  });
  const [isFormOpen, setIsFormOpen] = useState(false);

  const carregarCriterios = async () => {
    try {
      const res = await api.get('/criterios');
      setCriterios(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar critérios:", error);
      setLoading(false);
    }
  };

  useEffect(() => { carregarCriterios(); }, []);

  const handleSalvar = async (e) => {
    e.preventDefault();
    try {
        await api.post('/criterios', novoCriterio);
        alert('Critério criado com sucesso!');
        setNovoCriterio({ descricao: '', instrucaoIa: '', peso: 1 });
        setIsFormOpen(false);
        carregarCriterios();
    } catch (error) {
        alert('Erro ao salvar. Verifique se você é ADMIN.');
    }
  };

  // --- NOVA FUNÇÃO DE EXCLUIR ---
  const handleExcluir = async (id) => {
    // 1. Confirmação visual
    if (!window.confirm("Tem certeza que deseja excluir este critério?")) return;

    try {
        // 2. Chamada para a API
        await api.delete(`/criterios/${id}`);
        
        // 3. Atualiza a tela removendo o item sem precisar recarregar tudo
        setCriterios(prev => prev.filter(c => c.id !== id));
        
    } catch (error) {
        console.error(error);
        alert("Erro ao excluir. Apenas ADMIN pode deletar ou o critério já foi usado.");
    }
  };

  return (
    <div className="p-8 animate-fade-in">
      <header className="mb-8 flex justify-between items-end">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Parâmetros de Qualidade</h2>
            <p className="text-secondary">Defina as regras e pesos que a IA utilizará nas avaliações.</p>
        </div>
        <button 
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition"
        >
            <Plus size={18} /> Novo Critério
        </button>
      </header>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8 animate-slide-in">
            <h3 className="font-bold text-slate-700 mb-4">Adicionar Nova Regra</h3>
            <form onSubmit={handleSalvar} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Nome do Critério</label>
                        <input 
                            type="text" 
                            required
                            placeholder="Ex: Proatividade"
                            className="w-full p-2 border rounded-lg border-slate-300 outline-primary"
                            value={novoCriterio.descricao}
                            onChange={e => setNovoCriterio({...novoCriterio, descricao: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Peso na Nota (1 a 5)</label>
                        <input 
                            type="number" 
                            min="1" max="5"
                            required
                            className="w-full p-2 border rounded-lg border-slate-300 outline-primary"
                            value={novoCriterio.peso}
                            onChange={e => setNovoCriterio({...novoCriterio, peso: parseInt(e.target.value)})}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Instrução para a IA (Prompt)</label>
                    <textarea 
                        required
                        placeholder="Explique para a IA o que ela deve procurar no texto..."
                        className="w-full p-2 border rounded-lg border-slate-300 outline-primary h-24"
                        value={novoCriterio.instrucaoIa}
                        onChange={e => setNovoCriterio({...novoCriterio, instrucaoIa: e.target.value})}
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <button 
                        type="button" 
                        onClick={() => setIsFormOpen(false)}
                        className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-sm"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Save size={16} /> Salvar Regra
                    </button>
                </div>
            </form>
        </div>
      )}

      {loading ? (
        <p className="text-center text-slate-400">Carregando parâmetros...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {criterios.map(crit => (
                <div key={crit.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition relative group">
                    <div className="flex justify-between items-start mb-3">
                        <div className="bg-blue-50 p-2.5 rounded-lg text-primary">
                            <Scale size={20} />
                        </div>
                        <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">
                            Peso {crit.peso}
                        </span>
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg mb-1">{crit.descricao}</h3>
                    <p className="text-sm text-slate-500 line-clamp-3 h-12">
                        {crit.instrucaoIa}
                    </p>
                    
                    {/* BOTÃO DE EXCLUIR AGORA FUNCIONAL */}
                    <button 
                        onClick={() => handleExcluir(crit.id)}
                        className="absolute top-4 right-4 text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                        title="Excluir Critério"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ))}
        </div>
      )}
    </div>
  );
}
