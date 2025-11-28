import React, { useState, useEffect } from 'react';
import { AutoresApi } from '../services/apiService';

const CadastroAutores = () => {
    // Estado para o nome no formulário (usado tanto para criar quanto para editar)
    const [nome, setNome] = useState('');
    // Estado para a lista de autores
    const [autores, setAutores] = useState([]);
    // Estado para armazenar o ID do autor que está sendo editado (null se for criação)
    const [autorEmEdicao, setAutorEmEdicao] = useState(null);

    // Estados de Controle
    const [feedback, setFeedback] = useState({ mensagem: '', tipo: '' });
    const [isLoading, setIsLoading] = useState(false);

    // ==========================================================
    // Funções CRUD
    // ==========================================================

    const fetchAutores = async () => {
        setIsLoading(true);
        try {
            const lista = await AutoresApi.buscarTodosAutores();
            setAutores(lista);
            setFeedback({ mensagem: '', tipo: '' });
        } catch (error) {
            setFeedback({ mensagem: `Erro ao buscar autores: ${error.message}`, tipo: 'erro' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeletar = async (id, nomeAutor) => {
        if (!window.confirm(`Tem certeza que deseja deletar o autor "${nomeAutor}"?`)) return;

        setIsLoading(true);
        setFeedback({ mensagem: `Deletando ${nomeAutor}...`, tipo: 'info' });

        try {
            await AutoresApi.deletarAutor(id);

            // Remove o autor deletado da lista localmente
            setAutores(autores.filter(a => a._id !== id));
            setFeedback({ mensagem: `Autor "${nomeAutor}" deletado com sucesso.`, tipo: 'sucesso' });
        } catch (error) {
            setFeedback({ mensagem: `Erro ao deletar autor: ${error.message}`, tipo: 'erro' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditar = (autor) => {
        // Entra no modo de edição: preenche o formulário e armazena o ID
        setAutorEmEdicao(autor._id);
        setNome(autor.nome);
        setFeedback({ mensagem: `Editando: ${autor.nome}`, tipo: 'info' });

        // Faz o scroll para o topo do formulário
        window.scrollTo(0, 0);
    };

    const handleCancelarEdicao = () => {
        setAutorEmEdicao(null);
        setNome('');
        setFeedback({ mensagem: '', tipo: '' });
    };

    // ==========================================================
    // Submissão do Formulário (CREATE ou UPDATE)
    // ==========================================================

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nome.trim()) return;

        setIsLoading(true);
        setFeedback({ mensagem: 'Salvando...', tipo: 'info' });

        const dados = { nome: nome.trim() };
        let operacao, sucessoMsg;

        try {
            if (autorEmEdicao) {
                // Modo UPDATE
                operacao = await AutoresApi.atualizarAutor(autorEmEdicao, dados);
                sucessoMsg = `Autor "${operacao.nome}" atualizado com sucesso!`;

                // Atualiza a lista no estado local
                setAutores(autores.map(a => a._id === autorEmEdicao ? operacao : a));

                handleCancelarEdicao(); // Sai do modo de edição
            } else {
                // Modo CREATE
                operacao = await AutoresApi.criarAutor(dados);
                sucessoMsg = `Autor "${operacao.nome}" criado com sucesso!`;

                // Adiciona o novo autor à lista
                setAutores(prev => [...prev, operacao]);
            }

            setNome('');
            setFeedback({ mensagem: sucessoMsg, tipo: 'sucesso' });

        } catch (error) {
            setFeedback({ mensagem: error.message, tipo: 'erro' });
        } finally {
            setIsLoading(false);
        }
    };

    // Carrega os autores na primeira montagem
    useEffect(() => {
        fetchAutores();
    }, []);

    // Estilos de feedback (mantidos do código anterior)
    const feedbackStyle = feedback.tipo === 'sucesso'
        ? { backgroundColor: '#d1e7dd', color: '#0f5132', border: '1px solid #badbcc' }
        : feedback.tipo === 'erro'
            ? { backgroundColor: '#f8d7da', color: '#842029', border: '1px solid #f5c2c7' }
            : feedback.tipo === 'info'
                ? { backgroundColor: '#cce5ff', color: '#004085', border: '1px solid #b8daff' }
                : { display: 'none' };

    return (
        <div className="page-container" style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
            <h1 className="titulo-principal">
                {autorEmEdicao ? 'Editar Autor' : 'Cadastro de Autores'}
            </h1>

            {/* Feedback de Sucesso/Erro/Info */}
            {feedback.mensagem && (
                <div style={{ ...feedbackStyle, marginBottom: '20px', padding: '10px', borderRadius: '5px' }}>
                    {feedback.mensagem}
                </div>
            )}

            {/* Formulário de Cadastro/Edição */}
            <form onSubmit={handleSubmit} className="form-cadastro" style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}>
                <input
                    type="text"
                    placeholder={autorEmEdicao ? 'Novo nome do Autor' : 'Nome do Novo Autor'}
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    disabled={isLoading}
                    style={{ flexGrow: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <button
                    type="submit"
                    disabled={isLoading || !nome.trim()}
                    className="home-button"
                    style={{
                        padding: '10px 20px',
                        opacity: (isLoading || !nome.trim()) ? 0.6 : 1,
                        backgroundColor: autorEmEdicao ? '#0d6efd' : '#4f46e5' // Cor diferente para edição
                    }}
                >
                    {isLoading ? 'Salvando...' : autorEmEdicao ? 'Salvar Edição' : 'Adicionar Autor'}
                </button>

                {/* Botão de Cancelar Edição */}
                {autorEmEdicao && (
                    <button
                        type="button"
                        onClick={handleCancelarEdicao}
                        disabled={isLoading}
                        style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        Cancelar
                    </button>
                )}
            </form>

            {/* Listagem de Autores */}
            <h2 className="titulo-secundario" style={{ fontSize: '1.5rem', borderBottom: '2px solid #ccc', paddingBottom: '5px', marginBottom: '15px' }}>
                Lista de Autores ({autores.length})
            </h2>

            {isLoading && autores.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#4f46e5' }}>Carregando autores...</p>
            ) : autores.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {autores.map(autor => (
                        <li key={autor._id} style={{
                            padding: '10px',
                            borderBottom: '1px dotted #ccc',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: autor._id === autorEmEdicao ? '#ffedd5' : 'transparent' // Destaca o item em edição
                        }}>
                            <span style={{ fontWeight: 'bold' }}>{autor.nome}</span>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={() => handleEditar(autor)}
                                    disabled={isLoading}
                                    style={{ background: '#ffc107', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDeletar(autor._id, autor.nome)}
                                    disabled={isLoading}
                                    style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Excluir
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p style={{ textAlign: 'center', color: '#888' }}>Nenhum autor cadastrado. Adicione um acima!</p>
            )}
        </div>
    );
};

export default CadastroAutores;