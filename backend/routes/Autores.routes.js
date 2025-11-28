const express = require('express');
// 1. Cria um objeto Router para organizar as rotas
const router = express.Router(); 
// 2. Importa o Controller que contém a lógica
const autoresController = require('../controllers/AutoresController'); 

// Rotas CRUD para Autores
// C (Create) - Criar novo autor
router.post('/', autoresController.criarAutor); 

// R (Read) - Buscar todos os autores
router.get('/', autoresController.buscarTodosAutores);

// R (Read) - Buscar autor por ID (parâmetro dinâmico :id)
router.get('/:id', autoresController.buscarAutorPorId); 

// U (Update) - Atualizar autor por ID
router.put('/:id', autoresController.atualizarAutor); 

// D (Delete) - Deletar autor por ID
router.delete('/:id', autoresController.deletarAutor);

module.exports = router;