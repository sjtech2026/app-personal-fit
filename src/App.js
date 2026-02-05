import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AdminFirstAccess from './components/AdminFirstAccess';
import MontarTreino from './components/MontarTreino';
import AlunoLogin from './components/AlunoLogin';
import AlunoCadastro from './components/AlunoCadastro';
import AlunoDashboard from './components/AlunoDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/first-access" element={<AdminFirstAccess />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/montar-treino/:alunoId" element={<MontarTreino />} />
          <Route path="/aluno/login" element={<AlunoLogin />} />
          <Route path="/aluno/cadastro" element={<AlunoCadastro />} />
          <Route path="/aluno/dashboard" element={<AlunoDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
