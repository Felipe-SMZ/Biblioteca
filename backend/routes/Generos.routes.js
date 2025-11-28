const express = require('express');

const router = express.Router();

const generosController = require('../controllers/GenerosController');

//C (Create)
router.post('/', generosController.criarGenero);

// R(Read)
router.get('/', generosController.buscarTodosGeneros);

// R(Read)
router.get('/:id', generosController.buscarGeneroPorId);

// U (Update) 
router.put('/:id', generosController.atualizarGenero);

// D (Delete) 
router.delete('/:id', generosController.deletarGenero);

module.exports = router;