import {NextFunction, Request, Response} from "express";
import { ChaveService } from "../services/ChaveService";
import {UsuarioService} from "../services/UsuarioService";

export class ChaveController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const usuario = await UsuarioService.buscarUsuarioId(req.params['usuarioID'] as unknown as number);

            const token = res.locals.token;
            const tokenID: number  = token.id;
            const userID: number = parseInt(req.params['usuarioID']);

            if (tokenID != userID) { // Usuario só pode criar uma chave para ele mesmo.
                const error: any = new Error('Voce não tem permissão para criar esse recurso.');
                error.statusCode=401;
                error.statusMessage='Unauthorized';
                throw error;
            }

            const body = req.body;

            const chaveCriada = await ChaveService.criarChave(usuario, body.tipo, body.chave);
            res.statusCode=201;
            res.statusMessage='Created';
            res.type('application/json')
            res.json({
                Chave: chaveCriada
            });
        }
        catch (err: any) {
            next(err);
        }
    }

    static async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const chaves = await ChaveService.listarChaves();
            res.statusCode=200;
            res.statusMessage='Success';
            res.type('application/json')
            res.json({
                Chaves: chaves
            })
        }
        catch (err: any) {
            next(err);
        }
    }

    static async findById(req: Request, res: Response, next: NextFunction) {
        try {
            const chave = await ChaveService.listarChavePorId(req.params['id'] as unknown as number);

            res.statusCode=200;
            res.statusMessage='Success';
            res.type('application/json');
            res.json({
                Chave: chave
            })
        }
        catch (err: any) {
            next(err);
        }
    }

    static async deleteById(req: Request, res: Response, next: NextFunction) {
        try {
            const chave = await ChaveService.listarChavePorId(req.params['id'] as unknown as number);

            const token = res.locals.token;
            const tokenID: number  = token.id;
            const userID: number = chave.usuario.id;

            if (tokenID != userID) { // Usuario só pode deletar as chaves dele mesmo.
                const error: any = new Error('Voce não tem permissão para deletar esse recurso.');
                error.statusCode=401;
                error.statusMessage='Unauthorized';
                throw error;
            }

            await ChaveService.deletarChave(req.params['id'] as unknown as number);

            res.statusCode=204;
            res.statusMessage='No Content';
            res.json()
        }
        catch (err: any) {
            next(err);
        }
    }
}