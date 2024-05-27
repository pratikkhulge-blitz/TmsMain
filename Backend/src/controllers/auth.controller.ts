import { Request, Response } from "express";
import AuthService from "../services/auth.service";
import jwtService from "../helpers/jwt.helpers";
import User from "../models/user.models";

class AuthController {
  public static async adminLogin(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const { success, admin, message } = await AuthService.verifyAdminCredentials(email, password);

    if (success) {
      // Generate JWT token
      const token = jwtService.signToken({ email: admin.email, role: "admin" });
      res.setHeader('Authorization', `Bearer ${token}`);
      res.status(200).send({ success:true ,message: "Login successful.", token });
    } else {
      res.status(401).send({ message });
    }
  }

  public static async userLogin(req: Request, res: Response): Promise<void> {
    const { email, password, organisation_name } = req.body;
    const { success, user, message } = await AuthService.verifyUserCredentials(email, password, organisation_name);

    if (success) {
      // Generate JWT token
      const token = jwtService.signToken({ email: user.email, role: "user", organisation: organisation_name });
      res.setHeader('Authorization', `Bearer ${token}`);
      res.status(200).send({success:true , message: "Login successful.", token });
    } else {
      res.status(401).send({ message });
    }
  }

  public static async userLoginWithOtp(req: Request, res: Response){
    const { email, otp, organisation_name } = req.body;
    const { success, user, message } = await AuthService.verifyUserOTP(email, otp, organisation_name);

    if (success) {
      // Generate JWT token
      const token = jwtService.signToken({ email: user?.email, role: "user", organisation: organisation_name });
      res.setHeader('Authorization', `Bearer ${token}`);
      res.status(200).send({ success:true , message: "Login successful.", token });
    } else {
      res.status(401).send({ message });
    }
  }

    public static async AdminLoginWithOtp(req: Request, res: Response){
    const { email, otp, organisation_name } = req.body;
    const { success, user, message } = await AuthService.verifyAdminOTP(email, otp, organisation_name);

    if (success) {
      // Generate JWT token
      const token = jwtService.signToken({ email: user?.email, role: "admin" });
      res.setHeader('Authorization', `Bearer ${token}`);
      res.status(200).send({ success:true , message: "Login successful.", token });
    } else {
      res.status(401).send({ message });
    }
  }
}

export default AuthController;
