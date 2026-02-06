import React, { useEffect, useState } from 'react';
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
              <h1 className="text-xl font-bold text-white">Dashboard do Aluno</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 group"
            >
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

        {/* Espaço para futuras funcionalidades */}
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            Dashboard pronto para novas funcionalidades
          </p>
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
