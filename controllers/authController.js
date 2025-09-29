const database = require('../utils/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// CORREÇÃO: Usar require do uuid de forma compatível
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_super_secreto';

const register = async (req, res) => {
    try {
        const { nome, email, senha } = req.body; // CORREÇÃO: mudar 'password' para 'senha'

        // Validações
        if (!nome || !email || !senha) {
            return res.status(400).json({ 
                message: 'Todos os campos são obrigatórios: nome, email, senha' 
            });
        }

        // Verificar se usuário já existe
        const existingUser = await database.getByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Usuário já existe' });
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(senha, 10);

        // Criar usuário
        const newUser = await database.create({
            nome,
            email,
            password: hashedPassword
        });

        // Remover senha da resposta
        const { password: _, ...userWithoutPassword } = newUser;

        res.status(201).json({
            message: 'Usuário criado com sucesso',
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Erro no register:', error);
        res.status(500).json({ 
            message: 'Erro interno do servidor',
            error: error.message 
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, senha } = req.body; // CORREÇÃO: mudar 'password' para 'senha'

        // Validações
        if (!email || !senha) {
            return res.status(400).json({ 
                message: 'Email e senha são obrigatórios' 
            });
        }

        // Buscar usuário
        const user = await database.getByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        // Verificar senha
        const isPasswordValid = await bcrypt.compare(senha, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        // Gerar JWT
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email 
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Remover senha da resposta
        const { password: _, ...userWithoutPassword } = user;

        res.status(200).json({
            message: 'Login realizado com sucesso',
            token,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ 
            message: 'Erro interno do servidor',
            error: error.message 
        });
    }
};

module.exports = {
    register,
    login
};