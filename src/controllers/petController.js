const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class PetController {
  // Listar todos os pets com filtros
  async listarPets(req, res) {
    try {
      const {
        especie,
        status,
        tamanho,
        personalidade,
        idadeMin,
        idadeMax,
        pagina = 1,
        limite = 10
      } = req.query;

      const where = {};

      if (especie) where.especie = especie;
      if (status) where.status = status;
      if (tamanho) where.tamanho = tamanho;

     if (personalidade) {
        const personalidadesArray = personalidade.split(',').map(p => p.trim().toLowerCase());
        where.OR = personalidadesArray.map(p => ({
          personalidade: {
            array_contains: p // Verifica se o array JSON contém esta string
          }
        }));
      }

      if (idadeMin || idadeMax) {
        const hoje = new Date();

        if (idadeMin) {
          // Pets que nasceram há mais tempo que idadeMin
          const dataMax = new Date(
            hoje.getFullYear() - parseInt(idadeMin),
            hoje.getMonth(),
            hoje.getDate()
          );
          where.dataNascimento = { lte: dataMax };
        }

        if (idadeMax) {
          // Pets que nasceram há menos tempo que idadeMax
          const dataMin = new Date(
            hoje.getFullYear() - parseInt(idadeMax) - 1,
            hoje.getMonth(),
            hoje.getDate() + 1
          );

          if (where.dataNascimento) {
            where.dataNascimento.gte = dataMin;
          } else {
            where.dataNascimento = { gte: dataMin };
          }
        }
      }

      const pular = (parseInt(pagina) - 1) * parseInt(limite);

      const [pets, total] = await Promise.all([
        prisma.pet.findMany({
            where,
            skip: pular,
            take: parseInt(limite),
            orderBy: { createdAt: 'desc' }
        }),
        prisma.pet.count({ where })
    ]);

      res.json({
        pets,
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

  // Buscar pet por ID
  async buscarPet(req, res) {
    try {
      const { id } = req.params;
      const pet = await prisma.pet.findUnique({
        where: { id: parseInt(id) },
        include: {
          adocoes: {
            include: {
              adotante: true
            }
          }
        }
      });

      if (!pet) {
        return res.status(404).json({ erro: 'Pet não encontrado' });
      }

      res.json(pet);
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  // Criar novo pet
  async criarPet(req, res) {
    try {
      const { nome, especie, dataNascimento, descricao, tamanho, personalidade } = req.body;

      const fotoUrl = req.file
        ? `http://localhost:3000/uploads/${req.file.filename}`
        : null; // Se não houver upload

      let personalidadeData = personalidade;
      if (typeof personalidade === 'string') {
        // Se o frontend enviar como string JSON, faça o parse.
        try {
          personalidadeData = JSON.parse(personalidade);
        } catch (e) {
          // Se o frontend enviar como CSV, converta para Array.
          personalidadeData = personalidade.split(',').map(p => p.trim());
        }
      }

      if (!nome || !especie || !dataNascimento) {
        return res.status(400).json({ erro: 'Nome, espécie e data de nascimento são obrigatórios' });
      }

      const pet = await prisma.pet.create({
        data: {
          nome,
          especie,
          dataNascimento: new Date(dataNascimento),
          descricao,
          tamanho,
          personalidade: personalidadeData,
          status: 'disponivel',
          fotoUrl: fotoUrl
        }
      });

      res.status(201).json(pet);
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  // Atualizar pet
  async atualizarPet(req, res) {
    try {
      const { id } = req.params;
      const { nome, especie, dataNascimento, descricao, tamanho, personalidade, status } = req.body;

      const petExistente = await prisma.pet.findUnique({
        where: { id: parseInt(id) }
      });

      if (!petExistente) {
        return res.status(404).json({ error: 'Pet não encontrado' });
      }

      let personalidadeData = personalidade;
      if (personalidade && typeof personalidade === 'string') {
        try {
          personalidadeData = JSON.parse(personalidade);
        } catch (e) {
          personalidadeData = personalidade.split(',').map(p => p.trim());
        }
      } else if (personalidade === undefined) {
        personalidadeData = petExistente.personalidade;
      }

      // Lógica para fotoUrl (se um novo arquivo for enviado)
      let updatedFotoUrl = petExistente.fotoUrl; // Começa com o que veio no body (pode ser a URL antiga)
      if (req.file) { // Se um novo arquivo foi enviado via Multer
        updatedFotoUrl = `http://localhost:3000/uploads/${req.file.filename}`;
      }

      const pet = await prisma.pet.update({
        where: { id: parseInt(id) },
        data: {
          nome,
          especie,
          dataNascimento: dataNascimento ? new Date(dataNascimento) : undefined,
          descricao,
          tamanho,
          personalidade: personalidadeData,
          status,
          fotoUrl: updatedFotoUrl
        }
      });

      res.json(pet);
    } catch (error) {
      console.error("Erro ao atualizar pet:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Deletar pet
  async deletarPet(req, res) {
    try {
      const { id } = req.params;

      const petExistente = await prisma.pet.findUnique({
        where: { id: parseInt(id) }
      });

      if (!petExistente) {
        return res.status(404).json({ erro: 'Pet não encontrado' });
      }

      await prisma.pet.delete({
        where: { id: parseInt(id) }
      });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }
}

module.exports = new PetController();
