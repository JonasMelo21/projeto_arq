import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Users, Gauge, Fuel, Settings, Calendar, CheckCircle, ArrowLeft } from "lucide-react";

// Interface do Veículo
interface Veiculo {
  idString: string;
  modelo: string;
  marca: string;
  placa: string;
  status: string;
  acessorios: string[];
  anoFabricacao: number;
  cor: string;
  combustivel: string;
  tipoCambio?: string;
  quilometragem: number;
}

// --- FUNÇÃO AUXILIAR PARA IMAGENS ---
const getCarImage = (modelo: string) => {
  if (!modelo) return null;
  const m = modelo.toLowerCase();

  // Ajustado de .jpg para .png conforme sua estrutura de pastas
  if (m.includes('cr-v')) return '/cars/honda-crv.png';
  if (m.includes('transit')) return '/cars/ford-transit.png';
  if (m.includes('model 3')) return '/cars/tesla-model-3.png';
  if (m.includes('spark')) return '/cars/chevrolet-spark.png';
  if (m.includes('5 series') || m.includes('bmw')) return '/cars/bmw-5.png';
  if (m.includes('wrangler')) return '/cars/jeep-wrangler.png';
  if (m.includes('elantra')) return '/cars/hyundai-elantra.png';
  if (m.includes('corolla') || m.includes('civic')) return '/cars/toyota-corolla.png';
  if (m.includes('uno') || m.includes('fiat')) return '/cars/fiat-uno.png'; // <--- ADICIONE ISSO

  return null;
};


export default function VehicleDetails() {
  const { id } = useParams(); // Pega o ID da URL
  const [vehicle, setVehicle] = useState<Veiculo | null>(null);
  const [loading, setLoading] = useState(true);

  // Buscar dados do carro específico
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        // Como nossa API simples não tem endpoint /veiculos/:id,
        // vamos buscar todos e filtrar (para o TCD funciona perfeitamente)
        const res = await axios.get("http://localhost:3002/veiculos");
        const found = res.data.find((v: Veiculo) => v.idString === id);
        setVehicle(found || null);
      } catch (error) {
        console.error("Erro ao buscar veículo", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  if (loading) return <div className="flex h-screen items-center justify-center"><div className="animate-spin h-10 w-10 border-4 border-blue-600 rounded-full border-t-transparent"></div></div>;
  
  if (!vehicle) return <div className="text-center py-20">Veículo não encontrado. <Link to="/" className="text-blue-600 underline">Voltar</Link></div>;

  // Preço Simulado
  const dailyRate = 100 + (vehicle.anoFabricacao - 2020) * 20;
  const carImage = getCarImage(vehicle.modelo);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header Simples */}
      <header className="bg-white border-b border-slate-200 py-4 sticky top-0 z-10">
        <div className="container mx-auto px-6">
          <Link to="/" className="flex items-center gap-2 text-sm text-[#003366] hover:underline font-medium">
            <ArrowLeft className="w-4 h-4" /> Voltar para a frota
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Coluna Esquerda: Foto */}
          <div>
            <div className="relative h-96 rounded-xl overflow-hidden bg-slate-200 mb-4 flex items-center justify-center shadow-inner group">
               {/* Imagem Grande */}
               {carImage ? (
                    <img 
                        src={carImage} 
                        alt={vehicle.modelo} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        onError={(e) => {
                            // Fallback
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                    />
                ) : null}

               {/* Fallback Emoji (só aparece se a imagem falhar ou não existir) */}
               <span className={`text-9xl opacity-50 ${carImage ? 'hidden' : ''}`}>🚘</span>

              <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white uppercase ${vehicle.status === 'DISPONIVEL' ? 'bg-green-500' : 'bg-red-500'}`}>
                {vehicle.status}
              </span>
            </div>
          </div>

          {/* Coluna Direita: Detalhes */}
          <div>
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm mb-6">
              <div className="mb-6">
                <h1 className="text-3xl font-extrabold text-[#003366] mb-2">
                  {vehicle.marca} {vehicle.modelo}
                </h1>
                <p className="text-slate-500">
                  {vehicle.anoFabricacao} • {vehicle.cor} • Placa: <span className="font-mono uppercase text-slate-700">{vehicle.placa}</span>
                </p>
              </div>

              <div className="flex items-baseline gap-2 mb-8 border-b border-slate-100 pb-6">
                <span className="text-5xl font-bold text-[#003366]">R$ {dailyRate}</span>
                <span className="text-slate-400 font-medium">/ dia</span>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg"><Users className="h-5 w-5 text-blue-600" /></div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">5 Lugares</p>
                    <p className="text-xs text-slate-400">Capacidade</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg"><Settings className="h-5 w-5 text-blue-600" /></div>
                  <div>
                    <p className="text-sm font-bold text-slate-700 capitalize">{vehicle.tipoCambio || 'Manual'}</p>
                    <p className="text-xs text-slate-400">Câmbio</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg"><Fuel className="h-5 w-5 text-blue-600" /></div>
                  <div>
                    <p className="text-sm font-bold text-slate-700 capitalize">{vehicle.combustivel}</p>
                    <p className="text-xs text-slate-400">Combustível</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg"><Gauge className="h-5 w-5 text-blue-600" /></div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">{vehicle.quilometragem.toLocaleString()} km</p>
                    <p className="text-xs text-slate-400">Quilometragem</p>
                  </div>
                </div>
              </div>

              {vehicle.status === "DISPONIVEL" ? (
                <Link to={`/book/${vehicle.idString}`}>
                  <button className="w-full bg-[#003366] hover:bg-[#004080] text-white py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20">
                    <Calendar className="h-5 w-5" />
                    Reservar Agora
                  </button>
                </Link>
              ) : (
                <button disabled className="w-full bg-slate-100 text-slate-400 py-4 rounded-lg font-bold text-lg cursor-not-allowed border border-slate-200">
                  Indisponível no Momento
                </button>
              )}
            </div>

            {/* Card de Acessórios */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Acessórios & Itens</h2>
              <div className="grid grid-cols-1 gap-3">
                {vehicle.acessorios && vehicle.acessorios.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium text-slate-700">{feature}</span>
                  </div>
                ))}
                {(!vehicle.acessorios || vehicle.acessorios.length === 0) && <p className="text-slate-400 text-sm">Nenhum acessório listado.</p>}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}