import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Car, AlertCircle, ArrowLeft, Lock, Mail } from "lucide-react";
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Conecta com o Identity Service
      const response = await axios.post('http://localhost:3001/login', {
        email: email,
        senha: password
      });

      // Sucesso: Salva os dados do usuário no navegador
      const userData = response.data;
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Redireciona
      navigate('/');
      
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        setError("Email ou senha incorretos.");
      } else {
        setError("Erro de conexão com o servidor. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header Simplificado */}
      <header className="bg-white border-b border-slate-200 py-4">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-[#003366] font-bold text-xl">
            <div className="bg-[#003366] p-1.5 rounded-lg">
              <Car className="h-5 w-5 text-white" />
            </div>
            Full Stack Frotas
          </Link>
          <Link to="/" className="text-sm text-slate-500 hover:text-[#003366] flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Voltar para Home
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            
            <div className="p-8 text-center border-b border-slate-100 bg-slate-50/50">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Bem-vindo de volta</h1>
              <p className="text-slate-500 text-sm">Entre com suas credenciais para acessar o painel.</p>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Erro */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3 text-red-800 text-sm">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="email">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="seu@email.com"
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-slate-700" htmlFor="password">Senha</label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      id="password"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#003366] text-white py-2.5 rounded-lg font-semibold hover:bg-[#004080] transition-all shadow-lg shadow-blue-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  {isLoading ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> : "Entrar no Sistema"}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-slate-500">
                Não tem uma conta?{" "}
                <Link to="/signup" className="text-[#003366] font-semibold hover:underline">
                  Cadastre-se
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}