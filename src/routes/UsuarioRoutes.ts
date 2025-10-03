import Router from 'express';
import {UsuarioController} from "../controllers/UsuarioController";
import {checkValidationResult, validatorRulesAtualizarUsuario, validatorRulesNovoUsuario} from "../validators/ValidatorRules";
import {verifyJwt} from "../utils/Jwt";

const UsuarioRoutes = Router();

UsuarioRoutes.get("/", verifyJwt, UsuarioController.findAll);
UsuarioRoutes.post("/", validatorRulesNovoUsuario, checkValidationResult, UsuarioController.create);
UsuarioRoutes.get("/:id", verifyJwt, UsuarioController.findById);
UsuarioRoutes.patch("/:id", verifyJwt, validatorRulesAtualizarUsuario, checkValidationResult, UsuarioController.patch);
UsuarioRoutes.delete("/:id", verifyJwt, UsuarioController.delete)
UsuarioRoutes.get("/:id/chaves", verifyJwt, UsuarioController.findChaves)


export default UsuarioRoutes;