import { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css'; // ⬅️ Importa o CSS Simples

// ⚠️ ATENÇÃO: Defina a URL base da sua API
const API_URL = 'http://localhost:3000/api/livros';

function App() {
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLivros = async () => {
    try {
      const response = await axios.get(API_URL);
      setLivros(response.data.dados);
      setLoading(false);
    } catch (err) {
      setError('Erro ao buscar dados da API. Verifique se o backend está rodando e se a URL está correta.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLivros();
  }, []);

  // --- RENDERING (Visualização) ---

  if (loading) {
    return <div className="app-container text-center text-lg">Carregando livros...</div>;
  }

  if (error) {
    return <div className="app-container text-center text-red-600 font-bold">{error}</div>;
  }

  return (
    <div className="app-container">
      <h1 className="titulo-principal">📚 Catálogo de Livros</h1>

      <div className="livros-grid">
        {livros.map(livro => (
          <LivroCard key={livro._id} livro={livro} />
        ))}
      </div>
    </div>
  );
}


// Componente Simples para a visualização de cada Livro
const LivroCard = ({ livro }) => {
  // Formata a data para algo legível
  const dataPub = new Date(livro.data_publicacao).toLocaleDateString('pt-BR');

  return (
    <div className="livro-card">
      <h2 className="livro-titulo">{livro.titulo}</h2>

      <p className="livro-autor">
        Autor: {livro.autor_id ? livro.autor_id.nome : 'Desconhecido'}
      </p>

      <div className="space-y-2 livro-info">
        <p>
          <strong>Gênero:</strong>
          <span className="genero-tag">
            {livro.genero_id ? livro.genero_id.genero : 'N/A'}
          </span>
        </p>
        <p>
          <strong>Publicação:</strong> {dataPub}
        </p>
        <p>
          <strong>Criado em:</strong> {new Date(livro.createdAt).toLocaleDateString('pt-BR')}
        </p>
      </div>
    </div>
  );
};

export default App;