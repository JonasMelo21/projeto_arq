import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, CheckCircle, Clock, MapPin, Car, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyRentals() {
  const [rentals, setRentals] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return;
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      try {
        // 1. Busca todas as locações
        const resRentals = await axios.get('http://localhost:3003/locacoes');
        
        // Filtra no front apenas as do usuário logado
        const myRentals = resRentals.data.filter((r: any) => r.clienteId === parsedUser.idString);
        setRentals(myRentals);

        // 2. CORREÇÃO DO ERRO TS2802:
        // Substituimos o [...new Set()] por .filter para garantir compatibilidade sem alterar tsconfig
        const allIds = myRentals.map((r: any) => r.veiculoId);
        const vehicleIds = allIds.filter((id: string, index: number, self: string[]) => 
            self.indexOf(id) === index
        );
        
        const vehiclesMap: Record<string, any> = {};
        
        await Promise.all(vehicleIds.map(async (vId: string) => {
            try {
                // @ts-ignore
                const res = await axios.get(`http://localhost:3002/veiculos/${vId}`);
                // @ts-ignore
                vehiclesMap[vId] = res.data;
            } catch (e) { console.error("Erro carro", vId); }
        }));
        
        setVehicles(vehiclesMap);

      } catch (error) {
        console.error("Erro ao carregar locações", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleReturn = async (rentalId: string, currentKm: number) => {
    // Pergunta simples para simular input de KM
    const kmInput = prompt("Qual a quilometragem atual do veículo no painel?", String(currentKm + 100));
    if (!kmInput) return;

    try {
        await axios.put(`http://localhost:3003/locacoes/${rentalId}/finalizar`, {
            kmFinal: Number(kmInput)
        });
        alert("Veículo devolvido com sucesso! Valor calculado.");
        window.location.reload(); // Recarrega para atualizar status
    } catch (error) {
        alert("Erro ao devolver veículo.");
        console.error(error);
    }
  };

  if (loading) return <div className="p-10 text-center">Carregando histórico...</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white border-b border-slate-200 py-4 shadow-sm">
        <div className="container mx-auto px-6 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-[#003366] font-bold text-xl">
                <Car className="h-6 w-6" /> Full Stack Frotas
            </Link>
            <div className="flex gap-4">
                 <Link to="/" className="text-slate-600 hover:text-[#003366]">Voltar ao Catálogo</Link>
                 <button onClick={() => { localStorage.clear(); window.location.href='/login'; }} className="text-red-500 font-medium">Sair</button>
            </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Minhas Locações</h1>
        <p className="text-slate-500 mb-8">Gerencie seus aluguéis ativos e veja seu histórico.</p>

        {rentals.length === 0 ? (
            <div className="bg-white p-10 rounded-xl shadow-sm text-center border border-slate-200">
                <Car className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">Você ainda não alugou nenhum carro.</p>
                <Link to="/" className="inline-block mt-4 bg-[#003366] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#004080]">
                    Escolher um Carro
                </Link>
            </div>
        ) : (
            <div className="grid gap-6">
                {rentals.map((rental) => {
                    const vehicle = vehicles[rental.veiculoId];
                    const isActive = rental.dataEntrega === null;

                    return (
                        <div key={rental.idString} className={`bg-white rounded-xl p-6 border ${isActive ? 'border-green-400 shadow-md ring-1 ring-green-100' : 'border-slate-200 opacity-75'} flex flex-col md:flex-row justify-between items-center gap-6`}>
                            
                            {/* Info do Carro */}
                            <div className="flex items-center gap-4 flex-1">
                                <div className={`p-3 rounded-full ${isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                    <Car className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-slate-800">
                                        {vehicle ? `${vehicle.marca} ${vehicle.modelo}` : 'Carregando veículo...'}
                                    </h3>
                                    <p className="text-sm text-slate-500 font-mono mt-1">
                                        {vehicle?.placa} • {isActive ? <span className="text-green-600 font-bold">EM ANDAMENTO</span> : 'FINALIZADO'}
                                    </p>
                                </div>
                            </div>

                            {/* Datas */}
                            <div className="flex flex-col gap-2 text-sm text-slate-600 min-w-[200px]">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-blue-500" />
                                    <span>Retirada: {new Date(rental.dataInicio).toLocaleDateString()}</span>
                                </div>
                                {isActive ? (
                                    <div className="flex items-center gap-2 text-orange-600 font-medium">
                                        <Clock className="w-4 h-4" />
                                        <span>Previsto: {new Date(rental.dataFimPrevisto).toLocaleDateString()}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <CheckCircle className="w-4 h-4" />
                                        <span>Devolvido: {new Date(rental.dataEntrega).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>

                            {/* Valores */}
                            {!isActive && (
                                <div className="text-right">
                                    <p className="text-xs text-slate-400 uppercase font-bold">Total Pago</p>
                                    <p className="text-2xl font-bold text-[#003366]">R$ {Number(rental.valorTotal).toFixed(2)}</p>
                                </div>
                            )}

                            {/* Ação */}
                            {isActive && (
                                <button 
                                    onClick={() => handleReturn(rental.idString, vehicle?.quilometragem || 0)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-bold shadow-sm transition-colors flex items-center gap-2"
                                >
                                    <MapPin className="w-4 h-4" /> Devolver Veículo
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        )}
      </main>
    </div>
  );
}