const { db, collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc, query, where } = require('../config/firebase');

const database = {
  // CREATE - Criar usuário
  create: async (usuarioData) => {
    try {
      const usuarioComTimestamps = {
        ...usuarioData,
        dataCriacao: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString()
      };
      
      const docRef = await addDoc(collection(db, 'users'), usuarioComTimestamps);
      
      return {
        id: docRef.id,
        ...usuarioComTimestamps
      };
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw new Error('Falha ao criar usuário');
    }
  },

  // READ - Buscar todos usuários
  getAll: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const users = [];
      
      querySnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return users;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw new Error('Falha ao buscar usuários');
    }
  },

  // READ - Buscar usuário por ID
  getById: async (id) => {
    try {
      const docRef = doc(db, 'users', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw new Error('Falha ao buscar usuário');
    }
  },

  // READ - Buscar usuário por email (para login)
  getByEmail: async (email) => {
    try {
      const q = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Erro ao buscar usuário por email:', error);
      throw new Error('Falha ao buscar usuário');
    }
  },

  // UPDATE - Atualizar usuário
  update: async (id, usuarioData) => {
    try {
      const docRef = doc(db, 'users', id);
      const usuarioAtualizado = {
        ...usuarioData,
        dataAtualizacao: new Date().toISOString()
      };
      
      await updateDoc(docRef, usuarioAtualizado);
      
      // Buscar dados atualizados
      const updatedDoc = await getDoc(docRef);
      
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      };
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw new Error('Falha ao atualizar usuário');
    }
  },

  // DELETE - Deletar usuário
  delete: async (id) => {
    try {
      const docRef = doc(db, 'users', id);
      const usuario = await database.getById(id);
      
      if (usuario) {
        await deleteDoc(docRef);
        return usuario;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw new Error('Falha ao deletar usuário');
    }
  }
};

module.exports = database;