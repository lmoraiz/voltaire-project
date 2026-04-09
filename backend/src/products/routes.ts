// Product Routes - Complete endpoints definition
import productsController from './controller';
import { Router } from 'express';

const router = Router();

// List products (with optional filters: category, stock > 0)
router.get('/products', productsController.listProducts);

// Get product details by ID
router.get('/products/:id', productsController.getProductById);

// Create new product
router.post('/products', productsController.createProduct);

// Update existing product
router.put('/products/:id', productsController.updateProduct);

// Delete product
router.delete('/products/:id', productsController.deleteProduct);

export default router;
