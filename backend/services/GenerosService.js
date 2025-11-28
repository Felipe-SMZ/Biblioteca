const Generos = require('../models/Generos');

const criarGenero = async (dados) => {
    try {
        const novoGenero = await Generos.create(dados);
        return novoGenero;
    } catch (error) {
        throw new Error(`Erro ao criar genero: ${error.message}`);

    }
};

const buscarTodosGeneros = async () => {
    try {
        const generos = await Generos.find();
        return generos;
    } catch (error) {
        throw new Error(`Erro ao buscar generos: ${error.message}`);
    }
};

const buscarGeneroPorId = async (id) => {
    try {
        const genero = await Generos.findById(id);
        if (!genero) {
            throw new Error('Genero não encontrado');
        }

        return genero;
    } catch (error) {
        throw new Error(`Erro ao buscar generos: ${error.message}`);
    }
};

const atualizarGenero = async (id, dados) => {
    try {
        // { new: true } faz retornar o documento ATUALIZADO (não o antigo)
        // { runValidators: true } valida os dados antes de salvar
        const generoAtualizado = await Generos.findByIdAndUpdate(
            id,
            dados,
            { new: true, runValidators: true }
        );

        if (!generoAtualizado) {
            throw new Error('Genero não encontrado')
        }

        return generoAtualizado;
    } catch (error) {
        throw new Error(`Erro ao atualizar genero: ${error.message}`)
    }
};

const deletarGenero = async (id) => {
    try {
        const generoDeletado = await Generos.findByIdAndDelete(id);

        if (!generoDeletado) {
            throw new Error('Genero não encontrado')
        }

        return generoDeletado;
    } catch (error) {
        throw new Error(`Erro ao deletar genero: ${error.message}`)
    }
};

// EXPORTAR todas as funções
// Isso permite que outros arquivos usem essas funções
module.exports = {
    criarGenero,
    buscarTodosGeneros,
    buscarGeneroPorId,
    atualizarGenero,
    deletarGenero
};