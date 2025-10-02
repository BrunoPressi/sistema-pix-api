export class LoginDto{
    cpf_cnpj: string;
    senha: string;

    constructor(cpf_cnpj: string, senha:string) {
        this.cpf_cnpj = cpf_cnpj;
        this.senha = senha;
    }
}