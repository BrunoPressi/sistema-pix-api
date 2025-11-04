import {UsuarioService} from "../services/UsuarioService";
import {NextFunction, Request, Response} from "express";
import {TransacaoService} from "../services/TransacaoService";
import {UsuarioPatchDTO} from "../dtos/UsuarioPatchDto";

export class UsuarioController {
    static async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const usuarios = await UsuarioService.buscarTodosUsuarios();
            res.type('application/json')
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
            res.type('application/json')
            res.statusCode=201;
            res.statusMessage="Created";
            return res.json({
                Usuario: usuario
            });
        }
        catch (err: any) {
            next(err);
        }
    }

    static async findById(req: Request, res: Response, next: NextFunction) {
        try {
            const usuario = await UsuarioService.buscarUsuarioId(req.params['id'] as unknown as number);

            const token = res.locals.token;
            const tokenID: number  = token.id;
            const userID: number = usuario.id;

            if (tokenID != userID) { // Usuario só pode buscar as informações dele mesmo.
                const error: any = new Error('Voce não tem permissão para acessar esse recurso.');
                error.statusCode=401;
                error.statusMessage='Unauthorized';
                throw error;
            }

            res.type('application/json')
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
            const usuarioVelho = await UsuarioService.buscarUsuarioId(parseInt(req.params['id']));
            const usuarioNovo: UsuarioPatchDTO = req.body;

            const token = res.locals.token;
            const tokenID: number  = token.id;
            const userID: number = parseInt(req.params['id']);

            if (tokenID != userID) { // Usuario só pode atualizar as informações dele mesmo.
                const error: any = new Error('Voce não tem permissão para atualizar esse recurso.');
                error.statusCode=401;
                error.statusMessage='Unauthorized';
                throw error;
            }

            const usuario = await UsuarioService.atualizarUsuario(usuarioNovo, usuarioVelho);
            res.type('application/json')
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
            const usuario = await UsuarioService.buscarUsuarioId(parseInt(req.params['id']));

            const token = res.locals.token;
            const tokenID: number  = token.id;
            const userID: number = parseInt(req.params['id']);

            if (tokenID != userID) { // Usuario só pode deletar as informações dele mesmo.
                const error: any = new Error('Voce não tem permissão para deletar esse recurso.');
                error.statusCode=401;
                error.statusMessage='Unauthorized';
                throw error;
            }

            await UsuarioService.deletarUsuario(usuario.id);
            res.statusCode=204;
            res.json();
        }
        catch (err: any) {
            next(err);
        }
    }

    static async findChaves(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await UsuarioService.buscarUsuarioId(req.params['id'] as unknown as number);

            const token = res.locals.token;
            const tokenID: number  = token.id;
            const userID: number = parseInt(req.params['id']);

            if (tokenID != userID) { // Usuario só pode buscar as chaves dele mesmo.
                const error: any = new Error('Voce não tem permissão para acessar esse recurso.');
                error.statusCode=401;
                error.statusMessage='Unauthorized';
                throw error;
            }

            const chaves = await UsuarioService.buscarChavesDoUsuario(user.id);
            res.statusCode=200;
            res.statusMessage='Success';
            res.type('application/json');
            res.json({
                Chaves: chaves?.chaves
            })
        }
        catch (err: any) {
            next(err);
        }
    }

    static async findTransacoes(req: Request, res: Response, next: NextFunction) {
        try {
            const token = res.locals.token;
            const userID = req.params['id'] as unknown as number;

            const usuario = await UsuarioService.buscarUsuarioId(userID);

            if (token.id != userID) {
                const error: any = new Error('Voce não tem permissão para visualizar esse recurso.')
                error.statusCode=401;
                error.statusMessage='Unauthorized';
                throw  error;
            }

            const transacoes = await TransacaoService.findTransacoesByUser(usuario.id);
            res.statusCode=200;
            res.statusMessage='Success';
            res.type('application/json');
            res.json({
               Transacoes: transacoes
            });
        }
        catch (err: any) {
            next(err);
        }
    }
}