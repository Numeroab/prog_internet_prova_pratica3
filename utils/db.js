const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // CORREÇÃO: import correto

const DB_PATH = path.join(__dirname, '..', 'db.json');

const database = {
  readDB: async () => {
    try {
      const data = await fs.readFile(DB_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return { users: [] };
    }
  },

  saveDB: async (data) => {
    try {
      await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
    } catch (error) {
      throw new Error('Erro ao salvar dados no arquivo');
    }
  },

  create: async (usuarioData) => {
    try {
      const db = await database.readDB();
      
      // Verificar se usuário já existe
      const usuarioExistente = db.users.find(user => user.email === usuarioData.email);
      if (usuarioExistente) {
        throw new Error('Usuário já existe');
      }
      
      // CORREÇÃO: Usar uuidv4() corretamente
      const novoUsuario = {
        id: uuidv4(),
        ...usuarioData,
        dataCriacao: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString()
      };
      
      db.users.push(novoUsuario);
      await database.saveDB(db);
      
      return novoUsuario;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw new Error('Falha ao criar usuário: ' + error.message);
    }
  },

  getAll: async () => {
    try {
      const db = await database.readDB();
      return db.users;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw new Error('Falha ao buscar usuários');
    }
  },

  getById: async (id) => {
    try {
      const db = await database.readDB();
      const usuario = db.users.find(user => user.id === id);
      return usuario || null;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw new Error('Falha ao buscar usuário');
    }
  },

  getByEmail: async (email) => {
    try {
      const db = await database.readDB();
      const usuario = db.users.find(user => user.email === email);
      return usuario || null;
    } catch (error) {
      console.error('Erro ao buscar usuário por email:', error);
      throw new Error('Falha ao buscar usuário');
    }
  },

  update: async (id, usuarioData) => {
    try {
      const db = await database.readDB();
      const usuarioIndex = db.users.findIndex(user => user.id === id);
      
      if (usuarioIndex === -1) {
        throw new Error('Usuário não encontrado');
      }
      
      const usuarioAtualizado = {
        ...db.users[usuarioIndex],
        ...usuarioData,
        dataAtualizacao: new Date().toISOString()
      };
      
      db.users[usuarioIndex] = usuarioAtualizado;
      await database.saveDB(db);
      
      return usuarioAtualizado;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw new Error('Falha ao atualizar usuário: ' + error.message);
    }
  },

  delete: async (id) => {
    try {
      const db = await database.readDB();
      const usuarioIndex = db.users.findIndex(user => user.id === id);
      
      if (usuarioIndex === -1) {
        return null;
      }
      
      const usuarioDeletado = db.users[usuarioIndex];
      db.users.splice(usuarioIndex, 1);
      await database.saveDB(db);
      
      return usuarioDeletado;
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw new Error('Falha ao deletar usuário');
    }
  }
};

module.exports = database;