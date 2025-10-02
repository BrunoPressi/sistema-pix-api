import Router from "express";
import { LogoutController } from "../controllers/LogoutController";
import {verifyJwt} from "../utils/Jwt";

export const LogoutRoutes = Router();

LogoutRoutes.post('/', verifyJwt, LogoutController.logout);