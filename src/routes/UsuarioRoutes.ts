import Router, {NextFunction, Request, Response} from 'express';
import {UsuarioController} from "../controllers/UsuarioController";
import {checkValidationResult, validatorRulesAtualizarUsuario, validatorRulesNovoUsuario} from "../validators/ValidatorRules";

const UsuarioRoutes = Router();

UsuarioRoutes.get("/", UsuarioController.findAll);
UsuarioRoutes.post("/", validatorRulesNovoUsuario, checkValidationResult, UsuarioController.create);
UsuarioRoutes.get("/:id", UsuarioController.findById);
UsuarioRoutes.patch("/:id", validatorRulesAtualizarUsuario, checkValidationResult, UsuarioController.patch);
UsuarioRoutes.delete("/:id", UsuarioController.delete)

UsuarioRoutes.use((error: any, req: Request, res: Response, next: NextFunction) => {
    res.statusCode=error.statusCode || 500;
    res.statusMessage=error.statusMessage || 'Internal Server Error';
    res.json({
        "timestamp": new Date(),
        "errorMessage": error.message || 'Erro Interno no Servidor',
        "path": req.originalUrl,
        "statusCode": res.statusCode,
        "statusMessage": res.statusMessage
    });
})

export default UsuarioRoutes;