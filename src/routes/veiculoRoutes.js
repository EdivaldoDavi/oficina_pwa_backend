const express = require('express');
const router = express.Router();
const veiculoController = require('../controllers/veiculoController');
const { protect } = require('../midlleware/authMidleware'); // Importe o middleware

router.post('/', protect, veiculoController.criarVeiculo);
router.get('/:clienteId', veiculoController.listarVeiculosDoCliente);
router.get('/', veiculoController.listarTodosOsVeiculos);
module.exports = router;