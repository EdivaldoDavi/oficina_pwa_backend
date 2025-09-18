
const userService = require('../services/userService');

/**
 * Lida com a requisição GET para buscar todos os usuários.
 */
exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lida com a requisição POST para criar um novo usuário.
 */
exports.createUser = async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    // O controller determina o status HTTP com base no erro do service.
    res.status(400).json({ error: error.message });
  }
};