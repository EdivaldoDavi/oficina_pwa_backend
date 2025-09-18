const veiculoService = require('../services/veiculoService');

exports.criarVeiculo = async (req, res, next) => {
  try {
    const novoVeiculo = await veiculoService.criarVeiculo(req.body);
    res.status(201).json(novoVeiculo);
    } catch (err) {
    console.error("💥 Erro ao cadastrar novo cliente:", err);
    next(err); // Passa para o middleware de erro global
  }
};

exports.listarVeiculosDoCliente = async (req, res) => {
  const { clienteId } = req.params;
  try {
    const veiculos = await veiculoService.listarVeiculosDoCliente(clienteId);
    res.status(200).json(veiculos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// NOVO: Função para lidar com a requisição de todos os veículos
exports.listarTodosOsVeiculos = async (req, res) => {
  try {
    const veiculos = await veiculoService.listarTodosOsVeiculos();
    res.status(200).json(veiculos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
