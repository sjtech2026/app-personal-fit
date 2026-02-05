import React, { useState } from 'react';
import { Dumbbell, Calendar, Clock, X, ChevronRight, Target } from 'lucide-react';

const TreinosAluno = ({ treinos, onTreinoClick }) => {
  const [selectedTreino, setSelectedTreino] = useState(null);

  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  
  // Obter o dia atual
  const getDiaAtual = () => {
    const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return dias[new Date().getDay()];
  };

  const diaAtual = getDiaAtual();

  // Organizar treinos por dia da semana
  const treinosPorDia = diasSemana.map(dia => {
    const treinoDoDia = treinos.find(t => t.dia_semana === dia);
    return {
      dia,
      treino: treinoDoDia,
      isHoje: dia === diaAtual
    };
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCardClick = (treino) => {
    setSelectedTreino(treino);
    onTreinoClick(treino);
  };

  const getExerciciosCount = (exercicios) => {
    return Array.isArray(exercicios) ? exercicios.length : 0;
  };

  const getGrupoPrincipal = (exercicios) => {
    if (!Array.isArray(exercicios) || exercicios.length === 0) return '';
    const grupos = exercicios.map(e => e.grupo).filter(Boolean);
    const gruposCount = {};
    grupos.forEach(grupo => {
      gruposCount[grupo] = (gruposCount[grupo] || 0) + 1;
    });
    return Object.keys(gruposCount).reduce((a, b) => gruposCount[a] > gruposCount[b] ? a : b, '');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
        <Dumbbell size={24} className="text-emerald-500" />
        <span>Meus Treinos da Semana</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {treinosPorDia.map(({ dia, treino, isHoje }) => (
          <div
            key={dia}
            className={`relative rounded-xl border transition-all duration-200 ${
              isHoje 
                ? 'border-emerald-500 shadow-lg shadow-emerald-500/20 bg-slate-800' 
                : 'border-slate-700 bg-slate-900'
            }`}
          >
            {/* Destaque do dia atual */}
            {isHoje && (
              <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                HOJE
              </div>
            )}

            {treino ? (
              <div
                onClick={() => handleCardClick(treino)}
                className="p-4 cursor-pointer hover:border-emerald-600 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-1 group-hover:text-emerald-400 transition-colors duration-200 ${
                      isHoje ? 'text-white text-lg' : 'text-white'
                    }`}>
                      {dia}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar size={12} />
                        <span>{formatDate(treino.data_criacao)}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight 
                    size={16} 
                    className={`transition-all duration-200 ${
                      isHoje ? 'text-emerald-400' : 'text-gray-500 group-hover:text-emerald-500'
                    } group-hover:translate-x-1`} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Dumbbell size={14} className={isHoje ? 'text-emerald-400' : 'text-emerald-500'} />
                    <span className={`text-sm ${isHoje ? 'text-gray-200' : 'text-gray-300'}`}>
                      {getExerciciosCount(treino.exercicios)} exercícios
                    </span>
                  </div>
                  {getGrupoPrincipal(treino.exercicios) && (
                    <div className={`text-xs px-2 py-1 rounded ${
                      isHoje 
                        ? 'bg-emerald-600/30 text-emerald-300' 
                        : 'bg-emerald-600/20 text-emerald-400'
                    }`}>
                      {getGrupoPrincipal(treino.exercicios)}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 text-center">
                <div className={`font-medium mb-2 ${isHoje ? 'text-white text-lg' : 'text-gray-300'}`}>
                  {dia}
                </div>
                <div className={`text-sm ${isHoje ? 'text-gray-300' : 'text-gray-500'}`}>
                  {isHoje ? 'Dia de descanso ou cardio!' : 'Sem treino'}
                </div>
                {isHoje && (
                  <div className="mt-2">
                    <Target size={24} className="text-emerald-400 mx-auto" />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TreinosAluno;
