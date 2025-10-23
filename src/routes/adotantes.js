const express = require('express');
const router = express.Router();
const adotanteController = require('../controllers/adotanteController');

// GET /api/adotantes - Listar adotantes
router.get('/', adotanteController.listarAdotantes);

// GET /api/adotantes/:id - Buscar adotante por ID
router.get('/:id', adotanteController.buscarAdotante);

// POST /api/adotantes - Criar novo adotante
router.post('/', adotanteController.criarAdotante);

// PUT /api/adotantes/:id - Atualizar adotante
router.put('/:id', adotanteController.atualizarAdotante);

// DELETE /api/adotantes/:id - Deletar adotante
router.delete('/:id', adotanteController.deletarAdotante);

module.exports = router;
