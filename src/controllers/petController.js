const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class PetController {
  // Listar todos os pets com filtros
  async listarPets(req, res) {
    try {
      const {
        especie,
        status = 'disponivel', // Valor padrão
        tamanho,
        personalidade,
        idadeMin,
        idadeMax,
        pagina = 1,
        limite = 8
      } = req.query;

      console.log('Parâmetros recebidos:', req.query);

      const where = {
        status: status // Só mostra pets disponíveis por padrão
      };

      // Filtro por espécie
      if (especie) where.especie = especie;

      // Filtro por tamanho
      if (tamanho) where.tamanho = tamanho;

      // Filtro por personalidade (array ou string)
      if (personalidade) {
        if (typeof personalidade === 'string' && personalidade.includes(',')) {
          // Se for string com vírgulas, converte para array
          const personalidadesArray = personalidade.split(',');
          where.personalidade = {
            in: personalidadesArray
          };
        } else {
          // Se for string única
          where.personalidade = personalidade;
        }
      }

      // Filtro por idade
      if (idadeMin || idadeMax) {
        const hoje = new Date();

        let dataMin = new Date();
        let dataMax = new Date();

        if (idadeMin) {
          dataMin.setFullYear(hoje.getFullYear() - parseInt(idadeMin));
        }

        if (idadeMax) {
          dataMax.setFullYear(hoje.getFullYear() - parseInt(idadeMax));
        }

        where.dataNascimento = {};

        if (idadeMax) {
          where.dataNascimento.gte = dataMax;
        }

        if (idadeMin) {
          where.dataNascimento.lte = dataMin;
        }
      }

      const pular = (parseInt(pagina) - 1) * parseInt(limite);

      console.log('WHERE clause:', JSON.stringify(where, null, 2));

      const [pets, total] = await Promise.all([
        prisma.pet.findMany({
          where,
          skip: pular,
          take: parseInt(limite),
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            nome: true,
            especie: true,
            dataNascimento: true,
            descricao: true,
            tamanho: true,
            personalidade: true,
            status: true,
            fotoUrl: true,
            createdAt: true,
            updatedAt: true
          }
        }),
        prisma.pet.count({ where })
      ]);

      console.log(`Encontrados ${pets.length} pets de ${total} total`);

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
      console.error('Erro detalhado ao listar pets:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor',
        detalhes: error.message
      });
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

      // CORREÇÃO: Usar URL do Render em produção
      const baseUrl = process.env.NODE_ENV === 'production'
        ? `https://${process.env.RENDER_EXTERNAL_URL || 'seu-app.onrender.com'}`
        : 'http://localhost:3000';

      const fotoUrl = req.file
        ? `${baseUrl}/uploads/${req.file.filename}`
        : null;

      // CORREÇÃO: personalidade já é string, não precisa converter
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
          personalidade, // Já é string
          status: 'disponivel',
          fotoUrl
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

      // CORREÇÃO: URL base dinâmica para produção
      const baseUrl = process.env.NODE_ENV === 'production'
        ? `https://${process.env.RENDER_EXTERNAL_URL || 'seu-app.onrender.com'}`
        : 'http://localhost:3000';

      // CORREÇÃO: personalidade já é string, não precisa fazer parse
      let updatedFotoUrl = req.body.fotoUrl || petExistente.fotoUrl;

      if (req.file) {
        updatedFotoUrl = `${baseUrl}/uploads/${req.file.filename}`;
      }

      const pet = await prisma.pet.update({
        where: { id: parseInt(id) },
        data: {
          nome: nome !== undefined ? nome : petExistente.nome,
          especie: especie !== undefined ? especie : petExistente.especie,
          dataNascimento: dataNascimento ? new Date(dataNascimento) : petExistente.dataNascimento,
          descricao: descricao !== undefined ? descricao : petExistente.descricao,
          tamanho: tamanho !== undefined ? tamanho : petExistente.tamanho,
          personalidade: personalidade !== undefined ? personalidade : petExistente.personalidade,
          status: status !== undefined ? status : petExistente.status,
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
