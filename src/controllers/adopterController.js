const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AdopterController {
  // Listar todos os adotantes
  async listarAdotantes(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [adotantes, total] = await Promise.all([
        prisma.adotante.findMany({
          skip,
          take: parseInt(limit),
          orderBy: { createdAt: 'desc' },
          include: {
            adocoes: {
              include: {
                pet: true
              }
            }
          }
        }),
        prisma.adotante.count()
      ]);

      res.json({
        adotantes,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Buscar adotante por ID
  async buscarAdotante(req, res) {
    try {
      const { id } = req.params;
      const adotante = await prisma.adotante.findUnique({
        where: { id: parseInt(id) },
        include: {
          adocoes: {
            include: {
              pet: true
            }
          }
        }
      });

      if (!adotante) {
        return res.status(404).json({ error: 'Adotante não encontrado' });
      }

      res.json(adotante);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Criar novo adotante
  async criarAdotante(req, res) {
    try {
      const { nome, email, telefone, endereco } = req.body;

      if (!nome || !email || !telefone) {
        return res.status(400).json({ error: 'Nome, email e telefone são obrigatórios' });
      }

      // Verificar se email já existe
      const adotanteExistente = await prisma.adotante.findUnique({
        where: { email }
      });

      if (adotanteExistente) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      const adotante = await prisma.adotante.create({
        data: {
          nome,
          email,
          telefone,
          endereco
        }
      });

      res.status(201).json(adotante);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Atualizar adotante
  async atualizarAdotante(req, res) {
    try {
      const { id } = req.params;
      const { nome, email, telefone, endereco } = req.body;

      const adotanteExistente = await prisma.adotante.findUnique({
        where: { id: parseInt(id) }
      });

      if (!adotanteExistente) {
        return res.status(404).json({ error: 'Adotante não encontrado' });
      }

      // Verificar se email já existe (excluindo o próprio)
      if (email && email !== adotanteExistente.email) {
        const emailExistente = await prisma.adotante.findUnique({
          where: { email }
        });

        if (emailExistente) {
          return res.status(400).json({ error: 'Email já cadastrado' });
        }
      }

      const adotante = await prisma.adotante.update({
        where: { id: parseInt(id) },
        data: {
          nome,
          email,
          telefone,
          endereco
        }
      });

      res.json(adotante);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Deletar adotante
  async deletarAdotante(req, res) {
    try {
      const { id } = req.params;

      const adotanteExistente = await prisma.adotante.findUnique({
        where: { id: parseInt(id) }
      });

      if (!adotanteExistente) {
        return res.status(404).json({ error: 'Adotante não encontrado' });
      }

      await prisma.adotante.delete({
        where: { id: parseInt(id) }
      });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AdopterController();
