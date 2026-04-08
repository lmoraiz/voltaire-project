import { z } from 'zod';

export const CreateProductSchema = z.object({
  name: z.string().min(1, 'name is required'),
  price: z.number({ error: 'price must be a positive number' }).positive('price must be positive'),
  stock: z.number({ error: 'stock must be a number' }).int().min(0, 'stock cannot be negative'),
  category: z.string().min(1, 'category is required'),
});

export const UpdateProductSchema = CreateProductSchema.partial();
