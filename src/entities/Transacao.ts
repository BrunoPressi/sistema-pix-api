import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Chave} from "./Chave";

@Entity()
export class Transacao {

    @PrimaryGeneratedColumn()
    id!:number;

    @Column({
        nullable: false,
        type: 'date'
    })
    data!: Date;

    @Column({
        nullable: false,
        type: 'numeric'
    })
    valor!: number;

    @Column({
        nullable: true,
        type: 'varchar'
    })
    mensagem?: string;

    @ManyToOne(() => Chave, (chave: Chave) => chave.transacoesOrigem, {onDelete: "CASCADE"})
    chaveOrigem!: Chave;

    @ManyToOne(() => Chave, (chave: Chave) => chave.transacoesDestino, {onDelete: "CASCADE"})
    chaveDestino!: Chave;

    constructor() {}

}