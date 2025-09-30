import { Router } from "express";
import UsuarioRoutes from "./UsuarioRoutes";

const routes = Router();

routes.use("/v1/usuarios", UsuarioRoutes);

export default routes;