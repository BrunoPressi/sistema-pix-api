import {NextFunction, Request, Response} from "express";
import {LoginService} from "../services/LoginService";
import {LoginDto} from "../dtos/LoginDto";
import { generateJwt } from "../utils/Jwt";

export class LoginController {
    static async auth(req: Request, res: Response, next: NextFunction) {
        try {
            const loginData: LoginDto = req.body;
            const usuario = await LoginService.auth(loginData.cpf_cnpj, loginData.senha);
            const token = generateJwt(usuario.id, usuario.nome_completo, usuario.numero_conta);
            res.type('application/json');
            res.statusCode=200;
            res.json({
                token: token
            })
        }
        catch (err:any ) {
            next(err);
        }
    }
}