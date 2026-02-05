import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Dumbbell, Activity, Ruler, Calendar, Plus, X, Search, ChevronDown, ChevronRight } from 'lucide-react';
import { supabase } from '../supabase';
import { BIBLIOTECA_EXERCICIOS } from '../data/bibliotecaExercicios';

const MontarTreino = () => {
  const { alunoId } = useParams();
  const navigate = useNavigate();
  const [aluno, setAluno] = useState(null);
  const [loading, setLoading] = useState(true);
  const [treino, setTreino] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [saving, setSaving] = useState(false);
  const [diaSelecionado, setDiaSelecionado] = useState('Segunda');

  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  useEffect(() => {
    fetchAluno();
  }, [alunoId]);

  useEffect(() => {
    if (aluno) {
      fetchTreinoDoDia();
    }
  }, [aluno, diaSelecionado]);

  const fetchTreinoDoDia = async () => {
    try {
      const { data, error } = await supabase
        .from('treinos')
        .select('*')
        .eq('aluno_id', alunoId)
        .eq('dia_semana', diaSelecionado)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Erro ao buscar treino do dia:', error);
      } else if (data && data.exercicios) {
        setTreino(data.exercicios);
      } else {
        setTreino([]);
      }
    } catch (error) {
      console.error('Erro geral:', error);
      setTreino([]);
    }
  };

  const mudarDia = (dia) => {
    setDiaSelecionado(dia);
    setTreino([]); // Limpa a lista ao mudar de dia
  };

  const fetchAluno = async () => {
    try {
      const { data, error } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', alunoId)
        .eq('tipo', 'aluno')
        .single();

      if (error) {
        console.error('Erro ao buscar aluno:', error);
        navigate('/admin/dashboard');
      } else {
        setAluno(data);
      }
    } catch (error) {
      console.error('Erro:', error);
      navigate('/admin/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/admin/dashboard');
  };

  const toggleGroup = (groupName) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName);
    } else {
      newExpanded.add(groupName);
    }
    setExpandedGroups(newExpanded);
  };

  const adicionarExercicio = (exercicio, grupo) => {
    const novoItem = {
      nome: exercicio,
      grupo: grupo,
      treinoId: Date.now(),
      series: 3,
      repeticoes: 12,
      descanso: 60,
      observacoes: ''
    };
    setTreino([...treino, novoItem]);
  };

  const removerExercicio = (treinoId) => {
    setTreino(treino.filter(item => item.treinoId !== treinoId));
  };

  const atualizarExercicio = (treinoId, campo, valor) => {
    setTreino(treino.map(item => 
      item.treinoId === treinoId 
        ? { ...item, [campo]: valor }
        : item
    ));
  };

  const salvarTreino = async () => {
    if (treino.length === 0) {
      alert('Adicione pelo menos um exercício ao treino');
      return;
    }

    setSaving(true);
    
    try {
      console.log('Iniciando salvamento do treino...');
      console.log('ID do aluno:', alunoId);
      console.log('Dia selecionado:', diaSelecionado);
      console.log('Dados do aluno:', aluno);
      console.log('Lista de exercícios:', treino);
      
      const treinoData = {
        aluno_id: alunoId,
        dia_semana: diaSelecionado,
        nome_treino: `Treino ${diaSelecionado} - ${aluno.nome}`,
        exercicios: treino // Salva como array JSON diretamente
      };

      console.log('Dados que serão enviados:', treinoData);

      // Primeiro tenta atualizar se já existir
      const { data: updateData, error: updateError } = await supabase
        .from('treinos')
        .update(treinoData)
        .eq('aluno_id', alunoId)
        .eq('dia_semana', diaSelecionado)
        .select()
        .single();

      if (updateError && updateError.code === 'PGRST116') {
        // Se não existir, faz insert
        console.log('Treino não existe, criando novo...');
        const { data: insertData, error: insertError } = await supabase
          .from('treinos')
          .insert([treinoData])
          .select()
          .single();

        if (insertError) {
          console.error('Erro ao inserir treino:', insertError);
          alert(`Erro ao salvar treino: ${insertError.message}`);
        } else {
          console.log('Treino criado com sucesso:', insertData);
          alert('Treino enviado com sucesso!');
          navigate('/admin/dashboard');
        }
      } else if (updateError) {
        console.error('Erro ao atualizar treino:', updateError);
        alert(`Erro ao salvar treino: ${updateError.message}`);
      } else {
        console.log('Treino atualizado com sucesso:', updateData);
        alert('Treino atualizado com sucesso!');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Erro geral no salvamento:', error);
      alert(`Erro ao salvar treino: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Carregando dados do aluno...</div>
      </div>
    );
  }

  if (!aluno) {
    return (
      <div className="w-full h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Aluno não encontrado</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-slate-950 flex flex-col">
      {/* Cabeçalho */}
      <header className="bg-slate-900 border-b border-slate-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-6">
            {/* Botão Voltar */}
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 group"
            >
              <ArrowLeft 
                size={20} 
                className="group-hover:-translate-x-1 transition-transform duration-200"
              />
              <span>Voltar</span>
            </button>

            {/* Nome do Aluno */}
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
                <Dumbbell size={24} className="text-emerald-500" />
                <span>{aluno.nome}</span>
              </h1>
              <div className="flex items-center space-x-6 mt-2">
                {/* Peso */}
                <div className="flex items-center space-x-2">
                  <Activity size={16} className="text-blue-500" />
                  <span className="text-gray-300 text-sm">
                    {aluno.peso ? `${aluno.peso} kg` : 'Não informado'}
                  </span>
                </div>

                {/* Altura */}
                <div className="flex items-center space-x-2">
                  <Ruler size={16} className="text-emerald-500" />
                  <span className="text-gray-300 text-sm">
                    {aluno.altura ? `${aluno.altura} cm` : 'Não informado'}
                  </span>
                </div>

                {/* Idade */}
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-purple-500" />
                  <span className="text-gray-300 text-sm">
                    {aluno.idade ? `${aluno.idade} anos` : 'Não informado'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Info do Treino */}
          <div className="text-right">
            <p className="text-gray-400 text-sm">Exercícios no treino</p>
            <p className="text-2xl font-bold text-white">{treino.length}</p>
          </div>
        </div>

        {/* Seletor de Dias da Semana */}
        <div className="flex space-x-2 overflow-x-auto">
          {diasSemana.map((dia) => (
            <button
              key={dia}
              onClick={() => mudarDia(dia)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                diaSelecionado === dia
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {dia}
            </button>
          ))}
        </div>
      </header>

      {/* Área de Trabalho */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Lado Esquerdo - Biblioteca de Exercícios */}
        <div className="w-full lg:w-1/2 bg-slate-900 border-r border-slate-800 flex flex-col">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-lg font-semibold text-white mb-4">Biblioteca de Exercícios</h2>
            
            {/* Busca */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar grupos musculares..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Accordion de Grupos Musculares */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-2">
              {Object.entries(BIBLIOTECA_EXERCICIOS)
                .filter(([grupo]) => 
                  grupo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  BIBLIOTECA_EXERCICIOS[grupo].some(exercicio => 
                    exercicio.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                )
                .map(([grupo, exercicios]) => (
                  <div key={grupo} className="border border-slate-700 rounded-lg overflow-hidden">
                    {/* Header do Accordion */}
                    <button
                      onClick={() => toggleGroup(grupo)}
                      className="w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 transition-colors duration-200 flex items-center justify-between"
                    >
                      <span className="text-white font-medium">{grupo}</span>
                      <span className="text-gray-400 text-sm">
                        {exercicios.length} exercícios
                      </span>
                      {expandedGroups.has(grupo) ? (
                        <ChevronDown size={18} className="text-emerald-500" />
                      ) : (
                        <ChevronRight size={18} className="text-gray-400" />
                      )}
                    </button>

                    {/* Conteúdo do Accordion */}
                    {expandedGroups.has(grupo) && (
                      <div className="bg-slate-900 border-t border-slate-700">
                        {exercicios.map((exercicio, index) => (
                          <div
                            key={index}
                            className="px-4 py-3 hover:bg-slate-800 transition-colors duration-200 flex items-center justify-between border-b border-slate-800 last:border-b-0"
                          >
                            <span className="text-gray-300">{exercicio}</span>
                            <button
                              onClick={() => adicionarExercicio(exercicio, grupo)}
                              className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-1"
                              title="Adicionar ao treino"
                            >
                              <Plus size={16} />
                              <span className="text-xs">Adicionar</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Lado Direito - Lista do Treino */}
        <div className="w-full lg:w-1/2 bg-slate-950 flex flex-col">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-lg font-semibold text-white">Treino do Dia</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {treino.length === 0 ? (
              <div className="text-center py-12">
                <Dumbbell size={48} className="text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">Nenhum exercício adicionado</p>
                <p className="text-gray-500 text-sm">
                  Clique nos exercícios da biblioteca para começar a montar o treino
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {treino.map((item, index) => (
                  <div key={item.treinoId} className="bg-slate-900 rounded-lg p-4 border border-slate-800">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{item.nome}</h3>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded">
                            {item.grupo}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removerExercicio(item.treinoId)}
                        className="p-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors duration-200"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Séries</label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={item.series}
                          onChange={(e) => atualizarExercicio(item.treinoId, 'series', parseInt(e.target.value))}
                          className="w-full px-2 py-1 bg-slate-800 border border-slate-700 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Repetições</label>
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={item.repeticoes}
                          onChange={(e) => atualizarExercicio(item.treinoId, 'repeticoes', parseInt(e.target.value))}
                          className="w-full px-2 py-1 bg-slate-800 border border-slate-700 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="block text-xs text-gray-400 mb-1">Observações</label>
                      <textarea
                        value={item.observacoes}
                        onChange={(e) => atualizarExercicio(item.treinoId, 'observacoes', e.target.value)}
                        placeholder="Instruções especiais..."
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                        rows="2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Área de Ações */}
          {treino.length > 0 && (
            <div className="p-6 border-t border-slate-800">
              <button
                onClick={salvarTreino}
                disabled={saving}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Dumbbell size={20} />
                <span>{saving ? 'Salvando...' : 'Salvar e Enviar Treino'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MontarTreino;
