import jwt from 'jsonwebtoken';
import {NextFunction, Request, Response} from "express";
import {blacklist} from "../services/LogoutService";

const SECRET_KEY = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES;

export function generateJwt(id: number, nomeCompleto: string, numeroConta: number) {
    try {
        const token = jwt.sign(
            {id, nomeCompleto, numeroConta},
            SECRET_KEY!,
            {
                expiresIn: parseInt(EXPIRES_IN!),
                algorithm: 'HS256'
            }
        );
        return token;
    }
    catch (err: any) {
        throw new Error(`Falha ao gerar JWT Token: ${err.message}`);
    }
}

export function verifyJwt(req: Request, res: Response, next: NextFunction) {
    let token = req.headers['authorization'];

    if (!token) {
        const error: any  = new Error('Insira um Token JWT.');
        error.statusCode=401;
        error.statusMessage='Unauthorized'
        throw error;
    }

    token = req.headers['authorization']?.replace("Bearer ", "");

    if (blacklist[token!]) {
        const error: any  = new Error('Token Inválido.');
        error.statusCode=403;
        error.statusMessage='Forbidden'
        throw error;
    }

    const decoded = jwt.verify(token!, process.env.JWT_SECRET!);

    if (!decoded) {
        const error: any  = new Error('Token Inválido.');
        error.statusCode=403;
        error.statusMessage='Forbidden'
        throw error;
    }

    res.locals.token = decoded;
    return next();
}