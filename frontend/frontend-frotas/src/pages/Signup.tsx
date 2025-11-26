import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Car, AlertCircle, ArrowLeft, Lock, Mail, User, FileText, Phone, MapPin, Building2, UserCircle } from "lucide-react";
import axios from 'axios';

type UserType = 'PF' | 'PJ';

export default function Signup() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>('PF');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Estado único para todos os campos
  const [formData, setFormData] = useState({
    // Comuns
    email: "",
    password: "",
    confirmPassword: "",
    telefone: "",
    cep: "",
    logradouro: "",
    cidade: "",
    estado: "",
    
    // PF
    nome: "",
    cpf: "",
    rg: "",
    sexo: "M",
    dataNascimento: "",
    cnh: "",

    // PJ
    nomeFantasia: "",
    razaoSocial: "",
    cnpj: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.");
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = userType === 'PF' 
        ? 'http://localhost:3001/signup/pf' 
        : 'http://localhost:3001/signup/pj';

      const payload = userType === 'PF' ? {
        nome: formData.nome,
        email: formData.email,
        senha: formData.password,
        telefone: formData.telefone,
        cpf: formData.cpf,
        rg: formData.rg,
        sexo: formData.sexo,
        dataNascimento: formData.dataNascimento,
        cnh: formData.cnh, // Requisito PDF
        endereco: {
          logradouro: formData.logradouro,
          cidade: formData.cidade,
          estado: formData.estado,
          cep: formData.cep
        }
      } : {
        nomeFantasia: formData.nomeFantasia,
        razaoSocial: formData.razaoSocial,
        cnpj: formData.cnpj,
        email: formData.email,
        senha: formData.password,
        telefone: formData.telefone,
        endereco: {
          logradouro: formData.logradouro,
          cidade: formData.cidade,
          estado: formData.estado,
          cep: formData.cep
        }
      };

      await axios.post(endpoint, payload);

      alert("Cadastro realizado com sucesso!");
      navigate("/login");

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Erro ao realizar cadastro.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 py-4 sticky top-0 z-10">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-[#003366] font-bold text-xl">
            <div className="bg-[#003366] p-1.5 rounded-lg">
              <Car className="h-5 w-5 text-white" />
            </div>
            Full Stack Frotas
          </Link>
          <Link to="/login" className="text-sm text-slate-500 hover:text-[#003366] flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Voltar para Login
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 flex justify-center">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            
            <div className="p-6 text-center border-b border-slate-100 bg-slate-50/50">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Crie sua conta</h1>
              <p className="text-slate-500 text-sm">Preencha seus dados para começar a alugar.</p>
              
              {/* Seletor PF/PJ */}
              <div className="flex justify-center mt-6 bg-slate-200 p-1 rounded-lg inline-flex">
                <button 
                  type="button"
                  onClick={() => setUserType('PF')}
                  className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${userType === 'PF' ? 'bg-white text-[#003366] shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Pessoa Física
                </button>
                <button 
                  type="button"
                  onClick={() => setUserType('PJ')}
                  className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${userType === 'PJ' ? 'bg-white text-[#003366] shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Pessoa Jurídica
                </button>
              </div>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3 text-red-800 text-sm">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                {/* Seção 1: Dados de Identificação */}
                <div>
                  <h3 className="text-sm font-bold text-[#003366] uppercase tracking-wide border-b border-slate-100 pb-2 mb-4">
                    {userType === 'PF' ? 'Dados Pessoais' : 'Dados da Empresa'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userType === 'PF' ? (
                      <>
                        <div className="col-span-2">
                          <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">Nome Completo</label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input name="nome" type="text" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] text-sm" placeholder="Seu nome" value={formData.nome} onChange={handleChange} />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">CPF</label>
                          <div className="relative">
                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input name="cpf" type="text" required maxLength={14} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] text-sm" placeholder="000.000.000-00" value={formData.cpf} onChange={handleChange} />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">RG</label>
                          <div className="relative">
                            <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input name="rg" type="text" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] text-sm" placeholder="0.000.000" value={formData.rg} onChange={handleChange} />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">Data Nascimento</label>
                          <input name="dataNascimento" type="date" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] text-sm" value={formData.dataNascimento} onChange={handleChange} />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">Sexo</label>
                          <select name="sexo" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] text-sm bg-white" value={formData.sexo} onChange={handleChange}>
                            <option value="M">Masculino</option>
                            <option value="F">Feminino</option>
                            <option value="O">Outro</option>
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">CNH (Obrigatório)</label>
                          <div className="relative">
                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input name="cnh" type="text" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] text-sm" placeholder="Número da CNH" value={formData.cnh} onChange={handleChange} />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="col-span-2">
                          <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">Nome Fantasia</label>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input name="nomeFantasia" type="text" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] text-sm" placeholder="Nome da empresa" value={formData.nomeFantasia} onChange={handleChange} />
                          </div>
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">Razão Social</label>
                          <input name="razaoSocial" type="text" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] text-sm" placeholder="Razão Social Ltda" value={formData.razaoSocial} onChange={handleChange} />
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">CNPJ</label>
                          <div className="relative">
                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input name="cnpj" type="text" required maxLength={18} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] text-sm" placeholder="00.000.000/0000-00" value={formData.cnpj} onChange={handleChange} />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Seção 2: Contato e Endereço */}
                <div>
                  <h3 className="text-sm font-bold text-[#003366] uppercase tracking-wide border-b border-slate-100 pb-2 mb-4">Contato e Endereço</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="col-span-2">
                        <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">Telefone</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input name="telefone" type="text" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] text-sm" placeholder="(00) 00000-0000" value={formData.telefone} onChange={handleChange} />
                        </div>
                     </div>
                     <div className="col-span-2">
                        <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">Logradouro</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input name="logradouro" type="text" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] text-sm" placeholder="Rua, Número, Bairro" value={formData.logradouro} onChange={handleChange} />
                        </div>
                     </div>
                     <div>
                        <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">Cidade</label>
                        <input name="cidade" type="text" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] text-sm" placeholder="Cidade" value={formData.cidade} onChange={handleChange} />
                     </div>
                     <div className="grid grid-cols-2 gap-2">
                       <div>
                          <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">Estado</label>
                          <input name="estado" type="text" required maxLength={2} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] text-sm" placeholder="UF" value={formData.estado} onChange={handleChange} />
                       </div>
                       <div>
                          <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">CEP</label>
                          <input name="cep" type="text" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] text-sm" placeholder="00000-000" value={formData.cep} onChange={handleChange} />
                       </div>
                     </div>
                  </div>
                </div>

                {/* Seção 3: Acesso */}
                <div>
                  <h3 className="text-sm font-bold text-[#003366] uppercase tracking-wide border-b border-slate-100 pb-2 mb-4">Dados de Acesso</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input name="email" type="email" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] text-sm" placeholder="seu@email.com" value={formData.email} onChange={handleChange} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">Senha</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input name="password" type="password" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] text-sm" placeholder="••••••••" value={formData.password} onChange={handleChange} />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">Confirmar Senha</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input name="confirmPassword" type="password" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] text-sm" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={isLoading} className="w-full bg-[#003366] text-white py-3 rounded-lg font-bold text-sm hover:bg-[#004080] transition-all shadow-lg mt-6 disabled:opacity-70 flex justify-center">
                  {isLoading ? "Criando conta..." : "Finalizar Cadastro"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}