import { useState, useEffect } from 'react';
import { X, UploadCloud, CheckCircle, Loader2, AlertCircle, User } from 'lucide-react';
import api from '../services/api';

export function ModalUpload({ isOpen, onClose, onSuccess }) {
  const [arquivo, setArquivo] = useState(null);
  const [idAnalista, setIdAnalista] = useState('');
  const [analistas, setAnalistas] = useState([]); // Lista para o Dropdown
  const [status, setStatus] = useState('idle');
  const [mensagemErro, setMensagemErro] = useState('');

  // Carrega a lista de usuários quando o modal abre
  useEffect(() => {
    if (isOpen) {
      api.get('/usuarios')
        .then(res => {
          // Filtra apenas quem tem perfil ANALISTA (opcional, mas recomendado)
          const listaFiltrada = res.data.filter(u => u.perfil === 'ANALISTA');
          setAnalistas(listaFiltrada);
          // Seleciona o primeiro automaticamente se houver
          if (listaFiltrada.length > 0) setIdAnalista(listaFiltrada[0].id);
        })
        .catch(err => console.error("Erro ao buscar analistas:", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setArquivo(e.target.files[0]);
      if (status === 'error') setStatus('idle');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!arquivo || !idAnalista) return;

    setStatus('uploading');
    setMensagemErro('');

    const formData = new FormData();
    formData.append('arquivo', arquivo);
    formData.append('idAnalista', idAnalista);

    try {
      await api.post('/ligacoes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setStatus('success');

      setTimeout(() => {
        setStatus('idle');
        setArquivo(null);
        onSuccess();
        onClose();
      }, 1500);

    } catch (error) {
      console.error(error);
      setStatus('error');
      if (error.response) {
        if (error.response.status === 404) setMensagemErro("Analista não encontrado.");
        else setMensagemErro("Erro interno (" + error.response.status + ")");
      } else {
        setMensagemErro("Sem conexão com o Backend.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative m-4">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-slate-800 mb-1">Nova Auditoria</h2>
        <p className="text-sm text-slate-500 mb-6">Envie uma gravação para análise da IA.</p>

        {status === 'success' ? (
          <div className="py-10 flex flex-col items-center text-center animate-fade-in">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Upload Realizado!</h3>
            <p className="text-slate-500">A IA já começou a processar o arquivo.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* SELEÇÃO DE ANALISTA (Melhoria de UX) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Selecione o Analista</label>
              <div className="relative">
                <select
                  value={idAnalista}
                  onChange={e => setIdAnalista(e.target.value)}
                  className="w-full p-2.5 pl-10 border rounded-lg border-slate-300 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition appearance-none bg-white"
                  required
                >
                  {analistas.map(analista => (
                    <option key={analista.id} value={analista.id}>
                      {analista.nome} (ID: {analista.id})
                    </option>
                  ))}
                  {analistas.length === 0 && <option disabled>Carregando lista...</option>}
                </select>
                <User size={18} className="absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Área de Upload */}
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center text-center hover:bg-slate-50 transition cursor-pointer relative group">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-primary mb-3 group-hover:bg-blue-100 transition">
                <UploadCloud size={24} />
              </div>
              <p className="text-sm font-medium text-slate-700 truncate max-w-[200px]">
                {arquivo ? arquivo.name : "Clique ou arraste o áudio aqui"}
              </p>
              <p className="text-xs text-slate-400 mt-1">Suporta MP3, WAV, OGG</p>
            </div>

            <button
              type="submit"
              disabled={!arquivo || status === 'uploading'}
              className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === 'uploading' ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Enviando...
                </>
              ) : (
                'Iniciar Análise'
              )}
            </button>

            {status === 'error' && (
              <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 animate-shake">
                <AlertCircle size={16} />
                {mensagemErro}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
