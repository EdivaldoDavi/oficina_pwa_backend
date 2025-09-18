const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');
const { protect } = require('../midlleware/authMidleware'); // Importe o middleware

router.post('/', protect, servicesController.criarService);
router.get('/', servicesController.listarTodosOsServices);
module.exports = router;