const LivrosService = require('../services/LivrosService');

const criarLivro = async (req, res) => {
    try {
        // req.body contém os dados enviados no corpo da requisição
        const dados = req.body;

        // Chama a função do service
        const novoLivro = await LivrosService.criarLivro(dados);

        return res.status(201).json({
            sucesso: true,
            mensagem: 'Livro criado com sucesso!',
            dados: novoLivro
        });
    } catch (error) {
        return res.status(400).json({
            sucesso: false,
            mensagem: error.message
        });
    }
};

const buscarTodosLivros = async (req, res) => {
    try {
        // Verifica se o parâmetro 'titulo' está na query string (ex: /livros?titulo=A%20Ilíada)
        const { titulo } = req.query;
        let livros;

        if (titulo) {
            // Se o título for fornecido, chama a função de busca por título
            livros = await LivrosService.buscarLivroPorTitulo(titulo);

            // Se a busca por título retornar vazia, tratamos como 404 (Not Found)
            if (livros.length === 0) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: `Nenhum livro encontrado com o título que contenha '${titulo}'.`
                });
            }

        } else {
            // Caso contrário, busca todos os livros
            livros = await LivrosService.buscarTodosLivros();
        }

        // Retorna sucesso (status 200 = OK)
        return res.status(200).json({
            sucesso: true,
            quantidade: livros.length,
            dados: livros
        });
    } catch (error) {
        // Retorna erro (Status 500 = Internal Server Error)
        return res.status(500).json({
            sucesso: false,
            mensagem: error.message
        });
    }
};

const buscarLivroPorId = async (req, res) => {
    try {
        // req.params contém os parâmetros da URL
        // Exemplo: /autores/123 -> req.params.id = "123"
        const { id } = req.params;

        const livro = await LivrosService.buscarLivroPorId(id);

        return res.status(200).json({
            sucesso: true,
            dados: livro
        });
    } catch (error) {
        // Status 404 = Not Found (quando não encontra)
        return res.status(404).json({
            sucesso: false,
            mensagem: error.message
        });
    }
};

const atualizarLivro = async (req, res) => {
    try {
        const { id } = req.params;
        const dados = req.body

        const livroAtualizado = await LivrosService.atualizarLivro(id, dados);

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Livro atualizado com sucesso',
            dados: livroAtualizado
        });
    } catch (error) {
        return res.status(400).json({
            sucesso: false,
            mensagem: error.message
        });
    }
};

const deletarLivro = async (req, res) => {
    try {
        const { id } = req.params;

        await LivrosService.deletarLivro(id);

        // Status 204 = No Content (deletado com sucesso, sem retorno)
        // Ou use 200 se quiser retornar uma mensagem
        return res.status(200).json({
            sucesso: true,
            mensagem: 'Livro deletado com sucesso'
        });
    } catch (error) {
        return res.status(404).json({
            sucesso: false,
            mensagem: error.message
        });
    }
};

module.exports = {
    criarLivro,
    buscarTodosLivros,
    buscarLivroPorId,
    atualizarLivro,
    deletarLivro
};