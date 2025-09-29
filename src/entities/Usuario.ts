import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Usuario {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
        unique: true,
        length: 14
    })
    cpf_cnpj: string;

    @Column({
        nullable: false,
        length: 90
    })
    nome_completo: string;

    @Column({
        nullable: false,
    })
    numero_conta: number;

    @Column({
        nullable: false,
        length: 9
    })
    telefone: string;

    @Column({
        nullable: false
    })
    rua: string;

    @Column({
        nullable: false
    })
    bairro: string;

    @Column({
        nullable: false
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