const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

// Rotas
const authRoutes = require('./routes/authRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const userRoutes = require('./routes/userRoutes');
const veiculoRoutes = require('./routes/veiculoRoutes');
const orcamentoRoutes = require('./routes/orcamentoRoutes');
const servicesRoutes = require('./routes/servicesRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Prisma Client
const prisma = new PrismaClient();

// Middlewares
app.use(express.json());
app.use(cors());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/users', userRoutes);
app.use('/api/veiculos', veiculoRoutes);
app.use('/api/orcamentos', orcamentoRoutes);
app.use('/api/services', servicesRoutes);

// Middleware de tratamento de erros (deve vir **depois das rotas**)
app.use((err, req, res, next) => {
  console.error('💥 Erro capturado pelo middleware:', err);
  res.status(500).json({ message: err.message, stack: err.stack });
});

// Testar conexão com banco e iniciar servidor
async function main() {
  try {
    await prisma.$connect();
    console.log('✅ Conectado ao banco de dados com Prisma.');

    app.listen(port, () => {
      console.log(`🚀 Backend rodando em http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ Erro ao conectar no banco:', error);
    process.exit(1);
  }
}

main();

// Encerrar Prisma quando app fechar
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
