import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componentes
import Header from './components/Header';

// Páginas
import Home from './pages/Home';
import LivrosListagem from './pages/LivrosListagem';
import CadastroAutores from './pages/CadastroAutores'; // NOVO IMPORT
import CadastroGeneros from './pages/CadastroGeneros';
import CadastroLivros from './pages/CadastroLivros';
import EditarLivro from './pages/EditarLivro';

// Página Placeholder (Mantida para as rotas ainda não implementadas)
const CadastroPlaceholder = () => (
  <div className="page-container" style={{ textAlign: 'center', marginTop: '50px' }}>
    <h2 className="titulo-principal" style={{ color: '#ef4444' }}>⚠️ Em Desenvolvimento</h2>
    <p style={{ fontSize: '1.2rem', color: '#4b5563' }}>Esta página de cadastro será implementada em breve.</p>
  </div>
);


function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/livros" element={<LivrosListagem />} />

          {/* Rotas de Cadastro */}
          <Route path="/cadastro/generos" element={<CadastroGeneros />} />
          <Route path="/cadastro/autores" element={<CadastroAutores />} /> 
          <Route path="/cadastro/livros" element={<CadastroLivros />} />

          {/* Rota de EDIÇÃO (COM PARÂMETRO ID) */}
          <Route path="/livros/editar/:id" element={<EditarLivro />} />

          {/* Rota para páginas não encontradas */}
          <Route path="*" element={<h1 style={{ textAlign: 'center', marginTop: '100px' }}>404 - Página Não Encontrada</h1>} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;