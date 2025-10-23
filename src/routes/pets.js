const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');

// POST /api/pets - Criar novo pet
router.post('/', petController.criarPet);

// GET /api/pets - Listar pets com filtros
router.get('/', petController.listarPets);

// PUT /api/pets/:id - Atualizar pet
router.put('/:id', petController.atualizarPet);

// GET /api/pets/:id - Buscar pet por ID
router.get('/:id', petController.buscarPet);

// DELETE /api/pets/:id - Deletar pet
router.delete('/:id', petController.deletarPet);

module.exports = router;
