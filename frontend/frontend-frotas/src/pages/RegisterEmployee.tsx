import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Users, AlertCircle, ArrowLeft, Save, Shield } from "lucide-react";
import axios from 'axios';

export default function RegisterEmployee() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    telefone: "",
    matricula: "",
    cpf: "",
    rg: "",
    sexo: "M",
    dataNascimento: "",
    logradouro: "",
    cidade: "",
    estado: "",
    cep: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Chama a rota específica de funcionários no Identity Service
      await axios.post('http://localhost:3001/signup/funcionario', {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        telefone: formData.telefone,
        matricula: formData.matricula,
        cpf: formData.cpf,
        rg: formData.rg,
        sexo: formData.sexo,
        dataNascimento: formData.dataNascimento,
        endereco: {
            logradouro: formData.logradouro,
            cidade: formData.cidade,
            estado: formData.estado,
            cep: formData.cep
        }
      });

      alert("Funcionário cadastrado com sucesso!");
      navigate("/admin"); // Volta para o dashboard

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Erro ao cadastrar funcionário.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex flex-col">
      {/* Header Admin Simplificado */}
      <header className="bg-[#003366] text-white shadow-md py-4">
        <div className="container mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-yellow-400" />
                <h1 className="text-lg font-bold">Área Administrativa</h1>
            </div>
            <Link to="/admin" className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Voltar ao Dashboard
            </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-10 flex justify-center">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gray-50 px-8 py-6 border-b border-slate-200 flex items-center gap-3">
                <div className="bg-[#003366] p-2 rounded-lg text-white"><Users className="w-5 h-5" /></div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Novo Funcionário</h2>
                    <p className="text-sm text-slate-500">Preencha os dados para conceder acesso administrativo.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 text-red-800 text-sm">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Seção 1: Dados Pessoais (Requisito PDF) */}
                    <div className="col-span-full md:col-span-1">
                        <h3 className="text-sm font-bold text-[#003366] uppercase tracking-wide mb-4 border-b pb-2">Dados Pessoais</h3>
                    </div>
                    <div className="col-span-full md:col-span-2 grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome Completo</label>
                            <input name="nome" required className="w-full p-2 border rounded" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CPF</label>
                            <input name="cpf" required className="w-full p-2 border rounded" placeholder="000.000.000-00" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">RG</label>
                            <input name="rg" required className="w-full p-2 border rounded" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Data Nascimento</label>
                            <input name="dataNascimento" type="date" required className="w-full p-2 border rounded" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Gênero</label>
                            <select name="sexo" className="w-full p-2 border rounded bg-white" onChange={handleChange}>
                                <option value="M">Masculino</option>
                                <option value="F">Feminino</option>
                                <option value="O">Outro</option>
                            </select>
                        </div>
                    </div>

                    {/* Seção 2: Dados Corporativos */}
                    <div className="col-span-full md:col-span-1 mt-4">
                        <h3 className="text-sm font-bold text-[#003366] uppercase tracking-wide mb-4 border-b pb-2">Acesso e Empresa</h3>
                    </div>
                    <div className="col-span-full md:col-span-2 grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Matrícula</label>
                            <input name="matricula" required className="w-full p-2 border rounded" placeholder="FUNC-000" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Telefone</label>
                            <input name="telefone" required className="w-full p-2 border rounded" onChange={handleChange} />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Corporativo (Login)</label>
                            <input name="email" type="email" required className="w-full p-2 border rounded" onChange={handleChange} />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Senha de Acesso</label>
                            <input name="senha" type="password" required className="w-full p-2 border rounded" onChange={handleChange} />
                        </div>
                    </div>

                    {/* Seção 3: Endereço */}
                    <div className="col-span-full md:col-span-1 mt-4">
                        <h3 className="text-sm font-bold text-[#003366] uppercase tracking-wide mb-4 border-b pb-2">Endereço</h3>
                    </div>
                    <div className="col-span-full md:col-span-2 grid grid-cols-2 gap-4 mt-4">
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Logradouro</label>
                            <input name="logradouro" required className="w-full p-2 border rounded" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cidade</label>
                            <input name="cidade" required className="w-full p-2 border rounded" onChange={handleChange} />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">UF</label>
                                <input name="estado" maxLength={2} required className="w-full p-2 border rounded" onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CEP</label>
                                <input name="cep" required className="w-full p-2 border rounded" onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end gap-4">
                    <Link to="/admin" className="px-6 py-2 rounded-lg border border-slate-300 text-slate-600 font-bold hover:bg-gray-50">Cancelar</Link>
                    <button type="submit" disabled={isLoading} className="px-6 py-2 rounded-lg bg-[#003366] text-white font-bold hover:bg-[#004080] flex items-center gap-2 disabled:opacity-70">
                        {isLoading ? "Salvando..." : <><Save className="w-4 h-4" /> Cadastrar Funcionário</>}
                    </button>
                </div>
            </form>
        </div>
      </main>
    </div>
  );
}