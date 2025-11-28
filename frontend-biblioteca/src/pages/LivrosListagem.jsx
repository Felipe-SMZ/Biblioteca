import React, { useState, useEffect } from 'react';
import axios from 'axios';

// URL base da API
const API_URL = 'http://localhost:3000/api/livros';

// ==========================================================
// 1. Componente de Exibição do Livro (Card)
// ==========================================================
const LivroCard = ({ livro }) => {
    // Tratamento de data nula e formatação
    const dataPub = livro.data_publicacao 
        ? new Date(livro.data_publicacao).toLocaleDateString('pt-BR') 
        : 'Data Desconhecida';

    // Se o livro for nulo ou undefined, retorna null (segurança)
    if (!livro) return null;

    return (
        <div className="livro-card">
            <h2 className="livro-titulo">{livro.titulo}</h2>
            {/* Exibe o ID (útil para testes de Busca por ID) */}
            <p className="livro-id-display">ID: {livro._id}</p>
            
            <p className="livro-autor">Autor: {livro.autor_id ? livro.autor_id.nome : 'Desconhecido'}</p>
            <div className="livro-info">
                <p>
                    <strong>Gênero:</strong>
                    <span className="genero-tag">
                        {livro.genero_id ? livro.genero_id.genero : 'N/A'}
                    </span>
                </p>
                <p>
                    <strong>Publicação:</strong> {dataPub}
                </p>
            </div>
            {/* ⚠️ FUTURO: Botões de Editar e Excluir aqui */}
        </div>
    );
};


// ==========================================================
// 2. Componente Principal de Listagem
// ==========================================================
const LivrosListagem = () => {
    // --- ESTADOS DA LISTAGEM GERAL E FILTRO POR TÍTULO ---
    const [livros, setLivros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtroTitulo, setFiltroTitulo] = useState(''); // Termo de busca no filtro

    // --- ESTADOS DA BUSCA RÁPIDA POR ID ---
    const [buscaId, setBuscaId] = useState(''); // ID digitado
    const [livroBuscado, setLivroBuscado] = useState(null); // Livro único encontrado
    const [erroBuscaId, setErroBuscaId] = useState(null); // Erro específico da busca por ID


    // 3. FUNÇÃO DE BUSCA DE LIVROS (SUPORTA FILTRO POR TÍTULO)
    const fetchLivros = async (titulo = '') => { 
        setLoading(true);
        setError(null);
        setLivros([]); // Limpa a lista antes de nova busca

        let urlBusca = API_URL;

        // Se o título não for vazio, adiciona o Query Parameter para filtragem
        if (titulo.trim()) {
            urlBusca = `${API_URL}?titulo=${encodeURIComponent(titulo.trim())}`; 
            // Usamos encodeURIComponent para garantir que caracteres especiais funcionem na URL
        }

        try {
            const response = await axios.get(urlBusca);
            setLivros(response.data.dados);
            setLoading(false);
        } catch (err) {
            setError('Erro ao buscar dados da API. Verifique se o backend está rodando.');
            setLoading(false);
        }
    };


    // 4. FUNÇÃO DE BUSCA POR ID (Busca um único livro)
    const buscarPorId = async (e) => {
        e.preventDefault(); // Evita que o formulário recarregue a página
        setLivroBuscado(null);
        setErroBuscaId(null);
        
        if (!buscaId.trim()) {
            setErroBuscaId('Por favor, digite um ID para buscar.');
            return;
        }

        try {
            // Requisição com o ID como Parâmetro de Rota
            const response = await axios.get(`${API_URL}/${buscaId.trim()}`);
            setLivroBuscado(response.data.dados); 
            
        } catch (error) {
            // Tratamento de erro 404 (Não Encontrado)
            if (error.response && error.response.status === 404) {
                setErroBuscaId(`Livro não encontrado com o ID: ${buscaId}`);
            } else {
                setErroBuscaId('Erro na comunicação com a API ao buscar por ID.');
            }
        }
    };


    // 5. EFEITO INICIAL (Carrega todos os livros na montagem)
    useEffect(() => {
        // Chamada inicial sem filtro
        fetchLivros(''); 
    }, []); 

    // 6. RENDERIZAÇÃO
    
    // Mensagens de estado
    if (loading) {
        return <div className="loading-message">Carregando livros...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="page-container">
            <h1 className="titulo-principal">📖 Catálogo de Livros</h1>
            
            {/* ========================================================== */}
            {/* INTERFACE DE BUSCA RÁPIDA POR ID (Aula 3) */}
            {/* ========================================================== */}
            <div className="busca-id-section">
                <h2 className="busca-id-title">🔍 Busca Rápida por ID</h2>
                <form className="busca-form-id" onSubmit={buscarPorId}>
                    <input
                        type="text"
                        className="busca-input"
                        placeholder="Digite o ID do livro (ex: 692a03a3...)"
                        value={buscaId}
                        onChange={(e) => setBuscaId(e.target.value)}
                    />
                    <button type="submit" className="busca-button">
                        Buscar ID
                    </button>
                    <button type="button" className="limpar-button" onClick={() => {
                         setBuscaId('');
                         setLivroBuscado(null);
                         setErroBuscaId(null);
                    }}>
                        Limpar Busca
                    </button>
                </form>

                {erroBuscaId && <p className="error-message-id">{erroBuscaId}</p>}

                {/* Exibição do Livro Único Encontrado */}
                {livroBuscado && (
                    <div className="resultado-busca-id">
                        <h3 className="titulo-resultado">Resultado Encontrado:</h3>
                        <div className="livros-grid-single">
                            <LivroCard livro={livroBuscado} />
                        </div>
                    </div>
                )}
            </div>
            
            {/* ========================================================== */}
            {/* INTERFACE DE FILTRO POR TÍTULO (Aula 2) */}
            {/* ========================================================== */}
            <div className="filtro-section">
                <h2 className="busca-id-title">📝 Filtrar por Título</h2>
                <form className="busca-form-titulo" onSubmit={(e) => {
                    e.preventDefault(); 
                    fetchLivros(filtroTitulo); // Dispara a busca com o termo
                    setLivroBuscado(null); // Garante que a busca por ID seja limpa
                }}>
                    <input
                        type="text"
                        className="busca-input"
                        placeholder="Digite parte do título do livro..."
                        value={filtroTitulo}
                        onChange={(e) => setFiltroTitulo(e.target.value)} 
                    />
                    <button type="submit" className="busca-button">
                        Filtrar
                    </button>
                    <button type="button" className="limpar-button" onClick={() => {
                         setFiltroTitulo(''); 
                         fetchLivros('');     // Busca todos novamente
                    }}>
                        Mostrar Todos
                    </button>
                </form>
            </div>
            
            {/* ========================================================== */}
            {/* LISTAGEM GERAL (Resultado do Filtro ou Todos) */}
            {/* ========================================================== */}
            <p className="page-subtitle">Total de livros em exibição: {livros.length}</p>

            <div className="livros-grid">
                {livros.length > 0 ? (
                    livros.map(livro => (
                        <LivroCard key={livro._id} livro={livro} />
                    ))
                ) : (
                    <p className="no-results">Nenhum livro encontrado com o filtro aplicado.</p>
                )}
            </div>
        </div>
    );
};

export default LivrosListagem;