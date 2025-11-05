import {AppDataSource} from "../database/AppDataSource";
import { TransacaoCreateDto } from "../dtos/TransacaoCreateDto";
import {Transacao} from "../entities/Transacao";
import {ChaveService} from "./ChaveService";

const TransacaoRepository = AppDataSource.getRepository(Transacao);

export class TransacaoService {
    static async create(transacaoCreateDto: TransacaoCreateDto) {
        try {
            const chaveOrigem = await ChaveService.verificarChaveExiste(transacaoCreateDto.chaveOrigem);
            const chaveDestino = await ChaveService.verificarChaveExiste(transacaoCreateDto.chaveDestino);

            const transacao = new Transacao();
            transacao.data = new Date();
            transacao.valor = transacaoCreateDto.valor;
            transacao.chaveOrigem = chaveOrigem!;
            transacao.chaveDestino = chaveDestino!;
            transacao.mensagem = transacaoCreateDto.mensagem;

            return await TransacaoRepository.save(transacao);
        }
        catch (err: any) {
            throw err;
        }
    }

    static async findById(id: number) {
        const transacao = await TransacaoRepository.findOne({
            where: {id},
            relations: ['chaveOrigem', 'chaveOrigem.usuario', 'chaveDestino', 'chaveDestino.usuario']
        });

        if (transacao != null) {
            return transacao;
        } else {
            const error: any = new Error('Transação não encontrada.');
            error.statusCode=404;
            error.statusMessage='Not Found';
            throw  error;
        }
    }

    static async findAll() {
        return await TransacaoRepository.find({
            relations: ['chaveOrigem', 'chaveOrigem.usuario', 'chaveDestino', 'chaveDestino.usuario']
        });
    }

    static async findTransacoesByUser(id: number, page: number, limit: number) {

        const skip = (page - 1) * limit;

        const [transacoes, total] = await TransacaoRepository.findAndCount({
            where: [
                { chaveOrigem: { usuario: { id: id } } },
                { chaveDestino: { usuario: { id: id } } }
            ],
            relations: ['chaveOrigem', 'chaveOrigem.usuario', 'chaveDestino', 'chaveDestino.usuario'],
            skip,
            take: limit,
            order: { id: "ASC" }
        });

        return [transacoes, total];
    }
}