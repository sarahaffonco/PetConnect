const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const petController = require('./controllers/petController');
const upload = require('./middlewares/upload');
require('dotenv').config();

const petRoutes = require('./routes/pets');
const adopterRoutes = require('./routes/adopter');
const adoptionsrRoutes = require('./routes/adoptions');

const app = express();
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));


// Rotas
app.use('/api/pets', petRoutes);
app.use('/api/adopter', adopterRoutes);
app.use('/api/adoptions', adoptionsrRoutes);
app.get('/api/pets', petController.listarPets);
app.get('/api/pets/:id', petController.buscarPet);
app.post('/api/pets', upload.single('foto'), petController.criarPet); // Com upload
app.put('/api/pets/:id', upload.single('foto'), petController.atualizarPet); // Com upload
app.delete('/api/pets/:id', petController.deletarPet);

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
