const Livros = require('../models/Livros');

const criarLivro = async (dados) => {
    try {
        const novoLivro = await Livros.create(dados);
        return novoLivro;
    } catch (error) {
        throw new Error(`Erro ao criar livro: ${error.message}`);

    }
};

const buscarTodosLivros = async () => {
    try {
        const livros = await Livros.find()
            .populate('autor_id')
            .populate('genero_id');
        return livros;
    } catch (error) {
        throw new Error(`Erro ao buscar livros: ${error.message}`);
    }
};

const buscarLivroPorId = async (id) => {
    try {
        const livro = await Livros.findById(id);
        if (!livro) {
            throw new Error('Livro não encontrado');
        }

        return livro;
    } catch (error) {
        throw new Error(`Erro ao buscar livro: ${error.message}`);
    }
};

const buscarLivroPorTitulo = async (titulo) => {
    try {
        // Cria uma expressão regular (RegExp) para busca parcial (sem precisar do título exato)
        // e case-insensitive ('i').
        const regex = new RegExp(titulo, 'i');

        // Busca onde o campo 'titulo' corresponde à regex
        const livros = await Livros.find({ titulo: regex })
            .populate('autor_id')
            .populate('genero_id');

        // Se não encontrar nenhum, retorna um array vazio
        return livros;
    } catch (error) {
        throw new Error(`Erro ao buscar livro por título: ${error.message}`);
    }
};

const atualizarLivro = async (id, dados) => {
    try {
        // { new: true } faz retornar o documento ATUALIZADO (não o antigo)
        // { runValidators: true } valida os dados antes de salvar
        const livroAtualizado = await Livros.findByIdAndUpdate(
            id,
            dados,
            { new: true, runValidators: true }
        )
            .populate('autor_id')
            .populate('genero_id');

        if (!livroAtualizado) {
            throw new Error('Livro não encontrado')
        }

        return livroAtualizado;
    } catch (error) {
        throw new Error(`Erro ao atualizar livro: ${error.message}`)
    }
};

const deletarLivro = async (id) => {
    try {
        const livroDeletado = await Livros.findByIdAndDelete(id);

        if (!livroDeletado) {
            throw new Error('Livro não encontrado')
        }

        return livroDeletado;
    } catch (error) {
        throw new Error(`Erro ao deletar livro: ${error.message}`)
    }
};

// EXPORTAR todas as funções
// Isso permite que outros arquivos usem essas funções
module.exports = {
    criarLivro,
    buscarTodosLivros,
    buscarLivroPorId,
    buscarLivroPorTitulo,
    atualizarLivro,
    deletarLivro
};