import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Lock, Mail, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Login() {
    const [email, setEmail] = useState('agatha@callquality.com'); // Já preenchido para facilitar
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const { signIn } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(false);

        const sucesso = await signIn({ email, senha });

        if (sucesso) {
            navigate('/'); // Manda para o Dashboard
        } else {
            setError(true);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-2">📞 CallQuality</h1>
                    <p className="text-slate-500">Faça login para acessar o sistema</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">E-mail Corporativo</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full pl-10 p-3 border rounded-lg outline-primary transition border-slate-300"
                                placeholder="seu@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Senha</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                            <input
                                type="password"
                                value={senha}
                                onChange={e => setSenha(e.target.value)}
                                className="w-full pl-10 p-3 border rounded-lg outline-primary transition border-slate-300"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center border border-red-100">
                            E-mail ou senha incorretos. <b></b>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition flex justify-center items-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Entrar na Plataforma'}
                    </button>
                </form>
            </div>
        </div>
    );
}
