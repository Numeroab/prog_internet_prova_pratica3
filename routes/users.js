const express = require('express');
const router = express.Router();
const database = require('../dados/database');
router.post('/', async (req, res) => {
    try {
      const { nome, email, senha} = req.body;
      
      if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }
      
      const novoUsuario = await database.create(req.body);
      res.status(201).json(novoUsuario);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.post('/', async (req, res) => {
   
  });



router.get('/', async (req, res) => {
    try {
      const usuarios = await database.getAll();
      res.json(alunos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const usuario = await database.getById(req.params.id);
      
      if (usuario) {
        res.json(usuario);
      } else {
        res.status(404).json({ error: 'Usuário não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const alunoRemovido = await database.delete(req.params.id);
      
      if (alunoRemovido) {
        res.json({ message: 'Usuario removido com sucesso', aluno: alunoRemovido });
      } else {
        res.status(404).json({ error: 'Usuario não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  module.exports = router;