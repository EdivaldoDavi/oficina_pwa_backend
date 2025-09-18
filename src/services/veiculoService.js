// src/services/veiculoService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// /app/src/services/veiculoService.js

exports.criarVeiculo = async (dadosVeiculo) => {
  try {
    const novoVeiculo = await prisma.veiculo.create({
      data: dadosVeiculo,
    });
    return novoVeiculo;
  } catch (error) {
    // ----> ADICIONE ESTA LINHA PARA VER O ERRO COMPLETO <----
    console.error("DETALHES DO ERRO DO PRISMA:", error);
    
    // Você ainda pode lançar o erro genérico para a API, se quiser
    throw new Error('Erro ao cadastrar o veículo.');
  }
};

exports.listarVeiculosDoCliente = async (clienteId) => {
  try {
    const veiculos = await prisma.veiculo.findMany({
      where: { clienteId },
    });
    return veiculos;
  } catch (error) {
    throw new Error('Erro ao buscar veículos do cliente.');
  }
};

// Função para listar todos os veículos
exports.listarTodosOsVeiculos = async () => {
  try {
    const veiculos = await prisma.veiculo.findMany();
    return veiculos;
  } catch (error) {
    throw new Error('Erro ao buscar todos os veículos.');
  }
};
