import {NextFunction, Request, Response} from "express";
import {TransacaoService} from "../services/TransacaoService";

export class TransacaoController{
    static async criarNovaTransacao(req: Request, res: Response, next: NextFunction) {
        try {
            const transacao = await TransacaoService.create(req.body);

            res.statusCode=201;
            res.statusMessage='Created';
            res.type('application/json');
            res.json({
               Transacao: transacao
            });
        }
        catch (err: any) {
            next(err);
        }
    }

    static async buscarTransacaoPorId(req: Request, res: Response, next: NextFunction) {
        try {
            const transacao = await TransacaoService.findById(req.params['id'] as unknown as number);
            res.statusCode=200;
            res.statusMessage='Success';
            res.type('application/json');
            res.json({
                Transacao: transacao
            });
        }
        catch (err: any) {
            next(err);
        }
    }

    static async buscarTodasTransacoes(req: Request, res: Response, next: NextFunction) {
        try {
            const transacoes = await TransacaoService.findAll();
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