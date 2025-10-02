import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {TipoChave} from "./enums/TipoChave";
import {Usuario} from "./Usuario";

@Entity()
export class Chave{

    @PrimaryGeneratedColumn()
    chave!: string;

    @Column(
        {
            type: 'enum',
            enum: TipoChave
        }
    )
    tipo!: TipoChave;

    @ManyToOne(() => Usuario, (usuario) => usuario.chaves)
    usuario!: Usuario;

}