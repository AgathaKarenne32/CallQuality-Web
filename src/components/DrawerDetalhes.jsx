import { X, FileText, MessageSquare, CheckCircle, AlertTriangle, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../services/api';

export function DrawerDetalhes({ isOpen, onClose, ligacao }) {
  const [avaliacao, setAvaliacao] = useState(null);
  const [loading, setLoading] = useState(false);

  // Toda vez que abrir uma ligação diferente, busca os detalhes dela
  useEffect(() => {
    if (isOpen && ligacao) {
      setLoading(true);
      setAvaliacao(null); // Limpa o anterior

      // Busca todas as avaliações e filtra a correta (Estratégia MVP)
      api.get('/avaliacoes')
        .then(res => {
          // Encontra a avaliação que pertence a esta ligação
          const encontrada = res.data.find(av => av.ligacao?.id === ligacao.id);
          setAvaliacao(encontrada);
          setLoading(false);
        })
        .catch(err => {
          console.error("Erro ao buscar detalhes:", err);
          setLoading(false);
        });
    }
  }, [isOpen, ligacao]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Fundo escuro com blur (clique fecha) */}
      <div
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* A Gaveta Deslizante */}
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-slide-in">

        {/* Cabeçalho */}
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Detalhes da Chamada</h2>
            <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
              <span className="font-mono bg-white border px-1.5 rounded">#{ligacao?.id}</span>
              <span>•</span>
              <span>{ligacao?.clienteIdentificador}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition border border-transparent hover:border-slate-200">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">

          {/* 1. Transcrição (Sempre disponível se concluiu) */}
          <section>
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-3 uppercase tracking-wider">
              <MessageSquare size={16} className="text-primary" /> Transcrição do Áudio
            </h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-600 leading-relaxed max-h-60 overflow-y-auto">
              {ligacao?.transcricaoCompleta ? (
                <p className="whitespace-pre-wrap">{ligacao.transcricaoCompleta}</p>
              ) : (
                <p className="text-slate-400 italic">Transcrição indisponível ou em processamento...</p>
              )}
            </div>
          </section>

          {/* 2. Avaliação da IA */}
          <section>
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-3 uppercase tracking-wider">
              <FileText size={16} className="text-primary" /> Análise da IA
            </h3>

            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-xs text-slate-400">Carregando inteligência...</p>
              </div>
            ) : avaliacao ? (
              <div className="space-y-4">

                {/* Card da Nota */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100 flex justify-between items-center">
                  <div>
                    <p className="text-blue-900 font-medium text-sm">Score de Qualidade</p>
                    <p className="text-xs text-blue-600 mt-0.5">Gerado via GPT-4</p>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                    <span className="text-2xl font-bold text-blue-700">{avaliacao.notaFinal}</span>
                    <Star fill="#1d4ed8" className="text-blue-700" size={20} />
                  </div>
                </div>

                {/* Feedback Geral */}
                <div className="text-sm text-slate-600 italic bg-slate-50 p-4 rounded-lg border border-slate-100 border-l-4 border-l-primary">
                  "{avaliacao.feedbackGeral}"
                </div>

                {/* Checklist de Critérios */}
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-bold text-slate-400 uppercase">Critérios Avaliados</p>
                  {avaliacao.itens?.map((item) => (
                    <div key={item.id} className="flex justify-between items-start text-sm border-b border-slate-50 pb-3 last:border-0">
                      <div className="pr-4">
                        <span className="text-slate-700 font-medium block">{item.nomeCriterioSnapshot}</span>
                        <span className="text-xs text-slate-400">{item.justificativaIa}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {item.cumpriuRequisito ? (
                          <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                            <CheckCircle size={12} /> Sim
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                            <AlertTriangle size={12} /> Não
                          </span>
                        )}
                        <span className="font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded text-xs">
                          {item.notaAtribuida}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-400 text-sm">Ainda não há avaliação para esta chamada.</p>
                {ligacao?.status === 'PENDENTE' && <p className="text-xs text-yellow-600 mt-1">Aguarde o processamento.</p>}
              </div>
            )}
          </section>
        </div>

        {/* Rodapé da Gaveta */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
