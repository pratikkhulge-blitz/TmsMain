import bcrypt from "bcrypt";
import jwtService from "../helpers/jwt.helpers";
import User from "../models/user.models";
import Admin from "../models/admin.models";
import AdminDAO from "../dao/Admin.dao"
import { AuthDao } from "../dao/Auth.dao"
import OTP from "../models/otp.models";


class AuthService {
  public static async verifyAdminCredentials(email: string, password: string): Promise<{ success: boolean, admin?: any, message?: string }> {
    try {
      // Find admin by email
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return { success: false, message: "No such admin found. Please sign up first." };
      }

      // Check if admin is verified
      // if (!admin.active) {
      //   return { success: false, message: "Admin not verified. Please verify your email first." };
      // }

      // Verify password
      const passwordMatch = await bcrypt.compare(password, admin.password);
      if (!passwordMatch) {
        return { success: false, message: "Incorrect email or password." };
      }

      return { success: true, admin };
    } catch (error) {
      // console.error("Admin authentication error:", error);
      return { success: false, message: "Internal server error." };
    }
  }

  public static async verifyUserCredentials(email: string, password: string, organisation_name: string): Promise<{ success: boolean, user?: any, message?: string }> {
    try {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return { success: false, message: "No such user found. Please sign up first." };
      }

      // Check if user is verified
      // if (!user.active) {
      //   return { success: false, message: "User not verified. Please verify your email first." };
      // }

      // Check if the user belongs to the selected organization
      if (!user || !user.organisationNames?.includes(organisation_name)) {
        return { success: false, message: "You are not a member of the selected organization." };
      }

      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return { success: false, message: "Incorrect email or password." };
      }

      return { success: true, user };
    } catch (error) {
      // console.error("User authentication error:", error);
      return { success: false, message: "Internal server error." };
    }
  }



  public static async verifyUserOTP(email: string, otp: number, organisation_name: string) {
    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return { success: false, message: "No such user found. Please sign up first." };
        }
        // if (!user.active) {
        //   return { success: false, message: "User not verified. Please verify your email first." };
        // }
        if (!user.organisationNames?.includes(organisation_name)) {
            return { success: false, message: "You are not a member of the selected organization." };
        }

        // Find OTP by email and if verified is false
        const now = new Date();
        const otpInfo = await OTP.findOne({ email, verified: false, expired: false });
        if (!otpInfo) {
            return { success: false, message: "Invalid or expired OTP" };
        }

        // Check if OTP matches and it's not expired
        if (otpInfo.code != otp || otpInfo.expired) {
            return { success: false, message: "Invalid or expired OTP" };
        }

        // Mark OTP as verified
        otpInfo.verified = true;
        await otpInfo.save();

        return { success: true, user };
    } catch (error) {
        // console.error("User OTP verification error:", error);
        return { success: false, message: "Internal server error." };
    }
}


  public static async verifyAdminOTP(email: string, otp: number, organisation_name: string) {
    try {
        // Find user by email
        const user = await Admin.findOne({ email });
        if (!user) {
            return { success: false, message: "No such Admin found" };
        }
        // if (!user.active) {
        //   return { success: false, message: "User not verified. Please verify your email first." };
        // }

        // Find OTP by email and if verified is false
        const now = new Date();
        const otpInfo = await OTP.findOne({ email, verified: false, expired: false });
        if (!otpInfo) {
            return { success: false, message: "Invalid or expired OTP" };
        }

        // Check if OTP matches and it's not expired
        if (otpInfo.code != otp || otpInfo.expired) {
            return { success: false, message: "Invalid or expired OTP" };
        }

        // Mark OTP as verified
        otpInfo.verified = true;
        await otpInfo.save();

        return { success: true, user };
    } catch (error) {
        // console.error("User OTP verification error:", error);
        return { success: false, message: "Internal server error." };
    }
}


}

export default AuthService;
