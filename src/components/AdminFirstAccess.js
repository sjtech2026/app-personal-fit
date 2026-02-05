import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminFirstAccess = () => {
  const [formData, setFormData] = useState({
    usuario: '',
    novaSenha: '',
    confirmarSenha: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.usuario.trim()) {
      setError('O campo usuário é obrigatório');
      return false;
    }
    
    if (formData.novaSenha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    
    if (formData.novaSenha !== formData.confirmarSenha) {
      setError('As senhas não coincidem');
      return false;
    }
    
    if (formData.usuario === 'admin' || formData.usuario.toLowerCase() === 'admin') {
      setError('Escolha um usuário diferente de "admin" para maior segurança');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Salvar novas credenciais no localStorage
      localStorage.setItem('admin_user', formData.usuario);
      localStorage.setItem('admin_password', formData.novaSenha);
      localStorage.setItem('is_first_access', 'false');
      localStorage.setItem('is_admin', 'true');
      
      console.log('Novas credenciais salvas:', {
        usuario: formData.usuario,
        senha: formData.novaSenha
      });

      setSuccess(true);
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 2000);
      
    } catch (err) {
      setError('Erro ao salvar configurações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-800 text-center">
            <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Configurações Salvas!
            </h2>
            <p className="text-gray-400 mb-6">
              Suas credenciais foram atualizadas com sucesso.
            </p>
            <p className="text-gray-500 text-sm">
              Redirecionando para o dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-800">
          {/* Header com Alerta */}
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="text-orange-500" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Configuração de Acesso
            </h2>
            <div className="bg-orange-900/20 border border-orange-800 rounded-lg p-4 mb-6">
              <p className="text-orange-400 text-sm font-medium flex items-center justify-center space-x-2">
                <Lock size={16} />
                <span>Por segurança, altere suas credenciais padrão antes de prosseguir</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Novo Usuário */}
            <div>
              <label htmlFor="usuario" className="block text-sm font-medium text-gray-300 mb-2">
                Novo Usuário
              </label>
              <input
                type="text"
                id="usuario"
                name="usuario"
                value={formData.usuario}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="Digite seu novo usuário"
                required
              />
            </div>

            {/* Campo Nova Senha */}
            <div>
              <label htmlFor="novaSenha" className="block text-sm font-medium text-gray-300 mb-2">
                Nova Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="novaSenha"
                  name="novaSenha"
                  value={formData.novaSenha}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 pr-12"
                  placeholder="Digite sua nova senha (mínimo 6 caracteres)"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Campo Confirmar Nova Senha */}
            <div>
              <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-300 mb-2">
                Confirme a Nova Senha
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmarSenha"
                  name="confirmarSenha"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 pr-12"
                  placeholder="Confirme sua nova senha"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Mensagem de Erro */}
            {error && (
              <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Botão de Salvar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:scale-100 transition-all duration-300 flex items-center justify-center space-x-2 group"
            >
              <Shield 
                size={20} 
                className="group-hover:scale-110 transition-transform duration-200"
              />
              <span>{loading ? 'Salvando...' : 'Salvar Configurações'}</span>
            </button>
          </form>

          {/* Informações Adicionais */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-xs">
              Após salvar, você usará suas novas credenciais para acessar o sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFirstAccess;
