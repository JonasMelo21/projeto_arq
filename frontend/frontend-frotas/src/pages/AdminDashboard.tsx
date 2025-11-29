import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Car, Users, Calendar, CheckCircle, Clock, ArrowLeft, PlusCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [rentals, setRentals] = useState<any[]>([]);
  const [users, setUsers] = useState<Record<string, string>>({}); // ID -> Nome
  const [vehicles, setVehicles] = useState<Record<string, string>>({}); // ID -> Modelo/Placa
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // URLs das APIs
  const API_RENTAL = 'http://localhost:3003';
  const API_IDENTITY = 'http://localhost:3001';
  const API_FLEET = 'http://localhost:3002';

  useEffect(() => {
    // --- 1. VERIFICAÇÃO DE SEGURANÇA ---
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
        navigate('/login'); // Chuta pro login se não tiver usuário
        return;
    }
    
    const user = JSON.parse(storedUser);
    if (user.role !== 'ADMIN') {
        alert("Acesso Negado: Área restrita para administradores.");
        navigate('/'); // Chuta pra home se for cliente comum
        return;
    }
    setIsAdmin(true); // Libera a renderização

    // --- 2. CARREGAMENTO DE DADOS ---
    const loadAdminData = async () => {
      try {
        const resRentals = await axios.get(`${API_RENTAL}/locacoes`);
        setRentals(resRentals.data);

        const resUsers = await axios.get(`${API_IDENTITY}/pessoas`);
        const userMap: Record<string, string> = {};
        resUsers.data.forEach((u: any) => {
            userMap[u.idString] = `${u.nome} (${u.role})`;
        });
        setUsers(userMap);

        const allVehicleIds = resRentals.data.map((r: any) => r.veiculoId);
        // Remove duplicatas
        const vehicleIds = allVehicleIds.filter((id: string, index: number, self: string[]) => 
            self.indexOf(id) === index
        );
        
        const vehicleMap: Record<string, string> = {};
        await Promise.all(vehicleIds.map(async (vId: string) => {
            try {
                // @ts-ignore
                const res = await axios.get(`${API_FLEET}/veiculos/${vId}`);
                // @ts-ignore
                vehicleMap[vId] = `${res.data.marca} ${res.data.modelo} [${res.data.placa}]`;
            } catch (e) { 
                console.error("Erro ao buscar carro", vId); 
            }
        }));
        setVehicles(vehicleMap);

      } catch (error) {
        console.error("Erro ao carregar dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    loadAdminData();
  }, [navigate]);

  // Bloqueia a tela enquanto verifica permissão
  if (!isAdmin) return null; 
  
  if (loading) return <div className="p-10 text-center font-bold text-gray-500">Carregando painel administrativo...</div>;

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* Navbar Admin */}
      <header className="bg-[#003366] text-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-lg">
                    <Users className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-xl font-bold">Painel Administrativo</h1>
                    <p className="text-xs text-blue-200">Visão Geral da Locadora</p>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                {/* --- BOTÃO DE CADASTRAR FUNCIONÁRIO --- */}
                <Link to="/admin/register-employee" className="text-sm bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-bold shadow-lg text-white no-underline">
                    <PlusCircle className="w-4 h-4" /> Novo Funcionário
                </Link>

                <Link to="/" className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-white no-underline">
                    <ArrowLeft className="w-4 h-4" /> Voltar ao Site
                </Link>
            </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        
        {/* KPI Cards (Resumo Rápido) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><Car className="w-6 h-6"/></div>
                    <div>
                        <p className="text-sm text-gray-500 font-bold uppercase">Total de Locações</p>
                        <p className="text-3xl font-bold text-slate-800">{rentals.length}</p>
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-full"><CheckCircle className="w-6 h-6"/></div>
                    <div>
                        <p className="text-sm text-gray-500 font-bold uppercase">Finalizadas</p>
                        <p className="text-3xl font-bold text-slate-800">{rentals.filter(r => r.dataEntrega).length}</p>
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full"><Clock className="w-6 h-6"/></div>
                    <div>
                        <p className="text-sm text-gray-500 font-bold uppercase">Em Andamento</p>
                        <p className="text-3xl font-bold text-slate-800">{rentals.filter(r => !r.dataEntrega).length}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Tabela de Relatório */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <h2 className="font-bold text-lg text-slate-800">Relatório Completo de Locações</h2>
                <button className="text-sm text-blue-600 hover:underline">Exportar CSV</button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3">Cliente</th>
                            <th className="px-6 py-3">Veículo</th>
                            <th className="px-6 py-3">Retirada</th>
                            <th className="px-6 py-3">Devolução</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Valor Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rentals.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                    Nenhuma locação registrada no sistema.
                                </td>
                            </tr>
                        ) : rentals.map((rental) => (
                            <tr key={rental.idString} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {users[rental.clienteId] || <span className="text-red-400">ID Desconhecido</span>}
                                </td>
                                <td className="px-6 py-4">
                                    {vehicles[rental.veiculoId] || <span className="text-gray-400">Carregando...</span>}
                                </td>
                                <td className="px-6 py-4">
                                    {new Date(rental.dataInicio).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    {rental.dataEntrega 
                                        ? new Date(rental.dataEntrega).toLocaleDateString() 
                                        : <span className="text-gray-400 italic">Prev: {new Date(rental.dataFimPrevisto).toLocaleDateString()}</span>
                                    }
                                </td>
                                <td className="px-6 py-4">
                                    {rental.dataEntrega ? (
                                        <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-0.5 rounded border border-green-200">Devolvido</span>
                                    ) : (
                                        <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2.5 py-0.5 rounded border border-yellow-200">Ativo</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-slate-700">
                                    {rental.valorTotal ? `R$ ${rental.valorTotal.toFixed(2)}` : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </main>
    </div>
  );
}