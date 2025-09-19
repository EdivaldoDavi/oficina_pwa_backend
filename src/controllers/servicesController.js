const servicesService = require('../services/servicesService');

const criarService = async (req, res) => {
  try {
    const novoService = await servicesService.criarService(req.body);
    res.status(201).json(novoService);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const listarTodosOsServices = async (req, res) => {
  try {
    const services = await servicesService.listarTodosOsServices();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Adicione este método
 const editarServico = async (req, res) => {
  const { id } = req.params;
  const dados = req.body;

  try {
    const atualizado = await servicesService.editarServico(
      { id: Number(id) }, // where
      dados               // data
    );
    return res.json(atualizado);
  } catch (error) {
    console.error(`Erro ao editar serviço ${id}:`, error);
    return res.status(500).json({ error: error.message });
  }
};


 const deletarServico = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await servicesService.deletarServico({
      where: { id: Number(id) },
    });
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = { criarService, listarTodosOsServices, editarServico, deletarServico };
