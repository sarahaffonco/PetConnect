const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const upload = require('../middlewares/upload');

// POST /api/pets - Criar novo pet
router.post('/', upload.single('foto'), petController.criarPet);

// GET /api/pets - Listar pets com filtros
router.get('/', petController.listarPets);

// PUT /api/pets/:id - Atualizar pet
router.put('/:id', petController.atualizarPet);

// GET /api/pets/:id - Buscar pet por ID
router.get('/:id', petController.buscarPet);

// DELETE /api/pets/:id - Deletar pet
router.delete('/:id', petController.deletarPet);

module.exports = router;