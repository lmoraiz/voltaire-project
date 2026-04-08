import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import cors from "cors"
import productRoutes from './api/products/routes';
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import and mount product routes
app.use('/api', productRoutes);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;

