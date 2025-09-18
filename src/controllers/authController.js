// src/controllers/authController.js

const authService = require('../services/authService');

exports.login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const data = await authService.login(email, senha);
    res.status(200).json(data);
  } catch (error) {
    res.status(401).json({ error: 'Credenciais inválidas.' });
  }
};

// NOVO: Função para lidar com o registro de usuário
exports.register = async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const newUser = await authService.register(nome, email, senha);
    res.status(201).json({
      message: 'Usuário registrado com sucesso!',
      user: {
        id: newUser.id,
        nome: newUser.nome,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};