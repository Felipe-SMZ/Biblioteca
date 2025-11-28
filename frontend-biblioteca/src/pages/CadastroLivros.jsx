import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ==========================================================
// CORREÇÃO: Usar named imports do seu arquivo apiService.js
// ==========================================================
import { LivrosApi, AutoresApi, GenerosApi } from '../services/apiService';

const CadastroLivro = () => {
    // 1. ESTADOS DO FORMULÁRIO
    const [titulo, setTitulo] = useState('');
    const [autorId, setAutorId] = useState('');
    const [generoId, setGeneroId] = useState('');
    const [dataPublicacao, setDataPublicacao] = useState('');

    // 2. ESTADOS AUXILIARES
    const [autores, setAutores] = useState([]);
    const [generos, setGeneros] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState({ mensagem: '', tipo: '' });

    const navigate = useNavigate();

    // 3. EFEITO: Carrega as listas de Autores e Gêneros ao iniciar
    useEffect(() => {
        const fetchDadosFormulario = async () => {
            setIsLoading(true);
            try {
                // Busca simultânea das listas
                const [autoresLista, generosLista] = await Promise.all([
                    AutoresApi.buscarTodosAutores(),
                    GenerosApi.buscarTodosGeneros(),
                ]);

                // As APIs retornam diretamente os dados graças ao handleApiResponse
                setAutores(autoresLista);
                setGeneros(generosLista);
                setFeedback({ mensagem: '', tipo: '' });

            } catch (error) {
                console.error("Erro ao carregar dados para o formulário:", error);
                setFeedback({
                    mensagem: "Erro ao carregar Autores ou Gêneros: " + (error.message || "Verifique o servidor."),
                    tipo: 'erro'
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchDadosFormulario();
    }, []);

    // 4. FUNÇÃO: Submissão do Formulário (CREATE)
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validação básica
        if (!titulo.trim() || !autorId || !generoId || !dataPublicacao) {
            setFeedback({ mensagem: 'Por favor, preencha todos os campos obrigatórios.', tipo: 'erro' });
            return;
        }

        const dadosNovoLivro = {
            titulo: titulo.trim(),
            autor_id: autorId,
            genero_id: generoId,
            data_publicacao: dataPublicacao,
        };

        setIsLoading(true);
        setFeedback({ mensagem: 'Cadastrando novo livro...', tipo: 'info' });

        try {
            // Chama a API para criar o livro
            const novoLivro = await LivrosApi.criarLivro(dadosNovoLivro);

            setFeedback({
                mensagem: `Livro "${novoLivro.titulo}" cadastrado com sucesso!`,
                tipo: 'sucesso'
            });

            // Redireciona para a lista após o sucesso
            setTimeout(() => {
                navigate('/livros');
            }, 1500);

        } catch (error) {
            console.error("Erro ao cadastrar livro:", error);
            setFeedback({ mensagem: error.message || "Falha no cadastro.", tipo: 'erro' });
        } finally {
            setIsLoading(false);
        }
    };

    // Função para renderizar as mensagens de feedback
    const renderFeedback = () => {
        if (!feedback.mensagem) return null;

        const style = {
            padding: '10px',
            borderRadius: '5px',
            margin: '15px 0',
            textAlign: 'center',
            color: feedback.tipo === 'erro' ? '#991b1b' : (feedback.tipo === 'sucesso' ? '#065f46' : '#1e40af'),
            backgroundColor: feedback.tipo === 'erro' ? '#fee2e2' : (feedback.tipo === 'sucesso' ? '#d1fae5' : '#bfdbfe'),
            border: `1px solid ${feedback.tipo === 'erro' ? '#ef4444' : (feedback.tipo === 'sucesso' ? '#34d399' : '#60a5fa')}`,
        };

        return <div style={style}>{feedback.mensagem}</div>;
    };

    // 5. RENDERIZAÇÃO
    return (
        <div className="page-container">
            <h2 className="titulo-principal">Cadastrar Novo Livro</h2>

            {renderFeedback()}

            {isLoading && !feedback.mensagem && <p style={{ textAlign: 'center' }}>Carregando dados...</p>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>

                {/* 1. Título */}
                <label>Título do Livro *</label>
                <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                    disabled={isLoading}
                    placeholder="Ex: Dom Casmurro"
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />

                {/* 2. Autor (Dropdown) */}
                <label>Autor *</label>
                <select
                    value={autorId}
                    onChange={(e) => setAutorId(e.target.value)}
                    required
                    disabled={isLoading || autores.length === 0}
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                >
                    <option value="" disabled>Selecione um Autor *</option>
                    {autores.map(autor => (
                        <option key={autor._id} value={autor._id}>
                            {autor.nome}
                        </option>
                    ))}
                </select>

                {/* 3. Gênero (Dropdown) */}
                <label>Gênero *</label>
                <select
                    value={generoId}
                    onChange={(e) => setGeneroId(e.target.value)}
                    required
                    disabled={isLoading || generos.length === 0}
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                >
                    <option value="" disabled>Selecione um Gênero *</option>
                    {generos.map(genero => (
                        <option key={genero._id} value={genero._id}>
                            {genero.genero}
                        </option>
                    ))}
                </select>

                {/* 4. Data de Publicação */}
                <label>Data de Publicação *</label>
                <input
                    type="date"
                    value={dataPublicacao}
                    onChange={(e) => setDataPublicacao(e.target.value)}
                    required
                    disabled={isLoading}
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />

                {/* Botão de Cadastro */}
                <button
                    type="submit"
                    disabled={isLoading}
                    style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' }}
                >
                    {isLoading ? 'Aguarde...' : 'Cadastrar Livro'}
                </button>
            </form>
        </div>
    );
};

export default CadastroLivro;