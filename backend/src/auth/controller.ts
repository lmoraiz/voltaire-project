import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { LoginInfo } from "./schemas";

const SECRET = process.env.JWT_SECRET!;

// Auth Controller - Handle auth operations
export default {

  login: async (req: Request, res: Response) => {
    const loginInfo = LoginInfo.safeParse(req.body);
    if (!loginInfo.success) {
        res.status(400).json({errors: loginInfo.error.flatten().fieldErrors });
        return;
    }
    const payload = { userId: loginInfo.data.userId};
    const token = jwt.sign(payload, SECRET, { expiresIn: '1h' });
    res.json({ token });
  },
};