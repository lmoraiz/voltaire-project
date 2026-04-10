import pool from '../config/db.config';
import { Product, CreateProductInput, UpdateProductInput } from './models';

const productsService = {
  getAll: async (): Promise<Product[]> => {
    const { rows } = await pool.query<Product>('SELECT * FROM products ORDER BY id');
    return rows;
  },

  getById: async (id: number): Promise<Product | null> => {
    const { rows } = await pool.query<Product>('SELECT * FROM products WHERE id = $1', [id]);
    return rows[0] ?? null;
  },

  create: async (data: CreateProductInput): Promise<Product | null> => {
    const { name, price, stock, category } = data;
    try {
      const { rows } = await pool.query<Product>(
        `INSERT INTO products (name, price, stock, category)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [name, price, stock, category]
      );
      return rows[0];
    } catch (error: any) {
      if (error.code === '23505') return null; // unique_violation
      throw error;
    }
  },

  update: async (id: number, data: UpdateProductInput): Promise<Product | null> => {
    const fields = Object.keys(data) as (keyof UpdateProductInput)[];
    if (fields.length === 0) return null;

    const setClauses = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
    const values = fields.map(field => data[field]);

    const { rows } = await pool.query<Product>(
      `UPDATE products SET ${setClauses} WHERE id = $${fields.length + 1} RETURNING *`,
      [...values, id]
    );
    return rows[0] ?? null;
  },

  delete: async (id: number): Promise<boolean> => {
    const { rowCount } = await pool.query(
      'DELETE FROM products WHERE id = $1',
      [id]
    );
    return (rowCount ?? 0) > 0;
  },
};

export default productsService;
