const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AdocaoController {
  // Registrar adoção
  async criarAdocao(req, res) {
    try {
      const { petId, adotanteId } = req.body;

      // Criar adoção
      const adocao = await prisma.adocao.create({
        data: { petId, adotanteId, dataAdocao: new Date() }
      });

      // Atualizar status do pet
      await prisma.pet.update({
        where: { id: petId },
        data: { status: 'adotado' }
      });

      res.status(201).json(adocao);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Listar adoções (com pet e adotante)
  async listarAdocoes(req, res) {
    try {
      const adocoes = await prisma.adocao.findMany({
        include: { pet: true, adotante: true }
      });
      res.json(adocoes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AdocaoController();
