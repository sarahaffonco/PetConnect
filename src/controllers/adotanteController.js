  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  class AdotanteController {
    // Listar todos os adotantes
    async listarAdotantes(req, res) {
      try {
        console.log('🔄 Iniciando listarAdotantes...');

        const { pagina = 1, limite = 10 } = req.query;
        const pular = (parseInt(pagina) - 1) * parseInt(limite);

        console.log('📋 Parâmetros:', { pagina, limite, pular });

        const [adotantes, total] = await Promise.all([
          prisma.adotante.findMany({
            skip: pular,
            take: parseInt(limite),
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              nome: true,
              email: true,
              telefone: true,
              endereco: true,
              createdAt: true,
              updatedAt: true,
              adocoes: {
                select: {
                  id: true,
                  dataAdocao: true,
                  pet: {
                    select: {
                      id: true,
                      nome: true,
                      especie: true
                    }
                  }
                }
              }
            }
          }),
          prisma.adotante.count()
        ]);

        console.log('✅ Adotantes encontrados:', adotantes.length);
        console.log('✅ Total:', total);

        res.json({
          adotantes,
          paginacao: {
            pagina: parseInt(pagina),
            limite: parseInt(limite),
            total,
            paginas: Math.ceil(total / limite)
          }
        });
      } catch (error) {
        console.error('💥 ERRO CRÍTICO em listarAdotantes:');
        console.error('📋 Mensagem:', error.message);
        console.error('🔍 Stack:', error.stack);
        console.error('📊 Código:', error.code);

        res.status(500).json({
          erro: 'Erro interno do servidor',
          detalhes: error.message
        });
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
          },
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            endereco: true,
            createdAt: true,
            updatedAt: true,
            adocoes: true
          }
        });

        if (!adotante) {
          return res.status(404).json({ erro: 'Adotante não encontrado' });
        }

        res.json(adotante);
      } catch (error) {
        res.status(500).json({ erro: error.message });
      }
    }

    // Criar novo adotante
    async criarAdotante(req, res) {
      try {
        const { nome, email, telefone, endereco, senha } = req.body;

        if (!nome || !email || !telefone || !senha) {
          return res.status(400).json({
            erro: 'Nome, email, telefone e senha são obrigatórios'
          });
        }

        // Verificar se email já existe
        const adotanteExistente = await prisma.adotante.findUnique({
          where: { email }
        });

        if (adotanteExistente) {
          return res.status(400).json({ erro: 'Email já cadastrado' });
        }

        const adotante = await prisma.adotante.create({
          data: {
            nome,
            email,
            telefone,
            endereco: endereco || null,
            senha
          },
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            endereco: true,
            createdAt: true
          }
        });

        res.status(201).json(adotante);
      } catch (error) {
        console.error('Erro ao criar adotante:', error);
        res.status(500).json({
          erro: 'Erro interno do servidor',
          detalhes: error.message
        });
      }
    }

    // Atualizar adotante
    async atualizarAdotante(req, res) {
      try {
        const { id } = req.params;
        const { nome, email, telefone, endereco, senha } = req.body;

        const adotanteExistente = await prisma.adotante.findUnique({
          where: { id: parseInt(id) }
        });

        if (!adotanteExistente) {
          return res.status(404).json({ erro: 'Adotante não encontrado' });
        }

        // Verificar se email já existe (excluindo o próprio)
        if (email && email !== adotanteExistente.email) {
          const emailExistente = await prisma.adotante.findUnique({
            where: { email }
          });

          if (emailExistente) {
            return res.status(400).json({ erro: 'Email já cadastrado' });
          }
        }

        // Preparar dados para atualização
        const dadosAtualizacao = {
          nome,
          email,
          telefone,
          endereco
        };

        // Se foi fornecida uma nova senha, adicionar aos dados
        if (senha) {
          const bcrypt = require('bcryptjs');
          dadosAtualizacao.senha = await bcrypt.hash(senha, 10);
        }

        const adotante = await prisma.adotante.update({
          where: { id: parseInt(id) },
          data: dadosAtualizacao,
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            endereco: true,
            createdAt: true,
            updatedAt: true
          }
        });

        res.json(adotante);
      } catch (error) {
        console.error('Erro ao atualizar adotante:', error);
        res.status(500).json({ erro: error.message });
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
          return res.status(404).json({ erro: 'Adotante não encontrado' });
        }

        await prisma.adotante.delete({
          where: { id: parseInt(id) }
        });

        res.status(204).send();
      } catch (error) {
        console.error('Erro ao deletar adotante:', error);
        res.status(500).json({ erro: error.message });
      }
    }
  }

  module.exports = new AdotanteController();
