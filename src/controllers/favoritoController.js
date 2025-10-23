const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class FavoritoController {
  // Adicionar/remover favorito
  async alternarFavorito(req, res) {
    try {
      const { petId, usuarioId } = req.body;

      // Verificar se já é favorito
      const favoritoExistente = await prisma.favorito.findUnique({
        where: {
          petId_usuarioId: {
            petId: parseInt(petId),
            usuarioId: parseInt(usuarioId)
          }
        }
      });

      if (favoritoExistente) {
        // Remover favorito
        await prisma.favorito.delete({
          where: { id: favoritoExistente.id }
        });
        res.json({ favoritado: false });
      } else {
        // Adicionar favorito
        await prisma.favorito.create({
          data: {
            petId: parseInt(petId),
            usuarioId: parseInt(usuarioId)
          }
        });
        res.json({ favoritado: true });
      }
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  // Listar favoritos do usuário
  async listarFavoritos(req, res) {
    try {
      const { usuarioId } = req.params;

      const favoritos = await prisma.favorito.findMany({
        where: { usuarioId: parseInt(usuarioId) },
        include: { pet: true }
      });

      res.json(favoritos.map(f => f.pet));
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  // Verificar se pet é favorito
  async verificarFavorito(req, res) {
    try {
      const { petId, usuarioId } = req.params;

      const favorito = await prisma.favorito.findUnique({
        where: {
          petId_usuarioId: {
            petId: parseInt(petId),
            usuarioId: parseInt(usuarioId)
          }
        }
      });

      res.json({ favoritado: !!favorito });
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }
}

module.exports = new FavoritoController();
