import {NextFunction, Request, Response, Router} from "express";
import UsuarioRoutes from "./UsuarioRoutes";
import { LoginRoutes } from "./LoginRoutes";
import {LogoutRoutes} from "./LogoutRoutes";
import {ChaveRoutes} from "./ChaveRoutes";

const routes = Router();

routes.use("/v1/usuarios", UsuarioRoutes);
routes.use('/v1/auth', LoginRoutes);
routes.use('/v1/logout', LogoutRoutes);
routes.use('/v1/chaves', ChaveRoutes)

routes.use((error: any, req: Request, res: Response, next: NextFunction) => {
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

export default routes;