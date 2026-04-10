// Auth Routes - Complete endpoints definition
import authController from './controller';
import { Router } from 'express';

const router = Router();

// List products (with optional filters: category, stock > 0)
router.post('/auth/login', authController.login);

export default router;
