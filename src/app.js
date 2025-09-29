const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const petRoutes = require('./routes/pets');

// Middlewares
app.use(cors());
app.use(express.json());


// Rotas
app.use('/api/pets', petRoutes);

// Rota health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Servidor funcionando corretamente',
    timestamp: new Date().toISOString()
  });
});

module.exports = app;