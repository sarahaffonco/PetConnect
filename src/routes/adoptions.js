const express = require('express');
const router = express.Router();
const adocaoController = require('../controllers/adocaoController');

// GET /api/adocoes - Listar adoções
router.get('/', adocaoController.listarAdocoes);

// GET /api/adocoes/:id - Buscar adoção por ID
router.get('/:id', adocaoController.buscarAdocao);

// POST /api/adocoes - Registrar nova adoção
router.post('/', adocaoController.registrarAdocao);

// DELETE /api/adocoes/:id - Cancelar adoção
router.delete('/:id', adocaoController.cancelarAdocao);

module.exports = router;
