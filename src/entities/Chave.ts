import {Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {TipoChave} from "./enums/TipoChave";
import {Usuario} from "./Usuario";

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
}