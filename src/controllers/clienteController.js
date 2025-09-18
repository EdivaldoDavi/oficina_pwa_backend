const clienteService = require('../services/ClienteService');
 
exports.criarCliente = async (req, res) => {
  try {
    const novoCliente = await clienteService.criarCliente(req.body);
    res.status(201).json(novoCliente);
  } catch (err) {
    console.error("💥 Erro ao cadastrar novo cliente:", err);
    next(err); // Passa para o middleware de erro global
  }
};

exports.listarClientes = async (req, res) => {
  try {
    const clientes = await clienteService.listarClientes();
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};