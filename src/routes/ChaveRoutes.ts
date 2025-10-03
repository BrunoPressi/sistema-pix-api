import Router from "express";
import { ChaveController } from "../controllers/ChaveController";
import {checkValidationResult, validatorRulesNovaChave} from "../validators/ValidatorRules";
import {verifyJwt} from "../utils/Jwt";

export const ChaveRoutes = Router();

ChaveRoutes.post('/:usuarioID', verifyJwt, validatorRulesNovaChave, checkValidationResult, ChaveController.create);
ChaveRoutes.get('/', verifyJwt, ChaveController.findAll);
ChaveRoutes.get('/:id', verifyJwt, ChaveController.findById);
ChaveRoutes.delete('/:id', verifyJwt, ChaveController.deleteById);