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
        const generos = await LivrosService.buscarTodosLivros();

        return res.status(200).json({
            sucesso: true,
            quantidade: generos.length,
            dados: generos
        });
    } catch (error) {
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