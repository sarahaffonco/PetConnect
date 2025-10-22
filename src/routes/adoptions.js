const express = require('express');
const router = express.Router();
const adoptionsController = require('../controllers/adoptionsController');

// GET /api/adocoes - Listar adoções
router.get('/', adoptionsController.listarAdocoes);

// GET /api/adocoes/:id - Buscar adoção por ID
router.get('/:id', adoptionsController.buscarAdocao);

// POST /api/adocoes - Registrar nova adoção
router.post('/', adoptionsController.registrarAdocao);

// DELETE /api/adocoes/:id - Cancelar adoção
router.delete('/:id', adoptionsController.cancelarAdocao);

module.exports = router;
