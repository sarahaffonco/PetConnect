const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AdocaoController {
  // Listar todas as adoções
  async listarAdocoes(req, res) {
    try {
      const { pagina = 1, limite = 10 } = req.query;
      const pular = (parseInt(pagina) - 1) * parseInt(limite);

      const [adocoes, total] = await Promise.all([
        prisma.adocao.findMany({
          skip: pular,
          take: parseInt(limite),
          orderBy: { dataAdocao: 'desc' },
          include: {
            pet: true,
            adotante: true
          }
        }),
        prisma.adocao.count()
      ]);

      res.json({
        adocoes,
        paginacao: {
          pagina: parseInt(pagina),
          limite: parseInt(limite),
          total,
          paginas: Math.ceil(total / limite)
        }
      });
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  // Registrar nova adoção
  async registrarAdocao(req, res) {
    try {
      const { petId, adotanteId, observacoes } = req.body;

      if (!petId || !adotanteId) {
        return res.status(400).json({ erro: 'Pet ID e Adotante ID são obrigatórios' });
      }

      // Verificar se pet existe e está disponível
      const pet = await prisma.pet.findUnique({
        where: { id: parseInt(petId) }
      });

      if (!pet) {
        return res.status(404).json({ erro: 'Pet não encontrado' });
      }

      if (pet.status === 'adotado') {
        return res.status(400).json({ erro: 'Pet já foi adotado' });
      }

      // Verificar se adotante existe
      const adotante = await prisma.adotante.findUnique({
        where: { id: parseInt(adotanteId) }
      });

      if (!adotante) {
        return res.status(404).json({ erro: 'Adotante não encontrado' });
      }

      // Usar transação para garantir consistência
      const resultado = await prisma.$transaction(async (tx) => {
        // Registrar adoção
        const adocao = await tx.adocao.create({
          data: {
            petId: parseInt(petId),
            adotanteId: parseInt(adotanteId),
            observacoes
          },
          include: {
            pet: true,
            adotante: true
          }
        });

        // Atualizar status do pet
        await tx.pet.update({
          where: { id: parseInt(petId) },
          data: { status: 'adotado' }
        });

        return adocao;
      });

      res.status(201).json(resultado);
    } catch (error) {
      if (error.code === 'P2002') {
        return res.status(400).json({ erro: 'Este pet já foi adotado por este adotante' });
      }
      res.status(500).json({ erro: error.message });
    }
  }

  // Buscar adoção por ID
  async buscarAdocao(req, res) {
    try {
      const { id } = req.params;
      const adocao = await prisma.adocao.findUnique({
        where: { id: parseInt(id) },
        include: {
          pet: true,
          adotante: true
        }
      });

      if (!adocao) {
        return res.status(404).json({ erro: 'Adoção não encontrada' });
      }

      res.json(adocao);
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  // Cancelar adoção
  async cancelarAdocao(req, res) {
    try {
      const { id } = req.params;

      const adocao = await prisma.adocao.findUnique({
        where: { id: parseInt(id) },
        include: { pet: true }
      });

      if (!adocao) {
        return res.status(404).json({ erro: 'Adoção não encontrada' });
      }

      // Usar transação para garantir consistência
      await prisma.$transaction(async (tx) => {
        // Deletar registro de adoção
        await tx.adocao.delete({
          where: { id: parseInt(id) }
        });

        // Reverter status do pet para disponível
        await tx.pet.update({
          where: { id: adocao.petId },
          data: { status: 'disponivel' }
        });
      });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }
}

module.exports = new AdocaoController();
