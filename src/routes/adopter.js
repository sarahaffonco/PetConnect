import { Router } from 'express';
import { AdotanteController } from '../controllers/adotantesController.js';
import { LoginController } from '../controllers/loginController.js';
import { checkAuthentication, checkPermission } from '../auth/authMiddleware.js';

// Cria uma única instância do roteador
const router = Router();

// Instâncias dos controladores
const adotanteController = new AdotanteController();
const loginController = new LoginController();

// Rotas de Login
// A rota de login do adotante é um recurso separado, então faz sentido agrupá-la.
router.post('/login', loginController.login);

// Rotas de Adotantes
// Aplica o middleware de autenticação e permissão em rotas específicas.
router.get(
  '/adotantes',
  checkAuthentication,
  checkPermission(['administrador']),
  adotanteController.findAdotantes
);

router.get(
  '/adotantes/:id',
  checkAuthentication,
  checkPermission(['administrador', 'usuario']),
  adotanteController.findAdotanteById
);

router.post('/adotantes', adotanteController.addAdotante);

router.put(
  '/adotantes/:id',
  checkAuthentication,
  checkPermission(['administrador', 'usuario']),
  adotanteController.updateAdotante
);

// A rota de delete deve ter uma permissão mais restritiva, geralmente apenas para administradores
router.delete(
  '/adotantes/:id',
  checkAuthentication,
  checkPermission(['administrador']),
  adotanteController.deleteAdotante
);

export default router;