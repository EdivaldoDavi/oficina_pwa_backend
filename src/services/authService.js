// src/services/authService.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Função para registrar um novo usuário
exports.register = async (nome, email, senha) => {
  try {
    console.log('Iniciando o registro do usuário...');
    console.log('Dados recebidos:', { nome, email, senha });

    // Criptografar senha antes de salvar
    const hashedPassword = await bcrypt.hash(senha.trim(), 10);

    const newUser = await prisma.user.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
        perfil: "usuario",
        ativo: true,
      },
    });

    console.log('Novo usuário criado com sucesso:', newUser.id);
    return newUser;
  } catch (error) {
    console.error('Erro durante o registro:', error);
    throw new Error('Erro ao registrar usuário. O e-mail já pode estar em uso.');
  }
};

// Função de login
exports.login = async (email, senha) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    // Verificar senha
    const isMatch = await bcrypt.compare(senha.trim(), user.senha);

    if (!isMatch) {
      throw new Error('Senha inválida.');
    }

    // Criar token JWT
    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    return { 
      token, 
      user: { id: user.id, nome: user.nome, email: user.email } 
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
