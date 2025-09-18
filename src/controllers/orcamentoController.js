const orcamentoService = require('../services/orcamentoService');

exports.criarOrcamento = async (req, res) => {
  try {
    const body = req.body;

    // Força números nos campos obrigatórios
    const dadosOrcamento = {
      ...body,
      veiculoId: Number(body.veiculoId),
      clienteId: Number(body.clienteId),
      itensServico: (body.itensServico || []).map(s => ({
        descricao: s.descricao || "",
        quantidade: Number(s.quantidade) || 1,
        valorUnitario: Number(s.valorUnitario) || 0,
        desconto: Number(s.desconto) || 0,
        servicoId: s.servicoId ? Number(s.servicoId) : undefined,
      })),
    };

    const novoOrcamento = await orcamentoService.criarOrcamento(dadosOrcamento);
    res.status(201).json(novoOrcamento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.editarOrcamento = async (req, res) => {
  const { id } = req.params;
  const dados = req.body;

  try {
    const atualizado = await orcamentoService.editarOrcamento({
      where: { id: Number(id) },
      data: dados,
    });
    return res.json(atualizado);
  } catch (error) {
    console.error(`Erro ao editar orçamento ${id}:`, error);
    return res.status(500).json({ error: error.message });
  }
};


exports.deletarOrcamento = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await orcamentoService.deletarOrcamento({
      where: { id: Number(id) },
    });
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.listarTodosOsOrcamentos = async (req, res) => {
  try {
    const orcamentos = await orcamentoService.listarTodosOsOrcamentos();
    res.status(200).json(orcamentos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.enviarOrcamento = async (req, res) => {
  const { id, telefone } = req.body;

  try {
    const resultado = await orcamentoService.enviarOrcamento(id, telefone);
    res.status(200).json(resultado);
  } catch (error) {
    if (error.message === 'Orçamento não encontrado.') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.obterOrcamentoPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const orcamento = await orcamentoService.obterOrcamentoPorId(Number(id));

    if (!orcamento) {
      return res.status(404).json({ error: "Orçamento não encontrado" });
    }

    return res.json(orcamento);
  } catch (error) {
    console.error(`Erro ao buscar orçamento ${id}:`, error);
    return res.status(500).json({ error: error.message });
  }
};