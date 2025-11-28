// services/autoresService.js

// 1. IMPORTAÇÕES
// Importa o model de Autores que criamos antes
const Autores = require('../models/Autores');

// 2. CRIAR um novo autor
// Recebe os dados do autor e salva no banco
const criarAutor = async (dados) => {
    try {
        // Cria um novo autor com os dados recebidos
        const novoAutor = await Autores.create(dados);
        return novoAutor;
    } catch (error) {
        throw new Error(`Erro ao criar autor: ${error.message}`);
    }
};

// 3. BUSCAR todos os autores
// Retorna uma lista com todos os autores cadastrados
const buscarTodosAutores = async () => {
    try {
        const autores = await Autores.find();
        return autores;
    } catch (error) {
        throw new Error(`Erro ao buscar autores: ${error.message}`);
    }
};

// 4. BUSCAR um autor específico por ID
// Recebe o ID e retorna apenas aquele autor
const buscarAutorPorId = async (id) => {
    try {
        const autor = await Autores.findById(id);

        // Se não encontrar, lança um erro
        if (!autor) {
            throw new Error('Autor não encontrado');
        }

        return autor;
    } catch (error) {
        throw new Error(`Erro ao buscar autor: ${error.message}`);
    }
};

// 5. ATUALIZAR um autor existente
// Recebe o ID e os novos dados, atualiza e retorna o autor atualizado
const atualizarAutor = async (id, dados) => {
    try {
        // findByIdAndUpdate busca pelo ID e atualiza
        // { new: true } faz retornar o documento ATUALIZADO (não o antigo)
        // { runValidators: true } valida os dados antes de salvar
        const autorAtualizado = await Autores.findByIdAndUpdate(
            id,
            dados,
            { new: true, runValidators: true }
        );

        if (!autorAtualizado) {
            throw new Error('Autor não encontrado');
        }

        return autorAtualizado;
    } catch (error) {
        throw new Error(`Erro ao atualizar autor: ${error.message}`);
    }
};

// 6. DELETAR um autor
// Recebe o ID e remove o autor do banco
const deletarAutor = async (id) => {
    try {
        const autorDeletado = await Autores.findByIdAndDelete(id);

        if (!autorDeletado) {
            throw new Error('Autor não encontrado');
        }

        return autorDeletado;
    } catch (error) {
        throw new Error(`Erro ao deletar autor: ${error.message}`);
    }
};

// 7. EXPORTAR todas as funções
// Isso permite que outros arquivos usem essas funções
module.exports = {
    criarAutor,
    buscarTodosAutores,
    buscarAutorPorId,
    atualizarAutor,
    deletarAutor
};

/* 
===========================================
RESUMO DO PADRÃO CRUD:
===========================================

C - CREATE  → criarAutor()
R - READ    → buscarTodosAutores() e buscarAutorPorId()
U - UPDATE  → atualizarAutor()
D - DELETE  → deletarAutor()

===========================================
MÉTODOS MONGOOSE USADOS:
===========================================

.create(dados)                    → Cria novo documento
.find()                           → Busca todos
.findById(id)                     → Busca por ID
.findByIdAndUpdate(id, dados, {}) → Atualiza por ID
.findByIdAndDelete(id)            → Deleta por ID

===========================================
PARA REPLICAR NOS OUTROS SERVICES:
===========================================

1. Troque "Autores" pelo nome do model
2. Troque "autor/autores" nos nomes das funções
3. Mantenha a mesma estrutura (try/catch, verificações)
4. Para livrosService, adicione .populate() nas buscas!

Exemplo para livrosService:
const livros = await Livros.find()
    .populate('autor_id')
    .populate('genero_id');
*/