const { usuariosCollection: usuariosCollection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc } = require(
    //'./firebase-config'
);

const database = {

  getAll: async () => {
    try {
      const querySnapshot = await getDocs(usuariosCollection);
      const usuarios = [];
      
      querySnapshot.forEach((doc) => {
        usuarios.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return usuarios;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw new Error('Falha ao buscar usuários');
    }
  },
  

  getById: async (id) => {
    try {
      const docRef = doc(usuariosCollection, id);
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
  

  create: async (usuarioData) => {
    try {
      // Adicionar timestamps
      const usuarioComTimestamps = {
        ...usuarioData,
        dataCriacao: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString()
      };
      
      const docRef = await addDoc(usuariosCollection, usuarioComTimestamps);
      
      return {
        id: docRef.id,
        ...usuarioComTimestamps
      };
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw new Error('Falha ao criar usuário');
    }
  },
  

  update: async (id, usuarioData) => {
    try {
      const docRef = doc(usuariosCollection, id);
      const usuarioAtualizado = {
        ...usuarioData,
        dataAtualizacao: new Date().toISOString()
      };
      
      await updateDoc(docRef, usuarioAtualizado);
      
      return {
        id: id,
        ...usuarioAtualizado
      };
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw new Error('Falha ao atualizar usuário');
    }
  },
  

  delete: async (id) => {
    try {
      const docRef = doc(usuariosCollection, id);
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