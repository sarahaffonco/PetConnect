const jwt = require('jsonwebtoken');

function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ erro: 'Token de acesso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'seu-segredo-aqui', (err, decoded) => {
    if (err) {
      return res.status(403).json({ erro: 'Token inválido' });
    }

    req.usuarioId = decoded.usuarioId;
    req.usuarioEmail = decoded.email;
    next();
  });
}

module.exports = { autenticarToken };
