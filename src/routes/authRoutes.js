// src/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota para o login
router.post('/login', authController.login);

// NOVO: Rota para o registro
router.post('/register', authController.register);

module.exports = router;