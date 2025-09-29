const app = require('./app');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Testar conexão com o banco
async function testConnection() {
  try {
    await prisma.$connect();
    console.log('Conectado ao banco de dados MySQL');
  } catch (error) {
    console.error('Erro ao conectar com o banco:', error);
    process.exit(1);
  }
}

app.listen(PORT, async () => {
  await testConnection();
  console.log(` Servidor rodando na porta ${PORT}`);
  console.log(` Acesse o Prisma Studio: http://localhost:${PORT}/_studio`);
});