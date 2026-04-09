import { Request, Response } from "express";
import productsService from './service';
import { CreateProductSchema, UpdateProductSchema } from './schemas';
// Product Controller - Handle product operations
export default {
  // List products
  listProducts: async (req: Request, res: Response) => {
    try {
      const products = await productsService.getAll();
      res.status(200).json({ products });
    } catch (error) {
      res.status(500).json({ message: 'Error listing products' + error });
    }
  },

  // Get product by ID
  getProductById: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params['id'] as string);
      if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({ message: 'Invalid product ID' });
        return;
      }
      const product = await productsService.getById(id);
      if (product) {
        res.status(200).json({ product });
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error getting product' });
    }
  },

  // Create new product
  createProduct: async (req: Request, res: Response) => {
    try {
      const parsed = CreateProductSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({errors: parsed.error.flatten().fieldErrors });
        return;
      }
      const product = await productsService.create(parsed.data);
      if (product) {
        res.status(201).json({ product });
      } else {
        res.status(409).json({ message: 'A product with this name already exists' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error creating product' + error });
    }
  },

  // Update existing product
  updateProduct: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params['id']);
      if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({ message: 'Invalid product ID' });
        return;
      }
      const parsed = UpdateProductSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
        return;
      }
      const product = await productsService.update(id, parsed.data);
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }
      res.status(200).json({ product });
    } catch (error) {
      res.status(500).json({ message: 'Error updating product' });
    }
  },

  // Delete product
  deleteProduct: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params['id']);
      if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({ message: 'Invalid product ID' });
        return;
      }
      const deleted = await productsService.delete(id);
      if (!deleted) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting product' });
    }
  }
};