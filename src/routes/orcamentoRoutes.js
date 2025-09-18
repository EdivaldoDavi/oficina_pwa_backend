const express = require('express');
const router = express.Router();
const orcamentoController = require('../controllers/orcamentoController');
const { protect } = require('../midlleware/authMidleware'); // Importe o middleware

router.get('/', orcamentoController.listarTodosOsOrcamentos);
router.post('/',protect, orcamentoController.criarOrcamento);
router.post('/enviar',protect, orcamentoController.enviarOrcamento);
// Editar orçamento (PUT)
router.put('/:id', protect, orcamentoController.editarOrcamento);

// Deletar orçamento (DELETE)
router.delete('/:id', protect, orcamentoController.deletarOrcamento);
// Rota para buscar orçamento por ID com serviços
router.get('/:id', protect, orcamentoController.obterOrcamentoPorId);

module.exports = router;