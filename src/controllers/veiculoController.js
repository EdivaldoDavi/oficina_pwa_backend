const veiculoService = require('../services/veiculoService');

// src/controllers/veiculoController.js
/*
exports.criarVeiculo = async (req, res, next) => {
  try {
    const novoVeiculo = await veiculoService.criarVeiculo(req.body);
    res.status(201).json(novoVeiculo);
  } catch (err) {
    console.error("💥 Erro ao cadastrar novo veículo:", err);

    // Verifica se é erro de duplicidade e envia mensagem amigável
    if (err.message.includes('campo(s)')) {
      return res.status(400).json({ fieldError: err.message });
    }

    next(err); // Passa para o middleware de erro global
  }
};*/

exports.criarVeiculo = async (req, res) => {
  try {
    const novoVeiculo = await veiculoService.criarVeiculo(req.body);
    res.status(201).json(novoVeiculo);
  } catch (error) {
    console.error("Erro ao cadastrar novo veículo:", error.message);

    // Aqui já vem a mensagem amigável do service
    res.status(400).json({ error: error.message });
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



// Adicione este método
 exports.editarVeiculo = async (req, res) => {
  const { id } = req.params;
  const dados = req.body;

  try {
    const atualizado = await veiculoService.editarVeiculo(
      { id: Number(id) }, // where
      dados               // data
    );
    return res.json(atualizado);
  } catch (error) {
    console.error(`Erro ao editar veiculo ${id}:`, error);
    return res.status(500).json({ error: error.message });
  }
};


 exports.deletarVeiculo = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await veiculoService.deletarVeiculo({
      where: { id: Number(id) },
    });
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};