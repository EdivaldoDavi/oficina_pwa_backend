// src/services/clienteService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// src/services/ClienteService.js
const { Prisma } = require("@prisma/client");

exports.criarCliente = async (dadosCliente) => {
  try {
    const novoCliente = await prisma.cliente.create({
      data: dadosCliente,
    });
    return novoCliente;
  } catch (error) {
    console.error("Erro do Prisma ao criar cliente:", error);

    if (error.code === "P2002") {
      let camposDuplicados = [];

      // Pode vir string ou array
      const target = error.meta?.target;

      if (Array.isArray(target)) {
        camposDuplicados = target;
      } else if (typeof target === "string") {
        // traduz constraints conhecidas
        if (target.includes("cpfCnpj")) camposDuplicados.push("cpf/CNPJ");
        if (target.includes("email")) camposDuplicados.push("e-mail");
      }

      if (camposDuplicados.length > 0) {
        throw new Error(
          `Já existe um cliente com este(s) campo(s): ${camposDuplicados.join(", ")}.`
        );
      }

      throw new Error("Já existe um cliente com este campo único.");
    }

    throw new Error("Erro ao cadastrar o cliente.");
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


exports.editarCliente = async (where, data) => {
  try {
    // Extrai apenas os campos do modelo Cliente
    const dadosParaAtualizar = {
      nome: data.nome,
      telefone: data.telefone,
      email: data.email,
      endereco: data.endereco,
      cidade: data.cidade,
      estado: data.estado,
      cep: data.cep,
      cpfCnpj: data.cpfCnpj,
      dataNasc: data.dataNasc,
    };

    const clienteAtualizado = await prisma.cliente.update({
      where, // ex: { id: clienteId }
      data: dadosParaAtualizar,
    });

    return clienteAtualizado;
  } catch (error) {
    console.error("Erro do Prisma ao editar cliente:", error);
    throw new Error("Erro ao editar o cliente.");
  }
};


exports.deletarCliente = async ({ where }) => {
  try {
    // 1️⃣ Verificar se existem veículos vinculados
    const totalVeiculos = await prisma.veiculo.count({
      where: {
        clienteId: where.id,
      },
    });

    if (totalVeiculos > 0) {
      throw new Error(
        `Este cliente não pode ser excluído, pois possui ${totalVeiculos} veículo(s) vinculado(s).`
      );
    }

    // 2️⃣ Verificar se existem orçamentos vinculados
    const totalOrcamentos = await prisma.orcamento.count({
      where: {
        clienteId: where.id,
      },
    });

    if (totalOrcamentos > 0) {
      throw new Error(
        `Este cliente não pode ser excluído, pois possui ${totalOrcamentos} orçamento(s) vinculado(s).`
      );
    }

    // 3️⃣ Se não houver vínculos, deletar o cliente
    await prisma.cliente.delete({
      where,
    });

    return { message: "Cliente deletado com sucesso" };
    
  } catch (error) {
    console.error("Erro ao deletar cliente:", error.message);

    // Se o erro for nosso, relançamos
    if (
      error.message.includes("veículo(s) vinculado(s)") ||
      error.message.includes("orçamento(s) vinculado(s)")
    ) {
      throw error;
    }

    // Prisma lança erro P2025 se o registro não for encontrado
    if (error.code === 'P2025') {
      throw new Error("Cliente não encontrado.");
    }

    // Para qualquer outro erro
    throw new Error("Ocorreu um erro ao tentar deletar o cliente.");
  }
};
