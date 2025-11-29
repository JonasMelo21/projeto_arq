import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Calendar, CheckCircle, ArrowLeft, AlertTriangle, Car as CarIcon, Gauge } from "lucide-react";

export default function Booking() {
  const { id } = useParams(); // ID do Veículo vindo da URL
  const navigate = useNavigate();
  
  // Estado
  const [dates, setDates] = useState({ start: "", end: "" });
  const [payment, setPayment] = useState("CREDITO");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [vehicle, setVehicle] = useState<any>(null); // Estado para guardar info do carro

  // 1. Carregar usuário e dados do carro ao iniciar
  useEffect(() => {
    const loadData = async () => {
        // Usuário
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          alert("Você precisa estar logado para alugar!");
          navigate('/login');
          return;
        }

        // Carro (Para pegar a KM atual)
        try {
            const res = await axios.get(`http://localhost:3002/veiculos/${id}`);
            setVehicle(res.data);
        } catch (err) {
            console.error("Erro ao carregar veículo", err);
            setError("Erro ao carregar dados do veículo. Tente novamente.");
        }
    };
    loadData();
  }, [id, navigate]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!user || !user.idString) {
        setError("Erro de sessão. Faça login novamente.");
        setLoading(false);
        return;
    }

    if (!vehicle) {
        setError("Dados do veículo não carregados.");
        setLoading(false);
        return;
    }

    // Validação básica de datas
    if (new Date(dates.start) >= new Date(dates.end)) {
        setError("A data de devolução deve ser posterior à retirada.");
        setLoading(false);
        return;
    }

    try {
      // Chama o Rental Service
      await axios.post('http://localhost:3003/locacoes', {
        clienteId: user.idString,
        veiculoId: id,
        dataInicio: new Date(dates.start).toISOString(),
        dataFimPrevisto: new Date(dates.end).toISOString(),
        
        // CORREÇÃO CRÍTICA: Usa a KM real do carro vinda do Fleet Service
        kmInicial: Number(vehicle.quilometragem), 
        
        formaPagamento: payment
      });

      alert("Locação realizada com sucesso!");
      navigate("/");
      
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Erro ao realizar locação. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user || !vehicle) return <div className="p-10 text-center">Carregando reserva...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        
        <div className="bg-[#003366] p-6 text-white flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Confirmar Reserva</h1>
            <p className="text-blue-200 text-sm">Olá, {user.nome}. Você está alugando: {vehicle.modelo}</p>
          </div>
          <Calendar className="w-8 h-8 opacity-50" />
        </div>

        <div className="p-8">
          <Link to="/" className="text-sm text-slate-500 hover:text-blue-600 mb-6 inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Voltar ao Catálogo
          </Link>

          <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <CarIcon className="text-[#003366]" />
                <div>
                    <p className="font-bold text-[#003366]">{vehicle.marca} {vehicle.modelo}</p>
                    <p className="text-xs text-blue-600">{vehicle.placa}</p>
                </div>
             </div>
             <div className="text-right">
                <div className="flex items-center gap-1 text-slate-600 text-sm">
                    <Gauge className="w-4 h-4" />
                    <span>KM Atual: <strong>{vehicle.quilometragem}</strong></span>
                </div>
             </div>
          </div>

          <form onSubmit={handleBooking} className="space-y-6">
            
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-start gap-3 animate-pulse">
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