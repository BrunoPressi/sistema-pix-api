import {check, param, validationResult} from "express-validator";
import { cpf, cnpj } from "cpf-cnpj-validator";
import {NextFunction, Request, Response} from "express";
import {TipoChave} from "../entities/enums/TipoChave";

export const checkValidationResult = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    next();
}

export const validatorRulesNovoUsuario = [
    check('cpf_cnpj', 'Insira um CPF/CNPJ válido.').notEmpty().custom((value) => {
        if (!cpf.isValid(value) && !cnpj.isValid(value)) {
            throw new Error("Insira um CPF/CNPJ válido");
        }
        return true;
    }),
    check('senha', 'Sua senha deve ter mais de 5 caracteres.').isLength({min: 5}),
    check('nome_completo', 'Seu nome deve ter mais de 3 caracteres.').isLength({min: 3}),
    check('telefone', 'Insira um telefone válido.').isLength({min: 9, max: 11}),
    check('rua', 'Campo rua deve ter mais de 5 caracteres.').notEmpty().isLength({min:5, max: 30}),
    check('bairro', 'Campo bairro deve ter mais de 5 caracteres.').notEmpty().isLength({min:5, max: 30}),
    check('cidade', 'Campo cidade deve ter mais de 5 caracteres.').notEmpty().isLength({min:5, max: 30}),
];

export const validatorRulesAtualizarUsuario = [
    check('telefone', 'Insira um telefone válido.').isLength({min: 9, max: 11}),
    check('rua', 'Campo rua deve ter mais de 5 caracteres.').notEmpty(),
    check('bairro', 'Campo bairro deve ter mais de 5 caracteres.').notEmpty(),
    check('cidade', 'Campo cidade deve ter mais de 5 caracteres.').notEmpty(),
    param('id')
        .isNumeric()
        .withMessage('ID do usuário deve ser um número inteiro')
        .notEmpty()
        .withMessage('ID do usuário não pode estar vázio'),
];

export const validatorRulesNovaChave = [
    param('usuarioID')
        .isNumeric()
        .withMessage('ID do usuário deve ser um número inteiro')
        .notEmpty()
        .withMessage('ID do usuário não pode estar vázio'),

    check("tipo")
        .isIn(Object.values(TipoChave))
        .withMessage("Tipo de chave deve ser: email, telefone, cpf ou aleatoria.")
        .notEmpty()
        .withMessage("Campo tipo de chave não pode estar vázio."),

    check("chave")
        .notEmpty()
        .withMessage("Campo chave não pode estar vázio;")

];

export const validatorRulesNovaTransacao = [
    check('valor')
        .isNumeric()
        .custom((value) => {
           if(parseInt(value) <= 0) {
                throw new Error('O valor da transação deve ser maior que zero.')
           }
           return true;
        })
        .notEmpty()
        .withMessage('O valor da transação não pode estar vázio'),

    check('chaveOrigem')
        .notEmpty()
        .withMessage('Chave de origem não pode ser vazia.'),

    check('chaveDestino')
        .notEmpty()
        .withMessage('Chave de destino não pode ser vazia.')
        .custom((value, { req }) => {
            const chaveOrigem = req.body.chaveOrigem;

            if (value == chaveOrigem) {
                throw new Error('A chave de destino não pode ser igual a chave de origem.')
            }
            return true;
        })
]