import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componentes
import Header from './components/Header';

// Páginas
import Home from './pages/Home';
import LivrosListagem from './pages/LivrosListagem';

// Página Placeholder para Cadastro
const CadastroPlaceholder = () => (
  <div className="page-container" style={{ textAlign: 'center', marginTop: '50px' }}>
    <h2 className="titulo-principal" style={{ color: '#ef4444' }}>⚠️ Em Desenvolvimento</h2>
    <p style={{ fontSize: '1.2rem', color: '#4b5563' }}>Esta página de cadastro será implementada em breve.</p>
  </div>
);


function App() {
  return (
    <Router>
      <Header /> {/* O Header é exibido em todas as páginas */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/livros" element={<LivrosListagem />} />

          {/* Rotas Placeholder de Cadastro */}
          <Route path="/cadastro/generos" element={<CadastroPlaceholder />} />
          <Route path="/cadastro/autores" element={<CadastroPlaceholder />} />
          <Route path="/cadastro/livros" element={<CadastroPlaceholder />} />

          {/* Rota para páginas não encontradas (Opcional) */}
          <Route path="*" element={<h1 style={{ textAlign: 'center', marginTop: '100px' }}>404 - Página Não Encontrada</h1>} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;