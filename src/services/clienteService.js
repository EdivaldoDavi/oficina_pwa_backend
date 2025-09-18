// src/services/clienteService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.criarCliente = async (dadosCliente) => {
  try {
    const novoCliente = await prisma.cliente.create({
      data: dadosCliente,
    });
    return novoCliente;
  } catch (error) {
    throw new Error('Erro ao cadastrar o cliente.');
  }
};

exports.listarClientes = async () => {
  try {
    const clientes = await prisma.cliente.findMany();
    return clientes;
  } catch (error) {
    throw new Error('Erro ao buscar clientes.');
  }
};
