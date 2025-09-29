const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/usersController');

// Todas as rotas protegidas por JWT
router.get('/', authenticateToken, getAllUsers);
router.get('/:id', authenticateToken, getUserById);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);

module.exports = router;