import { useState, useEffect } from 'react';
import { User, Mail, Award, TrendingUp } from 'lucide-react';
import api from '../services/api';

export function MinhaEquipe() {
  const [equipe, setEquipe] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/usuarios/minha-equipe')
      .then(res => {
        setEquipe(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Carregando equipe...</div>;

  return (
    <div className="p-8 animate-fade-in">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Gestão de Equipe</h2>
        <p className="text-secondary">Acompanhe o desempenho dos seus liderados.</p>
      </header>

      {equipe.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
          <p className="text-slate-400">Você ainda não possui analistas vinculados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipe.map(analista => (
            <div key={analista.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition relative overflow-hidden group">
              {/* Barra decorativa */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold text-lg">
                  {analista.nome.charAt(0)}
                </div>
                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Ativo
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-800 mb-1">{analista.nome}</h3>

              <div className="space-y-2 mt-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Mail size={16} /> {analista.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <User size={16} /> ID: #{analista.id}
                </div>
              </div>

              {/* Área de Métricas (Simulada para visual) */}
              <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                    <Award size={12} /> Nota Média
                  </p>
                  <p className="text-xl font-bold text-slate-800">8.5</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                    <TrendingUp size={12} /> Produção
                  </p>
                  <p className="text-xl font-bold text-slate-800">124</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
