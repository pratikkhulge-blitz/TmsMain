import { Request, Response } from "express";
import { AdminService } from "../services/admin.service";
// import { log } from "console";

class AdminController {
    public static async signUp(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const result = await AdminService.signUpAdmin(email, password);
            return res.send(result);
        } catch (error) {
            // console.error("Error in signUpAdmin:", error);
            return res.status(500).send({ message: "Internal server error." });
        }
    }

    public static async verifyEmail(req: Request, res: Response): Promise<void> {
        try {
            const { email, otp } = req.body;
            // console.log(email, otp);

            const result = await AdminService.verifyAdminEmail(email, otp);
             res.send(result);
        } catch (error) {
            // console.error("Error in verifyAdminEmail:", error);
             res.status(500).send({ message: "Internal server error." });
        }
    }

    public static async generateOTP(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            const result = await AdminService.generateNewAdminOTP(email);
            res.send(result);
        } catch (error) {
            // console.error("Error in generateNewAdminOTP:", error);
            res.status(500).send({ message: "Internal server error." });
        }
    }
}

export default AdminController;
