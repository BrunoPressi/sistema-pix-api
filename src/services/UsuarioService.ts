import {AppDataSource} from "../database/AppDataSource";
import {Usuario} from "../entities/Usuario";
import bcrypt from 'bcrypt';

const UsuarioRepository = AppDataSource.getRepository(Usuario);

export class UsuarioService {
    static async buscarTodosUsuarios() {
        return await UsuarioRepository.find();
    }

    static async criarNovoUsuario(usuario: Usuario) {
        try {
            const senhaHash = await bcrypt.hash(usuario.senha, 10);
            usuario.senha = senhaHash;
            return await UsuarioRepository.save(usuario);
        }
        catch (err: any) {
            if(err.code == 'ER_DUP_ENTRY' && err.errno == 1062) {
                const error: any = new Error(`Usuário com cpf_cnpj |${usuario.cpf_cnpj}| já cadastrado.`);
                error.statusCode=409;
                error.statusMessage="Conflict";
                throw  error;
            }
            throw err;
        }
    }

    static async buscarUsuarioId(id: number) {
        const usuario = await UsuarioRepository.findOneBy({
            id: id
        });

        if (usuario != null) {
            return usuario;
        } else {
            const error:any = new Error(`Usuário |${id}| não encontrado.`);
            error.statusCode=404;
            error.statusMessage="Not Found";
            throw error;
        }
    }

    static async atualizarUsuario(usuarioNovo: Usuario, id: number) {
        const usuarioVelho = await this.buscarUsuarioId(id);
        usuarioVelho.telefone = usuarioNovo.telefone;
        usuarioVelho.senha = usuarioNovo.senha;
        usuarioVelho.rua = usuarioNovo.rua;
        usuarioVelho.bairro = usuarioNovo.bairro;
        usuarioVelho.cidade = usuarioNovo.cidade;

        return await UsuarioRepository.save(usuarioVelho);
    }

    static async deletarUsuario(id: number) {
        await this.buscarUsuarioId(id);
        await UsuarioRepository.delete(id);
    }

    static async buscarUsuarioPorCpfCnpj(cpf_cnpj: string) {
        const usuario = await UsuarioRepository.findOneBy({
            cpf_cnpj: cpf_cnpj
        })

        if (usuario != null) {
            return usuario;
        } else {
            const error:any = new Error(`Usuário |${cpf_cnpj}| não encontrado.`);
            error.statusCode=404;
            error.statusMessage="Not Found";
            throw error;
        }
    }
}