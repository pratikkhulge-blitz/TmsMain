import { Request, Response } from "express";
import encryptionManager from "../helpers/crypto.helpers";
import { generateOTP } from "../helpers/otp.helpers";
import { sendMail } from "../helpers/mail.helpers";
import UserModel from "../models/user.models";
import DepartmentModel from "../models/department.models";
import OTP from "../models/otp.models";
import { UserDao } from "../dao/User.dao";
import AdminDAO from "../dao/Admin.dao";
// import { log } from "console";

export default class UserService {

    public static async signUpUser(req: Request, res: Response): Promise<void> {
        const { firstName, lastName, email, password, dateOfBirth, organisation_name } = req.body;

        try {
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                if (existingUser.organisationNames?.includes(organisation_name)) {
                    res.status(404).send({ message: "User already exists in the organization." });
                }
                else {
                    const organisation = await DepartmentModel.findOne({organisation_name})
                if (!organisation) {
                    res.status(404).send({ message: "No such department exists." });
                }else{
                    existingUser.organisationNames?.push(organisation_name);
                    await existingUser.save();
                    res.status(200).send({ success: true, message: "User added to another organization." });
                }
                }
            }
            else{
                const organisation = await DepartmentModel.findOne({organisation_name})
                if (!organisation) {
                    res.status(404).send({ message: "No such department exists." });
                }
                else{
                    const newUser = await UserService.createUser(email, password, firstName, lastName, dateOfBirth, organisation_name);
                    // console.log(newUser)
                    if(newUser){
                        res.status(200).send({ success: true, message: `User ${firstName} ${lastName}!  Registered Successfully` });
                    }
                    else{
                        // console.log("Error ********************");
                        
                    }
                }
            }
        } catch (error) {
            console.error("User signup error:", error);
            res.status(500).send({ message: "Internal server error." });
        }
    }

    public static async verifyUserEmail(req: Request, res: Response): Promise<void> {
        const { email, otp } = req.body;
        const user = await UserService.validateUserSignUp(email, otp);
        res.send(user);
    }

    
    public static async generateNewUserOTP(req: Request, res: Response): Promise<void> {
        const { email } = req.body;
        const user = await UserService.findUserByEmail(email);

        if (!user) {
            res.status(404).send({ success: false, message: "User not found" });
            return;
        }

        try {
            const now = new Date();
            const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

            let otpInfo = await OTP.findOne({ email, verified: false });

            let OTPcode: string;
            if (otpInfo && otpInfo.createdAt > fifteenMinutesAgo && otpInfo.code !== null) {
                OTPcode = otpInfo.code.toString();
            } else {
                if (otpInfo) {
                    // Mark the old OTP as expired
                    otpInfo.expired = true;
                    await otpInfo.save();
                }
                const newOTP = generateOTP();
                OTPcode = newOTP.toString();
                otpInfo = new OTP({
                    email,
                    code: newOTP,
                    expired: false,
                    verified: false
                });
                await otpInfo.save();
            }

            await sendMail({
                to: email,
                OTP: OTPcode,
            });

            res.send({ success: true, message: "OTP sent to user's email." });
        } catch (error) {
            console.error("Failed to generate or resend OTP:", error);
            res.status(500).send({ success: false, message: 'Failed to resend OTP. Please try again later.' });
        }
    }

    

    public static async loginUserOTP(req: Request, res: Response): Promise<void> {
        const { email } = req.body;
        const user = await UserService.findUserByEmail(email);

        if (!user) {
            res.status(404).send({ success: false, message: "User not found" });
            return;
        }

        try {
            const now = new Date();
            const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

            let otpInfo = await OTP.findOne({ email, verified: false });

            let OTPcode: string;
            if (otpInfo && otpInfo.createdAt > fifteenMinutesAgo && otpInfo.code !== null) {
                OTPcode = otpInfo.code.toString();
            } else {
                if (otpInfo) {
                    // Mark the old OTP as expired
                    otpInfo.expired = true;
                    await otpInfo.save();
                }
                const newOTP = generateOTP();
                OTPcode = newOTP.toString();
                otpInfo = new OTP({
                    email,
                    code: newOTP,
                    expired: false,
                    verified: false
                });
                await otpInfo.save();
            }

            await sendMail({
                to: email,
                OTP: OTPcode,
            });

            res.send({ success: true, message: "OTP sent to user's email." });
        } catch (error) {
            console.error("Failed to generate or resend OTP:", error);
            res.status(500).send({ success: false, message: 'Failed to send OTP. Please try again later.' });
        }
    }

    private static async createUser(email: string, password: string, firstName: string, lastName: string, dateOfBirth: Date, organisation_name: string): Promise<any> {
        try {
        const hashedPassword = await encryptionManager.encrypt(password);
        const newUser = await await UserModel.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            dateOfBirth,
            organisationNames: [organisation_name],
        });
        // console.log("newUser" , newUser);
        

        if (!newUser) {
            return { success: false, message: "Unable to sign up user" };
        }

        
            return { success: true, message: `Welcome ${firstName} ${lastName}! User Registered Successfully` };
        } catch (error) {
            console.error("User signup error:", error);
            return { success: false, message: "Unable to sign up user, Please try again later", error };
        }
    }

    private static async findUserByEmail(email: string): Promise<any> {
        const user = await UserModel.findOne({ email });
        return user;
    }

    

    private static async validateUserSignUp(email: string, otp: number): Promise<any> {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return { success: false, message: "User not found" };
        }

        const now = new Date();
        const otpInfo = await OTP.findOne({ email, expired: false, verified: false });
        if (!otpInfo || otpInfo.expired) {
            return { success: false, message: "Invalid or expired OTP" };
        }

        if (otpInfo.code != otp) {
            return { success: false, message: "Invalid OTP" };
        }

        try {
            // Set user's active status to true
            await UserModel.findByIdAndUpdate(user._id, { $set: { active: true } });

            // Mark OTP as verified
            otpInfo.verified = true;
            await otpInfo.save();

            // Update user's department if necessary
            if (user.department) {
                await DepartmentModel.updateOne(
                    { _id: user.department },
                    { $set: { "users.$[elem].active": true } },
                    { arrayFilters: [{ "elem.userId": user._id }] }
                );
            }

            return { success: true, message: "Email verified successfully" };
        } catch (error) {
            // console.error("Error verifying email:", error);
            return { success: false, message: "Failed to verify email. Please try again later." };
        }
    }


}
