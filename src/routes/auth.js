const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { autenticarToken } = require('../middleware/auth');

// POST /api/auth/registrar - Registrar novo usuário
router.post('/registrar', authController.registrar);

// POST /api/auth/login - Login de usuário
router.post('/login', authController.login);

// GET /api/auth/perfil - Obter perfil do usuário logado
router.get('/perfil', autenticarToken, authController.perfil);

module.exports = router;
