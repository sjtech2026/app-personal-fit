import React, { useEffect } from 'react';
import { LogOut, Users, Calendar, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AlunosList from './AlunosList';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se o usuário está autenticado
    const isAdmin = localStorage.getItem('is_admin');
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('is_admin');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-white">Dashboard Personal</h1>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 group"
            >
              <LogOut 
                size={20} 
                className="group-hover:translate-x-1 transition-transform duration-200"
              />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Bem-vindo, Personal!</h2>
          <p className="text-gray-400">Gerencie seus alunos e acompanhe o progresso</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <Users className="text-emerald-500" size={24} />
              <span className="text-2xl font-bold text-white">24</span>
            </div>
            <p className="text-gray-400">Total de Alunos</p>
          </div>

          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="text-blue-500" size={24} />
              <span className="text-2xl font-bold text-white">12</span>
            </div>
            <p className="text-gray-400">Aulas Hoje</p>
          </div>

          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="text-purple-500" size={24} />
              <span className="text-2xl font-bold text-white">89%</span>
            </div>
            <p className="text-gray-400">Taxa de Presença</p>
          </div>

          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="text-orange-500" size={24} />
              <span className="text-2xl font-bold text-white">+15%</span>
            </div>
            <p className="text-gray-400">Crescimento Mensal</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg transition-colors duration-200">
              Novo Aluno
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors duration-200">
              Agendar Aula
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors duration-200">
              Ver Relatórios
            </button>
          </div>
        </div>

        {/* Lista de Alunos */}
        <AlunosList />
      </main>
    </div>
  );
};

export default AdminDashboard;
