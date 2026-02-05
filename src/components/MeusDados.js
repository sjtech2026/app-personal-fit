import React, { useState, useEffect } from 'react';
import { User, Edit2, Save, X, Activity, Ruler, Calendar } from 'lucide-react';
import { supabase } from '../supabase';

const MeusDados = ({ perfil }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    peso: '',
    altura: '',
    idade: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (perfil) {
      setFormData({
        peso: perfil.peso || '',
        altura: perfil.altura || '',
        idade: perfil.idade || ''
      });
    }
  }, [perfil]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validação para permitir apenas números e pontos
    if (name === 'peso' || name === 'altura') {
      const regex = /^\d*\.?\d*$/;
      if (value === '' || regex.test(value)) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else if (name === 'idade') {
      const regex = /^\d*$/;
      if (value === '' || regex.test(value)) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    }
    
    setError('');
    setSuccess(false);
  };

  const validateForm = () => {
    if (!formData.peso || parseFloat(formData.peso) <= 0) {
      setError('Peso deve ser um valor maior que 0');
      return false;
    }
    
    if (!formData.altura || parseFloat(formData.altura) <= 0) {
      setError('Altura deve ser um valor maior que 0');
      return false;
    }
    
    if (!formData.idade || parseInt(formData.idade) <= 0 || parseInt(formData.idade) > 120) {
      setError('Idade deve estar entre 1 e 120 anos');
      return false;
    }
    
    return true;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('perfis')
        .update({
          peso: parseFloat(formData.peso),
          altura: parseFloat(formData.altura),
          idade: parseInt(formData.idade)
        })
        .eq('id', perfil.id)
        .select()
        .single();

      if (error) {
        setError('Erro ao atualizar dados: ' + error.message);
      } else {
        console.log('Dados atualizados:', data);
        setSuccess(true);
        setIsEditing(false);
        
        // Limpar mensagem de sucesso após 3 segundos
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }
    } catch (err) {
      setError('Erro ao salvar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Restaurar valores originais
    setFormData({
      peso: perfil.peso || '',
      altura: perfil.altura || '',
      idade: perfil.idade || ''
    });
    setIsEditing(false);
    setError('');
    setSuccess(false);
  };

  const hasData = perfil.peso || perfil.altura || perfil.idade;

  if (isEditing) {
    return (
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <User size={20} className="text-blue-500" />
            <span>Meus Dados</span>
          </h3>
          <button
            onClick={handleCancel}
            className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors duration-200"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Peso */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Activity size={16} className="inline mr-1" />
                Peso (kg)
              </label>
              <input
                type="text"
                name="peso"
                value={formData.peso}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="80.5"
                step="0.1"
                required
              />
            </div>

            {/* Altura */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Ruler size={16} className="inline mr-1" />
                Altura (cm)
              </label>
              <input
                type="text"
                name="altura"
                value={formData.altura}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="180"
                required
              />
            </div>

            {/* Idade */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Idade
              </label>
              <input
                type="text"
                name="idade"
                value={formData.idade}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="25"
                required
              />
            </div>
          </div>

          {/* Mensagens */}
          {error && (
            <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-900/20 border border-emerald-800 text-emerald-400 px-4 py-3 rounded-lg text-sm">
              Dados atualizados com sucesso!
            </div>
          )}

          {/* Botões */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <Save size={18} />
              <span>{loading ? 'Salvando...' : 'Salvar'}</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <User size={20} className="text-blue-500" />
          <span>Meus Dados</span>
        </h3>
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors duration-200"
        >
          {hasData ? <Edit2 size={18} /> : <span className="text-sm px-3 py-1">Completar Perfil</span>}
        </button>
      </div>

      {hasData ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Activity className="text-blue-500" size={20} />
              <span className="text-gray-400 text-sm">Peso</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {perfil.peso ? `${perfil.peso} kg` : 'Não informado'}
            </p>
          </div>

          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Ruler className="text-emerald-500" size={20} />
              <span className="text-gray-400 text-sm">Altura</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {perfil.altura ? `${perfil.altura} cm` : 'Não informado'}
            </p>
          </div>

          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Calendar className="text-purple-500" size={20} />
              <span className="text-gray-400 text-sm">Idade</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {perfil.idade ? `${perfil.idade} anos` : 'Não informado'}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <User size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">
            Complete seu perfil com seus dados biométricos
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto"
          >
            <Edit2 size={18} />
            <span>Completar Perfil</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MeusDados;
