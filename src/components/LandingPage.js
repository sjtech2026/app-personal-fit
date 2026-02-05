import React from 'react';
import { Dumbbell, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-4">
        {/* Botão Sou Aluno */}
        <button
          onClick={() => navigate('/aluno/login')}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-6 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 group"
        >
          <Dumbbell 
            size={28} 
            className="group-hover:rotate-12 transition-transform duration-300"
          />
          <span className="text-lg">Sou Aluno</span>
        </button>

        {/* Botão Acesso Personal */}
        <button
          onClick={() => navigate('/admin/login')}
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-6 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 group"
        >
          <ClipboardList 
            size={28} 
            className="group-hover:rotate-12 transition-transform duration-300"
          />
          <span className="text-lg">Acesso Personal</span>
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
