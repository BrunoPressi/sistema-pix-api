import {AppDataSource} from "../database/AppDataSource";
import {Chave} from "../entities/Chave";
import {TipoChave} from "../entities/enums/TipoChave";
import {UsuarioService} from "./UsuarioService";

const ChaveRepository = AppDataSource.getRepository(Chave);

export class ChaveService {
    static async criarChave(usuarioID: number, chaveTipo: TipoChave, chaveReq: string) {
        const usuario = await UsuarioService.buscarUsuarioId(usuarioID);
        try {
            const chave: Chave = {
                chave: chaveReq,
                tipo: chaveTipo,
                usuario: usuario
            }
            return await ChaveRepository.save(chave);
        }
        catch (err: any) {
            if(err.code == 'ER_DUP_ENTRY' && err.errno == 1062) {
                const error: any = new Error(`Chave |${chaveReq}| já cadastrada.`);
                error.statusCode=409;
                error.statusMessage="Conflict";
                throw  error;
            }
            throw err;
        }
    }

    static async listarChaves() {
        return await ChaveRepository.find({
            relations: {
                usuario: true
            }
        });
    }

    static async listarChavePorId(id: number) {
        const chave = await ChaveRepository.findOne({
            where: {id},
            relations: ['usuario']
        });

        if (chave != null) {
            return chave;
        } else {
            const error: any = new Error('Chave não encontrada.');
            error.statusCode=404;
            error.statusMessage='Not Found';
            throw error;
        }
    }

    static async deletarChave(id: number) {
        const chave = await this.listarChavePorId(id);
        await ChaveRepository.delete(chave);
    }
}
