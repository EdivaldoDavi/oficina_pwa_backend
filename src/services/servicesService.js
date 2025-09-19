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


    // Atualiza orçamento
   // services/service.js
exports.editarServico = async (where, data) => {
  try {
    const servicoAtualizado = await prisma.servico.update({
      where,
      data: {
        nome: data.nome,
        descricao: data.descricao,
        precoBase: data.precoBase,
        ativo: data.ativo,
      },
    });
    return servicoAtualizado;
  } catch (error) {
    console.error("Erro Prisma ao editar serviço:", error);
    throw new Error("Erro ao editar o serviço.");
  }
};

// Deletar orçamento
exports.deletarServico = async ({ where }) => {
  try {
    // 1️⃣ Verifica se existem registros na tabela ServicoOrcamento
    const existeRelacionamento = await prisma.servicoOrcamento.findFirst({
      where: { servicoId: where.id },
    });

    if (existeRelacionamento) {
      throw new Error(
        "Não é possível deletar este serviço, pois ele está associado a um orçamento."
      );
    }

    // 2️⃣ Deleta o serviço
    await prisma.servico.delete({ where });

    return { message: "Serviço deletado com sucesso" };
  } catch (error) {
    console.error("Erro Prisma ao deletar serviço:", error);
    throw new Error(error.message || "Erro ao deletar o serviço.");
  }
};

