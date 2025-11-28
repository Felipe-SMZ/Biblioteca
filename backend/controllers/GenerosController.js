const GenerosService = require('../services/GenerosService');

const criarGenero = async (req, res) => {
    try {
        // req.body contém os dados enviados no corpo da requisição
        const dados = req.body;

        // Chama a função do service
        const novoGenero = await GenerosService.criarGenero(dados);

        return res.status(201).json({
            sucesso: true,
            mensagem: 'Genero criado com sucesso!',
            dados: novoGenero
        });
    } catch (error) {
        return res.status(400).json({
            sucesso: false,
            mensagem: error.message
        });
    }
};

const buscarTodosGeneros = async (req, res) => {
    try {
        const generos = await GenerosService.buscarTodosGeneros();

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

const buscarGeneroPorId = async (req, res) => {
    try {
        // req.params contém os parâmetros da URL
        // Exemplo: /autores/123 -> req.params.id = "123"
        const { id } = req.params;

        const genero = await GenerosService.buscarGeneroPorId(id);

        return res.status(200).json({
            sucesso: true,
            dados: genero
        });
    } catch (error) {
        // Status 404 = Not Found (quando não encontra)
        return res.status(404).json({
            sucesso: false,
            mensagem: error.message
        });
    }
};

const atualizarGenero = async (req, res) => {
    try {
        const { id } = req.params;

        const dados = req.body;
        const generoAtualizado = await GenerosService.atualizarGenero(id, dados);

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Genero atualizado com sucesso',
            dados: generoAtualizado
        });
    } catch (error) {
        return res.status(400).json({
            sucesso: false,
            mensagem: error.message
        });
    }
};

const deletarGenero = async (req, res) => {
    try {
        const { id } = req.params;

        await GenerosService.deletarGenero(id);

        // Status 204 = No Content (deletado com sucesso, sem retorno)
        // Ou use 200 se quiser retornar uma mensagem
        return res.status(200).json({
            sucesso: true,
            mensagem: 'Genero deletado com sucesso'
        });
    } catch (error) {
        return res.status(404).json({
            sucesso: false,
            mensagem: error.message
        });
    }
};

module.exports = {
    criarGenero,
    buscarTodosGeneros,
    buscarGeneroPorId,
    atualizarGenero,
    deletarGenero
};