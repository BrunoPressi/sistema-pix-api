import {check, validationResult} from "express-validator";
import { cpf, cnpj } from "cpf-cnpj-validator";
import {NextFunction, Request, Response} from "express";

export const checkValidationResult = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    next();
}

export const validatorRulesNovoUsuario = [
    check('cpf_cnpj', 'Insira um CPF ou CNPJ válido.').notEmpty().custom((value) => {
        if (!cpf.isValid(value) || cnpj.isValid(value)) {
            throw new Error("Insira um CPF ou CNPJ válido");
        }
        return true;
    }),
    check('senha', 'Sua senha deve ter mais de 5 caracteres.').isLength({min: 5}),
    check('nome_completo', 'Seu nome deve ter mais de 3 caracteres.').isLength({min: 3}),
    check('telefone', 'Insira um telefone válido (somente números - 9 caracteres).').isLength({min: 9, max: 9}),
    check('rua', 'Campo rua não pode ser vázio.').notEmpty(),
    check('bairro', 'Campo bairro não pode ser vázio.').notEmpty(),
    check('cidade', 'Campo cidade não pode ser vázio.').notEmpty(),
]

export const validatorRulesAtualizarUsuario = [
    check('senha', 'Sua senha deve ter mais de 5 caracteres.').isLength({min: 5}),
    check('telefone', 'Insira um telefone válido (somente números - 9 caracteres).').isLength({min: 9, max: 9}),
    check('rua', 'Campo rua não pode ser vázio.').notEmpty(),
    check('bairro', 'Campo bairro não pode ser vázio.').notEmpty(),
    check('cidade', 'Campo cidade não pode ser vázio.').notEmpty(),
]