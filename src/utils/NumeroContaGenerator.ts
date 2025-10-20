export default function generateAccountNumber(cpf_cnpj: string): number {
    var numeroConta: number = 0;
    var numeroContaFormatado: string = '';

    if (cpf_cnpj.match('^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}$')) {
        const cpfFormatado: number = parseInt(cpf_cnpj.replace(/[.\-]/g, ''));
        numeroConta = Math.floor(cpfFormatado / 10000);
        numeroConta.toString().slice(0, 4);
        numeroContaFormatado = numeroConta.toString().slice(0, 4);
    }

    if (cpf_cnpj.match('^[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2}$')) {
        const cnpjFormatado: number = parseInt(cpf_cnpj.replace(/[.\-\/]/g, ''));
        numeroConta = Math.floor(cnpjFormatado / 10000);
        numeroContaFormatado = numeroConta.toString().slice(0, 4);
    }

    numeroConta = parseInt(numeroContaFormatado);

    return numeroConta;
}