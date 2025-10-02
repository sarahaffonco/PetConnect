const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const petRoutes = require('./routes/pets');
const adopterRoutes = require('./routes/adopter');
const adoptionsrRoutes= require('./routes/adoptions');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Rotas
app.use('/api/pets', petRoutes);
app.use('/api/adopter', adopterRoutes);
app.use('/api/adoptions', adoptionsrRoutes);

// Rota health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Servidor funcionando corretamente',
    timestamp: new Date().toISOString()
  });
});

// Middleware de erro
app.use((error, req, res, next) => {
  console.error('Erro:', error);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: error.message
  });
});

// Rota não encontrada
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

module.exports = app;
