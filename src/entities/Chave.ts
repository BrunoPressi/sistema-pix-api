import {Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {TipoChave} from "./enums/TipoChave";
import {Usuario} from "./Usuario";
import {Transacao} from "./Transacao";

@Entity()
export class Chave{

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: 'varchar',
        unique: true
    })
    chave!: string;

    @Column(
        {
            type: 'enum',
            enum: TipoChave
        }
    )
    tipo!: TipoChave;

    @ManyToOne(() => Usuario, (usuario) => usuario.chaves, {onDelete: "CASCADE"})
    usuario!: Usuario;

    @OneToMany(() => Transacao, (transacao) => transacao.chaveOrigem)
    transacoesOrigem!: Transacao[];

    @OneToMany(() => Transacao, (transacao) => transacao.chaveDestino)
    transacoesDestino!: Transacao[];

}