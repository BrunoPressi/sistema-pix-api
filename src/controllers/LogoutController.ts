import {NextFunction, Request, Response} from "express";
import {LogoutService} from "../services/LogoutService";

export class LogoutController {
    static logout(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers['authorization']!.replace("Bearer ", "");
            LogoutService.logout(token);
            res.statusCode=200;
            res.json({});
        }
        catch (err: any) {
            next(err);
        }

    }
}