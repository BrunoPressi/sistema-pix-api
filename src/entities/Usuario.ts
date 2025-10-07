import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Chave} from "./Chave";

@Entity()
export class Usuario {

    toJSON() {
        const {senha, ...only} = this;
        return only;
    }

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        nullable: false,
        unique: true,
        length: 14,
        type: "varchar"
    })
    cpf_cnpj!: string;

    @Column({
        nullable: false,
        type: "varchar"
    })
    senha!: string;

    @Column({
        nullable: false,
        length: 90,
        type: "varchar"
    })
    nome_completo!: string;

    @Column({
        nullable: false,
        type: "integer",
        unique: true
    })
    numero_conta!: number;

    @Column({
        nullable: false,
        length: 9,
        type: "varchar"
    })
    telefone!: string;

    @Column({
        nullable: false,
        type: "varchar"
    })
    rua!: string;

    @Column({
        nullable: false,
        type: "varchar"
    })
    bairro!: string;

    @Column({
        nullable: false,
        type: "varchar"
    })
    cidade!: string;

    @OneToMany(() => Chave, (chave) => chave.usuario)
    chaves!: Chave[];

}