import {registrerUser, loginUser, getTodosDados, getDadoPorId, atualizaDado, deletaDado} from "../controllers/usersController.js"
import { authenticateToken } from '../middleware/auth.js';
import express from 'express';


const router = express.Router();

router.post('/register', registrerUser);
router.post('/login', loginUser);
router.get('/users', authenticateToken, getTodosDados);
router.get('/users/:id', authenticateToken, getDadoPorId);
router.put('/users/:id', authenticateToken, atualizaDado);
router.delete('/users/:id', authenticateToken, deletaDado);

export { router };