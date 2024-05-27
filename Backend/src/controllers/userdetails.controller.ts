import { Request, Response } from "express";
import UserService from "../services/user.service";
import User from "../models/user.models";
import { generateOTP } from "../helpers/otp.helpers";
import { sendMail } from "../helpers/mail.helpers";
import OTP from "../models/otp.models";
import encryptionManager from "../helpers/crypto.helpers";
import { UserAuthorizer } from '../helpers/authuser.helpers';
import users from '../models/user.models'
import { Code } from "mongodb";

class UserDetails {
    private userAuthorizer: UserAuthorizer;

    constructor() {
        this.userAuthorizer = new UserAuthorizer();
    }

    // Arrow function to automatically bind `this`
    getuserdetails = async (req: Request, res: Response): Promise<void> => {
        try {
            // Authorize user
            const { authorized, email } = await this.userAuthorizer.authorizeUser(req, res);

            if (!authorized) {
                // console.log("success: false, message: 'Unauthorized: Only authenticated users can view tickets'");
                res.status(403).send({ success: false, message: 'Unauthorized: Only authenticated users can view tickets' });
                return;
            }

            const user = await users.findOne({ email: email });
            if(!user){
                res.status(403).send({ success: false, message: 'No user found' });
                return
            }

            const data = {firstname:user.firstName , lastname:user.lastName , email:user.email }
            // console.log(user.firstName);

            res.status(200).send({ success: true, message: "Successfully" , data});
        } catch (error: any) {
            res.status(500).json({ message: 'Failed to fetch Users', error: error.message });
        }
    };

    verifyOTPAndCommitChanges = async (req: Request, res: Response): Promise<void> => {
        const { email, newFirstName, newLastName, newPassword, otp } = req.body;
        // console.log(email, newFirstName, newLastName, newPassword, otp);
    
        try {
            const user = await User.findOne({ email });
    
            if (!user) {
                res.status(404).send({ success: false, message: "User not found" });
                return;
            }
    
            const otpInfo = await OTP.findOne({ email, verified: false });
            if (!otpInfo || otpInfo.expired) {
                res.status(400).send({ success: false, message: "Invalid or expired OTP" });
                return;
            }
    
            if (otpInfo.code != otp || otpInfo.expired) { 
                res.status(400).send({ success: false, message: "Invalid or expired OTP" });
                return;
            }
    
            if (newPassword) {
                const hashedNewPassword = await encryptionManager.encrypt(newPassword);
                await User.findByIdAndUpdate(user._id, { $set: { password: hashedNewPassword } });
            }
    
            await User.findByIdAndUpdate(user._id, { $set: { firstName: newFirstName, lastName: newLastName } });
    
            // Mark OTP as verified
            await OTP.findByIdAndUpdate(otpInfo._id, { $set: { verified: true } });
    
            res.status(200).send({ success: true, message: "User details updated successfully" });
        } catch (error) {
            // console.log("Error verifying OTP and committing changes:", error);
            res.status(500).send({ success: false, message: "Internal server error" });
        }
    };
    
}

export default UserDetails;
