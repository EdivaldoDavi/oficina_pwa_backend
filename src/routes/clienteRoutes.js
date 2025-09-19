const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const { protect } = require('../midlleware/authMidleware'); // Importe o middleware


router.post('/', protect, clienteController.criarCliente);
router.get('/', clienteController.listarClientes);
router.put('/:id', protect, clienteController.editarCliente);
console.log("clienteController:", clienteController);
// Deletar orçamento (DELETE)
router.delete('/:id', protect, clienteController.deletarCliente);
module.exports = router;