const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');
const { protect } = require('../midlleware/authMidleware'); // Importe o middleware

router.post('/', protect, servicesController.criarService);
router.get('/', servicesController.listarTodosOsServices);
// Editar orçamento (PUT)
console.log("servicesController:", servicesController);

router.put('/:id', protect, servicesController.editarServico);

// Deletar orçamento (DELETE)
router.delete('/:id', protect, servicesController.deletarServico);
module.exports = router;