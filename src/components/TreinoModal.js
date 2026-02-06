import React from 'react';
import { X, Dumbbell, Clock, Calendar, PlayCircle, Repeat, Target, Timer } from 'lucide-react';

const TreinoModal = ({ treino, isOpen, onClose }) => {
  const [videoModal, setVideoModal] = React.useState({ isOpen: false, exerciseName: '' });

  if (!isOpen || !treino) return null;

  const openVideoModal = (exerciseName) => {
    setVideoModal({ isOpen: true, exerciseName });
  };

  const closeVideoModal = () => {
    setVideoModal({ isOpen: false, exerciseName: '' });
  };

  // Função para formatar o caminho do GIF
  const getGifPath = (exerciseName) => {
    if (!exerciseName) return '';
    
    // Converter para minúsculo, remover acentos e hífens, substituir espaços por hífens
    const formattedName = exerciseName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/\s+/g, '-'); // Substitui espaços por hífens
    
    return `/exercicios/${formattedName}.gif`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
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

  const getExercicios = () => {
    return Array.isArray(treino.exercicios) ? treino.exercicios : [];
  };

  const exercicios = getExercicios();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{treino.nome_treino}</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Calendar size={16} />
                <span>{formatDate(treino.data_criacao)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock size={16} />
                <span>{formatTime(treino.data_criacao)}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          {/* Resumo */}
          <div className="bg-slate-800 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Dumbbell size={24} className="text-emerald-500" />
                <div>
                  <p className="text-2xl font-bold text-white">{exercicios.length}</p>
                  <p className="text-gray-400 text-sm">Exercícios</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-medium text-emerald-400">Treino Completo</p>
                <p className="text-gray-400 text-sm">Status</p>
              </div>
            </div>
          </div>

          {/* Lista de Exercícios */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Exercícios do Treino</h3>
            
            {exercicios.length === 0 ? (
              <div className="text-center py-8">
                <Dumbbell size={48} className="text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Nenhum exercício encontrado neste treino</p>
              </div>
            ) : (
              exercicios.map((exercicio, index) => (
                <div key={exercicio.treinoId || index} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-lg font-bold text-emerald-500">#{index + 1}</span>
                        <h4 className="text-lg font-semibold text-white">{exercicio.nome}</h4>
                        <button
                          onClick={() => openVideoModal(exercicio.nome)}
                          className="p-1 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-600/20 rounded-lg transition-all duration-200"
                          title="Ver vídeo de execução"
                        >
                          <PlayCircle size={18} />
                        </button>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded">
                          {exercicio.grupo}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Repeat size={16} className="text-emerald-500" />
                      <div>
                        <p className="text-xs text-gray-400">Séries</p>
                        <p className="text-white font-medium">{exercicio.series || 3}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Target size={16} className="text-blue-500" />
                      <div>
                        <p className="text-xs text-gray-400">Repetições</p>
                        <p className="text-white font-medium">{exercicio.repeticoes || 12}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Timer size={16} className="text-purple-500" />
                      <div>
                        <p className="text-xs text-gray-400">Descanso</p>
                        <p className="text-white font-medium">{exercicio.descanso || 60}s</p>
                      </div>
                    </div>
                  </div>

                  {exercicio.observacoes && (
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <p className="text-xs text-gray-400 mb-1">Observações</p>
                      <p className="text-gray-300 text-sm">{exercicio.observacoes}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
          >
            Fechar
          </button>
        </div>
      </div>

      {/* Modal de Vídeo */}
      {videoModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-slate-700 max-w-md w-full">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-white">{videoModal.exerciseName}</h3>
              <button
                onClick={closeVideoModal}
                className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Conteúdo */}
            <div className="p-6">
              {/* Placeholder do Vídeo */}
              <div className="bg-slate-800 rounded-lg h-48 flex items-center justify-center mb-6">
                <img 
                  src={getGifPath(videoModal.exerciseName)} 
                  alt={videoModal.exerciseName}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '';
                  }}
                />
              </div>

              {/* Botão Fechar */}
              <button
                onClick={closeVideoModal}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg transition-colors duration-200 font-medium"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreinoModal;
