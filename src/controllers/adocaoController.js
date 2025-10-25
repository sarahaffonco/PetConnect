// src/controllers/adocaoController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AdocaoController {
  // Listar todas as adoções
  async listarAdocoes(req, res) {
    try {
      const { pagina = 1, limite = 10, adotanteId, petId } = req.query;
      const pular = (parseInt(pagina) - 1) * parseInt(limite);

      // Construir filtros
      const where = {};
      if (adotanteId) where.adotanteId = parseInt(adotanteId);
      if (petId) where.petId = parseInt(petId);

      const [adocoes, total] = await Promise.all([
        prisma.adocao.findMany({
          where,
          skip: pular,
          take: parseInt(limite),
          orderBy: { dataAdocao: 'desc' },
          include: {
            pet: {
              select: {
                id: true,
                nome: true,
                especie: true,
                fotoUrl: true,
                dataNascimento: true
              }
            },
            adotante: {
              select: {
                id: true,
                nome: true,
                email: true,
                telefone: true
              }
            }
          }
        }),
        prisma.adocao.count({ where })
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
      console.error('Erro ao listar adoções:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
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
            observacoes: observacoes || null,
            dataAdocao: new Date()
          },
          include: {
            pet: {
              select: {
                id: true,
                nome: true,
                especie: true,
                fotoUrl: true
              }
            },
            adotante: {
              select: {
                id: true,
                nome: true,
                email: true,
                telefone: true
              }
            }
          }
        });

        // Atualizar status do pet
        await tx.pet.update({
          where: { id: parseInt(petId) },
          data: { status: 'adotado' }
        });

        // Remover de favoritos de todos os usuários
        await tx.favorito.deleteMany({
          where: { petId: parseInt(petId) }
        });

        return adocao;
      });

      res.status(201).json({
        mensagem: 'Adoção registrada com sucesso!',
        adocao: resultado
      });
    } catch (error) {
      console.error('Erro ao registrar adoção:', error);

      if (error.code === 'P2002') {
        return res.status(400).json({ erro: 'Este pet já foi adotado por este adotante' });
      }

      res.status(500).json({
        erro: 'Erro interno do servidor',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Buscar adoção por ID
  async buscarAdocao(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ erro: 'ID inválido' });
      }

      const adocao = await prisma.adocao.findUnique({
        where: { id: parseInt(id) },
        include: {
          pet: {
            select: {
              id: true,
              nome: true,
              especie: true,
              dataNascimento: true,
              descricao: true,
              tamanho: true,
              personalidade: true,
              fotoUrl: true,
              createdAt: true
            }
          },
          adotante: {
            select: {
              id: true,
              nome: true,
              email: true,
              telefone: true,
              endereco: true,
              createdAt: true
            }
          }
        }
      });

      if (!adocao) {
        return res.status(404).json({ erro: 'Adoção não encontrada' });
      }

      res.json(adocao);
    } catch (error) {
      console.error('Erro ao buscar adoção:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Buscar adoções por adotante
  async buscarAdocoesPorAdotante(req, res) {
    try {
      const { adotanteId } = req.params;
      const { pagina = 1, limite = 10 } = req.query;
      const pular = (parseInt(pagina) - 1) * parseInt(limite);

      if (!adotanteId || isNaN(parseInt(adotanteId))) {
        return res.status(400).json({ erro: 'ID do adotante inválido' });
      }

      const [adocoes, total] = await Promise.all([
        prisma.adocao.findMany({
          where: { adotanteId: parseInt(adotanteId) },
          skip: pular,
          take: parseInt(limite),
          orderBy: { dataAdocao: 'desc' },
          include: {
            pet: {
              select: {
                id: true,
                nome: true,
                especie: true,
                dataNascimento: true,
                descricao: true,
                fotoUrl: true
              }
            }
          }
        }),
        prisma.adocao.count({
          where: { adotanteId: parseInt(adotanteId) }
        })
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
      console.error('Erro ao buscar adoções por adotante:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Cancelar adoção
  async cancelarAdocao(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ erro: 'ID inválido' });
      }

      const adocao = await prisma.adocao.findUnique({
        where: { id: parseInt(id) },
        include: {
          pet: true,
          adotante: {
            select: {
              id: true,
              nome: true
            }
          }
        }
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

      res.status(200).json({
        mensagem: 'Adoção cancelada com sucesso',
        adocao: {
          id: adocao.id,
          pet: adocao.pet,
          adotante: adocao.adotante,
          dataAdocao: adocao.dataAdocao
        }
      });
    } catch (error) {
      console.error('Erro ao cancelar adoção:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Estatísticas de adoções
  async estatisticasAdocoes(req, res) {
    try {
      const totalAdocoes = await prisma.adocao.count();

      const adocoesPorMes = await prisma.adocao.groupBy({
        by: ['dataAdocao'],
        _count: {
          id: true
        },
        where: {
          dataAdocao: {
            gte: new Date(new Date().getFullYear(), 0, 1) // Desde início do ano
          }
        },
        orderBy: {
          dataAdocao: 'asc'
        }
      });

      const especiesAdotadas = await prisma.adocao.groupBy({
        by: ['petId'],
        _count: {
          id: true
        }
      });

      // Buscar detalhes das espécies
      const especiesComDetalhes = await Promise.all(
        especiesAdotadas.map(async (item) => {
          const pet = await prisma.pet.findUnique({
            where: { id: item.petId },
            select: { especie: true }
          });
          return {
            especie: pet?.especie || 'Desconhecida',
            quantidade: item._count.id
          };
        })
      );

      res.json({
        totalAdocoes,
        adocoesPorMes: adocoesPorMes.map(item => ({
          mes: item.dataAdocao.toISOString().substring(0, 7),
          quantidade: item._count.id
        })),
        especiesAdotadas: especiesComDetalhes
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

// ✅ CORREÇÃO: Exportar a instância da classe corretamente
module.exports = new AdocaoController();
