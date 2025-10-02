import {UsuarioService} from "./UsuarioService";
import bcrypt from "bcrypt";

export class LoginService {
    static async auth(cpf_cnpj: string, senha: string) {
        const usuario = await UsuarioService.buscarUsuarioPorCpfCnpj(cpf_cnpj);

        await checkPassword(usuario.senha, senha);

        return usuario;
    }

}

async function checkPassword(senhaBanco: string, senhaLogin: string) {
    const result = await bcrypt.compare(senhaLogin, senhaBanco);
    if (!result) {
        const error: any = new Error('Senhas não coincidem, tente novamente.');
        error.statusCode = 401;
        error.statusMessage = 'Unauthorized';
        throw error;
    }
    return true;
}
