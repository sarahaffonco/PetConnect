const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const petController = require('./controllers/petController');
const upload = require('./middlewares/upload');
require('dotenv').config();

const petRoutes = require('./routes/pets');
const adotanteRoutes = require('./routes/adotantes');
const adocaoRoutes = require('./routes/adocoes');
const favoritoRoutes = require('./routes/favoritos');
const authRoutes = require('./routes/auth');

const app = express();
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

// Rotas
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
  res.status(404).json({ erro: 'Rota não encontrada' });
});

module.exports = app;
