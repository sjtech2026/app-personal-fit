# Personal Trainer PWA

Um PWA (Progressive Web App) para Personal Trainers desenvolvido com React e Tailwind CSS.

## 🚀 Funcionalidades

### Tela Inicial (Landing Page)
- Design mobile-first com tema escuro (bg-slate-950)
- Dois botões grandes e elegantes centralizados:
  - **Sou Aluno**: Botão visualmente pronto (sem função por enquanto)
  - **Acesso Personal**: Navega para o formulário de login
- Ícones da biblioteca lucide-react
- Efeitos hover suaves e responsivos

### Sistema de Login (Híbrido)
- Validação local de credenciais
- Credenciais padrão: `admin` / `admin`
- Armazenamento de sessão no localStorage
- Redirecionamento automático para dashboard após login

### Dashboard Admin
- Interface completa para gestão do Personal Trainer
- Cards de estatísticas
- Ações rápidas
- Sistema de logout

## 🛠️ Tecnologias

- **React 18** - Biblioteca principal
- **React Router DOM** - Navegação entre rotas
- **Tailwind CSS** - Estilização e design responsivo
- **Lucide React** - Ícones modernos
- **localStorage** - Persistência de sessão

## 📱 Mobile First

O aplicativo foi desenvolvido com abordagem mobile-first, garantindo:
- Botões com largura quase total em dispositivos móveis
- Facilidade de toque e navegação
- Layout responsivo para todos os tamanhos de tela

## 🚀 Como Executar

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm start
```

3. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🔐 Acesso

- **Aluno**: Botão "Sou Aluno" (sem função no momento)
- **Personal**: Clique em "Acesso Personal" e use:
  - Usuário: `admin`
  - Senha: `admin`

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── LandingPage.js      # Tela inicial
│   ├── AdminLogin.js       # Formulário de login
│   └── AdminDashboard.js   # Dashboard do personal
├── App.js                  # Configuração de rotas
├── index.js               # Ponto de entrada
└── index.css              # Estilos globais
```

## 🎨 Design System

- **Cores**: Tema escuro com slate-950 como base
- **Botões**: Gradientes com efeitos hover
- **Ícones**: Lucide React
- **Transições**: Animações suaves de 300ms
- **Responsividade**: Breakpoints do Tailwind CSS
