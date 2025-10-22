const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  try {
    // Limpar dados existentes (opcional - cuidado em produção!)
    console.log('🗑️  Limpando dados existentes...');
    await prisma.adocao.deleteMany();
    await prisma.pet.deleteMany();
    await prisma.adotante.deleteMany();

    // Criar pets
    console.log('🐾 Criando pets...');
    const pets = await prisma.pet.createMany({
      data: [
        {
          nome: 'Rex',
          especie: 'Cachorro',
          dataNascimento: new Date('2020-05-15'),
          descricao: 'Muito brincalhão e amigável',
          tamanho: 'grande',
          personalidade: 'brincalhao',
          status: 'disponivel'
        },
        {
          nome: 'Mimi',
          especie: 'Gato',
          dataNascimento: new Date('2021-08-20'),
          descricao: 'Calmo e independente',
          tamanho: 'pequeno',
          personalidade: 'calmo',
          status: 'disponivel'
        },
        {
          nome: 'Bolinha',
          especie: 'Coelho',
          dataNascimento: new Date('2022-02-10'),
          descricao: 'Fofo e tranquilo',
          tamanho: 'pequeno',
          personalidade: 'calmo',
          status: 'disponivel'  // Mudei para disponível para testar adoções
        },
        {
          nome: 'Thor',
          especie: 'Cachorro',
          dataNascimento: new Date('2019-11-05'),
          descricao: 'Protetor e carinhoso',
          tamanho: 'grande',
          personalidade: 'calmo',
          status: 'disponivel'
        },
        {
          nome: 'Luna',
          especie: 'Gato',
          dataNascimento: new Date('2022-07-15'),
          descricao: 'Brincalhona e curiosa',
          tamanho: 'pequeno',
          personalidade: 'brincalhao',
          status: 'disponivel'
        }
      ]
    });

    // Criar adotantes
    console.log('👥 Criando adotantes...');
    const adotantes = await prisma.adotante.createMany({
      data: [
        {
          nome: 'João Silva',
          email: 'joao.silva@email.com',  // Email único
          telefone: '(11) 99999-9999',
          endereco: 'Rua A, 123 - São Paulo, SP'
        },
        {
          nome: 'Maria Santos',
          email: 'maria.santos@email.com',  // Email único
          telefone: '(11) 88888-8888',
          endereco: 'Av. B, 456 - Rio de Janeiro, RJ'
        },
        {
          nome: 'Pedro Oliveira',
          email: 'pedro.oliveira@email.com',  // Email único
          telefone: '(21) 77777-7777',
          endereco: 'Rua C, 789 - Belo Horizonte, MG'
        }
      ]
    });

    // Criar algumas adoções de exemplo
    console.log('🏠 Criando adoções...');

    // Buscar IDs dos pets e adotantes criados
    const todosPets = await prisma.pet.findMany();
    const todosAdotantes = await prisma.adotante.findMany();

    if (todosPets.length > 0 && todosAdotantes.length > 0) {
      await prisma.adocao.create({
        data: {
          petId: todosPets[0].id,
          adotanteId: todosAdotantes[0].id,
          observacoes: 'Adoção realizada com sucesso!'
        }
      });

      // Atualizar status do pet para adotado
      await prisma.pet.update({
        where: { id: todosPets[0].id },
        data: { status: 'adotado' }
      });
    }

    console.log('✅ Seed concluído com sucesso!');
    console.log(`📊 ${todosPets.length} pets criados`);
    console.log(`👥 ${todosAdotantes.length} adotantes criados`);

  } catch (error) {
    console.error('❌ Erro no seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
