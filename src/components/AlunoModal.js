import React, { useState } from 'react';
import { X, Activity, Ruler, Calendar, User, Mail, Clock } from 'lucide-react';

const AlunoModal = ({ aluno, isOpen, onClose }) => {
  if (!isOpen || !aluno) return null;

  const formatarData = (dataString) => {
    if (!dataString) return 'Não informado';
    const date = new Date(dataString);
    return date.toLocaleDateString('pt-BR');
  };

  const calcularIMC = () => {
    if (aluno.peso && aluno.altura) {
      const alturaMetros = aluno.altura / 100;
      return (aluno.peso / (alturaMetros * alturaMetros)).toFixed(1);
    }
    return null;
  };

  const getClassificacaoIMC = (imc) => {
    if (!imc) return '';
    if (imc < 18.5) return 'Abaixo do peso';
    if (imc < 25) return 'Peso normal';
    if (imc < 30) return 'Sobrepeso';
    return 'Obesidade';
  };

  const imc = calcularIMC();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <User size={24} className="text-emerald-500" />
            <span>Dados do Aluno</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Informações Pessoais</h3>
              
              <div className="flex items-center space-x-3">
                <User className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-400">Nome</p>
                  <p className="text-white font-medium">{aluno.nome}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-400">E-mail</p>
                  <p className="text-white font-medium">aluno@exemplo.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-400">Cadastro</p>
                  <p className="text-white font-medium">{formatarData(aluno.created_at)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Dados Biométricos</h3>
              
              <div className="flex items-center space-x-3">
                <Activity className="text-blue-500" size={20} />
                <div>
                  <p className="text-sm text-gray-400">Peso</p>
                  <p className="text-white font-medium">
                    {aluno.peso ? `${aluno.peso} kg` : 'Não informado'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Ruler className="text-emerald-500" size={20} />
                <div>
                  <p className="text-sm text-gray-400">Altura</p>
                  <p className="text-white font-medium">
                    {aluno.altura ? `${aluno.altura} cm` : 'Não informado'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="text-purple-500" size={20} />
                <div>
                  <p className="text-sm text-gray-400">Idade</p>
                  <p className="text-white font-medium">
                    {aluno.idade ? `${aluno.idade} anos` : 'Não informado'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* IMC */}
          {imc && (
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Índice de Massa Corporal (IMC)</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">{imc}</p>
                  <p className="text-gray-400">kg/m²</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-medium ${
                    imc < 18.5 ? 'text-blue-400' :
                    imc < 25 ? 'text-emerald-400' :
                    imc < 30 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {getClassificacaoIMC(imc)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Status dos Dados */}
          <div className="bg-slate-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Status do Perfil</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${aluno.peso ? 'bg-emerald-500' : 'bg-gray-500'}`}></div>
                <span className="text-sm text-gray-300">Peso</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${aluno.altura ? 'bg-emerald-500' : 'bg-gray-500'}`}></div>
                <span className="text-sm text-gray-300">Altura</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${aluno.idade ? 'bg-emerald-500' : 'bg-gray-500'}`}></div>
                <span className="text-sm text-gray-300">Idade</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-4 p-6 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
          >
            Fechar
          </button>
          <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200">
            Montar Treino
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlunoModal;
