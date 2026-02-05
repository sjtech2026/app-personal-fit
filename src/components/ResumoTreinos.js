import React from 'react';
import { Dumbbell, Calendar } from 'lucide-react';
import { supabase } from '../supabase';

const ResumoTreinos = ({ alunoId }) => {
  const [resumo, setResumo] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchResumo();
  }, [alunoId]);

  const fetchResumo = async () => {
    try {
      const { data, error } = await supabase
        .from('treinos')
        .select('dia_semana, exercicios')
        .eq('aluno_id', alunoId);

      if (error) {
        console.error('Erro ao buscar resumo:', error);
      } else {
        const resumoData = {};
        data.forEach(treino => {
          if (Array.isArray(treino.exercicios) && treino.exercicios.length > 0) {
            // Obter o grupo principal do treino
            const grupos = treino.exercicios.map(e => e.grupo).filter(Boolean);
            const gruposCount = {};
            grupos.forEach(grupo => {
              gruposCount[grupo] = (gruposCount[grupo] || 0) + 1;
            });
            const grupoPrincipal = Object.keys(gruposCount).reduce((a, b) => 
              gruposCount[a] > gruposCount[b] ? a : b, ''
            );
            
            resumoData[treino.dia_semana] = grupoPrincipal;
          } else {
            resumoData[treino.dia_semana] = 'Descanso';
          }
        });
        setResumo(resumoData);
      }
    } catch (error) {
      console.error('Erro geral:', error);
    } finally {
      setLoading(false);
    }
  };

  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  if (loading) {
    return (
      <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
        <div className="text-gray-400 text-sm">Carregando resumo...</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
      <div className="flex items-center space-x-2 mb-3">
        <Calendar size={16} className="text-emerald-500" />
        <h3 className="text-sm font-semibold text-white">Resumo da Semana</h3>
      </div>
      
      <div className="space-y-1">
        {diasSemana.map(dia => (
          <div key={dia} className="flex items-center justify-between text-xs">
            <span className="text-gray-400">{dia}:</span>
            <span className={`font-medium ${
              resumo[dia] === 'Descanso' 
                ? 'text-gray-500' 
                : 'text-emerald-400'
            }`}>
              {resumo[dia] || 'Sem treino'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumoTreinos;
