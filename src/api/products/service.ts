import pool from '../../config/db.config';
import { Product } from './model';

const productsService = {
  getAll: async (): Promise<Product[]> => {
    const { rows } = await pool.query<Product>('SELECT * FROM products ORDER BY id');
    return rows;
  },
};

export default productsService;
