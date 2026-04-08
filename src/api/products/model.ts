export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  created_at: Date;
}

export type CreateProductInput = Omit<Product, 'id' | 'created_at' | 'updated_at'>;
export type UpdateProductInput = Partial<CreateProductInput>;
