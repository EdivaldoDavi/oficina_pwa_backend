// src/services/veiculoService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.criarService = async (dadosService) => {
  try {
    const novoService = await prisma.servico.create({
      data: dadosService,
    });
    return novoService;
  } catch (error) {
    throw new Error('Erro ao cadastrar o serviço.');
  }
};


// Função para listar todos os veículos
exports.listarTodosOsServices  = async () => {
  try {
    const services = await prisma.servico.findMany();
    return services;
  } catch (error) {
    throw new Error('Erro ao buscar todos os serviços.');
  }
};
