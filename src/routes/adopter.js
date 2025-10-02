const express = require('express');
const router = express.Router();
const adopterController = require('../controllers/adopterController')
// GET /api/adotantes - Listar adotantes
router.get('/', adopterController.listarAdotantes);

// GET /api/adotantes/:id - Buscar adotante por ID
router.get('/:id', adopterController.buscarAdotante);

// POST /api/adotantes - Criar novo adotante
router.post('/', adopterController.criarAdotante);

// PUT /api/adotantes/:id - Atualizar adotante
router.put('/:id', adopterController.atualizarAdotante);

// DELETE /api/adotantes/:id - Deletar adotante
router.delete('/:id', adopterController.deletarAdotante);

module.exports = router;
