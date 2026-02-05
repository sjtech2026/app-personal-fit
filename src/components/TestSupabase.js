import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';

const TestSupabase = () => {
  const [logs, setLogs] = useState([]);

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, { message, type, timestamp: new Date().toLocaleTimeString() }]);
  };

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    addLog('Iniciando testes de conexão com Supabase...', 'info');
    
    try {
      // Testar conexão básica
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        addLog(`Erro de autenticação: ${authError.message}`, 'error');
      } else {
        addLog(`Usuário autenticado: ${user?.email || 'Nenhum'}`, 'success');
      }

      // Testar busca na tabela perfis
      addLog('Buscando todos os perfis...', 'info');
      const { data: allPerfis, error: allPerfisError } = await supabase
        .from('perfis')
        .select('*');

      if (allPerfisError) {
        addLog(`Erro ao buscar todos os perfis: ${allPerfisError.message}`, 'error');
      } else {
        addLog(`Total de perfis encontrados: ${allPerfis?.length || 0}`, 'success');
        allPerfis?.forEach(perfil => {
          addLog(`- ${perfil.nome} (${perfil.tipo})`, 'info');
        });
      }

      // Testar busca específica de alunos
      addLog('Buscando apenas alunos...', 'info');
      const { data: alunos, error: alunosError } = await supabase
        .from('perfis')
        .select('*')
        .eq('tipo', 'aluno');

      if (alunosError) {
        addLog(`Erro ao buscar alunos: ${alunosError.message}`, 'error');
      } else {
        addLog(`Total de alunos encontrados: ${alunos?.length || 0}`, 'success');
        alunos?.forEach(aluno => {
          addLog(`- ${aluno.nome} (criado em: ${aluno.created_at})`, 'info');
        });
      }

      // Testar permissões
      addLog('Verificando permissões RLS...', 'info');
      const { data: rlsTest, error: rlsError } = await supabase
        .from('perfis')
        .select('id, nome, tipo')
        .limit(1);

      if (rlsError) {
        addLog(`Erro de permissão RLS: ${rlsError.message}`, 'error');
      } else {
        addLog('Permissões RLS OK', 'success');
      }

    } catch (error) {
      addLog(`Erro geral: ${error.message}`, 'error');
    }
  };

  const getLogColor = (type) => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'success': return 'text-green-400';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 bg-slate-900 border border-slate-700 rounded-lg p-4 overflow-hidden">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white font-semibold">Teste Supabase</h3>
        <button
          onClick={testConnection}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
        >
          Testar Novamente
        </button>
      </div>
      <div className="overflow-y-auto max-h-80 space-y-1">
        {logs.map((log, index) => (
          <div key={index} className={`text-xs ${getLogColor(log.type)}`}>
            <span className="text-gray-500">[{log.timestamp}]</span> {log.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestSupabase;
