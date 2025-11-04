export class UsuarioPatchDTO {
    telefone: string;
    rua: string;
    bairro: string;
    cidade: string;

    constructor(telefone: string, rua:string, bairro: string, cidade: string) {
        this.telefone = telefone;
        this.rua = rua;
        this.bairro = bairro;
        this.cidade = cidade;
    }
}