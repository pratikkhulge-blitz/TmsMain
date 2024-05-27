import { generateOTP } from "../helpers/otp.helpers";
import { sendMail } from "../helpers/mail.helpers";
import Admin from "../models/admin.models";
import AdminDAO from "../dao/Admin.dao";
import OTP from "../models/otp.models";
import encryptionManager from "../helpers/crypto.helpers";

export class AdminService {
    // public static async signUpAdmin(email: string, password: string): Promise<any> {
    //     const isExisting = await AdminDAO.findAdminByEmail(email);

    //     if (isExisting) {
    //         return { message: "Admin already exists" };
    //     }

    //     try {
    //         const otpGenerated = generateOTP();
    //         const newAdmin = await Admin.create({
    //             email,
    //             password: await encryptionManager.encrypt(password),
    //         });

    //         if (!newAdmin) {
    //             return { success: false, message: "Unable to sign up admin" };
    //         }

    //         const newOTP = await OTP.create({
    //             userId: newAdmin._id,
    //             otps: [{ code: otpGenerated, createdAt: new Date() }],
    //         });

    //         if (!newOTP) {
    //             console.log({ success: false, message: "Unable to create OTP" });
    //             return { success: false, message: "Unable to create OTP" };
    //         }

    //         await sendMail({
    //             to: email,
    //             OTP: otpGenerated,
    //         });

    //         return { success: true, message: "Admin registered", data: newAdmin };
    //     } catch (error) {
    //         return { success: false, message: "Unable to create new admin", error: error };
    //     }
    // }

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
    

    // public static async verifyAdminEmail(email: string, otp: number): Promise<any> {
    //     const user = await AdminDAO.findAdminByEmail(email);
    //     if (!user) {
    //         return { success: false, message: "Admin not found" };
    //     }
    //     if(user.active == true){
    //         return {success:false , message:"Admin Already Verified"};
    //     }

    //     const otpInfo = await OTP.findOne({ userId: user._id });
    //     if (!otpInfo || !otpInfo.otps || otpInfo.otps.length === 0) {
    //         return { success: false, message: "No OTP found for this admin" };
    //     }
    
    //     // Sort OTPs array in descending order based on createdAt timestamp
    //     const sortedOTPs = otpInfo.otps.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    //     console.log(sortedOTPs);
        
    
    //     // Select the first (latest) OTP for verification
    //     const latestOTP = sortedOTPs[0];
    //     console.log(latestOTP);
        
    
    //     if (!latestOTP) {
    //         return { message: "OTP data is incomplete." };
    //     }

    //     const { code, createdAt } = latestOTP;
    //     console.log(code,otp);
        
    //     if (!code || !createdAt) {
    //         return { message: "OTP data is incomplete." };
    //     }

    //     const currentTime = new Date().getTime();
    //     const otpCreatedAt = new Date(createdAt).getTime();
    //     const timeDifference = currentTime - otpCreatedAt;

    //     if (code != otp || timeDifference > 60000) {
    //         return { success: false, message: "Invalid or expired OTP" };
    //     }

    //     // Mark OTP as verified
    //     await OTP.findByIdAndUpdate(otpInfo._id, {
    //         $set: { "otps.$[].verified": true },
    //     });

    //     // Update Admin to mark it as active
    //     const updatedAdmin = await Admin.findByIdAndUpdate(user._id, {
    //         $set: { active: true },
    //     });

    //     return { success: true, message: "Email verified successfully", updatedAdmin };
    // }


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
    

    // public static async generateNewAdminOTP(email: string): Promise<any> {
    //     const user = await AdminDAO.findAdminByEmail(email);
    //     if (!user) {
    //         return { success: false, message: "Admin not found" };
    //     }
    //     if(user.active == true){
    //         return {success:false , message:"Admin Already Verified"};
    //     }

    //     try {
    //         const newOTP = generateOTP();
    //         await OTP.findOneAndUpdate({ userId: user._id }, {
    //             $push: { otps: { code: newOTP, createdAt: new Date() } },
    //         });
    //         await sendMail({
    //             to: email,
    //             OTP: newOTP,
    //         });

    //         return { success: true, message: "New OTP generated and sent to admin's email." };
    //     } catch (error) {
    //         return { success: false, message: "Failed to send OTP. Please try again later." };
    //     }
    // }



    // public static async generateNewAdminOTP(email: string): Promise<any> {
    //     const user = await AdminDAO.findAdminByEmail(email);
    //     if (!user) {
    //         return { success: false, message: "Admin not found" };
    //     }
    //     if (user.active) {
    //         return { success: false, message: "Admin already verified" };
    //     }
    
    //     try {
    //         const newOTP = generateOTP();
    //         await OTP.create({
    //             email,
    //             code: newOTP,
    //             expired: false,
    //             verified: false
    //         });
    
    //         await sendMail({
    //             to: email,
    //             OTP: newOTP,
    //         });
    
    //         return { success: true, message: "New OTP generated and sent to admin's email." };
    //     } catch (error) {
    //         // console.error("Failed to send OTP:", error);
    //         return { success: false, message: "Failed to send OTP. Please try again later." };
    //     }
    // }


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
