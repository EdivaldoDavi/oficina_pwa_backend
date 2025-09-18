// src/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../midlleware/authMidleware'); // Importe o middleware

// Rota para buscar todos os usuários
router.get('/', userController.getUsers);

// Rota para criar um novo usuário
router.post('/',protect, userController.createUser);

module.exports = router;