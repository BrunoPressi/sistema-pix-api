import {UsuarioService} from "../services/UsuarioService";
import {NextFunction, Request, Response} from "express";
import {Usuario} from "../entities/Usuario";

export class UsuarioController {
    static async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const usuarios = await UsuarioService.buscarTodosUsuarios();
            return res.json({
                Usuarios: usuarios
            });
        }
        catch (err) {
            res.statusCode=500;
            res.statusMessage="Internal Server Error";
            next(err);
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const usuario = await UsuarioService.criarNovoUsuario(req.body);
            res.statusCode=201;
            res.statusMessage="Created";
            return res.json({
                Usuario: usuario
            });
        }
        catch (err: any) {
            res.statusCode=err.statusCode;
            res.statusMessage=err.statusMessage;
            next(err);
        }
    }

    static async findById(req: Request, res: Response, next: NextFunction) {
        try {
            const usuario = await UsuarioService.buscarUsuarioId(req.params['id'] as unknown as number);
            res.statusCode=200;
            res.statusMessage='OK';
            res.json({
                Usuario: usuario
            });
        }
        catch (err: any) {
            next(err);
        }
    }

    static async patch(req: Request, res:Response, next: NextFunction) {
        try {
            const usuario = await UsuarioService.atualizarUsuario(req.body, req.params['id'] as unknown as number);
            res.statusCode=200;
            res.statusMessage="OK";
            res.json({
                Usuario: usuario
            });
        }
        catch (err: any) {
            next(err);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await UsuarioService.deletarUsuario(req.params['id'] as unknown as number);
            res.statusCode=204;
            res.json();
        }
        catch (err: any) {
            next(err);
        }
    }
}