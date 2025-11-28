import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LivrosApi, AutoresApi, GenerosApi } from '../services/apiService';

// Importa o componente de Formulário (usaremos o CadastroLivros como base)
// Vamos duplicar a lógica essencial de CadastroLivros e adaptá-la para Edição.
// Para ser mais prático, vamos incluir a lógica de edição diretamente aqui.

const EditarLivro = () => {
    // Hooks para pegar o ID da URL e para navegação
    const { id } = useParams(); // Pega o :id da rota
    const navigate = useNavigate();

    // 1. Estados para o formulário do Livro (os mesmos do cadastro)
    const [titulo, setTitulo] = useState('');
    const [autorId, setAutorId] = useState('');
    const [generoId, setGeneroId] = useState('');
    const [dataPublicacao, setDataPublicacao] = useState('');

    // 2. Estados para as listas de seleção e dados iniciais
    const [autores, setAutores] = useState([]);
    const [generos, setGeneros] = useState([]);
    const [livroOriginal, setLivroOriginal] = useState(null); // Armazena os dados originais do livro

    // 3. Estados de Controle (UX)
    const [feedback, setFeedback] = useState({ mensagem: '', tipo: '' });
    const [isLoading, setIsLoading] = useState(true);

    // ==========================================================
    // Efeito para carregar o Livro, Autores e Gêneros
    // ==========================================================
    useEffect(() => {
        const fetchDadosLivroEFormulario = async () => {
            setIsLoading(true);
            try {
                // Busca simultânea: Autores, Gêneros e o Livro pelo ID
                const [autoresLista, generosLista, livroBuscado] = await Promise.all([
                    AutoresApi.buscarTodosAutores(),
                    GenerosApi.buscarTodosGeneros(),
                    LivrosApi.buscarLivroPorId(id)
                ]);

                // ==========================================================
                // NOVO CONSOLE.LOG PARA DEBUGAR O OBJETO COMPLETO DO BACKEND
                // ==========================================================
                console.log("--- DADOS COMPLETOS DO LIVRO (BACKEND) ---");
                // Verifique o valor da propriedade 'data_publicacao' neste log!
                console.log(livroBuscado);
                console.log("------------------------------------------");

                // 1. Preenche as listas de seleção
                setAutores(autoresLista);
                setGeneros(generosLista);

                // 2. Preenche os estados do formulário com os dados do livro
                setLivroOriginal(livroBuscado);
                setTitulo(livroBuscado.titulo);

                // Preenche os IDs (Autor e Gênero)
                setAutorId(livroBuscado.autor_id ? livroBuscado.autor_id._id : '');
                setGeneroId(livroBuscado.genero_id ? livroBuscado.genero_id._id : '');

                // 3. TRATAMENTO DA DATA: Garante YYYY-MM-DD
                let dataFormatada = '';
                if (livroBuscado.data_publicacao) {
                    const dataObj = new Date(livroBuscado.data_publicacao);

                    // Verifica se a data é válida
                    if (!isNaN(dataObj)) {
                        // Converte para ISO string e pega a parte da data
                        dataFormatada = dataObj.toISOString().split('T')[0];
                    }
                }

                // Log para depuração do resultado da formatação
                console.log("Data Formatada para o Input (YYYY-MM-DD):", dataFormatada);

                setDataPublicacao(dataFormatada); // Define o estado, que preenche o input

                setFeedback({ mensagem: '', tipo: '' });

            } catch (error) {
                console.error("Erro ao carregar dados para edição:", error);
                setFeedback({
                    mensagem: "Erro ao carregar dados: " + (error.message || "Livro não encontrado."),
                    tipo: 'erro'
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchDadosLivroEFormulario();
    }, [id]); // Dependência no ID garante que a busca ocorre se o ID mudar

    // ==========================================================
    // Função para lidar com o envio do formulário (UPDATE)
    // ==========================================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        // --- PASSO DE DIAGNÓSTICO: Verificar os valores antes da validação ---
        // **ABRA O CONSOLE (F12) DO NAVEGADOR E VERIFIQUE ESTES VALORES!**
        console.log("--- VALORES NA SUBMISSÃO ---");
        console.log(`Título: "${titulo.trim()}" (Vazio? ${!titulo.trim()})`);
        console.log(`Autor ID: "${autorId}" (Vazio? ${!autorId})`);
        console.log(`Gênero ID: "${generoId}" (Vazio? ${!generoId})`);
        console.log(`Data Publicação: "${dataPublicacao}" (Vazio? ${!dataPublicacao})`);
        console.log("----------------------------");
        // ----------------------------------------------------------------

        // Validação básica
        if (!titulo.trim() || !autorId || !generoId || !dataPublicacao) {
            setFeedback({ mensagem: 'Por favor, preencha todos os campos obrigatórios.', tipo: 'erro' });

            // Mensagens de erro mais específicas no console:
            if (!titulo.trim()) console.error("FALHA DE VALIDAÇÃO: Título está vazio.");
            if (!autorId) console.error("FALHA DE VALIDAÇÃO: Autor ID está vazio.");
            if (!generoId) console.error("FALHA DE VALIDAÇÃO: Gênero ID está vazio.");
            if (!dataPublicacao) console.error("FALHA DE VALIDAÇÃO: Data de Publicação está vazia.");

            return;
        }

        const dadosAtualizados = {
            titulo: titulo.trim(),
            autor_id: autorId,     // MongoDB espera o ID
            genero_id: generoId,   // MongoDB espera o ID
            data_publicacao: dataPublicacao, // A data já está no formato ISO para envio
        };

        setIsLoading(true);
        setFeedback({ mensagem: `Atualizando livro ID ${id}...`, tipo: 'info' });

        try {
            const livroAtualizado = await LivrosApi.atualizarLivro(id, dadosAtualizados);

            setFeedback({
                mensagem: `Livro "${livroAtualizado.titulo}" atualizado com sucesso!`,
                tipo: 'sucesso'
            });

            // Opcional: Redirecionar para a listagem após alguns segundos
            setTimeout(() => {
                navigate('/livros');
            }, 1500);

        } catch (error) {
            console.error("Erro ao atualizar livro:", error);
            setFeedback({ mensagem: error.message, tipo: 'erro' });
        } finally {
            setIsLoading(false);
        }
    };

    // Lógica para estilização do feedback
    const feedbackStyle = feedback.tipo === 'sucesso'
        ? { backgroundColor: '#d1e7dd', color: '#0f5132', border: '1px solid #badbcc' }
        : feedback.tipo === 'erro'
            ? { backgroundColor: '#f8d7da', color: '#842029', border: '1px solid #f5c2c7' }
            : feedback.tipo === 'info'
                ? { backgroundColor: '#cce5ff', color: '#004085', border: '1px solid #b8daff' }
                : { display: 'none' };

    // ==========================================================
    // Renderização
    // ==========================================================
    if (isLoading && !livroOriginal) {
        return <p style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.2rem', color: '#4f46e5' }}>
            Carregando dados para edição...
        </p>;
    }

    if (feedback.tipo === 'erro' && !livroOriginal) {
        return (
            <div className="page-container" style={{ maxWidth: '800px', margin: 'auto', padding: '20px', marginTop: '50px' }}>
                <h1 className="titulo-principal">Erro ao Carregar Livro</h1>
                <div style={feedbackStyle}>{feedback.mensagem}</div>
                <button
                    onClick={() => navigate('/livros')}
                    style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    Voltar para a Listagem
                </button>
            </div>
        );
    }

    return (
        <div className="page-container" style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
            <h1 className="titulo-principal">
                Editar Livro: "{livroOriginal ? livroOriginal.titulo : id}"
            </h1>

            {/* Feedback */}
            {feedback.mensagem && (
                <div style={{ ...feedbackStyle, marginBottom: '20px', padding: '10px', borderRadius: '5px' }}>
                    {feedback.mensagem}
                </div>
            )}

            {/* Formulário de Edição */}
            <form onSubmit={handleSubmit} className="form-cadastro" style={{ display: 'grid', gap: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>

                {/* 1. Título do Livro */}
                <input
                    type="text"
                    placeholder="Título do Livro"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                    disabled={isLoading}
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />

                {/* 2. Autor (Dropdown) */}
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
                <input
                    type="date"
                    value={dataPublicacao}
                    onChange={(e) => setDataPublicacao(e.target.value)}
                    required
                    disabled={isLoading}
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />

                {/* 5. Botão de Envio */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="home-button"
                    style={{
                        padding: '10px 20px',
                        opacity: isLoading ? 0.6 : 1,
                        backgroundColor: '#0d6efd' // Cor diferente para Edição
                    }}
                >
                    {isLoading ? 'Atualizando...' : 'Salvar Alterações'}
                </button>
            </form>
        </div>
    );
};

export default EditarLivro;