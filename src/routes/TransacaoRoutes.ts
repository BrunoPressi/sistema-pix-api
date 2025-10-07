import Router from "express";
import {TransacaoController} from "../controllers/TransacaoController";
import {checkValidationResult, validatorRulesNovaTransacao} from "../validators/ValidatorRules";
import {verifyJwt} from "../utils/Jwt";

export const TransacaoRoutes = Router();

TransacaoRoutes.post('/', verifyJwt, validatorRulesNovaTransacao, checkValidationResult, TransacaoController.criarNovaTransacao);
TransacaoRoutes.get('/:id', verifyJwt, TransacaoController.buscarTransacaoPorId);
TransacaoRoutes.get('/', verifyJwt, TransacaoController.buscarTodasTransacoes);