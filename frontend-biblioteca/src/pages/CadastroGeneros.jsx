import React, { useState, useEffect } from 'react';
import { GenerosApi } from '../services/apiService';

const CadastroGeneros = () => {
    const [genero, setGenero] = useState('');
    const [generos, setGeneros] = useState([]);
    const [generoEmEdicao, setGeneroEmEdicao] = useState(null);

    const [feedback, setFeedback] = useState({ mensagem: '', tipo: '' });
    const [isLoading, setIsLoading] = useState(false);

    // ==========================================================
    // Funções CRUD
    // ==========================================================

    const fetchGeneros = async () => {
        setIsLoading(true);
        try {
            const lista = await GenerosApi.buscarTodosGeneros();
            setGeneros(lista);
            setFeedback({ mensagem: '', tipo: '' });
        } catch (error) {
            setFeedback({ mensagem: `Erro ao buscar gêneros: ${error.message}`, tipo: 'erro' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeletar = async (id, nomeGenero) => {
        if (!window.confirm(`Tem certeza que deseja deletar o gênero "${nomeGenero}"?`)) return;

        setIsLoading(true);
        setFeedback({ mensagem: `Deletando ${nomeGenero}...`, tipo: 'info' });

        try {
            await GenerosApi.deletarGenero(id);

            setGeneros(generos.filter(g => g._id !== id));
            setFeedback({ mensagem: `Gênero "${nomeGenero}" deletado com sucesso.`, tipo: 'sucesso' });
        } catch (error) {
            setFeedback({ mensagem: `Erro ao deletar gênero: ${error.message}`, tipo: 'erro' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditar = (g) => {
        setGeneroEmEdicao(g._id);
        setGenero(g.genero);
        setFeedback({ mensagem: `Editando: ${g.genero}`, tipo: 'info' });
        window.scrollTo(0, 0);
    };

    const handleCancelarEdicao = () => {
        setGeneroEmEdicao(null);
        setGenero('');
        setFeedback({ mensagem: '', tipo: '' });
    };

    // ==========================================================
    // Submissão do Formulário (CREATE ou UPDATE)
    // ==========================================================

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!genero.trim()) return;

        setIsLoading(true);
        setFeedback({ mensagem: 'Salvando...', tipo: 'info' });

        const dados = { genero: genero.trim() };
        let operacao, sucessoMsg;

        try {
            if (generoEmEdicao) {
                // Modo UPDATE
                operacao = await GenerosApi.atualizarGenero(generoEmEdicao, dados);
                sucessoMsg = `Gênero "${operacao.genero}" atualizado com sucesso!`;

                setGeneros(generos.map(g => g._id === generoEmEdicao ? operacao : g));

                handleCancelarEdicao();
            } else {
                // Modo CREATE
                operacao = await GenerosApi.criarGenero(dados);
                sucessoMsg = `Gênero "${operacao.genero}" criado com sucesso!`;

                setGeneros(prev => [...prev, operacao]);
            }

            setGenero('');
            setFeedback({ mensagem: sucessoMsg, tipo: 'sucesso' });

        } catch (error) {
            setFeedback({ mensagem: error.message, tipo: 'erro' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGeneros();
    }, []);

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
                {generoEmEdicao ? 'Editar Gênero' : 'Cadastro de Gêneros'}
            </h1>

            {/* Feedback */}
            {feedback.mensagem && (
                <div style={{ ...feedbackStyle, marginBottom: '20px', padding: '10px', borderRadius: '5px' }}>
                    {feedback.mensagem}
                </div>
            )}

            {/* Formulário de Cadastro/Edição */}
            <form onSubmit={handleSubmit} className="form-cadastro" style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}>
                <input
                    type="text"
                    placeholder={generoEmEdicao ? 'Novo nome do Gênero' : 'Nome do Novo Gênero'}
                    value={genero}
                    onChange={(e) => setGenero(e.target.value)}
                    required
                    disabled={isLoading}
                    style={{ flexGrow: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <button
                    type="submit"
                    disabled={isLoading || !genero.trim()}
                    className="home-button"
                    style={{
                        padding: '10px 20px',
                        opacity: (isLoading || !genero.trim()) ? 0.6 : 1,
                        backgroundColor: generoEmEdicao ? '#0d6efd' : '#4f46e5'
                    }}
                >
                    {isLoading ? 'Salvando...' : generoEmEdicao ? 'Salvar Edição' : 'Adicionar Gênero'}
                </button>
                {/* Botão de Cancelar Edição */}
                {generoEmEdicao && (
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

            {/* Listagem de Gêneros */}
            <h2 className="titulo-secundario" style={{ fontSize: '1.5rem', borderBottom: '2px solid #ccc', paddingBottom: '5px', marginBottom: '15px' }}>
                Lista de Gêneros ({generos.length})
            </h2>

            {isLoading && generos.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#4f46e5' }}>Carregando gêneros...</p>
            ) : generos.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {generos.map(g => (
                        <li key={g._id} style={{
                            padding: '10px',
                            borderBottom: '1px dotted #ccc',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: g._id === generoEmEdicao ? '#ffedd5' : 'transparent'
                        }}>
                            <span style={{ fontWeight: 'bold' }}>{g.genero}</span>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={() => handleEditar(g)}
                                    disabled={isLoading}
                                    style={{ background: '#ffc107', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDeletar(g._id, g.genero)}
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
                <p style={{ textAlign: 'center', color: '#888' }}>Nenhum gênero cadastrado. Adicione um acima!</p>
            )}
        </div>
    );
};

export default CadastroGeneros;