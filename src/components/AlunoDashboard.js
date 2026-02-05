import React, { useEffect, useState } from 'react';
import { LogOut, Dumbbell, Calendar, Target, TrendingUp, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import MeusDados from './MeusDados';
import TreinosAluno from './TreinosAluno';
import TreinoModal from './TreinoModal';

const AlunoDashboard = () => {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [treinos, setTreinos] = useState([]);
  const [selectedTreino, setSelectedTreino] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    verificarAutenticacao();
  }, [navigate]);

  useEffect(() => {
    if (perfil) {
      fetchTreinos();
    }
  }, [perfil]);

  const fetchTreinos = async () => {
    try {
      const { data, error } = await supabase
        .from('treinos')
        .select('*')
        .eq('aluno_id', perfil.id)
        .order('data_criacao', { ascending: false });

      if (error) {
        console.error('Erro ao buscar treinos:', error);
      } else {
        setTreinos(data || []);
      }
    } catch (error) {
      console.error('Erro geral:', error);
    }
  };

  const handleTreinoClick = (treino) => {
    setSelectedTreino(treino);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTreino(null);
    setIsModalOpen(false);
  };

  const verificarAutenticacao = async () => {
    try {
      // Verificar se há usuário autenticado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/aluno/login');
        return;
      }

      // Buscar dados do perfil
      const { data: perfilData, error } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error || !perfilData || perfilData.tipo !== 'aluno') {
        await supabase.auth.signOut();
        navigate('/aluno/login');
        return;
      }

      setPerfil(perfilData);
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      navigate('/aluno/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Dumbbell className="text-blue-500" size={24} />
              <h1 className="text-xl font-bold text-white">Dashboard do Aluno</h1>
            </div>
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
        {/* Mensagem de Boas-vindas */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Bem-vindo, {perfil?.nome}! 💪
          </h2>
          <p className="text-gray-400">
            Vamos alcançar seus objetivos juntos. Este é seu painel para acompanhar seu progresso.
          </p>
        </div>

        {/* Meus Dados */}
        <MeusDados perfil={perfil} />

        {/* Treinos do Aluno */}
        <TreinosAluno 
          treinos={treinos} 
          onTreinoClick={handleTreinoClick} 
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="text-blue-500" size={24} />
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <p className="text-gray-400">Treinos esta Semana</p>
          </div>

          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <Target className="text-emerald-500" size={24} />
              <span className="text-2xl font-bold text-white">12</span>
            </div>
            <p className="text-gray-400">Metas Concluídas</p>
          </div>

          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="text-purple-500" size={24} />
              <span className="text-2xl font-bold text-white">85%</span>
            </div>
            <p className="text-gray-400">Frequência</p>
          </div>

          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <Award className="text-orange-500" size={24} />
              <span className="text-2xl font-bold text-white">5</span>
            </div>
            <p className="text-gray-400">Conquistas</p>
          </div>
        </div>

        {/* Seções Principais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Próximo Treino */}
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Dumbbell size={20} className="text-blue-500" />
              <span>Próximo Treino</span>
            </h3>
            <div className="space-y-3">
              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-white font-medium">Treino A - Peito e Tríceps</p>
                <p className="text-gray-400 text-sm">Hoje, 14:00</p>
              </div>
              <div className="text-sm text-gray-500">
                <p>• Supino reto: 4x12</p>
                <p>• Crucifixo: 3x15</p>
                <p>• Tríceps na corda: 3x15</p>
              </div>
            </div>
          </div>

          {/* Metas da Semana */}
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Target size={20} className="text-emerald-500" />
              <span>Metas da Semana</span>
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Treinar 5 dias</span>
                <span className="text-emerald-400 font-medium">3/5</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Beber 2L de água</span>
                <span className="text-blue-400 font-medium">1.5L/2L</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
          <h3 className="text-lg font-semibold text-white mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
              <Dumbbell size={20} />
              <span>Registrar Treino</span>
            </button>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
              <Calendar size={20} />
              <span>Agendar Aula</span>
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
              <TrendingUp size={20} />
              <span>Ver Progresso</span>
            </button>
          </div>
        </div>
      </main>

      {/* Modal de Treino */}
      <TreinoModal 
        treino={selectedTreino} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  );
};

export default AlunoDashboard;
