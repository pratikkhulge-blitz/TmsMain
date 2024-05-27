import { generateOTP } from "../helpers/otp.helpers";
import { sendMail } from "../helpers/mail.helpers";
import Admin from "../models/admin.models";
import AdminDAO from "../dao/Admin.dao";
import OTP from "../models/otp.models";
import encryptionManager from "../helpers/crypto.helpers";

export class AdminService {

    public static async signUpAdmin(email: string, password: string): Promise<any> {
        const isExisting = await AdminDAO.findAdminByEmail(email);
    
        if (isExisting) {
            return { message: "Admin already exists" };
        }
    
        try {
            const otpGenerated = generateOTP();
            const newAdmin = await Admin.create({
                email,
                password: await encryptionManager.encrypt(password),
            });
    
            if (!newAdmin) {
                return { success: false, message: "Unable to sign up admin" };
            }
    
            const newOTP = await OTP.create({
                email,
                code: otpGenerated,
                expired: false,
                verified: false
            });
    
            if (!newOTP) {
                // console.log({ success: false, message: "Unable to create OTP" });
                return { success: false, message: "Unable to create OTP" };
            }
    
            await sendMail({
                to: email,
                OTP: otpGenerated,
            });
    
            return { success: true, message: "Admin registered", data: newAdmin };
        } catch (error) {
            return { success: false, message: "Unable to create new admin", error: error };
        }
    }
    

   

    public static async verifyAdminEmail(email: string, otp: number): Promise<any> {
        const user = await AdminDAO.findAdminByEmail(email);
        if (!user) {
            return { success: false, message: "Admin not found" };
        }
        if (user.active) {
            return { success: false, message: "Admin already verified" };
        }
    
        const otpInfo = await OTP.findOne({ email, verified: false });
        if (!otpInfo || otpInfo.expired) {
            return { success: false, message: "Invalid or expired OTP" };
        }
    
    
        if (otpInfo.code != otp || otpInfo.expired) { // 1 minute expiration window
            return { success: false, message: "Invalid or expired OTP" };
        }
    
        try {
            // Mark OTP as verified
            await OTP.findByIdAndUpdate(otpInfo._id, { $set: { verified: true } });
    
            // Update Admin to mark it as active
            const updatedAdmin = await Admin.findByIdAndUpdate(user._id, { $set: { active: true } }, { new: true });
    
            return { success: true, message: "Email verified successfully", updatedAdmin };
        } catch (error) {
            // console.error("Error verifying email:", error);
            return { success: false, message: "Failed to verify email. Please try again later." };
        }
    }
    

    public static async generateNewAdminOTP(email: string): Promise<any> {
        const user = await AdminDAO.findAdminByEmail(email);
        if (!user) {
            return { success: false, message: "Admin not found" };
        }
        // if (user.active) {
        //     return { success: false, message: "Admin already verified" };
        // }
    
        try {
            // Find the existing OTP for the admin
            const otpInfo = await OTP.findOne({ email, verified: false });
            if (otpInfo) {
                // Send the existing OTP to the admin's email
                if (otpInfo.code !== null) {
                    await sendMail({
                        to: email,
                        OTP: otpInfo.code.toString(),
                    });
    
                    return { success: true, message: "Existing OTP sent to admin's email." };
                } else {
                    return { success: false, message: "Existing OTP is invalid." };
                }
            } else {
                // Generate a new OTP
                const newOTP = generateOTP();
                await OTP.create({
                    email,
                    code: newOTP,
                    expired: false,
                    verified: false
                });
    
                // Send the new OTP to the admin's email
                await sendMail({
                    to: email,
                    OTP: newOTP.toString(),
                });
    
                return { success: true, message: "New OTP generated and sent to admin's email." };
            }
        } catch (error) {
            // console.error("Failed to send OTP:", error);
            return { success: false, message: "Failed to send OTP. Please try again later." };
        }
    }
    
    
}
