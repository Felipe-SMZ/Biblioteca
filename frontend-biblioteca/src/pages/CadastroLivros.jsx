// ... (imports)
import React, { useState, useEffect } from 'react';
import { LivrosApi } from '../services/apiService'; // Certifique-se de que o import está correto

// ==========================================================
// 1. Componente de Exibição do Livro (Card) - ADICIONADO BOTÕES
// ==========================================================
const LivroCard = ({ livro, onDelete }) => { // Recebe onDelete como prop
    const dataPub = livro.data_publicacao
        ? new Date(livro.data_publicacao).toLocaleDateString('pt-BR')
        : 'Data Desconhecida';

    if (!livro) return null;

    return (
        <div className="livro-card">
            <h2 className="livro-titulo">{livro.titulo}</h2>

            <p className="livro-autor">Autor: {livro.autor_id ? livro.autor_id.nome : 'Desconhecido'}</p>

            <div className="livro-info">
                {/* ... (Gênero e Publicação) ... */}
            </div>
            <p className="livro-publicacao">Publicação: {dataPub}</p>

            {/* NOVOS BOTÕES DE AÇÃO */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }}>
                {/* O botão Editar pode ser um link para a página de edição de livros */}
                <button
                    onClick={() => alert('Implementar navegação para Edição de Livro ID: ' + livro._id)}
                    style={{ background: '#ffc107', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Editar
                </button>
                <button
                    onClick={() => onDelete(livro._id, livro.titulo)} // Chama a função de deleção que está no componente pai
                    style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Excluir
                </button>
            </div>
        </div>
    );
};


// ==========================================================
// 2. Componente de Listagem Principal - ADICIONADO HANDLE DELETE
// ==========================================================
const LivrosListagem = () => {
    // ... (Estados: livros, filtroTitulo, isLoading, erro)
    const [livros, setLivros] = useState([]);
    const [filtroTitulo, setFiltroTitulo] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [erro, setErro] = useState(null);

    // Função que chama a API
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

    // NOVO: Função para deletar um livro
    const handleDeletarLivro = async (id, tituloLivro) => {
        if (!window.confirm(`Tem certeza que deseja deletar o livro "${tituloLivro}"?`)) return;

        setIsLoading(true);
        setErro(null);

        try {
            await LivrosApi.deletarLivro(id);

            // Remove o livro deletado da lista localmente
            setLivros(livros.filter(l => l._id !== id));
        } catch (error) {
            setErro(`Erro ao deletar livro: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };


    // ... (useEffect e handleFiltroSubmit)
    useEffect(() => {
        fetchLivros(''); // Carrega todos os livros inicialmente
    }, []);

    const handleFiltroSubmit = (e) => {
        e.preventDefault();
        fetchLivros(filtroTitulo);
    };


    return (
        <div className="livros-container">
            {/* ... (Cabeçalho, Formulário de Busca, Status Loading/Erro) ... */}

            {/* Exibição de Status (Carregando / Erro) */}
            {isLoading && (
                <p style={{ textAlign: 'center', fontSize: '1.5rem', color: '#4f46e5' }}>
                    Carregando Livros... ⏳
                </p>
            )}

            {erro && (
                <div className="alerta-erro" style={{ padding: '15px', border: '1px solid #dc3545', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '5px', marginTop: '20px' }}>
                    <p>Ocorreu um erro ao buscar/deletar os livros: <strong>{erro}</strong></p>
                    <p>Verifique se o seu backend está rodando em http://localhost:3000!</p>
                </div>
            )}

            {/* Listagem de Livros */}
            {!isLoading && !erro && (
                <>
                    <p className="page-subtitle">Total de livros em exibição: {livros.length}</p>

                    <div className="livros-grid">
                        {livros.length > 0 ? (
                            livros.map(livro => (
                                // Passa a função de deleção para o Card
                                <LivroCard
                                    key={livro._id}
                                    livro={livro}
                                    onDelete={handleDeletarLivro}
                                />
                            ))
                        ) : (
                            <p className="no-results">Nenhum livro encontrado com o filtro aplicado.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default LivrosListagem;