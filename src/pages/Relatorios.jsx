import { useEffect, useState } from 'react';
import api from '../services/api';
import { FileText, Star } from 'lucide-react';

export function Relatorios() {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(true); // Novo estado para controle de load real

  useEffect(() => {
    api.get('/avaliacoes')
      .then(res => {
        setAvaliacoes(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar avaliações", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">⏳ Buscando relatórios no sistema...</div>;
  }

  return (
    <div className="p-8">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Relatórios de Qualidade</h2>
        <p className="text-secondary">Auditoria detalhada das notas atribuídas pela IA.</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {avaliacoes.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
                <p className="text-slate-400">Nenhum relatório de avaliação encontrado.</p>
                <p className="text-sm text-slate-300 mt-2">Faça o upload de uma nova ligação para gerar avaliações.</p>
            </div>
        ) : avaliacoes.map(aval => (
            <div key={aval.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg h-fit">
                            <FileText className="text-primary" size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-lg text-slate-800">Avaliação #{aval.id}</h3>
                                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                                    Origem: {aval.origemAvaliacao}
                                </span>
                            </div>
                            <p className="mt-2 text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                                "{aval.feedbackGeral}"
                            </p>
                        </div>
                    </div>
                    <div className="text-right min-w-[100px]">
                        <div className="flex items-center gap-1 text-yellow-500 justify-end">
                            <span className="text-3xl font-bold text-slate-800">{aval.notaFinal}</span>
                            <Star fill="currentColor" size={24}/>
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Nota Final</span>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}
