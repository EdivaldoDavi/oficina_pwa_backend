// src/services/userService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getUsers = async () => {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    throw new Error('Erro ao buscar usuários.');
  }
};

exports.createUser = async (userData) => {
  try {
    const newUser = await prisma.user.create({
      data: userData,
    });
    return newUser;
  } catch (error) {
    throw new Error('Erro ao criar o usuário.');
  }
};
