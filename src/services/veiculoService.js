// src/services/veiculoService.js
const { PrismaClient } = require('@prisma/client');
//const prisma = new PrismaClient();

// /app/src/services/veiculoService.js

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

exports.criarVeiculo = async (dadosVeiculo) => {
  try {
    console.log('[veiculoService] criarVeiculo payload:', dadosVeiculo);

    // Use o formato correto: { data: ... }
    const novoVeiculo = await prisma.veiculo.create({
      data: dadosVeiculo,
    });

    console.log('[veiculoService] criado:', novoVeiculo);
    return novoVeiculo;
  } catch (err) {
    console.error('[veiculoService] erro prisma:', err);
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

   // Atualiza orçamento
   // services/service.js
exports.editarVeiculo = async (where, data) => {
  try {
    // Extrai apenas os campos que pertencem ao modelo Veiculo do objeto 'data'
    // para garantir que apenas dados pertinentes sejam atualizados.
    const dadosParaAtualizar = {
      placa: data.placa,
      marca: data.marca,
      modelo: data.modelo,
      ano: data.ano,
      cor: data.cor,
      chassi: data.chassi,
      kmAtual: data.kmAtual,
      clienteId: data.clienteId, // Se você permitir a alteração do proprietário
    };

    const veiculoAtualizado = await prisma.veiculo.update({
      where, // Critério para encontrar o registro (ex: { id: veiculoId })
      data: dadosParaAtualizar,
    });

    return veiculoAtualizado;
  } catch (error) {
    // Log detalhado do erro para depuração no servidor
    console.error("Erro do Prisma ao editar veículo:", error);

    // Lança um erro genérico para o cliente/front-end
    throw new Error("Erro ao editar o veículo.");
  }
};

// Deletar orçamento
exports.deletarVeiculo = async ({ where }) => {
  try {
    // 1️⃣ Primeiro, verificamos a existência de orçamentos para este veículo.
    // Usar 'count' é muito eficiente para esta tarefa.
    const totalOrcamentos = await prisma.orcamento.count({
      where: {
        veiculoId: where.id, // Assumimos que o 'where' sempre terá o 'id'.
      },
    });

    // 2️⃣ Se encontrarmos 1 ou mais orçamentos, lançamos um erro com uma mensagem clara.
    if (totalOrcamentos > 0) {
      // Este erro será capturado pelo bloco 'catch' no seu controller.
      throw new Error(
        `Este veículo não pode ser excluído, pois possui ${totalOrcamentos} orçamento(s) vinculado(s).`
      );
    }

    // 3️⃣ Se não houver orçamentos, podemos deletar o veículo com segurança.
    // O 'delete' pode dar um erro se o veículo não for encontrado, que será pego pelo 'catch'.
    await prisma.veiculo.delete({
      where,
    });

    return { message: "Veículo deletado com sucesso" };
    
  } catch (error) {
    console.error("Erro ao deletar veículo:", error.message);

    // Se o erro foi o que nós mesmos criamos, apenas o relançamos.
    if (error.message.includes("orçamento(s) vinculado(s)")) {
      throw error;
    }

    // Prisma lança um erro P2025 se o registro a ser deletado não for encontrado.
    if (error.code === 'P2025') {
        throw new Error("Veículo não encontrado.");
    }

    // Para qualquer outro tipo de erro.
    throw new Error("Ocorreu um erro ao tentar deletar o veículo.");
  }
};

