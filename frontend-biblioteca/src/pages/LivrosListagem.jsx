import React, { useState, useEffect } from 'react';
import { LivrosApi } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

// ==========================================================
// 1. Componente de Exibição do Livro (Card)
// ==========================================================
// Recebe o objeto livro e a função onDelete (do componente pai)
const LivroCard = ({ livro, onDelete, onEdit }) => {

    // Tratamento de data nula e formatação
    const dataPub = livro.data_publicacao
        ? new Date(livro.data_publicacao).toLocaleDateString('pt-BR')
        : 'Data Desconhecida';

    if (!livro) return null;

    return (
        <div className="livro-card">
            <h2 className="livro-titulo">{livro.titulo}</h2>

            <p className="livro-autor">Autor: {livro.autor_id ? livro.autor_id.nome : 'Desconhecido'}</p>

            <div className="livro-info">
                <p>
                    <strong>Gênero:</strong>
                    <span className="genero-tag">
                        {livro.genero_id ? livro.genero_id.genero : 'N/A'}
                    </span>
                </p>
                <p className="livro-publicacao">Publicação: {dataPub}</p>
            </div>

            {/* BOTÕES DE AÇÃO */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '10px',
                marginTop: '15px',
                paddingTop: '10px',
                borderTop: '1px solid #eee'
            }}>
                {/* Botão Editar */}
                <button
                    onClick={() => onEdit(livro._id)}
                    style={{
                        background: '#ffc107',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                    }}
                >
                    Editar
                </button>

                {/* Botão Excluir: Chama a função onDelete passada pelo componente pai */}
                <button
                    onClick={() => onDelete(livro._id, livro.titulo)}
                    style={{
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                    }}
                >
                    Excluir
                </button>
            </div>
        </div>
    );
};


// ==========================================================
// 2. Componente de Listagem Principal
// ==========================================================
const LivrosListagem = () => {
    const [livros, setLivros] = useState([]);
    const [filtroTitulo, setFiltroTitulo] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [erro, setErro] = useState(null);
    const navigate = useNavigate();

    // Função que chama a API para buscar livros
    const fetchLivros = async (titulo) => {
        setIsLoading(true);
        setErro(null);

        try {
            const dados = await LivrosApi.buscarTodosLivros(titulo);
            setLivros(dados);
        } catch (err) {
            console.error("Erro ao carregar livros:", err);
            setErro(err.message || 'Falha ao conectar com o servidor.');
            setLivros([]);
        } finally {
            setIsLoading(false);
        }
    };

    //Função para lidar com a edição (apenas navegação)
    const handleEditarLivro = (id) => {
        navigate(`/livros/editar/${id}`);
    };

    // FUNÇÃO DE DELEÇÃO (Implementação do D do CRUD)
    const handleDeletarLivro = async (id, tituloLivro) => {
        if (!window.confirm(`Tem certeza que deseja deletar o livro "${tituloLivro}"? Esta ação é irreversível.`)) return;

        // Define o estado para mostrar o loading ou feedback
        setIsLoading(true);
        setErro(null);

        try {
            await LivrosApi.deletarLivro(id);

            // Remove o livro deletado da lista localmente (melhor UX)
            setLivros(livros.filter(l => l._id !== id));
            // Opcional: Mostrar feedback de sucesso
            alert(`Livro "${tituloLivro}" deletado com sucesso!`);

        } catch (error) {
            console.error("Erro ao deletar livro:", error);
            setErro(`Erro ao deletar livro: ${error.message}`);
        } finally {
            // Se a lista estiver vazia após a deleção, o isLoading voltará a false
            // Se houve erro, o erro será exibido
            setIsLoading(false);
        }
    };


    // Efeito para carregar livros na montagem do componente
    useEffect(() => {
        fetchLivros(''); // Carrega todos os livros inicialmente
    }, []);

    // Função para buscar após o envio do formulário de filtro
    const handleFiltroSubmit = (e) => {
        e.preventDefault();
        fetchLivros(filtroTitulo);
    };


    return (
        <div className="livros-container" style={{ padding: '20px' }}>
            <h1 className="titulo-principal">Catálogo de Livros</h1>

            {/* ========================================================== */}
            {/* FORMULÁRIO DE BUSCA */}
            {/* ========================================================== */}
            <div className="filtro-container" style={{ marginBottom: '30px' }}>
                <form onSubmit={handleFiltroSubmit} className="busca-form" style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        className="busca-input"
                        placeholder="Digite parte do título do livro..."
                        value={filtroTitulo}
                        onChange={(e) => setFiltroTitulo(e.target.value)}
                        style={{ flexGrow: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                    <button type="submit" className="busca-button" style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '5px' }}>
                        Filtrar
                    </button>
                    <button type="button" className="limpar-button" onClick={() => {
                        setFiltroTitulo('');
                        fetchLivros('');     // Busca todos novamente
                    }} style={{ padding: '10px 20px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '5px' }}>
                        Mostrar Todos
                    </button>
                </form>
            </div>

            {/* ========================================================== */}
            {/* EXIBIÇÃO DE STATUS / ERRO */}
            {/* ========================================================== */}

            {isLoading && (
                <p style={{ textAlign: 'center', fontSize: '1.5rem', color: '#4f46e5' }}>
                    Carregando Livros... ⏳
                </p>
            )}

            {erro && (
                <div className="alerta-erro" style={{ padding: '15px', border: '1px solid #dc3545', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '5px', marginTop: '20px' }}>
                    <p>Ocorreu um erro: <strong>{erro}</strong></p>
                    <p>Verifique o console para mais detalhes ou se o seu backend está rodando em http://localhost:3000.</p>
                </div>
            )}

            {/* ========================================================== */}
            {/* LISTAGEM GERAL */}
            {/* ========================================================== */}

            {!isLoading && !erro && (
                <>
                    <p className="page-subtitle">Total de livros em exibição: {livros.length}</p>

                    <div className="livros-grid">
                        {livros.length > 0 ? (
                            livros.map(livro => (
                                <LivroCard
                                    key={livro._id}
                                    livro={livro}
                                    onDelete={handleDeletarLivro}
                                    onEdit={handleEditarLivro}
                                />
                            ))
                        ) : (
                            <p className="no-results" style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#888' }}>
                                Nenhum livro encontrado com o filtro aplicado.
                            </p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default LivrosListagem;