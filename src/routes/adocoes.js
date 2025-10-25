const express = require('express');
const router = express.Router();
const adocaoController = require('../controllers/adocaoController');
const { autenticarToken } = require('../middleware/auth');

// GET /api/adocoes - Listar adoções (com filtros)
router.get('/', adocaoController.listarAdocoes);

// GET /api/adocoes/estatisticas - Estatísticas de adoções
router.get('/estatisticas', adocaoController.estatisticasAdocoes);

// GET /api/adocoes/adotante/:adotanteId - Buscar adoções por adotante
router.get('/adotante/:adotanteId', adocaoController.buscarAdocoesPorAdotante);

// GET /api/adocoes/:id - Buscar adoção por ID
router.get('/:id', adocaoController.buscarAdocao);

// POST /api/adocoes - Registrar nova adoção
router.post('/', adocaoController.registrarAdocao);

// DELETE /api/adocoes/:id - Cancelar adoção
router.delete('/:id', adocaoController.cancelarAdocao);

module.exports = router;
