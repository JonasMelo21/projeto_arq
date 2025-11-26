import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Calendar, CheckCircle, ArrowLeft, AlertTriangle } from "lucide-react";

export default function Booking() {
  const { id } = useParams(); // ID do Veículo
  const navigate = useNavigate();
  
  // Estado
  const [dates, setDates] = useState({ start: "", end: "" });
  const [payment, setPayment] = useState("CREDITO");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);

  // Carregar usuário logado ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      alert("Você precisa estar logado para alugar!");
      navigate('/login');
    }
  }, [navigate]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!user || !user.idString) {
        setError("Erro de sessão. Faça login novamente.");
        setLoading(false);
        return;
    }

    try {
      // Chama o Rental Service
      await axios.post('http://localhost:3003/locacoes', {
        clienteId: user.idString, // Usa o ID do usuário logado
        veiculoId: id,
        dataInicio: new Date(dates.start).toISOString(),
        dataFimPrevisto: new Date(dates.end).toISOString(),
        kmInicial: 0, // Em um sistema real, buscaríamos a KM atual do Fleet Service
        formaPagamento: payment
      });

      alert("Locação realizada com sucesso!");
      navigate("/");
      
    } catch (err: any) {
      console.error(err);
      // Exibe a mensagem de erro vinda do backend (ex: Regra violada)
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Erro ao realizar locação. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        
        <div className="bg-[#003366] p-6 text-white flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Confirmar Reserva</h1>
            <p className="text-blue-200 text-sm">Olá, {user.nome}. Finalize seu aluguel.</p>
          </div>
          <Calendar className="w-8 h-8 opacity-50" />
        </div>

        <div className="p-8">
          <Link to="/" className="text-sm text-slate-500 hover:text-blue-600 mb-6 inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Voltar ao Catálogo
          </Link>

          <form onSubmit={handleBooking} className="space-y-6">
            
            {/* Mensagem de Erro (Regra de Negócio) */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-start gap-3">
                    <AlertTriangle className="text-red-500 h-5 w-5 flex-shrink-0" />
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
            )}

            {/* Datas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Retirada</label>
                <input 
                  type="datetime-local" 
                  required
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] outline-none"
                  onChange={e => setDates({...dates, start: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Devolução Prevista</label>
                <input 
                  type="datetime-local" 
                  required
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] outline-none"
                  onChange={e => setDates({...dates, end: e.target.value})}
                />
              </div>
            </div>

            {/* Pagamento */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Forma de Pagamento</label>
              <div className="grid grid-cols-4 gap-2">
                {['CREDITO', 'DEBITO', 'PIX', 'DINHEIRO'].map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPayment(method)}
                    className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                      payment === method 
                        ? 'bg-[#003366] border-[#003366] text-white' 
                        : 'border-slate-200 text-slate-500 hover:border-blue-300'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Resumo */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-600">
                <p><strong>Veículo ID:</strong> {id}</p>
                <p><strong>Cliente:</strong> {user.email} ({user.role})</p>
                <p className="mt-2 text-xs text-gray-400">* Ao confirmar, você concorda com os termos de serviço.</p>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#003366] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#004080] transition-all shadow-lg shadow-blue-900/20 mt-4 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? "Processando..." : <><CheckCircle className="w-5 h-5" /> Confirmar Locação</>}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}