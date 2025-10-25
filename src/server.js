const app = require('./app');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

const { exec } = require('child_process');

exec('npm run prisma migrate', (error, stdout, stderr) => {
  if (error) {
    console.error(`Erro:${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout:\n${stdout}`);
});

// Testar conexão com o banco
async function testarConexao() {
  try {
    await prisma.$connect();
    console.log('✅ Conectado ao banco de dados MySQL');
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco:', error);
    process.exit(1);
  }
}

app.listen(PORT, async () => {
  await testarConexao();
  console.log(`🐾 PetConnect API rodando na porta ${PORT}`);
});
