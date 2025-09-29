const express = require('express');
const router = express.Router();
const adocaoController = require('../controllers/adocaoController');

// POST /api/adocoes - Registrar adoção
router.post('/', adocaoController.criarAdocao);

// GET /api/adocoes - Listar histórico de adoções
router.get('/', adocaoController.listarAdocoes);

module.exports = router;
