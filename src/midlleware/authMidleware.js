// src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  // 1. Obter o token do cabeçalho de autorização
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Nenhum token fornecido. Acesso negado.' });
  }

  // 2. Verificar o token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Adiciona a informação do usuário à requisição
    next(); // Procede para o próximo middleware ou rota
  } catch (error) {
    res.status(401).json({ error: 'Token inválido. Acesso negado.' });
  }
};