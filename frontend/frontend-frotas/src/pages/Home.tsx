import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Car, Settings, Fuel, Gauge, Search, User, LogOut, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// --- TIPAGEM ---
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
    quilometragem: number;
    tipoCambio?: string;
}

const getCarImage = (modelo: string) => {
  if (!modelo) return null;
  const m = modelo.toLowerCase();

  if (m.includes('cr-v')) return '/cars/honda-crv.png';
  if (m.includes('transit')) return '/cars/ford-transit.png';
  if (m.includes('model 3')) return '/cars/tesla-model-3.png';
  if (m.includes('spark')) return '/cars/chevrolet-spark.png';
  if (m.includes('5 series') || m.includes('bmw')) return '/cars/bmw-5.png';
  if (m.includes('wrangler')) return '/cars/jeep-wrangler.png';
  if (m.includes('elantra')) return '/cars/hyundai-elantra.png';
  if (m.includes('corolla') || m.includes('civic')) return '/cars/toyota-corolla.png';

  return null;
};

// --- HEADER ---
const Header = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            try { setUser(JSON.parse(stored)); } catch (e) {}
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    return (
        <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 cursor-pointer text-decoration-none">
                    <div className="bg-[#003366] p-2 rounded-lg">
                        <Car className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-[#003366]">Full Stack Frotas</span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <Link to="/" className="text-sm font-medium text-[#003366]">Catálogo</Link>
                    <Link to="/meus-alugueis" className="text-sm font-medium text-gray-500 hover:text-[#003366] transition-colors">Minhas Locações</Link>
                    <a href="#" className="text-sm font-medium text-gray-500 hover:text-[#003366] transition-colors">Admin</a>
                </nav>

                <div className="flex items-center gap-3">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-slate-700">Olá, {user.nome?.split(' ')[0]}</span>
                            <button onClick={handleLogout} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors" title="Sair">
                                <LogOut className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="hidden md:flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition text-slate-700">
                                <User className="h-4 w-4" /> Entrar
                            </Link>
                            <Link to="/signup" className="bg-[#003366] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#004080] transition shadow-md flex items-center">
                                Cadastrar
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

// --- CARD DO VEÍCULO (COM REGRA DE NEGÓCIO VISUAL) ---
const VehicleCard = ({ vehicle }: { vehicle: Veiculo }) => {
    const statusColors: Record<string, string> = {
        DISPONIVEL: "bg-green-500",
        ALUGADO: "bg-yellow-500",
        MANUTENCAO: "bg-red-500",
    };

    const dailyRate = 100 + (vehicle.anoFabricacao - 2020) * 20;
    const carImage = getCarImage(vehicle.modelo);

    // --- REGRA DE NEGÓCIO CRÍTICA DO PDF ---
    // A frota não pode ser disponibilizada se > 80.000 km ou > 4 anos
    const currentYear = new Date().getFullYear();
    const isOld = (currentYear - vehicle.anoFabricacao) > 4;
    const isHighKm = vehicle.quilometragem > 80000;
    
    // Bloqueia se violar regras OU se não estiver disponível
    const isBlocked = isOld || isHighKm || vehicle.status !== 'DISPONIVEL';

    let statusLabel = vehicle.status;
    let statusColor = statusColors[vehicle.status] || "bg-gray-500";
    let buttonText = "Ver Detalhes";

    if (isOld || isHighKm) {
        statusLabel = "FORA DE PADRÃO";
        statusColor = "bg-red-600";
        buttonText = "Indisponível (Frota Antiga)";
    } else if (vehicle.status !== 'DISPONIVEL') {
        buttonText = "Indisponível";
    }

    return (
        <div className={`bg-white rounded-xl overflow-hidden shadow-sm border ${isOld || isHighKm ? 'border-red-200 opacity-80' : 'border-gray-200'} hover:shadow-lg transition-all duration-300 group flex flex-col h-full`}>
            <div className="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                {carImage ? (
                    <img 
                        src={carImage} 
                        alt={vehicle.modelo} 
                        className={`w-full h-full object-cover transition-transform duration-500 ${!isBlocked ? 'group-hover:scale-110' : 'grayscale'}`}
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                    />
                ) : null}
                
                <span className={`text-6xl ${carImage ? 'hidden' : ''}`}>🚘</span>

                <span className={`absolute top-3 right-3 px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wide ${statusColor}`}>
                    {statusLabel}
                </span>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                {/* Alerta Visual da Regra */}
                {(isOld || isHighKm) && (
                    <div className="mb-3 flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 p-2 rounded border border-red-100">
                        <AlertTriangle className="w-4 h-4" />
                        <span>
                            {isOld ? `Uso > 4 anos (${currentYear - vehicle.anoFabricacao} anos)` : `KM > 80k (${vehicle.quilometragem.toLocaleString()} km)`}
                        </span>
                    </div>
                )}

                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 leading-tight">{vehicle.marca} {vehicle.modelo}</h3>
                        <p className="text-sm text-gray-500 mt-1">{vehicle.anoFabricacao} • {vehicle.cor}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                        <p className="text-xl font-bold text-[#003366]">R$ {dailyRate}</p>
                        <p className="text-xs text-gray-400">/ dia</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-gray-400" />
                        <span className="capitalize truncate">{vehicle.tipoCambio || 'Manual'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Fuel className="h-4 w-4 text-gray-400" />
                        <span className="capitalize truncate">{vehicle.combustivel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Gauge className={`h-4 w-4 ${isHighKm ? 'text-red-500' : 'text-gray-400'}`} />
                        <span className={isHighKm ? 'text-red-600 font-bold' : ''}>{vehicle.quilometragem.toLocaleString()} km</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 flex items-center justify-center border border-gray-400 rounded text-[8px] px-1">PL</div>
                        <span className="uppercase truncate">{vehicle.placa}</span>
                    </div>
                </div>

                <div className="mt-auto">
                    {isBlocked ? (
                        <button 
                            disabled
                            className="w-full py-2.5 rounded-lg font-semibold text-sm bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                        >
                            {buttonText}
                        </button>
                    ) : (
                        <Link to={`/vehicle/${vehicle.idString}`} className="w-full block">
                            <button className="w-full py-2.5 rounded-lg font-semibold text-sm bg-[#003366] text-white hover:bg-[#004080] transition-colors">
                                {buttonText}
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

// ... Filtros e Home permanecem quase iguais, apenas removendo a lógica comentada do useMemo pois movemos para o Card ...
const VehicleFilters = ({ searchQuery, setSearchQuery }: any) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2 w-full">
                <label className="text-sm font-medium text-gray-700">Buscar Veículo</label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Marca, modelo ou placa..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                    />
                </div>
            </div>
            <div className="space-y-2 w-full md:w-48">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-600 focus:outline-none">
                    <option value="all">Todos</option>
                    <option value="available">Disponíveis</option>
                </select>
            </div>
        </div>
    </div>
);

function Home() {
    const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const API_FLEET = 'http://localhost:3002';

    useEffect(() => {
        axios.get(`${API_FLEET}/veiculos`)
            .then(res => setVeiculos(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const filteredVehicles = useMemo(() => {
        return veiculos.filter((v) => {
            const searchLower = searchQuery.toLowerCase();
            return (
                v.marca.toLowerCase().includes(searchLower) ||
                v.modelo.toLowerCase().includes(searchLower) ||
                v.placa.toLowerCase().includes(searchLower)
            );
        });
    }, [searchQuery, veiculos]);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
            <Header />
            <main className="container mx-auto px-6 py-12">
                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold text-[#003366] mb-3 tracking-tight">Nossa Frota Premium</h1>
                    <p className="text-gray-500 text-lg">Escolha entre nossa ampla seleção de veículos para sua próxima jornada.</p>
                </div>
                <VehicleFilters searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                {loading && <p className="text-center py-20 text-gray-500">Carregando frota...</p>}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredVehicles.map((vehicle) => (
                            <VehicleCard key={vehicle.idString} vehicle={vehicle} />
                        ))}
                    </div>
                )}
            </main>
            <footer className="bg-white border-t border-gray-200 py-10 mt-12 text-center text-gray-400 text-sm">
                <p>© 2025 Full Stack Frotas.</p>
            </footer>
        </div>
    );
}

export default Home;