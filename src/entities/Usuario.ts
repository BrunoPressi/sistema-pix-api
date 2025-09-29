import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Usuario {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
        unique: true,
        length: 14,
        type: "varchar"
    })
    cpf_cnpj: string;

    @Column({
        nullable: false,
        length: 90,
        type: "varchar"
    })
    nome_completo: string;

    @Column({
        nullable: false,
        type: "integer"
    })
    numero_conta: number;

    @Column({
        nullable: false,
        length: 9,
        type: "varchar"
    })
    telefone: string;

    @Column({
        nullable: false,
        type: "varchar"
    })
    rua: string;

    @Column({
        nullable: false,
        type: "varchar"
    })
    bairro: string;

    @Column({
        nullable: false,
        type: "varchar"
    })
    cidade: string;

    constructor(id: number, nome_completo: string, cpf_cnpj: string, numero_conta: number, telefone: string, rua: string, bairro:string, cidade:string) {
        this.id = id;
        this.nome_completo = nome_completo;
        this.cpf_cnpj = cpf_cnpj;
        this.numero_conta = numero_conta;
        this.telefone = telefone;
        this.rua = rua;
        this.bairro = bairro;
        this.cidade = cidade;
    }
}