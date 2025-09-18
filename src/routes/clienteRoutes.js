const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const { protect } = require('../midlleware/authMidleware'); // Importe o middleware


router.post('/', protect, clienteController.criarCliente);
router.get('/', clienteController.listarClientes);

module.exports = router;