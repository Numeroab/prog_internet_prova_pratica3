const database = require('../utils/db');
const bcrypt = require('bcryptjs');

const getAllUsers = async (req, res) => {
    try {
        const users = await database.getAll();
        
        // Remover senhas de todos os usuários
        const usersWithoutPasswords = users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        res.status(200).json(usersWithoutPasswords);

    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ 
            message: 'Erro interno do servidor',
            error: error.message 
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await database.getById(id);

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Remover senha da resposta
        const { password, ...userWithoutPassword } = user;

        res.status(200).json(userWithoutPassword);

    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ 
            message: 'Erro interno do servidor',
            error: error.message 
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, password } = req.body;

        // Verificar se usuário existe
        const existingUser = await database.getById(id);
        if (!existingUser) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Verificar se email já está em uso (por outro usuário)
        if (email && email !== existingUser.email) {
            const allUsers = await database.getAll();
            const emailExists = allUsers.find(user => 
                user.email === email && user.id !== id
            );
            if (emailExists) {
                return res.status(400).json({ message: 'Email já está em uso' });
            }
        }

        // Preparar dados para atualização
        const updateData = {};
        if (nome) updateData.nome = nome;
        if (email) updateData.email = email;
        
        // Se tiver nova senha, fazer hash
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        // Atualizar usuário
        const updatedUser = await database.update(id, updateData);

        // Remover senha da resposta
        const { password: _, ...userWithoutPassword } = updatedUser;

        res.status(200).json({
            message: 'Usuário atualizado com sucesso',
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ 
            message: 'Erro interno do servidor',
            error: error.message 
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar se usuário existe
        const user = await database.getById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Deletar usuário
        await database.delete(id);

        // Remover senha da resposta
        const { password, ...userWithoutPassword } = user;

        res.status(200).json({
            message: 'Usuário deletado com sucesso',
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        res.status(500).json({ 
            message: 'Erro interno do servidor',
            error: error.message 
        });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};