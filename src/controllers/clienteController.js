const clienteService = require('../services/ClienteService');
 
exports.criarCliente = async (req, res) => {
  try {
    const novoCliente = await clienteService.criarCliente(req.body);
    res.status(201).json(novoCliente);
  } catch (error) {
    console.error("Erro ao cadastrar novo cliente:", error.message);

    // Aqui já vem a mensagem amigável do service
    res.status(400).json({ error: error.message });
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


// Adicione este método
 exports.editarCliente = async (req, res) => {
  const { id } = req.params;
  const dados = req.body;

  try {
    const atualizado = await clienteService.editarCliente(
      { id: Number(id) }, // where
      dados               // data
    );
    return res.json(atualizado);
  } catch (error) {
    console.error(`Erro ao editar cliente ${id}:`, error);
    return res.status(500).json({ error: error.message });
  }
};


 exports.deletarCliente = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await  clienteService.deletarCliente({
      where: { id: Number(id) },
    });
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};