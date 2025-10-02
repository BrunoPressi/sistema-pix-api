import Router from 'express';
import { LoginController } from "../controllers/LoginController";

export const LoginRoutes = Router();

LoginRoutes.post('/', LoginController.auth);