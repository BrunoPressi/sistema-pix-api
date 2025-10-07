export class TransacaoCreateDto{
    valor!: number;
    chaveOrigem!: string;
    chaveDestino!: string;
    mensagem?: string;
}