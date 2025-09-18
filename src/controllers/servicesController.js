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

module.exports = { criarService, listarTodosOsServices };
