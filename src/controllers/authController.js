  const { PrismaClient } = require('@prisma/client');
  const bcrypt = require('bcryptjs');
  const jwt = require('jsonwebtoken');
  const prisma = new PrismaClient();

  class AuthController {
    // Registrar novo usuário
    async registrar(req, res) {
      try {
        console.log('📝 Recebendo requisição de registro:', req.body);

        const { nome, email, telefone, endereco, senha } = req.body;

        if (!nome || !email || !telefone || !senha) {
          console.log('❌ Campos obrigatórios faltando');
          return res.status(400).json({
            erro: 'Nome, email, telefone e senha são obrigatórios'
          });
        }

        // Verificar se email já existe
        console.log(`🔍 Verificando se email ${email} já existe...`);
        const usuarioExistente = await prisma.adotante.findUnique({
          where: { email }
        });

        if (usuarioExistente) {
          console.log('❌ Email já cadastrado');
          return res.status(400).json({ erro: 'Email já cadastrado' });
        }

        // Criptografar senha
        console.log('🔒 Criptografando senha...');
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        // Criar usuário
        console.log('👤 Criando usuário no banco...');
        const usuario = await prisma.adotante.create({
          data: {
            nome,
            email,
            telefone,
            endereco: endereco || null,
            senha: senhaCriptografada
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

        console.log('✅ Usuário criado com sucesso:', usuario.id);

        // Gerar token JWT
        const jwtSecret = process.env.JWT_SECRET || 'seu-segredo-temporario';
        console.log('🔑 Gerando token JWT...');

        const token = jwt.sign(
          { usuarioId: usuario.id, email: usuario.email },
          jwtSecret,
          { expiresIn: '7d' }
        );

        console.log('🎉 Registro concluído com sucesso');

        res.status(201).json({
          mensagem: 'Usuário criado com sucesso',
          usuario,
          token
        });
      } catch (error) {
        console.error('💥 ERRO NO REGISTRO:', error);
        console.error('📋 Detalhes do erro:', error.message);
        console.error('🔍 Stack trace:', error.stack);

        res.status(500).json({
          erro: 'Erro interno do servidor',
          detalhes: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
    }

    // Login de usuário
    async login(req, res) {
      try {
        console.log('🔐 Recebendo requisição de login:', req.body);

        const { email, senha } = req.body;

        if (!email || !senha) {
          return res.status(400).json({
            erro: 'Email e senha são obrigatórios'
          });
        }

        // Buscar usuário
        const usuario = await prisma.adotante.findUnique({
          where: { email }
        });

        if (!usuario) {
          console.log('❌ Usuário não encontrado');
          return res.status(401).json({ erro: 'Credenciais inválidas' });
        }

        // Verificar senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
          console.log('❌ Senha inválida');
          return res.status(401).json({ erro: 'Credenciais inválidas' });
        }

        // Gerar token JWT
        const jwtSecret = process.env.JWT_SECRET || 'seu-segredo-temporario';
        const token = jwt.sign(
          { usuarioId: usuario.id, email: usuario.email },
          jwtSecret,
          { expiresIn: '7d' }
        );

        // Retornar dados do usuário (sem senha)
        const usuarioSemSenha = {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          telefone: usuario.telefone,
          endereco: usuario.endereco,
          createdAt: usuario.createdAt
        };

        console.log('✅ Login realizado com sucesso para:', usuario.email);

        res.json({
          mensagem: 'Login realizado com sucesso',
          usuario: usuarioSemSenha,
          token
        });
      } catch (error) {
        console.error('💥 ERRO NO LOGIN:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
      }
    }

    // Obter perfil do usuário logado
    async perfil(req, res) {
      try {
        const usuario = await prisma.adotante.findUnique({
          where: { id: req.usuarioId },
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            endereco: true,
            createdAt: true
          }
        });

        if (!usuario) {
          return res.status(404).json({ erro: 'Usuário não encontrado' });
        }

        res.json(usuario);
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
      }
    }
  }

  module.exports = new AuthController();
