// server.js (na raiz)
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// ✅ VERIFIQUE estes imports
const petRoutes = require('./src/routes/pets');
const adotanteRoutes = require('./src/routes/adotantes');
const adocaoRoutes = require('./src/routes/adocoes');
const favoritoRoutes = require('./src/routes/favoritos');
const authRoutes = require('./src/routes/auth');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rota inicial
app.get('/', (req, res) => {
  res.json({
    mensagem: '🐾 PetConnect API está funcionando!',
    versao: '1.0.0',
    timestamp: new Date().toISOString(),
    ambiente: process.env.NODE_ENV || 'development'
  });
});

// ✅ REGISTRAR ROTAS (verifique a ordem)
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/adotantes', adotanteRoutes);
app.use('/api/adocoes', adocaoRoutes);
app.use('/api/favoritos', favoritoRoutes);

// Rota health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    mensagem: 'Servidor funcionando corretamente',
    timestamp: new Date().toISOString()
  });
});

// Middleware de erro
app.use((error, req, res, next) => {
  console.error('Erro:', error);
  res.status(500).json({
    erro: 'Erro interno do servidor',
    mensagem: error.message
  });
});

// Rota não encontrada
app.use('*', (req, res) => {
  res.status(404).json({
    erro: 'Rota não encontrada',
    path: req.originalUrl
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
});
