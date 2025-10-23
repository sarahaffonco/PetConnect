const express = require('express');
const router = express.Router();
const favoritoController = require('../controllers/favoritoController');

router.post('/alternar', favoritoController.alternarFavorito);
router.get('/usuario/:usuarioId', favoritoController.listarFavoritos);
router.get('/verificar/:petId/:usuarioId', favoritoController.verificarFavorito);

module.exports = router;
