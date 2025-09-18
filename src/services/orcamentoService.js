const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const pdfGenerator = require('./pdfGenerator');
const whatsappSender = require('./whatsappSender');

// Criar orçamento
exports.criarOrcamento = async (dadosOrcamento) => {
  try {
    const valorTotal = (dadosOrcamento.itensServico || []).reduce(
      (acc, s) => acc + (s.valorUnitario * s.quantidade - (s.desconto || 0)),
      0
    );

    const novoOrcamento = await prisma.orcamento.create({
      data: {
        veiculoId: dadosOrcamento.veiculoId,
        clienteId: dadosOrcamento.clienteId,
        placa: dadosOrcamento.placa,
        valorTotal,
        observacoes: dadosOrcamento.observacoes,
        itensServico: {
          create: (dadosOrcamento.itensServico || []).map(s => ({
            descricao: s.descricao,
            quantidade: s.quantidade,
            valorUnitario: s.valorUnitario,
            desconto: s.desconto || 0,
            servicoId: s.servicoId || undefined,
          })),
        },
      },
      include: {
        cliente: true,
        veiculo: true,
        itensServico: { include: { servico: true } },
      },
    });

    return novoOrcamento;
  } catch (error) {
    console.error("Erro Prisma ao criar orçamento:", error);
    throw new Error("Erro ao criar o orçamento.");
  }
};

// Editar orçamento
exports.editarOrcamento = async ({ where, data }) => {
  try {
    // Calcula valor total atualizado
    const valorTotal = (data.itensServico || []).reduce(
      (acc, s) => acc + (s.valorUnitario * s.quantidade - (s.desconto || 0)),
      0
    );

    // Atualiza orçamento
    const atualizado = await prisma.orcamento.update({
      where,
      data: {
        veiculoId: data.veiculoId,
        clienteId: data.clienteId,
        placa: data.placa,
        valorTotal,
        observacoes: data.observacoes,
        // Remove itens antigos e cria os novos
        itensServico: {
          deleteMany: {},
          create: (data.itensServico || []).map(s => ({
            descricao: s.descricao,
            quantidade: s.quantidade,
            valorUnitario: s.valorUnitario,
            desconto: s.desconto || 0,
            servicoId: s.servicoId || undefined,
          })),
        },
      },
      include: {
        cliente: true,
        veiculo: true,
        itensServico: { include: { servico: true } },
      },
    });

    return atualizado;
  } catch (error) {
    console.error("Erro Prisma ao editar orçamento:", error);
    throw new Error("Erro ao editar o orçamento.");
  }
};

// Deletar orçamento
exports.deletarOrcamento = async ({ where }) => {
  try {
    // Remove itens de serviço associados
    await prisma.servicoOrcamento.deleteMany({
      where: { orcamentoId: where.id },
    });

    // Remove orçamento
    await prisma.orcamento.delete({ where });

    return { message: "Orçamento deletado com sucesso" };
  } catch (error) {
    console.error("Erro Prisma ao deletar orçamento:", error);
    throw new Error("Erro ao deletar o orçamento.");
  }
};

// Listar todos os orçamentos
exports.listarTodosOsOrcamentos = async () => {
  try {
    const orcamentos = await prisma.orcamento.findMany({
      include: {
        cliente: true,
        veiculo: true,
        itensServico: { include: { servico: true } },
      },
      orderBy: { dataEmissao: 'desc' },
    });

    return orcamentos;
  } catch (error) {
    console.error("Erro Prisma ao buscar orçamentos:", error);
    throw new Error("Erro ao buscar todos os orçamentos.");
  }
};

// Enviar orçamento por WhatsApp
exports.enviarOrcamento = async (id, telefone) => {
  const orcamento = await prisma.orcamento.findUnique({
    where: { id },
    include: {
      cliente: true,
      veiculo: true,
      itensServico: { include: { servico: true } },
    },
  });

  if (!orcamento) throw new Error('Orçamento não encontrado.');

  const pdfBuffer = await pdfGenerator.gerarPDF(orcamento);
  await whatsappSender.enviarPDF(telefone, pdfBuffer);

  return { message: 'Orçamento enviado com sucesso via WhatsApp!' };
};
exports.obterOrcamentoPorId = async (id) => {
  const orcamento = await prisma.orcamento.findUnique({
    where: { id },
    include: {
      cliente: true,
      veiculo: true,
      itensServico: {
        include: { servico: true },
      },
    },
  });

  if (!orcamento) {
    throw new Error('Orçamento não encontrado.');
  }

  // Garantir que cada item de serviço tenha um objeto 'servico'
  const itensServicoTratados = orcamento.itensServico.map(item => ({
    id: item.id,
    descricao: item.descricao,
    quantidade: item.quantidade,
    valorUnitario: item.valorUnitario,
    desconto: item.desconto,
    orcamentoId: item.orcamentoId,
    servicoId: item.servicoId ?? undefined,
    servico: item.servico ?? null, // manter null se não houver serviço vinculado
  }));

  return {
    ...orcamento,
    itensServico: itensServicoTratados,
  };
};