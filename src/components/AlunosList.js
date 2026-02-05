import React, { useEffect, useState } from 'react';
import { Users, Mail, Calendar, Search, Filter, Trash2, AlertTriangle, Dumbbell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import ResumoTreinos from './ResumoTreinos';

const AlunosList = () => {
  const navigate = useNavigate();
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchAlunos();
  }, []);

  const fetchAlunos = async () => {
    try {
      console.log('Buscando alunos na tabela perfis...');
      const { data, error } = await supabase
        .from('perfis')
        .select('*')
        .eq('tipo', 'aluno')
        .order('created_at', { ascending: false });

      console.log('Resultado da busca:', { data, error });

      if (error) {
        console.error('Erro ao buscar alunos:', error);
        setAlunos([]);
      } else {
        console.log(`Encontrados ${data?.length || 0} alunos`);
        setAlunos(data || []);
      }
    } catch (error) {
      console.error('Erro geral na busca:', error);
      setAlunos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAluno = async (alunoId, alunoNome) => {
    if (!window.confirm(`Tem certeza que deseja excluir o aluno "${alunoNome}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    setDeletingId(alunoId);
    
    try {
      console.log(`Excluindo aluno ${alunoId} - ${alunoNome}`);
      
      // Primeiro, excluir o usuário da autenticação
      const { error: authError } = await supabase.auth.admin.deleteUser(alunoId);
      
      if (authError) {
        console.error('Erro ao excluir usuário da autenticação:', authError);
        // Se não conseguir excluir da autenticação, tenta apenas excluir o perfil
        const { error: perfilError } = await supabase
          .from('perfis')
          .delete()
          .eq('id', alunoId);
          
        if (perfilError) {
          console.error('Erro ao excluir perfil:', perfilError);
          alert('Erro ao excluir aluno. Tente novamente.');
        } else {
          console.log('Perfil excluído com sucesso');
          alert('Aluno excluído com sucesso!');
          fetchAlunos(); // Atualizar lista
        }
      } else {
        console.log('Usuário e perfil excluídos com sucesso');
        alert('Aluno excluído com sucesso!');
        fetchAlunos(); // Atualizar lista
      }
    } catch (error) {
      console.error('Erro geral ao excluir aluno:', error);
      alert('Erro ao excluir aluno. Tente novamente.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleMontarTreino = (alunoId) => {
    navigate(`/admin/montar-treino/${alunoId}`);
  };

  const filteredAlunos = alunos.filter(aluno => {
    const matchesSearch = aluno.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'todos' || true; // Pode adicionar filtros de status depois
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-400">Carregando alunos...</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Users size={20} className="text-emerald-500" />
          <span>Alunos Cadastrados</span>
          <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
            {filteredAlunos.length}
          </span>
        </h3>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Busca */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        {/* Filtro de Status */}
        <div className="flex items-center space-x-2">
          <Filter size={18} className="text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="todos">Todos</option>
            <option value="ativos">Ativos</option>
            <option value="inativos">Inativos</option>
          </select>
        </div>
      </div>

      {/* Lista de Alunos */}
      {filteredAlunos.length === 0 ? (
        <div className="text-center py-8">
          <Users size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">
            {searchTerm ? 'Nenhum aluno encontrado' : 'Nenhum aluno cadastrado ainda'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAlunos.map((aluno) => (
            <div
              key={aluno.id}
              className="bg-slate-800 rounded-lg p-4 hover:bg-slate-700 transition-colors duration-200 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {aluno.nome.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Informações */}
                  <div>
                    <h4 className="text-white font-medium">{aluno.nome}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>Aluno ativo</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors duration-200">
                    <Mail size={18} />
                  </button>
                  <button 
                    onClick={() => handleDeleteAluno(aluno.id, aluno.nome)}
                    disabled={deletingId === aluno.id}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === aluno.id ? (
                      <div className="animate-spin w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full"></div>
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                  <button 
                    onClick={() => handleMontarTreino(aluno.id)}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg transition-colors duration-200 flex items-center space-x-1"
                  >
                    <Dumbbell size={14} />
                    <span>Montar Treino</span>
                  </button>
                </div>
              </div>

              {/* Resumo de Treinos */}
              <ResumoTreinos alunoId={aluno.id} />
            </div>
          ))}
        </div>
      )}

      {/* Estatísticas */}
      <div className="mt-6 pt-6 border-t border-slate-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-emerald-500">{alunos.length}</p>
            <p className="text-gray-400 text-sm">Total</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-500">{alunos.length}</p>
            <p className="text-gray-400 text-sm">Ativos</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-500">0</p>
            <p className="text-gray-400 text-sm">Inativos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlunosList;
