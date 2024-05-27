import { Request, Response } from "express";
import  UserService  from "../services/user.service";

class UserController {
    public static async signUpUser(req: Request, res: Response): Promise<void> {
        await UserService.signUpUser(req, res);
    }

    public static async verifyUserEmail(req: Request, res: Response): Promise<void> {
        await UserService.verifyUserEmail(req, res);
    }

    public static async generateNewUserOTP(req: Request, res: Response): Promise<void> {
        await UserService.generateNewUserOTP(req, res);
    }

    public static async loginUserOTP(req: Request, res: Response): Promise<void> {
        await UserService.loginUserOTP(req, res);
    }
}

export default UserController;

