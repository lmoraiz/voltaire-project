import { Request} from 'express';

export interface LoginInfo extends Request {
    userId?: string
}