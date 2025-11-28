const express = require('express');

const router = express.Router();

const LivrosController = require('../controllers/LivrosController');

//C (Create)
router.post('/', LivrosController.criarLivro);

// R(Read)
router.get('/', LivrosController.buscarTodosLivros);

// R(Read)
router.get('/:id', LivrosController.buscarLivroPorId);

// U (Update) 
router.put('/:id', LivrosController.atualizarLivro);

// D (Delete) 
router.delete('/:id', LivrosController.deletarLivro);

module.exports = router;