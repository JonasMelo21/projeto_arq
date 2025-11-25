import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Car, Users, Calendar, CheckCircle, XCircle, 
  Search, LayoutDashboard, LogOut, Plus, Wallet 
} from 'lucide-react';

// --- Interfaces ---
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
}

interface Cliente {
  idString: string;
  nome: string;
  email: string;
}

interface Locacao {
  idString: string;
  dataInicio: string;
  dataFimPrevisto: string;
  formaPagamento: string;
  clienteId: string;
  veiculoId: string;
}

function App() {
  // Estados
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [locacoes, setLocacoes] = useState<Locacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | frota | clientes

  // Endpoints
  const API_FLEET = 'http://localhost:3002';
  const API_IDENTITY = 'http://localhost:3001';
  const API_RENTAL = 'http://localhost:3003';

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [resFrota, resIdentity, resRental] = await Promise.all([
        axios.get(`${API_FLEET}/veiculos`),
        axios.get(`${API_IDENTITY}/pessoas`),
        axios.get(`${API_RENTAL}/locacoes`)
      ]);
      setVeiculos(resFrota.data);
      setClientes(resIdentity.data);
      setLocacoes(resRental.data);
    } catch (error) {
      console.error("Erro ao conectar:", error);
    } finally {
      setLoading(false);
    }
  };

  // Componente de Status Badge
  const StatusBadge = ({ status }: { status: string }) => {
    const isAvailable = status === 'DISPONIVEL';
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isAvailable ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
      }`}>
        {isAvailable ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Car className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg">Full Stack Frotas</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          
          <button 
            onClick={() => setActiveTab('frota')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'frota' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <Car className="w-5 h-5" /> Gestão de Frota
          </button>

          <button 
            onClick={() => setActiveTab('clientes')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'clientes' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <Users className="w-5 h-5" /> Clientes & CRM
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" /> Sair do Sistema
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto">
        {/* Header Mobile/Desktop */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-slate-800 capitalize">{activeTab}</h1>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Buscar..." className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64" />
            </div>
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold border-2 border-white shadow-sm">
              AD
            </div>
          </div>
        </header>

        <div className="p-8">
          
          {/* --- VIEW: DASHBOARD --- */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Total Veículos</p>
                    <p className="text-3xl font-bold text-slate-900">{veiculos.length}</p>
                  </div>
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Car /></div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Locações Ativas</p>
                    <p className="text-3xl font-bold text-slate-900">{locacoes.length}</p>
                  </div>
                  <div className="p-3 bg-green-50 text-green-600 rounded-lg"><Calendar /></div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Clientes Cadastrados</p>
                    <p className="text-3xl font-bold text-slate-900">{clientes.length}</p>
                  </div>
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Users /></div>
                </div>
              </div>

              {/* Tabela de Locações Recentes */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800">Locações Recentes</h3>
                  <button className="text-sm text-blue-600 hover:underline">Ver todas</button>
                </div>
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
                    <tr>
                      <th className="px-6 py-3">Data Início</th>
                      <th className="px-6 py-3">Devolução Prevista</th>
                      <th className="px-6 py-3">Cliente ID</th>
                      <th className="px-6 py-3">Pagamento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {locacoes.map(l => (
                      <tr key={l.idString} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">{new Date(l.dataInicio).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-slate-600">{new Date(l.dataFimPrevisto).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-slate-400 font-mono text-xs">{l.clienteId.substring(0, 8)}...</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-slate-100 text-slate-600">
                            <Wallet className="w-3 h-3" /> {l.formaPagamento}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {locacoes.length === 0 && (
                      <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400">Nenhuma locação ativa no momento.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- VIEW: FROTA --- */}
          {activeTab === 'frota' && (
            <div>
              <div className="flex justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">Catálogo de Veículos</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Adicionar Veículo
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {veiculos.map(v => (
                  <div key={v.idString} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                    <div className="h-40 bg-slate-100 flex items-center justify-center relative">
                      <span className="text-6xl">🚘</span>
                      <div className="absolute top-3 right-3">
                        <StatusBadge status={v.status} />
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="mb-1 text-xs font-bold text-blue-600 uppercase tracking-wider">{v.marca}</div>
                      <h3 className="font-bold text-lg text-slate-900 mb-2">{v.modelo}</h3>
                      
                      <div className="space-y-2 text-sm text-slate-500 mb-4 flex-1">
                        <div className="flex justify-between"><span>Ano:</span> <span className="text-slate-800">{v.anoFabricacao}</span></div>
                        <div className="flex justify-between"><span>Cor:</span> <span className="text-slate-800">{v.cor}</span></div>
                        <div className="flex justify-between"><span>Placa:</span> <span className="font-mono text-slate-800">{v.placa}</span></div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 mt-auto">
                        <div className="flex flex-wrap gap-1 mb-3">
                          {v.acessorios && v.acessorios.map((acc, i) => (
                            <span key={i} className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500">{acc}</span>
                          ))}
                        </div>
                        <button className="w-full py-2 border border-blue-600 text-blue-600 font-semibold rounded hover:bg-blue-50 transition text-sm">
                          Detalhes
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- VIEW: CLIENTES --- */}
          {activeTab === 'clientes' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="font-bold text-lg text-slate-800">Base de Clientes</h2>
              </div>
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3">Nome</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">ID do Sistema</th>
                    <th className="px-6 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {clientes.map(c => (
                    <tr key={c.idString} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                          {c.nome.charAt(0)}
                        </div>
                        {c.nome}
                      </td>
                      <td className="px-6 py-4 text-slate-600">{c.email}</td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">{c.idString}</td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">Editar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default App;